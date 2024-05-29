---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.2.x.

## Release {{site.data.reuse.eem_current_version}}


### Control external access through the {{site.data.reuse.egw}} 

In {{site.data.reuse.eem_name}} version 11.2.0, you can [control](../../installing/configuring/#configuring-external-access-to-the-event-gateway) the number of routes or ingresses that the {{site.data.reuse.egw}} exposes for external access by setting the`spec.maxNumKafkaBrokers` field in the `EventGateway` custom resource. The value of `spec.maxNumKafkaBrokers` must be set to the total number of Kafka brokers available for the {{site.data.reuse.egw}} to access. By default, the value is 20.

### Updates to supported Kubernetes versions

- {{site.data.reuse.eem_name}} version 11.2.0 introduces support for Kubernetes platforms version 1.30 that support the Red Hat Universal Base Images (UBI) containers.

- To install {{site.data.reuse.eem_name}} 11.2.0 and later 11.2.x versions, ensure that you have installed a Kubernetes version 1.25 or later. 

For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.2.0 contains security and bug fixes.


