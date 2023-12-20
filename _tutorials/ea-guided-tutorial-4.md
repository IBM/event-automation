---
title: "4 - Join related events within time windows"
description: "Many interesting situations need us to combine multiple streams of events that correlate events across these inputs to derive a new, interesting situation."
permalink: /tutorials/guided/tutorial-4
toc: true
section: "Guided tutorials for IBM Event Automation"
cardType: "large"
order: 4
---

## Interval join

When looking for patterns in an event stream, sometimes we need to examine events from more than one topic. We talk of this as a "join" between the streams - the same term we would use when working with databases and correlating data between two tables.

## Filter

When processing events we can use filter operations to select a subset that we want to use. Filtering works on individual events in the stream.

{% include video.html videoSource="videos/tutorials/guided/04-join.mp4" %}{: class="tutorial-video" }

## Scenario : Identify suspicious orders
{: #scenario}

Many interesting situations need us to combine multiple streams of events that correlate events across these inputs to derive a new, interesting situation.

In this scenario, we will look for suspicious orders. Specifically, we will be looking for a particular pattern of behavior where large orders have been placed, followed by a smaller order, but the large order was at some point cancelled. This pattern would suggest an attempt to manipulate prices, since the presence of the large order might result in a subsequent reduction in prices, which the smaller order can take advantage of.

To find this pattern, we will use the "join" capability to compare a stream of "orders" with a stream of "cancellations".

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

1. Create a flow, and give it a name and description that explains you will be using it to identify suspicious orders.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-1.png "creating a flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-1.png "creating a flow")

### Step 2 : Provide a source of events

The next step is to bring the stream of events to process into the flow. We will reuse the topic connection information from an earlier tutorial.

1. Create an **Event source** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-2.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-2.png "adding an event source node")

   Create an event source node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

1. Choose the `ORDERS` topic that you used in the [Identify orders from a specific region](./tutorial-1) tutorial.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-3.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-3.png "adding an event source node")

   **Tip**: If you haven't followed that tutorial, you can click **Add new event source** instead, and follow the [Provide a source of events](./tutorial-1#event-source) steps in the previous tutorial to define a new Event source from scratch.

1. Click **Next**.

1. The schema for events on this topic defined before is displayed. Click **Configure**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-2-i.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-2-i.png "adding an event source node")

1. To rename the event source, click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}, and enter a name for your event source node in the **Details > Node name** section.

### Step 3 : Identify large orders

In this scenario, you suspect that people may be attempting to manipulate prices by making large orders that are later cancelled.

The next step is to identify the large orders.

1. Add a **Filter** node to the flow.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-4.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-4.png "defining the filter")

   Create a filter node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

   Click and drag from the small gray dot on the event source to the matching dot on the filter node.

1. Give the filter node a name that describes the results: `Large orders`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-5.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-5.png "defining the filter")

   Hover over the filter node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Create a filter that selects orders for more than `5` items.

   ```sql
   `quantity` > 5
   ```

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-6.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-6.png "defining the filter")

   **Tip**: You don't need to use the assistant if you know the expression you would like. You can type the expression in directly, and use the auto-complete and syntax-checking to make sure you enter it correctly.

1. Click "Add to expression".

1. Click **Configure** to finalize the filter.


### Step 4 : Test the flow

The next step is to test your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-7.png "testing the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-7.png "testing the flow")

   **Tip**: It is good to regularly test as you develop your event processing flow to confirm that the last node you have added is doing what you expected.

1. Confirm that all of the order events displayed have a quantity of more than five items. Once you're happy with your flow, you can stop it.

**Tip**: Keep this page open, as you will need it again in a moment. Do the following steps in a separate browser window or tab.

### Step 5 : Discover an additional source of events

For this scenario, you want to identify which of these large orders are cancelled within 30 minutes of being made.

The next step is to find a stream of order cancellation events to add to your flow. A good place to discover sources of event streams to process is the catalog in {{site.data.reuse.eem_name}}.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog")

   If you need a reminder of how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](./tutorial-access#event-endpoint-management).

   If there are no topics in the catalog, you may need to complete the tutorial setup step to [populate the catalog](./tutorial-0#populating-the-catalog).

1. Find the `CANCELS` topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-8.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-8.png "screenshot of the EEM catalog")

1. Click into the topic to review the information about the events that are available here.

   Look at the schema to see the properties in the order events, and get an idea of what to expect from events on this topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-9.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-9.png "screenshot of the EEM catalog")

**Tip**: Keep this page open, and use your first browser window to continue developing the event processing flow. It is helpful to have the catalog available while you work on your event processing flows, as it allows you to refer to the documentation about the events as you work.

### Step 6 : Add an additional source of events to the flow

The next step is to bring this additional stream of events that you discovered in the catalog into {{site.data.reuse.ep_name}}.

1. Create an **Event source** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-10.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-10.png "adding an event source node")

   Create an event source node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

1. Add a new event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-11.png "add an event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-11.png "add an event source")

   Hover over the event source node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Get the server address for the event source from the {{site.data.reuse.eem_name}} topic page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-12.png "getting connection details from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-12.png "getting connection details from the catalog")

   Click the Copy button next to the Servers address to copy the address to the clipboard.

1. Configure the new event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-13.png "getting connection details from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-13.png "getting connection details from the catalog")

   Give the node a name that describes this stream of events: `Cancellations`.

   Paste in the server address that you copied from {{site.data.reuse.eem_name}} in the previous step.

   You need to accept the certificates for the Event Gateway to proceed.

1. Generate access credentials for accessing this stream of events from the {{site.data.reuse.eem_name}} page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-14.png "getting the credentials to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-14.png "getting the credentials to use")

   Click the "Generate access credentials" button at the top of the page, and provide your contact details.

1. Copy the username and password from {{site.data.reuse.eem_name}} and paste into {{site.data.reuse.ep_name}} to allow access to the topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-15.png "specifying credentials for event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-15.png "specifying credentials for event source")

   The username starts with `eem-`.

   **Did you know?** The username and password you created is unique to you, and is only for accessing this topic. If you need to revoke this password, you can do it without impacting other users of this topic.

1. Confirm the name of the topic that you want to process events from.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-16.png "selecting a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-16.png "selecting a topic to use")

   Click "Next".

1. Get the schema for cancellation events from {{site.data.reuse.eem_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-17.png "paste schema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-17.png "paste schema into the event source")

   Click the Copy button in the Schema box to copy the schema to the clipboard.

   You need to give {{ site.data.reuse.ep_name }} a description of the events available from the topic. The information in the schema will enable {{ site.data.reuse.ep_name }} to give guidance for creating event processing nodes.

1. In {{site.data.reuse.ep_name}}, click the "Upload a schema or sample message" button.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-17-i.png "paste schema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-17-i.png "paste schema into the event source")

1. Paste the schema into the event source config in the **Avro** tab.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-18.png "save for re-use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-18.png "save for re-use")

1. Leave the event source to be saved for later reuse.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-19.png "save for re-use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-19.png "save for re-use")

   **Tip**: Saving the connection details makes the later steps in the tutorial that use this same topic quicker. It avoids you needing to enter these details again.

1. Click **Configure** to finalize the event source.

### Step 7 : Join the two streams

The next step is to specify how to correlate the large orders with the cancellations.

1. Add an **Interval join** node and link it to the two streams.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-20-i.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-20-i.png "joining the streams")

   Create an interval join node by dragging one onto the canvas. You can find this in the "Joins" section of the left panel.

   Click and drag from the small gray dot on the cancellations event source to the matching dot on the filter node. Do the same for the large orders filter node.

1. Give the join node a name that describes the events it should identify: `Cancelled large orders`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-20.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-20.png "joining the streams")

   Hover over the join node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Define the join by matching the `orderid` from cancellation events with the `id` from order events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-21.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-21.png "joining the streams")

   Click "Add to expression" and then click "Next".

1. Specify that you are interested in detecting cancellations that are made within 30 minutes of the (large) order.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-22.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-22.png "joining the streams")

1. Remove the properties that we do not need to simplify the output. We only need to know when it happened, and what product was cancelled.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-23.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-23.png "joining the streams")

   Keep the `description` property.

   Keep the two "Event time" properties - both are called `event_time`. Rename them to make them unique, and to explain what they are.

   **Tip**: Renaming properties to explain what they mean in your joined stream makes the output easier to use. For this join, instead of having two properties called "event_time", naming them "order time" and "cancel time" makes the meaning clearer.

1. Click **Configure** to finalize the join.

### Step 8 : Test the flow

The next step is to test your event processing flow and view the results.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-24.png "testing"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-24.png "testing")

When you have finished reviewing the results, you can stop this flow.

### Step 9 : Identify small orders

The next step is identify small orders (that we will later correlate with the cancelled large orders).

1. Add a **Filter** node to the flow and link it to the order events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-25.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-25.png "defining the filter")

1. Give the filter node a name that describes the events it should identify: `Small orders`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-26.png "naming the filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-26.png "naming the filter node")

1. Create a filter that selects orders for five or fewer items.

   ```sql
   `quantity` <= 5
   ```

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-27.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-27.png "defining the filter")

1. Click **Configure** to finalize the filter.


### Step 10 : Correlating small orders with cancelled large orders

The next step is identify small orders that occur within a short time of cancelled large orders **of the same product**.

1. Add an **Interval join** node to combine the small order events with the cancelled large order events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-27-i.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-27-i.png "joining the streams")

1. Give the join node a name that describes the events it should identify: `Suspicious orders`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-28.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-28.png "joining the streams")

1. Join the two streams based on the `description` of the product that was ordered.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-29.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-29.png "joining the streams")

   This will identify small orders of the same product that a large order has been cancelled for.

   Click "Add to expression" and then click "Next".

1. Specify `30 minutes` the time window that you want to use for the join.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-30.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-30.png "joining the streams")

   This will identify a small order, when it occurs within thirty minutes of a large order that is soon cancelled.

1. Choose the output properties that will be useful to return.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-31.png "joining the streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-31.png "joining the streams")

1. Click **Configure** to finalize the join.

### Step 11 : Test the flow

The final step is to run your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-32.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-4-32.png "running the flow")

You should notice some suspicious customers ("Suspicious Bob", "Naughty Nigel", "Criminal Clive", "Dastardly Derek") in the results.

There are likely also some non-suspicious customers in the results.

Some of these might be customers who innocently made a large order, decided they didn't need that many, cancelled it and made a smaller order instead.

Some of them might be customers who coincidentally made a small order for the same product that a suspicious person was currently manipulating the price of.

**Tip**: The [Identify repeated attempts to manipulate dynamic pricing](../event-processing-examples/example-04) example shows one way that you could refine this flow to reduce the number of false positives in the results.

## Recap

You used filter nodes to divide the stream of orders into separate subsets - of large and small orders.

You used join nodes to combine the orders events with the corresponding cancellation events, and to look for small orders in the context of large orders that happened within a short time window.

## Next step

In the [next tutorial](./tutorial-5), you will see how to use the results of your event processing flows by emitting them to a Kafka topic.

