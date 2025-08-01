---
order: 1
excerpt: The MQTT source connector streams data from MQTT topics into Kafka topics.
forID: kc-source-mqtt
categories: [source]
connectorTitle: "MQTT"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}
   
   **Note:** The **Releases** page contains JAR files for multiple connectors, so ensure that you download the latest MQTT connector JAR file. For example, `kafka-connect-mqtt-<version>.zip`.
2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://docs.lenses.io/latest/connectors/kafka-connectors/sources/mqtt){:target="_blank"}. 
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
