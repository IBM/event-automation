---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 12.0.x.

## Release {{site.data.reuse.es_current_version}}
{: #release-1200}

### Kafka version upgraded to 4.0.0
{: #kafka-version-upgraded-to-400}

{{site.data.reuse.es_name}} version 12.0.0 includes Kafka release 4.0.0, and supports the use of all Kafka interfaces.

Kafka 4.0.0 introduces several significant improvements and includes updates to the Kafka APIs that might require changes to existing Kafka client, streaming, and Connect applications. Review the [notable changes in Kafka 4.0.0](https://kafka.apache.org/40/documentation/#upgrade_servers_400_notable){:target="_blank"} carefully, and [plan your upgrade](../../installing/upgrading/#planning-your-upgrade) of existing deployments to avoid any impact on your Kafka applications.

### Java version and Kafka client updates
{: #Java-version-and-kafka-client-updates}

{{site.data.reuse.es_name}} version 12.0.0 introduces changes to Java version requirements and client compatibility. Ensure that your applications are using [supported Java versions and client libraries](../../installing/prerequisites/#kafka-clients).


### Collection of usage metrics
{: #collection-of-usage-metrics}

To improve product features, performance, and technical support, {{site.data.reuse.es_name}} 12.0.0 and later collects data about the usage of deployments by default. Data is collected about all {{site.data.reuse.es_name}} instances.

You can [disable data collection]({{ '/support/licensing/#usage-metrics' | relative_url }}) at any time.

### Support for {{site.data.reuse.openshift}} 4.19
{: #support-for-openshift-419}

{{site.data.reuse.es_name}} version 12.0.0 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for {{site.data.reuse.openshift}} 4.19.

### Security and bug fixes
{: #security-and-bug-fixes}

{{site.data.reuse.es_name}} release 12.0.0 contains security and bug fixes.

