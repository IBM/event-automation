---
title: "Upgrading Docker and Kubernetes gateways"
excerpt: "Upgrade your Docker and Kubernetes gateway instances to the latest version."
categories: installing
slug: upgrading-gateways
toc: true
---

## Upgrading Docker gateways
{: #upgrading-docker-gateways}

The steps to upgrade a Docker {{site.data.reuse.egw}} depend on the version of {{site.data.reuse.eem_name}} the gateway is from.

### Upgrading Docker gateways from 11.4.2 or earlier
{: #upgrading-pre115-docker-gateways}

The following steps apply to all gateways from {{site.data.reuse.eem_name}} version 11.4.2 or earlier.

To upgrade a Docker {{site.data.reuse.egw}}, delete the existing Docker gateway and replace it with one that uses the Docker image of your target {{site.data.reuse.egw}} version. 

1. Prepare the Docker `run` command for your upgraded gateway. For example:

    ```shell
    docker run \
    -e backendURL="<manager endpoint>" \
    -e swid="EA/CP4I" \
    -e KAFKA_ADVERTISED_LISTENER="<gateway endpoint>" \
    -e BACKEND_CA_CERTIFICATES="-----BEGIN CERTIFICATE-----\nMIID..." \
    -e GATEWAY_PORT=8443 \
    -p 8443:8443 \
    -e LICENSE_ID="<new license ID>" \
    -e ACCEPT_LICENSE="true" \
    -d icr.io/cpopen/ibm-eventendpointmanagement/egw:11.6.3
    ```

   Set the properties as follows:
   
   - `backendURL` Set to the value that you used for the `EEM_BACKEND_URL` property when you installed your gateway.
   - `KAFKA_ADVERTISED_LISTENER` Set to the value that you used when you installed your gateway.
   - `BACKEND_CA_CERTIFICATES` Set to the value that you used for `PATH_TO_CERTIFICATES` property when you installed your gateway.
   - `LICENSE_ID` If a new license ID is required for the target version, then set this here. Otherwise, use the existing license ID. 
   
   If you made other configuration changes to your Docker gateway, ensure that your Docker command includes those changes.

2. Uninstall the previous gateway as described in [uninstalling a Docker {{site.data.reuse.egw}}](../uninstalling/#uninstall-docker-gateway).
3. Run the Docker command that you prepared in step 1. 

### Upgrading Docker gateways from 11.5.0 or later
{: #upgrading-post115docker-gateways}

These steps apply to all gateways from {{site.data.reuse.eem_name}} version 11.5.0 or later. If your gateway was originally deployed from an earlier version, see the steps for [upgrading gateways from 11.4.2 or earlier](#upgrading-pre115-docker-gateways).

To upgrade a Docker {{site.data.reuse.egw}}, delete the existing Docker gateway and replace it with one that uses the Docker image of your target {{site.data.reuse.eem_name}} version. 

1. Edit your [backup](../backup-restore) of the Docker `run` command that you [generated](../install-docker-egw#generating-gateway-docker-config) when you installed the gateway, and update the following properties:

    a. The image reference. Set the image reference to your target version. For example:

    ```shell
    -d icr.io/cpopen/ibm-eventendpointmanagement/egw:11.6.3
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
    icr.io/cpopen/ibm-eventendpointmanagement/egw:11.6.3
    ```

- If the target version requires a new license ID, update `spec.template.spec.containers.egw.LICENSE_ID`.

The gateway pod restarts when the image name is updated.

