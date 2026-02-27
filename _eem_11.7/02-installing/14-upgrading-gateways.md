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


## Upgrading Docker gateways
{: #upgrading-docker-gateways}

To upgrade a Docker {{site.data.reuse.egw}}, delete the existing Docker gateway and replace it with one that uses the Docker image of your target {{site.data.reuse.eem_name}} version. 

1. Edit your [backup](../backup-restore) of the Docker `run` command that you [generated](../install-docker-egw#generating-gateway-docker-config) when you installed the gateway, and update the following properties:

    a. The image reference. Set the image reference to your target version. For example:

    ```shell
    -d icr.io/cpopen/ibm-eventendpointmanagement/egw:11.7.2
    ```
    
    b. If the new version requires an updated license ID, then update `LICENCE_ID`.

    c. If you made additional configuration changes to your Docker gateway since installation, then ensure that your Docker command includes those changes.

2. Uninstall the previous gateway as described in [uninstalling a Docker {{site.data.reuse.egw}}](../uninstalling/#uninstall-docker-gateway).
3. Run the Docker command that you prepared in step 1. 


## Upgrading Kubernetes Deployment gateways
{: #upgrading-k8s-gateways}

To upgrade a Kubernetes Deployment {{site.data.reuse.egw}}, edit the Kubernetes Deployment and update the following properties:

- The Docker image name that is specified in `spec.template.spec.containers[egw].image`. Set the image name to the target {{site.data.reuse.eem_name}} version. For example: 

    ```
    icr.io/cpopen/ibm-eventendpointmanagement/egw:11.7.2
    ```

- If the target version requires a new license ID, update `spec.template.spec.containers[egw].env[LICENSE_ID]`.

The gateway pod restarts when the image name is updated.

## Optional: Add API key to your gateway instances
{: #add-api-key}

If your gateway instance does not have an API key property, and you are advised to add this property to your gateway, then follow these steps:

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. Click **Administration** > **{{site.data.reuse.egw}}s**.
3. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the gateway instance.
4. Click **View configuration details** and select the appropriate tab for your gateway type. Copy the following properties:

   - **Operator-managed** 
     - The `spec.template.pod.spec.containers[egw].env[API_KEY]` property.
     - The definition of the Secret that contains `stringData.apiKey`.

   - **Kubernetes Deployment** 
     - The `spec.template.spec.containers[egw].env[API_KEY]` property.
     - The definition of the Secret that contains `stringData.apiKey`.

   - **Docker** 
     - The `API_KEY` property. Add this property to your Docker gateway run command and restart the gateway. Update your [gateway backup](../backup-restore#backup-gateway) to include the `API_KEY` property.

5. Kubernetes and Operator-managed gateways: Create a secret in your gateway namespace that contains the API key:

      i. Create a new file: `apiKeySecret.yaml` and paste in the secret that you copied in step 4.

      ii. Create the secret in your gateway namespace:

      ```
      kubectl -n <namespace> apply -f apiKeySecret.yaml
      ```
6. Kubernetes and Operator-managed gateways: Update your gateway deployment YAML or CR with the `API_KEY` property that you copied in step 4.


**Important:** The YAML and Docker command syntax that is presented in the {{site.data.reuse.eem_name}} UI does not include any customizations that you made to your gateway, such as additional [security configuration](../configuring#configuring-gateway-security). Do not replace your gateway's YAML or Docker command with the configuration that is presented in the UI, replace only the API_KEY. After the gateway instance is upgraded, update your [gateway backup](../backup-restore#backup-gateway).
