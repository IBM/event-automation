---
title: "About MirrorMaker 2.0"
excerpt: "Learn about how to use MirrorMaker 2.0 for topic replication across your clusters."
categories: mirroring
slug: mirrormaker
toc: true
---

MirrorMaker 2.0 is a capability within Apache Kafka that is used for copying (mirroring) topics from one Kafka cluster to another. MirrorMaker 2.0 can be used for a [wide range of use cases](../about) such as data distribution, to disaster recovery, and infrastructure maintenance.

Since MirrorMaker 2.0 is a part of Apache Kafka, it is also part of {{site.data.reuse.es_name}}, and is fully supported.

**Note:** Also see [geo-replication](../../georeplication/about) in {{site.data.reuse.es_name}}, which provides a simplified way of configuring MirrorMaker 2.0 for a subset of use cases.

MirrorMaker 2.0 makes use of the Kafka Connect framework, and offers dynamic configuration changes, offset synchronization, bidirectional mirroring, and improved performance.

## Offset synchronization

An important feature of MirrorMaker 2.0 is the offset synchronization.

When topics are mirrored to another cluster, the event offset for a given event in the origin topic will be different to the event in the destination topic. This can occur due to records that are deleted from the origin topic due to retention policies, or because of the control records that are created when using transactions. The issue is that if a consumer moves from the origin to the destination cluster without considering these offset differences, it will duplicate, or worse, loose events.

MirrorMaker 2.0 handles these offset differences by storing a mapping between the offsets in the origin and destination clusters. It then uses this mapping to correctly populate the consumer offsets topic on the destination cluster. When consumers start up against the destination cluster, they will begin reading from the correct point in the topic's event stream.

MirrorMaker 2.0 also synchronizes topic partitioning and access control lists, to ensure the destination cluster is as similar as possible to the origin cluster.

## Reference

The following blog posts explain how to configure MirrorMaker 2.0 for its most [common use cases](../about).

Data distribution:

- [Using MirrorMaker 2.0 to aggregate events from multiple regions](https://community.ibm.com/community/user/integration/blogs/dale-lane1/2024/03/29/mirrormaker-for-aggregating-across-regions){:target="_blank"}
- [Using MirrorMaker 2.0 to broadcast events to multiple regions](https://community.ibm.com/community/user/integration/blogs/dale-lane1/2024/04/02/mirrormaker-for-broadcasting-across-regions){:target="_blank"}
- [Using MirrorMaker 2.0 to share topics across multiple regions](https://community.ibm.com/community/user/integration/blogs/dale-lane1/2024/04/05/mirrormaker-for-shared-conceptual-topics){:target="_blank"}

Disaster recovery:

- [Using MirrorMaker 2.0 to create a failover cluster](https://community.ibm.com/community/user/integration/blogs/dale-lane1/2024/04/08/mirrormaker-for-failover){:target="_blank"}
- [Using MirrorMaker 2.0 to restore events from a backup cluster](https://community.ibm.com/community/user/integration/blogs/dale-lane1/2024/04/12/mirrormaker-for-backup-and-restore){:target="_blank"}

Infrastructure maintenance:

  * [Using MirrorMaker 2.0 to migrate to a different region](https://community.ibm.com/community/user/integration/blogs/dale-lane1/2024/04/18/mirrormaker-for-migration){:target="_blank"}
