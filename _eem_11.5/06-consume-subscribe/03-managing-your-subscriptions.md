---
title: "Managing subscriptions"
excerpt: "Review subscriptions to event endpoints and remove credentials when they are no longer required."
categories: subscribe
slug: managing-subscriptions
toc: true
---

You can locate the event endpoints that you are [subscribed](../subscribing-to-event-endpoints/) to by opening and reviewing the {{site.data.reuse.eem_name}} **Subscriptions** page.

The **Subscriptions** page displays all of your subscriptions, listing the name of each event endpoint that you are subscribed to, with their related tags, and associated usernames. You can create more than one subscription to a single event endpoint.

## Accessing the subscription page

1. {{site.data.reuse.eem_ui_login}}
2. In the navigation pane, click **Subscriptions**.
    A list of all of your subscriptions is displayed, showing all the event endpoints that you are subscribed to, together with associated tags and usernames.

## Removing subscriptions
{: #removing-subscriptions}

You can delete a subscription and remove its credentials by clicking **Delete** ![Delete icon]({{ 'images' | relative_url }}/trashcan.svg "Remove subscription icon."){:height="30px" width="15px"} in the row of the subscription.

**Note**: After you remove a subscription, the subscription credentials become invalid and cannot be reused. You can create new subscriptions to the same event endpoint, but any new subscription to the same event endpoint must use a different username and TLS client certificate (if mTLS is used).

### To remove a subscription

1. {{site.data.reuse.eem_ui_login}}
2. In the navigation pane, click **Subscriptions**.
3. Locate the subscription that you want to remove.
4. Click **Delete** ![Delete icon]({{ 'images' | relative_url }}/trashcan.svg "Remove subscription icon."){:height="30px" width="15px"} in the row of the subscription you want to remove.
5. Read the warning that is displayed, and provide confirmation by entering the subscriber username in the field exactly as it is displayed in the message. For mTLS-secured subscriptions that do not have a separate username, enter the common name from your TLS client certificate.
6. Depending on your version of {{site.data.reuse.eem_name}}, click **Remove** or **Unsubscribe** to remove the certificate.

When the credentials are revoked, a confirmation message is displayed, and the subscription is removed from your subscriptions list.

By removing a subscription, any client that uses that subscription is no longer able to consume or produce data after the next gateway poll of the {{site.data.reuse.eem_manager}} (default is 30 seconds). To reconnect that client, a new subscription with new credentials is required.