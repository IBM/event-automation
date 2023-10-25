---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 11.2.x.

## Release 11.2.5

### Back up and restore your {{site.data.reuse.es_name}} static configurations

You can back up and restore your {{site.data.reuse.es_name}} static configurations by using the OpenShift APIs for Data Protection (OADP). For more information, follow the instructions in [backing up and restoring](../../installing/backup-restore/).

### Apicurio version updated to 2.4.12.Final

{{site.data.reuse.es_name}} 11.2.5 includes support for Apicurio Registry 2.4.12.Final. Ensure all applications connecting to {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.4.1 or later, then [migrate to the latest Apicurio](../../installing/upgrading/#migrate-to-latest-apicurio-registry).

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.2.5 contains security and bug fixes.

## Release 11.2.4

### Additional IBM supported connectors: IBM MQ connectors v2

The [connector catalog]({{ 'connectors' | relative_url }}) now includes additional connectors that are commercially supported for customers with a support entitlement for {{site.data.reuse.ea_long}} and {{site.data.reuse.cp4i}}:

- An [IBM MQ source connector v2]({{ 'connectors/kc-source-ibm-mq2/installation' | relative_url }}), which offers both exactly-once and at-least-once delivery of data from IBM MQ to Apache Kafka.
- An [IBM MQ sink connector v2]({{ 'connectors/kc-sink-ibm-mq2/installation' | relative_url }}), which offers both exactly-once and at-least-once delivery of data from Apache Kafka to IBM MQ.

### Apicurio version updated to 2.4.7

{{site.data.reuse.es_name}} 11.2.4 includes support for Apicurio Registry 2.4.7. Ensure all applications connecting to {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.4.1 or later, then [migrate to the latest Apicurio](../../installing/upgrading/#migrate-to-latest-apicurio-registry).

### Support for Kubernetes 1.28

{{site.data.reuse.es_name}} version 11.2.4 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for Kubernetes platforms version 1.28 that support the Red Hat Universal Base Images (UBI) containers.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.es_name}} 11.2.4 compared to 11.2.3 or earlier is highlighted in this documentation by using the following graphic: ![Event Streams 11.2.4 icon]({{ 'images' | relative_url }}/11.2.4.svg "In Event Streams 11.2.4.")

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.2.4 contains security and bug fixes.

## Release 11.2.3

### Kafka version upgraded to 3.5.1

{{site.data.reuse.es_name}} version 11.2.3 includes Kafka release 3.5.1, and supports the use of all Kafka interfaces.

### IBM support for JDBC sink connector

IBM support is now available for the [JDBC sink connector]({{ 'connectors/kc-sink-jdbc/installation' | relative_url }}).

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.es_name}} 11.2.3 compared to 11.2.2 or earlier is highlighted in this documentation by using the following graphic: ![Event Streams 11.2.3 icon]({{ 'images' | relative_url }}/11.2.3.svg "In Event Streams 11.2.3.")

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.2.3 contains security and bug fixes.

## Release 11.2.2

### Add your connectors with kaniko builder

When setting up connections for Kafka Connect, you can specify connectors in the Kafka Connect custom resource, and then build images that contain the connectors by using the kaniko builder. For more information, see [setting up connectors](../../connecting/setting-up-connectors/).

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.2.2 contains security and bug fixes.

## Release 11.2.1

### Apicurio version updated to 2.4.3

{{site.data.reuse.es_name}}  11.2.1 includes support for Apicurio Registry 2.4.3. Ensure all applications connecting to {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.4.1 or later, then [migrate to the latest Apicurio](../../installing/upgrading/#migrate-to-latest-apicurio-registry).

### Updated resource requirements in production samples

The resource requirements in the production 3, 6, and 9 broker sample configurations have been updated. For more information, see the [planning section](../../installing/planning/#sample-deployments).

### Support for Kubernetes 1.27

{{site.data.reuse.es_name}} version 11.2.1 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for Kubernetes platforms version 1.27 that support the Red Hat Universal Base Images (UBI) containers.

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.2.1 contains security and bug fixes.

## Release 11.2.0

### Support for other Kubernetes platforms

In addition to the existing support for the {{site.data.reuse.openshift}}, {{site.data.reuse.es_name}} version 11.2.0 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for [installing](../../installing/installing-on-kubernetes/) on other Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

### {{site.data.reuse.icpfs}} is optional on {{site.data.reuse.openshift}}

{{site.data.reuse.es_name}} 11.2.0 introduces support to run on {{site.data.reuse.openshift}} without requiring {{site.data.reuse.icpfs}}.

### Requirement for setting license ID 

{{site.data.reuse.es_name}} 11.2.0 introduces the requirement to set a license ID (`spec.license.license`) that must be set correctly when [creating an instance]({{ 'installpagedivert' | relative_url }}) of {{site.data.reuse.es_name}}. For more information, see [planning](../../installing/planning#license-usage).

### Support for `StrimziPodSets`

In {{site.data.reuse.es_name}} 11.2.0 and later, `StatefulSets` are replaced by `StrimziPodSets` to manage Kafka and Zookeeper related pods.

### Support for jmxtrans removed

{{site.data.reuse.es_name}} release 11.2.0 and later do not support jmxtrans, as the jmxtrans tool is no longer maintained. For more information, see the [Strimzi proposal](https://github.com/strimzi/proposals/blob/main/043-deprecate-and-remove-jmxtrans.md){:target="_blank"} about deprecating jmxtrans.

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.2.0 contains security and bug fixes.

### CASE bundle version is 3.2.0

The CASE bundle version of {{site.data.reuse.es_name}} release 11.2.0 is aligned to the operator version: 3.2.0.
