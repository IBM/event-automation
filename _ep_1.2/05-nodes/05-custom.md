---
title: "Custom nodes"
excerpt: "Event Processing provides a set of custom nodes to create event stream processing flows."
categories: nodes
slug: custom
toc: true
---

![Event Processing 1.2.2 icon]({{ 'images' | relative_url }}/1.2.2plus.svg "In Event Processing 1.2.2 and later.") The following **Custom** nodes are available in {{site.data.reuse.ep_name}}:

- SQL source
- SQL processor
- SQL destination

You can either begin from scratch by dragging and dropping any of the three new nodes, or start by configuring an existing node, whether fully or partially, and then transform it into SQL for further modifications. The custom nodes are compatible with [Flink SQL syntax](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/table/sql/overview/){:target="_blank"}.

One key benefit of the custom nodes in {{site.data.reuse.ep_name}} is the ability to unlock advanced SQL capabilities and run complex queries that can further enhance your {{site.data.reuse.ep_name}} workflows.



- The SQL source node functions similarly to the existing [event source node](../eventnodes/#event-source), and allows customization of the properties of the source connector used.

- The SQL processor node can be used to write Flink SQL code, allowing for the implementation of complex queries and processing logic. For example, you can use SQL processor nodes to find and remove duplicate events.

- The SQL destination node functions similarly to the existing [event destination node](../eventnodes/#event-destination), and allows customization of the properties of the sink connector used.

## Adding a custom node

To add a custom node, complete the following steps:

1. In the palette, under **Custom**, drag the required custom node into the canvas:

   - SQL source
   - SQL processor
   - SQL destination

1. If the selected node is an SQL processor or an SQL destination, then connect the node to an event source by dragging the output port from a source node into the input port of this node.

   **Note:** SQL processor nodes support multiple inputs or sources. 

A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the node indicating that the node is yet to be configured.


### Converting any node to a custom node

You can convert any existing node on your canvas to a custom node in two ways:

- Click **Preview SQL** in the node configuration window.
- ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3plus.svg "In Event Processing 1.2.3 and later.") Hover over the node or right-click the node in the canvas, click **More Options** ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} , and select **Preview SQL**.

The SQL code of your node is displayed in read-only mode. To convert the node to a custom node and edit the SQL, click **Edit SQL**.

**Important:** After converting the node to a custom node, the node cannot be reverted.

## Configuring a custom node

Hover over the node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node. The **Configure SQL** window with a text editor opens.

1. Hover over the node name in the toolbar, and click **Edit** to rename the node.

1. Write your Flink SQL statements in the editor. To assist with your SQL statements, you can use the tree view in the SQL processor and the SQL destination nodes to view all the properties and their respective types of all the input nodes.

   In addition to writing Flink SQL code from scratch, you can also paste existing SQL code into the editor for convenience. The toolbar in the editor provides a range of features, including:

   - Undo and redo changes to your code
   - A copy-to-clipboard option to copy your code for use elsewhere
   - A search function to quickly find specific parts of your code


   You can click **Configure** regardless of the validity of the SQL statements. If errors are present, a dialog pops-up showing **Invalid node**. You can view the errors by clicking **View errors**.  In the dialog, you can click **Save as draft** to preserve your statements even if they contain errors.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} is displayed on the node if your node is configured correctly.


### Validation rules for Flink SQL code

- SQL source node:
  - The SQL must contain exactly one `CREATE [TEMPORARY] TABLE` statement.
  - You can include any number of SQL statements.
  - The structure of the output node is determined by the `TABLE` created, or by the last `VIEW` referenced in the statements.

- SQL processor node:

  - The SQL must contain at least one `CREATE [TEMPORARY] VIEW` statement and any number of other SQL statements.
  - The node supports multiple inputs and the SQL statements are allowed to reference only the tables or views from the input list or those created internally within the node.
  - The structure of the output of the node is defined by the last `VIEW` in the statement.

- SQL destination node:

  - The SQL must contain exactly one `CREATE [TEMPORARY] TABLE` statement.
  - The structure of the output of the node is defined by that `TABLE`.

The following statements are not supported in all the three custom nodes:

- `CREATE TABLE AS SELECT`
- `[CREATE OR] REPLACE TABLE AS SELECT`
- `EXECUTE STATEMENT SET`
- `ADD JAR`
- `CREATE FUNCTION USING JAR`
- SQL statements that begin with `SELECT` or `INSERT`

**Important:** You can write any supported SQL statements, but be aware of the risks, such as deleting or renaming an input table or view.

### Changelog stream

In event streaming, there are two key patterns for how data passes through a stream processing flow: append-only (also known as insert-only) and changelog stream. Previously, {{site.data.reuse.ep_name}} consumed and generated append-only stream, where events are continuously appended to a stream - each event is considered idempotent. With the introduction of custom nodes, it is now possible to consume and create changelog stream, where an event can capture a change to a previous event - such as an update, or deletion.

To support these operations effectively in a Kafka setup, the [Upsert Kafka connector](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/upsert-kafka/){:target="_blank"} is used. This connector enables changelog stream to serve as both input and output of the flow, and can be used in the SQL source or SQL destination nodes:

- To consume events from a Kafka topic that contains a changelog stream, use the Upsert Kafka connector with the SQL source node.

- To send events that contain a changelog stream to Kafka, use the Upsert Kafka connector with the SQL destination node.

- To allow proper tracking of updates and deletions in the changelog stream, you might have to define a primary key in the `CREATE TABLE` statement.

When you run a flow, the **Changelog stream detected** popup appears indicating that the events have a change to the state. You can view the corresponding operation for each event (for example, **+I**, **+U**, **-U**, and **-D**) in the **Mode** column of your output events:

- Insert (**+I**): This event describes the creation of a new record.

- Update: These events describe a modification of an existing record:
  - Update Before (**-U**): Shows the state of a record immediately before it was modified. It provides a snapshot of the earlier values.

  - Update After (**+U**): Represents the new state of the record after an update was made. It includes the latest values, allowing consumers to see the updated version and maintain an up-to-date view.

- Delete (**-D**): A record is removed when no longer needed.

These operations facilitate the management of real-time stateful applications, where the current state takes precedence over historical data.

### Implications for Kafka topics and consumers

If your flow produces a changelog stream, the events in the Kafka topic differ from those in an append-only stream. This behavior has several implications, including:

- Stateful consumption: Consumers must be aware that the latest event reflects the most up-to-date state.
- Handling deletions: Consumers must be prepared to handle records that might be removed from the stream.
- Topic compaction: Kafka topics that store changelog stream often benefit from log compaction, which periodically cleans up the topic to delete previous records with the same key, keeping only the latest version.

By understanding these implications, you can design and implement {{site.data.reuse.ep_name}} flows that use the strengths of each stream type to fit specific use cases effectively.

## Running your flows

In the navigation banner, expand **Run flow** and select either **Events from now** or **Include historical** to run your flow.

**Important:** 

- If your flow has an SQL source node, then your flow results are based on the value of the [scan.startup.mode](https://nightlies.apache.org/flink/flink-docs-master/docs/connectors/table/kafka/#scan-startup-mode){:target="_blank"} property in your Flink SQL code. The **Events from now** or **Include historical** options are ignored.

- If your flow has both event source nodes and SQL source nodes, the results depend on the **Run flow** options for the event source node. The same options for the SQL source node are ignored.