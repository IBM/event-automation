---
title: "Building a simple flow"
excerpt: "Getting started with Event Processing"
categories: getting-started
slug: canvas
toc: true
---

In this getting started tutorial, we'll take you through how to use {{site.data.reuse.ep_name}} to create a simple flow. The flow uses a filter node to select a subset of events.

For demonstration purposes, we use the scenario of a clothing company who want to move away from reviewing quarterly sales reports to reviewing orders in their region as they occur. Identifying large orders in real time helps the clothing company identify changes that are needed in sales forecasts much earlier. This information can also be fed back into their manufacturing cycle so that they can better respond to demand.

The steps in this getting started tutorial should take you about 10 minutes to complete.

## Before you begin
{: #before-you-begin}

1. This getting started scenario assumes that all the capabilities in {{site.data.reuse.ea_short}} are installed.
1. Connect with your cluster administrator and get the server address for the topic you have to access.
1. Keep your instance open on the topic page because you need to use information from it when you create your flow.
1. Open {{site.data.reuse.ep_name}} in a separate window or tab.

This getting started scenario assumes that there is an order details available through a Kafka topic, and the topic is discoverable in [{{site.data.reuse.eem_name}}]({{ '/eem/describe/adding-topics' | relative_url }}). For example, in this scenario, the clothing company have a topic in their {{site.data.reuse.eem_name}} catalog called `ORDERS.NEW`. This topic emits events for every new order that is made.

## Step 1: Create a flow
{: #Create}

1. On the {{site.data.reuse.ep_name}} home page, click **Create**.
1. Provide a name and optionally a description for your flow.
1. Click **Create**. The canvas is displayed with an event source node on it.


   **Note:** When you create a flow, an event source node is automatically added to your canvas. A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the event source node indicating that the node is yet to be configured.

1. To configure an event source, hover over the source node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. The **Configure event source** window is displayed. 

The clothing company created a flow called `Filter` and provided a description to explain that this flow will be used to identify orders made in a specific region.

![Create a flow]({{ 'images' | relative_url }}/ep-lab1-create.png "Diagram to show creating a flow.")

### Save
{: #save}

User actions are saved automatically. For save status updates, see the canvas header.  

- **Saving** ![Saving]({{ 'images' | relative_url }}/save_inprogress.png "Icon showing save is in progress."){:height="30px" width="15px"} indicates that saving is in progress.
- **Saved** ![Save successful]({{ 'images' | relative_url }}/save_successful.png "Icon showing save is successful."){:height="30px" width="15px"} confirms success.
- **Failed** ![Save failed]({{ 'images' | relative_url }}/save_error.png "Icon showing that the save is failed."){:height="30px" width="15px"} indicates that there are errors. If an action fails to save automatically, you receive a notification to try the save again. Click **Retry** to re-attempt the save. When a valid flow is saved, you can proceed to run the job.
- **Stale** ![Stale]({{ 'images' | relative_url }}/save_error.png "Icon showing that the flow is stale."){:height="30px" width="15px"} indicates that another user modified the flow. A pop-up window is displayed and depending on the **Stale** status you are prompted to select one of the following actions:
    - **Save as a copy**: Select this action to save the current flow as a new one without incorporating the changes made by the other user. The new flow is called 'Copy of `<flow-name>`'.
    - **Accept changes**: Select this action to apply the latest updates that are made by the other user to the flow. For the **Flow running** case, you can view the running flow.
    - **Home**: Select this action to navigate back to the home page. The specific flow will no longer be available because it was deleted by another user.

## Step 2: Configure an event source
{: #configure-event}

1. You need to provide the source of events that you want to process. To do this, start by adding an event source, select **Add new event source** > **Next**.
1. In the **Cluster connection** pane, provide the server address of the Kafka cluster that you want to connect to. You can get the server address for the event source from your cluster administrator.

    **Note:** To add more addresses, click **Add bootstrap server +** and enter the server address.


1. Click **Next**. The **Access credentials** pane is displayed.
1. Provide the credentials that are required to access your Kafka cluster and topic. You can generate access credentials for accessing a stream of events from the {{site.data.reuse.eem_name}} page. For more information, see [subscribing to event endpoints]({{ '/eem/subscribe/subscribing-to-event-endpoints/' | relative_url }}).
1. Click **Next**. The **Topic selection** pane is displayed.
1. Use the radio buttons to confirm the name of the topic that you want to process events from.
1. Click **Next**. The **Message format** pane is displayed.

   {{site.data.reuse.ep_name}} introspects the latest message on the topic (assuming there are incoming messages), and detects if the message is in a supported format. If the format cannot be detected, manually choose the correct message format for the topic the event source is connecting to.

1. Click **Next** to go to the **Event details** pane.
1. In the **Event details** section, provide a name for your node. Leave the event source to be saved for later reuse. Saving the connection details makes creating similar event sources a lot quicker because there is no need to enter the same details again. 
1. In the **Event structure** section, clear the properties that are not relevant to define the structure of source events.
1. Set an event time.
1. Click **Configure**. The canvas is displayed and your event source node has a green checkmark, which indicates that the node has been configured successfully.


The clothing company called their event source `Orders` and used the schema for their `Order events` topic in {{site.data.reuse.eem_name}} to update the topic schema tab in {{site.data.reuse.ep_name}}.

![Define event structure]({{ 'images' | relative_url }}/ep-lab1-eventsource-4.png "Image to show the clothing company defining the event structure.")

## Step 3: Add a filter
{: #add-filter}

1. On the **Palette**, in the **Processors** section, drag a **Filter** node onto the canvas.
1. Drag the **Output port** on the event node to the **Input port** on the filter to join the two nodes together.
1. Hover over the source node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. 

The **Configure filter** window is displayed.

## Step 4: Configure the filter
{: #configure-filter}

1. Now, you need to configure the filter that defines the events that you are interested in. To do this, in the **Details** section, provide a name for the filter node.
1. Click **Next**. The **Define filter** section is displayed.
1. Use the **Assistant** to define a filter with your requirements by updating the **Property to filter on**, **Condition**, and **Value** fields.

   ![Defining a filter]({{ 'images' | relative_url }}/ep-lab1-filter-2.png "Image to show the clothing company using the assistant to define a filter")

1. Click **Add to expression**.
1. ![Event Processing 1.4.4 icon]({{ 'images' | relative_url }}/1.4.4.svg "In Event Processing 1.4.4 and later.") Click **Next** to open the **Output properties** pane. The properties that you added in the previous step are displayed in the **Output properties** pane. You can manage the properties that come from this node to suit your requirements.

   ![Output properties of a filter]({{ 'images' | relative_url }}/ep-lab1-filter-3.png "Image to show the clothing company using the assistant to define a filter")

1. Click **Configure**. The canvas is displayed, your filter node has a green checkmark, which indicates that the node has been configured successfully.

The clothing company called their filter `EMEA orders` and defined a filter that matches events with a `region` value of `EMEA`.


## Step 5: Run the flow 
{: #run-flow}

1. The last step is to run your {{site.data.reuse.ep_name}} flow and view the results.
2. In the navigation banner, complete one of the following steps:

   - If your flow includes any event sources, expand **Run flow** and select either **Events from now** or **Include historical**.
   - If your flow uses SQL sources only, click **Run flow** to start the flow.

**Note**: ![Event Processing 1.4.2 icon]({{ 'images' | relative_url }}/1.4.2.svg "In Event Processing 1.4.2 and later") In Event Processing 1.4.2 and later, the options to run your flow either **Events from now** or **Include historical** are shown only when the flow includes event sources. These options are not shown when all sources are SQL, because the start position is defined in the SQL query itself. If your flow includes only SQL sources (that is, no event source nodes), a single **Run flow** button is displayed instead.

A live view of results from your running flow automatically opens. The results view is showing the output from your flow - the result of processing any events that have been produced to your chosen {{site.data.reuse.eem_name}} topic.


**Tip**: **Include historical** is useful while you are developing your flows because you don't need to wait for new events to be produced to the topic. You can use all the events already on the Kafka topic to check that your flow is working the way that you want.

In the navigation banner, click **Stop flow** to stop the flow when you finish reviewing the results.

The clothing company selected **Include historical** to run the filter on the history of order events available on their `Order events` topic. All the orders from the EMEA region are displayed. This provides the company real-time information about orders placed in the region, and helps them review orders as they occur.

![Viewing results]({{ 'images' | relative_url }}/ep-lab1-results-updated.png "Image to show the clothing company viewing the results of their flow.")

![Event Processing 1.4.2 icon]({{ 'images' | relative_url }}/1.4.2.svg "In Event Processing 1.4.2 and later.") In {{site.data.reuse.ep_name}} 1.4.2 and later, you can view the output events of any particular node by selecting the radio button ![Checked radio button icon]({{ 'images' | relative_url }}/radio-button--checked.svg "Checked radio button icon.") within a node after you run the flow. You can also filter rows by searching a particular text in the **Search for events** field located on top of the **Output events** table. Spaces are included and the text that you enter is case-insensitive. Matching texts in rows are highlighted.

To view the output events of a complete flow, you can select the radio button of the last node in your flow. By default, the last node in the flow is selected.

In {{site.data.reuse.ep_name}} 1.4.2 and later, while running a flow, you can check the number of output events represented by the icon ![Number of events icon]({{ 'images' | relative_url }}/number-of-events.svg "Number of events icon.") next to each node in the canvas. The number of output events is updated even while the refresh of the output events table is paused.

**Note:** If you leave the page without stopping the flow by navigating to the home page or by closing the browser tab, when you return to the flow, the number of events and the output events are those that occur after you returned to the flow.

## Flow statuses
{: #flow-statuses}

A flow status indicates the current state of the flow. To view the status of a flow, navigate to the **Flows** section on the homepage of the {{site.data.reuse.ep_name}} UI. Each flow tile displays the current status of the flow.

![Flow tiles displaying various statuses]({{ 'images' | relative_url }}/flowcard-status.png "Image of flow tiles displaying various statuses")


A flow can be in one of the following states:

- **Draft:** Indicates that the flow includes one or more nodes that need to be configured. The flow cannot be run.
- **Valid:** Indicates that all nodes in the flow are configured and valid. The flow is ready to run.
- **Invalid:** Indicates that the nodes in the flow are configured but have a validation error, or a required node is missing. The flow cannot be run.
- **Running:** Indicates that the flow is configured, validated, running, and generating output.
- **Error:** Indicates that an error occurred during the runtime of a previously running flow.

**Tip:** You can click the icon next to **Invalid** and **Error** states to find more information about the error.
