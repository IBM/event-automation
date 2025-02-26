---
title: "About topic mirroring"
excerpt: "Learn about mirroring topics between your clusters."
categories: mirroring
slug: about
toc: true
---


Sometimes there is a need to copy messages from a topic in one Kafka cluster to an equivalent topic in another cluster. This is known as topic mirroring. There are a number of possible reasons to perform topic mirroring, including data distribution, disaster recovery, and infrastructure maintenance. 

Two capabilities exist within {{site.data.reuse.es_name}} to enable topic mirroring:

* [MirrorMaker 2.0](../mirrormaker): MirrorMaker 2.0 is a part of Apache Kafka that is available (and supported) for use within {{site.data.reuse.es_name}}. 
* [Geo-replication](../../georeplication/about): {{site.data.reuse.es_name}} provides a geo-replication feature based on MirrorMaker 2.0. Geo-replication is a simpler mechanism for configuring mirrored topics, with a slightly reduced feature set. 

The geo-replication feature, unique to {{site.data.reuse.es_name}}, is well suited to data distribution use cases. For advanced use cases such as disaster recovery and infrastructure maintenance, MirrorMaker 2.0 might be required.


## Common use cases

The following sections discuss the various use cases in detail and the considerations in relation to topic mirroring.

![Topic mirroring use case table]({{ 'images' | relative_url }}/mirroringtable.png "Diagram showing the various use cases for topic mirroring in Apache Kafka"){:height="50%" width="50%"}

### Data distribution

Topics are often mirrored to make their data more directly accessible in another region. One of the most common reasons for this is to reduce latency for consumers. Creating a copy of a topic in a data center that is local to the consumers reduces the network distance between the consumer and the Kafka broker. This can have a significant effect on the achievable throughput of event consumption. 

![Mirroring to reduce client latency]({{ 'images' | relative_url }}/reducing-latency.png "Diagram showing mirroring of topics between regions to reduce latency"){:height="75%" width="75%"}
 
This pattern can also result in a reduction of data movement costs, especially if the second region has a significant number of consumers. Cloud vendors often charge for the transfer of data between their cloud regions (ingress and egress). If all consumers were to consume directly from the original region, this would create a very high volume of expensive cross-region traffic. If the consumers instead go to a local replica of the topic within their own region, there will only be a single data movement cost to copy the data through mirroring. 

Also, there might be multiple regions that would benefit from a copy of the data, which results in a broadcast pattern mirroring to multiple clusters.
 
![Mirroring to broadcast to multiple regions]({{ 'images' | relative_url }}/broadcast.png "Diagram showing use of topic mirroring to broadcast to multiple consuming regions"){:height="60%" width="60%"}

#### Data isolation

There might be instances where the data on some topics in a Kafka cluster is sensitive (sometimes called sovereign data) and should never leave the region. It can be complex to validate that you have set up access control lists correctly, and ensure that consumers can only see the data they are allowed to.

![Mirroring for data isolation]({{ 'images' | relative_url }}/data-isolation.png "Diagram showing use of topic mirroring to simplify data isolation between regions"){:height="75%" width="75%"}

Sometimes a better option is to provide each region with a separate Kafka cluster (data isolation) and use mirroring to copy only topics with data that is appropriate for the other region. This makes the security model much simpler on the consumer side since the consumers in the second region do not even have a copy of topics that they should not see.

#### Aggregation

The aggregation type of topic mirroring is useful when the elements of data are produced in multiple different regions, but the data must be processed as a whole. For example, notifications of sales might be produced in multiple countries, but must be aggregated to analyze worldwide trends and manage overall inventory.
 
![Mirroring to aggregate topics]({{ 'images' | relative_url }}/aggregation.png "Diagram showing aggregation of topics from multiple regions into a cluster in a central aggregation cluster"){:height="60%" width="60%"}

When all the regions produce directly to the central cluster, there are heavy dependencies on the availability and performance of long network paths. Furthermore, the producers suffer higher latency when producing messages.

To reduce latency and improve the availability and performance, you can use the aggregate type of mirroring as follows:

1. Ensure that producers write to local clusters, and then pull topic data from the local cluster into a central cluster to process it in aggregate.
1. Use topic wildcards in your [subscription](https://kafka.apache.org/39/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#subscribe(java.util.regex.Pattern,org.apache.kafka.clients.consumer.ConsumerRebalanceListener)){:target="_blank"} to consume from all the topics at once and perform your processing.

#### Shared aggregation

Another variant of the aggregation pattern is a shared aggregate topic. In our examples earlier, applications are specifically either producers or consumers, but there are circumstances where you might have both consumers and producers of a topic on both the local and remote locations.

![Mirroring for a shared aggregate topic]({{ 'images' | relative_url }}/shared-aggregate-topic.png "Diagram showing how two physical topics can be combined to create one logical topic that enable production and consumption across two clusters"){:height="75%" width="75%"}

To facilitate this, complete the following steps:

1. Create a single logical topic from two physical topics.
2. Ensure that the producers always produce to a particular local topic which is then mirrored across to the other region.
3. Ensure that the consumers [subscribe](https://kafka.apache.org/39/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#subscribe(java.util.regex.Pattern,org.apache.kafka.clients.consumer.ConsumerRebalanceListener)){:target="_blank"} by using topic-based wildcards to both the local topic and the remote topic that is mirrored, hence receiving events from producers in both regions.

**Note:** With the shared aggregate pattern, the consumers in each region might receive locally produced events faster than remote produced events. This might be an issue if events with the same key are created on both local and remote locations. Sequence of events is often important and the normal sequence preservation from the Kafka partitioning strategy does not prevail across multiple separate topics.

### Disaster recovery

Topic mirroring can also be used as part of a disaster recovery plan to replicate the events to a separate cluster on the disaster recovery site. 

![Mirroring for disaster recovery]({{ 'images' | relative_url }}/disaster-recovery.png "Diagram showing how disaster recovery is achieve using mirroring"){:height="60%" width="60%"}

**Important:** When planning for disaster recovery, review key business requirements such as the Recovery Point Objective (RPO) and Recovery Time Objective (RTO) for the topics that are being replicated. The topic data (the events) as well as the topic configuration (including partitioning information etc.) must be replicated to ensure that the target cluster looks largely identical to the consumers when they are switched over to it. 

**Note:** Ensure that you review how the consumer offsets are replicated. This can be done by topic mirroring if the consumers are storing offsets in Kafka. However, if the consumers are storing their own offsets, this needs to be separately handled as part of the disaster recovery plan. 

For more information, see [disaster recovery](../../installing/disaster-recovery/). 

### Infrastructure maintenance

Mirroring is often employed to enable transition from one Kafka infrastructure to another. Mirroring in this situation is used as a transitory step, and only in place until the origin Kafka cluster is no longer required.

This might be used to migrate to a cluster stationed locally to a new version of an application, or to move to an upgraded Kafka cluster when an in-place upgrade is for some reason untenable.

![Mirroring for application migration]({{ 'images' | relative_url }}/migration.png "Diagram showing how mirroring is used to enable migration to a new version of an event driven application"){:height="75%" width="75%"}

Topic mirroring is always asynchronous, so the origin and new applications will inevitably have consumed to a different offset in the event stream at any given time. Depending on the nature of the application, this might affect whether the origin and new applications can work in parallel alongside one another during the migration, or the origin application must be stopped before the new application can start.

You also must consider at which point the producers must be migrated to the new cluster. To ensure that the consumers always have access to new messages until they are completely migrated, the producers would often be migrated after all the consumers are migrated.

**Important:** Ensure that all the events that are produced to the origin cluster have been mirrored across, before the producers begin producing events on the new cluster.

The other infrastructure upgrade use case is that of migrating applications to a new Kafka infrastructure, typically when performing a major upgrade to Kafka, or for example moving to a completely different hardware. The previous application migration considerations are applicable for this use case as well.


