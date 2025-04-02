---
title: "Upgrading Docker gateways"
excerpt: "Upgrade your Docker gateway instances to the latest version."
categories: installing
slug: upgrading-gateways
toc: true
---

## Upgrading Docker gateways
{: #upgrading-docker-gateways}

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
  -d icr.io/cpopen/ibm-eventendpointmanagement/egw:11.5.0
   ```

   If the upgrade requires a new license, set this in `<new license ID>`.

   Set the properties as follows:
   
   - `backendURL` Set to the value that you used for the `EEM_BACKEND_URL` property when you installed your gateway.
   - `KAFKA_ADVERTISED_LISTENER` Set to the value that you used when you installed your gateway.
   - `BACKEND_CA_CERTIFICATES` Set to the value that you used for `PATH_TO_CERTIFICATES` property when you installed your gateway.

   <!-- DRAFT COMMENT: for 11.5.1 we're going to add   -e API_KEY="<original API KEY>" \ to above. But 11.4 users won't have an API_KEY -->

   If you made additional [configuration](../configuring) changes to your Docker gateway, ensure that your Docker command includes those changes.

2. Uninstall the previous gateway as described in [uninstalling a Docker {{site.data.reuse.egw}}](../uninstalling/#uninstall-docker-gateway).
3. Run the Docker command that you prepared in step 1. 

<!-- ## Upgrading Kubernetes Deployment gateways
{: #upgrading-k8s-gateways}

To upgrade a Kubernetes Deployment {{site.data.reuse.egw}}, edit the Kubernetes Deployment and update the Docker image name.

1. Edit your Kubernetes Deployment {{site.data.reuse.egw}}

    ```shell
     kubectl -n <namespace> edit deploy <deployment name>
    ```

2. Set `spec.template.spec.containers.egw.image` to the image name of the target {{site.data.reuse.egw}} version.

3. If required, update the `spec.template.spec.containers.egw.LICENSE_ID`.

4. Save your updated Kubernetes Deployment. The gateway pod restarts with the new image. 

DRAFT COMMENT: Remember to update page title to include Kubernetes Deployments when 11.5.1 releases.
-->