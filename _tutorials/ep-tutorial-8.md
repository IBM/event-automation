---
title: "Triggering automations from processing results"
description: "You can use App Connect to trigger automations and notifications from event processing results."
permalink: /tutorials/event-processing-examples/example-08
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 8
---

## Scenario

In this scenario, we will generate notifications in response to events recognized in an {{site.data.reuse.ep_name}} flow.

This is an extension to the [Share events for discovery by others](../guided/tutorial-6) tutorial. In that tutorial, we identified specific orders, produced them to a new destination topic, and published that topic in the {{site.data.reuse.eem_name}} catalog.

To show how this can be used, this tutorial shows you how to use that topic in App Connect.

## Before you begin

You need to deploy an App Connect Designer. [Instructions for how to do this](../guided/tutorial-0#ibm-app-connect) are included in the Setup tutorial.

The example App Connect flow in this tutorial sends notifications to [Slack](https://slack.com/). You will need an access token for the Slack API to complete the tutorial as described below, alternatively you can choose a different destination for your notifications.

### Operator versions

This tutorial was written using the following versions of {{ site.data.reuse.ea_short }} operators. Screenshots may differ from the current interface if you are using a newer version.

- Event Streams 3.2.1
- Event Endpoint Management 11.0.1
- Event Processing 1.0.0
- App Connect 8.2.1

## Instructions

### Step 1 : Find the destination topic

This tutorial begins with the topic added to the catalog in [Share events for discovery by others](../guided/tutorial-6) tutorial, which identifies orders made in the EMEA region.

If you haven't completed that tutorial yet, you should do it now.

1. Check that the flow you created in the [Distributing results of analysis and processing](../guided/tutorial-5#scenario) tutorial is still running.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-13.png "screenshot of the running flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-5-13.png "screenshot of the running flow")

   If the flow is not running, start it now.

1. Find the topic in the {{site.data.reuse.eem_name}} catalog that you added in the [Share events for discovery by others](../guided/tutorial-6) tutorial.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-1.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-1.png "screenshot of the EEM catalog")

   If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

### Step 2 : Make the destination topic available to App Connect

The first thing to do is to make this destination topic available for use in App Connect.

1. Go to the App Connect Designer

   You can get the URL for the designer from the `designer-ui` route.

   If you have `oc` CLI access to your OpenShift cluster, you can use this:

   ```sh
   oc get route \
       designer-ui \
       -n event-automation \
       -o jsonpath='https://{.spec.host}'
   ```

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-2.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-2.png "screenshot of App Connect")

1. Create an event-driven flow and call it `EMEA order notifications`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-3.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-3.png "screenshot of App Connect")

1. Start the flow with a Kafka **New message** event.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-4.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-4.png "screenshot of App Connect")

   Choose Kafka from the list of Applications, and click "New message".

1. Click **Connect**.

1. Enter connection information into App Connect (from the {{site.data.reuse.eem_name}} catalog).

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-5.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-5.png "screenshot of App Connect")

   **Authorization type**: `SASL_SSL`

   **Username**: Username created using the **Generate access credentials** button in the {{site.data.reuse.eem_name}} catalog

   **Password**: Password created using the **Generate access credentials** button in the {{site.data.reuse.eem_name}} catalog

   **Kafka brokers list**: Server address copied from the {{site.data.reuse.eem_name}} catalog

   **Security mechanism**: `PLAIN`

1. Download the certificates from the {{site.data.reuse.eem_name}} catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-6.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-6.png "screenshot of the EEM catalog")

1. Prepare the downloaded certificate file for use with App Connect.

   Open the downloaded pem file in a text editor.

   Delete the first certificate from the file. Keep only the final certificate (the last `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` and everything between).

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-7.png "screenshot of the PEM file"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-7.png "screenshot of the PEM file")

1. Copy the contents of the edited PEM certificate file to the clipboard.

1. Paste the edited certificate contents into the **CA certificate** field.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-8.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-8.png "screenshot of App Connect")

1. Click **Connect**.

1. Choose the `ORDERS.EMEA` topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-9.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-9.png "screenshot of App Connect")



### Step 3 : Parse the Event Processing output

The next step is to parse the events on the topic to allow it to be used in App Connect flows.

1. Add a **JSON parser** node to the flow from the Toolbox.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-10.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-10.png "screenshot of App Connect")

1. Choose the message **Payload** as the JSON input.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-11.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-11.png "screenshot of App Connect")

1. Copy the sample message payload from the {{site.data.reuse.eem_name}} catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-12.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-12.png "screenshot of the EEM catalog")

1. Paste the sample message payload into the **Example JSON** box in App Connect.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-13.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-13.png "screenshot of App Connect")

1. Click the **Generate Schema** button.


### Step 4 : Send notifications in response to the events

The next step is to complete the App Connect flow by adding a node to send notifications.

1. Add a **Slack** node to the flow from the "Applications & APIs" list and choose **Send message**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-14.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-14.png "screenshot of App Connect")

1. Click **Connect** and provide your Slack access token.

1. Set the destination for messages.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-15.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-15.png "screenshot of App Connect")

1. Add the message text. You can include fields from the parsed Kafka message as demonstrated in the following screen capture.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-16.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-16.png "screenshot of App Connect")


### Step 5 : Run the flow

The flow is now ready to run. The final step is to start it.

1. Click **Start flow**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-17.png "screenshot of the EEM catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-17.png "screenshot of App Connect")

1. Open Slack and verify that new orders made in the EMEA region result in a notification in the selected Slack channel.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example8-18.png "screenshot of Slack"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example8-18.png "screenshot of Slack")


## Recap

The App Connect Designer is a good example of an application to use when you want to trigger automations and notifications from event processing results.

Making the results of an {{site.data.reuse.ep_name}} flow available on a Kafka topic, and sharing it to allow it to be used through {{site.data.reuse.eem_name}}, allows for the situations identified in the events to trigger a wide range of automations and workflows.
