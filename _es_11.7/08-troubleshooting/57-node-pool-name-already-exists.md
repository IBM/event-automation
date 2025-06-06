---
title: "Node pool validation fails due to `app.kubernetes.io/instance` label mismatch"
excerpt: "Node pool creation or reconciliation fails due to mismatched label values in Event Streams 11.7.0."
categories: troubleshooting
slug: node-pool-validation-label-mismatch
toc: true
---

## Symptoms

When deploying or upgrading an {{site.data.reuse.es_name}} instance to version 11.7.0, you might see an error message similar to the following example:

```console
The Node Pool Name kafka already exists in the namespace cp4i
```

This error prevents the creation or reconciliation of the `EventStreams` custom resource.

## Causes

{{site.data.reuse.es_name}} uses the `app.kubernetes.io/instance` label to validate node pool uniqueness. During reconciliation, the operator checks if a node pool with the same name already exists in your namespace and compares the label value against the {{site.data.reuse.es_name}} instance name.

In some environments, especially those managed by using tools such as Argo CD, this label might be overwritten or manually modified. If the label value does not match the {{site.data.reuse.es_name}} instance name, the validation fails and incorrectly reports that the node pool already exists.

## Resolving the problem

To resolve this issue, either [upgrade]({{ 'es/installing/upgrading/' | relative_url }}) to {{site.data.reuse.es_name}} version 11.8.0 or ensure that the value of the `app.kubernetes.io/instance` label on the node pool matches the name of the {{site.data.reuse.es_name}} instance.

For example, if your instance name is `kafka-es`, the label must be:

```yaml
app.kubernetes.io/instance: kafka-es
```
