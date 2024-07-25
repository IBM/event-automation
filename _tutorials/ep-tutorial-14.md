---
title: "Unpacking arrays from events to process array contents easily"
description: "Unpack each array element into separate events or into new properties in the same event to process the array content."
permalink: /tutorials/unpack-arrays/
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 14
---

## Unpack arrays

With the unpack arrays node, you can extract each array element as a new property in separate events or extract the array elements as new properties that are all included in the same event. 

## Scenario

As a retailer, you seek greater insight into the reasons for product returns. To achieve this, you can leverage product reviews to identify returned products with size or length issues. 

In this tutorial, you will unpack each product in the **returns** array into separate events and combine them with any associated product reviews.

In the **review/characteristics** array, specific reviews for characteristics such as size and length are unpacked into new properties, allowing for separate trend computations. 



## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in {{ site.data.reuse.ea_long }}. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of {{ site.data.reuse.ea_long }} that you can use to follow this tutorial for yourself.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots can differ from the current interface if you are using a newer version.

- {{site.data.reuse.eem_name}} 11.2.1
- {{site.data.reuse.ep_name}} 1.1.8


## Instructions

### Step 1: Discover the topics to use

For this scenario, you need sources of the return requests and product reviews events.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "Screen capture of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "Screen capture of the Event Endpoint Management catalog")

    If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

2. Find the `Return requests` and `Product reviews` topics.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-7.png "Screen capture of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-7.png "Screen capture of the Event Endpoint Management catalog")

3. Click into the topics to review the information about the events that are available here.
   Look at the schema to see the properties in the events, and get an idea of what to expect from events on these topics.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-8.png "Screen capture of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-8.png "Screen capture of the Event Endpoint Management catalog")

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-9.png "Screen capture of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-9.png "Screen capture of the Event Endpoint Management catalog")

   **Tip**: Keep this page open. It is helpful to have the catalog available while you work on your {{site.data.reuse.ep_name}} flows to refer to the information about the events as you work. Complete the following steps in a separate browser window or tab.


### Step 2: Create a flow

   To create a flow, complete the following steps:

 1. Go to the **{{site.data.reuse.ep_name}}** home page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "Screen capture of the Event Processing home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "Screen capture of the Event Processing home page")

    If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to have more insight into the reasons for product return.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-20.png "Event Processing home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-20.png "Event Processing home page")
    
 
    

### Step 3: Add an event source node for the Return Requests topic

The next step is to bring the stream of events you discovered in the catalog into {{site.data.reuse.ep_name}}. 
   
To create an event source, complete the following steps:

1. Add an **Event source** node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-21.png "Adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-21.png "Adding an event source node")

    When you create a flow, an event source node is automatically added to your canvas. A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the event source node indicating that the node is yet to be configured.

    Hover over the node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1.  Ensure that the **Add event source** tile is selected, and then click **Next**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "Add an event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "Add an event source")    
    

1. Get the server address for the event source from the {{site.data.reuse.eem_name}} topic page.
    
    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-22.png "Getting connection details from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-22.png "Getting connection details from the catalog")

    Click the **Copy** icon next to the **Servers** address to copy the address to the clipboard.

1. Go to {{site.data.reuse.ep_name}}, and configure the new event source.    

    Give the node a name that describes this stream of events: `Return requests`, and click **Next**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-23.png "Connection details for the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-23.png "Connection details for the event source")

    In the **Server** field, paste the server address that you copied from {{site.data.reuse.eem_name}} in the previous step.    

    

1. Generate access credentials for accessing this stream of events from the {{site.data.reuse.eem_name}} page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-27.png "Getting the credentials to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-27.png "Getting the credentials to use")

    Click **Generate access credentials** at the top of the page, and provide your contact details.

1. Copy the username and password from {{site.data.reuse.eem_name}} and paste into {{site.data.reuse.ep_name}} to access the topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-7.png "Specifying credentials for event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-7.png "Specifying credentials for event source")

    The username starts with `eem-`.

    Click **Next** to go to the **Topic selection** pane.

1. Select the `PRODUCT.RETURNS` topic to process events from, and click **Next**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-4.png "Select a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-4.png "Select a topic to use")    


1. Get the schema for return requests node from {{site.data.reuse.eem_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-5.png "Event information"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-5.png "Event information")   

   Click **Copy** in the schema section to copy the schema to the clipboard.

   You need to give {{ site.data.reuse.ep_name }} a description of the events available from the topic. The information in the schema enables {{ site.data.reuse.ep_name }} to give guidance for creating {{site.data.reuse.ep_name}} nodes.

1. The `Avro` message format is auto-selected in the **Message format** drop-down. Paste the schema into the **Avro schema** field, and click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-24.png "Paste schema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-24.png "Paste schema into the event source")  

   

1. In the **Event details** pane, change the `returntime` property type to `Timestamp (with time zone)`. 

   **Note:** The `returntime` string is converted to a timestamp to use `returntime` as event time. Only properties with a timestamp type can be used as event time to perform time-based processing.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-25.png "Creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-25.png "Creating an event source node")

1. Configure the event source to use the `returntime` property as the source of the event time, and to tolerate lateness of up to **1 minute(s)**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-26.png "Creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-26.png "Creating an event source node")

1. Click **Configure** to finalize the event source configuration.



### Step 4: Unpack the returned products into events

The next step is to unpack the returns array that contains product returns into events.

To add an unpack array node, complete the following steps:

For more information about how to create an unpack array node, see [unpack array node]({{ 'ep/nodes/processornodes/#adding-an-unpack-array-node' | relative_url }}).


1. Add an unpack array node and link the `Return requests` node to the unpack array node.
   
1. Hover over the unpack array node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.   
1. In the **Node name** field, enter the name of the unpack array node as `Unpack product returns`, and then click **Next**.

   ![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-28.png "Add array name"){:height="60%" width="60%"}

    
1. In the **Array selection** pane, select the **returns** array, and then click **Next**.

   ![Select return array]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-2.png "Select return array"){:height="25%" width="25%"}


   
1. In the **Unpack into events** tab, enter `return` in the **Property name** field, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-29.png "Enter property name"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-29.png "Enter property name") 

   **Note:** By default, the **Unpack the array** pane displays the **Unpack into events** tab.   
   
   
   In the **Output properties** pane, you can see that each event has only one single return object, and there is no returns array anymore.  

1. Click **Configure** to finalize the unpack array node configuration.      


### Step 5: Test the flow

The next step is to run your {{site.data.reuse.ep_name}} flow and view the results.

Use the **Run flow** menu, and select **Include historical** to run the current flow on the history of `Return requests` events.

Verify that each returned product for a given return request is now displayed in a separate event.

**Note:** You can also notice in the **Output events** table that **Unable to display data** is displayed for the addresses array. Complex data types cannot be displayed in this table. To view the complete result including complex data types, pause new events and download the results as a `.csv` file.

Click **Stop flow**.

### Step 6: Identify trends for return reasons per product

In this step you need to add an aggregate node to identify the trends of the product returns.

To add an aggregate node, complete the following steps:

For more information about how to create an aggregate node, see [Adding an aggregate node]({{ 'ep/nodes/windowednodes/#adding-an-aggregate-node' | relative_url }}).


1. Add an aggregate node and link the `Unpack product returns` node (the unpack array node that you created in step 4) to the aggregate node.
1. Hover over the aggregate node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.   
2. In the **Node name** field, enter the name of the aggregate node as `Identify trends for return reasons per product`, and then click **Next**.

   ![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-10.png "Enter node name"){:height="60%" width="60%"}

   
4. Use the **Time window** pane to define the time window duration, and click **Next**: **1 hour(s)**.  

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-30.png "Time window pane"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-30.png "Time window pane") 
   
   **Note:** If you have set up the tutorial environment more than 1 hour ago, you can increase the size of the time window. It allows you to have more events that are used to run the aggregate functions. Ensure to use the same time window for the `Identify review trends per product` aggregate node that will be created later. 

   

6. In the **Aggregate function** pane, select the options from the following fields:
   - From the **Aggregate function** drop-down, select **COUNT**.
   - From the **Property to aggregate** drop-down, select **return/reason**.
   - From the **Additional property to group by** drop-down, select **return/product/id**, and then click **Group by another property +**, and select **return/reason** as additional property to group by. 

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-11.png "Configure aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-11.png "Configure aggregate node") 

7. Click **Next**, and then click **Configure** to finalize the aggregate node configuration.



### Step 7: Test the flow

The next step is to run your {{site.data.reuse.ep_name}} flow and view the results.

Use the **Run flow** menu, and select **Include historical** to run the current flow on the history of `Return requests` events.

Verify that for a given time period, there is only one event per product ID and return reason.

Click **Stop flow**.


### Step 8: Identify top return reason per product

In this step, add a top-n node to identify top reason for return of products.

To add a top-n node, complete the following steps:

For more information about how to create a top-n node, see [Adding a top-n node]({{ 'ep/nodes/windowednodes/#adding-a-top-n-node' | relative_url }}).

1. Add a **Top-n** node and link the `Identify trends for return reasons per product` aggregate node (the aggregate node that you created in step 6) to the top-n node.  
1. Hover over the top-n node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.
1. In the **Node name** field, enter the name of the top-n node as `Identify top return reason per product`, and then click **Next**.
   
   ![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-31.png "Configure top-n node"){:height="60%" width="60%"}

   
1. In the **Time window** pane, ensure that the reuse time window switch is set to **Yes**, and click **Next**.

   **Note:** The duration for `Identify top return reason per product` node is already defined under [step 6](#step-6-identify-trends-for-return-reasons-per-product) as **1 hour(s)**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-new.png "Screen capture of the top-n node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-new.png "Screen capture of the top-n node")

1. In the **Condition** pane, enter the values in the following fields, and then click **Next**:
   - **Number of results to keep on each window**: 1
   - **Ordered by**: `COUNT_return_reason, Descending`
   - **Grouped by**: `return_product_id`

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-13.png "Configure top-n"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-13.png "Configure top-n")
   
   
1. In the **Output properties** pane, you can choose the output properties that will be useful to return.
1. Click **Configure** to finalize the top-n node configuration.  



### Step 9: Test the flow

The next step is to run your {{site.data.reuse.ep_name}} flow and view the results.

Use the **Run flow** menu, and select **Include historical** to run the current flow on the history of `Return requests` events.

For a given time period, there is now only one event by product ID that contains the return reason that appears most often.

Click **Stop flow**.

### Step 10: Add another source of events to the flow


The next step is to bring this additional stream of events that you discovered in the catalog into {{site.data.reuse.ep_name}}.

To create an event source node, complete the following steps:

1. Create an event source node for the `Product reviews`. 
1. Repeat steps 1-6 under [step 3](#step-3-add-an-event-source-node-for-the-return-requests-topic).

   **Note:** 
   - Give the node a name that describes this stream of events: `Product reviews`. 
   - Generate different credentials for `Product reviews` node because credentials are specific to a topic.



1. Select the `PRODUCT.REVIEWS` topic to process events from, and click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-14.png "Select a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-14.png "Select a topic to use")

    
1. Get the schema for product reviews from {{site.data.reuse.eem_name}}.   

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-15.png "Product review schema"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-15.png "Product review schema")

   Click **Copy** in the schema section to copy the schema to the clipboard.

   You need to give {{site.data.reuse.ep_name}} a description of the events available from the topic. The information in the schema enables {{site.data.reuse.ep_name}} to give guidance for creating {{site.data.reuse.ep_name}} nodes.
1. Repeat steps 9-12 under [step 3](#step-3-add-an-event-source-node-for-the-return-requests-topic). 

   **Note:** 
   - Change the type of the `reviewtime` property to `Timestamp (with time zone)`.
   - The `reviewtime` string is converted to a timestamp to use `reviewtime` as event time. Only properties with a timestamp type can be used as event time to perform time-based processing.   
   - Configure the event source to use the `reviewtime` property as the source of the event time, and to tolerate lateness of up to **1 minute(s)**.

  

### Step 11: Unpack the review characteristics into properties

In this step, add another unpack array node to unpack the product review characteristics such as size and length into properties.

To add another unpack array node, complete the following steps:

For more information about how to create an unpack array node, see [unpack array node]({{ 'ep/nodes/processornodes/#adding-an-unpack-array-node' | relative_url }}).

1. Add an **Unpack array** node and link the `Product reviews` node (the event source that you created in step 10) to the unpack array node.
1. Hover over the unpack array node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.
2. In the **Node name** field, enter the name of the unpack array node as `Unpack review characteristics`, and then click **Next**.
   
   ![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-32.png "Configure unpack array node"){:height="60%" width="60%"}

   

3. In the **Array selection** pane, select the **review/characteristics** array, and then click **Next**.

   ![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-16.png "Unpack review characteristics array"){:height="25%" width="25%"}

4. In the **Unpack into properties** tab, click **Add next element** to add a second element.
5. Enter size and length as property names, and click **Next**.

   **Note:** In the **Output properties** pane, you can see that each event has a size object and length object in the review object. There is no longer a characteristics array.

6. Click **Configure** to finalize the unpack array node configuration.


### Step 12: Identify review trends per product

In this step you need to add an aggregate node to identify the trends of the review of products.

To add another aggregate node, complete the following steps:

For more information about how to create an aggregate node, see [step 6](#step-6-identify-trends-for-return-reasons-per-product).

1. Add an aggregate node and link the `Unpack review characteristics` unpack array node (the unpack array node that you created in step 11) to the aggregate node.
2. Hover over the aggregate node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.
   
3. In the **Node name** field, enter the name of the aggregate node as `Identify review trends per product`, and then click **Next**.

   ![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-33.png "Configure aggregate node"){: class="tutorial-screenshot" }{:height="60%" width="60%"}
   

4. Enter the same time window as defined under [step 6](#step-6-identify-trends-for-return-reasons-per-product), and then click **Next**: **1 hour(s)**.  
   
   **Note:** If you have set up the tutorial environment more than 1 hour ago, you can increase the size of the time window. It allows you to have more events that are used to run the aggregate functions. But ensure that you enter the same time window in the two aggregate nodes (the one for product returns and the one for product reviews).
     

5. From the **Aggregate function** drop-down, select **AVG**, and then from the **Property to aggregate** drop-down, select the **review/rating** options.
6. Click **Add another aggregate function +**.
7. From the **Aggregate function** drop-down, select **AVG**, and then from the **Property to aggregate** drop-down, select the **review/size/ranking** options.
8. Again click **Add another aggregate function +**.
9. From the **Aggregate function** drop-down, select **AVG**, and then from the **Property to aggregate** drop-down, select the **review/length/ranking** options. 

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-17.png "Aggregate function"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-17.png "Aggregate function")

10. From the **Additional property to group by** drop-down, select **product**.

7. Click **Next**, and then click **Configure** to finalize the node configuration.

### Step 13: Consolidate information per product

The next step is to define an interval join node to merge the two event streams to identify review trends (that is average rating, average size ranking, and average length ranking), if any, that might be related to a given top return reason for a product within a given time period.

To add an interval join node, complete the following steps:

For more information about how to add an interval join node, see [Adding an interval join node]({{ 'ep/nodes/joins/#adding-an-interval-join-node' | relative_url }}).

1. Add an **Interval join** node and link the `Identify top return reason per product` and `Identify review trends per product` nodes to the interval join node.
1. Hover over the interval join node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.
2. In the **Node name** field, enter the name of the interval join node as `Consolidate information per product`, and then click **Next**.
   
   ![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-14-34.png "Interval join node"){:height="60%" width="60%"}

   
4. In the **Join condition** pane, enter the following join condition in the **Define events** field, and then click **Next**:
   
 
   ```
  `Identify top return reason per product`.`return_product_id` = `Identify review trends per product`.`product`
   ```

   
5. To identify review trends that might be related to a given top return reason for a product, in the **Event to detect** drop-down, select `Identify review trends per product (aggregateResultTime)`.
6. Provide inputs in the following fields, and click **Next**:
   - From the **Event to set the time window** drop-down, select **Identify top return reason per product (aggregateResultTime)**.
   - In the **Offset from event to start the time window** field, enter -7 and days(s) options.
   - In the **Offset from event to end the time window** field, enter 1.

   **Note:** These settings allows to detect the review trend events that occur within 7 days before and 1 day after a top return reason event for a given product.
 
   
7. Rename the `aggregateResultTime property` of `Identify top return reason per product` and `Identify review trends per product properties` to `returnResultTime` and `reviewResultTime` respectively.
8. Remove the following properties to exclude them from the merged events:
   - Identify top return reason per product: `aggregateStartTime` 
   - Identify top return reason per product: `aggregateEndTime`
   - Identify review trends per product: `aggregateStartTime`
   - Identify review trends per product: `aggregateEndTime`
   - Identify review trends per product: `product`      
   
8. Click **Configure** to finalize the interval join node configuration.   

![screenshot]({{ 'images' | relative_url }}/unpack-array-node.png "Screen capture of the complete flow")

### Step 14: Test the flow

The next step is to run your {{site.data.reuse.ep_name}} flow and view the results.

Use the **Run flow** menu, and select **Include historical** to run the current flow on the history of `Return requests` and `Product reviews` events.

Verify that the output events now contain both a return reason and a review trend (average rating, average size ranking, and average length ranking) for a given returned product.

Click **Stop flow**.

### Conclusion


The following are the insights gained from this tutorial for your product return:

- **Return reasons:** By analyzing return requests, you have gained insights into the reasons why customers are returning products. This includes the top return reason, which indicates a common issue or problem with the product.
- **Size and length rankings:** In addition to the top return reason, you have also obtained average size and length rankings from product reviews. These rankings can help identify potential issues with product sizing or length, which can be contributing to returns.
- **Ranking scale:** The following are the descriptions of the size and length rankings that use a scale of 1-3:
   - **1:** Small, short (indicating that the product is too small or too short for the customer's needs).
   - **2:** Spot on (indicating that the product is the correct size and length for the customer's needs).
   - **3:** Large, long (indicating that the product is too large or too long for the customer's needs).

By analyzing these rankings, you can identify potential issues with product sizing or length and make adjustments to improve the fit and satisfaction of your products.



## Recap

**For the return requests event stream:**
- You used an array unpack node to unpack each product in return requests into separate events.
- You used an aggregate node to count the number of occurrences of each return reason per returned product within a time period.
- Then you used a top-n node to identify the top return reason per product (that is the return reason with the greatest count) within a same time period.

**For the Product reviews event stream:**
- You used an unpack array node to unpack each characteristic review (size and length) in new properties included in the same event.
- Then you used an aggregate node to compute the average review rating and average ranking for the size and length per product within a same time period.

Finally, you used a join node to merge the two event streams to identify review trends (average rating, average size ranking, and average length ranking), if any, that can be related to a given top return reason for a product within a given time period.


