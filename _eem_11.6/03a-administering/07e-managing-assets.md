---
title: "Managing assets"
excerpt: "Find out how a user with the admin role can transfer assets between users."
categories: administering
slug: managing-assets
toc: true
---

In the {{site.data.reuse.eem_name}} **Asset management** page, you can see a list of users who own assets. For each user, a count of their assets and their roles are displayed. You can transfer assets to another user who has the correct permissions within their assigned role to own the asset. For example, you cannot transfer an admin's assets to a viewer or an author.

You can transfer the following assets from one user to another:

- [{{site.data.reuse.egw}}s](../../about/key-concepts#event-gateway)
- [Clusters](../../about/key-concepts#cluster)
- [Event sources](../../about/key-concepts#event-source)
- [Options](../../about/key-concepts#option)
- [Subscriptions](../../about/key-concepts#subscription)
- [CA Certificates](../../security/ca-certs)

**Note:** The CA certificates that are stored in a user's profile are replicated to the target user's profile during the transfer process. This ensures that any [controls](../../about/key-concepts#control) reliant on the CA certificate remain uninterrupted and functional.

## Before you begin
{: #pre-req}

* You must have the [admin user role](../../security/user-roles) to transfer assets. 
* You cannot select the assets to transfer. If a user owns more than one asset, you must transfer all of them.
* You can only transfer assets to a user with the same role as the current owner. For example,
  - You can transfer assets that are owned by an admin (such as organization CA certs, or gateways) to another admin only.  
  - You can transfer assets that are owned by an author (such as clusters, event sources, options, or subscriptions) to another author only.
  - You can transfer assets that are owned by a viewer (such as subscriptions) to another viewer or an author because authors have viewer permissions.

  **Note:** A user is not restricted to one role. For example, a user can be an author and an admin. This means that a user can own assets that are exclusive across the two roles. In this case, you must transfer assets from such a user to another user with the same roles.

## Transferring assets

1. In the navigation pane, click **Administration** > **Asset management**. 
1. In the table that is displayed, find the user that you want to transfer assets from and click **Transfer assets**. 
  **Note:** If no users with the correct permission to own the assets are available then **Asset transfer unavailable** is displayed and you cannot transfer any assets.  

1. In the **Transfer assets** panel, click the **Select user** dropdown menu to select a user. Only users that the assets can be transferred to is displayed. 
1. (Optional) You can also search for a user by typing their name into the textbox.
1. Click **Transfer assets** to start the transfer.
1. In the **Confirm asset transfer** dialog, type the name of the user to confirm the transfer. 
1. Click **Confirm**.

The assets are transferred and the table is updated to reflect the change. 