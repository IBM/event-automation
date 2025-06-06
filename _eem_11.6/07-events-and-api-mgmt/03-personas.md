---
title: "API and event management personas"
excerpt: "Map API management personas to their Event management counterparts."
categories: api-and-event-management
slug: personas
toc: true
---

API management offerings typically have a range of actors (or personas) who all collaborate to make APIs available for consumption outside their immediate line of business. These personas range in scope and responsibility, including but not limited to:

- Those who implement and provide APIs for use
- Those who manage the lifecycle of a set of available APIs
- Those who manage infrastructure which securely allows APIs to be invoked 

These are in addition to the persona of an API user, who is external to the line of business, and who wants to consume the API in an application they are developing.

{{site.data.reuse.eem_name}} focuses on enabling two personas, which overlap with the following typical API management personas:

- Event author: the owner of an [event source](../../about/key-concepts/#event-source), who wants to share the events it contains across multiple lines of business. They document their event source, define [rules of engagement](../../integrating-with-apic/apic-eem-concepts/#policy) on it and publish [event endpoints](../../about/key-concepts/#event-endpoint) to a catalog for socialization, making the events available to others. This aligns with the API developer persona.
- Event viewer: an end user looking to discover and make use of events in an application or project. These users might be application developers, or non-technical users looking to make use of events in downstream processing and insight generation applications. This persona overlaps with the API management Application Developer persona.

When [combined with an API management solution](../combining-events-and-api-management/#benefits-of-combining-api-and-event-management), you can take advantage of the additional personas and capability provided by that management solution when socializing events alongside APIs. The event author can create APIs in an [event-focused user experience](../combining-events-and-api-management/#differences-between-api-and-event-management-solutions), and have the event-based APIs packaged, managed, and socialized in the same way as any other style API.
