---
order: 1
excerpt: Use the JMS source connector to subscribe to messages on JMS queues and topics and write them to a Kafka topic.
forID: kc-source-jms
categories: [source]
connectorTitle: "JMS"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}
   
   **Note:** The **Releases** page contains JAR files for multiple connectors, so ensure that you download the latest JMS connector JAR file. For example, `kafka-connect-jms-<version>.zip`.
2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://docs.lenses.io/latest/connectors/kafka-connectors/sources/jms){:target="_blank"}. 
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
