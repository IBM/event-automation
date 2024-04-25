---
title: "Planning your installation"
excerpt: "Planning your installation of Event Streams."
categories: installing
slug: planning
toc: true
---

Consider the following when planning your installation of {{site.data.reuse.es_name}}.

Decide the purpose of your deployment, for example, whether you want to try a starter deployment for testing purposes, or start setting up a production deployment.

- Use the [sample deployments](#sample-deployments) as a starting point if you need something to base your deployment on.
- Size your planned deployment by considering potential throughput, the number of producers and consumers, Kafka performance tuning, and other aspects. For more details, see the [performance considerations](../capacity-planning) section.
- For production use, and whenever you want your data to be saved in the event of a restart, set up [persistent storage](#planning-for-persistent-storage).
- Consider the options for [securing](#planning-for-security) your deployment.
- Plan for [resilience](#planning-for-resilience) by understanding Kafka high availability and how to support it, set up multiple availability zones for added resilience, and consider topic mirroring to help with your [disaster recovery](../../georeplication/disaster-recovery) planning.
- Consider setting up [logging](#planning-for-log-management) for your deployment to help troubleshoot any potential issues.

## Sample deployments

A number of sample configurations are provided when [installing]({{ 'installpagedivert' | relative_url }}) {{site.data.reuse.es_name}} on which you can base your deployment. These range from smaller deployments for non-production development or general experimentation to large scale clusters ready to handle a production workload.

- [Lightweight without security](#example-deployment-lightweight-without-security)
- [Development](#example-deployment-development)
- [Minimal production](#example-deployment-minimal-production)
- [Production 3 brokers](#example-deployment-production-3-brokers)
- [Production 6 brokers](#example-deployment-production-6-brokers)
- [Production 9 brokers](#example-deployment-production-9-brokers)

If you are [installing](../installing/#installing-an-instance-by-using-the-web-console) on the {{site.data.reuse.openshift_short}}, you can view and apply the sample configurations in the web console. The sample configurations are also available in [GitHub](https://ibm.biz/ea-es-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.es_name}} version to access the correct samples, and then go to `/cr-examples/eventstreams/openshift` to access the OpenShift samples.

For other Kubernetes platforms, the custom resource samples are included in the Helm chart package. The sample configurations are also available in [GitHub](https://ibm.biz/ea-es-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.es_name}} version to access the correct samples, and then go to `/cr-examples/eventstreams/kubernetes` to access the samples for other Kubernetes platforms.

**Important:** For a production setup, the sample configuration values are for guidance only, and you might need to change them. Ensure you set your resource values as required to cope with the intended usage, and also consider important configuration options for your environment and {{site.data.reuse.es_name}} requirements as described in the rest of this planning section.


#### Example deployment: **Lightweight without security**

Overview: A non-production deployment suitable for basic development and test activities, with access to Kafka brokers only from within the same cluster (only internal listener configured). For environments where minimum resource requirements, persistent storage, access control and encryption are not required.

This example provides a starter deployment that can be used if you simply want to try {{site.data.reuse.es_name}} with a minimum resource footprint. It installs an {{site.data.reuse.es_name}} instance with the following characteristics:
- A small single broker Kafka cluster and a single node ZooKeeper.
- As there is only 1 broker, no message replication takes place between brokers, and the system topics (message offset and transaction state) are configured accordingly for this.
- There is no encryption internally between containers.
- External connections use TLS encryption (for example, to the {{site.data.reuse.es_name}} UI), but no authentication to keep the configuration to a minimum, making it easy to experiment with the platform.
- No external connections are configured for Kafka brokers. Only internal connections within the cluster can be used for producing and consuming messages.


Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }}))|
| ------------------- | ----------------- | ------------------- | ----------------- | ---- |
| 2.4                 | 8.2               | 5.4                 | 8.2               | 1  |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.es_name}} instance is able to consume.

{{site.data.reuse.sample_select_note}}

**Important:** This deployment is not suitable for a production system even if storage configuration is applied. This is due to the number of Kafka and ZooKeeper nodes not being appropriate for data persistence and high availability. For a production system, at least three Kafka brokers and ZooKeeper nodes are required for an instance, see [production](#sample-deployments) sample deployments later for alternatives.

In addition, this deployment installs a single ZooKeeper node with ephemeral storage. If the ZooKeeper pod is restarted, either during normal operation or as part of an upgrade, all messages and all topics will be lost and both ZooKeeper and Kafka pods will move to an error state. To recover the cluster, restart the Kafka pod by deleting it.

#### Example deployment: **Development**

Overview: A non-production deployment for experimenting with {{site.data.reuse.es_name}} configured for high availability, authentication, and no persistent storage. Suitable for basic development and testing activities.

This example provides a starter deployment that can be used if you want to try {{site.data.reuse.es_name}} with a minimum resource footprint. It installs an {{site.data.reuse.es_name}} instance with the following settings:
- 3 Kafka brokers and 3 ZooKeeper nodes.
- Internally, Transport Layer Security (TLS) encryption is used between containers.
- External connections use TLS encryption and Salted Challenge Response Authentication Mechanism (SCRAM-SHA-512) authentication.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }}))|
| ------------------- | ----------------- | ------------------- | ----------------- | ---- |
| 2.8                 | 12.2              | 5.9                 | 14.2              | 3  |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.es_name}} instance is able to consume.

{{site.data.reuse.sample_select_note}}

**Note:** If you want to authenticate with SCRAM for this **Development** deployment, see the **Development SCRAM** sample. The **Development SCRAM** sample has the same settings and resource requirements as the Development sample, but does not require {{site.data.reuse.icpfs}} to be installed and specifies [SCRAM authentication](../../security/managing-access/#managing-access-to-the-ui-and-cli-with-scram) to access the {{site.data.reuse.es_name}} UI and CLI.

#### Example deployment: **Minimal production**

Overview: A minimal production deployment for {{site.data.reuse.es_name}}.

This example provides the smallest possible production deployment that can be configured for {{site.data.reuse.es_name}}. It installs an {{site.data.reuse.es_name}} instance with the following settings:
- 3 Kafka brokers and 3 ZooKeeper nodes.
- Internally, TLS encryption is used between containers.
- External connections use TLS encryption and SCRAM-SHA-512 authentication.
- Kafka tuning settings consistent with 3 brokers are applied as follows:

   ```shell
   num.replica.fetchers: 3
   num.io.threads: 24
   num.network.threads: 9
   log.cleaner.threads: 6
   ```

If a storage solution has been configured, the following characteristics make this a production-ready deployment:

- Messages are replicated between brokers to ensure that no single broker is a point of failure. If a broker restarts, producers and consumers of messages will not experience any loss of service.
- The number of threads made available for replicating messages between brokers, is increased to 3 from the default 1. This helps to prevent bottlenecks when replicating messages between brokers, which might otherwise prevent the Kafka brokers from being fully utilized.
- The number of threads made available for processing requests is increased to 24 from the default 8, and the number of threads made available for managing network traffic is increased to 9 from the default 3. This helps prevent bottlenecks for producers or consumers, which might otherwise prevent the Kafka brokers from being fully utilized.
- The number of threads made available for cleaning the Kafka log is increased to 6 from the default 1. This helps to ensure that records that have exceeded their retention period are removed from the log in a timely manner, and prevents them from accumulating in a heavily loaded system.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }}))|
| ------------------- | ----------------- | ------------------- | ----------------- | ---- |
| 2.8                 | 12.2              | 5.9                 | 14.2              | 3  |

{{site.data.reuse.sample_select_note}}

{{site.data.reuse.prod_persistence_note}}

**Note:** If you want to authenticate with SCRAM for this **Minimal production** deployment, see the **Minimal production SCRAM** sample. The **Minimal production SCRAM** sample has the same settings and resource requirements as the Development sample, but does not require {{site.data.reuse.icpfs}} to be installed and specifies [SCRAM authentication](../../security/managing-access/#managing-access-to-the-ui-and-cli-with-scram) to access the {{site.data.reuse.es_name}} UI and CLI.

#### Example deployment: **Production 3 brokers**

Overview: A small production deployment for {{site.data.reuse.es_name}}.

This example installs a production-ready {{site.data.reuse.es_name}} instance similar to the [**Minimal production**](#example-deployment-minimal-production) setup, but with added resource requirements:
- 3 Kafka brokers and 3 ZooKeeper nodes.
- Internally, TLS encryption is used between containers.
- External connections use TLS encryption and SCRAM SHA 512 authentication.
- The memory and CPU requests and limits for the Kafka brokers are increased compared to the **Minimal production** sample described previously to give them the bandwidth to process a larger number of messages.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }}))|
| ------------------- | ----------------- | ------------------- | ----------------- | ---- |
| 8.5                 | 15.2              | 29.3                | 31.9              | 6  |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.es_name}} instance is able to consume.

{{site.data.reuse.sample_select_note}}

{{site.data.reuse.prod_persistence_note}}

#### Example deployment: **Production 6 brokers**

Overview: A medium sized production deployment for {{site.data.reuse.es_name}}.

This sample configuration is similar to the [**Production 3 brokers**](#example-deployment-production-3-brokers) sample described earlier, but with an increase in the following settings:
- Uses 6 brokers rather than 3 to allow for additional message capacity.
- The resource settings for the individual brokers are the same, but the number of threads made available for replicating messages between brokers is increased to 6 to cater for the additional brokers to manage.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }}))|
| ------------------- | ----------------- | ------------------- | ----------------- | ---- |
| 14.5                | 21.2              | 53.0                | 55.6              | 12 |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.es_name}} instance is able to consume.

{{site.data.reuse.sample_select_note}}

{{site.data.reuse.prod_persistence_note}}


#### Example deployment: **Production 9 brokers**

Overview: A large production deployment for {{site.data.reuse.es_name}}.

This sample configuration is similar to the [**Production 6 brokers**](#example-deployment-production-6-brokers) sample described earlier, but with an increase in the following settings:
- Uses 9 Brokers rather than 6 to allow for additional message capacity.
- The resource settings for the individual brokers are the same, but the number of threads made available for replicating messages between brokers is increased to 9 to cater for the additional brokers to manage.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }}))|
| ------------------- | ----------------- | ------------------- | ----------------- | ---- |
| 20.5                | 27.2              | 76.7                | 79.3              | 18 |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.es_name}} instance is able to consume.

{{site.data.reuse.sample_select_note}}

{{site.data.reuse.prod_persistence_note}}


## Planning for persistent storage

If you plan to have persistent volumes, [consider the disk space](../capacity-planning/#disk-space-for-persistent-volumes) required for storage.

Both Kafka and ZooKeeper rely on fast write access to disks. Use separate dedicated disks for storing Kafka and ZooKeeper data. For more information, see the disks and filesystems guidance in the [Kafka documentation](https://kafka.apache.org/documentation/#diskandfs){:target="_blank"}, and the deployment guidance in the [ZooKeeper documentation](https://zookeeper.apache.org/doc/r3.5.7/zookeeperAdmin.html#sc_designing){:target="_blank"}.

If persistence is enabled, each Kafka broker and ZooKeeper server requires one physical volume each. The number of Kafka brokers and ZooKeeper servers depends on your setup (for example, see the provided samples described in [resource requirements](../prerequisites/#resource-requirements)).

You either need to create a [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#static){:target="_blank"} for each physical volume, or specify a storage class that supports [dynamic provisioning](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#dynamic){:target="_blank"}. Each component can use a different storage class to control how physical volumes are allocated.

 For information about creating persistent volumes and creating a storage class that supports dynamic provisioning:

- For {{site.data.reuse.openshift_short}}, see the [{{site.data.reuse.openshift_short}} documentation](https://docs.openshift.com/container-platform/4.14/storage/understanding-persistent-storage.html){:target="_blank"}.
- For other Kubernetes platforms, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/){:target="_blank"}.

You must have the Cluster Administrator role for creating persistent volumes or a storage class.

- If these persistent volumes are to be created manually, this must be done by the system administrator before installing {{site.data.reuse.es_name}}. These will then be claimed from a central pool when the {{site.data.reuse.es_name}} instance is deployed. The installation will then claim the required number of persistent volumes from this pool.
- If these persistent volumes are to be created automatically, ensure a [dynamic provisioner](https://docs.openshift.com/container-platform/4.14/storage/dynamic-provisioning.html){:target="_blank"} is configured for the storage class you want to use. See [data storage requirements](../prerequisites/#data-storage-requirements) for information about storage systems supported by {{site.data.reuse.es_name}}.

**Important:** When creating persistent volumes for each component, ensure the correct **Access mode** is set for the volumes as described in the following table.

| Component       | Access mode                      |
| --------------- | -------------------------------- |
| Kafka           | `ReadWriteOnce`                  |
| ZooKeeper       | `ReadWriteOnce`                  |

To use persistent storage, [configure the storage properties](../configuring/#enabling-persistent-storage) in your `EventStreams` custom resource.

## Planning for security

{{site.data.reuse.es_name}} has highly configurable security options that range from the fully secured default configuration to no security for basic development and testing.

The main security vectors to consider are:

- Kafka listeners
- Pod-to-Pod communication
- Access to the {{site.data.reuse.es_name}} UI and CLI
- REST endpoints (REST Producer, Admin API, Apicurio Registry)

Secure instances of {{site.data.reuse.es_name}} will make use of TLS to protect network traffic. Certificates will be generated by default, or you can [use custom certificates](../configuring/#using-your-own-certificates).

**Note:** If you want to use custom certificates, ensure you configure them before installing {{site.data.reuse.es_name}}.

### {{site.data.reuse.es_name}} UI and CLI access

You can [configure secure access](../../installing/configuring/#configuring-ui-and-cli-security) to the {{site.data.reuse.es_name}} UI and CLI. Depending on the authentication type set, you log in by using an {{site.data.reuse.icpfs}} Identity and Access Management (IAM) user, or by using a Kafka user configured with SCRAM-SHA-512 authentication, or by using Keycloak as part of {{site.data.reuse.cp4i}}. For more information about accessing the UI and CLI securely, see [managing access](../../security/managing-access/#accessing-the-event-streams-ui-and-cli).

#### SCRAM

If you set SCRAM authentication access for the {{site.data.reuse.es_name}} UI and CLI, Kafka users that have been configured to use SCRAM-SHA-512 authentication can log in to the {{site.data.reuse.es_name}} UI and CLI by using the username and password of that Kafka user. They can then access parts of the UI and run CLI commands based on the ACL permissions of the Kafka user.

Whilst it is highly recommended to always configure {{site.data.reuse.es_name}} with security enabled, it is also possible to configure the {{site.data.reuse.es_name}} UI to not require a login, which can be useful for proof of concept (PoC) environments. For details, see [configuring {{site.data.reuse.es_name}} UI and CLI access](../configuring/#configuring-ui-and-cli-security).

#### Keycloak

By default, in Keycloak, the secure {{site.data.reuse.es_name}} instance will require an `eventstreams-admin` or `admin` [role](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=management-roles-permissions){:target="_blank"} to authorize access.

You can add users and groups directly to Keycloak, connect Keycloak to an LDAP user registry to import users and groups, or connect Keycloak to an OpenID Connect (OIDC) or Security Assertion Markup Language (SAML) identity provider to manage users and groups. See how to [add users and groups](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=management-adding-users){:target="_blank"} based on your preference.

**Note:** The {{site.data.reuse.es_name}} CLI is not available when configuring {{site.data.reuse.es_name}} with Keycloak.

#### IAM

{{site.data.reuse.iam_note}}

By default, in IAM, the secure {{site.data.reuse.es_name}} instance will require an `Administrator` or higher [role](https://www.ibm.com/docs/en/cpfs?topic=guide-role-based-access-control-clusters#iam){:target="_blank"} (`ClusterAdministrator` and `CloudpakAdministrator`) to authorize access.

You can connect to a Lightweight Directory Access Protocol (LDAP) directory and add users from your LDAP directory into your cluster. For example, if you are using IAM, you can configure IAM to setup LDAP, assign roles to LDAP users, and [create teams](https://www.ibm.com/docs/en/cloud-paks/foundational-services/3.23?topic=apis-team-management#create){:target="_blank"}, as described in [configuring LDAP connections](https://www.ibm.com/docs/en/cloud-paks/foundational-services/3.23?topic=users-configuring-ldap-connection){:target="_blank"}.

### REST endpoint security

Review the security and configuration settings of your development and test environments.
The REST endpoints of {{site.data.reuse.es_name}} have a number of configuration capabilities. See [configuring access](../configuring/#rest-services-access) for details.

### Securing communication between pods

By default, Pod-to-Pod encryption is enabled. You can [configure encryption between pods](../configuring/#configuring-encryption-between-pods) when configuring your {{site.data.reuse.es_name}} installation.

### Kafka listeners

{{site.data.reuse.es_name}} has both internal and external configurable Kafka listeners. Optionally, each Kafka listener can be [secured with TLS or SCRAM](../configuring/#kafka-access).

## Planning for resilience

If you are looking for a more resilient setup, or want to plan for [disaster recovery](../../georeplication/disaster-recovery), consider setting up multiple availability zones and creating mirrored topics in other clusters. Also, set up your environment to support Kafka's inherent high availability design.

### Kafka high availability

Kafka is designed for high availability and fault tolerance.

To reduce the impact of {{site.data.reuse.es_name}} Kafka broker failures, configure your installation with at least three brokers and spread them across several Kubernetes nodes by ensuring you have at least as many nodes as brokers. For example, for 3 Kafka brokers, ensure you have at least 3 nodes running on separate physical servers.

Kafka ensures that topic-partition replicas are spread across available brokers up to the replication factor specified. Usually, all of the replicas will be in-sync, meaning that they are all fully up-to-date, although some replicas can temporarily be out-of-sync, for example, when a broker has just been restarted.

The replication factor controls how many replicas there are, and the minimum in-sync configuration controls how many of the replicas need to be in-sync for applications to produce and consume messages with no loss of function. For example, a typical configuration has a replication factor of 3 and minimum in-sync replicas set to 2. This configuration can tolerate 1 out-of-sync replica, or 1 worker node or broker outage with no loss of function, and 2 out-of-sync replicas, or 2 worker node or broker outages with loss of function but no loss of data.

The combination of brokers spread across nodes together with the replication feature make a single {{site.data.reuse.es_name}} cluster highly available.

You can also further ensure high availability for your environment by increasing the number of {{site.data.reuse.es_name}} [operator replicas](../installing/#scaling-the-operator-for-high-availability).

### Multiple availability zones

To add further resilience to your {{site.data.reuse.es_name}} cluster, you can split your servers across multiple data centers or zones, so that even if one zone experiences a failure, you still have a working system.

[Multizone support](https://kubernetes.io/docs/setup/best-practices/multiple-zones/){:target="_blank"} provides the option to run a single Kubernetes cluster in multiple availability zones within the same region. Multizone clusters are clusters of either physical or virtual servers that are spread over different locations to achieve greater resiliency. If one location is shut down for any reason, the rest of the cluster is unaffected.

**Note:** For {{site.data.reuse.es_name}} to work effectively within a multizone cluster, the network latency between zones must not be greater than 20 ms for Kafka to replicate data to the other brokers.

Typically, high availability requires a minimum of 3 zones (sites or data centers) to ensure a quorum with high availability for components, such as Kafka and ZooKeeper. Without the third zone, you might end up with a third quorum member in a zone that already has a member of the quorum, consequently if that zone goes down, the majority of the quorum is lost and loss of function is inevitable.

Kubernetes platforms require a minimum of 3 zones for high availability topologies and {{site.data.reuse.es_name}} supports that model. This is different from the traditional primary and backup site configuration, and is a move to support the quorum-based application paradigm.

With [zone awareness](https://kubernetes.io/docs/setup/best-practices/multiple-zones/#pods-are-spread-across-zones){:target="_blank"}, Kubernetes automatically distributes pods in a replication controller across different zones. For workload-critical components, for example Kafka, ZooKeeper and REST Producer, set the number of replicas of each component to at least match the number of zones. This provides at least one replica of each component in each zone, so in the event of loss of a zone the service will continue using the other working zones.

For information about how to prepare multiple zones, see [preparing for multizone clusters](../preparing-multizone).

<!-- **COMMENT:** _The terminology to use based on some research is: "multizone", "multiple availability zones", zone aware (n), zone-aware (adj), non-zone aware (n), and non-zone-aware (adj)._ -->

### Topic Mirroring

Consider configuring [geo-replication](../../georeplication/about/) or [MirrorMaker 2.0](https://strimzi.io/blog/2020/03/30/introducing-mirrormaker2/){:target="_blank"} to aid your [disaster recovery](../../georeplication/disaster-recovery) and resilience planning, by ensuring a copy of the event data is available in other regions.

You can deploy multiple instances of {{site.data.reuse.es_name}} and use topic mirroring to synchronize data between your clusters to help maintain service availability. No additional preparation is required on the origin cluster because the mirroring component runs on the destination cluster.

[MirrorMaker 2.0](https://strimzi.io/blog/2020/03/30/introducing-mirrormaker2/){:target="_blank"} is part of Apache Kafka and is therefore included with {{site.data.reuse.es_name}}. It uses Kafka Connect to mirror topics between separate Kafka clusters. In addition, {{site.data.reuse.es_name}} provides a [geo-replication](../../georeplication/about/) feature, which is built on MirrorMaker 2.0, and offers a simplified mechanism for setting up mirrored topics across multiple {{site.data.reuse.es_name}} environments.

Use the [geo-replication](../../georeplication/about/) feature to easily perform basic replication of topics between {{site.data.reuse.es_name}} clusters. Use MirrorMaker 2.0 directly to move data between {{site.data.reuse.es_name}} clusters and other Kafka clusters, or when lower-level aspects also need to be replicated, such as offsets and topic configuration.

### Cruise Control

Cruise Control is an open-source system for optimizing your Kafka cluster by monitoring cluster workload, rebalancing a cluster based on predefined constraints, and detecting and fixing anomalies.
You can set up {{site.data.reuse.es_name}} to use the following Cruise Control features:

- Generating optimization proposals from multiple optimization goals.
- Rebalancing a Kafka cluster based on an optimization proposal.

**Note:** {{site.data.reuse.es_name}} does not support other Cruise Control features.

[Enable Cruise Control](../configuring/#enabling-and-configuring-cruise-control) for {{site.data.reuse.es_name}} and configure optimization goals for your cluster.

**Note:** Cruise Control stores data in Kafka topics. It does not have its own persistent storage configuration. Consider using persistent storage for your Kafka topics when using Cruise Control.

## Planning for log management

{{site.data.reuse.es_name}} follows widely adopted logging method for containerized applications and writes to standard output and standard error streams.

You can install any logging solution that integrates with Kubernetes such as [cluster logging](https://docs.openshift.com/container-platform/4.14/logging/cluster-logging.html){:target="_blank"} provided by the {{site.data.reuse.openshift_short}} to collect, store, and visualize logs.

You can use log data to monitor cluster activity and investigate any problems affecting your [system health](../../administering/deployment-health/).

## Kafka static configuration properties

You can set [Kafka broker configuration](https://strimzi.io/docs/operators/latest/configuring.html#type-KafkaClusterSpec-reference){:target="_blank"} settings in your `EventStreams` custom resource under the property `spec.strimziOverrides.kafka`. These settings will override the default Kafka configuration defined by {{site.data.reuse.es_name}}.

You can also use this configuration property to modify read-only Kafka broker settings for an existing {{site.data.reuse.es_name}} installation. Read-only parameters are defined by Kafka as settings that require a broker restart. Find out more about the [Kafka configuration options and how to modify them](../../administering/modifying-installation/#modifying-kafka-broker-configuration-settings) for an existing installation.

## Connecting clients

By default, Kafka client applications connect to cluster using the Kafka bootstrap host address. Find out more about [connecting external clients](../configuring/#configuring-access) to your installation.

## Monitoring Kafka clusters

{{site.data.reuse.es_name}} can be configured to export application metrics in Prometheus and JMX formats. These metrics provide useful information about the health and performance of your {{site.data.reuse.es_name}} Kafka clusters.

You can use any monitoring solution compatible with Prometheus and JMX formats to collect, store, visualize, and set up alerts based on metrics provided by {{site.data.reuse.es_name}}. For example, the {{site.data.reuse.openshift_short}} has a built-in option to use Prometheus. You can also use Prometheus on other Kubernetes platforms, where it might also be included, or you can [install](https://prometheus.io/docs/prometheus/latest/installation/){:target="_blank"} it externally. After installing, [configure Prometheus](../../installing/configuring/#configuring-external-monitoring-through-prometheus) to get the metrics.

To display the metrics, install and configure a visualization tool if your platform does not provide a built-in solution. For example, you can use a dashboard such as [Grafana](https://grafana.com/docs/grafana/latest/){:target="_blank"} and [configure](../../administering/cluster-health/#grafana) it to work with Prometheus to collect and display metrics.

Alternatively, you can use an observability tool such as [IBM Instana](https://www.ibm.com/docs/en/instana-observability/current?topic=overview){:target="_blank"} to monitor all aspects of an {{site.data.reuse.es_name}} instance without any extra configuration. Instana also offers [Kafka-centric monitoring](https://www.instana.com/supported-technologies/apache-kafka-observability/){:target="_blank"} that can provide useful insights into the performance and the health of your Kafka cluster.

For more information about keeping an eye on the health of your Kafka cluster, see the [monitoring Kafka](../../administering/cluster-health/) topic.

## Licensing

Licensing is typically based on Virtual Processing Cores (VPC).

For more information about available licenses, chargeable components, and tracking license usage, see the [licensing reference]({{ 'support/licensing' | relative_url }}).

## FIPS compliance

{{site.data.reuse.es_name}} can be configuired in a manner that conforms to Federal Information Processing Standards (FIPS).

For more information about requirements, configuring, and limitations of setting up {{site.data.reuse.es_name}} in a FIPS-complaint manner, see [enabling FIPS](../../security/fips).