---
title: "Introduction"
excerpt: "Event Processing is a scalable, low-code event stream processing platform that helps you transform data and act on it in real time."
categories: about
slug: overview
toc: true
---

{{site.data.reuse.ep_name}} is a scalable, low-code event stream processing platform you can use to transform and act on events in real time, helping you turn events into insights.

You can author flows in the low-code editor that bring events (messages) from Apache Kafka into your flow and apply processing actions you want to take on your events.

The flows are run as [Apache Flink](https://flink.apache.org/){:target="_blank"} jobs. Apache Flink is a framework and a distributed processing engine for stateful computations over event streams.

The flow is represented as a graph of event sources, processors (actions), and event destinations. You can use the results of the processing to obtain and share insights on the business data, or to build automations.

The following diagram shows how {{site.data.reuse.ep_name}} capability fits into the overall {{site.data.reuse.ea_long}} architecture.

![Event Processing architecture]({{ 'images' | relative_url }}/architectures/ibm-event-automation-event-processing.svg "Diagram showing the Event Processing architecture as part of IBM Event Automation.")


## Features
{: #features}

{{site.data.reuse.ep_name}} features include:

- A user interface (UI) designed to provide a low-code experience, including:
  - A free-form layout canvas to create flows, with drag-and-drop functionality to add and join nodes.
  - The option to test your event flow while constructing it.
  - The option to export flows to be deployed in other environments.
- The {{site.data.reuse.ibm_flink_operator}} that provides:
  - The runtime for the low-code editor.
  - The option to deploy flows exported from the low-code editor.
  - The option to deploy custom Flink workloads.
