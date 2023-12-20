---
title: "Enrich events with reference data"
description: "Enriching a stream of events with static reference data from a database can increase the business relevance of events."
permalink: /tutorials/event-processing-examples/example-01
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 1
---

## Scenario

The security team wants to process a live stream of door access events, as part of a project to be able to identify and respond to unusual out-of-hours building access.

To begin, they want to create a stream of events for weekend building access, enriching that stream of events with additional information about the buildings from their database.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

You will also need to [run the optional instructions for creating a PostgreSQL database](../guided/tutorial-0#postgresql-database). This database will provide a source of reference data that you will use to enrich the Kafka events.

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots may differ from the current interface if you are using a newer version.

- Event Endpoint Management 11.1.1
- Event Processing 1.1.1

## Instructions

### Step 1 : Discover the topic to use

For this scenario, you need a source of door badge events.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog")

    If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

1. Find the `DOOR.BADGEIN` topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-4.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-4.png "screenshot of the EEM catalog")

1. Click into the topic to review the information about the events that are available here.

    Look at the sample message to see the properties in the door events, and get an idea of what to expect from events on this topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-3.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-3.png "screenshot of the EEM catalog")

**Tip**: Keep this page open. It is helpful to have the catalog available while you work on your event processing flows, as it allows you to refer to the documentation about the events as you work. Complete the following steps in a separate browser window or tab.

### Step 2 : Create a flow

1. Go to the **{{site.data.reuse.ep_name}}** home page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page")

    If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to create an enriched stream of weekend door badge events.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-1.png "creating a flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-1.png "creating a flow")

### Step 3 : Provide a source of events

The next step is to bring the stream of events you discovered in the catalog into {{site.data.reuse.ep_name}}.

1. Create an **Event source** node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-2.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-2.png "adding an event source node")

    Create an event source node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Add a new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source")

    Click **Next**.

1. Get the server address for the event source from the {{site.data.reuse.eem_name}} topic page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-5.png "getting connection details from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-5.png "getting connection details from the catalog")

    Click the **Copy** icon next to the Servers address to copy the address to the clipboard.

1. Configure the new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-6.png "connection details for the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-6.png "connection details for the event source")

    Give the node a name that describes this stream of events: `door events`.

    Paste in the server address that you copied from {{site.data.reuse.eem_name}} in the previous step.

    You need to accept the certificates for the Event Gateway to proceed.

    Click **Next**.

1. Generate access credentials for accessing this stream of events from the {{site.data.reuse.eem_name}} page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-7.png "getting the credentials to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-7.png "getting the credentials to use")

    Click **Generate access credentials** at the top of the page, and provide your contact details.

1. Copy the username and password from {{site.data.reuse.eem_name}} and paste into {{site.data.reuse.ep_name}} to allow access to the topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-9.png "specifying credentials for event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-9.png "specifying credentials for event source")

    The username starts with `eem-`.

    Click **Next**.

1. Confirm the name of the topic that you want to process events from.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-8.png "selecting a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-8.png "selecting a topic to use")

    Click **Next**.

1. Get the sample message for door badge events from {{site.data.reuse.eem_name}}.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-9.png "copy sample message from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-9.png "copy sample message from the catalog")

    Click **Copy** in the Sample message section to copy the sample message to the clipboard.

    You need to give {{ site.data.reuse.ep_name }} a description of the events available from the topic. The information in the sample message enables {{ site.data.reuse.ep_name }} to give guidance for creating event processing nodes.

1. In {{site.data.reuse.ep_name}}, click the **Upload a schema or sample message**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-12-i.png "paste sample message into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-12-i.png "paste sample message into the event source")

1. Paste the sample message into the event source config in the **JSON** tab.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-10.png "paste sample message into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-10.png "paste sample message into the event source")

1. Change the type of the `badgetime` property to `Timestamp`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-11.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-11.png "creating an event source node")

1. Configure the event source to use the `badgetime` property as the source of the event time, and to tolerate lateness of up to **3 minutes**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-12.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-12.png "creating an event source node")

1. Click **Configure** to finalize the event source.

### Step 4 : Derive additional properties

The next step is to define transformations that will derive additional properties to add to the events.

1. Add a **Transform** node and link it to your event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-13.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-13.png "defining the transformation")

    Create a transform node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

    Click and drag from the small gray dot on the event source to the matching dot on the transform node.

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Give the transform node a name that describes what it will do: `additional properties`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-14.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-14.png "defining the transformation")

    Click **Next**.

1. Compute two new additional properties using the transform node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-15.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-15.png "defining the transformation")

    You should call the first property **`day of week`**.

    This will identify the day of the week from the timestamp contained in the door event. This is created as a number, where 1 means Sunday, 2 means Monday, and so on.

    Use this function expression:

    ```sql
    DAYOFWEEK ( CAST(badgetime AS DATE) )
    ```

    You should call the second property **`building`**.

    Door IDs are made up of:
    `<building id> - <floor number> - <door number>`

    For example:
    `H-0-36`

    For your second property, you should use the function expression:

    ```sql
    REGEXP_EXTRACT(`door`, '([A-Z]+)-.*', 1)
    ```

    This expression will capture the building ID from the start of the door ID.

1. Click **Next** and then **Configure** to finalize the transform.

### Step 5 : Testing the flow

The next step is to run your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of door badge events available on this Kafka topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-16.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-16.png "running the flow")

    Verify that the day of the week is being correctly extracted from the timestamp, and that the building ID is correctly being extracted from the door ID.

### Step 6 : Filter to events of interest

The next step is to identify door badge events that occur at weekends. The additional `day of week` property that you computed in the transform node will be helpful for this.

1. Create a **Filter** node and link it to a transform node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-17.png "add a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-17.png "add a filter node")

    Create a filter node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

    Click and drag from the small gray dot on the event source to the matching dot on the filter node.

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Give the filter node a name that describes the events it should identify: `weekend door events`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-18.png "naming the filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-18.png "naming the filter node")

    Click **Next**.

1. Define a filter that matches door badge events with a `day of week` value that indicates Saturday or Sunday.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-19.png "configuring the filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-19.png "configuring the filter node")

    Filter expression:

    ```sql
    `day of week` = CAST (1 AS BIGINT)
      OR
    `day of week` = CAST (7 AS BIGINT)
    ```

    **Did you know?** Including line breaks in your expressions can make them easier to read.

1. Click **Configure** to finalize the filter.

### Step 7 : Testing the flow

The next step is to run your event processing flow again and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of door badge events available on this Kafka topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-20.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-20.png "running the flow")

    Verify that all events are for door badge events with a timestamp of a Saturday or Sunday.

### Step 8 : Enrich the events

The next step is to add additional information about the building to these out-of-hours door events.

1. Add a **Database** node to the flow.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-21.png "defining event enrichment"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-21.png "defining event enrichment")

    Create a database node by dragging one onto the canvas. You can find this in the **Enrichment** section of the left panel.

1. Give the database node a name and paste the JDBC URI for your database into the Database server box.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-22.png "defining event enrichment"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-22.png "defining event enrichment")

    Get the **JDBC URI** for your PostgreSQL database by following the instructions for [Accessing PostgreSQL database tables](../guided/tutorial-access#accessing-postgresql-database-tables).

1. Click **Next**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-23.png "defining event enrichment"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-23.png "defining event enrichment")

    The database username and password were included in the JDBC URI, so no additional credentials are required.

1. Choose the **buildings** database table.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-24.png "defining event enrichment"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-24.png "defining event enrichment")

1. Use the assistant to define a join that matches events with the database row about the same building.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-25.png "defining event enrichment"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-25.png "defining event enrichment")

    Match the `building` value from the Kafka events with the database row using the `buildingid` column.

    Click **Next**.

1. Choose the database columns to include in your output events.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-26.png "defining event enrichment"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-26.png "defining event enrichment")

    Include the street name and security contact columns.

    There is no need to include the ``buildingid`` column because this value is already contained in the events.

    Click **Next**.

1. Choose the properties to output.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-27.png "defining event enrichment"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-27.png "defining event enrichment")

    For example, the `day of week` property was useful for our filter, but we may not need to output it as a finished result.

    The screenshot shows an example set of properties that could be useful for this demo scenario.

1. Click **Configure** to finalize the enrichment.

### Step 9 : Testing the flow

The final step is to run your event processing flow and view the results.

1. Use the **Run** menu, and select **Include historical** to run your filter on the history of door badge events available on this Kafka topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-28.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-28.png "running the flow")

## Recap

You used a transform node to compute additional properties from a stream of events.

You then further enhanced the stream of events to increase their business relevance by enriching the events with reference data from a database. Relevant data in the database was identified based on the new computed properties.
