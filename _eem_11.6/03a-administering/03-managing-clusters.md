---
title: "Managing clusters"
excerpt: "Add a new cluster and edit existing cluster information to use for retrieving topic details."
categories: administering
slug: managing-clusters
toc: true
---

The **Manage clusters** page displays all the clusters you have added to {{site.data.reuse.eem_name}}. You can add new clusters, edit the details you provided about the cluster, and delete the cluster.

You can also use this page to add a [cluster manually](#manual-cluster). After you have added a cluster you can [check the status](#cluster-states) of the gateway visibility in the table.

To access the **Manage clusters** page:

1. Log in to the {{site.data.reuse.eem_name}} UI with your login credentials.
2. In the navigation pane, click **Manage clusters**.


## Adding a cluster
{: #add-cluster}

To add a cluster, complete the following steps.

1. Click **Add cluster**.
2. In the **Add cluster** window, provide a unique name for the cluster in the **Cluster name** field, then click **Next**. 
3. Enter a bootstrap server URL for the Kafka cluster. 
4. Optional: You can click **Add URL**, and add one or more additional bootstrap servers, then click **Next**.

    **Note**: After you click **Next**, {{site.data.reuse.eem_name}} validates the entered bootstrap server URLs. While validating, if any untrusted certificates are found on the bootstrap server URLs, you are asked to confirm whether you accept the certificates found. If you do, select the **Accept all certificates** checkbox, and click **Next**.

5. Optional: If a **No connection** warning message is displayed, follow the steps to [add your server manually](#manual-cluster).
6. If the Kafka endpoint is configured to require mutual TLS authentication, then upload the private and public keys that your {{site.data.reuse.egw}}s must present to the Kafka cluster. These keys are provided to you by your Kafka Cluster Administrator. The keys must be in PEM format.
7. If the entered bootstrap server URLs require SASL credentials to authenticate with Kafka, you are prompted to provide credential details. If required, select the **Security protocol**, and set the required SASL credential fields.
8. Click **Add cluster**. 

{{site.data.reuse.eem_name}} validates whether the entered credentials are valid to connect to the cluster. If valid, or if credentials were not required, your cluster is added to {{site.data.reuse.eem_name}}, and you are returned to the **Manage clusters** page, where your new cluster appears, and can be edited.

## Adding a cluster manually
{: #manual-cluster}

You might want to add a Kafka cluster manually when it is located behind a different firewall or is subject to specific network policies that restrict visibility from your {{site.data.reuse.eem_name}} instance.

To add a cluster manually, complete the following steps.

1. Click **Add cluster**.
2. In the **Add cluster** window, provide a unique name for the cluster in the **Cluster name** field, then click **Next**.
3. Enter the bootstrap server URL of your Kafka cluster in `host:port` format. If the {{site.data.reuse.eem_name}} cannot verify the connection, a **No connection** information message is displayed.
4. Click **Add servers manually**.
5. If you want the communication between your {{site.data.reuse.egw}} and Kafka cluster to be secured with TLS, then set **Enable TLS** to **Yes**. If your Kafka cluster is secured with custom or self-signed CA certificates, then upload the Kafka cluster's CA certificate. The table is populated with the certificate details.
6. If the Kafka endpoint is configured to require mutual TLS authentication, then upload the private and public keys that your {{site.data.reuse.egw}}s must present to the Kafka cluster. These keys are provided to you by your Kafka Cluster Administrator. The keys must be in PEM format.
7. Click **Next**.
8. Update the **Credentials** page as required. 
9. Click **Add cluster**. 

Your cluster is added to {{site.data.reuse.eem_name}}, and you are returned to the **Manage clusters** page, where your new cluster is displayed with the **Gateway visibility** state as `Pending validation`.


## Editing a cluster

To edit the details of a cluster, complete the following steps.

1. Locate the cluster to be edited in the **Manage clusters** page table and click the edit icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Edit the cluster name icon."){:height="30px" width="15px"}
1. The **Cluster information** screen is displayed with your existing cluster name. You can edit the cluster name and provide a new name, or leave it as it is.

   **Note**: The cluster name must not be the same as the name of another cluster. The maximum length of a cluster name is 200 characters.

1. Click **Save** to exit the dialog or click **Server** to edit the server details. 
1. If you clicked **Server**, the existing bootstrap servers for your cluster are displayed. If required, amend the bootstrap server URLs for the Kafka cluster. 
1. Optional: You can click **Add URL** to add one or more additional bootstrap servers.  
1. Click **Save** to exit the dialog or click **Credentials** to edit the credentials.
1. If you clicked **Credentials**, clear the **Use existing credentials** checkbox to update the credentials as required.  
1. Click **Save**.

## Deleting a cluster

Clusters can be deleted from {{site.data.reuse.eem_name}} if they are no longer in use. You can only delete a cluster if all previously added topics from this cluster have been [deleted](../../describe/managing-event-sources/#deleting-an-event-source).

To delete a cluster from {{site.data.reuse.eem_name}}, complete the following steps. 


1. Locate the cluster you want to delete in the list on the **Manage clusters** page, and click the delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Remove topic icon."){:height="30px" width="15px"} to open the **Delete cluster** dialog. 
2. Confirm the cluster that you want to delete by entering the cluster name.
3. Click **Delete**. This will be visible in the footer if you have entered the cluster name that you want to delete correctly.

## Cluster validation states
{: #cluster-states}

The table on the **Manage clusters** page displays the status of all the gateways added to {{site.data.reuse.eem_name}}. See the following table for a description of the different validation states.


| Gateway visibility | Description |
| -----------------  | ----------- |
| All gateways connected | All the gateways in the group are connected successfully. |
| All gateways connected (with a green triangle) |  All gateway groups contain an earlier version of the gateway that is not able to complete validation checking. |
| Some gateways connected | One or more gateway group contains a gateway that has not connected successfully. Check the validation message to see which gateways have not passed the connection tests.       |
| Pending validation | Waiting for a gateway group to report a validation status. |
| Error  | All gateway groups contain gateways that are reporting an error while trying to connect to the cluster. |   




