---
order: 1
excerpt: The Geode source connector enables Geode regions to serve as data sources for Kafka topics.
forID: kc-source-geode
categories: [source]
connectorTitle: "Geode"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/apache/geode-kafka-connector?tab=readme-ov-file#geodekafkasource-properties){:target="_blank"}. 
        

4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
