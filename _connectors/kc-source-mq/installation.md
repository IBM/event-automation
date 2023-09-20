---
order: 1
forID: kc-source-mq
categories: [source]
---

{{site.data.reuse.es_name}} provides additional help for setting up a Kafka Connect environment and starting the MQ source connector v1. Log in to the {{site.data.reuse.es_name}} UI, click the **Toolbox** tab and scroll to the **Connectors** section.

Alternatively, you can download the MQ source connector v1 from GitHub:

1. Download the connector plugin JAR file:

    Go to the connector [releases page](https://github.com/ibm-messaging/kafka-connect-mq-source/releases){:target="_blank"} and download the JAR file for the latest release.

2. {{site.data.reuse.kafkaConnectStep2_title}}

    {{site.data.reuse.kafkaConnectStep2_content_1}}
    {{site.data.reuse.kafkaConnectStep2_content1_example}}

3. {{site.data.reuse.kafkaConnectStep3_title}}

**Note:** The [IBM MQ source connector v2]({{ 'connectors/kc-source-ibm-mq2/installation' | relative_url}}), which is built on IBM MQ source connector v1, offers additional features such as [exactly-once delivery](../../es/connecting/mq/source/#exactly-once-message-delivery-semantics-in-ibm-mq-source-connector-v2) of data from IBM MQ into Apache Kafka.
