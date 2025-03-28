---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.3.x.

## Release {{site.data.reuse.ep_current_version}}

### Enrichment from watsonx.ai text generation services

In {{site.data.reuse.ep_name}} 1.3.1 and later, you can use watsonx.ai node to create an AI-generated response capability, which enables text generation from a deployed watsonx.ai prompt template. For more information, see the [watsonx.ai node](../../nodes/enrichmentnode#watsonx-node).

### Apache Flink updated to 1.20.1

{{site.data.reuse.ibm_flink_operator}} version 1.3.1 update includes Apache Flink version 1.20.1.


### Support for {{site.data.reuse.openshift}} 4.18

{{site.data.reuse.ep_name}} version 1.3.1 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.18.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.3.1 compared to 1.3.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.3.1 icon]({{ 'images' | relative_url }}/1.3.1.svg "In Event Processing 1.3.1 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.3.1 and {{site.data.reuse.ibm_flink_operator}} version 1.3.1 contain security and bug fixes.


## Release 1.3.0

### Trigger savepoints with `FlinkStateSnapshot` custom resource

In {{site.data.reuse.ibm_flink_operator}} version 1.3.0 and later, you can create, list, and delete a savepoint or checkpoint for a Flink job by using the `FlinkStateSnapshot` custom resource. For more information, see [creating and managing savepoints.](../../installing/backup-restore/#backing-up).

### API enrichment node: support for operations with arrays of complex types

Body parameters can now be mapped with complex array properties or complex array constant values, and the supported types for items in the array of a body parameter have been expanded to include `array` and `object`. Additionally, API responses now support complex arrays.

### Apache Flink updated to 1.20

{{site.data.reuse.ibm_flink_operator}} version 1.3.0 update includes Apache Flink version 1.20.

### Support for Kubernetes 1.32

{{site.data.reuse.ep_name}} version 1.3.0 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for Kubernetes platforms version 1.32 that support the Red Hat Universal Base Images (UBI) containers.

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.3.0 and {{site.data.reuse.ibm_flink_operator}} version 1.3.0 contain security and bug fixes.

