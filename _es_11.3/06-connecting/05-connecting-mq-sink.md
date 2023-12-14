---
title: "Running the MQ sink connector"
# permalink: /connecting/mq/sink/
excerpt: "Running MQ sink connector"
categories: connecting/mq
slug: sink
toc: true
---

You can use the {{site.data.reuse.kafka-connect-mq-sink-short}} to copy data from {{site.data.reuse.es_name}} or Apache Kafka into IBM MQ. The connector copies messages from a Kafka topic into a target MQ queue.

Kafka Connect can be run in standalone or distributed mode. This document contains steps for running the connector in distributed mode on a Kubernetes platform. In this mode, work balancing is automatic, scaling is dynamic, and tasks and data are fault-tolerant. For more details on the difference between standalone and distributed mode see the [explanation of Kafka Connect workers](../../connectors/#workers).

## Prerequisites

To follow these instructions, ensure you have [IBM MQ](https://www.ibm.com/docs/en/ibm-mq/8.0){:target="_blank"} v8 or later installed.

**Note:** These instructions are for [IBM MQ](https://www.ibm.com/docs/en/ibm-mq/9.3){:target="_blank"} v9 running on Linux. If you are using a different version or platform, you might have to adjust some steps slightly.

## Setting up the queue manager

You can set up a queue manager by using the local operating system to authenticate, or by using the IBM MQ Operator.

### By using local operating system to authenticate

These sample instructions set up an IBM MQ queue manager that uses its local operating system to authenticate the user ID and password. The user ID and password you provide must already be created on the operating system where IBM MQ is running.

1. Log in as a user authorized to administer IBM MQ, and ensure the MQ commands are on the path.
2. Create a queue manager with a TCP/IP listener on port 1414:
   ```crtmqm -p 1414 <queue_manager_name>```

   For example, to create a queue manager called `QM1`, use: `crtmqm -p 1414 QM1`
3. Start the queue manager:
   ```strmqm <queue_manager_name>```
4. Start the `runmqsc` tool to configure the queue manager:
   ```runmqsc <queue_manager_name>```
5. In `runmqsc`, create a server-connection channel:
   ```DEFINE CHANNEL(<channel_name>) CHLTYPE(SVRCONN)```
6. Set the channel authentication rules to accept connections requiring userid and password:
    1. `SET CHLAUTH(<channel_name>) TYPE(BLOCKUSER) USERLIST('nobody')`
    1. `SET CHLAUTH('*') TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(NOACCESS)`
    1. `SET CHLAUTH(<channel_name>) TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(CHANNEL) CHCKCLNT(REQUIRED)`

7. Set the identity of the client connections based on the supplied context (the user ID):
   ```ALTER AUTHINFO(SYSTEM.DEFAULT.AUTHINFO.IDPWOS) AUTHTYPE(IDPWOS) ADOPTCTX(YES)```
8. Refresh the connection authentication information:
   ```REFRESH SECURITY TYPE(CONNAUTH)```
9. Create a queue for the Kafka Connect connector to use:
   ```DEFINE QLOCAL(<queue_name>)```
10. Authorize the IBM MQ user ID to connect to and inquire the queue manager:
   ```SET AUTHREC OBJTYPE(QMGR) PRINCIPAL('<user_id>') AUTHADD(CONNECT,INQ)```
11. Authorize the IBM MQ user ID to use the queue:
   ```SET AUTHREC PROFILE(<queue_name>) OBJTYPE(QUEUE) PRINCIPAL('<user_id>') AUTHADD(ALLMQI)```
12. Stop the `runmqsc` tool by typing `END`.

For example, for a queue manager called `QM1`, with user ID `alice`, creating a server-connection channel called `MYSVRCONN` and a queue called `MYQSINK`, you run the following commands in `runmqsc`:

```bash
DEFINE CHANNEL(MYSVRCONN) CHLTYPE(SVRCONN)
SET CHLAUTH(MYSVRCONN) TYPE(BLOCKUSER) USERLIST('nobody')
SET CHLAUTH('*') TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(NOACCESS)
SET CHLAUTH(MYSVRCONN) TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(CHANNEL) CHCKCLNT(REQUIRED)
ALTER AUTHINFO(SYSTEM.DEFAULT.AUTHINFO.IDPWOS) AUTHTYPE(IDPWOS) ADOPTCTX(YES)
REFRESH SECURITY TYPE(CONNAUTH)
DEFINE QLOCAL(MYQSINK)
SET AUTHREC OBJTYPE(QMGR) PRINCIPAL('alice') AUTHADD(CONNECT,INQ)
SET AUTHREC PROFILE(MYQSINK) OBJTYPE(QUEUE) PRINCIPAL('alice') AUTHADD(ALLMQI)
END
```

The queue manager is now ready to accept connection from the connector and put messages on a queue.

### By using the IBM MQ Operator

You can also use IBM MQ Operator to set up a queue manager. For more information about installing the IBM MQ Operator and setting up a queue manager, see the [IBM MQ documentation](https://www.ibm.com/docs/en/ibm-mq/9.3?topic=miccpi-using-mq-in-cloud-pak-integration-red-hat-openshift){:target="_blank"}.

If you are using IBM MQ Operator to set up a queue manager, you can use the following yaml to create a queue manager with the required configuration:

1. Create a file called `custom-sink-mqsc-configmap.yaml` and copy the following YAML content to create the ConfigMap that has the details for creates a server-connection channel called `MYSVRCONN` and a queue called `MYQSINK`:

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
      name: custom-sink-mqsc
   data:
      sink.mqsc: |
            DEFINE CHANNEL(MYSVRCONN) CHLTYPE(SVRCONN)
            SET CHLAUTH(MYSVRCONN) TYPE(BLOCKUSER) USERLIST('nobody')
            SET CHLAUTH('*') TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(NOACCESS)
            SET CHLAUTH(MYSVRCONN) TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(CHANNEL) CHCKCLNT(REQUIRED)
            ALTER AUTHINFO(SYSTEM.DEFAULT.AUTHINFO.IDPWOS) AUTHTYPE(IDPWOS) ADOPTCTX(YES)
            REFRESH SECURITY TYPE(CONNAUTH)
            DEFINE QLOCAL(MYQSINK)
            SET AUTHREC OBJTYPE(QMGR) PRINCIPAL('alice') AUTHADD(CONNECT,INQ)
            SET AUTHREC PROFILE(MYQSINK) OBJTYPE(QUEUE) PRINCIPAL('alice') AUTHADD(ALLMQI)
   ```

1. Create the ConfigMap by using the following command:

   ```shell
   oc apply -f custom-sink-mqsc-configmap.yaml
   ```

1. To create a queue manager with the required configuration, update the `spec.queueManager` section of the `QueueManager` custom resource YAML file:

   ```yaml
   # ...
   queueManager:
      # ...
      mqsc:
      - configMap:
         name: custom-sink-mqsc
         items:
         - sink.mqsc
   ```

The queue manager is now ready to accept connection from the connector and put messages on a queue.

## Configuring the connector to connect to MQ

To connect to IBM MQ and to your {{site.data.reuse.es_name}} or Apache Kafka cluster, the connector requires configuration settings added to a `KafkaConnector` custom resource that represents the connector.

For IBM MQ connectors, you can generate the `KafkaConnector` custom resource YAML file from either the {{site.data.reuse.es_name}} UI or the CLI. You can also use the CLI to generate a JSON file, which you can use in distributed mode where you supply the connector configuration through REST API calls.

The connector connects to IBM MQ using a client connection. You must provide the following connection information for your queue manager (these configuration settings are added to the `spec.config` section of the `KafkaConnector` custom resource YAML):

* Comma-separated list of Kafka topics to pull events from.
* The name of the IBM MQ queue manager.
* The connection name (one or more host and port pairs).
* The channel name.
* The name of the sink IBM MQ queue.
* The user name and password if the queue manager is configured to require them for client connections.

### Using the UI

Use the {{site.data.reuse.es_name}} UI to generate and download the `KafkaConnector` custom resource YAML file for your IBM MQ sink connector.

1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Click **Toolbox** in the primary navigation and scroll to the **Connectors** section.
3. Go to the **Add connectors to your Kafka Connect environment** tile and click **{{site.data.reuse.kafka-connect-connecting-to-mq}}**
4. Ensure the **MQ Sink** tab is selected and click **Generate**.
5. In the dialog, enter the configuration of the `MQ Sink` connector.
6. Click **Download** to generate and download the configuration file with the supplied fields.
7. Open the downloaded configuration file and change the values of `mq.user.name` and `mq.password` to the username and password that you used to configure your instance of MQ. Also set the label `eventstreams.ibm.com/cluster` to the name of your Kafka Connect instance.

### Using the CLI

Use the {{site.data.reuse.es_name}} CLI to generate and download the `KafkaConnector` custom resource YAML file for your IBM MQ sink connector. You can also use the CLI to generate a JSON file for distributed mode.

1. {{site.data.reuse.es_cli_init_111}}
2. Run the following command to initialize the {{site.data.reuse.es_name}} CLI on the cluster:

   ```shell
   kubectl es init
   ```

3. Run the `connector-config-mq-sink` command to generate the configuration file for the `MQ Sink` connector.

   For example, to generate a configuration file for an instance of `MQ` with the following information: a queue manager called `QM1`, with a connection point of `localhost(1414)`, a channel name of `MYSVRCONN`, a queue of `MYQSINK` and connecting to the topics `TSINK`, run the following command:

   ```shell
   kubectl es connector-config-mq-sink --mq-queue-manager="QM1" --mq-connection-name-list="localhost(1414)" --mq-channel="MYSVRCONN" --mq-queue="MYQSINK" --topics="TSINK" --file="mq-sink" --format yaml
   ```

   **Note**: Omitting the `--format yaml` flag will generate a `mq-sink.properties` file which can be used for standalone mode. Specifying `--format json` will generate a `mq-sink.json` file which can be used for distributed mode outside {{site.data.reuse.openshift_short}}.
4. Change the values of `mq.user.name` and `mq.password` to the username and password that you used to configure your instance of MQ. Also set the label `eventstreams.ibm.com/cluster` to the name of your Kafka Connect instance.

The final configuration file will resemble the following:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaConnector
metadata:
  name: mq-sink
  labels:
    # The 'eventstreams.ibm.com/cluster' label identifies the KafkaConnect instance in which to create this connector. 
    # That KafkaConnect instance must have the 'eventstreams.ibm.com/use-connector-resources' annotation set to 'true'.
    eventstreams.ibm.com/cluster: <kafka_connect_name>
    backup.eventstreams.ibm.com/component: kafkaconnector
spec:
  class: com.ibm.eventstreams.connect.mqsink.MQSinkConnector
  tasksMax: 1
  config:
    topics: TSINK
    mq.queue.manager: QM1
    mq.connection.name.list: localhost(1414)
    mq.channel.name: MYSVRCONN
    mq.queue: MYQSINK
    mq.user.name: alice
    mq.password: passw0rd
    key.converter: org.apache.kafka.connect.storage.StringConverter
    value.converter: org.apache.kafka.connect.storage.StringConverter
    mq.message.builder: com.ibm.eventstreams.connect.mqsink.builders.DefaultMessageBuilder
```

A list of all the possible flags can be found by running the command `kubectl es connector-config-mq-sink --help`. For all available configuration options for IBM MQ sink connector, see [connecting to IBM MQ](../connecting-mq/#configuration-options).


## Downloading the MQ sink connector v2

Follow the instructions to download the MQ sink connector v2 from [IBM Fix Central](https://ibm.biz/ea-fix-central){:target="_blank"}.

1. Go to [IBM Fix Central](https://ibm.biz/ea-fix-central){:target="_blank"}. If you are on the **Select fixes** page, you can skip to step 6.
2. In the **Find Product > Product selector**, enter **IBM Event Automation**.
3. In the **Installed version**, select a specific version of {{site.data.reuse.ea_long}} or select **All** to list products in all the versions.
4. In the **Platform**, select **All**, and then click **Continue**.
5. In the **Identify Fixes** page, select **Browse for fixes**, and then click **Continue**. The available connectors are listed in the **Select fixes** page.
6. Select the MQ sink connector version you want to download and click **Continue**. For example, `kafka-connect-mq-sink-2.0.0`. The download page opens with the default download option.
7. In your preferred download option, click the connector (for example, `kafka-connect-mq-sink-2.0.0.jar`) to download the connector.

The connector JAR file is downloaded.

**Important:** To use the Kafka Connect Build capability for setting this connector, you must upload the JAR to a location that is accessible from the cluster, and provide the URL in the Kafka Connect custom resource.

## Configuring Kafka Connect

Set up your Kafka Connect environment as described in [setting up connectors](../../setting-up-connectors/). When adding connectors, add the MQ connector JAR you downloaded, [add connector dependencies](#adding-connector-dependencies), and when starting the connector, use the Kafka Connect YAML file you created earlier.

### Adding connector dependencies

By default, IBM MQ sink connector v2 does not package any external dependencies. Follow the instructions in [setting up connectors](../../setting-up-connectors/#specifying-connectors-in-your-kafka-connect-custom-resource) to add your dependencies.

Add the following dependencies to IBM MQ sink connector v2:

  artifactId | groupId  | version
--|---|---
  connect-api   | org.apache.kafka | >= 3.4.1
  connect-json  | org.apache.kafka | >= 3.4.1
  jackson-databind | com.fasterxml.jackson.core | >= 2.14.3
  javax.jms-api | javax.jms | >= 2.0.1
  com.ibm.mq.allclient | com.ibm.mq | >= 9.3.3.1
  slf4j-api | org.slf4j | >= 2.0.7
  jackson-databind | com.fasterxml.jackson.core | >= 2.14.3
  jackson-core | com.fasterxml.jackson.core | >= 2.14.3
  jackson-annotations | com.fasterxml.jackson.core | >= 2.14.3
  json | org.json | >= 20230618

### Verifying the log output

Verify the log output of Kafka Connect includes the following messages that indicate the connector task has started and successfully connected to IBM MQ:

``` shell
$ kubectl logs <kafka_connect_pod_name>
...
INFO Created connector mq-sink
...
INFO Connection to MQ established
...
```

## Send a test message

To test the connector you will need an application to produce events to your topic.

1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Click **Toolbox** in the primary navigation.
3. Go to the **Starter application** tile under **Applications**, and click **Get started**.
4. Click **Download JAR from GitHUb**. Download the JAR file from the list of assets for the latest release.
5. Click **Generate properties**.
6. Enter a name for the application.
7. Go to the **Existing topic** tab and select the topic you provided in the MQ connector configuration.
8. Click **Generate and download .zip**.
9. Follow the instructions in the UI to get the application running.

Verify the message is on the queue:

1. Navigate to the UI of the [sample application](../../../getting-started/generating-starter-app/) you generated earlier and start producing messages to {{site.data.reuse.es_name}}.
2. Use the `amqsget` sample to get messages from the MQ queue:

   ```shell
   /opt/mqm/samp/bin/amqsget <queue_name> <queue_manager_name>
   ```

   After a short delay, the messages are printed.

## Exactly-once message delivery semantics in IBM MQ sink connector v2

The IBM MQ sink connector v1 provides at-least-once message delivery by default. This means that each Kafka message is delivered to IBM MQ, but in failure scenarios it is possible to have duplicated messages delivered to IBM MQ.

IBM MQ sink connector v2 offers exactly-once message delivery semantics. An additional IBM MQ queue is used to store the state of message deliveries. When exactly-once delivery is enabled, Kafka messages are delivered to IBM MQ with no duplicated messages.

Follow the instructions to enable exactly-once delivery in the IBM MQ sink connector v2.

**Important**: Exactly-once support for sink connectors is only available in distributed mode.


### Prerequisites

Ensure the following values are set in your environment before you enable the exactly-once behavior:

* Configure the consumer group of the sink connector to ignore records in aborted transactions. You can find detailed instructions in the [Kafka documentation](https://kafka.apache.org/documentation/#connect_exactlyoncesink){:target="_blank"}. Notably, this configuration does not have any additional Access Control List (ACL) requirements.
* The IBM MQ sink connector v2 is only supported on Kafka Connect version 2.6.0 or later.
* On the server-connection channel (SVRCONN) used for Kafka Connect, set `HBINT` to 30 seconds to allow IBM MQ transaction rollbacks to occur more quickly in failure scenarios.
* On the [state queue](#creating-a-state-queue-in-ibm-mq-by-using-the-runmqsc-tool) (the queue where the state messages are stored), set `DEFSOPT` to `EXCL` to ensure the state queue share option is exclusive.
* Ensure that the messages that are sent through the MQ sink connector v2 do not expire, and that all the messages on the state queue are persistent.


### Enabling exactly-once delivery

Configure the following properties to enable exactly-once delivery:

* The IBM MQ sink connector v2 must be configured with the `mq.exactly.once.state.queue` property set to the name of a pre-configured IBM MQ queue on the same queue manager as the sink IBM MQ queue.

* Only a single connector task can be run. As a consequence, the `tasks.max` property must be left unset, or set to `1`.

* Ensure that the state queue is empty each time exactly-once delivery is enabled (especially when re-enabling the exactly-once feature). Otherwise, the connector behaves in the same way as when recovering from a failure state, and attempts to get undelivered messages recorded in the out-of-date state message.

After enabling exactly-once delivery, Kafka messages are delivered to IBM MQ with no duplicated messages.

#### Creating a state queue in IBM MQ by using the `runmqsc` tool

A state message is the message stored in the state queue, and contains the last offset information.
A state queue is a queue in IBM MQ that stores the last offset of the message transferred from Kafka to MQ. The last offset information is used to resume the transfer in case of a failure. When a failure occurs, the connector collects the information and continues to transfer messages from the point where the connector is interrupted.

Create a state queue as follows.

**Important:** Each connector instance must have its own state queue.

1. Start the `runmqsc` tool by running the following command:

   ```shell
   runmqsc <QMGR_NAME>
   ```

   Replace `<QMGR_NAME>` with the name of the queue manager you want to work with.

1. Enter the following command to create a queue:

   ```shell
   DEFINE QLOCAL (<STATE_QUEUE_NAME>) DEFSOPT (EXCL)
   ```

   Where:

   * `<STATE_QUEUE_NAME>` is the name of the state queue.
   * Set `DEFSOPT` to `EXCL` to ensure the state queue share option is exclusive.

   Wait for the queue to be created.

1. Stop the `runmqsc` tool by entering the command`END`.

**Note:** If the sink connector is delivering messages to an IBM MQ for z/OS shared queue, then for performance reasons, the state queue should be placed on the same coupling facility structure.

### Exactly-once failure scenarios

The IBM MQ sink connector is designed to fail on start-up in certain cases to ensure that exactly-once delivery is not compromised.
In some of these failure scenarios, it is necessary for an IBM MQ administrator to remove messages from the exactly-once state queue before the IBM MQ sink connector can start up and deliver messages from the sink queue again. In these cases, the IBM MQ sink connector has the `FAILED` status and the Kafka Connect logs describe any required administrative action.
