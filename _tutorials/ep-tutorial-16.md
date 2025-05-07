---
title: "Detecting patterns of events"
description: "With the detect patterns node, you can detect a sequence of events. Find out how a commercial website can use the detect patterns node to identify failed transactions with its bank."
permalink: /tutorials/detect-patterns/
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 16
---

## Detect patterns

With the detect patterns node, you can detect a sequence of events. As events are produced into the input streams, you can use the detect patterns node to identify a pattern from the events within a specific time window. 

## Scenario

A commercial website has to perform financial transactions with its bank. Each transaction allows to transfer money in several steps instead of a single huge transfer. Each step of the transaction generates an event containing the unique identifier of the transaction, the transmitted amount of money, a timestamp and the state of the transaction that can be one of STARTED, PROCESSING or COMPLETED.

You can use the detect patterns node to identify if there is a failed transaction. To do that, you can detect a pattern for a transaction where there is an event with STARTED state, followed by two events with PROCESSING state, but are not followed by an event with COMPLETED state within seven minutes.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in {{ site.data.reuse.ea_long }}. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of {{ site.data.reuse.ea_long }} that you can use to follow this tutorial for yourself.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots can differ from the current interface if you are using a newer version.

- {{site.data.reuse.eem_name}} 11.5.1
- {{site.data.reuse.ep_name}} 1.3.2

## Instructions

### Step 1 : Discover the topics to use

For this scenario, you need a source for the `Transactions` events.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the Event Endpoint Management catalog")

   If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

   If there are no topics in the catalog, you might need to complete the tutorial setup step to [populate the catalog](../guided/tutorial-0#populating-the-catalog).

2. Find the `Transactions` topics.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-1.png "Screen capture of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-1.png "Screen capture of the Event Endpoint Management catalog")

 3. Click into the topics to review the information about the events that are available here.
    Look at the schema to see the properties in the events, and get an idea of what to expect from events on these topics.
    
    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-2.png "Screen capture of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-2.png "Screen capture of the Event Endpoint Management catalog")
   

### Step 2: Create a flow

   To create a flow, complete the following steps:

 1. Go to the **{{site.data.reuse.ep_name}}** home page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "Screen capture of the Event Processing home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "Screen capture of the Event Processing home page")

    If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

2. Create a flow, and give it a name and description to explain that you will use it to have more insight into the state of your transactions.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-3.png "Event Processing home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-3.png "Event Processing home page")

### Step 3: Add an event source node for the Transactions topic

The next step is to bring the stream of events you discovered in the catalog into {{site.data.reuse.ep_name}}. 
   
To create an event source, complete the following steps:

1. Add an **Event source** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-4.png "Adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-4.png "Adding an event source node")

    When you create a flow, an event source node is automatically added to your canvas. A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the event source node indicating that the node is yet to be configured.

    Hover over the node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.


1.  Ensure that the **Add event source** tile is selected, and then click **Next**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "Add an event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "Add an event source")    
    

1. Get the server address for the event source from the {{site.data.reuse.eem_name}} topic page.
    
    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-5.png "Getting connection details from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-5.png "Getting connection details from the catalog")

    Click the **Copy** icon next to the **Servers** address to copy the address to the clipboard.

1. Go to {{site.data.reuse.ep_name}}, and configure the new event source.    
    
    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-6.png "connection details for the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-6-new1.png "connection details for the event source")

    In the **Server** field, paste the server address that you copied from {{site.data.reuse.eem_name}} in the previous step.    

    Click **Next**.

1. Generate access credentials for accessing this stream of events from the {{site.data.reuse.eem_name}} page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-7.png "Getting the credentials to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-7.png "Getting the credentials to use")

    Click **Generate access credentials** at the top of the page, and provide your contact details.


1. Copy the username and password from {{site.data.reuse.eem_name}} and paste into {{site.data.reuse.ep_name}} to access the topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-8.png "specifying credentials for event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-8.png "specifying credentials for event source")

    The username starts with `eem-`.

    Click **Next** to go to the **Topic selection** pane.

1. Select the `TRANSACTIONS` topic to process events from, and click **Next**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-9.png "Select a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-9.png "Select a topic to use")        

1. The `JSON` message format is auto-selected in the **Message format** drop-down. Click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-10.png "Paste schema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-10.png "Paste schema into the event source")  

1. In the **Key and headers** pane, click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial1-key-headers-new.png "map key and headers"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial1-key-headers-new.png "map key and header")      

   **Note:** The key and headers are displayed automatically if they are available in the selected topic message.

1. In the **Event details** pane, enter the node a name that describes this stream of events: `transactions`

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-11.png "Select a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-11.png "Select a topic to use")        

1. Configure the event source to use the `timestamp` property as the source of the event time, and to tolerate lateness of up to **1 minute**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-12.png "Creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-12.png "Creating an event source node")

1. Click **Configure** to finalize the event source configuration.


### Step 4: Filter transaction states into separate events

Currently, all transaction states are consolidated into a single `transactions` event. You must filter them into distinct events for each of the `STARTED`, `PROCESSING`, and `COMPLETED` states. You can use the filter node to achieve this. 

1. Add a **Filter** node for the `STARTED` state and link it to the `transactions` event. 

   Hover over the filter node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.   
   In the **Node name** field, enter the name of the filter node as `transactions_started`, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-14.png "Creating a filter expression for transactions in started state"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-14.png "Creating a filter for transactions in started state")

   Enter the filter expression **\`state\` LIKE 'STARTED'** , and click **Configure**. 

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-13.png "Creating a filter expression for transactions in started state"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-13.png "Creating a filter expression for transactions in started state")


1. Add another **Filter** node for the `PROCESSING` state and link it to the `transactions` event. 

   Hover over the filter node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.
   In the **Node name** field, enter the name of the filter node as `transactions_processing`, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-16.png "Creating a filter expresssion for transactions in processing state"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-16.png "Creating a filter expression for transactions in processing state")

   Enter the filter expression **\`state\` LIKE 'PROCESSING'** , and click **Configure**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-15.png "Creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-15.png "Creating a filter for transactions in processing state")


1. Add another **Filter** node for the `COMPLETED` state and link it to the `transactions` event.

   Hover over the filter node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.   
   In the **Node name** field, enter the name of the filter node as `transactions_completed`, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-18.png "Creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-18.png "Creating a filter for transactions in completed state")

   Enter the filter expression **\`state\` LIKE 'COMPLETED'** , and click **Configure**. 

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-17.png "Creating a filter expression for transactions in processing state"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-17.png "Creating a filter expression for transactions in processing state")

### Step 5: Detect transactions that are not completed

To detect failed transactions, use the detect patterns node as follows.

1. Add a **Detect patterns** node and link it to each output of your three filters.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-19.png "Creating a detect patterns node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-19.png "Creating a detect patterns node")


   Hover over the detect patterns node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. In the **Node name** field, enter the name of the detect patterns node as `transactions_completed`, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-20.png "Creating a detect patterns node name"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-20.png "Creating a detect patterns node name")

1. In the **Define context**, select **id** from each dropdown list, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-20.png "Creating a detect patterns node context"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-20.png "Creating a detect patterns node context")

1. In the **Define pattern**, create the following matching condition:

   ```shell
   Event: transaction_started, occurrence: 1
   Condition: Followed by
   Event: transaction_processing, occurrence: 2
   Condition: Not followed by
   Event: transaction_completed, occurrence: 1
   ```

   For the **Time window duration**, select `7 minutes`.

   For the **Detection mode**, select **Real time**, then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-22.png "Creating a detect patterns node pattern"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-22.png "Creating a detect patterns node pattern")

1. In the **Output properties**, remove property `patternMatchTime` and rename property `contextKey` to `transactionId`, then click **Configure**.

1. From the menu, click button **Run flow** then select **Include historical**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-24.png "Running a detect patterns flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-24.png "CRunning a detect patterns flow")

   After a moment, the output will be displayed.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-25.png "Pattern detected from the detect patterns running flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-16-25.png "Pattern detected from the detect patterns running flow")

## Recap

You used filter node to filter the state of your transactions into separate events and detected failed transactions by using the detect patterns node.