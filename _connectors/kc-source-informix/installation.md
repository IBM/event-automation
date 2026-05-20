---
order: 1
excerpt: Debezium is an open-source distributed platform for change data capture (CDC). Debezium’s Informix connector can monitor row-level changes in the schemas of an Informix database and record them to separate Kafka topics.
forID: kc-source-informix
categories: [source]
connectorTitle: "Informix (Debezium)"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}.
   
   To obtain the connector JAR file, go to the connector [Maven repository](https://repo1.maven.org/maven2/io/debezium/debezium-connector-informix/){:target="_blank"}, open the directory for the latest version, and download the file ending with `-plugin.tar.gz`.

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}

   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://debezium.io/documentation/reference/3.3/connectors/informix.html){:target="_blank"}.

   See the following sample `KafkaConnector` custom resource for a basic username and password connection:
   
   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: KafkaConnector
   metadata:
     name: <connector_name>
     labels:
       eventstreams.ibm.com/cluster: <kafka_connect_name>
   spec:
     class: io.debezium.connector.informix.InformixConnector
     config:
       database.hostname: <database_server_address_or_name>
       database.user: <database_user_with_appropriate_privileges>
       database.password: <user_password>
       database.port: <port_number_for_database_server>
       database.dbname: <name_of_the_informix_database>
       topic.prefix: <prefix_for_kafka_topics>
       table.include.list: <list_of_all_tables_whose_changes_Debezium_should_capture>
       schema.history.internal.kafka.bootstrap.servers: <list_of_kafka_brokers_that_the_connector_uses_to_write_and_recover_DDL_statements_to_the_database_history_topic>
       schema.history.internal.kafka.topic: <name_of_the_database_history_topic>
     tasksMax: 1
   ```
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}