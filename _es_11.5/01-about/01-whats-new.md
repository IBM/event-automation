---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 11.5.x.



## Release 11.5.0

### Topic operator enhancements

The Topic operator has been enhanced to improve efficiency and scaling, and to remove the dependency on ZooKeeper. In version 11.5.0 and later, {{site.data.reuse.es_name}} uses the Topic operator and `KafkaTopic` custom resources to create, update,and delete Kafka topics.

### Apicurio version updated to 2.6.2.Final

{{site.data.reuse.es_name}} 11.5.0 includes support for Apicurio Registry 2.6.2.Final. Ensure all applications connecting to {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.6.2.Final or later, then [migrate to the latest Apicurio](../../installing/upgrading/#migrate-to-latest-apicurio-registry).


### Kafka version upgraded to 3.7.1

{{site.data.reuse.es_name}} version 11.5.0 includes Kafka release 3.7.1, and supports the use of all Kafka interfaces.

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.5.0 contains security and bug fixes.

