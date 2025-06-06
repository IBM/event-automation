---
title: "Installation overview"
excerpt: "Find out about the high-level steps required to install Event Endpoint Management."
categories: installing
slug: overview
toc: true
---

{{site.data.reuse.eem_name}} is an operator-based release and uses custom resources to deploy and manage the lifecycle of your {{site.data.reuse.eem_name}} installation.

A deployment of {{site.data.reuse.eem_name}} consists of a single {{site.data.reuse.eem_manager}} instance (also referred to as Manager) that is configured along with one or more instances of an {{site.data.reuse.egw}}.

- {{site.data.reuse.eem_manager}} instances are defined by the `EventEndpointManagement` custom resource type.
- {{site.data.reuse.egw}} instances can be deployed as:
   - [Operator-managed](../install-gateway#operator-managed-gateways) `EventGateway` custom resource type.
   - Stand-alone {{site.data.reuse.egw}} [Docker container](../install-gateway#remote-gateways).
   - [Kubernetes Deployment](../install-gateway#remote-gateways) {{site.data.reuse.egw}}.

Installing {{site.data.reuse.eem_name}} includes the following high-level steps:

1. Depending on your platform and environment, select the right procedure:

   - [{{site.data.reuse.openshift}} online environment](../installing/) that has access to the internet.
   - [Offline environment](../offline/) (also referred to as air-gapped or disconnected).
   - [Other Kubernetes platform online environment](../installing-on-kubernetes/) that has access to the internet.

   **Note:** [Docker and Kubernetes Deployment](../install-gateway#remote-gateways) {{site.data.reuse.egw}} instances can be installed only in an online environment. 

2. Install the {{site.data.reuse.eem_name}} operator. The operator is then available to install and manage your {{site.data.reuse.eem_manager}} instances, and any operator-managed {{site.data.reuse.egw}} instances you want to install on the same cluster.
3. Using the operator, install an instance of the {{site.data.reuse.eem_manager}} by applying the `EventEndpointManagement` custom resource type.
4. Install one or more instances of the {{site.data.reuse.egw}}:
   - If you want to install the {{site.data.reuse.egw}} on the same cluster as the {{site.data.reuse.eem_manager}}, use the [operator-managed](../install-gateway#operator-managed-gateways) {{site.data.reuse.egw}} custom resource. 
   - If you want to install the {{site.data.reuse.egw}} on a different cluster, for example, to locate it closer to where your Kafka installation is, you can install an {{site.data.reuse.egw}} as a [Docker container or a Kubernetes Deployment](../install-gateway#remote-gateways).

