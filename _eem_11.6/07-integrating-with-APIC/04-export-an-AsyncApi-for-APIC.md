---
title: "Generating an AsyncAPI document for use in API Connect"
excerpt: "Find out how to generate an AsyncAPI document for use in API Connect."
categories: integrating-with-apic
slug: generate-asyncapi
toc: true
---

You can generate an AsyncAPI document from your published [event endpoints](../apic-eem-concepts/#api) in {{site.data.reuse.eem_name}}, and then import this AsyncAPI into {{site.data.reuse.apic_long}}. After you imported the AsyncAPI document into {{site.data.reuse.apic_short}}, you can use the API Manager to socialize this event-driven API in the Developer Portal, enabling the management of events and APIs in one place.

Before you begin, ensure that you [configure](../configure-eem-for-apic) your {{site.data.reuse.eem_manager}} as an {{site.data.reuse.egw}} Service.

## Generating an AsyncAPI document for use in {{site.data.reuse.apic_long}} 10.0.8 and later

In {{site.data.reuse.apic_long}} 10.0.8 or later, you can generate and import a new AsyncAPI document from a configured {{site.data.reuse.eem_name}} instance into {{site.data.reuse.apic_short}} in a single step. Each AsyncAPI maps to a [published event endpoint](../apic-eem-concepts/#api) in {{site.data.reuse.eem_name}}.

### Configure a Catalog in {{site.data.reuse.apic_short}}

See the [{{site.data.reuse.apic_short}} documentation](https://www.ibm.com/docs/en/api-connect/10.0.8?topic=catalogs-creating-configuring){:target="_blank"} for steps about how to configure a Catalog. When selecting the gateway service to use with the Catalog, choose the {{site.data.reuse.egw}} Service that you created when you [configured](../configure-eem-for-apic) {{site.data.reuse.eem_manager}} as an {{site.data.reuse.egw}} Service.

### Generate and import a new AsyncAPI from {{site.data.reuse.eem_name}} into {{site.data.reuse.apic_long}}

To import the AsyncAPI document into {{site.data.reuse.apic_long}}, complete the following steps in the API Manager UI.

1. In the navigation pane, click **Develop**, select the APIs tab, then click **Add > API**.
2. From the toggle menu at the top of the screen, select **AsyncAPI**.
   **Note:** If you do not see the **AsyncAPI** option, register your {{site.data.reuse.egw}} Service in the sandbox catalog settings by using the API Manager **Catalog** page.
3. Select the AsyncAPI from your {{site.data.reuse.egw}} Service that you want to import, and click **Next**.
4. The AsyncAPI definition is generated and created in {{site.data.reuse.apic_short}}. Click **Done** to complete the flow.

**Note:** You cannot import AsyncAPI documents into {{site.data.reuse.apic_short}} from {{site.data.reuse.eem_name}} where the published event endpoint has an [approval control](../apic-eem-concepts/#policy) applied. 

### Publish the API and Product

See the [{{site.data.reuse.apic_short}} documentation](https://www.ibm.com/docs/en/api-connect/10.0.8?topic=definitions-publishing-api){:target="_blank"} for information about how to publish an API and a Product. When publishing the Product, select the Catalog you [configured](#configure-a-catalog-in-api-connect) earlier.

### Create a subscription to the Product

In the [Developer Portal](https://www.ibm.com/docs/en/api-connect/10.0.8?topic=developer-portal-socialize-your-apis){:target="_blank"} for the Catalog you created, [subscribe to the Product](https://www.ibm.com/docs/en/api-connect/10.0.8?topic=portal-exploring-apis-products-in-developer){:target="_blank"}.

### Use subscription credentials to consume through the {{site.data.reuse.egw}} Service

Using the credentials that you retrieved from the Developer Portal, you can [configure a client application to consume from the topic](../../subscribe/configure-your-application-to-connect).

## Generating an AsyncAPI document for use in {{site.data.reuse.apic_long}} 10.0.6 and 10.0.7

### Configure a Catalog in {{site.data.reuse.apic_short}}

See the [{{site.data.reuse.apic_short}} documentation](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=catalogs-creating-configuring){:target="_blank"} for steps about how to configure a Catalog. When selecting the gateway service to use with the Catalog, choose the {{site.data.reuse.egw}} Service that you created when you [configured](../configure-eem-for-apic) your {{site.data.reuse.eem_manager}} as an {{site.data.reuse.egw}} Service.

### Export an AsyncAPI from {{site.data.reuse.eem_name}}

To export an AsyncAPI for your topic, complete the following steps.

1. In the {{site.data.reuse.eem_name}} UI, go to the **Manage topics** page, and select the topic that you want to export.
1. Click the **Options** tab.
1. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** on the option that you want to use in {{site.data.reuse.apic_short}}.
1. Click **Export AsyncAPI**. A dialog is displayed. 
1. Select **For IBM API Connect (contains credentials)** as the export format, then click **Export**.

**Note:** You cannot export options that contain approval control to {{site.data.reuse.apic_short}}. 

An AsyncAPI document that describes the topic is downloaded as a YAML file.

### Configure a Catalog in {{site.data.reuse.apic_short}}

See the [{{site.data.reuse.apic_short}} documentation](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=catalogs-creating-configuring){:target="_blank"} for steps about how to configure a Catalog. When selecting the gateway service to use with the Catalog, choose the {{site.data.reuse.egw}} Service that you created when you [configured](../configure-eem-for-apic) your {{site.data.reuse.eem_manager}} as an {{site.data.reuse.egw}} Service.

### Import by using existing definition of AsyncAPI from {{site.data.reuse.eem_name}} into {{site.data.reuse.apic_long}}

To import the AsyncAPI document, complete the following steps in the API Manager UI.

1. In the navigation pane, click **Develop**, select the APIs tab, then click **Add > API**.
2. From the toggle menu at the top of the screen, select **AsyncAPI**.
   **Note:** If you do not see the AsyncAPI option, register your {{site.data.reuse.egw}} Service in the sandbox catalog settings by using the API Manager **Catalog** page.
3. Select **AsyncAPI from Event Endpoint Management** and click **Next**.
4. Upload the AsyncAPI you downloaded from {{site.data.reuse.eem_name}}. Leave the **Username** and **Password** fields empty, and then click **Next**.
5. Select the **Gateway** tab. Enter the bootstrap server address for your cluster under **Bootstrap Servers**, and then click **Next**. 

   **Note:** When adding the API for the first time, if the **Bootstrap Servers** field contains `${bootstrapServerAddress}`, connections to your Kafka cluster are automatically configured.
6. Select the **Activate API** checkbox, and choose your catalog to publish the API to in the **Target catalog** drop-down menu.
7. Click **Next** again to create the API.

### Publish the API and Product

See the [{{site.data.reuse.apic_short}} documentation](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=definitions-publishing-api){:target="_blank"} for information about how to publish an API and a Product. When publishing the Product, select the Catalog you [configured](#configure-a-catalog-in-api-connect) earlier.

### Create a subscription to the Product

In the [Developer Portal](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=developer-portal-socialize-your-apis){:target="_blank"} for the Catalog you created, [subscribe to the Product](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=portal-exploring-apis-products-in-developer){:target="_blank"}.

### Use subscription credentials to consume through the {{site.data.reuse.egw}} Service

Using the credentials that you retrieved from the Developer Portal, you can [configure a client application to consume from the topic](../../subscribe/configure-your-application-to-connect).
