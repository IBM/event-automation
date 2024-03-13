---
order: 1
forID: kc-source-postgresql
categories: [source]
---

1. Download and extract the connector plugin JAR files.

    Go to the connector [Maven repository](https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgres){:target="_blank"}. Open the directory for the latest version and download the file ending with `-plugin.tar.gz`.


2. {{site.data.reuse.kafkaConnectStep2_title}}

    {{site.data.reuse.kafkaConnectStep2_content_1}}
    {{site.data.reuse.kafkaConnectStep2_content1_example}}

3. {{site.data.reuse.kafkaConnectStep3_title}}

4. Ensure that a PostgreSQL server is [set up](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-server-configuration){:target="_blank"} for your Debezium connector.

5. Configure the [connector properties](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-connector-properties){:target="_blank"} for {{site.data.reuse.es_name}} in the `spec.config` section of the connector configuration YAML and then [start your connector]({{ 'es/connecting/setting-up-connectors/#start-a-connector' | relative_url }}).

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaConnector
metadata:
  name: <connector_name>
  labels:
    # The eventstreams.ibm.com/cluster label identifies the KafkaConnect instance
    # in which to create this connector. That KafkaConnect instance
    # must have the eventstreams.ibm.com/use-connector-resources annotation
    # set to true.
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
