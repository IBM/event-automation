---
title: "Windowed nodes"
excerpt: "Event Processing provides a set of nodes to create event stream processing flows"
categories: nodes
slug: windowednodes
toc: true
---

The following windowed nodes are available in {{site.data.reuse.ep_name}}:

- [Aggregate](#aggregate)
- [Top-n](#top-n)

## Aggregate

Use an aggregate node to divide the stream of events into time-based chunks and then run an aggregate function on each of these chunks.

### Adding an aggregate node

To add an aggregate node, complete the following steps:

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processor**, drag the **Aggregate** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Icon showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the aggregate node indicating that the node is yet to be configured.
4. Hover over the node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   The **Configure aggregate** window appears.

### Configuring an aggregate node

To configure an aggregate node, complete the following steps:

1. {{site.data.reuse.node_details}}
1. Click **Next** to open the **Time window** pane.
1. If a time window is already defined in a previous node, the time window is already prefilled with this time window, and the time window edition is disabled by default.
For example, a top-n node followed by an aggregate node to "Calculate the total of the 3 highest orders by customer per hour".

      **Note:** You can still edit the time window by switching the toggle to **No**, but defining a new time window different from the one that is already defined in a previous node can cause unexpected side effects.

1. To define a new time window:
   1. In the **Property to use for the start of the time window** field, select the property of the event that corresponds to an event time. This property is used internally to define the start of the first time window.
   1. In the **Time window duration** field, specify the duration of each time window.

      **Note:** A time window is defined by a start time and an end time based on the event time of the event, not the wall-clock time.
      The start time and the end time values are timestamps. An event is assigned to a time window if its event time is between the start time and the end time of this time window. The aggregate calculation is performed for all events contained in every time window. The closure of a time window triggers the top number calculation when either of the following conditions are met:
      - An event having an event time value greater than the end of the windows that is processed by the node.
      - A timeout period elapses after an event source becomes idle. For more information about the source idleness time, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/connectors/table/kafka/#source-per-partition-watermarks){:target="_blank"}.

      In a standard time window, events are assigned to time windows of a fixed-size that do not overlap. For example, "Calculate the average price of products sold every day". To assign events to one or more time windows, you need to enable a rolling time window. An example of a rolling time window is "Calculate the average price of products sold in the last twenty-four hours and repeat this calculation every hour".
   1. Optional: To enable a rolling time window, in the **Calculate a rolling time window** field, select **Yes**.
      1. In the **Offset from the start of the time window**, specify a time offset to every time window start time, thereby defining additional overlapping time windows.
1. Click **Next** to open the **Aggregate function** pane.

   ![Event Processing 1.1.9 icon]({{ 'images' | relative_url }}/1.1.9.svg "In Event Processing 1.1.9 and later.") {{site.data.reuse.ep_treeview_note}} 

1. To define how you would like to aggregate events over time windows, in the **Aggregate function** field, select an aggregate function.
1. In the **Property to aggregate** field, select the event property that you want to use.
1. Optional: To compute aggregate operations on additional properties over each time window, click **Add another aggregate function** and repeat steps 7 and 8.
2. Optional: You can group events by one or more properties over each time window. By doing so, all aggregate functions you specified are applied in each time window on group of events having the same property value. For example, "Compute the sum of product prices every hour, grouped by order identifier".
3. Click **Next** to open the **Output properties** pane. You can manage the properties that are displayed in the output when you view the results after running the flow.
4. Optional: To remove a property so that it is not displayed in the output, click the **Remove property** icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){: height="30px" width="15px"}.

   **Note:** The following properties are added by default in the output:
   - Start time of the time window.
   - End time of the time window.
   - Result time of the time window: The end of the time window minus one millisecond. This is an event time.

   **Warning:**
   - Do not use properties named `window_start`, `window_end` and `window_time` because they are used internally in Flink.
   - Ensure you have not specified any of these properties in any node upstream in your graph.
   - Do not rename any properties using any of these names.
   - If you want to reuse the time window in a following node, do not remove any of the time window properties (start time, end time, or result time) added in the output.
   
5. Optional: To rename a property, hover over the property name, and click the **Edit icon** ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){: height="30px" width="15px"}.
   1. In the text-box, enter a new name for your property.
   2. Click outside the text-box or press Enter on your keyboard to rename the property.
6. To complete the aggregate node configuration, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the aggregate node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.

User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.


## Top-n

A top-n node is a filter for the highest or lowest values of a particular property within a specified time window. It divides a stream of events into time-based chunks and then selects the events with the top number (top-n) of highest or lowest values on each chunk. You specify the top number and then decide whether to sort the top number of rows into ascending or descending order so that the highest or lowest values of a particular property are returned.

### Adding a top-n node

To add a top-n node, complete the following steps:

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processor**, drag the **Top-n** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Icon showing the unconfigured node icon."){: height="30px" width="15px"} appears on the top-n node indicating that the node is yet to be configured.
4. Hover over the node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   The **Configure top-n** window appears.

### Configuring a top-n node

To configure a top-n node, complete the following steps:

1. {{site.data.reuse.node_details}}
1. Click **Next** to open the **Time window** pane.
1. If a time window is already defined in a previous node, the time window is already prefilled with this time window, and the time window edition is disabled by default.
For example, an aggregate node followed by a top-n node to "Calculate the 3 product types with the highest total sales per hour".

   **Note:** You can still edit the time window by switching the toggle to **No**, but defining a new time window different from the one that is already defined in a previous node can cause unexpected side effects.

1. To define a new time window:
   1. In the **Property to use for the start of the time window** field, select the property of the event that corresponds to an event time. This property is used internally to define the start of the first time window.
   1. In the **Time window duration** field, specify the duration of each time window.

      **Note:** A time window is defined by a start time and an end time based on the event time of the event, not the wall-clock time.
      The start time and the end time values are timestamps. An event is assigned to a time window if its event time is between the start time and the end time of this time window. The top number calculation is performed for all events contained in every time window. The closure of a time window triggers the top number calculation when either of the following conditions are met:
      - An event having an event time value greater than the end of the windows that is processed by the node.
      - A timeout period elapses after an event source becomes idle. For more information about the source idleness time, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/connectors/table/kafka/#source-per-partition-watermarks){:target="_blank"}.


      In a standard time window, events are assigned to time windows of a fixed-size that do not overlap. For example, "Get the 5 most valuable orders placed every day". To assign events to one or more time windows, you need to enable a rolling time window. An example of a rolling time window is "Get the 5 most valuable orders placed in the last 24 hours and repeat this calculation every hour".
   1. Optional: To enable a rolling time window, in the **Calculate a rolling time window** field, select **Yes**.
      1. In the **Offset from the start of the time window**, specify a time offset to every time window start time, thereby defining additional overlapping time windows.
1. Click **Next** to open the **Condition** pane.

   ![Event Processing 1.1.9 icon]({{ 'images' | relative_url }}/1.1.9.svg "In Event Processing 1.1.9 and later.") {{site.data.reuse.ep_treeview_note}}
1. In the **Number of results to keep on each window** field, specify the number of results that you want to see for each time period.
1. In the **Ordered by** field, select the property to use for sorting the events.
1. Select **Ascending** or **Descending** according to the following rule:

   - If you select **Ascending**, you get the events with the top number of lowest values of the selected property, for instance from 1 to 9. For strings, it would sort in the order A to Z.
   - If you select **Descending**, you get the events with the top number of highest values of the selected property, for instance from 9 to 1. For strings, it would sort in the order Z to A.
1. Optional: To group events by one or more properties over each time window, in the **Grouped by** field, select the property that you want to group by.  

   **Note:** When you do this, the top-n condition is applied in each time window on a group of events that have the same property value. For example, "Get the 5 most valuable orders placed every day, grouped by customer identifier".
1. Optional: To select an additional group to group by, click **Group by another property**.
1. Click **Next** to open the **Output properties** pane. You can manage the properties that are displayed in the output when you view the results after running the flow.
1. Optional: To remove a property so that it is not displayed in the output, click the **Remove property** icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){: height="30px" width="15px"}.

   **Note:** The following properties are added by default in the output:
     - `topN`: A sequential number between 1 and N according to the ordering of the events within the time window.
     - Start time of the time window.
     - End time of the time window.
     - Result time of the time window: The end of the time window minus one millisecond. This is an event time.

   **Warning:**
   - Do not use properties named `window_start`, `window_end` and `window_time` because they are used internally in Flink.
   - Ensure you have not specified any of these properties in any node upstream in your graph.
   - Do not rename any properties using any of these names.
   - If you want to reuse the time window in a following node, do not remove any of the time window properties (start time, end time, result time) added in the output.

1. Optional: To rename a property, hover over the property name, and click the **Edit icon** ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){: height="30px" width="15px"}.
   1. In the text-box, enter a new name for your property.
   1. Click outside the text-box or press Enter on your keyboard to rename the property.
1. To complete the top-n node configuration, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the top-n node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.

User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.


