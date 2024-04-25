---
title: "Subscribing to topics"
excerpt: "Subscribe to discovered topics from the catalog in a self-service manner."
categories: consume-subscribe
slug: subscribing-to-topics
toc: true
---

After discovering a topic that is suitable for use with your application, you can subscribe to it in a self-service manner in [the Catalog](../discovering-topics#the-catalog) by generating access credentials.

## Requesting access to an event source

You can request access to an event source (topic) follows:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Catalog**.
3. Select an event source from the list by clicking the topic name.
4. Click **Generate access credentials** in the **Topic information** view.
5. Follow the instructions to request access: provide your contact details, and click **Generate**.

   The modal will present your subscription credentials. This credential is a `SASL` username and password, which uniquely identifies you and your usage of this event source (topic). These credentials must be used when accessing the event source through the Event Gateway.

   **Note:** The contact information is a free text field, and the details provided can be used by the owners of the event source (topic) to contact you as required, for example, in case of maintenance or topic deprecation. Providing an email address is recommended.

6. ![Event Endpoint Management 11.1.5 icon]({{ 'images' | relative_url }}/11.1.5.svg "In Event Endpoint Management 11.1.5 and later.") Copy your username and password values, or click **Download credentials** to download your generated credentials as a JSON file for future use and reference.
   
   In versions earlier than 11.1.5, click **Download as JSON** to download your generated credentials as a JSON file.

   Your application will require these credentials to [access the event source](../setting-your-application-to-consume)  through the Event Gateway.

   **Important:** The credentials generated for you are shown one time. They cannot be retrieved later. Ensure you save the access credentials and store them in a secure location.

**Note:** The **Generate access credentials** button is only available for topics that are still accepting new subscriptions. The owner of the event source (topic) controls if subscriptions are offered in the **Catalog**.

## Requesting access to an option
{: #requesting_access}

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") If an option has been configured with approval controls, you need to create a request for permission to subscribe to that option.

To create a request to subscribe to an option that has approval control enabled, complete the following steps.

1. In the catalog, select the topic that you want to work with.
1. Select the option that you want to subscribe to.
1. Click **Request Access**. The Request access window is displayed.
1. In the **Contact** field, provide a contact name.
1. In the **Justification** field, provide a description to explain why you want this subscription.
1. Click **Request**.

Your request will be reviewed by the owner of the option.

**Note:** You can only have one request for a subscription open at a time against an option. If **Request access** is greyed out, a request for that option is pending a review by the option owner.

## Access approvals and rejections
{: #approvals_rejections}

### Approved requests
{: #approved_requests}

If your request is approved, the **Request access** button changes to **Generate credentials** and you can then proceed to [generate credentials](../subscribing-to-topics) by following the usual process.

### Rejected requests
{: #rejected_requests}

If your request is rejected, then **Request access** is reset and you can submit a new request.

## Next steps

After creating a subscription, you can access the event endpoint you subscribed to through the Event Gateway. [The Catalog](../discovering-topics#the-catalog) contains sample code and connection information to help you configure your application to [consume from the event source](../setting-your-application-to-consume) or [produce to the event source](../setting-your-application-to-produce).

**Note**: ![Event Endpoint Management 11.1.5 icon]({{ 'images' | relative_url }}/11.1.5.svg "In Event Endpoint Management 11.1.5 and later") The ability to produce events is only available in {{site.data.reuse.eem_name}} version 11.1.5 and later.

You can also [view the event endpoints](../managing-subscriptions) you have access to, and remove any subscriptions you no longer require.

