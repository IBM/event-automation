---
title: "Managing clusters"
excerpt: "Add a new cluster and edit existing cluster information to use for retrieving topic details."
categories: describe
slug: managing-clusters
toc: true
---

After [adding](../adding-topics) a cluster, you can use the **Clusters** page to edit the details you provide about the cluster, or to delete the cluster.

To access the **Clusters** page:

1. Log in to the {{site.data.reuse.eem_name}} UI with your login credentials.
2. In the navigation pane, click **Clusters**.

## Editing a cluster

To edit the details of a cluster, complete the following steps.

1. Locate the cluster to be edited in the **Clusters** page table and click the edit icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"}

   The **Cluster information** screen is displayed with your existing cluster name. 

   ![Event Endpoint Management 11.0.2 icon]({{ 'images' | relative_url }}/11.0.2.svg "In Event Endpoint Management 11.0.2.") You can edit the cluster name and provide a new name, or leave it as it is.

   **Note**: The cluster name must not be the same as the name of another cluster. The maximum length of a cluster name is 200 characters.

2. Click **Next**. The existing bootstrap servers for your cluster are displayed. Amend the bootstrap server URLs for the Kafka cluster. Optionally, you can click **Add URL** to add one or more additional bootstrap servers, then click **Next**.

    **Note**: When you click **Next**, {{site.data.reuse.eem_name}} validates the entered bootstrap server URLs. While validating, if any untrusted certificates are found on the bootstrap server URLs, you will be asked to confirm if you accept the certificates found. If you do, select the **Accept all certificates** checkbox. Even if you have previously accepted these certificates, you will need to accept them again, and click **Next**.

3. If the entered bootstrap server URLs require SASL credentials to authenticate with Kafka, you will be prompted to provide the credential details. If required, select the **Security protocol** to enter your username and password, and click **Save**.

    **Note**: After clicking **Save**, {{site.data.reuse.eem_name}} validates whether the entered credentials are valid to connect to the cluster. If the credentials are valid, or credentials were not required, your cluster will be edited and saved accordingly.

## Deleting a cluster

Clusters can be deleted from {{site.data.reuse.eem_name}} if they are no longer in use. You can only delete a cluster if all previously added topics from this cluster have been [deleted](../managing-topics/#deleting-a-topic).

To delete a cluster from {{site.data.reuse.eem_name}}, complete the following steps. 

1. Locate the cluster you want to delete in the list on the **Clusters** page, and click the delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} to open the **Delete cluster** dialog. 
2. Confirm the cluster that you want to delete by entering the cluster name.
3. Click **Delete**. This will be visible in the footer if you have entered the cluster name that you want to delete correctly.
