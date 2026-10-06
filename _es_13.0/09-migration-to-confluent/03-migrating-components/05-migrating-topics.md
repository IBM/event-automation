---
title: "Migrating topic configuration and data"
excerpt: "Replicate Kafka topic configuration and data from Event Streams to Confluent Platform by using Cluster Linking."
categories: migration
slug: migrating-topics
toc: true
---

Replicate your Kafka topic configuration and data to Confluent Platform by using Cluster Linking.

Cluster Linking creates read-only mirror topics on the destination cluster, synchronized directly from the source {{site.data.reuse.es_name}} cluster. It preserves topic names, message data, partition counts, and offsets. Topic configurations are generally synchronized, but some configurations are destination-specific and must be reviewed and configured separately.

To migrate your topics and data, complete the following steps:

1. [Verify network requirements](#network-requirements): Confirm connectivity from Confluent Platform to {{site.data.reuse.es_name}}.
2. [Create a ClusterLink resource](#creating-a-clusterlink-resource): Define the connection to {{site.data.reuse.es_name}} and list topics to mirror.
3. [Monitor replication progress](#monitoring-replication-progress): Verify that replication is active and lag reaches zero.
4. [Verify topic data replication](#verifying-topic-data-replication): Compare earliest and latest offsets on both clusters.
5. [Promote topics](#promoting-topics): Stop producers and promote mirror topics to standard writable topics.
6. (Optional) [Enable tiered storage](#enabling-tiered-storage): If tiered storage was enabled in {{site.data.reuse.es_name}}, enable it on Confluent Platform after promoting all topics.
7. (Optional) [Configure tiered storage on migrated topics](#configuring-tiered-storage-on-migrated-topics): Configure tiered storage for each migrated topic.

## Network requirements
{: #network-requirements}

Cluster Linking requires the Confluent Platform brokers to initiate the connection to {{site.data.reuse.es_name}}. {{site.data.reuse.es_name}} is based on Apache Kafka and is not a Confluent-managed cluster, so only a destination-initiated connection is supported.

**Note:** Before you begin, confirm that the Confluent Platform brokers can reach the {{site.data.reuse.es_name}} broker listener, which is typically the internal TLS listener on port 9093. If this network path cannot be established, use Confluent Replicator instead. For more information, see [migrating MirrorMaker 2](../migrating-mirrormaker/).

## Creating a ClusterLink resource
{: #creating-a-clusterlink-resource}

Create a `ClusterLink` custom resource on the Confluent Platform cluster. This resource defines the connection to {{site.data.reuse.es_name}} and specifies which topics to replicate. For the full `ClusterLink` custom resource schema and field reference, see [Confluent documentation](https://docs.confluent.io/operator/current/co-link-clusters.html){:target="_blank"}.

**Note:** Before you begin, ensure that the `dataVolumeCapacity` configured on the `Kafka` custom resource is sufficient to store the complete dataset for all topics you migrate. Cluster Linking replicates all data, including remotely stored segments, to local broker disks on CFK. Monitor broker disk usage closely during replication and increase the volume capacity before local disks reach capacity.

Before you create the `ClusterLink` resource, consider the following points:

- **Authentication:** The `sourceKafkaCluster.authentication.type` field accepts `mtls`, `plain`, `oauthbearer`, `digest`, `oauth`, and `none`. For mTLS, reference a secret that contains `tls.crt`, `tls.key`, and `ca.crt` under `tls.secretRef`. For more information, see [configure network encryption with CFK](https://docs.confluent.io/operator/current/co-network-encryption.html){:target="_blank"}. For SCRAM-SHA-512, use `type: plain` with `jaasConfigPassThrough` — there is no `scram` type in the CRD. The secret must contain a key named `plain-jaas.conf` in Java properties format. Using `jaasConfig` instead results in a `SASL mechanism 'PLAIN' not enabled` error when the source cluster requires SCRAM. For more information, see [configure SASL/PLAIN authentication](https://docs.confluent.io/operator/current/co-authenticate.html){:target="_blank"}.
- **Bootstrap endpoint:** `sourceKafkaCluster.bootstrapEndpoint` must point to a listener on the source cluster whose authentication type matches the `ClusterLink` resource. The port depends on the source cluster's listener configuration and has no fixed default. For more information, see [Confluent documentation](https://docs.confluent.io/operator/current/co-link-clusters.html#specify-the-source-kafka-cluster){:target="_blank"}.
- **CA certificate:** The `ca.crt` in the TLS secret must be the CA that signed the broker certificate on the listener you are connecting to, not the client CA. On {{site.data.reuse.es_name}}, this is the `<es-instance>-cluster-ca-cert` secret, unless the listener uses a custom certificate.

To create a `ClusterLink` custom resource, follow the steps in the [Confluent documentation](https://docs.confluent.io/operator/current/co-link-clusters.html#create-a-cluster-link){:target="_blank"}.

**Note:** Consumer offset synchronization applies to consumer groups selected by the cluster link's consumer-group filters. Review the filters before migration and exclude any consumer groups that are already active on the destination cluster.

## Monitoring replication progress
{: #monitoring-replication-progress}

Run the following command to check the status and replication lag of your topics:

```bash
kubectl exec -n <cp-namespace> kafka-0 -- kafka-mirrors --describe \
  --links es-to-confluent-link \
  --bootstrap-server <bootstrap-server>
```

Where:
- `<cp-namespace>` is the Kubernetes namespace where Confluent Platform is deployed.

Wait until the mirror state shows `ACTIVE` for each topic. This confirms that replication is running and the cluster link is healthy.

Before you promote mirror topics to standard writable topics, verify that replication lag is `0` for each topic. A lag of `0` means the mirror topic is fully caught up with the source and no messages are lost during promotion.

## Verifying topic data replication
{: #verifying-topic-data-replication}

To confirm that all topic data is fully replicated, compare the earliest and latest offsets for each topic on both clusters.

1. Run the following commands on the source cluster ({{site.data.reuse.es_name}}):

   ```bash
   # Earliest available offset
   ./bin/kafka-get-offsets.sh \
     --bootstrap-server <es-external-bootstrap>:443 \
     --command-config es-client.properties \
     --topic <topic-name> \
     --time -2

   # Latest offset
   ./bin/kafka-get-offsets.sh \
     --bootstrap-server <es-external-bootstrap>:443 \
     --command-config es-client.properties \
     --topic <topic-name> \
     --time -1
   ```

2. Run the following commands on the destination cluster (CFK):

   ```bash
   # Earliest available offset
   ./bin/kafka-get-offsets.sh \
     --bootstrap-server <cfk-bootstrap-server> \
     --command-config cfk-client.properties \
     --topic <topic-name> \
     --time -2

   # Latest offset
   ./bin/kafka-get-offsets.sh \
     --bootstrap-server <cfk-bootstrap-server> \
     --command-config cfk-client.properties \
     --topic <topic-name> \
     --time -1
   ```

   Where:
   - `<cfk-bootstrap-server>` is the bootstrap address for your CFK cluster Kafka listener. For internal access, this is typically `kafka.confluent.svc.cluster.local:9092`.
   - `<topic-name>` is the name of the topic to verify.

3. Compare the results to confirm that each mirror topic has caught up with its source topic. Use offset comparison as a diagnostic check. If offsets do not match, check which partitions are lagging, review Cluster Linking lag metrics, and resolve any link errors before retrying. For more information, see the [Confluent Cluster Linking documentation](https://docs.confluent.io/platform/current/multi-dc-deployments/cluster-linking/overview.html){:target="_blank"}.

## Promoting topics
{: #promoting-topics}

When replication is complete, see [migrating applications](../migrating-applications/) to stop producers, promote topics, and switch your applications to Confluent Platform.

## Enabling tiered storage
{: #enabling-tiered-storage}

If you use tiered storage in {{site.data.reuse.es_name}}, enable it on Confluent Platform after you promote all topics. You do not need to migrate remote storage data separately. Cluster Linking replicates all topic data, including remotely stored segments, to the CFK brokers.

**Important:** Use a new, dedicated S3 bucket for CFK tiered storage rather than reusing the {{site.data.reuse.es_name}} bucket. CFK uses its own tiered storage implementation and cannot read data directly from the {{site.data.reuse.es_name}} bucket.

After you switch your client applications over to Confluent Platform and {{site.data.reuse.es_name}} is no longer receiving live traffic, retain the {{site.data.reuse.es_name}} S3 bucket for at least the `retention.ms` period configured on your topics before you delete it. This ensures that remotely stored segments remain accessible if you need to revert to the source cluster within that period.

Before you enable tiered storage in CFK, ensure that a dedicated S3 bucket for CFK tiered storage is available.

To enable tiered storage at the cluster level, follow the [Confluent tiered storage documentation](https://docs.confluent.io/platform/current/clusters/tiered-storage.html){:target="_blank"}.

## Configuring tiered storage on migrated topics
{: #configuring-tiered-storage-on-migrated-topics}

After you enable tiered storage at the cluster level, run the following command to configure each migrated topic to use tiered storage:

```bash
./bin/kafka-configs.sh \
  --bootstrap-server <cfk-bootstrap-server> \
  --command-config cfk-client.properties \
  --entity-type topics \
  --entity-name <topic-name> \
  --alter \
  --add-config confluent.tier.enable=true
```

Where:
- `<cfk-bootstrap-server>` is the bootstrap address for the Kafka listener on your CFK cluster. For internal access, this is typically `kafka.confluent.svc.cluster.local:9092`.
- `<topic-name>` is the name of the migrated topic to configure.

You can also specify additional topic configuration settings in the `--add-config` parameter:

| Property | Description | Example |
|----------|-------------|---------|
| `local.retention.ms` | Duration in milliseconds that data is retained in local storage before offloading. Must be less than `retention.ms`. | `86400000` (24 hours) |
| `retention.ms` | Total retention period across local and remote storage combined. | `2592000000` (30 days) |
| `segment.bytes` | Maximum size in bytes of a local log segment before it is rolled. | `536870912` (512 MiB) |


**Note:** Enabling tiered storage on a migrated topic does not immediately offload all existing data. Data is offloaded incrementally as log segments become eligible based on the `local.retention.ms` setting.

## Optional: Managing topics by using custom resources
{: #optional-managing-topics-by-using-custom-resources}

Cluster Linking migrates Kafka topic data and configuration to Confluent Platform, but does not create a `KafkaTopic` resource for managing topics through Kubernetes custom resources.

To manage a migrated topic through a `KafkaTopic` custom resource, create one with specifications that match the existing topic. CFK adopts the topic without recreating it or affecting existing message data.

### Prerequisites
{: #prerequisites-for-managing-topics-with-custom-resources}

All mirror topics must be promoted before you create custom resources. To confirm that no mirror topics remain active before you create custom resources, run the following command:

```bash
kubectl exec -n <namespace> kafka-0 -- \
  kafka-mirrors --describe --bootstrap-server localhost:9092 \
  | grep -E "^Topic:|State:" | paste - - | grep -v "STOPPED"
```

Where:
- `<namespace>` is the Kubernetes namespace where Confluent Platform is deployed.

Verify that this command returns no output before you continue.

Creating a `KafkaTopic` custom resource against an unpromoted mirror topic fails with an error:

```
Cannot modify mirror topic <topic-name> because '<configs>' are set to always sync
```

### Requirements for managing topics with custom resources
{: #requirements-for-managing-topics-with-custom-resources}

When creating a `KafkaTopic` custom resource for an existing topic, ensure that the following requirements are met:

- **Topic name and Kubernetes naming constraints:** The `spec.name` property must match the exact name of the existing Kafka topic. If your Kafka topic name contains uppercase letters or underscores (which are not permitted in Kubernetes resource names), specify a lowercase name with hyphens in `metadata.name` and use `spec.name` to specify the exact Kafka topic name.
- **Matching partition count:** The `spec.partitionCount` value must match the current partition count of the topic. If `partitionCount` is less than the existing topic value, reconciliation fails. If `partitionCount` is greater, CFK attempts to increase the partition count.
- **Matching replication factor:** The `spec.replicas` value must match the current replication factor of the existing topic. Mismatches cause reconciliation errors.
- **Topic configurations:** Define any non-default topic configuration overrides (such as `cleanup.policy`, `retention.ms`, `min.insync.replicas`, `segment.bytes`, or tiered storage settings) shown in the `Configs:` field of the `kafka-topics --describe` output under `spec.configs`. After creation, CFK enforces these configuration properties, and any direct changes made by using `kafka-configs.sh` are overwritten on the next reconciliation cycle.
- **KafkaRestClass reference:** The `spec.kafkaRestClassRef` property specifies the `KafkaRestClass` custom resource to use for authentication and authorization. This property is optional and is required only when role-based access control (RBAC) is enabled on the destination cluster.

### Creating a custom resource for a topic
{: #creating-a-custom-resource-for-a-topic}

To manage a topic by using a custom resource, complete the following steps:

1. Retrieve the partition count, replication factor, and configuration settings of your topic by running the following command:

   ```bash
   kubectl exec -n <namespace> kafka-0 -- \
     kafka-topics --bootstrap-server localhost:9092 \
     --describe --topic <topic-name>
   ```

   Where:
   - `<namespace>` is the Kubernetes namespace where Confluent Platform is deployed.
   - `<topic-name>` is the name of your topic.

2. Create a `KafkaTopic` custom resource YAML file with values that match the describe output:

   ```yaml
   apiVersion: platform.confluent.io/v1beta1
   kind: KafkaTopic
   metadata:
     name: <sanitized-lowercase-name>   # Kubernetes resource name. No uppercase or underscores.
     namespace: <namespace>
   spec:
     name: <exact-kafka-topic-name>     # Real Kafka topic name used to match the existing topic.
     partitionCount: <partition-count>
     replicas: <replication-factor>
     kafkaRestClassRef:                # Optional: required only if RBAC is enabled on the cluster.
       name: <kafka-rest-class-name>
     configs:
       cleanup.policy: "<value>"
       retention.ms: "<value>"
       min.insync.replicas: "<value>"
       segment.bytes: "<value>"
       # Include all non-default config overrides from kafka-topics --describe output.
   ```

   Where:
   - `<sanitized-lowercase-name>` is the Kubernetes resource name (lowercase alphanumeric characters and hyphens only).
   - `<namespace>` is the Kubernetes namespace where Confluent Platform is deployed.
   - `<exact-kafka-topic-name>` is the exact Kafka topic name used to match the existing topic.
   - `<partition-count>` is the partition count of the existing topic.
   - `<replication-factor>` is the replication factor of the existing topic.
   - `<kafka-rest-class-name>` is the name of your `KafkaRestClass` custom resource (optional, and required only if RBAC is enabled).
   - `<value>` represents the specific configuration value from the `kafka-topics --describe` output.

   **Note:** If the `Configs:` field in the `describe` output is empty, omit the `configs:` block entirely from the custom resource.

3. Apply the custom resource and verify that CFK manages the topic:

   ```bash
   kubectl apply -f <topic-cr>.yaml
   kubectl get kafkatopic <sanitized-lowercase-name> -n <namespace> -w
   ```

   Where:
   - `<topic-cr>` is the name of your custom resource file.

   The topic reaches `Ready` state once the operator successfully adopts the topic.

For more information, see the [Confluent documentation about managing topics](https://docs.confluent.io/operator/current/co-manage-topics.html){:target="_blank"}.

