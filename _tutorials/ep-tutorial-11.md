---
title: "Processing IBM MQ messages"
description: "IBM MQ queues and topics are a valuable source of events for processing."
permalink: /tutorials/event-processing-examples/example-11
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 11
---

{% include video.html videoSource="videos/tutorials/examples/11-mqmessages.mp4" %}{: class="tutorial-video" }

## Scenario

IBM MQ queues and topics are a valuable source of events for processing. In this tutorial, you will see how MQ messages can be surfaced on Kafka topics, from where they can be used as a source of events for {{site.data.reuse.ep_name}}.

## Before you begin

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in IBM Event Automation. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of IBM Event Automation that you can use to follow this tutorial for yourself.

You will also need to [run the optional instructions for deploying an MQ queue manager](../guided/tutorial-0#ibm-mq). In addition to setting up the MQ queue manager, it will also start the Kafka Connect connector to flow messages from MQ into Kafka.

**Tip**: The MQ Connector is just [one of many connectors available]({{ 'connectors' | relative_url}}) for bringing data into Kafka. Connectors are an effective way to enable processing events from a wide variety of systems and technologies.

### Operator versions

This tutorial was written by using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots can differ from the current interface if you are using a newer version.

- Event Streams 3.2.1
- Event Endpoint Management 11.0.1
- Event Processing 1.0.0
- MQ 2.4.0

## Instructions

### Step 1 : Discover the MQ queue

Messages in this scenario will start life on an MQ queue called `COMMANDS`. Start by accessing the queue in the MQ Console.

1. Go to the **MQ web console**.

   You can get the URL for the web console from the `queuemanager-ibm-mq-web` route, and the password from the `platform-auth-idp-credentials` secret.

   If you have `oc` CLI access to your {{site.data.reuse.openshift}} cluster, you can use the following commands:

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
       "id": "cbeecfcb-27da-4e59-bbcd-8a974fe22917",
       "customer": {
           "id": "79df63d7-7522-4972-8546-1f1c33531e44",
           "name": "Lelia Langworth"
       },
       "creditcard": {
           "number": "5532169298805994",
           "expiry": "04/25"
       },
       "product": {
           "description": "L Denim Ripped Jeans",
           "price": 45.48
       },
       "order": {
           "quantity": "2"
       },
       "ordertime": "2023-06-28 22:38:35.089"
   }
   ```

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-3.png "screenshot of the MQ Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-3.png "screenshot of the MQ Console")

3. Use the {{site.data.reuse.es_name}} topic page to verify that the message appears as an event on the Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-4.png "screenshot of the Event Streams topic"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-4.png "screenshot of the Event Streams topic")

4. Confirm that the message remains available on the `COMMANDS` queue.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-5.png "screenshot of the MQ Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-5.png "screenshot of the MQ Console")

   The use of a [streaming queue](https://www.ibm.com/docs/en/ibm-mq/9.2?topic=scenarios-streaming-queues) means that a copy of messages can be made available for transferring to Kafka without disrupting any existing MQ application that is getting the messages.

### Step 3 : Flattening the MQ messages

To process the messages in **{{site.data.reuse.ep_name}}**, you first need to flatten the nested JSON payloads.

1. Open the specification for the Kafka MQ Source Connector in a text editor.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-20.png "editing the MQ connector"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-20.png "editing the MQ connector")

   It is the [`install/supporting-demo-resources/mq/templates/06-connector.yaml`](https://github.com/IBM/event-automation-demo/blob/main/install/supporting-demo-resources/mq/templates/06-connector.yaml) file, included in the folder for the files you used to [set up the MQ queue manager](../guided/tutorial-0#ibm-mq) for this tutorial.

2. Add a transform definition to flatten the message value.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-21.png "editing the MQ connector"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-21.png "editing the MQ connector")

   ```yaml
   transforms.flatten.type: org.apache.kafka.connect.transforms.Flatten$Value
   transforms.flatten.delimiter: "_"
   ```

   Add this definition to the `.spec.config` section of the connector definition.

   In the screenshot it is added to the end of the config, but the order is not significant, as long as it is within `.spec.config`.

3. Add your new transform to the list of transformations that are to be applied to messages.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-22.png "editing the MQ connector"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-22.png "editing the MQ connector")

   ```yaml
   transforms: flatten
   ```

   Add this line to the `.spec.config` section of the connector definition.

4. Apply your changes to the connector definition.

   ```sh
   oc apply -n event-automation \
       -f install/supporting-demo-resources/mq/templates/06-connector.yaml
   ```

   You need to be logged in to run this command.

   {{site.data.reuse.openshift_cli_login}}

5. Test the transform by putting a new test message to the `COMMANDS` queue in the MQ queue manager.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-23.png "editing the MQ connector"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-23.png "editing the MQ connector")

   ```json
   {
       "id": "6446ef47-79a1-4b8a-a441-a58de8a90188",
       "customer": {
           "id": "a20533e6-88ee-478e-b42f-7a1a028b0b12",
           "name": "Roseanna Cremin"
       },
       "creditcard": {
           "number": "5532144297701443",
           "expiry": "09/24"
       },
       "product": {
           "description": "XS Acid-washed Low-rise Jeans",
           "price": 33.88
       },
       "order": {
           "quantity": "1"
       },
       "ordertime": "2023-07-01 10:51:48.125"
   }
   ```

6. Verify that the transform is working by checking the {{site.data.reuse.es_name}} topic page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-24.png "editing the MQ connector"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-24.png "editing the MQ connector")

   You should see the message that is produced to the Kafka topic:

   ```json
   {
       "product_price": 33.88,
       "product_description": "XS Acid-washed Low-rise Jeans",
       "id": "6446ef47-79a1-4b8a-a441-a58de8a90188",
       "ordertime": "2023-07-01 10:51:48.125",
       "creditcard_number": "5532144297701443",
       "creditcard_expiry": "09/24",
       "customer_name": "Roseanna Cremin",
       "customer_id": "a20533e6-88ee-478e-b42f-7a1a028b0b12",
       "order_quantity": "1"
   }
   ```

   Changes to connector specifications can sometimes take a moment to apply. If the message produced to the Kafka topic is not flattened, try waiting for 30 seconds, and then put the MQ message again.

This topic is now ready for use by {{site.data.reuse.ep_name}}. Before trying that, we will add some additional transformations to see what is possible.

### Step 4 : Transforming the MQ messages

The flatten transformation that you have applied is one of a wide range of transformations available.

In this step, you will apply a few more of these to see what transformations are possible:

- Redact the credit card number from the events
- Remove the customer name from the events
- Insert a static property to identify where the event came from
- Cast the quantity property from a string to an integer

Other available transformations are described in the [Kafka Connect documentation](https://kafka.apache.org/documentation/#connect_included_transformation).

1. Add the following transformation definitions to the Connector specification.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-25.png "editing the MQ connector"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-25.png "editing the MQ connector")

   ```yaml
   transforms.redact.type: org.apache.kafka.connect.transforms.MaskField$Value
   transforms.redact.fields: creditcard_number
   transforms.redact.replacement: XXXXXXXXXXXXXXXX

   transforms.drop.type: org.apache.kafka.connect.transforms.ReplaceField$Value
   transforms.drop.blacklist: customer_name

   transforms.origin.type: org.apache.kafka.connect.transforms.InsertField$Value
   transforms.origin.static.field: origin
   transforms.origin.static.value: mq-connector

   transforms.casts.type: org.apache.kafka.connect.transforms.Cast$Value
   transforms.casts.spec: order_quantity:int16
   ```

1. Add your new transforms to the list of transformations that are to be applied to messages.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-26.png "editing the MQ connector"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-26.png "editing the MQ connector")

   ```yaml
   transforms: flatten,redact,drop,origin,casts
   ```

   **Tip**: The order of these in the comma-separated list is the order that the transformations are applied in.

   In this case, it is important that the `flatten` transformation is applied first. This is because properties referred to in the later transformations (for example, `creditcard_number` and `customer_name`) do not exist until after the flatten transformation is complete.

4. Apply your changes to the connector definition.

   ```sh
   oc apply -n event-automation \
       -f install/supporting-demo-resources/mq/templates/06-connector.yaml
   ```

5. Test the transform by putting a new test message to the `COMMANDS` queue in the MQ queue manager.

   ```json
   {
       "id": "d83bb1f5-933a-4251-b29b-0a1ec7d4e56e",
       "customer": {
           "id": "bd02c5f3-3246-4701-9c0b-159c7a7334b0",
           "name": "Fernanda Hermiston"
       },
       "creditcard": {
           "number": "5226589295805765",
           "expiry": "01/24"
       },
       "product": {
           "description": "L White Jogger Jeans",
           "price": 42.88
       },
       "order": {
           "quantity": "2"
       },
       "ordertime": "2023-07-01 11:10:48.124"
   }
   ```

6. Verify that the transform is working by checking the {{site.data.reuse.es_name}} topic page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-27.png "editing the MQ connector"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-27.png "editing the MQ connector")

   You should see the message that is produced to the Kafka topic:

   ```json
   {
       "origin": "mq-connector",
       "order_quantity": 2,
       "product_price": 42.88,
       "id": "d83bb1f5-933a-4251-b29b-0a1ec7d4e56e",
       "creditcard_expiry": "01/24",
       "product_description": "L White Jogger Jeans",
       "ordertime": "2023-07-01 11:10:48.124",
       "customer_id": "bd02c5f3-3246-4701-9c0b-159c7a7334b0",
       "creditcard_number": "XXXXXXXXXXXXXXXX"
   }
   ```

   Notice that:

   - The message contains an `origin` property, which was inserted by the connector
   - The `creditcard_number` property has been masked out with `X` characters
   - The `customer_name` property has been removed
   - The string `order_quantity` property has been cast to an integer

This is now ready for use by {{site.data.reuse.ep_name}}.

### Step 5 : MQ messages as a source of events

The next step is to create an event source in {{site.data.reuse.ep_name}} based on the source of events from the MQ queue.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the EP home page")

   If you need a reminder of how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to process events originating from MQ.

1. Create an **Event source** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-6.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-6.png "adding an event source node")

   Create an event source node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

1. Hover over the node, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**, and add a new event source.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-7.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-7.png "adding an event source node")

1. Put the Kafka listener address from {{site.data.reuse.es_name}} into the server address for the event source node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-8.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-8.png "adding an event source node")

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-9.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-9.png "adding an event source node")

   You need to accept the certificates for the Kafka cluster to proceed.

1. Use the username and password for the `kafka-demo-apps` user for accessing the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-10.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-10.png "adding an event source node")

   If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](../guided/tutorial-access#accessing-kafka-topics) section of the Tutorial Setup instructions.

1. Select the `MQ.COMMANDS` topic to use as a destination.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-11.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-11.png "adding an event source node")

1. Copy the most recent message payload from the {{site.data.reuse.es_name}} topic view.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-12.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-12.png "adding an event source node")

   The first message, produced before you added the transform definition, will not be compatible for use with {{site.data.reuse.ep_name}}.

1. Paste the message payload into the {{site.data.reuse.ep_name}} event source as a sample message.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-13.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-13.png "adding an event source node")

1. Identify the `ordertime` property in the message contents as describing a timestamp.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-30.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-30.png "adding an event source node")

   In the **Event structure** table, choose `TIMESTAMP` as the Type mapping for the `ordertime` property.

1. Identify the `ordertime` property as the timestamp to use for events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-31.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-31.png "adding an event source node")

   In the **Event time** options, choose `ordertime` as the source of event time.

   This means that any delay introduced by the connector transferring the message from MQ to the Kafka topic will not impact any time-based processing you perform.

   The timestamp in the message payload will be treated as the canonical timestamp for the message, rather than when it was produced to the Kafka topic.

1. Click **Configure** to finalize the event source.

### Step 6 : Aggregate the events

1. Create an **Aggregate** node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-40.png "adding an aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-40.png "adding an aggregate node")

   Create an aggregate node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

   Click and drag from the small gray dot on the event source to the matching dot on the aggregate node.

   **Did you know?** Instead of dragging the node, you can add a node onto the canvas and automatically connect it to the last added node by double-clicking a node within the palette. For example, after configuring an event source node, double-click any processor node to add and connect the processor node to your previously configured event source node. 

1. Hover over the aggregate node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

   Name the aggregate node `Order quantities`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-41.png "adding an aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-41.png "adding an aggregate node")


1. Aggregate the order events in **1-minute** windows.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-42.png "adding an aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-42.png "adding an aggregate node")

   Making the window very small is useful for the tutorial as it means you will see results quickly.

1. Sum the `order_quantity` properties.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-43.png "adding an aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-43.png "adding an aggregate node")

   Select **SUM** as the aggregate function, and `order_quantity` as the property to aggregate.

   This configures the aggregate node to add up the quantity in each of the order events, emitting a total for all of the events in each 1-minute window.

1. Rename the output to display the total number of ordered items in the time window, and the start and end time for the window.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-44.png "adding an aggregate node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-44.png "adding an aggregate node")

1. Click **Configure** to finalize the aggregate.

### Step 7 : Testing the flow

The final step is to run your event processing flow and view the results.

1. Go to the **Run** menu, and select **Events from now** to run your flow on the new messages you are about to put to the MQ queue.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-45.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-45.png "running the flow")

1. Click the aggregate node to see a live view of results from your flow. It will be updated as new events are emitted onto the commands topic.

1. Put these JSON messages to the MQ queue by using the MQ console.

   ```json
   {
       "id": "37169553-1b97-49c2-b16d-924257f4e888",
       "customer": {
           "id": "3ba7c289-6d02-40fd-9925-837d9573d5f6",
           "name": "Darin Becker"
       },
       "creditcard": {
           "number": "5434297065054394",
           "expiry": "12/29"
       },
       "product": {
           "description": "XXS Blue Crochet Jeans",
           "price": 30.59
       },
       "order": {
           "quantity": "2"
       },
       "ordertime": "2023-07-01 11:26:18.124"
   }
   ```

   ```json
   {
       "id": "87193fcd-0ca5-437f-b377-d2beb7e2fca4",
       "customer": {
           "id": "0c6767e4-3eee-4016-91a8-1c0b1699076e",
           "name": "Sharie Nolan"
       },
       "creditcard": {
          "number": "5300726992175816",
           "expiry": "07/23"
       },
       "product": {
           "description": "XL Blue Skinny Jeans",
           "price": 40.99
       },
       "order": {
           "quantity": "3"
       },
       "ordertime": "2023-07-01 11:31:18.124"
   }
   ```

   ```json
   {
       "id": "6e6885f0-8655-4ba3-bb1f-6834a7d5059c",
       "customer": {
           "id": "003f8d4e-5488-4923-beb7-0846463e2b54",
           "name": "Brandi Lubowitz"
       },
       "creditcard": {
           "number": "5505432597412091",
           "expiry": "07/26"
       },
       "product": {
           "description": "L Retro Flare Jeans",
           "price": 28.99
       },
       "order": {
           "quantity": "1"
       },
       "ordertime": "2023-07-01 11:33:48.125"
   }
   ```

1. Verify that the results are displayed in the {{site.data.reuse.ep_name}} flow.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example11-46.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example11-46.png "running the flow")

1. When you have finished reviewing the results, you can stop this flow.


## Recap

Connectors enable you to bring streams of events from a wide variety of external systems into Kafka topics, from where you can analyze them by using {{site.data.reuse.ep_name}}.

Transformations are a helpful way to prepare the events to be in a format suitable for use with {{site.data.reuse.ep_name}}.
