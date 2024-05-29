---
title: "Key concepts"
excerpt: "Read about the key concepts of the Apache Kafka technology."
categories: about
slug: key-concepts
toc: true
---

Read about the key concepts and terms used in {{site.data.reuse.eem_name}}. The following diagram demonstrates how the key concepts work together.

![Event Endpoint Management key concepts.]({{ 'images' | relative_url }}/eem-key-concepts.png "Diagram that demonstrates the key concepts in Event Endpoint Management.")

## Topic

A Kafka topic, which contains a set of related events.

## Event source

An event source is the term used to describe a topic when it has been added to {{site.data.reuse.eem_name}}. A Kafka administrator can make event sources accessible by publishing an [option](#option) to the [catalog](#catalog) where it becomes an [event endpoint](#event-endpoint). Application developers can discover and browse the available event endpoints and decide which ones they want access to. They can then configure their applications to either [consume](#consume) from the event endpoint or [produce](#produce) to it.

## Option
{: #option}

A Kafka administrator can create an option for an [event source](#event-source) that enables them to control how the topic's stream of events are made available within the [catalog](#catalog). When an option is published to the catalog, it is called an [event endpoint](#event-endpoint).

## Controls

You can add [controls to options](../../describe/option-controls) so that you have greater management over how event source data is presented to applications.

You can add the following controls to an option on a [consume-enabled](#consume) event source:

   * [Approval](../../describe/option-controls#approval-controls): Use the approval control to force users to request access to your event endpoint.
   * [Redaction](../../describe/option-controls#redaction): Use a redaction control to hide sensitive data.
   * [Schema filtering](../../describe/option-controls#schema-filter): Use the schema filtering control to manage how the data in your event source is presented to consumers and to ensure consistency.

You can add the following controls to an option on a [produce-enabled](#produce) event source:

   * [Approval](../../describe/option-controls#approval-controls): Use the approval control to force users to request access to your event endpoint.
   * [Schema enforcement](../../describe/option-controls#schema-enforcement): Use the schema enforcement control to enforce the shape of data that is allowed to be produced to your event endpoint.


## Event endpoint
{: #event-endpoint}

When a Kafka administrator publishes an [option](#option) to the {{site.data.reuse.eem_name}} [catalog](#catalog), the option exposes an event source as an event endpoint. This contains all the descriptive elements provided when describing a topic as an [event source](#event-source), and the management configuration specified in the published option. If other options have already been published relating to an event source, they are available under the event endpoint in the catalog.

For an application developer, the event endpoint is the object that they can discover in the catalog, and behaves like a topic when it is accessed through the {{site.data.reuse.egw}}.

## Catalog

The catalog lists all available event endpoints and, if applicable, their available options. Application developers in your organization can use the catalog to browse the available event endpoints, and to view more information about each of them, including a description, tags, sample messages, schema details if used, and so on, enabling access to the stream of events represented by the event source using the published options.

Kafka administrators can use the catalog to check what options are published and made available to others in the organization.

## Cluster

Kafka runs as a cluster of one or more servers (Kafka brokers). The load is balanced across the cluster by distributing it amongst the servers.

## Subscription

Application developers configure their applications to subscribe to the stream of events, providing access to the message content from the event stream, and generating the required credentials for their application to consume from the event endpoint. 

Kafka administrators can limit subscriptions by adding the approval control to the options of an event source and they can manage subscriptions that are created for their event sources in the {{site.data.reuse.eem_name}} **Topic Detail** page.

## Consume

An application developer can discover [event endpoints](#event-endpoints) that are published to the [catalog](#catalog). The application developer must [subscribe](#subscription) to an [option](#option) on a consume-enabled [event source](#event-source) to get access for a client application to consume Kafka events from the related topic through the {{site.data.reuse.egw}}, by using standard Kafka client libraries.

## Produce
{: #produce}

An application developer can write events to an [event endpoint](#event-endpoints) that is published to the [catalog](#catalog). The application developer must [subscribe](#subscription) to an [option](#option) on a produce-enabled [event source](#event-source) to get access for a client application to produce Kafka events to the related topic through the {{site.data.reuse.egw}}, by using standard Kafka client libraries.

## {{site.data.reuse.eem_manager}}

The {{site.data.reuse.eem_manager}} component adopts your Kafka topics into a central location after you describe them as event sources, and you can then generate event endpoints for sharing with others. The {{site.data.reuse.eem_manager}} provides features to configure how you want to present the topic data by using event endpoints, which can be accessed through the {{site.data.reuse.egw}}.

{{site.data.reuse.eem_manager}} instances are defined by the `EventEndpointManagement` custom resource type.

## {{site.data.reuse.egw}}

Access to event sources are managed by the {{site.data.reuse.egw}}. The {{site.data.reuse.egw}} handles the incoming requests from applications to access an event source, routing traffic securely between the Kafka cluster and the application.

The {{site.data.reuse.egw}} is independent of your Kafka clusters, making access to topics possible without requiring any changes to your Kafka cluster configuration.

{{site.data.reuse.egw}} instances are defined by the `EventGateway` custom resource type.

## {{site.data.reuse.egw}} group

An {{site.data.reuse.egw}} group is a group of {{site.data.reuse.egw}} instances that can be logically grouped and scaled together. When [deploying an {{site.data.reuse.egw}}](../../installing/deploy-gateways), you can define gateway groups by name, and any {{site.data.reuse.egw}} instances with the same group name are considered a member of that group.

The following are examples of {{site.data.reuse.egw}} groupings:


- {{site.data.reuse.egw}}s that are deployed to manage Kafka traffic to designated Kafka clusters.
- {{site.data.reuse.egw}}s that are colocated within the same geography.
- {{site.data.reuse.egw}}s that represent different Kafka topics and streams at different stages of adoptable maturity, such as development, test, or production.


When {{site.data.reuse.egw}}s start, they join their defined {{site.data.reuse.egw}} group and pull any configuration that is specified for that group. The configuration for an {{site.data.reuse.egw}} group is determined when [publishing an event source](../../describe/publishing-options), where you can select which group the event source must be accessible through. By publishing an event source to an {{site.data.reuse.egw}} group, you can restrict which gateways have access to an event source without specifying the gateway instances directly. {{site.data.reuse.egw}} instances can be added or removed from a group at any time, providing flexibility as the use of event sources matures.

**Note:** A gateway instance can only be a member of one gateway group.

**Important:** When removing a gateway deployment, work with [subscribed users](../../describe/managing-user-access-to-options) to ensure their clients are configured to work with another member of the same gateway group, so they can continue to consume your event source.

## Message

The unit of data in Kafka. Each message is represented as a record, which comprises two parts: key and value. The key is commonly used for data about the message and the value is the body of the message. Message is also sometimes referred to as event data and record.

To learn more about key concepts, see the [Apache Kafka documentation](http://kafka.apache.org/documentation.html){:target="_blank"}.
