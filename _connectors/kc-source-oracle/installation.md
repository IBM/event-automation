---
order: 1
excerpt: The Oracle (Debezium) source connector monitors Oracle database tables and writes all change events to Kafka topics.
forID: kc-source-oracle
categories: [source]
connectorTitle: "Oracle (Debezium)"
---


To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Ensure that an Oracle database is [set up](https://debezium.io/documentation/reference/stable/connectors/oracle.html#setting-up-oracle){:target="_blank"} for use with the LogMiner adapter.

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

   To obtain the connector JAR file, go to the connector [Maven repository](https://repo1.maven.org/maven2/io/debezium/debezium-connector-oracle/){:target="_blank"}, open the directory for the latest version, and download the file ending with `-plugin.tar.gz`.

3. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

4. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://debezium.io/documentation/reference/stable/connectors/oracle.html#oracle-example-configuration){:target="_blank"}.  

   See the following sample `KafkaConnector` custom resource for a basic username and password connection:
  
   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: KafkaConnector
   metadata:
   name: <connector_name>
   labels:
      eventstreams.ibm.com/cluster: <kafka_connect_name>
   spec:
   class: io.debezium.connector.oracle.OracleConnector
   config:
      database.server.name: <name_of_the_oracle_server_or_cluster>
      plugin.name: pgoutput
      database.hostname: <ip_address_or_hostname_of_the_oracle_database_server>
      database.dbname: <database_name>
      database.user: <database_user_name>
      database.password: <database_user_password>
      database.port: <port_number_for_database_server>
      schema.history.internal.kafka.topic: <name_of_the_kafka_topic>
      schema.history.internal.kafka.bootstrap.servers: <bootstrap_server_address>
   tasksMax: 1
   ``` 

5. {{site.data.reuse.kafkaconnectStep6_newcontent}}  