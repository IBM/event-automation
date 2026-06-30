---
title: "Subscribing to virtual topics"
excerpt: "Subscribe to virtual topics from the catalog in a self-service manner."
categories: subscribe
slug: subscribing-apps
toc: true
---

To subscribe to virtual topics, you must have at least one application. In {{site.data.reuse.eem_name}} 11.8.0 and later, you do not subscribe to virtual topics directly, you use applications. Applications can subscribe to multiple virtual topics, so you do not need separate credentials for each virtual topic. 

If you upgraded from version 11.7.x, then your existing subscriptions were automatically converted to applications.

## Before you begin
{: #before-you-begin}

Create one or more [applications](../managing-apps#create-app).

## Subscribing to virtual topics
{: #subscribing}

To subscribe to a virtual topic, follow these steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Catalog**.
3. Click the topic that you want to subscribe to.
4. In the **Virtual topics** section, click the virtual topic that you want to use.
4. Click **Subscribe**, or if approval is required, click **Request subscription** 

   **Note:** The **Subscribe** button is only available for virtual topics that are still accepting new subscriptions. The owner of the virtual topic controls if subscriptions are offered in the **Catalog**.

   If approval is required, then enter a justification for the subscription request.
4. Select the application that you want to use for the subscription and then click **Subscribe**, or if approval is required, click **Request subscription**. If no applications are available, then you can click **Create application** to [create a new application](../managing-apps#create-app).

If the virtual topic requires subscription approval, then you cannot start using the virtual topic until the subscription is approved. When the virtual topic owner approves or denies your request, you are notified in the {{site.data.reuse.eem_name}} UI and if the request is approved then your subscription is enabled. You can check your pending subscription requests when you view the virtual topic details.

**Important:** The following restrictions apply when creating subscriptions:
- Applications that have one subscription can be used with earlier gateways. Applications that have two or more subscriptions can be used only with gateways from {{site.data.reuse.eem_name}} version 11.8.0 and later.
- If you have any earlier gateways, then your applications can only subscribe to a single topic and use a single credential, regardless of which gateways your virtual topics are published to.
- An application can subscribe only to topics that are published to the same gateway groups. You cannot subscribe an application to virtual topics that are published to different gateway groups.
- An application cannot subscribe to virtual topics that use the same source topic. Applications can subscribe to multiple virtual topics, but the virtual topics must each connect to a unique source topic. If the catalog contains virtual topics that use the same source topic, then an application can subscribe only to one of those virtual topics. This restriction is to prevent clients unknowingly consuming the same events from the same topic multiple times.
- An exception to the previous restriction is where the source topic supports both produce and consume operations. In such cases, the application can subscribe to both the produce and consume virtual topics for that source topic.

## Deleting a subscription
{: #removing-subscriptions}

To delete subscriptions, see [managing access to topics](../../describe/managing-user-access-to-topics#removing-subscriptions).