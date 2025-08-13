---
title: "Managing event sources"
excerpt: "Find out how you can edit event source information, create options for an event source and remove event sources and options from {{site.data.reuse.eem_name}}."
categories: describe
slug: managing-event-sources
toc: true
---

After [adding a topic](../adding-topics) as an event source to {{site.data.reuse.eem_name}}, you can use the **Topics detail** page to complete the following tasks:
- Edit the details you provide about the event source.
- Socialize the event source.
- Find out more about its usage.
- Manage an option's [lifecycle state](../managing-options/#option-lifecycle-states).
- Remove an option from the catalog.

To access the **Topic detail** page:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Manage topics**.
1. Find the event source you want to work with in the list, and click the name of the event source.

The details of your event source appear in three sections:

- **Information**: This section displays all the event source information presented to a user when an option for this event source is [socialized in the catalog](../publishing-options).
- **Options**: This section displays all the options created for this event source. Options can be provided or removed by [creating an option](../managing-options#create-option) or [deleting an option](../managing-options#delete-option).
- **Manage**: This section displays the current [lifecycle status](../managing-options#option-lifecycle-states) of your options for this event source in {{site.data.reuse.eem_name}}, including [the ability for users to discover and subscribe to](../publishing-options) your option and [the current set of subscribed users of your option](../../subscribe/managing-subscriptions).

You can also [delete](#deleting-an-event-source) your event source from this page, or [import this event source for use with {{site.data.reuse.apic_long}}](../../integrating-with-apic/generate-asyncapi/).

## Editing an event source
{: #edit-event-source}

**Note:** When an event source is created, you cannot edit the interaction type. For example, you cannot change it from a produce-enabled event source to a consume-enabled event source. You can set the interaction only when [adding the topic as an event source](../adding-topics).

To edit the event source details that represent a topic, complete the following steps:

1. Click the **Information** tab on the **Topic detail** page, and then select **Edit Information**.
1. Edit the fields you want to change in the [**Overview information**](#overview-information) pane.
1. In the side bar, click **Event Information** to navigate to this pane.
1. Edit the fields and values in the [**Event Information**](#event-information) pane that you want to change.
1. After you make changes, click **Save**.
1. To cancel changes, click **Cancel**.

Refer to the following sections for more information about the fields that can be edited in **Overview information** and **Event Information**.

### Overview information
{: #overview-information}

You can edit the following information in this pane. Restrictions and validation checks ensure that each field meets the requirements for Kafka event sources.

- **Event source name** can be edited and is the name of your event source.
- **Topic name**: can be edited and is the related Kafka topic for your event source. You can edit the **Topic name** only if your event source has no published options in the catalog.
- **Description** can be edited to describe your event source.
- **Tags** can be added in a comma-separated list. For example, `Product,Returns,Damage Returns`. You can use tags to make discovering the event endpoint easier to identify in the catalog.
- **Contact** must follow an email address format. 

### Event information
{: #event-information}

The event information provides details to help use the events from the topic.

- **Upload Schema:** You can provide an Avro schema in JavaScript Object Notation (JSON) format that describes the structure of the messages in your topic.  Checks are made to ensure a valid schema has been uploaded. If a valid schema has been uploaded, a preview of the schema is displayed. If the schema is invalid, a validation failure is displayed and the schema is not saved. When consuming events in a JSON, Avro binary, or an Avro JSON format from the topic, you can use an option that contains the [schema filtering control](../option-controls#schema-filter) to filter out any events that do not match the schema. 

  You can also provide a JSON schema in JavaScript Object Notation (JSON) format that describes the structure of the messages in your topic.

    **Note:** The schema must also be saved as a `.avsc`, `.avro`, or `.json` file. Invalid file formats will not be saved when uploaded, and the topic will not have a schema.
- **Schema description:** You can add detailed information about the schema. 
- **Sample messages:** You can provide examples of the messages that are emitted by the event source. The sample messages do not follow a required format. You can use this to document to check how the sample messages are structured.

### Editing nested Avro schemas
{: #editing-nested-avro-schemas}

When sharing a topic from {{site.data.reuse.es_name}} that contains nested Avro schemas with custom record types, ensure you replace the record type with the entire schema definition. You must do this after sharing the topic with {{site.data.reuse.eem_name}}, but before publishing the topic. You can find the required schema definitions in your schema registry.

#### Before you begin
{: #before-you-begin}

Before you edit a nested Avro schema in the {{site.data.reuse.eem_name}} UI, obtain the required schema definition from your schema registry for each custom record type.

For example, if you are using the {{site.data.reuse.es_name}} schema registry, complete the following steps to obtain the required schema definition:

1. Log in to the {{site.data.reuse.es_name}} UI by using your login credentials.
2. Click **Schema registry** in the primary navigation.
3. Select the schema for the record type from the list.
4. Copy the schema definition and paste it into a text editor. When you edit the nested Avro schema later, you can replace the custom record type with this definition.

#### Editing a nested Avro schema
{: #editing-a-nested-avro-schema}


To edit a nested Avro schema in the {{site.data.reuse.eem_name}} UI, follow these steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Manage topics**.
3. Find the topic you shared in the list, and click the name of the topic.
4. Click **Edit information** on the **Topic detail** page.
5. From the left pane, click **Event information**.
6. To modify the schema, complete the following steps:
   
   1. Copy the schema displayed and paste it into a text editor.
   1. Copy the schema definition from your schema registry.
      
      For example, if you are using the {{site.data.reuse.es_name}} schema registry, copy the schema definition obtained [earlier](#before-you-begin).
   1. Find the custom record type name and paste the schema definition in the `type` section.
      
      For example, in the following Avro schema, the `customer` type is replaced with its schema definition.
      
      ```
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
      
      ```
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
  


## Deleting an event source
{: #deleting-an-event-source}

An event source can be deleted from {{site.data.reuse.eem_name}} only if it has no **Published** or **Archived** options. Deleting an event source removes all the details about your event source.

To delete an event source from {{site.data.reuse.eem_name}}, complete the following steps: 

1. In the navigation pane, click **Manage topics**.
1. Find the event source that you want to work with and ensure that the **Option status** is 0 published. All options in the **Unpublished** state will have a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the table.
1. Click the event source that you want to work with. 
1. Depending on your version of {{site.data.reuse.eem_name}}, complete one of the following steps.
   - ![Event Endpoint Management 11.6.3 icon]({{ 'images' | relative_url }}/11.6.3.svg "In Event Endpoint Management 11.6.3 and later.") If you're using {{site.data.reuse.eem_name}} version 11.6.3 or later, in the **Topics** pane header, click the delete icon ![Delete icon]({{ 'images' | relative_url }}/trashcan.svg "The delete icon."){:height="30px" width="15px"}.
   - If you're using {{site.data.reuse.eem_name}} version 11.6.2 or earlier, open the **Manage** tab within the **Topic detail** page for your **Unpublished** event source, and select **Delete topic**.
1. Confirm the event source that you want to delete by entering the event source name.
1. Click **Delete**. (**Delete** is displayed in the footer if you entered the event source name that you want to delete correctly).

Event sources can also be deleted from the **Manage topics** page. Only event sources with **Unpublished** options contain a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the event source table. To delete an event source from the **Manage topics** page, click the delete icon and follow the previous steps 5 to 6.
