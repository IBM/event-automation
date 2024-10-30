---
order: 1
forID: kc-source-postgresql
categories: [source]
connectorTitle: "PostgreSQL (Debezium)"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Ensure that a PostgreSQL server is [set up](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-server-configuration){:target="_blank"} for your Debezium connector.

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

   To obtain the connector JAR file, go to the connector [Maven repository](https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgres/){:target="_blank"}, open the directory for the latest version, and download the file ending with `-plugin.tar.gz`.

1. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

1. {{site.data.reuse.kafkaconnectStep4_newcontent}}

   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-connector-properties){:target="_blank"}.

   See the following sample `KafkaConnector` custom resource for a basic username and password connection:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: KafkaConnector
   metadata:
   name: <connector_name>
   labels:
      eventstreams.ibm.com/cluster: <kafka_connect_name>
   spec:
   class: io.debezium.connector.postgresql.PostgresConnector
   config:
      database.server.name: <name_of_the_database_server_or_cluster>
      plugin.name: pgoutput
      database.hostname: <database_server_address_or_name>
      database.dbname: <database_name>
      database.user: <database_user_with_appropriate_privileges>
      database.password: <user_password>
      database.port: <port_number_for_database_server>
      database.history.kafka.topic: <name_of_the_database_history_topic>
      database.history.kafka.bootstrap.servers: <list_of_kafka_brokers_that_the_connector_uses_to_write_and_recover_DDL_statements_to_the_database_history_topic>
   tasksMax: 1
   ```

1. {{site.data.reuse.kafkaconnectStep6_newcontent}}  
