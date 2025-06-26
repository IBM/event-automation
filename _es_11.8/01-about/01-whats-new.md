---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 11.8.x.

## Release 11.8.1

### {{site.data.reuse.es_name}} CLI authentication with Keycloak

{{site.data.reuse.es_name}} 11.8.1 introduces support for accessing the {{site.data.reuse.es_name}} CLI by using Keycloak authentication. You can now [log in to the CLI](../../getting-started/logging-in/#logging-in-with-Keycloak) by using your Keycloak credentials when Keycloak authentication is [enabled](../../installing/configuring/#configuring-ui-and-cli-security).

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.es_name}} 11.8.1 compared to 11.8.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Streams 11.8.1 icon]({{ 'images' | relative_url }}/11.8.1plus.svg "In Event Streams 11.8.1 and later.")

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.8.1 contains security and bug fixes.

## Release 11.8.0

### Support for KRaft

{{site.data.reuse.es_name}} version 11.8.0 introduces support for Kafka Raft metadata (KRaft) as the only metadata management system, replacing ZooKeeper. KRaft provides a simplified architecture, improved scalability, and enhanced security.

If you are upgrading, your existing ZooKeeper-based cluster is migrated to KRaft during the upgrade process. Ensure your system meets the requirements for migration as described in the [migration overview](../../installing/upgrading/#migration-to-kraft-overview).

**Note:** KRaft migration is irreversible, and ZooKeeper is not supported in 11.8.0 and later.

### Download Kafka connection properties file from UI

In {{site.data.reuse.es_name}} 11.8.0 and later, you can download the connection properties for your Kafka client applications as a file from the {{site.data.reuse.es_name}} UI. This is in addition to copying the properties as a snippet. For more information, see [obtaining Kafka connection properties](../../getting-started/connecting/#obtaining-kafka-connection-properties-from-event-streams-ui).

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.8.0 contains security and bug fixes.
