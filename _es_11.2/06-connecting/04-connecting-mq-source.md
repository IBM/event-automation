---
title: "Running the MQ source connector"
# permalink: /connecting/mq/source/
excerpt: "Running MQ source connector"
categories: connecting/mq
slug: source
toc: true
---

You can use the {{site.data.reuse.kafka-connect-mq-source-short}} to copy data from IBM MQ into Apache Kafka. The connector copies messages from a source MQ queue to a target Kafka topic.

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

For example, for a queue manager called `QM1`, with user ID `alice`, creating a server-connection channel called `MYSVRCONN` and a queue called `MYQSOURCE`, you run the following commands in `runmqsc`:

```bash
DEFINE CHANNEL(MYSVRCONN) CHLTYPE(SVRCONN)
SET CHLAUTH(MYSVRCONN) TYPE(BLOCKUSER) USERLIST('nobody')
SET CHLAUTH('*') TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(NOACCESS)
SET CHLAUTH(MYSVRCONN) TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(CHANNEL) CHCKCLNT(REQUIRED)
ALTER AUTHINFO(SYSTEM.DEFAULT.AUTHINFO.IDPWOS) AUTHTYPE(IDPWOS) ADOPTCTX(YES)
REFRESH SECURITY TYPE(CONNAUTH)
DEFINE QLOCAL(MYQSOURCE)
SET AUTHREC OBJTYPE(QMGR) PRINCIPAL('alice') AUTHADD(CONNECT,INQ)
SET AUTHREC PROFILE(MYQSOURCE) OBJTYPE(QUEUE) PRINCIPAL('alice') AUTHADD(ALLMQI)
END
```

The queue manager is now ready to accept connection from the connector and get messages from a queue.

### By using the IBM MQ Operator

You can also use the IBM MQ Operator to set up a queue manager. For more information about installing the IBM MQ Operator and setting up a queue manager, see the [IBM MQ documentation](https://www.ibm.com/docs/en/ibm-mq/9.3?topic=miccpi-using-mq-in-cloud-pak-integration-red-hat-openshift){:target="_blank"}.

If you are using the IBM MQ Operator to set up a queue manager, you can use the following YAML file to create a queue manager with the required configuration:

1. Create a file called `custom-source-mqsc-configmap.yaml` and copy the following YAML content into the file to create the ConfigMap that has the details for creating a server connection channel called `MYSVRCONN` and a queue called `MYQSOURCE`:

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
      name: custom-source-mqsc
   data:
      source.mqsc: |
         DEFINE CHANNEL(MYSVRCONN) CHLTYPE(SVRCONN)
         SET CHLAUTH(MYSVRCONN) TYPE(BLOCKUSER) USERLIST('nobody')
         SET CHLAUTH('*') TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(NOACCESS)
         SET CHLAUTH(MYSVRCONN) TYPE(ADDRESSMAP) ADDRESS('*') USERSRC(CHANNEL) CHCKCLNT(REQUIRED)
         ALTER AUTHINFO(SYSTEM.DEFAULT.AUTHINFO.IDPWOS) AUTHTYPE(IDPWOS) ADOPTCTX(YES)
         REFRESH SECURITY TYPE(CONNAUTH)
         DEFINE QLOCAL(MYQSOURCE)
         SET AUTHREC OBJTYPE(QMGR) PRINCIPAL('alice') AUTHADD(CONNECT,INQ)
         SET AUTHREC PROFILE(MYQSOURCE) OBJTYPE(QUEUE) PRINCIPAL('alice') AUTHADD(ALLMQI)
   ```

1. Create the ConfigMap by using the following command:

   ```shell
   oc apply -f custom-source-mqsc-configmap.yaml
   ```

1. To create a queue manager with the required configuration, update the `spec.queueManager` section of the `QueueManager` custom resource YAML file:

   ```yaml
   # ...
   queueManager:
      # ...
      mqsc:
      - configMap:
         name: custom-source-mqsc
         items:
         - source.mqsc
   ```

The queue manager is now ready to accept connection from the connector and get messages from a queue.

## Configuring the connector to connect to MQ

To connect to IBM MQ and to your {{site.data.reuse.es_name}} or Apache Kafka cluster, the connector requires configuration settings added to a `KafkaConnector` custom resource that represents the connector.

For IBM MQ connectors, you can generate the `KafkaConnector` custom resource YAML file from either the {{site.data.reuse.es_name}} UI or the CLI. You can also use the CLI to generate a JSON file, which you can use in distributed mode where you supply the connector configuration through REST API calls.

The connector connects to IBM MQ using a client connection. You must provide the following connection information for your queue manager (these configuration settings are added to the `spec.config` section of the `KafkaConnector` custom resource YAML):

* The name of the target Kafka topic.
* The name of the IBM MQ queue manager.
* The connection name (one or more host and port pairs).
* The channel name.
* The name of the source IBM MQ queue.
* The user name and password if the queue manager is configured to require them for client connections.

### Using the UI

Use the {{site.data.reuse.es_name}} UI to generate and download the `KafkaConnector` custom resource YAML file for your IBM MQ source connector.

1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Click **Toolbox** in the primary navigation and scroll to the **Connectors** section.
3. Go to the **Add connectors to your Kafka Connect environment** tile and click **{{site.data.reuse.kafka-connect-connecting-to-mq}}**
4. Ensure the **MQ Source** tab is selected and click **Generate**.
5. In the dialog, enter the configuration of the `MQ Source` connector.
6. Click **Download** to generate and download the configuration file with the supplied fields.
7. Open the downloaded configuration file and change the values of `mq.user.name` and `mq.password` to the username and password that you used to configure your instance of MQ. Also set the label `eventstreams.ibm.com/cluster` to the name of your Kafka Connect instance.

### Using the CLI

Use the {{site.data.reuse.es_name}} CLI to generate and download the `KafkaConnector` custom resource YAML file for your IBM MQ source connector. You can also use the CLI to generate a JSON file for distributed mode.

1. {{site.data.reuse.es_cli_init_111}}
2. Run the `connector-config-mq-source` command to generate the configuration file for the `MQ Source` connector.\\
   For example, to generate a configuration file for an instance of `MQ` with the following information: a queue manager called `QM1`, with a connection point of `localhost(1414)`, a channel name of `MYSVRCONN`, a queue of `MYQSOURCE` and connecting to the topic `TSOURCE`, run the following command:

   ```shell
   kubectl es connector-config-mq-source --mq-queue-manager="QM1" --mq-connection-name-list="localhost(1414)" --mq-channel="MYSVRCONN" --mq-queue="MYQSOURCE" --topic="TSOURCE" --file="mq-source" --format yaml
   ```

   **Note**: Omitting the `--format yaml` flag will generate a `mq-source.properties` file which can be used for standalone mode. Specifying `--format json` will generate a `mq-source.json` file which can be used for distributed mode outside the Kubernetes platform.

3. Change the values of `mq.user.name` and `mq.password` to the username and password that you used to configure your instance of MQ. Also set the label `eventstreams.ibm.com/cluster` to the name of your Kafka Connect instance.

The final configuration file will resemble the following:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaConnector
metadata:
  name: mq-source
  labels:
    # The eventstreams.ibm.com/cluster label identifies the KafkaConnect instance
    # in which to create this connector. That KafkaConnect instance
    # must have the eventstreams.ibm.com/use-connector-resources annotation
    # set to true.
    eventstreams.ibm.com/cluster: <kafka_connect_name>
spec:
  class: com.ibm.eventstreams.connect.mqsource.MQSourceConnector
  tasksMax: 1
  config:
    topic: TSOURCE
    mq.queue.manager: QM1
    mq.connection.name.list: localhost(1414)
    mq.channel.name: MYSVRCONN
    mq.queue: MYQSOURCE
    mq.user.name: alice
    mq.password: passw0rd
    key.converter: org.apache.kafka.connect.storage.StringConverter
    value.converter: org.apache.kafka.connect.storage.StringConverter
    mq.record.builder: com.ibm.eventstreams.connect.mqsource.builders.DefaultRecordBuilder
```

A list of all the possible flags can be found by running the command `kubectl es connector-config-mq-source --help`. For all available configuration options for IBM MQ source connector, see [connecting to IBM MQ](../connecting-mq/#configuration-options).

### Downloading the MQ source connector v2

Follow the instructions to download the MQ source connector v2 from IBM Fix Central.

1. Go to [IBM Fix Central](https://ibm.biz/ea-fix-central){:target="_blank"}.
2. In the **Find Product > Product selector**, enter **IBM Event Automation**.
3. In the **Installed version**, select a specific version of {{site.data.reuse.ea_long}} or select **All** to list products in all the versions.
4. In the **Platform**, select **All**, and then click **Continue**.
5. In the **Identify Fixes** page, select **Browse for fixes**, and then click **Continue**. The available connectors are listed in the **Select fixes** page.
6. Select the MQ source connector version you want to download and click **Continue**. For example, `kafka-connect-mq-source-2.0.0`. The download page opens with the default download option.
7. In your preferred download option, click the connector (for example, `kafka-connect-mq-source-2.0.0.jar`) to download the connector.

The connector JAR file is downloaded.

**Important:** To use the Kafka Connect Build capability for setting this connector, you must upload the JAR to a location that is accessible from the cluster, and provide the URL in the Kafka Connect custom resource.

## Configuring Kafka Connect

Set up your Kafka Connect environment as described in [setting up connectors](../../setting-up-connectors/). When adding connectors, add the MQ connector JAR you downloaded, [add connector dependencies](#adding-connector-dependencies), and when starting the connector, use the Kafka Connect YAML file you created earlier.

### Adding connector dependencies

By default, IBM MQ source connector v2 does not package any external dependencies. Follow the instructions in [setting up connectors](../../setting-up-connectors/#specifying-connectors-in-your-kafka-connect-custom-resource) to add your dependencies.

Add the following dependencies to the IBM MQ source connector v2:


  artifactId | groupId  | version
--|---|---
  connect-api   | org.apache.kafka | >= 3.4.1
  connect-json  | org.apache.kafka | >= 3.4.1
  javax.jms-api | javax.jms | >= 2.0.1
  com.ibm.mq.allclient | com.ibm.mq | >= 9.3.3.1
  slf4j-api | org.slf4j | >= 2.0.7
  jackson-databind | com.fasterxml.jackson.core | >= 2.14.3
  json | org.json | >= 20230618

### Verifying the log output

Verify the log output of Kafka Connect includes the following messages that indicate the connector task has started and successfully connected to IBM MQ:

``` shell
$ kubectl logs <kafka_connect_pod_name>
...
INFO Created connector mq-source
...
INFO Connection to MQ established
...
```

## Send a test message

1. To add messages to the IBM MQ queue, run the `amqsput` sample and type in some messages:

   ```shell
   /opt/mqm/samp/bin/amqsput <queue_name> <queue_manager_name>
   ```

2. {{site.data.reuse.es_ui_login_nonadmin}}

3. Click **Topics** in the primary navigation and select the connected topic. Messages will appear in the message browser of that topic.

## Exactly-once message delivery semantics in IBM MQ source connector v2

The IBM MQ source connector v1 provides at-least-once message delivery by default. This means that each IBM MQ message is delivered to Kafka, but in failure scenarios, it is possible to have duplicated messages delivered to Kafka.

IBM MQ source connector v2 offers exactly-once message delivery semantics. An additional IBM MQ queue is used to store the state of message deliveries. When exactly-once delivery is enabled, all IBM MQ messages are delivered to Kafka with no duplicated messages.

**Note**:

- Exactly-once support for source connectors is only available in distributed mode; standalone Kafka Connect workers cannot provide exactly-once delivery semantics.
- Enabling exactly-once delivery in the IBM MQ source connector v2, results in extra interactions with IBM MQ and {{site.data.reuse.es_name}}, which reduces the throughput.


### Prerequisites

Ensure the following values are set in your environment before you enable the exactly-once behavior:

* When the MQ source connector v2 has been configured to deliver messages to Kafka with exactly-once semantics, ensure that the downstream consumers are only consuming transactionally committed messages. You can do this by setting the [`isolation.level`](https://kafka.apache.org/documentation/#consumerconfigs_isolation.level){:target="_blank"} configuration property to `read_committed`.
* The IBM MQ source connector must run on Kafka Connect version 3.3.0 or later and the `exactly.once.source.support` property must be set to `enabled` in the Kafka Connect worker configuration. For more information about the `exactly.once.source.support` setting, and the Access Control List (ACL) requirements for the worker nodes, see the [Apache Kafka documentation](https://kafka.apache.org/documentation/#connect_exactlyoncesource){:target="_blank"}.
* On the server-connection channel (SVRCONN) used for Kafka Connect, set `HBINT` to 30 seconds to allow IBM MQ transaction rollbacks to occur more quickly in failure scenarios.
* On the [state queue](#creating-a-state-queue-in-ibm-mq-by-using-the-runmqsc-tool) (the queue where the messages are stored), set `DEFSOPT` to `EXCL` to ensure the state queue share option is exclusive.
* Ensure that the messages that are sent through the MQ source connector v2 do not expire and are persistent.

### Enabling exactly-once delivery

Ensure you configure the following properties to enable exactly-once delivery:

* The IBM MQ source connector must have the state queue name configured in the `mq.exactly.once.state.queue` property. The value of the `mq.exactly.once.state.queue` property is the name of a pre-configured IBM MQ queue on the same queue manager as the source IBM MQ queue.

* If you are configuring the [`transaction.boundary`](https://kafka.apache.org/documentation/#sourceconnectorconfigs_transaction.boundary){:target="_blank"} property, the only permitted property value for the IBM MQ source connector is `poll` (the default value). The `poll` value in the `transaction.boundary` property ensures that the Kafka producer transactions are started and committed for each batch of records that are provided to Kafka by the IBM MQ source connector v2.

* Only a single connector task can run in the Kafka Connect instance. As a consequence, the `tasks.max` property must be set to `1` to ensure that failure scenarios do not cause duplicated messages to be delivered.

* Ensure that the IBM MQ source connector principal has a specific set of ACLs to be able to write transactionally to Kafka. See the [Kafka documentation](https://kafka.apache.org/documentation/#connect_exactlyoncesource){:target="_blank"} for the ACL requirements.

* Ensure that the state queue is empty each time exactly-once delivery is enabled (especially when re-enabling the exactly-once feature). Otherwise, the connector behaves in the same way as when recovering from a failure state, and attempts to get undelivered messages recorded in the out-of-date state message.

#### Creating a state queue in IBM MQ by using the `runmqsc` tool

A state message is the message stored in the state queue, and contains the last offset information.
A state queue is a queue in IBM MQ that stores the last offset of the message transferred from Kafka to MQ. The last offset information is used to resume the transfer in case of a failure. When a failure occurs, the connector collects the information and continues to transfer messages from the point where the connector is interrupted.

Create a state queue as follows.

**Important:** Each connector instance must have its own state queue.

1. Start the `runmqsc` tool by running the following command:

   ```shell
   runmqsc <queue_manager_name>
   ```

2. Enter the following command to create a queue:

   ```shell
   DEFINE QLOCAL (<STATE_QUEUE_NAME>) DEFSOPT (EXCL)
   ```

   Wait for the queue to be created.

3. Stop the `runmqsc` tool by entering the command`END`.

**Note:** If the source connector is consuming messages from an IBM MQ for z/OS shared queue, then for performance reasons, the state queue should be placed on the same coupling facility structure.

### Exactly-once failure scenarios

The IBM MQ source connector is designed to fail on start-up in certain cases to ensure that exactly-once delivery is not compromised.
In some of these failure scenarios, it will be necessary for an IBM MQ administrator to remove messages from the exactly-once state queue before the IBM MQ source connector can start up and deliver messages from the source queue again. In these cases, the IBM MQ source connector will have the `FAILED` status and the Kafka Connect logs will describe any required administrative action.

## Advanced configuration.

For all available configuration options for IBM MQ source connector, see [connecting to IBM MQ](../connecting-mq/#configuration-options).