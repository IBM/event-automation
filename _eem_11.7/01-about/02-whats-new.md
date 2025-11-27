---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.7.0.

## Release {{site.data.reuse.eem_current_version}}
{: #release-1170}

### Usability enhancements for operator-managed gateway deployments
{: #opman-yaml}

The custom resource YAML file that the {{site.data.reuse.eem_name}} UI generates for deploying operator-managed {{site.data.reuse.egw}}s includes the following usability enhancements:

- Added default certificate and issuer specifications. The specifications for a default cert-manager issuer and certificate are included in the {{site.data.reuse.egw}} YAML, so users no longer need to create them manually. For more information, see [installing an operator-managed Event Gateway ](../../installing/install-opman-egw/).
- Removed OpenTelemetry (OTEL) metric properties. OTEL metrics are configured after {{site.data.reuse.egw}} installation. For more information, see [export metrics](../../installing/export-metrics).

### Warning about deprecated Kafka API calls
{: #kafka-v4-warning}

The {{site.data.reuse.egw}} identifies any clients that are calling APIs that are deprecated in Kafka 4.0.0 and later. If any deprecated API calls are identified, then a warning is displayed in the {{site.data.reuse.eem_name}} UI. For more information, see [troubleshooting](../../troubleshooting/deprecated-kafka).

### Documentation: expanded overview page
{: #documentation-new-overview-page}

{{site.data.reuse.eem_name}} version 11.7.0 includes a new section in the [overview page](../overview/) that describes the benefits of {{site.data.reuse.eem_name}}, and illustrates how the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} are located between your Kafka cluster and clients.

### Support for {{site.data.reuse.openshift}} 4.20
{: #support-for-openshift-420}

{{site.data.reuse.eem_name}} version 11.7.0 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for {{site.data.reuse.openshift}} 4.20.

### Removal of support for {{site.data.reuse.openshift_short}} 4.15

{{site.data.reuse.eem_name}} 11.7.0 and later do not support {{site.data.reuse.openshift_short}} version 4.15. For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

### Removal of support for Kubernetes 1.25 and 1.26

{{site.data.reuse.eem_name}} 11.7.0 and later do not support Kubernetes versions 1.25 and 1.26. For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

### Security and bug fixes
{: #security-and-bug-fixes-1170}

{{site.data.reuse.eem_name}} release 11.7.0 contains security and bug fixes.
