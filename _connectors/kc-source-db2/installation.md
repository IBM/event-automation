---
order: 1
excerpt: Debezium is an open-source distributed platform for change data capture (CDC). Debezium’s Db2 Connector can monitor row-level changes in the schemas of a Db2 database and record them to separate Kafka topics.
forID: kc-source-db2
categories: [source]
connectorTitle: "Db2 (Debezium)"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}.
   
   To obtain the connector JAR file, go to the connector [Maven repository](https://repo1.maven.org/maven2/io/debezium/debezium-connector-db2/){:target="_blank"}, open the directory for the latest version, and download the file ending with `-plugin.tar.gz`.

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}

   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://debezium.io/documentation/reference/3.3/connectors/db2.html){:target="_blank"}.      
    
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}