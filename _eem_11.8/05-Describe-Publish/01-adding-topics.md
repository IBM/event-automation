---
title: "Describing topics"
excerpt: "Add topics from a Kafka cluster to Event Endpoint Management."
categories: describe
slug: adding-topics
toc: true
---

When you [add a cluster](../../administering/managing-clusters#add-cluster), if the {{site.data.reuse.eem_manager}} instance can connect to the cluster, then details of all topics from the Kafka cluster are automatically retrieved and available for use in {{site.data.reuse.eem_name}}. You can select the topics that you want to add to {{site.data.reuse.eem_name}} from a list of all the topics that are available on the Kafka cluster.

If the {{site.data.reuse.eem_manager}} instance cannot connect to the cluster (because your network configuration allows only your {{site.data.reuse.egw}}s to connect to the cluster), then you must manually define each topic in {{site.data.reuse.eem_name}}. When your {{site.data.reuse.egw}}s connect to the cluster, the topics that you defined are verified.

**Note:** Kafka topics that are added to {{site.data.reuse.eem_name}} are sometimes referred to as [source topics](../../about/key-concepts#source-topic) to avoid confusion with [virtual topics](../../about/key-concepts#virtual-topic).

When you add topics, you can provide extra information about the topic, such as a description, keyword tags, and schema details if the topic uses schemas to structure the event content.

All added topics are displayed with tags and status information in the {{site.data.reuse.eem_name}} UI **Manage topics** page. 

## Adding topics
{: #add-topic}

To add a topic to {{site.data.reuse.eem_name}} from a Kafka cluster, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
1. In the navigation pane, click **Manage > Topics**, then click **Add topic**.
1. In the **Interaction** pane, select how your clients interact with the topic from one of the following options, and then click **Next**.  
    * [Consume](../../about/key-concepts/#consume) events.
    * [Produce](../../about/key-concepts/#produce) events.
      
    **Note:** A topic can be either a produce-enabled topic or a consume-enabled topic, not both. To make the same topic accessible for both produce and consume usage, you must add the topic twice.
1. Either select an existing cluster or create a new cluster from the **Cluster connection** step.
   - To select an existing cluster, locate and select the required cluster from the list of clusters.
   - To create a new cluster, click **Add new cluster**, and complete the following steps:  

     a. Enter a unique name for your new cluster, and click **Next**.  

     b. Enter a bootstrap server URL for the Kafka cluster.   

     c. Optional: You can click **Add URL**, and add one or more additional bootstrap servers, then click **Next**.  

        **Note:** After you click **Next**, {{site.data.reuse.eem_name}} validates the entered bootstrap server URLs. While validating the URLs, if any untrusted certificates are found on the bootstrap server URLs, you are asked to confirm whether you accept the certificates found. If you do, select the **Accept all certificates** checkbox, and click **Next**.   

     d. If a **No connection** information message is displayed, {{site.data.reuse.eem_name}} could not connect to the URL that you entered. Click **Skip connection checks** to add a cluster and bypass the connection tests.  

     e. If the Kafka endpoint is configured to require mutual TLS authentication, then you must upload the private and public keys that were provided to you by your Kafka Cluster Administrator. Upload the private and public keys in PEM format.  

     f. If the entered bootstrap server URLs require SASL credentials to authenticate with Kafka, you are prompted to provide credential details. If required, select the **Security protocol**, enter your username and password, and click **Add cluster**.    

     g. If a [Cluster maintainers](../../security/groups#cluster-maintainers) group exists, then in the **Maintainers** pane, select the user groups that you want to have permission to maintain this cluster. 
     
     If the user group is not displayed, click **Enable user group** to add one from your organization. Any user groups that you add must exist within the organization that is provided by your OAuth provider.

   **Note:** After you click **Add cluster**, {{site.data.reuse.eem_name}} validates whether the entered credentials are valid to connect to the cluster. If everything is valid, or if credentials were not required, then your cluster is added to {{site.data.reuse.eem_name}}, and you are returned to the **Cluster connection** step, where your new cluster is available.

1. Select topics to add from the list of topics available on this cluster. By default, the Kafka topic name is used to populate the **Name** field, but you can edit this field as required.
   
   If your {{site.data.reuse.eem_manager}} is not able to connect to the Kafka cluster, then a table is presented for you to define provisional topics. Set **Name** to a unique name that identifies the topic in {{site.data.reuse.eem_name}}, and set **Kafka topic name** to the name of the topic on the Kafka cluster. To add more provisional topics, click **Define topic**. 

      **Note:** When you define a topic manually, the topic is only registered in the {{site.data.reuse.eem_manager}}. The topic is not created on the Kafka cluster.

1. If [user groups](../../security/groups) are enabled, then the Editors pane is displayed.
   To enable members of the group to edit the topic information and create virtual topics for the source topic, select a user group from the table.

   If the user group is not displayed, click **Enable user group** to add one from your organization.  

   **Note:** Any user groups that you add here must exist within the organization that is provided by your OAuth provider.
   
1. Click **Add Topic**.


Your new topic appears in the **Manage topics** page with the **Virtual topic status** of `0 published`. For more information about socializing your topics, see [Publishing virtual topics](../publishing-virtual-topics).

After you create a source topic, you cannot publish any virtual topics that you create for it until the associated cluster passes the connection tests against your gateways.

<!--Test update-->


