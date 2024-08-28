---
title: "IBM MQ"
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

{{site.data.reuse.kafka-connect-mq-sink}} supports connecting to IBM MQ in both bindings and client mode, and offers both exactly-once and at-least-once delivery of data from IBM MQ to Apache Kafka.