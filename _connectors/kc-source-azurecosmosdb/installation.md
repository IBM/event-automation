---
order: 1
excerpt: The Azure Cosmos DB source connector reads data from Azure Cosmos DB (SQL API) and sends the data to Kafka topics.
forID: kc-source-azurecosmosdb
categories: [source]
connectorTitle: "Azure Cosmos DB(SQL API)"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/microsoft/kafka-connect-cosmosdb?tab=readme-ov-file#common-configuration-properties){:target="_blank"}. 
       
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
