---
title: "Cassandra (Debezium)"
sortTitle: "Cassandra"
connectorID: kc-source-cassandra
direction: source
support: community
type: kafkaConnect
iconInitial: C
iconGradient: 1
documentationURL: https://debezium.io/documentation/reference/3.3/connectors/cassandra.html
download:
  -  { type: 'Download', url: 'https://repo1.maven.org/maven2/io/debezium/debezium-connector-cassandra/' }
  -  { type: 'GitHub', url: 'https://github.com/debezium/debezium-connector-cassandra' }
categories:
  - Databases
---

Debezium is an open-source distributed platform for change data capture (CDC). Debezium’s Cassandra connector can monitor row-level changes in the schemas of an Apache Cassandra database and record them to separate Kafka topics.