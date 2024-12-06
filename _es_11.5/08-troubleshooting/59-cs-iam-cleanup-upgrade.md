---
title: "Event Streams fails to delete foundational services operand request"
excerpt: "Event Streams fails to delete foundational services operand request when changing UI authentication from IAM to SCRAM."
categories: troubleshooting
slug: cs-not-removed
toc: true
---

## Symptoms

When changing the UI authentication from IAM to SCRAM, {{site.data.reuse.es_name}} fails to remove {{site.data.reuse.fs}} operand request, which are no longer needed. This is more likely to happen when upgrading {{site.data.reuse.cp4i}} from 2022.2 to 16.1.0, which removes support for using IAM.

## Causes

The {{site.data.reuse.icpfs}} cleanup does not start when the support for IAM is removed.

## Resolving the problem

Run the following command to manually delete the {{site.data.reuse.fs}} operand request created by {{site.data.reuse.es_name}}:

```shell
oc delete operandrequest <INSTANCE>-ibm-es-eventstreams -n <NAMESPACE>
```