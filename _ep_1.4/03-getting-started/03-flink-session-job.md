---
title: "Deploying a custom Flink session job"
excerpt: "Find out how to deploy a Flink session job written in Java by using the IBM Operator for Apache Flink."
categories: getting-started
slug: flink-session-job
toc: true
---

You can create and run a Flink session job that is written in Java by using the {{site.data.reuse.ibm_flink_operator}}.

The `FlinkSessionJob` custom resource is used to create and manage Flink jobs in a session cluster. The `FlinkSessionJob` instance can only run with an existing session cluster managed by the `FlinkDeployment` instance. The `FlinkSessionJob` custom resource contains the information to submit a session job to the session cluster with following information:

- `deploymentName`: The name of the Flink deployment instance deployed by using the `FlinkDeployment` custom resource.
- `job.jarUri`: Specifies the URI of the [Flink job JAR](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.11/docs/custom-resource/reference/#jobspec){:target="_blank"} file.

The Flink job is deployed to the target session cluster mentioned in the `spec`. You can then manage the job running in the session cluster.

## Prerequisites

Ensure your environment meets the following prerequisites before running a Flink session job:

- The {{site.data.reuse.ibm_flink_operator}} [installed](../../installing/installing/#installing-the-ibm-operator-for-apache-flink).
- A Flink session cluster is [deployed](../../installing/installing/#install-a-flink-instance) by using the `FlinkDeployment` custom resource.
- A Flink job written in Java. For examples, see [GitHub](https://github.com/apache/flink/tree/release-1.20.1/flink-examples/flink-examples-streaming/){:target="_blank"}.

## Procedure

1. [Install](../../installing/installing/#install-flink-sessionjob) a `FlinkSessionJob` instance with your [configurations](../../installing/configuring/#configuring-flinksessionjob).

1. Apply the `FlinkSessionJob` custom resource. To apply the custom resource by using the CLI:

   ```shell
   kubectl apply -f <name-of-the-custom-resource>
   ```

1. To ensure that the job is submitted against the session cluster and that the Flink job is running, go to the `FlinkSessionJob` custom resource and check whether the status of the `status.jobStatus.state` is `RUNNING`:

   ```yaml
   status:
     jobStatus:
       ...
       state: RUNNING
       ...
    ```


