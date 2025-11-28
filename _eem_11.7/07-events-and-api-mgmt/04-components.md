---
title: "Component topology"
excerpt: "Understand the deployment shape and topology of an API and Event management solution."
categories: api-and-event-management
slug: components
toc: true
---

API management systems consist of a number of deployed components. These components typically encompass a particular function or phase of the API management process. For example, an API management solution might contain:

- Management components: where APIs are authored, [policies](../../integrating-with-apic/apic-eem-concepts#policy) applied, and API usage managed. In addition, governance and Day 2 operations and management activities of API usage are also managed from here.
- Socialization components: where APIs are documented and socialized for external use.
- Gateway components: a runtime service that exposes published APIs for clients to connect to, abstracts the service providing the API, and applies configured governance or policy rules that are enforced on clients utilizing the API.

In offerings such as {{site.data.reuse.apic_long}}, the management component (API manager) enables APIs to be published to the socialization (Developer Portal) and gateway (DataPower API gateway) components to enable API adoption and use. Additional components, such as analytics processing, can also be integrated into API management solutions to provide further insight into API usage and trends as adoption grows.

{{site.data.reuse.eem_name}} consists of two components, which together provide a similar set of capabilities to an API management solution:

- {{site.data.reuse.eem_manager}}: where [event sources](../../about/key-concepts/#event-source) are authored, [controls](../../about/key-concepts/#controls) applied on them, and they are socialized for external use.
- [{{site.data.reuse.egw}}](../../about/key-concepts/#event-gateway): a runtime service which hosts [event endpoints](../../about/key-concepts/#event-endpoint) that are exposed for clients to connect to, abstracts the service providing the event endpoint, and applies configured governance or controls that are enforced on clients utilizing the event endpoint. These work together in an [{{site.data.reuse.egw}} group](../../about/key-concepts/#gateway-group) to provide deployment, flexibility, and scaling options.

The component architecture and topology for an {{site.data.reuse.eem_name}} instance reflects the specific requirements of an event management [use case](../combining-events-and-api-management/#differences-between-api-and-event-management-solutions), and can expose and manage how an event source is utilized externally. However, it is possible to [integrate and combine](../../integrating-with-apic/overview) the event management capability provided by {{site.data.reuse.eem_name}} with the API management and governance capability of {{site.data.reuse.apic_long}} to enable the governance and socialization of both APIs and events in one place. 

This provides [event authors](../personas/) the features to describe and define their event sources in an event-focused manner, to socialize these event endpoints as APIs, to leverage the capabilities of the {{site.data.reuse.eem_name}} {{site.data.reuse.egw}} to provide event-specific enforcement, and provides API lifecycle and governance management options for handling the entire organization's APIs in one place.

