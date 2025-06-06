---
title: "Joins"
excerpt: "Event Processing provides a set of nodes to create event stream processing flows"
categories: nodes
slug: joins
toc: true
---

An interval join is available in {{site.data.reuse.ep_name}}.

## Interval join

An interval join is used to merge two event streams based on a join condition that matches events within a time period.


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

1. In the **Matching criteria** section, select at least one row in the **Select a join type** table to define how the two input streams are combined and which events are included in the result.
   {: #join-node-matching-criteria}


   - **Inner join:** Select only the row with **Event** for both the input streams. In this case, only merged events from the left and right input streams that match the join condition within the specified time window are returned in the result.

   - **Exclusive left join:** Select only the row with **Event** for the left input stream, and **No event** for the right input stream. In this case, only events from the left input stream that do not match the join condition within the specified time window are returned. Event properties of the right input stream are added to the returned events with NULL values.

   - **Inclusive left join:** Select both rows. In this case, all merged events from the left and right input streams that match the join condition within the specified time window are returned. Additionally, the events from the left input stream that do not match the join condition are also added with NULL values for the right input stream event properties.

   **Note:** Merged events that match the join condition are returned as soon as a match is found. However, events that do not match the join condition are only returned after the time window is closed for both input streams.

1. You can manage the properties that come from this node to suit your requirements in the **Output properties** section. When the properties from the events of the two input nodes are merged, you might have to resolve naming conflicts by renaming or removing properties.

   The merge of properties is done both at top-level and at nested levels. If both input nodes contain a complex object property with the same name, all the properties from both inputs are merged, and you need to resolve the naming conflicts by renaming or removing properties.


   When the **exclusive left join** type is selected, all the properties that will always have a NULL value (that are the event properties of the right input stream) are removed by default. You can still add them again, if you want, by clicking the **Add** icon ![add icon]({{ 'images' | relative_url }}/add.svg "Diagram showing add icon."){:height="30px" width="15px"} in the **Properties to remove** table.

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

