---
order: 1
forID: kc-sink-newrelic
categories: [sink]
connectorTitle: "New Relic"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/newrelic/kafka-connect-newrelic/?tab=readme-ov-file#full-list-of-connector-configuration-options-in-addition-to-global-options-for-all-connectors){:target="_blank"}. 
           
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
