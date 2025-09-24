---
title: "Generate summary of all events within a window by using IBM watsonx.ai"
description: "Generate summary of all events within a time window by using the watsonx.ai node."
permalink: /tutorials/summarize-events/
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 17
---


 
## Scenario

As a retailer, you want to analyze customer reviews for your product to identify trends, sentiment, and areas for improvement. You have a large dataset of reviews with timestamps, and want to generate a summary of all events within a specific time window. To achieve this, you can use the watsonx.ai node.


## watsonx.ai node

With the watsonx.ai node, you can create AI-generated text responses from a deployed watsonx.ai prompt template.


## Before you begin

- The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in {{ site.data.reuse.ea_long }}. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of {{ site.data.reuse.ea_long }} that you can use to follow this tutorial for yourself.

- Ensure that you have a watsonx.ai [account](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/signup-wx.html?context=wx&locale=en&audience=wdp){:target="_blank"} and complete the following steps.

  **Note:** The free plan quota for watsonx.ai is limited. [Upgrade](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/wml-plans.html?context=cpdaas#choosing-a-watsonxai-runtime-plan){:target="_blank"} to a different plan because the following tutorial consumes a large volume of events with watsonx.ai.

  1. [Create](https://www.ibm.com/docs/en/watsonx/saas?topic=prompts-prompt-lab){:target="_blank"} a prompt in the Prompt Lab in watsonx.ai. In the **Freeform** tab, enter your prompt in the text area. The following prompt is used in this tutorial:

     ```plaintext
     The following are a list of reviews for the {product} product. Read the reviews and then write a short paragraph summary.

     Reviews: 

     {reviews}


     Summary:
     ```

     **Tip:** A prompt is an input that guides AI models to generate responses. For tips on crafting effective prompts, see [prompt tips](https://www.ibm.com/docs/en/watsonx/saas?topic=prompts-prompt-tips){:target="_blank"}.

  1. [Configure](https://www.ibm.com/docs/en/watsonx/saas?topic=lab-building-reusable-prompts#creating-prompt-variables){:target="_blank"} prompt variables, select the model and modify model parameters as required within the Prompt Lab. The model used in this tutorial is `granite-3-8b-instruct` from IBM.

     The variables used are: `product` and `reviews` and the respective values are `jeans` and `Love at First Wear! I was blown away by the comfort and style of these jeans. The fit is perfect, and the material is so soft. I have worn them nonstop since I got them!`.

     **Note:** At least one prompt variable must be configured.

  1. [Save](https://www.ibm.com/docs/en/watsonx/saas?topic=lab-saving-prompts){:target="_blank"} your prompt as a prompt template: `Product reviews summary`.
  1. [Deploy](https://www.ibm.com/docs/en/watsonx/saas?topic=assets-deploying-prompt-template){:target="_blank"} the prompt template to a [deployment space](https://www.ibm.com/docs/en/watsonx/saas?topic=assets-managing-deployment-spaces){:target="_blank"}.
  1. After your prompt template is successfully deployed, open the deployed prompt and copy the URL in the **Text endpoint URL** field from the **Public endpoint** section. The text endpoint URL is required later when configuring the watsonx.ai node.

    The watsonx.ai node supports public text endpoint URLs with a serving name or a deployment ID.

     **Note:** Deployment spaces might incur charges depending on your watsonx.ai runtime plan. For more information, see the [IBM documentation](https://www.ibm.com/docs/en/watsonx/saas?topic=runtime-watsonxai-plans){:target="_blank"}.

- Create an API key by completing the following steps:

  1. In your IBM Cloud account, go to the [API keys](https://cloud.ibm.com/iam/apikeys){:target="_blank"} page and click **Create**.

  1. Enter a name for the API key and an optional description, then click **Create** again.

  1. Ensure you have copied the API key, as the key is required later when configuring the watsonx.ai node.

  Alternatively, you can create API key for a service ID by following the instructions in the [IBM Cloud documentation](https://cloud.ibm.com/docs/account?topic=account-serviceidapikeys&interface=ui#create_service_key){:target="_blank"}.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots can differ from the current interface if you are using a newer version.

- {{site.data.reuse.eem_name}} 12.0.1
- {{site.data.reuse.ep_name}} 1.4.4


## Instructions

### Step 1: Discover the topic to use

For this scenario, you need a source for the `product reviews` events.


1. Go to the **{{site.data.reuse.eem_name}}** catalog.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the Event Endpoint Management catalog")

    If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

2. Find the `PRODUCT.REVIEWS` topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx-eem-topic.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx-eem-topic.png "screenshot of the Event Endpoint Management catalog")

3. Click into the topics to review the information about the events that are available here.
   Look at the schema to see the properties in the events, and get an idea of what to expect from events on these topics.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx-eem-topic schema.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx-eem-topic schema.png "screenshot of the Event Endpoint Management catalog")

**Tip**: Keep this page open. It is helpful to have the catalog available while you work on your event processing flows, as it allows you to refer to the documentation about the events as you work. Complete the following steps in a separate browser window or tab.



### Step 2: Create a flow

The next step is to start processing this stream of events, to create a custom subset that contains the events that you are interested in.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the Event Processing home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the Event Processing home page")

    If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to generate summary for product reviews: `Generate summary of all events within a window`

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_gen_createflow.png "creating a flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_gen_createflow.png "creating a flow")

### Step 3 : Provide a source of events

The next step is to bring the stream of events you discovered in the catalog into {{site.data.reuse.ep_name}}.

1. Update the **Event source** node.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial17-1.png "adding an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial17-1.png "adding an event source node")

    When you create a flow, an event source node is automatically added to your canvas. A purple checkbox ![unconfigured_node icon]({{ 'images' | relative_url }}/unconfigured_node.svg "Diagram showing the unconfigured node icon."){: height="30px" width="15px"} is displayed on the event source node indicating that the node is yet to be configured.

    Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Add a new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-1-5.png "add an event source")

    Click **Next**.

1. Get the server address for the event source from the {{site.data.reuse.eem_name}} catalog page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx-eem-topic schema.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx-eem-topic schema.png "screenshot of the Event Endpoint Management catalog")

    Click the **Copy** icon next to the **Servers** address to copy the address to the clipboard.

1. Configure the new event source.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_clustercon.png "connection details for the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_clustercon.png "connection details for the event source")

    In the **Bootstrap server** field, paste the server address that you copied from {{site.data.reuse.eem_name}} in the previous step.

    Click **Next**.

1. Generate access credentials for accessing this stream of events from the {{site.data.reuse.eem_name}} page.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx-subscribe.png "specifying credentials for event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx-subscribe.png "specifying credentials for event source")

    Click **Subscribe**, and provide your contact details.

1. Copy the username and password from {{site.data.reuse.eem_name}} and paste into {{site.data.reuse.ep_name}} to allow access to the topic.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/example1-9-new1.png "specifying credentials for event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/example1-9-new1.png "specifying credentials for event source")

    The username starts with `eem-`.

    Click **Next**.

1. Select the `PRODUCT.REVIEWS` topic to process events from, and click **Next**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_select_topic.png "selecting a topic to use"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_select_topic.png "selecting a topic to use")

    Click **Next**.

1. Get the schema for **Product reviews** events from {{site.data.reuse.eem_name}}.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx-eem-avro.png "copy schema from the catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx-eem-avro.png "copy schema from the catalog")

    Click the **Copy** icon in the schema section to copy the schema to the clipboard.

    You need to give {{ site.data.reuse.ep_name }} a description of the events available from the topic. The information in the schema enables {{ site.data.reuse.ep_name }} to give guidance for creating event processing nodes.

1. The Avro message format is auto-selected in the **Message format** drop-down. Paste the schema into the **Avro schema** field, and click **Next**.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_messageformat.png "paste schema into the event source"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_messageformat.png "paste schema into the event source")

1. In the **Key and headers** pane, click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_keyheader.png "key and headers pane"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_keyheader.png "key and headers pane")

   **Note:** The key and headers are displayed automatically if they are available in the selected topic message. 

1. In the **Event details** pane, enter the node a name that describes this stream of events: `Product reviews`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_eventdetails.png "enter a node name"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_eventdetails.png "enter a node name") 

1. Change the type of the `reviewtime` property to `Timestamp (with time zone)`. 

   **Note:** The `reviewtime` string is converted to a timestamp to use `reviewtime` as event time. Only properties with a timestamp type can be used as event time to perform time-based processing.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_eventdetails2.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_eventdetails2.png "creating an event source node")


1. Configure the event source to use the `reviewtime` property as the source of the event time, and to tolerate lateness of up to **1 minute**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_eventdetails2.png "creating an event source node"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_eventdetails2.png "creating an event source node")

1. Click **Configure** to finalize the event source.

### Step 4 : Filter reviews for the last 48 hours

1. Add a **Filter** node to the flow.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial17-2.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial17-2.png "defining the filter")

   Create a filter node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

   Click and drag from the small gray dot on the event source to the matching dot on the filter node.

1. Give the filter node a name that describes the results: `Filtered reviews`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_filter1.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_filter1.png "defining the filter")

   Hover over the filter node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Use the expression editor to define a filter that filters records where `reviewtime` is within the last 48 hours.

   ```sql
   TIMESTAMPDIFF(DAY, reviewtime, CURRENT_TIMESTAMP) <= 2
   ```

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_filter1_2.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_filter1_2.png "defining the filter")

1. Click **Add to expression**.

1. Click **Next** to open the **Output properties** pane. Choose the properties to output.

1. Click **Configure** to finalize the filter.

### Step 5: Calculate the average rating and review count

The next step is to count the number of review comments and the average review rating received within a 1-day window.

1. Add an **Aggregate** node and link it to your filter node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial17-3.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial17-3.png "defining the aggregation")

   Create an aggregate node by dragging one onto the canvas. You can find this in the **Windowed** section of the left panel.

   Click and drag from the small gray dot on the output of the filter node to the matching dot on the input of the aggregate node.

1. Name the aggregate node to show that it will count the number of review comments in one day: `Review comments in a day`.

   Hover over the aggregate node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Specify a 1-day window.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_aggregate1_2.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_aggregate1_2.png "defining the aggregation")

1. Add an aggregate function to count the number of review comments in one day, grouped by `review.comment`.

   Select `COUNT` as the aggregate function.

   The property we are adding up is `review.comment` - the number of review comments received. This will add up the number of review comments received within the time window.

1. Add another aggregate function to calculate the average of the review ratings in one day, grouped by `review.rating`.  

   Select `AVG` as the aggregate function.

   The property we are calculating average of is `review.rating` - the rating received in a review comment. This will calculate the average of review ratings received within the time window.

1. Add another aggregate function to list the review comments, grouped by `review.comment`.

   Select `LISTAGG` as the aggregate function.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_aggregate1_3.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_aggregate1_3.png "defining the aggregation")

   The property we are listing is `review.comment` - the number of review comments received. This will list the review comments received within the time window.

1. Select `product` as an additional property for group by. Then click **Next**.
1. Rename the output aggregate properties:

   - COUNT_review_comment → Amount of reviews
   - AVG_review_rating → Average rating
   - LISTAGG_review_comment → Reviews
   - product → Product
   - aggregateStartTime → Start Time
   - aggregateEndTime → End Time

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_aggregate1_4.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_aggregate1_4.png "defining the aggregation")

   **Tip**: It can be helpful to adjust the name of properties to something that will make sense to you, such as describing the `AVG_review_rating` property as `Average rating`.

1. Click **Configure** to finalize the aggregate.

### Step 6: Create a top-n node

1. Add a **Top-n** node and link it to the aggregate node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx-top-n-node.png "defining the top-n"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx-top-n-node.png "defining the top-n")

   Create a top-n node by dragging one onto the canvas. You can find this in the **Windowed** section of the left panel.

   Click and drag from the small gray dot on the output of the filter node to the matching dot on the input of the top-n node.

   Hover over the top-n node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Name the top-n node to show that it will only display two results on each time window: `review results`.

1. In the **Time window** pane, ensure that the `reviewtime` is selected to use for start of the time window, and then click **Next**.
1. In the **Condition** pane, set the value of **Number of results to keep on each window** to `2`.
1. In the **Ordered by** field, select **Amount of reviews** as property and **Descending** as the sort order. Click **Next**.
1. Remove the `aggregateResultTime` property.
1. Click **Configure** to finalize the top-n configuration.


### Step 7: Create a watsonx.ai node

The next step is to generate text responses by using the watsonx.ai node.

1. Add a **watsonx.ai** node and link it to the aggregate node.

   Create a watsonx.ai node by dragging one onto the canvas. You can find this in the **Enrichment** section of the left panel, and link it to the aggregate node.

   Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Give the watsonx.ai node a name that describes the events it must summarize: `Summarize reviews`.

    [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonxai-node-details.png "defining the transformation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonxai-node-details.png "defining the transformation")

    Click **Next**.

1. Provide the API key and the public text endpoint URL for the `Product reviews summary` prompt that you [created earlier](#before-you-begin).

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-access.png "connecting to watsonx.ai"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-access.png "connecting to watsonx.ai")

   Click **Next**.

1. In the **Map prompt variables** pane, the prompt that you [created earlier](#before-you-begin) is displayed. In the **Variable mapping** section, toggle the values for `product` and `reviews` to take input properties and select `Product` and `Reviews` respectively.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-map-variables.png "connecting to watsonx.ai"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-map-variables.png "connecting to watsonx.ai")

   Click **Next**.

1. In the **Response properties** pane, properties returned from watsonx.ai are displayed. Add or remove the fields properties that you do not want to include further.

   **Note:** Properties providing watsonx.ai generated values are marked with an AI tag and ensure to not remove those properties. To rename properties, hover over a property, and click the ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** icon.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-response-properties.png "connecting to watsonx.ai"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-response-properties.png "connecting to watsonx.ai")


   Click **Next**.

1. You can choose the output properties that you want in the **Output properties** pane.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-output-properties.png "connecting to watsonx.ai"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-output-properties.png "connecting to watsonx.ai")

1. Click **Configure** to finalize the watsonx.ai node configuration.

### Step 8 : Test the flow

The final step is to run your event processing flow and view the results.

Use the **Run** menu, and select **Include historical** to view the generated summary for the review comments that received in the last 48 hours.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-output.png "running the flow"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx.ai-output.png "running the flow")

## Recap

You used a watsonx.ai node to generate summary for the review comments received in the last 48 hours.