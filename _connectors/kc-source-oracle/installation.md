---
order: 1
forID: kc-source-oracle
categories: [source]
---

1. Download or build the connector plugin JAR from the files.

    Go to the connector [Maven repository](https://repo1.maven.org/maven2/io/debezium/debezium-connector-oracle){:target="_blank"}. Open the directory for the latest version and download the file ending with `-plugin.tar.gz`.

2. {{site.data.reuse.kafkaConnectStep2_title}}

   {{site.data.reuse.kafkaConnectStep2_content_1}}
   {{site.data.reuse.kafkaConnectStep2_content1_example}}

3. {{site.data.reuse.kafkaConnectStep3_title}}

4. Ensure that an Oracle database is [set up](https://debezium.io/documentation/reference/stable/connectors/oracle.html#setting-up-oracle){:target="_blank"} for use with the LogMiner adapter.

5. Configure the [connector properties](https://debezium.io/documentation/reference/stable/connectors/oracle.html#oracle-example-configuration){:target="_blank"} for {{site.data.reuse.es_name}} in the `spec.config` section of the connector configuration YAML and then [start your connector]({{ 'es/connecting/setting-up-connectors/#start-a-connector' | relative_url }}).

The following example provides the configuration required for a basic username and password connection.


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
