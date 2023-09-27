---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.0.x.

## Release {{site.data.reuse.ep_current_version}}

### Additional processor node: Window top-n

{{site.data.reuse.ep_name}} 1.0.4 introduces a new processor node called **Window top-n**, which filters out the highest or lowest values of a particular property within a specified time window. For more information, see [Window top-n](../../nodes/processornodes/#window-top-n).

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
