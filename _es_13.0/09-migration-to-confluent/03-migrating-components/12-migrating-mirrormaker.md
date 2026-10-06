---
title: "Migrating MirrorMaker 2"
excerpt: "Replace MirrorMaker 2 with Cluster Linking or Confluent Replicator on Confluent Platform."
categories: migration
slug: migrating-mirrormaker
toc: true
---

If your environment uses MirrorMaker 2 for geo-replication across multiple {{site.data.reuse.es_name}} clusters, migrate each cluster to Confluent Platform individually first. After all relevant clusters are migrated, replace MirrorMaker 2 with Cluster Linking between the Confluent Platform clusters. Keep MirrorMaker 2 running until each cluster is fully migrated and validated.

## Choosing a replication method
{: #choosing-a-replication-method}

The following table explains the replication methods available in MirrorMaker 2 and Confluent:

| Existing MirrorMaker 2 setup | Confluent approach | Notes |
|------------------------------|--------------------------------|-------|
| Geo-replication across multiple clusters for geographic redundancy or disaster recovery | Cluster Linking between Confluent Platform clusters | Set up after all relevant clusters are migrated to Confluent Platform. Preserves message bytes and offsets without a separate worker deployment. |
| Replication where Cluster Linking cannot be used (for example, network restrictions prevent broker-to-broker connectivity, or topics must be renamed) | Confluent Replicator | Runs as a Kafka Connect worker and requires only client-level network access to the source cluster. For consumer offset handling requirements, see [geo-replication offsets](../feature-compatibility/#geo-replication-offsets). |

## Migrating replication flows
{: #migrating-replication-flows}

Migrate the replication flows as follows:


1. List each MirrorMaker 2 replication flow, including the source cluster, target cluster, topic include and exclude lists, and replication policy.
2. Decide whether to use Cluster Linking or Confluent Replicator based on your network connectivity, and whether topics need to be renamed or schema subjects need to change.
3. Note the difference in how topic names are handled. MirrorMaker 2 prefixes replicated topic names with the source cluster alias by default, for example `source-cluster.orders`. Cluster Linking keeps the original topic name, for example `orders`. If your applications depend on the prefixed topic names, update them or use Confluent Replicator to reproduce the same naming pattern.
4. Set up replication on Confluent Platform by using Cluster Linking or Confluent Replicator.
5. Verify that the replication lag is zero for all topics.

Keep MirrorMaker 2 running until all applications are migrated and validated. Remove the MirrorMaker 2 deployment as part of [decommissioning {{site.data.reuse.es_name}}](../../04-post-migration/decommission/).
