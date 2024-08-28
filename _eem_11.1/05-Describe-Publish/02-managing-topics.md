---
title: "Managing topics"
excerpt: "Find out how you can edit topic information, create options for a topic and remove topics and options from Event Endpoint Management."
categories: describe
slug: managing-topics
toc: true
---

After [adding a Kafka topic](../adding-topics) as an event source to {{site.data.reuse.eem_name}}, you can use the **Topics detail** page to subsequently edit the details you provide about the topic, socialize it, and find out more about its usage.

**Note:** The type of an event source cannot be edited. This can only be set when [adding the topic as an event source](../adding-topics).

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") In {{site.data.reuse.eem_name}} 11.1.1 and later, you can manage an option's [lifecycle state](#option-lifecycle-states) and remove an option from the catalog from this page.

To access the **Topic detail** page:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Topics**.
1. Find the topic you want to work with in the list, and click the name of the topic.

The details of your topic appear in three sections:

- **Information**: This section displays all the topic information presented to a user when an option for this topic is [socialized in the catalog](../publishing-options).
- ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") **Options**: This section displays all the options created for this topic. Options can be provided or removed by [creating an option](#create_option) or [deleting an option](#deleting-an-option).
- **Manage**: This section displays the current [lifecycle status](#option-lifecycle-states) of your options for this topic in {{site.data.reuse.eem_name}}, including [the ability for users to discover and subscribe to](../publishing-options) your option and [the current set of subscribed users of your option](../managing-user-access-to-options).

You can also [delete](#deleting-a-topic) your topic from this page, or [export this topic for use with {{site.data.reuse.apic_short}}](../../integrating-with-apic/export-asyncapi/).

## Editing a topic
{: #edit-topic}

To edit the event source details that represent a topic:

1. Click the **Information** tab on the **Topic detail** page, and then select **Edit Information**.
1. Edit the fields you want to change in the [**Overview information**](#overview-information) pane.
1. In the side bar, click **Event Information** to navigate to this pane.
1. Edit the fields and values in the [**Event Information**](#event-information) pane that you want to change.
1. After you make changes, click **Save**.
1. To cancel changes, click **Cancel**.

Refer to the following sections for more information about the fields that can be edited in **Overview information** and **Event Information**.

### Overview information

You can edit the following information in this pane. Restrictions and validation checks ensure each field meets requirements for Kafka event sources.

- **Topic name** is set when the event source is created and cannot be edited. 
- **Description** can be edited to describe your topic.
- **Tags** can be added in a comma separated list. For example: `Product,Returns,Damage Returns`. You can use tags to make discovering the topic easier to identify in the catalog.
- **Contact** must follow an email address format. 

### Event information

The event information provides details to help consume the events from the topic. 
- **Upload Schema:** You can provide an Avro schema in JavaScript Object Notation (JSON) format that describes the structure of the messages in your topic. Checks are made to ensure a valid Avro schema has been uploaded. If a valid file has been uploaded, a preview of the schema is displayed. If the schema is invalid, a validation failure is displayed and the schema is not saved. When consuming events in Avro binary or Avro JSON format from the topic, you can use an option that contains the [schema filtering control](../option-controls#schema-filter) to filter out any events that do not match the schema. 

    **Note:** The schema must also be saved as a `.avsc` or `.avro` file. Invalid file formats will not be saved when uploaded, and the topic will not have a schema. 
- **Schema description:** You can add detailed information about the schema. 
- **Sample messages:** You can provide examples of the messages that are emitted by the event source. The sample messages do not follow a required format. You can use this to document to check how the sample messages are structured.

### Editing nested Avro schemas

When sharing a topic from {{site.data.reuse.es_name}} that contains nested Avro schemas with custom record types, ensure you replace the record type with the entire schema definition. You must do this after sharing the topic with {{site.data.reuse.eem_name}}, but before publishing the topic. You can find the required schema definitions in your schema registry.

#### Before you begin

Before you edit a nested Avro schema in the {{site.data.reuse.eem_name}} UI, obtain the required schema definition from your schema registry for each custom record type.

For example, if you are using the {{site.data.reuse.es_name}} schema registry, complete the following steps to obtain the required schema definition:

1. Log in to the {{site.data.reuse.es_name}} UI by using your login credentials.
2. Click **Schema registry** in the primary navigation.
3. Select the schema for the record type from the list.
4. Copy the schema definition and paste it into a text editor. When you edit the nested Avro schema later, you can replace the custom record type with this definition.

#### Editing a nested Avro schema

To edit a nested Avro schema in the {{site.data.reuse.eem_name}} UI, follow these steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Topics**.
3. Find the topic you shared in the list, and click the name of the topic.
4. Click **Edit information** on the **Topic detail** page.
5. From the left pane, click **Event information**.
6. To modify the schema, complete the following steps:

   1. Copy the schema displayed and paste it into a text editor.
   1. Copy the schema definition from your schema registry.
     For example, if you are using the {{site.data.reuse.es_name}} schema registry, copy the schema definition obtained [earlier](#before-you-begin).
   1. Find the custom record type name and paste the schema definition in the `type` section.

      For example, in the following Avro schema, the `customer` type is replaced with its schema definition.

      ```json
      {
        "type": "record",  
        "name": "order",
        "fields": [
        
            {
              "name": "region",
              "type": "string"
            },
            {
              "name": "customer",
              "type": "customer"
            }
        ] 
      } 
      ```

      ```json
      {
        "type": "record",
        "name": "order",
        "fields": [
            {
              "name": "region",
              "type": "string"
            },
            {
              "name": "customer",
              "type": {
              "type": "record",
              "name": "customer",
              "fields": [
                  {
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "name": "name",
                    "type": "string"
                  }
               ]
            }
          }
        ]
      }
      ```

   1. Save the modified schema as a `.avsc` or `.avro` file.

7. Click **Delete schema** to delete the existing schema.
8. To upload the modified schema, click **Add an Avro schema** and select the `.avsc` or `.avro` file that you modified and saved earlier.
  

## Topic lifecycle state

In {{site.data.reuse.eem_name}} 11.1.1 and earlier versions, after adding the Kafka topic as an event source, it can have different lifecycle states. The lifecycle state of your event source determines whether it can be [subscribed](../../consume-subscribe/subscribing-to-topics) to by users, [socialized in the **Catalog**](../../consume-subscribe/discovering-topics), and available to perform any other operations.

The lifecycle of a Kafka topic in {{site.data.reuse.eem_name}} progresses through as follows:

- **Unpublished**: this topic is not socialized in the **Catalog**, cannot be subscribed to by other users, and has no current subscriptions.
- **Published**: this topic is socialized in the **Catalog**, and users can create new subscriptions to use it.
- **Archived**: this topic is socialized in the **Catalog**, and has existing subscriptions, but users cannot create new subscriptions.

The **Manage** tab on the **Topic Detail** page allows users to manage a topic's lifecycle state. You can see both the topic's current state and a button to advance it to the next state on this page.

You can change the lifecycle state of an event source as follows:

- To change the **Unpublished** state to **Published**, click the **Publish topic** button.
- To change the **Published** state to **Archived**, click the **Archive topic** button.
  **Note:** This option is only available if a published topic has subscribers.
- To change the **Archived** state to **Published**, click the **Publish topic** button.
- To change the **Published** state to **Unpublished**, click the **Unpublish topic** button.
  **Note:** This option is only available if a published topic has no current subscribers.

**Note:** **Archived** topics automatically return to the **Unpublished** state when all subscribers have their [subscriptions revoked](../managing-user-access-to-topics#revoking-subscriptions) from using this topic.

A topic can be [edited](#editing-a-topic) in any lifecycle state. However, the set of fields that can be edited is restricted when in **Published** or **Archived** states to prevent changes that cause runtime issues for subscribed users.

**Note:** Only **Unpublished** topics can be [deleted](#deleting-a-topic) from {{site.data.reuse.eem_name}}.


## Deleting a topic

A topic can be deleted from {{site.data.reuse.eem_name}} only if it has no **Published** or **Archived** options. Deleting a topic removes all details about your topic.

To delete a topic from {{site.data.reuse.eem_name}}, complete the following steps: 

1. In the navigation pane, click **Topics**.
1. Find the topic that you want to work with and ensure that the Option status is 0 published. All options in the **Unpublished** state will have a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the table.
1. Click the topic that you want to work with. 
1. Open the **Manage** tab within the **Topic detail** page for your **Unpublished** topic, and select **Delete topic**.
1. Confirm the topic that you want to delete by entering the topic name.
1. Click **Delete**. **Delete** is displayed in the footer if you entered the topic name that you want to delete correctly.

Topics can also be deleted from the **Topics** page. Only topics with **Unpublished** options contain a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the topic table. To delete a topic from the **Topics** page, click the delete icon and follow the previous steps 5 to 6.


