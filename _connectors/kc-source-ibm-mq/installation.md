---
order: 1
excerpt: The Kafka Connect source connector for IBM MQ supports connecting to IBM MQ in both bindings and client mode, and offers both exactly-once and at-least-once delivery of data from IBM MQ to Apache Kafka.
forID: kc-source-mq
categories: [source]
connectorTitle: "IBM MQ"
---

{{site.data.reuse.es_name}} provides additional help for setting up a Kafka Connect environment and starting the MQ source connector. Log in to the {{site.data.reuse.es_name}} UI, click the **Toolbox** tab and scroll to the **Connectors** section.

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](../../es/connecting/mq/source/).    
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
