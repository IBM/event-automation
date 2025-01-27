---
order: 1
excerpt: Kafka Connect for Memcached provides a sink connector that can write data in real time from Apache Kafka to a Memcached environment.
forID: kc-sink-memcached
categories: [sink]
connectorTitle: "Memcached"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep2_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/jcustenborder/kafka-connect-memcached?tab=readme-ov-file#sink-connectors){:target="_blank"}.
   
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}