---
title: "Prerequisites"
excerpt: "Prerequisites for installing Event Processing."
categories: installing
slug: prerequisites
toc: true
---



Ensure your environment meets the following prerequisites before installing {{site.data.reuse.flink_long}} and {{site.data.reuse.ep_name}}.

## Container environment

{{site.data.reuse.ep_name}} 1.1.x is supported on the {{site.data.reuse.openshift}} and the other Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

If you are using {{site.data.reuse.openshift}}, ensure you have the following set up for your environment:

- A supported version of the {{site.data.reuse.openshift_short}} [installed](https://docs.openshift.com/container-platform/4.14/welcome/index.html){:target="_blank"}.  For supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).
- The {{site.data.reuse.openshift_short}} CLI (`oc`) [installed](https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html){:target="_blank"}.

If you are using other Kubernetes platforms, ensure you have the following set up for your environment:

- A supported version of a Kubernetes platform installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).
- The Kubernetes command-line tool (`kubectl`) [installed](https://kubernetes.io/docs/tasks/tools/){:target="_blank"}.

## Hardware requirements

Ensure that your hardware can accommodate the [resource requirements](#resource-requirements) for your planned deployment.

## Resource requirements

{{site.data.reuse.ep_name}} resource requirements depend on several factors. The following sections provide guidance about minimum requirements for a starter deployment, and options for initial production configurations.

Minimum resource requirements are based on the total of requests set for the deployment. You will require more resources to accommodate the limit settings (see more about "requests" and "limits" later in this section).
Always ensure that you have sufficient resources in your environment to deploy the {{site.data.reuse.flink_long}} and {{site.data.reuse.ep_name}} operator together with a Quick start or a Production instance of Flink and {{site.data.reuse.ep_name}}.

Flink resource requirements:

| Deployment                                                                                         | CPU (cores)                       | Memory (Gi)                    | Chargeable cores (see [Flink samples](../planning/#flink-sample-deployments)) |
|----------------------------------------------------------------------------------------------------|-----------------------------------|--------------------------------|-------------------------------------------------------------------------------|
| [Operator](#operator-requirements)                                                                 | 0.2                               | 1.0                            | N/A                                                                           |
| [Quick Start](../planning/#flink-quick-start-sample)                                               | 1.0                               | 4.0                            | 1                                                                             |
| [Minimal Production](../planning/#flink-minimal-production-sample)                                 | 1.25                              | 4.0                            | 2                                                                             |
| [Production](../planning/##flink-production-sample)                                                | 3.0                               | 12.0                           | 3                                                                             |
| [Production - Flink Application cluster](../planning/#flink-production-application-cluster-sample) |  3.0 | 12.0  | 3      |

{{site.data.reuse.ep_name}} resource requirements:

| Deployment                                                      | CPU (cores) | Memory (Gi) | Chargeable cores |
| --------------------------------------------------------------- | ----------- | ----------- | ---- |
| [Operator](#operator-requirements)                              | 0.2         | 1.0         | N/A  |
| [Quick start](../planning/#event-processing-sample-deployments) | 0.5         | 0.5         | N/A  |
| [Production](../planning/#event-processing-sample-deployments)  | 1           | 1           | N/A  |


**Note:** {{site.data.reuse.ep_name}} provides sample configurations to help you get started with deployments. The resource requirements for these specific samples are detailed in the [planning](../planning/#sample-deployments) section. If you do not have an {{site.data.reuse.ep_name}} installation on your system yet, always ensure that you include the resource requirements for the operator together with the intended {{site.data.reuse.ep_name}} instance requirements (quick start or production).

**Note:** {{site.data.reuse.flink_long}} When deploying a `FlinkDeployment` custom resource, the initial number of Flink Job Manager (JM) and Task Manager (TM) pods is equal to the number of replicas indicated for each in the custom resource. All the provided samples configure 1 replica for both JM and TM, except the “Production” sample which has 2 replicas for JM.
Additional Task Manager pods are created if the number of deployed Flink jobs exceeds the TM “slot capacity”, which is determined by the parameter `spec.flinkConfiguration.taskmanager.numberOfTaskSlots` in the FlinkDeployment. When running {{site.data.reuse.ep_name}} flows, each flow generates 2 Flink jobs; each job is allocated its own Task Manager slot.

{{site.data.reuse.ep_name}} is a [Kubernetes operator-based](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/){:target="_blank"} release and uses custom resources to define your {{site.data.reuse.ep_name}} configurations.
The {{site.data.reuse.ep_name}} operator uses the declared required state of your {{site.data.reuse.ep_name}} in the custom resources to deploy and manage the entire lifecycle of your {{site.data.reuse.ep_name}} instances. Custom resources are presented as YAML configuration documents that define instances of the `EventProcessing` custom resource type.

The provided samples define typical configuration settings for your {{site.data.reuse.ep_name}} instance, including security settings, and default values for resources such as CPU and memory defined as "request" and "limit" settings. [Requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/){:target="_blank"} are Kubernetes concepts for controlling resource types such as CPU and memory.

- Requests set the minimum requirements that a container requires to be scheduled. If your system does not have the required request value, then the services do not start.
- Limits set the value beyond which a container cannot consume the resource. It is the upper limit within your system for the service. Containers that exceed a CPU resource limit are throttled, and containers that exceed a memory resource limit are terminated by the system.

Ensure that you have sufficient CPU capacity and physical memory in your environment to service these requirements. Your {{site.data.reuse.ep_name}} instance can be updated dynamically through the configuration options that are provided in the custom resource.

### Operator requirements

The {{site.data.reuse.ep_name}} operator and the {{site.data.reuse.flink_long}} have the following requirements.

#### Requirements for the {{site.data.reuse.ep_name}} operator

The {{site.data.reuse.ep_name}} operator has the following minimum resource requirements. Ensure that you always include sufficient CPU capacity and physical memory in your environment to service the operator requirements.

| CPU request (cores) | CPU limit (cores) | Memory request (Gi) | Memory limit (Gi) |
| ------------------- | ----------------- | ------------------- | ----------------- |
| 0.2                 | 1.0               | 0.25                | 0.25              |

##### Cluster-scoped permissions required

The {{site.data.reuse.ep_name}} operator requires the following cluster-scoped permissions:

- **Permission to manage admission webhooks**: The {{site.data.reuse.ep_name}} operator uses admission webhooks to provide immediate validation and feedback about the creation and modification of {{site.data.reuse.ep_name}} instances. The permission to manage webhooks is required for the operator to register these actions.
- **Permission to manage ConsoleYAMLSamples**: ConsoleYAMLSamples are used to provide samples for {{site.data.reuse.ep_name}} resources in the {{site.data.reuse.openshift_short}} web console. The permission to manage ConsoleYAMLSamples is required for the operator to register the setting up of samples.
- **Permission to list specific CustomResourceDefinitions**: This allows {{site.data.reuse.ep_name}} to identify whether other optional dependencies have been installed into the cluster. 

In addition to the previous permissions, the {{site.data.reuse.ep_name}} operator requires the following cluster-scoped permissions on {{site.data.reuse.openshift}}:

- **Permission to list ClusterRoles and ClusterRoleBindings**: The {{site.data.reuse.ep_name}} operator uses ClusterRoles created by the Operator Lifecycle Manager (OLM) as parents for supporting resources that the {{site.data.reuse.ep_name}} operator creates. This is needed so that the supporting resources are correctly cleaned up when {{site.data.reuse.ep_name}} is uninstalled. The permission to list ClusterRoles is required to allow the operator to identify the appropriate cluster role to use for this purpose.

#### Operator requirements for the {{site.data.reuse.flink_long}}

The {{site.data.reuse.flink_long}} has the following minimum resource requirements.

| CPU request (cores) | CPU limit (cores) | Memory request (Gi) | Memory limit (Gi) |
| ------------------- | ----------------- | ------------------- | ----------------- |
| 0.2                 | 1.0               | 0.25                | 0.5               |

You can only install one version of the {{site.data.reuse.flink_long}} on a cluster. Installing multiple versions on a single cluster is not supported.

You cannot install the {{site.data.reuse.flink_long}} on a cluster that already has the open-source Apache Flink operator installed. If the Apache Flink operator is already installed, ensure you uninstall it first, including the [removal of related Custom Resource Definitions (CRDs)](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.6/docs/development/guide/#generating-and-upgrading-the-crd){:target="_blank"}, and then install the {{site.data.reuse.flink_long}}.

## Red Hat OpenShift Security context constraints

{{site.data.reuse.ep_name}} requires a [security context constraint (SCC)](https://docs.openshift.com/container-platform/4.14/authentication/managing-security-context-constraints.html){:target="_blank"} to be bound to the target namespace prior to installation.

By default, {{site.data.reuse.ep_name}} complies with `restricted` or `restricted-v2` SCC depending on your {{site.data.reuse.openshift_short}} version.

## Network requirements

{{site.data.reuse.ep_name}} is supported for use with IPv4 networks only.

### Ingress controllers

To expose {{site.data.reuse.ep_name}} services externally outside your cluster, the {{site.data.reuse.ep_name}} operator will create:
- OpenShift routes when installing on {{site.data.reuse.openshift}}.

- Kubernetes ingress resources when installing on other Kubernetes platforms.


To use ingress, ensure you install and run an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/){:target="_blank"} on your Kubernetes platform. The SSL passthrough must be enabled in the ingress controller for your {{site.data.reuse.ep_name}} services to work. Refer to your ingress controller documentation for more information.

## Data storage requirements

If you want to set up persistent storage, see the [planning section](../planning/#planning-for-persistent-storage).

### Storage requirements for {{site.data.reuse.ep_name}}

Ensure that the cluster administrator creates one or more storage class that supports `ReadWriteOnce` and allows read and write access to non-root users.

For example, you can use one of the following systems:

- Red Hat OpenShift Data Foundation (previously OpenShift Container Storage) version 4.2 or later (block storage only)
- IBM Cloud Block storage
- IBM Storage Suite for IBM Cloud Paks: block storage from IBM Spectrum Virtualize, FlashSystem, or DS8K
- Portworx Storage version 2.5.5 or later
- Rook Ceph

If installing on RedHat OpenShift Kubernetes Service on IBM Cloud (ROKS), you can use either:

- IBM Cloud Block storage, `ibmc-block-<tier>`, where `<tier>` can be `gold`, `silver` or `bronze`
- IBM Cloud File storage with support for supplemental group IDs, `ibmc-file-<tier>-gid` (only on single-zone OpenShift clusters)


### Storage requirements for Flink

The Flink instances deployed by {{site.data.reuse.flink_long}} store the following data if persistent storage is configured:

- Checkpoints and savepoints. For more information about checkpoints, see the Flink documentation about [checkpoint storage](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/ops/state/checkpoints/#checkpoint-storage){:target="_blank"} and [checkpointing prerequisites](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/datastream/fault-tolerance/checkpointing/#prerequisites){:target="_blank"}. For more information about savepoints, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/ops/state/savepoints/){:target="_blank"}.
- When configured to persist states in RocksDB, the data of processed events is stored in a binary, compressed, and unencrypted format.

Apache Flink requires the use of a [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes){:target="_blank"} with the following capabilities:
- `volumeMode`: `Filesystem`. See [Volume Mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#volume-mode){:target="_blank"}.
- `accessMode`: `ReadWriteMany (RWX)`. See [access modes](https://docs.openshift.com/container-platform/4.14/storage/understanding-persistent-storage.html#pv-access-modes_understanding-persistent-storage){:target="_blank"}.


For example, you can use Rook Ceph for your storage.

If installing on RedHat OpenShift Kubernetes Service on IBM Cloud (ROKS), you can use either:

- IBM Cloud Block storage, `ibmc-block-<tier>`, where `<tier>` can be `gold`, `silver` or `bronze`
- IBM Cloud File storage with support for supplemental group IDs, `ibmc-file-<tier>-gid` (only on single-zone OpenShift clusters)


**Important:**
- For security reasons, the use of `hostPath` volumes is not supported.
- On the {{site.data.reuse.openshift_short}}, the dynamically provisioned volumes are created with the reclaim policy set to `Delete` by default. This means that the volume lasts only while the claim still exists in the system. If you delete the claim, the volume is also deleted, and all data on the volume is lost. If this is not appropriate, you can use the `Retain` policy. For more information about the reclaim policy, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming){:target="_blank"}.
- Some [storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/){:target="_blank"} support dynamic provisioning. If the `StorageClass` that you use supports dynamic provisioning, then a `PersistentVolume` can be dynamically provisioned when the `PersistentVolumeClaim` is created. Otherwise, the `PersistentVolume` must be created before you define the `PersistentVolumeClaim`.


## {{site.data.reuse.ep_name}} UI


The {{site.data.reuse.ep_name}} user interface (UI) is supported on the following web browsers:

- Google Chrome version 113 or later
- Mozilla Firefox version 113 or later
- Safari version 16.5 or later

## Certificate management

By default, all certificates that are required by {{site.data.reuse.ep_name}} are managed by a certificate manager. The certificate manager simplifies the process of creating, renewing, and using those certificates.

- On {{site.data.reuse.openshift}}, install IBM Cert Manager.
- On other Kubernetes platforms, use a Cert Manager that supports `GroupVersionKind` (GVK) such as `Issuer.cert-manager.io/v1` and `Certificate.cert-manager.io/v1`, or create certificates manually and provide them to {{site.data.reuse.ep_name}} by using Kubernetes secrets.


## IBM Cert Manager on {{site.data.reuse.openshift}}

If you already have a Cert Manager installed in your cluster, you can skip this installation.

To check whether a Cert Manager is installed in your cluster by using the OpenShift web console, complete the following steps:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. In the list of installed operators, check whether **IBM Cert Manager** is available and status is showing as `Succeeded`.

Alternatively, to check whether Cert Manager is installed in your cluster by using the CLI, run the following command and check whether `ibm-cert-manager-operator` is available:

```shell
oc get subs --all-namespaces
```

**Important:** You can only have one Cert Manager operator installed in your cluster. Choose the appropriate version depending on what other software is running in your environment. If you have an existing {{site.data.reuse.cp4i}} in your environment, check whether you have the {{site.data.reuse.fs}} operator running already and note the version.

Follow the instructions to install the Cert Manager based on the {{site.data.reuse.fs}} version.

#### With {{site.data.reuse.fs}} version 3.x

If you are installing {{site.data.reuse.flink_long}} and {{site.data.reuse.ep_name}} on a cluster where {{site.data.reuse.fs}} version 3.x is already installed, follow the instructions to install the Cert Manager operator.

**Note:** The following instructions apply in both online and offline clusters.

1. Ensure you have installed the {{site.data.reuse.fs}} as described in the [{{site.data.reuse.fs}} documentation](https://www.ibm.com/docs/en/cpfs?topic=installer){:target="_blank"}.
2. Create an `OperandRequest` custom resource with the following YAML in the Operand Deployment Lifecycle Manager as described in the [{{site.data.reuse.fs}} documentation](https://www.ibm.com/docs/en/cpfs?topic=323-installing-foundational-services-by-using-console#or-create){:target="_blank"}.

   ```yaml
   apiVersion: operator.ibm.com/v1alpha1
   kind: OperandRequest
   metadata:
      name: common-service
      namespace: <namespace>
   spec:
   requests:
      - operands:
        - name: ibm-cert-manager-operator
        registry: common-service
        registryNamespace: ibm-common-services
   ```

   Where `<namespace>` is the namespace from where you are creating the `OperandRequest` and planning to install the {{site.data.reuse.ep_name}} operator.

Verify that the `cert-manager` operator shows as `Succeeded` in the namespaces where you want to use {{site.data.reuse.ep_name}}.

#### With {{site.data.reuse.fs}} version 4.0.0, or without {{site.data.reuse.fs}}

Follow the instructions to install the Cert Manager 4.0.0 as part of {{site.data.reuse.fs}} version 4.0.0, or without {{site.data.reuse.fs}} in an online or offline environment.

**For online environments**

Follow the [{{site.data.reuse.fs}} instructions](https://www.ibm.com/docs/en/cloud-paks/foundational-services/4.0?topic=management-installing-cert-manager){:target="_blank"} to install the Cert Manager version 4.0.0 in online environments that are running with or without foundational services.

Verify that the `cert-manager` operator shows as `Succeeded` in the namespaces where you want to use {{site.data.reuse.ep_name}}.

**For offline environments**

If you are installing {{site.data.reuse.ep_name}} in an offline environment, follow the instructions in the [{{site.data.reuse.fs}} documentation](https://www.ibm.com/docs/en/cloud-paks/foundational-services/4.0?topic=manager-installing-cert-offline){:target="_blank"} to mirror the necessary images, and install the Cert Manager from its CASE bundle.

Verify that the `cert-manager` operator shows as `Succeeded` in the namespaces where you want to use {{site.data.reuse.ep_name}}.
