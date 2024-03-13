---
title: "Sharing topics with Event Endpoint Management"
excerpt: "Find out how to integrate Event Streams with an Event Endpoint Management instance."
categories: getting-started
slug: sharing-topic
toc: true
---

![Event Streams 11.3.1 icon]({{ 'images' | relative_url }}/11.3.1.svg "In Event Streams 11.3.1 and later.") After you [set up a connection](../../installing/integrating-eem/) with {{site.data.reuse.eem_name}}, you can share your topic from the {{site.data.reuse.es_name}} UI.


Complete the following steps to share your topic with {{site.data.reuse.eem_name}}:

1. {{site.data.reuse.es_ui_login}}
2. Click the **Topics** tab in the primary navigation and then select a topic from the list of topics.
3. Click **Share for reuse**.
3. In the **Select an instance** section, select the {{site.data.reuse.eem_name}} instance that you want to share your {{site.data.reuse.es_name}} topic with, and then click **Next**.
4. In the **Provide access token** section, enter the [access token]({{ 'eem/security/api-tokens/#creating-a-token' | relative_url }}) that you created earlier, and click **Next**.
5. In the **Review details** section, enter a topic alias.

   - Optional: If available, a sample message of your topic is displayed in the **Sample message** text box. You can also add a sample message now, or edit the sample.

     **Note:** Ensure that you review the sample message in case sensitive information is displayed, as the sample will be available in the {{site.data.reuse.eem_name}} catalog for other users to view.
   - Optional: To select a schema from the schema registry, click **Select**.

     **Important:** If you select a nested Avro schema with custom record type, you must replace the custom record type name in it with the entire schema definition before publishing the topic as an option in {{site.data.reuse.eem_name}}. You can find the schema with the required definition in your schema registry. For more information about editing nested Avro schemas, see [Event Endpoint Management documentation]({{ 'eem/describe/managing-topics/#editing-nested-avro-schemas' | relative_url }}). 

     **Note:** If the schema registry is empty, the **Select** option is unavailable.
     
6. Click **Share for reuse** to share your topic with {{site.data.reuse.eem_name}}.

You are redirected to the {{site.data.reuse.eem_name}} UI from where you can [create]({{ 'eem/describe/managing-topics#create_option' | relative_url}}) and [publish]({{ 'eem/describe/publishing-topics' | relative_url}}) the topic data as an option. After you have published the option, consumers can [subscribe]({{ 'eem/consume-subscribe/approval-requests' | relative_url}}) to an option as required.

**Note:** When you create an event source in {{site.data.reuse.eem_name}}, the following items are also created:

- A Kafka user is created in {{site.data.reuse.es_name}} with read access to your topic, and the Kafka user is used by {{site.data.reuse.eem_name}}.
- A cluster definition is created in {{site.data.reuse.eem_name}} with information about your {{site.data.reuse.es_name}} instance and the Kafka user.
