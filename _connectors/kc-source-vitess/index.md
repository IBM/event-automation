---
title: "Vitess (Debezium)"
sortTitle: "Vitess"
connectorID: kc-source-vitess
direction: source
support: community
type: kafkaConnect
iconInitial: V
iconGradient: 1
documentationURL: https://debezium.io/documentation/reference/3.3/connectors/vitess.html
download:
  -  { type: 'Download', url: 'https://repo1.maven.org/maven2/io/debezium/debezium-connector-vitess/' }
  -  { type: 'GitHub', url: 'https://github.com/debezium/debezium-connector-vitess' }
categories:
  - Databases
---

Debezium is an open-source distributed platform for change data capture (CDC). Debezium’s Vitess connector can monitor row-level changes in the schemas of a Vitess database (keyspace) and record them to separate Kafka topics.