---
order: 1
excerpt: The MarkLogic sink connector writes data from a topic to a MarkLogic database.
forID: kc-sink-marklogic
categories: [sink]
connectorTitle: "MarkLogic"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://marklogic.github.io/kafka-marklogic-connector/){:target="_blank"}.  
    
        
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
