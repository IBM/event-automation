---
order: 1
excerpt: Debezium is an open source distributed platform for change data capture. Debezium’s MySQL connector can monitor all of the row-level changes in the databases on a MySQL server or HA MySQL cluster and record them in Kafka topics.
forID: kc-source-mysql
categories: [source]
connectorTitle: "MySQL (Debezium)"
---


To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Ensure that MySQL is [set up](https://debezium.io/documentation/reference/stable/connectors/mysql.html#setting-up-mysql){:target="_blank"} for your Debezium connector.

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

   To obtain the connector JAR file, go to the connector [Maven repository](https://repo1.maven.org/maven2/io/debezium/debezium-connector-mysql/){:target="_blank"}, open the directory for the latest version, and download the file ending with `-plugin.tar.gz`.

1. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

1. {{site.data.reuse.kafkaconnectStep4_newcontent}}

   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://debezium.io/documentation/reference/stable/connectors/mysql.html#_required_debezium_mysql_connector_configuration_properties){:target="_blank"}.

   See the following sample `KafkaConnector` custom resource for a basic username and password connection:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: KafkaConnector
   metadata:
   name: <connector_name>
   labels:
      eventstreams.ibm.com/cluster: <kafka_connect_name>
   spec:
   class: io.debezium.connector.mysql.MySqlConnector
   config:
      database.server.name: <name_of_the_database_server_or_cluster>
      database.hostname: <database_server_address_or_name>
      database.user: <database_user_with_appropriate_privileges>
      database.password: <user_password>
      database.server.id: <database_server_id>
      database.port: <port_number_for_database_server>
      database.history.kafka.topic: <name_of_the_database_history_topic>
      database.history.kafka.bootstrap.servers: <list_of_kafka_brokers_that_the_connector_uses_to_write_and_recover_DDL_statements_to_the_database_history_topic>
      include.schema.changes: true
      database.include.list: <list_of_databases_hosted_by_the_specified_server>
   tasksMax: 1
   ```

4. {{site.data.reuse.kafkaconnectStep6_newcontent}}

