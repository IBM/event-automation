---
title: "Key concepts"
excerpt: "Read about the key concepts of the Apache Kafka technology."
categories: about
slug: key-concepts
toc: true
---

Read about the key concepts and terms used in Event Processing.

## Event

An event is anything that happens at a [specific time](#event-time). For example, when a customer makes a purchase, a sensor detects a threshold, or a stock price changes. 
An event is characterized by its properties, such as purchase item and date, temperature and date,
stock price and last updated date. 
Events processed by a [flow](#flow) are available through an [event source](#event-source).

## Event time

The event time denotes the date and time when an [event](#event) occurs. 
Event time is essential when you need to measure the progress of time and perform time-based calculations. 
The event date and time does not always coincide with the creation date and time of the event message.
The timestamp property, which acts as the event time, is determined in the event source configuration.

## Topic
A stream of messages is stored in categories called topics.

## Event source

[Topics](#topic) are presented as event sources in the [catalog](#catalog). Kafka administrators describe topics as event sources, and this information is published to the catalog. Business analysts and those interested in event data can choose the event sources they want to use in their processing to construct event flows. The processing done as a result of the event flow creates an event destination that can be used to solve specific business problems.

## Event destination

The event destination is the output of the stream processing [flow](#flow) you set up that defines the processing configured for the selected [event sources](#event-source). The new event destination can be published to be consumed downstream in other jobs or applications.

## Catalog

The catalog lists all available topics that represent event sources, and you can use the event data from them in the stream processing flow you configure.

## Flow

The flow specifies the processing to be done on the selected event streams to achieve a certain result. The event flow is represented as a graph of event sources, processors (actions), and event sinks (destinations).


## Cluster
Kafka runs as a cluster of one or more servers (Kafka brokers). The load is balanced across the cluster by distributing it amongst the servers.

## Timestamp

Time is an important factor in determining the latency of ingestion and processing. Timestamp is a datatype used to record the date and time when an event occurs, for example, in a format that records the year, month, day, hour, minute, second. Timestamps are used in data that involve the time and date of storage for processing. Every data within an event stream is assigned a timestamp by {{site.data.reuse.ep_name}}.

## Message

The unit of data in Kafka. Each message is represented as a record, which comprises two parts: key and value. The key is commonly used for data about the message and the value is the body of the message. Message is also sometimes referred to as event data and record.


To learn more about key concepts, see the following information:
 - [Apache Kafka documentation](http://kafka.apache.org/documentation.html){:target="_blank"}
 - [Apache Flink documentation](https://nightlies.apache.org/flink/flink-docs-master/){:target="_blank"}
