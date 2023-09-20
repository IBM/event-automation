---
order: 1
forID: kc-sink-mq
categories: [sink]
---


{{site.data.reuse.es_name}} provides additional help for setting up a Kafka Connect environment and starting the MQ sink connector v1. Log in to the {{site.data.reuse.es_name}} UI, click the **Toolbox** tab and scroll to the **Connectors** section.

Alternatively, you can download the MQ sink connector from GitHub:

1. Download the connector plugin JAR file:

    Go to the connector [releases page](https://github.com/ibm-messaging/kafka-connect-mq-sink/releases){:target="_blank"} and download the JAR file for the latest release.

2. {{site.data.reuse.kafkaConnectStep2_title}}

    {{site.data.reuse.kafkaConnectStep2_content_1}}
    {{site.data.reuse.kafkaConnectStep2_content1_example}}

3. {{site.data.reuse.kafkaConnectStep3_title}}

**Note:** For additional features, such as [exactly-once delivery](../mq/sink/#exactly-once-message-delivery-semantics-in-ibm-mq-sink-connector-v2) of data from Apache Kafka into IBM MQ, see the [IBM MQ sink connector v2]({{ 'connectors/kc-sink-ibm-mq2/installation' | relative_url}}), which is an advanced version of the connector built on the v1 version.