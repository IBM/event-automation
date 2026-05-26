---
title: "Monitoring session cluster"
excerpt: "Monitor the health and capacity of the Flink session cluster supporting your authoring environment."
categories: administering
slug: session-cluster
toc: true
---

![Event Processing 1.5.3 icon]({{ 'images' | relative_url }}/1.5.3.svg "In Event Processing 1.5.3 and later.") Monitor the health and capacity of the Flink session cluster that supports your {{site.data.reuse.ep_name}} authoring environment. The session cluster is a shared Flink cluster that processes flows during development and testing. It consists of TaskManagers, which are the worker processes that execute flow operations.

To view session cluster information, navigate to the **Session cluster** page in the {{site.data.reuse.ep_name}} UI. This page displays real-time metrics about TaskManager health and resource usage.

## TaskManagers overview

The **TaskManagers overview** section provides a summary of the session cluster capacity:

- **Free TaskManager slots**: the number of available processing slots across all TaskManagers.
- **Total TaskManagers**: the total number of TaskManagers in the session cluster.

## TaskManager details

Each TaskManager is displayed as a card showing detailed health and resource metrics.

**Note:** When you have multiple TaskManagers, use the search box to find a specific TaskManager by name.


### Slot allocation

A visual bar chart displays the slot allocation for each TaskManager. Each colored segment in the bar represents an individual processing slot, with the color indicating the current state of the slot (used or available).

The slot information displays:
- **Slots used**: the number of slots currently in use, with available slots shown in parentheses.
- **Slots total**: the total number of processing slots provided by this TaskManager.

### Resource metrics

Each TaskManager card displays the following resource metrics:

- **CPU load**: the current CPU utilization as a percentage. A horizontal bar chart provides a visual representation of the load.
  - Low CPU load (green indicator): the TaskManager has available processing capacity.
  - High CPU load: the TaskManager is actively processing operations.

- **Memory usage**: the current memory utilization as a percentage. A horizontal bar chart shows the memory consumption.
  - The percentage indicates how much of the allocated memory for the TaskManager is currently in use.
  - A green indicator shows healthy memory usage levels.

### Downloading logs

Each TaskManager card includes a **Download TaskManager logs** link to download the log files for that TaskManager.

**Note:** You can also download logs using the **Download logs** dropdown button in the top-right corner of the page. This dropdown provides the following options:

- **All TaskManager logs**: Downloads log files from all TaskManagers in the session cluster.
- **JobManager logs**: Downloads log files from the JobManager, which coordinates job execution and manages the cluster.
- **All logs**: Downloads a complete set of logs including both TaskManager and JobManager logs.

## Benefits of monitoring

Session cluster metrics provide the following benefits:

- Assess capacity: determine if the cluster has sufficient resources to run additional flows.
- Identify bottlenecks: spot TaskManagers with high CPU or memory usage that might affect performance.
- Plan scaling: understand when additional TaskManagers are needed.
- Troubleshoot issues: use resource metrics and logs to diagnose flow execution problems.

## Best practices

- Monitor free slots: ensure free TaskManager slots are available before running new flows. If all slots are occupied, new flows cannot start until resources become available.
- Watch resource usage: high CPU or memory usage on TaskManagers may indicate that flows are resource-intensive or that the cluster needs additional capacity.
- Review logs regularly: download and review TaskManager logs when flows behave unexpectedly or encounter errors.
- Balance workload: if some TaskManagers show consistently higher resource usage than others, consider how flows are distributed across the cluster.



## Related information

- For information about monitoring individual flow metrics, see [monitoring flow metrics](../flow-metrics).
- For information about monitoring Flink with Prometheus and Grafana, see [monitoring Flink](../flink-health).
