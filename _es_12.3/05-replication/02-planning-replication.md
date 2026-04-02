---
title: "Planning for geo-replication"
excerpt: "Plan geo-replication for your clusters."
categories: georeplication
slug: planning
toc: true
---

Consider the following when planning for geo-replication:

- If you want to use the CLI to set up geo-replication, ensure you have the [Kubernetes CLI installed](https://kubernetes.io/docs/tasks/tools/){:target="_blank"}.
- Geo-replication requires both the origin and destination {{site.data.reuse.es_name}} instances to have client authentication enabled on the external listener and the internal TLS listener.
- If you are using geo-replication for disaster-recovery scenarios, see the guidance about [configuring your clusters and applications](../../mirroring/failover/#preparing-clusters-and-applications-for-switching) to ensure you can switch clusters if one becomes unavailable.
- [Identify the topics](../about/#what-to-replicate) you want to create copies of. This depends on the data stored in the topics, its use, and how critical it is to your operations.
-	Message history is included in geo-replication. The amount of history is determined by the message retention option set when the topics were created on the origin cluster.
- The replicated topics on the destination cluster will have a prefix added to the topic name. The prefix is the name of the {{site.data.reuse.es_name}} instance on the origin cluster, as defined in the `EventStreams` custom resource, for example `my_origin.<topic-name>`.
- You can configure geo-replication through the UI, the CLI, or by directly editing the associated `KafkaMirrorMaker2` custom resource.
- The `KafkaMirrorMaker2` custom resource is created and managed by the {{site.data.reuse.es_name}} UI or CLI when you set up geo-replication.

## Preparing a destination cluster
{: #preparing-a-destination-cluster}

Before you can set up geo-replication and start replicating topics, ensure your destination {{site.data.reuse.es_name}} cluster is installed and running. The origin and destination {{site.data.reuse.es_name}} clusters must each have at least one internal listener and one external listener configured, with authentication enabled.

When you set up geo-replication through the UI or CLI, a `KafkaMirrorMaker2` custom resource is created on the destination cluster to create geo-replication workers, which are instances of Kafka Connect running Kafka MirrorMaker 2.0 connectors. The number of geo-replication workers running on the destination cluster is configured in the `KafkaMirrorMaker2` custom resource.

The number of workers depends on the number of topics you want to replicate, and the throughput of the produced messages.

For example, you can create a small number of workers at the time of installation. You can then increase the number later if you find that your geo-replication performance is not able to keep up with making copies of all the selected topics as required. Alternatively, you can start with a high number of workers, and then decrease the number if you find that the workers underperform.

**Important:** For high availability reasons, ensure you have at least 2 workers on your destination cluster in case one of the workers encounters problems.

You can configure the number of workers when setting up geo-replication, or you can modify the `KafkaMirrorMaker2` custom resource later, even if you already have geo-replication set up and running on that cluster.

### MirrorMaker2 resource ownership
{: #mirrormaker2-resource-ownership}

When you configure geo-replication through the {{site.data.reuse.es_name}} UI, the `KafkaMirrorMaker2` resource created on the destination cluster includes the `ownerReference` property that points to the destination `EventStreams` custom resource. This ownership ensures that the `KafkaMirrorMaker2` resource that is part of the {{site.data.reuse.es_name}} instance is automatically removed when you delete the instance.

**Note:** The {{site.data.reuse.es_name}} UI and CLI create and manage `KafkaMirrorMaker2` resources that have the same name as the destination {{site.data.reuse.es_name}} instance. Before configuring geo-replication, ensure that a `KafkaMirrorMaker2` resource with the same name does not already exist in the destination cluster. If a resource with the same name exists, you must rename or delete it before you can use the UI or CLI to manage geo-replication.

### Setting geo-replication worker nodes
{: #setting-geo-replication-nodes}

You can set up geo-replication in a cluster to enable messages to be automatically synchronized between local and remote topics. A cluster can be a geo-replication origin or destination. Origin clusters send messages to a remote system, while destination clusters receive messages from a remote system. A cluster can be both an origin and a destination cluster at the same time. The geo-replication workers are instances of Kafka Connect running Kafka MirrorMaker 2.0 connectors.

When configuring the number of geo-replication worker nodes (replicas), you can edit the `spec.replicas` property in the `KafkaMirrorMaker2` custom resource on the destination cluster.

Ensure that the following properties match the name of the destination {{site.data.reuse.es_name}} instance:

- `metadata.name`
- `metadata.labels["eventstreams.ibm.com/cluster"]`

For example, to configure geo-replication with `2` replicas for an {{site.data.reuse.es_name}} instance called `sample-three` in the namespace `myproject`, edit the `KafkaMirrorMaker2` custom resource on the destination cluster:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaMirrorMaker2
metadata:
  labels:
    eventstreams.ibm.com/cluster: sample-three
  name: sample-three
  namespace: myproject
spec:
  # ...
  replicas: 2
```

### Configuring an existing installation
{: #configuring-an-existing-installation}

If you want to change the number of geo-replication workers on a destination cluster for scaling purposes, you can modify the number of workers by editing the `KafkaMirrorMaker2` custom resource through the UI or CLI as follows.

#### Using the UI on {{site.data.reuse.openshift_short}}
{: #using-the-ui-on-openshift-1}

If you are using {{site.data.reuse.openshift_short}}, to modify the number of workers by using the UI:
1. Go to where your destination cluster is installed. {{site.data.reuse.openshift_ui_login}}
2. From the navigation menu, click **Operators > Installed Operators**.
3. In the **Projects** drop-down list, select the project that contains the destination {{site.data.reuse.es_name}} instance.
4. Select the {{site.data.reuse.es_name}} operator in the list of installed operators.
5. Click the **KafkaMirrorMaker2** tab to see the list of KafkaMirrorMaker2 instances.
6. Click the KafkaMirrorMaker2 instance that you want to modify.
7. Click the **YAML** tab.
8. Update the **spec.replicas** property value to the number of geo-replication workers you want to run.
9. Click **Save**.

#### Using the CLI
{: #using-the-cli-1}

To modify the number of workers by using the CLI:
1. Go to where your destination cluster is installed. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to set the namespace that contains the existing destination cluster:

   ```shell
   kubectl config set-context --current --namespace=<namespace-name>
   ```

3. Run the following command to list your KafkaMirrorMaker2 instances:

   ```shell
   kubectl get kafkamirrormaker2
   ```

4. Run the following command to edit the YAML for your KafkaMirrorMaker2 instance:

   ```shell
   kubectl edit kafkamirrormaker2 <kafkamirrormaker2-instance-name>
   ```

5. Update the **spec.replicas** property value to the number of geo-replication workers you want to run.
6. Save your changes and close the editor.

ne