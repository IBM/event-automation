---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---


## Update to Flink support policy

IBM's conditions of support for Apache Flink in {{site.data.reuse.ea_long}} has been expanded. For more information, see the [support policy statement]({{ '/support/support-policy/' | relative_url}}).

Find out what is new in {{site.data.reuse.ep_name}} version 1.4.x.


## Release {{site.data.reuse.ep_current_version}}


### Optimized Flink jobs when running flows containing sink nodes in the {{site.data.reuse.ep_name}} UI

In {{site.data.reuse.ep_name}} 1.4.2 or later, when running flows containing event destination nodes in the {{site.data.reuse.ep_name}} authoring UI:

- Only one Flink job is deployed to collect the output events displayed in the UI. In earlier releases, a second job is also deployed.
- For flows containing [database](../../nodes/enrichmentnode/#database), [watsonx.ai](../../nodes/enrichmentnode/#watsonx-node), or [API](../../nodes/enrichmentnode/#enrichment-from-an-api) nodes, the number of calls to the database, watsonx.ai, or the API server is reduced by half. For such flows, this optimization also prevents discrepancies when the output events displayed in the UI could be different from those written in the Kafka output topic, if successive calls to the database, watsonx.ai, or the API server produce different results.

**Note:** When [upgrading](../../installing/upgrading/) from {{site.data.reuse.ep_name}} 1.4.1 or earlier, any flows that are running in the {{site.data.reuse.ep_name}} authoring UI are automatically stopped. You can run those flows again after the upgrade of both {{site.data.reuse.ep_name}} and {{site.data.reuse.ibm_flink_operator}}.

### Enhancements for better insights of a running flow

In {{site.data.reuse.ep_name}} 1.4.2 and later, when you [run the flow](../../getting-started/canvas/#run-flow), you can view the output events of any particular node and the number of output events for all the nodes. You can also filter output events by searching for a particular text and find matching events of any node.


### Temporal join: Support for multiple join conditions in the primary key

In Event Processing 1.4.2 and later, you can add multiple join conditions in the primary key for the [temporal join](../../nodes/joins/#temporal-join) node.

### Collection of usage metrics

To improve product features and performance, {{site.data.reuse.ep_name}} 1.4.2 and later collects data about {{site.data.reuse.ep_name}} instances by default. This is in addition to the data collected about Flink instances in 1.4.1 and later.

You can [disable data collection]({{ '/support/licensing/#usage-metrics' | relative_url }}) at any time.

### Support for {{site.data.reuse.openshift}} 4.19

{{site.data.reuse.ep_name}} version 1.4.2 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.19.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.4.2 compared to 1.4.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.4.2 icon]({{ 'images' | relative_url }}/1.4.2.svg "In Event Processing 1.4.2 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.4.2 and {{site.data.reuse.ibm_flink_operator}} version 1.4.2 contain security and bug fixes.



## Release 1.4.1

### Join: window join

In {{site.data.reuse.ep_name}} 1.4.1 and later, you can use the [window join](../../nodes/joins/#window-join) node to merge two input event streams based on a join condition that matches events within the same time window.

### Join: temporal join

In Event Processing 1.4.1 and later, you can use the [temporal join](../../nodes/joins/#temporal-join) node to merge a main event source with the most recent supplementary event source based on a join condition and timestamp.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.4.1 compared to 1.4.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.4.1 icon]({{ 'images' | relative_url }}/1.4.1.svg "In Event Processing 1.4.1 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.4.1 and {{site.data.reuse.ibm_flink_operator}} version 1.4.1 contain security and bug fixes.


## Release 1.4.0


### Collection of usage metrics for Flink instances

To improve product features and performance, {{site.data.reuse.ep_name}} 1.4.1 and later collects data about the usage of deployments by default. Data is collected about all Flink application and session job instances.

You can [disable data collection]({{ '/support/licensing/#usage-metrics' | relative_url }}) at any time.


### New tutorial: nudge customers with abandoned cart by using the watsonx.ai node

A new [tutorial]({{ 'tutorials/notify-abandoned-orders/' | relative_url}}) is available that shows how you can use the watsonx.ai node to check abandoned shopping carts, and attempt to persuade customers to complete their purchase by highlighting the product with the most positive review.


### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.4.0 and {{site.data.reuse.ibm_flink_operator}} version 1.4.0 contain security and bug fixes.

