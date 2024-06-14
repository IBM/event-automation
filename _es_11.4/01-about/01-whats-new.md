---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 11.4.x.


## Release 11.4.0

### OpenShift only: Monitoring dashboard is now supported with all authentication mechanisms

You can now access the **Monitoring** dashboard with any authentication mechanism on OpenShift including SCRAM authentication and Keycloak authentication. For more information about enabling and accessing the dashboard, see [monitoring cluster health](../../administering/cluster-health#viewing-the-preconfigured-dashboard).

### Kafka version upgraded to 3.7.0

{{site.data.reuse.es_name}} version 11.4.0 includes Kafka release 3.7.0, and supports the use of all Kafka interfaces.

### Apicurio version updated to 2.5.11.Final

{{site.data.reuse.es_name}} 11.4.0 includes Apicurio Registry version 2.5.11.Final for [managing schemas](../../schemas/overview/#schema-registry).

### Apicurio Registry server version is upgraded to 2.5.11.Final

Apicurio Registry server version is upgraded to 2.5.11.Final in the {{site.data.reuse.es_name}} version 11.4.0. Ensure all applications connecting to your instance of {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.5.0 or later before [upgrading](../../installing/upgrading/#prerequisites) to {{site.data.reuse.es_name}} 11.4.0. For more information, see [prerequisites](../../installing/prerequisites#schema-requirements).

### Updates to supported Kubernetes versions

- {{site.data.reuse.es_name}} version 11.4.0 introduces support for Kubernetes platforms version 1.30 that support the Red Hat Universal Base Images (UBI) containers.

- To install {{site.data.reuse.es_name}} 11.4.0 and later 11.4.x versions, ensure that you have installed a Kubernetes version 1.25 or later. 

For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).

### Support for IBM Power8 systems (ppc64le) is removed

Support for IBM Power8 systems (ppc64le) is removed in {{site.data.reuse.es_name}} version 11.4.0 and later. Ensure that you deploy {{site.data.reuse.es_name}} 11.4.0 on IBM Power9 or later systems (ppc64le).

For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).

### Support for IBM z13 (s390x) is removed

Support for IBM z13 (s390x) is removed in {{site.data.reuse.es_name}} version 11.4.0 and later. Ensure that you deploy {{site.data.reuse.es_name}} 11.4.0 on IBM z14 or later systems.

For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.4.0 contains security and bug fixes.
