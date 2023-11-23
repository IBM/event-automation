---
title: "Managing topics"
excerpt: "Find out how you can edit topic information in the catalog, and remove topics from the list."
categories: describe
slug: managing-topics
toc: true
---

After [adding a Kafka topic](../adding-topics) as an event source to {{site.data.reuse.eem_name}}, you can use the **Topic Detail** page to subsequently edit the details you provide about the topic, socialize it, and find out more about its usage. You can also manage a topic's [lifecycle state](#topic-lifecycle-state) and remove a topic from the catalog from this page.

To access the **Topic Detail** page:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Topics**.
3. Find the topic you want to work with in the list, and click the name of the topic.

The details of your topic appear in two sections:

- The **Information** section: displays all the possible information presented to a user when a topic is [socialized in the catalog](../publishing-topics). These can be provided or removed by [editing your topic](#editing-a-topic).
- The **Manage** section: displays the current [lifecycle status](#topic-lifecycle-state) of your topic in {{site.data.reuse.eem_name}}, including [the ability for users to subscribe and discover](../publishing-topics) your topic and [the current set of subscribed users of your topic](../managing-user-access-to-topics).

You can also [delete](#deleting-a-topic) your topic from this page, or [export this topic for use with IBM API Connect](../../integrating-with-apic/export-asyncapi/).

## Editing a topic

To edit the event source details that represent a topic:

1. Click the **Edit Information** button found in the header of the **Topic Detail** page.

   ![Event Endpoint Management 11.0.4 icon]({{ 'images' | relative_url }}/11.0.4.svg "In Event Endpoint Management 11.0.4.") Click the **Information** tab on the **Topic Detail** page, and then select **Edit Information**.
2. Edit the fields you want to change in the [**Overview information**](#overview-information) section.
3. In the side bar, click **Event Information** to navigate to this section.
4. Edit the fields and values in the [**Event Information**](#event-information) section that you want to change.
5. After you make changes, [save your changes](#saving-changes) by clicking the blue **Save** button in the footer.
6. You can cancel any changes by clicking the **Cancel** button in the footer or the cross icon in the top corner.

Refer to the following sections for more information about the fields that can be edited in **Overview information** and **Event Information**.

### Overview information

You can edit the following information on this page. Restrictions and validation checks ensure each field meets requirements for Kafka event sources.

- **Topic alias** is editable only when the topic is in an [**unpublished** state](#topic-lifecycle-state). The topic alias must meet the following conditions:

   - Be less than 200 characters in length, 
   - Have no white space included,
   - Must not use invalid characters: `'/', '\\', ',', '\u0000', ':', '"', '\'', ';', '*', '?', ' ', '\t', '\r', '\n', '='`

- **Topic name** is set when the event source is created and cannot be edited. 
- **Description** can be edited to describe your topic.
- **Tags** can be added in a comma separated list. For example: `Product,Returns,Damage Returns`. You can use tags to make discovering the topic easier to identify in the catalog.
- **Contact** must follow an email address format. 

### Event information

The event information provides details to help consume the events from the topic. 
- **Upload Schema:** you can provide an Avro Schema in JavaScript Object Notation (JSON) document format. Checks  are made to ensure valid JSON and valid Avro schemas have been uploaded. If a valid file has been uploaded, a code snippet preview of the schema is displayed. If the formatting is incorrect, the schema is not saved with a validation failure.
    **Note:** The schema must also be saved as a `.avsc` or `.avro` file. Invalid file formats will not be saved when uploaded, and the topic will not have a schema. 
- **Schema description:** you can add detailed information about the schema. 
- **Sample messages:** you can provide examples of the messages that are emitted by the event source. In addition, if the event source does not follow an Avro schema, you can use the sample messages field. The sample messages will then be used to infer the schema of messages sent on the topic. The sample messages do not follow a required format. You can use this to document to check how the sample messages are structured.

### Saving changes

The save button is disabled if the edits made do not meet the requirements for a Kafka topic. When you are finished with editing the event source, you can either:

- Click the blue **Save** button, which will be visible in the footer if the validation checks pass. 
- Click the **Cancel** button in the footer or the cross icon in the top corner to cancel any unwanted changes.


## Deleting a topic

**Unpublished** topics can be deleted from {{site.data.reuse.eem_name}}. Deleting a topic removes all details about your topic. To get your topic into a state where it can be deleted, see how you can manage its [lifecycle state](#topic-lifecycle-state).

To delete a topic from {{site.data.reuse.eem_name}}, complete the following steps. 

1. In the header of the **Topic Detail** page for your **Unpublished** topic, click **Delete topic**.

   ![Event Endpoint Management 11.0.4 icon]({{ 'images' | relative_url }}/11.0.4.svg "In Event Endpoint Management 11.0.4.") Open the **Manage** tab within the **Topic Detail** page for your **Unpublished** topic, and select **Delete topic**.
2. Confirm the topic that you want to delete by entering the topic name.
3. Click the red **Delete** button, this will be visible in the footer if you have entered the topic name that you want to delete correctly.

Topics can also be deleted from the **Topics** page. All **Unpublished** topics will contain a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the topic table. You can delete a topic from the **Topics** page by clicking the delete icon and following steps 2-3 above.

## Topic lifecycle state

After adding the Kafka topic as an event source to {{site.data.reuse.eem_name}}, it can have different lifecycle states. The lifecycle state of your event source determines whether it can be [subscribed](../../consume-subscribe/subscribing-to-topics) to by users, [socialized in the **Catalog**](../../consume-subscribe/discovering-topics), and available to perform any other operations.

The lifecycle a Kafka topic in {{site.data.reuse.eem_name}} progresses through is as follows:

- **Unpublished**: this topic is not socialized in the **Catalog**, cannot be subscribed to by other users, and has no current subscriptions.
- **Published**: this topic is socialized in the **Catalog**, and users can create new subscriptions to use it.
- **Archived**: this topic is socialized in the **Catalog** and has existing subscriptions, but users cannot create new subscriptions.

The **Manage** tab on the **Topic Detail** page allows users to manage a topic's lifecycle state. You can see both the topic's current state and a button to advance it to the next state on this page.

You can change the lifecycle state of an event source as follows:

- To change the **Unpublished** state to **Published**, click the **Publish topic** button.
- To change the **Published** state to **Archived**, click the **Archive topic** button.
  - **Note:** This option is only available if a published topic has subscribers.
- To change the **Archived** state to **Published**, click the **Publish topic** button.
- To change the **Published** state to **Unpublished**, click the **Unpublish topic** button.
  - **Note:** This option is only available if a published topic has no current subscribers.

**Note:** **Archived** topics automatically return to the **Unpublished** state when all subscribers have their [subscriptions revoked](../managing-user-access-to-topics#revoking-subscriptions) from using this topic.

A topic can be [edited](#editing-a-topic) in any lifecycle state. However, the set of fields that can be edited is restricted when in **Published** or **Archived** states to prevent changes that cause runtime issues for subscribed users.

**Note:** Only **Unpublished** topics can [be deleted from {{site.data.reuse.eem_name}}](#deleting-a-topic).

