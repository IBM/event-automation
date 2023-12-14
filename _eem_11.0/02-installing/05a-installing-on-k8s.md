---
title: "Installing on other Kubernetes platforms"
excerpt: "Find out how to install Event Endpoint Management on other Kubernetes platforms."
categories: installing
slug: installing-on-kubernetes
toc: true
---

![Event Endpoint Management 11.0.4 icon]({{ 'images' | relative_url }}/11.0.4.svg "In Event  Endpoint Management 11.0.4 and later.")The following sections provide instructions about installing {{site.data.reuse.eem_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

## Before you begin

- Ensure you have set up your environment [according to the prerequisites](../prerequisites).
- Ensure you have [planned for your installation](../planning), such as preparing for persistent storage, and considering security options.
- Obtain the connection details for your Kubernetes cluster from your administrator.

## Create a namespace

Create a namespace into which the {{site.data.reuse.eem_name}} instance will be installed. For more information about namespaces, see the [Kubernetes documentation](https://kubernetes.io/docs/tasks/administer-cluster/namespaces/){:target="_blank"}.

Ensure you use a namespace that is dedicated to a single instance of {{site.data.reuse.eem_name}}. This is required because {{site.data.reuse.eem_name}} uses network security policies to restrict network connections between its internal components. A single namespace per instance also allows for finer control of user accesses.

**Important:** Do not use any of the initial or system [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#initial-namespaces){:target="_blank"} to install an instance of {{site.data.reuse.eem_name}} (some examples of these are: `default`, `kube-node-lease`, `kube-public`, and `kube-system`).


## Add the Helm repository

Before you can install the {{site.data.reuse.eem_name}} operator and use it to create instances of {{site.data.reuse.eem_name}}, add the IBM Helm repository to your local repository list. This will provide access to the {{site.data.reuse.eem_name}} Helm chart packages that will install the operator on your cluster.

To add the [IBM Helm repository](https://github.com/IBM/charts/tree/master/repo/ibm-helm){:target="_blank"} to the local repository list, run the following command:

```shell
helm repo add ibm-helm https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
```

## Install the {{site.data.reuse.eem_name}} operator

Ensure you have considered the {{site.data.reuse.eem_name}} operator [requirements](../prerequisites/#operator-requirements), including resource requirements and the required cluster-scoped permissions.

### Install the CRDs

Before installing the operator, the Custom Resource Definitions (CRDs) for {{site.data.reuse.eem_name}} must be installed.  To install the CRDs, run the following command:

```shell
helm install \
   <release-name> ibm-helm/ibm-eem-operator-crd \
   -n <namespace>
```

Where:
- `<release-name>` is the name you provide to identify your {{site.data.reuse.eem_name}} CRD helm install.
- `<namespace>` is the name of the namespace where you want to install the helm release that you will use for CRD management.

For example, to install the operator CRD Helm chart in the `eem-crds` namespace run the command as follows:

```shell
helm install eem-crds ibm-helm/ibm-eem-operator-crd -n eem-crds
```

### Choose the operator installation mode

Before installing the {{site.data.reuse.eem_name}} operator, decide if you want the operator to:

- Manage instances in **any namespace**.

  To use this option, set `watchAnyNamespace: true` when installing the operator. The operator will be deployed into the specified namespace, and will be able to manage instances of {{site.data.reuse.eem_name}} in any namespace.

- Only manage instances in a **single namespace**.

  This is the default option: if `watchAnyNamespace` is not set, then it defaults `false`. The operator will be deployed into the specified namespace, and will only be able to manage instances of {{site.data.reuse.eem_name}} in that namespace.

**Note:** If the Kubernetes service Domain Name System (DNS) domain for your cluster is not `cluster.local`, set `kubernetesServiceDnsDomain` as required.


### Installing the operator

To install the operator, run the following command:

```shell
helm install \
   <release-name> ibm-helm/ibm-eem-operator \
   -n <namespace> \
   --set webhook.create=<true/false> \
   --set kubernetesServiceDnsDomain=<your.k8s.svc.dns.domain>  \
   --set watchAnyNamespace=<true/false>
```

Where:

- `<release-name>` is the name you provide to identify your operator.
- `<namespace>` is the name of the namespace where you want to install the operator.
- `webhook.create=<true/false>` determines whether the validating webhook is deployed (default is `true` if not specified).

   Set to `false` if you do not have IBM Cert Manager installed and will be creating your own certificates for your {{site.data.reuse.eem_name}} instances.

- `kubernetesServiceDnsDomain=<your.k8s.svc.dns.domain>` allows certificate to be created by utilizing the correct Kubernetes service DNS domain as a suffix on hosts in the `dnsNames` section of the certificate (default is `cluster.local` if not specified).

- `watchAnyNamespace=<true/false>` determines whether the operator manages instances of {{site.data.reuse.eem_name}} in any namespace or only a single namespace (default is `false` if not specified).

  Set to `true` for the operator to manage instances in any namespace, or do not specify if you want the operator to only manage instances in a single namespace.

For example, to install the operator on a cluster where it will manage all instances of {{site.data.reuse.eem_name}}, run the command as follows:

```shell
helm install \
   eventendpointmanagement ibm-helm/ibm-eem-operator\
   -n "my-namespace" \
   --set watchAnyNamespace=true \
   --set webhook.create=false
```

For example, to install the operator that will manage {{site.data.reuse.eem_name}} instances in only the `my-eventendpointmanagement` namespace with no custom configurations such as `watchAnyNamespace`,`kubernetesServiceDnsDomain`, or `webhook.create`, run the command as follows:

```shell
helm install eventendpointmanagement ibm-helm/ibm-eem-operator -n "my-eventendpointmanagement"
```

#### Checking the operator status

To check the status of the installed operator, run the following command:

```shell
kubectl get deploy ibm-eem-operator -n <namespace>
```

Where:
- `<namespace>` is the name of the namespace where the operator is installed.

A successful installation will return a result similar to the following with `1/1` in the `READY` column:

```shell
NAME                            READY   UP-TO-DATE   AVAILABLE   AGE
ibm-eem-operator                1/1     1            1           7d4h
```

## Install an {{site.data.reuse.eem_name}} instance

Instances of {{site.data.reuse.eem_name}} can be created after the {{site.data.reuse.eem_name}} operator is installed. If the operator was installed to manage **a specific namespace**, then it can only be used to manage instances of {{site.data.reuse.eem_name}} in that namespace. If the operator was installed to manage **all namespaces**, then it can be used to manage instances of {{site.data.reuse.eem_name}} in any namespace, including those created after the operator was deployed.

When installing an instance of {{site.data.reuse.eem_name}}, ensure you are using a namespace that an operator is managing.

### Creating an image pull secret

Before installing an {{site.data.reuse.eem_name}} instance, create an image pull secret called `ibm-entitlement-key` in the namespace where you want to create an instance of {{site.data.reuse.eem_name}}. The secret enables container images to be pulled from the registry.

1. Obtain an entitlement key from the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}.
2. Click **Entitlement keys** in the navigation on the left, and click **Add new key**, or if you have an existing active key available, click **Copy** to copy the entitlement key to the clipboard.
3. Create the secret in the namespace that will be used to deploy an instance of {{site.data.reuse.eem_name}} as follows.

   Name the secret `ibm-entitlement-key`, use `cp` as the username, your entitlement key as the password, and `cp.icr.io` as the docker server:

   ```shell
   kubectl create secret docker-registry ibm-entitlement-key --docker-username=cp --docker-password="<your-entitlement-key>" --docker-server="cp.icr.io" -n "<target-namespace>"
   ```

**Note:** If you do not create the required secret, pods will fail to start with `ImagePullBackOff` errors. In this case, ensure the secret is created and allow the pod to restart.

### Installing an instance by using the CLI

To install an instance of {{site.data.reuse.eem_name}} from the command line, you must first prepare an `EventEndpointManagement` custom resource configuration in a YAML file.

A number of sample configuration files are included in the Helm chart package to base your deployment on. The sample configurations range from a smaller deployment for non-production development or general experimentation to a large deployment ready to handle a production workload.

The sample configurations are also available in [GitHub](https://ibm.biz/ea-eem-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.eem_name}} version, and then go to `/cr-examples/eventendpointmanagement/kubernetes` to access the samples for the Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

**Note:** If experimenting with {{site.data.reuse.eem_name}} for the first time, the **Quick start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.

More information about these samples is available in the [planning](../planning/#sample-deployments) section. You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring) as required.

**Important:** Ensure that the `spec.license.accept` field in the custom resource YAML is set to `true`, and that the correct values are selected for the `spec.license.license` and `spec.license.use` fields before deploying the {{site.data.reuse.eem_name}} instance. These values are used for metering purposes and could result in inaccurate charging and auditing if set incorrectly. For more information about the available options, see the [licensing reference]({{ 'support/licensing' | relative_url }}).

When modifying the sample configuration, ensure that the following fields are updated based on your requirements:

- The `spec.license.accept` field in the custom resource YAML is set to `true`.
- The correct values are selected for the `spec.license.use`, `spec.license.license`, and `spec.license.metric` fields before deploying an {{site.data.reuse.eem_name}} instance. For information about the right values for your deployment, see the [licensing reference]({{ 'support/licensing' | relative_url }}).
- The `manager.storageSpec.type` field is updated as `ephemeral` or `persistent-claim` based on your requirements. See [configuring](../configuring#enabling-persistent-storage) to select the correct storage type and other optional specifications such as storage size, root storage path, and secrets.
- The `manager.tls.caSecretName` or `manager.tls.secretName` field is updated based on your requirements. If neither is specified, self-signed certificates are used. See the [configuring](../configuring#configuring-tls) section for more information.
- The `spec.manager.endpoints[]` must contain entries for both `ui` and `gateway` named endpoints:
    - `name` is set to `gateway` or `ui` as applicable.
    - `host` is updated with a DNS resolvable hostname for accessing the named service, for example:
       
       ![Event Endpoint Management 11.0.4 icon]({{ 'images' | relative_url }}/11.0.4.svg "In Event  Endpoint Management 11.0.4 only")**Note:** The hostname is limited to 64 characters.
  
       ```shell
       spec:
         manager:
           endpoints:
             - name: ui
               host: qs-eem-ui.mycluster.domain
             - name: gateway
               host: qs-eem-gateway.mycluster.domain
       ```
  
To deploy an {{site.data.reuse.eem_name}} instance, run the following command:

1. Apply the configured `EventEndpointManagement` custom resource to your target namespace:

   ```shell
   kubectl apply -f <custom-resource-file-path> -n <target-namespace>
   ```

   For example:

   ```shell
   kubectl apply -f production.yaml -n my-namespace
   ```

2. Wait for the installation to complete.
