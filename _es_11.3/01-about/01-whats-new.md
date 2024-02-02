---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 11.3.x.

## Release 11.3.0

### IBM supported JDBC sink connector

You can now use the IBM supported [JDBC sink connector]({{ 'connectors/kc-sink-jdbc-aiven/installation' | relative_url }}) to copy data into your database.

**Note:** IBM supports connections to Oracle databases only.

<!-- ### Share your topics with {{site.data.reuse.eem_name}}

In {{site.data.reuse.es_name}} 11.3.0 and later, you can [connect](../../installing/integrating-eem/) to an {{site.data.reuse.eem_name}} instance, and make the stream of events from a topic available to others by [sharing topic details](../../getting-started/sharing-topic/) through {{site.data.reuse.eem_name}}.

**Note:** This feature requires {{site.data.reuse.eem_name}} version 11.1.1 or later. -->

### {{site.data.reuse.es_name}} UI authentication with Keycloak

{{site.data.reuse.es_name}} 11.3.0 introduces support for accessing the {{site.data.reuse.es_name}} UI by using Keycloak authentication. The Keycloak instance can be shared with the other capabilities in {{site.data.reuse.cp4i}}, allowing for a single identity management system within {{site.data.reuse.cp4i}}. For Keycloak requirements and limitations, see the [prerequisites](../../installing/prerequisites/#prereqs-keycloak).

### Removal of RunAs authorizer

In versions 11.3.0 and later, the support for RunAs authorizer is removed, and the {{site.data.reuse.es_name}} components now use the configured Kafka listeners to connect to a Kafka cluster.

This means that each REST authentication mechanism you want to use must have a corresponding Kafka listener with the same authentication type configured. If you are upgrading from earlier versions, see the [post-upgrade tasks](../../installing/upgrading/#update-authentication-mechanisms) for more information.

### Apicurio version updated to 2.5.0.Final

{{site.data.reuse.es_name}} 11.3.0 includes support for Apicurio Registry 2.5.0.Final. Ensure all applications connecting to {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.5.0 or later, then [migrate to the latest Apicurio](../../installing/upgrading/#migrate-to-latest-apicurio-registry).

### Enhanced security with TLS 1.3

For enhanced security on the REST services endpoints, {{site.data.reuse.es_name}} 11.3.0 and later includes support for TLS 1.3. To enable TLS 1.3 for your component, set the `<component>.endpoints.tlsVersion` to `TLSv1.3` in your `EventStreams` custom resource as described in [configuring](../../installing/configuring/#rest-services-access).

### Providing external CA certificates for overrides

In {{site.data.reuse.es_name}} 11.3.0 and later, if you have overridden the certificates for any of the Kafka listeners or REST endpoints by providing certificates signed by an external Certificate Authority (CA), you must now [provide the public CA certificates](../../installing/configuring#providing-external-ca-certificates) that were used to sign those certificates.

### Audit trail for Kafka

{{site.data.reuse.es_name}} can be configured to generate a sequential record of activities within the {{site.data.reuse.es_name}} Kafka cluster. See [auditing Kafka](../../administering/auditing-kafka) to find out how to configure {{site.data.reuse.es_name}} to provide an audit trail for Kafka cluster activities, including sample configurations for different Kafka users and Kafka topics, and examples of audit records.

### Removal of Grafana provided by {{site.data.reuse.icpfs}}

The Grafana service provided by {{site.data.reuse.icpfs}} is removed in {{site.data.reuse.icpfs}} 4.x and later. If you are using Grafana provided by {{site.data.reuse.fs}} for your monitoring dashboards, see [the information about alternatives](../../administering/cluster-health/) you can switch to.

### Support for {{site.data.reuse.openshift}} 4.14

{{site.data.reuse.es_name}} 11.3.0 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for {{site.data.reuse.openshift}} 4.14.

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.3.0 contains security and bug fixes.
