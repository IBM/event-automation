---
title: "Operator-managed Event Gateway in `Evicted` state"
excerpt: "Unexpected exception where the Event Gateway is moved to the `Evicted` state."
categories: troubleshooting
slug: evicted-gateway
toc: true
---

## Symptoms
{: #symptoms}

An [operator-managed {{site.data.reuse.egw}}](../../installing/install-gateway#operator-managed-gateways) or [Kubernetes Deployment {{site.data.reuse.egw}}](../../installing/install-gateway#remote-gateways) reports an `Evicted` state due to running out of space.


## Causes
{: #causes}

Kubernetes pods use [ephemeral storage](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-emphemeralstorage-consumption){:target="_blank"} for scratch space, caching and for logs. The {{site.data.reuse.egw}} is spewing out logs that are not being cleaned up in time, which causes the {{site.data.reuse.egw}} to reach the `Evicted` state.

## Resolving the problem
{: #resolving-the-problem}

This issue can be resolved by adding more ephemeral storage for the {{site.data.reuse.egw}} so that additional storage is available to clean up logs. You can add more storage by adding the `ephemeral-storage` property to the `EventGateway` custom resource or Kubernetes Deployment. For example:

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

<!-- It'd be good to state what the default storage is.  Also it's thought this won't be a problem on docker gateways: https://ibmapim.slack.com/archives/C02AEBS3JPJ/p1742914427798859?thread_ts=1742914134.146839&cid=C02AEBS3JPJ, would need to be confirmed before we say anything about docker here. -->