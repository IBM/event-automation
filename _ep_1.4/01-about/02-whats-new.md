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


### Join: window join

In {{site.data.reuse.ep_name}} 1.4.1 and later, you can use the [window join](../../nodes/joins/#window-join) node to merge two input event streams based on a join condition that matches events within the same time window.

### Join: temporal join

In Event Processing 1.4.1 and later, you can use the [temporal join](../../nodes/joins/#temporal-join) node to merge a main event source with the most recent supplementary event source based on a join condition and timestamp.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.4.1 compared to 1.4.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.4.1 icon]({{ 'images' | relative_url }}/1.4.1.svg "In Event Processing 1.4.1 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.4.1 and {{site.data.reuse.ibm_flink_operator}} version 1.4.1 contain security and bug fixes.


## Release 1.4.0


### Collection of usage metrics

To improve product features and performance, {{site.data.reuse.ep_name}} 1.4.1 and later collects data about the usage of deployments by default. Data is collected about all Flink application and session job instances.

You can [disable data collection]({{ '/support/licensing/#usage-metrics' | relative_url }}) at any time.


### New tutorial: nudge customers with abandoned cart by using the watsonx.ai node

A new [tutorial]({{ 'tutorials/notify-abandoned-orders/' | relative_url}}) is available that shows how you can use the watsonx.ai node to check abandoned shopping carts, and attempt to persuade customers to complete their purchase by highlighting the product with the most positive review.


### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.4.0 and {{site.data.reuse.ibm_flink_operator}} version 1.4.0 contain security and bug fixes.

