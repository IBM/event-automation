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
 - [Unpack arrays](#unpack-arrays)

## Filter

A filter node takes in a stream of events and applies an expression to determine which events to allow to pass and which to block. The output of the filter node is a single stream of events that can be used for analysis or other processing. This node helps to reduce the amount of data by allowing events that match the expression.

### Adding a filter node

To add a filter node, complete the following steps:

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processors**, drag the **Filter** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the filter node indicating that the node is yet to be configured.
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure a Filter** window opens.

### Configuring a filter node

To configure a filter node, complete the following steps:

1. {{site.data.reuse.node_details}}
2. Click **Next** to open the **Define Filter** pane.  
3. Enter an expression in the **Filter Expression** text box to filter the events. The expression consists of a property, a mathematical condition, and a value. You can create a simple expression with one condition or a complex expression with multiple conditions based on your requirement. You can create multiple conditions within an expression by using `AND` or `OR`.

   Examples:
      - Simple expression:

        ```
        example_property > 100
        ```

      - Complex expression:

         ```
         example_property1 > 50 AND example_property2 > 30 OR example_property3 < 25 AND example_property4 < 250
         ```
      - ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") Expression with complex object property:
  
  
         ```
         example_property.nested_property IS NOT NULL AND example_property.nested_property.leaf_property > 100
         ```
      - ![Event Processing 1.1.4 icon]({{ 'images' | relative_url }}/1.1.4.svg "In Event Processing 1.1.4 and later.") Expression with an array property:
  
  
         ```
         example_array_property[1] IS NOT NULL AND ARRAY_CONTAINS(example_array_property, 10)
         ```
      **Note:** The index of arrays starts at 1, not at 0.

   **Note:** Expressions are prioritized based on [operator precedence](https://calcite.apache.org/docs/reference.html#operators-and-functions){:target="_blank"}.

   Alternatively, you can use the assistant to create an expression. Select **Assistant** at the right end of the text-box to open the assistant. The assistant provides a drop-down list of properties and conditions that you can use to create the expression.

   {{site.data.reuse.array_expression_note}}

4. Scroll down and click **Configure Filter** to complete the configuration.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the filter node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.

User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.


## Transform

A transform node takes in a stream of events to modify your existing properties or create new properties. Existing properties can be removed or renamed, and new properties can be added. The value of a new property is determined by the expression you create.

Transform node supports various functions to create an expression. For more information about functions, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/functions/systemfunctions/#scalar-functions){:target="_blank"}.


### Adding a transform node

To add a transform node, complete the following steps:

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Processor**, drag-and-drop the **Transform** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the transform node indicating that the node is yet to be configured.
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   The **Configure Transform** window appears.

### Configuring a transform node

To configure a transform node, complete the following steps:

1. {{site.data.reuse.node_details}}
1. Click **Next** to open the **Create properties** pane.
1. Click **Create new property** to add a new property to the table.
1. Hover over the property name and click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} and enter a name for your property.
1. Enter your expression in the **Expression** text box to define your property.

   Examples:
      - Simple expressions:

        ```
        - example_number_property1 * example_number_property2
        - POWER(`example_number_property1`, 2)
        ```
  
      - Complex expressions:

         ```
         - REGEXP_EXTRACT(`example_property`, '([A-Z]+)\-([0-9]+)\-([0-9]+)', 1)
         - IF(`example_number_property` >= 20, 'high', 'low')
         - TO_TIMESTAMP(example_string_property, 'EEE MMM dd HH:mm:ss zzz yyyy')
         - DAYOFWEEK( CAST(example_timestamp_property AS DATE) )
         ```
      - ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") Expressions with complex object property:
  
         ```
         - example_property.nested_object_property
         - example_property.nested_object_property.leaf_property
         - CONCAT( CAST(example_property.nested_object_property.leaf_property AS STRING), ‘$’)
         ```
      - ![Event Processing 1.1.4 icon]({{ 'images' | relative_url }}/1.1.4.svg "In Event Processing 1.1.4 and later.") Expressions with array properties:
  
         ```
         - ARRAY_JOIN(`example_string_array_property`, ', ')
         - ARRAY_REMOVE(example_property.nested_object_property.leaf_array_property, NULL)
         - example_property BETWEEN example_array_property[1] AND example_array_property[2]
         - example_property.nested_object_property.leaf_array_property
         ```
   ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") **Note:** The expression can also simply refer to existing properties. This is particularly useful when renaming complex object properties or when moving nested properties to the top-level.
1. Optional: To use the assistant to enter an expression, complete the following steps:
   1. Click the **Assistant** drop-down menu to open the assistant.
   2. From the **Select function** list, select a function with which you want to create an expression.
   3. In the function you selected previously, enter the required values.
   4. Select **Insert into expression** to add the expression in the text-box.

      **Note:** Ensure you choose the values with correct data type for your expression. Properties that are used as values in the comparison operations must be of the same data type. Arithmetic operations are only allowed on integer and double data types. String operations are only possible with properties of string data type. Some temporal functions require a timestamp data type.

    {{site.data.reuse.array_expression_note}}
2. Optional: Repeat steps 3 to 6 to create more properties.  
3. Click **Next** to open the **Output properties** pane. You can manage the properties that come from this node to suit your requirements.
4. ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") Only **leaf** properties are listed in the **Output properties** table. You can remove specific properties from an object, or if you want to remove the entire object, remove all the properties related to it one by one.

   Click **Remove property** ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){: height="30px" width="15px"} to remove a property so that it is not displayed in the output.
   
     **Note:** Nested properties are displayed by using a forward slash (`/`) as a separator for each level of nesting. For example, `product / id` or `customer / address / city`.      
    
5. ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.") Only **leaf** properties are listed in the **Output properties** table. You can only rename the last nested property within nested properties, you cannot rename the top-level or any other properties in between. For example, in the case of `customer / address / city`, you can only rename `city`, but not `address` or `customer`.
    
     **Note:** To rename the top-level property `customer/address/city` (in this case, `customer`), create a new property and add details in the following fields:
   - **Property name:** Add a new name for the property.
   - **Expression**: Add the name of the property to rename, for example, customer. 

6. Optional: To rename a property, hover over the property name and click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){: height="30px" width="15px"}.   
     - In the text-box, enter a new name for your property.  
     - Click outside the text-box or press Enter on your keyboard to rename the property.
7. Optional: To add a property that was previously removed, go to the **Properties to remove** table that lists the removed properties. For the property you want to add back, click the **Add** icon ![add icon]({{ 'images' | relative_url }}/add.svg "Diagram showing add icon."){:height="30px" width="15px"}.  
8. To complete the transform node configuration, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the transform node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "DiagIconram showing red checkbox."){:height="30px" width="15px"} appears.

User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.

## Unpack arrays

![Event Processing 1.1.7 icon]({{ 'images' | relative_url }}/1.1.7.svg "In Event Processing 1.1.7 and later.")  An unpack array node takes an existing array of elements in a stream of events to unpack it. You can unpack each array element into a new property in separate events, or unpack the array elements into new properties that are all included in the same event. 

### Adding an unpack array node

To add an unpack array node, complete the following steps:

1. {{site.data.reuse.node_step1}}
1. In the **Palette**, under **Processors**, drag-and-drop the **Unpack arrays** node into the canvas.
1. Connect the node to an event source by dragging the **Output Port** from a source node into the **Input Port** of this node. A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the filter node indicating that the node is yet to be configured.
1. Hover over the node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   The **Configure unpack node** window opens.

### Configuring unpack array node

To configure the unpack array node, complete the following steps:

1. {{site.data.reuse.node_details}}
1. Click **Next** to open the **Array selection** pane.
1. Select the radio button ![radio button]({{ 'images' | relative_url }}/radio-button.svg "Diagram showing unchecked radio button."){:height="30px" width="15px"} of the array you want to unpack.

   **Note:** You can use the search bar to search for a particular array. As you start typing the array name in the search bar, you get a filtered list of matching arrays.
1. Click **Next** to open the **Unpacking the array** pane.
1. The following options are available to unpack the array:

   
   - **Unpack into events:** To unpack each array element into a new property in separate events, in the **Property name** field, provide a name for the property that represents the array element. You will have as many events as array elements and each event contains the property with one of the array elements.
   - **Unpack into properties:** To unpack each array element into properties within an event, provide a name in the **Property name** field for each property that represents the array element. By default, properties are listed sequentially (1, 2, 3,...). 

     - To add a property, click **Add next element**, and provide a name for the property in the **Property name** field.
     - To remove a property, click the **Delete property** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Remove topic icon."){:height="30px" width="15px"} corresponding to the property you want to remove.
     - To edit the name of a property, hover over the name, and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.

   **Note:**
    - The order of the properties in the table corresponds to the order in the array: For example, if you define the properties p1, p2, and p3 in this order, and you have the array [1, 2, 3], then the first property p1 is mapped to the first array element 1, p2 is mapped to 2, and p3 is mapped to 3.
    - If the array contains more elements than the number of properties, elements with no mapping are dropped: For example, if you define the properties p1, p2, and p3 in this order, and you have the array [1, 2, 3, 4], then the first property p1 is mapped to the first array element 1, p2 is mapped to 2, p3 is mapped to 3, and 4 is dropped.
    - If the array contains fewer elements than the number of properties, then the properties with no mapping carries a null value: For example, if you define the properties p1, p2, and p3 in this order, and you have the array [1, 2], then the first property p1 is mapped to the first array element 1, p2 mapped to 2, and p3 is null.
    - If you define a property p, and you have the array [1, 2], you will have one event where p equals 1 and another event where p equals 2. 
 1. Click **Next** to open the **Output properties** pane. 
 
    The properties that you added in the previous step are displayed in the **Output properties**. You can manage the properties that come from this node to suit your requirements.

    **Note:** The array that you selected to unpack is not part of the output properties.
 
  1. To complete an unpack node configuration, click **Configure**.

   A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} is displayed on the unpack array node if the node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} is displayed.               





