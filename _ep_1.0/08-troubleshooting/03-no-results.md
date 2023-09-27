---
title: "Results stuck in `Waiting for output events`"
excerpt: "A running Event Processing flow is permanently waiting for results."
categories: troubleshooting
slug: waiting-for-events
toc: true
---

## Symptoms

When trying to view the results of your running flow by clicking the last node in the flow, the following message is displayed:

![Event Processing 1.0.4 icon]({{ 'images' | relative_url }}/1.0.4.svg "In Event Processing 1.0.4 and later") In {{site.data.reuse.ep_name}} 1.0.4 and later:

```transparent
Waiting for output events...
Waiting for events to arrive at this node, which depends on the quantity of events arriving, and the processing that you have configured.
```

In {{site.data.reuse.ep_name}} 1.0.3 and earlier:

```transparent
Waiting for receiving the events
It may take a while to receive the events. Please wait...
```

You waited a while and still no results are displayed.

## Causes

The following sections describe possible causes for not receiving the events.

### No new input events

No new events are being produced to event source topics in your processing flow. If new events are not being produced to topics, then your processing flow does not have new events to process.

#### To verify

Examine the Kafka topics that are used in your flow, and verify that new messages are being published.

**Note:** Verification instructions vary depending on the distribution of Apache Kafka that you are using.

#### To resolve the problem

If you are not receiving any new events, restore or resume the applications that are supposed to be producing to your Kafka topics. After you have verified new events are being produced to the topics, then new events appear in the results view of your processing flow.

Alternatively, if you have existing records on your Kafka topics, select the **Run > Include historical** option to process the existing records initially and then process any new events as they arrive. This can be useful when a topic is infrequently updated but contains historical data that has value in being processed.

### Refreshing browser or opening a running flow

After refreshing your browser or opening a running flow, when you open the results view, the `Waiting for output events` message is displayed.

This is because the results view shows events that are output by the processing flow while the view is open in the browser.

#### To resolve the problem

If events are being produced to the input topics, the results view is updated when a new event is processed.

If the topic only contained historical messages, stop and restart the flow by using the **Include historical** option.

**Important:** If you are using an event destination node, the reprocessed messages are written to the Kafka topic leading to duplicate messages.

### No matching events

Your {{site.data.reuse.ep_name}} flow might include filters or joins with conditions that do not match any events being processed.

For example, if you have a filter node with an expression `my-integer > 10` in your flow, but all incoming events have `my-integer` values that are less than 10, then no results are displayed.

#### To verify

It is helpful to incrementally test your {{site.data.reuse.ep_name}} flow as you create it. Testing your flow after adding each processing node makes it easier to identify when a condition in a new processing node does not match an incoming event.

#### To resolve the problem

Modify the match conditions in your {{site.data.reuse.ep_name}} nodes to ensure the condition will match at least one incoming event.

### Insufficient resources on your OpenShift cluster

When you start an {{site.data.reuse.ep_name}} flow from the {{site.data.reuse.ep_name}} UI, a new Apache Flink task manager pod is created to run your flow. If your OpenShift cluster is overcommitted and does not have sufficient CPU or memory to run a new pod, Apache Flink will wait for resource to become available. This means that although the processing flow has been started, the Apache Flink runtime is unable to begin processing incoming events.

#### To verify

Use the OpenShift web console to view the status of pods in your {{site.data.reuse.ep_name}} namespace. Look for a pod with `taskmanager` in the name that is in a `Pending` or an `Error` state.

#### To resolve the problem

View the **Events** tab for the Apache Flink task manager pod that is not in a `Running` state. The **Events** tab includes details such as **insufficient memory** or **insufficient cpu**.

Make additional resources available in your OpenShift cluster to allow your {{site.data.reuse.ep_name}} flow to run, and start emitting events.
