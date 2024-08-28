---

title: "Discovering event endpoints"
excerpt: Use the Event Endpoint Management Catalog to discover information about the available event sources and the event data they provide, so that you can choose the ones you want to use in your applications and flows."
categories: subscribe
slug: discovering-event-endpoints
toc: true
---

In the {{site.data.reuse.eem_name}} catalog, you can browse and discover information about the event endpoints available in your organization. When you log in to {{site.data.reuse.eem_name}}, the Event Catalog is your landing page in the {{site.data.reuse.eem_name}} UI.

## The Catalog

All event endpoints are available in the {{site.data.reuse.eem_name}} UI homepage (**Catalog**) and you can use the catalog to find out more about what each event endpoint is used for by clicking the event endpoint name.

The information documented for each event endpoint can include the following detail:
- A free form description about the event data available.
- Tags that describe the content of the event source through keywords.
- The number of replicas and partitions a topic has. This information is useful for Kafka application developers planning how their application will consume from the event endpoint.
- Contact information that event source owners can use to communicate with developers responsible for consuming applications.
- Schema details if the event endpoint uses one. Schemas define the structure of the data in a message, ensuring the correct and expected structure is used.
- Sample messages to show what information the event source holds.
- Sample code snippets for a variety of clients and access instructions to help with setting up your application to consume event data from the selected event endpoint.

  **Note:** The sample code snippets provided will require values, such as the `SASL username` and `SASL password`, to be manually added into the snippets. For more information about configuring a client application to consume from a selected event source, see information about how to [set up your applications to consume event data](../configure-your-application-to-connect).

All the information provided for an event source combine to support the ability to discover and utilize available event data for both technical and non-technical users in your organization.

Access to the event data from event endpoints (topics) is granted by generating credentials for each selected event endpoint, and connecting to the event endpoint through the Event Gateway. For more information, see how you can [subscribe to event endpoints](../subscribing-to-event-endpoints).

### Searching the Catalog

You can search for a specific event endpoint within the catalog by clicking the **Search** icon ![Search icon]({{ 'images' | relative_url }}/search.svg "Search icon."){:height="30px" width="15px"} and typing a query. Your searched query is used to find a match from many fields in each event endpoint. If your query is matched with a word or consecutive words from the following fields, the matched content is returned in the catalog:

- Event endpoint alias
- Event endpoint name
- Description
- Tags
- Contact information
- Schema content
- Schema description
- Sample messages

If your searched query is a partial match and starts with the same consecutive characters as an event endpoint alias or name, that result is also returned in the table.

## Exporting event endpoint details

To export an option as an AsyncAPI document, complete the following steps:

1. In the catalog, select the event endpoint that you want to work with.
1. Select the option that you want to export.
1. Click **Export AsyncAPI**.
1. Select the version of the AsyncAPI specification to use when exporting the document.
1. Click **Export** in the.

The event endpoint details are downloaded and saved to your computer. The AsyncAPI document contains the same information about the event endpoint as presented in the Catalog, and can be used in downstream tooling to generate code snippets or socialize the event endpoint further.
