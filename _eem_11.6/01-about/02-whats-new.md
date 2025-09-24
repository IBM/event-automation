---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.6.x.

## Release {{site.data.reuse.eem_current_version}}
{: #release-1164}

### Group-based event source and cluster management

In {{site.data.reuse.eem_name}} version 11.6.4, you can enable [user groups](../../security/groups) to edit event sources and maintain clusters.

### Enhanced visibility controls for published and archived options

In {{site.data.reuse.eem_name}} version 11.6.4, you can now add user groups to published and archived options that have custom visibility, and you can also convert published and archived options from custom to public. For more information, see [how you can edit user group visibility to options](../../describe/user-groups/#edit-group-visible-options-1164).

### Support for Kubernetes 1.33

{{site.data.reuse.eem_name}} version 11.6.4 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for Kubernetes platforms version 1.33 that support the Red Hat Universal Base Images (UBI) containers.

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions}

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.6.4 compared to 11.6.3 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.6.4 icon]({{ 'images' | relative_url }}/11.6.4.svg "In Event Endpoint Management 11.6.4 and later.").

## Release 11.6.3
{: #release-1163}


### Support for {{site.data.reuse.openshift}} 4.19
{: #support-for-openshift-419}

{{site.data.reuse.eem_name}} version 11.6.3 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.19.


### Group-based visibility to options
{: #group-based-visibility-to-options}

{{site.data.reuse.eem_name}} 11.6.3 introduces the feature for controlling [visibility to selected options](../../describe/user-groups/) based on [user groups](../../about/key-concepts/#user-groups).


### Gateway configuration details accessible from UI
{: #gateway-configuration-details-accessible-from-ui}

{{site.data.reuse.eem_name}} release 11.6.3 introduces a UI feature for viewing and downloading the configuration of your {{site.data.reuse.egw}} instances from the [manage gateways page](../../administering/managing-gateways).


### New metric to identify deprecated Kakfa clients
{: #kafka-version-metric}

{{site.data.reuse.eem_name}} release 11.6.3 introduces a new metric: `client_api_versions_gauge`. This new metric contains the `APIVersions` that the Kafka client is using for the different Kafka Protocol `APIKeys`. From this new metric, you can identify if you have any Kafka clients that are using deprecated Kafka APIs.


### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions-1163}

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.6.3 compared to 11.6.2 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.6.3 icon]({{ 'images' | relative_url }}/11.6.3.svg "In Event Endpoint Management 11.6.3 and later.")

### Security and bug fixes
{: #security-and-bug-fixes-1163}
{{site.data.reuse.eem_name}} release 11.6.3 contains security and bug fixes.

## Release 11.6.2
{: #release-1162}


### Wildcard redaction in an array of objects or simple types
{: #wildcard-redaction-in-an-array-of-objects-or-simple-types}

{{site.data.reuse.eem_name}} release 11.6.2 introduces support for wildcard array redaction. You can [redact](../../describe/option-controls/#redaction) specific fields within an array of objects, or all values in an array of simple types.


### OAuth Kafka cluster support
{: #oauth-kafka-cluster-support}

- {{site.data.reuse.eem_name}} release 11.6.2 introduces Kafka OAuth support for Amazon Managed Streaming for Apache Kafka (Amazon MSK) and Keycloak implementations for new 11.6.x {{site.data.reuse.egw}} instances.
- {{site.data.reuse.egw}}s from {{site.data.reuse.eem_name}} 11.5.x or earlier cannot connect to Kafka clusters that use OAuth. For more information, see [the related troubleshooting topic](../../troubleshooting/v2-gateways-oauth).

### API call tracing through the {{site.data.reuse.eem_manager}}
{: #api-call-tracing-through-the-manager}

In {{site.data.reuse.eem_name}} release 11.6.2 and later, you can configure the {{site.data.reuse.egw}} to export OpenTelemetry trace information about records processed. For more information, see [how to export trace data with OpenTelemetry](../../installing/export-metrics).


### Security and bug fixes
{: #security-and-bug-fixes-1162}

{{site.data.reuse.eem_name}} release 11.6.2 contains security and bug fixes.

### Documentation enhancements
{: #documentation-enhancements-1162}

{{site.data.reuse.eem_name}} release 11.6.2 introduces improvements to the documentation:

- TLS configuration section moved from [Configuring](../../installing/configuring) to a dedicated page under the **SECURITY** section: [Configuring TLS](../../security/config-tls).
- [Managing clusters](../../administering/managing-clusters), [Managing gateways](../../administering/managing-gateways), [Managing assets](../../administering/managing-assets), and [Audit logging](../../administering/audit-logging) pages moved to a new **ADMINISTERING** section.


### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions-1162}

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.6.2 compared to 11.6.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.6.2 icon]({{ 'images' | relative_url }}/11.6.2.svg "In Event Endpoint Management 11.6.2 and later.").

## Release 11.6.1
{: #release-1161}

### Documentation enhancements
{: #documentation-enhancements-1161}

{{site.data.reuse.eem_name}} release 11.6.1 introduces a restructured {{site.data.reuse.eem_manager}} [upgrade](../../installing/upgrading/) procedure. 

### Security and bug fixes
{: #security-and-bug-fixes-1161}

{{site.data.reuse.eem_name}} release 11.6.1 contains security and bug fixes.

## Release 11.6.0
{: #release-1160}

### Admin role CA certificate management
{: #admin-role-ca-certificate-management}

{{site.data.reuse.eem_name}} release 11.6.0 introduces admin management of the CA certificates that are used to secure [Mutual TLS controls](../../describe/option-controls#mtls). For more information, see [Managing CA certificates](../../security/ca-certs).


### Asset management  
{: #asset-management}

In {{site.data.reuse.eem_name}} release 11.6.0 and later, you can [transfer assets](../../administering/managing-assets) between users who have the correct permissions within their assigned role to own the asset.

### Collection of usage metrics
{: #collection-of-usage-metrics}

To improve product features and performance, {{site.data.reuse.eem_name}} 11.6.0 and later collects data about the usage of deployments by default. Data is collected about all {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.

You can [disable data collection]({{ '/support/licensing/#usage-metrics' | relative_url }}) at any time.


### Kafka record tracing through the {{site.data.reuse.egw}}
{: #kafka-record-tracing-through-the-gateway}

In {{site.data.reuse.eem_name}} release 11.6.0 and later, you can configure the {{site.data.reuse.egw}} to export OpenTelemetry trace information about records processed. For more information, see [how to export trace data with OpenTelemetry](../../installing/export-metrics).

### Security and bug fixes
{: #security-and-bug-fixes-1160}

{{site.data.reuse.eem_name}} release 11.6.0 contains security and bug fixes.