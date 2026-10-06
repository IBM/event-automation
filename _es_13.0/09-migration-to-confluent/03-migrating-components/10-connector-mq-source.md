---
title: "Migrating the IBM MQ source connector"
excerpt: "Migrate the IBM MQ source connector from Event Streams to Confluent Platform."
categories: connector-migration
slug: ibm-mq-source
toc: true
---

After you [migrate your Kafka Connect cluster](../../migration/connect-migration/) to Confluent Platform, you can migrate the IBM MQ source connector from {{site.data.reuse.es_name}} to Confluent for Kubernetes (CFK). The connector reads messages from an IBM MQ queue and writes them to a Kafka topic.

For general connector migration steps including how to stop the connector, extract the offset, and set the starting position on Confluent, see [migrating connectors](../../migration/connector-migration/).

## Migration paths
{: #migration-paths}

To migrate the IBM MQ source connector to Confluent Platform, you have the following two options:

| | Option A: Confluent connector | Option B: Same open-source JAR files |
|---|---|---|
| Connector | `confluentinc/kafka-connect-ibmmq` | IBM open-source from {{site.data.reuse.es_name}} |
| Class | `io.confluent.connect.ibm.mq.IbmMQSourceConnector` | `com.ibm.eventstreams.connect.mqsource.MQSourceConnector` |
| Support | Confluent (requires Confluent Platform license) | IBM (open-source only) |
| Offset continuity | The connector starts from the beginning of the MQ queue. Exactly-once mode tracks progress in a state topic in IBM MQ. | The connector starts from the beginning of the MQ queue. Exactly-once mode uses the Connect offset topic and an MQ state queue. |
| Configuration changes | Field names differ. See [configuration mapping](#option-a-config-mapping). | No changes required. Field names are identical. |

**Note:** The Confluent IBM MQ source connector is built and supported by Confluent, and is not the IBM open-source connector repackaged. If you keep the IBM open-source connector, support for the connector code comes from IBM only and does not extend to its integration with Confluent Platform.

## Option A: Confluent IBM MQ source connector
{: #option-a}

This section covers how to install and configure the Confluent-native IBM MQ source connector.

### Plugin packaging
{: #option-a-plugin-packaging}

The Confluent IBM MQ source connector is available on Confluent Hub as `confluentinc/kafka-connect-ibmmq`. It is a Confluent commercial connector that requires a Confluent Platform subscription after a 30-day evaluation period. For the full configuration reference, see [Confluent Hub: kafka-connect-ibmmq](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq){:target="_blank"}, the [connector overview](https://docs.confluent.io/kafka-connectors/ibmmq-source/current/overview.html){:target="_blank"}, and the [configuration reference](https://docs.confluent.io/kafka-connectors/ibmmq-source/current/source_connector_config.html){:target="_blank"}.

The connector does not bundle the IBM MQ client library, and does not start without it. To obtain `com.ibm.mq.allclient.jar`, follow the instructions in [download the IBM MQ client library JAR files](https://docs.confluent.io/kafka-connectors/ibmmq-source/current/overview.html#download-the-ibm-mq-client-library-jar-files){:target="_blank"}, then copy the file into the connector `lib` directory as shown in the following steps.

Complete the following steps to package the connector:

1. Add the following to your Dockerfile to install the connector and copy the IBM MQ client library:

   ```dockerfile
   FROM confluentinc/cp-server-connect:<cp-version>

   # Install the Confluent IBM MQ source connector
   RUN confluent-hub install --no-prompt confluentinc/kafka-connect-ibmmq:<version>

   # Copy the IBM MQ client library, which is required but not bundled in the Confluent Hub package.
   # Obtain com.ibm.mq.allclient.jar from your IBM MQ installation: <MQ_INSTALL>/java/lib/
   COPY com.ibm.mq.allclient.jar \
        /usr/share/confluent-hub-components/confluentinc-kafka-connect-ibmmq/lib/
   ```

   Where:
   - `<cp-version>` is the Confluent Platform version that matches your target deployment, available on [Docker Hub: confluentinc/cp-server-connect](https://hub.docker.com/r/confluentinc/cp-server-connect/tags){:target="_blank"}.
   - `<version>` is your required connector version, available on [Confluent Hub: kafka-connect-ibmmq](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq){:target="_blank"}.

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

The Confluent IBM MQ source connector uses different configuration field names. Review the full mapping before migrating.

**Connection and queue settings:**

| {{site.data.reuse.es_name}} field | Confluent field | Notes |
|-----------------------------------|-----------------|-------|
| `mq.queue.manager` | `mq.queue.manager` | Identical |
| `mq.connection.name.list` | `mq.hostname` and `mq.port` | Split into separate fields. For example, `mq-host(1414)` becomes `mq.hostname=mq-host` and `mq.port=1414` |
| `mq.connection.mode` | `mq.transport.type` | Values: `client` (default) or `bindings` |
| `mq.channel.name` | `mq.channel` | Renamed |
| `mq.queue` | `jms.destination.name` | Renamed |
| (none) | `jms.destination.type` | New required field: `queue` or `topic` |
| `mq.user.name` | `mq.username` | Renamed |
| `mq.password` | `mq.password` | Identical |
| `mq.user.authentication.mqcsp` | (none) | No equivalent. MQCSP is the default in the Confluent connector |
| `mq.ccdt.url` | (none) | `mq.ccdt.url` has no equivalent in the Confluent connector. If your CCDT file defines multiple channel entries for high availability failover or embeds TLS settings, you cannot express this configuration directly in the Confluent connector and must reconfigure the connection manually. For a single-broker setup, extract the hostname, port, and channel from the CCDT file and set them as `mq.hostname`, `mq.port`, and `mq.channel`. For multi-broker high availability, use `mq.connection.list` instead. Contact your MQ administrator to identify the correct values before migrating.|
| `topic` | `kafka.topic` | Renamed |



**Message handling:**

| {{site.data.reuse.es_name}} field | Confluent field | Notes |
|-----------------------------------|-----------------|-------|
| `mq.message.body.jms` | (none) | No equivalent. The Confluent source connector does not expose a message format property. Message body interpretation is determined by the converters |
| `mq.record.builder` | (none) | No equivalent. Use standard Kafka Connect converters |
| `mq.record.builder.key.header` | (none) | No equivalent |
| `mq.jms.properties.copy.to.kafka.headers` | (none) | No equivalent |
| `mq.message.mqmd.read` | (none) | No equivalent |
| `mq.message.receive.timeout` | (none) | No direct equivalent |
| `mq.batch.size` | `batch.size` | Renamed |
| `mq.poll.interval.ms` | `jms.receive.block.duration` | Semantics differ slightly. Sets maximum block time for JMS receive call in milliseconds |
| `mq.max.poll.blocked.time.ms` | (none) | No equivalent |
| `mq.client.reconnect.options` | (none) | No equivalent. The Confluent connector retries automatically for up to `max.retry.time` milliseconds |
| `mq.reconnect.delay.min.ms` | `max.retry.time` | Different model. Single maximum total retry time in milliseconds (default 1 hour) |
| `mq.reconnect.delay.max.ms` | (none) | No equivalent. Retry timing is governed by `max.retry.time` only |
| `mq.exactly.once.state.queue` | `state.topic.name` | Renamed. The Confluent source connector stores exactly-once delivery state in a JMS topic, not an MQ queue. Also requires `exactly.once.source.support=enabled` on the Connect worker |
| `key.converter` | `key.converter` | Identical |
| `value.converter` | `value.converter` | Identical |

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
| (none) | `mq.tls.keymanager.algorithm` | New field |
| (none) | `mq.tls.trustmanager.algorithm` | New field |

### Example Connector custom resource
{: #option-a-example}

The following example shows a CFK `Connector` custom resource for the Confluent IBM MQ source connector.

**Note:** All values in `spec.configs` must be strings. Boolean and numeric values must be quoted as strings.

```yaml
apiVersion: platform.confluent.io/v1beta1
kind: Connector
metadata:
  name: mq-source-connector
  namespace: <cp-namespace>
spec:
  class: io.confluent.connect.ibm.mq.IbmMQSourceConnector
  taskMax: 1
  connectClusterRef:
    name: connect
  configs:
    # MQ connection
    mq.hostname: "<mq-host>"
    mq.port: "1414"
    mq.queue.manager: "QM1"
    mq.channel: "KAFKA.CONN.SVRCONN"
    mq.username: "app"
    mq.password: "<password>"
    mq.transport.type: "client"

    # Source queue
    jms.destination.name: "KAFKA.SOURCE.QUEUE"
    jms.destination.type: "queue"

    # Kafka target topic
    kafka.topic: "MY.KAFKA.TOPIC"

    # Optional: message filtering
    # jms.message.selector: "JMSType = 'OrderMessage'"

    key.converter: "org.apache.kafka.connect.storage.StringConverter"
    value.converter: "org.apache.kafka.connect.storage.StringConverter"
```

## Option B: Same open-source IBM MQ connector JAR files
{: #option-b}

This section covers how to package the same open-source IBM MQ connector JAR files from {{site.data.reuse.es_name}} into your plugin image.

### Plugin packaging
{: #option-b-plugin-packaging}

Extract the IBM MQ source connector JAR files from your existing {{site.data.reuse.es_name}} Connect image, or download the open-source release from [GitHub: ibm-messaging/kafka-connect-mq-source](https://github.com/ibm-messaging/kafka-connect-mq-source/releases){:target="_blank"}.

Complete the following steps to package the connector:

1. Add the following to your Dockerfile to copy the JAR files into the plugin image:

   ```dockerfile
   FROM confluentinc/cp-server-connect:<cp-version>

   # Each connector must be in its own subdirectory under plugin.path.
   COPY kafka-connect-mq-source-<version>-jar-with-dependencies.jar \
        /opt/kafka/plugins/mq-source/
   ```

2. Ensure the `Connect` custom resource includes `/opt/kafka/plugins` in `plugin.path`:

   ```yaml
   configOverrides:
     server:
       - plugin.path=/usr/share/java,/usr/share/confluent-hub-components,/opt/kafka/plugins
   ```

### Configuration compatibility
{: #option-b-config-compatibility}

All configuration keys are identical to {{site.data.reuse.es_name}}. The only changes are the CFK custom resource structure and that all values must be quoted as strings. For the full configuration reference, see [GitHub: ibm-messaging/kafka-connect-mq-source](https://github.com/ibm-messaging/kafka-connect-mq-source#configuration){:target="_blank"}.

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

The following example shows a CFK `Connector` custom resource for the IBM open-source MQ source connector:

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
    # MQ connection
    mq.queue.manager: "QM1"
    mq.connection.name.list: "<mq-host>(1414)"
    mq.channel.name: "KAFKA.CONN.SVRCONN"
    mq.queue: "KAFKA.SOURCE.QUEUE"
    mq.user.name: "app"
    mq.password: "<password>"
    mq.user.authentication.mqcsp: "true"

    # Message handling
    mq.message.body.jms: "true"
    mq.record.builder: "com.ibm.eventstreams.connect.mqsource.builders.DefaultRecordBuilder"
    mq.jms.properties.copy.to.kafka.headers: "true"
    mq.message.mqmd.read: "true"
    mq.record.builder.key.header: "JMSCorrelationID"

    # Polling
    mq.batch.size: "250"
    mq.message.receive.timeout: "2000"
    mq.max.poll.blocked.time.ms: "2000"

    # Reconnection
    mq.client.reconnect.options: "ASDEF"
    mq.reconnect.delay.min.ms: "64"
    mq.reconnect.delay.max.ms: "8192"

    # Kafka target
    topic: "MY.KAFKA.TOPIC"
    key.converter: "org.apache.kafka.connect.storage.StringConverter"
    value.converter: "org.apache.kafka.connect.storage.StringConverter"

  connectClusterRef:
    name: connect
```

## Offset handling
{: #offset-handling}

Offset handling depends on which migration option you choose and which delivery mode you use. For steps about how to extract and inject offsets, see [connector offset handling](../../migration/connector-migration/#connector-offset-handling).

### Option A: Confluent connector offset behavior
{: #offset-option-a}

The Confluent IBM MQ source connector (`io.confluent.connect.ibm.mq.IbmMQSourceConnector`) delivers messages at least once by default, and does not record a resume position in the Kafka Connect offset topic. Its optional exactly-once mode tracks progress in a state topic that is created in IBM MQ, not in the Connect offset topic. For more information, see [delivery guarantee](https://docs.confluent.io/kafka-connectors/ibmmq-source/current/overview.html#delivery-guarantee){:target="_blank"} in the Confluent documentation.

There is therefore no offset to carry across from {{site.data.reuse.es_name}}. Point the Confluent connector at the same MQ queue. It reads whatever messages remain on the queue when the {{site.data.reuse.es_name}} connector was stopped, including any messages that the {{site.data.reuse.es_name}} connector read but did not confirm as committed to Kafka.

**Important:** Confirm that all downstream consumers have consumed all messages produced by the {{site.data.reuse.es_name}} connector before starting the Confluent IBM MQ source connector.

### Option B: Open-source connector offset behavior
{: #offset-option-b}

Offset handling when using the open-source IBM MQ source connector depends on the delivery mode:

- **Standard at-least-once delivery:** The connector relies on MQ transactional behavior. Messages are consumed in a JMS transaction and removed from the MQ queue only after Kafka acknowledges receipt. On restart, the connector reads from the beginning of the MQ queue, and any uncommitted messages remain on the queue and are redelivered. No offset injection or offset topic mirroring is required.
- **Exactly-once delivery:** The connector tracks progress in two places. It stores the sequence ID of the last committed batch in the Kafka Connect offset topic, and it holds the sequence ID and message IDs of in-flight messages in the MQ state queue that is set in `mq.exactly.once.state.queue`. Both must be preserved or migrated to maintain the exactly-once guarantee. For the full set of requirements, see [exactly-once message delivery semantics](https://github.com/ibm-messaging/kafka-connect-mq-source#exactly-once-message-delivery-semantics){:target="_blank"}.

Exactly-once delivery with the open-source connector also depends on settings that are not part of the `Connector` custom resource. Set `exactly.once.source.support` on the CFK `Connect` custom resource by using `spec.configOverrides.server`, run a single task, and retain the MQ state queue. For more information, see [exactly-once delivery requirements](../../migration/connector-migration/#exactly-once-requirements).

