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

Kubernetes pods use [ephemeral storage](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-emphemeralstorage-consumption){:target="_blank"} for scratch space, caching and for logs. The {{site.data.reuse.egw}} is spewing out logs that are not being cleaned up in time, which causes the {{site.data.reuse.egw}} to reach the `Evicted` state.

## Resolving the problem

This issue can be resolved by giving the {{site.data.reuse.egw}} more ephemeral storage so that it is given a bit more leeway to clean up logs. This can be done by editing the {{site.data.reuse.egw}} custom resource:

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

This updates the pod ephemeral storage limits for the {{site.data.reuse.egw}}, which prevents the {{site.data.reuse.egw}} instance from overloading the storage and being `Evicted`.