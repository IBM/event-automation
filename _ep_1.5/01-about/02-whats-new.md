---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---


## Update to Flink support policy
{: #update-to-flink-support-policy}

IBM's conditions of support for Apache Flink in {{site.data.reuse.ea_long}} has been expanded. For more information, see the [support policy statement]({{ '/support/support-policy/' | relative_url}}).

Find out what is new in {{site.data.reuse.ep_name}} version 1.5.x.


## Release {{site.data.reuse.ep_current_version}}
{: #release-150}

### Support for Apache Flink 2.2.0
{: #support-for-apache-flink-220}

{{site.data.reuse.ep_name}} 1.5.0 and later supports Apache Flink 2.2.0 for both UI-based flows and for Flink jobs deployed outside the {{site.data.reuse.ep_name}} UI.

Flink 1.20.3 is also supported, but only for deploying Flink jobs outside the {{site.data.reuse.ep_name}} UI. This includes:

- [Testing jobs by using the Flink SQL client](../../advanced/deploying-development)
- [Deploying jobs by using the Apache SQL Runner sample](../../advanced/deploying-production)
- [Deploying customized jobs](../../advanced/deploying-customized)

The {{site.data.reuse.ep_name}} UI is not supported when running a Flink instance with Flink 1.20.3.

To use Flink 1.20.3 for deploying Flink jobs, you must configure the `FlinkDeployment` custom resource to prevent automatic version upgrades. For more information, see [upgrading](../../installing/upgrading#prerequisites).

### Support for {{site.data.reuse.openshift}} 4.21
{: #support-for-openshift-421}

{{site.data.reuse.ep_name}} version 1.5.0 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.21.


### Removal of support for {{site.data.reuse.openshift_short}} 4.15

{{site.data.reuse.ep_name}} 1.5.0 and later do not support {{site.data.reuse.openshift_short}} version 4.15. For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).

### Removal of support for Kubernetes 1.25 and 1.26

{{site.data.reuse.ep_name}} 1.5.0 and later do not support Kubernetes versions 1.25 and 1.26. For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.5.0 and {{site.data.reuse.ibm_flink_operator}} version 1.5.0 contain security and bug fixes.