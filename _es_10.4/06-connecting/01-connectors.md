---
title: "Kafka Connect"
excerpt: "Find out more about the Kafka Connect framework."
categories: connecting
slug: connectors
toc: true
---

You can integrate external systems with {{site.data.reuse.es_name}} by using the Kafka Connect framework and connectors.

![Event Streams connectors architecture]({{ 'images' | relative_url }}/architectures/previous/ibm-event-automation-diagrams-es-kafkaconnect.svg "Diagram showing the architecture of the Event Streams connectors as part of IBM Event Automation.")


## What is Kafka Connect?

When connecting Apache Kafka and other systems, the technology of choice is the [Kafka Connect framework](https://kafka.apache.org/28/documentation/#connect){:target="_blank"}.

Use Kafka Connect to reliably move large amounts of data between your Kafka cluster and external systems. For example, it can ingest data from sources such as databases and make the data available for stream processing.
 
## Kafka Connect plugins

Kafka Connect plugins include connectors, converters, and transformations.

### Connectors: source and sink

Kafka Connect uses connectors for moving data into and out of Kafka. **Source connectors** import data from external systems into Kafka topics, and **sink connectors** export data from Kafka topics into external systems. A wide range of connectors exists, some of which are commercially supported. In addition, you can write your own connectors.

A number of source and sink connectors are available to use with {{site.data.reuse.es_name}}. See the [connect catalog](#connect-catalog) section for more information.

![Kafka Connect: source and sink connectors]({{ 'images' | relative_url }}/Kafka_Connect_Basics_2.svg "Diagram showing a representation of how source and sink connectors connect Event Streams and external systems.")

![Kafka Connect: introduction]({{ 'images' | relative_url }}/Kafka_Connect_Basics_1.svg "Diagram showing a representation of external systems connecting to Event Streams.")


### Converters

Kafka Connect uses converters to convert data between different formats, such as Avro to JSON. You can use the converters to transform data from one format to another for integration with different systems. For example, the [Avro converter]({{'connectors/converter-apicurio-avro/installation' | relative_url }}) can be used to convert data from Avro format to JSON format.
 
### Transformations

Kafka Connect uses transformations to modify data as it is being moved between Kafka and an external system. Transformations are applied to messages before they are written to a Kafka topic if used with a source connector, or before they are sent from Kafka to an external system in case of sink connectors. 

Transformations are optional plugins that can be used to modify data in real-time, for basic modifications such as data filtering, data masking, and data aggregation. For example, the [Cast transformation]({{'connectors/transforms-cast/configuration' | relative_url }}) can be used to change the data type of a field.

**Note:** Transformations are best used for basic modifications. For more complex or large-scale data adjustments, use [Event Processing](https://ibm.github.io/event-automation/ep/) for advanced data processing.

## Workers

Kafka Connect plugins, including connectors, converters, and transformations, run inside a Java process called a worker. Kafka Connect can run in either stand-alone or distributed mode. Stand-alone mode is intended for testing and temporary connections between systems, and all work is performed in a single process. Distributed mode is more appropriate for production use, as it benefits from additional features such as automatic balancing of work, dynamic scaling up or down, and fault tolerance.

![Kafka Connect: workers]({{ 'images' | relative_url }}/Kafka_Connect_Basics_3.svg "Diagram showing a representation of how workers and tasks are distributed in stand-alone and distributed modes.")

When you run Kafka Connect with a stand-alone worker, there are two configuration files:

* The worker configuration file contains the properties that are required to connect to Kafka. This is where you provide the details for connecting to Kafka.
* The plugin configuration file contains the properties that are required for the specific plugin (connector, converter, or transformation). This is where you provide the details for connecting to the external systems (for example, IBM MQ), or for configuring the converter or transformation.

When you run Kafka Connect with the distributed worker, you still use a worker configuration file but the connector configuration is supplied by using a REST API. Refer to the [Kafka Connect documentation](https://kafka.apache.org/documentation/#connect){:target="_blank"} for more details about the distributed worker.

For getting started and problem diagnosis, the simplest setup is to run only one plugin in each stand-alone worker. Kafka Connect workers print a lot of information and it is easier to understand if the messages from multiple plugins are not interleaved.


## Kafka Connect topics

When running in distributed mode, Kafka Connect uses three topics to store configuration, current offsets and status. Kafka Connect can create these topics automatically as it is started by the {{site.data.reuse.es_name}} operator. By default, the topics are:

- **connect-configs**: This topic stores the connector and task configurations.
- **connect-offsets**: This topic stores offsets for Kafka Connect.
- **connect-status**: This topic stores status updates of connectors and tasks.

**Note:** If you want to run multiple Kafka Connect environments on the same cluster, you can override the default names of the topics in the configuration.

## Authentication and authorization

Kafka Connect uses an Apache Kafka client just like a regular application, and the usual authentication and authorization rules apply.

Kafka Connect will need authorization to:

* Produce and consume to the internal Kafka Connect topics and, if you want the topics to be created automatically, to create these topics.
* Produce to the target topics of any [source connectors](#source-and-sink-connectors) that you are using.
* Consume from the source topics of any [sink connectors](#source-and-sink-connectors) that you are using.

**Note:** For more information about authentication and the credentials and certificates required, see the information about [managing access](../../security/managing-access/).

## Connect catalog

The connect catalog contains a list of connectors, converters, and transformations that are supported either by IBM or the community.

Community supported connectors are supported through the community that maintains them. IBM supported connectors are fully supported as part of the official {{site.data.reuse.es_name}} support entitlement if you have a license for {{site.data.reuse.ea_long}} or {{site.data.reuse.cp4i}}.

See the [connect catalog]({{ 'connectors' | relative_url }}) for a list of connectors, converters, and transformations that work with {{site.data.reuse.es_name}}.

![Kafka Connect: connect catalog]({{ 'images' | relative_url }}/Kafka_Connect_Basics_4.svg "Diagram showing how you can choose connectors from the catalog to facilitate communication between Event Streams and external systems.")

## Setting up connectors

{{site.data.reuse.es_name}} provides help with setting up your Kafka Connect environment, adding connectors to that environment, and starting the connectors. See the instructions about [setting up and running connectors](../setting-up-connectors/).

## Connectors for IBM MQ

Connectors are available for copying data between IBM MQ and {{site.data.reuse.es_name}}. There is a {{site.data.reuse.kafka-connect-mq-source-short}} for copying data from IBM MQ into {{site.data.reuse.es_name}} or Apache Kafka, and a {{site.data.reuse.kafka-connect-mq-sink-short}} for copying data from {{site.data.reuse.es_name}} or Apache Kafka into IBM MQ.

For more information about MQ connectors, see the topic about [connecting to IBM MQ](../mq/).
