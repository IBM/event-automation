---
title: "Helm diff plugin failure when upgrading to 12.3.x due to large CRD size"
excerpt: "When upgrading to Event Streams 12.3.x on other Kubernetes platforms by using Helm, the Helm diff plugin fails with an error."
categories: troubleshooting
slug: helm-diff-plugin-failure
toc: true
---

## Symptoms
{: #symptoms}

When upgrading to {{site.data.reuse.es_name}} 12.3.x on other Kubernetes platforms by using Helm, you might encounter a failure with the following error:

```
Error: plugin "diff" exited with error
```

## Causes
{: #causes}

The Helm diff plugin attempts to process large Custom Resource Definitions (CRDs). When the CRD size approaches Kubernetes secret size limits (approximately 1 MB), the diff operation fails. {{site.data.reuse.es_name}} 12.3.x includes CRDs that are close to this size limit, which causes the Helm diff plugin to fail during the upgrade process.

## Resolving the problem
{: #resolving-the-problem}

Avoid using the Helm diff plugin during the upgrade. Follow the documented [Helm upgrade procedure](../../installing/upgrading/#upgrading-by-using-helm) without invoking the diff plugin.