---
title: "Converting timestamp formats"
description: "Pre-processing events to modify the timestamp format can enable usage of a wider range of event formats."
permalink: /tutorials/event-processing-examples/example-09
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 9
---

## Scenario

The logistics team want to track the extremes from the temperature and humidity readings from the various sensors in the warehouse IoT network. They want to get the hourly min/max values for sensors from each building.

However, the IoT network generates sensor readings with timestamps that are a different format to the default SQL timestamp format.

```json
{
    "sensortime": "Thu Jun 22 21:23:44 GMT 2023",
    "sensorid": "A-2-21",
    "temperature": 21.6,
    "humidity": 48
}
```

They have decided that they cannot use the timestamp from the Kafka message metadata (the time that the message is produced to the topic). This is because they know that transferring sensor readings from the IoT to Kafka can be slow, causing events to be delayed by up to five minutes. It is important that they use the time that the sensor reading was taken, as recorded in the event payload.

They need to pre-process the events to convert the timestamp into a format that will be easier to use.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots may differ from the current interface if you are using a newer version.

- Event Streams 3.3.0
- Event Endpoint Management 11.1.1
- Event Processing 1.1.1

## Instructions

### Step 1 : Discover the topic to use

For this scenario, you need access to the sensor reading events.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog")

   If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

   If there are no topics in the catalog, you may need to complete the tutorial setup step to [populate the catalog](../guided/tutorial-0#populating-the-catalog).

1. The `SENSOR.READINGS` topic contains events from the IoT network.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-1.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-1.png "screenshot of the EEM catalog")

   The documentation in the catalog helpfully explains that the timestamps in the events are recorded using a `EEE MMM dd HH:mm:ss zzz yyyy` format.

### Step 2 : Create the pre-processing flow

The first event processing flow will read the events from the sensor readings topic, and produce them to a new Kafka topic with the timestamps rewritten in an SQL format.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page")

   If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that it will pre-process sensor readings to rewrite the timestamp.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-2.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-2.png "creating a pre-processing flow")

1. Create an **Event source** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-3.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-3.png "creating a pre-processing flow")

   Create an event source node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

1. Add an event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-4.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-4.png "creating a pre-processing flow")

   Hover over the event source node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Use the server address from the {{site.data.reuse.eem_name}} catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-5.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-5.png "creating a pre-processing flow")

   Click the Copy button next to the Servers address in the {{site.data.reuse.eem_name}} catalog to copy the address to the clipboard.

1. Use the **Generate access credentials** button in the {{site.data.reuse.eem_name}} catalog to create a username and password, and use that to configure the {{site.data.reuse.ep_name}} event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-6.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-6.png "creating a pre-processing flow")

1. Select the `SENSOR.READINGS` topic, then click "Next".

1. Click the "Upload a schema or sample message" button.

1. Paste in the sample message from the catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-7.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-7.png "creating a pre-processing flow")

1. Click **Configure** to finalize the event source.

1. Add a **Transform** node and link it to your event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-8.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-8.png "creating a pre-processing flow")

   Create a transform node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

   Click and drag from the small gray dot on the event source to the matching dot on the filter node.

1. Hover over the transform node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   Name the transform node `rewrite timestamp`.


1. Create a new property called `timestamp`.

1. Use the assistant to create a `TO_TIMESTAMP` expression.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-9.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-9.png "creating a pre-processing flow")

   The catalog gives you:

   - The name of the property containing the existing timestamp value (`sensortime`).
   - The format that it is in (`EEE MMM dd HH:mm:ss zzz yyyy`).

   Use these values to create the expression.

1. Click **Insert into expression**, and then click "Next".

1. Remove the `event_time` and `sensortime` properties as you won't need them.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-10.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-10.png "creating a pre-processing flow")

1. Click **Configure** to finalize the transform.

### Step 3 : Produce pre-processed events to a topic

The next step is to send the modified events to a new topic that can be used as a source for multiple other event processing flows.

1. Go to the **{{site.data.reuse.es_name}}** home page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-2.png "Event Streams"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-2.png "Event Streams")

   If you need a reminder about how to access the {{site.data.reuse.es_name}} web UI, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-streams).

1. Click the **Create a topic** tile.

1. Create a topic called `SENSOR.READINGS.SQLTIME`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-11.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-11.png "creating a pre-processing flow")

   You can use the default values for all the properties of the topic.

1. Click into the new topic page, and then click **Connect to this topic**.

1. Get the server address for the new topic from the {{site.data.reuse.es_name}} topic page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-13.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-13.png "creating a pre-processing flow")

   Click the copy button for the **Internal** Kafka listener to copy the address to the clipboard.

1. Create an **Event destination** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-12.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-12.png "creating a pre-processing flow")

   Create an event destination node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

1. Configure the event destination node using the {{site.data.reuse.es_name}} server address and credentials.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-14.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-14.png "creating a pre-processing flow")

   If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](../guided/tutorial-access#accessing-kafka-topics) section of the Tutorial Setup instructions.

1. Choose the new `SENSOR.READINGS.SQLTIME` topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-15.png "creating a pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-15.png "creating a pre-processing flow")

1. Click **Configure** to finalize the event destination.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-16.png "running the pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-16.png "running the pre-processing flow")

1. Confirm that the events have re-written timestamps from {{site.data.reuse.ep_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-17.png "running the pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-17.png "running the pre-processing flow")

1. Confirm that the transformed events are produced to the new topic from {{site.data.reuse.es_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-18.png "running the pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-18.png "running the pre-processing flow")

1. You can leave the flow running to continue producing transformed events to the new topic.


### Step 4 : Share the transformed events

The `SENSOR.READINGS.SQLTIME` topic now has events with a timestamp that can be used to perform time-based analysis.

Any other teams or colleagues who want to perform time-based analysis on the sensor reading events will need the timestamp reformatted in the same way, so it makes sense to share this topic in the catalog.

1. Go to the **{{site.data.reuse.eem_name}}** topics page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-1.png "screenshot of the EEM topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-1.png "screenshot of the EEM topics page")

1. Click **Add topic**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-2.png "screenshot of the EEM topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-2.png "screenshot of the EEM topics page")

1. Reuse the existing connection details to the {{site.data.reuse.es_name}} cluster.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-3.png "screenshot of the EEM topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-3.png "screenshot of the EEM topics page")

1. Choose the new `SENSOR.READINGS.SQLTIME` topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-19.png "running the pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-19.png "running the pre-processing flow")

1. Click **Add topic**.

1. Click the new `SENSOR.READINGS.SQLTIME` topic.

1. Use **Edit information** to provide documentation for the topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-20.png "running the pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-20.png "running the pre-processing flow")

1. Include a sample message from the {{site.data.reuse.es_name}} topic page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-21.png "running the pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-21.png "running the pre-processing flow")

1. Click **Save**.

1. Click the **Create option** button in the **Options** tab.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-22-i.png "running the pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-22-i.png "running the pre-processing flow")

1. Create a name for the access option you are creating.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-22-ii.png "running the pre-processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-22-ii.png "running the pre-processing flow")

   Calling the option "Self service" is a good way to describe a topic being published without any approval requirements.

1. Create a topic alias for the option.

   As this is the only option, `SENSOR.READINGS.SQLTIME` is a reasonable alias.

1. As we are not adding any additional controls, click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-10-ii.png "screenshot of topics editor"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-10-ii.png "screenshot of topics editor")

1. Click **Publish**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-10-iii.png "screenshot of topics editor"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-10-iii.png "screenshot of topics editor")

1. Choose the gateway group.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-11.png "screenshot of topics editor"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-6-11.png "screenshot of topics editor")

1. Click **Save**.


### Step 5 : Process the transformed sensor readings

The final step is to process the transformed sensor readings to identify the minimum and maximum sensor readings for each building in each hour.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

1. Create a flow, and give it a name and description to explain that it will process sensor readings.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-23.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-23.png "creating the processing flow")

1. Create an **Event source** node using the `SENSOR.READINGS.SQLTIME` topic from the {{site.data.reuse.eem_name}} catalog.

1. Use the sample message from the catalog to configure the event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-24.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-24.png "creating the processing flow")

1. Modify the type of the `timestamp` property that you created to be `Timestamp` (instead of the default "STRING").

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-25.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-25.png "creating the processing flow")

1. Choose the `timestamp` property to be used as the source of event time, and allow events to be up to **5 minutes** late.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-26.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-26.png "creating the processing flow")

   The catalog page for the original `SENSOR.READINGS` topic warns that events from this IoT sensor network can be delayed for up to five minutes after the sensor reading is captured. Configuring {{site.data.reuse.ep_name}} to wait for up to five minutes for sensor readings ensures that events won't be missed.

1. Click **Configure** to finalize the event source.

1. Create a **Transform** node to extract the building name from the sensor ID.

   The sensor ID is made up of:

   ```shell
   <building id> - <floor number> - <sensor number>
   ```

   For example:

   ```shell
   DE-2-11
   ```

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-27.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-27.png "creating the processing flow")

   Suggested function expression:

   ```sql
   REGEXP_EXTRACT(`sensorid`, '([A-Z]+)\-([0-9]+)\-([0-9]+)', 1)
   ```

   The regular expression function is simply capturing the first set of letters before the first hyphen character.

1. Add an **Aggregate** node to the flow.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-28.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-28.png "creating the processing flow")

1. Configure the aggregate to work in **1-hour** windows.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-29.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-29.png "creating the processing flow")

1. Create aggregate functions to get the `MIN` and `MAX` values for `temperature` and `humidity`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-30.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-30.png "creating the processing flow")

1. Group by `building`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-31.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-31.png "creating the processing flow")

1. Rename the output properties to be readable.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-32.png "creating the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-32.png "creating the processing flow")

### Step 6 : Run the flow

The final step is to run your completed flow, tracking the min and max sensor readings for each building from your transformed stream of events.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of sensor events available on this topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example9-33.png "running the processing flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example9-33.png "running the processing flow")

## Recap

A pre-processing flow can allow you to work with events that include timestamps in a wide variety of formats.
