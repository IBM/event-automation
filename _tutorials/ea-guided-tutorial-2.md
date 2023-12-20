---
title: "2 - Transform events to create or remove properties"
description: "When processing events we can use transform operations to refine input events."
permalink: /tutorials/guided/tutorial-2
toc: true
section: "Guided tutorials for IBM Event Automation"
cardType: "large"
order: 2
---

## Transform

When processing events we can modify events to remove some properties from the events. Transforms work on individual events in the stream.

{% include video.html videoSource="videos/tutorials/guided/02-transform.mp4" %}{: class="tutorial-video" }

## Scenario: Redact personal information from order events
{: #scenario}

The operations team wants to enable another team to analyze order events, however this other team is not permitted access to personally-identifiable information (PII) about customers. They need to be able to process order events without customer PII.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](./tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](./tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots may differ from the current interface if you are using a newer version.

- Event Streams 3.3.0
- Event Endpoint Management 11.1.1
- Event Processing 1.1.1

## Instructions

### Step 1 : Create a flow

1. Go to the **{{site.data.reuse.ep_name}}** home page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page")

    If you need a reminder of how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](./tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to redact customer information from orders.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-1.png "creating a flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-1.png "creating a flow")

### Step 2 : Provide a source of events

The next step is to bring the stream of events to process into the flow. We will reuse the topic connection information from an earlier tutorial.

1. Create an **Event source** node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-2.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-2.png "adding an event source node")

    Create an event source node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

1. Choose the `ORDERS` topic that you used in the [Identify orders from a specific region](./tutorial-1) tutorial.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-3.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-3.png "adding an event source node")

    **Tip**: If you haven't followed that tutorial, you can click **Add new event source** instead, and follow the [Provide a source of events](./tutorial-1#event-source) steps in the previous tutorial to define a new Event source from scratch.

1. Click **Next**.

1. The schema for events on this topic defined before is displayed. Click **Configure**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-2-i.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-2-i.png "adding an event source node")

1. To rename the event source, click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}, and enter a name for your event source node in the **Details > Node name** section.

### Step 3 : Define the transformation

The next step is to define the transformation that will remove the customer personal information from events.

1. Add a **Transform** node and link it to your event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-4.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-4.png "defining the transformation")

    Create a transform node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

    Click and drag from the small gray dot on the event source to the matching dot on the transform node.

    **Did you know?** Instead of dragging the node, you can add a node onto the canvas and automatically connect it to the last added node by double-clicking a node within the palette. For example, after configuring an event source node, double-click any processor node to add and connect the processor node to your previously configured event source node.

1. Give the transform node a name that describes what it will do: `redact personal info`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-5.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-5.png "defining the transformation")

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. As you aren't creating any new properties, click **Next**.

    (You can learn about creating custom properties in the [next tutorial](./tutorial-3).)

1. Remove the `customer` and `customerid` properties from the events.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-6.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-6.png "defining the transformation")

    Remove properties from events by clicking the remove property icon next to their name.

### Step 4 : Testing the flow

The final step is to run your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-7.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-7.png "running the flow")

1. Click the redact transform node to see a live view of results from your transform. It is updated as new events are emitted onto the orders topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-8.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-8.png "running the flow")

## Recap

You used a transform node to redact sensitive data from order events.

## Next step

In the [next tutorial](./tutorial-3), you will try a windowed operation to process events that occur within a time window.

