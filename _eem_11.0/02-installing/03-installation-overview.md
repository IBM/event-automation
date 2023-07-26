---
title: "Installation overview"
excerpt: "Find out about the high-level steps required to install Event Endpoint Management."
categories: installing
slug: overview
toc: true
---

{{site.data.reuse.eem_name}} is an operator-based release and uses custom resources to deploy and manage the lifecycle of your {{site.data.reuse.eem_name}} installation. 

A deployment of {{site.data.reuse.eem_name}} consists of a single {{site.data.reuse.eem_name}} instance (also referred to as Manager or {{site.data.reuse.eem_manager}}) that is configured along with one or more instances of an {{site.data.reuse.egw}}.

<!-- Custom resources are presented as YAML configuration documents. -->

- {{site.data.reuse.eem_manager}} instances are defined by the `EventEndpointManagement` custom resource type. 
- {{site.data.reuse.egw}} instances are defined by the `EventGateway` custom resource type.

Installing {{site.data.reuse.eem_name}} includes the following high-level steps:

1. Determine if you will be installing in an [online environment](../installing/) which has access to the internet, or if you will be installing in an [offline environment](../offline/) (also referred to as air-gapped or disconnected).

   **Note:** Stand-alone {{site.data.reuse.egw}} instances can only be installed in an online environment (see later).

2. Install the {{site.data.reuse.eem_name}} operator. The operator will then be available to install and manage your {{site.data.reuse.eem_manager}} instances, and any {{site.data.reuse.egw}} instances you want to install on the same cluster.
3. Using the operator, install an instance of the Manager by applying the `EventEndpointManagement` custom resource type.
4. Install one or more instances of the {{site.data.reuse.egw}} on the same cluster, or as a stand-alone deployment on a different host:
   - If you want to install the {{site.data.reuse.egw}} on the same cluster as the {{site.data.reuse.eem_manager}}, use the {{site.data.reuse.eem_name}} operator to install instances by applying the `EventGateway` custom resource type. For more information, see [installing {{site.data.reuse.egw}} on the same cluster](http://localhost:4000/event-integration/event-automation-docs/eem/installing/deploy-gateways/).
   - If you want to install the {{site.data.reuse.egw}} on a different cluster, for example, to locate it closer to where your Kafka installation is, you can install a [stand-alone {{site.data.reuse.egw}}](../standalone-gateways/).

