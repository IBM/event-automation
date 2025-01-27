---
order: 1
excerpt: The Diffusion source connector enables streaming of data stored in Kafka to endpoints such as web browsers, mobile apps, and IoT devices, reliably and at scale.
forID: kc-source-diffusion
categories: [source]
connectorTitle: "Diffusion"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep2_newcontent}}    

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/diffusiondata/diffusion-kafka-connect?tab=readme-ov-file#diffusionconnector-configs){:target="_blank"}.  
   
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
