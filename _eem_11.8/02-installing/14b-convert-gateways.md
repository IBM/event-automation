---
title: "Configuring gateways for applications"
excerpt: "Convert your Event Gateways to be able to use applications for multi-topic subscriptions."
categories: installing
slug: converting-gateways
toc: true
---

When you upgrade to {{site.data.reuse.eem_name}} 11.8.0, your subscriptions are converted to [applications](../../about/key-concepts/#application). For applications to be able to subscribe to multiple topics, you must update your {{site.data.reuse.egw}}s to support multi-topic subscriptions.

**Important:** Multi-topic subscriptions for applications are not enabled until **all** registered gateways are updated. 

## Before you begin
{: #before-you-begin}

Ensure that your {{site.data.reuse.eem_manager}} is [upgraded to 11.8.0](../upgrading/), and your {{site.data.reuse.egw}}s are all [upgraded](../upgrading-gateways/) to use the image from the 11.8.0 release.

Identify all gateway configuration properties that you customized, for example, [gateway security settings](../installing/configuring#configuring-gateway-security). You must set these properties again in the new gateway configuration.

To make your {{site.data.reuse.egw}}s capable of handling applications that subscribe to multiple topics, follow the steps for your gateway type:


## Converting operator-managed gateways
{: #opman-gateways}

1. In the {{site.data.reuse.eem_name}} UI navigation pane, click **Administration** > **{{site.data.reuse.egw}}s**. 
2. For each {{site.data.reuse.egw}} click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** > **View configuration details**.
3. Select the **Operator-managed** tab.
4. Copy the contents of the **Gateway properties** text area. 
5. Create a file called `<gateway-name>-1180-update.yaml`, and paste in the configuration from step 4.
6. If you made customizations to your gateway, then update the corresponding properties in your `<gateway-name>-1180-update.yaml` file.
   For example, if you set `spec.openTelemetry.endpoint='https://my.collector.endpoint.example.com:4317'`, then set this again in the `<gateway-name>-1180-update.yaml` file. 
7. Run the following command to apply the update: `kubectl -n <namespace> apply -f <gateway-name>-1180-update.yaml`.
8. Update your gateway backup to use the `<gateway-name>-1180-update.yaml` file.

## Converting Kubernetes Deployment gateways
{: #k8s-gateways}

1. In the {{site.data.reuse.eem_name}} UI navigation pane, click **Administration** > **{{site.data.reuse.egw}}s**. 
2. For each {{site.data.reuse.egw}} click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** > **View configuration details**.
3. Select the **Kubernetes deployment** tab.
4. Copy the contents of the **Gateway properties** text area. 
5. Create a file called `<gateway-name>-1180-update.yaml`, and paste in the configuration from step 4.
6. If you made customizations to your gateway, then update the corresponding properties in your `<gateway-name>-1180-update.yaml` file.
   For example, if you set `spec.template.pod.spec.containers[egw].env[AUDIT_LOG_FORMAT]="CADF"` in the custom resource definition of your gateway, then set `audit.log.format=CADF` in the ConfigMap section of your `<gateway-name>-1180-update.yaml` file. Review [Event Gateway ConfigMap and environment variable reference](../../reference/gateway-properties) and [Event Gateway Custom Resource reference](../../reference/gwy-api-reference) to identify where to set customized properties.
7. Run the following command to apply the update: `kubectl -n <namespace> apply -f <gateway-name>-1180-update.yaml`.
8. Update your gateway backup to the `<gateway-name>-1180-update.yaml` file.


## Converting Docker gateways
{: #docker-gateways}

1. In the {{site.data.reuse.eem_name}} UI navigation pane, click **Administration** > **{{site.data.reuse.egw}}s**. 
2. For each {{site.data.reuse.egw}} click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** > **View configuration details**.
3. Select the **Docker** tab. 
4. Copy the contents of the **Gateway properties** text area. 
5. Create a file called `<gateway-name>-docker-run`, and paste in the configuration from step 4.
6. If you made customizations to your gateway, then update the corresponding properties in your `<gateway-name>-docker-run` file. Search the [gateway properties ConfigMap and environment variables reference](../../reference/gateway-properties) for the properties that you want to update. 
6. Use the new `<gateway-name>-docker-run` command as the run command for your gateway.
7. Update your gateway backup with the `<gateway-name>-docker-run` file.