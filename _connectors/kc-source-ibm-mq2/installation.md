---
order: 1
forID: kc-source-ibm-mq2
categories: [source]
---

{{site.data.reuse.es_name}} provides additional help for setting up a Kafka Connect environment and starting the IBM MQ source connector v2. Log in to the {{site.data.reuse.es_name}} UI, click the **Toolbox** tab and scroll to the **Connectors** section.

**Note:** For information about exactly-once delivery offered by IBM MQ source connector v2, see how to [set up exactly-once delivery](../../es/connecting/mq/source/#exactly-once-message-delivery-semantics-in-ibm-mq-source-connector-v2).

Follow the instructions to download the MQ source connector v2:

1. Download the connector plugin JAR file:

    Go to [IBM Fix Central](https://ibm.biz/ea-fix-central){:target="_blank"} and download the JAR file for the latest release.

2. {{site.data.reuse.kafkaConnectStep2_title}}

    {{site.data.reuse.kafkaConnectStep2_content_1}}
    {{site.data.reuse.kafkaConnectStep2_content1_example}}

3. {{site.data.reuse.kafkaConnectStep3_title}}
