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
- [watsonx.ai](#watsonx-node)

## Enrichment from a database
{: #enrichment-from-a-database}

In situations where the data in the source table might not offer significant insights on its own, establishing connections with external databases and integrating their data can yield a more comprehensive result.

With the database node, you can retrieve data from external databases (PostgreSQL, MySQL, or Oracle) and integrate the data with the events within your workflow. 

**Note:** {{site.data.reuse.ep_name}} can be configured to connect to a [secure PostgreSQL or MySQL database or Oracle](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry). Contact your system administrator if you encounter issues while configuring the database node to communicate with a secure PostgreSQL, MySQL, or an Oracle database.

### Adding a database node
{: #adding-a-database-node}

To add a database node, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Enrichment**, drag the **Database** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the database node indicating that the node is yet to be configured.

4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure database enrichment** window appears.

### Configuring a database node
{: #configuring-a-database-node}

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

   Oracle example:

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

   | Data type           | PostgreSQL | MySQL | Oracle  |
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

1. ![Event Processing 1.4.7 icon]({{ 'images' | relative_url }}/1.4.7.svg "In Event Processing 1.4.7 and later.") Optional: In the **Cache configuration** pane, you can configure caching to minimize database queries by storing and reusing previously fetched data. This is particularly beneficial when processing high-volume event streams or when the database data does not change frequently.

   **Important:** Caching large volumes of messages consume additional memory resources. Ensure that you have sufficient memory resources to store the cached data.

   Use the **Caching** toggle to enable or disable caching:
   
   - Set the toggle to **Enabled** to activate caching and configure the cache parameters.
   - Set the toggle to **Disabled** to query the database for each incoming event without caching.

   When caching is enabled, provide values for the following parameters:

   - **Cache expiration**: Determines how long query results remain valid in the cache before they expire. Enter a value and choose a time unit (seconds, minutes, hours or days) from the drop-down menu. The appropriate duration depends on how often the database data is updated.

   - **Cache quantity**: Sets the maximum number of unique database query results to retain in memory. Enter a value representing the cache size. 

   **Note:** Both the cache expiration and cache quantity values must be greater than zero. Larger values allow more responses to be cached but consume additional memory resources. Set both the values based on the variety of unique query lookups expected and the memory capacity available in your environment.

   After configuring the cache settings, click **Next**. The **Match criteria** pane is displayed.

1. In the **Match criteria** pane, define your expression by using the property from the source, and the table field.

   For example, the incoming event has a field `country_code` with values such as `866, 453, 123` and you wish to lookup a human readable name from a database table.

   The match criteria is used as the join condition between the event and the database table.

   ```transparent
   event.country_code = database_table.country_code
   ```

   **Note:** Ensure the expressions contain an equality condition.
   Alternatively, you can use the assistant to create an expression. Select **Assistant** at the right end of the text-box to open the assistant. The assistant offers two separate drop-down lists of properties, for the source table attributes and the database table attributes with constraints, enabling you to construct the expression.

   {{site.data.reuse.ep_treeview_note}}

1. After you defined an expression, click **Next** to open the **Enrich Properties** pane. Include or reject the database table fields for further processing.
1. Click **Next** to open the **Output properties** pane, which contains both the input fields from the preceding node, and the previously chosen database table fields. Remove the fields that you do not want to be visible in the output.

   **Note:** To rename properties, hover over a property, and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.
1. Scroll down and click **Configure** to complete the configuration.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Icon showing a green checkbox."){:height="30px" width="15px"} appears on the database node if the database node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Icon showing a red checkbox."){:height="30px" width="15px"} appears.

User actions are [saved](../../getting-started/canvas/#save) automatically. For save status updates, see the canvas header.


## Enrichment from an API
{: #enrichment-from-an-api}

In situations where the data in the source table might not offer significant insights on its own, making calls to external APIs and integrating data from the API responses can yield a more comprehensive result.

### Prerequisites and limitations
{: #prerequisites-and-limitations}

To configure the API node, ensure you upload an OpenAPI document that meets the following requirements:

 - OpenAPI specification 3.0 or 3.1 is required.
 - At least one [server URL](https://swagger.io/docs/specification/api-host-and-base-path/){:target="_blank"} with the `http` or `https` protocol is required. Relative URLs or server templating are not supported. For URLs that use the `https` protocol, ensure you [configure](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry) Flink and {{site.data.reuse.ep_name}} to enable SSL connections.
 - At least one `GET` or `POST` [operation](https://swagger.io/docs/specification/paths-and-operations/){:target="_blank"} is required with the following requirements:
    - The operation uses one of the following [security methods](https://swagger.io/docs/specification/authentication/){:target="_blank"}: basic authentication, API keys (in the header or query parameter), or no authentication (None).
    - Has the [media type](https://swagger.io/docs/specification/media-types/){:target="_blank"} `application/json` for the response (`GET` and `POST`) and the request body (`POST`).
    - Body parameters and API responses of type `array` with primitive types (`string`, `number`, `integer`, and `boolean`) and complex types (`array`, `object`) are supported.
    

    - Required query parameters of type `array` are not supported. However, the operation can still define optional query parameters of type `array`, but these parameters are not made available for configuring the API node.
    - Defines at least one [parameter](https://swagger.io/docs/specification/describing-parameters/){:target="_blank"} of the kind `query` or `path`, or has at least one non-array property defined in the schema of the [request body](https://swagger.io/docs/specification/describing-request-body/){:target="_blank"}.
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
- A header parameter’s value can be set as a constant, but not by an input event property.
- At least one API parameter, which is not a header parameter must be mapped to an event property or constant value in the **Input mapping** pane of the API node.
- String constant values cannot contain single or double quotation marks (`'`, `"`). However, such values can be conveyed in input event properties. You can define string constants with quotation marks in a transform node that precedes the API enrichment node.
- The value of API parameters of type `string` cannot contain backslash characters (`\`) when specifying the value as a constant value or mapping it to an event property.
- OpenAPI can define [minimum and maximum](https://swagger.io/docs/specification/data-models/data-types/#range){:target="_blank"} values for numeric parameters and [pattern](https://swagger.io/docs/specification/data-models/data-types/#pattern){:target="_blank"} for string parameters, but the API node does not enforce them. An API returns a response other than a success code (2xx) if the parameter values are not compliant. In such cases, the processing job does not fail, but no output event is generated.
- For API parameters where the schema defines the type by using `oneOf`, only the first type is used.
- The optional `format` attribute provided by the OpenAPI for [API parameter types](https://swagger.io/docs/specification/data-models/data-types/){:target="_blank"} are treated as follows:
   - For filtering matching types of event properties, and validating the configured constant values, `date` and `date-time` formats are used for `string` type, `float` and `double` formats for `number` type, and `int32` and `int64` formats for `integer` type.
   - Parameters of type `string` are excluded if their `format` is `binary`.
   - Other values of the `format` field are not used by the API node, including custom formats. When such values are present, parameters of type `number` are treated as `double`, and parameters of type `integer` are treated as `int64`. 
   - Custom formats cannot be treated specifically, as their semantics are not specified in OpenAPI. Check the API documentation you use to ensure that the event property or the constant value that feeds the API parameter contains the appropriate values.
- The parameter names and fields in the nested request body and response payloads do not support the slash (`/`) character.

### Adding an API node
{: #adding-an-api-node}

To add an API node, complete the following steps:

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Enrichment**, drag the **API** node into the canvas.
3. {{site.data.reuse.node_connect}} A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the API node indicating that the node is yet to be configured.
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node. The **Enrichment from API** window appears.

### Configuring an API node
{: #configuring-an-api-node}

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

1. Depending on the authentication method selected, enter your user name and password, or API key, and click **Next**. The **Cache configuration** pane is displayed.

   **Note:** Authentication credentials are only required for the **API key** and **Basic** authentication methods. Contact the API owner for access credentials.

   {{site.data.reuse.ep_treeview_note}}

1. ![Event Processing 1.4.7 icon]({{ 'images' | relative_url }}/1.4.7.svg "In Event Processing 1.4.7 and later.") Optional: In the **Cache configuration** pane, you can configure caching to minimize API calls by storing and reusing previously fetched data. This is particularly beneficial when processing high-volume event streams or when the external API data does not change frequently.

   **Important:** Caching large volumes of messages consume additional memory resources. Ensure that you have sufficient memory resources to store the cached data.

   Use the **Caching** toggle to enable or disable caching:
   
   - Set the toggle to **Enabled** to activate caching and configure the cache parameters.
   - Set the toggle to **Disabled** to query the API for each incoming event without caching.

   When caching is enabled, provide values for the following parameters:

   - **Cache expiration**: Determines how long API responses remain valid in the cache before they expire. Enter a value and choose a time unit (seconds, minutes, hours or days) from the drop-down menu. The appropriate duration depends on how often the API data is updated.

     For instance, if your API refreshes its data every 10 minutes, you might configure a 10-minute expiration to balance freshness with reduced API load.

   - **Cache quantity**: Sets the maximum number of unique API responses to retain in memory. Enter a value representing the cache size. 

   **Note:** Both the cache expiration and cache quantity values must be greater than zero. Larger values allow more responses to be cached but consume additional memory resources. Set both the values based on the variety of unique API lookups expected and the memory capacity available in your environment.

   After configuring the cache settings, click **Next**. The **Input mapping** pane is displayed.

1. To configure the **Required inputs**, select an event property or enter a constant value. You can also select and configure input parameters from the **Optional inputs** list.

   ![Event Processing 1.4.6 icon]({{ 'images' | relative_url }}/1.4.6.svg "In Event Processing 1.4.6 and later.") You can set the **Include unenriched events** toggle to **On** or **Off**. When turned on, events without matching API results are included in the output with `null` values for the API response properties. In {{site.data.reuse.ep_name}} 1.4.7 and later, the toggle is moved to the **Unenriched events** pane.

   **Important:** Ensure that all the parameters in the **Required inputs** are configured.

   **Notes:**
   - The dropdown for selecting event properties automatically filters properties for an SQL type that is compatible with the API parameter type.
   - The value provided for the API parameters must be compliant with the documented API constraints, including minimum and maximum values, format, or enumerated values.

   Then click **Next**.

1. ![Event Processing 1.4.7 icon]({{ 'images' | relative_url }}/1.4.7.svg "In Event Processing 1.4.7 and later.") In the **Unenriched events** pane, you can configure how to handle unenriched results when the API call does not return a match for the input event.

   By default, the **Include unenriched events** toggle is set to **On**.

   When turned on, events without matching API results are included in the output with `null` values for the API response properties. To exclude events that do not have matching API results from the output, set the toggle to **Off**.

   When the **Include unenriched events** toggle is set to **On**, you can also select up to three metadata fields - response_metadata_https_status_code, response_metadata_http_completion_state, and response_metadata_error_message to identify why the API enrichment failed.

1. Click **Next**. The **Output properties** pane is displayed, which contains properties from the preceding node and the API response. Remove the fields that you do not want to include in the output.

   **Note:** To rename properties, hover over a property, and click the **Edit** icon ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.

1. Click **Configure** to complete the configuration.

## Enrichment from watsonx.ai text generation services
{: #watsonx-node}

In situations where the data in the source table might not offer significant insights on its own, you can use the watsonx.ai node to enrich the events by generating AI-powered responses by using foundation models. It enables dynamic calls to IBM watsonx.ai APIs as part of the event flow, bringing contextual, language-based intelligence into your processing. Currently, the watsonx.ai node supports only watsonx.ai on IBM Cloud and is limited to text generation services.

With the watsonx.ai node, you can perform text generation services such as:

- Summarize unstructured text data for easier analysis.
- Generate personalized responses in real-time for customer interactions.
- Extract key insights or categorize events based on their content.
- Perform sentiment analysis to determine the emotional tone of text data.

**Note:** {{site.data.reuse.ep_name}} can be configured to connect to [watsonx platform](../../installing/configuring#configuring-ssl-for-api-server-database-and-schema-registry). Contact your system administrator if you encounter issues while configuring the watsonx.ai node to communicate with watsonx services.

### Prerequisites
{: #prerequisites}

- Ensure that you have a watsonx.ai [account](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/signup-wx.html?context=wx&locale=en&audience=wdp){:target="_blank"} and complete the following steps.

  1. [Create](https://www.ibm.com/docs/en/watsonx/saas?topic=prompts-prompt-lab){:target="_blank"} a prompt in the Prompt Lab in watsonx.ai.

     **Tip:** A prompt is an input that guides AI models to generate responses. For tips on crafting effective prompts, see [prompt tips](https://www.ibm.com/docs/en/watsonx/saas?topic=prompts-prompt-tips){:target="_blank"}.

  1. [Configure](https://www.ibm.com/docs/en/watsonx/saas?topic=lab-building-reusable-prompts#creating-prompt-variables){:target="_blank"} prompt variables, select the model and modify model parameters as needed within Prompt Lab.

     **Note:** At least one prompt variable must be configured.
  1. [Save](https://www.ibm.com/docs/en/watsonx/saas?topic=lab-saving-prompts){:target="_blank"} your prompt as a prompt template.
  1. [Deploy](https://www.ibm.com/docs/en/watsonx/saas?topic=assets-deploying-prompt-template){:target="_blank"} the prompt template to a [deployment space](https://www.ibm.com/docs/en/watsonx/saas?topic=assets-managing-deployment-spaces){:target="_blank"}.
  1. After your prompt template is successfully deployed, open the deployed prompt and copy the URL in the **Text endpoint URL** field from the **Public endpoint** section. The text endpoint URL is required later when configuring the watsonx.ai node.

     The watsonx.ai node supports text endpoint URLs with a serving name or a deployment ID.

 
     **Note:** Deployment spaces might incur charges depending on your watsonx.ai runtime plan. For more information, see the [IBM documentation](https://www.ibm.com/docs/en/watsonx/saas?topic=runtime-watsonxai-plans){:target="_blank"}.

- Ensure that you have an API key for your IBM Cloud account. You can create an API key by completing the following steps:

  1. In your IBM Cloud account, go to the [API keys](https://cloud.ibm.com/iam/apikeys){:target="_blank"} page and click **Create**.

  1. Enter a name for the API key and an optional description, then click **Create** again.

  1. Copy the API key that you created as the key is required later when configuring the watsonx.ai node.

  Alternatively, you can create API key for a service ID by following the instructions in the [IBM Cloud documentation](https://cloud.ibm.com/docs/account?topic=account-serviceidapikeys&interface=ui#create_service_key){:target="_blank"}.


### Adding a watsonx.ai node
{: #adding-a-watsonxai-node}

To add a watsonx.ai node, complete the following steps:

1. {{site.data.reuse.node_step1}}
1. In the **Palette**, under **Enrichment**, drag the **watsonx.ai** node into the canvas.
1. Connect the node to an event source by dragging the **Output port** from a source node into the **Input port** of this node. A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the node indicating that the node is yet to be configured.
1. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure watsonx.ai** window appears.

### Configuring a watsonx.ai node
{: #configuring-a-watsonxai-node}

To configure a watsonx.ai node, complete the following steps:

1. In the **Details** section, enter a name for your node. The output stream of events from this node will be referred with the name you entered.
  
   Click **Next**. The **watsonx.ai access** pane is displayed.

1. Provide the API key you created and the public text endpoint URL of your watsonx.ai deployment.

   Click **Next**. The **Map prompt variables** pane is displayed.

1. You can view the prompt that you created in the watsonx.ai platform. In the **Variable mapping** section, configure the prompt variables by mapping them to input event properties or assigning constant values, and click **Next**.

1. In the **Response properties** pane, properties returned from watsonx.ai text generation services are displayed. Add or remove the fields properties that you do not want to include further.

   **Note:** Properties providing watsonx.ai generated values are marked with an AI tag and ensure not to remove those properties. To rename properties, hover over a property, and click the ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** icon.

1. Click **Next**. The **Output properties** pane is displayed, which contains properties from the preceding node and the watsonx.ai properties that you selected in the previous step. Remove the fields that you do not want to include in the output.

   **Note:** To rename properties, hover over a property, and click the ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** icon.

Click **Configure** to complete the configuration.