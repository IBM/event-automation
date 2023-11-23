---
title: "IBM MQ v1"
sortTitle: "MQ"
connectorID: kc-sink-mq
direction: sink
support: IBM
type: kafkaConnect
icon: appIcon_mq.svg
documentationURL: ../../es/connecting/mq/sink
download:
  -  { type: 'Download', url: 'https://github.com/ibm-messaging/kafka-connect-mq-sink/releases/' }
  -  { type: 'GitHub', url: 'https://github.com/ibm-messaging/kafka-connect-mq-sink' }
categories:
  - Messaging
---


{{site.data.reuse.kafka-connect-mq-sink}} for copying data from Apache Kafka into IBM MQ. Supports connecting to IBM MQ in both bindings and client mode, and offers at-least-once delivery of data from Apache Kafka into IBM MQ.

For additional features, such as exactly-once delivery of data from Apache Kafka into IBM MQ, see the [IBM MQ sink connector v2](../kc-sink-ibm-mq2/installation), which is an advanced version of the connector built on the v1 version.
