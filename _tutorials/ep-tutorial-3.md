---
title: "Generating custom properties for custom filters"
description: "Writing custom filter expressions that use dynamically generated properties added to events can help to identify specific situations."
permalink: /tutorials/event-processing-examples/example-03
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 3
---

Writing custom filter expressions that use dynamically generated properties added to events can help to identify specific situations.

## Scenario

In this scenario, the EMEA operations team wants to move away from reviewing quarterly sales reports and start to look for high-value orders in their region as they occur throughout the quarter.

Identifying large orders as they occur will help the team identify as early as possible any changes they need to make to sales forecasts. This information can then be fed back into their manufacturing cycle.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots can differ from the current interface if you are using a newer version.

- Event Streams 3.2.5
- Event Endpoint Management 11.1.1
- Event Processing 1.1.1

## Instructions

### Step 1 : Discover the topics to use

For this scenario, you need a source of order events. A good place to discover sources of event streams to process is the catalog, so start there.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog")

   If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

   If there are no topics in the catalog, you need to complete the tutorial setup step to [populate the catalog](../guided/tutorial-0#populating-the-catalog).

1. The `ORDERS` topic contains events about orders that are made.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-2.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-2.png "screenshot of the EEM catalog")

### Step 2 : Provide a source of events

The next step is to create an event source in {{site.data.reuse.ep_name}} for the topic to use in the flow.

Use the server address information and **Generate access credentials** button on the topic page in the catalog to define an event source node.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example3-1.png "event source nodes"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example3-1.png "event source nodes")

**Tip**: If you need a reminder on how to create an event source node, you can follow the [Identify orders from a specific region](../guided/tutorial-1) tutorial.

### Step 3 : Calculate order totals

The next step is to calculate the total value of each order, that you will use to identify the high-value orders.

1. Create a **Transform** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example3-2.png "add a transform node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example3-2.png "add a transform node")

   Create a transform node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

   Click and drag from the small gray dot on the event source to the matching dot on the transform node.

1. Hover over the transform node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   Call the transform node `Calculate order total`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example3-3.png "add a transform node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example3-3.png "add a transform node")


1. Create a new property called `order total`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example3-3-i.png "add a transform node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example3-3-i.png "add a transform node")

   An order event includes the unit cost of an item, and the quantity of items in the order. The order total can be computed by multiplying these two numbers.

   Suggested value for the property:

   ```sql
   quantity * price
   ```

1. You can leave the other event properties as they are.

1. Click **Configure** to finalize the transform.

### Step 4 : Identify high-value EMEA orders

The next step is to filter the stream of events based on this new total order value property to select the high value EMEA orders.

1. Add a **Filter** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example3-4.png "add a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example3-4.png "add a filter node")

   Create a filter node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

   Click and drag from the small gray dot on the event source to the matching dot on the filter node.

   **Did you know?** Instead of dragging the node, you can add a node onto the canvas and automatically connect it to the last added node by double-clicking a node within the palette. For example, after configuring an event source node, double-click any processor node to add and connect the processor node to your previously configured event source node.

1. Hover over the filter node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   Name the filter node to show that it is going to select high value EMEA orders.



1. Use the assistant to start a filter based on orders with an `order total` greater than `575`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example3-5.png "add a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example3-5.png "add a filter node")

1. Click **Add to expression**.

1. Edit the filter so that it also only matches orders that are made in the EMEA `region`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example3-6.png "add a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example3-6.png "add a filter node")

   Suggested value for the filter expression:

   ```sql
   `order total` > 575 AND region = 'EMEA'
   ```

1. Click **Configure** to finalize the filter.

### Step 5 : Test the flow

The final step is to run your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

1. Click the Filter node to see a live view of results from your filter. It is updated as new events are emitted onto the orders topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example3-7.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example3-7.png "running the flow")

1. When you have finished reviewing the results, you can stop this flow.


## Recap

You used a transform node to dynamically compute additional properties in the events.

You also used a filter node to specify a custom, complex expression - more detailed than the simple expressions created by using the Assistant.

