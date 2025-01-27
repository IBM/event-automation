---
order: 1
excerpt: The Kafka Connect sink connector subscribes to one or more Kafka topics and writes the messages to Couchbase. This plugin also includes the corresponding source connector for Couchbase.
forID: kc-sink-couchbase
categories: [sink]
connectorTitle: "Couchbase"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}
    
2. {{site.data.reuse.kafkaconnectStep3_newcontent}}

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/couchbase/kafka-connect-couchbase){:target="_blank"}.     
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
