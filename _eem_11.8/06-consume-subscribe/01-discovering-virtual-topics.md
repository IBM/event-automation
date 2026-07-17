---

title: "Discovering virtual topics"
excerpt: Use the {{site.data.reuse.eem_name}} Catalog to discover information about the available source topics and the event data they provide."
categories: subscribe
slug: discovering-virtual-topics
toc: true
---

In the {{site.data.reuse.eem_name}} catalog, you can browse and discover information about the virtual topics available in your organization. When you log in to {{site.data.reuse.eem_name}}, the Event Catalog is your landing page in the {{site.data.reuse.eem_name}} UI.

You can also publish virtual topics to [{{site.data.reuse.wm_portal_long}}](../../dpo-integration/overview), where users can [discover](#webmethods-catalog) them alongside their organization's APIs and other services. 

## The Catalog
{: #the-catalog}

All virtual topics published to the {{site.data.reuse.eem_name}} catalog are available in the {{site.data.reuse.eem_name}} UI home page (**Catalog**) and you can use the catalog to find out more about what each virtual topic is used for by clicking the virtual topic name.

The information that is documented for each virtual topic can include the following detail:
- A description of the event data that is available from the virtual topic.
- Tags that describe the content of the topic through keywords.
- The number of replicas and partitions a topic has. This information is useful for client application developers planning how their application can consume from the virtual topic.
- Contact information for the virtual topic owner.
- Schema details if the virtual topic uses a schema. Schemas define the structure of the data in a message to ensure that the expected structure is used.
- Sample messages to show what information the topic holds.
- A [**Code accelerator**](#code-accelerator-samples) section that provides sample Java, [Node.JS](https://nodejs.org/){:target="_blank"}, and [kcat](https://github.com/edenhill/kcat){:target="_blank"} client template code.

Access to the event data from virtual topics is granted by subscribing an application to the virtual topic. The application credentials can be used to access the virtual topic through the {{site.data.reuse.egw}}. For more information, see how you can [subscribe to virtual topics](../subscribing-apps).

### Searching the Catalog
{: #searching-the-catalog}

You can search for a specific virtual topic within the catalog by entering your search text next to the **Search** icon ![Search icon]({{ 'images' | relative_url }}/search.svg "Search icon."){:height="30px" width="15px"}. If your search text is matched with a word or consecutive words from the following fields, the matched content is returned in the catalog:

- Virtual topic alias
- Virtual topic name
- Description
- Tags
- Contact information
- Schema content
- Schema description
- Sample messages

Partial matches that start with the same consecutive characters as a virtual topic alias or name are also returned.

## Exporting virtual topic details
{: #exporting-virtual-topic-details}

To export a virtual topic as an AsyncAPI document, complete the following steps:

1. In the catalog, select the virtual topic that you want to work with. A new window is displayed with more information about the virtual topic.
1. Click **Export AsyncAPI**.
1. Select the version of the AsyncAPI specification to use when exporting the document.
1. Click **Export**.

The virtual topic details are downloaded and saved to your computer. The AsyncAPI document contains the same information about the virtual topic as presented in the catalog, and can be used in downstream tools to generate code snippets or socialize the virtual topic further.

## Code accelerator samples
{: #code-accelerator-samples}

Expand the **Code accelerator** section to access sample Java, [Node.JS](https://nodejs.org/){:target="_blank"}, and [kcat](https://github.com/edenhill/kcat){:target="_blank"} client template code.

Update the template code with your client credentials to verify access to your virtual topics. For more information about configuring a client application to access a virtual topic, see information about how to [set up your applications to access virtual topics](../configure-your-application-to-connect).

## Discovering virtual topics in {{site.data.reuse.wm_portal_short}}
{: #dpo-catalog}
  
Virtual topics that you publish to {{site.data.reuse.wm_portal_short}} are displayed in the portal's **Asset gallery**. The Asset gallery provides a similar experience to the {{site.data.reuse.eem_name}} catalog, it displays the virtual topic details, schemas, sample messages, and code accelerator.

To discover virtual topics in {{site.data.reuse.wm_portal_short}}:

1. Log in to {{site.data.reuse.wm_portal_short}}.
2. Go to the **Asset gallery**.
3. Search for the virtual topic that you want to work with.
4. Click on the virtual topic to view its details, including:
   - Description and documentation
   - Schema information
   - Sample messages
   - Code accelerator samples
   - Subscription options
