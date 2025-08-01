---
title: "Installing on other Kubernetes platforms"
excerpt: "Find out how to install Event Streams on other Kubernetes platforms."
categories: installing
slug: installing-on-kubernetes
toc: true
---

The following sections provide instructions about installing {{site.data.reuse.es_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

## Overview

{{site.data.reuse.es_name}} is an [operator-based](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/){:target="_blank"} release and uses custom resources to define your {{site.data.reuse.es_name}} configurations. The {{site.data.reuse.es_name}} operator uses the custom resources to deploy and manage the entire lifecycle of your {{site.data.reuse.es_name}} instances. Custom resources are presented as YAML configuration documents that define instances of the `EventStreams` custom resource type.

When deploying in an air-gapped (also referred to as offline or disconnected) environment, follow the instructions in the [offline installation](../offline) to install {{site.data.reuse.es_name}} on OpenShift and other Kubernetes platforms by using the CASE package.


Installing {{site.data.reuse.es_name}} has two phases:

1. Use Helm to install the {{site.data.reuse.es_name}} operator: this will deploy the operator that will install and manage your {{site.data.reuse.es_name}} instances.
2. Install one or more instances of {{site.data.reuse.es_name}} by using the operator.

## Before you begin

- Ensure you have set up your environment [according to the prerequisites](../prerequisites).
- Ensure you have [planned for your installation](../planning), such as preparing for persistent storage, considering security options, and considering adding resilience through multiple availability zones.
- Obtain the connection details for your Kubernetes cluster from your administrator.

## Create a namespace

Create a namespace into which the {{site.data.reuse.es_name}} instance will be installed. For more information about namespaces, see the [Kubernetes documentation](https://kubernetes.io/docs/tasks/administer-cluster/namespaces/){:target="_blank"}.

Ensure you use a namespace that is dedicated to a single instance of {{site.data.reuse.es_name}}. This is required because {{site.data.reuse.es_name}} uses network security policies to restrict network connections between its internal components. A single namespace per instance also allows for finer control of user accesses.

**Important:** Do not use any of the initial or system [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#initial-namespaces){:target="_blank"} to install an instance of {{site.data.reuse.es_name}} (`default`, `kube-node-lease`, `kube-public`, and `kube-system`).


## Add the Helm repository

Before you can install the {{site.data.reuse.es_name}} operator and use it to create instances of {{site.data.reuse.es_name}}, add the IBM Helm repository to your local repository list. This will provide access to the {{site.data.reuse.es_name}} Helm chart package that will install the operator on your cluster.

To add the [IBM Helm repository](https://github.com/IBM/charts/tree/master/repo/ibm-helm){:target="_blank"} to the local repository list, run the following command:

```shell
helm repo add ibm-helm https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
```

## Install the {{site.data.reuse.es_name}} operator

Ensure you have considered the {{site.data.reuse.es_name}} operator [requirements](../prerequisites/#operator-requirements), including resource requirements and the required cluster-scoped permissions.

### Choosing operator installation mode

Before installing the {{site.data.reuse.es_name}} operator, decide if you want the operator to:

- Manage instances of {{site.data.reuse.es_name}} in **any namespace**.

  To use this option, set `watchAnyNamespace: true` when installing the operator. The operator will be deployed into the specified namespace, and will be able to manage instances of {{site.data.reuse.es_name}} in any namespace.

- Only manage instances of {{site.data.reuse.es_name}} in a **single namespace**.

  This is the default option: if `watchAnyNamespace` is not set, then it defaults `false`. The operator will be deployed into the specified namespace, and will only be able to manage instances of {{site.data.reuse.es_name}} in that namespace.

   **Important:** When multiple {{site.data.reuse.es_name}} operators are installed on the same cluster, all the operators share the same custom resource definitions (CRDs). Do not install a previous version of the {{site.data.reuse.es_name}} operator if a later version is already installed on the same cluster.   
  
### Installing the operator

To install the operator, run the following command:

```shell
helm install \
   <release-name> ibm-helm/ibm-eventstreams-operator \
   -n <namespace> \
   --set watchAnyNamespace=<true/false>
```

Where:
- `<release-name>` is the name you provide to identify your operator.
- `<namespace>` is the name of the namespace where you want to install the operator.
- `watchAnyNamespace=<true/false>` determines whether the operator manages instances of {{site.data.reuse.es_name}} in any namespace or only a single namespace (default is `false` if not specified).

   Set to `true` for the operator to manage instances in any namespace, or do not specify if you want the operator to only manage instances in a single namespace.

For example, to install the operator on a cluster where it will manage all instances of {{site.data.reuse.es_name}}, run the command as follows:

```shell
helm install eventstreams ibm-helm/ibm-eventstreams-operator -n "my-namespace" --set watchAnyNamespace=true
```

For example, to install the operator that will manage {{site.data.reuse.es_name}} instances in only the `my-eventstreams` namespace, run the command as follows:

```shell
helm install eventstreams ibm-helm/ibm-eventstreams-operator -n "my-eventstreams"
```

**Note:** If you are installing any subsequent operators in the same cluster, ensure you run the `helm install` command with the `--set createGlobalResources=false` option (as these resources have already been installed).

#### Checking the operator status

To check the status of the installed operator, run the following command:

```shell
kubectl get deploy eventstreams-cluster-operator -n <namespace>
```
Where:
- `<namespace>` is the name of the namespace where the operator is installed.

A successful installation will return a result similar to the following with `1/1` in the `READY` column:

```shell
NAME                            READY   UP-TO-DATE   AVAILABLE   AGE
eventstreams-cluster-operator   1/1     1            1           7d4h
```

## Install an {{site.data.reuse.es_name}} instance

Instances of {{site.data.reuse.es_name}} can be created after the {{site.data.reuse.es_name}} operator is installed. If the operator was installed to manage **a specific namespace**, then it can only be used to manage instances of {{site.data.reuse.es_name}} in that namespace. If the operator was installed to manage **all namespaces**, then it can be used to manage instances of {{site.data.reuse.es_name}} in any namespace, including those created after the operator was deployed.

When installing an instance of {{site.data.reuse.es_name}}, ensure you are using a namespace that an operator is managing.

### Creating an image pull secret

Before installing an {{site.data.reuse.es_name}} instance, create an image pull secret called `ibm-entitlement-key` in the namespace where you want to create an instance of {{site.data.reuse.es_name}}. The secret enables container images to be pulled from the registry.

1. Obtain an entitlement key from the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}.
2. Click **Entitlement keys** in the navigation on the left, and click **Add new key**, or if you have an existing active key available, click **Copy** to copy the entitlement key to the clipboard.
3. Create the secret in the namespace that will be used to deploy an instance of {{site.data.reuse.es_name}} as follows.

   Name the secret `ibm-entitlement-key`, use `cp` as the username, your entitlement key as the password, and `cp.icr.io` as the docker server:

   ```shell
   kubectl create secret docker-registry ibm-entitlement-key --docker-username=cp --docker-password="<your-entitlement-key>" --docker-server="cp.icr.io" -n "<target-namespace>"
   ```


**Note:** If you do not create the required secret, pods will fail to start with `ImagePullBackOff` errors. In this case, ensure the secret is created and allow the pod to restart.

### Installing an instance by using the CLI

To install an instance of {{site.data.reuse.es_name}} from the command line, you must first prepare an `EventStreams` custom resource configuration in a YAML file.

A number of sample configuration files are included in the Helm chart package to base your deployment on. The sample configurations range from smaller deployments for non-production development or general experimentation to large scale clusters ready to handle a production workload. 

The sample configurations are also available in [GitHub](https://ibm.biz/ea-es-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.es_name}} version to access the correct samples, and then go to `/cr-examples/eventstreams/kubernetes` to access the samples for the Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

More information about these samples is available in the [planning](../planning/#sample-deployments) section. You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring) on top as required.

**Important:** Ensure that the `spec.license.accept` field in the custom resource YAML is set to `true`, and that the correct values are selected for the `spec.license.license` and `spec.license.use` fields before deploying the {{site.data.reuse.es_name}} instance. These values are used for metering purposes and could result in inaccurate charging and auditing if set incorrectly. For more information about the available options, see the [licensing reference]({{ 'support/licensing' | relative_url }}).

**Note:** If experimenting with {{site.data.reuse.es_name}} for the first time, the **Lightweight without security** sample is the smallest and simplest example that can be used to create an experimental deployment. For the smallest production setup, use the **Minimal production** sample configuration.

To deploy an {{site.data.reuse.es_name}} instance, run the following commands:

1. Apply the configured `EventStreams` custom resource in the selected namespace:

   ```shell
   kubectl apply -f <custom-resource-file-path> -n "<target-namespace>"
   ```

   For example:

   ```shell
   kubectl apply -f development.yaml -n "my-eventstreams"
   ```

2. Wait for the installation to complete.
3. Verify your installation and consider other [post-installation tasks](../post-installation/).
