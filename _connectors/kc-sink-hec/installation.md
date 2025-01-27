---
order: 1
excerpt: The Humio HEC sink connector reads messages from a Kafka topic and sends them as events to the HTTP event collector endpoint of a running Humio system.
forID: kc-sink-hec
categories: [sink]
connectorTitle: "Humio HEC"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/humio/kafka-connect-hec-sink?tab=readme-ov-file#configuration-properties){:target="_blank"}.     

4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
