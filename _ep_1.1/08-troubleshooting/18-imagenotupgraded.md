---
title: "IBM Operator for Apache Flink fails to automatically update the image to 1.1.8 after upgrading"
excerpt: "IBM Operator for Apache Flink fails to automatically update the image after upgrading to 1.1.8."
categories: troubleshooting
slug: image-not-upgraded
toc: true
---

## Symptoms

After you successfully upgraded to {{site.data.reuse.ep_name}} 1.1.8, the Flink images fail to automatically update to 1.1.8 and display the images of earlier versions.

## Causes

{{site.data.reuse.ep_name}} fails to trigger the mutating admission webhook that changes the image versions.

## Resolving the problem

To resolve the problem, trigger the mutating admission webhook to update the image version to 1.1.8 by running the following command:

```shell
kubectl patch flinkdeployment <instance-name -n <namespace> \
  --type='json' \
  -p='[{"op": "replace", "path": "/spec/flinkConfiguration/table.exec.source.idle-timeout", "value":"31 s"}]'
```

The previous command changes an arbitrary Flink configuration parameter in the `FlinkDeployment` custom resource to trigger the mutating admission webhook.