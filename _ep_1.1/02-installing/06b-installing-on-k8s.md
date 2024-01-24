---
title: "Installing on other Kubernetes platforms"
excerpt: "Find out how to install Event Processing on other Kubernetes platforms."
categories: installing
slug: installing-on-kubernetes
toc: true
---

The following sections provide instructions about installing {{site.data.reuse.ep_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

## Overview

{{site.data.reuse.ep_name}} is an operator-based release and uses custom resources to define the deployment configuration.
{{site.data.reuse.ep_name}} requires the installation of the {{site.data.reuse.flink_long}} and the {{site.data.reuse.ep_name}}
operator. These operators deploy and manage the entire lifecycle of your Flink and {{site.data.reuse.ep_name}} instances. Custom resources are presented as YAML configuration documents that define instances of the `FlinkDeployment` and `EventProcessing` custom resources.

Installing {{site.data.reuse.ep_name}} has the following phases:

1. Install the {{site.data.reuse.flink_long}}: this deploys the operator that will install and manage your Flink instances.
2. Install the {{site.data.reuse.ep_name}} operator: this deploys the operator that will install and manage your {{site.data.reuse.ep_name}} instances.
3. Install one or more instances of Flink by using the {{site.data.reuse.flink_long}}.
4. Install one or more instances of {{site.data.reuse.ep_name}} by using the {{site.data.reuse.ep_name}} operator.

## Before you begin

- Ensure you have set up your environment [according to the prerequisites](../prerequisites).
- Ensure you have [planned for your installation](../planning), such as preparing for persistent storage, and considering security options.
- Obtain the connection details for your Kubernetes cluster from your administrator.
- If the Kubernetes service Domain Name System (DNS) domain for your cluster is not `cluster.local`, set `kubernetesServiceDnsDomain` as required.


## Create a namespace

Create a namespace into which the {{site.data.reuse.ep_name}} instance will be installed. For more information about namespaces, see the [Kubernetes documentation](https://kubernetes.io/docs/tasks/administer-cluster/namespaces/){:target="_blank"}.

Ensure you use a namespace that is dedicated to a single instance of {{site.data.reuse.ep_name}}. This is required because {{site.data.reuse.ep_name}} uses network security policies to restrict network connections between its internal components. A single namespace per instance also allows for finer control of user accesses.

**Important:** Do not use any of the initial or system [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#initial-namespaces){:target="_blank"} to install an instance of {{site.data.reuse.ep_name}} (some examples of these are: `default`, `kube-node-lease`, `kube-public`, and `kube-system`).


## Add the Helm repository

Before you can install the {{site.data.reuse.ep_name}} operator and the {{site.data.reuse.flink_long}}, add the IBM Helm repository to your local repository list. This will provide access to the Helm chart packages that will install the operators on your cluster.

To add the [IBM Helm repository](https://github.com/IBM/charts/tree/master/repo/ibm-helm){:target="_blank"} to the local repository list, run the following command:

```shell
helm repo add ibm-helm https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
```

## Choose the operator installation mode

Before installing an operator, decide whether you want the operator to:

- Manage instances in **any namespace**.

  To use this option, select `All namespaces on the cluster (default)` later. The operator will be deployed into the system namespace `openshift-operators`, and will be able to manage instances in any namespace.

- Only manage instances in a **single namespace**.

  To use this option, select `A specific namespace on the cluster` later. The operator will be deployed into the specified namespace, and will not be able to manage instances in any other namespace.


## Install the CRDs

Before installing the operator, the Custom Resource Definitions (CRDs) for {{site.data.reuse.ep_name}} and Flink must be installed. To install the CRDs, run the following commands:

For {{site.data.reuse.ep_name}}:

```shell
helm install \
   <release-name> ibm-helm/ibm-ep-operator-crd \
   -n <namespace>
```

For {{site.data.reuse.flink_long}}:

```shell
helm install \
   <release-name> ibm-helm/ibm-eventautomation-flink-operator-crd \
   -n <namespace>
```

Where:

- `<release-name>` is the name you provide to identify your {{site.data.reuse.ep_name}} or Flink CRD Helm installation.
- `<namespace>` is the name of the namespace where you want to install the Helm release that you use for CRD management.

For example, to install the operator CRD Helm charts in the `ep` namespace, run the commands as follows:

```shell
helm install ep-crds ibm-helm/ibm-ep-operator-crd -n ep
helm install ibm-flink-crds ibm-helm/ibm-eventautomation-flink-operator-crd -n ep
```

## Install operators

Follow the instructions to install the {{site.data.reuse.flink_long}} and the {{site.data.reuse.ep_name}} operator.

### Installing the {{site.data.reuse.flink_long}} operator

**Important:**

* The {{site.data.reuse.flink_long}} must not be installed on a cluster where you already have an Apache Flink operator installed. This is because the {{site.data.reuse.flink_long}} leverages the Apache Flink `CustomResourceDefinition` (CRD) resources. These resources cannot be managed by more than one operator at the same time (for more information, see the [Operator Framework documentation](https://sdk.operatorframework.io/docs/best-practices/best-practices/#summary){:target="_blank"}).
* Before installing the {{site.data.reuse.flink_long}} on a cluster where the Apache Flink operator is already installed, uninstall the Apache Flink operator and the Apache Flink CRDs as described in the [Apache Flink documentation](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.5/docs/development/guide/#generating-and-upgrading-the-crd){:target="_blank"}.
* Only one version of the {{site.data.reuse.flink_long}} must be installed on a cluster. Installing multiple versions is not supported due to potential conflicts between different versions of the `CustomResourceDefinition` resources.

Ensure you have considered the {{site.data.reuse.flink_long}} [requirements](../prerequisites/#operator-requirements), including resource requirements and, if installing in **any namespace**, the required cluster-scoped permissions.

To install the operator, run the following command:

```shell
helm install \
   <release-name> ibm-helm/ibm-eventautomation-flink-operator \
   -n <namespace> \
   --set kubernetesServiceDnsDomain=<your.k8s.svc.dns.domain>  \
   --set watchAnyNamespace=<true/false>
```

Where:

- `<release-name>` is the name you provide to identify your operator.
- `<namespace>` is the name of the namespace where you want to install the operator.
- `kubernetesServiceDnsDomain=<your.k8s.svc.dns.domain>` allows certificate to be created by utilizing the correct Kubernetes service DNS domain as a suffix on hosts in the `dnsNames` section of the certificate (default is `cluster.local` if not specified).
- `watchAnyNamespace=<true/false>` determines whether the operator manages `FlinkDeployments` in any namespace or only a single namespace (default is `false` if not specified).

  Set to `true` for the operator to manage instances in any namespace, or do not specify if you want the operator to only manage instances in a single namespace.

For example, to install the operator on a cluster where it will manage all instances of `FlinkDeployments`, run the command as follows:

```shell
helm install \
   flink ibm-helm/ibm-eventautomation-flink-operator\
   -n "my-namespace" \
   --set watchAnyNamespace=true
```

For example, to install the operator that will manage `FlinkDeployments` in only the `my-flink` namespace with no custom configurations such as `watchAnyNamespace`,`kubernetesServiceDnsDomain`, or `webhook.create`, run the command as follows:

```shell
helm install flink ibm-helm/ibm-eventautomation-flink-operator -n "my-flink"
```

**Note:** If you do not have a Cert Manager installed, disable the webhook component of the Flink operator.  To disable the webhooks, specify `--set webhook.create=false` on the helm install command as follows:

```shell
helm install flink ibm-helm/ibm-eventautomation-flink-operator -n "my-flink" --set webhook.create=false
```


### Installing the {{site.data.reuse.ep_name}} operator

Ensure you have considered the {{site.data.reuse.ep_name}} operator [requirements](../prerequisites/#operator-requirements), including resource requirements and the required cluster-scoped permissions.

To install the operator, run the following command:

```shell
helm install \
   <release-name> ibm-helm/ibm-ep-operator \
   -n <namespace> \
   --set webhook.create=<true/false> \
   --set kubernetesServiceDnsDomain=<your.k8s.svc.dns.domain>  \
   --set watchAnyNamespace=<true/false>
```

Where:

- `<release-name>` is the name you provide to identify your operator.
- `<namespace>` is the name of the namespace where you want to install the operator.
- `webhook.create=<true/false>` determines whether the validating webhook is deployed (default is `true` if not specified).

  Set to `false` if you do not have IBM Cert Manager installed and will be creating your own certificates for your {{site.data.reuse.ep_name}} instances.

- `kubernetesServiceDnsDomain=<your.k8s.svc.dns.domain>` allows certificate to be created by utilizing the correct Kubernetes service DNS domain as a suffix on hosts in the `dnsNames` section of the certificate (default is `cluster.local` if not specified).

- `watchAnyNamespace=<true/false>` determines whether the operator manages instances of {{site.data.reuse.ep_name}} in any namespace or only a single namespace (default is `false` if not specified).

  Set to `true` for the operator to manage instances in any namespace, or do not specify if you want the operator to only manage instances in a single namespace.

For example, to install the operator on a cluster where it will manage all instances of {{site.data.reuse.ep_name}}, run the command as follows:

```shell
helm install \
   eventprocessing ibm-helm/ibm-ep-operator\
   -n "my-namespace" \
   --set watchAnyNamespace=true \
   --set webhook.create=false
```

Or to install the operator to manage {{site.data.reuse.ep_name}} instances in only the `my-eventprocesssing` namespace with no custom configurations such as `watchAnyNamespace`,`kubernetesServiceDnsDomain`, or `webhook.create`, run the command as follows:

```shell
helm install eventprocesssing ibm-helm/ibm-ep-operator -n "my-eventprocesssing"
```

### Checking the operator status

To check the status of the installed operator, run the following command:

For {{site.data.reuse.ep_name}}:

```shell
kubectl get deployments ibm-ep-operator -n <namespace>
```

For {{site.data.reuse.flink_long}}:

```shell
kubectl get deployments flink-kubernetes-operator -n <namespace>
```

Where:
- `<namespace>` is the name of the namespace where the operator is installed.

A successful installation will return a result similar to the following with `1/1` in the `READY` column:


For {{site.data.reuse.ep_name}}:

```shell
NAME                            READY   UP-TO-DATE   AVAILABLE   AGE
ibm-ep-operator                 1/1     1            1           1d2h
```

For {{site.data.reuse.flink_long}}:

```shell
NAME                            READY   UP-TO-DATE   AVAILABLE   AGE
flink-kubernetes-operator       1/1     1            1           7d4h
```

## Install instances

Follow the instructions to install the {{site.data.reuse.flink_long}} and {{site.data.reuse.ep_name}} instances.

### Installing a Flink instance

Instances of Flink can be created after the {{site.data.reuse.flink_long}} is installed. If the operator was installed into **a specific namespace**, then it can only be used to manage instances of Flink in that namespace.

If the operator was installed for **all namespaces**, then it can be used to manage instances of Flink in any namespace, including those created after the operator was deployed.

When installing an instance of Flink, ensure you are using a namespace that the Flink operator is managing.

#### Installing a Flink instance by using the CLI

To install an instance of Flink from the command-line, you must first prepare a `FlinkDeployment` custom resource configuration in a YAML file.

A number of sample configuration files are available in [GitHub](https://ibm.biz/ea-flink-samples){:target="_blank"}, where you can select the GitHub tag for your Flink version, and then go to `/cr-examples/flinkdeployment` to access the samples. These range from quick start deployments for non-production development to large scale clusters ready to handle a production workload.

**Important:** All Flink samples except **Quick Start** use a `PersistentVolumeClaim` (PVC), which must be deployed manually as described in [planning](../planning/#deploying-the-flink-pvc).

To deploy a Flink instance, run the following commands:

1. Prepare a `FlinkDeployment` custom resource in a YAML file, using the information provided in
   [FlinkDeployment Reference](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.5/docs/custom-resource/reference/#flinkdeployment-reference){:target="_blank"}.

   **Notes:** 
 
    - If the operator webhook has not been disabled, accept the license agreement(`spec.flinkConfiguration.license.accept: 'true'`), and set the required [licensing configuration parameters](https://ibm.biz/ea-license){:target="_blank"} for your deployment. Do not set the `spec.image` and `spec.flinkVersion` fields as they are automatically included by {{site.data.reuse.flink_long}}.


      ```yaml
       spec:
         flinkConfiguration:
           license.use: <license-use-value>
           license.license: L-HRZF-DWHH7A
           license.accept: 'true'
      ```
      Where `<license-use-value>` must be either `EventAutomationProduction` or `EventAutomationNonProduction`, depending on your deployment.

    - If the operator webhook has been disabled (`--set webhook.create=false`), in addition to the licensing parameters you configured in the previous step, you must also include the fields `spec.image` and `spec.flinkVersion`.
      The values for the `spec.image` and `spec.flinkVersion` fields can be obtained by looking at the values of the `IBM_FLINK_IMAGE` and `IBM_FLINK_VERSION` environment variables on the operator pod.  You can get these values by running:

      ```shell
      kubectl set env pod/<flink_operator_pod_name> --list -n <flink_operator_namespace> | grep IBM_FLINK
      ```

      Use the values from the environment variables in your `FlinkDeployment`:

      ```yaml
      spec:
       flinkVersion: "<value-of-IBM_FLINK_VERSION-env-var>"
       image: "<value-of-IBM_FLINK_IMAGE-env-var>"
       flinkConfiguration:
         license.use: <license-use-value>
         license.license: L-HRZF-DWHH7A
         license.accept: 'true'
      ```

3. Apply the configured `FlinkDeployment` custom resource to your target namespace:

   ```shell
   kubectl apply -f <custom-resource-file-path> -n <target-namespace>
   ```

   For example:

   ```shell
   kubectl apply -f flinkdeployment_demo.yaml -n my-flink
   ```

4. Wait for the installation to complete.


### Installing an {{site.data.reuse.ep_name}} instance

Instances of {{site.data.reuse.ep_name}} can be created after the {{site.data.reuse.ep_name}} operator is installed. If the operator was installed to manage **a specific namespace**, then it can only be used to manage instances of {{site.data.reuse.ep_name}} in that namespace. If the operator was installed to manage **all namespaces**, then it can be used to manage instances of {{site.data.reuse.ep_name}} in any namespace, including those created after the operator was deployed.

When installing an instance of {{site.data.reuse.ep_name}}, ensure you are using a namespace that an operator is managing.

#### Creating an image pull secret

Before installing an {{site.data.reuse.ep_name}} instance, create an image pull secret called `ibm-entitlement-key` in the namespace where you want to create an instance of {{site.data.reuse.ep_name}}. The secret enables container images to be pulled from the registry.

1. Obtain an entitlement key from the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}.
2. Click **Entitlement keys** in the navigation on the left, and click **Add new key**, or if you have an existing active key available, click **Copy** to copy the entitlement key to the clipboard.
3. Create the secret in the namespace that will be used to deploy an instance of {{site.data.reuse.ep_name}} as follows.

   Name the secret `ibm-entitlement-key`, use `cp` as the username, your entitlement key as the password, and `cp.icr.io` as the docker server:

   ```shell
   kubectl create secret docker-registry ibm-entitlement-key --docker-username=cp --docker-password="<your-entitlement-key>" --docker-server="cp.icr.io" -n "<target-namespace>"
   ```

**Note:** If you do not create the required secret, pods will fail to start with `ImagePullBackOff` errors. In this case, ensure the secret is created and allow the pod to restart.

#### Installing an {{site.data.reuse.ep_name}} instance by using the CLI

To install an instance of {{site.data.reuse.ep_name}} from the command line, you must first prepare an `eventprocesssing` custom resource configuration in a YAML file.

A number of sample configuration files are included in the Helm chart package to base your deployment on. The sample configurations range from a smaller deployment for non-production development or general experimentation to a large deployment ready to handle a production workload.

The sample configurations are also available in [GitHub](https://ibm.biz/ea-ep-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.ep_name}} version, and then go to `/cr-examples/eventprocesssing/kubernetes` to access the samples for the Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

**Note:** If experimenting with {{site.data.reuse.ep_name}} for the first time, the **Quick start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.

More information about these samples is available in the [planning](../planning/#sample-deployments) section. You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring) as required.

**Important:** Ensure that the `spec.license.accept` field in the custom resource YAML is set to `true`, and that the correct values are selected for the `spec.license.license` and `spec.license.use` fields before deploying the {{site.data.reuse.ep_name}} instance. These values are used for metering purposes and could result in inaccurate charging and auditing if set incorrectly. For more information about the available options, see the [licensing reference]({{ 'support/licensing' | relative_url }}).

When modifying the sample configuration, ensure that the following fields are updated based on your requirements:

- The `spec.license.accept` field in the custom resource YAML is set to `true`.
- The correct values are selected for the `spec.license.use`, `spec.license.license`, and `spec.license.metric` fields before deploying an {{site.data.reuse.ep_name}} instance. For information about the right values for your deployment, see the [licensing reference]({{ 'support/licensing' | relative_url }}).
- `authoring.storage.type` field is updated as `ephemeral` or `persistent-claim` based on your requirements. See [configuring](../configuring#enabling-persistent-storage) to select the correct storage type and other optional specifications such as storage size, root storage path, and secrets.
- `authoring.tls.caSecretName` or `authoring.tls.secretName` field is updated based on your requirements. If neither is specified, self-signed certificates are used. See the [configuring](../configuring#configuring-tls) section for more information.
- `spec.authoring.endpoints[]` must contain an entry for the `ui` endpoint:

   - `name` field is set to `ui`.
   - `host` field is updated with a DNS resolvable hostname for accessing the named service, for example:

       ```shell
       spec:
         manager:
           endpoints:
             - name: ui
               host: qs-ep-ui.mycluster.domain
       ```

To deploy an {{site.data.reuse.ep_name}} instance, run the following command:

1. Apply the configured `eventprocesssing` custom resource to your target namespace:

   ```shell
   kubectl apply -f <custom-resource-file-path> -n <target-namespace>
   ```

   For example:

   ```shell
   kubectl apply -f production.yaml -n my-namespace
   ```

2. Wait for the installation to complete.
