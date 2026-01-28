---
title: "Managing security controls"
excerpt: "Find out how to configure security controls for your options."
categories: describe
slug: security-option-controls
toc: true
---

You can secure your event endpoints by configuring security controls for your [options](../managing-options).

**Note:** This topic describes how security controls are configured in {{site.data.reuse.eem_name}} 11.7.1 and later. If you have 11.7.0, then refer to the [controls]({{ 'eem/eem_11.6/describe/option-controls/' | relative_url }}) topic in the 11.6.x documentation.

You specify which of the available authentication methods that you want to use for an event endpoint in the **Security controls** pane when you are [editing an option](../managing-options#security-controls). In the **Security controls** pane, you can also specify whether you want subscriptions to require approval.

The authentication methods that are available to secure endpoints are managed by users with the admin role. For more information about configuring the available security controls, see [managing event endpoint security](../../security/cred-sets).


To access the **Security controls** pane for an option, follow these steps:
{: #edit-controls}
1. In the navigation pane, click **Manage > Topics**.
2. Find the event source that you want to work with in the list, and click the name of the event source.
3. Click the **Options** tab.
4. Click **Create option** or edit an existing option. 
5. Click **Security controls** in the left pane. If you are creating a new option, then you must specify a name and alias for the option and click **Next** to access the **Security controls** pane.

## Approval
{: #approval-controls}

If you want to control who can subscribe to your event endpoint, enable **Manual approval** in the [**Security controls**](#edit-controls) pane when you are creating or editing the option.

When an option is set up with approval enabled, a viewer must submit a request to subscribe to the option. The request includes a reason to justify the need for a subscription along with the requester's contact information. The option owner can then approve or reject the request as required.

The owner of an option that requires approval receives notifications in the {{site.data.reuse.eem_name}} UI when someone requests access to the events on the topic, and can then approve or reject the request.

When a request is approved, a notification is presented in the {{site.data.reuse.eem_name}} UI to the viewer about the approval, and the viewer can create a new subscription.

**Note:** A viewer can have only one request for a subscription to an option open at a time.


### Viewing approval requests for a specific event source
{: #viewing-requests-from-event-source}

To view approval requests for a specific event source, complete the following steps:

1. In the navigation pane, click **Manage > Topics**.
2. Find the event source that you want to work with in the list, and click the name of the event source.
3. Click the **Manage** tab.
4. Click **Requests** to see a list of all of the requests made against this event source.
5. For the request you want to review, click **View request**. An approval pop-up window appears. All the details about the request including the event source, option, contact details of the requester and the justification for the request are displayed.
6. Review the information that is provided and click **Approve** or **Reject** as required.

### Viewing all approval requests
{: #viewing-requests-from-option}

To view all your approval requests, complete the following steps:

1. In the navigation pane, click **Access**. The **Access requests** page is displayed.
2. All the requests against options that you own are displayed.
3. For the request you want to review, click **View request**. An approval pop-up window appears. All the details about the request including the event source, option, contact details of the requester, and the justification for the request are displayed.
4. Review the information that is provided and click **Approve** or **Reject** as required.


## Mutual TLS
{: #mtls}

If you want to control access to your event endpoint with mTLS, you can select an authentication set that includes mTLS when you are configuring the option. 

When an option is configured with mTLS authentication, a producer or consumer can connect to the gateway only if they present a valid client certificate.

To configure a security control to use mTLS authentication, you must provide details of valid client TLS certificates. Follow these steps to provide the requirements for the client certificate:

1. From the [**Security controls**](#edit-controls) pane, select an authentication set that includes mTLS, then click **Configure mutual TLS control**.
2. Specify the requirements for mTLS client certificates in the **Mutual TLS requirements** pane.

      Required properties:
        
      - **Trusted CA certificates.** Select the box to indicate which CA certificates are trusted: 
         * Certificates that you uploaded.
         * Certificates that are uploaded to your organization by admin users.
         * All uploaded certificates.
         
          If you do not select any box, then the control trusts only certificates that are signed by well-known external certificate authorities.
      - **Common name.** Common name can contain a single wildcard `*` at any position. For example, if **Common name** is set to `*-domainname`, then the control accepts client certificates with the common names of `c-domainname` or `andre-domainname`.

   Single wildcard `*` characters are accepted in all text fields.
           
3. In the **Identifying factor** pane, select the client properties that you want to uniquely identify the subscribers with..

     **Common name** is mandatory and cannot be cleared.

     **Important:** Every subscriber must present a unique common name. If the common name you specified in **Mutual TLS requirements** does not contain a wildcard character, then only a single client can subscribe to your mTLS control.


### Updating CA certificates
{: #mtls-updating-ca-certificates}

It is your responsibility to update the CA certificates before they expire. Follow the instructions in [managing CA certificates](../../security/cred-sets#config-mtls) to update your CA certificates.


## OAuth2
{: #oauth}

If you want to use an OAuth2 provider to authenticate a client, then specify a client authentication set that has OAuth2 control in the [**Security controls**](#edit-controls) pane.  

The details of the OAuth 2.0 provider are supplied by users with the admin role when defining an authentication set that has [OAuth 2.0 control configured](../../security/cred-sets#oauth).


## SASL credentials
{: #sasl}

If you want to use generated SASL credentials to authenticate event endpoint users, then select an authentication set that uses SASL credentials in the [**Security controls**](#edit-controls) pane. 

Unique SASL credentials are generated for each subscriber. No additional configuration is required.
