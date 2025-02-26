---
title: "Installation overview"
excerpt: "Find out about the high-level steps required to install Event Processing."
categories: installing
slug: overview
toc: true
---

{{site.data.reuse.ep_name}} is an operator-based release and uses custom resources to define the deployment configuration.
{{site.data.reuse.ep_name}} requires the installation of the {{site.data.reuse.ibm_flink_operator}} and the {{site.data.reuse.ep_name}} operator.

These operators deploy and manage the entire lifecycle of your Flink and {{site.data.reuse.ep_name}} instances.

- Flink instances are defined by the `FlinkDeployment` custom resource type.
- {{site.data.reuse.ep_name}} instances are defined by the `EventProcessing` custom resource type.

A deployment of {{site.data.reuse.ep_name}} consists of the {{site.data.reuse.ibm_flink_operator}} and the {{site.data.reuse.ep_name}} operator, along with an instance of Flink and an instance of {{site.data.reuse.ep_name}}.

**Note:** {{site.data.reuse.ep_flink_version_align_note}}

Installing {{site.data.reuse.ep_name}} includes the following high-level steps:

1. Depending on your platform and environment, select the right procedure:

   - [{{site.data.reuse.openshift}} online environment](../installing/) which has access to the internet.
   - [Offline environment](../offline/) (also referred to as air-gapped or disconnected).
   - [Other Kubernetes platform online environment](../installing-on-kubernetes/) which has access to the internet.

1. Install the {{site.data.reuse.ibm_flink_operator}} operator. The operator will then be available to install and manage your Flink instances.
1. Install the {{site.data.reuse.ep_name}} operator. The operator will then be available to install and manage your {{site.data.reuse.ep_name}} instances.
1. Using the {{site.data.reuse.ibm_flink_operator}} operator, install an instance of the Flink by applying the `FlinkDeployment` custom resource type.
1. Using the {{site.data.reuse.ep_name}} operator, install an instance of the {{site.data.reuse.ep_name}} by applying the `EventProcessing` custom resource type.
