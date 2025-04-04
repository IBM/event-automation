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

When you create a flow, an event source node is automatically added to your canvas. A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the event source node indicating that the node is yet to be configured.

To add additional event source nodes, in the **Palette**, under **Events**, drag the **Event source** node into the canvas.



### Configuring a source node

To configure an event source, hover over the node and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}. The **Configure event source** window appears.

Complete the following steps to configure your event source node.

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

A bootstrap server address should be defined in the form: `hostname:port`. 

For example: `kafkaBoostrapServer:9000`

**Note:** To add more addresses, click **Add bootstrap server +** and enter the server address.

If your topics are published in {{site.data.reuse.eem_name}}, follow the [{{site.data.reuse.eem_name}}]({{ 'eem/subscribe/configure-your-application-to-connect' | relative_url }}) documentation to retrieve the bootstrap server address. If your topics are available in {{site.data.reuse.es_name}}, retrieve the bootstrap server address as described in the [{{site.data.reuse.es_name}}]({{ 'es/getting-started/connecting' | relative_url }}) documentation.


#### Access credentials

Based on the inputs your cluster administrator provided for setting up the Kafka cluster, you might see one of the following set up:

- SSL-only or plain text (without security) bootstrap server URLs:

  1. In the **Access Credentials** section, **Connection credential not required** is displayed and you do not have to set up any access credentials.
  2. Click **Next**.

- SASL-only or SSL-SASL setup:

  SASL mechanisms can be used to authenticate clients connecting to the Kafka cluster. The common SASL mechanisms supported by Kafka are as follows:

    - **PLAIN:** The PLAIN mechanism is a simple username and password-based authentication mechanism, which transmits credentials in plain text, so it is crucial to use SSL or TLS encryption in conjunction with PLAIN to secure the authentication process.

    - **Salted Challenge Response Authentication Mechanism (SCRAM):** SCRAM-SHA-256 and SCRAM-SHA-512 are SASL mechanisms that use a challenge-response mechanism to authenticate clients securely. The client and server exchange challenges and responses based on the user credentials, and the password is not sent in plain text.

  Retrieve the credentials from your cluster administrator and complete the following steps:

  1. In the **Access Credentials** section, select the security mechanism from the drop-down menu.
  2. Provide the username and password for this cluster. If you are subscribed to the topic by using {{site.data.reuse.eem_name}}, see the [{{site.data.reuse.eem_name}}]({{ 'eem/subscribe/subscribing-to-event-endpoints/' | relative_url }}) documentation. If you are using {{site.data.reuse.es_name}} to access your Kafka resources, see the [{{site.data.reuse.es_name}}]({{ 'es/security/managing-access/#managing-access-to-kafka-resources' | relative_url }}) documentation.

  3. Click **Next**.

#### Topic selection

The list of topics that are hosted in this Kafka cluster is displayed. Select a topic from where you want to receive the stream of events. By default, the first topic in the displayed list is selected.

You can use the search pane to search for a particular topic.

1. As you start typing the topic name in the search pane, you get a filtered list of matching topics.
2. Select the radio button ![radio button]({{ 'images' | relative_url }}/radio-button.svg "Icon showing unchecked radio button."){:height="30px" width="15px"} of the topic you want.
3. After selecting the topic ![radio button]({{ 'images' | relative_url }}/radio-button-checked.svg "Icon showing checked radio button."){:height="30px" width="15px"}, depending on your Event Processing version, complete one of the following steps:

   - ![Event Processing 1.1.8 icon]({{ 'images' | relative_url }}/1.1.8.svg "In Event Processing 1.1.8 and later") In {{site.data.reuse.ep_name}} version 1.1.8, click **Next** to go to the **Message format** pane.

   - In {{site.data.reuse.ep_name}} version 1.1.7, scroll down and verify that the auto-detected message format is correct, and then click **Next** to go to the **Define event structure** pane.

   - In {{site.data.reuse.ep_name}} 1.1.5 and 1.1.6, scroll down and select the expected message format, and then click **Next** to go to the **Define event structure** pane.



#### ![Event Processing 1.1.8 icon]({{ 'images' | relative_url }}/1.1.8.svg "In Event Processing 1.1.8 and later.") Message format
{: #message-format}

{{site.data.reuse.ep_name}} attempts to automatically detect the message format by analyzing the last message of the topic. In some cases the auto-detected format could not match the actual format of the last message. For more information, see the [troubleshooting](../../troubleshooting/bad-output-from-auto-detection/) to address auto-detection message format issues.
- **Message format is detected:** If the topic contains a message with a supported format, for example, Avro, Avro (schema registry), or JSON, the message format is auto-selected in the **Message format** drop-down.

    **Note:** After changing the auto-detected format to a different option in the drop-down, if you want to revert to the initially detected format, click the **Detect message format** icon ![reset button]({{ 'images' | relative_url }}/rotate--360.svg "Icon showing reset button."){:height="30px" width="15px"}.

- **Message format is undetected:** {{site.data.reuse.ep_name}} does not determine the message format if no message is available in the selected topic. In such cases, you can select the message format from the **Message format** drop-down.

    **Note:** To automatically detect the message format, click the **Detect message format** icon ![reset button]({{ 'images' | relative_url }}/rotate--360.svg "Icon showing reset button."){:height="30px" width="15px"} after adding new messages to the topic.


**Avro:** The topic contains Apache Avro binary-encoded messages. An Avro schema is required to decode incoming messages and define the structure of the source event. 

**JSON:** The topic contains JSON formatted messages. A sample JSON message is required to define the structure of the source event.

![Event Processing 1.1.5 icon]({{ 'images' | relative_url }}/1.1.5.svg "In Event Processing 1.1.5 and later.") **Avro (schema registry):**
The topic contains messages encoded using an Avro schema stored in a registry. Messages produced in the topic must meet the requirements that are described in [prerequisites](../../installing/prerequisites#schema-registry-requirements). When connected to the schema registry, the source node retrieves the schema from the registry to decode the binary message. The information about the schema registry and the Avro schema is required to define the structure of the source event.

**Note:** If you are using a version earlier than 1.1.7, complete the following sections in the **Define event structure** pane.

To define the [event](../../about/key-concepts#event) structure, you must define the structure of messages consumed from the Kafka topic. Depending on the expected format of incoming Kafka messages:

- In versions earlier than 1.1.1:
  - **Topic schema** to define the structure from an Apache Avro schema of type **record** whose primitive fields are of Avro type `string`, `int`, `long`, `float`, `double`, or `boolean`.
  - **Sample message** to derive the structure from a sample JSON event. The event properties must use the primitive JSON data types `string`, `number`, or `boolean`.

- ![Event Processing 1.1.1 icon]({{ 'images' | relative_url }}/1.1.1.svg "In Event Processing 1.1.1 and later.") **Avro:**
  {: #event-source-avro}
  
  - If the topic contains Apache Avro binary-encoded messages, the event structure must be provided as an Avro schema. The schema must describe the `record` type with fields that are the primitive data types such as `string`, `int`, `long`, `float`, `double`, or `boolean` and logical types (`uuid`, `date`, `timestamp-millis` or `timestamp-micros`). Avro also supports a combination of `null` and `<primitive-data-type>` (`[null, <primitive-data-type>]`) for optional fields.

   
    ![Event Processing 1.1.7 icon]({{ 'images' | relative_url }}/1.1.7.svg "In Event Processing 1.1.7 and later.") In the **Message format** pane, manually paste the schema in the **Avro schema** field after the message format is auto-detected in the **Message format** drop-down.

    

    In {{site.data.reuse.ep_name}} versions 1.1.8 and later, the **Message format** drop-down has been moved to the **Message format** pane. If you are using a version earlier than 1.1.8, in the **Topic selection** pane, manually paste the schema in the **Avro schema** field after the message format is auto-detected in the **Message format** drop-down. 
         

  - ![Event Processing 1.1.1 icon]({{ 'images' | relative_url }}/1.1.1.svg "In Event Processing 1.1.1 and later.") The fields also support `time-millis` logical type.

    For example, the following schema sets the `optionalComments` as an optional field:

    ```json
    {
      "name": "Order",
      "type": "record",
      "fields": [
        { "name": "orderID", "type": "int" },
        { "name": "optionalComments", "type": ["null", "string"] }
      ]
    }
  ```

  - ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") The fields also support the `record` type to describe an object containing a set of primitive or other objects as fields, with support for multiple levels of nesting.

    For example, the following schema describes an order containing a product and data related to that product, including optional fields with logicalType:  

    ```json
    {
      "type": "record",
      "name": "Order",
      "fields": [
        { "name": "orderID", "type": "long" },
        { "name": "orderTime", "type": { "type": "long", "logicalType": "timestamp-millis" } },
        {
          "name": "product",
          "type": {
          "type": "record",
          "name": "product",
          "fields": [
            { "name": "id", "type": "long" },
            { "name": "price", "type": "double" },
            { "name": "quantity", "type": "long" },
            { "name": "optionalComment", "type": ["null", "string"] },
            { "name": "optionalTimestamp", "type": ["null", { "type": "long", "logicalType": "timestamp-millis" }] }
          ]
        }
      }
      ]
    }
    ```

  - ![Event Processing 1.1.8 icon]({{ 'images' | relative_url }}/1.1.8.svg "In Event Processing 1.1.8 and later.") The `record` type can include fields that are complex arrays,including an array of arrays and an array of objects. The complex arrays also support nested objects or nested primitive arrays, such as arrays of `strings`, `numbers`, and `booleans`. However, arrays of fields with `logicalType` are not supported.
     {: #complex-arrays}

     **Note:** Fields inside an object of an array cannot be deselected, but you can still assign a data type for each of them. Use the **Transform** node to remove a complex array from the event.

    For example, consider a schema describing an order with a field for `productDetails`, which is an array of object. The `inventoryDetails` and `contactDetails` fields indicate an array of arrays. The schema also contains nested arrays or objects.

    ```json
      {
        "name": "Order",
        "type": "record",
        "fields": [
          {
            "name": "productDetails",
            "type": {
              "type": "array",
              "items": {
                "type": "record",
                "fields": [
                  {
                    "name": "productName",
                    "type": "string"
                  },
                  {
                    "name": "purchase",
                    "type": "string"
                  },
                  {
                    "name": "codes",
                    "type": {
                      "type": "array",
                      "items": [
                        "null",
                        "int"
                      ]
                    }
                  }
                ]
              }
            }
          },
          {
            "name": "inventoryDetails",
            "type": [
              "null",
              {
                "type": "array",
                "items": [
                  "null",
                  {
                    "type": "array",
                    "items": {
                      "type": "record",
                      "fields": [
                        {
                          "name": "inventoryName",
                          "type": [
                            "null",
                            {
                              "type": "array",
                              "items": [
                                "null",
                                "string"
                              ]
                            }
                          ]
                        },
                        {
                          "name": "productCodes",
                          "type": [
                            "null",
                            {
                              "type": "array",
                              "items": [
                                "null",
                                "int"
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            "name": "contactDetails",
            "type": [
              "null",
              {
                "type": "array",
                "items": [
                  "null",
                  {
                    "type": "array",
                    "items": [
                      "null",
                      "string"
                    ]
                  }
                ]
              }
            ]
          }
        ]
      } 
    ```  

  - ![Event Processing 1.1.4 icon]({{ 'images' | relative_url }}/1.1.4.svg "In Event Processing 1.1.4 and later.") The `record` type also supports primitive arrays, including arrays of `strings`, `numbers`, and `booleans`. However, arrays of fields with `logicalType` are not supported. 

      **Note:** Optional arrays and elements in the arrays are supported. However, optional records are not supported.

      ![Event Processing 1.1.9 icon]({{ 'images' | relative_url }}/1.1.9.svg "In Event Processing 1.1.9 and later.") Optional records are supported in **Avro (schema registry)**. However, optional records are not supported in **Avro**.

    For example, consider a schema describing an order with a field for products, which is an array containing string values and can contain null values. The schema also contains nested arrays.

    ```json
      {
        "name": "Order",
        "type": "record",
        "fields": [
          {
            "name": "orderId",
            "type": "long"
          },
          {
            "name": "products",
            "type": {
              "type": "array",
              "items": [
                "null",
                "string"
              ]
            }
          },
          {
            "name": "address",
            "type": {
              "type": "record",
              "namespace": "Record",
              "name": "address",
              "fields": [
                {
                  "name": "shippingAddress",
                  "type": {
                    "type": "record",
                    "namespace": "Record.address",
                    "name": "shippingAddress",
                    "fields": [
                      {
                        "name": "line1",
                        "type": [
                          "null",
                          "string"
                        ]
                      },
                      {
                        "name": "contact_nos",
                        "type": [
                          "null",
                          {
                            "type": "array",
                            "items": "long"
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    ```
  

- **JSON:** 
  - If the topic contains JSON formatted messages, the event structure must be provided as a sample JSON message. The event properties must use the primitive JSON data types `string`, `number`, or `boolean`. Null values are supported when processing JSON events, but the provided sample JSON should contain only non-null values to determine the right type of properties.

    ![Event Processing 1.1.7 icon]({{ 'images' | relative_url }}/1.1.7.svg "In Event Processing 1.1.7 and later.") **Note:** If the detected format is JSON, {{site.data.reuse.ep_name}} automatically populates the sample message in the **JSON sample message** field that uses the content of the last message from the topic. 
  - ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") The `object` JSON data type is also supported. The properties inside the objects can contain a set of primitive JSON data types or other objects. Multiple levels of nesting are supported.

    For example, the following sample message is supported:

    ```json
    {
      "orderId": 123456789,
      "orderTime": 1708363158092,
    "product": {
          "id": 789456123,
          "price": 99.99,
          "quantity": 99,
          "optionalComment": "a comment"
      }
    }  
    ```

  - ![Event Processing 1.1.4 icon]({{ 'images' | relative_url }}/1.1.4.svg "In Event Processing 1.1.4 and later.") The JSON data type supports arrays of primitive types such as `strings`, `numbers`, and `booleans`. However, arrays of `timestamps` are not supported. 

    Arrays can be at any nested level and should only contain elements of the same type.

    For example:
  
    ```json
    {
      "orderId": 253,
      "products": [ "ProductA", "ProductB", "ProductC" ],
      "address": {
          "postal_code": 91001,
          "contact_nos": [ 99033, 92236 ]
        }
    }
    ```

  - ![Event Processing 1.1.8 icon]({{ 'images' | relative_url }}/1.1.8.svg "In Event Processing 1.1.8 and later.") The JSON data type supports complex arrays, including an array of arrays and an array of objects. The complex arrays also support nested objects or nested primitive arrays, such as arrays of `strings`, `numbers`, and `booleans`. However, arrays of timestamps are not supported. Arrays can be at any nested level and should only contain elements of the same type.

      **Note:** You can select or deselect the fields inside an object of an array. 

    For example:

    ```json
      {
        "orderId": 253,
        "productDetails": [
          {
            "productName": "item1",
            "purchase": "online",
            "codes": [
              65456,
              76577
            ]
          }
        ],
        "inventoryDetails": [
          [
            {
              "inventoryName": [
                "item1",
                "item2"
              ],
              "productCodes": [
                65456,
                76577
              ]
            }
          ]
        ],
        "contactDetails": [
          [
            "8623464"
          ],
          [
            "2754274"
          ]
        ]
      }    
    ```

- ![Event Processing 1.1.5 icon]({{ 'images' | relative_url }}/1.1.5.svg "In Event Processing 1.1.5 and later.") **Avro (schema registry)**:
  
  This format supports messages encoded using an Avro schema that is stored in a supported registry. Messages produced in the topic must meet the requirements that are described in [prerequisites](../../installing/prerequisites#schema-registry-requirements). To connect to a supported registry that stores the Avro schema, enter the following information and define the structure of the source event:

  **Note:** In {{site.data.reuse.ep_name}} versions 1.1.8 and later, the **Message format** drop-down has been moved to the **Message format** pane.  
  
  1. Before you begin, ensure that the [prerequisites](../../installing/prerequisites#schema-registry-requirements) to connect to a schema registry are met.
  1. In the **Schema registry URL** field, enter the [URL](../../installing/prerequisites/#schema-registry-requirements) to the REST endpoint of the schema registry.

      **Important:** Ensure you append the Apicurio schema registry REST endpoint URL with `/apis/ccompat/v6` as a suffix. For example, if you are using {{site.data.reuse.es_name}}, the valid schema registry URL is `https://<schema_registry_endpoint>/apis/ccompat/v6`

  1. In the **Authentication method** field, select **No authentication** or **Basic authentication**, which requires a username and password.

  1. ![Event Processing 1.1.8 icon]({{ 'images' | relative_url }}/1.1.8.svg "In Event Processing 1.1.8 and later.") If the message format is auto-detected earlier in the **Message format** pane, click **Next** to auto-populate the Avro schema.

     In {{site.data.reuse.ep_name}} version 1.1.7, if the message format is auto-detected in the **Topic selection** pane, click **Next** to auto-populate the Avro schema. 

     In the **Avro schema** field, {{site.data.reuse.ep_name}} automatically populates the Avro (schema registry) that was used to produce the last detected message in the topic.

     **Note:** The Avro schema detected automatically is read-only.

     In {{site.data.reuse.ep_name}} versions earlier than 1.1.7, if your message format is manually selected in the **Topic selection** pane, in the **Avro schema** field, paste the Avro schema that is used to encode topic messages to define the structure of the source event.      

     For more information about Avro schemas, see the [previous section](#event-source-avro).

![Event Processing 1.1.8 icon]({{ 'images' | relative_url }}/1.1.8.svg "In Event Processing 1.1.8 and later.") After you provide required information to define the event structure, click **Next** to go to the **Event details** pane.

![Event Processing 1.1.5 icon]({{ 'images' | relative_url }}/1.1.5.svg "In Event Processing 1.1.5 and later.") In versions 1.1.5, 1.1.6, and 1.1.7, after you provide required information to define the event structure, click **Next** to go to the **Customize event structure** pane.

In versions earlier than 1.1.5, after you provide a valid schema or sample message, click **Done**.



#### ![Event Processing 1.1.8 icon]({{ 'images' | relative_url }}/1.1.8.svg "In Event Processing 1.1.8 and later.") Event details

**Note:** 

- In {{site.data.reuse.ep_name}} 1.1.8 and later, the **Event details** pane covers the following configurations.
- In versions 1.1.5, 1.1.6, and 1.1.7, the following configurations are available in the **Customize event structure** pane. 
- If you are running a version earlier than 1.1.5, the following configurations are covered as part of the earlier **Define event structure** pane.

##### Event properties

- All message properties are selected by default to define the structure of source events.
- You can clear the properties that are not relevant in the **Property** checkbox.

After the event source is configured, you will be able to rename properties by connecting a transform node to the event source.

##### Type mapping

Default types are assigned depending on how you defined the structure of the message:

- If you defined the structure from a sample JSON event, the event property type is set to `String`, `Boolean`, `Integer`, `Big integer`, `Double`, or `Float` depending on the message.

  ![Event Processing 1.1.1 icon]({{ 'images' | relative_url }}/1.1.1.svg "In Event Processing 1.1.1 and later.") The event property type is set to `String`, `Boolean`, `Big integer`, or `Double` depending on the message.
- If you defined the structure using an Avro schema, the default event property type is mapped from the following Avro type:

  | Avro type                                  | Event property type              |
  |--------------------------------------------|----------------------------------|
  | `string`                                   | `STRING`                         |
  | `boolean`                                  | `BOOLEAN`                        |
  | `int`                                      | `INTEGER`                        |
  | `long`                                     | `BIGINT`                         |
  | `double`                                   | `DOUBLE`                         |
  | `float`                                    | `DOUBLE` <br>  ![Event Processing 1.1.1 icon]({{ 'images' | relative_url }}/1.1.1.svg "In Event Processing 1.1.1 and later.") `FLOAT`     |
  
 - ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") You can only assign a type for leaf properties. If there are nested properties, the name is displayed by using a forward slash (`/`) as a separator for each level of nesting. For example, `product / id` or `customer / address / city`. 

 - ![Event Processing 1.1.4 icon]({{ 'images' | relative_url }}/1.1.4.svg "In Event Processing 1.1.4 and later.") If a property is an array, it is displayed with square brackets (`[]`) at the end of its name. For example, `products[]` indicates an array. Nested arrays are displayed with a forward slash (`/`) between properties for each level of nesting, followed by square brackets (`[]`) at the end of the array name. For example, if `contact_nos` is an array nested within the `address` property, it is displayed as `address / contact_nos[]`.

Select the data type to assign to a property from the **Type mapping** list:

- [BIGINT](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#bigint){:target="_blank"}
- [BOOLEAN](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#boolean){:target="_blank"}
- [DOUBLE](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#double){:target="_blank"}
- [DATE](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#date){:target="_blank"}
- [FLOAT](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#float){:target="_blank"}
- [INTEGER](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#int){:target="_blank"}
- [STRING](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#varchar--string){:target="_blank"}
- [TIME](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#time){:target="_blank"}
- [TIMESTAMP](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#timestamp){:target="_blank"}
- [TIMESTAMP_LTZ](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#timestamp_ltz){:target="_blank"}

![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") Use one of the following types to define timestamps for event properties that are a JSON type of `String`, or where the Avro schema defines the property as a `string`:

- **Timestamp**: (Replaces [TIMESTAMP](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#timestamp){:target="_blank"}) Use this type if your message property is in date-time structure without a time zone up to nanoseconds precision.
- **Timestamp (with time zone)**: (Replaces [TIMESTAMP_LTZ](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/types/#timestamp_ltz){:target="_blank"}) Use this type if your message property is in date-time structure with a valid time zone up to nanoseconds precision.

For example:

| SQL                              | ISO                              |
|----------------------------------|----------------------------------|
| 1971-01-01 00:00                 | 1971-01-01T00:00                 |
| 1971-01-01 00:00+05:30           | 1971-01-01T00:00+0530            |
| 1971-01-01 00:00Z                | 1971-01-01T00:00Z                |
| 2024-02-20 19:11:41.123456789+05 | 2024-02-20T19:11:41.123456789-01 |

![Event Processing 1.1.1 icon]({{ 'images' | relative_url }}/1.1.1.svg "In Event Processing 1.1.1 and later.") Additionally, event properties that are a JSON type of `number`, or where the Avro schema defines the property as a `long` (or a logical type that maps to `long`), can be assigned the following types:

- Timestamp (seconds)
- Timestamp (milliseconds)
- Timestamp (microseconds)

You must assign an appropriate type to each event property:

- Events property value must be valid against the type you assign, otherwise the event source will not be
  able to parse the value.
- Events property values that cannot be parsed according to its assigned type will be defaulted to `null`, which could eventually lead to the failure of the processing Job.
- When assigning `Timestamp` or `Timestamp (local time zone)` to a property with a type `String`, the property must conform to the [SQL format standard](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/connectors/table/formats/json/#json-timestamp-format-standard){:target="_blank"}.

   When assigning `Timestamp` or `Timestamp (with time zone)` to a property with a type `String`, the property must conform either to the SQL or the ISO [standard](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/connectors/table/formats/json/#json-timestamp-format-standard){:target="_blank"}. For JSON types these properties would be available in the type mapping list only if the provided sample message conforms to this format.

#### Define the event time


- Select which property to use as event time from the **Source of event time** list when the event structure contains at least one property of type `Timestamp `, `Timestamp (local time zone)`, `Timestamp (seconds)`, `Timestamp (milliseconds)`, or `Timestamp (microseconds)`.
  
  ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") **Note:** You can assign any of the timestamp types to nested properties, but only timestamps at top-level can be used as event time.

  
- If you select the option **Use message timestamp provided by Kafka**, or when the event structure does not contain a property of type `Timestamp `, `Timestamp (local time zone)`, `Timestamp (seconds)`, `Timestamp (milliseconds)`, or `Timestamp (microseconds)`, a new timestamp property with a  name defined by the **Event Property name** will be generated and added to all events.


#### Event time delay

You select the event time delay to allow reordering source events based on their event time. It ensures
that all events that flow to subsequent nodes are ordered based on their event time.
This delay is used to configure the [Flink Bounded out of orderness watermark strategy](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/sql/create/#watermark){:target="_blank"}.


After you have set up the event source node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} 
appears on the event source node if the event source node is configured correctly. 
If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.


## Event destination

The event destination node delivers the processed stream of events to a Kafka topic for further processing or storage.

### Adding an event destination node

To add an event destination node, complete the following steps:

1. In the **Palette**, under **Events**, drag the **Event destination** node into the canvas.
1. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the event destination node indicating that the node is yet to be configured.
2. Hover over the node and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} to configure the node.

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

