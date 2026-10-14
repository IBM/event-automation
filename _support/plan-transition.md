---
title: "Plan your transition from IBM Event Automation to IBM Confluent Platform"
description: "Information and guidance on planning your transition from IBM Event Automation to IBM Confluent Platform."
permalink: /support/plan-transition/
toc: true
section: "IBM Event Automation support"
cardType: "large"
order: 5
layout: pagesInsideCollection
---

IBM is evolving its event-driven integration portfolio to bring together Confluent's event streaming technology with IBM's integration and event governance capabilities. {{site.data.reuse.ea_long}} consists of three capabilities: {{site.data.reuse.es_name}} for Kafka-based event streaming, {{site.data.reuse.ep_name}} for Flink-based stream processing, and {{site.data.reuse.eem_name}} for event discovery and governance.

As part of this evolution, {{site.data.reuse.ea_long}} will no longer be available for ordering from October 9, 2026. {{site.data.reuse.es_name}} and {{site.data.reuse.ep_name}} will transition to IBM Confluent Platform for Kafka- and Flink-based capabilities, while {{site.data.reuse.eem_name}} will continue to be enhanced as part of {{site.data.reuse.ipaas-new}} (formerly {{site.data.reuse.ipaas_name}}) and {{site.data.reuse.cp4i-new}} (formerly {{site.data.reuse.cp4i}}).

{{site.data.reuse.es_name}} and {{site.data.reuse.ep_name}} within {{site.data.reuse.ipaas-new}} and {{site.data.reuse.cp4i-new}} will no longer receive new enhancements, while support and security fixes will continue according to IBM's published support lifecycle policies. Going forward, IBM's innovation for Kafka- and Flink-based event streaming and processing will be delivered through the IBM Confluent Platform.

For existing users, there is time to plan a transition; there is no immediate requirement to replace existing deployments. Here is what is changing, how IBM plans to support you, and what you can do now.

## What does this mean for the capabilities I use today?

The path forward depends on which {{site.data.reuse.ea_long}} capabilities you use.

| If you use | Path forward |
| ---------- | ------------ |
| {{site.data.reuse.es_name}} | Plan your transition to IBM Confluent Platform for Kafka-based event streaming |
| {{site.data.reuse.ep_name}} | Plan your transition to IBM Confluent Platform for Flink-based stream processing |
| {{site.data.reuse.eem_name}} | Continue using {{site.data.reuse.eem_name}} within IBM Integration |

{{site.data.reuse.es_name}} and IBM Confluent Platform share Apache Kafka as a foundational technology, helping simplify the transition for Kafka workloads. For {{site.data.reuse.ep_name}} customers, IBM intends to evolve capabilities for authoring Flink solutions as part of the IBM Confluent Platform.

{{site.data.reuse.eem_name}} continues as a strategic capability that extends Confluent Platform's governance capabilities. It can work with any Apache Kafka-compatible platform and enables teams to document Kafka topics using AsyncAPI, making events discoverable alongside APIs and governs their reuse across integration teams.

## How will the transition work?

Every {{site.data.reuse.ea_short}} environment is different, so there is no single migration path for every user. IBM plans to support customers through a phased transition rather than requiring an immediate cutover.

![Phased transition approach diagram]({{ 'images' | relative_url }}/plan-transition.png "Phased transition approach diagram")

A phased approach allows customers to plan, migrate, and validate workloads while existing deployments remain supported according to IBM's published support lifecycle policies.

### Assess your current environment

Start by identifying which {{site.data.reuse.ea_short}} capabilities you use today and the workloads and dependencies associated with them.

For {{site.data.reuse.es_name}}, this can include Kafka clusters, topics, schemas, producers, consumers, and connectors. For {{site.data.reuse.ep_name}}, identify your Flink workloads and dependencies. For {{site.data.reuse.eem_name}}, review event catalogs, AsyncAPI definitions, and event governance requirements.

This establishes a baseline for a transition plan.

### Define your future architecture

Map the capabilities you use today to their future direction:

- {{site.data.reuse.es_name}} &rarr; IBM Confluent Platform
- {{site.data.reuse.ep_name}} &rarr; IBM Confluent Platform for Apache Flink
- {{site.data.reuse.eem_name}} &rarr; {{site.data.reuse.ipaas-new}} or {{site.data.reuse.cp4i-new}}

Customers using multiple capabilities may therefore move toward an architecture combining the IBM Confluent Platform for Kafka and Flink with IBM integration capabilities for event governance and broader integration requirements.

### Establish the target environment

IBM intends to provide entitlement flexibility to help existing customers through the transition.

Existing {{site.data.reuse.es_name}} and {{site.data.reuse.ep_name}} entitlements continue to support existing environments for the remainder of the applicable purchased subscription or ELA term. IBM also intends to support eligible customers in providing early access to equivalent Confluent Platform environments to facilitate parallel migrations.

This provides an opportunity to prepare and validate the target environment while existing workloads continue to operate.

### Migrate and validate your workloads

IBM Confluent provides tools such as cluster linking that facilitate users to migrate to Confluent from other Kafka platforms. IBM intends to augment these with additional migration tools such as KCP, Cluster Linking and Gateway, and expert services to simplify the move from {{site.data.reuse.es_name}} deployments to IBM Confluent Platform.

Depending on the environment, migration planning can account for topics and schemas; producers, consumers, and application dependencies; connectors, security, and networking; and operational requirements such as disaster recovery and rollback. For more information, see the guidance about [migrating {{site.data.reuse.es_name}} to Confluent platform]({{ '/es/migration/overview/' | relative_url }}).

For {{site.data.reuse.ep_name}} customers, IBM Confluent Platform provides the strategic direction for Flink-based processing, with IBM intending to evolve Flink authoring capabilities within the platform. Flink SQL programs created by using the {{site.data.reuse.ep_name}} UI can be re-platformed due to consistency of the underlying Flink runtime. For more information, see the guidance about [migrating {{site.data.reuse.ep_name}} to Confluent Platform for Apache Flink]({{ '/ep/reference/migrate-to-confluent/' | relative_url }}).

### Cut over when ready

Once workloads and dependencies have been migrated and validated, producers, consumers, and dependent applications can transition to Confluent according to your operational requirements.

{{site.data.reuse.eem_name}} continues to provide discovery and governance for Kafka events, including those running on the Confluent Platform.

### Optimize your future environment

After the transition is complete, organizations can decommission migrated {{site.data.reuse.es_name}} and {{site.data.reuse.ep_name}} environments when appropriate, and continue optimizing their event-driven architecture.

{{site.data.reuse.eem_name}} can remain part of this future architecture, providing event discovery, governance, and reuse alongside IBM Confluent Platform.

## How much time do I have?

Customers have time to plan and execute their transition.

| Date | What it means |
| ---- | ------------- |
| July 14, 2026 | IBM Integration Confluent add-on became available |
| October 9, 2026 | {{site.data.reuse.ea_long}} is no longer available for new ordering |
| November 10, 2026 | Ordering completes for the listed {{site.data.reuse.ea_short}} annual Software Subscription and Support renewal parts |
| April 30, 2028 | Normal support for {{site.data.reuse.ea_long}} ends |
| May 1, 2028 | Sustained Support for {{site.data.reuse.ea_long}} begins for eligible customers |
| April 30, 2029 | Extended Support for {{site.data.reuse.ea_long}} ends |

Sustained Support can remain available for eligible customers according to IBM's published Sustained Support policies. Customers should refer to the official IBM announcement and product lifecycle information for authoritative support and ordering details.

## Where does the IBM Integration Confluent add-on fit in?

For organizations using {{site.data.reuse.cp4i}} or {{site.data.reuse.ipaas_name}}, IBM has introduced the IBM Integration Confluent add-on.

The add-on enables organizations to combine Confluent event streaming with IBM integration capabilities across applications, APIs, messaging, B2B, and files.

This can support use cases such as triggering integrations from real-time events, creating event streams alongside APIs, reacting to B2B activity as it happens, making events available to multiple consumers, and bringing real-time events into traditionally batch-oriented processes.

IBM Confluent Platform is also available as a standalone product.

## What happens to Event Endpoint Management?

{{site.data.reuse.eem_name}} continues to be enhanced.

Rather than being replaced by Confluent, {{site.data.reuse.eem_name}} can augment Confluent Platform and other Apache Kafka-compatible platforms.

Organizations can use Confluent for Kafka-based data and event streaming while using {{site.data.reuse.eem_name}} to document events through AsyncAPI, make them discoverable alongside APIs, and govern their reuse across integration teams.

For existing {{site.data.reuse.eem_name}} users within {{site.data.reuse.ipaas-new}} or {{site.data.reuse.cp4i-new}}, no entitlement changes are necessary for {{site.data.reuse.eem_name}} because of this transition.

## What about my existing entitlements?

Existing {{site.data.reuse.es_name}} and {{site.data.reuse.ep_name}} customers continue to use their current entitlements for the remainder of the applicable purchased subscription or ELA term.

IBM intends to provide entitlement flexibility to support the transition, including appropriately sized Confluent Platform entitlements for eligible customers to establish a parallel environment for migration.

Specific entitlement and commercial arrangements will depend on the customer's contractual agreement, deployed capabilities, and future requirements. Customers should work with their IBM representative or IBM Business Partner to determine the appropriate approach.

## What should I do now?

You do not need to migrate everything today, but now is the time to start planning.

- If you use **{{site.data.reuse.es_name}}**, assess your existing Kafka environment and begin defining its transition to IBM Confluent Platform.
- If you use **{{site.data.reuse.ep_name}}**, identify your existing Flink workloads and requirements and include them in your transition planning.
- If you use **{{site.data.reuse.eem_name}}**, it will continue to provide discovery and governance for events within your future Kafka environment.
- If you use **several {{site.data.reuse.ea_short}} capabilities**, assess them together and define a future architecture combining the IBM Confluent Platform with {{site.data.reuse.ipaas-new}} or {{site.data.reuse.cp4i-new}} as appropriate.

Contact your IBM representative or IBM Business Partner to review your current environment and determine a transition approach that fits your architecture, contractual timeline, and business requirements.

## Learn more

- [IBM acquires Confluent announcement](https://www.ibm.com/new/announcements/ibm-and-confluent-announce-ability-to-connect-process-and-govern-real-time-data-for-applications-and-ai-agents){:target="_blank"}
- [Support lifecycle transition and software ordering completion announcement](https://www.ibm.com/docs/en/announcements/withdrawl-event-automation){:target="_blank"}
- [IBM Integration Confluent add-on announcement](https://www.ibm.com/docs/en/announcements/integration-confluent-add-enables-organizations-seamlessly-integrate-event-streaming-capabilities-cloud-pak-integration-webmethods-hybrid-integration){:target="_blank"}
- [IBM Confluent](https://www.confluent.io/){:target="_blank"}
- [IBM Integration SaaS](https://www.ibm.com/products/webmethods-hybrid-integration){:target="_blank"} (formerly {{site.data.reuse.ipaas_name}})
- [IBM Integration Software](https://www.ibm.com/products/cloud-pak-for-integration){:target="_blank"} (formerly {{site.data.reuse.cp4i}})
- [IBM MQ](https://www.ibm.com/products/mq){:target="_blank"}
