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

- The Flink operator deploys an instance of a Flink cluster that is defined in the `FlinkDeployment` Custom Resource Definition (CRD).
- The Flink operator deploys an instance of a Flink session job that is defined in the `FlinkSessionJob` CRD.
- The {{site.data.reuse.ep_name}} operator deploys an instance of {{site.data.reuse.ep_name}} that is defined in the `EventProcessing` CRD.

Your installation depends on how you want to process the event sources:

- To utilize the low-code canvas and deploy flows, install the {{site.data.reuse.ibm_flink_operator}} and the {{site.data.reuse.ep_name}} operator, along with an instance of Flink and an instance of {{site.data.reuse.ep_name}}.
- To create and manage Flink session jobs in a session cluster, you can install only the {{site.data.reuse.ibm_flink_operator}}, deploy a session cluster instance defined by the `FlinkDeployment` custom resource type, and then deploy the Flink session job defined by `FlinkSessionJob` custom resource type.

**Note:** {{site.data.reuse.ep_flink_version_align_note}}

Installing {{site.data.reuse.ep_name}} includes the following high-level steps:

1. Depending on your platform and environment, select the right procedure:

   - [{{site.data.reuse.openshift}} online environment](../installing/) which has access to the internet.
   - [Offline environment](../offline/) (also referred to as air-gapped or disconnected).
   - [Other Kubernetes platform online environment](../installing-on-kubernetes/) which has access to the internet.

1. Install the {{site.data.reuse.ibm_flink_operator}} operator. The operator will then be available to install and manage your Flink instances.

   **Note:** To create and run Flink session jobs, you can install only the {{site.data.reuse.ibm_flink_operator}} and its associated custom resource types (`FlinkDeployment` and `FlinkSessionJob`). You can skip the installation of the {{site.data.reuse.ep_name}} operator and the `EventProcessing` custom resource type.

1. Install the {{site.data.reuse.ep_name}} operator. The operator will then be available to install and manage your {{site.data.reuse.ep_name}} instances.
1. Install the `FlinkDeployment` custom resource type to create an instance of Flink.

   **Important:** In {{site.data.reuse.ep_name}} 1.5.0 and later, Apache Flink 2.2.0 is supported for both UI-based flows and deploying Flink jobs outside the {{site.data.reuse.ep_name}} UI. Flink 1.20.3 is also supported, but only for deploying Flink jobs outside the {{site.data.reuse.ep_name}} UI. The {{site.data.reuse.ep_name}} UI is not supported when running a Flink instance with Flink 1.20.3. To use Flink 1.20.3 for deploying Flink jobs outside the UI, you must configure the `FlinkDeployment` custom resource accordingly. For more information, see the installation instructions for [OpenShift](../installing/#install-a-flink-instance), [offline environments](../offline/#install-an-instance), and [other Kubernetes platforms](../installing-on-kubernetes/#install-instances).

1. Optional: Install the `FlinkSessionJob` custom resource type to deploy a customized Flink session job from scratch.
1. Using the {{site.data.reuse.ep_name}} operator, install an instance of the {{site.data.reuse.ep_name}} by applying the `EventProcessing` custom resource type.
