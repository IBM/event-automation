---
title: "Introduction"
excerpt: "Event Processing is a scalable, low-code event stream processing platform that helps you transform data and act on it in near-real time."
categories: about
slug: overview
toc: true
---


{{site.data.reuse.ep_name}} is a scalable, low-code event stream processing platform that helps you transform and act on data in real time.

{{site.data.reuse.ep_name}} transforms event streaming data in real time, helping you turn events into insights. You can define flows that connect to event sources which bring event data (messages) from Apache Kafka into your flow, combined with processing actions you want to take on your events.

![Event Processing architecture]({{ 'images' | relative_url }}/architectures/ibm-event-automation-event-processing.svg "Diagram showing the Event Processing architecture as part of IBM Event Automation.")

The event flow is represented as a graph of event sources, processors (actions), and event destinations. You can use the results of the processing to get and share insights on the business data, or to build automations.

The flows are run as [Apache Flink](https://flink.apache.org/){:target="_blank"} jobs. Apache Flink is a framework and a distributed processing engine for stateful computations over event streams. In addition to being the processing engine for {{site.data.reuse.ep_name}}, Flink is also a standalone engine you can run custom Flink SQL workloads with.

## Features

{{site.data.reuse.ep_name}} features include:

- A user interface (UI) designed to provide a low-code experience.
- A free-form layout canvas to create flows, with drag-and-drop functionality to add and join nodes.
- The ability to test your event flow while constructing it.
- The option to import and export flows in JSON format to reuse across different deployment instances.
- The option to export the output of the flow processing to a CSV file.

