---
title: "Event nodes"
excerpt: "Event Processing provides a set of nodes to create event stream processing flows"
categories: nodes
slug: eventnodes
toc: true
---

The following event nodes are available in {{site.data.reuse.ep_name}}:

- [Event source](#event-source)
- [Event destination](#event-destination)

## Time-based calculations

[Event time](../../about/key-concepts#event-time) is essential to measure the progress of time and perform time-based calculations. 
The temporal order of events processed by a flow must be guaranteed.
**Aggregate**, **Window top-n**, and **Interval Join** work with time windows, whose boundaries are defined by event times.

The event time is usually a business property available in the payload of input messages, such as the timestamp
of an order, a financial transaction or the last reading of a temperature sensor.

In order to work with event time, you need to define the event's timestamps:

- You choose the event property to use as the event time when you define the [event structure](#define-event-structure).
- The event time must be a [timestamp](#type-mapping) property.

If you choose to use the message timestamp provided by Kafka,
the event time depends on when the message is produced to the Kafka topic,
which might not accurately reflect when the event actually occurred.

## Event source

A source node consumes messages from a Kafka topic to produce a stream of events temporally ordered by event time.

### Adding a source node

To add a source node, follow these steps:

1. In the **Palette**, under **Events**, drag the **Event source** node into the canvas.
2. Hover over the node and click the **Edit** icon
![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} to configure the node.

The **Configure event source** window appears.

### Configuring a source node

To configure an event source, complete the following steps.

#### Add an event source or select a recent one

You can either add a new event source by clicking **Add event source**, or you can select a recent topic from the list of available topics.

1. To configure an event source with a new topic, click **Add event source**. If you want to reuse an existing topic, select a topic from the list of topics.
2. Click **Next**.

**Important:**  When an event source is connected to a Kafka topic defined with more than one partition, the following rules apply:

- Events sent in a Kafka message that include a key are delivered to the same partition of the topic.
- Events that are sent in a Kafka message without a key are delivered to any partition of the topic.
- The [event time](../../about/key-concepts#event-time) of the event source is propagated to the downstream nodes on the canvas based on the following criteria:
    - Kafka has assigned at least one event to each partition of the topic.
    - The minimum event time of all the unprocessed events in the partitions of the topic is taken.
    - For all the unprocessed events that are sent by the event source (in a partition of the topic), the minimum event time is considered as the event time.

#### Details

{{site.data.reuse.node_details}}

#### Connect to Kafka cluster

Kafka runs as a cluster of one or more servers. These servers are called brokers. To establish a connection to the Kafka cluster, provide the address of one or more brokers that can be used to set up the connection, and used as bootstrap servers.

In the **Connect to Kafka cluster** section, provide the broker address or addresses of the Kafka cluster that you want to connect to as bootstrap servers. You can get the broker addresses for the event source from your cluster administrator.

**Note:** To add more addresses, click **Add URL +** and enter the server address.

If your topics are published in {{site.data.reuse.eem_name}}, follow the [{{site.data.reuse.eem_name}}]({{ 'eem/consume-subscribe/setting-your-application-to-consume' | relative_url }}) documentation to retrieve the bootstrap server address. If your topics are available in {{site.data.reuse.es_name}}, retrieve the bootstrap server address as described in the [{{site.data.reuse.es_name}}]({{ 'es/getting-started/connecting' | relative_url }}) documentation.


#### Access credentials

Based on the inputs your cluster administrator provided for setting up the Kafka cluster, you might see one of the following set up:

- SSL-only or plain text (without security) bootstrap server URLs:

  1. In the **Access Credentials** section, **Connection credential not required** is displayed and you do not have to set up any access credentials.
  2. Click **Next**.

- SASL-only or SSL-SASL setup:

  SASL mechanisms can be used to authenticate clients connecting to the Kafka cluster. The common SASL mechanisms supported by Kafka are as follows:

    - **PLAIN:** The PLAIN mechanism is a simple username and password-based authentication mechanism, which transmits credentials in plain text, so it is crucial to use SSL or TLS encryption in conjunction with PLAIN to secure the authentication process.

    - **Salted Challenge Response Authentication Mechanism (SCRAM):** SCRAM-SHA-256 and SCRAM-SHA-512 are SASL mechanisms that use a challenge-response mechanism to authenticate clients securely. The client and server exchange challenges and responses based on the user credentials, and the password is not sent in plain text.

  Retrieve the credentials from your cluster administrator and complete the following steps.

  1. In the **Access Credentials** section, select the security mechanism from the drop-down menu.
  2. Provide the username and password for this cluster. If you are subscribed to the topic by using {{site.data.reuse.eem_name}}, see the [{{site.data.reuse.eem_name}}]({{ 'eem/consume-subscribe/subscribing-to-topics/' | relative_url }}) documentation. If you are using {{site.data.reuse.es_name}} to access your Kafka resources, see the [{{site.data.reuse.es_name}}]({{ 'es/security/managing-access/#managing-access-to-kafka-resources' | relative_url }}) documentation.

  3. Click **Next**.

#### Topic selection

The list of topics that are hosted in this Kafka cluster is displayed. Select a topic from where you want to receive the stream of events. By default, the first topic in the displayed list is selected.

You can use the search pane to search for a particular topic.

1. As you start typing the topic name in the search pane, you get a filtered list of matching topics.
2. Select the radio button ![radio button]({{ 'images' | relative_url }}/radio-button.svg "Diagram showing unchecked radio button."){:height="30px" width="15px"} of the topic you want.

After selecting the topic ![radio button]({{ 'images' | relative_url }}/radio-button-checked.svg "Diagram showing checked radio button."){:height="30px" width="15px"}, click the **Next** button at the bottom right of the page.

#### Define event structure

To define the [event](../../about/key-concepts#event) structure, you must define the structure of messages consumed from the Kafka topic:

1. Select **Upload a schema or sample message**
2. Select how you want to define the structure:

  - **Topic schema** to define the structure from an Apache Avro schema of type **record** whose primitive fields are of Avro type `string`, `int`, `long`, `float`, `double`, or `boolean`.
  - **Sample message** to derive the structure from a sample JSON event. The event properties must use the primitive JSON data types `string`, `number`, or `boolean`.


After you have provided a valid schema or sample message, click **Done**.

##### Event properties

- All message properties are selected by default to define the structure of source events.
- You can unselect properties that are not relevant.

Once the event source is configured you will be able to rename properties by connecting a transform node to the event source.

##### Type mapping

Default types are assigned depending on how you defined the structure of the message:
- If you defined the structure from a sample JSON event, the event property type is set to `String`, `Boolean`, `Integer`, `Big integer`, `Double`, or `Float` depending on the message.
- If you defined the structure by using an Avro schema, the default event property type is mapped from the following Avro type:

  | Avro type         | Event property type |
  |-------------------|---------------------|
  | `string`          | `STRING`            |
  | `boolean`         | `BOOLEAN`           |
  | `int`             | `INTEGER`           |
  | `long`            | `BIGINT`            |
  | `float`, `double` | `DOUBLE`            |


You select the type to assign to a property from the list **Type mapping**:
- [STRING](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/types/#varchar--string){:target="_blank"}
- [BOOLEAN](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/types/#boolean){:target="_blank"}
- [INTEGER](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/types/#int){:target="_blank"}
- [BIGINT](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/types/#bigint){:target="_blank"}
- [DOUBLE](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/types/#double){:target="_blank"}
- [DATE](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/types/#date){:target="_blank"}
- [TIME](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/types/#time){:target="_blank"}
- [TIMESTAMP](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/types/#timestamp){:target="_blank"}
- [TIMESTAMP_LTZ](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/types/#timestamp_ltz){:target="_blank"}

You must assign an appropriate type to each event property:
- Events property value must be valid against the type you assign, otherwise the event source will not be
  able to parse the value.
- Events property values that cannot be parsed according to its assigned type will be defaulted to `null`, which could eventually lead to the failure of the processing Job.
- Timestamp properties must conform the [SQL format standard](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/connectors/table/formats/json/#json-timestamp-format-standard){:target="_blank"}.

#### Define the event time

- You select which property to use as event time from the list **Source of event time** only when the event
structure contains at least one property of type `TIMESTAMP` or `TIMESTAMP_LTZ`.

- If you select the option **Use message timestamp provided by Kafka**, or when the event structure does not 
contain a property of type `TIMESTAMP` or `TIMESTAMP_LTZ`, a new timestamp property whose name is defined
by **Event Property name** will be generated and added to all events. 

#### Event time delay

You select the event time delay to allow reordering source events based on their event time. It ensures
that all events that flow to subsequent nodes are ordered based on their event time.
This delay is used to configure the [Flink Bounded out of orderness watermark strategy](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/sql/create/#watermark){:target="_blank"}.


After you have set up the event source node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} 
appears on the event source node if the event source node is configured correctly. 
If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.


## Event destination

The event destination node delivers the processed stream of events to a Kafka topic for further processing or storage.

### Adding an event destination node

To add an event destination node, follow these steps:

1. In the **Palette**, under **Events**, drag the **Event destination** node into the canvas.
2. Hover over the node and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} to configure the node.

The **Configure event destination** window appears.

### Configuring an event destination node 

To configure an event destination, complete the following steps.

1. Contact your cluster administrator, and retrieve the details of the Kafka cluster and the topic that you want to write your processed events to.
2. Follow the [instructions to configure a source node](#configuring-a-source-node).
3. After you have set up the event destination node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} 
appears on the event destination node if the event destination node is configured correctly. 
If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.

![Event Processing 1.0.5 icon]({{ 'images' | relative_url }}/1.0.5.svg "In Event Processing 1.0.5 and later") User actions are saved automatically. For save status updates, see the canvas header.

- **Saving** ![Saving]({{ 'images' | relative_url }}/save_inprogress.png "Diagram showing save is in progress."){:height="30px" width="15px"} indicates that saving is in progress.
- **Saved** ![Save successful]({{ 'images' | relative_url }}/save_successful.png "Diagram showing save is successful."){:height="30px" width="15px"} confirms success.
- **Failed** ![Save failed]({{ 'images' | relative_url }}/save_error.png "Diagram showing that the save is failed."){:height="30px" width="15px"} indicates that there are errors. If an action fails to save automatically, you receive a notification to try the save again. Click **Retry** to re-attempt the save. When a valid flow is saved, you can proceed to run the job.

If you are running versions earlier than 1.0.5, click **Save** in the navigation banner to save the flow.
