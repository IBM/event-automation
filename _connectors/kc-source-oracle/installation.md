---
order: 1
excerpt: The Oracle (Debezium) source connector monitors Oracle database tables and writes all change events to Kafka topics.
forID: kc-source-oracle
categories: [source]
connectorTitle: "Oracle (Debezium)"
---


To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Ensure that an Oracle database is [set up](https://debezium.io/documentation/reference/stable/connectors/oracle.html#setting-up-oracle){:target="_blank"} for use with the LogMiner adapter.

2. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

   To obtain the connector JAR file, go to the connector [Maven repository](https://repo1.maven.org/maven2/io/debezium/debezium-connector-oracle/){:target="_blank"}, open the directory for the latest version, and download the file ending with `-plugin.tar.gz`.

3. {{site.data.reuse.kafkaconnectStep3_newcontent}} 

   **Note:** For the Oracle (Debezium) source connector to function correctly in environments where ACLs are enabled, the Kafka user configured for Kafka Connect must be granted cluster-level configuration access. When creating the Kafka user, ensure that the following operations are included under `spec.authorization.acls` :
 ```yaml
   - resource:
      type: cluster
     operations:
      - DescribeConfigs
      - Describe
 ```


4. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://debezium.io/documentation/reference/stable/connectors/oracle.html#oracle-example-configuration){:target="_blank"}.  

If the Kafka cluster uses SCRAM-SHA-512 authentication, add the following configuration properties to your `KafkaConnector` custom resource under spec.config :  
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
   # Schema-history producer (DDL writer)
   schema.history.internal.producer.security.protocol: SASL_SSL
   schema.history.internal.producer.sasl.mechanism: SCRAM-SHA-512
   schema.history.internal.producer.sasl.jaas.config: org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="${file:/opt/kafka/connect-password/cp-kafka-user:password}";
   schema.history.internal.producer.ssl.truststore.location: /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.p12
   schema.history.internal.producer.ssl.truststore.password: /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.password
   schema.history.internal.producer.ssl.truststore.type: PKCS12
   # Consumer (DDL reader on startup/recovery)
   schema.history.internal.consumer.security.protocol: SASL_SSL
   schema.history.internal.consumer.sasl.mechanism: SCRAM-SHA-512
   schema.history.internal.consumer.sasl.jaas.config: org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="${file:/opt/kafka/connect-password/cp-kafka-user:password}";
   schema.history.internal.consumer.ssl.truststore.location: /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.p12
   schema.history.internal.consumer.ssl.truststore.password: /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.password
   schema.history.internal.consumer.ssl.truststore.type: PKCS12
tasksMax: 1
``` 

If the Kafka cluster uses mutual TLS authentication, add the following configuration properties to your`KafkaConnector` custom resource under `spec.config`:
```yaml
# Schema-history producer (DDL writer)
schema.history.internal.producer.security.protocol: SSL
schema.history.internal.producer.ssl.keystore.location: /opt/kafka/connect-certs/<kafka-user>/user.p12
schema.history.internal.producer.ssl.keystore.password: '${file:/opt/kafka/connect-certs/<kafka-user>:user.password}'
schema.history.internal.producer.ssl.keystore.type: PKCS12
schema.history.internal.producer.ssl.truststore.location: /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.p12
schema.history.internal.producer.ssl.truststore.password: /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.password
schema.history.internal.producer.ssl.truststore.type: PKCS12
# Schema-history consumer (DDL reader)
schema.history.internal.consumer.security.protocol: SSL
schema.history.internal.consumer.ssl.keystore.location: /opt/kafka/connect-certs/<kafka-user>/user.p12
schema.history.internal.consumer.ssl.keystore.password: '${file:/opt/kafka/connect-certs/<kafka-user>:user.password}'
schema.history.internal.consumer.ssl.keystore.type: PKCS12
schema.history.internal.consumer.ssl.truststore.location: /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.p12
schema.history.internal.consumer.ssl.truststore.password: /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.password
schema.history.internal.consumer.ssl.truststore.type: PKCS12
 ```


5. {{site.data.reuse.kafkaconnectStep6_newcontent}}  