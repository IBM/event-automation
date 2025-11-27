---
title: "Upgrading Docker and Kubernetes gateways"
excerpt: "Upgrade your Docker and Kubernetes gateway instances to the latest version."
categories: installing
slug: upgrading-gateways
toc: true
---

## Upgrading Docker gateways
{: #upgrading-docker-gateways}

To upgrade a Docker {{site.data.reuse.egw}}, delete the existing Docker gateway and replace it with one that uses the Docker image of your target {{site.data.reuse.eem_name}} version. 

1. Edit your [backup](../backup-restore) of the Docker `run` command that you [generated](../install-docker-egw#generating-gateway-docker-config) when you installed the gateway, and update the following properties:

    a. The image reference. Set the image reference to your target version. For example:

    ```shell
    -d icr.io/cpopen/ibm-eventendpointmanagement/egw:11.7.0
    ```
    
    b. If the new version requires an updated licence ID, then update `LICENCE_ID`.

    c. If you made additional configuration changes to your Docker gateway since installation, then ensure that your Docker command includes those changes.

2. Uninstall the previous gateway as described in [uninstalling a Docker {{site.data.reuse.egw}}](../uninstalling/#uninstall-docker-gateway).
3. Run the Docker command that you prepared in step 1. 


## Upgrading Kubernetes Deployment gateways
{: #upgrading-k8s-gateways}

To upgrade a Kubernetes Deployment {{site.data.reuse.egw}}, edit the Kubernetes Deployment and update the following properties:

- The Docker image name that is specified in `spec.template.spec.containers.egw.image`.  Set the image name to the target {{site.data.reuse.eem_name}} version. For example: 

    ```
    icr.io/cpopen/ibm-eventendpointmanagement/egw:11.7.0
    ```

- If the target version requires a new license ID, update `spec.template.spec.containers.egw.LICENSE_ID`.

The gateway pod restarts when the image name is updated.
