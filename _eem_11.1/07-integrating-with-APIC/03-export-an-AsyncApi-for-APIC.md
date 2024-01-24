---
title: "Exporting an AsyncAPI document for use in API Connect"
excerpt: "Find out how to export an AsyncAPI document for use in API Connect."
categories: integrating-with-apic
slug: export-asyncapi
toc: true
---

You can download an AsyncAPI document from your topics in {{site.data.reuse.eem_name}}, and then import this AsyncAPI into API Connect. After you imported the AsyncAPI document into API Connect, you can use the API Manager to socialize this event-driven API in the Developer Portal, enabling the management of events and APIs in one place.

Before you begin, ensure that you [configured](../configure-eem-for-apic) {{site.data.reuse.eem_name}} as an {{site.data.reuse.egw}} Service.

## Export an AsyncAPI from {{site.data.reuse.eem_name}}

To export an AsyncAPI for your topic, complete the following steps.

1. In the {{site.data.reuse.eem_name}} UI, go to the **Topics** page, and select the topic you want to export.
2. Click the **Options** tab, then click ![Export icon]({{ 'images' | relative_url }}/export.svg "The export icon."){:height="30px" width="15px"} **Export**. A dialog is displayed.
3. Select **For IBM API Connect (contains credentials)** as the export format, then click **Export**.

**Note**: You cannot export options that contain approval control to IBM API Connect. 

An AsyncAPI document that describes the topic is downloaded as a YAML file.

## Configure a Catalog in API Connect

See the [API Connect documentation](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=catalogs-creating-configuring){:target="_blank"} for steps on how to configure a Catalog. When selecting the gateway service to use with the Catalog, choose the {{site.data.reuse.egw}} Service that you created when you [configured ](../configure-eem-for-apic) {{site.data.reuse.eem_name}} as an {{site.data.reuse.egw}} Service.

## Import the AsyncAPI document

To import the AsyncAPI document, complete the following steps in the API Manager UI

1. In the navigation pane, click **Develop**, select the APIs tab, then click **Add > API**.
2. From the toggle menu at the top of the screen, select **AsyncAPI**.
3. Select **AsyncAPI from Event Endpoint Management** and click **Next**.
4. Upload the AsyncAPI you downloaded from {{site.data.reuse.eem_name}}. Leave the **Username** and **Password** fields empty, and then click **Next**.
5. Select the **Gateway** tab. Enter the bootstrap server address for your cluster under **Bootstrap Servers**, and then click **Next**. 

   **Note:** When adding the API for the first time, if the **Bootstrap Servers** field contains `${bootstrapServerAddress}`, connections to your Kafka cluster are automatically configured.
6. Select the **Activate API** checkbox, and choose your catalog to publish the API to in the **Target catalog** drop-down menu.
7. Click **Next** again to create the API.

## Publish the API and Product

See the [API Connect documentation](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=definitions-publishing-api){:target="_blank"} for information about how to publish an API and a Product. When publishing the Product, select the Catalog you [configured](#configure-a-catalog-in-api-connect) earlier.

## Create a subscription to the Product

In the [Developer Portal](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=developer-portal-socialize-your-apis){:target="_blank"} for the Catalog you created, [subscribe to the Product](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=portal-exploring-apis-products-in-developer){:target="_blank"}.


## Use subscription credentials to consume through the {{site.data.reuse.egw}} Service

Using the credentials that you retrieved from the Developer Portal, you can [configure a client application to consume from the topic](../../consume-subscribe/setting-your-application-to-consume).
