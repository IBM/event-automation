---
title: "Event Gateway in `Evicted` state"
excerpt: "Unexpected exception where the Event Gateway is moved to the `Evicted` state."
categories: troubleshooting
slug: evicted-gateway
toc: true
---

## Symptoms

When an {{site.data.reuse.egw}} instance is set up with ephemeral storage, it is possible for it to reach an `Evicted` state due to running out of space.

## Causes

Kubernetes pods use [ephemeral storage](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-emphemeralstorage-consumption){:target="_blank"} for scratch space, caching, and for logs. If the logs produced by the {{site.data.reuse.egw}} are not cleaned up in time, the gateway reaches the `Evicted` state.

## Resolving the problem
{: #resolving-the-problem}

You can increase the ephemeral storage available to the {{site.data.reuse.egw}}, so that additional storage is available to clean up logs. You can add more storage by editing the `EventGateway` custom resource:

```yaml
# excerpt from a {{site.data.reuse.egw}} CRD 
template:
  pod:
    spec:
      containers:
          name: egw
          resources:
            limits:
              ephemeral-storage: 500Mi
```

This updates the pod's ephemeral storage for the {{site.data.reuse.egw}}, which prevents the gateway instance from overloading the storage and reaching the `Evicted` state.