---
title: "Internal topics used in Event Streams"
excerpt: "Find out the internal topics used in Event Streams."
categories: reference
slug: internal-topics
toc: true
---

See the following list of internal topics that is used in {{site.data.reuse.es_name}}:

Apicurio registry:

- `eventstreams-apicurio-registry-global-id-topic`
- `eventstreams-apicurio-registry-storage-topic`
- `eventstreams-apicurio-registry-global-id-store-changelog`
- `eventstreams-apicurio-registry-storage-store-changelog`
- `eventstreams-apicurio-registry-kafkasql-topic`

Cruise control:

- `eventstreams.cruisecontrol.metrics`
- `eventstreams.cruisecontrol.modeltrainingsamples`
- `eventstreams.cruisecontrol.partitiontrainingsamples`
- `eventstreams.cruisecontrol.partitionmetricsamples`

Geo-replication:

- `__eventstreams_georeplicator_configs`
- `__eventstreams_georeplicator_offsets`
- `__eventstreams_georeplicator_status`

Kafka:

- `__consumer_offsets`
- `__transaction_state`

Strimzi:

- `__strimzi-topic-operator-kstreams-topic-store-changelog`  
- `__strimzi_store_topic`