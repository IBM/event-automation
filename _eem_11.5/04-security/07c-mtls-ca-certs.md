---
title: "Managing CA certificates"
excerpt: "If access to your event endpoints use mTLS controls, then the CA certificates for your clients must be uploaded to Event Endpoint Manager."
categories: security
slug: ca-certs
toc: true
---

Access to event endpoints can be secured with [mTLS controls](../../describe/option-controls#mtls). If your client certificates are self-signed, then you must upload their CA certificate to {{site.data.reuse.eem_name}}. The CA certificate must be in PEM format and can include multiple certificates. 

Client certificates that are signed by well-known certificate authorities do not require CA certificate upload.

To prevent interruption of service, CA certificates must be replaced before they expire. Upload your replacement CA certificate before you delete the previous one.

To review your CA certificates and upload new ones, follow these steps:

1. {{site.data.reuse.eem_ui_login}}
2. Click the user icon ![User icon]({{ 'images' | relative_url }}/usericon.svg "The user icon."){:height="30px" width="15px"} in the header, and then click **Profile** to open the **Profile** page.
3. If your user has the [author role](../../security/user-roles), then within the **Profile** page, switch to the **CA certificates** tab.
4. A list of all your uploaded CA certificates is shown. Certificates that are close to expiry must be replaced with new certificates. Upload the replacement certificate before deleting the previous certificate.
5. To upload new certificates, click **Add CA certificate**.

   a. Upload your CA certificate PEM file. The certificates in your PEM file are validated and displayed in a table.
   
   b. Review the table of certificates and delete any invalid or expired certificates from the list, then click **Add**.



