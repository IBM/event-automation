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
-	[Prepare your destination cluster](#preparing-a-destination-cluster) by creating an EventStreamsGeoReplicator instance and defining the number of geo-replication workers.
- [Identify the topics](../about/#what-to-replicate) you want to create copies of. This depends on the data stored in the topics, its use, and how critical it is to your operations.
-	Message history is included in geo-replication. The amount of history is determined by the message retention option set when the topics were created on the origin cluster.
- The replicated topics on the destination cluster will have a prefix added to the topic name. The prefix is the name of the {{site.data.reuse.es_name}} instance on the origin cluster, as defined in the EventStreams custom resource, for example `my_origin.<topic-name>`.
- Configuration of geo-replication is done by the UI, the CLI or by directly editing the associated KafkaMirrorMaker2 custom resource.

## Preparing a destination cluster

Before you can set up geo-replication and start replicating topics, you must create an EventStreamsGeoReplicator custom resource at the destination. The {{site.data.reuse.es_name}} operator uses the EventStreamsGeoReplicator custom resource to create a configured KafkaMirrorMaker2 custom resource. The KafkaMirrorMaker2 custom resource is used by the {{site.data.reuse.es_name}} operator to create geo-replication workers, which are instances of Kafka Connect running Kafka MirrorMaker 2.0 connectors. The number of geo-replication workers running at the destination cluster is configured in the EventStreamsGeoReplicator custom resource.

The number of workers depend on the number of topics you want to replicate, and the throughput of the produced messages.

For example, you can create a small number of workers at the time of installation. You can then increase the number later if you find that your geo-replication performance is not able to keep up with making copies of all the selected topics as required. Alternatively, you can start with a high number of workers, and then decrease the number if you find that the workers underperform.

**Important:** For high availability reasons, ensure you have at least 2 workers on your destination cluster in case one of the workers encounters problems.

You can configure the number of workers at the time of creating the EventStreamsGeoReplicator instance, or you can modify an existing EventStreamsGeoReplicator instance, even if you already have geo-replication set up and running on that cluster.

### Configuring a new installation

If you are installing a new EventStreamsGeoReplicator instance for geo-replication to a destination cluster, you must specify the existing destination {{site.data.reuse.es_name}} instance you are connecting to. You can also specify the number of workers as part of configuring the EventStreamsGeoReplicator instance.

To configure the number of workers at the time of installation, see the following sections.

#### Using the UI on {{site.data.reuse.openshift_short}}

If you are using {{site.data.reuse.openshift_short}}, to create a new EventStreamsGeoReplicator instance for geo-replication by using the UI:
1. Go to where your destination cluster is installed. {{site.data.reuse.openshift_ui_login}}
2. From the navigation menu, click **Operators > Installed Operators**.
3. In the **Projects** drop-down list, select the project that contains the existing destination {{site.data.reuse.es_name}} instance.
4. Select the {{site.data.reuse.es_name}} operator in the list of installed operators.
5. In the **Operator Details > Overview** page, find the **Geo-Replicator** tile in the list of **Provided APIs** and click **Create Instance**.
6. In the **Create EventStreamsGeoReplicator** page, edit the provided YAML to set values for the following properties.
   - In the **metadata.labels** section, set the **eventstreams.ibm.com/cluster** property value to the name of your destination {{site.data.reuse.es_name}} instance.
   - Set the **metadata.name** property value to the name of your destination {{site.data.reuse.es_name}} instance.
   - Set the **spec.replicas** property value to the number of geo-replication workers you want to run.
  ![Create EventStreamsGeoReplicator]({{ 'images' | relative_url }}/georeplication_create_eventstreamsgeoreplicator_11.2.png "Screen capture showing the Create EventStreamsGeoReplicator page with completed YAML."){:height="80%" width="80%"}
7. Click **Create**.
8. The new EventStreamsGeoReplicator instance is listed in the **Operator Details > EventStreamsGeoReplicator** page.

If the EventStreamsGeoReplicator instance is configured correctly, a KafkaMirrorMaker2 custom resource is created. You can see the details for the KafkaMirrorMaker2 custom resource in the  **Kafka Mirror Maker 2** tab of the **Operator Details** page.

#### Using the CLI

To create a new EventStreamsGeoReplicator instance for geo-replication by using the CLI:
1. Go to where your destination cluster is installed. {{site.data.reuse.cncf_cli_login}} Then, log in to [{{site.data.reuse.es_name}} CLI](../../getting-started/logging-in/#logging-in-to-event-streams-cli).
2. Run the following command to set the namespace that contains the existing destination cluster:

   ```shell
   kubectl config set-context --current --namespace=<namespace-name>
   ```

3. Define an EventStreamsGeoReplicator instance in a file. For example, the following YAML defines an EventStreamsGeoReplicator instance in the `my-project` project that is connected to the {{site.data.reuse.es_name}} instance named `my-dest-cluster` and has 3 geo-replication workers.

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta1
   kind: EventStreamsGeoReplicator
   metadata:
     labels:
       eventstreams.ibm.com/cluster: my-dest-cluster
     name: my-dest-cluster
     namespace: my-project
   spec:
     version: 11.5.0
     replicas: 3
   ```

   **Note:** The EventStreamsGeoReplicator `metadata.name` property and `eventstreams.ibm.com/cluster` label property must be set to the name of the destination {{site.data.reuse.es_name}} instance that you are geo-replicating to.
4. Run the following command to create the EventStreamsGeoReplicator instance:

   ```shell
   kubectl create -f <path-to-your-eventstreamsgeoreplicator-file>
   ```

5. The new EventStreamsGeoReplicator instance is created.
6. Run the following command to list your EventStreamsGeoReplicator instances:

   ```shell
   kubectl get eventstreamsgeoreplicators
   ```

7. Run the following command to view the YAML for your EventStreamsGeoReplicator instance:

   ```shell
   kubectl get eventstreamsgeoreplicator <eventstreamsgeoreplicator-instance-name> -o yaml
   ```

When the EventStreamsGeoReplicator instance is ready, a KafkaMirrorMaker2 instance will be created. Run the following command to list your KafkaMirrorMaker2 instances:

```shell
kubectl get kafkamirrormaker2s
```

Run the following command to view the YAML for your KafkaMirrorMaker2 instance:

```shell
kubectl get kafkamirrormaker2 <kafka-mirror-make-2-instance-name> -o yaml
```

**Note:** If you have Strimzi installed, you might need to fully-qualify the resources you are requesting. The fully-qualified name for the KafkaMirrorMaker2 instances is `kafkamirrormaker2.eventstreams.ibm.com`.

### Configuring an existing installation

If you want to change the number of geo-replication workers at a destination cluster for scaling purposes, you can modify the number of workers by using the UI or CLI as follows.

#### Using the UI on {{site.data.reuse.openshift_short}}

If you are using {{site.data.reuse.openshift_short}}, to modify the number of workers by using the UI:
1. Go to where your destination cluster is installed. {{site.data.reuse.openshift_ui_login}}
2. From the navigation menu, click **Operators > Installed Operators**.
3. In the **Projects** drop-down list, select the project that contains the destination {{site.data.reuse.es_name}} instance.
4. Select the {{site.data.reuse.es_name}} operator in the list of installed operators.
5. Click the **Geo-Replicator** tab to see the list of EventStreamsGeoReplicator instances.
6. Click the EventStreamsGeoReplicator instance that you want to modify.
7. Click the **YAML** tab.
8. Update the **spec.replicas** property value to the number of geo-replication workers you want to run.
9. Click **Save**.

#### Using the CLI

To modify the number of workers by using the CLI:
1. Go to where your destination cluster is installed. {{site.data.reuse.cncf_cli_login}} Then, log in to [{{site.data.reuse.es_name}} CLI](../../getting-started/logging-in/#logging-in-to-event-streams-cli).
2. Run the following command to set the namespace that contains the existing destination cluster:

   ```shell
   kubectl config set-context --current --namespace=<namespace-name>
   ```

3. Run the following command to list your EventStreamsGeoReplicator instances:

   ```shell
   kubectl get eventstreamsgeoreplicators
   ```

4. Run the following command to edit the YAML for your EventStreamsGeoReplicator instance:

   ```shell
   kubectl edit eventstreamsgeoreplicator <eventstreamsgeoreplicator-instance-name>
   ```

5. Update the **spec.replicas** property value to the number of geo-replication workers you want to run.
6. Save your changes and close the editor.
