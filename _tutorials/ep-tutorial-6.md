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

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots may differ from the current interface if you are using a newer version.

- Event Processing 1.1.1

## Instructions

### Step 1 : Create a flow

This tutorial begins with the flow that was created in the [Track how many products of each type are sold per hour](../guided/tutorial-3) tutorial, which gives an hourly count of the number of units that are sold of each style.

If you haven't completed that tutorial yet, you should do it now.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-1.png "flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-1.png "flow")

Run the flow to remind yourself of the output.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-2.png "flow results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-2.png "flow results")

When you have finished reviewing the results, you can stop this flow.


### Step 2 : Identify the best selling style

The next step is to identify the best selling product type in each hour.

1. Add a **Top-n** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-12.png "top-n node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-12.png "top-n node")

   Link the top-n node to the aggregate node.

1. Call the Top-n node `top selling style`.

1. Reuse the time window already defined in the previous aggregate node: **1 hour**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-13.png "time window"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-13.png "time window")

1. Specify which property to sort results by (**total sales**) and how many results to keep (**1**).

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-14.png "top-n node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-14.png "top-n node")

   If you wanted to keep the top three selling styles for each hour, for example, you would set this to 3.

1. Choose the output properties that will be useful to return.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-15.png "top-n node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-15.png "top-n node")

1. Click **Configure** to finalize the top-n.


### Step 3 : Test the flow

The final step is to run your event processing flow and view the results.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example6-16.png "results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example6-16.png "results")

Every hour an event will be emitted with the name of the best selling style in the previous hour, and the total number of units sold.

The web team can use this to drive a trending products section on their web page to promote something that is currently selling a lot of items.
