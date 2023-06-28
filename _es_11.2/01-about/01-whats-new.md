---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 11.2.x.

## Release 11.2.1

### Apicurio version updated to 2.4.3

{{site.data.reuse.es_name}}  11.2.1 includes support for Apicurio Registry 2.4.3. Ensure all applications connecting to {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.4.1 or later, then [migrate to the latest Apicurio]({{ 'es/es_11.1' | relative_url }}/troubleshooting/upgrade-apicurio/).

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

### Support for JMXTrans removed

{{site.data.reuse.es_name}} release 11.2.0 and later do not support JMXTrans, as the JMXTrans tool is no longer maintained. For more information, see the [Strimzi proposal](https://github.com/strimzi/proposals/blob/main/043-deprecate-and-remove-jmxtrans.md){:target="_blank"} about deprecating JMXTrans.

### Security and bug fixes

{{site.data.reuse.es_name}} release 11.2.0 contains security and bug fixes.

### CASE bundle version is 3.2.0

The CASE bundle version of {{site.data.reuse.es_name}} release 11.2.0 is aligned to the operator version: 3.2.0.
