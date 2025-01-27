---
order: 1
excerpt: Kafka Connect ArangoDB is a Kafka connector that takes records from Apache Kafka, translates them into database changes and performs them against ArangoDB.
forID: kc-sink-arangodb
categories: [sink]
connectorTitle: "ArangoDB"
classes: wide
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep2_newcontent}}

   To clone the Git repository and build the connector:

   ```shell
   git clone https://github.com/jaredpetersen/kafka-connect-arangodb.git
   cd kafka-connect-arangodb
   mvn package
   ``` 

2. {{site.data.reuse.kafkaconnectStep3_newcontent}} 

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}

   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://github.com/jaredpetersen/kafka-connect-arangodb?tab=readme-ov-file#configuration){:target="_blank"}.     

4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
