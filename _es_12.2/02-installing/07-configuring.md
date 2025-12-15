---
title: "Configuring"
excerpt: "Configure your Event Streams installation."
categories: installing
slug: configuring
toc: true
---

{{site.data.reuse.es_name}} provides samples to help you get started with deployments, as described in the [planning](../planning/#sample-deployments) section. Select one of the samples suited to your requirements to get started:

- Lightweight without security
- Development
- Minimal production
- Production 3 brokers
- Production 6 brokers
- Production 9 brokers

You can modify the samples, save them, and apply custom configuration settings as well. See the following sections for guidance about configuring your instance of {{site.data.reuse.es_name}}.

On OpenShift, you can configure and apply them by using the [command line](../installing/#installing-an-instance-by-using-the-cli) or by dragging and dropping them onto the {{site.data.reuse.openshift_short}} [web console](../installing/#installing-by-using-the-yaml-view), and editing them.

**Note:** When applying custom Kafka configuration settings to your {{site.data.reuse.es_name}}, check the [Kafka documentation](https://kafka.apache.org/40/documentation){:target="_blank"} to ensure the new configuration settings are consistent and do not cause conflicts.

## Checking configuration settings
{: #checking-configuration-settings}

This page gives information about many configuration options. To see further information about specific configuration options, or to see what options are available, you can use the `kubectl explain` command. To see information about a specific field, run the following:

```shell
kubectl explain eventstreams.<path-of-field>
```

Where `path-of-field` is the JSON path of the field of interest.

For example, if you want to see more information about configuring external listeners for Kafka you can run the following command:

```shell
kubectl explain eventstreams.spec.strimziOverrides.kafka.listeners.external
```

## Configuring Kafka node pools
{: #configuring-kafka-node-pools}

A node pool defines a group of Kafka nodes in a cluster that share the same configuration. Each node pool must specify settings such as the number of replicas, storage configuration, and one or more supported roles. In a KRaft-based cluster, node pools can be assigned the roles of broker, controller, or both (dual role).

### Required configuration 
{: #required-configuration}

The following configuration parameters are required to define each `KafkaNodePool` in your cluster:

- Replicas: Specifies the number of Kafka nodes included in the pool.
- Roles: Defines the functions of the nodes within the Kafka cluster. In KRaft mode, nodes can have one or more of the following roles:
	- Broker: Handles client communication, data storage, and message replication.
	- Controller: Manages cluster metadata, including topic configurations, partition management, and broker registration. This role is essential for cluster coordination.
	- Dual role: A node can act as both broker and controller. This setup is suitable for smaller or development clusters, but separating roles is recommended in production environments for improved scalability and fault isolation.
- Storage: Specifies the storage configuration for nodes in the pool.

### Optional configuration
{: #optional-configuration}

The following optional settings can be customized at the node pool level or inherited from the global Kafka specification in the `EventStreams` custom resource:

- Resource requests and limits: Defines CPU and memory allocations for nodes.
- JVM options: Allows customization of JVM parameters to optimize performance.
- Templates: Enables customization of Kubernetes resources (such as pods and containers) that are associated with the node pool.

Configurations such as resource requests that are not explicitly set under `spec.strimziOverrides.nodePools` are inherited from `spec.strimziOverrides.kafka` in the `EventStreams` custom resource. However, pod templates must be defined in each node pool section. This helps maintain shared settings across the cluster while allowing customization of individual node pools when required.

### Customizing node IDs for scaling
{: #customizing-node-ids-for-scaling}

Each Kafka node in a node pool requires a unique node ID. These IDs are automatically managed by the {{site.data.reuse.es_name}} operator. However, you can optionally assign ID ranges to control how nodes are added or removed during scaling operations. For more information about scaling and modifying the capacity of your {{site.data.reuse.es_name}} system, see [scaling](../../administering/scaling/).

By default, the operator assigns node IDs starting from 0 and increments them sequentially across the cluster. When a new node is added, the lowest available node ID is assigned, filling any gaps from previously removed nodes before new IDs are used. This behavior allows the operator to automatically manage node IDs without manual intervention, making it suitable for most use cases. After a node ID is assigned, it remains the same.

The node ID assignment pattern is as follows:

- In new deployments, Kafka controllers are deployed before Kafka brokers, and are assigned the initial node IDs, such as 0, 1, and 2. Brokers are then assigned the next available node IDs.
- In upgrade scenarios, for example, upgrading from {{site.data.reuse.es_name}} version 11.7.0 to version 11.8.0, the existing Kafka brokers already occupy the initial node IDs, such as 0, 1, and 2. New Kafka controllers are deployed with the next available node IDs.

For more control over node IDs, particularly in production or migration scenarios, you can assign custom ID ranges by using the following annotations on the `nodePools` section in the `EventStreams` custom resource.

For example:

```yaml
strimziOverrides:
  nodePools:
    - annotations:
        eventstreams.ibm.com/next-node-ids: '[5-10]'
```

  Where `eventstreams.ibm.com/next-node-ids` specifies the range of node IDs to be assigned to newly added nodes.

  **Note:** Ensure partitions are reassigned before reducing the number of nodes in the node pool.

For more information, see the [managing node pool IDs](https://strimzi.io/docs/operators/0.48.0/deploying#proc-managing-node-pools-ids-str){:target="_blank"}.

**Note:** To migrate Kafka brokers to a different storage configuration, see [migrating Kafka broker storage](../../administering/scaling/#migrating-kafka-broker-storage).

### Pod anti-affinity
{: #pod-anti-affinity}

You can use pod anti-affinity to improve fault tolerance by ensuring that multiple Kafka broker pods do not run on the same worker node. Pod anti-affinity distributes pods across different nodes to minimize the impact of a node failure.

Optional: You can specify your own pod anti-affinity rules under `spec.strimziOverrides.nodePools.template.pod.affinity.podAntiAffinity` section of your `EventStreams` custom resource.

For example: 

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  strimziOverrides:
    kafka:
      # ...
    nodePools:
      - name: kafka
        replicas: 2
        roles:
          - broker
        storage:
          # ...
        template:
          pod:
            affinity:
              podAntiAffinity:
                preferredDuringSchedulingIgnoredDuringExecution:
                  - weight: 20
                    podAffinityTerm:
                      labelSelector:
                        matchExpressions:
                          - key: eventstreams.ibm.com/pool-name
                            operator: In
                            values:
                              - kafka
                      topologyKey: kubernetes.io/hostname
```

If you do not define any pod anti-affinity rules, {{site.data.reuse.es_name}} applies the following default rules to ensure that all Kafka pods in a node pool are spread evenly across all nodes in the cluster:

- Rule 1 (weight 10): Aims to place pods from the same node pool on different hosts.
- Rule 2 (weight 5): Aims to place Kafka pods from the same {{site.data.reuse.es_name}} instance on different hosts.

**Important:** If you define your own pod anti-affinity rules, {{site.data.reuse.es_name}} applies only your rules. The default rules are not applied.

```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 10
        podAffinityTerm:
          labelSelector:
            matchExpressions:
              - key: eventstreams.ibm.com/pool-name
                operator: In
                values:
                  - kafka
          topologyKey: kubernetes.io/hostname
      - weight: 5
        podAffinityTerm:
          labelSelector:
            matchExpressions:
              - key: eventstreams.ibm.com/cluster
                operator: In
                values:
                  - min-prod-scram
              - key: eventstreams.ibm.com/component-type
                operator: In
                values:
                  - kafka
          topologyKey: kubernetes.io/hostname
```

### KRaft limitations 
{: #kraft-limitations}

KRaft limitations are mainly associated with controller scaling, which can affect how cluster operations are managed.

KRaft mode supports the following two types of controller quorums:

- Static controller quorums: The number of controllers is fixed when the cluster is created. Any changes, such as scaling or reconfiguring controllers, require restarting the cluster, which causes downtime.
- Dynamic controller quorums: You can add or remove controllers without downtime, making it easier to manage tasks such as renaming node pools or updating storage settings.

Migration between static and dynamic controller quorums is not currently supported by Apache Kafka. To maintain compatibility and ensure cluster stability, {{site.data.reuse.es_name}} uses static controller quorums. Support for dynamic controller quorums might be added in a future Kafka release.

Static controller quorums limit operations that require controller scaling. The following operations are not supported on an existing {{site.data.reuse.es_name}} instance:

- Adding or removing new node pools that have the `controller` role.
- Adding the `controller` role to an existing node pool, or removing it from one.
- Scaling a node pool that has the `controller` role.
- Renaming a node pool that has the `controller` role.


For more information about the limitations, see the [Strimzi KRaft documentation](https://strimzi.io/docs/operators/0.48.0/deploying#kraft_limitations){:target="_blank"}.

## Tiered storage
{: #tiered-storage}

You can configure your Kafka cluster and topics to use tiered storage in {{site.data.reuse.es_name}}. Tiered storage retains recent data on broker disks for low-latency reads and writes, while moving historical topic data to remote storage.

**Note:** Reading data from remote storage can be slower than accessing data from local storage, which might introduce increased latency for historical data access.

Tiered storage extends data retention without increasing local disk usage and keeps data available for compliance, auditing, and analytics.

{{site.data.reuse.es_name}} supports tiered storage only with Amazon S3-compatible storage by using the Aiven S3 plugin, which is bundled with and supported as part of {{site.data.reuse.es_name}}.


### Enabling tiered storage
{: #enabling-tiered-storage}

To enable tiered storage for your {{site.data.reuse.es_name}} Kafka cluster:

1. Update your `EventStreams` custom resource to include the `tieredStorage` configuration under `spec.strimziOverrides.kafka`, and set the following properties in the `config` section with values specific to your S3-compatible cloud provider to connect {{site.data.reuse.es_name}} to your remote storage service:

   | Property | Type | Description |
   |----------|------|-------------|
   | `chunk.size` | string (numeric value as string, for example, `'1048576'`) | The size (in bytes) of each chunk uploaded to remote storage. Set a value based on performance and cost considerations. |
   | `storage.overwrite.enabled` | boolean (`'true'` or `'false'`)  | Set to `'true'` to allow overwriting existing objects in the bucket. Use `'false'` to prevent overwrites. |
   | `storage.s3.path.style.access.enabled` | boolean (`'true'` or `'false'`) | Set to `'true'` if your cloud provider requires path-style access. |
   | `storage.s3.region` | string | The region where your bucket is hosted. |
   | `storage.s3.endpoint.url` | string | The URL of your S3-compatible storage service. Use the endpoint provided by your cloud provider. |
   | `storage.s3.bucket.name` | string | The name of the bucket where Kafka log segments will be stored. You must create this bucket in your storage service. |
   | `storage.aws.secret.access.key` | string | The secret access key paired with the access key ID. You can get it from your cloud provider. Keep this value secure. |
   | `storage.aws.access.key.id` | string | The access key ID used to authenticate with the storage service. You can get it from your cloud provider. |

   For advanced optional configurations, see the [Aiven GitHub reference](https://github.com/Aiven-Open/tiered-storage-for-apache-kafka/blob/main/docs/configs.rst#s3storageconfig){:target="_blank"}.

   For example:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: EventStreams
   spec:
     strimziOverrides:
       kafka:
         tieredStorage:
           remoteStorageManager:
             className: io.aiven.kafka.tieredstorage.RemoteStorageManager
             classPath: /opt/kafka/tiered-storage/*
             config:
               chunk.size: '1048576'
               storage.backend.class: io.aiven.kafka.tieredstorage.storage.s3.S3Storage
               storage.overwrite.enabled: 'true'
               storage.s3.path.style.access.enabled: 'true'
               storage.s3.region: us-east-1
               storage.s3.endpoint.url: 'https://s3.us-east-1.amazonaws.com'
               storage.s3.bucket.name: example-bucket
               storage.aws.secret.access.key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
               storage.aws.access.key.id: AKIAIOSFODNN7EXAMPLE
           type: custom
   ```

1. Enable tiered storage for each topic by setting the `remote.storage.enable` property in your `KafkaTopic` custom resource:

   ```yaml
   apiVersion: kafka.strimzi.io/v1beta2
   kind: KafkaTopic
   metadata:
     name: example-topic
   spec:
     config:
       remote.storage.enable: 'true'
   ```

   **Note:**

   - Tiered storage cannot be used for topics configured with log compaction.
   - Tiered storage cannot be used with topics that contain log segments without a producer snapshot file. This typically affects topics created in Kafka versions earlier than 2.8.0.

### Configuring tiered storage
{: #configuring-tiered-storage}

After you [enable tiered storage](#enabling-tiered-storage), configure the following topic-level properties to control how long data is retained in local storage before it becomes eligible for deletion. You can set one or both of these properties, depending on your requirements.

| Property| Default value | Description |
|----------|---------------|-------------|
| `local.retention.bytes` | `-2` | Maximum size of data to retain locally before data becomes eligible for deletion.  By default, this is set to -2, indicating that the `retention.bytes` configuration must be used to determine the retention size. |
| `local.retention.ms` | `-2` | Maximum time to retain data locally before data becomes eligible for deletion. By default, this is set to -2, indicating that the `retention.ms` configuration must be used to decide the retention period. |

- If `local.retention.bytes` is set, data becomes eligible for deletion when the size of stored data exceeds the configured limit.
- If `local.retention.ms` is set, data becomes eligible for deletion when the retention time exceeds the configured limit.
- If both properties are set, data becomes eligible for deletion as soon as either limit is reached.
- If neither property is set, Kafka uses the default `retention.bytes` and `retention.ms` values to determine local retention behavior.

**Note:** Increasing the local retention threshold does not bring previously offloaded segments back to local storage. The change applies only to new data segments.

### Disabling tiered storage
{: #disabling-tiered-storage}

You can disable tiered storage for a topic by configuring the following properties, depending on your requirement:

- If you only want to stop writing new data to remote storage while keeping existing data accessible: 

  ```yaml
  remote.storage.enable=true
  remote.log.copy.disable=true
  ```

- If you want to completely disable tiered storage and remove remote data permanently:

  ```yaml
  remote.log.delete.on.disable=true
  remote.storage.enable=false
  ```

  Tiered storage can be disabled if local storage alone is sufficient for the workload. Disabling might be appropriate when reducing latency from remote storage is required, or when migrating to a new storage provider and existing remote data must be removed.

  **Note:** This action is irreversible. After remote data is deleted, it cannot be recovered.

## Enabling persistent storage
{: #enabling-persistent-storage}

If you want your data to be preserved in the event of a restart, configure persistent storage for Kafka brokers and Kafka controllers in your {{site.data.reuse.es_name}} installation.

**Note:** Ensure you have sufficient [disk space](../capacity-planning/#disk-space-for-persistent-volumes) for persistent storage.

These settings are specified in the YAML configuration document that defines an instance of the `EventStreams` custom resource and can be applied when defining a new {{site.data.reuse.es_name}} instance under the "Event Streams" operator in the {{site.data.reuse.openshift_short}} web console.

To set persistent storage for Kafka brokers and controllers, specify the `storage` property under `spec.strimziOverrides.nodePools[*].storage` based on the assigned roles.

Complete the configuration by adding additional fields to these storage properties as follows:

1. Specify the storage type in `storage.type` (for example, `"ephemeral"` or `"persistent-claim"`).

   **Note:** When using ephemeral storage, ensure you set retention limits for Kafka topics so that you do not run out of disk space.
   If [message retention](../../getting-started/creating-topics/) is set to long periods and the message volume is high, the storage requirements for the topics could impact the OpenShift nodes that host the Kafka pods, and cause the nodes to run out of allocated disk space, which could impact normal operation.

2. Specify the storage size in `storage.size` (for example, `"100Gi"`).
3. Optionally, specify the storage class in `storage.class` (for example, `"rook-ceph-block-internal"`).
4. Optionally, specify the retention setting for the storage if the cluster is deleted in `storage.deleteClaim` (for example, `"true"`).

An example of these configuration options:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  strimziOverrides:
    kafka:
      # ...
    nodePools:      
      - name: kafka
        replicas: 1
        storage:
          type: "persistent-claim"
          size: "100Gi"
          class: "ceph-block"
        roles:
          - broker
      - name: controller
        replicas: 1
        storage:
          type: "persistent-claim"
          size: "100Gi"
          class: "ceph-block"
        roles:
          - controller
# ...
```

If present, existing persistent volumes with the specified storage class are used after installation, or if a [dynamic provisioner](https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/storage/dynamic-provisioning){:target="_blank"} is configured for the specified storage class, new persistent volumes are created.

Where optional values are not specified:

- If no storage class is specified and a default storage class has been defined in the {{site.data.reuse.openshift_short}} settings, the default storage class will be used.
- If no storage class is specified and no default storage class has been defined in the {{site.data.reuse.openshift_short}} settings, the deployment will use any [persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/){:target="_blank"} that have at least the set size value.

   **Note:** An empty string is not the same as not specifying a value for a field. If you include the `class` field, the field value must be a valid storage class, it cannot be an empty string. An empty string will not be accepted by the operator.

- If no retention setting is provided, the storage will be retained when the cluster is deleted.


The following example YAML document shows an example `EventStreams` custom resource with dynamically allocated storage provided using CephFS for Kafka broker and Kafka controller. To try this deployment, set the required `namespace` and accept the license by changing the `spec.license.accept` value to `true`.

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
metadata:
  name: example-storage
  namespace: myproject
  labels:
    backup.eventstreams.ibm.com/component: eventstreams
spec:
  license:
    accept: false
  version: 11.1.0
  adminApi: {}
  adminUI: {}
  apicurioRegistry: {}
  collector: {}
  restProducer: {}
  strimziOverrides:
    kafka:
      config:
        offsets.topic.replication.factor: 1
        transaction.state.log.min.isr: 1
        transaction.state.log.replication.factor: 1
      listeners:
        - name: external
          type: route
          port: 9092
          authentication:
            type: scram-sha-512
          tls: true
        - name: plain
          port: 9093
          type: internal
          tls: false
        - name: tls
          port: 9094
          type: internal
          tls: true
          authentication:
            type: tls
      metricsConfig:
        type: jmxPrometheusExporter
        valueFrom:
          configMapKeyRef:
            key: kafka-metrics-config.yaml
            name: metrics-config
    nodePools:      
      - name: kafka
        replicas: 3
        storage:
          type: "persistent-claim"
          size: "100Gi"
          class: rook-ceph-block-intern
          deleteClaim: true
        roles:
          - broker
      - name: controller
        replicas: 3
        storage:
          type: "persistent-claim"
          size: "100Gi"
          class: rook-ceph-block-intern
          deleteClaim: true
        roles:
          - controller
```

## Configuring UI and CLI security
{: #configuring-ui-and-cli-security}

By default, accessing the {{site.data.reuse.es_name}} UI and CLI requires a user that has been assigned access to {{site.data.reuse.es_name}} (see [managing access](../../security/managing-access/#accessing-the-event-streams-ui-and-cli) for details).

For accessing both the UI and CLI, {{site.data.reuse.es_name}} supports the Salted Challenge Response Authentication Mechanism (SCRAM) and Keycloak.

Set the authentication type for the UI and CLI by configuring the `EventStreams` custom resource as follows:

- To enable SCRAM authentication, set the `adminUI` authentication type to `scram-sha-512` in the `EventStreams` custom resource as follows:

   ```yaml
   # ...
   spec:
     # ...
     adminUI:
       authentication:
         - type: scram-sha-512
   ```

  This allows a Kafka user that has been configured for SCRAM authentication to log in to the {{site.data.reuse.es_name}} UI and CLI by using the username and password of that Kafka user. For more information about configuring Kafka users, see [managing access to Kafka resources](../../security/managing-access/#managing-access-to-kafka-resources).

  When using SCRAM, the Access Control List (ACL) that is configured for the user will determine which parts of the UI are available to the user to access and what CLI commands the user can run. For more information, see [permission mappings](../../security/managing-access/#managing-access-to-the-ui-and-cli-with-scram).
  
- To change the authentication type to Keycloak, set the `adminUI` authentication type to `integrationKeycloak` in the `EventStreams` custom resource as follows: 

   ```yaml
   # ...
   spec:
     # ...
     adminUI:
       authentication:
         - type: integrationKeycloak
   ```

  When this authentication type is set, you can log in to the {{site.data.reuse.es_name}} UI and CLI by using your Keycloak credentials after the required roles are assigned. For more information, see [managing access with Keycloak](../../security/managing-access/#managing-access-with-keycloak).
  
- The login requirement for the UI is disabled when all Kafka authentication and authorization is disabled. This is demonstrated by the proof-of-concept [**lightweight without security**](../planning/#example-deployment-lightweight-without-security) sample.
  
  **Important:** When security is not configured, the **[Producers](../../administering/topic-health/)** and the **[Monitoring](../../administering/cluster-health/#viewing-the-preconfigured-dashboard)** dashboards are not available in the UI.


**Note:** The {{site.data.reuse.es_name}} UI and CLI only support the use of one authentication type for a single {{site.data.reuse.es_name}} instance. This means that you can only set one authentication type at the same time. The operator will issue an error message if more than one type is provided.

## Applying Kafka broker configuration settings
{: #applying-kafka-broker-configuration-settings}

Kafka supports a number of [broker configuration settings](http://kafka.apache.org/37/documentation/#brokerconfigs){:target="_blank"}, typically provided in a properties file.

When creating an instance of {{site.data.reuse.es_name}}, these settings are defined in an `EventStreams` custom resource under the `spec.strimziOverrides.kafka.config` property.

{{site.data.reuse.es_name}} uses `KafkaTopic` custom resources to manage topics in Kafka. Set `auto.create.topics.enable: false` to ensure all Kafka topics are represented as a `KafkaTopic` resource.

The following example uses Kafka broker settings to configure replication for system topics:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      # ...
      config:
        offsets.topic.replication.factor: 1
        transaction.state.log.min.isr: 1
        transaction.state.log.replication.factor: 1
        auto.create.topics.enable: 'false'
```

This custom resource can be created using the `kubectl` command or the {{site.data.reuse.openshift_short}} web console under the **Event Streams** operator page.

You can specify all the broker configuration options supported by Kafka except those managed directly by {{site.data.reuse.es_name}}. For further information, see the list of [supported configuration options](https://strimzi.io/docs/operators/0.48.0/configuring.html#type-KafkaClusterSpec-reference){:target="_blank"}.

After deployment, these settings can be [modified](../../administering/modifying-installation/#modifying-kafka-broker-configuration-settings) by updating the `EventStreams` custom resource.

## Applying Kafka rack awareness
{: #applying-kafka-rack-awareness}

Kafka rack awareness is configured by setting the `rack` property in the `EventStreams` custom resource using the zone label as the topology key in the `spec.strimziOverrides.kafka.rack` field. This key needs to match the [zone label](../preparing-multizone/#zone-awareness) name applied to the nodes.

**Note:** Before this is applied, ensure the [Kafka cluster role](../preparing-multizone/#kafka-rack-awareness) for rack awareness has been applied.

The following example sets the `rack` topologyKey to `topology.kubernetes.io/zone`:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      # ...
      rack:
        topologyKey: topology.kubernetes.io/zone
      # ...
```

## Configuring Kafka logging
{: #configuring-kafka-logging}

{{site.data.reuse.es_name}} uses the Apache Kafka Log4j 2 to generate logs for monitoring purposes. You can specify the required logging configuration in the `strimziOverrides.kafka.logging` section of the `EventStreams` custom resource. 

Kafka logging can be configured in two ways:

- By referencing an external ConfigMap. For example:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: EventStreams
   # ...
   spec:
     strimziOverrides:
       kafka:
         logging:
           type: external
           valueFrom:
             configMapKeyRef:
               key: log4j2.properties
               name: <event-streams-custom-logging-configuration>
   ```

- By using an inline configuration. For example:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: EventStreams
   spec:
     strimziOverrides:
       kafka:
         logging:
           type: inline
           loggers:
             rootLogger.level: INFO
             logger.kafka.level: DEBUG
             logger.logcleaner.level: DEBUG
             logger.authorizer.level: TRACE
   ```

For more information about logging, see the [Kafka logging reference](https://strimzi.io/docs/operators/0.48.0/configuring.html#property-kafka-logging-reference){:target="_blank"}.

## Setting geo-replication nodes
{: #setting-geo-replication-nodes}

You can install geo-replication in a cluster to enable messages to be automatically synchronized between local and remote topics. A cluster can be a geo-replication origin or destination. Origin clusters send messages to a remote system, while destination clusters receive messages from a remote system. A cluster can be both an origin and a destination cluster at the same time.

To enable geo-replication, create an `EventStreamsGeoReplicator` custom resource alongside the `EventStreams` custom resource. This can be defined in a YAML configuration document under the **Event Streams** operator in the {{site.data.reuse.openshift_short}} web console.

When setting up geo-replication, consider the [number of geo-replication worker nodes (replicas)](../../georeplication/planning/#preparing-a-destination-cluster) to deploy and configure this in the `spec.replicas` property.

Ensure that the following properties match the name of the {{site.data.reuse.es_name}} instance:

- `metadata.name`
- `metadata.labels["eventstreams.ibm.com/cluster"]`

For example, to configure geo-replication with `2` replicas for an {{site.data.reuse.es_name}} instance called `sample-three` in the namespace `myproject`, create the following `EventStreamsGeoReplicator` configuration:

```yaml
apiVersion: eventstreams.ibm.com/v1beta1
kind: EventStreamsGeoReplicator
metadata:
  labels:
    eventstreams.ibm.com/cluster: sample-three
  name: sample-three
  namespace: myproject
spec:
  # ...
  replicas: 2
```

**Note:** Geo-replication can be deployed or reconfigured at any time. For more information, see [Setting up geo-replication](../../georeplication/setting-up/).

## Configuring access
{: #configuring-access}

You can configure external access to the following services representing {{site.data.reuse.es_name}} components:

- **The {{site.data.reuse.es_name}} UI:** A graphical user interface you can log in to from a web browser to access and administer your {{site.data.reuse.es_name}} instance. The UI requires the Admin API service to be enabled.
- **The Admin API:** A RESTful administration API that can be used for managing functions of your {{site.data.reuse.es_name}} instance (for example, creating topics).
- **The Apicurio Registry:** The schema registry in {{site.data.reuse.es_name}} to store message schemas. Disable if you do not require schemas for your messages.
- **The REST Producer:** The REST producer API is a scalable REST interface for producing messages to {{site.data.reuse.es_name}} over a secure HTTP endpoint.

On the {{site.data.reuse.openshift_short}}, external access to these services are automatically configured by using routes (unless they are not included in the {{site.data.reuse.es_name}} installation).

On other Kubernetes platforms, all services have internal endpoints configured, creating access to them from within the cluster. To expose any service outside your cluster, configure external access by setting up a Kubernetes ingress controller and configuring the  `EventStreams` custom resource to use ingress.

**Note:** When using ingress, ensure you install and run an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/){:target="_blank"} on your Kubernetes platform. The SSL passthrough must be enabled in the ingress controller and ingresses for your {{site.data.reuse.es_name}} services to work. Refer to your ingress controller documentation for more information.

The following sections provide more information and examples about setting up external access to these {{site.data.reuse.es_name}} services and Kafka.

### REST services access
{: #rest-services-access}

The REST services for {{site.data.reuse.es_name}} are configured with defaults for the container port, type, TLS version, certificates, and authentication mechanisms. If the [Kafka listeners](#kafka-access) have been configured without authentication requirements, then the authentication mechanisms are automatically removed from the REST endpoints.

The schema for REST endpoint configuration is described in the following table, followed by an example of an endpoint configuration for the Admin API that uses routes, and then an ingress example. In these examples, the potential values for `<component>` in `spec.<component>.endpoints` are:

- `adminApi` for the Admin API
- `restProducer` for the REST Producer
- `apicurioRegistry` for the Apicurio Registry

**Note:** If you are overriding the certificates for any of the REST endpoints (`certOverrides`) with your own certificates, you can [provide the external CA certificate](../../security/tls-config#provide-external-ca) that signed them in a secret. If you provide the external CA certificates, they will be included in the truststore you can download from the [{{site.data.reuse.es_name}} UI](../../getting-started/connecting/#obtaining-the-server-side-public-certificate-from-the-event-streams-ui) and [CLI](../../getting-started/connecting/#obtaining-the-server-side-public-certificate-from-the-event-streams-cli).

| Key                         | Type                         | Description                                                                                                                                                                                                                 |
| :-------------------------- | :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                      | String                       | Name to uniquely identify the endpoint among other endpoints in the list for a component.                                                                                                                                   |
| `containerPort`             | Integer                      | A unique port to open on the container that this endpoint will serve requests on. Restricted ranges are 0-1000 and 7000-7999.                                                                                               |
| `type`                      | String [`internal`, `route`, `ingress`] | {{site.data.reuse.es_name}} REST components support internal, route, or ingress type endpoints.                                                                                           |
| `tlsVersion`                | String [`TLSv1.2`,`TLSv1.3`,`NONE`]    | Specifies the TLS version where `NONE` disables HTTPS. The default is `TLSv1.2`.                                                                                                                                                              |
| `authenticationMechanisms`  | List of Strings              | List of authentication mechanisms to be supported at this endpoint. By default, all authentication mechanisms that are defined in the [Kafka listeners](#kafka-access) are enabled. Optionally, you can configure a subset, or none (`[]`). <br>  |
| `certOverrides.certificate` | String                       | The name of the key in the provided `certOverrides.secretName` secret that contains the Base64-encoded certificate.                                                                                                         |
| `certOverrides.key`         | String                       | The name of the key in the provided `certOverrides.secretName` secret that contains the Base64-encoded key.                                                                                                                 |
| `certOverrides.secretName`  | String                       | The name of the secret in the instance namespace that contains the encoded certificate and key to secure the endpoint with.                                                                                                 |
| `host`                      | String (DNS rules apply)     | The hostname for accessing the service. This is required for ingress. On the  {{site.data.reuse.openshift_short}}, this is the default hostname that an OpenShift route generates, and you can override the default hostname by providing a different one here.                                               |
| `class`                     | String  | Identifies the ingress controller when you have more than one controller installed.  |
| `annotations`               | String  | Optionally, you can use annotations to configure different options for an ingress resource.  |

**Note:** Each authentication mechanism you want to use for the {{site.data.reuse.es_name}} REST endpoints must have a corresponding [Kafka listener](../configuring/#kafka-access) configured with the same authentication type set.

For example, the following configuration means that only SCRAM can be used as the authentication mechanism:

```yaml
  # ...
  strimziOverrides:
    # ...
    kafka:
      listeners:
        - name: intscram
          type: internal
          port: 9092
          tls: false
          authentication:
            type: scram-sha-512
```

To enable other authentication mechanisms, for example, TLS, add an additional Kafka listener configuration with `tls` set as follows:

```yaml
# ...
spec:
  # ...
  adminApi:
    endpoints:
      - name: routes-example
        containterPort: 9080
        type: route

  # ...
  strimziOverrides:
    # ...
    kafka:
      listeners:
        - name: intscram
          type: internal
          port: 9092
          tls: false
          authentication:
            type: scram-sha-512
        - name: inttls
          type: internal
          port: 9093
          tls: true
          authentication:
            type: tls
```


#### Routes example
{: #routes-example}

Example of an endpoint configuration for the Admin API that uses routes:

```yaml
# ...
spec:
  externalCACertificates:
    secretName: <name-of-the-secret>
  # ...
  adminApi:
    # ...
    endpoints:
      - name: routes-example
        containerPort: 9080
        type: route
        tlsVersion: TLSv1.3
        authenticationMechanisms:
          - tls
          - scram-sha-512
        certOverrides:
            certificate: mycert.crt
            key: mykey.key
            secretName: custom-endpoint-cert
        host: example-host.apps.example-domain.com
```

Where `<name-of-the-secret>` is the name of the secret that contains the external CA certificates.

**Note:** Changing an endpoint in isolation might have adverse effects if Kafka is configured to require authentication and the configured endpoint has no authentication mechanisms specified. In such cases, a warning message might be displayed in the status conditions for the instance.

#### Ingress example
{: #ingress-example}

Example of an endpoint configuration for the Admin API that uses ingress and NGINX as the ingress controller:

```yaml
# ...
spec:
  # ...
  adminApi:
    # ...
    endpoints:
      - name: ingress-example
        type: ingress
        host: <hostname-or-ip-address>
        class: nginx
        containerPort: 8001
```

#### Cipher suite override
{: #cipher-suite-override}

You can override the default set of cipher suites for the {{site.data.reuse.es_name}} REST components. Overriding the default set and enabling alternative cipher suites should only be done for specific scenarios, for example, to facilitate connectivity of legacy systems. You can set the override through the `CIPHER_SUITES` environment variable as shown in the following example:

```yaml
# ...
spec:
  # ...
  restProducer:
    # ...
    env:
      - name: CIPHER_SUITES
        value: >-
          TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
```

### Kafka access
{: #kafka-access}

Sample configurations provided for {{site.data.reuse.es_name}} typically include an external listener for Kafka and varying internal listener types by default. The supported external listener can be of type `route` or `ingress`, and it can have one of the following authentication mechanism types:

- Mutual TLS (`tls`)
- SCRAM-SHA-512 (`scram-sha-512`)
- OAuth (`oauth`)

Any number of external listeners can be configured, each with any of the supported authentication mechanisms.

**Note:** If you are overriding the certificates for any of the Kafka listeners with your own certificates, ensure you [provide the external CA certificates](../../security/tls-config#provide-external-ca) that signed them in a secret.

#### Internal access
{: #internal-access}

Internal listeners for Kafka can also be configured by setting the listener `type:` to `internal`. Each of these can be configured to have any of the authentication mechanism types (Mutual TLS, SCRAM-SHA-512, or OAuth). The following example shows 2 internal listeners configured: the first is set to use SCRAM authentication, while the second listener is set to use mutual TLS.


```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      listeners:
        - name: intplain
          type: internal
          port: 9092
          tls: false
          authentication:
            type: scram-sha-512
        - name: inttls
          type: internal
          port: 9093
          tls: true
          authentication:
            type: tls
```

When secure listeners are configured, {{site.data.reuse.es_name}} will automatically generate cluster and client CA certificates, and a valid certificate for the listener endpoint. The generated CA certificates and the certificate for the endpoint can be replaced by provided certificates as described in [providing certificate overrides](../../security/tls-config#using-your-own-certificates).

#### Routes example
{: #routes-example}

The following example snippet defines 2 external listeners that expose the Kafka brokers with 2 {{site.data.reuse.openshift_short}} routes, one with SCRAM-SHA-512 authentication and one with Mutual TLS enabled.

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      listeners:
        - name: extscram
          type: route
          port: 9092
          tls: true
          authentication:
            type: scram-sha-512
        - name: exttls
          type: route
          port: 9093
          tls: true
          authentication:
            type: tls
```

#### Ingress example
{: #kafka-ingress-example}

To use ingress, you define ingress as the external listener and specify the hostname or IP address for your Kafka bootstrap servers. You also define the ingress class for your ingress controller.

The following example snippet defines an external listener type for ingress that uses NGINX as the ingress controller (`class: nginx`), providing external access to 3 Kafka brokers, with SCRAM-SHA-512 authentication enabled.

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      listeners:
        - name: external
          type: ingress
          port: 9094
          tls: true
          authentication:
            type: scram-sha-512
          configuration:
            bootstrap:
              host: <hostname-or-ip-address>
            brokers:
              - broker: 0
                host: <hostname-or-ip-address>
              - broker: 1
                host: <hostname-or-ip-address>
              - broker: 2
                host: <hostname-or-ip-address>
            class: nginx
        - name: tls
          type: internal
          port: 9093
          tls: true
          authentication:
            type: tls
```

When secure listeners are configured, {{site.data.reuse.es_name}} will automatically generate cluster and client CA certificates, and a valid certificate for the listener endpoint. The generated CA certificates and the certificate for the endpoint can be replaced by provided certificates as described in [providing certificate overrides](../../security/tls-config#using-your-own-certificates).

## Enabling OAuth
{: #enabling-oauth}

Open Authorization (OAuth) is an open standard for authentication and authorization that allows client applications secure delegated access to specified resources. OAuth works over HTTPS and uses access tokens for authorization rather than credentials.

### Enable OAuth authentication
{: #enable-oauth-authentication}

To configure OAuth authentication, configure a Kafka listener with type `oauth`, and set the listener to use one of the following token validation methods:

- **Fast local JSON Web Token (JWT) validation:** a signed token is verified against the OAuth authentication server's public certificate, and a check ensures that the token has not expired on the Kafka cluster. This means that the OAuth authorization server does not need to be contacted, which speeds up the validation.

   **Important:** Local JWT validation does not check the validity of the token with the OAuth authorization server each time the client attempts to authenticate. This means tokens that have not expired are valid even if the client that used the token has been revoked. As the token expiry time is used to identify the token's validity, consider setting short token expiry times when configuring JWT validation, keeping the `grace period` as short as possible.

- **Token validation by using an introspection endpoint:** the validation of the token is performed on the OAuth authorization server. This is a slower mechanism than the JWT validation method, but ensures that there is no grace period for revoked clients. As soon as a client is revoked, the token will become invalid, regardless of the expiration of the token.

{{site.data.reuse.es_name}} supports 2 types of SASL mechanisms: `OAUTHBEARER` or `PLAIN`. By default, OAuth authentication uses `OAUTHBEARER` SASL mechanism, which is the most secure mechanism.

**Important:** For clients that do not support the `OAUTHBEARER` authentication mechanism, you can configure the cluster to use the `PLAIN` mechanism by setting the `enableOauthBearer` property to `false` (default setting is `true` for `OAUTHBEARER`). For more information, see [OAuth 2.0 authentication mechanisms](https://strimzi.io/docs/operators/0.48.0/deploying.html#con-oauth-authentication-broker-str){:target="_blank"}.

#### Configuring OAuth to use fast local JWT validation
{: #configuring-oauth-to-use-fast-local-jwt-validation}

To configure an OAuth listener to use fast local JWT validation authentication, add the following snippet to your `EventStreams` custom resource, and edit the  settings as follows:
- Add the respective URIs of the OAuth authentication server to the `jwksEndpointUri` and `validIssuerUri` properties.
- Create a secret that contains the public CA certificate of the OAuth authentication Server, and reference this secret in the `tlsTrustedCertificates` property of the listener configuration. The `certificate` element in the `tlsTrustedCertificates` references the secret key that contains the CA certificate.

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      listeners:
        - name: extoauth
          port: 9094
          tls: true
          authentication:
            type: oauth
            jwksEndpointUri: <OAuth-authentication-server-JWKS-certificate-endpoint>
            maxSecondsWithoutReauthentication: 3600
            tlsTrustedCertificates:
              - certificate: <CA-certificate-secret-key>
                secretName: <CA-certificate-secret-name>
            userNameClaim: preferred_username
            validIssuerUri: <OAuth-authentication-server-token-issuer-endpoint>
          type: route
```

The snippet provided shows a configuration containing the most commonly used properties. For information about further OAuth properties, see [Using OAuth 2.0 token-based authentication](https://strimzi.io/docs/operators/0.48.0/deploying.html#assembly-oauth-authentication_str){:target="_blank"}.

#### Configuring OAuth to use token validation by using an introspection endpoint
{: #configuring-oauth-to-use-token-validation-by-using-an-introspection-endpoint}

To configure an OAuth listener to use introspection endpoint token validation, add the following snippet to your `EventStreams` custom resource, and edit the  settings as follows:
- Add the respective URIs of the OAuth authentication server to the `validIssuerUri` and `introspectionEndpointUri` properties.
- Create a secret that contains the public CA certificate of the OAuth authentication Server, and reference this secret in the `tlsTrustedCertificates` property of the listener configuration. The `certificate` element in the `tlsTrustedCertificates` references the secret key that contains the CA certificate.
- Create another secret that contains the secret value of the `userid` as defined in the `clientId` property of the configuration, and reference this secret in the `clientSecret` property of the configuration. In the `key` property, add the key from the Kubernetes secret that contains the secret value for the `userid`.

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      listeners:
        - name: extoauth
          port: 9094
          tls: true
          authentication:
            type: oauth
            clientId: <client-id>
            clientSecret:
              secretName: <secret-name-containing-clientid-password>
              key: <secret-key-containing-client-password>
            validIssuerUri: <OAuth-authentication-server-token-issuer-endpoint>
            introspectionEndpointUri: <OAuth-authentication-server-token-introspection-endpoint>
            userNameClaim: preferred_username
            maxSecondsWithoutReauthentication: 3600
            tlsTrustedCertificates:
              - certificate: <CA-certificate-secret-key>
                secretName: <CA-certificate-secret-name>
          type: route

```

The snippet provided shows a configuration containing the most commonly used properties. For information about further OAuth properties, see [Using OAuth 2.0 token-based authentication](https://strimzi.io/docs/operators/0.48.0/deploying.html#assembly-oauth-authentication_str){:target="_blank"}.


### Enable OAuth authorization
{: #enable-oauth-authorization}

To use OAuth for authorizing access to Kafka resources in {{site.data.reuse.es_name}}, enable OAuth in the {{site.data.reuse.es_name}} custom resource, and then configure your Access Control List (ACL) rules in your selected OAuth server.

To enable OAuth authorization for {{site.data.reuse.es_name}}, add the following snippet to your `EventStreams` custom resource, and edit the  settings as follows:
- Ensure you set the `delegateToKafkaAcls` property to `true`. If this property is set to `false`, some {{site.data.reuse.es_name}} components will not work as expected.
- If you configure OAuth authorization, include in the `superUsers` property the user IDs of the Kubernetes Cluster admin users that administer {{site.data.reuse.es_name}} through the UI or the CLI. If you are not using OAuth authorization, you do not need to specify any `superUsers`.

<!-- No change required. -->

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      authorization:
        clientId: <client-id>
        delegateToKafkaAcls: true
        tlsTrustedCertificates:
          - certificate: ca.crt
            secretName: keycloak-ca-cert
        tokenEndpointUri: <OAuth-authentication-server-token-endpoint>
        type: keycloak
        superUsers:
          - "admin"
          - "kubeadmin"
```

The snippet provided shows a configuration containing the most commonly used properties. For information about further OAuth properties, see [configuring an OAuth 2.0 authorization server](https://strimzi.io/docs/operators/0.48.0/deploying.html#proc-oauth-server-config-str){:target="_blank"}.

## Configuring node affinity for components
{: #configuring-node-affinity-for-components}

You can configure {{site.data.reuse.es_name}} components to run on nodes with specific labels by using node affinity. Node affinity is configured as part of the component's pod template in the `EventStreams` custom resource.

For REST services, you can configure affinity as follows:

```yaml
# ...
spec:
  # ...
  <component>:
    # ...
    template:
      pod:
        affinity:
        # ...
```

Where `<component>` is one of the following values: `adminApi`, `adminUI`, `restProducer`, or `apicurioRegistry`.

For Kafka, you can configure affinity as follows:

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    <component>:
      # ...
      template:
        pod:
          affinity:
          # ...
```

Where `<component>` is `nodePool`.

The format of the `affinity` property matches the [Kubernetes specification](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity){:target="_blank"}. For example, if a node is labeled with `mykey=myvalue`, the `affinity` would contain the following settings:

```yaml
# ...
template:
  pod:
    affinity:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
            - matchExpressions:
              - key: mykey
                operator: In
                values:
                - myvalue
```

You can also configure architecture-based node affinity. For example, to configure a component to deploy on Linux on IBM z13 (`s390x`), Linux on IBM Power Systems (`ppc64le`), and Linux 64-bit (`amd64`) systems, you can use the following settings:

Node affinities for Linux on IBM Power Systems (`ppc64le`), Linux 64-bit (`amd64`) systems , and Linux on IBM z13 (`s390x`) architectures are added by default. However, you can specify node affinities in the {{site.data.reuse.es_name}} custom resource to deploy pods only on the specific architecture.

```yaml
# ...
template:
  pod:
    affinity:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
            - matchExpressions:
              - key: kubernetes.io/arch
                operator: In
                values:
                - amd64
                - s390x
                - ppc64le
```

## Enabling collection of producer metrics
{: #enabling-collection-of-producer-metrics}


Producer metrics provide information about the health of your Kafka topics through metrics gathered from producing applications. You can view the information in the [**Producers** dashboard](../../administering/topic-health/).

You can configure the collection of producer client metrics and display them in the UI by adding the `spec.collector: {}` property to your `EventStreams` custom resource:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  collector: {}
```

## Configuring external monitoring through Prometheus
{: #configuring-external-monitoring-through-prometheus}

Metrics provide information about the health and operation of the {{site.data.reuse.es_name}} instance.

Metrics can be enabled for Kafka, geo-replicator, and Kafka Connect pods.

**Note:** Kafka metrics can also be exposed externally through JMX by [configuring external monitoring tools](#configuring-external-monitoring-through-jmx).

Kafka metrics can be enabled by setting `spec.strimziOverrides.kafka.metricsConfig` in the `EventStreams` custom resource to point to the `metrics-config` ConfigMap. For example:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  strimziOverrides:
    kafka:
      # ...
      metricsConfig:
        type: jmxPrometheusExporter
        valueFrom:
          configMapKeyRef:
            key: kafka-metrics-config.yaml
            name: metrics-config
# ...
```

The following is the default `metrics-config` ConfigMap in YAML format:

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: metrics-config
data:
  kafka-metrics-config.yaml: |
    lowercaseOutputName: true
    rules:
    - attrNameSnakeCase: false
      name: kafka_controller_$1_$2_$3
      pattern: kafka.controller<type=(\w+), name=(\w+)><>(Count|Value|Mean)
    - attrNameSnakeCase: false
      name: kafka_server_BrokerTopicMetrics_$1_$2
      pattern: kafka.server<type=BrokerTopicMetrics, name=(BytesInPerSec|BytesOutPerSec)><>(Count)
    - attrNameSnakeCase: false
      name: kafka_server_BrokerTopicMetrics_$1__alltopics_$2
      pattern: kafka.server<type=BrokerTopicMetrics, name=(BytesInPerSec|BytesOutPerSec)><>(OneMinuteRate)
    - attrNameSnakeCase: false
      name: kafka_server_ReplicaManager_$1_$2
      pattern: kafka.server<type=ReplicaManager, name=(\w+)><>(Value)
```

Geo-replicator metrics can be enabled by setting `spec.metrics` to `{}` in the `KafkaMirrorMaker2` custom resource. For example:

```yaml
apiVersion: eventstreams.ibm.com/v1alpha1
kind: KafkaMirrorMaker2
# ...
spec:
  # ...
  metrics: {}
# ...
```

**Note:** The {{site.data.reuse.es_name}} operator automatically applies a `KafkaMirrorMaker2` custom resource when a `EventStreamsGeoReplicator` custom resource is created. Metrics can then be enabled by editing the generated `KafkaMirrorMaker2` custom resource.

Kafka Connect metrics can be enabled by setting `spec.metrics` to `{}` in the `KafkaConnect` custom resource. For example:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaConnect
# ...
spec:
  # ...
  metrics: {}
# ...
```

**Note:** For details about viewing metrics information, see the [cluster health](../../administering/cluster-health) and [topic health](../../administering/topic-health) sections.

## Configuring external monitoring through JMX
{: #configuring-external-monitoring-through-jmx}

You can use third-party monitoring tools to monitor the deployed {{site.data.reuse.es_name}} Kafka cluster by collecting Kafka metrics. To set this up, you need to:

- Have a third-party monitoring tool set up to be used within your {{site.data.reuse.openshift_short}} cluster.
- Enable access to the broker JMX port by setting `spec.strimizOverrides.kafka.jmxOptions`.

  ```yaml
  apiVersion: eventstreams.ibm.com/v1beta2
  kind: EventStreams
  # ...
  spec:
    # ...
    strimziOverrides:
      # ...
      kafka:
        jmxOptions: {}
  ```

- Include any configuration settings for {{site.data.reuse.es_name}} as required by your monitoring tool. For example, Datadog's autodiscovery requires you to annotate Kafka broker pods (`strimziOverrides.kafka.template.pod.metadata.annotations`)
- Configure your monitoring applications to [consume JMX metrics](../../security/secure-jmx-connections/).

## Configuring the Kafka Exporter
{: #configuring-the-kafka-exporter}

You can configure the Kafka Exporter to expose additional metrics to Prometheus on top of the default ones. For example, you can obtain the consumer group lag information for each topic.

Kafka Exporter can be enabled by setting `spec.kafkaExporter` to `{}` in the `EventStreams` custom resource. For example:

```yaml
  apiVersion: eventstreams.ibm.com/v1beta2
  kind: EventStreams
  # ...
  spec:
    # ...
    strimziOverrides:
      # ...
      kafkaExporter: {}
```


You can also configure Kafka Exporter using a `regex` to expose metrics for a collection of topics and consumer groups that match the expression. For example, to enable JMX metrics collection for the topic `orders` and the group `buyers`, configure the `EventStreams` custom resource as follows:

```yaml
  apiVersion: eventstreams.ibm.com/v1beta2
  kind: EventStreams
  # ...
  spec:
    # ...
    strimziOverrides:
      # ...
      kafkaExporter:
        groupRegex: buyers
        topicRegex: orders
```

For more information about configuration options, see [configuring the Kafka Exporter](https://strimzi.io/docs/operators/0.48.0/deploying.html#proc-metrics-kafka-deploy-options-str){:target="_blank"}.

## Configuring the JMX Exporter
{: #configuring-the-jmx-exporter}

You can configure the JMX Exporter to expose JMX metrics from Kafka and Kafka Connect nodes to Prometheus.

To enable the collection of all JMX metrics available on the Kafka resources, configure the `EventStreams` custom resource as follows:

```yaml
  apiVersion: eventstreams.ibm.com/v1beta2
  kind: EventStreams
  # ...
  spec:
  # ...
  strimziOverrides:
    kafka: 
      metricsConfig:
        type: jmxPrometheusExporter
        valueFrom:
          configMapKeyRef:
            key: kafka-metrics-config.yaml
            name: metrics-config
      # ...
```

For more information about configuration options, see the following documentation:

- [Kafka JMX metrics configuration](https://strimzi.io/docs/operators/0.48.0/deploying.html#assembly-metrics-str){:target="_blank"}
- [Prometheus JMX metrics configuration](https://strimzi.io/docs/operators/0.48.0/configuring.html#con-common-configuration-prometheus-reference){:target="_blank"}

## Enabling and configuring Kafka Bridge
{: #enabling-and-configuring-kafka-bridge}

With [Kafka Bridge](https://strimzi.io/docs/bridge/latest/){:target="_blank"}, you can connect client applications to your {{site.data.reuse.es_name}} Kafka cluster over HTTP, providing a standard web API connection to {{site.data.reuse.es_name}} rather than the custom Kafka protocol.

To enable Kafka Bridge for {{site.data.reuse.es_name}}, create a `KafkaBridge` custom resource alongside the `EventStreams` custom resource. This can be defined in a YAML configuration document under the **Event Streams** operator in the {{site.data.reuse.openshift_short}} web console.

For example, to enable Kafka Bridge for {{site.data.reuse.es_name}} in the namespace `es-kafka-bridge`, create the following `KafkaBridge` configuration, where `spec.bootstrapServers` is the address of your {{site.data.reuse.es_name}} Kafka cluster, and `spec.http.port` is the port number for Kafka Bridge to access your cluster (default is `8080`):

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaBridge
metadata:
  name: my-bridge
  namespace: es-kafka-bridge
  labels:
    eventstreams.ibm.com/cluster: <cluster-name>
    backup.eventstreams.ibm.com/component: kafkabridge
spec:
  replicas: 1
  bootstrapServers: 'test.kafka-bootstrap.es-kafka-bridge:9093'
  http:
     port: 8080
  template:
    bridgeContainer:
      securityContext:
        allowPrivilegeEscalation: false
        capabilities:
          drop:
            - ALL
        privileged: false
        readOnlyRootFilesystem: true
        runAsNonRoot: true
    pod:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: kubernetes.io/arch
                    operator: In
                    values:
                      - amd64
                      - s390x
                      - ppc64le
```

Depending on your setup and purpose of deployment, you can add more `replicas` which sets the number of Kafka Bridge instances to run. For production environments, for example, consider deploying more than one replica for resilience.

After enabling Kafka Bridge, you can expose the service outside your cluster for external clients to connect to it as described in [exposing services for external access](../../connecting/expose-service/).

For more information about Kafka Bridge, including further configuration options and usage, see [connecting with Kafka Bridge](../../connecting/kafka-bridge/).

## Enabling and configuring Cruise Control
{: #enabling-and-configuring-cruise-control}

To enable Cruise Control, set the `spec.strimizOverrides.cruiseControl` property to `{}` in the `EventStreams` custom resource:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    cruiseControl: {}
```

**Note:** Ensure you have more than 1 Kafka broker configured to take advantage of Cruise Control. All [sample configurations](../planning/#sample-deployments) provided have more than 1 broker except the **Lightweight without security** sample.

When enabled, you can use the [default](#cruise-control-defaults) Cruise Control configuration to optimize your Kafka cluster. You can also specify your required configuration as described in the following sections.

When configuring Cruise Control, you can define the following settings in the `EventStreams` custom resource:
- Main optimization goals in `spec.strimziOverrides.cruiseControl.config.goals`
- Default optimization goals in `spec.strimziOverrides.cruiseControl.config["default.goals"]`

   **Note:** If you do not set main optimization goals and default goals, then the [Cruise Control defaults](#cruise-control-defaults) are used.

- Hard goals in `spec.strimziOverrides.cruiseControl.config["hard.goals"]`
- The capacity limits for broker resources, which Cruise Control uses to determine if resource-based optimization goals are being broken. The `spec.strimziOverrides.cruiseControl.brokerCapacity` property defines the Kafka broker resource capacities that Cruise Control will optimize around.

Cruise Control includes a number of [configuration options](https://github.com/linkedin/cruise-control/wiki/Configurations#cruise-control-configurations){:target="_blank"}. You can modify these configuration options for {{site.data.reuse.es_name}}, except the options managed directly by [Strimzi](https://strimzi.io/docs/operators/0.48.0/configuring.html#property-cruise-control-config-reference){:target="_blank"}.

When enabled, you can use Cruise Control and the `KafkaRebalance` custom resources to [optimize](../../administering/cruise-control/) your deployed {{site.data.reuse.es_name}} Kafka cluster.

### Cruise Control defaults
{: #cruise-control-defaults}

{{site.data.reuse.es_name}} supports a subset of the Cruise Control goals. If the main optimization goals and default goals (`spec.strimziOverrides.cruiseControl.config.goals` and `spec.strimziOverrides.cruiseControl.config["default.goals"]`, respectively) are not set, then the Cruise Control configuration defaults to the following goals (in descending order of priority):

- `com.linkedin.kafka.cruisecontrol.analyzer.goals.RackAwareGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.ReplicaCapacityGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.DiskCapacityGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkInboundCapacityGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkOutboundCapacityGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.CpuCapacityGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.ReplicaDistributionGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.PotentialNwOutGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.DiskUsageDistributionGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkInboundUsageDistributionGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkOutboundUsageDistributionGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.CpuUsageDistributionGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.TopicReplicaDistributionGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.LeaderReplicaDistributionGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.LeaderBytesInDistributionGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.PreferredLeaderElectionGoal`

For more information about the optimization goals, see the Cruise Control [documentation](https://github.com/linkedin/cruise-control/wiki/Pluggable-Components#goals){:target="_blank"}.

### Main optimization goals
{: #main-optimization-goals}

The main optimization goals define the goals available to be used in Cruise Control operations. Goals not listed cannot be used.

The `spec.strimziOverrides.cruiseControl.config.goals` property defines the list of goals Cruise Control can use.

The main optimization goals have [defaults](#cruise-control-defaults) if not configured.

For example, if you want Cruise Control to only consider using `com.linkedin.kafka.cruisecontrol.analyzer.goals.RackAwareGoal` and `com.linkedin.kafka.cruisecontrol.analyzer.goals.ReplicaCapacityGoal`, set values for `spec.strimziOverrides.cruiseControl.config.goals` property as follows:

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    cruiseControl:
      # ...
      config:
        # ...
        goals: >
          com.linkedin.kafka.cruisecontrol.analyzer.goals.RackAwareGoal,
          com.linkedin.kafka.cruisecontrol.analyzer.goals.ReplicaCapacityGoal
```

### Default goals
{: #default-goals}

The default goals define the set of goals that you want your cluster to meet most often. They are set in the `spec.strimziOverrides.cruiseControl.config["default.goals"]` property. By default, every 15 minutes, Cruise Control will use the current state of your Kafka cluster to generate a cached optimization proposal by using the configured `default.goals` list.

If no default goals are set, the main optimization goals are used as the [default](#cruise-control-defaults) optimization goals.

For example, if you want Cruise Control to always consider meeting `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkInboundUsageDistributionGoal`, `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkOutboundUsageDistributionGoal`, and `com.linkedin.kafka.cruisecontrol.analyzer.goals.CpuUsageDistributionGoal`, set values for the `spec.strimziOverrides.cruiseControl.config["default.goals"]` property as follows:

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    cruiseControl:
      # ...
      config:
        # ...
        default.goals: >
          com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkInboundUsageDistributionGoal,
          com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkOutboundUsageDistributionGoal,
          com.linkedin.kafka.cruisecontrol.analyzer.goals.CpuUsageDistributionGoal
```

### Hard goals
{: #hard-goals}

Hard goals define the list of goals that must be met by an optimization proposal and cannot be violated in any of the optimization functions of Cruise Control.

Hard goals can be set by the `spec.strimziOverrides.cruiseControl.config["hard.goals"]` property.

In Cruise Control, the following [main optimization goals](#cruise-control-defaults) are preset as hard goals:
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.RackAwareGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.ReplicaCapacityGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.DiskCapacityGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkInboundCapacityGoal`
- `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkOutboundCapacityGoal`

For example, to configure Cruise Control to always consider `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkInboundCapacityGoal` and `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkOutboundCapacityGoal` in an optimization proposal, provide these goals as values in the `spec.strimziOverrides.cruiseControl.config["hard.goals"]` property as follows:

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    cruiseControl:
      # ...
      config:
        # ...
        hard.goals: >
          com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkInboundCapacityGoal,
          com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkOutboundCapacityGoal
```

**Note:** The longer the list of hard goals, the less likely it is that Cruise Control will be able to find a viable optimization proposal. Consider configuring fewer hard goals and more goals for the [optimization proposals](../../administering/cruise-control/#setting-up-optimization) in the `KafkaRebalance` custom resource.


### Cruise Control BrokerCapacity
{: #cruise-control-brokercapacity}

Specifies capacity limits for broker resources.

Use the `spec.strimziOverrides.cruiseControl.brokerCapacity` property to define capacity limits for Kafka broker resources. Cruise Control will use the set limits to determine if resource-based optimization goals are being broken. The following table provides information about the resource capacity settings, the goals they affect, and the units they use:

| brokerCapacity | Goal                                                                          | unit |
| :--------------- | :---------------------------------------------------------------------------- | :--- |
| inboundNetwork   | `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkInboundCapacityGoal`  | KB/s |
| outboundNetwork  | `com.linkedin.kafka.cruisecontrol.analyzer.goals.NetworkOutboundCapacityGoal` | KB/s |
| disk             | `com.linkedin.kafka.cruisecontrol.analyzer.goals.DiskUsageDistributionGoal`   | Bytes |
| cpuUtilization   | `com.linkedin.kafka.cruisecontrol.analyzer.goals.CpuUsageDistributionGoal`    | Percent (0-100)  |

**Note:** Ensure you add the unit when configuring a `brokerCapacity` key, except for `cpuUtilization` where the percentage is not required.

For example, to configure Cruise Control to optimize around having an inbound network byte rate of `1000` kilobytes per second and a cpu utilization of 80 percent, configure the `spec.strimziOverrides.cruiseControl.brokerCapacity` property as follows:

```yaml
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    cruiseControl:
      # ...
      brokerCapacity:
        # ...
        inboundNetwork: 1000KB/s
        # Optimize for CPU utilization of 80%
        cpuUtilization: 80
```


## Unsupported settings
{: #unsupported-settings}

This release of {{site.data.reuse.es_name}} does not support the following configuration properties:
- `secretPrefix`: This property adds a prefix to the name of all secrets created from the `KafkaUser` resource. It can cause problems with the normal operation of {{site.data.reuse.es_name}}.

  Do not configure prefixes by setting the `EventStreams.spec.strimziOverrides.entityOperator.userOperator.secretPrefix` property.

- `watchedNamespace`: This property sets the namespace in which the deployed `KafkaUser` Operator watches for `KafkaUser` resources. It can cause problems with the normal operation of {{site.data.reuse.es_name}} as multiple components rely on the Entity User Operator to be watching the currently installed namespace.

  Do not configure the watched namespace by setting the `EventStreams.spec.strimziOverrides.entityOperator.userOperator.watchedNamespace` property.
