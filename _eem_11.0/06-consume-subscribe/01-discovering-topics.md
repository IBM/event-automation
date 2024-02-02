---
title: "Discovering topics"
excerpt: Use the {{site.data.reuse.eem_name}} Catalog to discover information about the available event sources and the event data they provide, so that you can choose the ones you want to use in your applications and flows."
categories: consume-subscribe
slug: discovering-topics
toc: true
---

In the {{site.data.reuse.eem_name}} catalog, you can browse and discover information about the event sources available in your organization. When you log in to {{site.data.reuse.eem_name}}, the Event Catalog is your landing page in the {{site.data.reuse.eem_name}} UI.

## The Catalog

All the published and socialized Kafka topics are available in the {{site.data.reuse.eem_name}} UI homepage (**Catalog**). Each topic represents a source of events, and you can use the catalog to find out more about what kind of event data is available by clicking the topic name.

The information documented for each topic can include the following detail:
- A free form description about the event data available.
- Tags that describe the content of the event source through keywords.
- The number of replicas and partitions a topic has. This information is useful for Kafka application developers planning how their application will consume from the event source.
- Contact information that event source owners can use to communicate with developers responsible for consuming applications.
- Schema details if the topic uses one. Schemas define the structure of the data in a message, ensuring the correct and expected structure is used.
- Sample messages to show what information the event source holds.
- Sample code snippets for a variety of clients and access instructions to help with setting up your application to consume event data from the selected topic.

  **Note:** The sample code snippets provided will require values, such as the `SASL username` and `SASL password`, to be manually added into the snippets. For more information about configuring a client application to consume from a selected event source, see information about how to [set up your applications to consume event data](../setting-your-application-to-consume).

All the information provided for an event source combine to support the ability to discover and utilize available event data for both technical and non-technical users in your organization.

Access to the event data from event sources (topics) is granted by generating credentials for each selected topic, and connecting to the topic through the Event Gateway. For more information, see how you can [subscribe to topics](../subscribing-to-topics).

### Searching the Catalog

![Event Endpoint Management 11.0.3 icon]({{ 'images' | relative_url }}/11.0.3.svg "In Event Endpoint Management 11.0.3.") You can search for a specific topic within the catalog by clicking the **Search** icon ![Search icon]({{ 'images' | relative_url }}/search.svg "Image showing the search icon."){:height="30px" width="15px"} and typing a query. Your searched query is used to find a match from many fields in each topic. If your query is matched with a word or consecutive words from the following fields, the matched content is returned in the catalog:

- Topic alias
- Topic name
- Description
- Tags
- Contact information
- Schema content
- Schema description
- Sample messages

If your searched query is a partial match and starts with the same consecutive characters as a topic alias or topic name, that result is also returned in the table.

## Exporting topic details

You can also export a catalog entry as an AsyncAPI document by clicking **Export as AsyncAPI**. The topic details are downloaded and saved to your computer. The AsyncAPI document contains the same information about the topic as presented in the Catalog, and can be used in downstream tooling to generate code snippets or socialize the event source further.
