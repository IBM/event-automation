---
title: "API reference for the `EventStreamsGeoReplicator/v1beta1` CRDs"
excerpt: "API reference for the Custom Resource Definitions (CRDs) that are used by `EventStreamsGeoReplicator/v1beta1`."
categories: reference
slug: api-reference-esgr
toc: true
---

Find out more abut the Custom Resource Definitions (CRDs) used by {{site.data.reuse.es_name}} geo-replicator.


## spec

| Property | Type | Description |
| --- | --- | --- |
| spec | object | The {{site.data.reuse.es_name}} geo-replicator specification. |
| spec.replicas | integer | The number of Kafka Connect workers to start for {{site.data.reuse.es_name}} geo-replication. |
| spec.version | string | Version of the {{site.data.reuse.es_name}} geo-replicator. |

## status

| Property | Type | Description |
| --- | --- | --- |
| status | object | The status of the EventStreamsGeoReplicator instance. |
| status.conditions | array | Current state of the {{site.data.reuse.es_name}} cluster. |
| status.customImages | boolean | Identifies whether any of the Docker images have been modified from the defaults for this version of {{site.data.reuse.es_name}}. |
| status.observedGeneration | integer | The generation of the resource at the last successful reconciliation. |
| status.phase | string | Identifies the current state of the {{site.data.reuse.es_name}} instance. |
| status.versions | object | Information about the version of this instance and it's upgradable versions. |
| status.versions.available | object | The versions that this instance of {{site.data.reuse.es_name}} can be upgraded to. |
| status.versions.available.channels | array | A list of versions that the operator is able to automatically upgrade from. |
| status.versions.available.versions | array | A list of versions that the operator is able to upgrade this instance of {{site.data.reuse.es_name}} to. |
| status.versions.reconciled | string | The current running version of this operator. |

