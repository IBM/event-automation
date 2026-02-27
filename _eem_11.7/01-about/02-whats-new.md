---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.7.2.

## Release {{site.data.reuse.eem_current_version}}
{: #release-1172}

### Support for {{site.data.reuse.openshift}} 4.21
{: #support-for-openshift-421}

{{site.data.reuse.eem_name}} version 11.7.2 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for {{site.data.reuse.openshift}} 4.21.

### Search field added to the Manage topics page
{: #event-source-search}

{{site.data.reuse.eem_name}} version 11.7.2 introduces a search field in the **Manage topics** page to help you discover and locate a specific topic, or range of topics.

### Security and bug fixes
{: #security-and-bug-fixes-1172}

{{site.data.reuse.eem_name}} release 11.7.2 contains security and bug fixes.

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions-1172}

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.7.2 compared to 11.7.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.7.2 icon]({{ 'images' | relative_url }}/11.7.2.svg "In Event Endpoint Management 11.7.2 and later.")

## Release 11.7.1
{: #release-1171}

### Client authentication sets
{: #client-auth-sets}

{{site.data.reuse.eem_name}} version 11.7.1 introduces the feature for administrators to manage the types of authentication that are available for authors to secure their event endpoints. The following authentication methods are available: Mutual TLS, OAuth 2.0, and SASL credentials, and combinations of these methods. For more information, see [managing event endpoint security](../../security/cred-sets).

### OAuth 2.0 authentication of event endpoints
{: #oauth2}

{{site.data.reuse.eem_name}} version 11.7.1 introduces support for clients to use OAuth 2.0 authentication when connecting to event endpoints. For more information, see [defining OAuth 2.0 authentication providers](../../security/cred-sets#oauth).

### Guided tutorial with mock gateway and Kafka cluster
{: #tutorial-gateway}

{{site.data.reuse.eem_name}} version 11.7.1 introduces tutorials that cover the end-to-end use case of using 
{{site.data.reuse.eem_name}}, including adding an {{site.data.reuse.egw}}, and publishing and subscribing to an event endpoint. The tutorials include a mock {{site.data.reuse.egw}}, mock Kafka cluster, and test data, designed to demonstrate the value of {{site.data.reuse.eem_name}} to users. You can access the tutorials from the **Help and support** menu in the UI.

### Security and bug fixes
{: #security-and-bug-fixes-1171}

{{site.data.reuse.eem_name}} release 11.7.1 contains security and bug fixes.

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions}

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.7.1 compared to 11.7.0 is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.7.1 icon]({{ 'images' | relative_url }}/11.7.1.svg "In Event Endpoint Management 11.7.1 and later.").

## Release 11.7.0
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
{{site.data.reuse.eem_name}} release 11.7.0 contains security and bug fixes.