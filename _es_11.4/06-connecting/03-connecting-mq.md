---
title: "Connecting to IBM MQ"
excerpt: "Connecting to MQ."
categories: connecting
slug: mq
toc: true
---

You can set up connections between IBM MQ and Apache Kafka or {{site.data.reuse.es_name}} systems.


## Available connectors

Connectors are available for copying data in both directions.

 - [{{site.data.reuse.kafka-connect-mq-source}}](../mq/source/):

    You can use the {{site.data.reuse.kafka-connect-mq-source-short}} to copy data from IBM MQ into {{site.data.reuse.es_name}} or Apache Kafka. The connector copies messages from a source MQ queue to a target Kafka topic.

    **Note:** The [IBM MQ source connector v2]({{ 'connectors/kc-source-ibm-mq2/installation' | relative_url}}), which is built on the IBM MQ source connector v1, offers additional features such as [exactly-once delivery](../mq/source/#exactly-once-message-delivery-semantics-in-ibm-mq-source-connector-v2) of data from IBM MQ into {{site.data.reuse.es_name}} or Apache Kafka.
 - [{{site.data.reuse.kafka-connect-mq-sink}}](../mq/sink/):

    You can use the {{site.data.reuse.kafka-connect-mq-sink-short}} to copy data from {{site.data.reuse.es_name}} or Apache Kafka into IBM MQ. The connector copies messages from a Kafka topic into a MQ queue.

    **Note:** The [IBM MQ sink connector v2]({{ 'connectors/kc-sink-ibm-mq2/installation' | relative_url}}), which is built on the IBM MQ sink connector v1, offers additional features such as [exactly-once delivery](../mq/sink/#exactly-once-message-delivery-semantics-in-ibm-mq-sink-connector-v2) of data from Apache Kafka into IBM MQ.

![Kafka Connect: MQ source and sink connectors]({{ 'images' | relative_url }}/mq_sink_and_source.png "Diagram showing a representation of how Event Streams and MQ can be connected by using the MQ source and MQ sink connectors.")

 **Important:** If you want to use IBM MQ connectors on IBM z/OS, you must [prepare your setup first](../mq/zos/).

## When to use

Many organizations use both IBM MQ and Apache Kafka for their messaging needs. Although they're generally used to solve different kinds of messaging problems, users often want to connect them together for various reasons. For example, IBM MQ can be integrated with systems of record while Apache Kafka is commonly used for streaming events from web applications. The ability to connect the two systems together enables scenarios in which these two environments intersect.

**Note:** You can use an existing IBM MQ or Kafka installation, either locally or on the cloud. For convenience, it is recommended to run the Kafka Connect worker on the same Kubernetes cluster as {{site.data.reuse.es_name}}. If the network latency between MQ and {{site.data.reuse.es_name}} is significant, you might prefer to run the Kafka Connect worker close to the queue manager to minimize the effect of network latency. For example, if you have a queue manager in your datacenter and Kafka in the cloud, it's best to run the Kafka Connect worker in your datacenter.


## Configuration options

Find out the available configuration options for the IBM MQ source connector and the IBM MQ sink connector.

### IBM MQ source connector

The configuration options for the Kafka Connect source connector for IBM MQ are as follows:

| Name                                    | Description                                                            | Type    | Default        | Valid values                                            |
| --------------------------------------- | ---------------------------------------------------------------------- | ------- | -------------- | ------------------------------------------------------- |
| topic                                   | The name of the target Kafka topic                                     | string  |                | Topic name                                              |
| mq.queue.manager                        | The name of the MQ queue manager                                       | string  |                | MQ queue manager name                                   |
| mq.connection.mode                      | The connection mode - bindings or client                               | string  | client         | client, bindings                                        |
| mq.connection.name.list                 | List of connection names for queue manager                             | string  |                | host(port)[,host(port),...]                             |
| mq.channel.name                         | The name of the server-connection channel                              | string  |                | MQ channel name                                         |
| mq.queue                                | The name of the source MQ queue                                        | string  |                | MQ queue name                                           |
| exactly.once.source.support **(not available for connector v2)**            | Whether to enable exactly-once support for source connectors in the cluster by using transactions to write source records and their source offsets, and by proactively fencing out old task generations before bringing up new ones. | string | disabled  | [disabled, enabled, preparing] | 
| mq.exactly.once.state.queue **(not available for connector v2)**            | The name of the MQ queue used to store state when running with exactly-once semantics | string |  | MQ state queue name                                     |
| mq.user.name                            | The user name for authenticating with the queue manager                | string  |                | User name                                               |
| mq.password                             | The password for authenticating with the queue manager                 | string  |                | Password                                                |
| mq.user.authentication.mqcsp            | Whether to use MQ connection security parameters (MQCSP)               | boolean | true           |                                                         |
| mq.ccdt.url                             | The URL for the CCDT file containing MQ connection details             | string  |                | URL for obtaining a CCDT file                           |
| mq.record.builder                       | The class used to build the Kafka Connect record                       | string  |                | Class implementing RecordBuilder                        |
| mq.message.body.jms                     | Whether to interpret the message body as a JMS message type            | boolean | false          |                                                         |
| mq.record.builder.key.header            | The JMS message header to use as the Kafka record key                  | string  |                | JMSMessageID, JMSCorrelationID, JMSCorrelationIDAsBytes, JMSDestination |
| mq.jms.properties.copy.to.kafka.headers | Whether to copy JMS message properties to Kafka headers                | boolean | false          |                                                         |
| mq.ssl.cipher.suite                     | The name of the cipher suite for TLS (SSL) connection                  | string  |                | Blank or valid cipher suite                             |
| mq.ssl.peer.name                        | The distinguished name pattern of the TLS (SSL) peer                   | string  |                | Blank or DN pattern                                     |
| mq.ssl.keystore.location                | The path to the JKS keystore to use for SSL (TLS) connections          | string  | JVM keystore   | Local path to a JKS file                                |
| mq.ssl.keystore.password                | The password of the JKS keystore to use for SSL (TLS) connections      | string  |                |                                                         |
| mq.ssl.truststore.location              | The path to the JKS truststore to use for SSL (TLS) connections        | string  | JVM truststore | Local path to a JKS file                                |
| mq.ssl.truststore.password              | The password of the JKS truststore to use for SSL (TLS) connections    | string  |                |                                                         |
| mq.ssl.use.ibm.cipher.mappings          | Whether to set system property to control use of IBM cipher mappings   | boolean |                |                                                         |
| mq.batch.size                           | The maximum number of messages in a batch (unit of work)               | integer | 250            | 1 or greater                                            |
| mq.message.mqmd.read                    | Whether to enable reading of all MQMD fields                           | boolean | false          |                                                         |

### IBM MQ sink connector

The configuration options for the Kafka Connect sink connector for IBM MQ are as follows:

| Name                                    | Description                                                            | Type    | Default        | Valid values                      |
| --------------------------------------- | ---------------------------------------------------------------------- | ------- | -------------- | --------------------------------- |
| topics or topics.regex                  | List of Kafka source topics                                            | string  |                | topic1[,topic2,...]               |
| mq.queue.manager                        | The name of the MQ queue manager                                       | string  |                | MQ queue manager name             |
| mq.connection.mode                      | The connection mode - bindings or client                               | string  | client         | client, bindings                  |
| mq.connection.name.list                 | List of connection names for queue manager                             | string  |                | host(port)[,host(port),...]       |
| mq.channel.name                         | The name of the server-connection channel                              | string  |                | MQ channel name                   |
| mq.exactly.once.state.queue **(not available for connector v2)**            | The name of the MQ queue used to store state when running with exactly-once semantics | string |  | MQ state queue name                                     |
| mq.queue                                | The name of the target MQ queue                                        | string  |                | MQ queue name                     |
| mq.user.name                            | The user name for authenticating with the queue manager                | string  |                | User name                         |
| mq.password                             | The password for authenticating with the queue manager                 | string  |                | Password                          |
| mq.user.authentication.mqcsp            | Whether to use MQ connection security parameters (MQCSP)               | boolean | true           |                                   |
| mq.ccdt.url                             | The URL for the CCDT file containing MQ connection details             | string  |                | URL for obtaining a CCDT file     |
| mq.message.builder                      | The class used to build the MQ message                                 | string  |                | Class implementing MessageBuilder |
| mq.message.body.jms                     | Whether to generate the message body as a JMS message type             | boolean | false          |                                   |
| mq.time.to.live                         | Time-to-live in milliseconds for messages sent to MQ                   | long    | 0 (unlimited)  | [0,...]                           |
| mq.persistent                           | Send persistent or non-persistent messages to MQ                       | boolean | true           |                                   |
| mq.ssl.cipher.suite                     | The name of the cipher suite for TLS (SSL) connection                  | string  |                | Blank or valid cipher suite       |
| mq.ssl.peer.name                        | The distinguished name pattern of the TLS (SSL) peer                   | string  |                | Blank or DN pattern               |
| mq.ssl.keystore.location                | The path to the JKS keystore to use for SSL (TLS) connections          | string  | JVM keystore   | Local path to a JKS file          |
| mq.ssl.keystore.password                | The password of the JKS keystore to use for SSL (TLS) connections      | string  |                |                                   |
| mq.ssl.truststore.location              | The path to the JKS truststore to use for SSL (TLS) connections        | string  | JVM truststore | Local path to a JKS file          |
| mq.ssl.truststore.password              | The password of the JKS truststore to use for SSL (TLS) connections    | string  |                |                                   |
| mq.ssl.use.ibm.cipher.mappings          | Whether to set system property to control use of IBM cipher mappings   | boolean |                |                                   |
| mq.message.builder.key.header           | The JMS message header to set from the Kafka record key                | string  |                | JMSCorrelationID                  |
| mq.kafka.headers.copy.to.jms.properties | Whether to copy Kafka headers to JMS message properties                | boolean | false          |                                   |
| mq.message.builder.value.converter      | The class and prefix for message builder's value converter             | string  |                | Class implementing Converter      |
| mq.message.builder.topic.property       | The JMS message property to set from the Kafka topic                   | string  |                | Blank or valid JMS property name  |
| mq.message.builder.partition.property   | The JMS message property to set from the Kafka partition               | string  |                | Blank or valid JMS property name  |
| mq.message.builder.offset.property      | The JMS message property to set from the Kafka offset                  | string  |                | Blank or valid JMS property name  |
| mq.reply.queue                          | The name of the reply-to queue                                         | string  |                | MQ queue name or queue URI        |
| mq.retry.backoff.ms                     | Wait time, in milliseconds, before retrying after retriable exceptions | long    | 60000          | [0,...]                           |