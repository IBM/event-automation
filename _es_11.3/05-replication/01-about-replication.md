---
title: "About geo-replication"
excerpt: "Learn about setting up geo-replication for your clusters."
categories: georeplication
slug: about
toc: true
---

You can deploy multiple instances of {{site.data.reuse.es_name}} and use the included geo-replication feature to synchronize data between your clusters that are typically located in different geographical locations. 

![Event Streams geo-replication architecture]({{ 'images' | relative_url }}/architectures/ibm-event-automation-diagrams-es-georep.svg "Diagram showing the architecture of the Event Streams geo-replication as part of IBM Event Automation.")

Geo-replication can help with various service availability scenarios, for example:

* Making local copies of event topics available closer to applications in other locations in order to improve event consumption performance.
* Making mission-critical data safe: you might have mission-critical data that your applications depend on to provide services. Using the geo-replication feature, you can back up your topics to several destinations to ensure their safety and availability.
* Migrating data: you can ensure your topic data can be moved to another deployment, for example, when switching from a test to a production environment.

**Note:** The geo-replication feature only provides access to a subset of the capabilities of the underlying MirrorMaker 2.0 capability. For certain use cases, such as creating copies of topics for [disaster recovery](../disaster-recovery) purposes, it is best to use the underlying MirrorMaker 2.0 directly to access a wider set of features. 

## How it works

The Kafka cluster where you have the topics that you want to make copies of is called the "origin cluster".

The Kafka cluster where you want to copy the selected topics to is called the "destination cluster".

So, one cluster is the origin where you want to copy the data from, while the other cluster is the destination where you want to copy the data to.

Any of your {{site.data.reuse.es_name}} clusters can become a destination for geo-replication. At the same time, the origin cluster can also be a destination for topics from other sources.

Geo-replication not only copies the messages of a topic, but also copies the topic configuration, the topic's metadata, its partitions, and even preserves the timestamps from the origin topic.

After geo-replication starts, the topics are kept in sync. If you add a new partition to the origin topic, the geo-replicator adds a partition to the copy of the topic on the destination cluster.

You can set up geo-replication by using the {{site.data.reuse.es_name}} UI or CLI.

## What to replicate

What topics you choose to replicate depend on your use case. 

For example, you might choose to replicate all topics to destination clusters closer to the consumers of those topics, so that the consumers can read the topics at lower latency and network cost. 

Alternatively, you can use geo-replication to only replicate a subset of topics to another geography that contain data specific to that country, but have other topics that contain more locationally sensitive data to be only present in the origin cluster. 
