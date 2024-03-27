---
title: "Operator watching single namespace has escalated permissions"
excerpt: "The IBM Operator for Apache Flink is given escalated permissions when being installed in a specific namespace."
categories: troubleshooting
slug: rbac
toc: true
---

## Symptom

The {{site.data.reuse.ibm_flink_operator}} installed on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers watching single namespace creates ClusterRole and ClusterRoleBinding instead of Role and RoleBinding.

## Causes

When `watchAnyNamespace` is set to `false` (default), an issue in the Helm templating causes creation of ClusterRole and ClusterRoleBinding permissions instead of Role and RoleBinding ones for the operator.

## Resolving the problem

You can resolve the problem by installing the {{site.data.reuse.ibm_flink_operator}} that will manage the `FlinkDeployment` instances in only a single namespace with no custom configurations such as `kubernetesServiceDnsDomain`, or `webhook.create`.

Run the following command to install the {{site.data.reuse.ibm_flink_operator}} in the `my-flink` namespace:

```shell
helm install \
   flink ibm-helm/ibm-eventautomation-flink-operator\
   -n "my-flink" \
   --set watchNamespaces={my-flink}
```