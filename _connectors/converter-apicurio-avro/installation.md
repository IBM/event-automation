---
order: 1
excerpt: The Apicurio Avro converter helps convert data from Apache Kafka Connect's format to the Avro serialized format.
forID: converter-apicurio-avro
categories: [converters]
---

The Apicurio Avro converter is a tool that enables serialization and deserialization of data in Avro format, specifically designed for use with Kafka and Kafka Connect. Avro is a widely used data serialization system that helps ensure data is structured and validated properly when working with Kafka and Kafka Connect, where Avro schemas are commonly used.

To use the Apicurio Registry converter library, you can either build your converter or download the converter artifacts.

To build your converter, add the following dependency to your project `pom.xml` file:

   ```yaml
   <dependency>
      <groupId>io.apicurio</groupId>
      <artifactId>apicurio-registry-utils-converter</artifactId>
      <version>2.6.2.Final</version>
   </dependency>
   ```
Alternatively, you can download the latest Apicurio converter artifacts:

1. Download the latest Apicurio converter artifacts from [Maven Central](https://central.sonatype.com/artifact/io.apicurio/apicurio-registry-utils-converter).
1. Extract the downloaded `tar.gz` file.
1. Move the extracted folder with all the JARs into a subdirectory within the folder where you are building your `KafkaConnect` image.

## Configuration

To enable the Apicurio Avro converter in your Kafka Connect setup:

1. Add the following settings to your `KafkaConnector` or `KafkaConnect` custom resource definition to enable Kafka properties to be pulled from a file:
   
   ```yaml
   config.providers: file
   config.providers.file.class: org.apache.kafka.common.config.provider.FileConfigProvider
   ```
1. Reference the Kafka connection details in the `KafkaConnector` custom resource of your connector. For example, to use a value converter with SCRAM credentials:
   ```yaml
   value.converter.apicurio.registry.url: <username>:<password>@<Schema registry endpoint>
   value.converter.apicurio.registry.request.ssl.truststore.location: "\$\{file:/tmp/strimzi-connect.truststore.p12}"
   value.converter.apicurio.registry.request.ssl.truststore.password: "\$\{file:/tmp/strimzi-connect.password}"
   value.converter.apicurio.registry.request.ssl.truststore.type: "PKCS12"
   ```
1. To use the Apicurio Avro converter in your Kafka Connect configuration, set the `value.converter` and `key.converter` properties to `io.apicurio.registry.utils.converter.AvroConverter` in your connector configuration.

For example:
```yaml
{
   "name": "example-connector",
   "config": {
      "connector.class": "org.apache.kafka.connect.file.FileStreamSinkConnector",
      "tasks.max": "1",
      "topics": "example-topic",
      "file": "/tmp/output.txt",
      value.converter: "io.apicurio.registry.utils.converter.AvroConverter"
      key.converter: "io.apicurio.registry.utils.converter.AvroConverter"
   }
}
```
1. Configure the schema registry URL and any required authentication details as shown in the step 2 configuration example.


