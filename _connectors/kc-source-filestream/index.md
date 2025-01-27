---
title: "FileStream"
sortTitle: "FileStream"
connectorID: kc-source-filestream
direction: source
support: community
type: kafkaConnect
iconInitial: Fs
documentationURL: https://kafka.apache.org/quickstart#quickstart_kafkaconnect
download:
  -  { type: 'GitHub', url: 'https://github.com/apache/kafka/tree/trunk/connect/file/src/main/java/org/apache/kafka/connect/file' }
categories:
  - Technology
---

The FileStream source connector reads data from a local file and sends it to a Kafka topic. This connector is meant for use in stand-alone mode.

**Note:** The FileStream source connector is not intended for production use.