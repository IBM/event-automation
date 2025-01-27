---
order: 1
excerpt: The FileStream source connector reads data from a local file and sends it to a Kafka topic.
forID: kc-source-filestream
categories: [source]
connectorTitle: "FileStream"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep2_newcontent}}    

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/apache/kafka/blob/trunk/config/connect-console-source.properties){:target="_blank"}. 
   
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}