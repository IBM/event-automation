---
title: "Detection of key and headers in a Kafka topic message"
description: "Detect key and headers for your Kafka topic messages and define them as properties in event source."
permalink: /tutorials/key-headers/
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 15
---


 
## Scenario

You must ensure timely delivery of the urgent orders originating from a specific region. To achieve that, you can use key and headers that are added to order events. Your events contain a key named `countrycode` and a header named `priority` to get started.

## Key and headers

By filtering the events with the `countrycode` key and the `priority` header, you can identify urgent orders originating from a particular country. This real-time identification enables earlier adjustments to sales forecasts, facilitating the integration of these insights into your manufacturing cycle. By doing so, you can more effectively respond to demand and make necessary adjustments to your production plans.


## Before you begin 

The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in {{ site.data.reuse.ea_long }}. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of {{ site.data.reuse.ea_long }} that you can use to follow this tutorial for yourself.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots can differ from the current interface if you are using a newer version.

- {{site.data.reuse.eem_name}} 11.3.2
- {{site.data.reuse.ep_name}} 1.2.2


## Instructions

### Step 1: Discover the topics to use

See the earlier filter tutorial to [Discover the topic to use](../guided/tutorial-1#step-1--discover-the-topic-to-use).


### Step 2: Create a flow

See the earlier filter tutorial to [Create a flow](../guided/tutorial-1#step-2--create-a-flow).


### Step 3: Provide a source of events

   The next step is to bring the stream of events you discovered in the catalog into {{site.data.reuse.ep_name}}.
   
   **Tip:** You can click **Add new event source**, and follow the steps under [Provide a source of events](../guided/tutorial-1#event-source) to define a new event source from scratch. 
 
1. Repeat Steps 1-9 under [Provide a source of events](../guided/tutorial-1#event-source).

1. In the **Key and headers** pane, the headers and key will be automatically populated with the key and the number of headers from the last message. Currently, there are four headers (`priority`, `storeid`, `apicurio.value.globalId`, and `apicurio.value.encoding`) and one key (`key.value`).

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial15-auto-populate.png "key and headers"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial15-auto-populate.png "key and headers")

   **Note:** If the headers are not automatically populated, click the **Map** drop-down, and select **Header** to add manually. Click **Edit** ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} to change the property name and header name from the default `header.name` and `headerName` with the required values.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial15-map.png "map key or headers"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial15-map.png "map key or headers")


1. In the **Key and headers** pane, click **Edit** ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} in the **Property name** column to change the default name of the key from `key.value` to `countrycode`.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/country-code.png "changing key value"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/country-code.png "changing key value")

   Click **Next**. 
   

1. In the **Event details** pane, select the key `countrycode` and the header `priority` checkboxes from the **Property name** column.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial15-property-names.png "select properties"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial15-property-names.png "select properties")

   Click **Configure**.

### Step 4: Define the filter

The next step is to start processing this stream of events, by creating the filter that will select the custom subset with the events that you are interested in.

1. Repeat Steps 1-4 under [Define the filter](../guided/tutorial-1#step-4--define-the-filter).

1. Use the **Filter expression** field to update your filter expression, for example, \`countrycode\` = 'FR' AND \`priority\` = 'urgent'.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial15-filter-expression.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial15-filter-expression.png "defining the filter")

   **Note:** You must manually add the filter expression by using backticks for the property name and single quotes for the value, for example, enter \`countrycode\` = 'FR' in the **Filter expression** field for the complex expressions.

   Click **Configure** to finalize the filter.



### Step 5: Test the flow

The final step is to run your event processing flow and view the results.

1. Use the **Run flow** menu, and select **Include historical** to run your filter on the history of order events available on this Kafka topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/run-flow.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/run-flow.png "running the flow")

   Did you know? **Include historical** is useful while you are developing your flows, as it means that you don’t need to wait for new events to be produced to the Kafka topic. You can use all the events already on the topic to check that your flow is working the way that you want.

1. A live view of results from your filter is automatically updated in real-time as new events are published onto the `Orders` topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/view-results.png "viewing the results"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/view-results.png "viewing the results")
   
1. When you have finished reviewing the results with headers and key data, click **Stop flow** to stop this flow.

## Recap

You have mapped key and header to the event source so that you can identify urgent orders originating from a particular region.