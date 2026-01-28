---
title: "Publishing options"
excerpt: "Find out how you can publish new options to make their event data available in the catalog."
categories: describe
slug: publishing-options
toc: true
---

After [adding your Kafka topic](../adding-topics) and [creating an option](../managing-options#create-option), you can publish your option to a set of [gateway groups](../../about/key-concepts#gateway-group) which will make it available in the catalog.

All the published options are displayed in the {{site.data.reuse.eem_name}} catalog as event endpoints, along with event source name, tags, and status information. The event source owner can edit or delete their options after publishing them, as described in [managing options](../managing-options#edit_option).

Application developers can then [discover](../../subscribe/discovering-event-endpoints/) available event endpoints and [subscribe](../../subscribe/subscribing-to-event-endpoints/) to them directly or request access if approval is required.

## Before you begin
{: #before-you-begin}
A gateway is required to publish an option. Ensure that you have at least one gateway group associated with your {{site.data.reuse.eem_manager}} instance. For more information, see [managing gateways](../../administering/managing-gateways).

     

## Publishing options
{: #publishing-options}
To publish an option to the catalog, complete the following steps:

**Note:** The controls within an option cannot be edited or deleted after the option is published.

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Manage > Topics**. A list of event sources is displayed.
1. Select the event source that you want to publish an option from.
1. Click the **Options** tab.
1. For the option that you want to publish, click **Publish**.
1. In the **Publish option** dialog, select a gateway group from the available options.
   
   **Note:** 
   - When only one gateway is available, it is selected by default. If you have multiple gateways, you can choose a gateway group from the available options.  
   - Some controls require a supported gateway. If you attempt to publish an option to a gateway that does not support specific controls, a notification is displayed to inform you that this action is not possible.
   - You can only publish options to gateway groups that contain a gateway that has passed the validation checks for the cluster and event source. 

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

After you select an event endpoint, you can view the description and event information. Based on this information, you can subscribe to the event endpoint to get access, or request access if an approval control is enabled on this event endpoint. You can also export an event endpoint as an [AsyncAPI document](../../subscribe/discovering-event-endpoints/#exporting-event-endpoint-details).
