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

When an option is published, it is available for everyone in your organization to view. If you want to control who can subscribe to your option, you can add an approval control. When an option is set up with approval enabled, a viewer must submit a request to subscribe to the option. The request includes a reason to justify the need for a subscription along with the requesters contact information. The option owner can then approve or reject the request as required.

**Note:** A viewer can only have one request for a subscription to an option open at a time.

To add the approval control to an option, complete the following steps.

1. In the navigation pane, click **Manage topics**.
1. Find the event source that you want to work with in the list, and click the name of the event source.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-options#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Approval** tile.
1. Click **Add control**. The approval control is added to the table of controls.
1. To save the new control for this option, click **Next** > **Save**.

The option tile is updated to show that the approval control is added. The option now requires viewers to create a request to justify having a subscription to your event source.

#### Viewing requests
{: #viewing-requests}

As the owner of an event source with an option that has approval enabled, you can view requests from the event source or from the access requests page.

#### To view requests from an event source
{: #viewing-requests-from-event-source}

To view requests for all the options that have approval enabled, complete the following steps.

1. In the navigation pane, click **Manage topics**.
1. Find the event source that you want to work with in the list, and click the name of the event source.
1. Click the **Manage** tab.
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

If you want to control what data from your event source can be viewed, you can add a redaction control. When an option is set up with redaction control, a subscriber will have certain field values hidden as configured in the control. This means that users can consume event data without the fear of leaking sensitive data. 

You can add multiple redaction controls to one option.

#### Before you begin:

Redaction control is supported for any event source that uses an Avro or a JSON schema, or for any event source that does not have a schema, but has JSON-formatted messages. In addition to the schema, the {{site.data.reuse.egw}} also requires information about how the data in the event source is encoded.

For this reason, you must ensure that:

- For event sources with an Avro schema:
  - An Avro schema is added to the event source.
  - The message format is `Avro-encoded JSON` or `Avro-encoded binary`. By default, the message format for all event sources is set to unknown.

- For event sources with a JSON schema:
  - A JSON schema is added to the event source.
  - The message format is `JSON`. By default, the message format for all event sources is set to unknown.

- For event sources without a schema:
  - The message format is `JSON`. By default, the message format for all event sources is set to unknown.

To add a schema or provide the encoding, [edit the information window of the event source](../managing-event-sources#edit-event-source).

#### Steps:

To add a redaction control to an option, complete the following steps.

1. In the navigation pane, click **Manage topics**.
1. Find the event source that you want to work with in the list, and click the name of the event source.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-options/#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Redaction** tile.
1. Click **Next**. The **Add redaction control** window is displayed.
1. In the **Property to redact** field, add a valid JSON path to the property in the Kafka message or select a property from the schema.
1. Optional: If you select a property from the schema in the right side panel, to quickly find the property that you want to use, type the first letter of the property or use the icons to expand the schema as required.
1. Select a redaction type:

   | Type | Description | Valid types |
   | ------ | ------  |  -------- |
   | Replace value | Replaces the value with another value of a fixed length. | String, Number, Date |
   | Hash value | Replaces the value with hashes. Allows values to be correlated by exact values even when they are unknown. | String |
   {: table}
   
   **Note:** The replace value options are different depending on whether the option has a schema added to the associated event source.
1. Optional: If a schema is not associated with the event source and you select **Replace value**, in the **Replace value with** field, select the type of the value you wish to replace with from **String**, **Int** or **Double**.  


   **Important:** If a schema is not associated with the event source, {{site.data.reuse.eem_name}} cannot verify that the input for the value at the JSON path matches the type. If these do not match then the whole message will be redacted. If you want to add a schema now, [edit the information window of the event source](../managing-event-sources#edit-topic).

1. Optional: If a schema is associated with the event source and you select **Replace value**, in the **Replace value with** field, enter a valid value. If you enter an invalid value, an error message is displayed to indicate what the problem is so that you can resolve it in order to proceed.
1. If you select **Hash value**, select the hash algorithm that you want to use.
   
   **Note:** If the property that you select has a maximum length value associated with it as defined in the schema, the **Hash value** option is disabled if it would produce a string that would be longer than the maximum field length. 
      * `SHA-256` produces a string of 64 characters.
      * `SHA-512` produces a string of 128 characters.
1. Click **Add control**. A redaction control is added to the table.
1. To save the new control for this option, click **Next** > **Save**.

The option tile is updated to show that a redaction control is added. If you need to edit or delete a redaction control at a later stage, return to the **Edit option** window and use the **Edit** or **Delete** icons as required.

### Schema filtering
{: #schema-filter}

You can add the schema filtering control to manage how the data in your event source is presented. The schema filtering control is either on or off. It removes events that do not match the schema provided in the event source's event information. It prevents clients from receiving bad messages which could result in the client crashing.

When an option is set up with schema filtering enabled, a subscriber only has access to the fields determined by the schema that you add to the event source's event information window.

#### Before you begin:

If a schema is not associated with the event source, the option to add the schema filtering control is disabled. You can apply schema filtering control to events that use an Avro or a JSON schema. In addition to the schema, the {{site.data.reuse.egw}} also requires information about how the data in the event source is encoded.

For this reason, you must ensure that:

- For event sources with an Avro schema:
  - An Avro schema is added to the event source.
  - The message format is `Avro-encoded JSON` or `Avro-encoded binary`. By default, the message format for all event sources is set to unknown.

- For event sources with a JSON schema:
  - A JSON schema is added to the event source.
  - The message format is `JSON`. By default, the message format for all event sources is set to unknown.

To add a schema or provide the encoding, [edit the information window of the event source](../managing-event-sources#edit-event-source).

#### Steps:

To add the schema filtering control to an option, complete the following steps.

1. In the navigation pane, click **Manage topics**.
1. Find the event source that you want to work with in the list, and click the name of the event source.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-options/#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Schema Filtering** tile.
1. Click **Add control**. The schema filtering control is added to the table.
1. To save the new control for this option, click **Next** > **Save**.

The option tile is updated to show that the schema filtering control is added. If you want to delete the schema filtering control at a later stage, return to the **Edit option** window and click **Delete**.

### Quota enforcement
{: #quota-consume}

If you want to control the rate at which data is consumed from your event source, you can add the quota enforcement control. When an option is set up with the quota enforcement control, a subscriber can consume data until the quota is exceeded. At this point, the {{site.data.reuse.egw}} stops the consumer from getting more messages until the usage by this consumer falls below the specified quota.

#### Steps:

To add the quota enforcement control to an option, complete the following steps.

1. In the navigation pane, click **Manage topics**.
1. Find the event source that you want to work with in the list, and click the name of the event source.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-options/#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Quota enforcement** tile.
1. Click **Next**. The **Set a quota** window is displayed.
1. To set a quota for average megabytes per second, toggle the first switch to the **Yes** position and provide a value in the **Average megabytes per second** field.
1. To set a quota for average messages per second, toggle the second switch to the **Yes** position and provide a value in the **Average messages per second** field.  

   **Note:** You can set either one or both of the values and the gateway will pause a client connection for a duration based upon the most restrictive of the two quotas. 
    
   The gateway enforces the quota by monitoring the use per connection and enforcing a throttle delay that brings the clients usage under the given quota. This can result in spiky behavior during periods of high load which you should take into consideration when you choose the value for your quotas. 

   The quota is enforced on a per connection basis. If you set a quota of 1000 messages per second on a topic with 3 partitions, a client will be able to consume 3000 messages before the gateway enforces any quota control on it.
1. Click **Add control**. The quota enforcement control is added to the table.
1. To save the new control for this option, click **Save**.

The option tile is updated to show that the quota enforcement control is added. If you need to edit or delete a quota enforcement control at a later stage, return to the **Edit option** window and use the **Edit** or **Delete** icons as required.

## Produce controls
{: #produce-controls}

You can apply the following control to options for produce-enabled event sources only.

### Schema enforcement
{: #schema-enforcement}

You can add the schema enforcement control to manage the kind of data that a client can write to an event endpoint. When an option is set up with schema enforcement enabled, a subscriber can only produce events to the event endpoint that comply with the schema that you add to the event source's event information. 

**Note:** When sending messages to an event endpoint, the Kafka protocol might group multiple messages together into a single batch. This means that if a single message in the batch does not conform to the schema, the entire batch is rejected and none of the messages are written to the event endpoint. 

#### Before you begin:

If a schema is not associated with the event source, the option to add the schema enforcement control is disabled. You can apply schema enforcement control to events that use an Avro or a JSON schema. In addition to the schema, the {{site.data.reuse.egw}} also requires information about how the data in the event source is encoded.

For this reason, you must ensure that:

- For event sources with an Avro schema:
  - An Avro schema is added to the event source.
  - The message format is `Avro-encoded JSON` or `Avro-encoded binary`. By default, the message format for all event sources is set to unknown.

- For event sources with a JSON schema:
  - A JSON schema is added to the event source.
  - The message format is `JSON`. By default, the message format for all event sources is set to unknown.

To add a schema or provide the encoding, [edit the event source information](../managing-event-sources#edit-event-source).

#### Steps:

To add the schema enforcement control to an option, complete the following steps.

1. In the navigation pane, click **Manage topics**.
1. Find the event source that you want to work with in the list, and click the name of the event source.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-options/#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Schema Enforcement** tile.
1. Click **Add control**. The schema enforcement control is added to the table.
1. To save the new control for this option, click **Save**.

The option tile is updated to show that the schema enforcement control is added. If you need to delete the schema enforcement control at a later stage, return to the **Options** tab, click ![More options icon]({{ 'images' | relative_url }}/more_options.png "The more options icon."){:height="30px" width="15px"} **More options** and select **Delete**.

### Quota enforcement
{: #quota-produce}

If you want to control the rate at which data is produced to your event endpoint, you can add the quota enforcement control. When an option is set up with the quota enforcement control, a producer will be able to send messages until the quota is exceeded. At this point, the {{site.data.reuse.egw}} stops the producer from sending more messages until the producers activity falls below the specified quota.

#### Steps:

To add the quota enforcement control to an option, complete the following steps.

1. In the navigation pane, click **Manage topics**.
1. Find the event source that you want to work with in the list, and click the name of the event source.
1. Click the **Options** tab.
1. Optional: If you want to edit an existing option, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A window to edit your option is displayed.
    * In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Optional: If you are creating a new option, click **Create option**. The details pane is displayed. 
    * Complete the [details](../managing-options/#create_option) pane and click **Next**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Quota enforcement** tile.
1. Click **Next**. The **Add quota control** window is displayed.
1. To set a quota for average megabytes per second, toggle the first switch to the **Yes** position, and provide a value in the **Average megabytes per second** field.
1. To set a quota for average messages per second, toggle the second switch to the **Yes** position, and provide a value in the **Average messages per second** field.   

   **Note:** You can set either one or both of the values and the gateway will pause a client connection for a duration based upon the most restrictive of the two quotas. 

   The gateway enforces the quota by monitoring the use per connection and pausing the socket for that connection for a delay that brings the clients usage under the given quota. This can result in spiky behavior during periods of high load which you should take into consideration when you choose the value for your quotas.  

   The quota is enforced on a per connection basis. If you set a quota of 1000 messages per second on a topic with 3 partitions, a client will be able to produce 3000 messages before the gateway enforces any quota control on it.
1. Click **Add control**. The quota enforcement control is added to the table.
1. To save the new control for this option, click **Save**.

The option tile is updated to show that the quota enforcement control is added. If you need to edit or delete a quota enforcement control at a later stage, return to the **Edit option** window and use the **Edit** or **Delete** icons as required.

