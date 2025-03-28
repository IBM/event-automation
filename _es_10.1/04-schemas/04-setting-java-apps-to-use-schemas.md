---
title: "Setting Java applications to use schemas"
excerpt: "Set up your Java applications to use schemas."
categories: schemas
slug: setting-java-apps
toc: true
---

If you have Kafka producer or consumer applications written in Java, use the following guidance to set them up to use schemas.

**Note:** If you have Kafka clients written in other languages than Java, see the guidance about [setting up non-Java applications](../setting-nonjava-apps) to use schemas.

## Preparing the setup

To use schemas stored in the Apicurio Registry in {{site.data.reuse.es_name}}, your client applications need to be able to serialize and deserialize messages based on schemas.

- Producing applications use a serializer to produce messages conforming to a specific schema, and use unique identifiers in the message headers to determine which schema is being used.
- Consuming applications then use a deserializer to consume messages that have been serialized using the same schema. The schema is retrieved from the schema registry based on the unique identifiers in the message headers.

The {{site.data.reuse.es_name}} UI provides help with setting up your Java applications to use schemas.

**Note:** Apicurio Registry in {{site.data.reuse.es_name}} works with multiple schema registry `serdes` libraries, including the {{site.data.reuse.es_name}} schema registry `serdes` library and the Apicurio Registry `serdes` library. You can use either `serdes` library in your applications by adding Maven dependencies to your project `pom.xml` files. The following instructions and code snippets use the {{site.data.reuse.es_name}} schema registry `serdes` library. To use the Apicurio Registry `serdes` library, see the guidance about [setting up Java applications to use schemas with the Apicurio Registry serdes library](../setting-java-apps-apicurio-serdes).

To set up your Java applications to use the {{site.data.reuse.es_name}} schema registry `serdes` library and Apicurio Registry, prepare the connection for your application as follows:

1. {{site.data.reuse.es_ui_login}}
2. Ensure you have [added schemas](../creating) to the registry.
3. Click **Schema registry** in the primary navigation.
4. Select a schema from the list and click the row for the schema.
5. Click **Connect to the latest version**. Alternatively, if you want to use a different version of the schema, click the row for the schema version, and click **Connect to this version**.
6. Set the preferences for your connection in the **Configure the schema connection** section. Use the defaults or change them by clicking **Change configuration**.

   - For producers, set the method for **Message encoding**.

     - **Binary** (default): Binary-encoded messages are smaller and typically quicker to process. However the message data is not human-readable without an application that is able to apply the schema.
     - **JSON**: JSON-encoded messages are human-readable and can still be used by consumers that are not using the {{site.data.reuse.es_name}} schema registry.

   - For consumers, set the **Message deserialization behavior** for the behavior to use when an application encounters messages that do not conform to the schema.

     - **Strict** (default): Strict behavior means the message deserializer will fail to process non-conforming messages, throwing an exception if one is encountered.
     - **Permissive**: Permissive behavior means the message deserializer will return a null message when a non-conforming message is encountered. It will not throw an exception, and will allow a Kafka consumer to continue to process further messages.

7. If any configuration was changed, click **Save**.
8. Click **Generate credentials** to generate SCRAM or Mutual TLS credentials and follow the instructions.\\
   **Important:** Ensure you make note of the information provided upon completion as you will need this later.\\
   Alternatively you can generate credentials later by using the {{site.data.reuse.es_name}} [UI](../../security/managing-access#creating-a-kafkauser-in-the-ibm-event-streams-ui) or [CLI](../../security/managing-access#creating-a-kafkauser-in-the-ibm-event-streams-cli).
9. Click **Generate connection details**.
10. Click **Download certificate** to download the cluster PKCS12 certificate. This is the Java truststore file which contains the server certificate. Take a copy of the **Certificate password** for use with the certificate in your application.
11. If your project uses Maven, add the following dependency to your project `pom.xml` file to use the {{site.data.reuse.es_name}} schema registry `serdes` library:

    ```
    <dependency>
        <groupId>com.ibm.eventstreams.schemaregistry</groupId>
        <artifactId>event-streams-serdes</artifactId>
        <version>2.1.0</version>
    </dependency>
    ```

    Alternatively, if your project does not use Maven, select the **Use JARs** tab and click **Java dependencies** to download the java dependencies JAR files to use for your application in its code.
12. Depending on your application, click the **Producer** or **Consumer** tab, and copy the sample Java code snippets displayed. The sample code snippets include the settings you configured to set up your applications to use the schema.
13. Add the required snippets into your application code as described in the following sections.
    - [Setting up producers to use schemas](#setting-up-producers-to-use-schemas)
    - [Setting up consumers to use schemas](#setting-up-consumers-to-use-schemas)

## Setting up producers to use schemas

1. Ensure you have [prepared](#preparing-the-setup) for the setup, including configuring connection settings, downloading Java dependencies if not using Maven, and copying code snippets for a producing application.
2. If your project does not use Maven, ensure you add the location of the JAR files to the build path of your producer Kafka application.
3. Use the code snippets you copied from the UI for a producer and add them to your application code.

The code snippet from the **Imports** section includes Java imports to paste into your class, and sets up the application to use the {{site.data.reuse.es_name}} schema registry's `serdes` library, for example:

```
import java.util.Properties;

import org.apache.avro.generic.GenericData;
import org.apache.avro.generic.GenericRecord;

import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.common.config.SaslConfigs;
import org.apache.kafka.common.config.SslConfigs;
import com.ibm.eventstreams.serdes.SchemaRegistryConfig;
import com.ibm.eventstreams.serdes.SchemaInfo;
import com.ibm.eventstreams.serdes.SchemaRegistry;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

```

The code snippet from the **Connection properties** section specifies connection and access permission details for your {{site.data.reuse.es_name}} cluster, for example:

```
Properties props = new Properties();
// TLS Properties
props.put(SslConfigs.SSL_PROTOCOL_CONFIG, "TLSv1.2");
props.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, "<ca_p12_file_location>");
props.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, "<ca_p12_password>");

//If your Kafka and Schema registry endpoints do not use the same authentication method, you will need
//to duplicate the properties object - and add the Schema Registry authentication and connection properties
//to 'props', and the Kafka authentication and connection properties to 'kafkaProps'. The different properties objects
//are then supplied to the SchemaRegistry and Producer/Consumer respectively.
//Uncomment the next two lines.
//Properties kafkaProps = new Properties();
//kafkaProps.putAll(props);

// SCRAM authentication properties - uncomment to connect using Scram
//props.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL");
//props.put(SaslConfigs.SASL_MECHANISM, "SCRAM-SHA-512");
//String saslJaasConfig = "org.apache.kafka.common.security.scram.ScramLoginModule required "
//+ "username=\"<username>\" password=\"<password>\";";
//props.put(SaslConfigs.SASL_JAAS_CONFIG, saslJaasConfig);

// Mutual authentication properties - uncomment to connect using Mutual authentication
//props.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SSL");
//props.put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, "<user_p12_file_location>");
//props.put(SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG, "<user_p12_password>");

//Schema Registry connection
props.put(SchemaRegistryConfig.PROPERTY_API_URL, "<Schema registry endpoint>");

//Kafka connection
props.put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, "<Kafka listener>");
```

**Note:** Follow the instructions in the code snippet to uncomment lines. Replace `<ca_p12_file_location>` with the path to the Java truststore file you downloaded earlier, `<ca_p12_password>` with the truststore password which has the permissions needed for your application, `<Kafka listener>` with the bootstrap address (find out how to [obtain the address](../../getting-started/connecting/#obtaining-the-bootstrap-address)), and `<Schema registry endpoint>` with the endpoint address for Apicurio Registry in {{site.data.reuse.es_name}}. For SCRAM, replace the `<username>` and `<password>` with the SCRAM username and password. For Mutual authentication, replace `<user_p12_file_location>` with the path to the `user.p12` file extracted from the `.zip` file downloaded earlier and `<user_p12_password>` with the contents of the `user.password` file in the same `.zip` file.

For more information about the configuration keys and values to use with the {{site.data.reuse.es_name}} `serdes` library, see the `SchemaRegistryConfig` class in the [schema API reference]({{'schema-api' | relative_url }}).

The code snippet from the **Producer code** section defines properties for the producer application that set it to use the schema registry and the correct schema, for example:

```
// Set the value serializer for produced messages to use the Event Streams serializer
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "com.ibm.eventstreams.serdes.EventStreamsSerializer");

// Set the encoding type used by the message serializer
props.put(SchemaRegistryConfig.PROPERTY_ENCODING_TYPE, SchemaRegistryConfig.ENCODING_BINARY);

// Get a new connection to the Schema Registry
SchemaRegistry schemaRegistry = new SchemaRegistry(props);

// Get the schema from the registry
SchemaInfo schema = schemaRegistry.getSchema("ABC_Assets_Schema", "1.0.0");

// Get a new Generic KafkaProducer
KafkaProducer<String, GenericRecord> producer = new KafkaProducer<>(props);

// Get a new Generic record based on the schema
GenericRecord genericRecord = new GenericData.Record(schema.getSchema());

// Add fields and values to the genericRecord, for example:
// genericRecord.put("title", "this is the value for a title field");

// Prepare the record, adding the Schema Registry headers
ProducerRecord<String, GenericRecord> producerRecord =
    new ProducerRecord<String, GenericRecord>("<my_topic>", genericRecord);

producerRecord.headers().add(SchemaRegistryConfig.HEADER_MSG_SCHEMA_ID,
    schema.getIdAsBytes());
producerRecord.headers().add(SchemaRegistryConfig.HEADER_MSG_SCHEMA_VERSION,
    schema.getVersionAsBytes());

// Send the record to Kafka
producer.send(producerRecord);

// Close the producer
producer.close();

```

The Kafka configuration property `value.serializer` is set to `com.ibm.eventstreams.serdes.EventStreamsSerializer`, telling Kafka to use the {{site.data.reuse.es_name}} serializer for message values when producing messages. You can also use the {{site.data.reuse.es_name}} serializer for message keys.

For more information about the configuration keys and values to use with the {{site.data.reuse.es_name}} `serdes` library, see the `SchemaRegistryConfig` class in the [schema API reference]({{'schema-api' | relative_url }}).

**Note:** Use the `put` method in the `GenericRecord` class to set field names and values in your message.

**Note:** Replace `<my_topic>` with the name of the topic to produce messages to.

## Setting up consumers to use schemas

1. Ensure you have [prepared](#preparing-the-setup) for the setup, including configuring connection settings, downloading Java dependencies if not using Maven, and copying code snippets for a consuming application.
2. If your project does not use Maven, ensure you add the location of the JAR files to the build path of your consumer Kafka application.
3. Use the code snippets you copied from the UI for a consumer and add them to your application code.

The code snippet from the **Imports** section includes Java imports to paste into your class, and sets up the application to use the {{site.data.reuse.es_name}} schema registry's `serdes` library, for example:

```
import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;

import org.apache.avro.generic.GenericData;
import org.apache.avro.generic.GenericRecord;

import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.common.config.SaslConfigs;
import org.apache.kafka.common.config.SslConfigs;
import com.ibm.eventstreams.serdes.SchemaRegistryConfig;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;

```

The code snippet from the **Connection properties** section specifies connection and access permission details for your {{site.data.reuse.es_name}} cluster, for example:

```
Properties props = new Properties();
// TLS Properties
props.put(SslConfigs.SSL_PROTOCOL_CONFIG, "TLSv1.2");
props.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, "<ca_p12_file_location>");
props.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, "<ca_p12_password>");

//If your Kafka and Schema registry endpoints do not use the same authentication method, you will need
//to duplicate the properties object - and add the Schema Registry authentication and connection properties
//to 'props', and the Kafka authentication and connection properties to 'kafkaProps'. The different properties objects
//are then supplied to the SchemaRegistry and Producer/Consumer respectively.
//Uncomment the next two lines.
//Properties kafkaProps = new Properties();
//kafkaProps.putAll(props);

// SCRAM authentication properties - uncomment to connect using Scram
//props.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL");
//props.put(SaslConfigs.SASL_MECHANISM, "SCRAM-SHA-512");
//String saslJaasConfig = "org.apache.kafka.common.security.scram.ScramLoginModule required "
//+ "username=\"<username>\" password=\"<password>\";";
//props.put(SaslConfigs.SASL_JAAS_CONFIG, saslJaasConfig);

// Mutual authentication properties - uncomment to connect using Mutual authentication
//props.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SSL");
//props.put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, "<user_p12_file_location>");
//props.put(SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG, "<user_p12_password>");

//Schema Registry connection
props.put(SchemaRegistryConfig.PROPERTY_API_URL, "<Schema registry endpoint>");

//Kafka connection
props.put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, "<Kafka listener>");
```

**Note:** Follow the instructions in the code snippet to uncomment lines. Replace `<ca_p12_file_location>` with the path to the Java truststore file you downloaded earlier, `<ca_p12_password>` with the truststore password which has the permissions needed for your application, `<Kafka listener>` with the bootstrap address (find out how to [obtain the address](../../getting-started/connecting/#obtaining-the-bootstrap-address)), and `<Schema registry endpoint>` with the endpoint address for Apicurio Registry in {{site.data.reuse.es_name}}. For SCRAM, replace the `<username>` and `<password>` with the SCRAM username and password. For Mutual authentication, replace `<user_p12_file_location>` with the path to the `user.p12` file extracted from the `.zip` file downloaded earlier and `<user_p12_password>` with the contents of the `user.password` file in the same `.zip` file.

For more information about the configuration keys and values to use with the {{site.data.reuse.es_name}} `serdes` library, see the `SchemaRegistryConfig` class in the [schema API reference]({{'schema-api' | relative_url }}).

The code snippet from the **Consumer code** section defines properties for the consumer application that set it to use the schema registry and the correct schema, for example:

```
// Set the value deserializer for consumed messages to use the Event Streams deserializer
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "com.ibm.eventstreams.serdes.EventStreamsDeserializer");

// Set the behavior of the deserializer when a record cannot be deserialized
props.put(SchemaRegistryConfig.PROPERTY_BEHAVIOR_TYPE, SchemaRegistryConfig.BEHAVIOR_STRICT);

// Set the consumer group ID in the properties
props.put("group.id", "<my_consumer_group>");

KafkaConsumer<String, GenericRecord> consumer = new KafkaConsumer<>(props);

// Subscribe to the topic
consumer.subscribe(Arrays.asList("<my_topic>"));

// Poll the topic to retrieve records
while(true) {

    ConsumerRecords<String, GenericRecord> records = consumer.poll(Duration.ofSeconds(5));

    for (ConsumerRecord<String, GenericRecord> record : records) {
        GenericRecord genericRecord = record.value();

        // Get fields and values from the genericRecord, for example:
        // String titleValue = genericRecord.get("title").toString();
    }
}
```

The Kafka configuration property `value.serializer` is set to `com.ibm.eventstreams.serdes.EventStreamsDeserializer`, telling Kafka to use the {{site.data.reuse.es_name}} deserializer for message values when consuming messages. You can also use the {{site.data.reuse.es_name}} deserializer for message keys.

For more information about the configuration keys and values to use with the {{site.data.reuse.es_name}} `serdes` library, see the `SchemaRegistryConfig` class in the [schema API reference]({{'schema-api' | relative_url }}).

**Note:** Use the `get` method in the `GenericRecord` class to get field names and values.

**Note:** Replace `<my_consumer_group>` with the name of the consumer group to use and `<my_topic>` with the name of the topic to consume messages from.

## Setting up Kafka Streams applications

Kafka Streams applications can also use the {{site.data.reuse.es_name}} `serdes` library to serialize and deserialize messages. For example:

```
// Set the Event Streams serdes properties, including the override option to set the schema
// and version used for serializing produced messages.
Map<String, Object> serdesProps = new HashMap<String, Object>();
serdesProps.put(SchemaRegistryConfig.PROPERTY_API_URL, "<Schema registry endpoint>");
serdesProps.put(SchemaRegistryConfig.PROPERTY_SCHEMA_ID_OVERRIDE, "ABC_Assets_Schema");
serdesProps.put(SchemaRegistryConfig.PROPERTY_SCHEMA_VERSION_OVERRIDE, "1.0.0");

// TLS Properties
serdesProps.put(SslConfigs.SSL_PROTOCOL_CONFIG, "TLSv1.2");
serdesProps.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, "<ca_p12_file_location>");
serdesProps.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, "<ca_p12_password>");

// SCRAM authentication properties - uncomment to connect using Scram
//serdesProps.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL");
//serdesProps.put(SaslConfigs.SASL_MECHANISM, "SCRAM-SHA-512");
//String saslJaasConfig = "org.apache.kafka.common.security.scram.ScramLoginModule required "
//+ "username=\"<username>\" password=\"<password>\";";
//serdesProps.put(SaslConfigs.SASL_JAAS_CONFIG, saslJaasConfig);

// Mutual authentication properties - uncomment to connect using Mutual authentication
//serdesProps.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SSL");
//serdesProps.put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, "<user_p12_file_location>");
//serdesProps.put(SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG, "<user_p12_password>");

// Set up the Kafka StreamsBuilder
StreamsBuilder builder = new StreamsBuilder();

// Configure a Kafka Serde instance to use the Event Streams schema registry
// serializer and deserializer for message values
Serde<IndexedRecord> valueSerde = new EventStreamsSerdes();
valueSerde.configure(serdesProps, false);

// Get the stream of messages from the source topic, deserializing each message value with the
// Event Streams deserializer, using the schema and version specified in the message headers.
builder.stream("<my_source_topic>", Consumed.with(Serdes.String(), valueSerde))
    // Get the 'nextcount' int field from the record.
    // The Event Streams deserializer constructs instances of the generated schema-specific
    // ABC_Assets_Schema_Count class based on the values in the message headers.
    .mapValues(new ValueMapper<IndexedRecord, Integer>() {
        @Override
        public Integer apply(IndexedRecord val) {
            return ((ABC_Assets_Schema_Count) val).getNextcount();
        }
    })
    // Get all the records
    .selectKey((k, v) -> 0).groupByKey()
    // Sum the values
    .reduce(new Reducer<Integer>() {
        @Override
        public Integer apply(Integer arg0, Integer arg1) {
            return arg0 + arg1;
        }
    })
    .toStream()
    // Map the summed value to a field in the schema-specific generated ABC_Assets_Schema class
    .mapValues(
        new ValueMapper<Integer, IndexedRecord>() {
            @Override
            public IndexedRecord apply(Integer val) {
                ABC_Assets_Schema record = new ABC_Assets_Schema();
                record.setSum(val);
                return record;
            }
     })
     // Finally, put the result to the destination topic, serializing the message value
     // with the Event Streams serializer, using the overridden schema and version from the
     // configuration.
    .to("<my_destination_topic>", Produced.with(Serdes.Integer(), valueSerde));

// Create and start the stream
final KafkaStreams streams = new KafkaStreams(builder.build(), streamsConfig);
streams.start();
```

In this example, the Kafka `StreamsBuilder` is configured to use the `com.ibm.eventstreams.serdes.EventStreamsSerdes` class, telling Kafka to use the {{site.data.reuse.es_name}} deserializer for message values when consuming messages and the {{site.data.reuse.es_name}} serializer for message values when producing messages.

**Note:** The Kafka Streams `org.apache.kafka.streams.kstream` API does not provide access to message headers, so to produce messages with the {{site.data.reuse.es_name}} schema registry headers, use the `SchemaRegistryConfig.PROPERTY_SCHEMA_ID_OVERRIDE` and `SchemaRegistryConfig.PROPERTY_SCHEMA_VERSION_OVERRIDE` configuration properties. Setting these configuration properties will mean produced messages are serialized using the provided schema version and the {{site.data.reuse.es_name}} schema registry message headers will be set.

For more information about the configuration keys and values to use with the {{site.data.reuse.es_name}} `serdes` library, see the `SchemaRegistryConfig` class in the [schema API reference]({{'schema-api' | relative_url }}).

**Note:** To re-use this example, replace `<ca_p12_file_location>` with the path to the Java truststore file you downloaded earlier, `<ca_p12_password>` with the truststore password which has the permissions needed for your application, `<Kafka listener>` with the bootstrap address (find out how to [obtain the address](../../getting-started/connecting/#obtaining-the-bootstrap-address)), and `<Schema registry endpoint>` with the endpoint address for Apicurio Registry in {{site.data.reuse.es_name}}. For SCRAM, replace the `<username>` and `<password>` with the SCRAM username and password. For Mutual authentication, replace `<user_p12_file_location>` with the path to the `user.p12` file extracted from the `.zip` file downloaded earlier, and `<user_p12_password>` with the contents of the `user.password` file in the same `.zip` file.
