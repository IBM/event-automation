---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.3.x.

## Release {{site.data.reuse.ep_current_version}}

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

