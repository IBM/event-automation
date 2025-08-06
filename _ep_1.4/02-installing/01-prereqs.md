---
title: "Prerequisites"
excerpt: "Prerequisites for installing Event Processing."
categories: installing
slug: prerequisites
toc: true
---

Ensure your environment meets the following prerequisites before installing {{site.data.reuse.ep_name}} and the associated {{site.data.reuse.ibm_flink_operator}}.

**Note:** {{site.data.reuse.ep_flink_version_align_note}}

## Container environment
{: #container-environment}

{{site.data.reuse.ep_name}} 1.4.x is supported on the {{site.data.reuse.openshift}} and the other Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

If you are using {{site.data.reuse.openshift}}, ensure you have the following set up for your environment:

- A supported version of the {{site.data.reuse.openshift_short}} [installed](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/){:target="_blank"}.  For supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).
- The {{site.data.reuse.openshift_short}} CLI (`oc`) [installed](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/cli_tools/openshift-cli-oc#cli-getting-started){:target="_blank"}.

If you are using other Kubernetes platforms, ensure you have the following set up for your environment:

- A supported version of a Kubernetes platform installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }}).
- The Kubernetes command-line tool (`kubectl`) [installed](https://kubernetes.io/docs/tasks/tools/){:target="_blank"}.

## Hardware requirements
{: #hardware-requirements}

Ensure that your hardware can accommodate the [resource requirements](#resource-requirements) for your planned deployment.

## Resource requirements
{: #resource-requirements}

{{site.data.reuse.ep_name}} resource requirements depend on several factors. The following sections provide guidance about minimum requirements for a starter deployment, and options for initial production configurations.

Minimum resource requirements are based on the total of requests set for the deployment. You will require more resources to accommodate the limit settings (see more about "requests" and "limits" later in this section).
Always ensure that you have sufficient resources in your environment to deploy the {{site.data.reuse.ibm_flink_operator}} and {{site.data.reuse.ep_name}} operator together with a Quick start or a Production instance of Flink and {{site.data.reuse.ep_name}}.

Flink resource requirements:

| Deployment                                                                                         | CPU (cores)                       | Memory (GiB)                    | Chargeable cores (see [Flink samples](../planning/#flink-sample-deployments)) |
|----------------------------------------------------------------------------------------------------|-----------------------------------|--------------------------------|-------------------------------------------------------------------------------|
| [Operator](#operator-requirements)                                                                 | 0.2                               | 1.0                            | N/A                                                                           |
| [Quick Start](../planning/#flink-quick-start-sample)                                               | 1.0                               | 4.0                            | 1                                                                             |
| [Minimal Production](../planning/#flink-minimal-production-sample)                                 | 1.25                              | 4.0                            | 2                                                                             |
| [Production](../planning/##flink-production-sample)                                                | 3.0                               | 12.0                           | 3                                                                             |
| [Production - Flink Application cluster](../planning/#flink-production-application-cluster-sample) |  3.0 | 12.0  | 3      |

{{site.data.reuse.ep_name}} resource requirements:

| Deployment                                                      | CPU (cores) | Memory (GiB) | Chargeable cores |
| --------------------------------------------------------------- | ----------- | ----------- | ---- |
| [Operator](#operator-requirements)                              | 0.2         | 1.0         | N/A  |
| [Quick start](../planning/#event-processing-sample-deployments) | 0.5         | 0.5         | N/A  |
| [Production](../planning/#event-processing-sample-deployments)  | 1           | 1           | N/A  |


**Note:** {{site.data.reuse.ep_name}} provides sample configurations to help you get started with deployments. The resource requirements for these specific samples are detailed in the [planning](../planning/#sample-deployments) section. If you do not have an {{site.data.reuse.ep_name}} installation on your system yet, always ensure that you include the resource requirements for the operator together with the intended {{site.data.reuse.ep_name}} instance requirements (quick start or production).

**Note:** In {{site.data.reuse.ibm_flink_operator}}, when deploying a `FlinkDeployment` custom resource, the initial number of Flink Job Manager (JM) pods is equal to the number of JM replicas indicated in the custom resource. All the provided samples configure 1 replica for the JM, except the [Production](../planning/#event-processing-sample-deployments) sample which has 2 replicas for JM.

Task Manager (TM) pods are scaled up and down horizontally on demand. A new TM replica is created when a job is deployed that exceeds the current slot capacity across all the currently running TMs, which is determined by the parameter `spec.flinkConfiguration.taskmanager.numberOfTaskSlots` in the `FlinkDeployment` custom resource.

{{site.data.reuse.ep_name}} is a [Kubernetes operator-based](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/){:target="_blank"} release and uses custom resources to define your {{site.data.reuse.ep_name}} configurations.
The {{site.data.reuse.ep_name}} operator uses the declared required state of your {{site.data.reuse.ep_name}} in the custom resources to deploy and manage the entire lifecycle of your {{site.data.reuse.ep_name}} instances. Custom resources are presented as YAML configuration documents that define instances of the `EventProcessing` custom resource type.

The provided samples define typical configuration settings for your {{site.data.reuse.ep_name}} instance, including security settings, and default values for resources such as CPU and memory defined as "request" and "limit" settings. [Requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/){:target="_blank"} are Kubernetes concepts for controlling resource types such as CPU and memory.

- Requests set the minimum requirements that a container requires to be scheduled. If your system does not have the required request value, then the services do not start.
- Limits set the value beyond which a container cannot consume the resource. It is the upper limit within your system for the service. Containers that exceed a CPU resource limit are throttled, and containers that exceed a memory resource limit are terminated by the system.

Ensure that you have sufficient CPU capacity and physical memory in your environment to service these requirements. Your {{site.data.reuse.ep_name}} instance can be updated dynamically through the configuration options that are provided in the custom resource.

### Operator requirements
{: #operator-requirements}

The {{site.data.reuse.ep_name}} operator and the {{site.data.reuse.ibm_flink_operator}} have the following requirements.

#### Requirements for the {{site.data.reuse.ep_name}} operator
{: #requirements-for-the-event-processing-operator}

The {{site.data.reuse.ep_name}} operator has the following minimum resource requirements. Ensure that you always include sufficient CPU capacity and physical memory in your environment to service the operator requirements.

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) |
| ------------------- | ----------------- | ------------------- | ----------------- |
| 0.2                 | 1.0               | 0.25                | 0.5               |

You can only install one version of the {{site.data.reuse.ep_name}} operator on a cluster. Installing multiple versions on a single cluster is not supported due to possible compatibility issues as they share the same Custom Resource Definitions (CRDs), making them unsuitable for coexistence.

##### Cluster-scoped permissions required

The {{site.data.reuse.ep_name}} operator requires the following cluster-scoped permissions:

- **Permission to manage admission webhooks**: The {{site.data.reuse.ep_name}} operator uses admission webhooks to provide immediate validation and feedback about the creation and modification of {{site.data.reuse.ep_name}} instances. The permission to manage webhooks is required for the operator to register these actions.
- **Permission to manage ConsoleYAMLSamples**: ConsoleYAMLSamples are used to provide samples for {{site.data.reuse.ep_name}} resources in the {{site.data.reuse.openshift_short}} web console. The permission to manage ConsoleYAMLSamples is required for the operator to register the setting up of samples.
- **Permission to list specific CustomResourceDefinitions**: This allows {{site.data.reuse.ep_name}} to identify whether other optional dependencies have been installed into the cluster. 

In addition to the previous permissions, the {{site.data.reuse.ep_name}} operator requires the following cluster-scoped permissions on {{site.data.reuse.openshift}}:

- **Permission to list ClusterRoles and ClusterRoleBindings**: The {{site.data.reuse.ep_name}} operator uses ClusterRoles created by the Operator Lifecycle Manager (OLM) as parents for supporting resources that the {{site.data.reuse.ep_name}} operator creates. This is needed so that the supporting resources are correctly cleaned up when {{site.data.reuse.ep_name}} is uninstalled. The permission to list ClusterRoles is required to allow the operator to identify the appropriate cluster role to use for this purpose.

#### Operator requirements for the {{site.data.reuse.ibm_flink_operator}}
{: #operator-requirements-for-the-ibm-operator-for-apache-flink}

The {{site.data.reuse.ibm_flink_operator}} has the following minimum resource requirements.

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) |
| ------------------- | ----------------- | ------------------- | ----------------- |
| 0.2                 | 1.0               | 0.25                | 0.5               |

You can only install one version of the {{site.data.reuse.ibm_flink_operator}} on a cluster. Installing multiple versions on a single cluster is not supported.

You cannot install the {{site.data.reuse.ibm_flink_operator}} on a cluster that already has the open-source Apache Flink operator installed. If the Apache Flink operator is already installed, ensure you uninstall it first, including the [removal of related Custom Resource Definitions (CRDs)](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.11/docs/development/guide/#generating-and-upgrading-the-crd){:target="_blank"}, and then install the {{site.data.reuse.ibm_flink_operator}}.

## Red Hat OpenShift Security context constraints
{: #red-hat-openshift-security-context-constraints}

{{site.data.reuse.ep_name}} requires a [security context constraint (SCC)](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/authentication_and_authorization/managing-pod-security-policies){:target="_blank"} to be bound to the target namespace prior to installation.

By default, {{site.data.reuse.ep_name}} complies with `restricted` or `restricted-v2` SCC depending on your {{site.data.reuse.openshift_short}} version.

## Network requirements
{: #network-requirements}

{{site.data.reuse.ep_name}} is supported for use with IPv4 networks only.

### Ingress controllers
{: #ingress-controllers}

To expose {{site.data.reuse.ep_name}} services externally outside your cluster, the {{site.data.reuse.ep_name}} operator will create:
- OpenShift routes when installing on {{site.data.reuse.openshift}}.

- Kubernetes ingress resources when installing on other Kubernetes platforms.


To use ingress, ensure you install and run an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/){:target="_blank"} on your Kubernetes platform. The SSL passthrough must be enabled in the ingress controller for your {{site.data.reuse.ep_name}} services to work. Refer to your ingress controller documentation for more information.

## Data storage requirements
{: #data-storage-requirements}

If you want to set up persistent storage, see the [planning section](../planning/#planning-for-persistent-storage).

### Storage requirements for {{site.data.reuse.ep_name}}
{: #storage-requirements-for-event-processing}

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
{: #storage-requirements-for-flink}

The Flink instances deployed by {{site.data.reuse.ibm_flink_operator}} store the following data if persistent storage is configured:

- Checkpoints and savepoints. For more information about checkpoints, see the Flink documentation about [checkpoint storage](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/checkpoints/#checkpoint-storage){:target="_blank"} and [checkpointing prerequisites](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/fault-tolerance/checkpointing/#prerequisites){:target="_blank"}. For more information about savepoints, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/){:target="_blank"}.
- When configured to persist states in RocksDB, the data of processed events is stored in a binary, compressed, and unencrypted format.

Apache Flink requires the use of a [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes){:target="_blank"} with the following capabilities:
- `volumeMode`: `Filesystem`. See [Volume Mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#volume-mode){:target="_blank"}.
- `accessMode`: `ReadWriteMany (RWX)`. See [access modes](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/storage/understanding-persistent-storage#pv-capacity_understanding-persistent-storage){:target="_blank"}.


For example, you can use Rook Ceph for your storage.

If installing on RedHat OpenShift Kubernetes Service on IBM Cloud (ROKS), you can use either:

- IBM Cloud Block storage, `ibmc-block-<tier>`, where `<tier>` can be `gold`, `silver` or `bronze`
- IBM Cloud File storage with support for supplemental group IDs, `ibmc-file-<tier>-gid` (only on single-zone OpenShift clusters)


**Important:**
- For security reasons, the use of `hostPath` volumes is not supported.
- On the {{site.data.reuse.openshift_short}}, the dynamically provisioned volumes are created with the reclaim policy set to `Delete` by default. This means that the volume lasts only while the claim still exists in the system. If you delete the claim, the volume is also deleted, and all data on the volume is lost. If this is not appropriate, you can use the `Retain` policy. For more information about the reclaim policy, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming){:target="_blank"}.
- Some [storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/){:target="_blank"} support dynamic provisioning. If the `StorageClass` that you use supports dynamic provisioning, then a `PersistentVolume` can be dynamically provisioned when the `PersistentVolumeClaim` is created. Otherwise, the `PersistentVolume` must be created before you define the `PersistentVolumeClaim`.


## {{site.data.reuse.ep_name}} UI
{: #event-processing-ui}


The {{site.data.reuse.ep_name}} user interface (UI) is supported on the following web browsers:

- Google Chrome version 113 or later
- Mozilla Firefox version 113 or later
- Safari version 16.5 or later


## Certificate management
{: #certificate-management}

By default, all certificates that are required by {{site.data.reuse.eem_name}} are managed by a certificate manager. A certificate manager simplifies the process of creating, renewing, and using those certificates.

- On {{site.data.reuse.openshift}}, install the cert-manager Operator for Red Hat OpenShift.
- On other Kubernetes platforms, use a certificate manager installation, for example [cert-manager](https://cert-manager.io/docs/), that supports `Issuer.cert-manager.io/v1` and `Certificate.cert-manager.io/v1` GroupVersionKind (GVK), or create certificates manually and provide them to {{site.data.reuse.ep_name}} by using Kubernetes secrets.

### The cert-manager Operator for {{site.data.reuse.openshift}}
{: #the-cert-manager-operator-for-red-hat-openshift-container-platform}

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

- If you need to install the cert-manager Operator for Red Hat OpenShift, follow the instructions in the [OpenShift documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/security_and_compliance/cert-manager-operator-for-red-hat-openshift#cert-manager-operator-install).

**Important:** You can only have one cert-manager Operator for Red Hat OpenShift installed on your cluster. Choose the appropriate version depending on what other software is running in your environment. If you have an existing {{site.data.reuse.cp4i}} deployment, check whether you have a {{site.data.reuse.fs}} operator running already and note the version.


## Schema registry requirements
{: #schema-registry-requirements}

You can define the event structure and consume encoded messages that use an Avro schema that is stored in a schema registry.

Before you configure the event source node with an Avro schema that uses a schema registry, the following requirements must be met:

- Only the schema registry from {{site.data.reuse.es_name}} or a registry that supports the Confluent REST API is supported.
- To securely connect the schema registry and {{site.data.reuse.ep_name}}, an SSL connection must be enabled. For more information, see [configuring](../configuring/#configuring-ssl-for-api-server-database-and-schema-registry).
- Ensure that you retrieve the URL to the REST endpoint of the schema registry. For example, to retrieve the URL from {{site.data.reuse.es_name}}, complete the following steps:


   1. Log in to your {{site.data.reuse.es_name}} UI as an administrator from a supported web browser. For more information, see [how to determine the login URL]({{ 'es/getting-started/logging-in/' | relative_url }}) for your Event Streams UI.
   1. In the {{site.data.reuse.es_name}} home page, click the **Connect to this cluster** tile to open the **Cluster connection** tile.
   1. Copy the schema registry URL in the **Schema registry endpoint**. Use this URL when you configure the event source node.

**Important:** Expected messages in the topic that is configured in the event source node must be compatible with the Confluent Avro format (Avro binary-encoded messages with a schema ID encoded in 4 bytes). For instance, when messages are produced by using a Java producer and the [{{site.data.reuse.es_name}} Apicurio Registry]({{ 'es/schemas/setting-java-apps-apicurio-serdes/#additional-configuration-options-for-apicurio-serdes-library' |  relative_url }}), ensure that you set the following properties:
- `apicurio.registry.headers.enabled=false`
- `apicurio.registry.as-confluent=true`
