---
title: "Using complex events with nested properties and arrays"
description: "Handling complex events with nested properties and arrays to identify a situation and extract only the necessary information."
permalink: /tutorials/event-processing-examples/example-12
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 12
---
   
## Scenario

Using complex events with nested properties and arrays to identify a situation and extract only the necessary information. In this tutorial, you will see how to identify orders that contain out-of-stock products and extract the required information to handle these orders to notify customers who placed the orders.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots can differ from the current interface if you are using a newer version.

- {{site.data.reuse.eem_name}} 11.1.4
- {{site.data.reuse.ep_name}} 1.1.4

## Instructions

### Step 1 : Discover the topics to use

For this scenario, you need a source for the `Online orders` events and the `Out of stock notifications` events.


1. Go to the **{{site.data.reuse.eem_name}}** catalog.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog")

    If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

2. Find the `Online orders` and `Out of stock notifications` topics.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-1.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-1.png "screenshot of the EEM catalog")

3. Click into the topics to review the information about the events that are available here.
   Look at the schema to see the properties in the events, and get an idea of what to expect from events on these topics.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-2.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-2.png "screenshot of the EEM catalog")

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-2.1.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-2.1.png "screenshot of the EEM catalog")

**Tip**: Keep this page open. It is helpful to have the catalog available while you work on your event processing flows, as it allows you to refer to the documentation about the events as you work. Complete the following steps in a separate browser window or tab.

### Step 2 : Create a flow

1. Go to the **{{site.data.reuse.ep_name}}** home page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page")

    If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to create a stream of orders with out-of-stock products.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-3.png "creating a flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-3.png "creating a flow")

### Step 3 : Provide a source of events

The next step is to bring the stream of events you discovered in the catalog into {{site.data.reuse.ep_name}}.

1. Add an **Event source** node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-3.1.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-3.1.png "adding an event source node")

    When you create a flow, an event source node is automatically added to your canvas. A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the event source node indicating that the node is yet to be configured.

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Add a new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source")

    Click **Next**.

1. Get the server address for the event source from the {{site.data.reuse.eem_name}} topic page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-5.png "getting connection details from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-5.png "getting connection details from the catalog")

    Click the **Copy** icon next to the **Servers** address to copy the address to the clipboard.

1. Configure the new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-4.png "connection details for the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-4.png "connection details for the event source")

    Give the node a name that describes this stream of events: `Orders`.

    In the **Server** field, paste the server address that you copied from {{site.data.reuse.eem_name}} in the previous step.

    You need to accept the certificates for the {{site.data.reuse.egw}} to proceed.

    Click **Next**.

1. Generate access credentials for accessing this stream of events from the {{site.data.reuse.eem_name}} page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-6.png "getting the credentials to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-6.png "getting the credentials to use")

    Click **Generate access credentials** at the top of the page, and provide your contact details.

1. Copy the username and password from {{site.data.reuse.eem_name}} and paste into {{site.data.reuse.ep_name}} to allow access to the topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-7.png "specifying credentials for event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-7.png "specifying credentials for event source")

    The username starts with `eem-`.

    Click **Next**.

1. Confirm the name of the topic that you want to process events from.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-8.png "selecting a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-8.png "selecting a topic to use")

    Click **Next**.

1. Get the schema for orders events from {{site.data.reuse.eem_name}}.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-9.png "copy schema from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-9.png "copy schema from the catalog")

    Click **Copy** in the schema section to copy the schema to the clipboard.

    You need to give {{ site.data.reuse.ep_name }} a description of the events available from the topic. The information in the schema enables {{ site.data.reuse.ep_name }} to give guidance for creating event processing nodes.

1. In {{site.data.reuse.ep_name}}, click **Upload a schema or sample message**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-10.png "paste schema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-10.png "paste schema into the event source")

1. Paste the schema into the event source config in the **Avro** tab.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-11.png "paste sschema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-11.png "paste schema into the event source")

1. Change the type of the `ordertime` property to `Timestamp (with time zone)`. 

   **Note:** The `ordertime` string is converted to a timestamp to use `ordertime` as event time. Only properties with a timestamp type can be used as event time to perform time-based processing.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-12.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-12.png "creating an event source node")

1. Configure the event source to use the `ordertime` property as the source of the event time, and to tolerate lateness of up to **1 minute**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-13.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-13.png "creating an event source node")

1. Click **Configure** to finalize the event source.

1. Add a new **Event source** node to your canvas and repeat steps 1-10 under [step 3](#step-3--provide-a-source-of-events) to add a source for `Out of stock notifications` events.

1. Configure the event source to use the `outofstocktime` property as the source of the event time, and to tolerate lateness of up to **1 minute**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-13.1.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-13.1.png "creating an event source node")

1. Click **Configure** to finalize the event source.

### Step 4 : Merge the two event streams

The next step is to define a join node to merge the two event streams to identify orders with out-of-stock products.

1. Add a **Join** node and link it to your event sources.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-14.png "adding join node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-14.png "adding join node")

   Create a join node by dragging one onto the canvas. You can find this in the **Joins** section of the left panel.

   Click and drag from the small gray dot on the event source to the matching dot on the join node.

   Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Give the join node a name that describes what it will do: `Orders with out-of-stock products`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-15.png "defining the join"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-15.png "defining the join")

    Click **Next**.

1. Define the join condition to match the product descriptions in an order with the product in out-of-stock events.

   ```
   ARRAY_CONTAINS(products, CONCAT_WS ( ' ', product.size, product.material, product.style, product.name))
   ```
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-16.png "defining the joining condition"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-16.png "defining the joining condition")

   Click **Next**.

1. To identify products that have run out of stock within one hour of being ordered, use the `Out-of-stock(outofstocktime)` event as the event to detect and `Orders(event-time)` event as the event to set the time window with a one hour time window.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-17.png "setting time window condition"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-17.png "setting time window condition")

   Click **Next**.

1. Rename the property `orders.id` to `orderid` to remove the ambiguity with the `outofstock.id` property.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-18.png "renaming the property"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-18.png "renaming the property")

1. Remove the `outofstock.id` property to exclude it from the merged events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-19.png "removing the property"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-19.png "removing the property")

1. Click **Configure** to finalize the join.

### Step 5 : Test the flow

The next step is to run your event processing flow and view the results.

Use the **Run** menu, and select **Include historical** to run your filter on the history of orders and out-of-stock products.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-20.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-20.png "running the flow")

Verify that the orders with out-of-stock products are being correctly displayed.

### Step 6 : Derive additional properties

After identifying orders with out-of-stock products, we need to extract the necessary information to handle these orders and notify customers who placed them.

The next step is to define transformations that will derive additional properties to add to the events.

1. Add a **Transform** node and link it to your Join node: `Orders with out-of-stock products`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-21.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-21.png "defining the transformation")

    Create a transform node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

    Click and drag from the small gray dot on the join node to the matching dot on the transform node.

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Give the transform node a name that describes what it will do: `Extract contact and product information`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-22.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-22.png "defining the transformation")

    Click **Next**.

1. Create the following new additional properties using the transform node.

    | Property name | Expression          | Description  | 
    |---------------|---------------------|--------------|
    | contactname   | customer.name       |Creates a contactname property and sets it to the customer name.|                 
    | contactemail  | customer.emails[1]  |Creates a contactemail property and sets it to the first email in the array of emails provided for the customer. <br>**Note:** The index of arrays starts at 1, not at 0.|
    | contactphone  | IF ( address.billingaddress.phones IS NOT NULL, address.billingaddress.phones[1], address.shippingaddress.phones[1] ) | Creates a contactphone property and sets it to the first phone number in the billing address, else set it to the first phone number in the shipping address.  **Note:** Accessing an array element with an index outside the array data range returns null. For example, phones[1] return null if the array is empty or null.|   
    | billingaddress| address.billingaddress| Creates a billingaddress property and sets it to extract only the billing address information. |   
    | outofstockproduct | CONCAT_WS(' ', product.size, product.material, product.style, product.name)| Creates an outofstockproduct property and sets it to the product description, which is retrieved by concatenating the size, material, style, and name properties of the product separated by a space character.|   

      [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-23.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-23.png "defining the transformation")

      Click **Next**.

1. After extracting all the required information, remove the following properties which are no longer necessary:
   - `customer`
   - `address`
   - `product`

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-24.png "removing the properties"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-24.png "removing the properties")

1. Click **Configure** to finalize the transform.

### Step 7 : Test the flow

The final step is to run your event processing flow and view the results.

Use the **Run** menu, and select **Include historical** to run your filter on the history of orders and out-of-stock products.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example12-25.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example12-25.png "running the flow")

Verify that the output events now only contain the contact and product information.

## Recap

You used a join node to merge the orders and out-of-stock events to identify out-of-stock products. Then, you used a transform node to add more properties and extract necessary information from complex objects and arrays.
