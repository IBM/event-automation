---
title: "Configuring gateways for applications after upgrade from 11.7.x"
excerpt: "Convert your Event Gateways to be able to use applications for multi-topic subscriptions."
categories: installing
slug: converting-gateways
toc: true
---

When you upgrade from {{site.data.reuse.eem_name}} 11.7.x, your subscriptions are converted to [applications](../../about/key-concepts/#application). For applications to be able to subscribe to multiple topics, you must update all your gateway groups so that they include only {{site.data.reuse.egw}}s that support multi-topic subscriptions.

**Important:** Multi-topic subscriptions for applications are not enabled until **all** gateway groups are updated to have {{site.data.reuse.egw}}s that support multi-topic subscriptions. 

The procedure to update your gateway groups involves adding new multi-topic gateways to each gateway group, confirming that they are running, updating your clients to use the new gateways, and then removing the previous gateways.

**Note:** When you complete this procedure, Kafka client applications might experience a short outage as the network routes are updated to the new gateways.

## Before you begin
{: #before-you-begin}

Ensure that your {{site.data.reuse.eem_manager}} is [upgraded to 11.8.x](../upgrading/), and your {{site.data.reuse.egw}}s are all [upgraded](../upgrading-gateways/) to use the image from the same version.

Identify all gateway configuration properties that you customized, for example, [gateway security settings](../installing/configuring#configuring-gateway-security). You must set these properties again in the new gateway configuration.


## Converting operator-managed gateways
{: #opman-gateways}

Repeat the following steps for each [gateway group](../../about/key-concepts#gateway-group).

1. Identify an {{site.data.reuse.egw}} in the gateway group to replace.
2. Create the custom resource YAML for a new gateway. Follow the [install operator-managed gateway](../../_eem_11.8/02-installing/06a-installing-egw-op.md#operator-managed-sitedatareuseegw-installation-steps) procedure. Set the gateway name so that you can identify the gateway that it is replacing, for example, `<original gateway name>-apps`. Specify the same gateway group and other properties as the gateway that you want to replace. 
3. Save the custom resource YAML to a file called `<gateway-name>-1180-update.yaml`.
4. Review the custom resource of the gateway that you are replacing and copy the value from `spec.tls.caSecretName`. Update `spec.listeners[].tls.caSecret.secretName` in `<gateway-name>-1180-update.yaml` to use the value specified for `spec.tls.caSecretName` in the gateway that you are replacing.
5. If you made customizations to your gateway, then update the corresponding properties in your `<gateway-name>-1180-update.yaml` file.
   For example, if you set `spec.openTelemetry.endpoint='https://my.collector.endpoint.example.com:4317'`, then set this again in the `<gateway-name>-1180-update.yaml` file. 
6. Run the following command to apply the custom resource and create the gateway instance: `kubectl -n <namespace> apply -f <gateway-name>-1180-update.yaml`.
7. Verify that the gateway is running, and update your {{site.data.reuse.eem_name}} backup to include the `<gateway-name>-1180-update.yaml` file.
8. Update the bootstrap server URLs in all client applications to use the new gateway, and any other configuration that is different in the new gateway. Confirm that your client applications continue to function.  
9. Delete the `EventGateway` custom resource for the gateway that you are replacing. 
10. Monitor the status of the {{site.data.reuse.egw}} that you are replacing in the {{site.data.reuse.eem_name}} UI. When the status reports "This Event Gateway might require attention", click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** > **Remove**.
11. Return to step 1 to repeat the procedure for the next gateway in the gateway group that you want to replace. 

Repeat these steps until all gateways in all gateway groups are replaced.


## Converting Kubernetes Deployment gateways
{: #k8s-gateways}

Repeat the following steps for each [gateway group](../../about/key-concepts#gateway-group).

1. Identify an {{site.data.reuse.egw}} in the gateway group to replace.
2. In the {{site.data.reuse.eem_name}} UI navigation pane, click **Administration** > **{{site.data.reuse.egw}}s**. 
3. Click **Add gateway**.
4. Select the **Kubernetes Deployment** tile, then click **Next**.
5. Provide the configuration properties for your gateway.

    You must provide the following properties to generate the YAML:
    - **Gateway group**: Ensure that you specify the same [gateway group](../../about/key-concepts#gateway-group) as the gateway that you are replacing.
    - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group. 
    - **Replicas**: The number of Kubernetes replicas of the gateway pod to create.
    - **Server URL**: Provide the list of {{site.data.reuse.egw}} endpoints that the previous gateway was using. This is the value from `spec.template.spec.containers[egw].env[KAFKA_ADVERTISED_LISTENER]` that is the FQDNs and ports of your old gateway.
    - **Gateway private key**, **Gateway certificate**, **CA certificate** are the TLS certificates that are used to secure your {{site.data.reuse.egw}} endpoint. Provide the certificates that are used by the gateway that you are replacing.

6. Copy the contents of the **Gateway properties** text area and paste into a file called `<gateway-name>-1180-update.yaml`.
7. If you made customizations to your gateway, then update the corresponding properties in your `<gateway-name>-1180-update.yaml` file.
   For example, if you set `spec.template.pod.spec.containers[egw].env[AUDIT_LOG_FORMAT]="CADF"` in the custom resource definition of your gateway, then set `audit.log.format=CADF` in the ConfigMap section of your `<gateway-name>-1180-update.yaml` file. Review [Event Gateway ConfigMap and environment variable reference](../../reference/gateway-properties) and [Event Gateway Custom Resource reference](../../reference/gwy-api-reference) to identify where to set customized properties.
8. Run the following command to create the new gateway instance: `kubectl -n <namespace> apply -f <gateway-name>-1180-update.yaml`.
9. Verify that the new gateway is running, and update your {{site.data.reuse.eem_name}} backup to include the `<gateway-name>-1180-update.yaml` file.
10. Update your Ingress or Route resources to point to the new gateway service.
11. Update the bootstrap server URLs in all client applications to use the new gateway, and any other configuration that is different in the new gateway. Confirm that your client applications continue to function.  
12. Delete the Kubernetes Deployment of the gateway that you are replacing.
13. Monitor the status of the {{site.data.reuse.egw}} that you are replacing in the {{site.data.reuse.eem_name}} UI. When the status reports "This Event Gateway might require attention", click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** > **Remove**.
14. Return to step 1 to repeat the procedure for the next gateway in the gateway group that you want to replace. 

Repeat these steps until all gateways in all gateway groups are replaced.

## Converting Docker gateways
{: #docker-gateways}

Repeat the following steps for each [gateway group](../../about/key-concepts#gateway-group).

1. Identify an {{site.data.reuse.egw}} in the gateway group to replace.
2. In the {{site.data.reuse.eem_name}} UI navigation pane, click **Administration** > **{{site.data.reuse.egw}}s**.
3. Click **Add gateway**.
4. Select the **Docker** tile, then click **Next**.
5. Provide a gateway group, ID, and address for your gateway, then click **Next**.

   - **Gateway group**: Ensure that you specify the same [gateway group](../../about/key-concepts#gateway-group) as the gateway that you are replacing.
   - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group.
   - **Server URL**: The address or comma-separated addresses for the gateway that were used by [Kafka clients](../../subscribe/configure-your-application-to-connect). Set this to the same values as set in the gateway that you are replacing. These addresses might be to a proxy in front of the gateway, or the gateway itself.

6. Copy the contents of the **Gateway properties** text area and paste them into a file called `<gateway-name>-docker-run`.
7. If you made customizations to your gateway, then update the corresponding properties in your `<gateway-name>-docker-run` file. Search the [gateway properties ConfigMap and environment variables reference](../../reference/gateway-properties) for the properties that you want to update. 
8. Use the new `<gateway-name>-docker-run` command as the run command for your gateway.
9. Update your g{{site.data.reuse.eem_name}} backup to include the `<gateway-name>-docker-run` file.
10. Stop and delete the container of the gateway that you are replacing. 
11. Monitor the status of the {{site.data.reuse.egw}} that you are replacing in the {{site.data.reuse.eem_name}} UI. When the status reports "This Event Gateway might require attention", click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** > **Remove**.
12. Return to step 1 to repeat the procedure for the next gateway in the gateway group that you want to replace. 

Repeat these steps until all gateways in all gateway groups are replaced.