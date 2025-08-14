---
title: "Why combine API and event management"
excerpt: "Understand the differences and benefits of combining API management with event management."
categories: api-and-event-management
slug: combining-events-and-api-management
toc: true
---

Most APIs that are managed and exposed by API management solutions have been synchronous in nature. With new API specifications maturing, it is now possible to describe a range of different API and technology styles, and to subsequently manage their reuse within an organization. This unification is referred to as [multi-form API management](../../integrating-with-apic/apic-eem-concepts/#multi-form-api-management).

The following sections describe the value and opportunities available when combining API and event management solutions. In addition, key differences in the considerations required when describing, managing, socializing and using each type of APIs are also described, and why separate capabilities are therefore used to manage them.

## Benefits of combining API and event management
{: #benefits-of-combining-api-and-event-management}

APIs, and API management, are not new concepts. The ability to have governed interfaces which can be socialized broadly allows developers to discover and use APIs to deliver new applications quickly, while the providers of those APIs can manage usage of the APIs as required. API management offerings such as {{site.data.reuse.apic_long}} provide a full set of capabilities which provide the following features to manage your APIs:

- Describe and discover APIs.
- Bundle APIs into products which are governed through a lifecycle.
- Manage access to the APIs by using a gateway
- Socialize APIs through a developer portal which becomes a focal point for API discovery and usage within an organization.

These concepts and capabilities have resonated across industries, with API management offerings being used to help manage and gain value from an organization's API estate.

To date, most APIs managed by capabilities such as {{site.data.reuse.apic_long}} have been synchronous in nature, thanks to specification formats such as OpenAPI providing a standardized way of describing and contracting API interactions. With new specifications such as AsyncAPI gaining traction and adoption, new types of APIs are starting to be described. While both approaches describe an interface to access a back-end service, on a use case by use case basis, one style of interaction might be more beneficial to leverage. For example, it is more advantageous to subscribe to a series of stock market events delivered and processed as they occur, compared to a synchronous request running and results being processed at a configured arbitrary time period.

The ability to describe, bundle, govern, and socialize these different styles of APIs is referred to as [multi-form API management](../../integrating-with-apic/apic-eem-concepts/#multi-form-api-management). When applied, multi-form API management allows an organization to offer a single catalog containing synchronous and asynchronous endpoints. These endpoints can be discovered and consumed internally or externally in a self-service manner. In addition, a single management point can oversee usage and governance concerns of all of APIs.

To achieve multi-form API management, your API and event management capabilities need to be composable so they can work together, while still providing the specific capabilities required for their particular style of endpoint. You can [set up an integration](../../integrating-with-apic/overview) between {{site.data.reuse.apic_long}} and {{site.data.reuse.eem_name}} to provide a complete solution to managing and socializing synchronous and asynchronous APIs together.

## Differences between API and event management solutions
{: #differences-between-api-and-event-management-solutions}

Event-driven architecture adoption has been accelerating as organizations around the world realize the potential and value of events in their respective businesses. With adoption comes the challenge of management: understanding what systems have been deployed, understanding what events are available, and understanding who can use events at any one time.

In many cases, organizations do not know how they could document and manage their event-driven estate, and the growing issue of handling the ever increasing volume of events. In addition, the implementing technologies used to provide events, such as Apache Kafka, are relatively new. They have unique implementation details and concepts which make them non trivial to document, therefore difficult to discover.

Events also have unique characteristics compared to other systems. For example, an event driven system is asynchronous, meaning clients will receive events as they are produced or consumed. This is different from the immediate request-response mechanism of synchronous APIs, such as REST. 

In addition, after an event is produced, the event is typically immutable and stored in a log style format which is consumable to provide a historical and evolving context of all the events in that stream. This means clients will need to cater for potential data evolution as the log progresses, as well as for events the client might have already processed.

These unique characteristics of events and the data they contain are also attracting [different kind of users](../personas). Having a stable log of historical events, for example, enables business users to discover trends, or allow AI models to be trained and trained again on representative data in a repeatable manner. The needs of these users, the unique capabilities of events, and the challenge of describing and managing an event-driven system require a tailored solution that can address these concerns.

As events and event-driven architectures continue to mature in their management and governance requirements, {{site.data.reuse.eem_name}} addresses these challenges by providing the ability to [document, socialize, and manage](../../about/overview/) events for the benefit of a range of users in your organization:

- Events can be described in domain-specific terms by event owners without any previous API definition experience required. 
- [Controls](../../about/key-concepts#controls) can be tailored to event-specific management concerns, applied transparently to clients by the {{site.data.reuse.egw}}.
- A single stream of events can be described and exposed in different ways by using [options](../../about/key-concepts#option), allowing streams to provide a stable API to downstream consumers.
- Events can be socialized in domain-specific terms, enabling a range of technical and non-technical users to discover and make use of events quickly and easily.
- Any socialized event, together with configured controls, can be exported as an AsyncAPI document for use in downstream tooling.
- User access can be viewed, understood, and managed for socialized events at any time through {{site.data.reuse.eem_name}} subscription capabilities.

While API management capabilities provide solutions to a number of the concerns mentioned earlier, they only do so for synchronous APIs. {{site.data.reuse.eem_name}} focuses on asynchronous event-based technologies, allowing events to be securely exposed like an API within your organization, to understand event usage, and provide capabilities which addresses the management and maturity challenges that arise when trying to share a stream of events. 

{{site.data.reuse.eem_name}} can be deployed standalone, and used to manage only a set of event-driven socialization and management requirements. However, you can take advantage of further governance and socialization options [when integrating {{site.data.reuse.eem_name}} with {{site.data.reuse.apic_short}}](#benefits-of-combining-api-and-event-management). As a result, existing users of {{site.data.reuse.apic_short}} can take full advantage of any existing governance, socialization, and management practices while leveraging the value provided by {{site.data.reuse.eem_name}} to describe, manage, and enforce end-user interaction with event-driven systems.
