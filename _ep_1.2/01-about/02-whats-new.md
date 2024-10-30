---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.2.x.



## Release {{site.data.reuse.ep_current_version}}

### Use your Flink SQL with custom nodes

In {{site.data.reuse.ep_name}} 1.2.2 and later, you can now use **Custom** nodes to unlock advanced SQL capabilities and run complex queries. Three new custom nodes are available: SQL source, SQL processor, and SQL destination. These nodes support Flink SQL, and can be configured and edited to meet your specific use cases. With the introduction of custom nodes, it is now possible to create flows that support changelog stream. For more information, see [custom nodes](../../nodes/custom) and the associated [tutorial]({{'/tutorials/event-processing-examples/example-05' | relative_url}}) about deduplicating repeated events.

### {{site.data.reuse.ep_name}} add-on for {{site.data.reuse.cp4i}} 

{{site.data.reuse.ep_name}} 1.2.2 and later is available as an add-on for {{site.data.reuse.cp4i}}. For more information, see [licensing]({{ 'support/licensing/#event-processing-add-on-for-ibm-cloud-pak-for-integration' | relative_url }}).

### Support for {{site.data.reuse.openshift}} 4.17

{{site.data.reuse.ep_name}} version 1.2.2 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.17.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.2.2 compared to 1.2.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.2.2 icon]({{ 'images' | relative_url }}/1.2.2.svg "In Event Processing 1.2.2 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.2.2 and {{site.data.reuse.ibm_flink_operator}} version 1.2.2 contain security and bug fixes.

## Release 1.2.1

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.2.1 and {{site.data.reuse.ibm_flink_operator}} version 1.2.1 contain security and bug fixes.

## Release 1.2.0

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