---
order: 1
excerpt: The JDBC sink connector for copying data from Apache Kafka into a database.
forID: kc-sink-jdbc-aiven
categories: [sink]
connectorTitle: "JDBC"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}
   
   Add connector dependencies to your Kafka Connect environment. For example, the Oracle JDBC driver is required when connecting to Oracle databases.

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/Aiven-Open/jdbc-connector-for-apache-kafka?tab=readme-ov-file#documentation){:target="_blank"}.   
    
        
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
