---
title: "Adding controls to options"
excerpt: "Find out how you can add controls to options"
categories: describe
slug: option-controls
toc: true
---

You can add controls to options so that you have greater management over how event data is presented to consumers. For instance, you can use the approval control to manage who can subscribe to your event endpoint, the schema filtering control ensures message structure consistency, and redaction hides sensitive data. 

Options can use each of the control types in combination to allow you to manage how events are consumed. 

**Note:** You cannot delete or edit controls after the option containing them has been published.

## Universal controls
{: #universal-controls}

You can apply universal controls to options for both consume and produce-enabled event sources.

### Approval
{: #approval-controls}

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") When an option is published, it is available for everyone in your organization to view. If you want to control who can subscribe to your option, you can add an approval control. When an option is set up with approval enabled, a viewer must submit a request to subscribe to the option. The request includes a reason to justify the need for a subscription along with the requesters contact information. The option owner can then approve or reject the request as required.

**Note:** A viewer can only have one request for a subscription to an option open at a time.

To add the approval control to an option, complete the following steps.

1. In the navigation pane, click **Topics**.
1. Find the topic that you want to work with in the list, and click the name of the topic.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-topics#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Approval** tile.
1. Click **Add control**. The approval control is added to the table of controls.
1. To save the new control for this option, click **Next** > **Save**.

The option tile is updated to show that the approval control is added. The option now requires viewers to create a request to justify having a subscription to your topic.

#### Viewing requests
{: #viewing-requests}

As the owner of an event source with an option that has approval enabled, you can view requests from the event source or from the access requests page.

#### To view requests from an event source
{: #viewing-requests-from-event-source}

To view requests for all the options that have approval enabled, complete the following steps.

1. In the navigation pane, click **Topics**.
1. Find the topic that you want to work with in the list, and click the name of the topic.
1. Click the **Manage** tab for this topic.
1. Click **Requests** to see a list of all of the requests made against this event source.

#### To view requests from Access requests
{: #viewing-requests-from-option}

To view requests from the access request page, complete the following steps.

1. In the navigation pane, click **Access**. The **Access requests** page is displayed.
1. All the requests against options that you own are displayed.

In each case the contact details of the requester and which option the request is for is displayed within the table.

#### Approving or rejecting requests
{: #approving-rejecting-requests}

To approve or reject requests, complete the following steps.

1. For the request you want to review, click **View request** . An approval pop-up window appears. All the details about the request including the event source, option, contact details of the requester and the justification for the request is displayed.
1. Review the information that is provided and click **Approve** or **Reject** as required.

When a request is approved, the viewer can make a new subscription.

## Consume controls
{: #consume-controls}

You can apply the following controls to options for consume-enabled event sources only.

### Redaction
{: #redaction}

![Event Endpoint Management 11.1.2 icon]({{ 'images' | relative_url }}/11.1.2.svg "In Event Endpoint Management 11.1.2 and later") If you want to control what data from your topic can be viewed, you can add a redaction control. When an option is set up with redaction control, a subscriber will have certain field values hidden as configured in the control. This means that users can consume topics without the fear of leaking sensitive data. 

You can add multiple redaction controls to one option.

#### Before you begin:

You can use a redaction control with topics that use an Avro schema, and for topics without a schema that have JSON formatted messages only. This is because the {{site.data.reuse.egw}} needs to know the schema and how the data in the topic is encoded. For this reason, you must ensure that:

- For topics with an Avro schema:
  - An Avro schema is added to the topic.
  - The topic content is encoded as `avro/json` or `avro/binary`. By default, encoding for all topics is set to unknown.

- For topics without a schema:
  - The topic content is encoded as `application/json`. By default, encoding for all topics is set to unknown.

To add a schema or provide the encoding, [edit the topic information window](../managing-topics#edit-topic).

#### Steps:

To add a redaction control to an option, complete the following steps.

1. In the navigation pane, click **Topics**.
1. Find the topic that you want to work with in the list, and click the name of the topic.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-topics#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Redaction** tile.
1. Click **Next**. The **Add redaction control** window is displayed.
1. In the **Property to redact** field, add a valid JSON path to the property in the Kafka message or select a property from the schema.

   **Note:** In {{site.data.reuse.eem_name}} versions 11.1.4 and earlier, if using the recursive descent operator (`..`) in the JSON path alongside an Avro schema for redaction, the {{site.data.reuse.egw}} does not redact anything that is contained within an array.  
   ![Event Endpoint Management 11.1.5 icon]({{ 'images' | relative_url }}/11.1.5.svg "In Event Endpoint Management 11.1.5 and later") This is resolved in {{site.data.reuse.eem_name}} 11.1.5 and later versions.

1. Optional: If you select a property from the schema in the right side panel, to quickly find the property that you want to use, type the first letter of the property or use the icons to expand the schema as required.
1. Select a redaction type:

   | Type | Description | Valid types |
   | ------ | ------  |  -------- |
   | Replace value | Replaces the value with another value of a fixed length. | String, Number, Date |
   | Hash value | Replaces the value with hashes. Allows values to be correlated by exact values even when they are unknown. | String |
   {: table}
   
   **Note:** The replace value options are different depending on whether the option has a schema added to the associated topic.
1. Optional: If a schema is NOT associated with the topic and you select **Replace value**, in the **Replace value with** field, select the type of the value you wish to replace with from **String**, **Int** or **Double**.  

   **Important:** If a schema is NOT associated with the topic, {{site.data.reuse.eem_name}} cannot verify that the input for the value at the JSON path matches the type. If these do not match then the whole message will be redacted. If you want to add a schema now, [edit the topic information window](../managing-topics#edit-topic).
1. Optional: If a schema is associated with the topic and you select **Replace value**, in the **Replace value with** field, enter a valid value. If you enter an invalid value, an error message is displayed to indicate what the problem is so that you can resolve it in order to proceed.
1. If you select **Hash value**, select the hash algorithm that you want to use.
   
   **Note:** If the property that you select has a maximum length value associated with it as defined in the Avro schema, the **Hash value** option is disabled if it would produce a string that would be longer than the maximum field length. 
      * `SHA-256` produces a string of 64 characters.
      * `SHA-512` produces a string of 128 characters.
1. Click **Add control**. A redaction control is added to the table.
1. To save the new control for this option, click **Next** > **Save**.

The option tile is updated to show that a redaction control is added. If you need to edit or delete a redaction control at a later stage, return to the **Edit option** window and use the **Edit** or **Delete** icons as required.

### Schema filtering
{: #schema-filter}

![Event Endpoint Management 11.1.2 icon]({{ 'images' | relative_url }}/11.1.2.svg "In Event Endpoint Management 11.1.2 and later") You can add the schema filtering control to manage how the data in your topic is presented. The schema filtering control is either on or off. It removes events that do not match the schema provided in the topics' event information. It prevents clients from receiving bad messages which could result in the client crashing.

When an option is set up with schema filtering enabled, a subscriber only has access to the fields determined by the schema that you add to the topics' event information window.

#### Before you begin:

If a schema is not associated with the topic, the option to add the schema filtering control is disabled. The schema filtering control can only be applied to events that use an Avro schema. As well as the schema, the {{site.data.reuse.egw}} needs to know how the data in the topic is encoded. For this reason, you must ensure that:

- An Avro schema is added to the topic.
- The topic content is encoded as `avro/json` or `avro/binary`. By default, encoding for all topics is set to unknown.

To add a schema or provide the encoding, [edit the topic information window](../managing-topics#edit-topic).

#### Steps:

To add the schema filtering control to an option, complete the following steps.

1. In the navigation pane, click **Topics**.
1. Find the topic that you want to work with in the list, and click the name of the topic.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-topics#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Schema Filtering** tile.
1. Click **Add control**. The schema filtering control is added to the table.
1. To save the new control for this option, click **Next** > **Save**.

The option tile is updated to show that the schema filtering control is added. If you want to delete the schema filtering control at a later stage, return to the **Edit option** window and click **Delete**.

## Produce controls
{: #produce-controls}

You can apply the following control to options for produce-enabled event sources only.

### Schema enforcement
{: #schema-enforcement}

![Event Endpoint Management 11.1.5 icon]({{ 'images' | relative_url }}/11.1.5.svg "In Event Endpoint Management 11.1.5 and later") You can add the schema enforcement control to manage the kind of data a client can write to your topic. When an option is set up with schema enforcement enabled, a subscriber can only produce events to the topic that comply with the schema that you add to the topic's event information.

**Note:** When sending messages to an event endpoint, the Kafka protocol might group multiple messages together into a single batch. This means that if a single message in the batch does not conform to the schema, the entire batch is rejected and none of the messages are written to the event endpoint. 

#### Before you begin:

If a schema is not associated with the topic, the option to add the schema enforcement control is disabled. The schema enforcement control can only be applied to events that use an Avro schema. In addition to the schema, the {{site.data.reuse.egw}} also requires information about how the data in the topic is encoded. For this reason, you must ensure that:

- An Avro schema is added to the topic.
- The topic content is encoded as `avro/json` or `avro/binary`. By default, encoding for all topics is set to unknown.

To add a schema or provide the encoding, [edit the event source information that represents the topic](../managing-topics#edit-topic).

#### Steps:

To add the schema enforcement control to an option, complete the following steps.

1. In the navigation pane, click **Topics**.
1. Find the topic that you want to work with in the list, and click the name of the topic.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-topics#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Schema Enforcement** tile.
1. Click **Add control**. The schema enforcement control is added to the table.
1. To save the new control for this option, click **Save**.

The option tile is updated to show that the schema enforcement control is added. If you need to delete the schema enforcement control at a later stage, return to the **Options** tab, click ![More options icon]({{ 'images' | relative_url }}/more_options.png "The more options icon."){:height="30px" width="15px"} **More options** and select **Delete**.