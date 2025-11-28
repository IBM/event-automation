---
title: "Subscribing to event endpoints"
excerpt: "Subscribe to discovered event endpoints from the catalog in a self-service manner."
categories: subscribe
slug: subscribing-to-event-endpoints
toc: true
---

After you discover an event endpoint that is suitable for use with your application, you can subscribe to it in a self-service manner in the [Catalog](../discovering-event-endpoints#the-catalog).

## Creating a subscription
{: #creating-a-subscription}

To subscribe to an event endpoint that is not configured with approval controls, complete the following steps.

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Catalog**.
3. Select an event endpoint from the list. 
4. Select an event endpoint and then click **Subscribe**. The **Create subscription** window is displayed.
   
   **Note:** The **Subscribe** button is only available for event endpoints that are still accepting new subscriptions. The owner of the event endpoint controls if subscriptions are offered in the **Catalog**.

5. In the **Contact details** field, provide your contact details, and then click **Next**.  

   **Note:** The contact information is a free text field, and the owners of the event endpoint can use the details to contact you. For example, owners might contact you if an event endpoint is deprecated or disabled for maintenance. Providing an email address is recommended.  
6. Complete one of the following steps according to the configuration of the event endpoint:
   
   * If the event endpoint is configured to require a `SASL` username and password, then the **Subscription created** pane is displayed and presents your subscription credentials. 
      
      - These credentials are a `SASL` username and password, which uniquely identifies you and your usage of this event endpoint. These credentials must be used when you access the event source through the {{site.data.reuse.egw}}.
      - Copy the generated username and password values, or click **Download credentials** to download your generated credentials as a JSON file for future use and reference.  
      - Click **Download properties** to download your generated credentials as a Java properties file. 
      
         **Important:** The credentials that are generated for you are shown one time. They cannot be retrieved later. Ensure that you save the access credentials and store them in a secure location.
      
      - Your application requires these credentials to [access the event source](../configure-your-application-to-connect) through the {{site.data.reuse.egw}}.

   * If the event endpoint is configured with an mTLS control, then to access the endpoint you must present a client certificate that meets the requirements of the mTLS control. 
      - Your client certificate must be signed by a well-known certificate authority. If your certificate is self-signed, then the CA certificate must be uploaded when the [mTLS control is created](../../describe/option-controls#mtls).
      - Your client certificate subject fields must meet the requirements of the mTLS control. Click the tooltip next to **mTLS requirements** to see these requirements. 
      - If the mTLS Control uses `SASL` credentials, then a username and password is generated for you.
      - If the mTLS Control is using Subject Identifying Fields, then when you click **Subscribe** you must provide the subject fields of your client certificate. The subject fields are used to identify you when you access the endpoint. You can upload a `.pem` file of your client certificate to autofill these fields. The certificate subject field values that you provide must be unique, you cannot use the same client certificate in multiple subscriptions.  
      <!-- cert validation is also done, but not mentioning it here since it's secondary and not available to mTLS control with SASL creds. We're also implying uniqueness and not mentioning here that it's possible that multiple users could have matching identifying fields if Kevin configures it so. -->  


## Requesting access to an event endpoint
{: #requesting-access}

If an event endpoint is configured with approval controls, you need to create a request for permission to subscribe to that event endpoint.

To create a request to subscribe to an event endpoint that has an approval control, complete the following steps.

1. In the catalog, select the event endpoint that you want to work with.
2. Select the event endpoint that you want to subscribe to.
3. Click **Request Access**. The **Request access** window is displayed.
4. In the **Contact** field, provide a contact name.
5. In the **Justification** field, provide a description to explain why you want this subscription.
6. Click **Request**.

The owner of the event endpoint reviews your request.

**Note:** You can have only one request for a subscription open at a time against an event endpoint. If **Request access** is disabled, a request for that event endpoint is pending a review by the owner.

## Access approvals and rejections
{: #approvals_rejections}

### Approved requests
{: #approved_requests}

If your request is approved, the **Request access** button changes to **Subscribe** and you can then proceed to [subscribe](../subscribing-to-event-endpoints) to the endpoint by following the usual process.

### Rejected requests
{: #rejected_requests}

If your request is rejected, then **Request access** is reset and you can submit a new request.


## Next steps
{: #next-steps}

After you create a subscription, you can access the event endpoint that you subscribed to through the {{site.data.reuse.egw}}. [The Catalog](../discovering-event-endpoints#the-catalog) contains sample code and connection information to help you [configure your application to connect to an event endpoint](../configure-your-application-to-connect).

You can also [view the event endpoints](../managing-subscriptions) that you have access to, and remove any subscriptions you no longer require.

