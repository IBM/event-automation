---
title: "The IBM Operator for Apache Flink not installing due to Security Context Constraint (SCC) issues"
excerpt: "When the default Security Context Constraint (SCC) is updated by user or another operator, Apache Flink operator does not install"
categories: troubleshooting
slug: default-scc-issues
toc: true
---

## Symptoms

The installation of the {{site.data.reuse.flink_long}} instance is unsuccessful, and the instance reports a `Failed` [status](../../installing/post-installation/).

- The `conditions` field under status contains the following error message:

  ```shell
  install failed: deployment flink-kubernetes-operator not ready before timeout: deployment "flink-kubernetes-operator" exceeded its progress deadline
  ```

- The pod fails with `Init:CreateContainerConfigError` error and the status of the `initContainer` contains the following error message under the `message` field:

  ```shell
  container has runAsNonRoot and image has non-numeric user (flink),
  cannot verify user is non-root (pod:
  "flink-kubernetes-operator-dbd5764db-2zlsd_default(dca6e122-4296-44f0-b66b-8ede4307493c)",
  container: import-cert)
  ```

## Causes

{{site.data.reuse.flink_long}} has been tested with the default `restricted-v2` Security Context Constraint (SCC) provided by the {{site.data.reuse.openshift_short}}.

If a user or any other operator applies a custom SCC that removes permissions required by {{site.data.reuse.flink_long}}, then this will cause issues.

## Resolving the problem

Apply the custom [Security Context Constraint](https://github.com/IBM/ibm-event-automation/blob/main/support/event-automation-scc.yaml){:target="_blank"} (SCC) provided by {{site.data.reuse.ea_long}} to enable permissions required by the product.

To do this, edit the `event-automation-scc.yaml` file to add your namespace and apply it using `oc` tool as follows:

1. Edit the `event-automation-scc.yaml` and add the namespace where your {{site.data.reuse.flink_long}} instance is installed.

2. {{site.data.reuse.openshift_cli_login}}

3. Run the following command to apply the SCC:

   ```shell
   oc apply -f <custom_scc_file_path>
   ```

   For example:

   ```shell
   oc apply -f event-automation-scc.yaml
   ```
