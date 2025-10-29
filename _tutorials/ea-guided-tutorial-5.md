---
title: "5 - Automate actions based on event triggers"
description: "Once your event processing has identified a situation of interest, a common next step is to automate a response. You can write the output of your processing flows to one or several Kafka topics to achieve this."
permalink: /tutorials/guided/tutorial-5
toc: true
section: "Guided tutorials for IBM Event Automation"
cardType: "large"
order: 6
---

## Event destination

When processing events, you can send the results to Kafka topics. This lets the results from the flow be used to trigger automations, notifications, business workflows, or be processed further in other applications.


## Scenario: Distributing results of analysis and processing
{: #scenario}

The EMEA operations team wants to provide a dedicated stream of EMEA order events for further processing, including specific processing for large EMEA orders.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](./tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](./tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots may differ from the current interface if you are using a newer version.

- Event Streams 12.0.0
- Event Endpoint Management 11.6.3
- Event Processing 1.4.5

## Instructions

### Step 1: Create a flow

This tutorial begins with the flow that is created in [Identify orders from a specific region](./tutorial-1).

If you haven't completed that tutorial yet, you should do it now.

1. Edit the flow title and description to describe the changes that you will make.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-1.png "describing the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-1.png "describing the flow")

   Click the flow title in the header bar to open the flow details.

   Enter a new title and description and click **Save**.

**Tip**: Keep this page open - you will need it again in a moment. Do the following step in a separate browser window or tab.

### Step 2: Create the destination Kafka topics

The next step is to create the two Kafka topics that you will use for the results from this flow.

1. Go to the **{{site.data.reuse.es_name}}** home page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-2.png "Event Streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-2.png "Event Streams")

   If you need a reminder of how to access the {{site.data.reuse.es_name}} web UI, you can review [Accessing the tutorial environment](./tutorial-access#event-streams).

1. Click the **Create a topic** tile.

1. Create a topic called `ORDERS.EMEA`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-3.png "destination topic"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-3.png "destination topic")

   You can accept the defaults for the remaining properties of the topic.

1. Click into the new topic page, and then click **Connect to this topic**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-4.png "connection details for the destination"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-4.png "connection details for the destination")

1. Get the internal address of the Kafka listener to use for the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-5.png "connection details for the destination"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-5.png "connection details for the destination")

   Click the **Copy** icon for the **Internal** Kafka listener to copy the address to the clipboard.

1. Create another topic called `ORDERS.EMEA.LARGE` by using steps 1 to 5. The internal address of the Kafka listener is the same as for the `ORDERS.EMEA` topic.


### Step 3: Provide a destination for EMEA orders results

The next step is to define the event destination for the filtered EMEA orders.

1. Create an **Event destination** node in the {{site.data.reuse.ep_name}} flow window.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-6.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-6.png "adding an event destination node")

   Create an event destination node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

1. Hover over the event destination node and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} to configure the node.  

1. Enter `Output EMEA orders` into the **Node name** field and paste the internal Kafka listener address copied from {{site.data.reuse.es_name}} in [Step 2](#step-2--create-a-destination-kafka-topic) into the **Bootstrap server** field.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5-new.png "connection details for the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5-new.png "connection details for the event source")

1. Use the username and password for the `kafka-demo-apps` user for accessing the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial5-8.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial5-8.png "adding an event destination node")

   If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](./tutorial-access#accessing-kafka-topics) section of the Tutorial Setup instructions.

1. In the **Topic selection** pane, select the new `ORDERS.EMEA` topic to use as a destination.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-9-new.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-9-new.png "adding an event destination node")

   Click **Next**.

1. Click Configure to finalize the event destination.


### Step 4: Define the filter for the large EMEA orders

The next step is to create the filter that will select the subset of larger EMEA orders.

1. Create a **Filter** node and link it to the output of the filter **EMEA orders**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-filter-large-1.png "add a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-filter-large-1.png "add a filter node for large orders")

    Create a filter node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

    Click and drag from the small gray dot on the the right side of the **EMEA orders** filter to the matching dot on the left side of new filter node.

    **Did you know?** Instead of dragging the node, you can add a node onto the canvas and automatically connect it to the selected node by double-clicking a node within the palette.

1. Give the filter node a name that describes the events it should identify: `EMEA large orders`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-filter-large-2.png "naming the filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-filter-large-2.png "naming the filter node")

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Enter the following expression to filter the orders with a total amount larger than 300:

   ```shell
   `price` * `quantity` >= 300
   ```

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-filter-large-3.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-filter-large-3.png "defining the filter")

1. Click **Next** to open the **Output properties** pane. Choose the properties to output.

1. Click **Configure** to finalize the filter.


### Step 5: Provide a destination for EMEA large orders results

The next step is to define the event destination for the filtered EMEA large orders.

1. Repeat steps 1-6 under [step 3](#step-3--provide-a-destination-for-results), this time naming the event destination node **Output EMEA large orders** and selecting the `ORDERS.EMEA.LARGE` topic. The event destination node must be connected to the output of the **EMEA orders** filter created in the previous step.


### Step 6: Test the flow  

The final step is to run the flow and confirm that the EMEA orders and EMEA large orders are produced to the new topics.

1. Use the **Run** menu, and select **Include historical** to run your filters on the history of order events available in the input topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-10.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-10.png "running the flow")

1. Select the **Output EMEA orders** node and confirm that the events are filtered correctly to only EMEA orders.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-11.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-11.png "running the flow")

1. Confirm that the events for EMEA orders are produced to the new topic `ORDERS.EMEA` from {{site.data.reuse.es_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-12.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-12.png "running the flow")

1. Select the **Output EMEA large orders** node and confirm that the events are filtered correctly to only EMEA large orders.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-11-large.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-11-large.png "running the flow")

1. Confirm that the events for EMEA large orders are produced to the new topic `ORDERS.EMEA.LARGE` from {{site.data.reuse.es_name}} in the same way as for checking the `ORDERS.EMEA` topic.

1. You can leave the flow running to continue producing filtered events to the new topics.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-13.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-13.png "running the flow")

## Recap

You output the results of your event processing flow to new Kafka topics.

## Next step

In the [next tutorial](./tutorial-6), you will see how to share the results of your event processing flow by adding these new topics to the {{site.data.reuse.eem_name}} catalog.
