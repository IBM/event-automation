---
title: "3 - Aggregate events to detect trends over time"
description: "Processing events over a time-window allows you to build a summary view of a situation which can be useful to identify overall trends."
permalink: /tutorials/guided/tutorial-3
toc: true
section: "Guided tutorials for IBM Event Automation"
cardType: "large"
order: 3
---

## Aggregate

Aggregates enable you to process events over a time-window. This enables a summary view of a situation that can be useful to identify overall trends.

## Transform

When processing events we can modify events to create additional properties, which are derived from the event. Transforms work on individual events in the stream.

{% include video.html videoSource="videos/tutorials/guided/03-aggregate.mp4" %}{: class="tutorial-video" }

## Scenario : Track how many products of each type are sold per hour
{: #scenario}

In this scenario, we identify the product that has sold the most units in each hourly window. This could be used to drive a constantly updating event streams view of "Trending Products".

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

1. Create a flow, and give it a name and description that explains you will use it to track how many products are sold of each type.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-1.png "creating a flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-1.png "creating a flow")

### Step 2 : Provide a source of events

The next step is to bring the stream of events to process into the flow. We will reuse the topic connection information from an earlier tutorial.

1. Create an **Event source** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-2.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-2.png "adding an event source node")

   Create an event source node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

1. Choose the `ORDERS` topic that you used in the [Identify orders from a specific region](./tutorial-1) tutorial.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-3.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-3.png "adding an event source node")

   **Tip**: If you haven't followed that tutorial, you can click **Add new event source** instead, and follow the [Provide a source of events](./tutorial-1#event-source) steps in the previous tutorial to define a new Event source from scratch.

1. Click **Next**.

1. The schema for events on this topic defined before is displayed. Click **Configure**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-2-i.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-2-2-i.png "adding an event source node")

1. To rename the event source, click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}, and enter a name for your event source node in the **Details > Node name** section.

### Step 3 : Extract product type from events

The product description value in the events includes several attributes of the jeans that are sold - the size, material, and style. We would like to aggregate the data based on this information. This data in the description is combined as a single string in a consistent way. This means we can extract them using regular expressions.

In the next step, we extract product type into a separate property so that we can use them to filter and aggregate events later in the flow.

1. Add a **Transform** node and link it to your event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-4.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-4.png "defining the transformation")

   Create a transform node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

   Click and drag from the small gray dot on the event source to the matching dot on the transform node.

1. Give the transform node a name that describes what it will do: `get product type`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-5.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-5.png "defining the transformation")

   Hover over the transform node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Add a new property for the product type that you will generate with a regular expression.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-6.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-6.png "defining the transformation")

   Click **Create new property**.

   Name the property `product type`.

   Use the assistant to choose the `REGEXP_EXTRACT` function from the list.

   **Did you know?** The `REGEXP_EXTRACT` function allows you to extract data from a text property using regular expressions.

1. Define the regular expression that extracts the product type from the description.

   > Product descriptions are all made up of four words.
   >
   > Some examples:

   > - `XXS Navy Cargo Jeans`
   > - `M Stonewashed Capri Jeans`
   > - `XL White Bootcut Jeans`
   > - `S Acid-washed Jogger Jeans`
   >
   > Each word contains similar information in each description:
   >
   > word 1 : Size. This is made up of one-or-more uppercase letters.
   >
   > word 2 : Material or color, made up of a mixed-case word, optionally with a hyphen.
   >
   > word 3 : The type of jeans, made up of a mixed-case word, optionally with a hyphen.
   >
   > word 4 : The text "Jeans".

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-6-i.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-6-i.png "defining the transformation")

   Create a regular expression that extracts the third word from the description text, by filling in the assistant form with the following values:

   **text** :

   ```shell
   description
   ```

   This identifies which property in the order events that contains the text that you want to apply the regular expression to.

   **regex** :

   ```shell
   ([A-Z]+) ([A-Za-z\-]+) ([A-Za-z\-]+) Jeans
   ```

   This can be used to match the description as shown above - describing the four words that every description contains.

   **index** :

   ```shell
   3
   ```

   This specifies that you want the new product type property to contain the third word in the description.

1. Click **Insert into expression** to complete the assistant.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-6-ii.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-6-ii.png "defining the transformation")

1. As you aren't modifying existing properties, click **Next**.

1. Click **Configure** to finalize the transform.


### Step 4 : Testing the flow

The next step is to test your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-7.png "testing the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-7.png "testing the flow")

   **Tip**: It is good to regularly test as you develop your event processing flow to confirm that the last node you have added is doing what you expected.

   Note the new property for product type is populated with the data extracted from the description property.

1. When you have finished reviewing the results, you can stop this flow.


### Step 5 : Count the number of events of each type

Now that you have transformed the stream of events to include the type attribute, the next step is to total the number of items sold (using this new property).

1. Add an **Aggregate** node and link it to your event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-8.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-8.png "defining the aggregation")

   Create an aggregate node by dragging one onto the canvas. You can find this in the **Windowed** section of the left panel.

   Click and drag from the small gray dot on the transform to the matching dot on the aggregate node.

1. Name the aggregate node to show that it will count the number of units sold of each type: `hourly sales by type`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-9.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-9.png "defining the aggregation")

   Hover over the aggregate node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Specify a 1-hour window.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-10.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-10.png "defining the aggregation")

1. Sum the number of items sold in each hour, grouped by product type.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-11.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-11.png "defining the aggregation")

   Select `SUM` as the aggregate function.

   The property we are adding up is `quantity` - the number of items that are sold in each order. This will add up the number of items sold in each order that happens within the time window.

   Finally, select the new property `product type` as the property to group by. This will add up the number of items sold of each type.

1. Rename the new aggregate properties.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-12.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-12.png "defining the aggregation")

   **Tip**: It can be helpful to adjust the name of properties to something that will make sense to you, such as describing the SUM property as `total sales`.

1. Click **Configure** to finalize the aggregate.

### Step 6 : Testing the flow

The final step is to run your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-13.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-3-13.png "running the flow")

   The output window shows that your aggregate is returning the total number of items for each type of product within each window of time.

1. When you have finished reviewing the results, you can stop this flow.

## Recap

You used a transform node to dynamically extract a property from the description within the order events.

You used an aggregate node to count the events based on this extracted property, grouping into one-hour time windows.

## Next step

In the [next tutorial](./tutorial-4), you will try an interval join to correlate related events from multiple different event streams.
