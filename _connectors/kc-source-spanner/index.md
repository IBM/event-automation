---
title: "Spanner (Debezium)"
sortTitle: "Spanner"
connectorID: kc-source-spanner
direction: source
support: community
type: kafkaConnect
iconInitial: S
iconGradient: 1
documentationURL: https://debezium.io/documentation/reference/3.3/connectors/spanner.html
download:
  -  { type: 'Download', url: 'https://repo1.maven.org/maven2/io/debezium/debezium-connector-spanner/' }
  -  { type: 'GitHub', url: 'https://github.com/debezium/debezium-connector-spanner' }
categories:
  - Databases
---

Debezium is an open-source distributed platform for change data capture (CDC). Debezium’s Cloud Spanner connector can monitor row-level changes in the schemas of a Google Cloud Spanner database and record them to separate Kafka topics.