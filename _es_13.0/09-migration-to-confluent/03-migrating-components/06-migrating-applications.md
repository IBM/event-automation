---
title: "Migrating applications"
excerpt: "Update your applications to connect to Confluent Platform."
categories: migration
slug: migrating-applications
toc: true
---

Switch your producer and consumer applications from {{site.data.reuse.es_name}} to Confluent Platform by completing the following sequence.

## Before you begin
{: #before-you-begin}

Before migrating your applications, ensure that the following tasks are complete:

- [Migrate user credentials and permissions](../migrating-users/) to Confluent Platform.
- [Migrate schema definitions](../migrate-schemas/) to Confluent Schema Registry if your applications use schemas.
- [Verify topic data replication](../migrating-topics/#verifying-topic-data-replication) to confirm that mirror topics are in sync with zero lag.

## Switching applications to Confluent Platform
{: #switching-applications}

To avoid message loss or duplication, complete the following steps for each topic or group of topics:

1. Stop the consumer applications on {{site.data.reuse.es_name}}.
2. Wait for consumer offsets to synchronize to Confluent Platform.
3. Stop all producer applications on {{site.data.reuse.es_name}}.
4. Confirm that the replication lag is zero for the mirror topic. Run the following command:

   ```bash
   kubectl exec -n <cp-namespace> kafka-0 -- kafka-mirrors --describe \
     --links <cluster-link-name> \
     --bootstrap-server <bootstrap-server>
   ```

   Where:
   - `<cp-namespace>` is the Kubernetes namespace where you deploy Confluent Platform.
   - `<cluster-link-name>` is the name of the ClusterLink.

5. Run the following command to promote the mirror topic on Confluent Platform and make it writable:

   ```bash
   kubectl exec -n <cp-namespace> kafka-0 -- kafka-mirrors --promote \
     --topics <topic-name> \
     --bootstrap-server <bootstrap-server>
   ```

   Where:
   - `<cp-namespace>` is the Kubernetes namespace where you deploy Confluent Platform.
   - `<topic-name>` is the name of the topic to promote (for example, `orders`).

   **Note:** The promote operation performs its own final synchronization checks before converting the mirror topic. If promotion fails, do not proceed. Resolve the reported synchronization or connectivity issue before retrying.

6. Run the following command to verify that the topic status changes from `LINKING` to `STOPPED` (promoted and writable):

   ```bash
   kubectl exec -n <cp-namespace> kafka-0 -- kafka-mirrors --describe \
     --topics <topic-name> \
     --bootstrap-server <bootstrap-server>
   ```

   Where:
   - `<cp-namespace>` is the Kubernetes namespace where you deploy Confluent Platform.
   - `<topic-name>` is the name of the promoted topic.

7. Update the configuration properties of your producer and consumer applications to connect to Confluent Platform:

   - Update `bootstrap.servers` to the Confluent Platform listener address.
   - Set `sasl.mechanism` to `PLAIN` with `security.protocol` set to `SASL_SSL`, or configure mTLS or OAuth properties as required.
   - Update `schema.registry.url` to point to Confluent Schema Registry if your applications use schemas.
   - For Kafka Streams applications, update both `bootstrap.servers` and `schema.registry.url` properties.

8. Start your producer and consumer applications on Confluent Platform. Consumers resume reading from the synchronized offsets, and producers write directly to the promoted topic.

**Note:** Keep {{site.data.reuse.es_name}} available until the migration is fully validated. After topics are promoted and applications begin writing to Confluent Platform, reverting clients to {{site.data.reuse.es_name}} is not a complete rollback procedure because the two clusters can diverge.
