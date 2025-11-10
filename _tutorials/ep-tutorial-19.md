---
title: "Nudge customers regarding abandoned shopping carts by using IBM watsonx.ai"
description: "Identify the highest rated product abandoned in a cart and output its most positive review along with email IDs for re-engagement using the watsonx.ai node."
permalink: /tutorials/notify-abandoned-orders/
toc: true
section: "Tutorials for Event Processing"
cardType: "large"
order: 19
---

## Scenario

As a retailer, you want to reengage customers who have abandoned products in their shopping carts. This tutorial aims to identify which product left in the cart has the highest average customer rating and then highlighting that product along with its most positive review and email IDs.

To achieve this, you can use the watsonx.ai node to identify the abandoned products.


## watsonx.ai node

With the watsonx.ai node, you can create AI-generated text responses from a deployed watsonx.ai prompt template.


## Before you begin

- The instructions in this tutorial use the [Tutorial environment](../guided/tutorial-0), which includes a selection of topics each with a live stream of events, created to allow you to explore features in {{ site.data.reuse.ea_long }}. Following the [setup instructions](../guided/tutorial-0#deploy-the-tutorial) to deploy the demo environment gives you a complete instance of {{ site.data.reuse.ea_long }} that you can use to follow this tutorial for yourself.

- Ensure that you have a watsonx.ai [account](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/signup-wx.html?context=wx&locale=en&audience=wdp){:target="_blank"} and complete the following steps.

  **Note:** The free plan quota for watsonx.ai is limited. Therefore, the flow used in the following tutorial is configured such as it consumes a small volume of events with watsonx.ai. [Upgrade](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/wml-plans.html?context=cpdaas#choosing-a-watsonxai-runtime-plan){:target="_blank"} if you want to modify the flow to consume more events with watsonx.ai.

    1. [Create](https://www.ibm.com/docs/en/watsonx/saas?topic=prompts-prompt-lab){:target="_blank"} a prompt in the Prompt Lab in watsonx.ai. In the **Freeform** tab, enter your prompt in the text area. The following prompt is used in this tutorial:

       ```plaintext
       The following are a list of reviews for the {product} product. Read the reviews and then identify which of them was the most positive. Your response should only include the answer. Do not provide any further explanation.
  
       Reviews:
       {reviews}
  
  
       Most positive review:
       ```

       **Tip:** A prompt is an input that guides AI models to generate responses. For tips on crafting effective prompts, see [prompt tips](https://www.ibm.com/docs/en/watsonx/saas?topic=prompts-prompt-tips){:target="_blank"}.

       [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-bob1.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-bob1.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}


    1. [Configure](https://www.ibm.com/docs/en/watsonx/saas?topic=lab-building-reusable-prompts#creating-prompt-variables){:target="_blank"} prompt variables, select the model and modify model parameters as required within the Prompt Lab. The model used in this tutorial is `granite-3-8b-instruct` from IBM.

       The variables used are: `product` and `reviews` and the respective values are `jeans` and `Love at First Wear! I was blown away by the comfort and style of these jeans. The fit is perfect, and the material is so soft. I have worn them nonstop since I got them!`.

       **Note:** At least one prompt variable must be configured.

    1. [Save](https://www.ibm.com/docs/en/watsonx/saas?topic=lab-saving-prompts){:target="_blank"} your prompt as a prompt template: `Positive review analysis`.
    1. [Deploy](https://www.ibm.com/docs/en/watsonx/saas?topic=assets-deploying-prompt-template){:target="_blank"} the prompt template to a [deployment space](https://www.ibm.com/docs/en/watsonx/saas?topic=assets-managing-deployment-spaces){:target="_blank"}.
    1. After your prompt template is successfully deployed, open the deployed prompt and copy the URL in the **Text endpoint URL** field from the **Public endpoint** section. The text endpoint URL is required later when configuring the watsonx.ai node.

       [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-bob2.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-bob2.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}


  The watsonx.ai node supports public text endpoint URLs with a serving name or a deployment ID.

  **Note:** Deployment spaces might incur charges depending on your watsonx.ai runtime plan. For more information, see the [IBM documentation](https://www.ibm.com/docs/en/watsonx/saas?topic=runtime-watsonxai-plans){:target="_blank"}. The flow used in this tutorial is configured such that it makes only few calls to watsonx.ai and can be used with a free plan.

- Create an API key by completing the following steps:

    1. In your IBM Cloud account, go to the [API keys](https://cloud.ibm.com/iam/apikeys){:target="_blank"} page and click **Create**.

    1. Enter a name for the API key and an optional description, then click **Create** again.

    1. Ensure you have copied the API key, as the key is required later when configuring the watsonx.ai node.

  Alternatively, you can create API key for a service ID by following the instructions in the [IBM Cloud documentation](https://cloud.ibm.com/docs/account?topic=account-serviceidapikeys&interface=ui#create_service_key){:target="_blank"}.

### Versions

This tutorial uses the following versions of {{ site.data.reuse.ea_short }} capabilities. Screenshots can differ from the current interface if you are using a newer version.

- {{site.data.reuse.es_name}} 12.0.1
- {{site.data.reuse.eem_name}} 11.6.3
- {{site.data.reuse.ep_name}} 1.4.5


## Instructions

### Step 1: Create a destination topic for notifying abandoned products

You can configure a processing flow to write the events to a separate topic, which you can then use as a source for systems that are unable to process idempotently.

You can create the topic by completing the following steps.

1. In the {{site.data.reuse.es_name}} UI, click **Home** in the primary navigation, and then click the **Create a topic** tile.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-1a.png "screenshot of the Event Streams topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-1a.png "screenshot of the Event Streams topics page")

   If you need a reminder about how to access the {{site.data.reuse.es_name}} web UI, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-streams).

1. Create a new topic called `NOTIFY.ABANDONED.PRODUCTS`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-1b.png "screenshot of the Event Streams topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-1b.png "screenshot of the Event Streams topics page")

1. Create the topic with **1 partition**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-1c.png "screenshot of the Event Streams topics page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-1c.png "screenshot of the Event Streams topics page")


### Step 2: Discover the topics to use

For this scenario, you need a source for the `Product reviews` events and the `Abandoned orders` events.

1. Go to the **{{site.data.reuse.eem_name}}** catalog.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog.png "screenshot of the Event Endpoint Management catalog")

   If you need a reminder about how to access the {{site.data.reuse.eem_name}} catalog, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-endpoint-management).

2. Find the `Product reviews` and the `Abandoned orders` topics.

3. Click into the topics to review the information about the events that are available here.

   Look at the schema to see the properties in the events, and get an idea of what to expect from events on these topics.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-2a.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-2a.png "screenshot of the Event Endpoint Management catalog")


   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-2b.png "screenshot of the Event Endpoint Management catalog"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-2b.png "screenshot of the Event Endpoint Management catalog")

**Tip**: Keep this page open. It is helpful to have the catalog available while you work on your event processing flows, as it allows you to refer to the documentation about the events as you work. Complete the following steps in a separate browser window or tab.


### Step 3: Create a flow

The next step is to start processing this stream of events, to create a custom subset that contains the events that you are interested in.

1. Go to the **{{site.data.reuse.ep_name}}** home page.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the Event Processing home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/ep-home.png "screenshot of the Event Processing home page")

   If you need a reminder about how to access the {{site.data.reuse.ep_name}} home page, you can review [Accessing the tutorial environment](../guided/tutorial-access#event-processing).

1. Create a flow, and give it a name and description to explain that you will use it to analyze a stream of product reviews: `Nudge customers about abandoned products`

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-3a.png "screenshot of the Event Processing home page"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-3a.png "screenshot of the Event Processing home page")


### Step 4: Provide sources of events

The next step is to create event sources in {{site.data.reuse.ep_name}} for the `Product reviews` and the `Abandoned orders` topics to use in the flow.

Use the server address information and **Generate access credentials** button on each topic page in the catalog to define an event source node for each topic.

**Tip**: If you need a reminder about how to create an event source node, you can follow the [Identify orders from a specific region](../guided/tutorial-1) tutorial.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-4a.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-4a.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}


### Step 5: Filter reviews received today

1. Add a **Filter** node to the flow and it to the `Product reviews` node.

   Create a filter node by dragging one onto the canvas. You can find this in the **Processors** section of the left panel.

   Click and drag from the small gray dot on the event source to the matching dot on the filter node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-5a.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-5a.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}


1. Give the filter node a name that describes the results: `Filtered reviews`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_filter1.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_filter1.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

   Hover over the filter node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Use the expression editor to define a filter that filters records where `reviewtime` is today, and click **Add to expression**.

   ```sql
   TIMESTAMPDIFF(DAY, reviewtime, CURRENT_TIMESTAMP) = 0
   ```

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/watsonx_filter1_2.png "defining the filter"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/watsonx_filter1_2.png "defining the filter")

1. Click **Next** to open the **Output properties** pane. Choose the properties to output.

1. Click **Configure** to finalize the filter.


### Step 6: Calculate the average rating and review count

The next step is to count the number of review comments and the average review rating received within a 1-day window.

1. Add an **Aggregate** node and link it to your filter node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6a.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6a.png "defining the aggregation")

   Create an aggregate node by dragging one onto the canvas. You can find this in the **Windowed** section of the left panel.

   Click and drag from the small gray dot on the output of the filter node to the matching dot on the input of the aggregate node.

   Hover over the aggregate node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Name the aggregate node to show that it will count the number of review comments in one day: `Review comments in a day`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6b.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6b.png "defining the aggregation")

1. Specify a 1-day window.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6c.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6c.png "defining the aggregation")

1. Add an aggregate function to count the number of review comments in one day, grouped by `review.comment`.

   Select `COUNT` as the aggregate function.

   The property we are adding up is `review.comment` - the number of review comments received. This will add up the number of review comments received within the time window.

1. Add another aggregate function to calculate the average of the review ratings in one day, grouped by `review.rating`.

   Select `AVG` as the aggregate function.

   The property we are calculating average of is `review.rating` - the rating received in a review comment. This will calculate the average of review ratings received within the time window.

1. Add another aggregate function to list the review comments, grouped by `review.comment`.

   Select `LISTAGG` as the aggregate function.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6d.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6d.png "defining the aggregation")

   The property we are listing is `review.comment` - the number of review comments received. This will list the review comments received within the time window.

1. Select `product` as an additional property for group by. Then click **Next**.
1. Rename the output aggregate properties:

   - COUNT_review_comment → Amount of reviews
   - AVG_review_rating → Average rating
   - LISTAGG_review_comment → Reviews
   - product → Product
   - aggregateStartTime → Start time
   - aggregateEndTime → End time

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6e.png "defining the aggregation"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-6e.png "defining the aggregation")

   **Tip**: It can be helpful to adjust the name of properties to something that will make sense to you, such as describing the `AVG_review_rating` property as `Average rating`.

1. Click **Configure** to finalize the aggregate.


### Step 7: Unpack the abandoned products into events

The next step is to unpack the list of products from the abandoned orders into events.

To add an unpack array node, complete the following steps:

For more information about how to create an unpack array node, see [unpack array node]({{ 'ep/nodes/processornodes/#adding-an-unpack-array-node' | relative_url }}).

1. Add an unpack array node and link the `Abandoned orders` node to the unpack array node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8a.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8a.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

   Hover over the unpack array node, and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. In the **Node name** field, enter the name of the unpack array node as `Unpack abandoned products`, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8b.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8b.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. In the **Array selection** pane, select the **products** array, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8c.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8c.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. In the **Unpack into events** tab, enter `product` in the **Property name** field, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8d.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8d.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

   **Note:** By default, the **Unpack the array** pane displays the **Unpack into events** tab.

   In the **Output properties** pane, you can see that each event has only one single return object, and there is no products array anymore.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8e.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-8e.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. Click **Configure** to finalize the unpack array node configuration.


### Step 8: Identify positive reviews of abandoned products

The next step is to specify how to correlate the daily product reviews with the abandoned cart products.

1. Add an **Interval join** node to combine the product reviews with the abandoned products.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9a.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9a.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. Give the join node a name that describes the events it should identify: `Positive reviews of abandoned products`

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9b.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9b.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. Define the join by matching the `product` from `Analyze positive reviews` events with the `Product` from `Unpack abandoned products` events.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9c.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9c.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. Specify that you are interested in detecting abandoned orders that are made within 1 day of the positive review, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9d.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9d.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. Select the join type as `Inner join` to retrieve only the common events from the two input streams. Then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9e.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9e.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. Choose the output properties that will be useful to return.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9ee.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-9ee.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. Click **Configure** to finalize the interval join configuration.


### Step 9: Identify the highest rated product on each abandoned cart

1. Add a **Top-n** node and link it to the join node.

   Create a top-n node by dragging one onto the canvas. You can find this in the **Windowed** section of the left panel.

   Click and drag from the small gray dot on the output of the filter node to the matching dot on the input of the top-n node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10a.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10a.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

   Hover over the top-n node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Name the top-n node to show that it will only display two results on each time window: `Highest rated product on each cart`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10b.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10b.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. In the **Time window** pane, ensure that the `aggregateResultTime` is selected to use for start of the time window and set to 1 hour, and then click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10c.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10c.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. In the **Condition** pane, enter the values in the following fields, and then click **Next**:
    - **Number of results to keep on each window**: 1
    - **Ordered by**: `Average rating, Descending`

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10d.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10d.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. Remove the following properties: `aggregateResultTime`, `Start time`, `End time`, `windowResultTime`, `windowStartTime`, `windowEndTime`, `customer . id`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10f.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-10f.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

1. Click **Configure** to finalize the top-n configuration.


### Step 10: Create a watsonx.ai node

The next step is to identify products with the most positive review by using the watsonx.ai node.

1. Add a **watsonx.ai** node and link it to the aggregate node.

   Create a watsonx.ai node by dragging one onto the canvas. You can find this in the **Enrichment** section of the left panel, and link it to the aggregate node.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7a.png "defining the watsonx"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7a.png "defining the watsonx")

   Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

1. Give the watsonx.ai node a name that describes the events it must summarize: `Analyze positive reviews` and click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7b.png "defining the watsonx"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7b.png "defining the watsonx")

1. Provide the API key and the public text endpoint URL for the `Positive review analysis` prompt that you [created earlier](#before-you-begin).

   Click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7c.png "defining the watsonx"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7c.png "defining the watsonx")

1. In the **Map prompt variables** pane, the prompt that you [created earlier](#before-you-begin) is displayed. In the **Variable mapping** section, toggle the values for `product` and `reviews` to take input properties and select `Product` and `Reviews` respectively.

   Click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7d.png "defining the watsonx"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7d.png "defining the watsonx")

1. In the **Response properties** pane, properties returned from watsonx.ai are displayed. Add or remove the fields properties that you do not want to include further.

   **Note:** Properties providing watsonx.ai generated values are marked with an AI tag and ensure to not remove those properties. To rename properties, hover over a property, and click the ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** icon.

   Click **Next**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7e.png "defining the watsonx"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-7e.png "defining the watsonx")

1. You can choose the output properties that you want in the **Output properties** pane.
KOKO
1. Click **Configure** to finalize the watsonx.ai node configuration.

### Step 11: Write your events to a Kafka topic

The results must be written to a different Kafka topic. You can use the event destination node to write your events to a Kafka topic.

1. Create an event destination node by dragging one onto the canvas. You can find this in the **Events** section of the left panel.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11a.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11a.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}


1. Enter the node name as `Notify users with email`.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11b.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11b.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}


1. Configure the event destination node by using the internal server address from {{site.data.reuse.es_name}}.

1. Use the username and password for the `kafka-demo-apps` user for accessing the new topic.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11c.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11c.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}

   If you need a reminder of the password for the `kafka-demo-apps` user, you can review the [Accessing Kafka topics](../guided/tutorial-access#accessing-kafka-topics) section of the Tutorial Setup instructions.

1. Choose the `NOTIFY.ABANDONED.PRODUCTS` topic created in [Step 1]().

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11d.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11d.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}


1. Click **Configure**.


[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11e.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-11e.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}


### Step 12: Test the flow

The final step is to run your event processing flow and view the results.

Use the **Run** menu, and select **Include historical** to view the most positive review comments for your abandoned products placed in your cart.

[![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-12.png "Screen capture of the watsonx.ai prompt"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-19-12.png "Screen capture of the watsonx.ai prompt"){:height="200%" width="200%"}


## Recap

You used the watsonx.ai node to view which product left in the cart has the highest average rating and then send an email to the user highlighting that product along with its most positive review.
