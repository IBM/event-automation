---
title: "5 - Automate actions based on event triggers"
description: "Once your event processing has identified a situation of interest, a common next step is to automate a response. You can write the output of your processing flows to a Kafka topic to achieve this."
permalink: /tutorials/guided/tutorial-5
toc: true
section: "Guided tutorials for IBM Event Automation"
cardType: "large"
order: 5
---

## Event destination

When processing events we can send the results to a new Kafka topic. This lets the results from the flow be used to trigger automations, notifications, business workflows, or be processed further in other applications.

{% include video.html videoSource="videos/tutorials/guided/05-eventdestination.mp4" %}{: class="tutorial-video" }

## Scenario : Distributing results of analysis and processing
{: #scenario}

The EMEA operations team wants to provide a dedicated stream of EMEA order events for further processing.

## Instructions

### Step 1 : Create a flow

This tutorial begins with the flow that is created in [Identify orders from a specific region](./tutorial-1).

If you haven't completed that tutorial yet, you should do it now.

1. Edit the flow title and description to describe the changes that you will make.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-1.png "describing the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-1.png "describing the flow")

   Click the flow title in the header bar to open the flow details.

   Enter a new title and description and click **Save**.

**Tip**: Keep this page open - you will need it again in a moment. Do the following step in a separate browser window or tab.

### Step 2 : Create a destination Kafka topic

The next step is to create a topic that you will use for the results from this flow.

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

   Click the copy button for the **Internal** Kafka listener to copy the address to the clipboard.

### Step 3 : Provide a destination for results

The next step is to define the event destination for your flow.

1. Create an **Event destination** node in the {{site.data.reuse.ep_name}} flow window.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-6.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-6.png "adding an event destination node")

   Create an event destination node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

1. Hover over the event destination node and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} to configure the node.

   In **Details > Node name**, name the destination as `output`.


1. Put the Kafka listener address from {{site.data.reuse.es_name}} into the server address for the event destination node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-7.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-7.png "adding an event destination node")

   You need to accept the certificates for the Kafka cluster to proceed.

1. Use the username and password for the `kafka-demo-apps` user for accessing the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-8.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-8.png "adding an event destination node")

   If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](./tutorial-access#accessing-kafka-topics) section of the Tutorial Setup instructions.

1. Select the new `ORDERS.EMEA` topic to use as a destination.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-9.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-9.png "adding an event destination node")

1. Click **Configure** to finalize the event destination.

### Step 4 : Start the flow

The final step is to run the flow and confirm that the EMEA orders are produced to the new topic.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-10.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-10.png "running the flow")

1. Confirm that the events are filtered correctly to only EMEA orders from {{site.data.reuse.ep_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-11.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-11.png "running the flow")

1. Confirm that the filtered events are produced to the new topic from {{site.data.reuse.es_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-12.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-12.png "running the flow")

1. You can leave the flow running to continue producing filtered events to the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-13.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-13.png "running the flow")

## Recap

You output the results of your first event processing flow to a new Kafka topic.

## Next step

In the [next tutorial](./tutorial-6), you will see how to share the results of your event processing flow by adding this new topic to the {{site.data.reuse.eem_name}} catalog.
