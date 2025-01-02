---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.4.x.

## Release {{site.data.reuse.eem_current_version}}


### Add Kafka topics and clusters manually

{{site.data.reuse.eem_name}} release 11.4.1 introduces the ability to add [topics](../../describe/adding-topics/#adding-topics-manually) and [clusters](../../describe/managing-clusters/#adding-a-cluster-manually) manually. This is useful when your Kafka cluster is located behind a different firewall or is subject to specific network policies that restrict visibility from your {{site.data.reuse.eem_name}} instance.

### Support for Mutual TLS

{{site.data.reuse.eem_name}} version 11.4.1 introduces support for connecting to mTLS-secured Kafka clusters, and for securing [options](../key-concepts#option) with [mTLS](../../describe/option-controls#mtls).

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.4.1 compared to 11.4.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.4.1 icon]({{ 'images' | relative_url }}/11.4.1.svg "In Event Endpoint Management 11.4.1 and later.")

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.4.1 contains security and bug fixes.

## Release 11.4.0

### Deprecation of support for {{site.data.reuse.egw}} instances from {{site.data.reuse.eem_name}} version 11.2.0 and earlier

Support for using an {{site.data.reuse.egw}} from {{site.data.reuse.eem_name}} version 11.2.0 and earlier with 11.4.0 and later deployments will be removed in a future release.

By default, {{site.data.reuse.eem_name}} 11.4.0 and later versions do not allow any {{site.data.reuse.egw}} from {{site.data.reuse.eem_name}} version 11.2.0 and earlier to register with the {{site.data.reuse.eem_manager}}.

You can configure {{site.data.reuse.egw}} instances from {{site.data.reuse.eem_name}} version 11.2.0 and earlier to [continue to work with {{site.data.reuse.eem_manager}} instances from an 11.4.0 and later deployment](../../installing/upgrading#enable-earlier-egw-instances-to-register). However, this option will be removed in a future release.

### Support for Kubernetes 1.31

{{site.data.reuse.eem_name}} version 11.4.0 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for Kubernetes platforms version 1.31 that support the Red Hat Universal Base Images (UBI) containers.

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.4.0 contains security and bug fixes.

