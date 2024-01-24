---
title: "Enrichment node"
excerpt: "Event Processing provides a set of nodes to create event stream processing flows."
categories: nodes
slug: enrichmentnode
toc: true
---

Find out more about the enrichment database node that is available in {{site.data.reuse.ep_name}}.


## Database

In situations where the data in the source table might not offer significant insights on its own, establishing connections with external databases and integrating their data can yield a more comprehensive result.

With the database node, you can retrieve data from external databases (PostgreSQL, MySQL, or Oracle) and integrate the data with the events within your workflow. 

**Note:** {{site.data.reuse.ep_name}} can be configured to connect to a [secure PostgreSQL or MySQL database or Oracle](../../installing/configuring/#configuring-databases-with-ssl-in-event-processing-and-flink). Contact your system administrator if you encounter issues while configuring the database node to communicate with a secure PostgreSQL, MySQL, or an Oracle database.

### Adding a database node

To add a database node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Enrichment**, drag the **Database** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the database node indicating that the node is yet to be configured.

4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure database enrichment** window appears.

### Configuring a database node

To configure a database node, complete the following steps.

1. {{site.data.reuse.node_details}}
1. In the **Connect to database**, enter the URL of the secured database.

   PostgreSQL example:

   ```sql
   jdbc:postgresql://<host>:<port>/<database>?<configuration>
   ```

   MySQL example:

   ```sql
   jdbc:mysql://<host>:<port>/<database>?<configuration>
   ```

   ![Event Processing 1.1.1 icon]({{ 'images' | relative_url }}/1.1.1.svg "In Event Processing 1.1.1 and later.") Oracle example:

   ```sql
   jdbc:oracle:thin:@(DESCRIPTION=(ADDRESS=(PROTOCOL=<protocol>)(PORT=<port>)(HOST=<host>))(CONNECT_DATA=(SERVICE_NAME=<service_name>)))
   ```

   Where:

   - `<host>` is the hostname of the database server.
   - `<port>` is the port number of the database server.
   - `<database>` is the name of the database that contains the table to be used for enrichment.
   - `<configuration>` is the list of configuration parameters for the connection.
   - `<protocol>` is used in order to activate SSL in the JDBC thin client.
   - `<service_name>` is used by the database to register itself with a listener. 
1. Click **Next** to open the **Access Credentials** pane. Enter your username and password (if prompted).
1. Click **Next**. The **Table selection** pane is displayed.
1. To choose a table from the provided database, you can either search for the table name in the search box, or select the radio button corresponding to the table name that you want to process events from.
1. A preview of the schema of the selected table, along with its associated constraints, is displayed in the **Data table preview**. Click **Next**.

   **Note:** In the **Data table preview**, some data types under the **Type** column are listed as **Not supported**. These data types are not supported by {{site.data.reuse.ep_name}} and the corresponding fields cannot be used to enrich events.

   The following data types in the remote database table are supported by {{site.data.reuse.ep_name}}:

   | Data type           | PostgreSQL | MySQL | ![Event Processing 1.1.1 icon]({{ 'images' | relative_url }}/1.1.1.svg "In Event Processing 1.1.1 and later.") Oracle  |
   |---------------------|------------|-------|--------|
   | `BIGINT`            | ✓          | ✓     |        |
   | `BIGSERIAL`         | ✓          |       |        |
   | `BINARY_FLOAT`      |            |       | ✓      |
   | `BINARY_DOUBLE`     |            |       | ✓      |
   | `BLOB`              |            |       | ✓      |
   | `BOOLEAN`           | ✓          | ✓     |        |
   | `BYTES`             |            | ✓     |        |
   | `CHAR`              |            |       | ✓      |
   | `CLOB`              |            |       | ✓      |
   | `CHARACTER`         | ✓          |       |        |
   | `CHARACTER VARYING` | ✓          |       |        |
   | `DATE`              | ✓          | ✓     | ✓      |
   | `DECIMAL`           | ✓          | ✓     |        |
   | `DOUBLE PRECISION`  | ✓          |       | ✓      |
   | `FLOAT`             |            | ✓     | ✓      |
   | `INTEGER`           | ✓          | ✓     |        |
   | `NUMBER`            |            |       | ✓      |
   | `NUMERIC`           | ✓          |       |        |
   | `RAW`               |            |       | ✓      |
   | `REAL`              |            |       | ✓      |
   | `SMALLINT`          | ✓          |       | ✓      |
   | `SMALLSERIAL`       | ✓          |       |        |
   | `SERIAL`            | ✓          |       |        |
   | `STRING`            |            | ✓     |        |
   | `TEXT`              | ✓          |       |        |
   | `TIME`              |            | ✓     |        |
   | `TIMESTAMP`         | ✓          | ✓     | ✓      |
   | `VARCHAR`           | ✓          |       | ✓      |

1. In the **Match Criteria** pane, define your expression by using the property from the source, and the table field.

   For example, the incoming event has a field `country_code` with values such as `866, 453, 123` and you wish to lookup a human readable name from a database table.

   The match criteria is used as the join condition between the event and the database table.

   ```transparent
   event.country_code = database_table.country_code
   ```

   Alternatively, you can use the assistant to create an expression. Select **Assistant** at the right end of the text-box to open the assistant. The assistant offers two separate drop-down lists of properties, for the source table attributes and the database table attributes with constraints, enabling you to construct the expression.
1. After you defined an expression, click **Next** to open the **Enrich Properties** pane. Include or reject the database table fields for further processing.
1. Click **Next** to open the **Output properties** pane, which contains both the input fields from the preceding node, and the previously chosen database table fields. Remove the fields that you do not want to be visible in the output.

   **Note:** To rename properties, hover over a property, and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.
1. Scroll down and click **Configure** to complete the configuration.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the database node if the database node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.

User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.
