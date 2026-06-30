---
title: "Publishing virtual topics"
excerpt: "Find out how you can publish new virtual topics to make their event data available in the catalog."
categories: describe
slug: publishing-virtual-topics
toc: true
---

After [adding your source topic](../adding-topics) and [creating a virtual topic](../managing-virtual-topics#create-virtual-topic), you can publish your virtual topic to a set of [gateway groups](../../about/key-concepts#gateway-group) which will make it available in the catalog.

You can publish virtual topics to the {{site.data.reuse.eem_name}} catalog, {{site.data.reuse.wm_portal_long}}, or both. All published virtual topics are displayed in the selected destination, along with source topic name, tags, and status information. The source topic owner can edit or delete their virtual topics after publishing them, as described in [managing virtual topics](../managing-virtual-topics#edit-virtual-topic).


Users can then [discover](../../subscribe/discovering-virtual-topics/) available virtual topics and [subscribe](../../subscribe/subscribing-apps/) to them.

## Before you begin
{: #before-you-begin}
A gateway is required to publish a virtual topic. Ensure that you have at least one gateway group associated with your {{site.data.reuse.eem_manager}} instance. For more information, see [managing gateways](../../administering/managing-gateways).

To publish virtual topics to the {{site.data.reuse.wm_portal_short}} ensure that the following prerequisites are in place:
- [{{site.data.reuse.wm_portal_short}}](https://www.ibm.com/docs/en/api-connect/software/12.1.0?topic=portal-overview){:target="_blank"} is installed in {{site.data.reuse.apic_long}} and is accessible.
- The integration between {{site.data.reuse.eem_name}} and {{site.data.reuse.wm_portal_short}} is [configured](../../dpo-integration/configure-eem-for-dpo-apic12/).
- The virtual topic is configured with an authentication set that uses [SASL credentials](../../describe/security-option-controls/#sasl).
- The virtual topic has the [**Require approval**](../security-option-controls/#approval-controls) toggle set to **Off**.

## Publishing virtual topics
{: #publishing-virtual-topics}
To publish a virtual topic, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Manage > Topics**. A list of source topics is displayed.
1. Select the source topic that you want to publish a virtual topic from.
1. Click the **Virtual topics** tab.
1. For the virtual topic that you want to publish, click **Publish**.
1. In the **Publish virtual topic** dialog, configure the following settings:
   
   - **Gateway group**: Select a gateway group from the available options.
   
     **Note:**
     - When only one gateway is available, it is selected by default. If you have multiple gateways, you can choose a gateway group from the available options.
     - Some controls require a supported gateway. If you attempt to publish a virtual topic to a gateway that does not support specific controls, a notification is displayed to inform you that this action is not possible.
     - You can only publish virtual topics to gateway groups that contain a gateway that has passed the validation checks for the cluster and source topic.
     - The target gateway group must have enough hostnames to match the number of brokers across all Kafka clusters that all the topics published to this gateway group use.
   
   - **Publishing destination**: Select where you want to publish the virtual topic: <!-- DRAFT COMMENT: Need to verify these steps in a working instance -->
     - **{{site.data.reuse.eem_name}} catalog**: Publish to the {{site.data.reuse.eem_name}} catalog only.
     - **{{site.data.reuse.wm_portal_short}}**: Publish to {{site.data.reuse.wm_portal_long}} only.
     - **Both**: Publish to both the {{site.data.reuse.eem_name}} catalog and {{site.data.reuse.wm_portal_short}}.

1. Click **Publish**.


## Viewing published virtual topics
{: #view_published_virtual_topics}

After the virtual topic is published, users can discover and learn more about the corresponding virtual topic in the {{site.data.reuse.eem_name}} catalog.

To view the virtual topic within the {{site.data.reuse.eem_name}} catalog, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Catalog**.
1. Select the source topic that the virtual topic belongs to from the list.
1. Select the virtual topic card in the **Virtual topics** section.

After you select a virtual topic, you can view the description and event information. Based on this information, you can subscribe to the virtual topic to get access. You can also export a virtual topic as an [AsyncAPI document](../../subscribe/discovering-virtual-topics/#exporting-virtual-topic-details).

## Viewing published virtual topics in {{site.data.reuse.wm_portal_short}}
{: #view-published-virtual-topics-dp}

After the virtual topic is published, users can discover and subscribe to the corresponding virtual topic in the {{site.data.reuse.wm_portal_short}} interface.

1. Log in to {{site.data.reuse.wm_portal_short}}.
2. Go to the **Asset gallery**.
3. Search for the published virtual topic that you want to work with.
4. Click on the virtual topic to view its details, including:
   - Description and documentation
   - Schema information
   - Sample messages
   - Code accelerator samples
   - Subscription options

Users can then subscribe to the virtual topic to obtain credentials to access it.
