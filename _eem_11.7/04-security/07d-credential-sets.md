---
title: "Managing event endpoint security"
excerpt: "Define the authentication types and authentication sets that can be used to secure event endpoints in your organization"
categories: security
slug: cred-sets
toc: true
---

Access to your event endpoints is managed with [security controls](../../describe/security-option-controls). Before you can create security controls, the authentication methods that are available to use in your security controls must be defined in [client authentication sets](#auth-sets). 

**Note:** Authentication set configuration is available in {{site.data.reuse.eem_name}} 11.7.1 and later. If you have 11.7.0 or earlier, then authentication settings are configured during control configuration as described in the [controls]({{ 'eem/eem_11.6/describe/option-controls/' | relative_url }}) and [mTLS CA certificates]({{ 'eem/eem_11.6/security/ca-certs/' | relative_url }}) topics of the 11.6.x documentation.

The available authentication methods are:

- Mutual TLS (mTLS)
- SASL credentials
- SASL OAuth

Mutual TLS can also be used in combination with either SASL credentials or SASL OAuth.

## Defining client authentication sets
{: #auth-sets}

Users with the admin role can define the authentication methods that are available for authors to use to secure event endpoints. The different authentication methods and combinations of methods that you make available are called **Client authentication sets**.

To manage the client authentication sets that are available in your organization, follow these steps:

1. Log in to your {{site.data.reuse.eem_name}} UI from a supported web browser.
2. Select **Administration > Security**.
3. Select the **Client authentication sets** tab. The authentication sets that are configured for your organization are shown as tiles. 
   - If you want to delete an authentication set, then click the delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Delete authentication set."){:height="30px" width="15px"} on its tile. 
   
   **Note:** You must have at least one authentication set defined. Deleting an authentication set prevents you from publishing options that use that authentication set. However, if the deleted authentication set is in use by a published option, then the event endpoint continues to work. 
   
   - If you want to add an authentication set, then follow these steps:

        a. Click **Add client authentication set**.

        b. Click **Add security control**.

        c. Select from the available controls. A single authentication set can have multiple security controls.


## Configuring mutual TLS
{: #config-mtls}

If one of the authentication sets specifies mTLS, and your client certificates are not signed by a well-known CA, then you must upload their CA certificate to {{site.data.reuse.eem_name}}. The CA certificate must be in PEM format and can include multiple certificates. 

Client certificates that are signed by well-known certificate authorities do not require CA certificate upload.

### Certificate sharing and user roles
{: #certificate-sharing-and-user-roles}

How CA certificates are used and shared depends on your user [role](../user-roles):

- Certificates that are uploaded by users with the **author** role are available only to that user.
- Certificates that are uploaded by users with the **admin** role are available to all users within their organization.
- Users that have both **author** and **admin** roles can choose to share the certificates they upload.

### Adding and updating CA certificates as an admin user
{: #adding-and-updating-ca-certificates-admin}

To review the CA certificates that are available to all users within the organization, and to upload new ones, follow these steps:

1. Log in to your {{site.data.reuse.eem_name}} UI from a supported web browser.
2. Click **Administration > Security**.
3. Select the **Organization CA certificates** tab.

   A table is displayed that shows the uploaded CA certificates.
4. To upload new certificates, click **Add CA certificate**.

   a. Upload your CA certificate PEM file. The certificates in your PEM file are validated and displayed in a table.
   
   b. Review the table of certificates and delete any invalid certificates from the list, then click **Add**.

### Adding and updating CA certificates as an author
{: #adding-and-updating-ca-certificates-author}

To review the CA certificates that are available only to your user, and to upload new ones, follow these steps:

1. Log in to your {{site.data.reuse.eem_name}} UI from a supported web browser.
2. Click the user icon ![User icon]({{ 'images' | relative_url }}/usericon.svg "The user icon."){:height="30px" width="15px"} in the header, and then click **Profile** to open the **Profile** page.
3. Click the **CA certificates** tab.
   
   Two tables are displayed. The top table shows the CA certificates that you uploaded and which are available only to you. The bottom table shows the CA certificates that users with the admin role uploaded and shared for all users.
4. To upload new certificates, click **Add CA certificate**.

   a. Upload your CA certificate PEM file. The certificates in your PEM file are validated and displayed in a table.
   
   b. Review the table of certificates and delete any invalid certificates from the list, then click **Add**.

## Defining OAuth2 authentication providers
{: #oauth}

If you want to create an authentication set that has an OAuth 2.0 control, then you must define at least one OAuth 2.0 provider.

- Your OAuth 2.0 provider must have a `userinfo` endpoint.
- Microsoft Entra ID is not supported.

### Adding an OAuth2 authentication provider
{:#add-oauth}

1. Log in to your {{site.data.reuse.eem_name}} UI from a supported web browser.
2. Select **Administration > Security**.
3. Select the **OAuth2 configurations** tab.
4. Click **Add configuration**.
5. Enter the details for your OAuth 2.0 provider.

   - **Name**: Enter a name for the OAuth2 configuration that users recognize.
   - **UserInfo endpoint**:  For example: `https://example.com/userinfo`.
   - **Trusted certificates**: Upload the CA certificate of your OAuth2 provider. Your clients must trust this CA to be able to authenticate.
   - **Additional information**: Provide any additional information or steps that the consumer must follow to be able to use this OAuth2 provider.


## SASL credentials
{: #sasl}

To secure your event endpoints with SASL credentials, no extra configuration is required beyond selecting **SASL credentials** when you follow the [steps](#auth-sets) to create a client authentication set. When an event endpoint is secured with SASL credentials, unique credentials are generated for each client when they subscribe to the event endpoint.  



