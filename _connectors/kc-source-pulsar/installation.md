---
order: 1
excerpt: The Pulsar source connector for copying data from Pulsar topics to Kafka topics.
forID: kc-source-pulsar
categories: [source]
connectorTitle: "Pulsar"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/riferrei/kafka-connect-pulsar?tab=readme-ov-file#configuration-reference){:target="_blank"}.
       

4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
