---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.2.x.

## Release 1.2.4


### API enrichment node: support for operations with arrays of primitive types

Body parameters can now be mapped with primitive array properties or primitive array constant values. Supported types for items in the array of a body parameter are `string`, `number`, `integer`, and `boolean`.

### Rename nodes directly from the canvas

In {{site.data.reuse.ep_name}} 1.2.4 and later, you can rename any configured nodes directly from the canvas. Hover over the node or right-click the node in the canvas, click **More options** ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon when you hover over the node or right-click the node."){:height="30px" width="15px"}, and select **Rename**.

### Duplicate and delete flows from within the canvas

In {{site.data.reuse.ep_name}} 1.2.4 and later, the **Duplicate** and **Delete** features are also available in **More options** ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} next to **Run flow** in the navigation banner of the canvas.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.2.4 compared to 1.2.3 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.2.4 icon]({{ 'images' | relative_url }}/1.2.4plus.svg "In Event Processing 1.2.4 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.2.4 and {{site.data.reuse.ibm_flink_operator}} version 1.2.4 contain security and bug fixes.

## Release 1.2.3

### Deploy flows that are customized for production or test environments

{{site.data.reuse.ep_name}} version 1.2.3 introduces a new [flow export format](../../advanced/exporting-flows/#exporting-flows) that can be used for [deploying jobs that are customized for production or test environments](../../advanced/deploying-customized) into an [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} Flink cluster.

In most cases, this new deployment mechanism provides a better user experience and can be used with an automation in a continuous integration and continuous delivery (CI/CD) pipeline.

**Note:** The [Production - Flink Application cluster sample](../../installing/planning/#flink-production-application-cluster-sample) has been modified, and can only be used with the new deployment mechanism.

### You can now edit flow details and export flows from within the canvas

In {{site.data.reuse.ep_name}} 1.2.3 and later, both the **Edit details** and **Export** features are now also available in **More options** ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} next to **Run flow** in the navigation banner of the canvas. Also, you can edit the flow name by clicking it in the canvas.

### Support for Kubernetes 1.31

{{site.data.reuse.ep_name}} version 1.2.3 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for Kubernetes platforms version 1.31 that support the Red Hat Universal Base Images (UBI) containers.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.2.3 compared to 1.2.2 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3plus.svg "In Event Processing 1.2.3 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.2.3 and {{site.data.reuse.ibm_flink_operator}} version 1.2.3 contain security and bug fixes.

## Release 1.2.2

### Use your Flink SQL with custom nodes

In {{site.data.reuse.ep_name}} 1.2.2 and later, you can now use **Custom** nodes to unlock advanced SQL capabilities and run complex queries. Three new custom nodes are available: SQL source, SQL processor, and SQL destination. These nodes support Flink SQL, and can be configured and edited to meet your specific use cases. With the introduction of custom nodes, it is now possible to create flows that support changelog stream. For more information, see [custom nodes](../../nodes/custom) and the associated [tutorial]({{'/tutorials/event-processing-examples/example-05' | relative_url}}) about deduplicating repeated events.

### {{site.data.reuse.ep_name}} add-on for {{site.data.reuse.cp4i}} 

{{site.data.reuse.ep_name}} 1.2.2 and later is available as an add-on for {{site.data.reuse.cp4i}}. For more information, see [licensing]({{ 'support/licensing/#event-processing-add-on-for-ibm-cloud-pak-for-integration' | relative_url }}).

### Support for {{site.data.reuse.openshift}} 4.17

{{site.data.reuse.ep_name}} version 1.2.2 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.17.



### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.2.2 compared to 1.2.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.2.2 icon]({{ 'images' | relative_url }}/1.2.2plus.svg "In Event Processing 1.2.2 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.2.2 and {{site.data.reuse.ibm_flink_operator}} version 1.2.2 contain security and bug fixes.

## Release 1.2.1

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.2.1 and {{site.data.reuse.ibm_flink_operator}} version 1.2.1 contain security and bug fixes.

## Release 1.2.0

### Support for key and headers in the event source node

In {{site.data.reuse.ep_name}} release 1.2.0 and later, if your Kafka topic messages include key and headers information, {{site.data.reuse.ep_name}} automatically attempts to determine the key and headers, and you can define them as properties in the [event source node](../../nodes/eventnodes/#configuring-a-source-node).


### Apache Flink updated to 1.19.1

{{site.data.reuse.ibm_flink_operator}} version 1.2.0 update includes Apache Flink version 1.19.1.

### Updates to supported Kubernetes versions

To install {{site.data.reuse.ep_name}} 1.2.0 and later 1.2.x versions, ensure that you have installed a Kubernetes version 1.25 or later. For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).

### Support for IBM z13 (s390x) is removed

Support for IBM z13 (s390x) is removed in {{site.data.reuse.ep_name}} version 1.2.0 and later. Ensure that you deploy {{site.data.reuse.ep_name}} 1.2.0 on IBM z14 or later systems.

For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.2.0 and {{site.data.reuse.ibm_flink_operator}} version 1.2.0 contain security and bug fixes.