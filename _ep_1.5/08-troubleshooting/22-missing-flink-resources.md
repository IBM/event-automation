---
title: "Flink resources are unexpectedly missing from the cluster"
excerpt: "Flink resources such as Service, Deployment, ReplicaSet, Pod, and ConfigMap are unexpectedly missing from the cluster."
categories: troubleshooting
slug: missing-flink-resources
toc: true
---

## Symptoms
{: #symptoms}

Flink resources such as Service, Deployment, ReplicaSet, Pod, and ConfigMap are not found in the cluster, and the following status is displayed in the `FlinkDeployment` custom resource:

```yaml
status:
  jobManagerDeploymentStatus: MISSING
```

## Causes
{: #causes}

This error might occur because the Flink Kubernetes Operator is configured to clean up Flink resources one day after a job reaches its terminal state. This behavior is controlled by the `kubernetes.operator.jm-deployment.shutdown-ttl` [configuration](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-main/docs/operations/configuration/){:target="_blank"}.

## Resolving the problem
{: #resolving-the-problem}

To resolve the problem, ensure you follow the steps provided in the [recover Flink deployment troubleshooting](../recover-flink-deployment/#resolving-the-problem). Additionally, complete any one of the following steps to help prevent this issue in the future:

- To apply to all the `FlinkDeployment` custom resources managed by the operator, edit the Flink Kubernetes Operator ConfigMap `flink-operator-config`, and add the following key to the `flink-conf.yaml` section:

  ```yaml
  data:
    flink-conf.yaml: |
        kubernetes.operator.jm-deployment.shutdown-ttl: 7 d
  ```
  To edit a ConfigMap by using the CLI, run the following command:

   ```shell
   kubectl edit configmap `flink-operator-config` -n <target-namespace>
   ```

  The ConfigMap `flink-operator-config` is available by default in the namespace where {{site.data.reuse.ibm_flink_operator}} is installed.

- To set the configuration in a specific `FlinkDeployment` custom resource, add the following key to the `spec.flinkConfiguration` section:

  ```yaml
  spec:
    flinkConfiguration:
        kubernetes.operator.jm-deployment.shutdown-ttl: 7 d
  ```