---
title: "Introduction"
excerpt: "Event Streams is an event-streaming platform based on the open-source Apache Kafka® project."
categories: about
slug: overview
toc: false
---

{{site.data.reuse.es_name}} is an event-streaming platform based on the open-source Apache Kafka® project.  {{site.data.reuse.es_name}} release 2018.3.0 uses the Kafka 2.0 release and supports the use of all Kafka interfaces. 

![Event Streams 2018.3.1]({{ 'images' | relative_url }}/2018.3.1.svg "In Event Streams 2018.3.1.") {{site.data.reuse.es_name}} release 2018.3.1 uses the Kafka 2.0.1 release.

{{site.data.reuse.es_name}} builds upon the {{site.data.reuse.icp}} platform to deploy Apache Kafka in a resilient and manageable way. It includes a UI design aimed at application developers getting started with Apache Kafka, as well as users operating a production cluster.

{{site.data.reuse.es_name}} is available in two editions:
* {{site.data.reuse.ce_long}} is a free version intended for trials and demonstration purposes. It can be installed and used without charge.
* {{site.data.reuse.es_name}} is a paid-for version intended for enterprise use, and includes additional features such as geo-replication.

{{site.data.reuse.es_name}} features include:

* Apache Kafka deployment that maximizes the spread of Kafka brokers across the nodes of the {{site.data.reuse.icp}} cluster. This creates a highly-available configuration making the deployment resilient to many classes of failure with automatic restart of brokers included.
* Health check information and options to resolve issues with your clusters and brokers.
* Geo-replication of your topics between clusters to enable disaster recovery and scalability.\\
  {{site.data.reuse.geo-rep_note}}
* UI for browsing messages to help view and filter hundreds of thousands of messages, including options to drill in and see message details from a set time.
* Encrypted communication between internal components and encrypted storage by using features available in {{site.data.reuse.icp}}.
* Security with authentication and authorization using {{site.data.reuse.icp}}.
