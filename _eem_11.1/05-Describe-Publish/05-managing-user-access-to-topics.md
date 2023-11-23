---
title: "Managing user access to topics"
excerpt: "Find out how you manage user access to your topics socialized via Event Endpoint Management"
categories: describe
slug: managing-user-access-to-topics
toc: true
---

After socializing a topic to the {{site.data.reuse.eem_name}} **Catalog**, users can sign up to utilize your event sources. 

The **Topic Detail** page displays the list of subscribers to your topic and their contact details, which you can use to contact them if required. 

You can also remove a subscription from a user, which will revoke their access to your event source.

To find out and manage which users are using your topics, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Topics**, then from the list select the topic you want to manage.
3. Click the **Manage** tab.

The **Subscribers** section details all the current users of your topic. The following information is presented about each user:

- The user's name
- The contact details they provided when subscribing to your topic
- The date and time they signed up

## Revoking subscriptions

After socializing your event source, you can revoke subscriptions to it. The next gateway configuration update will disconnect any clients using revoked subscriptions from the event source with an appropriate error message.

To revoke subscriptions, complete the following steps:
1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Topics**, then from the list select the topic you want to manage.
3. Click the **Manage** tab.
4. Click **Revoke** against the subscription you want to revoke.
5. Enter the subscriber username and click **Revoke**.

To unpublish an archived topic, you have to revoke all subscriptions. After your event source is archived and you have revoked all subscriptions, it automatically becomes unpublished.

**Note:** To delete a topic from {{site.data.reuse.eem_name}}, all subscriptions must be revoked first.