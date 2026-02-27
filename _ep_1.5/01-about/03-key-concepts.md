---
title: "Key concepts"
excerpt: "Read about the key concepts of the Apache Kafka technology."
categories: about
slug: key-concepts
toc: true
---

Read about the key concepts and terms used in Event Processing. 

## Catalog
{: #catalog}

The catalog lists all available topics that represent event sources, and you can use the event data from them in the stream processing flow you configure.

## Cluster
{: #cluster}

Kafka runs as a cluster of one or more servers (Kafka brokers). The load is balanced across the cluster by distributing it amongst the servers.

## Event
{: #event}

An event represents a meaningful occurrence or change in the state of a system or a value. Find out more about [key concepts]({{ 'es/about/key-concepts/#event' | relative_url }}) related to Apache Kafka.

When processing events, an event is anything that happens at a [specific time](#event-time). For example, when a customer makes a purchase, a sensor detects a threshold, or a stock price changes. 
An event is characterized by its properties, such as purchase item and date, temperature and date,
stock price and last updated date. 
Events processed by a [flow](#flow) are available through an [event source](#event-source).

The properties can be of the following types:
- String
- Boolean
- Number
- Complex properties, such as objects containing other properties


## Event destination
{: #event-destination}

The event destination is the output of the stream processing flow you set up that defines the processing configured for the selected event sources. The new event destination can be published to be consumed downstream in other jobs or applications.

## Event source
{: #event-source}

Topics are presented as event sources in the catalog. Kafka administrators describe topics as event sources, and this information is published to the catalog. Business analysts and those interested in event data can choose the event sources they want to use in their processing to construct event flows. The processing done as a result of the event flow creates an event destination that can be used to solve specific business problems.

## Event time and watermark
{: #event-time}

The event time denotes the date and time when an event occurs. Event time is essential when you need to measure the progress of time and perform time-based calculations. Event time can be derived from a property in an event, the time the event was processed by Flink, or the time the event was processed by the event source system.


To handle out-of-order events and ensure accurate time-based processing, watermarks are used. A watermark is a mechanism that marks the progress of event time in a stream. It signals that events that arrive with an event time earlier than the current watermark are considered late and might not be processed. The watermark can be configured in the event source configuration to lag behind event time to allow for out-of-order events. 

Time-based operations, such as closing time windows, are triggered based on the progression of watermark rather than event time.

For more information about watermarks, see the [Apache Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/time/#event-time-and-watermarks).

## Flow
{: #flow}

The flow specifies the processing to be done on the selected event streams to achieve a certain result. The event flow is represented as a graph of event sources, processors (actions), and event sinks (destinations). A flow can be in different states. For more information, see [flow statuses](../../getting-started/canvas/#flow-statuses).

## Message
{: #message}

The unit of data in Kafka. Each message is represented as a record, which comprises two parts: key and value. The key is commonly used for data about the message and the value is the body of the message. Message is also sometimes referred to as event data and record.

## Nested properties
{: #nested-properties}

Nested properties of an event refer to properties within properties. An object consists of a set of properties of any type, for example, string, boolean, number, or complex properties. See information about event node for more details.

The following table explains the naming conventions in the nested properties:

| Name | Description | Example |
| Object |Object maps the keys to the values.|For more information, see the JSON schema documentation{:target="_blank"}.|
| Leaf property | The name of the last-level property.|customer/address/number, in this case, the number is the leaf property.|
| Top-level | The name of the first-level property. |address/shipping or address/number, in this case, the address is the top-level property.|

## Timestamp
{: #timestamp}

Time is an important factor in determining the latency of ingestion and processing. Timestamp is a datatype used to record the date and time when an event occurs, for example, in a format that records the year, month, day, hour, minute, second. Timestamps are used in data that involve the time and date of storage for processing. Every data within an event stream is assigned a timestamp by {{site.data.reuse.ep_name}}.

## Topic
{: #topic}

A stream of messages is stored in categories called topics.

To learn more about key concepts, see the following information:

- [Apache Kafka documentation](http://kafka.apache.org/documentation.html){:target="_blank"}
- [Apache Flink documentation](https://nightlies.apache.org/flink/flink-docs-master/){:target="_blank"}