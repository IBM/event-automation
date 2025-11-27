---
title: "Overview"
excerpt: "IBM Event Endpoint Management provides the capability to describe and catalog your Kafka event sources, and to socialize them with application developers."
categories: about
slug: overview
toc: true
---

## Simplify management of your Kafka topics
{: #simplify-kafka-topics}

{{site.data.reuse.eem_name}} simplifies the management of your Kafka topics by providing:

- Authentication of client applications.
- Quota enforcement to limit the number of events a client can publish or consume over a specified time period.
- Redaction of sensitive information.
- Schema-based event filtering and enforcement to ensure only messages that match the schema are delivered to clients or are allowed to be written to an event endpoint.
- A single enforcement point, the {{site.data.reuse.egw}}, to all the Kafka clusters that your clients use.
- A single management point, the {{site.data.reuse.eem_manager}}, where you configure the Kafka topics that are exposed to clients and the rules that apply to the topics.
- Ability to select how events from what topics, and from which Kafka clusters, are accessible to client applications.

Without {{site.data.reuse.eem_name}}, your clients require a separate network endpoint for each Kafka cluster. If you want to implement authentication, quota enforcement, or redaction, then you must configure it individually on each Kafka cluster.

The following diagram shows the Kafka client and server interaction without {{site.data.reuse.eem_name}}:

![Kafka cluster and clients without Event Endpoint Management.]({{ 'images' | relative_url }}/without-eem.svg "Diagram that shows every Kafka client connecting to every Kafka cluster.")

The following diagram shows the same Kafka clusters and clients with the {{site.data.reuse.eem_name}} {{site.data.reuse.egw}} managing the communication between them:

![Kafka cluster and clients with Event Endpoint Management.]({{ 'images' | relative_url }}/with-eem.svg "Diagram that shows the Event Gateway between Kafka clients and clusters.")

An {{site.data.reuse.eem_name}} deployment has the following components: 

- One {{site.data.reuse.eem_manager}} instance. The {{site.data.reuse.eem_manager}} is where you define the Kafka clusters, topics, access controls, and other rules. 
- One or more {{site.data.reuse.egw}} instances. The {{site.data.reuse.egw}}s are located between the Kafka clusters and the clients, and apply the rules that you define in the {{site.data.reuse.eem_manager}}.

## How Event Endpoint Management works
{: #how-eem-works}

As part of your event-driven architecture solution, {{site.data.reuse.eem_name}} provides the capability to describe and catalog your Kafka topics as [event sources](../key-concepts/#event-source), and to grant access to application developers within the organization. Application developers can discover [event endpoints](../key-concepts/#event-endpoint) and configure their applications to access them through the {{site.data.reuse.egw}}. With {{site.data.reuse.eem_name}}, you can control access to any of your event endpoints, and also control what data can be produced to them or consumed from them.

Access to the event endpoints is managed by the {{site.data.reuse.egw}}. The {{site.data.reuse.egw}} handles the incoming requests from applications to produce (write) events to a topic or to consume from a topic’s stream of events. The {{site.data.reuse.egw}} is independent of your Kafka clusters, making access control to topics possible without requiring any changes to your Kafka cluster configuration.

The following diagram shows how {{site.data.reuse.eem_name}} fits into the overall {{site.data.reuse.ea_short}} architecture.

![Event Endpoint Management architecture]({{ 'images' | relative_url }}/architectures/ibm-event-automation-event-endpoint-management.svg "Diagram showing the Event Endpoint Management architecture as part of IBM Event Automation.")

{{site.data.reuse.eem_name}} can be deployed as a [standalone installation](../../installing/overview/) as part of {{site.data.reuse.ea_short}}, or it can be deployed as part of [Cloud Pak For Integration](https://www.ibm.com/docs/en/cloud-paks/cp-integration){:target="_blank"}. You can also integrate {{site.data.reuse.eem_name}} [with {{site.data.reuse.apic_long}}](../../api-and-event-management/overview/) by importing the AsyncAPI document that defines the event source. This integration provides the option to use events as part of your overall API management solution.

### Operation flow
{: #operation-flow}

The following diagram shows the flow of operations in {{site.data.reuse.eem_name}}; from a Kafka administrator adding a topic in {{site.data.reuse.eem_manager}}, to a client application accessing the published topic through the {{site.data.reuse.egw}}.

![Overview of Event Endpoint Management.]({{ 'images' | relative_url }}/EEM_Overview.jpg "Diagram that shows the overview of Event Endpoint Management."){:height=“100%” width=“100%“}

1. The Kafka administrator adds a topic to {{site.data.reuse.eem_name}}. They can select a topic from an existing Kafka cluster or specify a new cluster. After a topic is added to {{site.data.reuse.eem_name}}, it is known as an event source.
   
   The Kafka administrator creates options (with controls, if required) for an event source to define different ways of presenting the event source in the catalog.
   
2. The Kafka administrator publishes an option. The option is then available in the catalog for application developers to discover and use.
3. In the catalog, the application developer can browse the available entries and discover information about the kind of event data available, based on which they can decide which one to use in their applications.
4. The application developer chooses an appropriate event endpoint for their application to use. They subscribe to that event endpoint to provide their application with access to the event endpoint through the {{site.data.reuse.egw}}. The developers can manage their subscriptions through the {{site.data.reuse.eem_name}} UI.
5. The application developer connects their application to the event endpoint, and this sets up their application with access to the events through the {{site.data.reuse.egw}}.
6. The application connects to the {{site.data.reuse.egw}} for access to the event source's event stream.
7. The {{site.data.reuse.egw}} routes traffic securely to and from the Kafka cluster that holds the topic, providing the access to the application to interact with the event endpoint.




