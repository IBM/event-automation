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
{: #release-151}



### Additional outputs for conditional branching
{: #additional-outputs-for-conditional-branching}

{{site.data.reuse.ep_name}} version 1.5.1 introduces additional output support for the [Filter](../../nodes/processornodes/#filter) and [SQL Processor](../../nodes/custom/#sql-processor) nodes, enabling conditional branching with multiple output paths.

- **Filter node**: Configure an additional output to capture events that do not match the filter expression, enabling the use of both matched and unmatched events in downstream nodes for separate processing.
- **SQL Processor node**: Define multiple VIEW statements to create side outputs that split the processing logic and send different results to separate downstream nodes.

This feature provides greater flexibility in designing event processing flows with conditional logic and multiple processing paths.

### Automatic merge of public certificates to the custom truststore
{: #automatic-truststore-merge-for-ssl-connections}

In {{site.data.reuse.ep_name}} 1.5.1 and later, when you provide a custom truststore containing self-signed or internal CA certificates, public CA certificates are automatically added from the Java truststore to your custom truststore. This means that public CA certificates are maintained through regular Java version updates, and you are not required to manually add and update them. The truststore merge feature is enabled by default.

For more information, see [configuring SSL](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry).

### Annotate on canvas with comments
{: #annotate-canvas-comments}

{{site.data.reuse.ep_name}} 1.5.1 introduces the commenting feature on the flow canvas. With comments, you can document your work directly on the canvas and collaborate with team members.

For more information, see [adding comments to your flow](../../getting-started/canvas/#adding-comments).

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions-151}

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.5.1 compared to 1.5.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.5.1 icon]({{ 'images' | relative_url }}/1.5.1.svg "In Event Processing 1.5.1 and later.")

### Security and bug fixes
{: #security-and-bug-fixes-151}

{{site.data.reuse.ep_name}} release 1.5.1 contains security and bug fixes.


## Release 1.5.0
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

