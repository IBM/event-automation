---
title: "Key concepts"
excerpt: "Read about the key concepts of the Apache Kafka technology."
categories: about
slug: key-concepts
toc: true
---

Read about the key concepts and terms used in {{site.data.reuse.eem_name}}.
## Topic

A Kafka topic, which contains a set of related events.

## Event source

[Topics](#topic) are presented as event sources in the [catalog](#catalog). Kafka administrators describe topics as event sources, and this information is published to the catalog. In the catalog, application developers can discover and browse the available event sources and decide which ones they want to use in their applications. They can then configure their applications to subscribe to the selected topic's stream of events.

## ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") Option

A Kafka administrator can create an option for an [event source](#event-source) that enables them to control how the topic's stream of events are made available within the catalog. 

## ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") Controls

You can add [controls to options](../../describe/option-controls) so that you have greater management over how topic data is presented to consumers. You can add the following controls to an option:

   * [Approval](../../describe/option-controls#approval-controls): Use the approval control to force users to request access to your topic.
   * ![Event Endpoint Management 11.1.2 icon]({{ 'images' | relative_url }}/11.1.2.svg "In Event Endpoint Management 11.1.2 and later") [Redaction](../../describe/option-controls#redaction): Use a redaction control to hide sensitive data.
   * ![Event Endpoint Management 11.1.2 icon]({{ 'images' | relative_url }}/11.1.2.svg "In Event Endpoint Management 11.1.2 and later") [Schema filtering](../../describe/option-controls#schema-filter): Use the schema filtering control to manage how the data in your topic is presented to consumers and to ensure consistency.

## Catalog

The catalog lists all available topics that represent event sources and, if applicable, their available options. Application developers in your organization can use the catalog to browse the available topics, and to view more information about each of them, including a description, tags, sample messages, schema details if used, and so on, enabling access to the stream of events represented by the topics using the published options.

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") In {{site.data.reuse.eem_name}} 11.1.1 and later, Kafka administrators can use the catalog to check what options are published and made available to others in the organization.

## Cluster

Kafka runs as a cluster of one or more servers (Kafka brokers). The load is balanced across the cluster by distributing it amongst the servers.

## Subscription

Application developers configure their applications to subscribe to the stream of events, providing access to the message content from the event stream, and generating the required credentials for their application to consume from the topic. 

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") In {{site.data.reuse.eem_name}} 11.1.1 and later, Kafka administrators can limit subscriptions by adding the approval control to the options of a topic and they can manage subscriptions that are created for their topics in the {{site.data.reuse.eem_name}} **Topic Detail** page.

## Event Gateway

Access to the event sources are managed by the Event Gateway. The Event Gateway handles the incoming requests from applications to consume from a topic’s stream of events, routing traffic securely between the Kafka cluster and the application.

The Event Gateway is independent of your Kafka clusters, making access control to topics possible without requiring any changes to your Kafka cluster configuration.

## Gateway group

A gateway group is a group of gateway instances that can be logically grouped and scaled together. When [deploying a gateway](../../installing/deploy-gateways), you can define gateway groups by name, and any gateway instances with the same group name are considered a member of that group.

The following are examples of gateway groupings:

- Gateways that are deployed to manage Kafka traffic to designated Kafka clusters.
- Gateways that are colocated within the same geography.
- Gateways that represent different Kafka topics and streams at different stages of adoptable maturity, such as development, test, or production.

When gateways start, they join their defined gateway group and pull any configuration that is specified for that group. The configuration for a gateway group is determined when [publishing an event source](../../describe/publishing-topics), where you can select which gateway group the event source must be accessible through. By publishing an event source to a gateway group, you can restrict which gateways have access to an event source without specifying the gateway instances directly. Gateway instances can be added or removed from a gateway group at any time, providing flexibility as the use of event sources matures.

**Note:** A gateway instance can only be a member of one gateway group.

**Important:** When removing a gateway deployment, work with [subscribed users](../../describe/managing-user-access-to-options) to ensure their clients are configured to work with another member of the same gateway group, so they can continue to consume your event source.

## Message

The unit of data in Kafka. Each message is represented as a record, which comprises two parts: key and value. The key is commonly used for data about the message and the value is the body of the message. Message is also sometimes referred to as event data and record.

To learn more about key concepts, see the [Apache Kafka documentation](http://kafka.apache.org/documentation.html){:target="_blank"}.
