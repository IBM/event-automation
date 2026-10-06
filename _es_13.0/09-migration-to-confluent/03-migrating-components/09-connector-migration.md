---
title: "Migrating connectors"
excerpt: "Migrate individual connector configuration and offsets from Event Streams to Confluent Platform."
categories: migration
slug: connector-migration
toc: true
---

After you [migrate your Kafka Connect cluster](../connect-migration/) to Confluent Platform, you can migrate your individual connectors from {{site.data.reuse.es_name}} to Confluent for Kubernetes (CFK) by creating each connector as a CFK `Connector` custom resource.

Review the following sections for information about migrating your connectors:

- [Migration paths](#migration-paths): Choose between migrating to the Confluent-native connector or continuing with the open-source connector JAR files.
- [Connector custom resource mapping](#connector-custom-resource-mapping): How `KafkaConnector` fields map to CFK `Connector` fields.
- [Connector offset handling](#connector-offset-handling): How offsets are handled for source and sink connectors under each migration option.
- [Plugin packaging for Confluent Platform](#plugin-packaging): How to package connector JAR files into a CFK-compatible Connect image.

## Before you begin
{: #before-you-begin}

Export all `KafkaConnector` custom resources from {{site.data.reuse.es_name}} by running the following command:

```bash
oc get kafkaconnectors -n <es-namespace> -o yaml > connectors-export.yaml
```

For each connector, record the following information:

- The connector class (`spec.class`)
- The task count (`spec.tasksMax`)
- The full `spec.config` map
- The name of the `KafkaConnect` cluster it belongs to (the `eventstreams.ibm.com/cluster` label under `metadata.labels`)

## Migration paths
{: #migration-paths}

To migrate connectors to Confluent Platform, you have the following two options:

### Option A: Migrate to the Confluent-native connector
{: #option-a-confluent-native}

Use the Confluent-native version of the connector published on [Confluent Hub](https://www.confluent.io/hub/){:target="_blank"}. Consider this option because:

- The connector is fully supported by Confluent.
- You do not carry a dependency on an IBM-packaged JAR file into a Confluent-managed cluster.
- Confluent-native connectors are tested and certified against the Confluent Platform version you are running.

The connector class name changes in this option, which means the offset key format also changes. You cannot resume from an existing {{site.data.reuse.es_name}} offset without explicitly injecting the starting offset before the new connector starts reading. For more information, see [connector offset handling](#connector-offset-handling).

For IBM MQ, Confluent publishes source and sink connectors on Confluent Hub. These are Confluent-built and Confluent-supported, not IBM connectors repackaged. The class names differ from the {{site.data.reuse.es_name}} connectors, so review the Confluent Hub documentation for the full configuration reference and confirm the available configuration fields before migrating:

- Source: [confluentinc/kafka-connect-ibmmq](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq){:target="_blank"}
- Sink: [confluentinc/kafka-connect-ibmmq-sink](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq-sink){:target="_blank"}

### Option B: Continue using the same open-source connector JAR files
{: #option-b-open-source}

Use this option to keep the same open-source connector JAR files from {{site.data.reuse.es_name}} and package them into a `cp-server-connect` image. The following apply when you use this option:

- The connector class name is unchanged.
- Connector configuration requires no field mapping.
- Offset and resumption behavior is preserved, provided that you reproduce the same connector and worker configuration on Confluent Platform. For example, when using standard at-least-once delivery, the IBM open-source MQ source connector relies on JMS queue transactions, so no offset topic migration is required. If running in exactly-once delivery mode, the connector tracks its sequence state in Kafka Connect offsets and an MQ state queue.

**Note:** If you are using IBM MQ connectors, the open-source versions are not officially supported by Confluent as part of Confluent Platform. Support for the connector code itself comes from IBM only and does not extend to the Confluent Platform integration.

**Important:** Exactly-once delivery depends on Kafka Connect worker settings that are not part of the `Connector` custom resource. If your {{site.data.reuse.es_name}} connector runs in exactly-once mode, you must reproduce these settings on the CFK `Connect` cluster. For more information, see [exactly-once delivery requirements](#exactly-once-requirements).

Use this option in any of the following situations:

- You want to minimize configuration changes and retain the same connector behavior.
- A Confluent-native equivalent is not available.
- You do not have a Confluent Platform license for the connector.

## Connector custom resource mapping
{: #connector-custom-resource-mapping}

The following table shows how `KafkaConnector` fields map to CFK `Connector` fields.

| `KafkaConnector` field | CFK `Connector` field | Notes |
|------------------------|-----------------------|-------|
| `spec.class` | `spec.class` | Same fully qualified class name. |
| `spec.tasksMax` | `spec.taskMax` | Same value. The field name differs (`tasksMax` vs `taskMax`). |
| `spec.config.*` | `spec.configs.*` | All configuration keys and values are identical. |
| `metadata.labels["eventstreams.ibm.com/cluster"]` | `spec.connectClusterRef.name` | Name of the CFK `Connect` custom resource. |
| `spec.autoRestart.enabled` | `spec.restartPolicy.type` | Set to `OnFailure` to restart failed tasks automatically, or `Never` to disable. |
| `spec.autoRestart.maxRestarts` | `spec.restartPolicy.maxRetry` | Maximum number of restart attempts when `restartPolicy.type` is `OnFailure`. |
| `spec.state` | No equivalent field | CFK has no `spec.state` field. Use the `platform.confluent.io/pause-connector` and `platform.confluent.io/resume-connector` annotations on the `Connector` custom resource instead. |

**Note:** Only `spec.class` and `spec.taskMax` are required in the CFK `Connector` custom resource.

**Note:** The connector name is taken from `metadata.name`, which must be a valid Kubernetes resource name. If the original connector name contains characters that Kubernetes does not allow, such as uppercase characters or dots, set the original name in the optional `spec.name` field instead. The name must match the original exactly for a connector to resume, because it determines offset continuity for source connectors and the consumer group name for sink connectors.

**Note:** All values in `spec.configs` must be strings. The CFK `Connector` custom resource validates that every entry in `configs` is a string type. Boolean and numeric values that Kafka Connect accepts as non-strings must be quoted in YAML. For example:

```yaml
# Correct: all values quoted as strings
configs:
  mq.message.body.jms: "true"        # boolean, quoted as a string
  mq.batch.size: "250"               # integer, quoted as a string
  mq.queue.manager: "QM1"            # string

# Incorrect: will fail custom resource validation
configs:
  mq.message.body.jms: true          # boolean, not allowed
  mq.batch.size: 250                 # integer, not allowed
```

### Examples
{: #examples}

The following examples use the IBM MQ source connector to show how a `KafkaConnector` custom resource from {{site.data.reuse.es_name}} translates to a CFK `Connector` custom resource for each migration option.

Both the Option A and Option B examples are based on the following source `KafkaConnector` custom resource:

```yaml
apiVersion: eventstreams.ibm.com/v1
kind: KafkaConnector
metadata:
  name: mq-source-connector
  labels:
    eventstreams.ibm.com/cluster: my-connect-cluster
spec:
  class: com.ibm.eventstreams.connect.mqsource.MQSourceConnector
  tasksMax: 1
  config:
    mq.queue.manager: QM1
    mq.connection.name.list: mq-host(1414)
    mq.channel.name: KAFKA.CONN.SVRCONN
    mq.queue: KAFKA.SOURCE.QUEUE
    mq.user.name: app
    mq.password: <password>
    topic: MY.KAFKA.TOPIC
    key.converter: org.apache.kafka.connect.storage.StringConverter
    value.converter: org.apache.kafka.connect.storage.StringConverter
```

#### Option A example: Confluent IBM MQ source connector
{: #example-option-a}

In this example, the class name changes to the Confluent-native class and some configuration field names also differ. Review the [Confluent Hub documentation](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq){:target="_blank"} for the full field reference. You can change the connector name because you inject the starting offset explicitly (see [connector offset handling](#connector-offset-handling)).

The following `Connector` custom resource shows the Confluent-native equivalent of the source `KafkaConnector` custom resource shown earlier:

```yaml
apiVersion: platform.confluent.io/v1beta1
kind: Connector
metadata:
  name: mq-source-connector
  namespace: <cp-namespace>
spec:
  class: io.confluent.connect.ibm.mq.IbmMQSourceConnector   # Confluent class name
  taskMax: 1
  connectClusterRef:
    name: connect
  configs:
    # MQ connection - single broker: mq.hostname + mq.port (replaces IBM's mq.connection.name.list: host(port))
    # For multiple brokers (HA/DR), use mq.connection.list: "host1:port1,host2:port2" instead
    mq.hostname: "mq-host"
    mq.port: "1414"
    mq.queue.manager: "QM1"
    mq.channel: "KAFKA.CONN.SVRCONN"
    # Confluent uses jms.destination.name/type instead of mq.queue
    jms.destination.name: "KAFKA.SOURCE.QUEUE"
    jms.destination.type: "queue"
    # Auth - Confluent uses mq.username instead of mq.user.name
    mq.username: "app"
    mq.password: "<password>"
    # Target topic - Confluent uses kafka.topic instead of topic
    kafka.topic: "MY.KAFKA.TOPIC"
    key.converter: "org.apache.kafka.connect.storage.StringConverter"
    value.converter: "org.apache.kafka.connect.storage.StringConverter"
```

**Note:** The Confluent connector also requires license properties, which you can set once on the `Connect` custom resource instead of in each connector. For more information, see [migrating the IBM MQ source connector](../connector-mq-source/#option-a-plugin-packaging).

**Important:** The examples show the MQ password inline for readability. In a production deployment, reference credentials from a mounted secret instead. For more information, see the CFK documentation about [managing connectors](https://docs.confluent.io/operator/current/co-manage-connectors.html){:target="_blank"}.

#### Option B example: Same open-source IBM MQ connector JAR files
{: #example-option-b}

In this example, the class name, connector name, and all configuration values remain the same as in {{site.data.reuse.es_name}}. All values must be quoted as strings to pass custom resource validation.

The following `Connector` custom resource uses the same open-source class and configuration as the source `KafkaConnector` custom resource shown earlier:

```yaml
apiVersion: platform.confluent.io/v1beta1
kind: Connector
metadata:
  name: mq-source-connector   # must match the name used on Event Streams for offset continuity
  namespace: <cp-namespace>
spec:
  class: com.ibm.eventstreams.connect.mqsource.MQSourceConnector
  taskMax: 1
  configs:
    mq.queue.manager: "QM1"
    mq.connection.name.list: "mq-host(1414)"
    mq.channel.name: "KAFKA.CONN.SVRCONN"
    mq.queue: "KAFKA.SOURCE.QUEUE"
    mq.user.name: "app"
    mq.password: "<password>"
    topic: "MY.KAFKA.TOPIC"
    key.converter: "org.apache.kafka.connect.storage.StringConverter"
    value.converter: "org.apache.kafka.connect.storage.StringConverter"
  connectClusterRef:
    name: connect
```

## Connector offset handling
{: #connector-offset-handling}

The way offsets are handled depends on the migration option you choose and whether your connector is a source or sink connector. The following sections use IBM MQ as an example to describe the behavior for each scenario.

### Source connectors
{: #source-connectors}

The following sections describe offset handling for source connectors under each migration option.

#### Option A: Confluent connector
{: #source-connectors-option-a}

For information about offset handling in the Confluent IBM MQ source connector, see [migrating the IBM MQ source connector](../connector-mq-source/#offset-handling) and the [Confluent connector documentation](https://docs.confluent.io/kafka-connectors/ibmmq-source/current/overview.html){:target="_blank"}.

For the IBM open-source MQ source connector running in standard at-least-once mode, there is no Kafka Connect source offset to migrate. The Confluent connector starts by consuming whatever is still on the MQ queue when the {{site.data.reuse.es_name}} connector was stopped. If exactly-once source support is enabled, the IBM connector uses Kafka Connect offset storage and additional MQ state, and the migration procedure is different.

**Important:** Confirm that all downstream consumers have consumed all messages produced by the {{site.data.reuse.es_name}} connector before you start the Confluent IBM MQ source connector. After the Confluent IBM MQ source connector begins writing new messages to the Kafka topic, consumers must be ready to handle them without gaps or duplicates relative to the previous sequence.

#### Option B: Same open-source connector
{: #source-connectors-option-b}

The IBM open-source MQ source connector's offset behavior depends on the configured delivery mode:

- **Standard at-least-once delivery:** The connector does not use the Kafka Connect offset topic to track message read position. It relies on MQ transactional behavior. Messages are consumed in a JMS transaction and removed from the MQ queue only after Kafka acknowledges receipt. On restart, the connector reads from the beginning of the MQ queue. Any uncommitted messages remain on the queue and are redelivered. No offset injection or offset topic mirroring is required.
- **Exactly-once delivery:** The connector relies on Kafka Connect offset storage to persist a `sequence-id` for each message batch, coordinated with an MQ state queue (`mq.exactly.once.state.queue`). To preserve exactly-once state during migration, you must migrate both the Connect offset topic and retain the MQ state queue. This mode also requires the worker settings described in [exactly-once delivery requirements](#exactly-once-requirements).

### Sink connectors
{: #sink-connectors}

Sink connectors read from Kafka and write to an external system. Kafka Connect tracks their read position by using consumer groups, not the Connect offset storage topic.

If you are using Cluster Linking, consumer group offsets are synchronized automatically when `consumer.offset.sync.enable: "true"` is set on the `ClusterLink` resource. No manual offset migration is required for sink connectors, as long as the connector name is unchanged and its consumer group is within the scope of the `consumer.offset.group.filters` configuration on the cluster link. Kafka Connect names a sink connector's consumer group `connect-<connector-name>`, so a renamed connector starts from a new, empty consumer group.

If you are using the IBM open-source MQ sink connector (`com.ibm.eventstreams.connect.mqsink.MQSinkConnector`), be aware that offsets are also used for the following purposes:

- **Offset metadata enrichment:** When `mq.message.builder.offset.property` is configured, the Kafka offset is attached as a long property to outgoing JMS messages. This property takes effect only when `mq.message.body.jms` is also set to `true`.
- **Exactly-once delivery:** When exactly-once delivery is configured (`mq.exactly.once.state.queue`), the connector reads the last committed offset from the MQ state queue, skips already-processed records (`record.kafkaOffset() <= lastCommittedOffset`), and commits updated offsets back to the MQ state queue.
- **Flush tracking:** During `flush()`, the connector receives partition offset metadata to track progress with the Connect framework.

### Exactly-once delivery requirements
{: #exactly-once-requirements}

Exactly-once delivery depends on Kafka Connect worker settings and on external system resources that are not part of the `Connector` custom resource, so they do not transfer when you create the connector on Confluent Platform. For the IBM open-source MQ source connector, this includes enabling `exactly.once.source.support` on the worker, which you set on the CFK `Connect` custom resource by using `spec.configOverrides.server`, running a single task, and retaining the MQ state queue.

Before you migrate a connector that runs in exactly-once mode, review the delivery requirements in your connector's documentation and confirm that the equivalent settings are in place on the CFK `Connect` cluster:

- [Migrating the IBM MQ source connector](../connector-mq-source/#offset-handling) and [migrating the IBM MQ sink connector](../connector-mq-sink/#offset-handling)
- [IBM MQ source connector: exactly-once message delivery semantics](https://github.com/ibm-messaging/kafka-connect-mq-source#exactly-once-message-delivery-semantics){:target="_blank"}
- [IBM MQ sink connector: exactly-once message delivery semantics](https://github.com/ibm-messaging/kafka-connect-mq-sink#exactly-once-message-delivery-semantics){:target="_blank"}

### Switching to a connector for a different external system
{: #migrating-different-system}

If you replace a connector with one that connects to a different external system, the offset format is not compatible and the existing offset topic cannot be reused because they are specific to the original connector class and system. Treat the new connector as a fresh deployment and complete the following steps:

1. Ensure that all messages produced by the {{site.data.reuse.es_name}} connector have been fully consumed downstream before the new connector starts writing to the same topic.
2. Do not reuse or inject an offset from the {{site.data.reuse.es_name}} connector. Treat the new connector as starting fresh.
3. Determine the correct starting point for the new connector:
   - For source connectors, start from the earliest unprocessed record in the source system.
   - For sink connectors, set the consumer group offset to the end of the Kafka topic, or to the position that corresponds to the last successfully written record in the target system.

## Plugin packaging for Confluent Platform
{: #plugin-packaging}

When migrating connectors to Confluent Platform, you must package the plugin JAR files into a `cp-server-connect` base Connect image. The packaging method depends on which migration option you chose. For general image build instructions, see [plugin image](../connect-migration/#plugin-image).

**Important:** Do not use the {{site.data.reuse.es_name}} `KafkaConnect` container image directly with the CFK `Connect` custom resource. The {{site.data.reuse.es_name}} image uses a different base image, entrypoint, and directory layout from `cp-server-connect`. The Confluent Operator cannot start a `Connect` cluster that uses a `KafkaConnect`-based image.

### Adding Confluent Hub connector plugins to the image
{: #confluent-hub-connectors}

If you chose [option A](#option-a-confluent-native), install the Confluent-native connector from Confluent Hub into your Connect image.

Confluent Hub hosts connectors for a wide range of systems, built and supported by Confluent or the connector vendor. For the full catalogue and documentation, see [Confluent Hub](https://www.confluent.io/hub){:target="_blank"}.

**Note:** Support for Confluent Hub connectors comes from Confluent or the connector vendor, not IBM, regardless of which system the connector integrates with.

Add the following to your Dockerfile to install the required Confluent Hub connector plugins into your Connect image. This example installs the IBM MQ source and sink connectors:

```dockerfile
FROM confluentinc/cp-server-connect:<cp-version>

RUN confluent-hub install --no-prompt confluentinc/kafka-connect-ibmmq:<source-version> \
    && confluent-hub install --no-prompt confluentinc/kafka-connect-ibmmq-sink:<sink-version>
```

Where:
- `<cp-version>` is the Confluent Platform version that matches your target deployment, available on [Docker Hub: confluentinc/cp-server-connect](https://hub.docker.com/r/confluentinc/cp-server-connect/tags){:target="_blank"}.
- `<source-version>` is your required version of the IBM MQ source connector, available on [Confluent Hub: kafka-connect-ibmmq](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq){:target="_blank"}.
- `<sink-version>` is your required version of the IBM MQ sink connector, available on [Confluent Hub: kafka-connect-ibmmq-sink](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq-sink){:target="_blank"}.

Some Confluent Hub connectors require additional client libraries that are not bundled in the package and must be obtained separately. For example, the IBM MQ connector requires the IBM MQ client JAR file. See the individual connector page on Confluent Hub for dependency requirements.

### Adding existing connector JAR files to the image
{: #reusing-open-source-jars}

If you chose [option B](#option-b-open-source), package the same open-source connector JAR files from {{site.data.reuse.es_name}} into your Connect image.

Complete the following steps to build the Connect image:

1. Add the following to your Dockerfile to copy the connector JAR files into the Connect image:

   ```dockerfile
   FROM confluentinc/cp-server-connect:<cp-version>

   # Copy the connector JAR files into the plugins directory.
   # Each connector must be in its own subdirectory under plugin.path.
   COPY ./kafka-connect-mq-source-<version>-jar-with-dependencies.jar \
        /opt/kafka/plugins/mq-source/
   COPY ./kafka-connect-mq-sink-<version>-jar-with-dependencies.jar \
        /opt/kafka/plugins/mq-sink/
   COPY ./com.ibm.mq.allclient.jar /opt/kafka/plugins/mq-source/
   COPY ./com.ibm.mq.allclient.jar /opt/kafka/plugins/mq-sink/
   ```

2. Ensure `plugin.path` in the `Connect` custom resource `configOverrides` includes `/opt/kafka/plugins`:

   ```yaml
   configOverrides:
     server:
       - plugin.path=/usr/share/java,/usr/share/confluent-hub-components,/opt/kafka/plugins
   ```

### Other connectors
{: #other-connectors}

If your connector is not available on Confluent Hub and does not have a Confluent-native equivalent, neither [option A](#option-a-confluent-native) nor [option B](#option-b-open-source) applies directly. In this case, obtain the connector JAR files from the connector's release page or build from source, then copy them into the image by using the same pattern as described in [adding existing connector JAR files to the image](#reusing-open-source-jars). Ensure each connector's JAR file and all its dependencies are placed in a dedicated subdirectory under `plugin.path`.

