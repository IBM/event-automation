---
title: "Deduplicating repeated events"
description: "Some systems offer at-least-once assurances, and will occasionally generate duplicate events. Processing these to remove duplicates can enable consumption by systems that cannot behave idempotently."
permalink: /tutorials/event-processing-examples/example-05
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 5
---

## Scenario

The operations team needs to remove duplicate events from the stock movements topic, for processing by systems that cannot behave idempotently.


**Tip**: To learn more about deduplication, see the [Apache Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/sql/queries/deduplication/){:target="_blank"}.

## Deduplicate node

You can remove duplicate events by using the [deduplicate node]({{ 'ep/nodes/processornodes#deduplicate' | relative_url}}). The deduplicate node provides a simpler, built-in way to remove duplicate events without having to write SQL yourself.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots may differ from the current interface if you are using a newer version.

- {{site.data.reuse.es_name}} 12.0.2
- {{site.data.reuse.eem_name}} 11.6.4
- {{site.data.reuse.ep_name}} 1.4.5

## Instructions

### Step 1: Discover the source topic to use

For this scenario, you are processing an existing stream of events. You will start by identifying the topic.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-1a.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-1a.png "screenshot of the Event Endpoint Management catalog")

   If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

   If there are no topics in the catalog, you might need to complete the tutorial setup step to [populate the catalog](../guided/tutorial-0#populating-the-catalog).

1. The `Stock movement updates` topic contains the events used in this tutorial.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-1.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-1.png "screenshot of the Event Endpoint Management catalog")

   **Tip**: Notice that the topic information describes the issue that we are addressing in this tutorial. Documenting potential issues and considerations for using topics is essential for enabling effective reuse.


### Step 2: Create a topic for the deduplicated events

You can configure a processing flow to write the deduplicated events to a separate topic, which you can then use as a source for systems that are unable to process idempotently.

The next step is to create this topic.

1. Go to the **{{site.data.reuse.es_name}}** topics manager.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-2.png "screenshot of the Event Streams topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-2.png "screenshot of the Event Streams topics page")

   If you need a reminder about how to access the {{site.data.reuse.es_name}} web UI, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-streams).

1. Create a topic called `STOCK.MOVEMENT.UNIQUE`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-3.png "screenshot of the Event Streams topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-3.png "screenshot of the Event Streams topics page")

1. Create the topic with **3 partitions** to match the `STOCK.MOVEMENT` source topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-4.png "screenshot of the Event Streams topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-4.png "screenshot of the Event Streams topics page")


### Step 3: Create a processing flow

The {{site.data.reuse.ep_name}} authoring UI makes it easy to start new projects. You can now write your Flink SQL in the {{site.data.reuse.ep_name}} UI.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the Event Processing home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the Event Processing home page")

   If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to deduplicate the events on the stock movements topic.

### Step 4: Provide a source of events

The next step is to bring the stream of events to process into the flow.

1. Update the **Event source** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-5.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-5.png "adding an event source node")

   Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Use the server address information and **Generate access credentials** button on the `Stock movement updates` topic page in the Event Endpoint Management catalog from [Step 1](#step-1--discover-the-source-topic-to-use) to configure the event source node.

1. Select the `STOCK.MOVEMENT` topic.

1. The message format is auto-selected and the sample message is auto-populated in the **Message format** pane.

1. Enter the node name as `Stock movements`.

**Tip**: If you need a reminder about how to configure an event source node, you can follow the [Filter events based on particular properties](../guided/tutorial-1) tutorial.

### Step 5: Deduplicate events with deduplicate node

You can use the deduplicate node to remove duplicate events that produces an append-only stream.

1. Drag a deduplicate node into the canvas and connect the node to the `Stock movements` node. You can find this in the **Processors** section of the left panel.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-5b.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-5b.png "adding an event destination node")

1. Hover over the deduplicate node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. In the **Details** pane, enter `Keep one event per movement ID` as the node name. Click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-5c.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-5c.png "adding an event destination node")

1. In the **Define deduplication** pane, the `event_time` property is automatically selected because the input contains only a single event time property. This property is used to determine the order of events when identifying duplicates.

1. In the **Deduplication mode**, select **Fixed interval** to remove duplicates within a fixed window that starts from the first event.

1. In the **Time interval** field, specify a time interval for deduplication. 

   For example, for a time interval of one hour, only the first event per unique key property is kept, and any duplicates are discarded. After the interval ends, the deduplication cycle starts again.

1. Select the property `movementid` from the **Identify properties** table that uniquely identifies each stock movement. Click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-5d.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-5d.png "adding an event destination node")


1. In the **Output properties** pane, you can choose the output properties that are useful to return.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-5e.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-5e.png "adding an event destination node")

1. Click **Configure** to finalize the deduplicate.

### Step 6: Write your events to a Kafka topic

The results must be written to a different Kafka topic. You can use the event destination node to write your events to a Kafka topic.

1. Create an event destination node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-6.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-6.png "adding an event destination node")

1. Enter the node name as `Unique stock movements`.

1. Configure the event destination node by using the internal server address from {{site.data.reuse.es_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-7.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-7.png "adding an event destination node")

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-8.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-8.png "adding an event destination node")

1. Use the username and password for the `kafka-demo-apps` user for accessing the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-9.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-9.png "adding an event destination node")

   If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](../guided/tutorial-access#accessing-kafka-topics) section of the Tutorial Setup instructions.

1. Choose the `STOCK.MOVEMENT.UNIQUE` topic created in [Step 2](#step-2--create-a-topic-for-the-deduplicated-events).

1. Click **Configure** to finalize the event destination node.

### Step 7: Test the flow

The next step is to run your event processing flow and view the deduplicated events:

Use the **Run** menu, and select **Include historical** to run your flow on the history of stock movement events available on this Kafka topic.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-19.png "results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-19.png "results")

A live view of results from your flow is updated as new events are emitted onto the `STOCK.MOVEMENT.UNIQUE` topic.

The running flow continuously processes and deduplicates new events as they are produced to the STOCK.MOVEMENT topic.

### Step 9: Confirm the results

You can verify the results by examining the destination topic.

1. View the original events on the `STOCK.MOVEMENT` topic.

1. Use the timestamp to identify a duplicate event.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-12.png "results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-12.png "results")

    Approximately one in ten of the events on this topic are duplicated, so looking through ten or so messages should be enough to find an example.

1. Examine the event with the same timestamp on the `STOCK.MOVEMENT.UNIQUE` topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-13.png "results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-13.png "results")

    You can see that there is only a single event with that timestamp and contents on the destination topic, as the duplicate event was filtered out.


You can use this new deduplicated topic as the source for an {{site.data.reuse.ep_name}} flow, or any other Kafka application.

## Recap

You have created a processing flow that uses deduplicate node to preprocess the events on a Kafka topic. The results are written to a different Kafka topic.