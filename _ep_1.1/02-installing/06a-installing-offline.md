---
title: "Installing in an offline environment"
excerpt: "Find out how to install in an offline (also referred to as air-gapped or disconnected) OpenShift environment."
categories: installing
slug: offline
toc: true
---

If you are working in an environment where your cluster is not connected to the internet, you can install {{site.data.reuse.ep_name}} by using the container-based software that is provided as a Container Application Software for Enterprises (CASE) bundle.

CASE is a specification that defines metadata and structure for packaging, managing, and unpacking containerized applications. When deploying in an offline (also referred to as air-gapped or disconnected) environment, you mimic a typical online installation by using images in your own registry. You can use the CASE content to mirror images to an internal registry within your restricted environment, and to install the images from that registry.

{{site.data.reuse.ep_name}} has two operators that must be installed:

- {{site.data.reuse.flink_long}}
- {{site.data.reuse.ep_name}}

Follow the instructions to download the {{site.data.reuse.flink_long}} and {{site.data.reuse.ep_name}} CASE bundles, mirror the images, apply catalog sources, and install the operators on OpenShift and other Kubernetes platforms.

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

- A supported version of {{site.data.reuse.openshift_short}} [installed](https://docs.openshift.com/container-platform/4.14/welcome/index.html){:target="_blank"}. For supported versions, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).
- The {{site.data.reuse.openshift_short}} CLI (`oc`) [installed](https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html){:target="_blank"}.

If you are using other Kubernetes platforms, ensure you have the following set up for your environment:

- A supported version of a Kubernetes platform installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).
- The Kubernetes command-line tool (`kubectl`) [installed](https://kubernetes.io/docs/tasks/tools/){:target="_blank"}.
- The Helm command-line tool (`helm`) [installed](https://helm.sh/docs/intro/install/).
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

Before mirroring your images, download the CASE by following these instructions:

1. Configure the GitHub repository to download the CASE:

   ```shell
   kubectl ibm-pak config repo 'default' -r "https://github.com/IBM/cloud-pak/raw/master/repo/case/" --enable
   ```

2. Run the following command to download, validate, and extract the {{site.data.reuse.flink_long}} CASE.

   ```shell
   kubectl ibm-pak get ibm-eventautomation-flink --version <case-version>
   ```

   Where `<case-version>` is the version of the CASE you want to install. For example:

   ```shell
   kubectl ibm-pak get ibm-eventautomation-flink --version {{site.data.reuse.flink_operator_current_version}}
   ```

   The CASE is downloaded in `~/.ibm-pak` and the following output is displayed:

   ```shell
   Downloading and extracting the CASE ...
   - Success
   Retrieving CASE version ...
   - Success
   Validating the CASE ...
   Validating the signature for the ibm-eventautomation-flink CASE...
   - Success
   Creating inventory ...
   - Success
   Finding inventory items
   - Success
   Resolving inventory items ...
   Parsing inventory items
   - Success
   Download of CASE: ibm-eventautomation-flink, version: 1.1.0 is complete
   ```

3. Run the following command to download, validate, and extract the {{site.data.reuse.ep_name}} CASE.

   ```shell
   kubectl ibm-pak get ibm-eventprocessing --version <case-version>
   ```

   Where `<case-version>` is the version of the CASE you want to install. For example:

   ```shell
   kubectl ibm-pak get ibm-eventprocessing --version {{site.data.reuse.ep_current_version}}
   ```

   The CASE is downloaded in `~/.ibm-pak` and the following output is displayed:

   ```shell
   Downloading and extracting the CASE ...
   - Success
   Retrieving CASE version ...
   - Success
   Validating the CASE ...
   Validating the signature for the ibm-eventprocessing CASE...
   - Success
   Creating inventory ...
   - Success
   Finding inventory items
   - Success
   Resolving inventory items ...
   Parsing inventory items
   - Success
   Download of CASE: ibm-eventprocessing, version: {{site.data.reuse.ep_current_version}} is complete
   ```

   **Note:** To download the latest version of CASE, do not specify the CASE version. For example:

   ```shell
   kubectl ibm-pak get <case-name>
   ```

   Where `<case-name>` is either `ibm-eventprocessing` or `ibm-eventautomation-flink`.

4. Verify that the CASE and images (`.csv`) files have been generated for {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}}.

   For example, ensure that the following files have been generated for {{site.data.reuse.ep_name}}.

   ```shell
   tree ~/.ibm-pak

   ├── config
   │   └── config.yaml
   ├── data
   │   ├── cases
   │   │   └── ibm-eventprocessing
   │   │       └── {{site.data.reuse.ep_current_version}}
   │   │           ├── caseDependencyMapping.csv
   │   │           ├── charts
   │   │           ├── ibm-eventprocessing-{{site.data.reuse.ep_current_version}}-airgap-metadata.yaml
   │   │           ├── ibm-eventprocessing-{{site.data.reuse.ep_current_version}}-charts.csv
   │   │           ├── ibm-eventprocessing-{{site.data.reuse.ep_current_version}}-images.csv
   │   │           ├── ibm-eventprocessing-{{site.data.reuse.ep_current_version}}.tgz
   │   │           └── resourceIndexes
   │   │               └── ibm-eventprocessing-resourcesIndex.yaml
   │   └── mirror
   └── logs
      └── oc-ibm_pak.log

   9 directories, 8 files
   ```


## Configure registry authentication

To mirror images across both the source registry and the target (internal) registry where all images are available publicly, you must create an authentication secret for each. A Docker CLI login (`docker login`) or Podman CLI login (`podman login`) is required for configuring the registry.

A Skopeo CLI login (`skopeo login`) is also required for Kubernetes platforms other than OpenShift.

For {{site.data.reuse.ep_name}}, all images are either present in the IBM Entitled Registry (`cp.icr.io`), which requires authentication, or in the IBM Container Registry (`icr.io/cpopen`), which does not.

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

**Note:** You can configure with separate target registry for {{site.data.reuse.flink_long}} and {{site.data.reuse.ep_name}}. The following documentation instructions consider one target registry for both {{site.data.reuse.flink_long}} and {{site.data.reuse.ep_name}}.

## Mirror the images

The process of mirroring images pulls the image from the internet and pushes it to your local registry. After mirroring your images, you can configure your cluster and complete the offline installation.

Follow the instructions to mirror the images from your host to your offline environment.

### Generate mirror manifests

Run the following command to generate mirror manifests:

- For {{site.data.reuse.flink_long}}:

  ```shell
  kubectl ibm-pak generate mirror-manifests ibm-eventautomation-flink <target-registry> 
  ```

- For {{site.data.reuse.ep_name}}:

  ```shell
  kubectl ibm-pak generate mirror-manifests ibm-eventprocessing <target-registry>
  ```

Where `<target-registry>` is the internal container image registry.

**Note**: To filter for a specific image group, add the parameter `--filter <image_group>` to the previous command.

The previous command generates the following files based on the target internal registry provided:

- catalog-sources.yaml
- catalog-sources-linux-`<arch>`.yaml (if there are architecture specific catalog sources)
- image-content-source-policy.yaml
- images-mapping.txt

### Copy the images to local registry

Run the following command to copy the images to the local registry. Your device must be connected to both the internet and the restricted network environment that contains the local registry.

- If you are installing on the {{site.data.reuse.openshift_short}}, run the following command:

  For {{site.data.reuse.flink_long}}:

  ```shell
  oc image mirror -f ~/.ibm-pak/data/mirror/ibm-eventautomation-flink/<case-version>/images-mapping.txt --filter-by-os '.*'  --skip-multiple-scopes --max-per-registry=1
  ```

  For {{site.data.reuse.ep_name}}:

  ```shell
  oc image mirror -f ~/.ibm-pak/data/mirror/ibm-eventprocessing/<case-version>/images-mapping.txt --filter-by-os '.*' --insecure --skip-multiple-scopes --max-per-registry=1
  ```

- If you are installing on Kubernetes platforms other than OpenShift, run the following command:

  For {{site.data.reuse.flink_long}}:

  ```shell
  cat ~/.ibm-pak/data/mirror/ibm-eventautomation-flink/<case-version>/images-mapping.txt | awk -F'=' '{ print "skopeo copy --all docker://"$1" docker://"$2 }' | xargs -I {} sh -c 'echo {}; {}'
  ```

  For {{site.data.reuse.ep_name}}:

  ```shell
  cat ~/.ibm-pak/data/mirror/ibm-eventprocessing/<case-version>/images-mapping.txt | awk -F'=' '{ print "skopeo copy --all docker://"$1" docker://"$2 }' | xargs -I {} sh -c 'echo {}; {}'
  ```

  **Note:** If you are using a macOS system and encounter the `xargs: command line cannot be assembled, too long` error, add `-S1024` to `xargs`, and run the command as follows:

  For {{site.data.reuse.flink_long}}:

  ```shell
  cat ~/.ibm-pak/data/mirror/ibm-eventautomation-flink/<case-version>/images-mapping.txt | awk -F'=' '{ print "skopeo copy --all docker://"$1" docker://"$2 }' | xargs -S1024 -I {} sh -c 'echo {}; {}'
  ```

  For {{site.data.reuse.ep_name}}:

  ```shell
  cat ~/.ibm-pak/data/mirror/ibm-eventprocessing/<case-version>/images-mapping.txt | awk -F'=' '{ print "skopeo copy --all docker://"$1" docker://"$2 }' | xargs -S1024 -I {} sh -c 'echo {}; {}'
  ```

  Where:

  - `<case-version>` is the version of the CASE file to be copied.


Ensure that all the images have been mirrored to the target registry by checking the registry.


## Create `ImageContentSourcePolicy` on OpenShift platform

**Note:** Only applicable when installing {{site.data.reuse.ep_name}} and the Flink on the {{site.data.reuse.openshift_short}}.

1. {{site.data.reuse.openshift_cli_login}}
2. Update the global image pull secret for your OpenShift cluster by following the steps in [OpenShift documentation](https://docs.openshift.com/container-platform/4.14/openshift_images/managing_images/using-image-pull-secrets.html#images-update-global-pull-secret_using-image-pull-secrets){:target="_blank"}. This enables your cluster to have proper authentication credentials to pull images from your `target-registry`, as specified in the `image-content-source-policy.yaml`.
3. Apply `ImageContentSourcePolicy` YAML by running the following command:

   For {{site.data.reuse.flink_long}}:

   ```shell
   oc apply -f  ~/.ibm-pak/data/mirror/ibm-eventautomation-flink/<case-version>/image-content-source-policy.yaml
   ```

   For {{site.data.reuse.ep_name}}:

   ```shell
   oc apply -f  ~/.ibm-pak/data/mirror/ibm-eventprocessing/<case-version>/image-content-source-policy.yaml
   ```

   Where `<case-version>` is the version of the CASE file.

4. Additionally, a global image pull secret must be added so that images can be pulled from the target registry. Follow the instructions in the [OpenShift documentation](https://github.com/openshift/openshift-docs/blob/main/modules/images-update-global-pull-secret.adoc#updating-the-global-cluster-pull-secret){:target="_blank"} to add credentials for the target registry.

   **Important:**
   Cluster resources must adjust to the new pull secret, which can temporarily limit the access to the cluster. Applying the `ImageSourceContentPolicy` causes cluster nodes to recycle, which results in limited access to the cluster until all the nodes are ready.

5. Verify that the `ImageContentSourcePolicy` resource is created:

   ```shell
   oc get imageContentSourcePolicy
   ```

   **Important**: After the `ImageContentsourcePolicy` and global image pull secret are applied, you might see the node status as `Ready`, `Scheduling`, or `Disabled`. Wait until all the nodes show a `Ready` status.

6. Verify your cluster node status and wait for all nodes to be updated before proceeding:

   ```shell
   oc get MachineConfigPool -w
   ```

## Apply catalog sources to your cluster on OpenShift platform

**Note:** Only applicable when you install {{site.data.reuse.ep_name}} on the {{site.data.reuse.openshift_short}}.

Apply the catalog sources for the operators to the cluster by running the following command:


For {{site.data.reuse.flink_long}}:

```shell
oc apply -f ~/.ibm-pak/data/mirror/ibm-eventautomation-flink/<case-version>/catalog-sources-linux-amd64.yaml
```

For {{site.data.reuse.ep_name}}:

```shell
oc apply -f ~/.ibm-pak/data/mirror/ibm-eventprocessing/<case-version>/catalog-sources-linux-amd64.yaml
```

Where `<case-version>` is the version of the CASE file.


## Install the operator

Follow the instructions to install the operator based on your platform.

### Installing on OpenShift
 
After you consider the operator requirements, resource requirements, and cluster-scoped permissions, you can install the operators by using the {{site.data.reuse.openshift_short}} web console. For more information, see the instructions for installing [{{site.data.reuse.flink_long}}](../installing/#installing-the-ibm-operator-for-apache-flink) and the [{{site.data.reuse.ep_name}} operator](../installing/#installing-the-event-processing-operator).

### Installing on other Kubernetes platforms by using the `kubectl`

Complete the following steps to install the operator:

1. Create a namespace where you want to install the operator:

   ```shell
   kubectl create namespace <target-namespace>
   ```

2. Create an image pull secret called `ibm-entitlement-key` in the namespace where you want to install the {{site.data.reuse.ep_name}} and the {{site.data.reuse.flink_long}} operator. The secret enables container images to be pulled from the target registry:

   ```shell
   kubectl create secret docker-registry ibm-entitlement-key --docker-username="<target-registry-user>" --docker-password="<target-registry-password>" --docker-server="<target-registry>" -n <target-namespace>
   ```

   Where:
    - `<target-registry-user>` is the username that you provide to authenticate with your internal registry.
    - `<target-registry-password>` is the password associated with the `<target-registry-user>`.
    - `<target-registry>` is the internal registry hosting the operator images.
    - `<target-namespace>` is the namespace where you want to install {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}}.
   
   **Note:** If you are installing the instance in a different namespace, create the image pull secret (`ibm-entitlement-key`) again in the namespace where you want to install the instance.

3. Install the {{site.data.reuse.flink_long}} Custom Resource Definitions (CRDs) by using the Helm CLI:

   ```shell
   helm install <release-name> ~/.ibm-pak/data/cases/ibm-eventautomation-flink/<case-version>/charts/ibm-eventautomation-flink-operator-crd-<case-version>.tgz -n <target-namespace>
   ```

   Where:
    - `<release-name>` is the name that you provide to identify the Helm release of the Flink CRDs.
    - `<case-version>` is the CASE version.
    - `<target-namespace>` is the namespace where you want to install {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}}.

4. Install the {{site.data.reuse.flink_long}} by using the Helm CLI:

   ```shell
   helm install <release-name> ~/.ibm-pak/data/cases/ibm-eventautomation-flink/<case-version>/charts/ibm-eventautomation-flink-operator-<case-version>.tgz -n <target-namespace> --set imagePullPolicy="Always" --set public.repo=<target_registry> --set public.path="cpopen/" --set private.repo=<target_registry> --set private.path="cp/ibm-eventautomation-flink/" --set watchAnyNamespace=<true/false>
   ```

   Where:
    - `<release-name>` is the name that you provide to identify the Helm release of the Flink operator.
    - `<case-version>` is the CASE version.
    - `<target-namespace>` is the namespace where you want to install {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}}.
    - `<target_registry>` is the internal container image registry.

   **Important:** If your private registry requires authentication, run the following command to add the image pull secret to the Flink service account:

   ```shell
   kubectl patch serviceaccount flink -p '{"imagePullSecrets": [{"name": "ibm-entitlement-key"}]}' -n <NAMESPACE>
   ```

5. Install the {{site.data.reuse.ep_name}} CRDs by using the Helm CLI:

   ```shell
   helm install <release-name> ~/.ibm-pak/data/cases/ibm-eventprocessing/<case-version>/charts/ibm-ep-operator-crd-<case-version>.tgz -n <target-namespace>
   ```

   Where:
    - `<release-name>` is the name that you provide to identify the Helm release responsible for the {{site.data.reuse.ep_name}} CRDs.
    - `<case-version>` is the CASE version.
    - `<target-namespace>` is the namespace where you want to install {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}}.

  
6. Install the {{site.data.reuse.ep_name}} operator by using the Helm CLI:

   ```shell
   helm install <release-name> ~/.ibm-pak/data/cases/ibm-eventprocessing/<case-version>/charts/ibm-ep-operator-<case-version>.tgz -n <target-namespace> --set imagePullPolicy="Always" --set public.repo=<target_registry> --set public.path="cpopen/" --set private.repo=<target_registry> --set private.path="cp/ibm-eventprocessing/" --set watchAnyNamespace=<true/false>
   ```

   Where:
   - `<release-name>` is the name that you provide to identify the helm release responsible for the event processing operator.
   - `<case-version>` is the CASE version.
   - `<target-namespace>` is the namespace where you want to install {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}}.
   - `<target_registry>` is the internal container image registry.

Wait for the installation to complete.

## Install an instance

{{site.data.reuse.ep_name}} and Flink Deployment instances can be created after the operators are installed. You can install the instances by using the {{site.data.reuse.openshift_short}} web console. For more information, see the instructions for installing the [Flink Deployment instances](../installing/#install-a-flink-instance) and the [{{site.data.reuse.ep_name}} instances](../installing/#install-an-event-processing-instance).

**Important:** If you encounter `ImagePullBackOff` errors when installing an instance of `FlinkDeployment`, add the `ibm-entitlement-key` to the service account as described in [troubleshooting](../../troubleshooting/flink-imagepullbackoff/).