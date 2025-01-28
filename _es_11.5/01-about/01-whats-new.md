---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 11.5.x.


## Release 11.5.2


### Enhanced Kafka topic management

In {{site.data.reuse.es_name}} 11.5.2 and later, you can set the replication factor for Kafka topics by using the {{site.data.reuse.es_name}} UI and CLI. For more information, see [setting topic replicas](../../getting-started/managing-topics/#setting-topic-replicas).

### Support for Kubernetes 1.31

{{site.data.reuse.es_name}} version 11.5.2 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for Kubernetes platforms version 1.31 that support the Red Hat Universal Base Images (UBI) containers.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.es_name}} 11.5.2 compared to 11.5.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Streams 11.5.2 icon]({{ 'images' | relative_url }}/11.5.2plus.svg "In Event Streams 11.5.2 and later.")

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.5.2 contains security and bug fixes.

## Release 11.5.1

### Enhanced Kafka topic management

In {{site.data.reuse.es_name}} 11.5.1 and later, you can set the number of partitions for Kafka topics by using the {{site.data.reuse.es_name}} UI. For more information, see [setting topic partitions](../../getting-started/managing-topics/#setting-topic-partitions).

### Enhanced topic list with status

In {{site.data.reuse.es_name}} 11.5.1 and later, you can view the status of your topics in both the UI and CLI to quickly identify and troubleshoot any issues with operations that are performed on a topic.

### Support for {{site.data.reuse.openshift}} 4.17

{{site.data.reuse.es_name}} version 11.5.1 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for {{site.data.reuse.openshift}} 4.17.

### Kafka version upgraded to 3.8.0

{{site.data.reuse.es_name}} version 11.5.1 includes Kafka release 3.8.0, and supports the use of all Kafka interfaces.

### Apicurio version updated to 2.6.5.Final

{{site.data.reuse.es_name}} 11.5.1 includes support for Apicurio Registry version 2.6.5.Final. Ensure all applications connecting to your instance of {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.5.0 or later. For more information, see [prerequisites](../../installing/prerequisites#schema-requirements).

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.es_name}} 11.5.1 compared to 11.5.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Streams 11.5.1 icon]({{ 'images' | relative_url }}/11.5.1plus.svg "In Event Streams 11.5.1 and later.")

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.5.1 contains security and bug fixes.

## Release 11.5.0

### Topic operator enhancements

The Topic operator has been enhanced to improve efficiency and scaling, and to remove the dependency on ZooKeeper. In version 11.5.0 and later, the {{site.data.reuse.es_name}} UI and CLI use the Topic operator and `KafkaTopic` custom resources to manage Kafka topics. As a result, the Topic operator is no longer an optional component.

### Apicurio version updated to 2.6.2.Final

{{site.data.reuse.es_name}} 11.5.0 includes support for Apicurio Registry 2.6.2.Final. Ensure all applications connecting to your instance of {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.5.0 or later. For more information, see [prerequisites](../../installing/prerequisites#schema-requirements).

### Kafka version upgraded to 3.7.1

{{site.data.reuse.es_name}} version 11.5.0 includes Kafka release 3.7.1, and supports the use of all Kafka interfaces.

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.5.0 contains security and bug fixes.

