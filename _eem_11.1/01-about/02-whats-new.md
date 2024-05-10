---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.1.x.

## Release {{site.data.reuse.eem_current_version}}

### Produce events

{{site.data.reuse.eem_name}} version 11.1.5 introduces the ability for client applications to [write events](../key-concepts/#produce) to an [event endpoint](../key-concepts/#event-endpoint) through the {{site.data.reuse.egw}}. Kafka administrators can manage these connections with [schema enforcement](../../describe/option-controls/#schema-enforcement) and [approval controls](../../describe/option-controls/#approval-controls). 

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.1.5 compared to 11.1.4 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.1.5 icon]({{ 'images' | relative_url }}/11.1.5.svg "In Event Endpoint Management 11.1.5 and later")

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.1.5 contains security and bug fixes.


## Release 11.1.4

### Updates to publish options

{{site.data.reuse.eem_name}} 11.1.4 introduces a user interface update for publishing options. For more information, see [Creating an option](../../describe/managing-topics#create_option) and [Publishing options](../../describe/publishing-topics).

### Support for {{site.data.reuse.openshift}} 4.15

{{site.data.reuse.eem_name}} version 11.1.4 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for {{site.data.reuse.openshift}} 4.15.

### Support for Kubernetes 1.29

{{site.data.reuse.eem_name}} version 11.1.4 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for Kubernetes platforms version 1.29 that support the Red Hat Universal Base Images (UBI) containers.

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.1.4 contains security and bug fixes.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.1.4 compared to 11.1.3 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.1.4 icon]({{ 'images' | relative_url }}/11.1.4.svg "In Event Endpoint Management 11.1.4 and later")

## Release 11.1.3

### Support for Linux on IBM Z

In addition to Linux 64-bit (x86_64) systems, {{site.data.reuse.eem_name}} 11.1.3 and later is also supported on OpenShift deployments running on Linux on IBM Z systems (s390x).

**Note:** You cannot install {{site.data.reuse.eem_name}} on other Kubernetes platforms except OpenShift when running on IBM Z systems.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.1.3 compared to 11.1.2 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.1.3 icon]({{ 'images' | relative_url }}/11.1.3.svg "In Event Endpoint Management 11.1.3 and later")

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.1.3 contains security and bug fixes.

## Release 11.1.2

### New controls for options

{{site.data.reuse.eem_name}} release 11.1.2 introduces two new [controls for options](../../describe/option-controls).
  * **Redaction**: A [redaction control](../../describe/option-controls#redaction) enables you to hide personal information (PI).
  * **Schema filtering**: The [schema filtering control](../../describe/option-controls#schema-filter) ensures consistency by replacing any messages that do not match the schema that is provided in the topic with a null message.

### Support for exporting as AsyncAPI 3.0

{{site.data.reuse.eem_name}} release 11.1.2 introduces support for exporting AsyncAPI 3.0 specification documents for your event sources and event endpoints published in the catalog. You can also export these in AsyncAPI 2.6 and 2.1 format. For more information, see [exporting topic details](../../consume-subscribe/discovering-topics#exporting-topic-details).

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.1.2 compared to 11.1.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.1.2 icon]({{ 'images' | relative_url }}/11.1.2.svg "In Event Endpoint Management 11.1.2 and later")

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.1.2 contains security and bug fixes.

## Release 11.1.1

### Options for topics

{{site.data.reuse.eem_name}} release 11.1.1 introduces [options](../../about/key-concepts#option). Kafka administrators can [create](../../describe/managing-topics#create_option) options for a topic, which enables administrators to [control](../../describe/adding-topics/) how the topic's stream of events are made available within the catalog.

### Approval control

{{site.data.reuse.eem_name}} release 11.1.1 introduces approval control. Now you can control who can subscribe to your topics. For more information, see [approval controls for options](../../describe/option-controls#approval-controls) and [subscription approvals](../../consume-subscribe/approval-requests).

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.1.1 compared to 11.1.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later")

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.1.1 contains security and bug fixes.

## Release 11.1.0


### {{site.data.reuse.eem_name}} Admin API

{{site.data.reuse.eem_name}} release 11.1.0 introduces the [{{site.data.reuse.eem_name}} Admin API]({{ 'eem-api' | relative_url }}) for accessing {{site.data.reuse.eem_name}} features programmatically. Access to the Admin API is [controlled by tokens](../../security/api-tokens).

### Support for {{site.data.reuse.apic_long}} in non-{{site.data.reuse.cp4i}} deployments

{{site.data.reuse.eem_name}} release 11.1.0 [can be integrated with {{site.data.reuse.apic_long}} 10.0.7 and later](../../integrating-with-apic/overview) without requiring an {{site.data.reuse.cp4i}} deployment.

### Support for {{site.data.reuse.openshift}} 4.14

{{site.data.reuse.eem_name}} 11.1.0 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for {{site.data.reuse.openshift}} 4.14.

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.1.0 contains security and bug fixes.

