---
title: "Installing on Microsoft Azure"
description: "Find out more about how to install Event Automation on Microsoft Azure."
permalink: /support/azure-install/
toc: true
section: "IBM Event Automation support"
cardType: "large"
order: 3
layout: pagesInsideCollection
---

The {{site.data.reuse.ea_long}} offering on [Azure Marketplace](https://azuremarketplace.microsoft.com/){:target="_blank"} provides an automated process for installing {{site.data.reuse.ea_short}} capabilities onto a Red Hat OpenShift cluster. The process installs all the catalog sources and operators that are required to create instances of all the {{site.data.reuse.ea_short}} capabilities, which include {{site.data.reuse.es_name}}, {{site.data.reuse.eem_name}}, and {{site.data.reuse.ep_name}}.
 
## Before you begin

Ensure you meet the following requirements for the Azure Marketplace installation:

- You must have an entitlement key from the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}.
- If you are installing {{site.data.reuse.ea_long}} (BYOL), you must have an existing Red Hat OpenShift cluster on Azure or a self-managed cluster from another provider.

## Selecting a plan

The plans that are available for you to select depend on whether you have an {{site.data.reuse.ea_long}} license or not. 

If you have a license for {{site.data.reuse.ea_short}}, complete the following steps:
1. Log in to [Azure Marketplace {{site.data.reuse.ea_long}} (BYOL)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/ibm-usa-ny-armonk-hq-6275750-ibmcloud-asperia.ibm-event-automation-byol?tab=Overview){:target="_blank"}.
1. Click **Get It Now**.
1. Select your plan.
1. Click **Continue** > **Create**.
1. Choose your subscription to start the installation setup.

If you don't have a license for {{site.data.reuse.ea_short}}, complete the following steps:
1. Log in to [Azure Marketplace {{site.data.reuse.ea_long}}](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/ibm-usa-ny-armonk-hq-6275750-ibmcloud-asperia.ibm-event-automation?tab=Overview){:target="_blank"}.
1. Click **Get it Now**. 
1. **Subscribe** to the {{site.data.reuse.ea_long}} plan.
1. Choose your subscription to start the installation setup.

## Installing the operators

Install all the {{site.data.reuse.ea_short}} catalog sources and operators as follows.

1. In the **Basics** dialog, complete the following steps:
    - Select your **Subscription** and the **Resource group** in which your Azure Red Hat OpenShift cluster exists.
    - In the **Instance details** section, select your Region.
    - Select the **Azure resource prefix**. This value is the resource group where your cluster is installed.
    - (Optional) If you're using an ARO plan, select an **ARO cluster resource group** and **ARO cluster**. 
1. Click **Next**.
1. In the **OpenShift Cluster** dialog, complete the following fields:
    - **Cluster API URL**.
    - **Openshift Credential Type**. This value is either `Password or Token`.
    - **Cluster administrator username**.
    - **Cluster administrator password**. 
    - **Confirm administrator password**.
1. Click **Next**.
1. In the **IBM Event Automation** dialog, complete the following fields:
    - Click **Include IBM Entitlement Key Secret**.
    - Add the **Entitlement key** and confirm it in the following field.
    - In the **Operator Scope** field, select whether you want to use a **Single Namespace** or **All Namespaces**. 
    - In the **Namespace for the operators** field, select the namespace that you want to use.
1. Click **Next**.
1. In the **Deployment VM** dialog, complete the following steps:
    - In the **Authentication type** field, set a **Password** or submit an **SSH Public Key**.
    - Leave all the other fields with their default values.
1. Click **Next**.
1. Review your installation details, then click **Submit** to begin the installation.

The installation starts and a message is displayed with the status of the installation.

When the installation completes successfully, the status changes to `Your deployment is complete`. You can now use the operators to install the {{site.data.reuse.ea_long}} capabilities: {{site.data.reuse.es_name}}, {{site.data.reuse.eem_name}}, and {{site.data.reuse.ep_name}}. 

**Tip:** You can also check the status of your deployments in your Azure portal later by going to **Home > `<resource_group>` \| Deployments** in the navigation menu (where `<resource_group>` is the **Resource group** value that you selected during installation).

See the following sections for links to information about installing each capability. You can install any capability you require independently of each other.

## Installing the capabilities

Using the operators, you can install the required {{site.data.reuse.ea_short}} capabilities as summarized in the following sections.

### Installing {{site.data.reuse.es_name}}

To install the {{site.data.reuse.es_name}} capability, follow the instructions in [installing an Event Streams instance]({{'es' | relative_url}}/installing/installing/#install-an-event-streams-instance).


### Installing {{site.data.reuse.eem_name}}

To install the {{site.data.reuse.eem_name}} capability, complete the following steps:

1. Ensure that you have a valid [certificate manager]({{'eem' | relative_url}}/installing/prerequisites/#certificate-management).
1. Install an [{{site.data.reuse.eem_manager}} instance]({{'eem' | relative_url}}/installing/installing/#install-an-event-manager-instance).
1. Install an [{{site.data.reuse.egw_short}} instance]({{'eem' | relative_url}}/installing/deploy-gateways/).

### Installing {{site.data.reuse.ep_name}}

To install the {{site.data.reuse.ep_name}} capability, complete the following steps:

1. Ensure that you have a valid [certificate manager]({{'ep' | relative_url}}/installing/prerequisites/#certificate-management).
1. Install a [Flink instance]({{'ep' | relative_url}}/installing/installing/#install-a-flink-instance).
1. Install an [{{site.data.reuse.ep_name}} instance]({{'ep' | relative_url}}/installing/installing/#install-an-event-processing-instance).