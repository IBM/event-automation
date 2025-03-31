---
title: "Getting started with Event Endpoint Management"
description: "Get up and running with Event Endpoint Management by describing your topics as event sources, and making them available to others as event endpoints."
permalink: /tutorials/getting-started-eem/
toc: true
section: "Tutorials for Event Endpoint Management"
cardType: "large"
---

After creating an {{site.data.reuse.eem_name}} service, set up an {{site.data.reuse.egw}} to connect your service with your Kafka cluster. You can then describe topics from that cluster as event sources, adding them to the {{site.data.reuse.eem_name}} catalog, and making them available to share as event endpoints through options.

Follow the steps in this guide to get your topics described in {{site.data.reuse.egw}} and make them available to others in your organization.

## Before you begin
{: #before-you-begin}

<!--
- Ensure you have created an [{{site.data.reuse.eem_name}} service](https://ibm.com/docs/en/hybrid-ipaas/saas?topic=started-getting-administrators){:target="_blank"}.-->
- Ensure you have a host with [Docker installed](https://docs.docker.com/get-started/){:target="_blank"} for deploying an {{site.data.reuse.egw}}.
- Ensure you have the connection details for your Kafka cluster available.
- Ensure you have at least one Kafka topic.

**Note:** Don't have a Kafka cluster or Docker? We’re working on a trial experience that doesn’t require your own Kafka cluster or Docker platform. [Let us know](https://forms.office.com/r/7rb3www0NF){:target="_blank"} if you want to be notified when this is available.

## Add an {{site.data.reuse.egw}}
{: #add-a-gateway}

Set up an {{site.data.reuse.egw}} to manage the connection and access control between your Kafka cluster and your {{site.data.reuse.eem_manager}} component within {{site.data.reuse.eem_name}}. The gateway handles access to the event endpoints through which others can access the data available on the topics.

The {{site.data.reuse.eem_name}} UI helps you create a configuration file for deploying the gateway. For this getting started, the UI guides you through creating a configuration file for a Docker image that can be used to install a gateway on a host where you have a Docker engine running. Use the image to start an {{site.data.reuse.egw}} that contains the required settings to register the gateway with your {{site.data.reuse.eem_manager}}.

To add an {{site.data.reuse.egw}}:

1. In the navigation pane, click **Administration > Event Gateways**.
2. Click **Add gateway**.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/event-gateways-saas.png "Screenshot of the Event Gateways page in Event Endpoint Management."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/event-gateways-saas.png "Screenshot of the Event Gateways page in Event Endpoint Management.")

3. Select the **Docker** tile, then click **Next**.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-add-gateway-saas.png "Screenshot of add new Event Gateway page with Docker container selected."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-add-gateway-saas.png "Screenshot of add new Event Gateway page with Docker container selected.")

4. Provide the configuration details for your gateway, then click **Create**.
   
   - **Gateway group**: Create a gateway group for your new gateway. An {{site.data.reuse.egw}} group is a set of gateway instances that can be logically grouped and scaled together. For this example, you could simply create a test group and call it `gateway.group.1`
   - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group. For example, `my.test.gateway`
   - **Server URL**: The address of your new gateway that client applications will use to access event endpoints through the gateway.
   
   To configure TLS communication between client applications and the gateway, upload the following certificate files:
   
   - **Gateway private key**: PEM file that contains the private key that is used to encrypt client application connections to your new gateway. The private key must be created with the gateway address in the SAN.
   - **Gateway certificate**: PEM file that contains the public certificate that is used to encrypt client application connections to your new gateway. The certificate must be created with the gateway address in the SAN.
   - **CA certificate**: PEM file that contains the CA certificate that client applications must add to their truststores for secure communication with your new gateway. This CA certificate must be an ancestor of the Gateway certificate.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-config-gateway-docker.png "Screenshot of create an Event Gateway as a Docker container page showing some example configuration options."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-config-gateway-docker.png "Screenshot of create an Event Gateway as a Docker container page showing some example configuration options.")

5. Copy the generated command and run it in your Docker environment to deploy the {{site.data.reuse.egw}}. For example:
   
   ```shell
   docker run \
   -e backendURL="<provide-gateway-url>" \
   -e KAFKA_ADVERTISED_LISTENER="<provide-gateway-advertised-listener-addresses>" \
   -e BACKEND_CA_CERTIFICATES="-----BEGIN CERTIFICATE-----\nMIID..." \
   -e GATEWAY_PORT=8443 \
   -p 8443:8443 \
   -e API_KEY="36e88938-fb08-401b-ab89-191ea9b30503" \
   -e LICENSE_ID="L-AUKS-FKVXVL" \
   -e ACCEPT_LICENSE="false" \
   -d us.icr.io/ea-dev/stable/eem/ibm-eventendpointmanagement/egw@sha256:0887f587bc6c56126eb824c860c03867e7ead207198c2cd8ba9d3878d26acca0
   ```

6. Return to the **Event Gateways** page to monitor the status of the new event gateway. When the gateway is registered, the status reports **Running**.

## Add a topic
{: #add-topic}

Add a topic to Event Endpoint Management to make it available to others as an event source. In this guide, you are adding a topic to consume events from. 

To add a topic:

1. In the navigation pane, click **Manage topics**.
2. Click **Add topic**.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-manage-topics.png "Screenshot of the Manage topics page in Event Endpoint Management."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-manage-topics.png "Screenshot of the manage topics page in Event Endpoint Management.")

3. In the **Interaction** pane, select how your application will interact with the event source. Click **Consume events** and click **Next**.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-add-topic-consume.png "Screenshot of the Interaction pane in the Add topic page in Event Endpoint Management."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-add-topic-consume.png "Screenshot of the Interaction pane in the Add topic page in Event Endpoint Management.")

4. Enter a unique name for your new cluster, and click **Next**.
5. Enter the bootstrap server URL for your Kafka cluster, and click **Next**.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-add-cluster-server.png "Screenshot of the Server pane in the Add cluster page in Event Endpoint Management."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-add-cluster-server.png "Screenshot of the Server pane in the Add cluster page in Event Endpoint Management.")

   **Note**: After you click **Next**, {{site.data.reuse.eem_name}} validates the entered server URL. While validating, if any untrusted certificates are found on the bootstrap server URLs, you are asked to confirm whether you accept the certificates found. If you do, select the **Accept all certificates** checkbox, and click **Next**.

6. Optional: If the Kafka endpoint is configured to require mutual TLS authentication, then you must upload the private and public keys (ask your Kafka cluster administrator if you do not have them). Upload the private and public keys in PEM format.
7. Optional: If the entered bootstrap server URLs require SASL credentials to authenticate with Kafka, you are prompted to provide credential details. If required, select the **Security protocol**, and enter your username and password.
9. Click **Next**. 
1. Select a topic to add from the list of topics available on this cluster.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-add-topic-selection.png "Screenshot of the Topic selection pane in the Add topic page in Event Endpoint Management."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-add-topic-selection.png "Screenshot of the Topic selection pane in the Add topic page in Event Endpoint Management.")

   <!--If no topics are displayed on the **Topic selection** page, you can define provisional topics by updating the **Topic** and **Event source name** fields in the table. To add more provisional topics, click **Define topic**.
   **Note**: When you define a topic, it registers the topic with the {{site.data.reuse.eem_manager}} but does not create the topic on the Kafka cluster.-->

1. Optional: If a name is not added by default, enter a unique event source name for the topic selected.

   **Note**: The event source name is the unique ID that identifies your topics.
      
1. Click **Add Topic**.

**Note**: If any of the event source names that you entered are already in use, an error message is displayed to indicate that there is a conflict and it failed to add the topic. Otherwise, your new topics are added to {{site.data.reuse.eem_name}}.

Your new event source appears in the **Manage topics** page with the **Options status** as 0 published. You can now [create an option for your event source](#create-and-publish-an-option).

## Create and publish an option
{: #create-and-publish-an-option}

Create an option for the event source to control how users can access it. For example, you can set a control to determine who can subscribe to an event source by forcing users to request access. You can then approve or reject requests. When an option with controls is published, it becomes available to users to as an event endpoint to which they can request access to.

To create an option with approval control:

1. In the navigation pane, click **Manage topics**.
1. Click the event source that you added earlier. This is the topic you [added earlier](#add-topic) by describing it as an event source. 
1. Click the **Options** tab.
1. Click **Create option**. The **Details** pane is displayed.
1. In the **Option name** field, provide a name for your option. For example, `Subscribers`.
1. In the **Alias** field, provide the Kafka topic name. This is the name of the topic you added earlier, for example, `build.14`.
1. Optional: In the **Description** field, provide a description of your option. For example, `Subscribers to topic build.14`.
1. Click **Next**. The **Controls** pane is displayed.
1. Click **Add control**. Select **Approval** and click **Add control**.
1. Click **Save**. Your new option is displayed.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-saved-new-subscribers-option.png "Screenshot of the Subscribers option with approval control."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-saved-new-subscribers-option.png "Screenshot of the Subscribers option with approval control.")

1. To publish the option with approval control you just created, and make the event endpoint available to subscribe to, click click **Publish** on the tile for the option.
5. In the **Publish option** dialog, select the gateway group you [added your gateway to earlier](#add-a-gateway).
6. Click **Publish**. 

After the option is published, application developers can discover the corresponding event endpoint in the {{site.data.reuse.eem_name}} catalog, and [consume from it](#consume-event-endpoint).

## Consume from the event endpoint
{: #consume-event-endpoint}

The option you published for the event endpoint has an approval control you set up earlier. This means that application developers can now go to the catalog, find the event endpoint, and subscribe to it for access. After you grant access, they can configure their application to consume from the topic through the event endpoint by using standard Kafka client configuration settings.

Pretend you are now an application developer. To consume events from the topic you described and added an event endpoint for:

1. In the navigation pane, click **Catalog**.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog-tutorial.png "Screenshot of the Catalog page."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-catalog-tutorial.png "Screenshot of the Catalog page.")

2. Locate the event endpoint in the list (for example, `build.14`), and click the name. The **Topic information** page is displayed.
   
   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/eem-topic-information.png "Screenshot of the Topic information page."){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/eem-topic-information.png "Screenshot of the Topic information page.")

3. Click **Request access**, and fill in the form.

After access is granted, you can use the information on this page to configure your client to consume from the topic. The {{site.data.reuse.eem_name}} UI provides help with this on the **Topic information** page by providing useful details such as event endpoint server URLs, and code samples in different languages to add to your client's configuration.

For a simple test, you could try consuming from the topic by using an open-source command-line tool, for example, [kcat](https://github.com/edenhill/kcat){:target="_blank"}.

The way that you provide the configuration settings to your client varies from client to client. However, the following settings are common for every client:

- `Bootstrap servers`: The set of {{site.data.reuse.egw}} server addresses that provide access to an event endpoint is available on the **Topic information** page under **Selected event endpoint server URLs** as mentioned earlier.
- `Security mechanism`: Set as `SASL_SSL` if username and password are used in the subscription. Set as `SSL` if mTLS is used without a username and password.
- `SSL configuration`: The {{site.data.reuse.egw}} exposes only a TLS-secured endpoint for clients to connect to. For each **Selected event endpoint server URLs**, the server certificate can be downloaded in PEM format from the **Topic information** page. Configure your client to trust this certificate.
- `SASL` credentials : If `SASL_SSL` is specified as the `SASL mechanism`, then set `SASL username`, and `SASL password` with the values retrieved when you subscribed to the event source.
- `Topic name`: The name of the event endpoint you want your application to use. The name is displayed in the **Catalog** table under the **Name** column and as the heading of the **Topic information** page when you click the name.