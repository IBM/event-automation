---
title: "Subscribing to event endpoints"
excerpt: "Subscribe to discovered event endpoints from the catalog in a self-service manner."
categories: subscribe
slug: subscribing-to-event-endpoints
toc: true
---

After you discover an event endpoint that is suitable for use with your application, you can subscribe to it in a self-service manner in the [Catalog](../discovering-event-endpoints#the-catalog).

## Creating a subscription

To subscribe to an event endpoint that is not configured with approval controls, complete the following steps.

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Catalog**.
1. Select an event endpoint from the list. 
1. Complete one of the following steps according to the version of your {{site.data.reuse.eem_name}} instance:
   
   - ![Event Endpoint Management 11.4.2 icon]({{ 'images' | relative_url }}/11.4.2plus.svg "In Event Endpoint Management 11.4.2 and later.") If you are using {{site.data.reuse.eem_name}} version 11.4.2 or later, select an event endpoint and then click **Subscribe**. 
   - If you are using {{site.data.reuse.eem_name}} 11.4.1 or earlier, click **Generate access credentials** in the **Topic information** view.
   
   **Note:** The **Generate access credentials** and **Subscribe** buttons are only available for event endpoints that are still accepting new subscriptions. The owner of the event endpoint controls if subscriptions are offered in the **Catalog**.

1. In the **Contact details** field, provide your contact details and then, depending on your version, click **Generate** or **Subscribe**.  

   **Note:** The contact information is a free text field, and the owners of the event endpoint can use the details to contact you. For example, owners might contact you if an event endpoint is deprecated or disabled for maintenance. Providing an email address is recommended.  
1. Complete one of the following steps according to the configuration of the event endpoint:
   
   * If the event endpoint is configured to require a `SASL` username and password, then the **Subscription created** pane is displayed and presents your subscription credentials. 
      
      - These credentials are a `SASL` username and password, which uniquely identifies you and your usage of this event endpoint. These credentials must be used when you access the event source through the Event Gateway.
      - Copy the generated username and password values, or click **Download credentials** to download your generated credentials as a JSON file for future use and reference.  
      - ![Event Endpoint Management 11.4.2 icon]({{ 'images' | relative_url }}/11.4.2plus.svg "In Event Endpoint Management 11.4.2 and later.") If you are using {{site.data.reuse.eem_name}} version 11.4.2 or later, click **Download properties** to download your generated credentials as a Java properties file. 
      
         **Important:** The credentials that are generated for you are shown one time. They cannot be retrieved later. Ensure that you save the access credentials and store them in a secure location.
      
      - Your application requires these credentials to [access the event source](../configure-your-application-to-connect) through the Event Gateway.

   * ![Event Endpoint Management 11.4.1 icon]({{ 'images' | relative_url }}/11.4.1plus.svg "In Event Endpoint Management 11.4.1 and later.") If the event endpoint is configured with an mTLS control, then to access the endpoint you must present a client certificate that meets the requirements of the mTLS control. 
      - Your client certificate must be signed by a well-known certificate authority. If your certificate is self-signed, then the CA certificate must be uploaded when the [mTLS control is created](../../describe/option-controls#mtls).
      - Your client certificate subject fields must meet the requirements of the mTLS control. Click the tooltip next to **mTLS requirements** to see these requirements. 
      - If the mTLS Control uses `SASL` credentials, then a username and password is generated for you.
      - If the mTLS Control is using Subject Identifying Fields, then when you click **Subscribe** you must provide the subject fields of your client certificate. The subject fields are used to identify you when you access the endpoint. You can upload a `.pem` file of your client certificate to autofill these fields. The certificate subject field values that you provide must be unique, you cannot use the same client certificate in multiple subscriptions.  
      <!-- cert validation is also done, but not mentioning it here since it's secondary and not available to mTLS control with SASL creds. We're also implying uniqueness and not mentioning here that it's possible that multiple users could have matching identifying fields if Kevin configures it so. -->  

## Requesting access to an event endpoint
{: #requesting_access}

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

After you create a subscription, you can access the event endpoint that you subscribed to through the Event Gateway. [The Catalog](../discovering-event-endpoints#the-catalog) contains sample code and connection information to help you [configure your application to connect to an event endpoint](../configure-your-application-to-connect).

You can also [view the event endpoints](../managing-subscriptions) that you have access to, and remove any subscriptions you no longer require.

