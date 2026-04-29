---
title: "Monitoring flow metrics"
excerpt: "View metrics about your running flows to monitor their health and performance."
categories: administering
slug: flow-metrics
toc: true
---

![Event Processing 1.5.2 icon]({{ 'images' | relative_url }}/1.5.2.svg "In Event Processing 1.5.2 and later.") Monitor the health and performance of your running flows by viewing flow metrics. Flow metrics provide insights into uptime, restarts, and checkpoints.

When you run a flow, the **Flow metrics** tab is available next to the **Output events** tab. Click the **Flow metrics** tab to view real-time metrics about your flow.

## Flow health

The **Flow health** section displays the current state of your flow, including the following metrics:

![Flow health section showing checkpoints metrics]({{ 'images' | relative_url }}/ep-flow-metrics.png "Flow health section in Event Processing."){:height="100%" width="100%"}

- **Running time**:
  - **Current uptime**: Time since the flow was last started.
  - **Started on**: Timestamp when the flow was first started.
- **Restarts**:
  - **Number of restarts**: Total number of times the job has restarted due to failures or manual intervention.
  - **Last restart duration**: Time taken to complete the last successful restart.
- **Checkpoints**:
  - **Successful**: Number of successful checkpoints.
  - **Failed**: Number of failed checkpoints.
  - **Last checkpoint duration**: Time taken to complete the last successful checkpoint.
  - **Last successful checkpoint**: Time elapsed since the last successful checkpoint, displayed as relative time (for example, "now" or "3m ago"). Hover over the value to see the exact timestamp in your local time zone.

<!-- ## Event activity

The **Event activity** section displays information for both event source and event destination nodes in your flow:

- **Event source activity** table displays the following information for each event source:
  - **Name**: The event source node name.
  - **Number of events**: Total events received by the event source.
  - **Bytes read**: Total bytes read from the Kafka topic.
  - **Message lag**: Difference between the latest message offset and the last processed message in milliseconds.
  - **Latest Flink watermark**: Timestamp of the most recent watermark processed by Flink.

- **Event destination activity** table displays the following information for each event destination:
  - **Name**: The event destination node name.
  - **Number of events**: Total events sent to the destination.
  - **Bytes written**: Total bytes written to the Kafka topic.
    - **Message lag**: Difference between the latest message offset and the last processed message in milliseconds.

  - **Latest Flink watermark**: Timestamp of the most recent watermark processed by Flink. -->
