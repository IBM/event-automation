---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---


Find out what is new in {{site.data.reuse.es_name}} version 13.0.x.

## Release {{site.data.reuse.es_current_version}}

### Redesigned user interface
{: #redesigned-user-interface}

{{site.data.reuse.es_name}} 13.0.0 introduces a redesigned user interface. Key improvements include:

- Enhanced data visualization in the metrics and producer panels.
- An enhanced payload viewer with improved formatting in the message browser.

### Support for v1 API
{:v1-api-support}

{{site.data.reuse.es_name}} 13.0.0 introduces support for the `v1` API version for the `EventStreams` custom resource.

**Important:** Before upgrading to {{site.data.reuse.es_name}} 13.0.0, you must migrate your custom resources from `v1beta2` to `v1`. For migration instructions, see [upgrading](../../installing/upgrading/#migrate-to-v1-api).

### Removal of v1beta2 API
{:v1beta2-api-removal}

The `v1beta2` API version for the `EventStreams` custom resource is no longer supported in {{site.data.reuse.es_name}} 13.0.0 and later, and has been removed.

For a complete list of removed fields, see the [12.3.x documentation]({{ 'es/es_12.3' | relative_url }}/installing/upgrading/#deprecated-fields).

### Removal of the `EventStreamsGeoReplicator` custom resource
{: #removal-of-the-eventstreamsgeoreplicator-custom-resource}

The `EventStreamsGeoReplicator` custom resource is no longer supported in {{site.data.reuse.es_name}} 13.0.0 and later, and has been removed. For more information, see [setting up geo-replication](../../georeplication/setting-up/).

### Removal of Kafka Proxy
{: #removal-of-kafka-proxy}

The Kafka Proxy is no longer supported in {{site.data.reuse.es_name}} 13.0.0 and later, and has been removed. For more information, see the [12.3.x documentation]({{ 'es/es_12.3' | relative_url }}/installing/upgrading/#remove-kafka-proxy).

### Support for Kubernetes 1.34 and 1.35
{: #support-for-kubernetes-134-and-135}

{{site.data.reuse.es_name}} version 13.0.0 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for Kubernetes platform versions 1.34 and 1.35 that support Red Hat Universal Base Images (UBI) containers.

### Apicurio Registry version updated to 3.2.5
{: #apicurio-registry-version-updated-to-325}

{{site.data.reuse.es_name}} 13.0.0 includes Apicurio Registry version 3.2.5 for [managing schemas](../../schemas/overview/#schema-registry). For more information about client application requirements, see [prerequisites](../../installing/prerequisites#schema-requirements).

### Security and bug fixes

{{site.data.reuse.es_name}} release 13.0.0 contains security and bug fixes.