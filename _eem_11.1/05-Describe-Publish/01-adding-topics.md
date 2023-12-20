---
title: "Describing event sources"
excerpt: "Use Event Endpoint Management to describe new event sources to make their event data available to others."
categories: describe
slug: adding-topics
toc: true
---

You can describe your Kafka topics as event sources, making their event data available to others in your organization. The event data can then be published to the catalog with either a self-service approach or with an approval process that is required to gain access.

As a Kafka administrator you can add new topics, describing the event source by adding cluster connection details from an existing or new cluster. This connection is tested, and if valid, basic topic details are retrieved from the Kafka cluster, such as name, partition, and replica information.

You can also provide other information such as a description about the event data available through a topic, tags that help describe the content of the event source through keywords, and schema details if the topic uses schemas to structure the event content.

All added topics are displayed along with tags and status information in the {{site.data.reuse.eem_name}} UI **Topics** page. 

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") In {{site.data.reuse.eem_name}} 11.1.1 and later, each topic has an **Options** tab. Options provide you with more control over how you want this event source to appear in the catalog. For example, you can create an option for your topic with approval control enabled to allow you to control who can get access to that topic. 
{: #options}

You can then publish each option to the **Catalog**, making it available to socialize with others in your organization, enabling users to [discover the available event data](../../consume-subscribe/discovering-topics/).

To describe an event source by adding a topic, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Topics**, then click **Add topic**.
1. Either select an existing cluster or create a new cluster from the **Cluster connection** step.
   - To select an existing cluster, locate and select the required cluster from the list of clusters, then click **Next**.
   - To create a new cluster, click **Add new cluster**, and complete the following steps:
     1. Enter a unique name for your new cluster, and click **Next**.
     2. Enter a bootstrap server URL for the Kafka cluster. Optionally, you can click **Add URL**, and add one or more additional bootstrap servers, then click **Next**.

        **Note**: After you click **Next**, {{site.data.reuse.eem_name}} validates the entered bootstrap server URLs. While validating, if any untrusted certificates are found on the bootstrap server URLs, you are asked to confirm whether you accept the certificates found. If you do, select the **Accept all certificates** checkbox, and click **Next**.

     3. If the entered bootstrap server URLs require SASL credentials to authenticate with Kafka, you are prompted to provide credential details. If required, select the **Security protocol**, enter your username and password, and click **Add cluster**.

         **Note**: After you click **Add cluster**, {{site.data.reuse.eem_name}} validates whether the entered credentials are valid to connect to the cluster. If everything is valid, or if credentials were not required, your cluster is added to {{site.data.reuse.eem_name}}, and you are returned to the **Cluster connection** step, where your new cluster appears, and can be selected.

1. Select some topics to add from the list of topics available on this cluster.

1. (Optional) If a name is not added by default, enter a unique Event Source name for the topics selected.

   **Note**: The Event Source name is the unique ID that identifies your topics.
      
1. Click **Add Topic**.

**Note**: If any of the Event Source names that you entered are already in use, an error message is displayed to indicate that there is a conflict and it failed to add the topic. Otherwise, your new topics are added to {{site.data.reuse.eem_name}}.

Your new topics appear in the **Topics** page with the **Options status** as 0 published. For more information about socializing your options, see [option lifecycle states](../managing-topics#option-lifecycle-states).
