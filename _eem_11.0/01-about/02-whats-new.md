---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.0.x.

## Release 11.0.5

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.0.5 contains a bug fix [which allows credentials generated in IBM API Connect to be accepted by the {{site.data.reuse.egw}}](../../troubleshooting/eem-apic-clients-do-not-connect).

## Release 11.0.4

### Support for other Kubernetes platforms

In addition to the existing support for the {{site.data.reuse.openshift}}, {{site.data.reuse.eem_name}} version 11.0.4 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for [installing](../../installing/installing-on-kubernetes/) on other Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.0.4 compared to 11.0.3 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.0.4 icon]({{ 'images' | relative_url }}/11.0.4.svg "In Event  Endpoint Management 11.0.4.")

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.0.4 contains security and bug fixes.

### Known issues

[Credentials generated in IBM API Connect are not accepted by the {{site.data.reuse.egw}}](../../troubleshooting/eem-apic-clients-do-not-connect).

## Release 11.0.3

### Catalog search

{{site.data.reuse.eem_name}} 11.0.3 adds a way to [search the catalog](../../consume-subscribe/discovering-topics#searching-the-catalog) where users can more easily discover and locate a specific topic, or range of topics.


### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.0.3 compared to 11.0.2 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.0.3 icon]({{ 'images' | relative_url }}/11.0.3.svg "In Event  Endpoint Management 11.0.3.")

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.0.3 contains security and bug fixes.

### Known issues

[Manager logs contain `java.security.NoSuchAlgorithmException` messages](../../troubleshooting/no-such-algorithm-log).

## Release 11.0.2

### Subscription management

{{site.data.reuse.eem_name}} 11.0.2 adds a [subscriptions page](../../consume-subscribe/managing-subscriptions) where users can view the topics they have subscribed to, and delete their subscriptions if required.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.0.2 compared to 11.0.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.0.2 icon]({{ 'images' | relative_url }}/11.0.2.svg "In Event Endpoint Management 11.0.2.")

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.0.2 contains security and bug fixes.

### Known issues

- [Manager logs contain `java.security.NoSuchAlgorithmException` messages](../../troubleshooting/no-such-algorithm-log).

## Release 11.0.1

{{site.data.reuse.eem_name}} release 11.0.1 contains stability and bug fixes.

### Known issues

- [Manager logs contain `java.security.NoSuchAlgorithmException` messages](../../troubleshooting/no-such-algorithm-log).

## Release 11.0.0

{{site.data.reuse.eem_name}} 11.0.0 simplifies how users can discover, socialize, and use events in your organization. This release also makes {{site.data.reuse.eem_name}} a stand-alone capability, meaning it no longer requires an instance of IBM API Connect instance to be deployed.

Find out what is new in {{site.data.reuse.eem_name}} version 11.0.0.

### Simpler socialization with enhanced UI

The {{site.data.reuse.eem_name}} 11.0.0 UI is available with an enhanced user experience, [making Kafka topic discovery](../../describe/adding-topics), and [socialization](../../describe/publishing-topics) simpler.

### Integration with IBM API Connect

You can [integrate {{site.data.reuse.eem_name}} 11.0.0 with IBM API Connect 10.0.6](../../integrating-with-apic/overview), when deployed as part of {{site.data.reuse.cp4i}}.

### Simpler installation

{{site.data.reuse.eem_name}} 11.0.0 can be installed with significantly reduced requirements and prerequisites compared to prior releases.

### Gateway groups

{{site.data.reuse.eem_name}} 11.0.0 has updated Event Gateway deployment options and topologies by using [gateway groups](../key-concepts#gateway-group).

### Known issues

- [Manager logs contain `java.security.NoSuchAlgorithmException` messages](../../troubleshooting/no-such-algorithm-log).
- [{{site.data.reuse.egw}} in `Evicted` state](../../troubleshooting/evicted-gateway)
- [Invalid schema payload in exported AsyncAPI for API Connect](../../troubleshooting/invalid-async-api)