---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.6.x.

## Release {{site.data.reuse.eem_current_version}}


### Admin role CA certificate management

{{site.data.reuse.eem_name}} release 11.6.0 introduces admin management of the CA certificates that are used to secure [Mutual TLS controls](../../describe/option-controls#mtls). For more information, see [Managing CA certificates](../../security/ca-certs).


### Asset management  

In {{site.data.reuse.eem_name}} release 11.6.0 and later, you can [transfer assets](../../security/managing-assets) between users who have the correct permissions within their assigned role to own the asset.

### Collection of usage metrics

To improve product features and performance, {{site.data.reuse.eem_name}} 11.6.0 and later collects data about the usage of deployments by default. Data is collected about all {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.

You can [disable data collection]({{ '/support/licensing/#usage-metrics' | relative_url }}) at any time.


### Kafka record tracing through the {{site.data.reuse.egw}}

In {{site.data.reuse.eem_name}} release 11.6.0 and later, you can configure the {{site.data.reuse.egw}} to export OpenTelemetry trace information about records processed. For more information, see [how to export trace data with OpenTelemetry](../../installing/configuring/#exporting-traces-with-opentelemetry).

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.6.0 contains security and bug fixes.