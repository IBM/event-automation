---
order: 1
excerpt: The Kafka JSON converter is a component used in Kafka Connect to handle the serialization and deserialization of data in JSON (JavaScript Object Notation) format. It is commonly used for its simplicity and human-readable format, making it a popular choice for many Kafka Connect deployments.
forID: converter-json
categories: [converters]
---

The JSON converter is included by default in Kafka Connect, and it is part of the `connect-json-<version>.jar` file that comes with your Kafka distribution. This means that you do not need to perform any additional installation steps to use the JSON converter with Kafka Connect.

## Configuration

To use the JSON converter in your Kafka Connect, configure the JSON converter in your connector or worker properties as follows:

1. Configure the JSON converter for your deployment modes:

   - For standalone mode, add the following settings to your worker properties file:

     ```yaml
     key.converter=org.apache.kafka.connect.json.JsonConverter
     value.converter=org.apache.kafka.connect.json.JsonConverter
     ```

   - For distributed mode, add the following properties to your connector configuration:

     ```yaml
     {
       "name": "your-connector-name",
       "config":
         {
           "connector.class": "your.connector.class",
           "key.converter": "org.apache.kafka.connect.json.JsonConverter",
           "value.converter": "org.apache.kafka.connect.json.JsonConverter",
           // other connector-specific configs,
         },
     }
     ```

1. Optionally, you can further customize the JSON converter behavior with the following options:

   - `{key|value}.converter.schemas.enable`: Set to `true` to include schema information in the output. The default value is `false`.
   - `{key|value}.converter.schemas.size`: The maximum number of schemas that can be cached in this converter instance. The default value is `1000`.
   - `{key|value}.converter.decimal.format`: Specifies how to represent decimal numbers. The available options are `NUMERIC` and `BASE64`. The default value is `NUMERIC`.

     For example:

     ```yaml
     key.converter.schemas.enable=true
     value.converter.schemas.enable=true
     value.converter.decimal.format=BASE64
     ```

After configuration, the JSON converter automatically handles the conversion between Kafka Connect's internal data format and JSON as follows:

- Schemaless JSON: If `schemas.enable` is set to `false`, the converter produces plain JSON without schema information.
- Schema-enabled JSON: If `schemas.enable` is set to `true`, the output includes both schema and payload, as shown in the following example:

  ```yaml
  {
    "schema":
      {
        "type": "struct",
        "fields":
          [
            { "type": "string", "optional": false, "field": "name" },
            { "type": "int32", "optional": true, "field": "age" },
          ],
      },
    "payload": { "name": "John Doe", "age": 30 },
  }
  ```
