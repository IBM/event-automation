---
title: "Installing the Manager in an offline OpenShift environment"
excerpt: "Find out how to install in an offline (also referred to as air-gapped or disconnected) OpenShift environment."
categories: installing
slug: offline
toc: true
---

If you are working in an environment where your cluster is not connected to the internet, you can install {{site.data.reuse.eem_name}} by using the container-based software that is provided as a Container Application Software for Enterprises (CASE) bundle.

CASE is a specification that defines metadata and structure for packaging, managing, and unpacking containerized applications. When deploying in an offline (also referred to as air-gapped or disconnected) environment, you mimic a typical online installation by using images in your own registry. You can use the CASE content to mirror images to an internal registry within your restricted environment, and to install the images from that registry.

Follow the instructions to download the {{site.data.reuse.eem_name}} CASE bundle, mirror the images, apply catalog source, and install the operators.

## Prerequisites

Ensure you have the following set up for your environment:

- A computer with access to both the public internet and the network-restricted environment on which you can run the required commands. This computer must also have access to a local registry and to the {{site.data.reuse.openshift_short}} clusters, and is referred to as a *bastion host*.
- [Docker](https://docs.docker.com/engine/install/){:target="_blank"} or [Podman CLI](https://podman.io/getting-started/installation.html){:target="_blank"} installed.
- A private container registry that can be accessed by the cluster and the bastion host, and which will be used to store all images in your restricted network.
- A supported version of {{site.data.reuse.openshift_short}} [installed](https://docs.openshift.com/container-platform/4.12/installing/index.html#installation-overview_ocp-installation-overview){:target="_blank"}. See the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for supported versions.
- A supported version of the IBM Cert Manager [installed](../prerequisites#ibm-cert-manager).
- The {{site.data.reuse.openshift_short}} CLI (`oc`) [installed](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html){:target="_blank"}.
- The IBM Catalog Management Plug-in for IBM Cloud Paks (`ibm-pak`) [installed](https://github.com/IBM/ibm-pak#readme){:target="_blank"}. After installing the plug-in, you can run `oc ibm-pak` commands against the cluster. Run the following command to confirm that `ibm-pak` is installed:

  ```shell
  oc ibm-pak --help
  ```

## Prepare your host

You must be able to connect your bastion host to the internet and to the restricted network environment (with access to the {{site.data.reuse.openshift_short}} cluster and the local registry) at the same time.

Ensure that the prerequisites are set up and that the bastion host can access:

- The public internet to download the CASE and images.
- The target (internal) image registry where all the images will be mirrored to.
- The OpenShift cluster to install the operator on.

**Note:** In the absence of a bastion host, prepare a portable device with public internet access to download the CASE and images and a target registry where the images will be mirrored.

## Download the CASE bundle

Before mirroring your images, set the environment variables for the CASE images on your host, and then download the CASE by following these instructions:

1. Run the following command to download, validate, and extract the CASE.

   ```shell
   oc ibm-pak get ibm-eventendpointmanagement
   ```

   The latest CASE is downloaded in `~/.ibm-pak` and the following output is displayed:

   ```shell
   Downloading and extracting the CASE ...
   - Success
   Retrieving CASE version ...
   - Success
   Validating the CASE ...
   Validating the signature for the ibm-eventendpointmanagement CASE...
   - Success
   Creating inventory ...
   - Success
   Finding inventory items
   - Success
   Resolving inventory items ...
   Parsing inventory items
   - Success
   Download of CASE: ibm-eventendpointmanagement, version: 11.0.6 is complete
   ```

   **Note**: To download a specific version of CASE, run the following command:

   ```shell
   oc ibm-pak get ibm-eventendpointmanagement --version <case-version>
   ```

   Where:
   - `<case-version>` is the version of the CASE file to be downloaded.

   **Note**: If you do not specify the CASE version, it downloads the latest version.

2. Verify that the CASE and images (`.csv`) files have been generated for {{site.data.reuse.eem_name}}.

   For example, ensure the following files have been generated for {{site.data.reuse.eem_name}}.

   ```shell
   tree ~/.ibm-pak

   ├── config
   │   └── config.yaml
   ├── data
   │   ├── cases
   │   │   └── ibm-eventendpointmanagement
   │   │       └── 11.0.6
   │   │           ├── caseDependencyMapping.csv
   │   │           ├── charts
   │   │           ├── component-set-config.yaml
   │   │           ├── ibm-eventendpointmanagement-11.0.6-airgap-metadata.yaml
   │   │           ├── ibm-eventendpointmanagement-11.0.6-charts.csv
   │   │           ├── ibm-eventendpointmanagement-11.0.6-images.csv
   │   │           ├── ibm-eventendpointmanagement-11.0.6.tgz
   │   │           └── resourceIndexes
   │   │               └── ibm-eventendpointmanagement-resourcesIndex.yaml

   9 directories, 8 files
   ```


## Configure registry authentication

<!--Only offline environment -->


To mirror images across both the source registry and the target (internal) registry where all images are available publicly, you must create an authentication secret for each. A Docker CLI login (`docker login`) or Podman CLI login (`podman login`) is required for configuring the registry.

For {{site.data.reuse.eem_name}}, all images are either present in the IBM Entitled Registry (`cp.icr.io`), which requires authentication, or in the IBM Container Registry (`icr.io/cpopen`), which does not.

### Creating an authentication secret for the source registry

Run the following command to create an authentication secret for the source registry:

```shell
docker login <source-registry> --username <source-registry-user> --password <source-registry-pass>
```

Where:

- `<source-registry>` is the Entitled Registry (`cp.icr.io`).
- `<source-registry-user>` is your username.
- `<source-registry-pass>` is your entitlement key.

### Creating an authentication secret for the target registry

Run the following command to create an authentication secret for the target registry:

```shell
docker login <target-registry> --username <target-registry-user> --password <target-registry-pass>
```

Where:

- `target-registry` is the internal container image registry.
- `target-registry-user` is the username for the internal container image registry.
- `target-registry-pass` is the password for the internal container image registry.

**Note:** You can configure with separate target registry for {{site.data.reuse.flink_long}} and {{site.data.reuse.eem_name}}. The following documentation instructions consider one target registry for both {{site.data.reuse.flink_long}} and {{site.data.reuse.eem_name}}.

## Mirror the images

<!--Only offline environment -->

The process of mirroring images pulls the image from the internet and pushes it to your local registry. After mirroring your images, you can configure your cluster and complete the offline installation.

Complete the following steps to mirror the images from your host to your offline environment:

1. Run the following command to generate mirror manifests:

   ```shell
   oc ibm-pak generate mirror-manifests ibm-eventendpointmanagement <target-registry>
   ```

   Where`target-registry` is the internal container image registry.

   **Note**: To filter for a specific image group, add the parameter `--filter <image_group>` to the previous command.

   The previous command generates the following files based on the target internal registry provided:

   - catalog-sources.yaml
   - catalog-sources-linux-`<arch>`.yaml (if there are architecture specific catalog sources)
   - image-content-source-policy.yaml
   - images-mapping.txt

2. Run the following command to copy the images to the local registry. Your device must be connected to both the internet and the restricted network environment that contains the local registry.

   ```shell
   oc image mirror -f ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case-version>/images-mapping.txt --filter-by-os '.*' --skip-multiple-scopes --max-per-registry=1
   ```

   Where:
   - `<case-version>` is the version of the CASE file to be downloaded.
   - `target-registry` is the internal container image registry.

## Create `ImageContentSourcePolicy`

<!--Only offline environment -->

1. {{site.data.reuse.openshift_cli_login}}
2. Update the global image pull secret for your OpenShift cluster by following the steps in [OpenShift documentation](https://docs.openshift.com/container-platform/4.12/openshift_images/managing_images/using-image-pull-secrets.html#images-update-global-pull-secret_using-image-pull-secrets){:target="_blank"}. This enables your cluster to have proper authentication credentials to pull images from your `target-registry`, as specified in the `image-content-source-policy.yaml`.
3. Apply `ImageContentSourcePolicy` YAML by running the following command for Apache Flink:

   ```shell
   oc apply -f  ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case-version>/image-content-source-policy.yaml
   ```

   Where `<case-version>` is the version of the CASE file to be downloaded.

Verify that the `ImageContentSourcePolicy` resource is created:

```shell
oc get imageContentSourcePolicy
```

**Important**: After the `ImageContentsourcePolicy` and global image pull secret are applied, you might see the node status as `Ready`, `Scheduling`, or `Disabled`. Wait until all the nodes show a `Ready` status.

Verify your cluster node status and wait for all nodes to be updated before proceeding:

```shell
oc get MachineConfigPool -w
```

## Apply catalog sources to your cluster

Apply the catalog sources for the operator to the cluster by running the following command:

```shell
oc apply -f ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case-version>/catalog-sources-linux-amd64.yaml
```

## Install the operator

After considering the operator requirements, resource requirements, and cluster-scoped permissions, you can install the operator by using the {{site.data.reuse.openshift_short}} web console. For more information, see the instructions for installing the [{{site.data.reuse.eem_name}} operator](../../installing/installing/#install-the-event-endpoint-management-operator-by-using-the-web-console).

## Install an instance

{{site.data.reuse.eem_name}} and Event Gateway instances can be created after the operators are installed. You can install the instances by using the {{site.data.reuse.openshift_short}} web console. For more information, see the instructions for installing the [{{site.data.reuse.eem_name}} (`manager`) instance](../../installing/installing/#install-an-event-endpoint-management-manager-instance) and the [Event Gateway instance](../../installing/deploy-gateways/).

**Note:** [Stand-alone](../standalone-gateways/) {{site.data.reuse.egw}} instances can only be installed in an online environment.
