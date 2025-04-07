---
title: "Getting started with Event Endpoint Management"
excerpt: "Log in to your Event Endpoint Management installation."
categories: getting-started
slug: getting-started
toc: true
---

{{site.data.reuse.eem_name}} provides the capability to describe and catalog your Kafka topics as [event sources](../../about/key-concepts#event-source), and to grant access to application developers within your organization. Application developers can discover [event endpoints](../../about/key-concepts#event-endpoint) and configure their applications to access them through the {{site.data.reuse.egw}}. With {{site.data.reuse.eem_name}}, you can control access to your event endpoints, and what data they produce or consume.


## Before you begin
{: #before-you-begin}

To use {{site.data.reuse.eem_name}} on {{site.data.reuse.ipaas_name}}, you must have {{site.data.reuse.eem_name}} provisioned in the {{site.data.reuse.ipaas_name}} environment, and have a user with access to the {{site.data.keyword.eem_name}} UI. For more information about provisioning {{site.data.reuse.eem_name}} in {{site.data.reuse.ipaas_name}} and configuring users, see the [{{site.data.reuse.ipaas_name}} documentation](https://www.ibm.com/docs/SSC74RW_saas/ipaas/ipaas_getting_started_administrators.html){:target="_blank"}.

**Tip:** For an example of how to get up and running with {{site.data.reuse.eem_name}}, you can follow the [getting started tutorial]({{ 'tutorials/getting-started-eem' | relative_url }}).


## Add {{site.data.reuse.egw}}s
{: #add-gateways}

{{site.data.reuse.egw}}s are added to {{site.data.reuse.eem_name}} by deploying them with a configuration that points to your {{site.data.reuse.eem_manager}}. When the gateway is deployed, it registers itself with the {{site.data.reuse.eem_manager}} that is specified in its configuration. Use the {{site.data.reuse.eem_name}} UI to generate the configuration properties for your gateway. The following methods are available to deploy your {{site.data.reuse.egw}}s:

- Docker container. The {{site.data.reuse.eem_name}} UI generates a Docker command to start an {{site.data.reuse.egw}} that contains the necessary arguments to register the gateway with your {{site.data.reuse.eem_manager}}.
- Kubernetes Deployment. The {{site.data.reuse.eem_name}} UI generates the YAML contents for a Kubernetes Deployment that runs the {{site.data.reuse.egw}}. 

The difference between these deployment types is that a Kubernetes Deployment monitors and manages the {{site.data.reuse.egw}} pod, restarting it if necessary. A gateway deployed directly as a Docker container must be monitored manually. 

1. In the navigation pane, click **Administration > Event Gateways**.
2. Click **Add gateway**.
3. Select the **Docker** or **Kubernetes Deployment** tile, according to your preferred gateway deployment method, then click **Next**.
4. Provide the configuration details for your gateway, then click **Next**.

   - **Gateway group**: Create or specify an existing [gateway group](../../about/key-concepts/gateway-group) for your new gateway.
   - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group.
   - **Replicas**: The number of Kubernetes replicas of the gateway pod to create. Not applicable to Docker gateway.
   - **Server URL**: The address of your new gateway that [client applications](../../subscribe/configure-your-application-to-connect) use to access event endpoints through the gateway.

   To configure TLS communication between client applications and the gateway, you must upload the following certificate files:

   - **Gateway private key**: PEM file that contains the private key that is used to encrypt client application connections to your new gateway. The private key must be created with the gateway address in the SAN.
   - **Gateway certificate**: PEM file that contains the public certificate that is used to encrypt client application connections to your new gateway. The certificate must be created with the gateway address in the SAN.
   - **CA certificate**: PEM file that contains the CA certificate that client applications must add to their truststores for secure communication with your new gateway. This CA certificate must be an ancestor of the Gateway certificate.

   **Note:** Uploading the TLS certificates is optional, but if not done then the generated Docker command or YAML file contains placeholders for these certificates. Replace the placeholders with the actual certificates when you deploy the gateway.  

5. Use the generated Docker command or Kubernetes Deployment YAML to deploy the {{site.data.reuse.egw}} in your environment. 
6. Return to the **Event Gateways** page to monitor the status of the new {{site.data.reuse.egw}}. When the gateway is registered, the status reports **Running**.

For more information about adding and managing gateways, see [Adding {{site.data.reuse.egw}}s](../../admin/event-gateways).


## Connect to a Kafka cluster
{: #connect-kafka}

1. In the navigation pane, click **Manage clusters**.
2. Click **Add cluster**.
3. In the **Add cluster** window, provide a unique name for the cluster in the **Cluster name** field, then click **Next**. 
4. Enter a bootstrap server URL for the Kafka cluster. 
5. Optional: You can click **Add URL**, and add one or more additional bootstrap servers, then click **Next**.

    **Note**: After you click **Next**, {{site.data.reuse.eem_name}} validates the entered bootstrap server URLs. While validating, if any untrusted certificates are found on the bootstrap server URLs, you are asked to confirm whether you accept the certificates found. If you do, select the **Accept all certificates** checkbox, and click **Next**.

6. Optional: If a **No connection** warning message is displayed, follow the steps to [add your server manually](../../admin/managing-clusters/#manual-cluster).
7. Optional: If the Kafka endpoint is configured to require mutual TLS authentication, then you must upload the private and public keys that were provided to you by your Kafka Cluster Administrator. Upload the private and public keys in PEM format.  
8. If the entered bootstrap server URLs require SASL credentials to authenticate with Kafka, you are prompted to provide credential details. If required, select the **Security protocol**, and enter your username and password.
9. Click **Add cluster**. 

{{site.data.reuse.eem_name}} validates whether the entered credentials are valid to connect to the cluster. If valid, or if credentials were not required, your cluster is added to {{site.data.reuse.eem_name}}, and you are returned to the **Manage clusters** page, where your new cluster appears, and can be edited.

<!-- **Draft comment**: We need to add the instructions about adding a topic and option after this section. OR, we replace this section with the instructions to Add a topic because it also includes connecting to a Kafka Cluster. 

Adding this comment so it's not forgotten. -->

{{site.data.reuse.eem_name}} validates whether the entered credentials are valid to connect to the cluster. If valid, or if credentials were not required, your cluster is added to {{site.data.reuse.eem_name}}, and you are returned to the **Manage clusters** page, where your new cluster appears, and can be edited.


## Publish an event endpoint
{: #publish-event-endpoint}

1. In the navigation pane, click **Manage topics**. A list of event sources is displayed.
2. Select the event source that you want to publish an option from.
3. Click the **Options** tab.
4. For the option that you want to publish, click **Publish**.
5. In the **Publish option** dialog, select a gateway group from the available options.
6. Click **Publish**.
7. To cancel changes, click **Cancel**.

## Consume event endpoints
{: #consume-event-endpoint}

1. In the navigation pane, click **Catalog**.
2. Select an event endpoint from the list.
3. Select an event endpoint and then click **Subscribe**. 
   **Note:** The **Subscribe** button is only available for event endpoints that are still accepting new subscriptions. The owner of the event endpoint controls if subscriptions are offered in the **Catalog**.
4. In the **Contact details** field, provide your contact details and then click **Generate**.  
   **Note:** The contact information is a free text field, and the owners of the event endpoint can use the details to contact you. For example, if an event endpoint is deprecated or disabled for maintenance. Providing an email address is recommended.  
5. Complete one of the following steps according to the configuration of the event endpoint:  
* If the event endpoint is configured to require a `SASL` username and password, then the **Access credentials** pane is displayed and presents your subscription credentials. 

    - These credentials are a `SASL` username and password, which uniquely identifies you and your usage of this event endpoint. These credentials must be used when you access the event source through the {{site.data.reuse.egw}}.  
    - Copy the generated username and password values, or click **Download credentials** to download your generated credentials as a JSON file for future use and reference.  
    **Important:** The credentials that are generated for you are shown one time. They cannot be retrieved later. Ensure that you save the access credentials and store them in a secure location.
    - Your application requires these credentials to [access the event source](../../subscribe/configure-your-application-to-connect) through the {{site.data.reuse.egw}}.
* If the event endpoint is configured with an mTLS control, then to access the endpoint you must present a client certificate that meets the requirements of the mTLS control. 
   - Your client certificate must be signed by a well-known certificate authority. If your certificate is self-signed, then the CA certificate must be uploaded when the [mTLS control is created](../../describe/option-controls#mtls).
   - Your client certificate subject fields must meet the requirements of the mTLS control. Click the tooltip next to **mTLS requirements** to see these requirements. 
   - If the mTLS Control uses `SASL` credentials, then a username and password is generated for you.
   - If the mTLS Control is using Subject Identifying Fields, then when you click **Subscribe** you must provide the subject fields of your client certificate. The subject fields are used to identify you when you access the endpoint. You can upload a `.pem` file of your client certificate to autofill these fields. The certificate subject field values that you provide must be unique, you cannot use the same client certificate in multiple subscriptions.  
   <!-- cert validation is also done, but not mentioning it here since it's secondary and not available to mTLS control with SASL creds. We're also implying uniqueness and not mentioning here that it's possible that multiple users could have matching identifying fields if Kevin configures it so. -->  

