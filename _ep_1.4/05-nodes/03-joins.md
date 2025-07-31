---
title: "Joins"
excerpt: "Event Processing provides a set of nodes to create event stream processing flows"
categories: nodes
slug: joins
toc: true
---


The following join nodes are available in {{site.data.reuse.ep_name}}:

- [Interval join](#interval-join)
- ![Event Processing 1.4.1 icon]({{ 'images' | relative_url }}/1.4.1.svg "In Event Processing 1.4.1 and later.") [Window join](#window-join)
- ![Event Processing 1.4.1 icon]({{ 'images' | relative_url }}/1.4.1.svg "In Event Processing 1.4.1 and later.") [Temporal join](#temporal-join)

## Interval join
{: #interval-join}

An interval join is used to merge two event streams based on a join condition that matches events within a time interval.

### Adding an interval join node

To add an interval join, complete the following steps:

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Joins**, drag the **Interval join** node into the canvas.
3. Connect the node to two input streams by separately dragging the **Output port** from each input node into the **Input port** of this node.
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure Interval join** window is displayed.


### Configuring an interval join node

To configure an interval join, complete the following steps:

1. {{site.data.reuse.node_details}}
1. In the **Join condition** section, either use the [assistant](#join-node-assistant) or enter your expression in the **Define events** text box to define your join condition, and then click **Next**.

   Examples:
   - Simple expression:

     ```shell
     source1.example_property = source2.example_property
     ```

   - Expression with a complex object property:

     ```shell
     source1.example_property.nested_object_property.leaf_property = source2.leaf_property
     ```

   - Expressions with array properties:

     ```shell
     - ARRAY_CONTAINS(source1.example_property.nested_object_property.leaf_array_property, source2.leaf_property)
     - ELEMENT(source1.array_property) = source2.leaf_property
     ```

   - Expressions with complex array properties:

      ```shell
      - ELEMENT(source1.example_array_property) = ELEMENT(source2.example_array_of_array_of_object_property[1][1].stringArray)
      - ARRAY_CONTAINS(source1.example_array_of_array_of_object_property[1][1].floatArray, source2.example_array_of_object_property[1].floatArray)
      - CARDINALITY(source1.example_array_of_array_property[1]) = CARDINALITY(source2.example_array_property) 
      ```

   Alternatively, to use the assistant to create your expression, complete the following steps:
   {: #join-node-assistant}

   a. Click the **Assistant** drop-down menu to open the assistant.

   b. In the **Property from [name of the first input stream]** drop-down menu, select the property that you want to match.

   c. In the **Property from [name of the second input stream]** drop-down menu, select a property to match the one chosen in step 2.

   d. Click **Add to expression** to insert the expression into the text-box.

   **Note:** Ensure that the property you choose for both sides of your expression has the same data type. 

   {{site.data.reuse.array_expression_note}}

   {{site.data.reuse.ep_treeview_note}}

1. In the **Time window condition** section, define the time window, and click **Next**.

   a. In the **Event to detect** drop-down menu, select the property of the event you are interested in.

   b. In the **Event to set the time window** drop-down menu, select the property of an event used to define the time window.

   c. In the **Offset from event to start the time window** field, input an integer value and select the corresponding time unit. Then input another integer in the **Offset from event to end the time window** field to define the duration of the time window.

   **Note:** Ensure that the end-time of the time window is later than the start-time.

1. In the **Match criteria** section, select at least one row in the **Select a join type** table to define how the two input streams are combined and which events are included in the result.
   {: #join-node-matching-criteria}


   - **Inner join:** Select only the row with **Event** for both the input streams. In this case, only merged events from the left and right input streams that match the join condition within the specified time window are returned in the result.

   - **Exclusive left join:** Select only the row with **Event** for the left input stream, and **No event** for the right input stream. In this case, only events from the left input stream that do not match the join condition within the specified time window are returned. Event properties of the right input stream are added to the returned events with NULL values.

   - **Inclusive left join:** Select both rows. In this case, all merged events from the left and right input streams that match the join condition within the specified time window are returned. Additionally, the events from the left input stream that do not match the join condition are also added with NULL values for the right input stream event properties.

   **Note:** Merged events that match the join condition are returned as soon as a match is found. However, events that do not match the join condition are only returned after the time window is closed for both input streams.

1. You can manage the properties that come from this node to suit your requirements in the **Output properties** section. When the properties from the events of the two input nodes are merged, you might have to resolve naming conflicts by renaming or removing properties.

   The merge of properties is done both at top-level and at nested levels. If both input nodes contain a complex object property with the same name, all the properties from both inputs are merged, and you need to resolve the naming conflicts by renaming or removing properties.


   When the **Exclusive left join** type is selected, all the properties that will always have a NULL value (that are the event properties of the right input stream) are removed by default. You can still add them again, if you want, by clicking the **Add** icon ![add icon]({{ 'images' | relative_url }}/add.svg "Diagram showing add icon."){:height="30px" width="15px"} in the **Properties to remove** table.

1. Optional: To rename a property, hover over the property name and click the **Edit** icon ![rename icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.

   a. In the text-box, enter a new name for your property.

   b. Click outside the text-box or press **Enter** on your keyboard to rename the property.

1. Optional: To remove a property from being displayed in the output, click the **Remove property** icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Icon showing a remove icon."){:height="30px" width="15px"}.

   **Note:** Take extreme care in removing an event time property. By keeping an event time property, you can propagate the event time to downstream nodes on the canvas. The event time property is necessary for time-based calculations in nodes, such as aggregate or another interval join.

1. Optional: To add a property that was previously removed, go to the **Properties to remove** table that lists the removed properties.

   In the row of the property that you want to restore, click the **Add** icon ![add icon]({{ 'images' | relative_url }}/add.svg "Icon showing an add icon."){:height="30px" width="15px"}.

1. To complete the interval join node configuration, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the interval join node if the interval join node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.

User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.

## ![Event Processing 1.4.1 icon]({{ 'images' | relative_url }}/1.4.1.svg "In Event Processing 1.4.1 and later.") Window join
{: #window-join}

A window join is used to merge two input event streams based on a join condition that matches events within the same time window.

For example, consider two streams of user interactions:

`click_stream`: contains user click events on a website
`purchase_stream`: contains user purchase events on a website

You can perform a window join on these two streams to identify users who clicked on a product and then purchased it within the same fixed 30-minute window.

The difference between a window join and an interval join is that a window join matches events from two streams within the same time window (for example, 5 minutes), while interval joins match events with timestamps within a specified interval of each other (for example, 5 minutes apart).

### Adding a window join node
{: #adding-window-join}

To add a window join, complete the following steps:

1. {{site.data.reuse.node_step1}}

1. In the **Palette**, under **Joins**, drag the **Window join** node into the canvas.

1. Connect the node to two input streams by separately dragging the Output port from each input node into the Input port of this node.

1. Hover over the node and click Edit to configure the node.

The Configure Window join window is displayed.

### Configuring a window join node
{: #configuring-window-join}

To configure a window join, complete the following steps:

1. In the **Details** section, enter a name for your node. The output stream of events from this node will be referred with the name you entered.

1. In the **Join condition** section, either use the [assistant](#window-join-assistant) or enter your expression in the **Define events** text-box to define your join condition, and then click **Next**.

   Simple expression:

   ```console
   source1.example_property = source2.example_property
   ```

   Expression with a complex object property:

   ```console
   source1.example_property.nested_object_property.leaf_property = source2.leaf_property
   ```

   Expressions with array properties:

   ```console
   ARRAY_CONTAINS(source1.example_property.nested_object_property.leaf_array_property, source2.leaf_property)
   ```

   ```console
   ELEMENT(source1.array_property) = source2.leaf_property
   ```

   Expressions with complex array properties:

   ```console
   ELEMENT(source1.example_array_property) = ELEMENT(source2.example_array_of_array_of_object_property[1][1].stringArray)
   ```

   ```console
   ARRAY_CONTAINS(source1.example_array_of_array_of_object_property[1][1].floatArray, source2.example_array_of_object_property[1].floatArray)  
   ```

   ```console
   CARDINALITY(source1.example_array_of_array_property[1]) = CARDINALITY(source2.example_array_property)
   ```

   Alternatively, to use the assistant to create your expression, complete the following steps:
   {: #window-join-assistant}

   a. Click the Assistant drop-down menu to open the assistant.

   b. In the Property from [name of the first input stream] drop-down menu, select the property that you want to match.

   c. In the Property from [name of the second input stream] drop-down menu, select a property to match the one chosen in step 2.

   d. Click Add to expression to insert the expression into the text-box.

   **Note:**

   - Ensure that the property you select for both sides of your expression has the same data type.

   - The Assistant drop-down menu does not support array properties. However, you can manually write the expressions by selecting the property from the list that appears when you press `Ctrl+Space` in the **Expression** field.

   - A tree view of the event structure is available. To view all the input properties of the current node, click **View input properties** in the upper-right corner of the pane.

1. In the **Time window condition** section, if the time window is defined earlier in a node, the time window is set with the earlier defined value. You cannot edit the time window by default.

   **Note:** You can still edit the time window by switching the toggle to **No**. But defining a new time window different from the one that is already defined in a previous node can cause unexpected side effects.

   To define a new time window:

   In the **Property to use for the start of the time window** field, select the property of the event that corresponds to an event time. This property is used internally to define the start of the first time window.

1. In the **Time window duration** field, specify the duration of each time window.

   **Note:** A time window is defined by a start time and an end time based on the event time of the event, not the wall-clock time. The start time and the end time values are timestamps. An event is assigned to a time window if its event time is between the start time and the end time of this time window. The top number calculation is performed for all events contained in every time window. The closure of a time window triggers the top number calculation when either of the following conditions are met:

   An event having an event time value greater than the end of the windows that is processed by the node.

   A timeout period elapses after an event source becomes idle. For more information about the source idleness time, see the Flink documentation.

   In a standard time window, events are assigned to time windows of a fixed-size that do not overlap. To assign events to one or more time windows, you need to enable a rolling time window.

1. Optional: To enable a rolling time window, in the **Calculate a rolling time window** field, select **Yes**.

1. In the **Offset from the start of the time window**, specify a time offset to every time window start time, thereby defining additional overlapping time windows.

1. In the **Match criteria** section, select at least one row in the **Select a join type** table to define how the two input streams are combined and which events are included in the result. See the following table for the available join types:

   **Note:** Merged events that match the join condition within the specified time window are returned as soon as a match is found. However, events that do not match the join condition are only returned after the time window is closed for both input streams.

   | Join type | Rows to select  | Returned events | NULL values in returned events |
   |---|---|---|---|
   | Inner join | Event for both input streams | Merged events from left and right input streams that match | No NULL values |
   | Exclusive left join | Event for left input stream and No event for right input stream | Events from left input stream that do not match | NULL values for right input stream event properties |
   | Exclusive right join |  No event for left input stream and Event for right input stream | Events from right input stream that do not match  | NULL values for left input stream event properties |
   | Inclusive left join |  - Event for both input streams <br><br> - Event for left input stream with No event for right input stream | Merged events from left and right input streams that match | NULL values for right input stream event properties for unmatched events |
   | Inclusive right join |  - Event for both input streams <br><br> - No event for left input stream and Event for right input stream | Merged events from left and right input streams that match | NULL values for left input stream event properties for unmatched events |
   | Exclusive full outer join | - Event for the left input stream, and No event for the right input stream <br> <br> - No event for the left input stream and Event for the right input stream | Events from both input streams that do not match (no joined matches) | NULL values for the missing side in each unmatched event from both streams |
   | Full outer join | Select all three rows | Merged events from left and right input streams that match | NULL values for the missing side in each unmatched event from both streams |

1. You can manage the properties that come from this node to suit your requirements in the Output properties section. When the properties from the events of the two input nodes are merged, you might have to resolve naming conflicts by renaming or removing properties.

   The merge of properties is done both at top-level and at nested levels. If both input nodes contain a complex object property with the same name, all the properties from both inputs are merged, and you need to resolve the naming conflicts by renaming or removing properties.

   When the **Exclusive left join** or the **Exclusive right join** type is selected, all the properties that will always have a NULL value (specifically, the event properties of the right input stream in an exclusive left join, or those of the left input stream in an exclusive right join) are removed by default. You can still add them again, if you want, by clicking the **Add** icon ![add icon]({{ 'images' | relative_url }}/add.svg "Diagram showing add icon."){:height="30px" width="15px"} in the **Properties to remove** table.

1. Optional: To rename a property, hover over the property name and click the **Edit** icon ![rename icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.

   a. In the text-box, enter a new name for your property.

   b. Click outside the text-box or press **Enter** on your keyboard to rename the property.

1. Optional: To remove a property from being displayed in the output, click the **Remove property** icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Icon showing a remove icon."){:height="30px" width="15px"}.

   **Note:** Take extreme care in removing an event time property. By keeping an event time property, you can propagate the event time to downstream nodes on the canvas. The event time property is necessary for time-based calculations in nodes, such as aggregate or another window join.

1. Optional: To add a property that was previously removed, go to the **Properties to remove** table that lists the removed properties.

   In the row of the property that you want to restore, click the **Add** icon ![add icon]({{ 'images' | relative_url }}/add.svg "Icon showing an add icon."){:height="30px" width="15px"}.

1. To complete the window join node configuration, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the window join node if the window join node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.


User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.

## ![Event Processing 1.4.1 icon]({{ 'images' | relative_url }}/1.4.1.svg "In Event Processing 1.4.1 and later.") Temporal join
{: #temporal-join}

A temporal join can be used to combine a main event with the most recent supplementary event based on a join condition and timestamp.

This join is useful for combining events in scenarios where the time of an event is important for processing purposes, such as stock trading and currency conversions.

For example, consider two event sources, which consist of events of stocks sold and the stock price. If stocks that are sold is a main event, you can combine the stocks sold with the stock price at the time of selling by using the temporal join node. Then, you can do further processing such as calculate the profit or loss.

### Adding a temporal join node
{: #adding-temporal-join}


To add a temporal join, complete the following steps:

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Joins**, drag the **Temporal join** node into the canvas.
3. Connect the node to two input streams by separately dragging the **Output port** from each input node into the **Input port** of this node.
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure Temporal join** window is displayed.


### Configuring a temporal join node
{: #configuring-temporal-join}

To configure a temporal join, complete the following steps:

1. In the **Details** pane, enter a name for your node in the **Node name** field. The output stream of events from this node will be referred with the name you entered.
1. Select the main event source and the supplementary event source and their event time properties in the **Event source configuration** section. Then, click **Next**.
1. In the **Join condition** pane, select properties from both event sources to define a context to match the events by. For example, if you are converting currencies, select the price of the order from the main event property and the currency conversion rate from the supplementary event property.

   **Note:** The supplementary event property is a [primary key](https://nightlies.apache.org/flink/flink-docs-release-2.0/docs/dev/table/sql/create/#primary-key){:target="_blank"}, which means that the property must not contain NULL values.

1. ![Event Processing 1.4.2 icon]({{ 'images' | relative_url }}/1.4.2.svg "In Event Processing 1.4.2 and later.") Optional: You can add multiple join conditions on the primary key. To add another join condition on the primary key, click **Add another join condition**. Then, click **Next**.

   **Note:** If you have two join conditions, it is considered a match only if both the join conditions result to true.

1. In the **Match criteria** pane, define how the two input streams are combined, and which events are included in the result by selecting at least one row in the **Event matches to keep** table.

   - **Inner join:** Select only the row with **Event** for both input streams. In this case, only merged events from the left and right input streams that match the join condition are returned in the result.

   - **Exclusive left join:** Select only the row with **Event** for the left input stream, and **No event** for the right input stream. In this case, only events from the left input stream that do not match the join condition are returned. Event properties of the right input stream are added to the returned events with NULL values.

   - **Inclusive left join:** Select both rows. In this case, all merged events from the left and right input streams that match the join condition are returned. Additionally, the events from the left input stream that do not match the join condition are also added with NULL values for the right input stream event properties.  

1. You can manage the properties that come from this node to suit your requirements. When the properties from the events of the two input nodes are merged, you might have to resolve naming conflicts by renaming or removing properties.

   The merge of properties is done both at top-level and at nested levels. If both input nodes contain a complex object property with the same name, all the properties from both inputs are merged, and you need to resolve the naming conflicts by renaming or removing properties.


   When the **Exclusive left join** type is selected, all the properties that will always have a NULL value (that are the event properties of the right input stream) are removed by default. If required, you can add them again by clicking the **Add** icon ![add icon]({{ 'images' | relative_url }}/add.svg "Diagram showing add icon."){:height="30px" width="15px"} in the **Properties to remove** table.

1. After you have set up the temporal join node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the temporal join node if the temporal join node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.