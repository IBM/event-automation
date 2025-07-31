---
title: "Integration overview"
excerpt: "Find out how you can integrate Event Endpoint Management with API Connect."
categories: integrating-with-apic
slug: overview
toc: true
---

You can setup an integration between {{site.data.reuse.eem_name}} and {{site.data.reuse.apic_long}}. This integration also allows published [Options](../../about/key-concepts/#option) in {{site.data.reuse.eem_name}} to be packaged, governed, and socialized alongside any other APIs you might already be managing in {{site.data.reuse.apic_short}}. By combining {{site.data.reuse.eem_name}} and {{site.data.reuse.apic_short}}, you can take advantage of [multi-form API Management](../apic-eem-concepts/#multi-form-api-management).

**Note:** To set up this integration, {{site.data.reuse.apic_short}} 10.0.6 or later is required:

- If integrating {{site.data.reuse.apic_short}} 10.0.6 with {{site.data.reuse.eem_name}}, both deployments must be installed as part of {{site.data.reuse.cp4i}} on the same OpenShift cluster.

- If integrating {{site.data.reuse.apic_short}} 10.0.7 or later with {{site.data.reuse.eem_name}}, there is no requirement to colocate deployments on the same OpenShift or other Kubernetes cluster, and there is no requirement to also deploy {{site.data.reuse.cp4i}}.

{{site.data.reuse.eem_name}} provides the capability to discover, describe and manage your Kafka [event endpoints](../../about/key-concepts/#event-endpoints) as an AsyncAPI which can then be [imported into {{site.data.reuse.apic_long}}](../generate-asyncapi). This can then be governed and socialized among other APIs.

[Enforcement](../apic-eem-concepts/#enforcement) of socialized AsyncAPIs from {{site.data.reuse.eem_name}} is provided by the [{{site.data.reuse.egw}}](../../about/key-concepts/#event-gateway). Using the gateway director model, {{site.data.reuse.eem_name}} provides the [{{site.data.reuse.egw}}](../../about/key-concepts/#event-gateway) for use with {{site.data.reuse.apic_short}}. {{site.data.reuse.eem_name}} is integrated as an [{{site.data.reuse.egw}} Service in the {{site.data.reuse.apic_short}} Cloud Manager](../configure-eem-for-apic).

Application developers can discover socialized event endpoints and configure their applications to consume from or produce to the stream of events through the [Developer Portal](../apic-eem-concepts/#developer-portal).
