---
order: 1
excerpt: The Batch.sh sink connector streams Kafka events to a remote collector.
forID: kc-sink-batchsh
categories: [sink]
connectorTitle: "Batch.sh"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/streamdal/kafka-sink-connector?tab=readme-ov-file#documentation){:target="_blank"}.   
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}

