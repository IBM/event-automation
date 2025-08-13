---
title: "Managing mTLS control certificates"
excerpt: "If access to your event endpoints use mTLS controls, then the CA certificates for your clients must be uploaded to Event Endpoint Manager."
categories: security
slug: ca-certs
toc: true
---

Access to event endpoints can be secured with [mTLS controls](../../describe/option-controls#mtls). If your client certificates are self-signed, then you must upload their CA certificate to {{site.data.reuse.eem_name}}. The CA certificate must be in PEM format and can include multiple certificates. 

Client certificates that are signed by well-known certificate authorities do not require CA certificate upload.

To prevent interruption of service, CA certificates must be replaced before they expire. Upload your replacement CA certificate before you delete the previous one.

## Certificate sharing and user roles
{: #certificate-sharing-and-user-roles}

How CA certificates are used and shared depends on your user [role](../user-roles):

- Certificates uploaded by users with the **author** role are available only to that user.
- Certificates uploaded by users with the **admin** role are available to all users within their organization.
- Users that have both **author** and **admin** roles can choose to share the certificates they upload.

## Adding and updating CA certificates
{: #adding-and-updating-ca-certificates}

To review the CA certificates and upload new ones, follow these steps:

1. Log in to your {{site.data.reuse.eem_name}} UI from a supported web browser.
2. If your user has the author role, then:

   a. Click the user icon ![User icon]({{ 'images' | relative_url }}/usericon.svg "The user icon."){:height="30px" width="15px"} in the header, and then click **Profile** to open the **Profile** page.

   b. Switch to the **CA certificates** tab.
   
   Two tables are displayed. The top table shows the CA certificates that you uploaded, the bottom table shows the CA certificates that users with the admin role have uploaded in your organization. 
3. If your user has only the admin role, then click **Administration > Organization CAs**.

   A table is displayed that shows the CA certificates that you and other admin users have uploaded.
4. To upload new certificates, click **Add CA certificate**.

   a. Upload your CA certificate PEM file. The certificates in your PEM file are validated and displayed in a table.
   
   b. Review the table of certificates and delete any invalid or expired certificates from the list, then click **Add**.

 A warning is displayed on certificates that are near expiry. To prevent an interruption of service, you must replace certificates before they expire. Upload the replacement certificate before deleting the previous certificate.


