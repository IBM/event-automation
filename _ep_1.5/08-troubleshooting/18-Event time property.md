---
title: "Incorrect event time property format causes Flink job to fail"
excerpt: "Flink job fails with an error while deploying Event Processing"
categories: troubleshooting
slug: event-time-property
toc: true
---


## Symptoms
{: #symptoms}

The Flink job fails with a `NullPointerException` error while attempting to use the `sink.StreamRecordTimestampInserter` object:

```java
org.apache.flink.connector.kafka.source.reader.deserializer.KafkaDeserializationSchemaWrapper.deserialize(KafkaDeserializationSchemaWrapper.java:54) ~[flink-connector-kafka-3.2.0-1.19.jar:3.2.0-1.19]
at org.apache.flink.connector.kafka.source.reader.KafkaRecordEmitter.emitRecord(KafkaRecordEmitter.java:53) ~[flink-connector-kafka-3.2.0-1.19.jar:3.2.0-1.19]
... 14 more
Caused by: java.lang.NullPointerException
at org.apache.flink.table.runtime.operators.sink.StreamRecordTimestampInserter.processElement(StreamRecordTimestampInserter.java:50) ~[flink-table-runtime-1.19.1.jar:1.19.1]
```

## Causes
{: #causes}


This error typically occurs when the event source node is not properly configured, or when there is a mismatch between the expected and actual types of the event time property of the events being processed.

When you configure the event time in your [event source node](../../nodes/eventnodes/#configuring-a-source-node), the timestamp type of the property must match the expected format of the Kafka message property. If the Kafka event time property value does not conform to the expected format, the event source node interprets it as `null`. When the event destination node is processing an event, if the event time property value is `null`, the Flink job fails with the `NullPointerException` error. 



## Resolving the problem
{: #resolving-the-problem}

To resolve the problem: 

- Ensure that when configuring the event time, the [timestamp](../../about/key-concepts/#timestamp) type of the property matches the expected format of the Kafka message property.
- Verify that incoming Kafka messages contain valid event time property values.

