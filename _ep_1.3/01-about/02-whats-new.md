---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.3.x.

## Release 1.3.2

### Processor nodes: detect patterns

In {{site.data.reuse.ep_name}} 1.3.2 and later, you can use the detect patterns node to identify sequences of events across the input streams that match a defined pattern within a time interval. For more information, see the [detect patterns node](../../nodes/processornodes#detect-patterns) and the [related tutorial]({{ '/tutorials/detect-patterns/' | relative_url }}).

### Manage jobs on a Flink session cluster by operating on instances of the `FlinkSessionJob` custom resource

In {{site.data.reuse.ep_name}} version 1.3.2 and later, you can install only the {{site.data.reuse.ibm_flink_operator}} to deploy and manage the Flink session job on a session cluster by using the `FlinkSessionJob` custom resource. You can create and deploy a custom Flink job written in Java. For more information, see [installation overview](../../installing/overview/).

### Interval join node: support for inclusive and exclusive left joins

In Event Processing 1.3.2 and later, the interval join node has been enhanced to support additional join types, such as inclusive and exclusive left joins, providing more flexibility in combining events from multiple input streams.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.3.2 compared to 1.3.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.3.2 icon]({{ 'images' | relative_url }}/1.3.2.svg "In Event Processing 1.3.2 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.3.2 and {{site.data.reuse.ibm_flink_operator}} version 1.3.2 contain security and bug fixes.

## Release 1.3.1

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

In {{site.data.reuse.ibm_flink_operator}} version 1.3.0 and later, you can create, list, and delete a savepoint or checkpoint for a Flink job by using the `FlinkStateSnapshot` custom resource. For more information, see [creating and managing savepoints](../../installing/backup-restore/#backing-up).

### API enrichment node: support for operations with arrays of complex types

Body parameters can now be mapped with complex array properties or complex array constant values, and the supported types for items in the array of a body parameter have been expanded to include `array` and `object`. Additionally, API responses now support complex arrays.

### Apache Flink updated to 1.20

{{site.data.reuse.ibm_flink_operator}} version 1.3.0 update includes Apache Flink version 1.20.

### Support for Kubernetes 1.32

{{site.data.reuse.ep_name}} version 1.3.0 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for Kubernetes platforms version 1.32 that support the Red Hat Universal Base Images (UBI) containers.

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.3.0 and {{site.data.reuse.ibm_flink_operator}} version 1.3.0 contain security and bug fixes.

