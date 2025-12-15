---
title: "Prerequisites"
excerpt: "Prerequisites for installing Event Streams."
categories: installing
slug: prerequisites
toc: true
---



Ensure your environment meets the following prerequisites before installing {{site.data.reuse.es_name}}.

## Container environment
{: #container-environment}

{{site.data.reuse.es_name}} is supported on the {{site.data.reuse.openshift}} and other Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers.

If you are using {{site.data.reuse.openshift}}, ensure you have the following set up for your environment:

- A supported version of {{site.data.reuse.openshift_short}} on a supported system [installed](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/overview/welcome-index){:target="_blank"}. For supported container platform versions and systems, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}). 
- The {{site.data.reuse.openshift_short}} CLI (`oc`) [installed](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/cli_tools/openshift-cli-oc#cli-about-cli_cli-developer-commands){:target="_blank"}.


If you are using other Kubernetes platforms, ensure you have the following set up for your environment:

- A supported version of a Kubernetes platform on a supported system installed. For supported container platform versions and systems, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).
- The Kubernetes command-line tool (`kubectl`) [installed](https://kubernetes.io/docs/tasks/tools/){:target="_blank"}.

**Note:** For completing tasks by using the command line, you can use both `kubectl` and `oc` commands if your deployment is on the  {{site.data.reuse.openshift_short}}. This documentation set includes instructions that use the `kubectl` command, except for cases where the task is specific to OpenShift.


## Hardware requirements
{: #hardware-requirements}

Ensure your hardware can accommodate the [resource requirements](#resource-requirements) for your planned deployment.

Kubernetes manages the allocation of containers within your cluster. This allows resources to be available for other {{site.data.reuse.es_name}} components which might be required to reside on the same node.

For production systems, it is recommended to have {{site.data.reuse.es_name}} configured with at least one Kafka node pool consisting of 3 broker replicas. This requires a minimum of 3 worker nodes available for use by {{site.data.reuse.es_name}}. Ensure each worker node runs on a separate physical server. See the guidance about [Kafka high availability](../planning/#kafka-high-availability) for more information.

## Resource requirements
{: #resource-requirements}

{{site.data.reuse.es_name}} resource requirements depend on several factors. The following sections provide guidance about minimum requirements for a starter deployment, and options for initial production configurations.

Installing {{site.data.reuse.es_name}} has two phases:

1. Install the {{site.data.reuse.es_name}} operator. The operator will then be available to install and manage your {{site.data.reuse.es_name}} instances.
2. Install one or more instances of {{site.data.reuse.es_name}} by applying configured custom resources. Sample configurations for development and production use cases are provided to get you started.

Minimum resource requirements are as follows, and are based on the total of requests set for the deployment. You will require more resources to accommodate the limit settings (see more about "requests" and "limits" later in this section).
Always ensure you have sufficient resources in your environment to deploy the {{site.data.reuse.es_name}} operator together with a development or a production {{site.data.reuse.es_name}} instance.

| Deployment                                          | CPU (cores) | Memory (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| --------------------------------------------------- | ----------- | ----------- | ---- |
| [Operator](#operator-requirements)                  | 0.2         | 1.0         | N/A  |
| [Development](../planning/#sample-deployments)      | 2.4         | 5.4         | 1    |
| [Production](../planning/#sample-deployments)       | 2.8         | 5.9         | 3    |

**Note:** {{site.data.reuse.es_name}} provides sample configurations to help you get started with deployments. The resource requirements for these specific samples are detailed in the [planning](../planning/#sample-deployments) section. If you do not have an {{site.data.reuse.es_name}} installation on your system yet, always ensure you include the resource requirements for the operator together with the intended {{site.data.reuse.es_name}} instance requirements (development or production).

{{site.data.reuse.es_name}} is a [Kubernetes operator-based](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/){:target="_blank"} release and uses custom resources to define your {{site.data.reuse.es_name}} configurations.
The {{site.data.reuse.es_name}} operator uses the declared required state of your {{site.data.reuse.es_name}} in the custom resources to deploy and manage the entire lifecycle of your {{site.data.reuse.es_name}} instances. Custom resources are presented as YAML configuration documents that define instances of the `EventStreams` custom resource type.

The provided samples define typical configuration settings for your {{site.data.reuse.es_name}} instance, including broker configurations, security settings, and default values for resources such as CPU and memory defined as "request" and "limit" settings. [Requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/){:target="_blank"} are Kubernetes concepts for controlling resource types such as CPU and memory.

- Requests set the minimum requirements a container requires to be scheduled. If your system does not have the required request value, then the services will not start up.
- Limits set the value beyond which a container cannot consume the resource. It is the upper limit within your system for the service. Containers that exceed a CPU resource limit are throttled, and containers that exceed a memory resource limit are terminated by the system.

Ensure you have sufficient CPU capacity and physical memory in your environment to service these requirements. Your {{site.data.reuse.es_name}} instance can be dynamically updated later through the configuration options provided in the custom resource.

### Operator requirements
{: #operator-requirements}

The {{site.data.reuse.es_name}} operator requires the following minimum resource requirements. Ensure you always include sufficient CPU capacity and physical memory in your environment to service the operator requirements.

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) |
| ------------------- | ----------------- | ------------------- | ----------------- |
| 0.2                 | 1.0               | 1.0                 | 1.0               |


#### Cluster-scoped permissions required
{: #cluster-scoped-permissions-required}

The {{site.data.reuse.es_name}} operator requires the following cluster-scoped permissions:

- **Permission to list nodes in the cluster**: When the {{site.data.reuse.es_name}} operator is deploying a Kafka cluster that spans [multiple availability zones](../planning/#multiple-availability-zones), it needs to label the pods with zone information. The permission to list nodes in the cluster is required to retrieve the information for these labels.
- **Permission to manage admission webhooks**: The {{site.data.reuse.es_name}} operator uses admission webhooks to provide immediate validation and feedback about the creation and modification of {{site.data.reuse.es_name}} instances. The permission to manage webhooks is required for the operator to register these actions.
- **Permission to list specific CustomResourceDefinitions**: This allows {{site.data.reuse.es_name}} to identify whether other optional dependencies have been installed into the cluster.

In addition to the previous permissions, the {{site.data.reuse.es_name}} operator requires the following cluster-scoped permissions on {{site.data.reuse.openshift}}:

- **Permission to manage ConsoleYAMLSamples**: ConsoleYAMLSamples are used to provide samples for {{site.data.reuse.es_name}} resources in the {{site.data.reuse.openshift_short}} web console. The permission to manage ConsoleYAMLSamples is required for the operator to register the setting up of samples.
- **Permission to list ClusterRoles and ClusterRoleBindings**: The {{site.data.reuse.es_name}} operator uses ClusterRoles created by the Operator Lifecycle Manager (OLM) as parents for supporting resources that the {{site.data.reuse.es_name}} operator creates. This is needed so that the supporting resources are correctly cleaned up when {{site.data.reuse.es_name}} is uninstalled. The permission to list ClusterRoles is required to allow the operator to identify the appropriate cluster role to use for this purpose.

### Adding {{site.data.reuse.es_name}} geo-replication to a deployment
{: #adding-event-streams-geo-replication-to-a-deployment}

The {{site.data.reuse.es_name}} [geo-replicator](../../georeplication/about/) allows messages sent to a topic on one {{site.data.reuse.es_name}} cluster to be automatically replicated to another {{site.data.reuse.es_name}} cluster. 

To use this feature, ensure you have the following additional resources available. The following table shows the prerequisites for each geo-replicator node.

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---- |
| 1.0                 | 2.0               | 2.0                 | 2.0               | 1  |

For instructions about installing geo-replication, see [configuring](../configuring/#setting-geo-replication-nodes).


## Red Hat OpenShift Security Context Constraints
{: #red-hat-openshift-security-context-constraints}

If used, {{site.data.reuse.es_name}} requires a [Security Context Constraint (SCC)](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/authentication_and_authorization/managing-pod-security-policies){:target="_blank"} to be bound to the target namespace prior to installation.

By default, {{site.data.reuse.es_name}} complies with `restricted` or `restricted-v2` SCC depending on your {{site.data.reuse.openshift_short}} version.

If you use a custom SCC (for example, one that is more restrictive), or have an operator that updates the default SCC, the changes might interfere with the functioning of your {{site.data.reuse.es_name}} deployment. To resolve any issues, apply the SCC provided by {{site.data.reuse.es_name}} as described in [troubleshooting](../../troubleshooting/default-scc-issues).

## Kubernetes Pod Security Standards
{: #kubernetes-pod-security-standards}

If used, {{site.data.reuse.es_name}} requires a Pod Security Standard (PSS) to be bound to the target namespace prior to installation.

By default, {{site.data.reuse.es_name}} complies with the following:

-  Kubernetes 1.24 and earlier complies with the `ibm-restricted-psp` [Pod Security Policy](https://github.com/IBM/cloud-pak/blob/master/spec/security/psp/ibm-restricted-psp.yaml){:target="_blank"}.
-  Kubernetes 1.25 and later complies with the built-in `restricted` [Pod Security Standard](https://kubernetes.io/docs/concepts/security/pod-security-standards/){:target="_blank"}.

## Network requirements
{: #network-requirements}

{{site.data.reuse.es_name}} is supported for use with IPv4 networks only.

### Ingress controllers
{: #ingress-controllers}

When you want to expose {{site.data.reuse.es_name}} services externally outside your cluster, you can use OpenShift routes or ingress on other Kubernetes platforms.

When using ingress, ensure you install and run an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/){:target="_blank"} on your Kubernetes platform. The SSL passthrough must be enabled in the ingress controller for your {{site.data.reuse.es_name}} services to work. Refer to your ingress controller documentation for more information.

## Data storage requirements
{: #data-storage-requirements}

If you want to set up [persistent storage](../planning/#planning-for-persistent-storage), {{site.data.reuse.es_name}} requires block storage configured to use the XFS or ext4 file system. The use of file storage (for example, NFS) is not recommended.

For example, you can use one of the following systems:

- Red Hat OpenShift Data Foundation (previously OpenShift Container Storage) version 4.2 or later (block storage only)
- IBM Cloud Block storage
- IBM Storage Suite for IBM Cloud Paks: block storage from IBM Spectrum Virtualize, FlashSystem, or DS8K
- Portworx Storage version 2.5.5 or later
- Kubernetes local volumes
- Amazon Elastic Block Store (EBS)
- Rook Ceph

## Schema requirements
{: #schema-requirements}

The Apicurio Registry is used in {{site.data.reuse.es_name}} to store message schemas. Each {{site.data.reuse.es_name}} cluster has its own instance of Apicurio Registry providing schema registry functionality. 

To connect your applications to use the [Apicurio Registry](../../schemas/overview#schema-registry), ensure all applications connecting to your instance of {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.5.0 or later.

## {{site.data.reuse.es_name}} UI
{: #event-streams-ui}

The {{site.data.reuse.es_name}} user interface (UI) is supported on the following web browsers:

- Google Chrome version 65 or later
- Mozilla Firefox version 59 or later
- Safari version 11.1 or later

## {{site.data.reuse.es_name}} CLI
{: #event-streams-cli}

The {{site.data.reuse.es_name}} command-line interface (CLI) is supported on the following systems:

- Windows 10 or later
- Linux® Ubuntu 16.04 or later
- macOS 10.13 (High Sierra) or later

See the post-installation tasks for information about [installing the CLI](../post-installation/#installing-the-event-streams-command-line-interface).

## Kafka clients
{: #kafka-clients}

The Apache Kafka Java client included with {{site.data.reuse.es_name}} is supported for use with the following Java versions:
- Java 11 or later for Kafka clients and streaming applications.
- Java 17 or later for Kafka Connect plugins.

When connecting to {{site.data.reuse.es_name}}, ensure that your Kafka Java clients are compatible with Kafka 4.0. The following table summarizes the compatibility based on client version:

| Kafka client version     | Compatibility with Kafka 4.0    |
|-----------------------|--------------------------------|
| 3.x                              | Fully compatible with Kafka clients, Kafka streams, and Kafka Connect applications.|
| 2.1 to 2.8                     | Partially compatible with Kafka clients, Kafka streams, and Kafka Connect. | 
| 0.x, 1.x, and 2.0          | Not compatible with Kafka clients, Kafka streams, and Kafka Connect. |

If you are using an earlier Kafka Java client, update the client libraries to a compatible version. For more information, see [Kafka client-broker compatibility](https://kafka.apache.org/40/documentation/compatibility.html){:target="_blank"}.

If you are using other client libraries, for example a `librdkafka` [implementation](https://github.com/edenhill/librdkafka){:target="_blank"} of the Apache Kafka protocol, review the [compatibility, deprecation, and migration plan](https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=235838251#KIP896:RemoveoldclientprotocolAPIversionsinKafka4.0-Compatibility,Deprecation,andMigrationPlan){:target="_blank"} to ensure your applications use compatible client libraries.

If you encounter client-side issues, IBM can assist you to resolve those issues. For more information, see the [support policy]({{ 'support/support-policy' | relative_url }}).

## Optional: Authenticate {{site.data.reuse.es_name}} with Keycloak
{: #prereqs-keycloak}

If you are installing on the {{site.data.reuse.openshift_short}}, you can configure access for your integration capabilities such as {{site.data.reuse.es_name}} by using [Keycloak](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.2?topic=administering-identity-access-management){:target="_blank"}.

Keycloak is supported on {{site.data.reuse.es_name}} 11.3.0 and later when an {{site.data.reuse.cp4i}} version 2023.4.1 (operator 7.2.0) or later is available. See the [{{site.data.reuse.cp4i}} documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.2?topic=installing){:target="_blank"} for information about installing {{site.data.reuse.cp4i}}.

For more information, see sections about [configuring UI security](../configuring/#configuring-ui-and-cli-security) and [managing access with Keycloak](../../security/managing-access/#managing-access-to-the-ui-with-keycloak).

### Limitations
{: #limitations}

Authentication with Keycloak is not supported for [REST endpoints](../configuring/#rest-services-access) (REST Producer, Admin API, Apicurio Registry).