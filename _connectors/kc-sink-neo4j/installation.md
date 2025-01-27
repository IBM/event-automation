---
order: 1
excerpt: The Neo4j sink connector ingests events from Apache Kafka to Neo4j through templated Cypher statements.
forID: kc-sink-neo4j
categories: [sink]
connectorTitle: "Neo4j"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/neo4j-contrib/neo4j-streams/?tab=readme-ov-file#documentation){:target="_blank"}.     

              
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
