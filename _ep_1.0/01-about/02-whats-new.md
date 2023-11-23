---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.0.x.

## Release 1.0.5

### Enrichment node: Database

{{site.data.reuse.ep_name}} release 1.0.5 introduces the **Database** node under a new section called **Enrichment**. With the database node, you can retrieve data from an external database (PostgreSQL) and integrate the data with the events within your {{site.data.reuse.ep_name}} flow. For more information, see the [database node](../../nodes/enrichmentnode/#database) and the associated tutorial about [enriching events with reference data]({{ 'tutorials' | relative_url }}/event-processing-examples/example-01).


### Support for other Kubernetes platforms

In addition to the existing support for the {{site.data.reuse.openshift}}, {{site.data.reuse.ep_name}} version 1.0.5 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for [installing](../../installing/installing-on-kubernetes/) on other Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

### Window top-n is now Top-n

In {{site.data.reuse.ep_name}} release 1.0.5, **Window top-n** node is renamed to **Top-n**. For more information, see the [top-n](../../nodes/windowednodes/#top-n) node.

### Top-n grouping

{{site.data.reuse.ep_name}} release 1.0.5 introduces top-n grouping. This feature enables you to apply the top-n condition on groups of events that have the same value of one or more properties in each time window. For more information about how to use the **Grouped-by** field, see [Top-n](../../nodes/windowednodes/#top-n).


### New UI section for aggregate and top-n nodes

{{site.data.reuse.ep_name}} release 1.0.5 introduces a new UI section called **Windowed** for nodes such as **Aggregate** and **Top-n**, which involve time windows. For more information, see [Windowed nodes](../../nodes/windowednodes/).

### Autosave

{{site.data.reuse.ep_name}} release 1.0.5 introduces autosave to save your flows automatically with user actions. For save status updates, see the canvas header.

- **Saving** ![Saving]({{ 'images' | relative_url }}/save_inprogress.png "Diagram showing save is in progress."){:height="30px" width="15px"} indicates that saving is in progress.
- **Saved** ![Save successful]({{ 'images' | relative_url }}/save_successful.png "Diagram showing save is successful."){:height="30px" width="15px"} confirms success.
- **Failed** ![Save failed]({{ 'images' | relative_url }}/save_error.png "Diagram showing that the save is failed."){:height="30px" width="15px"} indicates that there are errors. If an action fails to save automatically, you receive a notification to try the save again. Click **Retry** to re-attempt the save. When a valid flow is saved, you can proceed to run the job.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.0.5 compared to 1.0.4 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.0.5 icon]({{ 'images' | relative_url }}/1.0.5.svg "In Event Processing 1.0.5 and later")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.0.5 and {{site.data.reuse.flink_long}} version 1.0.4 contain security and bug fixes.

## Release 1.0.4

### Additional processor node: Window top-n

{{site.data.reuse.ep_name}} 1.0.4 introduces a new processor node called **Window top-n**, which filters out the highest or lowest values of a particular property within a specified time window. For more information, see [Window top-n](../../nodes/windowednodes/#top-n).

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.0.4 compared to 1.0.3 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.0.4 icon]({{ 'images' | relative_url }}/1.0.4.svg "In Event Processing 1.0.4 and later")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.0.4 and {{site.data.reuse.flink_long}} version 1.0.3 contain security and bug fixes.

## Release 1.0.3

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.0.3 and {{site.data.reuse.flink_long}} version 1.0.2 contain security and bug fixes.

## Release 1.0.2

### Flink version updated to 1.17.1

The {{site.data.reuse.flink_long}} version 1.0.1 update includes Apache Flink version 1.17.1.

### Updates to Flink samples

In version 1.0.1 and later of the {{site.data.reuse.flink_long}}, the following Flink samples include High Availability updates:

- Sample **Minimal Production** is configured with minimal High Availability for the Flink Job Manager. This means that Flink jobs are restarted automatically if the Flink cluster restarts. However, some downtime is expected as there is only a single Job Manager replica. For more information, see [Minimal Production](../../installing/planning#flink-minimal-production-sample).

- Sample **Production - Flink Application Cluster** is configured with High Availability for the Flink Job Manager. Thus, a second replica of the Job Manager pod is deployed by this sample, requiring additional CPU and memory. For more information, see [resource requirements](../../installing/prerequisites#resource-requirements) and [Production - Flink Application Cluster](../../installing/planning#flink-production-application-cluster-sample).

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.0.2 contains security and bug fixes.

## Release 1.0.1

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.0.1 contains security and bug fixes.

## Release 1.0.0

First General Availability release.
