---
title: "Publishing event sources"
excerpt: "Find out how you can publish new event sources to make their event data available in the catalog."
categories: describe
slug: publishing-topics
toc: true
---

After describing and [adding your topic](../adding-topics) to the catalog as an event source, you can publish your event source to the **Catalog**, and a set of [gateway groups](../../about/key-concepts#gateway-group), to socialize and provide access to your events to other {{site.data.reuse.eem_name}} users.

All the published event sources are displayed along with tags and status information in the {{site.data.reuse.eem_name}} UI **Catalog** page. The topic owner can edit or delete their event sources even after publishing, as described in [managing topics](../managing-topics).

Application developers can then [discover](../../consume-subscribe/discovering-topics/) available event data in a self-service manner and [subscribe](../../consume-subscribe/subscribing-to-topics/) to the published event sources without involving the topic owners in each request for reuse.

To publish an event source to the **Catalog**, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Topics**, then from the list select the topic you want to publish.
3. Click **Manage** tab, and **Publish topic**.

   **Note:** To publish a topic, _at least one gateway group must be associated with this EEM instance._ See [managing gateways](../managing-gateways) for more details.

4. Select a gateway group from the available options, then click **Publish topic**.

## Viewing published event sources

After the event source is published, application developers can discover and learn more about the event source in the {{site.data.reuse.eem_name}} UI.

To view the event sources in the UI:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Catalog**, then select a topic from the list.

After you select an event source, you can view the description and event information. Based on this information, you can subscribe to consume the event source. You can also export an event source as an [AsyncAPI document](../../consume-subscribe/discovering-topics/#exporting-topic-details).
