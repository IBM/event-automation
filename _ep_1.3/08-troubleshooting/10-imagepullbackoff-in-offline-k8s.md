---
title: "Flink pods enter ImagePullBackOff state"
excerpt: "When installing IBM Operator for Apache Flink in an offline Kubernetes environment, the Flink instance fails with some pods going in to the ImagePullBackOff state."
categories: troubleshooting
slug: flink-imagepullbackoff
toc: true
---

## Symptoms

When creating an instance of a `FlinkDeployment` in an offline Kubernetes environment, some pods might display an `ImagePullBackOff` error status after the instance is created.

## Causes

The service account that is created to run the Flink instance does not reference the secret containing credentials to the private registry that is used to store the component images.

## Resolving the problem

To resolve the error, add the `ibm-entitlement-key` to the service account:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    app.kubernetes.io/instance: ibm-eventautomation-flink
    app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
    app.kubernetes.io/name: ibm-eventautomation-flink
  name: flink
imagePullSecrets:
  - name: ibm-entitlement-key
```

**Note:** The secret `ibm-entitlement-key` is expected to be present in the namespace and is expected to contain credentials to the private registry that is being used to store the images.
