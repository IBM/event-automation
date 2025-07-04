---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.6.x.

## Release {{site.data.reuse.eem_current_version}}

### Wildcard redaction in an array of objects or simple types

{{site.data.reuse.eem_name}} release 11.6.2 introduces support for wildcard array redaction. You can [redact](../../describe/option-controls/#redaction) specific fields within an array of objects, or all values in an array of simple types.

### OAuth Kafka cluster support

- {{site.data.reuse.eem_name}} release 11.6.2 introduces Kafka OAuth support for Amazon Managed Streaming for Apache Kafka (Amazon MSK) and Keycloak implementations for new 11.6.x {{site.data.reuse.egw}} instances.
- {{site.data.reuse.egw}}s from {{site.data.reuse.eem_name}} 11.5.x or earlier cannot connect to Kafka clusters that use OAuth. For more information, see [the related troubleshooting topic](../../troubleshooting/v2-gateways-oauth).

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.6.2 contains security and bug fixes.

### Documentation enhancements

{{site.data.reuse.eem_name}} release 11.6.2 introduces improvements to the documentation:

- TLS configuration section moved from [Configuring](../../installing/configuring) to a dedicated page under the **SECURITY** section: [Configuring TLS](../../security/config-tls).
- [Managing clusters](../../administering/managing-clusters), [Managing gateways](../../administering/managing-gateways), [Managing assets](../../administering/managing-assets), and [Audit logging](../../administering/audit-logging) pages moved to a new **ADMINISTERING** section.


### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.6.2 compared to 11.6.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.6.2 icon]({{ 'images' | relative_url }}/11.6.2.svg "In Event Endpoint Management 11.6.2 and later.").

## Release 11.6.1


### Documentation enhancements

{{site.data.reuse.eem_name}} release 11.6.1 introduces a restructured {{site.data.reuse.eem_manager}} [upgrade](../../installing/upgrading/) procedure. 

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.6.1 contains security and bug fixes.

## Release 11.6.0

### Admin role CA certificate management

{{site.data.reuse.eem_name}} release 11.6.0 introduces admin management of the CA certificates that are used to secure [Mutual TLS controls](../../describe/option-controls#mtls). For more information, see [Managing CA certificates](../../security/ca-certs).


### Asset management  

In {{site.data.reuse.eem_name}} release 11.6.0 and later, you can [transfer assets](../../administering/managing-assets) between users who have the correct permissions within their assigned role to own the asset.

### Collection of usage metrics

To improve product features and performance, {{site.data.reuse.eem_name}} 11.6.0 and later collects data about the usage of deployments by default. Data is collected about all {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.

You can [disable data collection]({{ '/support/licensing/#usage-metrics' | relative_url }}) at any time.


### Kafka record tracing through the {{site.data.reuse.egw}}

In {{site.data.reuse.eem_name}} release 11.6.0 and later, you can configure the {{site.data.reuse.egw}} to export OpenTelemetry trace information about records processed. For more information, see [how to export trace data with OpenTelemetry](../../installing/configuring/#exporting-traces-with-opentelemetry).

### API call tracing through the {{site.data.reuse.eem_manager}}

![Event Endpoint Management 11.6.2 icon]({{ 'images' | relative_url }}/11.6.2.svg "In Event Endpoint Management 11.6.2 and later.") In {{site.data.reuse.eem_name}} release 11.6.2 and later, you can configure the {{site.data.reuse.egw}} to export OpenTelemetry trace information about records processed. For more information, see [how to export trace data with OpenTelemetry](../../installing/configuring/#exporting-traces-with-opentelemetry).


### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.6.0 contains security and bug fixes.