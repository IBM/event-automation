---
order: 1
excerpt: The FilePulse source connector parses, transforms, and streams files, in any format, into Kafka topics. You can use this connector to read files from a local-filesystem, Amazon S3, Azure Storage, and Google Cloud Storage.
forID: kc-source-filepulse
categories: [source]
connectorTitle: "FilePulse"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following steps:

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the {{page.connectorTitle}} {{page.categories}} connector by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url}}):

   {{site.data.reuse.kafkaconnectStep1_newcontent}}

2. {{site.data.reuse.kafkaconnectStep3_newcontent}}  

3. {{site.data.reuse.kafkaconnectStep4_newcontent}}
   
   {{site.data.reuse.kafkaconnectStep5_newcontent}} [connector documentation](https://streamthoughts.github.io/kafka-connect-file-pulse/){:target="_blank"}.     

      
4. {{site.data.reuse.kafkaconnectStep6_newcontent}}
