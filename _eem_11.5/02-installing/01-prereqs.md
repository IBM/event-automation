---
title: "Prerequisites"
excerpt: "Prerequisites for installing Event Endpoint Management."
categories: installing
slug: prerequisites
toc: true
---

Ensure your environment meets the following prerequisites before installing {{site.data.reuse.eem_name}}.

## Container environment
{: #container-environment}

{{site.data.reuse.eem_name}} 11.5.x is supported on the {{site.data.reuse.openshift}} and other Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.


If you are using {{site.data.reuse.openshift}}, ensure you have the following set up for your environment:

- A supported version of the {{site.data.reuse.openshift_short}} [installed](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/about/welcome-index){:target="_blank"}.  For supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).
- The {{site.data.reuse.openshift_short}} CLI (`oc`) [installed](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/cli_tools/openshift-cli-oc#cli-about-cli_cli-developer-commands){:target="_blank"}.

If you are using other Kubernetes platforms, ensure you have the following set up for your environment:

- A supported version of a Kubernetes platform installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).
- The Kubernetes command-line tool (`kubectl`) [installed](https://kubernetes.io/docs/tasks/tools/){:target="_blank"}.

If you plan to run the {{site.data.reuse.egw}} as a Docker container, the minimum requirements for the Docker environment where the gateway runs are 2 CPU cores and 2 GiB of memory.

## Hardware requirements
{: #hardware-requirements}

Ensure your hardware can accommodate the [resource requirements](#resource-requirements) for your planned deployment.

## Resource requirements
{: #resource-requirements}

{{site.data.reuse.eem_name}} resource requirements depend on several factors. The following sections provide guidance about minimum requirements for a quick start deployment, and options for initial production configurations.

Minimum resource requirements for an {{site.data.reuse.eem_name}} deployment with an [operator-managed {{site.data.reuse.egw}}](../install-gateway#operator-managed-gateways) are as follows, and are based on the total of requests set for the deployment. You will require more resources to accommodate the limit settings (see more about "requests" and "limits" later in this section).

| Deployment                                                                                   | CPU (cores) | Memory (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| -------------------------------------------------------------------------------------------- | ----------- | ----------- | ---------------------------------------------- |
| [{{site.data.reuse.eem_name}} operator](#operator-requirements)                              | 0.2         | 0.5        | N/A                                            |
| [{{site.data.reuse.eem_manager}} instance](../planning#example-deployment-quick-start)          | 0.5         | 0.5         | 1                                            |
| [{{site.data.reuse.egw}} instance](../planning#example-deployment-event-gateway-quick-start) | 1.0         | 1.0         | 1                                            |

**Note:** {{site.data.reuse.eem_name}} provides sample {{site.data.reuse.eem_manager}} configurations to help you get started with deployments. The resource requirements for these specific samples are detailed in the [planning](../planning/#sample-deployments) section. If you do not have an {{site.data.reuse.eem_name}} installation on your system yet, always ensure you include the resource requirements for the operator together with the intended {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instance requirements (quick start or production).

[Requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/){:target="_blank"} are Kubernetes concepts for controlling resource types such as CPU and memory.

- Requests set the minimum requirements a container requires to be scheduled. If your system does not have the required request value, then the services will not start up.
- Limits set the value beyond which a container cannot consume the resource. It is the upper limit within your system for the service. Containers that exceed a CPU resource limit are throttled, and containers that exceed a memory resource limit are terminated by the system.

Ensure you have sufficient CPU capacity and physical memory in your environment to service these requirements. Your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances can be dynamically updated later. 


### Operator requirements
{: #operator-requirements}

The {{site.data.reuse.eem_name}} operator requires the following minimum resource requirements. Ensure you always include sufficient CPU capacity and physical memory in your environment to service the operator requirements.

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) |
| ------------------- | ----------------- | ------------------- | ----------------- |
| 0.2                 | 1.0               | 0.5                | 1               |

You can only install one version of the {{site.data.reuse.eem_name}} operator on a cluster. Installing multiple versions on a single cluster is not supported due to possible compatibility issues as they share the same Custom Resource Definitions (CRDs), making them unsuitable for coexistence.

#### Cluster-scoped permissions required
{: #cluster-scoped-permissions-required}

The {{site.data.reuse.eem_name}} operator requires the following cluster-scoped permissions, even if the operator is set manage instances in a single namespace:

- **Permission to retrieve storage classes**: The {{site.data.reuse.eem_name}} operator uses admission webhooks to provide immediate validation and feedback about the creation and modification of the {{site.data.reuse.eem_manager}} and operator-managed {{site.data.reuse.egw}} instances. The permission to retrieve storage classes is used by the webhooks to find a default storage class.
- **Permission to list specific CustomResourceDefinitions**: This allows {{site.data.reuse.eem_name}} to identify whether other optional dependencies have been installed into the cluster.

## Red Hat OpenShift Security Context Constraints

If used, {{site.data.reuse.eem_name}} requires a [Security Context Constraint (SCC)](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/authentication_and_authorization/managing-pod-security-policies){:target="_blank"} to be bound to the target namespace before installation.

By default, {{site.data.reuse.eem_name}} complies with `restricted` or `restricted-v2` SCC depending on your {{site.data.reuse.openshift_short}} version.

## Network requirements
{: #network-requirements}

{{site.data.reuse.eem_name}} is supported for use with IPv4 networks only.

### Ingress controllers
{: #ingress-controllers}

To expose {{site.data.reuse.eem_name}} services externally outside your cluster, the {{site.data.reuse.eem_name}} operator creates:

- OpenShift routes when installing on {{site.data.reuse.openshift}}.
- Kubernetes ingress resources when installing on other Kubernetes platforms.


To use ingresses, you must have an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/){:target="_blank"} installed in your Kubernetes environment. You must enable TLS passthrough in your ingress controller for your {{site.data.reuse.eem_name}} services to work. Refer to your ingress controller documentation for more information.

**Note:** You must specify either {{site.data.reuse.openshift}} routes or Kubernetes ingresses for communication between {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}}s. Specifying Kubernetes [Services](https://kubernetes.io/docs/concepts/services-networking/service){:target="_blank"} as your endpoints when you add gateways is not supported.

## Data storage requirements
{: #data-storage-requirements}

{{site.data.reuse.eem_name}} supports any [Container Storage Interface (CSI)](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/){:target="_blank"} compatible storage classes. 

Specifically for RedHat OpenShift Kubernetes Service (ROKS), you can use either:

- IBM Cloud Block storage, `ibmc-block-<tier>`, where `<tier>` can be `gold`, `silver` or `bronze`
- (Only on Single-Zone clusters) IBM Cloud File storage with support for supplemental group IDs, `ibmc-file-<tier>-gid`

You can use the storage classes to set up persistent storage or to [back up](../backup-restore/#backing-up) and [restore](../backup-restore#restoring) your data.

If you want to set up [persistent storage](../planning/#planning-for-persistent-storage), ensure the cluster administrator has created one or more storage classes that support `ReadWriteOnce` and allows read and write access to non-root users.

For example, you can use one of the following systems:

- Red Hat OpenShift Data Foundation (previously OpenShift Container Storage) version 4.2 or later (block storage only)
- IBM Cloud Block storage
- IBM Storage Suite for IBM Cloud Paks: block storage from IBM Spectrum Virtualize, FlashSystem, or DS8K
- Portworx Storage version 2.5.5 or later
- Rook Ceph

**Important:** The previous list includes storage providers that you can use to provision persistent volumes for {{site.data.reuse.eem_name}}. There is no guarantee that all features of a storage provider, such as snapshot-based backup and restore of the volumes, are supported. If you want to back up and restore your {{site.data.reuse.eem_manager}} instance, ensure you use a storage provider compatible with the CSI specification for snapshotting.

## {{site.data.reuse.egw}} compatibility
{: #event-gateway-compatibility}

{{site.data.reuse.egw_compatibility_note}}

## {{site.data.reuse.eem_name}} UI
{: #event-manager-ui}

The {{site.data.reuse.eem_name}} user interface (UI) is supported on the following web browsers:

- Google Chrome version 113 or later
- Mozilla Firefox version 113 or later
- Safari version 16.5 or later

## Certificate management
{: #certificate-management}

A certificate manager is required to automatically manage the process of creating, renewing and using {{site.data.reuse.eem_name}} internal and system-to-system certificates. It is also used by default for managing {{site.data.reuse.eem_name}} certificates that are visible to clients and users, simplifying their configuration.

- On {{site.data.reuse.openshift}}, install the cert-manager Operator for Red Hat OpenShift.
- On other Kubernetes platforms, use a certificate manager installation, for example [cert-manager](https://cert-manager.io/docs/), that supports `Issuer.cert-manager.io/v1` and `Certificate.cert-manager.io/v1` GroupVersionKind (GVK), or create certificates manually and provide them to {{site.data.reuse.eem_name}} by using Kubernetes secrets.


### The cert-manager Operator for {{site.data.reuse.openshift}}

If you already have the cert-manager Operator for Red Hat OpenShift installed on your cluster, you can skip this section.

 - To check whether the cert-manager Operator for Red Hat OpenShift is installed on your cluster by using the OpenShift web console, complete the following steps:

    1. {{site.data.reuse.openshift_ui_login}}
    2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
    3. In the list of installed operators, check whether **cert-manager Operator for Red Hat OpenShift** is available, and whether the status is showing as `Succeeded` in the `cert-manager-operator` namespace.

- To check whether the cert-manager Operator for Red Hat OpenShift is installed on your cluster by using the CLI, run the following command:

    ```shell
    oc get pods -n cert-manager
    ```

    If the cert-manager pods are up and running, the cert-manager Operator for Red Hat OpenShift is ready to use.

- If you need to install the cert-manager Operator for Red Hat OpenShift, follow the instructions in the [OpenShift documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/security_and_compliance/cert-manager-operator-for-red-hat-openshift#cert-manager-operator-install).

**Important:** You can only have one cert-manager Operator for Red Hat OpenShift installed on your cluster. Choose the appropriate version depending on what other software is running in your environment. If you have an existing {{site.data.reuse.cp4i}} deployment, check whether you have a {{site.data.reuse.fs}} operator running already and note the version.

## Optional: Authenticate with Keycloak provided by {{site.data.reuse.cp4i}}
{: #prereqs-keycloak}

If you are installing on the {{site.data.reuse.openshift_short}} as part of {{site.data.reuse.cp4i}}, you can configure access for your integration capabilities such as {{site.data.reuse.eem_name}} by using [Keycloak](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.0?topic=administering-identity-access-management){:target="_blank"}.

Keycloak is supported in {{site.data.reuse.eem_name}} when an {{site.data.reuse.cp4i}} version 16.1.0 (operator 7.3.0) or later is available. See the [{{site.data.reuse.cp4i}} documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.0?topic=installing){:target="_blank"} for information about installing {{site.data.reuse.cp4i}}.

For more information, see sections about [configuring UI security](../configuring/#configuring-authentication) and [managing access with Keycloak](../../security/managing-access/#setting-up-integration-keycloak-authentication).


