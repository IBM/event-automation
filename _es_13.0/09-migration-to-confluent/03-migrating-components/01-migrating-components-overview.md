---
title: "Migrating components and applications overview"
excerpt: "Migrate users, schemas, topics, data, and applications from Event Streams to Confluent Platform."
categories: migration
slug: migrating-components
toc: true
---

Before migrating components and applications, complete [setting up Confluent Platform](../setup/).

The migration tasks are grouped into the categories described in the following sections. In general, adhere to the following order:

1. Complete authentication and security setup before starting topic replication.
1. Replicate topic data before you migrate your applications.
1. Migrate applications, integrations, and geo-replication in the order that matches the dependencies in your environment.

## Migrating users and schemas

Complete the following tasks before migrating applications that depend on the migrated users or schemas:

1. Users and authentication:
   - [Migrate users](../migrating-users/): Export and import access control lists (ACLs), recreate SCRAM-SHA-512 credentials as SASL/PLAIN secrets, and update OAuth configuration.
   - [Migrate mTLS users](../migrating-mtls-users/): Issue client certificates signed by the target Client CA, map user principals, and update client keystores.
1. [Migrate schemas](../migrate-schemas/): Export schemas from Apicurio Registry and import them into Confluent Schema Registry in `IMPORT` mode to preserve schema IDs.

## Migrating topics

Migrate topic configuration and data to Confluent Platform before you migrate applications.

To do this, replicate topic configuration and data by using Cluster Linking and synchronize consumer offsets. If Cluster Linking cannot be used because the required broker-to-broker connectivity is unavailable, use Confluent Replicator. For more information, see [migrating topic configuration and data](../migrating-topics/).

## Migrating applications

Migrate producer and consumer applications after topic replication is established. Migrate applications to Confluent Platform after the relevant mirror topics are caught up and ready for promotion.

To do this, stop consumer and producer applications, promote mirror topics to make them writable, and update application connection properties. For more information, see [migrating applications](../migrating-applications/).

## Migrating integrations

Migrate integrations according to their dependencies and the applications or external systems they serve:

- [Migrate Kafka Bridge and REST producer](../migrating-to-rest-proxy/): Update HTTP-based producer and consumer clients to use the Confluent REST Proxy API.
- Kafka Connect and connectors:
  - [Migrate Kafka Connect](../connect-migration/): Build custom Connect container images with required plugins and deploy the Confluent for Kubernetes (CFK) Connect cluster.
  - [Migrate connectors](../connector-migration/): Convert `KafkaConnector` custom resources to CFK `Connector` custom resources and manage offset continuity.
  - [IBM MQ source connector](../ibm-mq-source/): Migrate IBM MQ source connector configurations and verify message flow from IBM MQ to Kafka.
  - [IBM MQ sink connector](../ibm-mq-sink/): Migrate IBM MQ sink connector configurations and verify message delivery from Kafka to IBM MQ.

## Migrating geo-replication

If your deployment uses MirrorMaker 2 for cross-cluster replication, migrate the relevant clusters to Confluent Platform before replacing the existing MirrorMaker 2 flows. Replace existing MirrorMaker 2 replication flows with Cluster Linking or Confluent Replicator, as appropriate for your topology. For more information, see [migrating MirrorMaker 2](../migrating-mirrormaker/).