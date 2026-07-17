---
title: "Managing event data controls"
excerpt: "Find out how to configure event data controls for your virtual topics."
categories: describe
slug: event-data-controls
toc: true
---

When you create or edit a [virtual topic](../managing-virtual-topics), you can add event data controls to manipulate and manage the event data that is received from or sent to the virtual topic. 

The types of event data controls and how to configure them are described in this topic.

You must add controls to a virtual topic either when you create the virtual topic, or before you publish the virtual topic. If you want to modify the controls on a published virtual topic, then you must unpublish it first.

To access the **Event data controls** pane for a virtual topic, follow these steps:
{: #edit-controls}
1. In the navigation pane, click **Manage > Topics**.
2. Find the source topic that you want to work with in the list, and click the name of the topic.
3. Click the **Virtual topics** tab.
4. Click **Create virtual topic** or edit an existing virtual topic. 
5. Click **Event data controls** in the left pane. If you are creating a new virtual topic, then you must specify a name and alias for the virtual topic and click **Next** to access the **Event data controls** pane.

## Quota enforcement
{: #quota-enforcement}

If you want to control the rate at which data is produced to or consumed from your virtual topic, you can use the quota enforcement control. When a virtual topic is set up with the quota enforcement control, a client is able to send or consume messages until the quota is exceeded. When the quota is exceeded, the {{site.data.reuse.egw}} stops the client from producing or sending more messages until the client's activity falls below the specified quota.

You can define the quota as average megabytes per second, average messages per second, or both. If you enable both quotas, then the {{site.data.reuse.egw}} pauses the client connection when the first quota is reached.

If quotas are enabled on the remote Kafka cluster, any throttling that is applied by the Kafka broker is considered when the most restrictive quota is determined.

The gateway enforces the quota by monitoring the use per connection and pausing the socket for that connection for a delay that brings the client's usage under the specified quota. This enforcement can result in message spikes during periods of high load. 

The quota is enforced on a per connection basis. If you set a quota of 1000 messages per second on a topic with 3 partitions, a client can produce or consume 3000 messages before the gateway pauses the client.

To configure quota enforcement, enable it in the [**Event data controls**](#edit-controls) pane.

## Redaction (consume-enabled topics only)
{: #consume-redaction}

Use a redaction control to redact specific data from the events returned by the virtual topic. For example, if the events returned include fields that contain personal information that you do not want clients to see, you can create a control to redact these fields. 

A virtual topic can have multiple redaction controls.

Redaction controls are supported for any topic that uses an Avro or a JSON schema, or for any topic that does not have a schema, but has JSON-formatted messages. 

You must ensure that:

- For topics with an Avro schema:
  - An Avro schema is added to the topic.
  - The message format is Avro-encoded JSON or Avro-encoded binary. 

- For topics with a JSON schema:
  - A JSON schema is added to the topic.
  - The message format is JSON.

- For topics without a schema:
  - The message format is JSON.

To add a schema or provide the message format, [edit the topic](../managing-source-topics#edit-source-topic).

To configure a redaction control in the [**Event data controls**](#edit-controls) pane, follow these steps:

1. In the **Property to redact** field, enter the JSON path to the property. If a schema is defined for the topic, then you can select a property from the schema displayed in the section on the right.

   To redact specific fields, you can use a wildcard in an array of objects or all values in an array of simple types. For example:  

   * To redact all of the strings in `myArrayOfStrings`, use `$.myObject.myArrayOfStrings[*]` 
   * To redact the `ssn` field in the `employees` array, use `$.myObject.employees[*].ssn` 

   **Note:** Wildcard redaction of array types in Avro unions is not supported.  

2. Select the redaction type:

   * **Replace value**: Replaces the value with another value that you provide. If a schema is defined for the topic, then the replacement value must match the field type that is defined in the schema. If a schema is not defined for the topic, then you must specify whether the replacement value is of type String, Int, or Double.

     **Important**: If a schema is not defined for the topic, {{site.data.reuse.eem_name}} cannot verify that the input for the value at the JSON path matches the type. If the types do not match, then the whole message is redacted. If you want to add a schema now, you can do so by [editing the topic](../managing-source-topics#edit-source-topic).

   * **Hash value**: Replaces the value with a hash value that is generated from the original value. Hash value replacement is available for strings only. Select the hash algorithm that you want to use:

      * `SHA-256` produces a string of 64 characters.
      * `SHA-512` produces a string of 128 characters.

      **Note:** If topic schema defines a maximum length for the value that you are redacting, and that length is shorter than the hash strings, then the **Hash value** option is disabled.


## Schema filtering (consume-enabled topics only)
{: #schema-filter}

You can enable the schema filtering control in the [**Event data controls**](#edit-controls) pane to remove events that do not match the schema that is defined for your topic.

If a schema is not defined for the topic, then the schema filtering control is disabled.

You must ensure that:

- For topics with an Avro schema:
  - An Avro schema is added to the topic.
  - The message format is Avro-encoded JSON or Avro-encoded binary.

- For topics with a JSON schema:
  - A JSON schema is added to the topic.
  - The message format is JSON.

To add a schema to your topic, [edit the topic details](../managing-source-topics#edit-source-topic).

**Note:** The Kafka protocol can group multiple messages together into a single batch. If a single message in the batch does not conform to the schema, the entire batch is rejected and none of the messages are written to the virtual topic. 


## Schema enforcement (produce-enabled topics only)
{: #produce-controls-schema-enforcement}

You can enable the schema enforcement control in the [**Event data controls**](#edit-controls) pane to manage the data that a client can write to a virtual topic. When a virtual topic is set up with schema enforcement enabled, a client can produce only events to the virtual topic that comply with the schema that is defined for the topic. 

If a schema is not defined for the topic, then the schema enforcement control is disabled.

You must ensure that:

- For topics with an Avro schema:
  - An Avro schema is added to the topic.
  - The message format is Avro-encoded JSON or Avro-encoded binary.

- For topics with a JSON schema:
  - A JSON schema is added to the topic.
  - The message format is JSON.

To add a schema to your topic, [edit the topic details](../managing-source-topics#edit-source-topic).

## Content filtering (consume-enabled topics only)
{: #content-filtering}

If you want to control which events are delivered to subscribers, you can apply filters to event content. You can define rules based on event properties or subscriber data, so that only relevant events are delivered through a virtual topic.

A virtual topic can have only one content filtering control.

Content filtering controls are supported for any topic that uses an Avro or a JSON schema, or for any topic that does not have a schema, but has JSON-formatted messages.

You must ensure that:

- For topics with an Avro schema:
  - An Avro schema is added to the topic.
  - The message format is Avro-encoded JSON or Avro-encoded binary.
- For topics with a JSON schema:
  - A JSON schema is added to the topic.
  - The message format is JSON.
- For topics without a schema:
  - The message format is JSON.

To add a schema or provide the message format, [edit the topic](../managing-source-topics#edit-source-topic).

To configure a content filtering control in the [**Event data controls**](#edit-controls) pane, follow these steps:

1. In the **Property** field, enter the JSON path to the property. If a schema is defined for the topic, then you can select a property from the schema displayed in the section on the right.
1. Select the comparison value source:

   * **Fixed value**: Compares the property to a fixed value. The value must match the property’s data type.

   * **Subscriber data**: Compares the property to a value from the subscriber’s data. For example, the User ID.
1. (Optional) If you selected **Fixed value**, in the **Value to match** field, enter a value that matches the property’s data type.
1. (Optional) If you selected **Subscriber data**, in the **Subscriber data** field, select one of the following options:

   * **User ID**: Uses the authenticated ID of the connected user.  

     **Note:** For SASL credentials, this corresponds to the SASL username. For SASL OAuth, it corresponds to the access token subject.

   * **Client ID**: Uses the Client ID of the connected client application.  
      


