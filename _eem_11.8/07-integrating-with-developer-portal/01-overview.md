---
title: "Integrating with IBM API Connect Developer Portal"
excerpt: "Learn how to integrate Event Endpoint Management with IBM Developer Portal."
categories: dpo-integration
slug: overview
toc: true
---

You can integrate {{site.data.reuse.eem_name}} with [{{site.data.reuse.wm_portal_long}}](https://www.ibm.com/docs/en/api-connect/software/12.1.1?topic=portal-overview){:target="_blank"} to provide a unified developer experience to discover and consume both APIs and event streams. This integration enables you to publish virtual topics from {{site.data.reuse.eem_name}} directly to {{site.data.reuse.wm_portal_short}}, where users can discover them alongside REST APIs and other services.

## Benefits of integration
{: #benefits}

<!--_DRAFT COMMENT: Is this section required_-->

Integrating {{site.data.reuse.eem_name}} with {{site.data.reuse.wm_portal_short}} provides the following benefits:

- **Unified developer experience**: Users can discover both synchronous APIs and asynchronous event streams in a single portal, simplifying the process of building applications that use multiple integration patterns.
- **Broader socialization**: Publish your event streams to a wider audience through your organization's established developer portal.
- **Consistent governance**: Apply consistent access controls and governance policies across all your APIs and event streams.
- **Enhanced discoverability**: Leverage {{site.data.reuse.wm_portal_short}}'s search and categorization capabilities to help users find the right event streams for their needs.
- **Self-service access**: Enable users to subscribe to event streams through the familiar {{site.data.reuse.wm_portal_short}} interface.

## Integration architecture
{: #architecture}

The integration between {{site.data.reuse.eem_name}} and {{site.data.reuse.wm_portal_short}} consists of the following components:

- **{{site.data.reuse.eem_manager}}**: Where virtual topics are created, configured, and published to {{site.data.reuse.wm_portal_short}}.
- **{{site.data.reuse.wm_portal_short}}**: Where published virtual topics are displayed alongside other APIs and services for developer consumption.
- **{{site.data.reuse.egw}}**: Provides runtime access to virtual topics for applications that subscribe through {{site.data.reuse.wm_portal_short}}.

## Publishing virtual topics
{: #publishing-virtual-topics}

When you publish a virtual topic from {{site.data.reuse.eem_name}}, you can choose to publish it to:

- **{{site.data.reuse.eem_name}} catalog only**: The virtual topic is available only in the {{site.data.reuse.eem_name}} catalog.
- **{{site.data.reuse.wm_portal_short}} only**: The virtual topic is available only in {{site.data.reuse.wm_portal_short}}.
- **Both**: The virtual topic is available in both the {{site.data.reuse.eem_name}} catalog and {{site.data.reuse.wm_portal_short}}.

## Next steps
{: #next-steps}

- Learn about how to [configure {{site.data.reuse.eem_name}} to integrate it with {{site.data.reuse.wm_portal_short}}](../configure-eem-for-dpo-apic12/).
- Follow the steps to [publish virtual topics to {{site.data.reuse.wm_portal_short}}](../publishing-to-dpo).