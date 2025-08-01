---
title: "Installing the Manager in an offline environment"
excerpt: "Find out how to install in an offline (also referred to as air-gapped or disconnected) OpenShift environment."
categories: installing
slug: offline
toc: true
---

If you are working in an environment where your cluster is not connected to the internet, you can install {{site.data.reuse.eem_name}} by using the container-based software that is provided as a Container Application Software for Enterprises (CASE) bundle.

CASE is a specification that defines metadata and structure for packaging, managing, and unpacking containerized applications. When deploying in an offline (also referred to as air-gapped or disconnected) environment, you mimic a typical online installation by using images in your own registry. You can use the CASE content to mirror images to an internal registry within your restricted environment, and to install the images from that registry.

Follow the instructions to download the {{site.data.reuse.eem_name}} CASE bundle, mirror the image, apply the catalog source, and install the operator on OpenShift and other Kubernetes platforms.

**Note:** For completing tasks by using the command line, you can use both `kubectl` and `oc` commands if your deployment is on the {{site.data.reuse.openshift_short}}. This documentation set includes instructions that use the `kubectl` command, except for cases where the task is specific to OpenShift.


## Prerequisites

Ensure you have the following set up for your environment:

- A computer with access to both the public internet and the network-restricted environment on which you can run the required commands. This computer must also have access to a local registry and to the {{site.data.reuse.openshift_short}} clusters, and is referred to as a *bastion host*.
- [Docker](https://docs.docker.com/engine/install/){:target="_blank"} or [Podman CLI](https://podman.io/getting-started/installation.html){:target="_blank"} installed.
- A private container registry that can be accessed by the cluster and the bastion host, and which will be used to store all images in your restricted network.
  
  **Important:** If your private container registry is using a self-signed certificate, ensure that the certificate is trusted by your OpenShift or Kubernetes cluster. Contact your cluster vendor for more information.

- The IBM Catalog Management Plug-in for IBM Cloud Paks (`ibm-pak`) [installed](https://github.com/IBM/ibm-pak#readme){:target="_blank"}. This plug-in allows you to run `kubectl ibm-pak` commands against the cluster. To run `kubectl ibm-pak` commands, complete the following steps:

  1. [Download](https://github.com/IBM/ibm-pak/releases){:target="_blank"} the recent version of the `ibm-pak` plug-in for your architecture and operating system.

  2. Extract the downloaded plug-in and add the plug-in to the `kubectl-ibm_pak` directory. For example, to add the `oc-ibm_pak-darwin-arm64.tar.gz` plug-in to the `kubectl-ibm_pak` directory, run:

     ```shell
     KUBECTL_PATH="$(dirname $(which kubectl))"
     tar xvf oc-ibm_pak-darwin-arm64.tar.gz -C ${KUBECTL_PATH} --exclude LICENSE
     mv ${KUBECTL_PATH}/oc-ibm_pak-darwin-arm64 ${KUBECTL_PATH}/oc-ibm_pak
     ln ${KUBECTL_PATH}/oc-ibm_pak ${KUBECTL_PATH}/kubectl-ibm_pak
     ```

     **Note:** If you are running on macOS, remove the quarantine:

     ```shell
     xattr -d com.apple.quarantine /opt/homebrew/bin/oc-ibm_pak
     ```

  3. Run the following command to confirm that `ibm-pak` is installed:

     ```shell
     kubectl ibm-pak --help
     ```


If you are using {{site.data.reuse.openshift}}, ensure you have the following set up for your environment:

- A supported version of {{site.data.reuse.openshift_short}} [installed](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/about/welcome-index){:target="_blank"}. For supported versions, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).
- The {{site.data.reuse.openshift_short}} CLI (`oc`) [installed](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/cli_tools/openshift-cli-oc#cli-about-cli_cli-developer-commands){:target="_blank"}.

If you are using other Kubernetes platforms, ensure you have the following set up for your environment:

- A supported version of a Kubernetes platform installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).
- The Kubernetes command-line tool (`kubectl`) [installed](https://kubernetes.io/docs/tasks/tools/){:target="_blank"}.
- The Helm command-line tool (`helm`)  [installed](https://helm.sh/docs/intro/install/).
- Skopeo [installed](https://github.com/containers/skopeo/blob/main/install.md) to move images from one repository to another.


## Prepare your host

You must be able to connect your bastion host to the internet and to the restricted network environment (with access to the {{site.data.reuse.openshift_short}} cluster and the local registry) at the same time.

Ensure that the prerequisites are set up and that the bastion host can access:

- The public internet to download the CASE and images.
- The target (internal) image registry where all the images will be mirrored to.
- The OpenShift or other Kubernetes cluster to install the operator on.

**Note:** In the absence of a bastion host, prepare a portable device with public internet access to download the CASE and images and a target registry where the images will be mirrored.

**Important:** Ensure you have access to the Kubernetes cluster by running the `kubectl get namespaces` command which lists all the available namespaces.

## Download the CASE bundle

Before mirroring your images, set the environment variables for the CASE images on your host, and then download the CASE by following these instructions:

1. Configure the GitHub repository to download the CASE:

   ```shell
   kubectl ibm-pak config repo 'default' -r "https://github.com/IBM/cloud-pak/raw/master/repo/case/" --enable
   ```

2. Run the following command to download, validate, and extract the latest {{site.data.reuse.eem_name}} CASE version.

   ```shell
   kubectl ibm-pak get ibm-eventendpointmanagement
   ```
   
   The CASE is downloaded in `~/.ibm-pak` and the following output is displayed:

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
   Download of CASE: ibm-eventendpointmanagement, version: 11.5.1 is complete
   ```

   **Note:** You can also specify the version of the CASE you want to install by using `--version <case-version>`.

3. Verify that the CASE and images (`.csv`) files have been generated for {{site.data.reuse.eem_name}}.

   For example, ensure that the following files have been generated for {{site.data.reuse.eem_name}}.

   ```shell
   tree ~/.ibm-pak

   ├── config
   │   └── config.yaml
   ├── data
   │   ├── cases
   │   │   └── ibm-eventendpointmanagement
   │   │       └── 11.5.1
   │   │           ├── caseDependencyMapping.csv
   │   │           ├── charts
   |   |           |   ├── ibm-eem-operator-11.5.1.tgz
   |   |           |   └── ibm-eem-operator-crd-11.5.1.tgz
   │   │           ├── component-set-config.yaml
   │   │           ├── ibm-eventendpointmanagement-11.5.1-airgap-metadata.yaml
   │   │           ├── ibm-eventendpointmanagement-11.5.1-charts.csv
   │   │           ├── ibm-eventendpointmanagement-11.5.1-images.csv
   │   │           ├── ibm-eventendpointmanagement-11.5.1.tgz
   │   │           └── resourceIndexes
   │   │               └── ibm-eventendpointmanagement-resourcesIndex.yaml
   │   └── mirror
   └── logs
      └── oc-ibm_pak.log

   9 directories, 8 files
   ```


## Configure registry authentication

To mirror images across both the source registry and the target (internal) registry where all images are available publicly, you must create an authentication secret for each. A Docker CLI login (`docker login`) or Podman CLI login (`podman login`) is required for configuring the registry.

A Skopeo CLI login (`skopeo login`) is also required for Kubernetes platforms other than OpenShift.

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

Additionally, if you are installing on Kubernetes platforms other than OpenShift, run the following command:


```shell
skopeo login <source-registry> -u <source-registry-user> -p <source-registry-pass>
```

### Creating an authentication secret for the target registry

Run the following command to create an authentication secret for the target registry:

```shell
docker login <target-registry> --username <target-registry-user> --password <target-registry-pass>
```

Additionally, if you are running on Kubernetes platforms other than OpenShift, run the following command:

```shell
skopeo login <target-registry> -u <target-registry-user> -p <target-registry-pass>
```

Where:

- `<target-registry>` is the internal container image registry.
- `<target-registry-user>` is the username for the internal container image registry.
- `<target-registry-pass>` is the password for the internal container image registry.


## Mirror the images

The process of mirroring images pulls the image from the internet and pushes it to your local registry. After mirroring your images, you can configure your cluster and complete the offline installation.

Complete the following steps to mirror the images from your host to your offline environment:

1. Run the following command to generate mirror manifests:

   ```shell
   kubectl ibm-pak generate mirror-manifests ibm-eventendpointmanagement <target-registry>
   ```

   Where `<target-registry>` is the internal container image registry.

   **Note:** To filter for a specific image group, add the parameter `--filter <image_group>` to the previous command.

   The previous command generates the following files based on the target internal registry provided:

   - catalog-sources.yaml
   - catalog-sources-linux-`<arch>`.yaml (if there are architecture specific catalog sources)
   - image-content-source-policy.yaml
   - images-mapping.txt

2. Run the following command to copy the images to the local registry. Your device must be connected to both the internet and the restricted network environment that contains the local registry.

   If you are installing on the {{site.data.reuse.openshift_short}}, run the following command:

   ```shell
   oc image mirror -f ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case-version>/images-mapping.txt --filter-by-os '.*' --insecure --skip-multiple-scopes --max-per-registry=1
   ```

   If you are installing on Kubernetes platforms other than OpenShift, run the following command:

   ```shell
   cat ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case-version>/images-mapping.txt | awk -F'=' '{ print "skopeo copy --all docker://"$1" docker://"$2 }' | xargs -I {} sh -c 'echo {}; {}'
   ```

   **Note:** If you are using a macOS system and encounter the `xargs: command line cannot be assembled, too long` error, add `-S1024` to `xargs`, and run the command as follows:

   ```shell
   cat ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case-version>/images-mapping.txt | awk -F'=' '{ print "skopeo copy --all docker://"$1" docker://"$2 }' | xargs -S1024 -I {} sh -c 'echo {}; {}'
   ```

   Where:


   - `<case-version>` is the version of the CASE file to be copied.


Ensure that all the images have been mirrored to the target registry by checking the registry.

## Create `ImageContentSourcePolicy` on OpenShift platform


**Note:** Only applicable when installing {{site.data.reuse.eem_name}} on the {{site.data.reuse.openshift_short}}.


1. {{site.data.reuse.openshift_cli_login}}
2. Update the global image pull secret for your OpenShift cluster by following the steps in [OpenShift documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/images/managing-images#images-update-global-pull-secret_using-image-pull-secrets){:target="_blank"}. This enables your cluster to have proper authentication credentials to pull images from your `target-registry`, as specified in the `image-content-source-policy.yaml`.
3. Apply `ImageContentSourcePolicy` YAML by running the following command:

   ```shell
   oc apply -f  ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case-version>/image-content-source-policy.yaml
   ```

   Where `<case-version>` is the version of the CASE file.

4. Additionally, a global image pull secret must be added so that images can be pulled from the target registry. Follow the instructions in the [OpenShift documentation](https://github.com/openshift/openshift-docs/blob/main/modules/images-update-global-pull-secret.adoc#updating-the-global-cluster-pull-secret){:target="_blank"} to add credentials for the target registry.

   **Important:** Cluster resources must adjust to the new pull secret, which can temporarily limit the access to the cluster. Applying the `ImageSourceContentPolicy` causes cluster nodes to recycle, which results in limited access to the cluster until all the nodes are ready.

5. Verify that the `ImageContentSourcePolicy` resource is created:

   ```shell
   oc get imageContentSourcePolicy
   ```

   **Important:** After the `ImageContentsourcePolicy` and global image pull secret are applied, you might see the node status as `Ready`, `Scheduling`, or `Disabled`. Wait until all the nodes show a `Ready` status.

6. Verify your cluster node status and wait for all nodes to be updated before proceeding:

   ```shell
   oc get MachineConfigPool -w
   ```

## Apply catalog sources to your cluster on OpenShift platform

**Note:** Only applicable when you install {{site.data.reuse.eem_name}} on the {{site.data.reuse.openshift_short}}.

Apply the catalog sources for the operator to the cluster by running the following command:

```shell
oc apply -f ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case-version>/catalog-sources.yaml
``` 

Where `<case-version>` is the version of the CASE you want to install.

## Install the operator

If you are installing the operator for the first time, complete the instructions in the following sections to install it on the platform that you are using.

If you are upgrading an existing offline installation, follow the [upgrading](../upgrading) instructions to upgrade your operator to the version that you [downloaded](#download-the-case-bundle) and [mirrored](#mirror-the-images) earlier.

**Important:** You can only install one version of the {{site.data.reuse.eem_name}} operator on a cluster. Installing multiple versions on a single cluster is not supported due to possible compatibility issues as they share the same Custom Resource Definitions (CRDs), making them unsuitable for coexistence.

### Installing on OpenShift
 
After you consider the operator requirements, resource requirements, and cluster-scoped permissions, you can install the operator by using the {{site.data.reuse.openshift_short}} web console or command line. For more information, see the instructions for installing the [{{site.data.reuse.eem_name}} operator](../../installing/installing/#install-the-event-endpoint-management-operator).


### Installing on other Kubernetes platforms by using the `kubectl`

Complete the following steps to install the operator:

1. Create a namespace where you want to install the operator:

   ```shell
   kubectl create namespace <target-namespace>
   ```

2. Create an image pull secret called `ibm-entitlement-key` in the namespace where you want to install the {{site.data.reuse.eem_name}} operator. The secret enables container images to be pulled from the target registry:

   ```shell
   kubectl create secret docker-registry ibm-entitlement-key --docker-username="<target-registry-user>" --docker-password="<target-registry-password>" --docker-server="<target-registry>" -n <target-namespace>
   ```

   Where:
   - `<target-registry-user>` is the username that you provide to authenticate with your internal registry.
   - `<target-registry-password>` is the password associated with the `<target-registry-user>`.
   - `<target-registry>` is the internal registry hosting the operator images.
   - `<target-namespace>` is the namespace where you want to install {{site.data.reuse.eem_name}}.
   
   **Note:** If you are installing the instance in a different namespace, create the image pull secret (`ibm-entitlement-key`) again in the namespace where you want to install the instance.

3. Install the operator Custom Resource Definitions (CRD) by using the Helm CLI:

   ```shell
   helm install <release-name> ~/.ibm-pak/data/cases/ibm-eventendpointmanagement/<case-version>/charts/ibm-eem-operator-crd-<case-version>.tgz -n <target-namespace>
   ```

   Where:
   - `<release-name>` is the name that you provide to identify the Helm release of the CRDs.
   - `<case-version>` is the CASE version.
   - `<target-namespace>` is the namespace where you want to install {{site.data.reuse.eem_name}}.
   - `<target-registry>` is the internal container image registry.


4. Install the operator by using the Helm CLI:

   ```shell
   helm install <release-name> ~/.ibm-pak/data/cases/ibm-eventendpointmanagement/<case-version>/charts/ibm-eem-operator-<case-version>.tgz -n <target-namespace> --set imagePullPolicy="Always" --set public.repo=<target-registry> --set public.path="cpopen/" --set private.repo=<target-registry> --set private.path="cp/ibm-eventendpointmanagement/" --set watchAnyNamespace=<true/false>
   ```

   Where:
   - `<release-name>` is the name that you provide to identify your operator.
   - `<target-namespace>` is the namespace where you want to install the {{site.data.reuse.eem_name}}.
   - `<case-version>` is the CASE version.
   - `<target-registry>` is the internal container image registry.

Wait for the installation to complete.

## Install the {{site.data.reuse.eem_manager}} instance

The {{site.data.reuse.eem_manager}} instance can be created after the operators are installed. You can install the instance by using the {{site.data.reuse.openshift_short}} web console. For more information, see the instructions for installing the {{site.data.reuse.eem_manager}} instance on [OpenShift](../installing/#install-an-event-manager-instance), or on other [Kubernetes platforms](../installing-on-kubernetes/#install-an-event-manager-instance). 

## Install the {{site.data.reuse.egw}} instance

Follow the instructions in [installing an {{site.data.reuse.egw}}](../install-gateway) to install an {{site.data.reuse.egw}} on the same cluster.

**Note:** Docker and Kubernetes Deployment {{site.data.reuse.egw}} instances can only be installed in an online environment.

