---
title: "Processor nodes"
excerpt: "Event Processing provides a set of nodes to create event stream processing flows"
categories: nodes
slug: processornodes
toc: true
---

The following processor nodes are available in {{site.data.reuse.ep_name}}:

- [Filter](#filter)
- [Transform](#transform)
- [Aggregate](#aggregate)
- [Window top-n](#window-top-n)


## Filter

A filter node takes in a stream of events and applies an expression to determine which events to allow to pass and which to block. The output of the filter node is a single stream of events that can be used for analysis or other processing. This node helps to reduce the amount of data by allowing events that match the expression.

### Adding a filter node

To add a filter node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processors**, drag the **Filter** node into the canvas.
3. {{site.data.reuse.node_connect}}
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure a Filter** page appears.

### Configuring a filter node

To configure a filter node, complete the following steps.

1. {{site.data.reuse.node_details}}
2. Click **Next** to open the **Define Filter** section.  
3. Enter an expression in the **Filter Expression** text box to filter the events. The expression consists of a property, a mathematical condition, and a value. You can create a simple expression with one condition or a complex expression with multiple conditions based on your requirement. You can create multiple conditions within an expression by using `AND` or `OR`.

   Examples:
      - simple expression:

        ```transparent
        example_property > 100
        ```

      - complex expression:

         ```transparent
         example_property1 > 50 AND example_property2 > 30 OR example_property3 < 25 AND example_property4 < 250
         ```

   **Note:** Expressions are prioritized based on [operator precedence](https://calcite.apache.org/docs/reference.html#operators-and-functions){:target="_blank"}.

   Alternatively, you can use the assistant to create an expression. Select **Assistant** at the right end of the text-box to open the assistant. The assistant provides a drop-down list of properties and conditions that you can use to create the expression.
4. Scroll down and click the **Configure Filter** button to complete the configuration.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the filter node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.

## Transform

A transform node takes in a stream of events to modify your existing properties or create new properties. Existing properties can be removed or renamed, and new properties can be added. The value of a new property is determined by the expression you create.

Transform node supports various functions to create an expression. For more information about functions, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/functions/systemfunctions/#scalar-functions){:target="_blank"}.


### Adding a transform node

To add a transform node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processor**, drag-and-drop the **Transform** node into the canvas.
3. {{site.data.reuse.node_connect}}
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   The **Configure Transform** page appears.

### Configuring a transform node

Follow the instructions to configure the transform node.

#### Details

{{site.data.reuse.node_details}}

#### Create properties

Create a new property to add to your output. The property is created with a value that is determined by an expression you configure. You can use the functions offered by the transform node to create an expression.

To create a new property, complete the following steps.

1. Click the **Create property** button to add a new property to the table.
2. Hover over the property name and click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} and enter a name for your property.
3. Enter your expression in the **Expression** text box to define your property.

Follow the instructions to enter an expression by using the assistant:

1. Click the **Assistant** drop-down menu to open the assistant.
2. In the **Select function** drop-down menu, select a function with which you want to create an expression.
3. In the function you selected previously, enter the required values.
4. Select **Insert into expression** to add the expression in the text-box.

**Note:** Ensure you choose the values with correct data type for your expression. Properties that are used as values in the comparison operations must be of the same data type. Arithmetic operations are only allowed on integer and double data types. String operations are only possible with properties of string data type. Some temporal functions require a timestamp data type.

Repeat the steps to create more properties, and then click **Next**.

#### Output properties

You can manage the properties that come from this node to suit your requirements. Follow the instructions to modify your properties:

#### Rename a property

To rename a property, complete the following steps.

1. Hover over the property name and click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.
2. In the text-box, enter a new name for your property.
3. Click outside the text-box or press **Enter** in your keyboard to rename the property.

#### Remove property

To remove a property from being displayed in the output, click **Remove property** icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){:height="30px" width="15px"}.

#### Add a removed property

To add a property that was previously removed, complete the following steps.

1. Go to the **Properties to remove** table that lists the removed properties.
2. In the property you want to add back, click the add icon ![add icon]({{ 'images' | relative_url }}/add.svg "Diagram showing add icon."){:height="30px" width="15px"}.

After you have set up the transform node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the transform node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.


## Aggregate

Use an aggregate node to divide the stream of events into time-based chunks and then run an aggregate function on each of these chunks.

### Adding an aggregate node

To add an aggregate node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processor**, drag the **Aggregate** node into the canvas.
3. {{site.data.reuse.node_connect}}
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   The **Configure aggregate** page appears.

### Configuring an aggregate node

Follow the instructions to configure the aggregate node.

#### Details

{{site.data.reuse.node_details}}

#### Time Window

To define time windows, you must specify the following items.

- The property of the event that corresponds to an event time. This property is used internally to define the start of the first time window.

- The duration of each time window.

A time window is defined by a start time and an end time based on the event time of the event, not the wall-clock time.
The start time and the end time values are timestamps.

An event is assigned to a time window if its event time is between the start time and the end time of this time window.

Aggregate computations are performed on all events contained in every time window.

The closure of a time window triggers the aggregate computations when either of the following conditions are met:

- An event having an event time value greater than the end of the windows that is processed by the node.

- A timeout period elapses after an event source becomes idle.

  For more information about event source idleness, see [configuring Flink](../../installing/configuring).

**Standard time window**

Events are assigned to time windows of a fixed-size that do not overlap.

A usage example for this kind of aggregation is:

- Calculate the average price of products sold every day

**Rolling time window**

When enabling the **Calculate a rolling window** option, you can trigger aggregate operations on a sliding period of time.

You have to specify a time offset to every time window start time, thereby defining additional overlapping time windows.

As a result, an event can then be assigned to one or more time windows.

A usage example for this kind of aggregation is:

- Calculate the average price of products sold in the last twenty four hours and repeat this calculation every hour.

#### Aggregate functions

Define how you would like to aggregate the events over time windows.

To compute an aggregate operation on the values of a event property over each time window:

- Select an aggregate function in **Aggregate function**.

- Select an available event property in **Property to aggregate**.

**Note:** To compute aggregate operations on additional properties over each time window:

- Click **Add another aggregate function**.

- Select an aggregate function in **Aggregate function**.

- Select an available remaining event property in **Property to aggregate**.

You can optionally group events by one or more properties over each time window. By doing so, all aggregate functions you specified are applied in each time window on group of events having the same property value.

For example:

- Compute the sum of product prices every hour, grouped by order identifier.

#### Output properties

You can manage the properties that come from this node to suit your requirements. Follow the instructions to modify your properties:

**Properties to keep**

The list of properties displayed in the output.

The following properties are present by default:

- `aggregateStartTime`: The start of the time window.
- `aggregateEndTime`: The end of the time window.
- `aggregateResultTime`: The end of the time window minus one millisecond. This is an event time. 

**Warning:** Do not use properties named `window_start`, `window_end` and `window_time` because they are used internally in Flink.

- Ensure you have not specified any of these properties in any node upstream in your graph.
- Do not rename any properties using any of these names.

**Rename a property**

To rename a property, complete the following steps.

1. Hover over the property name and click the Edit icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.

2. In the text-box, enter a new name for your property.

3. Click outside the text-box or press Enter on your keyboard to rename the property.

**Properties to remove**

To remove a property from being displayed in the output, click Remove property icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){:height="30px" width="15px"}.


After you have set up the aggregate node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the aggregate node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.


## Window top-n

A window top-n node is a filter for the highest or lowest values of a particular property within a specified time window. It divides a stream of events into time-based chunks and then selects the events with the top number (top-n) of highest or lowest values on each chunk. You specify the top number and then decide whether to sort the top number of rows into ascending or descending order so that the highest or lowest values of a particular property are returned.

### Adding a window top-n node

To add a window top-n node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processor**, drag the **Window top-n** node into the canvas.
3. {{site.data.reuse.node_connect}}
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   The **Configure window top-n** page appears.

### Configuring a window top-n node

To configure a window top-n node, complete the following steps.

1. {{site.data.reuse.node_details}}
1. Click **Next** to open the **Time window** section.
1. In the **Specify the property to use for start of time window** field, select the property of the event that corresponds to an event time. This property is used internally to define the start of the first time window. 
1. In the **Specify the time window duration** field, specify the duration of each time window.

   **Note**: A time window is defined by a start time and an end time based on the event time of the event, not the wall-clock time.
   The start time and the end time values are timestamps. An event is assigned to a time window if its event time is between the start time and the end time of this time window. The top number calculation is performed for all events contained in every time window. The closure of a time window triggers the top number calculation when either of the following conditions are met:
   - An event having an event time value greater than the end of the windows that is processed by the node.
   - A timeout period elapses after an event source becomes idle. For more information about event source idleness, see the Kafka SQL connector link in [configuring Flink](../../installing/configuring).

   In a standard time window, events are assigned to time windows of a fixed-size that do not overlap. For example, "Get the 5 most valuable orders placed every day". To assign events to one or more time windows, you need to enable a rolling time window. An example of a rolling time window is "Get the 5 most valuable orders placed in the last 24 hours and repeat this calculation every hour".
1. (Optional) To enable a rolling time window, in the **Calculate a rolling time window** field, select **Yes**.  
   1. In the **Specify the offset from the start of the time window**, specify a time offset to every time window start time, thereby defining additional overlapping time windows. 
1. Click **Next** to open the **Top-n** section.
1. In the **Specify the number of results to keep on each window** field, specify the number of results that you want to see for each time period.
1. In the **Number of results to keep on each window** field, select the property to use for sorting the events.
1. Select **Ascending** or **Descending** according to the following rule:    

   - If you select “Ascending” you get the events with the top number of lowest values of the selected property, for instance from 1 to 9. For strings, it would sort in the order A to Z.
   - If you select “Descending” you get the events with the top number of highest values of the selected property, for instance from 9 to 1. For strings, it would sort in the order Z to A.
1. Click **Next** to open the **Output properties** section. In the **Output properties** section, you can manage the properties that are displayed in the output when you view the results after running the flow.
1. (Optional) To remove a property so that it is not displayed in the output, click the **Remove property** icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){: height="30px" width="15px"}.  

   **Note**: The following properties are present by default:
   - `windowStartTime`: The start of the time window.
   - `windowEndTime`: The end of the time window.
   - `windowResultTime`: The end of the time window minus one millisecond. This is an event time.
   - `topN`: A sequential number between 1 and N according to the ordering of the events within the time window.

   **Warning:** 
   - Do not use properties named `window_start`, `window_end` and `window_time` because they are used internally in Flink.
   - Ensure you have not specified any of these properties in any node upstream in your graph.
   - Do not rename any properties using any of these names.
1. (Optional) To rename a property, hover over the property name and click the **Edit icon** ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){: height="30px" width="15px"}.   
    1. In the text-box, enter a new name for your property.  
    1. Click outside the text-box or press Enter on your keyboard to rename the property.
1. To complete the window top-n node configuration, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the window top-n node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.

