---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.2.x.

## Release {{site.data.reuse.ep_current_version}}


### Support for key and headers in the event source node

In {{site.data.reuse.ep_name}} release 1.2.0 and later, if your Kafka topic messages include key and headers information, {{site.data.reuse.ep_name}} automatically attempts to determine the key and headers, and you can define them as properties in the [event source node](../../nodes/eventnodes/#configuring-a-source-node).


### Apache Flink updated to 1.19.1

{{site.data.reuse.ibm_flink_operator}} version 1.2.0 update includes Apache Flink version 1.19.1.

### Updates to supported Kubernetes versions

To install {{site.data.reuse.ep_name}} 1.2.0 and later 1.2.x versions, ensure that you have installed a Kubernetes version 1.25 or later. For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).

### Support for IBM z13 (s390x) is removed

Support for IBM z13 (s390x) is removed in {{site.data.reuse.ep_name}} version 1.2.0 and later. Ensure that you deploy {{site.data.reuse.ep_name}} 1.2.0 on IBM z14 or later systems.

For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.2.0 and {{site.data.reuse.ibm_flink_operator}} version 1.2.0 contain security and bug fixes.