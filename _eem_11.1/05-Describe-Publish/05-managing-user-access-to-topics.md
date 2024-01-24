---
title: "Managing user access to options"
excerpt: "Find out how you manage user access to your topics socialized via Event Endpoint Management"
categories: describe
slug: managing-user-access-to-topics
toc: true
---

After socializing an option to the {{site.data.reuse.eem_name}} **Catalog**, users can sign up to use the options created for your topic. 

The **Manage** tab of the **Topic details** page displays the list of subscribers to options on your topic and their contact details, which you can use to contact them if required. 

You can also remove a subscription from a user, which will revoke their access to that option.

If you have an option with approval control enabled, the **Manage** tab will include a switch to allow you to see all the pending requests for access to options against this topic that require a response.

To find out and manage which users are using your options, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Topics**, then from the list select the topic you want to manage.
3. Click the **Manage** tab.

The **Subscribers** list details all the current subscriptions for options on your topic. The following information is presented about each user:

- The user's name
- The contact details they provided when subscribing to your topic
- The date and time they signed up

The **Requests** list details all the currently pending access requests for options on your topic. The following information is presented about each user:

- The user's name
- The contact details they provided when subscribing to your topic
- The date and time they signed up

## Revoking subscriptions

After socializing your option, you can revoke subscriptions to it. After revoking a subscription, the gateway no longer allows revoked credentials to be used in new connection attempts. Client connections that are already connected stay connected until they disconnect.

To revoke subscriptions, complete the following steps:
1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Topics**, then from the list select the topic you want to manage.
3. Click the **Manage** tab.
4. Click **Revoke** against the subscription you want to revoke.
5. Enter the subscriber username and click **Revoke**.

To unpublish an archived option, you have to revoke all subscriptions. After your option is archived and you have revoked all subscriptions, it automatically becomes unpublished.

**Note:** To delete an option from {{site.data.reuse.eem_name}}, all subscriptions must be revoked first and the options must be placed in the **Unpublished** state.

## Reviewing requests

After socializing your option with approval enabled, you can review requests for subscriptions to it and approve or reject requests.

To approve or deny a request, complete the following steps:
1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Topics**, then from the list select the topic you want to manage.
3. Click the **Manage** tab.
4. Click **Requests** to see the list of requests against options on this topic.
5. Click **View request** on the request you want to approve or reject.
6. To approve a request, click **Approve**.
7. To deny a request, click **Deny**.

**Note:** To view all the requests pending against options you own, click **Requests** in the navigation pane.

An approved request allows the user to create one subscription to the option the request is made against. This subscription can be revoked and this would force a user to create a new request to try and get a new subscription.
