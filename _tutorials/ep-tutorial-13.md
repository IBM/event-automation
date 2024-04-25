---
title: "Handle evolving formats by using a schema registry"
description: "Connect to a schema registry to process a stream of events with formats that change over time."
permalink: /tutorials/event-processing-examples/example-13
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 13
---

## Scenario

The customer satisfaction team wants to respond to customers who cancel their orders in the moment, to attempt to convert some of these cancellations into new orders. For example, they are considering promptly reaching out to customers who cancel an order because they changed their mind, with voucher codes or information about similar products.

The format of events on this topic is expected to evolve over time, so the customer satisfaction team will connect {{site.data.reuse.ep_name}} to the schema registry to continue to process without errors.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in {{ site.data.reuse.ea_long }}. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of {{ site.data.reuse.ea_long }} that you can use to follow this tutorial for yourself.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots might differ from the current interface if you are using a newer version.

- {{site.data.reuse.es_name}} 11.3.1
- {{site.data.reuse.ep_name}} 1.1.5

## Instructions

### Step 1 : Discover the topic to use

For this scenario, you need a source of order cancellation events.

1. Go to the **{{site.data.reuse.es_name}}** topics page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-1.png "screenshot"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-1.png "screenshot")

   If you need a reminder of how to access the {{site.data.reuse.es_name}} web UI, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-streams).

1. Find the `CANCELLATIONS.REG` topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-2.png "screenshot"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-2.png "screenshot")

    Click into the topic to review the events that are available here.

**Tip**: Keep the {{site.data.reuse.es_name}} UI open. It is helpful to have the topic available while you start to work on your {{site.data.reuse.ep_name}} flows, as you can refer to the connection information for the cluster as you work. Complete the following steps in a separate browser window or tab.

1. Go to the **{{site.data.reuse.es_name}}** schema registry page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-3.png "screenshot"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-3.png "screenshot")

1. Find the `CANCELLATIONS.REG-value` schema.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-4.png "screenshot"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-4.png "screenshot")

    Click into the schema to review the format of events on the `CANCELLATIONS.REG` topic.

**Tip**: Keep the {{site.data.reuse.es_name}} UI open. It is helpful to have the schema available while you start to work on your {{site.data.reuse.ep_name}} flows, as you can refer to the event information as you work. Complete the following steps in a separate browser window or tab.

### Step 2 : Create a flow

1. Go to the **{{site.data.reuse.ep_name}}** home page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page")

    If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to create a stream of order cancellation events.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-5.png "creating a flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-5.png "creating a flow")

### Step 3 : Provide a source of events

The next step is to bring the stream of events you discovered in the catalog into {{site.data.reuse.ep_name}}.

1. Update the **Event source** node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-6.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-6.png "adding an event source node")

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Add a new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source")

    Click **Next**.

1. Get the server address for the topic from the {{site.data.reuse.es_name}} topic page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-7.png "getting connection details from the topic"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-7.png "getting connection details from the topic")

    As {{site.data.reuse.es_name}} is in the same cluster as {{site.data.reuse.ep_name}}, you can use the internal listener for this.

    Click the **Copy** icon next to the **Internal listener address** to copy the address to the clipboard.

1. Configure the new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-8.png "connection details for the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-8.png "connection details for the event source")

    Give the node a name that describes this stream of events: `cancellations`.

    Paste the server address that you copied from {{site.data.reuse.es_name}} in the previous step and click **Next**..

1. Use the username and password for the `kafka-demo-apps` user for accessing the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-9.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-9.png "adding an event source node")

   If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](../guided/tutorial-access#accessing-kafka-topics).

1. Select the `CANCELLATIONS.REG` topic and choose `Avro (schema registry)` as the message format used in your selected topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-10.png "selecting a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-10.png "selecting a topic to use")

    Click **Next**.

1. Get the schema registry endpoint URL from {{site.data.reuse.es_name}}.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-11.png "copy schema registry endpoint"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-11.png "copy schema registry endpoint")

    Click **Copy** icon in the **Schema registry endpoint** section to copy the endpoint URL to the clipboard.

1. Paste the schema registry endpoint URL into the **Schema registry URL** box. Append `/apis/ccompat/v6` to the end of the URL.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-12.png "paste schema registry endpoint"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-12.png "paste schema registry endpoint")

1. Use the same username and password for the `kafka-demo-apps` user for accessing the schema registry.

1. Copy the schema from the {{site.data.reuse.es_name}} schema page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-13.png "copy schema"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-13.png "copy schema")

1. Paste the schema into the **Avro schema** field.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-14.png "paste schema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-14.png "paste schema into the event source")

    Give {{ site.data.reuse.ep_name }} a description of the events available from the topic. The information in the schema enables {{ site.data.reuse.ep_name }} to give guidance for creating {{site.data.reuse.ep_name}} nodes.

    Click **Next**.

1. Set the lateness to 0.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-15.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-15.png "creating an event source node")

1. Click **Configure** to finalize the event source.

### Step 4 : Test the flow

The next step is to run your {{site.data.reuse.ep_name}} flow and view the results.

Use the **Run** menu, and select **Include historical** to run your filter on the history of door badge events available on this Kafka topic.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-16.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-16.png "running the flow")

Click **Stop** after you have reviewed the events.

### Step 5 : Filter to events of interest

The next step is to identify cancellations where the customer changed their mind.

1. Create a **Filter** node and link it to the event source node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-17.png "add a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-17.png "add a filter node")

    Create a filter node by dragging one onto the canvas. You can find the filter node in the **Processors** section of the left panel.

    Click and drag from the small gray dot on the event source to the matching dot on the filter node.

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Give the filter node a name that describes the events it should identify: `customer changed their mind`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-18.png "naming the filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-18.png "naming the filter node")

    Click **Next**.

1. Define a filter that matches cancellations events with a `reason` value that equals `CHANGEDMIND`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-19.png "configuring the filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-19.png "configuring the filter node")

    Click **Add to expression**.

1. Click **Configure** to finalize the filter.

### Step 6 : Test the flow

The final step is to run your {{site.data.reuse.ep_name}} flow and view the results.

Use the **Run** menu, and select **Include historical** to run your filter on the history of cancellation events available on this Kafka topic.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example13-20.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example13-20.png "running the flow")

Verify that all events are for cancellation events with a reason of `CHANGEDMIND`.


## Recap

You used a schema registry in the event source node to dynamically provide schemas for a stream of events. This means that your {{site.data.reuse.ep_name}} flow will continue to process if a compatible change is made to the schema for future events on the topic.
