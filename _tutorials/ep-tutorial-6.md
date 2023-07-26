---
title: "Identify trends from events"
description: "Identifying types of events that occur most frequently within a time window is a useful way to detect trends."
permalink: /tutorials/event-processing-examples/example-06
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 6
---

## Scenario

The web team wants to promote which style of product has sold the most units in the last hour in a new "trending product" section of their home page.

This is an extension to the [Track how many products of each type are sold per hour](../guided/tutorial-3) tutorial. In that tutorial, we counted how many units of each product type are sold in each hour.

To refine the previous tutorial flow, this tutorial shows you how to identify the style with the highest number of units sold per hour.

## Instructions

### Step 1 : Create a flow

This tutorial begins with the flow that was created in the [Track how many products of each type are sold per hour](../guided/tutorial-3) tutorial, which gives an hourly count of the number of units that are sold of each style.

If you haven't completed that tutorial yet, you should do it now.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-1.png "flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-1.png "flow")

Run the flow to remind yourself of the output.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-2.png "flow results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-2.png "flow results")

When you have finished reviewing the results, you can stop this flow.


### Step 2 : Identify highest sales per hour

The next step is to identify the highest number of unit sales in each hour window.

1. Add an **Aggregate** node to the flow.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-3.png "aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-3.png "aggregate node")

   Create an aggregate node by dragging one onto the canvas. You can find this in the "Processors" section of the left panel.

   Click and drag from the small gray dot on the transform to the matching dot on the aggregate node.

1. Call the aggregate node `identify highest unit sales`.

   Configure the aggregate node by clicking the three dot menu, and choosing "Edit".

1. Define a **one hour** window in which to calculate the max unit sales.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-4.png "aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-4.png "aggregate node")

1. Compute the `MAX` total sales value for each hour window.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-5.png "aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-5.png "aggregate node")

1. Rename the output fields.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-6.png "aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-6.png "aggregate node")

1. Click **Configure** to finalize the aggregate.

### Step 3 : Identify best selling style

The next step is to use the max units sold results to identify the best selling product type in each hour.

1. Add an **Interval join** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-7.png "join node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-7.png "join node")

   Link the join node to the two aggregate nodes.

1. Call the join node `hourly trending styles`.

1. Define the join to match hourly sales with the highest hourly sales, based on **both** the number of sales and the time window.

   Suggested value for the join condition:

   ```sql
   `identify highest unit sales`.`max total sales` = `hourly sales by type`.`total sales`  AND  `identify highest unit sales`.`max start time` = `hourly sales by type`.`start time`
   ```

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-8.png "join node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-8.png "join node")

1. Specify a time window that matches the two streams. As the times on each stream match, the time window can be very small.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-9.png "join node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-9.png "join node")

1. Make a record of the results that describe the start/end time, the number of sales, and the product type.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-10.png "join node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-10.png "join node")

1. Click **Configure** to finalize the join.


### Step 4 : Test the flow

The final step is to run your event processing flow and view the results.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-11.png "results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-11.png "results")

Notice that the flow returns a single result only for each hour window - so in the (unlikely) event that two different product styles both had the highest number of sales for the hour, then only one of these will be returned.

For the purposes of this scenario (where the web team have a single space on the web page to promote something that is currently selling a lot) this isn't a concern. It doesn't matter if there is another product style that is also selling the same amount.
