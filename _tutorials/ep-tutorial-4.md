---
title: "Identify combinations of events occurring multiple times"
description: "Aggregate processors can identify events that are interesting if they occur multiple times within a time window."
permalink: /tutorials/event-processing-examples/example-04
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 4
---

## Scenario

In this scenario, we look for suspicious orders.

This tutorial is an extension to the [Identify suspicious orders](../guided/tutorial-4) tutorial. In that tutorial, we looked for a single incidence of a large order being made (to influence a dynamic pricing algorithm) followed by a small order of the same item, with the large order later cancelled.

That approach identified suspicious orders, however it also identified several false positives. Looking at these false positives in more detail, what many of them have in common is that the dynamic price was manipulated by making multiple large orders, not just one.

To refine that approach, this tutorial shows how to combine the join with an aggregate, to identify where repeated large orders were made and then cancelled. This allows you to identify repeated attempts to manipulate dynamic pricing.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots may differ from the current interface if you are using a newer version.

- Event Streams 3.2.5
- Event Endpoint Management 11.1.1
- Event Processing 1.1.1

## Instructions

### Step 1 : Discover the topics to use

For this scenario, you need a source of order events and new customer signup events.

A good place to discover sources of event streams to process is in the catalog, so start there.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog")

   If you need a reminder of how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

   If there are no topics in the catalog, you may need to complete the tutorial setup step to [populate the catalog](../guided/tutorial-0#populating-the-catalog).

1. The `ORDERS` topic contains events about orders that are made.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-2.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-2.png "screenshot of the EEM catalog")

1. The `CANCELS` topic contains events about orders that are cancelled.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-1.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-1.png "screenshot of the EEM catalog")

### Step 2 : Provide sources of events

The next step is to create event sources in {{site.data.reuse.ep_name}} for each of the topics to use in the flow.

Use the server address information and **Generate access credentials** button on each topic page in the catalog to define an event source node for each topic.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-2.png "event source nodes"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-2.png "event source nodes")

**Tip**: If you need a reminder about how to create an event source node, you can follow the [Identify orders from a specific region](../guided/tutorial-1) tutorial.

### Step 3 : Identify large orders

In this scenario, you suspect that people may be attempting to manipulate prices by making multiple large orders (that are all later cancelled). The next step is to identify the large orders.

1. Create a **Filter** node and attach it to the orders event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-3.png "add a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-3.png "add a filter node")

1. Call the filter node `Large orders`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-4.png "add a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-4.png "add a filter node")

   Suggested value for the filter expression:
   ```sql
   `quantity` > 5
   ```

### Step 4 : Identify large cancelled orders

For this scenario, you want to identify which of these large orders are cancelled within 30 minutes of being made.

The next step is find large cancelled orders, by joining our "large orders" stream to the stream of "cancellations" where the order ID is the same in both streams.

1. Add an **Interval join** node and link it to the two streams.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-5.png "add a join node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-5.png "add a join node")

1. Give the join node a name that describes the events it should identify: `Cancelled large orders`.

1. Define the join by matching the `orderid` from cancellation events with the `id` from order events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-6.png "add a join node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-6.png "add a join node")

1. Specify that you are interested in detecting cancellations that are made within 30 minutes of the (large) order.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-7.png "add a join node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-7.png "add a join node")

1. Remove the properties that we do not need to simplify the output.

   You need something unique about the order that we can count (the order ID), when it happened (order time and cancel time), and what product that was ordered and cancelled.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-8.png "add a join node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-8.png "add a join node")

   **Tip**: Renaming properties to explain what they mean in your joined stream makes the output easier to use. For this join, instead of having two properties that are called "event_time", naming them "order time" and "cancel time" makes the meaning clearer.

### Step 5 : Testing the flow

The next step is to test your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-9.png "testing the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-9.png "testing the flow")

   **Tip**: It is good to regularly test as you develop your event processing flow to confirm that the last node you have added is doing what you expected.

### Step 6 : Counting large order cancellations

The next step is to count the number of times within a 1-hour window that a large order for the same product is made and then cancelled.

1. Add an **Aggregate** node to the flow.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-10.png "aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-10.png "aggregate node")

1. Call the node `Cancellation counts`.

1. Specify that you want to count cancellations of large orders that are made within a 1-hour window time-frame.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-11.png "aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-11.png "aggregate node")

1. Count the number of orders in each 1-hour window, grouped by the product description.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-12.png "aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-12.png "aggregate node")

1. Rename the output fields.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-13.png "aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-13.png "aggregate node")

### Step 7 : Identify repeated cancellations

The next step is to filter out cancelled large orders for a product where they only occur once within a one-hour window, leaving only repeated cancelled large orders.

1. Add a **Filter** node to the flow.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-14.png "filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-14.png "filter node")

1. Call the node `Repeated cancelled orders`.

1. Define a filter that matches where that has been more than one large cancelled order of a product within a one-hour window.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-15.png "filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-15.png "filter node")

### Step 8 : Test the flow

The next step is to test your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-16.png "testing the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-16.png "testing the flow")

### Step 9 : Identify small orders

The next step is to identify small orders.

1. Add a **Filter** node to the orders events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-17.png "filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-17.png "filter node")

1. Give the filter node a name that describes the results: `Small orders`.

1. Create a filter that selects orders for five or fewer items.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-18.png "filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-18.png "filter node")

### Step 10 : Identify suspicious orders

The next step is to identify small orders of the same product as the repeated cancelled large orders, where they are made within a short time window of the cancelled order.

1. Add an **Interval join** node to combine the small order events with the cancelled large order events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-19.png "filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-19.png "filter node")

1. Give the join node a name that describes the results that it produces: `Suspicious orders`.

1. Join the two streams based on the description of the product that was ordered.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-20.png "filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-20.png "filter node")

1. Specify the time window that you want to use for the join.

   Look again at the results that you saw before from the repeated cancelled orders flow. The result time is the end of the one-hour window where repeated large order cancellations were observed.

   Define a join window that identifies small orders of the same product in the 1-hour window, ending at the result time.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-21.png "filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-21.png "filter node")

1. Choose the output properties that will be useful to return.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-22.png "filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-22.png "filter node")

### Step 11 : Test the flow

Test the flow again to confirm that it is identifying orders that could be investigated.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-23.png "testing the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-23.png "testing the flow")

### Step 12 : Create a destination Kafka topic

The next step is to create a topic that you will use for the results from this flow.

1. Go to the {{site.data.reuse.es_name}} home page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-2.png "ES home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-2.png "ES home page")

   If you need a reminder of how to access the {{site.data.reuse.es_name}} web UI, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-streams).

1. Create a topic called `ORDERS.SUSPICIOUS`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-24.png "destination topic"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-24.png "destination topic")

### Step 13 : Provide a destination for results

The next step is to define the event destination for your flow.

1. Create an **Event destination** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-25.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-25.png "adding an event destination node")

1. Use the server address from {{site.data.reuse.es_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-26.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-26.png "adding an event destination node")

1. Use the username and password for the `kafka-demo-apps` user for accessing the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-27.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-27.png "adding an event destination node")

   If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](../guided/tutorial-access#accessing-kafka-topics) section of the Tutorial Setup instructions.

1. Choose the new `ORDERS.SUSPICIOUS` topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-28.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-28.png "adding an event destination node")

### Step 14 : Start the flow

The final step is to run the flow and confirm that the notifications about suspicious orders are produced to the new topic.

1. Run the flow as before.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-29.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-29.png "running the flow")

1. Confirm that the events are being produced to the destination Kafka topic from the {{site.data.reuse.es_name}} UI.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example4-30.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example4-30.png "running the flow")

   There may still be a few false positives: innocent customers who coincidentally made a small order for the same product that a suspicious person was currently manipulating the price of - maybe because they noticed that the price had dropped!

   However, you should notice that most of the events on the `ORDERS.SUSPICIOUS` topic are for orders that are made by customers such as "Suspicious Bob", "Naughty Nigel", "Criminal Clive", and "Dastardly Derek".


## Recap

You used filter nodes to divide the stream of orders into separate subsets of large and small orders.

You used a join node to combine the orders events with the corresponding cancellation events.

You used an aggregate node to look for situations where a large order was made and cancelled for the same product multiple times within a short time.

Finally, you used another join node to look for small orders in the context of those repeated large cancelled orders.
