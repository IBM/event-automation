---

title: "Discovering event endpoints"
excerpt: Use the {{site.data.reuse.eem_name}} Catalog to discover information about the available event sources and the event data they provide, so that you can choose the ones you want to use in your applications and flows."
categories: subscribe
slug: discovering-event-endpoints
toc: true
---

In the {{site.data.reuse.eem_name}} catalog, you can browse and discover information about the event endpoints available in your organization. When you log in to {{site.data.reuse.eem_name}}, the Event Catalog is your landing page in the {{site.data.reuse.eem_name}} UI.

## The Catalog
{: #the-catalog}

All event endpoints are available in the {{site.data.reuse.eem_name}} UI home page (**Catalog**) and you can use the catalog to find out more about what each event endpoint is used for by clicking the event endpoint name.

The information that is documented for each event endpoint can include the following detail:
- A description of the event data that is available from the endpoint.
- Tags that describe the content of the event source through keywords.
- The number of replicas and partitions a topic has. This information is useful for Kafka application developers planning how their application can consume from the event endpoint.
- Contact information that event source owners can use to communicate with developers responsible for consuming applications.
- Schema details if the event endpoint uses one. Schemas define the structure of the data in a message to ensure that the correct and expected structure is used.
- Sample messages to show what information the event source holds.
- A [**Code accelerator**](#code-accelerator-samples) section that provides sample Java, [Node.JS](https://nodejs.org/){:target="_blank"}, and [kcat](https://github.com/edenhill/kcat){:target="_blank"} client template code.

Access to the event data from event endpoints (topics) is granted by subscribing to each event endpoint, and connecting to the event endpoint through the {{site.data.reuse.egw}}. For more information, see how you can [subscribe to event endpoints](../subscribing-to-event-endpoints).

### Searching the Catalog
{: #searching-the-catalog}

You can search for a specific event endpoint within the catalog by clicking the **Search** icon ![Search icon]({{ 'images' | relative_url }}/search.svg "Search icon."){:height="30px" width="15px"} and typing a query. If your query is matched with a word or consecutive words from the following fields, the matched content is returned in the catalog:

- Event endpoint alias
- Event endpoint name
- Description
- Tags
- Contact information
- Schema content
- Schema description
- Sample messages

Partial matches that start with the same consecutive characters as an event endpoint alias or name are also returned.

## Exporting event endpoint details
{: #exporting-event-endpoint-details}

To export an event endpoint as an AsyncAPI document, complete the following steps:

1. In the catalog, select the event endpoint that you want to work with. A new window is displayed with more information about the event endpoint.
1. Select the event endpoint that you want to export.
1. Click **Export AsyncAPI**.
1. Select the version of the AsyncAPI specification to use when exporting the document.
1. Click **Export**.

The event endpoint details are downloaded and saved to your computer. The AsyncAPI document contains the same information about the event endpoint as presented in the Catalog, and can be used in downstream tools to generate code snippets or socialize the event endpoint further.

## Code accelerator samples
{: #code-accelerator-samples}

Expand the **Code accelerator** section to access sample Java, [Node.JS](https://nodejs.org/){:target="_blank"}, and [kcat](https://github.com/edenhill/kcat){:target="_blank"} client template code.

Update the template code with your client credentials to verify access to your event sources. For more information about configuring a client application to consume from a selected event source, see information about how to [set up your applications to consume event data](../configure-your-application-to-connect).
