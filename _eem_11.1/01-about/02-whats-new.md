---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.1.x.

## Release {{site.data.reuse.eem_current_version}}

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

### Support for IBM API Connect in non-{{site.data.reuse.cp4i}} deployments

{{site.data.reuse.eem_name}} release 11.1.0 [can be integrated with IBM API Connect 10.0.7 and later](../../integrating-with-apic/overview) without requiring an {{site.data.reuse.cp4i}} deployment.

### Support for {{site.data.reuse.openshift}} 4.14

{{site.data.reuse.eem_name}} 11.1.0 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for {{site.data.reuse.openshift}} 4.14.

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.1.0 contains security and bug fixes.

