---
title: "Db2 (Debezium)"
sortTitle: "Db2"
connectorID: kc-source-db2
direction: source
support: community
type: kafkaConnect
iconInitial: DB
iconGradient: 1
documentationURL: https://debezium.io/documentation/reference/3.3/connectors/db2.html
download:
  -  { type: 'Download', url: 'https://repo1.maven.org/maven2/io/debezium/debezium-connector-db2/' }
  -  { type: 'GitHub', url: 'https://github.com/debezium/debezium-connector-db2' }
categories:
  - Databases
---

Debezium is an open-source distributed platform for change data capture (CDC). Debezium’s Db2 Connector can monitor row-level changes in the schemas of a Db2 database and record them to separate Kafka topics.