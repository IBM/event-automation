---
title: "Geo-replicator fails when replicating a topic"
excerpt: "EventStreamsGeoReplicator fails when replicating a topic."
categories: troubleshooting
slug: georep-fails
toc: true
---

## Symptoms

{{site.data.reuse.es_name}} [geo-replicator](../../georeplication/about/) fails when replicating a topic with the following error:

```shell
FAILED
Event Streams API request failed:
Error response from server. Status code: 500. Connection was closed
```

## Causes

The {{site.data.reuse.es_name}} operator uses the `EventStreamsGeoReplicator` custom resource to create a configured `KafkaMirrorMaker2` custom resource.

The behavior of the `EventStreamsGeoReplicator` has changed after moving to `StrimziPodSets` in {{site.data.reuse.es_name}} versions 11.2.0 and later. When you configure the `KafkaMirrorMaker2` custom resource, `StrimziPodSets` roll the pod, which means there is a period of time where no pods are available leading to the error mentioned earlier.

## Resolving the problem

You can resolve the problem in one of the following ways:

- Specify multiple replicas in the `EventStreamsGeoReplicator` custom resource.

  This means that there is always a pod available to process the `geo-replicator-create` command, even when the connector is not available (it will not be available until both pods have rolled).

  For example, to configure geo-replication with `2` replicas, set the value of the `spec.replicas` field to `2`:

  ```yaml
  spec:
    # ...
    replicas: 2
  ```

- Before entering the `geo-replicator-create` command, ensure the `KafkaMirrorMaker2` pods are completely rolled by checking their status is `Ready`.
