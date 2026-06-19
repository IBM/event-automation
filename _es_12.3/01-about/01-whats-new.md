---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---


Find out what is new in {{site.data.reuse.es_name}} version 12.3.x.

## Release 12.3.1
{: #release-1231}

### Apicurio Registry version updated to 3.2.2
{: #apicurio-registry-version-updated-to-322}

{{site.data.reuse.es_name}} 12.3.1 includes Apicurio Registry version 3.2.2 for [managing schemas](../../schemas/overview/#schema-registry). For more information about client application requirements, see [prerequisites](../../installing/prerequisites#schema-requirements).

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions-1231}

Any difference in features or behavior introduced by {{site.data.reuse.es_name}} 12.3.1 compared to 12.3.0 is highlighted in this documentation by using the following graphic: ![Event Streams 12.3.1 icon]({{ 'images' | relative_url }}/12.3.1.svg "In Event Streams 12.3.1 and later.")

### Security and bug fixes
{: #security-and-bug-fixes-1231}

{{site.data.reuse.es_name}} release 12.3.1 contains security and bug fixes.

## Release 12.3.0

### Geo-replication configuration simplified
{: #georeplication-configuration-simplified}

In {{site.data.reuse.es_name}} 12.3.0 and later, you can configure geo-replication by using the {{site.data.reuse.es_name}} UI or CLI. You no longer need to create an `EventStreamsGeoReplicator` custom resource on the destination cluster before configuring geo-replication. The UI or CLI directly creates and manages `KafkaMirrorMaker2` custom resources on the destination cluster instead. For more information, see [planning for geo-replication](../../georeplication/planning/).

### Deprecation of the `EventStreamsGeoReplicator` custom resource
{: #deprecation-of-the-eventstreamsgeoreplicator-custom-resource}

The `EventStreamsGeoReplicator` custom resource is deprecated in {{site.data.reuse.es_name}} 12.3.0 and later. Existing `EventStreamsGeoReplicator` resources continue to work but are no longer required for geo-replication.

### Deprecation of `v1beta2` API
{: #deprecation-of-v1beta2-api}

The `v1beta2` API is deprecated in {{site.data.reuse.es_name}} 12.3.0 and later, and will be removed in a future release. For more information about the deprecated fields, see [upgrading](../../installing/upgrading/#deprecated-fields).

### Support for disaster recovery licensing
{: #support-for-disaster-recovery-licensing}

{{site.data.reuse.es_name}} 12.3.0 and later supports disaster recovery licensing with a 2:1 ratio when deployed with {{site.data.reuse.cp4i}} licenses. For more information, see [disaster recovery licensing]({{ '/support/licensing/#disaster-recovery-licensing' | relative_url }}).

### Kafka version upgraded to 4.2.0
{: #kafka-version-upgraded-to-420}

{{site.data.reuse.es_name}} version 12.3.0 includes Kafka release 4.2.0, and supports the use of all Kafka interfaces.

### Security and bug fixes
{: #security-and-bug-fixes}

{{site.data.reuse.es_name}} release 12.3.0 contains security and bug fixes.
