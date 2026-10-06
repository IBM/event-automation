---
title: "Component mapping"
excerpt: "Understand how Event Streams components map to their Confluent Platform equivalents."
categories: migration
slug: feature-compatibility
toc: true
---

Use this page to identify the Confluent Platform equivalent for each {{site.data.reuse.es_name}} component and understand what you need to do to migrate. For information about configuring and managing Confluent components, see the [Confluent documentation](https://docs.confluent.io/){:target="_blank"}.

## {{site.data.reuse.es_name}} to Confluent Platform mapping

The following table provides an overview of how each {{site.data.reuse.es_name}} component maps to its Confluent Platform equivalent:

| {{site.data.reuse.es_name}} component | Purpose | Confluent equivalent | What you need to do |
|---------------------------------------|---------|----------------------|---------------------|
| [Kafka](#kafka) | Publish and subscribe event streaming | Kafka | Update the bootstrap URL and authentication in your clients. |
| [Apicurio Schema Registry](#apicurio-schema-registry) | Govern Avro schemas and resolve schema IDs | Confluent Schema Registry | Redeploy with original schema IDs preserved. Update `schema.registry.url` in clients. |
| [Kafka Connect](#kafka-connect) | Integrate external systems | Kafka Connect (CFK `Connect`) | Redeploy connectors. Package plugin JARs into the CFK image. |
| [MirrorMaker 2](#mirrormaker-2) | Geo-replication and disaster recovery | Cluster Linking (or Replicator) | Replace MirrorMaker 2 with Cluster Linking. Update consumers if they depend on prefixed topic names. |
| [Kafka Bridge and REST producer](#kafka-bridge-and-rest-producer) | Produce messages over HTTP | Confluent REST Proxy | Update the base URL, API version, and authentication in REST clients. |
| [Cruise Control](#cruise-control) | Keep broker load balanced automatically across the cluster | Self-Balancing Clusters | By default, Self-Balancing Clusters is enabled in CFK. Remove `KafkaRebalance` custom resources. |
| [UI](#ui) | Observe and manage the cluster | Confluent Control Center | Deploy Control Center. No data migration is required. |
| [Event Streams CLI](#cli) | Operate the cluster from the terminal | Confluent CLI | Switch from the `kubectl es` plugin to the `confluent` CLI. |
| [SCRAM external authentication](#scram-external-authentication) | Authenticate clients | SASL/PLAIN over TLS | Migrate clients from SCRAM-SHA-512 to SASL/PLAIN. Passwords can be reused. |
| [ACLs (`KafkaUser`)](#acls) | Authorize principals | Kafka ACLs | Extract ACLs from `KafkaUser` resources and recreate them on Confluent Platform. |
| [Tiered storage](#tiered-storage) | Offload cold data to object storage | Confluent Tiered Storage | Use a separate object-storage bucket. Do not reuse the {{site.data.reuse.es_name}} bucket. |
| [Rack awareness](#rack-awareness) | Distribute partition replicas across availability zones | CFK `rackAssignment` and `oneReplicaPerNode` | Create a dedicated `ServiceAccount` and RBAC resources. Configure `rackAssignment` on the `Kafka` custom resource. |
| [Geo-replication offsets](#geo-replication-offsets) | Resume consumers after failover | Cluster Linking offset sync | Configure consumer offset synchronization on the cluster link for the consumer groups that must be migrated. |
| [Metrics](#metrics) | Monitor cluster and application health | JMX and Prometheus metrics | No migration is required. The same JMX and Prometheus metrics are exposed. Configure monitoring on Confluent Platform. |


## Detailed migration considerations

The following sections describe each component in detail, including what changes and any considerations to plan for before you migrate.


### Kafka

Kafka provides durable publish and subscribe event streaming with topics, partitions, and consumer groups. Confluent Platform is Apache Kafka. Deploy at the same Kafka version and replicate data through Cluster Linking. Many topic configurations are synchronized by Cluster Linking, but some configurations are destination-specific and must be reviewed and configured separately. For supported versions, see the [Confluent documentation](https://docs.confluent.io/operator/current/co-supported-environments.html#cp){:target="_blank"}.

#### Update client configuration

Update the bootstrap URL and authentication in your clients after you migrate to Confluent Platform.


### Apicurio Schema Registry

Apicurio Schema Registry registers Avro schemas, enforces compatibility, and lets serializers and deserializers resolve the schema ID embedded in each message. The Confluent equivalent is Confluent Schema Registry.

#### Migrate schemas

- Export schemas from Apicurio and import them into Confluent Schema Registry in `IMPORT` mode with original IDs preserved.
- Clients that use Apicurio-native serdes libraries must switch to Confluent serdes and update `schema.registry.url`.
- Clients that use Confluent serdes pointed at Apicurio's ccompat endpoint need only a URL change.

**Important:** Confluent Schema Registry does not have a lifecycle state model equivalent to {{site.data.reuse.es_name}} (deprecate, disable, remove). Use this migration as an opportunity to review and remove unused schema versions.



### Kafka Connect

Kafka Connect is managed through the CFK `Connect` custom resource on Confluent Platform. It moves data between Kafka and external systems by using connectors.

#### Redeploy connectors

- Connectors are not migrated. Redeploy them on the CFK Kafka Connect cluster.
- Package plugin JARs into the CFK Kafka Connect image.
- Update the connector configuration with the new bootstrap server, `sasl.mechanism=PLAIN`, and Schema Registry URL.

**Important:** No IBM MQ connector is available on Confluent Hub. Verify whether the IBM MQ connector open-source JARs can be deployed in Confluent Kafka Connect and whether IBM support covers this use.


### MirrorMaker 2

MirrorMaker 2 provides geo-replication and disaster recovery between Kafka clusters. The Confluent equivalent is Cluster Linking, or Confluent Replicator as an alternative.

#### Replace MirrorMaker 2 with Cluster Linking

- Remove the MirrorMaker 2 worker fleet. Cluster Linking handles replication natively.
- MirrorMaker 2 prefixes replicated topic names (for example, `source.topic`). Cluster Linking keeps the original name. Update downstream consumers if they depend on prefixed names, or use Replicator to reproduce the naming.

**Important:** Cluster Linking requires broker-to-broker connectivity from Confluent to {{site.data.reuse.es_name}}. If this path cannot be established, use Confluent Replicator instead.

### Kafka Bridge and REST producer

Kafka Bridge and the REST producer let non-Kafka systems produce messages over HTTP. The Confluent equivalent is Confluent REST Proxy (`KafkaRestProxy`).

#### Update REST clients

- Update the base URL and API version in your REST clients. The v2 API is closest to the {{site.data.reuse.es_name}} REST producer. v3 is the current API.
- Update authentication from SCRAM-SHA-512 to an authentication mechanism supported by the Confluent REST Proxy, such as HTTP Basic authentication, OAuth/OIDC, or mTLS.

### Cruise Control

Cruise Control rebalances broker load automatically. The Confluent equivalent is Self-Balancing Clusters, which is enabled by default in CFK. Ensure the following when you use Self-Balancing Clusters:

- For KRaft-based clusters, set `inter.broker.listener.name` on both the `Kafka` CR and the `KRaftController` CR. If it is missing on the controller, Self-Balancing Clusters remains in `STARTING` status indefinitely with no error logged.
- Confirm that `kafka-rebalance-cluster --status` reports `ENABLED` (not `STARTING`) and that the `_confluent_balancer_api_state` internal topic exists before treating Self-Balancing Clusters as operational.

For more information, see the [Confluent documentation on scaling and self-balancing](https://docs.confluent.io/operator/current/co-scale-cluster.html){:target="_blank"}.


### UI

Confluent Control Center replaces the {{site.data.reuse.es_name}} UI for observing and managing the Kafka cluster through a browser.

#### Deploy Control Center

Deploy Control Center as a `ControlCenter` custom resource to monitor the target cluster and verify message flow during migration. No data migration is required.


### CLI

Use the [Confluent CLI](https://docs.confluent.io/confluent-cli/current/overview.html){:target="_blank"} instead of the `kubectl es` plugin to manage the cluster from the terminal. The Confluent CLI covers a broader set of commands than `kubectl es`. A small number of `kubectl es` operations have no direct Confluent CLI equivalent and must be performed by using the Kafka REST Proxy API or standard `kafka-*` tools instead.

#### Switch to the Confluent CLI

Switch from the `kubectl es` plugin to the `confluent` CLI. For the full syntax and flags for each command, see the [Confluent CLI command reference](https://docs.confluent.io/confluent-cli/current/command-reference/overview.html){:target="_blank"}. Ensure you select **On-Premises** in the platform filter to see the commands that apply to your CFK cluster.


### SCRAM external authentication

SCRAM external authentication lets Kafka clients authenticate with a username and password. CFK's primary external listener authentication method is SASL/PLAIN over TLS. SCRAM-SHA-512 is not supported as a CFK listener type through the CFK API. You can configure it through `configOverrides`, but this is outside the scope of Confluent Support.

#### Migrate client authentication

Migrate external clients from SCRAM-SHA-512 to SASL/PLAIN. You can reuse existing passwords. Update `sasl.mechanism` from `SCRAM-SHA-512` to `PLAIN` and update the `JAAS` module in your client configuration. For more information, see [migrating users](../migrating-users/).


### ACLs

ACLs authorize principals to read, write, or administer specific resources. Confluent supports standard Kafka ACLs, so the ACL rules themselves are portable. ACLs defined in {{site.data.reuse.es_name}} `KafkaUser` custom resources are not automatically migrated.

#### Migrate ACLs

Extract ACLs from `KafkaUser` custom resources and recreate them on Confluent Platform. Schema ACLs that use the `__schema_` prefix pattern have no direct Confluent equivalent because Confluent Schema Registry uses its own authorization model. Configure the required permissions directly on Confluent Schema Registry by using its role-based access control. For more information, see [securing Confluent Schema Registry](https://docs.confluent.io/platform/current/schema-registry/security/index.html){:target="_blank"}.


### Tiered storage

Tiered storage offloads cold data to object storage to reduce broker disk usage. {{site.data.reuse.es_name}} uses the Aiven Remote Storage Manager plugin for tiered storage. Confluent uses its own native Tiered Storage. The two use different object layouts and are not compatible.

#### Configure a separate storage bucket

- Create a separate object-storage bucket for Confluent. Do not point Confluent at the {{site.data.reuse.es_name}} bucket.
- Cluster Linking migrates tiered data through the source broker during replication. No separate data copy step is required.
- After you promote topics on Confluent Platform, configure tiered storage so that Confluent Platform offloads data to its own bucket.


### Rack awareness

The underlying Kafka rack awareness behavior is identical in CFK, but the operator configuration and RBAC requirements differ. The `spec.strimziOverrides.kafka.rack.topologyKey` setting is replaced by `rackAssignment.nodeLabels`, and CFK requires a dedicated `ServiceAccount` with permissions to read node labels at startup.

For more information, see [configuring rack awareness](../migrating-rack-awareness/).


### Geo-replication offsets

Cluster Linking consumer-offset sync replaces MirrorMaker 2 offset tracking. It synchronizes consumer offsets so that consumers resume from the correct position after a failover.

#### Replicating consumer offsets

Configure consumer offset synchronization on the cluster link for the consumer groups that must be migrated. No separate offset export or import process is required when synchronization is correctly configured. For Replicator-based flows, add the `ConsumerTimestampsInterceptor` to Java source consumers before replication starts.


### Metrics

Metrics let you monitor cluster and application health. Confluent Platform exposes the same JMX and Prometheus metrics as {{site.data.reuse.es_name}}. To enable monitoring on Confluent Platform, see the [Confluent documentation](https://docs.confluent.io/operator/current/co-monitor-cp.html){:target="_blank"}.

