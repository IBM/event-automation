---
title: "Migrating the Kafka Bridge and REST producer to Confluent REST Proxy"
excerpt: "Learn how to migrate from the Event Streams Kafka Bridge and REST producer to the Confluent REST Proxy."
categories: migration
slug: migrating-to-rest-proxy
toc: true
---

The Confluent REST Proxy replaces both the {{site.data.reuse.es_name}} Kafka Bridge and the REST producer. To complete this migration, deploy the Confluent REST Proxy, recreate your client credentials, and update your client applications to use the new endpoint and API. There is no data to migrate.

To migrate from the {{site.data.reuse.es_name}} Kafka Bridge or REST producer to the Confluent REST Proxy, complete the following steps:

1. [Deploy the REST Proxy and update credentials](#deploying-the-rest-proxy-and-updating-credentials)
2. [Migrate Kafka Bridge applications](#migrating-kafka-bridge-applications)
3. [Migrate REST producer applications](#migrating-rest-producer-applications)
4. [Verify your setup](#verifying-your-setup)

## Background
{: #background}

{{site.data.reuse.es_name}} provides two HTTP-based interfaces to connect to Kafka:

- **Kafka Bridge**: An interface that translates HTTP requests to Kafka operations, supporting producing and consuming messages, topic and partition metadata, and consumer group management.
- **REST producer**: A lightweight, produce-only interface for applications that only need to publish messages.

When migrating to Confluent for Kubernetes, the Confluent REST Proxy replaces both the Kafka Bridge and the REST producer with an equivalent HTTP interface to Kafka, which means that existing REST-based integrations can continue with minimal changes.

**Note:** The {{site.data.reuse.es_name}} REST producer only produces messages. The Confluent REST Proxy also supports consuming messages and administrative operations, so there is no loss of capability.

## Deploying the REST Proxy and updating credentials
{: #deploying-the-rest-proxy-and-updating-credentials}

Before migrating your applications, deploy the Confluent REST Proxy and ensure that your clients can authenticate and reach the new endpoint:


1. Deploy the REST Proxy by creating a `KafkaRestProxy` custom resource configured with your selected authentication mechanism over TLS. For configuration details, see the [Confluent REST Proxy documentation](https://docs.confluent.io/operator/current/co-configure-rest-proxy.html){:target="_blank"}.
2. Configure client authentication on the REST Proxy. Switch to a supported authentication mechanism such as HTTP Basic authentication, OAuth/OIDC, or mTLS. Create a Kubernetes secret containing the credentials and reference it in the `KafkaRestProxy` custom resource. For the full list of supported mechanisms, see the [Confluent REST Proxy security documentation](https://docs.confluent.io/platform/current/kafka-rest/production-deployment/rest-proxy/security.html#crest-authentication){:target="_blank"}.

3. Update the base URL, protocol, and credentials in every client application. Every client must update the following, regardless of whether it uses the Kafka Bridge or the REST producer:

   | What changes | Currently in Event Streams | Replace with |
   |---|---|---|
   | **Host and port** | `http://<bridge-or-rest-producer-svc>:<port>` | `http(s)://<kafka-rest-proxy-svc>:<port>` |
   | **Protocol** | HTTP | HTTP or HTTPS, depending on your `KafkaRestProxy` deployment |
   | **Credentials (Kafka Bridge clients)** | Kafka Bridge does not authenticate client requests. | Configure credentials matching the authentication mechanism on the REST Proxy. For more information, see [deploying the REST Proxy and updating credentials](#deploying-the-rest-proxy-and-updating-credentials). |
   | **Credentials (REST producer clients)** | SCRAM-SHA-512 (HTTP Basic) or mTLS | Credentials matching the authentication mechanism configured on the REST Proxy. For more information, see [deploying the REST Proxy and updating credentials](#deploying-the-rest-proxy-and-updating-credentials). |

   **Important:** Confirm the protocol (HTTP or HTTPS), hostname, and port before updating your clients, as the values depend on how the `KafkaRestProxy` custom resource was deployed.

## Migrating Kafka Bridge applications
{: #migrating-kafka-bridge-applications}

If your application uses the {{site.data.reuse.es_name}} Kafka Bridge, most v2 API endpoints carry over unchanged. Review the following compatibility table to identify which endpoints require changes, then make the updates described in the following sections.

### API compatibility overview
{: #api-compatibility-overview}

The following table summarizes the compatibility of each Kafka Bridge endpoint with the Confluent REST Proxy v2 API:

| API | Path | Compatibility |
|---|---|---|
| List topics | `GET /topics` | Identical |
| List partitions | `GET /topics/{name}/partitions` | Identical |
| Single partition | `GET /topics/{name}/partitions/{id}` | Identical |
| Offsets | `GET /topics/{name}/partitions/{id}/offsets` | Identical |
| Consumer create | `POST /consumers/{group}` | Identical |
| Consumer subscribe | `POST /consumers/{group}/instances/{instance}/subscription` | Identical |
| Consumer delete | `DELETE /consumers/{group}/instances/{instance}` | Identical |
| Assign partitions | `POST /consumers/{group}/instances/{instance}/assignments` | Identical |
| Seek to offset | `POST /consumers/{group}/instances/{instance}/positions` | Identical |
| Seek to beginning | `POST /consumers/{group}/instances/{instance}/positions/beginning` | Identical |
| Seek to end | `POST /consumers/{group}/instances/{instance}/positions/end` | Identical |
| Topic metadata | `GET /topics/{name}` | Additive. Confluent adds `confluent.*` config keys. No client changes needed. |
| Produce | `POST /topics/{name}` | Additive. Confluent adds optional `error_code`, `key_schema_id`, `value_schema_id` fields |
| Produce to partition | `POST /topics/{name}/partitions/{id}` | Additive. Confluent adds the same optional `error_code`, `key_schema_id`, `value_schema_id` fields |
| Health / root | `GET /`, `GET /healthy`, `GET /ready` | Use `GET /v3/clusters` instead |
| OpenAPI spec | `GET /openapi` | No equivalent. Endpoint returns `HTTP 404` |
| Get subscription | `GET /consumers/{group}/instances/{instance}/subscription` | `partitions` field absent in Confluent response |
| Poll records | `GET /consumers/{group}/instances/{instance}/records` | `timestamp` field absent per record |
| Commit offsets | `POST /consumers/{group}/instances/{instance}/offsets` | HTTP `204` (no body) becomes HTTP `200` with body `[]` |

Endpoints marked as **Additive** have extra fields in the Confluent response that are not present in the Kafka Bridge response. If your client validates the response structure strictly, update it to allow additional fields. 

For the remaining endpoints, make the updates described in the following sections:

### Updating health check endpoints
{: #updating-health-check-endpoints}

The Confluent REST Proxy does not expose the Kafka Bridge health check paths. Update the health check endpoints in your application or deployment configuration as follows:

| Kafka Bridge endpoint | Replace with |
|---|---|
| `GET /` | `GET /v3/clusters` |
| `GET /healthy` | `GET /v3/clusters` |
| `GET /ready` | `GET /v3/clusters` |
| `GET /openapi` | No equivalent. Use the [Confluent REST Proxy API reference](https://docs.confluent.io/platform/current/kafka-rest/api.html) instead |

A `200` response from `GET /v3/clusters` confirms that the proxy is reachable and connected to Kafka. Check the status code only. Do not rely on the response body content.

### Handling the missing `partitions` field in subscription responses
{: #breaking-change-subscription-partitions}

The Kafka Bridge returns both the subscribed topics and the assigned partitions in the `GET /subscription` response. The Confluent REST Proxy returns only the subscribed topic names. If your application reads `response.partitions`, update it to handle a missing field. The value will be `undefined` or `null`.

For example, the following response is returned by the Kafka Bridge:

```shell
GET /consumers/my-group/instances/my-instance/subscription
→ HTTP 200
{
  "topics": [
    "orders"
  ],
  "partitions": [
    {
      "orders": [
        0,
        1,
        2
      ]
    }
  ]
}
```

The Confluent REST Proxy returns the following response for the same request:

```shell
GET /consumers/my-group/instances/my-instance/subscription
→ HTTP 200
{
  "topics": [
    "orders"
  ]
}
```

### Handling the missing `timestamp` field in poll responses
{: #breaking-change-records-timestamp}

The Kafka Bridge appends a `timestamp` (in epoch milliseconds) to every record in the poll response. The Confluent REST Proxy v2 does not include this field. If your application reads `record.timestamp`, update it to handle a missing field. The value will be `undefined` or `null`.

For example, the following response is returned by the Kafka Bridge:

```shell
GET /consumers/my-group/instances/my-instance/records
→ HTTP 200
[{"topic": "orders", "key": null, "value": {"orderId": 1001},
  "partition": 0, "offset": 42, "timestamp": 1700000000000}]
```

The Confluent REST Proxy returns the following response for the same request:

```shell
GET /consumers/my-group/instances/my-instance/records
→ HTTP 200
[{"topic": "orders", "key": null, "value": {"orderId": 1001},
  "partition": 0, "offset": 42}]
```

### Handling the changed HTTP status code for offset commits
{: #breaking-change-commit-offsets-status}

The Kafka Bridge returns `HTTP 204 No Content` with an empty body on a successful commit. The Confluent REST Proxy returns `HTTP 200 OK` with an empty JSON array body `[]`. If your client checks for exactly `204`, update it to accept `200` as a successful response.

For example, the Kafka Bridge returns the following response on a successful commit:

```shell
POST /consumers/my-group/instances/my-instance/offsets
→ HTTP 204 No Content  (empty body)
```

The Confluent REST Proxy returns the following response for the same request:

```shell
POST /consumers/my-group/instances/my-instance/offsets
→ HTTP 200 OK
[]
```

**Important:** The `[]` body is not formally specified and might change in a future release. Check the HTTP status code only. Any `HTTP 200` response indicates a successful commit.

## Migrating REST producer applications
{: #migrating-rest-producer-applications}

The {{site.data.reuse.es_name}} REST producer is a produce-only interface that uses `POST /topics/{topic}/records`. Unlike Kafka Bridge applications, REST producer applications must update the request path, body structure, and `Content-Type` header. 

Review the following table for a full summary of changes, then apply the updates to your application:

### Required API changes
{: #required-api-changes}

| Area | Currently in Event Streams | Replace with | Action required |
|---|---|---|---|
| **Produce path** | `POST /topics/{topic}/records` | `POST /topics/{topic}` | Drop `/records` from the path. |
| **Request body** | `{"orderId": 1001, ...}` (flat JSON) | `{"records":[{"value":{...}}]}` | Wrap in a `records` array. |
| **Content-Type (JSON payload)** | `application/json` | `application/vnd.kafka.json.v2+json` | Update the header. |
| **Content-Type (binary or text payload)** | `application/octet-stream`<br/>`text/plain`<br/>`text/xml`<br/>`application/xml` | `application/vnd.kafka.binary.v2+json`. Set the value as a Base64-encoded string in the request body. | Update the header and encode the value as a Base64-encoded string. |
| **Content-Type (schema-based)** | `application/octet-stream` (Avro binary) or `application/json` (Avro JSON), set by the producer to match the encoding | `application/vnd.kafka.avro.v2+json` <br/>`application/vnd.kafka.jsonschema.v2+json` <br/> `application/vnd.kafka.protobuf.v2+json` | Use the header that matches your schema format. |
| **Authentication** | SCRAM-SHA-512 through HTTP Basic authentication | A supported authentication mechanism configured on the REST Proxy (HTTP Basic, OAuth/OIDC, or mTLS). SCRAM-SHA-512 is not supported. Recreate credentials for the REST Proxy. | SCRAM-SHA-512 is not supported. Configure new credentials on the REST Proxy by using a supported mechanism. For more information, see [deploying the REST Proxy and updating credentials](#deploying-the-rest-proxy-and-updating-credentials). |
| **Schema selection** | `?schemaname=&schemaversion=` query parameters. Triggers a lookup that validates the schema exists and sets the correct message headers if valid. | `value_schema_id` (pre-registered) or `value_schema` (inline) in the request body | Update if you are using schemas. For more information, see [schema-based production](#rest-producer-schema-based). |
| **Schema validation** | No data validation. The lookup does not check whether the message matches the schema. The producer must encode the message correctly in Avro binary or Avro JSON format. Non-conforming messages cannot be deserialized by consumers. | Validates the payload against the schema and re-serializes it before writing to Kafka. | No action required. Validation and serialization are handled automatically by the REST Proxy. |

For example, the following request is sent by the Event Streams REST producer:

```shell
POST /topics/orders/records
Content-Type: application/json

{"orderId": 1001, "item": "widget"}
```

The equivalent request for the Confluent REST Proxy is:

```shell
POST /topics/orders
Content-Type: application/vnd.kafka.json.v2+json

{"records": [{"value": {"orderId": 1001, "item": "widget"}}]}
```

You must update the path, body structure, and `Content-Type` header. SCRAM-SHA-512 is not supported by the Confluent REST Proxy. Recreate and configure your credentials on the REST Proxy by using a supported authentication mechanism as described in [deploying the REST Proxy and updating credentials](#deploying-the-rest-proxy-and-updating-credentials).

If you are producing multiple records in a single request or by using schemas, review the following sections:

### Producing multiple records in a single request
{: #rest-producer-multiple-records}

The Confluent REST Proxy accepts multiple records in a single request. To produce multiple records, include them all in the `records` array. For example:

```shell
POST /topics/orders
Content-Type: application/vnd.kafka.json.v2+json

{
  "records": [
    {"key": "key-1", "value": {"orderId": 1001}},
    {"key": "key-2", "value": {"orderId": 1002}}
  ]
}
```

### Producing messages with a schema
{: #rest-producer-schema-based}

If your {{site.data.reuse.es_name}} REST producer used the `schemaname` and `schemaversion` query parameters, you must switch to referencing schemas by their Schema Registry ID. The `schemaname`, `schemaversion`, and `schemavalidation` query parameters are not supported by the Confluent REST Proxy.

Confluent REST Proxy integrates with Schema Registry and supports three schema formats: **Avro** (`avro`), **JSON Schema** (`jsonschema`), and **Protobuf** (`protobuf`). Specify the schema format in the `Content-Type` header to determine how the REST Proxy serializes the message before writing it to Kafka.

| Embedded format | Content-Type header value |
|---|---|
| Avro | `application/vnd.kafka.avro.v2+json` |
| JSON Schema | `application/vnd.kafka.jsonschema.v2+json` |
| Protobuf | `application/vnd.kafka.protobuf.v2+json` |

The REST Proxy must be configured with `schema.registry.url` to communicate with Schema Registry. Schema Registry validates and stores the schema. The REST Proxy uses it to serialize records before producing to Kafka. For more information, see the [Confluent Schema Registry documentation](https://docs.confluent.io/operator/current/co-manage-schemas.html){:target="_blank"}.

Use one of the following options to reference a schema in your produce request:

- **[Option 1](#option-1-produce-by-using-a-pre-registered-schema-id):** Register the schema in Schema Registry first, then reference it by its numeric ID in your produce requests.
- **[Option 2](#option-2-produce-by-using-an-inline-schema):** Include the schema directly in the request body. Schema Registry registers it automatically and returns an ID that you can reuse in subsequent requests.

#### Option 1: Produce by using a pre-registered schema ID
{: #option-1-produce-by-using-a-pre-registered-schema-id}

Register the schema in Schema Registry first and use the returned numeric ID to reference it in your produce requests. The REST Proxy validates each record against the schema before writing to Kafka. 

Complete the following steps:

1. Register the schema in Schema Registry and note the numeric ID that is returned. For example:

   ```shell
   POST /subjects/orders-value/versions
   Content-Type: application/vnd.schemaregistry.v1+json

   {
     "schema": "{\"type\":\"record\",\"name\":\"Order\",\"fields\":[{\"name\":\"orderId\",\"type\":\"int\"},{\"name\":\"item\",\"type\":\"string\"}]}"
   }
   ```

   Note the `id` field in the response. For example:

   ```json
   {"id": 3}
   ```

2. Specify that ID in `value_schema_id` in your produce request. For example:

   ```shell
   POST /topics/orders
   Content-Type: application/vnd.kafka.avro.v2+json

   {
     "value_schema_id": 3,
     "records": [{"value": {"orderId": 1001, "item": "widget"}}]
   }
   ```

   The response echoes `value_schema_id` and the `offsets` field confirms where the record was written. For example:

   ```json
   {
     "offsets": [{"partition": 0, "offset": 42, "error_code": null, "error": null}],
     "key_schema_id": null,
     "value_schema_id": 3
   }
   ```

   If a record does not match the schema, the REST Proxy rejects the request with `HTTP 400` before any message reaches Kafka. For example:

   ```json
   {"error_code": 400, "message": "Bad Request: Field \"orderId\" content mismatch: Expected int. Got VALUE_STRING"}
   ```

#### Option 2: Produce by using an inline schema
{: #option-2-produce-by-using-an-inline-schema}

Include the full schema as a JSON string in the `value_schema` field of your request body. Schema Registry registers it automatically and returns the assigned `value_schema_id` in the response. Use that ID in subsequent requests instead of resending the full schema. For example:

```shell
POST /topics/orders
Content-Type: application/vnd.kafka.avro.v2+json

{
  "value_schema": "{\"type\":\"record\",\"name\":\"Order\",\"fields\":[{\"name\":\"orderId\",\"type\":\"int\"},{\"name\":\"item\",\"type\":\"string\"}]}",
  "records": [{"value": {"orderId": 1001, "item": "widget"}}]
}
```

The response includes the assigned `value_schema_id`. For example:

```json
{
  "offsets": [{"partition": 0, "offset": 43, "error_code": null, "error": null}],
  "key_schema_id": null,
  "value_schema_id": 4
}
```

If the message does not match the schema, the REST Proxy rejects the request with `HTTP 400`.

## Verifying your setup
{: #verifying-your-setup}

After completing the previous steps, verify that the REST Proxy is working correctly by testing metadata retrieval and message production through the new endpoint. Use the endpoints listed in the [API compatibility overview](#api-compatibility-overview).




