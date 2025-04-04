---
title: "Process out-of-sequence events"
description: "Events generated from a wide range of producers can be out of sequence on the topic, making it important to resolve this before time-sensitive processing."
permalink: /tutorials/event-processing-examples/example-07
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 7
---

## Scenario

The logistics team want to track the hourly number of events captured by door sensors in each building.

Events from door sensors can be slow to reach the Kafka topic, so the team need to handle a Kafka topic with events that are out of sequence.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots may differ from the current interface if you are using a newer version.

- Event Streams 11.5.0
- Event Endpoint Management 11.3.0
- Event Processing 1.2.0

## Instructions

### Step 1 : Discover the topic to use

For this scenario, you need to find information about the source of door badge events.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the Event Endpoint Management catalog")

   If you need a reminder of how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

   If there are no topics in the catalog, you may need to complete the tutorial setup step to [populate the catalog](../guided/tutorial-0#populating-the-catalog).

1. The `Door badge events` topic contains events about door badge events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-1.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-1.png "screenshot of the Event Endpoint Management catalog")

   Note the warning in the catalog:

   > Note that door events can take up to 3 minutes to reach the Kafka topic, so the badge time value in the message payload should be treated as the canonical timestamp for the event.
   >
   > This delay can be inconsistent, so messages on the topic are often out of sequence as a result.

1. If the topic owner hadn't provided this warning, you would have needed to observe messages on the Kafka topic itself to identify this. Confirm this by observing messages on the `DOOR.BADGEIN` topic in the {{site.data.reuse.es_name}} topic viewer.

   If you need a reminder about how to access the **{{site.data.reuse.es_name}}** catalog you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

   Look for examples of messages that, even on the same partition, result in an older badge event (according to the `badgetime` property) being on the topic after an earlier badge event.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-2.png "screenshot of the Event Streams topic"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-2.png "screenshot of the Event Streams topic")

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-3.png "screenshot of the Event Streams topic"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-3.png "screenshot of the Event Streams topic")

   Verify that the timestamp on the Kafka message is not a reliable indicator of when the event occurred, and is frequently up to a few minutes after the actual event.

### Step 2 : Create the source of events

1. Go to the **{{site.data.reuse.ep_name}}** home page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the Event Processing home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the Event Processing home page")

   If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to track hourly badge events.

1. Update the **Event source** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-4.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-4.png "creating an event source node")

1. Add an event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-5.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-5.png "creating an event source node")

1. In the **Cluster connection** pane, fill in the server address by using the value copied from the {{site.data.reuse.eem_name}} catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-6-new1.png "connection details for the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-6-new1.png "connection details for the event source")

   Click **Next**.

1. In the **Access credentials** pane, paste the credentials by using a username and password created in {{site.data.reuse.eem_name}} using the **Generate access credentials** button.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-9-new1.png "specifying credentials for event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-9-new1.png "specifying credentials for event source")

1. Select the `DOOR.BADGEIN` topic to process events from, and then click **Next**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example-7-7-new.png "selecting a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example-7-7-new.png "selecting a topic to use")

    
1. The format `JSON` is auto-selected in the **Message format** drop-down and the sample message is auto-populated in the **JSON sample message** field. 

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-8-new1.png "selecting a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-8-new1.png "selecting a topic to use")

   Click **Next**.

1. In the **Key and headers** pane, click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/key1-headers.png "map key and headers"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tkey1-headers.png "map key and header")   

   **Note:** The key and headers are displayed automatically if they are available in the selected topic message.  

1. In the **Event details** pane, enter the node name as `door events` in the **Node name** field.   

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/door-events-new.png "enter a node name"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/door-events-new.png "enter a node name") 

   

1. Verify that the type of the `badgetime` property has been automatically detected as `Timestamp`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-11-new.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-11-new.png "creating an event source node")

1. Configure the event source to use the `badgetime` property as the source of the event time, and to tolerate lateness of up to **3 minutes**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-12-new.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-12-new.png "creating an event source node")

1. Click **Configure** to finalize the event source.

### Step 3 : Extract information to aggregate on

1. Add a **Transform** node to the flow.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-13.png "processing the door events"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-13.png "processing the door events")

   Create a transform node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

1. Create a **Transform** node to extract the building name from the door ID.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-14.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-14.png "creating the processing flow")

   Suggested function expression:

   ```sql
   REGEXP_EXTRACT(`door`, '([A-Z]+)\-([0-9]+)\-([0-9]+)', 1)
   ```

   The door ID is made up of:

   ```shell
   <building id> - <floor number> - <door number>
   ```

   For example:

   ```shell
   H-0-36
   ```

   The regular expression function is capturing the first set of letters before the first hyphen character.

1. Click **Configure** to finalize the transform.

### Step 4 : Count the occurrences

1. Add an **Aggregate** node to the flow.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-15.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-15.png "creating the processing flow")

   Create an aggregate node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

1. Define the time window to group badge events by as **1 hour**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-16.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-16.png "creating the processing flow")

1. Count the number of door badge events (by counting the unique record ID), grouped by the building.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-17.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-17.png "creating the processing flow")

1. Rename the output properties to make the results easier to understand.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-18.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-18.png "creating the processing flow")

### Step 5 : Test the flow

The final step is to run your completed flow.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of sensor events available on this topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example7-19.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example7-19.png "creating the processing flow")

1. When you have finished reviewing the results, you can stop this flow.


## Recap

It is not unusual to need to process events on a Kafka topic that are out of sequence and with unreliable timestamps in the message header.

{{site.data.reuse.ep_name}} makes it easy to perform time-based analysis of such events, by allowing you to specify what value to use as a reliable source of time and describe how long it should wait for out-of-sequence events.
