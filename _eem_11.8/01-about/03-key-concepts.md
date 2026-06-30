---
title: "Key concepts"
excerpt: "Read about the key concepts of the Apache Kafka technology."
categories: about
slug: key-concepts
toc: true
---

Read about the key concepts and terms that are used in {{site.data.reuse.eem_name}}. The following diagram demonstrates how the key concepts work together.

![Event Endpoint Management key concepts.]({{ 'images' | relative_url }}/eem-key-concepts.svg "Diagram that demonstrates the key concepts in Event Endpoint Management.")


## Catalog
{: #catalog}

The catalog lists all published and archived [virtual topics](#virtual-topic). Users in your organization can browse the virtual topics, and view their descriptions, schemas, tags, and other details. From the catalog, the user can subscribe to a published virtual topic through an [application](#application). 

Authors can use the catalog to check what virtual topics are published.



## Cluster
{: #cluster}

Kafka runs as a cluster of one or more servers (Kafka brokers). The load is balanced across the cluster by distributing it among the servers. The term cluster in this documentation refers exclusively to Kafka clusters.

## Cluster maintainers
{: #cluster-maintainers}

Cluster maintainers can [edit](../../administering/managing-clusters/#editing-a-cluster) and maintain cluster connection definitions for the clusters that they are assigned to. Cluster maintainers cannot add topics to {{site.data.reuse.eem_name}} from the cluster, change the maintainers of the cluster, or delete the cluster.

## Controls
{: #controls}

Controls that manage how the event data is accessed, presented, and processed can be added to your [virtual topics](#virtual-topic).

The following types of controls are available: event data controls and security controls.

### Event data controls
{: #event-data-controls}

With event data controls, you can manage and modify the event data that is sent to or received from the virtual topic.

You can add the following event data controls to a [consume-enabled](#consume) virtual topic:

   * [Content filtering](../../describe/event-data-controls#content-filtering): Control which events are delivered to subscribers based on event data or subscriber data.
   * [Quota enforcement](../../describe/event-data-controls#quota-enforcement): Manage the rate at which data is consumed from your virtual topic.
   * [Redaction](../../describe/event-data-controls#consume-redaction): Redact sensitive data from events.
   * [Schema filtering](../../describe/event-data-controls#schema-filter): Filter out events that do not comply with the AVRO or JSON schema that is defined for the virtual topic.
   

You can add the following event data controls to a [produce-enabled](#produce) virtual topic:

   * [Schema enforcement](../../describe/event-data-controls#produce-controls-schema-enforcement): Allow only events that comply with the AVRO or JSON schema that is defined for the virtual topic.
   * [Quota enforcement](../../describe/event-data-controls#quota-enforcement): Manage the rate at which data can be written to your virtual topic.


### Security controls
{: #security-controls}

With security controls, you can manage how the virtual topics are secured.

You can add the following security controls to both [consume-enabled](#consume) and [produce-enabled](#produce) virtual topics:

   * [Approval](../../describe/security-controls#approval-controls): Use the approval control to force users to request access to your virtual topic.
   * [Mutual TLS](../../describe/security-controls#mtls): Require users to present a valid client certificate that matches on common name and other specified subject fields.
   * [OAuth2](../../security/cred-sets#oauth): Require users to provide their OAuth2 credentials to access the virtual topic.
   * [SASL Credentials](../../describe/security-controls#sasl): Require users to provide their SASL credentials to access the virtual topic.


## Consume
{: #consume}

A client can consume events from [virtual topics](#virtual-topic) that are created from consume-enabled [source topics](#source-topic). The client [subscribes](#subscription) to the virtual topic, and can then consume Kafka events from the virtual topic by using standard Kafka client libraries.

## Event
{: #event}

An event represents a meaningful occurrence or change in the state of a system or a value. Find out more about [key concepts]({{ 'es/about/key-concepts/#event' | relative_url }}) related to Apache Kafka.


## Event endpoint
{: #event-endpoint}

Event endpoints refer to the published [virtual topics](#virtual-topic) that are available to Kafka clients through the {{site.data.reuse.egw}}.

## {{site.data.reuse.wm_portal_long}}
{: #ibm-developer-portal}

[{{site.data.reuse.wm_portal_long}}](../../dpo-integration/overview) is an external developer portal where you can publish virtual topics. When you publish virtual topics to {{site.data.reuse.wm_portal_short}}, users can discover and subscribe to virtual topics through a unified interface that includes both synchronous and asynchronous APIs.

## Virtual topic
{: #virtual-topic}

A virtual topic represents a Kafka topic that the {{site.data.reuse.eem_name}} administrator adds to {{site.data.reuse.eem_name}}, and is available to be published to the {{site.data.reuse.eem_name}} [catalog](#catalog). When you publish virtual topics to the {{site.data.reuse.eem_name}} [catalog](#catalog), you make them available to the clients through an {{site.data.reuse.egw}}. A virtual topic is also referred to as an [event endpoint](#event-endpoint) from the Kafka client's perspective.


## {{site.data.reuse.egw}}
{: #event-gateway}

Access to virtual topics is managed by the {{site.data.reuse.egw}}. The {{site.data.reuse.egw}} handles the incoming requests from clients to access a virtual topic, routing traffic securely between the Kafka cluster and the client.

The {{site.data.reuse.egw}} is independent of your Kafka clusters, making access to topics possible without requiring any changes to your Kafka cluster configuration.

The following methods are available for deploying and managing your {{site.data.reuse.egw}} instances:
- `EventGateway` custom resource managed by your {{site.data.reuse.eem_name}} operator.
- Standalone {{site.data.reuse.egw}} Docker container.
- Kubernetes Deployment.

## {{site.data.reuse.egw}} group
{: #gateway-group}

An {{site.data.reuse.egw}} group is a logical group of {{site.data.reuse.egw}} instances, to which [virtual topics](#virtual-topic) are published.

Example gateway groupings:

- {{site.data.reuse.egw}}s that are deployed to manage Kafka traffic to designated Kafka clusters.
- {{site.data.reuse.egw}}s that are colocated within the same geographical area.
- {{site.data.reuse.egw}}s that manage traffic for different Kafka topics that are at different stages of maturity. For example, development, test, or production.

When [deploying an {{site.data.reuse.egw}}](../../installing/install-gateway), you must specify the gateway group that it belongs to.

When a new {{site.data.reuse.egw}} starts, it contacts the {{site.data.reuse.eem_manager}}, which responds with all the virtual topics that are published to the gateway's group. Kafka clients can then access the published virtual topics through the new {{site.data.reuse.egw}}.

Key points:
- You must have at least one gateway group.
- An {{site.data.reuse.egw}} can be a member of only one gateway group.

## {{site.data.reuse.eem_manager}}
{: #event-manager}

An {{site.data.reuse.eem_name}} deployment has the following components: 

- One {{site.data.reuse.eem_manager}} instance. The {{site.data.reuse.eem_manager}} is where you define the Kafka clusters, topics, access controls, and other rules.
- One or more [{{site.data.reuse.egw}}](#event-gateway) instances. The {{site.data.reuse.egw}}s are located between the Kafka clusters and the clients, and apply the rules that you define in the {{site.data.reuse.eem_manager}}.

{{site.data.reuse.eem_manager}} instances are defined by the `EventEndpointManagement` custom resource type.

## Source topic
{: #source-topic}

A source topic is a topic that is on a Kafka cluster, which you make available in {{site.data.reuse.eem_name}}. For a single source topic, you can define one or more [virtual topics](#virtual-topic) that provide different security and event data controls for that source topic. Where there is no risk of ambiguity, the term [topic](#topic) is used to refer to a source topic in this documentation.

## Topic
{: #topic}

A topic refers to a [Kafka topic]({{ 'es/about/key-concepts/#topic' | relative_url }}) on a Kafka cluster. An {{site.data.reuse.eem_name}} author adds topics from Kafka clusters, which can then be exposed to clients through an {{site.data.reuse.egw}}. Where there is a risk of ambiguity, topics are referred to as [source topics](#source-topic) in this documentation.


## Topic editors
{: #source-topic-editors}

Topic editors can update [source topic information](../../describe/managing-source-topics/#overview-information) and [manage](../../describe/managing-virtual-topics/) virtual topics for the source topics that they are assigned to. Topic editors cannot change the editors of the source topic or delete source topics.

## Message
{: #message}

The unit of data in Kafka. Each message is represented as a record, which comprises two parts: key and value. The key is commonly used for data about the message and the value is the body of the message. Message is also sometimes referred to as event data and record.

To learn more about key concepts, see the [Apache Kafka documentation](http://kafka.apache.org/documentation.html){:target="_blank"}.


## Virtual topic viewers
{: #virtual-topic-viewers}

Virtual topic viewers are a group of users that can view and subscribe to selected virtual topics in the catalog, in addition to existing public virtual topics. Users can view and subscribe to the [virtual topics that are assigned](../../describe/user-groups/) to their user group.

## Owner
{: #owner}

A user with the author [role](../../security/user-roles) who can assign [user groups](../../security/groups) to view virtual topics, edit source topics, and maintain clusters that they create.

## Produce
{: #produce}

A Kafka client can write events to a [virtual topic](#virtual-topic) that is published to the [catalog](#catalog). The client must [subscribe](#subscription) to a virtual topic on a produce-enabled [source topic](#source-topic), and then they can produce Kafka events to the virtual topic through the {{site.data.reuse.egw}}, by using standard Kafka client libraries.


## Subscription
{: #subscription}

A subscription is a set of credentials that can be used by a Kafka client to access the virtual topics that are included in an [application](#application). 


## User groups
{: #user-groups}

A group of users that have access to specific actions such as viewing virtual topics, editing source topics, and maintaining clusters. [User groups are defined by an external identity provider](../../security/groups/), and group membership is sent as part of the login process.


## Application
{: #application}

An application in {{site.data.reuse.eem_name}} is set of credentials that can be used by one or more Kafka clients to access one or more virtual topics. When you want to provide access to a virtual topic, you create an application in the {{site.data.reuse.eem_name}} UI, and then subscribe the application to the virtual topic.

<!-- Explanation of this naming. Not sure where to put it, leaving here as a comment for now.

The term 'application' is used because a common {{site.data.reuse.eem_name}} user scenario involves developers creating client applications that subscribe to Kafka topics. To access the virtual topics, these client applications must be configured with the correct access credentials (and other requirements such as trusted CAs). These access credentials and requirements are encapsulated in an {{site.data.reuse.eem_name}} application, and so the {{site.data.reuse.eem_name}} application has a one-to-one relationship with the client application that is created by the developer.

For example, a developer creates a client application that is called `weather-forecast`, that requires access to the following Kafka topics:

- `temperature`
- `pressure`
- `humidity`

In previous versions of {{site.data.reuse.eem_name}}, the developer must create a single subscription for each topic, which means they must provide their client applications with multiple credentials. With {{site.data.reuse.eem_name}} applications, the developer creates an application in {{site.data.reuse.eem_name}} called `weather-forecast` that provides a single set of credentials to access the 3 topics. -->
