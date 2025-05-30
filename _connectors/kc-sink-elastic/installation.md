---
order: 1
excerpt: The Kafka Connect sink connector for Elasticsearch subscribes to one or more Kafka topics and writes the records to Elasticsearch.
forID: kc-sink-elastic
categories: [sink]
connectorTitle: "Elasticsearch"
---

To use the {{page.title}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the Elasticsearch sink connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}


2. To connect Elasticsearch to Kafka Connect, obtain the KeyStore details from Elasticsearch, convert the details into JKS format, store the JKS file in a OpenShift secret, and mount the file on to the Kafka Connect pod.
3. {{site.data.reuse.kafkaconnectStep3_newcontent}}

4. {{site.data.reuse.kafkaconnectStep4_newcontent}}:

   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/ibm-messaging/kafka-connect-elastic-sink?tab=readme-ov-file#configuration){:target="_blank"}.

   See the following sample `KafkaConnector` custom resource:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: KafkaConnector
   metadata:
   name: <connector_name>
   labels:
      eventstreams.ibm.com/cluster: <kafka_connect_name>
   spec:
   class: com.ibm.eventstreams.connect.elasticsink.ElasticSinkConnector
   config:
      key.ignore: true
      value.converter: org.apache.kafka.connect.json.JsonConverter
      topics: <topic_name>
      es.document.builder: com.ibm.eventstreams.connect.elasticsink.builders.JsonDocumentBuilder
      value.converter.schemas.enable: false
      es.user.name: <elastic_username>
      es.tls.keystore.location: <location_of_mounted_tls_keystore_in_kafka_connect_pod>
      key.converter: org.apache.kafka.connect.storage.StringConverter
      es.tls.keystore.password: <tls_keystore_password>
      es.identifier.builder: com.ibm.eventstreams.connect.elasticsink.builders.DefaultIdentifierBuilder
      connector.class: com.ibm.eventstreams.connect.elasticsink.ElasticSinkConnector
      es.password: <elastic_search_user_password>
      es.connection: <connection_to_elastic_search_instance>
      type.name: _doc
      es.index.builder: com.ibm.eventstreams.connect.elasticsink.builders.DefaultIndexBuilder
      schema.ignore: true
   tasksMax: 1
   ```

5. {{site.data.reuse.kafkaconnectStep6_newcontent}}