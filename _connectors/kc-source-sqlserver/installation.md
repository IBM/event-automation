---
order: 1
forID: kc-source-sqlserver
categories: [source]
connectorTitle: "SQL Server (Debezium)"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}.
   
   To obtain the connector JAR file, go to the connector [Maven repository](https://repo1.maven.org/maven2/io/debezium/debezium-connector-sqlserver/){:target="_blank"}, open the directory for the latest version, and download the file ending with `-plugin.tar.gz`.

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}

   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/debezium/debezium/tree/main/debezium-connector-sqlserver){:target="_blank"}.      
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}