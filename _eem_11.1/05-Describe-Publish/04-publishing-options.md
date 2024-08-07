---
title: "Publishing options"
excerpt: "Find out how you can publish new options to make their event data available in the catalog."
categories: describe
slug: publishing-topics
toc: true
---

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") After [adding your topic](../adding-topics) and [creating an option](../managing-options#create_option), you can publish your option to a set of [gateway groups](../../about/key-concepts#gateway-group) which will make it available in the catalog.


**Note:** The controls within an option cannot be edited or deleted after the option is published.

All the topics with published options are displayed along with tags and status information in the {{site.data.reuse.eem_name}} catalog. The topic owner can edit or delete their options after publishing it, as described in [managing topics](../managing-options#edit_option).

All the published options are displayed in the {{site.data.reuse.eem_name}} catalog as event endpoints, along with event source name, tags, and status information. The event source owner can edit or delete their options after publishing them, as described in [managing topics](../managing-topics#edit_option).

Application developers can then [discover](../../consume-subscribe/discovering-topics/) available event endpoints and [subscribe](../../consume-subscribe/subscribing-to-topics/) to them directly or request access if approval is required.

**Note:** A gateway is required to publish an option. Ensure that you have at least one gateway group associated with your {{site.data.reuse.eem_name}} instance. For more information, see [managing gateways](../managing-gateways).

If you are using {{site.data.reuse.eem_name}} version 11.1.3 or earlier, complete the following steps to publish an option to the catalog:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Topics**. A list of topics is displayed.
1. Select the topic that you want to publish an option from.
1. Click the **Options** tab. 
1. For the option that you want to publish, click **Edit** ![edit icon]({{ 'images' | relative_url }}/rename.svg "Edit the cluster name icon."){:height="30px" width="15px"}.
1. In the side bar, click **Publish option**.     
1. Click **Publish**.
1. Select a gateway group from the available options.     
1. Click **Save**.
1. To cancel changes, click **Cancel**.     


![Event Endpoint Management 11.1.4 icon]({{ 'images' | relative_url }}/11.1.4.svg "In Event Endpoint Management 11.1.4 and later") If you are using {{site.data.reuse.eem_name}} version 11.1.4 and later, complete the following steps to publish an option to the catalog:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Topics**. A list of topics is displayed.
1. Select the topic that you want to publish an option from.
1. Click the **Options** tab.
1. For the option that you want to publish, click **Publish**.
1. In the **Publish option** dialog, select a gateway group from the available options.
   
   **Note:** When only one gateway is available, it is selected by default. If you have multiple gateways, you can choose a gateway group from the available options.

1. Click **Publish**.
1. To cancel changes, click **Cancel**.



## Viewing published options
{: #view_published_options}

After the option is published, application developers can discover and learn more about the corresponding event endpoint in the {{site.data.reuse.eem_name}} catalog.

To view the option within the {{site.data.reuse.eem_name}} catalog, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Catalog**.
1. Select the event source that the option belongs to from the list.
1. Select the event endpoint card that with the published option name at the top.

After you select an event endpoint, you can view the description and event information. Based on this information, you can subscribe to the event endpoint to get access, or request access if an approval control is enabled on this event endpoint. You can also export an event endpoint as an [AsyncAPI document](../../consume-subscribe/discovering-topics/#exporting-topic-details).
