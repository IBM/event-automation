---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.0.x.

## Release {{site.data.reuse.eem_current_version}}

{{site.data.reuse.eem_name}} 11.0.1 contains stability and bug fixes.

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