---
title: "Managing clusters"
excerpt: "Add a new cluster and edit existing cluster information to use for retrieving topic details."
categories: administering
slug: managing-clusters
toc: true
---

The **Manage clusters** page displays all the Kafka clusters you have added to {{site.data.reuse.eem_name}}. You can add new clusters, edit cluster details, and delete the clusters.

To access the **Manage clusters** page:

1. Log in to the {{site.data.reuse.eem_name}} UI.
2. In the navigation pane, click **Manage > Clusters**.


## Adding a cluster
{: #add-cluster}

To add a cluster, complete the following steps.

1. Click **Add cluster**.
2. In the **Add cluster** window, provide a unique name for the cluster in the **Cluster name** field, then click **Next**. 
3. Enter a bootstrap server URL for the Kafka cluster. 

   If your cluster has multiple bootstrap server URLs, then click **Add URL** to add more URLs.

   After you click **Next**, the {{site.data.reuse.eem_manager}} validates the entered bootstrap server URLs. If any of the bootstrap server URLs use untrusted certificates, then you are asked to confirm that you trust these certificates.

   If your {{site.data.reuse.eem_manager}} cannot make a network connection to the Kafka cluster, then a **No connection** warning message is displayed. If you see this warning message, then follow these steps to add the Kafka cluster without {{site.data.reuse.eem_manager}} verification:

      a. Click **Add servers manually**.

      b. Configure TLS for your {{site.data.reuse.egw}} to Kafka cluster connection, then click Next.

      - If your Kafka cluster is secured with custom or self-signed CA certificates, then upload the cluster's CA certificate so that your {{site.data.reuse.egw}}s trust the Kafka cluster.
      
      - If your Kafka cluster requires mTLS, then upload the certificate and private key that your {{site.data.reuse.egw}}s must use to connect to the cluster. If you do not have these files, then contact the Kafka cluster administrator. The keys must be in PEM format.

      c. Select the Security protocol that your Kafka cluster requires, and provide the required credentials.

      d. Provide the details for your selected security type, then continue to step 6.
      
   **Note:** The **No connection** scenario occurs in situations where your {{site.data.reuse.eem_manager}} is in a different environment from your Kafka clusters. If your {{site.data.reuse.egw}}s are able to reach the Kafka cluster, then they validate the connection to the cluster and pull the topic information. The {{site.data.reuse.egw}} validation of Kafka clusters is an asynchronous operation and can take a few minutes to complete.

4. If the Kafka cluster requires mTLS, then upload the certificate and private key that your {{site.data.reuse.egw}}s must use to connect to the cluster. If you do not have these files, then contact the Kafka cluster administrator. The keys must be in PEM format.
5. If your Kafka cluster requires SASL credentials to authenticate, then you are prompted to provide the credentials. Select the **Security protocol**, and set the required SASL credential fields.
6. If a [Cluster maintainers](../../security/groups#cluster-maintainers) group exists, then in the **Maintainers** pane, select the users groups that you want to maintain this cluster.

   If the user group is not displayed, click **Add user group** to add one from your organization.  

   **Note:** Any user groups that you add must exist within the organization that is provided by your OAuth provider.

6. Click **Add cluster**. 

   If the credentials you supplied are valid, then the Kafka cluster is added to {{site.data.reuse.eem_name}}.

   If only your {{site.data.reuse.egw}}s have network access to the Kafka cluster, then the **Gateway visibility** state shows as `Pending validation` for a few minutes until your gateways complete validation of the Kafka cluster connection.

## Editing a cluster
{: #editing-a-cluster}

To edit the details of a cluster, complete the following steps.

1. Click the edit icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Edit the cluster name icon."){:height="30px" width="15px"} for the cluster that you want to edit.
   The **Edit cluster** window is displayed, where you can edit the following cluster properties:

   - **Information**: Click **Information** to edit the cluster name. The cluster name must be unique, and has a maximum length of 200 characters.
   - **Server**: Click **Server** to edit the bootstrap URLs and TLS configuration.
   - **Credentials**: Click **Credentials** to edit the security credentials that are used to access the cluster.
   - **Maintainers**: If a [Cluster maintainers](../../security/groups/cluster-maintainers) group exists, then click **Maintainers** to manage the user groups that can maintain the cluster.
1. Click **Save** when you are finished editing the cluster.

## Deleting a cluster
{: #deleting-a-cluster}

Clusters can be deleted from {{site.data.reuse.eem_name}} if they are no longer in use. Before you can delete a cluster, you must [delete](../../describe/managing-event-sources/#deleting-an-event-source) all topics that were added from the cluster.

To delete a cluster from {{site.data.reuse.eem_name}}, complete the following steps. 


1. Click the delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Remove topic icon."){:height="30px" width="15px"} in the **Manage clusters** page.
2. Confirm the cluster that you want to delete by entering the cluster name.
3. Click **Delete**.

## Cluster validation states
{: #cluster-states}

The **Gateway visibility** column in the **Manage clusters** page displays the status of the {{site.data.reuse.egw}} to Kafka cluster connection. The following table describes the different connection states.

| Gateway visibility | Description |
| -----------------  | ----------- |
| All gateways connected | All the gateways in the group successfully connected to the Kafka cluster. |
| All gateways connected (with a green triangle) |  All gateway groups contain an earlier version of the gateway that is not able to complete validation checking. |
| Some gateways connected | One or more gateway groups contain a gateway that cannot connect to the Kafka cluster. Check the validation message to see which gateways.       |
| Pending validation | Waiting for a gateway group to report a validation status. |
| Error  | All gateway groups contain gateways that are unable to connect to the Kafka cluster. |   




