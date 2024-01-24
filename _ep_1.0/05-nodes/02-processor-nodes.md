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

**Note:** If you are on {{site.data.reuse.ep_name}} version 1.0.4 or earlier, see the information about the [aggregate](../windowednodes/#aggregate) and the [top-n](../windowednodes/#top-n) nodes in the [Windowed](../windowednodes) section.


## Filter

A filter node takes in a stream of events and applies an expression to determine which events to allow to pass and which to block. The output of the filter node is a single stream of events that can be used for analysis or other processing. This node helps to reduce the amount of data by allowing events that match the expression.

### Adding a filter node

To add a filter node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processors**, drag the **Filter** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the filter node indicating that the node is yet to be configured.
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure a Filter** window appears.

### Configuring a filter node

To configure a filter node, complete the following steps.

1. {{site.data.reuse.node_details}}
2. Click **Next** to open the **Define Filter** pane.  
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

![Event Processing 1.0.5 icon]({{ 'images' | relative_url }}/1.0.5.svg "In Event Processing 1.0.5 and later") User actions are saved automatically. For save status updates, see the canvas header.  

- **Saving** ![Saving]({{ 'images' | relative_url }}/save_inprogress.png "Diagram showing save is in progress."){:height="30px" width="15px"} indicates that saving is in progress.
- **Saved** ![Save successful]({{ 'images' | relative_url }}/save_successful.png "Diagram showing save is successful."){:height="30px" width="15px"} confirms success.
- **Failed** ![Save failed]({{ 'images' | relative_url }}/save_error.png "Diagram showing that the save is failed."){:height="30px" width="15px"} indicates that there are errors. If an action fails to save automatically, you receive a notification to try the save again. Click **Retry** to re-attempt the save. When a valid flow is saved, you can proceed to run the job.

If you are running versions earlier than 1.0.5, click **Save** in the navigation banner to save the flow.

## Transform

A transform node takes in a stream of events to modify your existing properties or create new properties. Existing properties can be removed or renamed, and new properties can be added. The value of a new property is determined by the expression you create.

Transform node supports various functions to create an expression. For more information about functions, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/functions/systemfunctions/#scalar-functions){:target="_blank"}.


### Adding a transform node

To add a transform node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processor**, drag-and-drop the **Transform** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the transform node indicating that the node is yet to be configured.
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   The **Configure Transform** window appears.

### Configuring a transform node

To configure a transform node, complete the following steps.

1. {{site.data.reuse.node_details}}
1. Click **Next** to open the **Create properties** pane.
1. Click **Create new property** to add a new property to the table.
1. Hover over the property name and click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} and enter a name for your property.
1. Enter your expression in the **Expression** text box to define your property.
1. (Optional) To use the assistant to enter an expression, complete the following steps.
   1. Click the **Assistant** drop-down menu to open the assistant.
   1. In the **Select function** drop-down menu, select a function with which you want to create an expression.
   1. In the function you selected previously, enter the required values.
   1. Select **Insert into expression** to add the expression in the text-box.

      **Note:** Ensure you choose the values with correct data type for your expression. Properties that are used as values in the comparison operations must be of the same data type. Arithmetic operations are only allowed on integer and double data types. String operations are only possible with properties of string data type. Some temporal functions require a timestamp data type.
1. (Optional) Repeat steps 3 - 6 to create more properties.  
1. Click **Next** to open the **Output properties** pane. You can manage the properties that come from this node to suit your requirements. 
1. (Optional) To remove a property so that it is not displayed in the output, click the **Remove property** icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){: height="30px" width="15px"}.  
1. (Optional) To rename a property, hover over the property name and click the **Edit icon** ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){: height="30px" width="15px"}.   
    1. In the text-box, enter a new name for your property.  
    1. Click outside the text-box or press Enter on your keyboard to rename the property.
1. (Optional) To add a property that was previously removed, go to the **Properties to remove** table that lists the removed properties.  
    1. In the property you want to add back, click the add icon ![add icon]({{ 'images' | relative_url }}/add.svg "Diagram showing add icon."){:height="30px" width="15px"}.  
1. To complete the transform node configuration, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the transform node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.

![Event Processing 1.0.5 icon]({{ 'images' | relative_url }}/1.0.5.svg "In Event Processing 1.0.5 and later") User actions are saved automatically. For save status updates, see the canvas header.

- **Saving** ![Saving]({{ 'images' | relative_url }}/save_inprogress.png "Diagram showing save is in progress."){:height="30px" width="15px"} indicates that saving is in progress.
- **Saved** ![Save successful]({{ 'images' | relative_url }}/save_successful.png "Diagram showing save is successful."){:height="30px" width="15px"} confirms success.
- **Failed** ![Save failed]({{ 'images' | relative_url }}/save_error.png "Diagram showing that the save is failed."){:height="30px" width="15px"} indicates that there are errors. If an action fails to save automatically, you receive a notification to try the save again. Click **Retry** to re-attempt the save. When a valid flow is saved, you can proceed to run the job.

If you are running versions earlier than 1.0.5, click **Save** in the navigation banner to save the flow.
