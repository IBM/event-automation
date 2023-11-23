---
title: "Subscribing to topics"
excerpt: "Subscribe to discovered topics from the catalog in a self-service manner."
categories: consume-subscribe
slug: subscribing-to-topics
toc: true
---

After discovering the topic that provides the source of events required for your application, you can subscribe to it in a self-service manner in [the Catalog](../discovering-topics#the-catalog) by generating access credentials.

## Requesting access

You can request access to a topic as follows:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Catalog**.
3. Select an event source from the list by clicking the topic name.
4. Click **Generate access credentials** in the **Topic information** view.
5. Follow the instructions to request access: provide your contact details, and click **Subscribe**.

   The modal will present your subscription credentials. This credential is a `SASL` username and password, which uniquely identifies you and your usage of this event source (topic). These credentials must be used when accessing the event source through the Event Gateway.

   **Note:** The contact information is a free text field, and the details provided can be used by the owners of the event source (topic) to contact you as required, for example, in case of maintenance or topic deprecation. Providing an email address is recommended.

6. Copy your username and password values or download a JSON file containing your generated credentials for future use and reference.

   Your application will require these credentials to [access the event source](../setting-your-application-to-consume)  through the Event Gateway.

   **Important:** The credentials generated for you are shown one time. They cannot be retrieved later. Ensure you save the access credentials and store them in a secure location.

**Note:** The **Generate access credentials** button is only available for topics that are still accepting new subscriptions. The owner of the event source (topic) controls if subscriptions are offered in the **Catalog**.

## Next steps

After creating a subscription, you can access the event data you subscribed to through the Event Gateway. [The Catalog](../discovering-topics#the-catalog) contains sample code and connection information to help you [configure your application to consume](../setting-your-application-to-consume) from the event source.

You can also [view the topics](../managing-subscriptions) you have access to, and remove any subscriptions you no longer require.

