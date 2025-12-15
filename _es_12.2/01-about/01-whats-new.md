---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 12.2.x.

## Release {{site.data.reuse.es_current_version}}


### Support for auto-scaling Kafka brokers
{: #support-for-auto-scaling-kafka-brokers}

{{site.data.reuse.es_name}} 12.2.0 and later include support for automatic scaling of Kafka brokers. You can configure auto-scaling by creating a Kubernetes HorizontalPodAutoscaler (HPA), which dynamically adjusts the number of broker pods based on resource usage. Pairing this with Cruise Control enables topic partitions to rebalance when Kafka brokers are added or removed. For more information, see the [auto-scaling](../../administering/scaling/#auto-scaling-kafka-brokers) section.

### Collect producer metrics without the Kafka Proxy
{: #collect-producer-metrics-without-the-kafka-proxy}

In {{site.data.reuse.es_name}} release 12.2.0 and later, you can collect producer client metrics without depending on the Kafka Proxy. For more information, see [configuring](../../installing/configuring#enabling-collection-of-producer-metrics).

### Deprecation of the Kafka Proxy
{: #deprecation-of-the-kafka-proxy}

The Kafka Proxy is deprecated in {{site.data.reuse.es_name}} 12.2.0 and later. Existing connections use Kafka Proxy routes to ensure your applications can continue to access Kafka. For more information, see the [post-upgrade tasks](../../installing/upgrading#remove-kafka-proxy).

### Support for {{site.data.reuse.openshift}} 4.20
{: #support-for-openshift-420}

{{site.data.reuse.es_name}} version 12.2.0 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for {{site.data.reuse.openshift}} 4.20.


### Security and bug fixes
{: #security-and-bug-fixes-1220}

{{site.data.reuse.es_name}} release 12.2.0 contains security and bug fixes.