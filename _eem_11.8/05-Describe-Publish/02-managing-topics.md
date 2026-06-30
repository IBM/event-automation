---
title: "Managing source topics"
excerpt: "Find out how you can edit source topic information, create virtual topics for a source topic and remove source topics and virtual topics from {{site.data.reuse.eem_name}}."
categories: describe
slug: managing-source-topics
toc: true
---

After you [add a topic](../adding-topics) to {{site.data.reuse.eem_name}}, you can use the topic's detail page to complete the following tasks:
- Find out more about the topic.
- Edit topic details.
- Create a virtual topic from the source topic.
- Manage the [lifecycle state](../managing-virtual-topics/#virtual-topic-lifecycle-states) of virtual topics that use this source topic.
- Remove a virtual topic from the catalog.

To access the topic details page:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Manage > Topics**.
1. Find the topic that you want to work with in the list, and click the name of the topic.

The details of your topic appear in three sections:

- **Information**: This section displays all the topic information that is presented when the topic is [socialized in the catalog](../publishing-virtual-topics) as a virtual topic.
- **Virtual topics**: This section displays all the virtual topics created for this source topic. Virtual topics can be added or removed by [creating a virtual topic](../managing-virtual-topics#create-virtual-topic) or [deleting a virtual topic](../managing-virtual-topics#delete-virtual-topic).
- **Manage**: This section displays the current [lifecycle status](../managing-virtual-topics#virtual-topic-lifecycle-states) of your virtual topics for this source topic in {{site.data.reuse.eem_name}}, including [the ability for users to discover and subscribe to](../publishing-virtual-topics) your virtual topic and [subscribed applications](../../subscribe/managing-apps).

You can also [delete](#deleting-source-topic) your topic from this page, or [import this source topic for use with {{site.data.reuse.apic_long}}](../../integrating-with-apic/generate-asyncapi/).

## Editing a topic
{: #edit-source-topic}

**Note:** When a topic is created, you cannot edit the interaction type. For example, you cannot change it from a produce-enabled topic to a consume-enabled topic. You can set the interaction only when you [add the source topic](../adding-topics).

To edit topic details, complete the following steps:

1. Click the **Information** tab on the topic page, and then select **Edit Information**.
1. Edit the fields that you want to change in the [**Overview information**](#overview-information) pane.
1. In the side bar, click **Event Information** to navigate to this pane.
1. Edit the fields and values in the [**Event Information**](#event-information) pane that you want to change.

Refer to the following sections for more information about the fields that can be edited in **Overview information** and **Event Information**.

### Overview information
{: #overview-information}

You can view and edit the following information in this pane. Restrictions and validation checks ensure that each field meets the requirements for Kafka source topics.

- **Name**: The name of your source topic in {{site.data.reuse.eem_name}}.
- **Kafka topic**: The name of the Kafka topic on the Kafka cluster. You cannot edit this name.
- **Description**: Free text description of your topic.
- **Tags**: Comma-separated list of tags that you can use to make the topic easier to identify in the catalog. For example, `Product,Refunds,Damage Returns`.
- **Contact**: Email address of the source topic owner. 
- **Additonal contacts**: Additional contact addresses for the source topic.

### Event information
{: #event-information}

The event information provides details to help use the events from the topic.

- **Upload Schema:** Provide an Avro schema in JavaScript Object Notation (JSON) format that describes the structure of the messages in your topic. If a valid schema is uploaded, a preview of the schema is displayed. When consuming events in a JSON, Avro binary, or an Avro JSON format from the topic, you can use a virtual topic that contains the [schema filtering control](../event-data-controls#schema-filter) to filter out any events that do not match the schema. 

  You can also provide a schema in JSON format that describes the structure of the messages in your topic.

- **Schema description:** Add detailed information about the schema. 
- **Sample message:** Provide an example of the messages that are emitted by the topic. This is useful when the sample messages do not follow a required format. You can provide a sample message instead of a schema.

### Editing nested Avro schemas
{: #editing-nested-avro-schemas}

When you share a topic from {{site.data.reuse.es_name}} that contains nested Avro schemas with custom record types, ensure that you replace the record type with the entire schema definition. You must do this after you add the source topic to {{site.data.reuse.eem_name}}, but before you publish any virtual topics that are based on it. You can find the required schema definitions in your schema registry.

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
2. In the navigation pane, click **Manage > Topics**.
3. Click the name of the topic to edit.
4. Click **Edit information** on the topic page.
5. From the left pane, click **Event information**.
6. To modify the schema, complete the following steps:
   
   a. Copy the schema that is displayed and paste it into a text editor.

   b. Copy the schema definition from your schema registry.
      
      For example, if you are using the {{site.data.reuse.es_name}} schema registry, copy the schema definition that you obtained [earlier](#before-you-begin).
      
   c. Find the custom record type name and paste the schema definition in the `type` section.
      
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
      
   d. Save the modified schema as a `.avsc` or `.avro` file.

7. Click **Remove schema** to delete the existing schema.
8. To upload the modified schema, click **Add an Avro or JSON schema** and select the file that you modified and saved in step 6.
  
## Adding source topic editors
{: #adding-source-topic-editors}

If [user groups](../../security/groups) are enabled, you can assign specific user groups to edit selected topics.

<!-- Is it worth adding something here about what source topic editors can do, or is the link to the user groups page enough? -->

To assign user groups to enable members of the group to edit topics, complete the following steps:

1. In the navigation pane, click **Manage > Topics**.
1. Find the source topic that you want to work with and click the **Collaborate** icon ![Collaborate icon]({{ 'images' | relative_url }}/collaborate.svg "The collaborate icon."){:height="30px" width="15px"}. The **Manage topic editors** pane is displayed with the user groups already assigned to the topic.
1. Select a user group from the list displayed. If the group that you want is not displayed, click **Enable user groups** to add a group from your organization.  

   **Note:** Any user groups that you enable must exist within the organization that is provided by your OAuth provider.  

## Deleting a source topic
{: #deleting-source-topic}

A topic can be deleted from {{site.data.reuse.eem_name}} only if it has no **Published** or **Archived** virtual topics. Deleting a source topic removes all the details about your topic.

To delete a topic from {{site.data.reuse.eem_name}}, complete the following steps: 

1. In the navigation pane, click **Manage > Topics**.
1. Find the topic that you want to delete and click the delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"}. 



