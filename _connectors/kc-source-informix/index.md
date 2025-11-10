---
title: "Informix (Debezium)"
sortTitle: "Informix"
connectorID: kc-source-informix
direction: source
support: community
type: kafkaConnect
iconInitial: I
iconGradient: 1
documentationURL: https://debezium.io/documentation/reference/3.3/connectors/informix.html
download:
  -  { type: 'Download', url: 'https://repo1.maven.org/maven2/io/debezium/debezium-connector-informix/' }
  -  { type: 'GitHub', url: 'https://github.com/debezium/debezium-connector-informix' }
categories:
  - Databases
---

Debezium is an open-source distributed platform for change data capture (CDC). Debezium’s Informix connector can monitor row-level changes in the schemas of an IBM Informix database and record them to separate Kafka topics.