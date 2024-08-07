---
title: "IBM MQ v2"
sortTitle: "MQ"
connectorID: kc-sink-ibm-mq2
direction: sink
support: IBM
type: kafkaConnect
icon: appIcon_mq.svg
documentationURL: ../../es/connecting/mq/sink
download:
  -  { type: 'Download', url: 'https://ibm.biz/ea-fix-central' }
categories:
  - Messaging
---

{{site.data.reuse.kafka-connect-mq-sink}} v2 supports connecting to IBM MQ in both bindings and client mode, and offers both exactly-once and at-least-once delivery of data from Apache Kafka to IBM MQ.

In the {{site.data.reuse.kafka-connect-mq-sink}} v2, you can [add values]({{'es/connecting/mq/sink/#enabling-mqmd-in-ibm-mq-sink-connector-v2' | relative_url}} ) to the IBM MQ message descriptor (MQMD).
