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
**Aggregate**, **Window top-n**, and **Interval Join** use event time to partition the events into results based on time windows.


To use these windowed nodes, you need to configure the event source to include event time as a property:

- If you choose to use the message timestamp provided by Kafka, the event time depends on when the message is produced to the Kafka topic, which might not accurately reflect when the event actually occurred.
- If you choose an event property to use as the event time when you define the [event structure](../../reference/event-structure):
  - The property must be mapped to a [timestamp](../../about/key-concepts#timestamp) datatype.
  - The event source uses [event time](../../about/key-concepts#event-time) to increase the watermark for the event stream. The watermark progresses based on the following criteria:
    - The topic contains a message with an event time greater than the previously seen message

**Important:** When an event source consumes from a Kafka topic with multiple partitions, watermark progression will take account of the event time on each partition and the following rules apply:

- Flink will maintain a watermark for each partition on the Kafka topic.
- The watermark for the event source will be the earliest of the watermarks across each partition.
- If a partition is idle for a period of time (messages are not currently being produced to a partition), the partition will not be included in watermark progression until new messages arrive. This stops the idle partition from blocking watermark progression.

## Event source

A source node consumes messages from a Kafka topic to produce a stream of events temporally ordered by event time.

### Adding a source node

When you create a flow, an event source node is automatically added to your canvas. A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the event source node indicating that the node is yet to be configured.

To add additional event source nodes, in the **Palette**, under **Events**, drag the **Event source** node into the canvas.


### Configuring a source node

To configure an event source, hover over the node and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}. The **Configure event source** window appears.

To configure your event source node, complete the following steps: 

1. In the **Add an event source or pick a recent one.** section, either add an event source by clicking **Add event source**, or select a recent topic from the list of available topics, and then click **Next**.

1. In the **Cluster connection** pane, provide the broker address or addresses of the Kafka cluster that you want to connect to as bootstrap servers, and then click **Next**.

   Kafka runs as a cluster of one or more servers. These servers are called brokers. To establish a connection to the Kafka cluster, provide the address of one or more brokers.  These brokers are used to bootstrap the connection (referred to as bootstrap servers). You do not have to provide addresses for all the brokers in the cluster. You can get the broker addresses for the event source from your cluster administrator.

   A bootstrap server address must be defined in the form: `hostname:port`. For example: `kafkaBoostrapServer:9000`

   If your topics are published in {{site.data.reuse.eem_name}}, follow the [{{site.data.reuse.eem_name}}]({{ 'eem/subscribe/configure-your-application-to-connect' | relative_url }}) documentation to retrieve the bootstrap server address. If your topics are available in {{site.data.reuse.es_name}}, retrieve the bootstrap server address as described in the [{{site.data.reuse.es_name}}]({{ 'es/getting-started/connecting' | relative_url }}) documentation.

   **Note:** To add more addresses, click **Add bootstrap server +** and enter the additional server address.


1. {{site.data.reuse.ep_name}} connects to the Kafka cluster and determine which access mechanisms are enabled on the cluster. In the **Access credentials** section, based on the inputs your cluster administrator provided for setting up the Kafka cluster, you might see one of the following options:

   - SSL-only or plain text (without security) bootstrap server URLs:

     1. In the **Access Credentials** section, **Connection credential not required** is displayed and you do not have to set up any access credentials.
     2. Click **Next**.

   - SASL-only or SSL-SASL setup:

     Retrieve the credentials from your cluster administrator and complete the following steps:

     1. In the **Access Credentials** section, select the security mechanism from the drop-down menu.
     2. Provide the username and password for this cluster. If you are subscribed to the topic by using {{site.data.reuse.eem_name}}, see the [{{site.data.reuse.eem_name}}]({{ 'eem/subscribe/subscribing-to-event-endpoints/' | relative_url }}) documentation. If you are using {{site.data.reuse.es_name}} to access your Kafka resources, see the [{{site.data.reuse.es_name}}]({{ 'es/security/managing-access/#managing-access-to-kafka-resources' | relative_url }}) documentation.
     3. Click **Next**.

1. In the **Topic selection** pane, the list of topics that are hosted in this Kafka cluster is displayed. Select the radio button ![radio button]({{ 'images' | relative_url }}/radio-button.svg "Icon showing unchecked radio button."){:height="30px" width="15px"} of the topic from where you want to receive the stream of events. You can use the search field to get a filtered list of matching topics.

   After selecting the topic ![radio button]({{ 'images' | relative_url }}/radio-button-checked.svg "Icon showing checked radio button."){:height="30px" width="15px"}, click **Next** to go to the **Message format** pane.

1. {{site.data.reuse.ep_name}} introspects the latest message on the topic (assuming there are incoming messages), and detects if the message is in a supported format. If the format cannot be detected, manually choose the correct message format for the topic the event source is connecting to.

   - **Message format is detected:** If the topic contains a message with a supported format, for example, **Avro**, **Avro (schema registry)**, or **JSON**, the message format is auto-selected in the **Message format** drop-down.

     **Note:** If you manually modified the detected format, you can click the **Detect message format** icon ![reset button]({{ 'images' | relative_url }}/rotate--360.svg "Icon showing reset button."){:height="30px" width="15px"} to attempt to detect the format of the topic again.

   - **Message format is undetected:** {{site.data.reuse.ep_name}} does not detect the message format if no message is available in the selected topic. In such cases, you can select the message format from the **Message format** drop-down.

      **Note:** If messages are produced to the topic after the format is undetected, you can attempt to detect the message format by clicking the **Detect message format** icon ![reset button]({{ 'images' | relative_url }}/rotate--360.svg "Icon showing reset button."){:height="30px" width="15px"} after adding new messages to the topic.

   **Note:** In some cases the auto-detected format could not match the actual format of the last message. For more information, see the [troubleshooting](../../troubleshooting/bad-output-from-auto-detection/) to address auto-detection message format issues.

   - **Avro:** The topic contains Apache Avro binary-encoded messages. An Avro schema is required to decode incoming messages and define the structure of the source event. For information about event structure and supported data types, see [event structure definition](../../reference/event-structure/#avro).

   - **JSON:** If a JSON message is detected on the topic, the sample message is pre-populated with the message from the topic. For information about event structure and supported data types, see [event structure definition](../../reference/event-structure/#json).

   - **Avro (schema registry):** The topic contains messages encoded using an Avro schema that is stored in a supported registry. Messages produced in the topic must meet the requirements that are described in [prerequisites](../../installing/prerequisites#schema-registry-requirements). When connected to the schema registry, the source node retrieves the schema from the registry to decode the binary message. The information about the schema registry and the Avro schema is required to define the structure of the source event. To connect to a supported registry that stores the Avro schema, enter the following information and define the structure of the source event:

     1. Before you begin, ensure that the [prerequisites](../../installing/prerequisites#schema-registry-requirements) to connect to a schema registry are met.
     1. In the **Schema registry URL** field, enter the [URL](../../installing/prerequisites/#schema-registry-requirements) to the REST endpoint of the schema registry.

         **Important:** If using an Apicurio schema registry, you must append `/apis/ccompat/v6` to the REST endpoint URL. For example, if you are using {{site.data.reuse.es_name}}, the valid schema registry URL is `https://<schema_registry_endpoint>/apis/ccompat/v6`

     1. In the **Authentication method** field, select **No authentication** or **Basic authentication**, which requires a username and password.

     1. If the message format is auto-detected earlier, click **Next** to auto-populate the Avro schema and {{site.data.reuse.ep_name}} auto-populates the Avro schema by downloading from the schema registry.

        **Note:** The Avro schema detected automatically is read-only as it represents the defined structure from the schema registry. When you modify the schema, flows fail to read the events when the flow is run.

        For information about event structure and supported data types, see [event structure definition](../../reference/event-structure/#avro).


1. When you configure a new source node, {{site.data.reuse.ep_name}} attempts to automatically detect the key and [headers](https://kafka.apache.org/38/javadoc/org/apache/kafka/connect/header/Header.html){:target="_blank"} by analyzing the last message of the topic from the **Message format** pane:

   **Important:** When you edit a source node after configuring it earlier, {{site.data.reuse.ep_name}} does not auto-detect key and headers again, and the initial configuration of key and headers remains unchanged. However, the configuration is reset when the topic is changed.

   - **Key and headers are detected:** When the message format is auto-detected earlier, the **Key and headers** pane is auto-detected with the appropriate key and headers. To rename a property, hover over the property name, and click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){: height="30px" width="15px"}.

     **Note:** Key and headers are auto-detected even if the detected message format is unknown.

   - **Key and headers are undetected:** If the selected topic does not contain any message, key and headers are not auto-detected. You can manually configure key and headers by clicking the **Map** drop-down.

   After mapping the keys and headers to the event fields, click **Next** to go to the **Event details** pane.

1. In the **Event details** section, enter a name for your node. The output stream of events from this node will be referred with the name you entered.

   **Note:** To save the event source for later reuse, set the **Save for re-use** to **Yes**.

1. In the **Event structure** section, a table with names of all message properties and its data types is displayed. All properties are selected by default to define the structure of source events. You can clear the properties that are not relevant.

   **Note:** After the event source is configured, you can rename properties by connecting a [transform](../processornodes/#transform) node to the event source.

   Default data types are assigned for the properties in the **Type mapping** column depending on how you defined the structure of the message:

   - If you defined the structure from a sample JSON event, the event property type is set to `String`, `Boolean`, `Big integer`, or `Double` depending on the field type in the JSON event.
   - If you defined the structure using an Avro schema, the default event property type is mapped from the following Avro type:

   | Avro data type                             | Event property data type         |
   |--------------------------------------------|----------------------------------|
   | `string`                                   | `STRING`                         |
   | `boolean`                                  | `BOOLEAN`                        |
   | `int`                                      | `INTEGER`                        |
   | `long`                                     | `BIGINT`                         |
   | `double`                                   | `DOUBLE`                         |
   | `float`                                    | `FLOAT`                          |
  
   - You can only assign a data type for leaf properties. If there are nested properties, the name is displayed by using a period (`.`) as a separator for each level of nesting. For example, in the properties `product . id` and `customer . address . city`, you can only assign data types to `id` and `city`.

   - If a property is an array, it is displayed with square brackets (`[]`) at the end of its name. For example, `contact_nos[]` indicates an array. Nested arrays are displayed with a period (`.`)  between properties for each level of nesting, followed by square brackets (`[]`) at the end of the array name. For example, if `contact_nos` is an array nested within the `address` property, it is displayed as `address . contact_nos[]`.

     **Note:** If a nested property name contains a period (`.`), the nested property is displayed within backticks (\`\`\) to distinguish the property name. For example, `name .`\``billing.address`\``. customer` where `billing.address` is the name of the property.

   Select the data type to assign to a property from the **Type mapping** list:

   - [BIGINT](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#bigint){:target="_blank"}
   - [BOOLEAN](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#boolean){:target="_blank"}
   - [DOUBLE](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#double){:target="_blank"}
   - [DATE](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#date){:target="_blank"}
   - [FLOAT](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#float){:target="_blank"}
   - [INTEGER](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#int){:target="_blank"}
   - [STRING](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#varchar--string){:target="_blank"}
   - [TIME](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#time){:target="_blank"}
   - [Timestamp](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#timestamp){:target="_blank"}
   - [Timestamp (with time zone)](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/types/#timestamp_ltz){:target="_blank"}


   Use one of the following types to define timestamps for event properties where the field in the JSON sample message contains a timestamp string, or where the Avro schema defines the property as a string, or where the Avro schema defines the property as a string:

   - **Timestamp**: Use this type if your message property is in date-time structure without a time zone up to nanoseconds precision.
   - **Timestamp (with time zone):** Use this type if your message property is in date-time structure with a valid time zone up to nanoseconds precision.

   For example:

   | SQL                              | ISO                              |
   |----------------------------------|----------------------------------|
   | 1971-01-01 00:00                 | 1971-01-01T00:00                 |
   | 1971-01-01 00:00+05:30           | 1971-01-01T00:00+0530            |
   | 1971-01-01 00:00Z                | 1971-01-01T00:00Z                |
   | 2024-02-20 19:11:41.123456789+05 | 2024-02-20T19:11:41.123456789-01 |

   Additionally, event properties that are a JSON type of `number`, or where the Avro schema defines the property as a `long` (or a logical type that maps to `long`), can be assigned the following types:

   - Timestamp (seconds)
   - Timestamp (milliseconds)
   - Timestamp (microseconds)


   **Important:** You must assign an appropriate type to each event property:

   - By default, all message properties are selected to define the structure of source events. Manually configured keys and headers are selected by default. However, auto-detected key and headers are not selected by default, and you can select them manually from the **Property name** column.
   - Kafka message key and headers that are configured to event properties must be only of **String** type.
   - When selecting a data type for an event property, if the selected type does not match the type in an incoming event when running the flow, the event source node might fail when reading the event.
   - Events property values that cannot be parsed according to its assigned type will be defaulted to `null`, which could eventually lead to the failure of the processing job.
   - When assigning `Timestamp` or `Timestamp (with time zone)` to a property with a type `String`, the property must conform either to the SQL or the ISO [standard](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/formats/json/#json-timestamp-format-standard){:target="_blank"}. For JSON types, these properties are available in the **Type mapping** dropdown only if the provided sample message conforms to this format.

1. In the **Event time** section, complete any one of the following steps:

   - If the event structure contains at least one property of timestamp data type such as `Timestamp `, `Timestamp (local time zone)`, `Timestamp (seconds)`, `Timestamp (milliseconds)`, or `Timestamp (microseconds)`, select which property to use as event time from the **Source of event time** dropdown.

     **Note:** You can assign any of the timestamp data types to nested properties, but only timestamps at top-level can be used as event time.

   - If you select the option **Use message timestamp provided by Kafka**, or when the event structure does not contain a timestamp property, a new timestamp property with a name defined in the **Event Property name** is generated and added to all events.

1. In the **Event lateness** section, select the event time delay to allow out of order events to be processed by nodes that use time windows. When the [watermark](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/time/#event-time-and-watermarks){:target="_blank"} for a flow progresses past the end of a time window, that window is closed and any events that arrive with an earlier event time are not included in the window output.
   {: #event-lateness}

   The delay is used to ensure the window does not close immediately, but instead waits for the watermark to progress past the delay before closing the window.

   For example, when you enter a delay of `2 minutes`, a time window of `09:00:01 - 10:00:00` that is closed when the watermark reaches `10:00:01` does not close until the watermark progresses past `10:02:01`. This means that an event that arrives with an event time of `09:59:00` when the watermark is `10:01:00` is included in the time window.


1. After you have set up the event source node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} 
appears on the event source node if the event source node is configured correctly.
If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.


## Event destination

The event destination node delivers the processed stream of events to a Kafka topic for further processing or storage.

**Important:** Event destination node produces the processed events as JSON messages. The outgoing message structure is determined from the upstream node in the flow.


### Adding an event destination node

To add an event destination node, complete the following steps:

1. In the **Palette**, under **Events**, drag the **Event destination** node into the canvas.
1. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the event destination node indicating that the node is yet to be configured.
1. Hover over the node and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} to configure the node.

The **Configure event destination** window appears.

### Configuring an event destination node 

To configure an event destination, complete the following steps:

1. Contact your cluster administrator, and retrieve the details of the Kafka cluster and the topic that you want to write your processed events to.
2. Configure your event destination node by following the instructions in [source node](#configuring-a-source-node).
3. After you have set up the event destination node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} 
appears on the event destination node if the event destination node is configured correctly. 
If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.

User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.

