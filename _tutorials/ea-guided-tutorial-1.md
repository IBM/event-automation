---
title: "1 - Filter events based on particular properties"
description: "When processing events we can use filter operations to select input events."
permalink: /tutorials/guided/tutorial-1
toc: true
section: "Guided tutorials for IBM Event Automation"
cardType: "large"
order: 1
---

## Filter

When processing events, we can use filter operations to select a subset that we want to use. Filtering works on individual events in the stream.

{% include video.html videoSource="videos/tutorials/guided/01-filter.mp4" %}{: class="tutorial-video" }

## Scenario : Identify orders from a specific region
{: #scenario}

The EMEA operations team wants to move away from reviewing quarterly sales reports and be able to review orders in their region as they occur.

Identifying large orders as they occur will help the team identify changes that are needed in sales forecasts much earlier. These results can also be fed back into their manufacturing cycle so they can better respond to demand.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](./tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](./tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots may differ from the current interface if you are using a newer version.

- Event Streams 3.3.0
- Event Endpoint Management 11.1.1
- Event Processing 1.1.1

## Instructions

### Step 1 : Discover the topic to use

For this scenario, you need a source of order events. A good place to discover sources of event streams to process is the catalog in {{site.data.reuse.eem_name}}.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog")

    If you need a reminder of how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](./tutorial-access#event-endpoint-management).

    If there are no topics in the catalog, you may need to complete the tutorial setup step to [populate the catalog](./tutorial-0#populating-the-catalog).

1. Find the `ORDERS` topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-1.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-1.png "screenshot of the EEM catalog")

1. Click into the topic to review the information about the events that are available here.

    Look at the schema to see the properties in the order events, and get an idea of what to expect from events on this topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-2.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-2.png "screenshot of the EEM catalog")

**Tip**: Keep this page open. It is helpful to have the catalog available while you work on your event processing flows, as it allows you to refer to the documentation about the events as you work. Do the following steps in a separate browser window or tab.

### Step 2 : Create a flow

The next step is to start processing this stream of events, to create a custom subset that contains the events that you are interested in.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page")

    If you need a reminder of how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](./tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to identify orders made in the EMEA region.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-3.png "creating a flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-3.png "creating a flow")

### Step 3 : Provide a source of events
{: #event-source}

The next step is to bring the stream of events you discovered in the catalog into {{site.data.reuse.ep_name}}.

1. Create an **Event source** node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-4.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-4.png "adding an event source node")

    Create an event source node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Add a new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source")

1. Get the server address for the event source from the {{site.data.reuse.eem_name}} topic page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-6.png "getting connection details from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-6.png "getting connection details from the catalog")

    Click the Copy button next to the Servers address to copy the address to the clipboard.

1. Configure the new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-7.png "connection details for the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-7.png "connection details for the event source")

    Give the node a name that describes this stream of events: `Orders`.

    Paste in the server address that you copied from {{site.data.reuse.eem_name}} in the previous step.

    You need to accept the certificates for the Event Gateway to proceed.

1. Generate access credentials for accessing this stream of events from the {{site.data.reuse.eem_name}} page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-8.png "getting the credentials to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-8.png "getting the credentials to use")

    Click the "Generate access credentials" button at the top of the page, and provide your contact details.

    **Did you know?** Providing your contact details allows the owner of the topic to know who is accessing their stream of events.

1. Copy the username and password from {{site.data.reuse.eem_name}} and paste into {{site.data.reuse.ep_name}} to allow access to the topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-9.png "specifying credentials for event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-9.png "specifying credentials for event source")

    The username starts with `eem-`.

    **Did you know?** The username and password you created is unique to you, and is only for accessing this topic. If you need to revoke this password, you can do it without impacting other users of this topic.

1. Confirm the name of the topic that you want to process events from.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-10.png "selecting a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-10.png "selecting a topic to use")

    Click "Next".

1. Get the schema for order events from {{site.data.reuse.eem_name}}.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-11.png "copy schema from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-11.png "copy schema from the catalog")

    Click the Copy button for the schema to copy it to the clipboard.

    You need to give {{ site.data.reuse.ep_name }} a description of the events available from the topic. The schema will enable {{ site.data.reuse.ep_name }} to give guidance for creating event processing nodes.

1. In {{site.data.reuse.ep_name}}, click the "Upload a schema or sample message" button.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-12-i.png "paste schema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-12-i.png "paste schema into the event source")

1. Paste the schema into the event source config in the **Avro** tab.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-12.png "paste schema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-12.png "paste schema into the event source")

1. Leave the event source to be saved for later reuse.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-13.png "save for re-use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-13.png "save for re-use")

    **Tip**: Saving the connection details makes the later steps in the tutorial that use this same topic quicker. It avoids you needing to enter these details again.

1. Click **Configure** to finalize the event source.

### Step 4 : Define the filter

The next step is to start processing this stream of events, by creating the filter that will select the custom subset with the events that you are interested in.

1. Create a **Filter** node and link it to your event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-14.png "add a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-14.png "add a filter node")

    Create a filter node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

    Click and drag from the small gray dot on the event source to the matching dot on the filter node.

    **Did you know?** Instead of dragging the node, you can add a node onto the canvas and automatically connect it to the last added node by double-clicking a node within the palette. For example, after configuring an event source node, double-click any processor node to add and connect the processor node to your previously configured event source node.

1. Give the filter node a name that describes the events it should identify: `EMEA orders`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-15.png "naming the filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-15.png "naming the filter node")

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Use the assistant to define a filter that matches events with a `region` value of `EMEA`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-16.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-16.png "defining the filter")

1. Click "Add to expression".

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-16-i.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-16-i.png "defining the filter")

1. Click **Configure** to finalize the filter.


### Step 5 : Testing the flow

The final step is to run your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-17.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-17.png "running the flow")

    **Did you know?** "Include historical" is useful while you are developing your flows, as it means that you don't need to wait for new events to be produced to the Kafka topic. You can use all of the events already on the topic to check that your flow is working the way that you want.

1. A live view of results from your filter is updated as new events are emitted onto the orders topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-18.png "viewing the results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-18.png "viewing the results")

1. When you have finished reviewing the results, you can stop this flow.

## Recap

You created your first event processing flow.

You have seen how to discover and request access to a topic in the catalog, and register it as a source of events for processing.

You used a filter node to specify a subset of events on the topic that you are interested in.

## Next step

In the [next tutorial](./tutorial-2), you will try another stateless operation to learn how to modify events in the stream.
