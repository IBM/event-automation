---
title: "IBM MQ v1"
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

{{site.data.reuse.kafka-connect-mq-source}} v1 for copying data from IBM MQ into Apache Kafka. Supports connecting to IBM MQ in both bindings and client mode, and offers at-least-once delivery of data from IBM MQ to Apache Kafka.

For additional features, such as exactly-once delivery of data from IBM MQ into Apache Kafka, see the [IBM MQ source connector v2](../kc-source-ibm-mq2/installation), which is an advanced version of the connector built on the v1 version.