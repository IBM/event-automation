---
title: "Integration concepts and glossary"
excerpt: "Understand the similarities and differences between API Connect and Event Endpoint Management concepts and terminology."
categories: integrating-with-apic
slug: apic-eem-concepts
toc: true
---

{{site.data.reuse.eem_name}} and {{site.data.reuse.apic_long}} have a number of overlapping concepts, constructs, and terminology. The following glossary aims to describe how these concepts and terminology map between the offerings, or differ where appropriate.

For more information about {{site.data.reuse.eem_name}} concepts and constructs, see the [key concepts topic](../../about/key-concepts/).

## Terminology

### API

API stands for Application Programming Interface. An API defines a contract which describes a service that can be invoked by a client. Depending on the technology or protocols being used, these contracts can be defined and documented in a variety of different ways, such as [OpenAPI](#openapi), used typically for synchronous APIs, or [AsyncAPI](#asyncapi) for asynchronous APIs.

In {{site.data.reuse.eem_name}}, Kafka topics are the back-end service being invoked by a client, and are represented as an [event endpoint](../../about/key-concepts/#event-endpoint) as the API for that topic.

### OpenAPI

OpenAPI is the de facto API specification for describing HTTP based [API](#api) contracts. Typically, these are REST APIs, and provide a synchronous style of interaction with a client.

### AsyncAPI

AsyncAPI is an API specification for describing asynchronous [API](#api) contracts. AsyncAPI has support for a range of protocols, including Kafka, Websockets, JMS, and MQTT. AsyncAPIs are used to define asynchronous interfaces that clients can produce to or consume from. AsyncAPI is becoming the de facto choice to document event-driven architectures.

### Management

Management of a socialized [API](#api) interface is defined by the [governance](#governance) strategy defined by an organization. Aspects of management include the [rules of engagement or policies](#policy) that are enforced by a gateway when using that API, understanding usage, and revoking user access to APIs.

### Governance

Governance defines a standardized approach and set of rules that allow the socialization of [APIs](#api) across an organization. Items to standardize include approaches to versioning, API packaging, but also [management](#management) concerns at design and runtime. 

### Multi-form API management

An approach where synchronous and asynchronous [APIs](#api) can be packaged, [managed](#management), and socialized together. This enables scenarios where the same backing service can be exposed in a range of interaction patterns and styles. For example, an order management system can have a synchronous REST API to get all current orders, or an asynchronous Kafka topic which produces events when an order is made. This offers greater choice to the end user to engage with the API in a way that suits them, as well as unifying the [governance](#governance) of these different styles of API in one management experience.

## {{site.data.reuse.apic_short}} concepts

The following sections explain key {{site.data.reuse.apic_long}} concepts and components, including how they overlap when an integration is set up with {{site.data.reuse.eem_name}}.

### API Manager

The API Manager is a user experience in {{site.data.reuse.apic_short}} which provides features for users defined in a [provider organization](#provider-organization) to author and socialize [APIs](#api), and to manage API usage.

{{site.data.reuse.eem_name}} offers a similar user experience in the [{{site.data.reuse.eem_manager}}](../../api-and-event-management/components) component, where Kafka topics can be authored and published to become [event endpoints](../../about/key-concepts/#event-endpoint). Event endpoints can then be [imported into the API Manager](../generate-asyncapi) as [AsyncAPI documents](#asyncapi) to allow them to be packaged into [Products](#product) for subsequent socialization and management alongside any other API.

### Enforced API

An enforced [API](#api) is an API which has been included in a [Product](#product), published to a [Catalog](#catalog), and has client access enforced by a configured [gateway](#gateway), which applies configured [policies](#policy) to that API.

All [event endpoints](../../about/key-concepts/#event-endpoint) in {{site.data.reuse.eem_name}} are enforced by an {{site.data.reuse.egw}}.

### Unenforced API

An unenforced [API](#api) is an API which has been included in a [Product](#product), published to a [Catalog](#catalog), but the API has been set up to not use any configured [gateway](#gateway) to enforce access, or to use any [polices](#policy).

Currently, there is no direct equivalent concept in {{site.data.reuse.eem_name}}. All published [event endpoints](../../about/key-concepts/#event-endpoint) are [enforced](#enforced-api).

### Policy

A rule, or set of rules, of engagement and behaviors that are enforced by a [gateway](#gateway) on a connecting client when using an [API](#api). In {{site.data.reuse.eem_name}}, these are referred to as [controls](../../about/key-concepts/#controls).

Controls are configured in the [{{site.data.reuse.eem_manager}}](../../api-and-event-management/components) user experience, included in any [imported AsyncAPI document](../generate-asyncapi) from {{site.data.reuse.eem_name}}, and [enforced](#enforced-api) by the {{site.data.reuse.egw}}.

### Gateway

A gateway enforces runtime [policies](#policy) on [API](#api) traffic, and abstracts the client from the back-end implementation. In {{site.data.reuse.apic_short}}, DataPower [Gateways](../../api-and-event-management/components) are used to provide synchronous API gateway capabilities. {{site.data.reuse.eem_name}} provides the {{site.data.reuse.egw}} to perform the same role for asynchronous APIs.

When [{{site.data.reuse.apic_short}} and {{site.data.reuse.eem_name}} are integrated](../overview), both types of gateways can be used to enforce API traffic.

### Product

A logical grouping of related [APIs](#api) and [Plans](#plan) to access those APIs. After an AsyncAPI document is [imported](../generate-asyncapi), the [AsyncAPI specification](#asyncapi) representing the [event endpoint](../../about/key-concepts/#event-endpoint) from {{site.data.reuse.eem_name}} can be added to any Product for publishing later.

**Important:** Products can only be configured to allow one type of [gateway](#gateway) for enforcement.

**Note:** Currently, there is no direct equivalent Product concept in {{site.data.reuse.eem_name}} when not integrated with {{site.data.reuse.apic_short}}.

### Plan

An attribute of a [Product](#product). Used to offer different levels of service (for example, rate limits and monetization) to the APIs contained within a Product.

**Note:** Currently, there is no direct equivalent concept in {{site.data.reuse.eem_name}} when not integrated with {{site.data.reuse.apic_short}}.

**Important:** Rate limits associated with a Plan in {{site.data.reuse.apic_short}} are **not** [enforced](#enforced-api) by the {{site.data.reuse.egw}}. Instead, you can configure a Quota [policy](#policy) in {{site.data.reuse.eem_name}} to enable event-specific rate limiting capabilities for [producing](../../describe/option-controls#quota-produce) or [consuming](../../describe/option-controls#quota-consume) applications.

### Lifecycle

An {{site.data.reuse.apic_short}} [Product](#product), and all the [APIs](#api) it contains, is managed under a single lifecycle. For a full description of the Product lifecycle, including state transitions, see the [API Connect documentation](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=products-product-lifecycle){:target="_blank"}. Any [exported AsyncAPI document](../generate-asyncapi/) from {{site.data.reuse.eem_name}} representing an [event endpoint](../../about/key-concepts/#event-endpoint) can be included in a Product, and therefore go through the same Product lifecycle.

{{site.data.reuse.eem_name}} has a lifecycle concept applied to an [option](../../about/key-concepts/#option), which manages the visibility, discovery and use of an event endpoint. The conceptual overlap of {{site.data.reuse.apic_short}} Product lifecycle states with {{site.data.reuse.eem_name}} options is as follows: 

- Draft - maps to the option 'Unpublished' state.
- Staged - maps to the option 'Unpublished' state.
- Published - maps to the Option 'Published' state.
- Deprecated - maps to the Option 'Archived' state.
- Retired - has no equivalent option lifecycle state in {{site.data.reuse.eem_name}}.

For more information about the option lifecycle and state transitions, see [managing options](../../describe/managing-options#option-lifecycle-states).

**Note:** To export an AsyncAPI document from {{site.data.reuse.eem_name}} to use with {{site.data.reuse.apic_short}}, an event endpoint must exist. This requires an option that associated with the [event source](../../about/key-concepts/#event-source) to be shared to be in **Published** lifecycle state.

### Catalog

An {{site.data.reuse.apic_short}} Catalog is both a collection of published [Products](#product), the [APIs](#api) contained within those products, and a management point for those APIs and Products.

Catalog management tasks include configuring [Gateways](#gateway) and [Developer portal](#developer-portal) instances to associate with the Catalog. An {{site.data.reuse.apic_short}} [Provider organization](#provider-organizations) can contain many Catalogs. Catalogs can also be partitioned into [Spaces](#space) to offer greater management flexibility.

When the integration is set up between {{site.data.reuse.apic_short}} and {{site.data.reuse.eem_name}}, the {{site.data.reuse.egw}} can be configured as one of the available Gateway [Services](#service-or-subsystem). As a service, the gateway provides enforcement for any AsyncAPI exported from {{site.data.reuse.eem_name}} when the AsyncAPI is published as part of a Product to the Catalog.

**Note:** {{site.data.reuse.eem_name}} also includes the concept of a [Catalog](../../about/key-concepts/#catalog). While [event authors](../../api-and-event-management/personas/) perform similar API management and usage tasks in the {{site.data.reuse.eem_name}} Catalog, the Catalog also provides the equivalent user experience to the {{site.data.reuse.apic_short}} [Developer Portal](#developer-portal), providing a list of available event endpoints available for others to discover and sign up to use as a source of events.

### Space

A Space allows a [Catalog](#catalog) to be partitioned or syndicated for management purposes. With Spaces, an individual or team within a [Provider organization](#provider-organizations) can manage a selected subset of [APIs](#api) published to a [Developer portal](#developer-portal).

**Note:** Currently, {{site.data.reuse.eem_name}} does not have an equivalent concept within its [catalog](../../about/key-concepts/#catalog) when not integrated with {{site.data.reuse.apic_short}}.

### Developer Portal

The runtime component that socializes published [Products](#product) and the [APIs](#api) they contain to the wider organization. Users of the Developer Portal will become members of a [Consumer organization](#consumer-organization) when they register and create [Applications](#application) to invoke provided APIs. 

When the integration is set up between {{site.data.reuse.apic_short}} and {{site.data.reuse.eem_name}}, all APIs that are added to Products will be discoverable, including those from {{site.data.reuse.eem_name}}. API usage is managed through the [API Manager's](#api-manager) [Catalog](#catalog) user experience.

**Note:** {{site.data.reuse.eem_name}} has an equivalent [catalog user experience](../../about/key-concepts/#catalog), which is deployed as a part of the [{{site.data.reuse.eem_manager}}](../../api-and-event-management/components) component. This user experience is available concurrently when integrated with {{site.data.reuse.apic_short}}. However, [Subscriptions](../../about/key-concepts/#subscription) created in the {{site.data.reuse.eem_name}} Catalog are only visible in {{site.data.reuse.eem_name}}.

### Application

An Application invokes exposed [APIs](#api). To use an API, an Application must first be registered by using the [Developer portal](#developer-portal), through which access credentials are generated for the Application. Applications then register themselves with a [Product's](#product) [Plans](#plan) to gain access for invoking the plan's APIs. A single Application can register with more than one plan. 

When the integration is set up between {{site.data.reuse.apic_short}} and {{site.data.reuse.eem_name}}, applications registered for Product Plans will have access to [event endpoints](../../about/key-concepts/#event-endpoint) from {{site.data.reuse.eem_name}}.

**Note:** {{site.data.reuse.eem_name}} does not have the concept of an application. Instead, access to [event endpoints](../../about/key-concepts/#event-endpoint) is provided by unique [subscriptions](../../about/key-concepts/#subscription) generated on request.

### Provider organization

A group within an organization that is responsible for the creation, [governance](#governance), and [management](#management) of [APIs](#api). When the integration is set up between {{site.data.reuse.apic_short}} and {{site.data.reuse.eem_name}}, members of a Provider organization can import any [event endpoint](../../about/key-concepts/#event-endpoint) from any integrated {{site.data.reuse.eem_name}} instance. The integration is configured in the [Cloud Manager](#cloud-manager).

**Note:** When not integrated with {{site.data.reuse.apic_short}}, {{site.data.reuse.eem_name}} does not have a similar concept of an organization to differentiate the provider of an API. {{site.data.reuse.eem_name}} is instead [configured and deployed](../../installing/overview/) by using Kubernetes Operators and custom resources, and [user authentication](../../security/managing-access/) and [role management](../../security/user-roles/) (for example, who can author or view APIs) are configured through these resources.

### Consumer organization

A group within an organization who are consuming socialized [APIs](#api).

**Note:** When not integrated with {{site.data.reuse.apic_short}}, {{site.data.reuse.eem_name}} does not have a similar concept of an organization to differentiate the consumer of an API. {{site.data.reuse.eem_name}} is instead [configured and deployed](../../installing/overview/) by using Kubernetes Operators and custom resources, and [user authentication](../../security/managing-access/) and [role management](../../security/user-roles/) (for example, who can author or view APIs) is configured through these resources.

### Service or Subsystem

A component or microservice that makes up an {{site.data.reuse.apic_short}} instance. These are registered and managed in the [Cloud Manager](#cloud-manager). {{site.data.reuse.eem_name}} is integrated with {{site.data.reuse.apic_short}} as an [{{site.data.reuse.egw}} Service](../configure-eem-for-apic).

**Note:** {{site.data.reuse.eem_name}} components are [configured, deployed, and managed](../../installing/overview/) by using Kubernetes Operators and custom resources.

### TLS, Server and Client Profiles

These constructs exist to help configure and manage the configuration between [services](#service-or-subsystem). They are maintained in the [Cloud Manager](#cloud-manager), and are a required [step](../configure-eem-for-apic/#create-a-tls-client-profile) to configure communication between {{site.data.reuse.apic_short}} and {{site.data.reuse.eem_name}}.

**Note:** {{site.data.reuse.eem_name}} does not have an equivalent construct. Instead, {{site.data.reuse.eem_name}} is [configured, deployed, and managed](../../installing/overview/) by using Kubernetes Operators and custom resources.

### Cloud Manager

The Cloud Manager is the user experience for configuring and maintaining the resources which combine to make up an {{site.data.reuse.apic_short}} instance (for example, [subsystems](#service-or-subsystem)).

{{site.data.reuse.eem_name}} is integrated with {{site.data.reuse.apic_short}} as an [{{site.data.reuse.egw}} Service](../configure-eem-for-apic) by using the Cloud Manager tool.

**Note:** {{site.data.reuse.eem_name}} does not have the equivalent of a Cloud Manager tool. Instead, {{site.data.reuse.eem_name}} is [configured, deployed, and managed](../../installing/overview/) by using Kubernetes Operators and custom resources.