---
title: "Integration overview"
excerpt: "Configure an Event Endpoint Management Manager as an Event Gateway Service."
categories: integrating-with-apic
slug: overview
toc: true
---

You can setup an integration between {{site.data.reuse.eem_name}} and IBM API Connect.

**Note:** To set up this integration, IBM API Connect 10.0.6 is required, and both your {{site.data.reuse.eem_name}} and API Connect instances must be deployed as part of {{site.data.reuse.cp4i}} on the same OpenShift cluster.

{{site.data.reuse.eem_name}} provides the capability to describe and catalog the APIs of Kafka event sources, and to socialize those APIs with application developers.

Consuming event-driven APIs can be described as asynchronous because your application does not need to poll or know when to request data. Instead, your application subscribes to a stream of events, and will receive events as they become available. This is different from the immediate request-response mechanism of synchronous APIs, such as REST.

Asynchronous APIs can be described by using the [AsyncAPI](https://www.asyncapi.com/){:target="_blank"} specification, the industry standard for documenting event-driven services.

With {{site.data.reuse.eem_name}}, you can generate an AsyncAPI document that describes the API of a Kafka event source.

Using the "gateway director" model, {{site.data.reuse.eem_name}} provides the [{{site.data.reuse.egw}}](../../about/key-concepts/#event-gateway) for use in IBM API Connect. This means {{site.data.reuse.eem_name}} can be registered as an {{site.data.reuse.egw}} Service in the Cloud Manager. From {{site.data.reuse.eem_name}}, you can export the AsyncAPI document that defines an event source, and then use API Manager to add it to a catalog, making the API details available in the Developer Portal. This enables the management of events and APIs in one place.

Application developers can discover the event source and configure their applications to subscribe to the stream of events, providing self-service access to the message content from the event stream.

The following diagram provides an overview of integrating {{site.data.reuse.eem_name}} with API Connect.

![Integrating Event Endpoint Management with API Connect.]({{ 'images' | relative_url }}/EEM_APIC_Overview.png "Diagram that shows integrating Event Endpoint Management with API Connect"){:height="100%" width="100%"}

1. The Kafka administrator describes the Kafka topic, which is the event source. They can select a topic from an existing Kafka cluster or specify a new cluster, after which the topics on that cluster can be made available by adding and describing them.
2. The Kafka administrator adds the Kafka topic to the {{site.data.reuse.eem_name}} UI.
3. The system administrator registers {{site.data.reuse.eem_name}} as an {{site.data.reuse.egw}} Service in Cloud Manager.
4. The {{site.data.reuse.egw}} Service is made available in API Manager, and can be linked to a catalog.
5. The API developer exports the AsyncAPI document that describes the Kafka topic from the {{site.data.reuse.eem_name}} UI.
6. The API developer imports the AsyncAPI document to API Manager.
7. The API developer publishes the API by including it in a product, and publishing the product to a catalog. The API is then available in the associated catalog in the Developer Portal. The published product is also sent to the {{site.data.reuse.egw}}.
8. Using the Developer Portal, the application developer discovers information about event sources, and based on the information provided in the AsyncAPI document, can decide which one to use in their applications.
9. The application developer creates an application to generate credentials (API key and secret) in the portal to use them later for subscribing to the event stream.
10. The application developer subscribes their application to the event source by choosing the event API product in the portal, copying the provided snippet into their application, updating it with the previously created credentials, and selecting a plan to use.
11. The application developer connects their application to the event source by using the snippets and credentials provided, and this sets up their application to consume from the selected topic through the Event Gateway.
12. The application connects to the Event Gateway for access to the topic's event stream.
13. The Event Gateway routes traffic securely to and from the Kafka cluster that holds the relevant topic content, providing the content to the application as required.
