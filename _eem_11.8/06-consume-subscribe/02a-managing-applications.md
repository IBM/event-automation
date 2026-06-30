---
title: "Managing applications"
excerpt: "Create, edit, and delete applications"
categories: subscribe
slug: managing-apps
toc: true
---

[Applications](../../about/key-concepts#application) in {{site.data.reuse.eem_name}} are the set of credentials and requirements that allow Kafka clients to use virtual topics. 


## Creating an application
{: #create-app}

Applications can be created by users with the author or viewer role.

To create an application, follow these steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Applications**.
3. Click **Create application**.
4. Enter a name for your application, description, and your contact details.
5. If user groups are enabled, then select the user groups that are allowed to edit this application (Collaborators). If user groups are not enabled, then only the user who created the application can edit it.
6. Select the client authentication sets that this application supports. The application can only be subscribed to virtual topics that specify the same client authentication sets. For example, an application can only subscribe to an mTLS-secured virtual topic if the application has mTLS credentials that match the requirements of the virtual topic.
7. If your selected authentication sets require more configuration information, then click **Configure authentication**. Mutual TLS requires that you provide the details of your client certificate. Application credentials must be unique.
8. Click **Create**.
9. If the authentication sets that you specified include SASL credentials, then the username and password that clients must use is displayed. Click **Download credentials** to download the application credentials.


## Editing an application
{: #edit-app}

You can edit the name, description, and contact details of an application at any time. You cannot edit existing credentials, but you can add new credentials and delete existing credentials.

**Important:** Although you can add and remove credentials, be aware of the following limitations:
- When you add an mTLS credential to an application, the credential is verified against the mTLS requirements of all the virtual topics that the application subscribes to. You cannot add mTLS credentials to an application that does not meet the requirements of existing virtual topic subscriptions.
- You cannot delete all credentials from an application. An application must have the credentials that are required to satisfy the authentication set that was specified when the application was created. For example, if the application's authentication set requires MTLS and SASL, then the application must have these credentials. 

## Deleting an application
{: #delete-app}

You can delete an application only if it is not subscribed to any virtual topic. If your application is subscribed to a virtual topic, then you must unsubscribe it before you can delete it. To delete subscriptions, see [managing access to topics](../../describe/managing-user-access-to-topics#removing-subscriptions).

