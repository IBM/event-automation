---
order: 1
excerpt: The Snowflake sink connector ingests data from Kafka topics to Snowflake tables.
forID: kc-sink-snowflake
categories: [sink]
connectorTitle: "Snowflake"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

    a. {{site.data.reuse.kafkaconnectStep1_newcontent}}    

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   a. {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://docs.snowflake.com/en/user-guide/kafka-connector){:target="_blank"}.
       
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}

