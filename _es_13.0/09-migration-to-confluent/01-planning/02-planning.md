---
title: "Planning your migration"
excerpt: "Plan your migration from Event Streams to Confluent Platform."
categories: migration
slug: planning
toc: true
---

Review your existing {{site.data.reuse.es_name}} environment, identify the components and capabilities that need to be migrated, map them to their Confluent Platform equivalents, and define the migration approach. For some components and configurations, multiple migration options are available.

## Key considerations
{: #key-considerations}

Review the following key aspects before you start the migration:

- **Authentication:** External client applications that use SCRAM-SHA-512 transition to SASL/PLAIN over TLS on Confluent Platform. You can retain existing credentials by updating `sasl.mechanism` to `PLAIN` in client configurations.
- **Schema management:** Avro messages embed schema IDs in the payload. Import schemas into Confluent Schema Registry with original IDs preserved to ensure uninterrupted message deserialization.
- **Tiered storage:** {{site.data.reuse.es_name}} and Confluent Platform use distinct object-storage layouts. Provision a dedicated object-storage bucket for Confluent Platform during setup.
- **Access control lists (ACLs):** Recreate ACLs directly on Confluent Platform to maintain security policies.

## Planning checklist
{: #planning-checklist}

Review the following areas when planning your migration:

- [Mapping components](#mapping-components): Identify all {{site.data.reuse.es_name}} components in use and map them to their Confluent Platform equivalents.
- [Reviewing cluster configuration](#reviewing-cluster-configuration): Understand your existing topology, networking, storage, security, and client serialization settings.
- [Classifying topic replication requirements](#classifying-topic-replication-requirements): Determine data replication and offset preservation requirements for each topic.
- [Planning Kafka Connect and connector migration](#planning-kafka-connect-and-connector-migration): Identify connectors in use, assess Confluent availability, and review configuration differences.
- [Planning the switchover sequence](#planning-the-switchover-sequence): Define acceptable downtime, client migration order, and migration waves.
- [Completing the migration plan](#completing-the-migration-plan): Verify all prerequisites and stakeholder agreements before starting the preparation phase.

## Mapping components
{: #mapping-components}

Identify all {{site.data.reuse.es_name}} components and map them to their Confluent Platform equivalents.

| {{site.data.reuse.es_name}} component | Confluent Platform component |
|---------------------------------------|------------------------------|
| Kafka | Kafka |
| Kafka Connect | Kafka Connect |
| Kafka MirrorMaker 2 | Cluster Linking |
| Apicurio Schema Registry | Confluent Schema Registry |
| Kafka Bridge | Confluent REST Proxy |
| REST producer | Confluent REST Proxy |
| Cruise Control | Self-Balancing Clusters |
| UI | Confluent Control Center |
| CLI | Confluent CLI |

## Reviewing cluster configuration
{: #reviewing-cluster-configuration}

Review the existing cluster topology, networking, storage, security, and client serialization settings to determine how to configure Confluent Platform.

### Topology
{: #topology}

Identify your cluster topology to determine the target Confluent Platform version and broker layout:

- Broker count and rack or availability zone layout.
- Kafka version, which determines the target Confluent Platform version.
- If you use MirrorMaker 2 for geo-replication across multiple clusters, plan the replacement as a separate activity after all relevant clusters are migrated to Confluent Platform. For more information, see [migrating MirrorMaker 2](../migrating-mirrormaker/).

### Networking
{: #networking}

Understand your network configuration to determine how Confluent Platform connects to your existing environment and to your clients:

- Listener types (internal mTLS, external SCRAM/TLS) and advertised hostnames.
- OpenShift routes, load balancers, and firewall rules that clients depend on.
- Confluent-to-{{site.data.reuse.es_name}} reachability. Cluster Linking requires the destination Confluent Platform brokers to initiate the connection to {{site.data.reuse.es_name}} brokers. Confirm network connectivity early because private OpenShift clusters might block it.

### Storage
{: #storage}

Understand your storage configuration to plan equivalent resources for Confluent Platform:

- Persistent Volume Claim (PVC) storage classes and capacity per broker.
- Tiered storage usage and tiered data volume per topic. If tiered storage is in use, provision a separate object-storage bucket for Confluent Platform during [setting up Confluent Platform](../setup/#configuring-tiered-storage), and re-enable tiered storage on each topic after migration. For details, see [migrating topic configuration and data](../migrating-topics/#enabling-tiered-storage).

**Note:** If tiered storage is enabled, plan for additional local storage on the Confluent brokers to accommodate the remote data during migration.

### Security
{: #security}

Understand your security configuration to determine the equivalent authentication, authorization, and encryption setup required on Confluent Platform:

- Authentication mechanisms such as SCRAM-SHA-512, mTLS, or OAuth and Keycloak.
- Authorization rules in `KafkaUser` custom resources and their ACLs, and client quotas.
- Encryption in transit (TLS) and encryption at rest.

### Clients and serialization
{: #clients-and-serialization}

Understand how your client applications connect and serialize data to identify any changes required before migrating:

- Producers and consumers per topic, including programming languages.
- Serialization libraries and Schema Registry integration, such as Confluent serializers over Apicurio ccompat, or Apicurio-native serializers.
- Wire format for Avro clients, such as payload mode with the schema ID embedded in the message body, or headers mode.

## Planning Kafka Connect and connector migration
{: #planning-kafka-connect-and-connector-migration}

If your {{site.data.reuse.es_name}} deployment uses Kafka Connect, review the following areas during planning:

- List all connectors running on {{site.data.reuse.es_name}}, including their connector class, configuration, and the topics they read from or write to.
- For each connector, check whether a Confluent-supported equivalent is available on [Confluent Hub](https://www.confluent.io/hub/){:target="_blank"}, or whether you reuse the existing connector plugin JARs in the CFK Connect image.
- Review the configuration differences between the {{site.data.reuse.es_name}} connector and its Confluent equivalent, including differences in field names, converter classes, and authentication settings.
- Determine how connector offsets are carried over during migration. For sink connectors, Cluster Linking synchronizes Kafka consumer group offsets. For source connectors, the approach depends on whether you reuse the same plugin or switch to a Confluent connector.
- Note that CFK does not support on-cluster connector image builds. Plan to build the CFK Connect plugin image externally as part of [preparation](../preparation/).

For details, see [setting up Kafka Connect](../connect-migration/) and [migrating connectors](../connector-migration/).

## Classifying topic replication requirements
{: #classifying-topic-replication-requirements}

Classify each Kafka topic to determine the required replication approach:

| Topic category | Data replication | Offset preservation |
|----------------|------------------|---------------------|
| Ephemeral or rebuildable | None. Recreate empty topics on Confluent Platform. | None |
| Business-critical | Yes | Required (consumer offset sync) |
| Compacted or configuration topics | Yes. Verify log compaction settings carry over. | Supported |

## Planning the switchover sequence
{: #planning-the-switchover-sequence}

When migrating client applications from {{site.data.reuse.es_name}} to Confluent Platform, determine the migration order and timing based on the following factors:

- Define acceptable producer and consumer downtime for each application. With Cluster Linking consumer-offset sync, migration typically takes seconds to a few minutes per wave, where a wave is a batch of topics migrated together.
- Sequence clients by their tolerance for duplicate messages and sensitivity to message loss, migrating consumers first to process remaining messages, and then producers.
- Group topics into waves by application domain rather than performing a single simultaneous migration.

## Completing the migration plan
{: #completing-the-migration-plan}

Verify that you have determined the following before proceeding to [before you begin](../preparation/):

- Component mapping for all active features.
- Topic-by-topic replication and downtime requirements.
- Client application migration order and migration waves.
- Replication method (such as Cluster Linking to preserve message offsets and handle tiered data).
- Maintenance windows and stakeholder sign-off.