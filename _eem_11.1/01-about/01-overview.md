---
title: "Introduction"
excerpt: "IBM Event Endpoint Management provides the capability to describe and catalog your Kafka event sources, and to socialize them with application developers."
categories: about
slug: overview
toc: true
---

As part of your event-driven architecture solution, {{site.data.reuse.eem_name}} provides the capability to describe and catalog your Kafka topics as [event sources](../key-concepts/#event-source), and to grant access to application developers within the organization. Application developers can discover [event endpoints]((../key-concepts/#event-endpoint)) and configure their applications to access them through the {{site.data.reuse.egw}}. With {{site.data.reuse.eem_name}}, you can control access to any of your event endpoints, and also control what data can be produced to them or consumed from them.

**Note:** ![Event Endpoint Management 11.1.5 icon]({{ 'images' | relative_url }}/11.1.5.svg "In Event Endpoint Management 11.1.5 and later") The ability to produce events is only available in {{site.data.reuse.eem_name}} version 11.1.5 and later.

Access to the event endpoints is managed by the {{site.data.reuse.egw}}. The {{site.data.reuse.egw}} handles the incoming requests from applications to produce (write) events to a topic or to consume from a topic’s stream of events. The {{site.data.reuse.egw}} is independent of your Kafka clusters, making access control to topics possible without requiring any changes to your Kafka cluster configuration.

![Event Endpoint Management architecture]({{ 'images' | relative_url }}/architectures/previous/ibm-event-automation-event-endpoint-management.svg "Diagram showing the Event Endpoint Management architecture as part of IBM Event Automation.")

{{site.data.reuse.eem_name}} can be deployed as a standalone installation, or it can be deployed as part of Cloud Pak For Integration. You can also integrate {{site.data.reuse.eem_name}} with {{site.data.reuse.apic_long}} by importing the AsyncAPI document that defines the Kafka event source. This integration provides the option to use events as part of your overall API management solution.

The following diagram provides an overview of {{site.data.reuse.eem_name}}.

![Overview of Event Endpoint Management.]({{ 'images' | relative_url }}/EEM_Overview.jpg "Diagram that shows the overview of Event Endpoint Management."){:height=“100%” width=“100%“}

1. The Kafka administrator describes the Kafka topic, which is the event source. They can select a topic from an existing Kafka cluster or specify a new cluster, after which the topics on that cluster can be made available by adding and describing them.
   * ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") The Kafka administrator creates options for a topic to define different ways of presenting the topic in the catalog. 
1. The Kafka administrator publishes the event source in one of the following ways depending on their version:
   * The Kafka administrator publishes the Kafka topic. The topic is then available in the catalog for application developers to discover and use as an event source.
   * ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") The Kafka administrator publishes an option. The option is then available in the catalog for application developers to discover and use.
1. In the catalog, the application developer can browse the available entries or event endpoints that represent event sources and discover information about the kind of event data available, based on which they can decide which one to use in their applications.
1. The application developer selects the topic that provides the source of events required for their application and completes one of the following actions depending on their version:
   * Subscribes to the topic, generating the required credentials for their application to consume from the topic. The developers can manage their subscriptions through the {{site.data.reuse.eem_name}} UI.
   * ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") Chooses an appropriate event endpoint for their application to use. They subscribe to that event endpoint to generate the required credentials to provide their application with access to the event endpoint through the {{site.data.reuse.egw}}. The developers can manage their subscriptions through the {{site.data.reuse.eem_name}} UI.
1. The application developer connects their application to the event endpoint using the snippets and credentials provided, and this sets up their application with access to the events through the {{site.data.reuse.egw}}.
1. The {{site.data.reuse.egw}} routes traffic securely to and from the Kafka cluster that holds the topic, providing the access to the application to interact with the topic.




