---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 12.1.x.

## Release {{site.data.reuse.es_current_version}}

### Apicurio Registry server version updated to 3.1.x
{: #apicurio-registry-server-version-updated-to-3.1.x}

{{site.data.reuse.es_name}} 12.1.0 includes Apicurio Registry server version 3.1.x for [managing schemas](../../schemas/overview/#schema-registry).

If you are upgrading to {{site.data.reuse.es_name}} 12.1.0, ensure before the upgrade that all applications connecting to {{site.data.reuse.es_name}} that use the schema registry use version 2 or later of the Apicurio Registry Core REST API and client libraries. For more information, see [planning your upgrade](../../installing/upgrading/#planning-your-upgrade).

### Removal of support for Apicurio Registry Core REST API version 1
{: #removal-of-apicurio-registry-core-rest-api-version-1}

Support for version 1 of the Apicurio Registry Core REST API is removed. Ensure that all applications connecting to {{site.data.reuse.es_name}} that use the schema registry are using version 2 or later of the Apicurio Registry Core REST API and client libraries.

### Removal of support for Confluent-compatible Schema Registry API version 6
{: #removal-of-support-for-confluent-compatible-schema-registry-api-version-6}

Support for version 6 of the Confluent-compatible Schema Registry API is removed. Ensure that all applications connecting to {{site.data.reuse.es_name}} that use the schema registry are updated to use version 7 or later of the Confluent-compatible Schema Registry API.

### Deprecation of support for Apicurio Registry Core REST API version 2
{: #deprecation-of-support-for-apicurio-registry-core-rest-api-version-2}

Support for version 2 of the Apicurio Registry Core REST API is deprecated and has been replaced by version 3. Version 2 support will be removed in a future release of {{site.data.reuse.es_name}}. For more information, see [prerequisites](../../installing/prerequisites#schema-requirements).

### Kafka version upgraded to 4.1.0

{{site.data.reuse.es_name}} version 12.1.0 includes Kafka release 4.1.0, and supports the use of all Kafka interfaces.

### Removal of support for {{site.data.reuse.openshift_short}} 4.12 and 4.15

{{site.data.reuse.es_name}} 12.1.0 and later do not support {{site.data.reuse.openshift_short}} versions 4.12 and 4.15. For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).

### Removal of support for Kubernetes 1.25 and 1.26

{{site.data.reuse.es_name}} 12.1.0 and later do not support Kubernetes versions 1.25 and 1.26. For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).

### Security and bug fixes

{{site.data.reuse.es_name}} release 12.1.0 contains security and bug fixes.

