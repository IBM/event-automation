---
title: "MongoDB (Debezium)"
sortTitle: "MongoDB"
connectorID: kc-source-mongodbz
direction: source
support: community
type: kafkaConnect
iconInitial: Mg
iconGradient: 3
documentationURL: https://debezium.io/docs/connectors/mongodb/
download:
  -  { type: 'Download', url: 'https://repo1.maven.org/maven2/io/debezium/debezium-connector-mongodb/' }
  -  { type: 'GitHub', url: 'https://github.com/debezium/debezium/tree/master/debezium-connector-mongodb' }
categories:
  - Databases
---

Debezium is an open source distributed platform for change data capture. Debezium’s MongoDB connector can monitor a MongoDB replica set or a MongoDB sharded cluster for document changes in databases and collections, recording those changes as events in Kafka topics.