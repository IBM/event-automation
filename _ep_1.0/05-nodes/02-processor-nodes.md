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


## Filter

A filter node takes in a stream of events and applies an expression to determine which events to allow to pass and which to block. The output of the filter node is a single stream of events that can be used for analysis or other processing. This node helps to reduce the amount of data by allowing events that match the expression.

### Adding a filter node

To add a filter node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processors**, drag the **Filter** node into the canvas.
3. {{site.data.reuse.node_connect}}
4. Hover over the node, click the **Options** icon ![options icon]({{ 'images' | relative_url }}/options.png "Diagram showing more options."){:height="30px" width="15px"}, and then click **Edit** to configure the node.

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

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the filter node if the filter node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.

## Transform

A transform node takes in a stream of events to modify your existing properties or create new properties. Existing properties can be removed or renamed, and new properties can be added. The value of a new property is determined by the expression you create.

Transform node supports various functions to create an expression. For more information about functions, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/functions/systemfunctions/#scalar-functions){:target="_blank"}.


### Adding a transform node

To add a transform node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processor**, drag-and-drop the **Transform** node into the canvas.
3. {{site.data.reuse.node_connect}}
4. Hover over the node, click the options icon ![options icon]({{ 'images' | relative_url }}/options.png "Diagram showing more options."){:height="30px" width="15px"}, and then click **Edit** to configure the node.

   The **Configure Transform** page appears.

### Configuring a transform node

Follow the instructions to configure the transform node.

#### Details

{{site.data.reuse.node_details}}

#### Create properties

Create a new property to add to your output. The property is created with a value that is determined by an expression you configure. You can use the functions offered by the transform node to create an expression.

To create a new property, complete the following steps.

1. Click the **Create property** button to add a new property to the table.
2. Hover over the property name and click the **Edit** icon ![rename icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"} and enter a name for your property.
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

1. Hover over the property name and click the **Edit** icon ![rename icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing rename icon."){:height="30px" width="15px"}.
2. In the text-box, enter a new name for your property.
3. Click outside the text-box or press **Enter** in your keyboard to rename the property.

#### Remove property

To remove a property from being displayed in the output, click **Remove property** icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){:height="30px" width="15px"}.

#### Add a removed property

To add a property that was previously removed, complete the following steps.

1. Go to the **Properties to remove** table that lists the removed properties.
2. In the property you want to add back, click the add icon ![add icon]({{ 'images' | relative_url }}/add.svg "Diagram showing add icon."){:height="30px" width="15px"}.

After you have set up the transform node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the transform node if the transform node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.


## Aggregate

Use an aggregate node to divide the stream of events into time-based chunks and then run an aggregate function on each of these chunks.

### Adding an aggregate node

To add an aggregate node, complete the following steps.

1. {{site.data.reuse.node_step1}}

2. In the **Palette**, under **Processor**, drag the **Aggregate** node into the canvas.

3. {{site.data.reuse.node_connect}}

4. Hover over the node, click the options icon ![options icon]({{ 'images' | relative_url }}/options.png "Diagram showing more options."){:height="30px" width="15px"}, and then click **Edit** to configure the node.

   The **Configure aggregate** page appears.

### Configuring an aggregate node

Follow the instructions to configure the aggregate node.

#### Details

{{site.data.reuse.node_details}}

#### Time Window

Events are assigned to time windows of a fixed-size that do not overlap.

To define time windows, you must specify the following items.

- The property of the event that corresponds to an event time. This property is used internally to define the start of the first time window.

- The duration of each time window.

A time window is defined by a start time and an end time based on the event time of the event, not the wall-clock time.
The start time and the end time values are timestamps.

An event is assigned to a time window if its event time is between the start time and the end time of this time window.

Aggregate computations are performed on all events contained in every time window.

The closure of a time window triggers the aggregate computations when either of the following conditions are met:

- An event having an event time value greater than the end of the windows that is processed by the aggregate node.

- A timeout period elapses after an event source becomes idle.

  For more information about event source idleness, see [configuring Flink](../../installing/configuring).

A usage example for this kind of aggregation is:

- Calculate the average price of products sold over the last day

When enabling the **Calculate a rolling aggregate** option, you can trigger aggregate operations on a sliding period of time.

You have to specify a time offset to every time window start time, thereby defining additional overlapping time windows.

As a result, an event can then be assigned to one or more time windows.

A usage example for this kind of aggregation is:

- Calculate the average price of products sold in the last twenty four hours and repeat this calculation each hour.

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

1. Hover over the property name and click the Edit icon ![rename icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing rename icon."){:height="30px" width="15px"}.

2. In the text-box, enter a new name for your property.

3. Click outside the text-box or press Enter on your keyboard to rename the property.

**Properties to remove**

To remove a property from being displayed in the output, click Remove property icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){:height="30px" width="15px"}.


After you have set up the aggregate node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the aggregate node if the aggregate node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.

