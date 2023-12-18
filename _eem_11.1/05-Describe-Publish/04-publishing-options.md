---
title: "Publishing options"
excerpt: "Find out how you can publish new options to make their event data available in the catalog."
categories: describe
slug: publishing-topics
toc: true
---

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") After [adding your topic](../adding-topics) and [creating an option](../managing-topics#create_option), you can publish your option to a set of [gateway groups](../../about/key-concepts#gateway-group) which will make it available in the catalog.

All the topics with published options are displayed along with tags and status information in the {{site.data.reuse.eem_name}} catalog. The topic owner can edit or delete their options after publishing it, as described in [managing topics](../managing-topics#edit_option).

Application developers can then [discover](../../consume-subscribe/discovering-topics/) available event data and [subscribe](../../consume-subscribe/subscribing-to-topics/) to the published options directly or request access if approval is required.

To publish an option to the catalog, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Topics**. A list of topics is displayed.
1. Select the topic that you want to publish an option from.
1. Click the **Options** tab.
1. For the option that you want to publish, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**.
1. In the side bar, click **Publish option**.
1. Click **Publish**.

   **Note:** To publish an option, at least one gateway group must be associated with this {{site.data.reuse.eem_name}} instance. For more information, see [managing gateways](../managing-gateways).
1. Select a gateway group from the available options.
1. Click **Save**.
1. To cancel changes, click **Cancel**.

## Viewing published options
{: #view_published_options}

After the option is published, application developers can discover and learn more about the option in the {{site.data.reuse.eem_name}} UI.

To view the option in the UI, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Catalog**.
1. Select the topic that the option belongs to from the list.

After you select an option, you can view the description and event information. Based on this information, you can subscribe to consume the option or request access if an approval control is enabled on this option. You can also export an event source as an [AsyncAPI document](../../consume-subscribe/discovering-topics/#exporting-topic-details).
