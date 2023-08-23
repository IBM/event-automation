---
title: "Managing subscriptions"
excerpt: "Review subscriptions to topics and revoke credentials when they are no longer required."
categories: consume-subscribe
slug: managing-subscriptions
toc: true
---

![Event Endpoint Management 11.0.2 icon]({{ 'images' | relative_url }}/11.0.2.svg "In Event Endpoint Management 11.0.2.") After [subscribing](../subscribing-to-topics/) to a topic, a subscription is created for you. You can locate those topics that you are currently subscribed to by opening and reviewing the {{site.data.reuse.eem_name}} **Subscriptions** page.

The **Subscriptions** page displays all of your subscriptions, listing the name of each topic you are subscribed to, together with the related tags and associated usernames for each. You can create more than one subscription to a single topic.

## Accessing the Subscription page

1. {{site.data.reuse.eem_ui_login}}
2. In the navigation pane, click **Subscriptions**.
    A list of all of your subscriptions is displayed, showing all the topics you are subscribed to, together with associated tags and usernames.

## Revoking credentials and removing subscriptions

Credentials are revoked when the associated subscription is deleted. You can delete a subscription and revoke its credentials by clicking **Delete** ![Delete icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove subscription icon."){:height="30px" width="15px"} in the row of the subscription.

**Note**: After removing a subscription, the username and password for that subscription becomes invalid, and cannot be used again. You can create new subscriptions to the same topic, but any new subscription to the same topic is generated with a different username and password.

### To remove a subscription

1. {{site.data.reuse.eem_ui_login}}
2. In the navigation pane, click **Subscriptions**.
3. Locate the subscription that you would like to revoke.
4. Click **Delete** ![Delete icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove subscription icon."){:height="30px" width="15px"} in the row of the subscription you want to remove.
5. Read the **Revoke subscriber credentials** warning, and provide confirmation by entering the subscriber username in the field exactly as it is displayed in the message.
6. Click **Revoke** to remove the certificate.

When the credentials are revoked, a confirmation message is displayed, and the subscription is removed from your subscriptions list.
