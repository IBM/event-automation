---
title: "IBM MQ"
sortTitle: "MQ"
connectorID: kc-source-mq
direction: source
support: IBM
type: kafkaConnect
icon: appIcon_mq.svg
documentationURL: ../../es/connecting/mq/source
download:
  -  { type: 'Download', url: 'https://github.com/ibm-messaging/kafka-connect-mq-source/releases/' }
  -  { type: 'GitHub', url: 'https://github.com/ibm-messaging/kafka-connect-mq-source' }
categories:
  - Messaging
---

The {{site.data.reuse.kafka-connect-mq-source}} supports connecting to IBM MQ in both bindings and client mode, and offers both exactly-once and at-least-once delivery of data from IBM MQ to Apache Kafka.