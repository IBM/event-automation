---
title: "Upgrading Event Gateways"
excerpt: "Upgrade your gateway instances to the latest version."
categories: installing
slug: upgrading-gateways
toc: true
---


## Upgrading operator-managed gateways
{: #upgrade-opman-gateways}

If you have operator-managed gateways, their upgrade is done by the {{site.data.reuse.eem_name}} operator when you upgrade the {{site.data.reuse.eem_manager}}. Verify that your gateway instances upgraded successfully by following these steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. Click **Administration** > **{{site.data.reuse.egw}}s**.

After you verify the upgrade, update your gateways to support multi-topic subscriptions as described in [configuring gateways for applications](../converting-gateways).

## Upgrading Docker gateways
{: #upgrading-docker-gateways}

To upgrade a Docker {{site.data.reuse.egw}}, delete the existing Docker gateway and replace it with one that uses the Docker image of your target {{site.data.reuse.eem_name}} version. 

1. Edit your [backup](../backup-restore) of the Docker `run` command that you [generated](../install-docker-egw#generating-gateway-docker-config) when you installed the gateway, and update the following properties:

    a. The image reference. Set the image reference to your target version. For example:

    ```shell
    -d icr.io/cpopen/ibm-eventendpointmanagement/egw:11.8.0
    ```
    
    <!-- only include below license line when the release has a new license -->
    <!-- b. If the new version requires an updated license ID, then update `LICENCE_ID`. -->

    b. If you made additional configuration changes to your Docker gateway since installation, then ensure that your Docker command includes those changes.

2. Uninstall the previous gateway as described in [uninstalling a Docker {{site.data.reuse.egw}}](../uninstalling/#uninstall-docker-gateway).
3. Run the Docker command that you prepared in step 1. 
4. Update your gateway to support multi-topic subscriptions as described in [configuring gateways for applications](../converting-gateways).


## Upgrading Kubernetes Deployment gateways
{: #upgrading-k8s-gateways}

To upgrade a Kubernetes Deployment {{site.data.reuse.egw}}, edit the Kubernetes Deployment and update the Docker image name that is specified in `spec.template.spec.containers[egw].image`. Set the image name to the target {{site.data.reuse.eem_name}} version. For example: 

```
icr.io/cpopen/ibm-eventendpointmanagement/egw:11.8.0
```

<!-- Add back line below when license needs updating -->
<!-- If the target version requires a new license ID, update `spec.template.spec.containers[egw].env[LICENSE_ID]`. -->

The gateway pod restarts when the image name is updated.

After the upgrade is complete, update your gateways to support mutli-topic subscriptions as described in [configuring gateways for applications](../converting-gateways).


