---
title: "Migrating the IBM MQ sink connector"
excerpt: "Migrate the IBM MQ sink connector from Event Streams to Confluent Platform."
categories: connector-migration
slug: ibm-mq-sink
toc: true
---

After you [migrate your Kafka Connect cluster](../../migration/connect-migration/) to Confluent Platform, you can migrate the IBM MQ sink connector from {{site.data.reuse.es_name}} to Confluent for Kubernetes (CFK). The connector reads messages from a Kafka topic and writes them to an IBM MQ queue.

For general connector migration steps including how to stop the connector, ensure consumer lag is zero, and validate message delivery, see [migrating connectors](../../migration/connector-migration/).

## Migration paths
{: #migration-paths}

To migrate the IBM MQ sink connector to Confluent Platform, you have the following two options:

| | Option A: Confluent connector | Option B: Same open-source JAR files |
|---|---|---|
| Connector | `confluentinc/kafka-connect-ibmmq-sink` | IBM open-source from {{site.data.reuse.es_name}} |
| Class | `io.confluent.connect.jms.IbmMqSinkConnector` | `com.ibm.eventstreams.connect.mqsink.MQSinkConnector` |
| Support | Confluent (requires Confluent Platform license) | IBM (open-source only) |
| Offset continuity | Kafka consumer group synchronized by Cluster Linking | Kafka consumer group synchronized by Cluster Linking |
| Configuration changes | Field names differ. See [configuration mapping](#option-a-config-mapping). | No changes required. Field names are identical. |

**Note:** Sink connectors track their position by using Kafka consumer groups rather than the Connect offset storage topic. Cluster Linking synchronizes consumer group offsets automatically regardless of which option you use. For more information, see [sink connectors](../../migration/connector-migration/#sink-connectors).

## Option A: Confluent IBM MQ sink connector
{: #option-a}

This section covers how to install and configure the Confluent-native IBM MQ sink connector.

### Plugin packaging
{: #option-a-plugin-packaging}

The Confluent IBM MQ sink connector is available on Confluent Hub as `confluentinc/kafka-connect-ibmmq-sink`. It is a Confluent commercial connector that requires a Confluent Platform subscription after an evaluation period. For the licensing terms, the supported properties, and the prerequisites, see the [connector overview](https://docs.confluent.io/kafka-connectors/ibmmq-sink/current/overview.html){:target="_blank"} and the [configuration reference](https://docs.confluent.io/kafka-connectors/ibmmq-sink/current/sink_connector_config.html){:target="_blank"} in the Confluent documentation.

The connector does not bundle the IBM MQ client library, and does not start without it. To obtain `com.ibm.mq.allclient.jar`, follow the instructions in [install IBM MQ client library](https://docs.confluent.io/kafka-connectors/ibmmq-sink/current/overview.html#install-ibm-mq-client-library){:target="_blank"}, then copy the file into the connector `lib` directory as shown in the following steps.

Complete the following steps to package the connector:

1. Add the following to your Dockerfile to install the connector and copy the IBM MQ client library:

   ```dockerfile
   FROM confluentinc/cp-server-connect:<cp-version>

   # Install the Confluent IBM MQ sink connector
   RUN confluent-hub install --no-prompt confluentinc/kafka-connect-ibmmq-sink:<version>

   # Copy the IBM MQ client library, which is required but not bundled in the Confluent Hub package.
   COPY com.ibm.mq.allclient.jar \
        /usr/share/confluent-hub-components/confluentinc-kafka-connect-ibmmq-sink/lib/
   ```

   Where:
   - `<cp-version>` is the Confluent Platform version that matches your target deployment, available on [Docker Hub: confluentinc/cp-server-connect](https://hub.docker.com/r/confluentinc/cp-server-connect/tags){:target="_blank"}.
   - `<version>` is your required connector version, available on [Confluent Hub: kafka-connect-ibmmq-sink](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq-sink){:target="_blank"}.

2. The connector requires a Confluent license at runtime. Add the following to your `Connect` custom resource `configOverrides`:

   ```yaml
   configOverrides:
     server:
       - confluent.license=<your-license-key>
       - confluent.topic.bootstrap.servers=<kafka-bootstrap-endpoint>
   ```

   For a 30-day evaluation, leave `confluent.license` empty.

### Configuration mapping from {{site.data.reuse.es_name}} to Confluent connector
{: #option-a-config-mapping}

The Confluent IBM MQ sink connector uses different configuration field names. Review the full mapping before migrating.

**Connection and queue settings:**

| {{site.data.reuse.es_name}} field | Confluent field | Notes |
|-----------------------------------|-----------------|-------|
| `topics` | `topics` | Identical |
| `mq.queue.manager` | `mq.queue.manager` | Identical |
| `mq.connection.name.list` | `mq.hostname` and `mq.port` | Split into separate fields. For example, `mq-host(1414)` becomes `mq.hostname=mq-host` and `mq.port=1414` |
| `mq.connection.mode` | `mq.transport.type` | Values: `client` (default) or `bindings` |
| `mq.channel.name` | `mq.channel` | Renamed |
| `mq.queue` | `jms.destination.name` | Renamed |
| (none) | `jms.destination.type` | New required field: `queue` or `topic` |
| `mq.user.name` | `mq.username` | Renamed |
| `mq.password` | `mq.password` | Identical |
| `mq.user.authentication.mqcsp` | (none) | No equivalent. MQCSP is the default |
| `mq.ccdt.url` | (none) | `mq.ccdt.url` has no equivalent in the Confluent connector. If your CCDT file defines multiple channel entries for high availability failover or embeds TLS settings, you cannot express this configuration directly in the Confluent connector and must reconfigure the connection manually. For a single-broker setup, extract the hostname, port, and channel from the CCDT file and set them as `mq.hostname`, `mq.port`, and `mq.channel`. For multi-broker high availability, use `mq.connection.list` instead. Contact your MQ administrator to identify the correct values before migrating.|

**Message handling:**

| {{site.data.reuse.es_name}} field | Confluent field | Notes |
|-----------------------------------|-----------------|-------|
| `mq.message.builder` | (none) | No equivalent. Use `jms.message.format` to control output format |
| `mq.message.body.jms` | `jms.message.format` | Values: `string` (default), `json`, `avro`, or `bytes`. Use `string` or `json` for text-based messages |
| `mq.persistent` | `jms.producer.delivery.mode` | Values: `PERSISTENT` or `NON_PERSISTENT` |
| `mq.time.to.live` | `jms.producer.time.to.live.ms` | In milliseconds in both |
| `mq.retry.backoff.ms` | (none) | No direct equivalent. The Confluent connector uses a single `max.retry.time` total retry budget |
| `mq.retry.timeout.ms` | (none) | No equivalent |
| `mq.message.mqmd.write` | (none) | No equivalent in Confluent connector |
| `mq.message.mqmd.context` | (none) | No equivalent in Confluent connector |
| `mq.message.builder.key.header` | (none) | No equivalent |
| `mq.kafka.headers.copy.to.jms.properties` | `jms.forward.kafka.headers` | Renamed |
| `mq.message.builder.topic.property` | `jms.forward.kafka.metadata` | Different model. Forwards topic, partition, and offset as JMS properties |
| `mq.reply.queue` | (none) | No equivalent. Configure DLQ at the Connect framework level |
| `mq.exactly.once.state.queue` | `mq.offsets.queue.name` | Renamed. Enable with `exactly.once.enabled=true` |
| `key.converter` | `key.converter` | Identical |
| `value.converter` | `value.converter` | Identical |
| (none) | `jms.forward.kafka.key` | New field: forwards Kafka record key as JMS property |
| (none) | `mq.destination.suppress.rfh2` | New field: suppresses RFH2 header for non-JMS MQ clients |

**TLS settings:**

The Confluent connector uses `mq.tls.*` keys instead of `mq.ssl.*`.

| {{site.data.reuse.es_name}} field | Confluent field | Notes |
|-----------------------------------|-----------------|-------|
| `mq.ssl.cipher.suite` | `mq.ssl.cipher.suite` | Identical |
| `mq.ssl.peer.name` | `mq.ssl.peer.name` | Identical |
| `mq.ssl.keystore.location` | `mq.tls.keystore.location` | Renamed |
| `mq.ssl.keystore.password` | `mq.tls.keystore.password` | Renamed |
| `mq.ssl.truststore.location` | `mq.tls.truststore.location` | Renamed |
| `mq.ssl.truststore.password` | `mq.tls.truststore.password` | Renamed |
| `mq.ssl.use.ibm.cipher.mappings` | (none) | Configure by using JVM system properties on the Connect worker |
| (none) | `mq.tls.keystore.type` | New field: keystore type (default: `JKS`) |
| (none) | `mq.tls.truststore.type` | New field: truststore type (default: `JKS`) |
| (none) | `mq.tls.protocol` | New field: TLS protocol version |

### Example Connector custom resource
{: #option-a-example}

The following example shows a CFK `Connector` custom resource for the Confluent IBM MQ sink connector.

**Note:** All values in `spec.configs` must be strings. Boolean and numeric values must be quoted as strings.

```yaml
apiVersion: platform.confluent.io/v1beta1
kind: Connector
metadata:
  name: mq-sink-connector
  namespace: <cp-namespace>
spec:
  class: io.confluent.connect.jms.IbmMqSinkConnector
  taskMax: 1
  configs:
    # Kafka source topic(s)
    topics: "MY.KAFKA.TOPIC"

    # MQ connection
    mq.hostname: "<mq-host>"
    mq.port: "1414"
    mq.queue.manager: "QM1"
    mq.channel: "KAFKA.CONN.SVRCONN"
    mq.username: "app"
    mq.password: "<password>"
    mq.transport.type: "client"

    # Destination queue
    jms.destination.name: "KAFKA.SINK.QUEUE"
    jms.destination.type: "queue"

    # Message body format: string (default), json, avro, or bytes
    jms.message.format: "string"

    # Message delivery
    jms.producer.delivery.mode: "persistent"
    jms.producer.time.to.live.ms: "0"

    # Forward Kafka headers as JMS properties (optional)
    jms.forward.kafka.headers: "true"

    # Suppress RFH2 header for non-JMS MQ clients (optional)
    # mq.destination.suppress.rfh2: "true"

    # Exactly-once delivery (optional)
    # exactly.once.enabled: "true"
    # mq.offsets.queue.name: "KAFKA.OFFSETS"

    key.converter: "org.apache.kafka.connect.storage.StringConverter"
    value.converter: "org.apache.kafka.connect.storage.StringConverter"

  connectClusterRef:
    name: connect
```

**Note:** Before you set `exactly.once.enabled` to `true`, the queue that is specified in `mq.offsets.queue.name` must be created on the IBM MQ queue manager and dedicated to this connector. For the full set of requirements and limitations, see [exactly once semantics](https://docs.confluent.io/kafka-connectors/ibmmq-sink/current/overview.html#exactly-once-semantics){:target="_blank"} in the Confluent documentation.

## Option B: Same open-source IBM MQ connector JAR files
{: #option-b}

This section covers how to package the same open-source IBM MQ connector JAR files from {{site.data.reuse.es_name}} into your plugin image.

### Plugin packaging
{: #option-b-plugin-packaging}

Extract the IBM MQ sink connector JAR files from your existing {{site.data.reuse.es_name}} Connect image, or download the open-source release from [GitHub: ibm-messaging/kafka-connect-mq-sink](https://github.com/ibm-messaging/kafka-connect-mq-sink/releases){:target="_blank"}.

Complete the following steps to package the connector:

1. Add the following to your Dockerfile to copy the JAR files into the plugin image:

   ```dockerfile
   FROM confluentinc/cp-server-connect:<cp-version>

   # Each connector must be in its own subdirectory under plugin.path.
   COPY kafka-connect-mq-sink-<version>-jar-with-dependencies.jar \
        /opt/kafka/plugins/mq-sink/
   ```

2. Ensure the `Connect` custom resource includes `/opt/kafka/plugins` in `plugin.path`:

   ```yaml
   configOverrides:
     server:
       - plugin.path=/usr/share/java,/usr/share/confluent-hub-components,/opt/kafka/plugins
   ```

### Configuration compatibility
{: #option-b-config-reference}

All configuration keys are identical to {{site.data.reuse.es_name}}. The only changes are the CFK custom resource structure and that all values must be quoted as strings. For the full configuration reference, see [GitHub: ibm-messaging/kafka-connect-mq-sink](https://github.com/ibm-messaging/kafka-connect-mq-sink#configuration){:target="_blank"}.

The IBM open-source connector uses `mq.ssl.*` fields for TLS configuration:

| Field | Description |
|-------|-------------|
| `mq.ssl.cipher.suite` | Cipher suite name matching the MQ channel CipherSpec |
| `mq.ssl.peer.name` | Distinguished name pattern of the TLS peer |
| `mq.ssl.keystore.location` | Path to the JKS keystore for mutual TLS |
| `mq.ssl.keystore.password` | Password for the keystore |
| `mq.ssl.truststore.location` | Path to the JKS truststore |
| `mq.ssl.truststore.password` | Password for the truststore |
| `mq.ssl.use.ibm.cipher.mappings` | Set to `false` if the queue manager rejects the cipher suite name |

### Example Connector custom resource
{: #option-b-example}

The following example shows a CFK `Connector` custom resource for the IBM open-source MQ sink connector.

```yaml
apiVersion: platform.confluent.io/v1beta1
kind: Connector
metadata:
  name: mq-sink-connector
  namespace: <cp-namespace>
spec:
  class: com.ibm.eventstreams.connect.mqsink.MQSinkConnector
  taskMax: 1
  configs:
    # Kafka source topic(s)
    topics: "MY.KAFKA.TOPIC"

    # MQ connection
    mq.queue.manager: "QM1"
    mq.connection.name.list: "<mq-host>(1414)"
    mq.channel.name: "KAFKA.CONN.SVRCONN"
    mq.queue: "KAFKA.SINK.QUEUE"
    mq.user.name: "app"
    mq.password: "<password>"
    mq.user.authentication.mqcsp: "true"

    # Message builder
    mq.message.builder: "com.ibm.eventstreams.connect.mqsink.builders.DefaultMessageBuilder"
    mq.message.body.jms: "true"

    # Message delivery
    mq.persistent: "true"
    mq.time.to.live: "0"
    mq.retry.backoff.ms: "60000"

    # MQMD and headers
    mq.message.mqmd.write: "true"
    mq.message.mqmd.context: "ALL"
    mq.message.builder.key.header: "JMSCorrelationID"
    mq.kafka.headers.copy.to.jms.properties: "true"

    # Reply-to queue (optional)
    mq.reply.queue: "KAFKA.REPLY.QUEUE"

    key.converter: "org.apache.kafka.connect.storage.StringConverter"
    value.converter: "org.apache.kafka.connect.storage.StringConverter"

  connectClusterRef:
    name: connect
```

## Offset handling
{: #offset-handling}

Sink connectors track their read position in Kafka by using consumer groups, not the Connect offset storage topic.

If you are using Cluster Linking, ensure `consumer.offset.sync.enable: "true"` is set on the `ClusterLink` resource. Consumer group offsets are then synchronized automatically and no manual offset migration is required.

If you are using the IBM open-source MQ sink connector, offsets serve the following further purposes depending on your configuration:

- **Message metadata enrichment:** The connector can attach the source record's Kafka offset to the outgoing JMS message as a long property by using `mq.message.builder.offset.property`. This property takes effect only when `mq.message.body.jms` is also set to `true`.
- **Exactly-once delivery:** In exactly-once mode, the connector records the last committed offset in the MQ state queue that is set in `mq.exactly.once.state.queue`, and uses it to skip records that were already delivered (`record.kafkaOffset() <= lastCommittedOffset`). This queue must be preserved or recreated on the target deployment. For the full set of requirements, see [exactly-once message delivery semantics](https://github.com/ibm-messaging/kafka-connect-mq-sink#exactly-once-message-delivery-semantics){:target="_blank"}.
- **Flush tracking:** During `flush()`, the connector receives partition offset metadata to track its progress with the Kafka Connect framework. This requires no migration action.

**Important:** Before starting the new MQ sink connector, confirm that the consumer group has zero lag and that all messages processed by the {{site.data.reuse.es_name}} connector have been delivered to the MQ queue. For more information, see [ensuring the consuming application has processed all messages](../../migration/connect-migration/#verify-consumer-lag).
