---
title: "Deduplicating repeated events"
description: "Some systems offer at-least-once assurances, and will occasionally generate duplicate events. Processing these to remove duplicates can enable consumption by systems that cannot behave idempotently."
permalink: /tutorials/event-processing-examples/example-05
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 5
---

{% include video.html videoSource="videos/tutorials/examples/05-dedupe.mp4" %}{: class="tutorial-video" }

## Scenario

The operations team needs to remove duplicate events from the stock movements topic, for processing by systems that cannot behave idempotently.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots may differ from the current interface if you are using a newer version.

- Event Streams 3.3.0
- Event Endpoint Management 11.1.1
- Event Processing 1.1.1

## Instructions

### Step 1 : Discover the source topic to use

For this scenario, you are processing an existing stream of events. You will start by identifying the topic.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the EEM catalog")

   If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

   If there are no topics in the catalog, you may need to complete the tutorial setup step to [populate the catalog](../guided/tutorial-0#populating-the-catalog).

1. The `STOCK.MOVEMENT` topic contains the events used in this tutorial.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-1.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-1.png "screenshot of the EEM catalog")

   **Tip**: Notice that the topic information describes the issue that we are addressing in this tutorial. Documenting potential issues and considerations for using topics is essential for enabling effective reuse.


### Step 2 : Create a topic for the deduplicated events

The pre-processing job will write the deduplicated events to a different topic, that can be used as a source for the systems that are unable to process idempotently.

The next step is to create this topic.

1. Go to the **{{site.data.reuse.es_name}}** topics manager.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-2.png "screenshot of the ES topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-2.png "screenshot of the ES topics page")

   If you need a reminder about how to access the {{site.data.reuse.es_name}} web UI, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-streams).

1. Create a new topic called `STOCK.MOVEMENT.UNIQUE`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-3.png "screenshot of the ES topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-3.png "screenshot of the ES topics page")

1. Create the topic with **3 partitions** to match the `STOCK.MOVEMENT` source topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-4.png "screenshot of the ES topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-4.png "screenshot of the ES topics page")


### Step 3 : Create a skeleton processing flow

The {{site.data.reuse.ep_name}} authoring UI makes it easy to start new projects. Before we start writing the deduplication filter query, we can set up the new job by using the low-code UI.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page")

   If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to deduplicate the events on the stock movements topic.

1. Create an **Event source** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-5.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-5.png "adding an event source node")

   Use the server address information and **Generate access credentials** button on the topic page in the catalog from [Step 1](#step-1--discover-the-source-topic-to-use) to configure the event source node.

   **Tip**: If you need a reminder about how to create an event source node, you can follow the [Identify orders from a specific region](../guided/tutorial-1) tutorial.

   **Tip**: You will need the access credentials that you create here again in [Step 4](#step-4--export-and-prepare-the-pre-processing-sql). Saving the credentials JSON from the catalog makes this easier.

1. Create an **Event destination** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-6.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-6.png "adding an event destination node")

1. Configure the event destination node by using the internal server address from {{site.data.reuse.es_name}}.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-7.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-7.png "adding an event destination node")

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-8.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-8.png "adding an event destination node")

1. Use the username and password for the `kafka-demo-apps` user for accessing the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-9.png "adding an event destination node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-9.png "adding an event destination node")

   If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](../guided/tutorial-access#accessing-kafka-topics) section of the Tutorial Setup instructions.

1. Choose the `STOCK.MOVEMENT.UNIQUE` topic created in [Step 2](#step-2--create-a-topic-for-the-deduplicated-events).

### Step 4 : Export and prepare the pre-processing SQL

The skeleton processing flow is now ready to export. The next step is to use it as the basis for writing your deduplication job.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

1. Use the menu for your deduplication job to select **Export**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-10.png "preparing the de-duplication job"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-10.png "prepare the de-duplication job")

1. Choose the **SQL** export option.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-11.png "preparing the de-duplication job"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-11.png "prepare the de-duplication job")

1. Open the exported SQL file in a text editor.

   **Tip**: Customizing the SQL exported from {{site.data.reuse.ep_name}} can enable a wide range of additional processing scenarios.

1. Edit the SQL to add {{site.data.reuse.eem_name}} credentials.

   The `properties.sasl.jaas.config` attribute in your **Stock movements** event source will have empty values for `username` and `password`. You need to fill these in using the access credentials that you created in the {{site.data.reuse.eem_name}} catalog.

   **Tip**: If you no longer have the password available, you can create a new set of credentials from the catalog for use in your SQL job.

1. Edit the SQL to add {{site.data.reuse.es_name}} credentials.

   The `properties.sasl.jaas.config` attribute in your **Unique stock movements** event destination will have empty values for `username` and `password`. You need to fill these in using the access credentials from {{site.data.reuse.es_name}}.

1. Insert the following line at the start of the SQL file to give your Flink job a recognizable name.

   ```sql
   SET 'pipeline.name' = 'stock-movements-deduplication';
   ```

### Step 5 : Write the custom SQL step

The outline of your SQL is now ready. The next step is to prepare the deduplication step by adding it to your template SQL.

1. Find the last line of the SQL. It will look something like this:

   ```sql
   INSERT INTO `Unique stock movements` SELECT * FROM `Stock movements`;
   ```

   The names will vary depending on what you named the nodes in your skeleton flow.

1. Modify the SQL to look like this:

   ```sql
   INSERT INTO `Unique stock movements`
        SELECT
            movementid,
            warehouse,
            product,
            quantity,
            updatetime,
            event_time
        FROM
        (
            SELECT *,
                ROW_NUMBER() OVER (PARTITION BY movementid ORDER BY event_time ASC) AS rownum
            FROM
                `Stock movements`
        )
        WHERE
            rownum = 1;
   ```

   Modify `Stock movements` and `Unique stock movements` to match the names that you gave your event source and event destination nodes. You can find those names in the two `CREATE TABLE` commands in the SQL file.

   **Tip**: You can learn more about [deduplication in the Apache Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/sql/queries/deduplication/){:target="_blank"} if you would like to understand how this works.

### Step 6 : Modify the event destination

The final step is to configure the destination where you will be writing the deduplicated events to.

Find the `CREATE TABLE` definition for the destination topic. It will start with something like this:

```sql
CREATE TABLE `Unique stock movements`
(
    `movementid`                   STRING,
    `warehouse`                    STRING,
    `product`                      STRING,
    `quantity`                     BIGINT,
    `updatetime`                   STRING,
    `event_time`                   TIMESTAMP(6)
)
```

(As before, your table name may be different).

You need to make a few modifications to this definition to prepare it for use by your query. All of the following modifications are to this table definition.

1. Modify the `event_time` to look like this:

   ```sql
   CREATE TABLE `Unique stock movements`
   (
       `movementid`                   STRING,
       `warehouse`                    STRING,
       `product`                      STRING,
       `quantity`                     BIGINT,
       `updatetime`                   STRING,
       `event_time`                   TIMESTAMP(6) METADATA FROM 'timestamp'
   )
   ```

   This will mean that messages produced to `STOCK.MOVEMENT.UNIQUE` will have the metadata timestamp from the original message, rather than a new timestamp for when the message was produced.

1. Add a `PRIMARY KEY` property to the table.

   ```sql
   CREATE TABLE `Unique stock movements`
   (
       `movementid`                   STRING,
       `warehouse`                    STRING,
       `product`                      STRING,
       `quantity`                     BIGINT,
       `updatetime`                   STRING,
       `event_time`                   TIMESTAMP(6) METADATA FROM 'timestamp',
       PRIMARY KEY (`movementid`) NOT ENFORCED
   )
   ```

1. Modify the connector name to use `upsert` (instead of append) mode.

   ```sql
       PRIMARY KEY (`movementid`) NOT ENFORCED
   )
   WITH (
       'connector' = 'upsert-kafka',
       'topic' = 'STOCK.MOVEMENT.UNIQUE',
   ```

1. Remove the line with the `scan.startup.mode` property.

1. Remove `'format' = 'json'` and replace it with the following:

   ```sql
       'key.format' = 'raw',
       'value.format' = 'json',
   ```

### Step 6 : Submit your SQL job

The final step is to submit your finished deduplication job to Flink.

1. {{site.data.reuse.openshift_cli_login}}

1. Get the name of the pod for your Flink job manager:

   ```sh
   POD_NAME=$(oc get pods \
       -l component=jobmanager \
       -l app=my-flink \
       -l app.kubernetes.io/instance=ibm-eventautomation-flink \
       -n event-automation \
       -o custom-columns=Name:.metadata.name \
       --no-headers=true)
   ```

2. Copy your SQL file to the job manager pod.

   ```sh
   oc cp -n event-automation \
       <your-sql-file.sql> $POD_NAME:/tmp/deduplication.sql
   ```

   Replace `<your-sql-file.sql>` with the name of the SQL file that you created.

3. Run the Flink SQL job

   ```sh
   oc exec -n event-automation $POD_NAME -- \
       /opt/flink/bin/sql-client.sh -hist /dev/null -f /tmp/deduplication.sql
   ```

   The submitted job continues running, processing and deduplicating new events as they are produced to the `STOCK.MOVEMENT` topic.


### Step 7 : Confirm the results

You can verify the job by examining the destination topic.

1. View the original events on the `STOCK.MOVEMENT` topic.

1. Use the timestamp to identify a duplicate event.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-12.png "results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-12.png "results")

    Approximately one in ten of the events on this topic are duplicated, so looking through ten or so messages should be enough to find an example.

1. Examine the event with the same timestamp on the `STOCK.MOVEMENT.UNIQUE` topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example5-13.png "results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example5-13.png "results")

    You should see that there is only a single event with that timestamp and contents on the destination topic, as the duplicate event was filtered out.


## Recap

You have written a custom Flink SQL job to preprocess the events on a Kafka topic. The results are written to a different Kafka topic.

You could use this second topic as the source for an {{site.data.reuse.ep_name}} flow, or any other Kafka application.
