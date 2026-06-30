---
title: "Managing security controls"
excerpt: "Find out how to configure security controls for your virtual topics."
categories: describe
slug: security-controls
toc: true
---

You can secure your [virtual topics](../managing-virtual-topics) by configuring security controls.

You specify which of the available authentication methods that you want to use for a virtual topic in the **Security controls** pane when you are [editing a virtual topic](../managing-virtual-topics#security-controls). In the **Security controls** pane, you can also specify whether you want subscriptions to require approval.

The authentication methods that are available to secure endpoints are managed by users with the admin role. For more information about configuring the available security controls, see [managing virtual topic security](../../security/cred-sets).


To access the **Security controls** pane for a virtual topic, follow these steps:
{: #edit-controls}
1. In the navigation pane, click **Manage > Topics**.
2. Find the source topic that you want to work with in the list, and click the name of the topic.
3. Click the **Virtual topics** tab.
4. Click **Create virtual topic** or edit an existing virtual topic. 
5. Click **Security controls** in the left pane. If you are creating a new virtual topic, then you must specify a name and alias for the virtual topic and click **Next** to access the **Security controls** pane.

## Approval
{: #approval-controls}

If you want to control who can subscribe to your virtual topic, enable **Require approval** in the [**Security controls**](#edit-controls) pane when you are creating or editing the virtual topic.

When a virtual topic has approval enabled, a user must submit a request to subscribe to the virtual topic. The request includes a reason to justify the need for a subscription along with the requester's contact information. The virtual topic owner can then approve or reject the request as required.

The owner of a virtual topic that requires approval receives notifications in the {{site.data.reuse.eem_name}} UI when someone requests access to the virtual topic, and can then approve or reject the request.

When a request is approved, a notification is presented in the {{site.data.reuse.eem_name}} UI to the user about the approval, and the subscription is created by using the information that the requester provided when they made the subscription request.

**Note:** A user can have only one request for a subscription to a virtual topic open at a time.

**Note:** You cannot publish virtual topics with **Require approval** enabled to {{site.data.reuse.wm_portal_long}}. To publish a virtual topic to {{site.data.reuse.wm_portal_short}}, the **Require approval** toggle must be set to **Off**.

### Viewing approval requests for a specific source topic
{: #viewing-requests-from-source-topic}

To view approval requests for a specific source topic, complete the following steps:

1. In the navigation pane, click **Manage > Topics**.
2. Find the source topic that you want to work with in the list, and click the name of the topic.
3. Click the **Manage** tab.
4. Click **Requests** to see a list of all of the requests made against this topic.
5. For the request you want to review, click **View request**. An approval pop-up window opens. All the details about the request including the source topic, virtual topic, contact details of the requester and the justification for the request are displayed.
6. Review the information that is provided and click **Approve** or **Deny** as required.

### Viewing all approval requests
{: #viewing-requests-from-virtual-topic}

To view all your approval requests, complete the following steps:

1. In the navigation pane, click **Access requests**. The **Access requests** page is displayed.
2. All the requests against virtual topics that you own are displayed.
3. For the request you want to review, click **View request**. An approval pop-up window opens. All the details about the request including the source topic, virtual topic, contact details of the requester, and the justification for the request are displayed.
4. Review the information that is provided and click **Approve** or **Deny** as required.


## Mutual TLS
{: #mtls}

If you want to control access to your virtual topic with mTLS, you can select an authentication set that includes mTLS when you are configuring the virtual topic. 

When a virtual topic is configured with mTLS authentication, a client can connect to the gateway only if they present a valid client certificate.

To configure a security control to use mTLS authentication, you must provide details of valid client TLS certificates. Follow these steps to provide the requirements for the client certificate:

1. From the [**Security controls**](#edit-controls) pane, select an authentication set that includes mTLS, then click **Configure mutual TLS control**.
2. Specify the requirements for mTLS client certificates in the **Mutual TLS requirements** pane.

      Required properties:
        
      - **Trusted CA certificates.** Select the box to indicate which CA certificates are trusted: 
         * Certificates that you uploaded. Select **Accept any CA certificate in your Profile**.
         * Certificates that are uploaded to your organization by admin users. Select **Accept any CA certificates in your Organization**.
         * All uploaded certificates. Select both boxes.
         
          If you do not select any box, then the control trusts only certificates that are signed by well-known external certificate authorities.
      - **Common name.** Common name can contain a single wildcard `*` at any position. For example, if **Common name** is set to `*-domainname`, then the control accepts client certificates with the common names of `c-domainname` or `andre-domainname`.

   Single wildcard `*` characters are accepted in all text fields.
           
3. In the **Identifying factor** pane, select the properties that you want to uniquely identify the clients with.

     **Common name** is mandatory and cannot be cleared.

     **Important:** Every client must present a unique common name. If the common name you specified in **Mutual TLS requirements** does not contain a wildcard character, then only a single client can access the virtual topic.


### Updating CA certificates
{: #mtls-updating-ca-certificates}

It is your responsibility to update the CA certificates before they expire. Follow the instructions in [managing CA certificates](../../security/cred-sets#config-mtls) to update your CA certificates.


## OAuth2
{: #oauth}

If you want to use an OAuth2 provider to authenticate a client, then specify a client authentication set that has OAuth2 control in the [**Security controls**](#edit-controls) pane.  

The details of the OAuth 2.0 provider are supplied by users with the admin role when defining an authentication set that has [OAuth 2.0 control configured](../../security/cred-sets#oauth).


## SASL credentials
{: #sasl}

If you want to use generated SASL credentials to authenticate clients, then select an authentication set that uses SASL credentials in the [**Security controls**](#edit-controls) pane. 

Unique SASL credentials are generated for each application that subscribes. No additional configuration is required.

**Note:** If you want to publish a virtual topic to {{site.data.reuse.wm_portal_long}}, you must select **SASL credentials**.
