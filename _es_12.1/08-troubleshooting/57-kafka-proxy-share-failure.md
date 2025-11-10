---
title: "Sharing a topic fails when Kafka Proxy is enabled"
excerpt: "Find out how to troubleshoot the issue where the Share for reuse feature in Event Streams does not work when Kafka Proxy is enabled."
categories: troubleshooting
slug: kafka-proxy-share-failure
toc: true
---

## Symptoms
{: #symptoms}

When [Kafka Proxy is enabled](../../installing/configuring/#enabling-collection-of-producer-metrics), clicking **Share for reuse** in the {{site.data.reuse.es_name}} UI to share Kafka topics with {{site.data.reuse.eem_name}} results in the following issues:

- A UI error notification appears, indicating the topic could not be shared. For example:
   ```shell
   Unable to share the topic
   Cannot access the Event Endpoint Management cluster. Contact your system administrator.
   ```
- The admin API pod logs an error similar to the following example:

  ```shell
  2025-07-16 12:48:36 ERROR com.ibm.eventstreams.discovery.handlers.EventManagerHandler - There are no eligible endpoints with component(KAFKA), type(EXTERNAL), auth(SCRAM_SHA_512)
  ```

## Causes
{: #causes}

Sharing topics from the {{site.data.reuse.es_name}} UI with {{site.data.reuse.eem_name}} requires access to Kafka endpoints. When Kafka Proxy is enabled, the configuration restricts this access, resulting in a failure to share topics.

## Resolving the problem
{: #resolving-the-problem}

To share topics in this scenario, [add the topics]({{ 'eem/describe/adding-topics/#add-topic' | relative_url }}) manually in the {{site.data.reuse.eem_name}} UI and connect the topics to the appropriate Kafka cluster.
