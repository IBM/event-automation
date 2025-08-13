---
title: "API and event management: example scenario"
excerpt: "A worked end to end example of configuring and using API and event Management together."
categories: integrating-with-apic
slug: apic-eem-scenario
toc: true
---

The following is an example of combining {{site.data.reuse.apic_long}} and {{site.data.reuse.eem_name}} to achieve [multi-form API management](../apic-eem-concepts/#multi-form-api-management) for a stock management system. It focuses on a fictitious clothing firm, Loosehanger, and challenges they are experiencing with their stock procurement processes responding to customer demand.

## Background
{: #background}

Loosehanger are a multi-national clothing firm with their own manufacturing and distribution facilities. They have their own retail stores, but also have mobile phone and web storefronts. Fashion is a fast moving sector, and responding to changes in consumer demand in real time is critical to remain relevant and successful.

Loosehanger already have implemented {{site.data.reuse.apic_long}} to govern and socialize their REST APIs across their business. They also have been investing in event-driven technologies, and recently have installed {{site.data.reuse.eem_name}} to help catalog their growing estate of Apache Kafka topics.

### Personas
{: #personas}

**Andre** works in the Loosehanger supply chain management team, and owns a stock procurement application to request the manufacturing of new stock. So far he has made use of [APIs](../apic-eem-concepts/#api) through the Loosehanger API [Developer Portal](../apic-eem-concepts/#developer-portal), and has been working with **Kevin** on some of the APIs he has been providing to the Developer Portal in his application.

**Kevin** works in the Loosehanger IT team, and he provides services to access a range of data within the Loosehanger organization, including current stock and order information. He works with **Steve** to manage the exposure of these services as APIs so they meet organizational governance requirements.

**Steve** is responsible for API implementation and management within Loosehanger. He sets guidelines for API governance and packaging, while also working with **Will** to make sure any required infrastructure is set up and available.

**Will** is also a member of Loosehanger's IT team, and maintains {{site.data.reuse.apic_short}} by using the [Cloud Manager](../apic-eem-concepts/#cloud-manager). He also has deployed an instance of {{site.data.reuse.eem_name}} for use with the Loosehanger business.

## The Problem
{: #the-problem}

Loosehanger produce and distribute their own products to stores and direct to customers. They manage stock, and the orders stock has been allocated to, by using a set of databases. Every week, an application is run to capture the current levels of available stock across all their warehouses, so new requests to manufacturing can be issued for any products running low in supply.

Recently, unexpected surges in demand have resulted in not enough stock being available in some of their warehouses at point of sale. This has resulted in Loosehanger not being able to fulfill orders to their customers and stores, and they have noted a loss in customer satisfaction as a result.

**Andre** owns the current stock reordering application, and has been asked to investigate and develop an updated process to mitigate this order fulfillment issue.

## The solution
{: #the-solution}

**Andre** identifies that to mitigate the order fulfillment issues being seen by Loosehanger, the stock reordering application needs to respond to new order events in real time to preemptively request new stock be manufactured. This is in addition to the existing stock reordering process that runs weekly.

**Andre** plans to implement a new stock reordering application that consumes order requests as they are placed by customers, in addition to consuming the existing REST-based stock APIs his previous application has been using. Using these orders in an aggregation will allow the application to detect the need to reorder stock if current demand indicates current stock levels will be exhausted.

### What APIs and data is available?
{: #what-apis-and-data-is-available}

**Andre**'s current application uses a number of APIs from the Loosehanger Developer Portal. He reviews the available APIs and discovers that while there are APIs he can invoke to get order information, they require privileged access as they involve sensitive personal information, and are only available via REST APIs. This means any new application would need to frequently poll and reconcile changes in state. 

**Andre** considers these characteristics as blockers. All he requires is the ID of the item that is ordered, and which warehouse is fulfilling the order. He reaches out to **Kevin** to ask if there is any way to get just this information, and to get it in an asynchronous manner.

**Kevin** has been recently working on event-driven initiatives within Loosehanger, including the adoption of Apache Kafka and {{site.data.reuse.eem_name}}. While orders are managed in a database he owns, he considers **Andre**'s request, and decides to implement a change data capture application that would populate a Kafka topic with updates to the order state as they occur.

**Kevin**  creates a topic called "orders", but has concerns over the data in the topic, and having to then manage requests to use the new topic going forwards. In addition, he does not know how to document a Kafka topic, and its rules of engagement. However, he is aware that Loosehanger have recently deployed an {{site.data.reuse.eem_name}} instance for documenting Kafka topics.

### Describing a Kafka topic as an API
{: #describing-a-kafka-topic-as-an-api}

**Kevin** logs into the {{site.data.reuse.eem_name}} UI, and begins to describe his new topic:

- Adds the "orders" topic and Cluster information by using the [discovery flow](../../describe/adding-topics).
- He is guided to add appropriate metadata to [describe his topic](../../describe/managing-event-sources/#overview-information).
- He adds [management capabilities](../../subscribe/managing-subscriptions) to make sure that when socialized, his topic has [controls](../../describe/option-controls) applied to enforce rules of engagement on any clients that use his topic. In this case, he [redacts](../../describe/option-controls/#redaction) sensitive data when clients consume events.

Having worked through these steps, **Kevin** is happy that his order topic can be securely socialized. He responds to **Andre** to let him know, and contacts **Steve** to ask how to offer this topic as an API.

### Integrating {{site.data.reuse.apic_short}} and {{site.data.reuse.eem_name}}
{: #integrating-apiconnect-and-sitedatareuseeem_name}

**Steve**, having understood the business need **Andre** and **Kevin** want to provide, asks **Will** if he can integrate the company's {{site.data.reuse.eem_name}} instance with {{site.data.reuse.apic_short}}. **Will** follows the [integration steps](../configure-eem-for-apic) described.

Having set up the integration, and having added the registered {{site.data.reuse.egw}} Service to the required [Provider Organizations](../apic-eem-concepts/#provider-organization), he lets **Steve** and **Kevin** know that he can now add AsyncAPIs of Kafka topics to the Developer Portal.

### Importing, packaging, and socializing an AsyncAPI
{: #importing-packaging-and-socializing-an-asyncapi}

**Kevin** works with **Steve** to mature and standardize his Kafka topic as an API:

- **Kevin** works with **Steve** to understand additional organization governance requirements. He makes any required updates to his topic in {{site.data.reuse.eem_name}} to match conventions and to set up any additional required [controls](../../describe/option-controls) to manage client behavior.
- **Kevin** [imports his topic from {{site.data.reuse.eem_name}} as an AsyncAPI document](../generate-asyncapi) into the [API Manager](../apic-eem-concepts/#api-manager).
- **Kevin** works with **Steve** to add his API to the appropriate [Product](../apic-eem-concepts/#product). In this case, a new Product called "Real-time orders" is created. It contains **Kevin**'s topic, described as an API.
- **Steve** reviews the API and Product. Satisfied that Loosehanger's governance needs have been met, he publishes the Product to the Developer Portal.

**Kevin**'s Kafka topic, described and enforced by {{site.data.reuse.eem_name}}, is now visible in the {{site.data.reuse.apic_short}} Developer Portal, and can be managed from the API Manager by **Steve**.

### Adoption, integration, and management
{: #adoption-integration-and-management}

**Andre** visits the Developer Portal, and sees the new "Real-time stock" Product containing **Kevin**'s API:

- He creates a new application for his new stock procurement application, taking note of the API Key and Secret returned.
- He subscribes to a plan in the "Real-time stock" Product to gain access to the APIs contained in it.
- He also signs up to other Products to gain access to stock information that he also requires for his new application.

**Andre** writes his new application, and with one set of credentials, accesses multiple different styles of APIs. He is able to combine REST API calls to get current stock levels, and can implement new logic that can aggregate over time order events as they occur. 

If the aggregation detects that orders will exhaust current stock levels at the current rate, **Andre**'s application can now order new manufacturing requests for stock immediately to the warehouses that require it.

**Steve** and **Kevin** work together to manage the API and its backing topic as usage increases. **Steve** can also work with **Andre** to declare any planned downtime that might impact his application, or new versions of the API he should adopt, by using the API Manager user experience.

## Summary
{: #summary}

In this example, Andre, Kevin, Steve, and Will combined to solve a business challenge Loosehanger were facing by combining different styles of technology, APIs, and data. {{site.data.reuse.eem_name}} provides the features that make events easy to discover, and turned into enforceable APIs, which can then be integrated with {{site.data.reuse.apic_long}} to provide unified management, governance, and socialization. 

This [multi-form API management](../apic-eem-concepts/#multi-form-api-management) approach enables multiple styles of API to be used to solve new business challenges without sacrificing the security, management, or governance needs of the business.
