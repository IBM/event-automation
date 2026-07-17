---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.8.0.

## Release {{site.data.reuse.eem_current_version}}
{: #release-1180}

### Terminology changes
{: #term-changes-1180}

{{site.data.reuse.eem_name}} release 11.8.0 contains the following terminology changes:

- **Options** are now called **Virtual topics**. Previously, the term **options** was used for event endpoints from the perspective of authors (Kafka administrators). To avoid confusion, the same term is now used for event endpoints from all perspectives. 
- **Event endpoints** are now called **Virtual topics**. Previously, the term **event endpoints** was used for options that were published to the catalog.
- **Event sources** are now called **topics**, or **source topics** in places where confusion with **virtual topics** is possible.

### Multiple topic subscriptions: applications
{: #applications-1180}

Users can now subscribe to multiple virtual topics with the same credentials by using a new feature called [**applications**](../key-concepts#application). Applications allow clients to access multiple virtual topics with the same credentials.

Existing subscriptions are converted to applications that subscribe to the same virtual topic and use the same credentials.

**Important:** To enable applications to subscribe to multiple topics, you must [convert](../../installing/converting-gateways) your existing gateways to provide new prerequisite configuration values.

### Content filtering
{: #content-filtering-1180}

You can now use [content filtering](../../describe/event-data-controls#content-filtering) to control which events are delivered to subscribers. Define filters based on event data or subscriber data to ensure that only relevant events are delivered.

### {{site.data.reuse.wm_portal_long}} integration
{: #webmethods-integration-1180}

{{site.data.reuse.eem_name}} 11.8.0 introduces an [integration with {{site.data.reuse.wm_portal_long}}](../../dpo-integration/overview) v12.1.1 or later. You can now publish virtual topics to [{{site.data.reuse.wm_portal_short}}](https://www.ibm.com/docs/en/api-connect/software/12.1.0?topic=portal-overview){:target="_blank"} in addition to the {{site.data.reuse.eem_name}} catalog.

### {{site.data.reuse.egw}} deployment and configuration enhancements
{: #operator-gateway-deploy}

In {{site.data.reuse.eem_name}} 11.8.0 and later, the {{site.data.reuse.eem_name}} operator can deploy the {{site.data.reuse.egw}} without requiring users to create a configuration in the {{site.data.reuse.eem_name}} UI beforehand.

{{site.data.reuse.egw}} configuration procedures are updated to suit the gateway deployment type: operator-managed gateways are configured in the custom resource, Kubernetes Deployment gateways are configured with a ConfigMap. For more details, see [gateway properties reference](../../reference/gateway-properties). 

