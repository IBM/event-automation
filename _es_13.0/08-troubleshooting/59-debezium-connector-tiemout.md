---
title: "Timeout error in Oracle (Debezium) source connector"
excerpt: "Find out how to troubleshoot timeout error in Oracle (Debezium) source connector."
categories: troubleshooting
slug: debezium-oracle-timeout
toc: true
---

## Symptoms
{: #symptoms}
When running the Oracle (Debezium) source connector, the connector logs display the following errors:
```
Caused by: java.util.concurrent.ExecutionException: org.apache.kafka.common.errors.TimeoutException: Timed out waiting for a node assignment. Call: listNodes
at java.base/java.util.concurrent.CompletableFuture.reportGet(CompletableFuture.java:396)
Couldn't commit processed log positions with the source database due to a concurrent connector shutdown or restart (io.debezium.connector.common.BaseSourceTask) [SourceTaskOffsetCommitter-1]
```
## Causes
{: #causes}
The Oracle (Debezium) source connector uses an internal schema history topic to persist Data Defenition Language(DDL) statements such as CREATE, ALTER, and DROP that are observed in the database. This topic is configured through `schema.history.internal.kafka.topic` and related properties. On startup or after a failure, the connector replays those DDL records to reconstruct table definitions and schemas, ensuring consistent change events across restarts.

If you have not configured the `schema.history.internal.producer.*` and `schema.history.internal.consumer.*` properties in your `KafkaConnector` custom resource configuration, the internal schema history clients fail to authenticate with kafka broker, causing the `Node -1 disconnected` errors.

## Resolving the problem
{: #resolving-the-problem}

You must explicitly provide SASL/SSL settings for both the schema history producer and consumer in your `KafkaConnector` custom resource configuration, as follows:

### SCRAM-SHA-512 authentication
If the Kafka cluster uses SCRAM-SHA-512 authentication, add the following configuration properties to your `KafkaConnector` custom resource under `spec.config`:

   ```shell
# Core history topic config
schema.history.internal.kafka.bootstrap.servers=<bootstrap that has scram-sha-512 authentication>
schema.history.internal.kafka.topic=testtopic
# Producer (DDL writer)
schema.history.internal.producer.security.protocol=SASL_SSL
schema.history.internal.producer.sasl.mechanism=SCRAM-SHA-512
schema.history.internal.producer.sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="${file:/opt/kafka/connect-password/cp-kafka-user:password}";
schema.history.internal.producer.ssl.truststore.location=/opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert> /ca.p12
schema.history.internal.producer.ssl.truststore.password=/opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.password
schema.history.internal.producer.ssl.truststore.type=PKCS12
# Consumer (DDL reader on startup/recovery)
schema.history.internal.consumer.security.protocol=SASL_SSL
schema.history.internal.consumer.sasl.mechanism=SCRAM-SHA-512
schema.history.internal.consumer.sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="${file:/opt/kafka/connect-password/cp-kafka-user:password}";
schema.history.internal.consumer.ssl.truststore.location=/opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert> /ca.p12
schema.history.internal.consumer.ssl.truststore.password=/opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.password
schema.history.internal.consumer.ssl.truststore.type=PKCS12
   ```
**Note:** If the certificates do not exist in the `/opt/kafka/connect-certs/` path, you must manually mount them by specifying the volume in your `KafkaConnect` custom resource:
```shell
template:
  connectContainer:
    volumeMounts:
      - mountPath: /mnt/connect-certs
        name: connect-certs
        readOnly: true
  pod:
    volumes:
      - name: connect-certs
        secret:
          secretName: <event-stream-instance>-cluster-ca-cert
```

### Mutual TLS authentication
If the Kafka cluster uses mutual TLS authentication, add the following configuration properties to your `KafkaConnector` custom resource under `spec.config`:
```shell
schema.history.internal.kafka.bootstrap.servers= dev-kafka-kafka-bootstrap.eventstream.svc:9093
schema.history.internal.kafka.topic= testtopic
# Schema-history producer (DDL writer)
schema.history.internal.producer.security.protocol= SSL
schema.history.internal.producer.ssl.keystore.location= /opt/kafka/connect-certs/<kafka-user>/user.p12
schema.history.internal.producer.ssl.keystore.password= '${file:/opt/kafka/connect-certs/<kafka-user>:user.password}'
schema.history.internal.producer.ssl.keystore.type= PKCS12
schema.history.internal.producer.ssl.truststore.location= /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.p12
schema.history.internal.producer.ssl.truststore.password= /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.password
schema.history.internal.producer.ssl.truststore.type= PKCS12
# Schema-history consumer (DDL reader)
schema.history.internal.consumer.security.protocol= SSL
schema.history.internal.consumer.ssl.keystore.location= /opt/kafka/connect-certs/<kafka-user>/user.p12
schema.history.internal.consumer.ssl.keystore.password= '${file:/opt/kafka/connect-certs/<kafka-user>:user.password}'
schema.history.internal.consumer.ssl.keystore.type= PKCS12
schema.history.internal.consumer.ssl.truststore.location= /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.p12
schema.history.internal.consumer.ssl.truststore.password= /opt/kafka/connect-certs/<event_streams_name_cluster-ca-cert>/ca.password
schema.history.internal.consumer.ssl.truststore.type= PKCS12
```
