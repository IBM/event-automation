---
title: "Managing subscriptions"
excerpt: "Review subscriptions to topics and remove credentials when they are no longer required."
categories: consume-subscribe
slug: managing-subscriptions
toc: true
---

After [subscribing](../subscribing-to-topics/) to an event endpoint, a subscription is created for you. You can locate those event endpoints that you are currently subscribed to by opening and reviewing the {{site.data.reuse.eem_name}} **Subscriptions** page.

The **Subscriptions** page displays all of your subscriptions, listing the name of each event endpoint you are subscribed to, together with the related tags and associated usernames for each. You can create more than one subscription to a single event endpoint.

## Accessing the Subscription page

1. {{site.data.reuse.eem_ui_login}}
2. In the navigation pane, click **Subscriptions**.
    A list of all of your subscriptions is displayed, showing all the event endpoints you are subscribed to, together with associated tags and usernames.

## Removing credentials and subscriptions

Credentials are removed when the associated subscription is deleted. You can delete a subscription and remove its credentials by clicking **Delete** ![Delete icon]({{ 'images' | relative_url }}/trashcan.svg "Remove subscription icon."){:height="30px" width="15px"} in the row of the subscription.

**Note:** After removing a subscription, the username and password for that subscription becomes invalid, and cannot be used again. You can create new subscriptions to the same event endpoint, but any new subscription to the same event endpoint is generated with a different username and password.

### To remove a subscription

1. {{site.data.reuse.eem_ui_login}}
2. In the navigation pane, click **Subscriptions**.
3. Locate the subscription that you would like to revoke.
4. Click **Delete** ![Delete icon]({{ 'images' | relative_url }}/trashcan.svg "Remove subscription icon."){:height="30px" width="15px"} in the row of the subscription you want to remove.
5. Read the **Revoke subscriber credentials** warning, and provide confirmation by entering the subscriber username in the field exactly as it is displayed in the message.
6. Click **Revoke** to remove the certificate.

When the credentials are revoked, a confirmation message is displayed, and the subscription is removed from your subscriptions list.

By revoking a subscription, the gateway no longer allows revoked credentials to be used in new connection attempts. Client connections that are already connected stay connected until they disconnect. When the client disconnects, a new subscription with new credentials is required to re-connect.