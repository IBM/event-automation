---
order: 1
excerpt: The Adobe Experience Platform sink connector seamlessly ingests events from your Kafka topics into the Adobe Experience Platform.
forID: kc-sink-aep
categories: [sink]
connectorTitle: "Adobe Experience Platform"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/adobe/experience-platform-streaming-connect/blob/master/DEVELOPER_GUIDE.md#configuration-options){:target="_blank"}.         

4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
