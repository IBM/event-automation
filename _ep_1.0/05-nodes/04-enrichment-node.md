---
title: "Enrichment node"
excerpt: "Event Processing provides a set of nodes to create event stream processing flows."
categories: nodes
slug: enrichmentnode
toc: true
---


Find out more about the enrichment database node that is available in {{site.data.reuse.ep_name}}.


## Database

With the database node, you can retrieve data from an external database (PostgreSQL) and integrate the data with the events within your workflow. {{site.data.reuse.ep_name}} offers support for PostgreSQL database connection, ensuring that you can use SSL if needed, for a seamless database integration experience.

### Connect to PostgreSQL database with SSL enabled

PostgreSQL offers a built-in functionality to enhance security by using the Secure Sockets Layer (SSL) connections. Before you configure the database node, enable the SSL mode as follows:

**Note:** You can also configure the database node without enabling the SSL mode.

1. Ensure that PostgreSQL database is installed with the Transport Layer Security (TLS) enabled.
2. Create a Keystore (`.jks`) by using the certificates of PostgreSQL.
3. Add the Keystore into {{site.data.reuse.ep_name}} namespace by creating a secret and introduce the following environment settings:

   ```shell
   JAVA_TOOL_OPTIONS: -Djavax.net.ssl.trustStore="<path_to_truststore>" -Djavax.net.ssl.trustStorePassword="<password>"
   ```

   Where:

    - `<path_to_truststore>` is the path to truststore.
    - `<password>` is a custom password for your truststore.
4. Add the Keystore to {{site.data.reuse.flink_long}} namespace and include the following environment configuration:

   ```shell
   env.java.opts.jobmanager : -Djavax.net.ssl.trustStore="<path_to_truststore>" -Djavax.net.ssl.trustStorePassword="<password>"
   ```

An SSL connection with {{site.data.reuse.flink_long}}, {{site.data.reuse.ep_name}}, and the secured PostgreSQL database is enabled.

### Adding a database node

To add a database node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Enrichment**, drag the **Database** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the database node indicating that the node is yet to be configured.

4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure database enrichment** page appears.

### Configuring a database node

To configure a database node, complete the following steps.

1. {{site.data.reuse.node_details}}
2. In the **Connect to database**, enter the URL of the secured PostgreSQL database.

   For example:

   ```shell
   jdbc:postgresql://host:port/database?ssl=true&sslmode=verify-full&sslfactory=org.postgresql.ssl.DefaultJavaSSLFactory
   ```

   Where:
   
   - `<host>` is the host name of the PostgreSQL server.
   - `<port>` is the port number the server is listening on.
   - `<database>` is the name of the database that you want to enrich.
3. Click **Next** to open the **Access Credentials** section. Enter your username and password to establish a connection with the database.
5. Click **Next**. The **Table selection** page is displayed.
6. To choose a table from the provided database, you can either search for the table name in the search box, or select the radio button corresponding to the table name that you want to process events from.
7. A preview of the schema of the selected table, along with its associated constraints, is displayed under the **Data table preview**. Click **Next**.
8. In the **Match Criteria** section, define your expression by using the property from the source, and the table field.

   For example:

   ```transparent
   source_1.orderId = orders.order_id
   ```

   Alternatively, you can use the assistant to create an expression. Select **Assistant** at the right end of the text-box to open the assistant. The assistant offers two separate drop-down lists of properties, for the source table attributes and the database table attributes with constraints, enabling you to construct the expression.
9. After you defined an expression, click **Next** to open the **Enrich Properties** page. Include or reject the database table fields for further processing.
10. Click **Next** to open the **Output properties** section, which contains both the input fields from the preceding node, and the previously chosen database table fields. Remove the fields that you do not want to be visible in the output.

    **Note:** To rename properties, hover over a property, and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.
11. Scroll down and click **Configure** to complete the configuration.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the database node if the database node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.

![Event Processing 1.0.5 icon]({{ 'images' | relative_url }}/1.0.5.svg "In Event Processing 1.0.5 and later") User actions are saved automatically. Check the navigation banner for save status updates.  

- **Saving** ![Saving]({{ 'images' | relative_url }}/save_inprogress.png "Diagram showing save is in progress."){:height="30px" width="15px"} indicates that saving is in progress.
- **Saved** ![Save successful]({{ 'images' | relative_url }}/save_successful.png "Diagram showing save is successful."){:height="30px" width="15px"} confirms success.
- **Failed** ![Save failed]({{ 'images' | relative_url }}/save_error.png "Diagram showing that the save is failed."){:height="30px" width="15px"} indicates that there are errors. If an action fails to save automatically, you receive a notification to try the save again. Click **Retry** to re-attempt the save. When a valid flow is saved, you can proceed to run the job.


