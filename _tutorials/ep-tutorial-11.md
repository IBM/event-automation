---
title: "Processing MQ messages"
description: "MQ queues and topics are a valuable source of events for processing."
permalink: /tutorials/event-processing-examples/example-11
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 11
---

## Scenario

MQ queues and topics are a valuable source of events for processing. In this tutorial, you will see how MQ messages can be surfaced on Kafka topics, from where they can be used as a source of events for {{site.data.reuse.ep_name}}.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

You will also need to [run the optional instructions for deploying an MQ queue manager](../guided/tutorial-0#ibm-mq). In addition to setting up the MQ queue manager, it will also start the Kafka Connect connector to flow messages from MQ into Kafka.

**Tip**: The MQ Connector is just [one of many connectors available](/event-streams/connectors/) for bringing data into Kafka. Connectors are an effective way to enable processing events from a wide variety of systems and technologies.

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots may differ from the current interface if you are using a newer version.

- Event Streams 3.2.1
- Event Endpoint Management 11.0.1
- Event Processing 1.0.0
- MQ 2.4.0

## Instructions

### Step 1 : Discover the MQ queue

Messages in this scenario will start life on an MQ queue called `COMMANDS`. Start by accessing the queue in the MQ Console.

1. Go to the **MQ web console**.

    You can get the URL for the web console from the `queuemanager-ibm-mq-web` route, and the password from the `platform-auth-idp-credentials` secret.

    If you have `oc` CLI access to your OpenShift cluster, you can use this:

    ```sh
    # URL
    oc get route \
        queuemanager-ibm-mq-web \
        -n event-automation \
        -o jsonpath='https://{.spec.host}'

    # password for 'admin' user
    oc get secret \
        platform-auth-idp-credentials \
        -n ibm-common-services \
        -o jsonpath='{.data.admin_password}' | base64 -d
    ```

2. Navigate to the `COMMANDS` queue.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-1.png "screenshot of the MQ Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-1.png "screenshot of the MQ Console")

### Step 2 : Verify the MQ connector

The next step is to verify that MQ messages are surfaced on the Kafka topic as a stream of events.

1. Go to the **{{site.data.reuse.es_name}}** topics list, and find the `MQ.COMMANDS` topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-2.png "screenshot of the Event Streams topic"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-2.png "screenshot of the Event Streams topic")

    If you need a reminder of how to access the {{site.data.reuse.es_name}} web UI, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-streams).

2. Use the **Create** button in the MQ Console to PUT a JSON message to the MQ queue.

    ```json
    {
        "id": 1000,
        "count": 11,
        "destination": "ABC"
    }
    ```

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-3.png "screenshot of the MQ Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-3.png "screenshot of the MQ Console")

3. Use the {{site.data.reuse.es_name}} topic page to verify that the message appears as an event on the Kafka topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-4.png "screenshot of the Event Streams topic"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-4.png "screenshot of the Event Streams topic")

4. Confirm that the message remains available on the `COMMANDS` queue.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-5.png "screenshot of the MQ Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-5.png "screenshot of the MQ Console")

    The use of a [streaming queue](https://www.ibm.com/docs/en/ibm-mq/9.2?topic=scenarios-streaming-queues) means that a copy of messages can be made available for transferring to Kafka without disrupting any existing MQ application that is getting the messages.

### Step 3 : MQ messages as a source of events

The next step is to create an event source in {{site.data.reuse.ep_name}} based on the source of events from the MQ queue.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page")

    If you need a reminder of how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to process events originating from MQ.

1. Create an **Event source** node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-6.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-6.png "adding an event source node")

    Create an event source node by dragging one onto the canvas. You can find this in the "Events" section of the left panel.

1. Add a new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-7.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-7.png "adding an event source node")

    Configure the event source node by clicking the three dot menu, and choosing "Edit".

1. Put the Kafka listener address from {{site.data.reuse.es_name}} into the server address for the event source node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-8.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-8.png "adding an event source node")

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-9.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-9.png "adding an event source node")

    You need to accept the certificates for the Kafka cluster to proceed.

1. Use the username and password for the `kafka-demo-apps` user for accessing the new topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-10.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-10.png "adding an event source node")

    If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](../guided/tutorial-access#accessing-kafka-topics) section of the Tutorial Setup instructions.

1. Select the `MQ.COMMANDS` topic to use as a destination.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-11.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-11.png "adding an event source node")

1. Copy the message payload from the {{site.data.reuse.es_name}} topic view.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-12.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-12.png "adding an event source node")

1. Paste the message payload into the {{site.data.reuse.ep_name}} event source as a sample message.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-13.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-13.png "adding an event source node")

1. Click **Configure** to finalize the event source.

### Step 4 : Filter the events

1. Create a **Filter** node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-14.png "adding a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-14.png "adding a filter node")

    Create a filter node by dragging one onto the canvas. You can find this in the "Processors" section of the left panel.

    Click and drag from the small gray dot on the event source to the matching dot on the filter node.

    **Did you know?** You can add a node onto the canvas and automatically connect it to the last node added by double-clicking it in the palette.

2. Suggested filter expression:

    ```sql
    `count` > 10
    ```

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-15.png "adding a filter node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-15.png "adding a filter node")

1. Click **Configure** to finalize the filter.

### Step 5 : Testing the flow

The final step is to run your event processing flow and view the results.

1. Use the "Run" menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

1. Click the Filter node to see a live view of results from your filter. It is updated as new events are emitted onto the orders topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-16.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-16.png "running the flow")

1. Put additional JSON messages to the MQ queue using the MQ console, and verify that messages that match your filter are displayed in the event processing view.

    Suggested messages:

    ```json
    {
        "id": 1001,
        "count": 15,
        "destination": "XYZ"
    }
    ```

    ```json
    {
        "id": 1002,
        "count": 7,
        "destination": "MNO"
    }
    ```

1. When you have finished reviewing the results, you can stop this flow.


## Recap

Connectors make it easy to bring streams of events from a wide variety of external systems into Kafka topics, from where you can analyze them using {{site.data.reuse.ep_name}}.
