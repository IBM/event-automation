---
title: "Managing topics"
excerpt: "Find out how you can edit topic information, create options for a topic and remove topics and options from {{site.data.reuse.eem_name}}."
categories: describe
slug: managing-topics
toc: true
---

After [adding a Kafka topic](../adding-topics) as an event source to {{site.data.reuse.eem_name}}, you can use the **Topics detail** page to subsequently edit the details you provide about the topic, socialize it, and find out more about its usage. 

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") In {{site.data.reuse.eem_name}} 11.1.1 and later, you can manage an option's [lifecycle state](#option-lifecycle-states) and remove an option from the catalog from this page.

To access the **Topic detail** page:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Topics**.
1. Find the topic you want to work with in the list, and click the name of the topic.

The details of your topic appear in three sections:

- **Information**: This section displays all the topic information presented to a user when an option for this topic is [socialized in the catalog](../publishing-options).
- ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") **Options**: This section displays all the options created for this topic. Options can be provided or removed by [creating an option](#create_option) or [deleting an option](#deleting-an-option).
- **Manage**: This section displays the current [lifecycle status](#option-lifecycle-states) of your options for this topic in {{site.data.reuse.eem_name}}, including [the ability for users to discover and subscribe to](../publishing-options) your option and [the current set of subscribed users of your option](../managing-user-access-to-options).

You can also [delete](#deleting-a-topic) your topic from this page, or [export this topic for use with IBM API Connect](../../integrating-with-apic/export-asyncapi/).

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

## ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") Creating an option
{: #create_option}

To create an option, complete the following steps. 

1. In the navigation pane, click **Topics**.
1. Click the topic that you want to work with. 
1. Click the **Options** tab on the **Topic detail** page. 
1. Click **Create option**. The **Details** pane is displayed.
1. In the **Option** field, provide a name for your option.
1. In the **Alias** field, provide a valid Kafka topic name.  

   **Note**: The alias must meet the following conditions:
      - Be less than 200 characters in length, 
      - Have no white space included,
      - Must not use invalid characters: `'/', '\\', ',', '\u0000', ':', '"', '\'', ';', '*', '?', ' ', '\t', '\r', '\n', '='`
1. In the description field, provide a description of your option.
1. Click **Next**. The **Controls** pane is displayed.
1. (Optional) If you want to add controls, click **Add control**. For more information about controls, see [adding controls to options](../option-controls).
1. Click **Next**. The **Publish option** pane is displayed.
1. If you're ready to publish your option, click **Publish**. For more information about publishing options, see [publishing options](../publishing-topics).
1. To complete the option, click **Save**.

## Editing an option
{: #edit_option}

To edit an option's details, complete the following steps. 

1. In the navigation pane, click **Topics**.
1. Click the topic that you want to work with. 
1. Click the **Options** tab on the **Topic detail** page.
1. For the option that you want to edit, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A pop-up window to edit your option is displayed.
1. In the **Details** pane, edit the fields that you want to change. 

    **Note**: 
    - Restrictions and validation checks ensure each field meets requirements for options.
    - The **Alias** is only editable when the option is in an [unpublished state](#option-lifecycle-states).
1. After you make changes, click **Save**.
1. To cancel changes, click **Cancel**.


## Option lifecycle states
{: #option-lifecycle-states}

After adding an option to a topic in {{site.data.reuse.eem_name}}, the option can have different lifecycle states. The lifecycle state of your option determines whether it can be [subscribed](../../consume-subscribe/subscribing-to-topics) to by users and [socialized in the catalog](../../consume-subscribe/discovering-topics).

The lifecycle of an option in {{site.data.reuse.eem_name}} progresses as follows:

- **Unpublished**: This option is not socialized in the **Catalog**. It cannot be subscribed to by other users and has no current subscriptions.
- **Published**: This option is socialized in the **Catalog**. Users can create new subscriptions to use it.
- **Archived**: This option is socialized in the **Catalog** and has existing subscriptions. Users cannot create new subscriptions to use it.

The **Options** tab on the **Topic detail** page allows users to manage a topics options and the state of an option is shown in the status field of the option's tile. 

To change the lifecycle state of an option, complete the following steps.

1. In the navigation pane, click **Topics**.
1. Click the topic that you want to work with. 
1. Click the **Options** tab on the **Topic detail** page.
1. For the option that you want to edit, click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/editPen.svg "Diagram showing edit icon."){:height="30px" width="15px"}. A pop-up window to edit your option is displayed.
1. In the side bar, click **Publish option**. You can see the option's current state and a button to advance it to the next state in this pane.

    - To change the **Unpublished** state to **Published**, click **Publish**.
    - To change the **Published** state to **Archived**, click **Archive**.
      - **Note:** This option is only available if a published topic has subscribers.
    - To change the **Published** state to **Unpublished**, click **Unpublish**.
      - **Note:** This option is only available if a published topic has no current subscribers.
    - To change the **Archived** state to **Published**, click **Publish**.
1. After you make changes, click **Save**.
1. To cancel changes, click **Cancel**.

**Note:** **Archived** options automatically return to the **Unpublished** state when all subscribers have their [subscriptions revoked](../managing-user-access-to-options#revoking-subscriptions) from using this topic.

An option can be [edited](#edit_option) in any lifecycle state. However, the set of fields that can be edited is restricted when in **Published** or **Archived** states to prevent changes that cause runtime issues for subscribed users.

**Note:** Only **Unpublished** options can [be deleted from {{site.data.reuse.eem_name}}](#deleting-an-option).

## Deleting a topic

A topic can be deleted from {{site.data.reuse.eem_name}} only if it has **Unpublished** options. Deleting a topic removes all details about your topic.

To delete a topic from {{site.data.reuse.eem_name}}, complete the following steps. 

1. In the navigation pane, click **Topics**.
1. Find the topic that you want to work with and ensure that the Option status is 0 published. All options in the **Unpublished** state will have a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the table.
1. Click the topic that you want to work with. 
1. Open the **Manage** tab within the **Topic detail** page for your **Unpublished** topic, and select **Delete topic**.
1. Confirm the topic that you want to delete by entering the topic name.
1. Click **Delete**. (**Delete** is visible in the footer if you entered the topic name that you want to delete correctly).

Topics can also be deleted from the **Topics** page. Only topics with **Unpublished** options contain a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the topic table. To delete a topic from the **Topics** page, click the delete icon and follow steps 5-6 above.

## Deleting an option

An option can be deleted from a topic if it's in an **Unpublished** state. Deleting an option removes all the details and controls about the option but the topic will remain. To move your option into a state so that you can delete it, refer to the different [lifecycle states](#option-lifecycle-states) of an option.

To delete an option from {{site.data.reuse.eem_name}}, complete the following steps. 

1. In the navigation pane, click **Topics**.
1. Find the topic that the option belongs to and ensure that the Option status is 0 published. All options in the **Unpublished** state will have a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the topic table.
1. Click the topic that you want to work with. 
1. Open the **Options** tab within the **Topic detail** page. 
1. For the option that you want to delete, click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"}.
1. Enter the name of the option to confirm the option that you want to delete. 
1. Click **Delete**. (**Delete** is visible in the footer if you entered the topic name that you want to delete correctly).