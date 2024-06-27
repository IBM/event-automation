---
title: "Enrichment nodes"
excerpt: "Event Processing provides a set of nodes to create event stream processing flows."
categories: nodes
slug: enrichmentnode
toc: true
---

The following enrichment nodes are available in {{site.data.reuse.ep_name}}:

- [Database](#enrichment-from-a-database)
- [API](#enrichment-from-an-api)

## Enrichment from a database

In situations where the data in the source table might not offer significant insights on its own, establishing connections with external databases and integrating their data can yield a more comprehensive result.

With the database node, you can retrieve data from external databases (PostgreSQL, MySQL, or Oracle) and integrate the data with the events within your workflow. 

**Note:** {{site.data.reuse.ep_name}} can be configured to connect to a [secure PostgreSQL or MySQL database or Oracle](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry). Contact your system administrator if you encounter issues while configuring the database node to communicate with a secure PostgreSQL, MySQL, or an Oracle database.

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

   **Important:** {{site.data.reuse.ep_name}} supports:
   - Lowercase names for tables and columns in PostgreSQL databases
   - Uppercase names for tables and columns in Oracle databases

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

   **Note:** Ensure the expressions contain an equality condition.
   Alternatively, you can use the assistant to create an expression. Select **Assistant** at the right end of the text-box to open the assistant. The assistant offers two separate drop-down lists of properties, for the source table attributes and the database table attributes with constraints, enabling you to construct the expression.
1. After you defined an expression, click **Next** to open the **Enrich Properties** pane. Include or reject the database table fields for further processing.
1. Click **Next** to open the **Output properties** pane, which contains both the input fields from the preceding node, and the previously chosen database table fields. Remove the fields that you do not want to be visible in the output.

   **Note:** To rename properties, hover over a property, and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.
1. Scroll down and click **Configure** to complete the configuration.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the database node if the database node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.

User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.


## Enrichment from an API

![Event Processing 1.1.7 icon]({{ 'images' | relative_url }}/1.1.7.svg "In Event Processing 1.1.7 and later.") In situations where the data in the source table might not offer significant insights on its own, making calls to external APIs and integrating data from the API responses can yield a more comprehensive result.

### Prerequisites and limitations

To configure the API node, ensure you upload an OpenAPI document that meets the following requirements:

 - OpenAPI specification 3.0 or 3.1 is required.
 - At least one [URL](https://swagger.io/docs/specification/api-host-and-base-path/){:target="_blank"} with the `http` or `https` protocol is required. Relative URLs or URLs with variables are not supported. For URLs that use the `https` protocol, ensure you [configure](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry) Flink and {{site.data.reuse.ep_name}} to enable SSL connections.
 - At least one `GET` or `POST` [operation](https://swagger.io/docs/specification/paths-and-operations/){:target="_blank"} is required with the following requirements:
    - The operation uses one of the following [security methods](https://swagger.io/docs/specification/authentication/){:target="_blank"}: basic authentication, API keys (in the header or query parameter), or no authentication (None).
    - Uses the [media types](https://swagger.io/docs/specification/media-types/){:target="_blank"} `application` or `JSON` for the response (`GET` and `POST`) and the request body (`POST`).
    - Does not have required parameters of type `array`. 
    - For [parameter serialization](https://swagger.io/docs/specification/serialization/){:target="_blank"} of query parameters, the `style` attribute is either set to the `form` style, or no `style` attribute is specified, and for path parameters, the `style` attribute is either set to the `simple` style, or no `style` attribute is specified.

The API enrichment in {{site.data.reuse.ep_name}} has the following limitations:

- Only `GET` and `POST` operations are supported for API enrichment.
- Only the supported API parameters are available to configure the API node.
- A single API node can only support one API operation. Chain multiple API nodes together to support multiple API operations.
- If an API fails to respond or returns a status code other than the 200-299 success code, the Flink job does not fail, but no output events are generated.
- The response schema with the lowest success code is used. The operation must define a status code in the range of 200-299 or use the 2xx status code. The API node uses the 2xx code if no numeric success code is defined.
- The impact on processing performance depends on the response time of the API server, network latency, and the size of payloads.
- The configured authentication credentials cannot be verified at flow authoring time. If the credentials need to be corrected or renewed for a running flow, stop the flow and reconfigure the node.
- [Multiple security schemes](https://swagger.io/docs/specification/authentication/#multiple){:target="_blank"} cannot be combined with `AND` logic for the same API operation. Only `OR` logic is supported, for example, **Basic** or **API key** authentication.
- A header parameter’s value can be set as a literal, but not by an input event property.
- String literal values cannot contain single or double quotation marks (`'`, `"`). However, such values can be conveyed in input event properties. You can define string literals with quotation marks in a transform node that precedes the API enrichment node.
- The value of API parameters of type `string` cannot contain backslash characters (`\`) when specifying the value as a literal value or mapping it to an event property.
- OpenAPI can define [minimum and maximum](https://swagger.io/docs/specification/data-models/data-types/#range){:target="_blank"} values for numeric parameters and [`pattern`](https://swagger.io/docs/specification/data-models/data-types/#pattern){:target="_blank"} for string parameters, but the API node does not enforce them. An API returns a response other than a success code (2xx) if the parameter values are not compliant. In such cases, the processing job does not fail, but no output event is generated.
- For API parameters where the schema defines the type by using `oneOf`, only the first type is used.
- The optional `format` attribute provided by the OpenAPI for [API parameter types](https://swagger.io/docs/specification/data-models/data-types/){:target="_blank"} are treated as follows:
   - For filtering matching types of event properties, and validating the configured literal values, `date` and `date-time` formats are used for `string` type, `float` and `double` formats for `number` type, and `int32` and `int64` formats for `integer` type.
   - Parameters of type `string` are excluded if their `format` is `binary`.
   - Other values of the `format` field are not used by the API node, including custom formats. When such values are present, parameters of type `number` are treated as `double`, and parameters of type `integer` are treated as `int64`. 
   - Custom formats cannot be treated specifically, as their semantics are not specified in OpenAPI. Check the API documentation you use to ensure that the event property or the literal value that feeds the API parameter contains the appropriate values.
- The parameter names and fields in the nested request body and response payloads do not support the slash (`/`) character.

### Adding an API node

To add an API node, complete the following steps:

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Enrichment**, drag the **API** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the API node indicating that the node is yet to be configured.
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node. The **Enrichment from API** window appears.

### Configuring an API node

To configure an API node, complete the following steps:

1. {{site.data.reuse.node_details}}
1. Click **Next**. The **API definition** pane is displayed.
1. To upload an OpenAPI document, drag a file or click **Drag and drop a file here or click to upload** and select the file that you want to upload.

   **Note:** Ensure your OpenAPI document meets the [required conditions](#prerequisites-and-limitations).

1. From the **GET or POST operation to enrich from** drop-down, select an operation.
1. Click **Next**. The **API access** pane is displayed.
1. From the **API URL** drop-down, select an API URL.

   **Note:** Using URLs with the `https` protocol requires [configuring](../../installing/configuring#configuring-ssl-for-api-server-database-and-schema-registry) Flink and {{site.data.reuse.ep_name}} to enable SSL connections.

1. From the **Authentication method** drop-down, select an authentication method. 

   **Note:** {{site.data.reuse.ep_name}} supports **Basic**, **API Key**, and **None** (no authentication) authentication methods. The options available in the drop-down list depend on the security methods defined in the OpenAPI document for the selected operation.

1. Depending on the authentication method selected, enter your user name and password, or API key, and click **Next**. The **Input mapping** pane is displayed.

   **Note:** Authentication credentials are only required for the **API key** and **Basic** authentication methods. Contact the API owner for access credentials.

1. To configure the **Required Inputs**, select an event property or enter a constant value. You can also select and configure input parameters from the **Optional Inputs** list.

   **Important:** Ensure that all the parameters in the **Required Inputs** are configured.

   **Notes:**
   - The dropdown for selecting event properties automatically filters properties for an SQL type that is compatible with the API parameter type.
   - The value provided for the API parameters must be compliant with the documented API constraints, including minimum and maximum values, format, or enumerated values.

1. Click **Next**. The **Output properties** pane is displayed, which contains properties from the preceding node and the API response. Remove the fields that you do not want to include in the output.

   **Note:** To rename properties, hover over a property, and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.

1. Click **Configure** to complete the configuration.
