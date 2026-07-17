---
title: "Managing client access to virtual topics"
excerpt: "Find out how you manage client access to your topics socialized via Event Endpoint Management"
categories: describe
slug: managing-user-access-to-topics
toc: true
---

After socializing a virtual topic to the {{site.data.reuse.eem_name}} **Catalog**, users subscribe to the virtual topics with [applications](../../about/key-concepts#application). 

The **Manage** tab of the **Topic details** page displays the list of [applications](../../about/key-concepts#application) that subscribe to virtual topics on your source topic.

You can also remove an application subscription.

If you have a virtual topic that requires subscription approval, then the **Manage** tab includes a switch to see all the pending requests for access to the virtual topics that are related to this source topic, and require a response.

To view and manage the users of your virtual topics, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Manage > Topics**, then from the list select the source topic that you want to manage.
3. Click the **Manage** tab.

The **Subscriptions** view shows the application subscriptions for the virtual topics related to your source topic. The **Requests** list details all the currently pending access requests for virtual topics related to your source topic. 

## Removing subscriptions
{: #removing-subscriptions}

Delete subscriptions to stop clients from accessing a virtual topic. When you delete a subscription, clients are still able to use the virtual topic for up to 30 seconds after the subscription is deleted (due to the default 30 second {{site.data.reuse.egwr}} poll interval). To reconnect clients of a deleted subscription, a new subscription with new credentials is required.

To remove subscriptions, complete the following steps:
1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Manage > Topics**, then from the list select the source topic that you want to manage.
3. Click the **Manage** tab.
4. Click **Remove** next to the application that has the subscription that you want to remove.
5. Enter the application owner or subscriber username and click **Remove**.

To unpublish an archived virtual topic, you must remove all subscriptions. After your virtual topic is archived and all subscriptions are removed, the virtual topic is automatically unpublished.

**Note:** To delete a virtual topic from {{site.data.reuse.eem_name}}, all subscriptions must be removed first and the virtual topics must be placed in the **Unpublished** state.

## Reviewing requests
{: #reviewing-requests}

After socializing a virtual topic with approval enabled, you can review requests for subscriptions to the topic, and approve or reject as required.

To approve or reject a request, complete the following steps:
1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Manage > Topics**, then from the list select the source topic that you want to manage.
3. Click the **Manage** tab.
4. Click **Requests** to see the list of requests against virtual topics on this source topic.
5. Click **View request** on the request that you want to approve or reject.
6. To approve a request, click **Approve**.
7. To deny a request, click **Deny**.

**Note:** To view all the pending approval requests against all your topics, click **Access requests** in the navigation pane.

