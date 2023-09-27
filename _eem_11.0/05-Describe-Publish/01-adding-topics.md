---
title: "Describing event sources"
excerpt: "Use Event Endpoint Management to describe new event sources to make their event data available to others."
categories: describe
slug: adding-topics
toc: true
---

You can describe your Kafka topics as event sources, making their event data available to others in your organization. The event data can then be used in projects through self-service access without the need for the topic owners to be involved in every request for reuse.

As a Kafka administrator you can add new topics, describing the event source by adding cluster connection details from an existing or new cluster. This connection is tested, and if valid, basic topic details are retrieved from the Kafka cluster, such as name, partition, and replica information.

You can also provide other information such as a description about the event data available through a topic, tags that help describe the content of the event source through keywords, and schema details if the topic uses schemas to structure the event content.

All added topics are displayed along with tags and status information in the {{site.data.reuse.eem_name}} UI **Topics** page. You can then publish the event sources to the **Catalog**, making it available to socialize with others in your organization, enabling users to [discover the available event data](../../consume-subscribe/discovering-topics/) through self-service access.

To describe an event source by adding a topic, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Topics**, then click **Add topic**.
3. Either select an existing cluster or create a new cluster from the **Cluster connection** step.
   - To select an existing cluster, locate and select the required cluster from the list of clusters, then click **Next**.
   - To create a new cluster, click **Add new cluster**, and complete the following steps:
     1. Enter a unique name for your new cluster, and click **Next**.
     2. Enter a bootstrap server URL for the Kafka cluster. Optionally, you can click **Add URL**, and add one or more additional bootstrap servers, then click **Next**.

        **Note**: After clicking **Next**, {{site.data.reuse.eem_name}} validates the entered bootstrap server URLs. While validating, if any untrusted certificates are found on the bootstrap server URLs, you will be asked to confirm whether you accept the certificates found. If you do, select the **Accept all certificates** checkbox, and click **Next**.

     3. If the entered bootstrap server URLs require SASL credentials to authenticate with Kafka, you will be prompted to provide credential details. If required, select the **Security protocol**, enter your username and password, and click **Add cluster**.

         **Note**: After clicking **Add cluster**, {{site.data.reuse.eem_name}} validates whether the entered credentials are valid to connect to the cluster. If everything is valid, or if credentials were not required, your cluster will be added to {{site.data.reuse.eem_name}}, and you will be returned to the **Cluster connection** step, where your newly added cluster will appear, and can be selected.

4. Select some topics to add from the list of topics available on this cluster.
5. Enter a unique alias for the topics selected.

   **Note**: The topic alias name is the unique ID that identifies your topics.

6. Click **Add Topic**.

   **Note**: If any of the topic aliases you entered are already in use, you will be prompted to enter a different alias. Otherwise, your newly added topics will be added to {{site.data.reuse.eem_name}}.

7. Your newly added topics will appear in the **Topics** page as an **Unpublished** topic. See [topic lifestyle state](../managing-topics#topic-lifecycle-state) for information about socializing your topics.
