---
title: "Disaster recovery topologies"
excerpt: "Geo-replication disaster recovery deployment options and topologies"
categories: georeplication
slug: disaster-recovery
toc: true
---

Geo-replication is designed to make it easier for you to mirror topics from one {{site.data.reuse.es_name}} cluster to another.

You can configure {{site.data.reuse.es_name}} for high availability disaster recovery (HADR) by using multiple {{site.data.reuse.es_name}} instances in different locations. Two key geo-replication topologies to consider as starting points for planning an HADR solution suitable for your business are:

- Active-Passive
- Active-Active

## Active-Passive topology

In the Active-Passive topology, there are two Kafka clusters; one active and one passive, which are in two different locations. The active cluster is the primary cluster where the data is processed, while the passive cluster serves as a backup for disaster recovery purposes.

Geo-replication provides unidirectional data replication between the 2 Kafka clusters. This is one way to mitigate the risks that are associated with any outages that might cause data loss and interrupt ongoing business activities.

![Active - passive topology diagram.]({{ 'images' | relative_url }}/ActivePassive.png "Diagram that shows how active-passive replication works.")

This approach is typically used when there is a need for data recovery or business continuity because the secondary {{site.data.reuse.es_name}} cluster provides a backup to the primary cluster if there is a disaster or outage. Unidirectional replication ensures that the secondary cluster has a copy of the data, but this {{site.data.reuse.es_name}} instance is not directly accessed by producer and consumer applications.

If there is a failure in the active cluster, the passive cluster can be activated to take over processing of data. To implement an Active-Passive topology with geo-replication, a geo-replication custom resource must be configured on the Red Hat OpenShift cluster hosting the passive cluster that will allow the data from the primary active cluster to be copied across to the secondary cluster.

In an Active-Passive topology, the primary {{site.data.reuse.es_name}} cluster, Cluster-1, is hosting Topic-A so all producer and consumer applications for Topic-A are connected to Cluster-1.

Cluster-2 maintains a backup of the data from Cluster-1. This backup is ready so that if there is an outage of the active cluster the system can be restarted with little data loss. The backup cluster is not accessed directly by any of the producer or consumer applications.

![Active passive with application.]({{ 'images' | relative_url }}/ActivePassiveApplication.png "Active passive with application")

If there is business need to always have access to the data, some applications can be connected to the secondary cluster during an outage to access the backed-up data while the primary cluster might be inaccessible.

The number of {{site.data.reuse.es_name}} geo-replication instances that are needed depends mainly on the requirements of your HADR solution. For example:

- How much data are you putting through your primary cluster?
- How critical is the access to each topic?
- How much tolerance is there for the replication lag across your system?

For more information about how to set up geo-replication on your cluster, see [setting up geo-replication](../setting-up).

## Active-Active topology

In the Active-Active topology, there are two {{site.data.reuse.es_name}} clusters that are both active, and applications produce and consume from both the active clusters. The Active-Active topology can be useful for scenarios where high availability across different geographical regions and having a cluster always active is critical for business continuity.

Geo-replication is configured in both directions between the two active clusters. Each cluster process data independently for the applications that are directly linked to it, while also serving as a backup for the other cluster. This helps to ensure that a failure in one of the clusters does not completely stop business processes. Furthermore, historical data from the disrupted cluster can still be used by applications that are connected to the remaining active cluster.  

![Active - active topology diagram.]({{ 'images' | relative_url }}/ActiveActive.png "Diagram that shows architecture of an active-active topology.")

In the previous diagram, there is Topic-A on Cluster-1 and it is being replicated to a copy called `Cluster-1.Topic-A` on to Cluster-2 and vice versa.

With the Active-Active topology, you can achieve:

- High availability of data across different geographies
- Lower latency by connecting clients to a more local {{site.data.reuse.es_name}}
- Disruption isolation by distributing data processing across multiple clusters in different availability zones (for more information, see [considerations for multizone deployments](../../installing/multizone-considerations/)).

Further to the HADR capabilities offered by the Active-Active topology, a consumer application that is connected to Cluster-1 can be configured to read data that is produced to different clusters as if it were coming from one topic. You can achieve this by setting the topics list to use a name with a wildcard character like `*Topic-1`. This means that the client reads from both Topic-1 and `Cluster-2.Topic-1` and all messages are processed regardless of where they were originally produced.

![Single topic across 2 instances diagram.]({{ 'images' | relative_url }}/SingleTopic2Clusters1.png "Diagram that shows a single consumer for *topic-1.")

In the previous diagram, consumers that are connected to Cluster-1 can access the data from Cluster-2 without having to connect directly to Cluster-2.

Active-Active topology can be useful for:

- Clusters that are in different geographic locations
- Applications that care about the location where the data comes from
- Applications that are independent of location and prefer a broader view of the data across different {{site.data.reuse.es_name}} clusters.

![Single topic across 2 instances diagram.]({{ 'images' | relative_url }}/SingleTopic2Clusters2.png "Diagram that shows consumer with conceptual topic across 2 clusters.")
