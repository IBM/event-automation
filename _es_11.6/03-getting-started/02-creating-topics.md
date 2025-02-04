---
title: "Creating a Kafka topic"
excerpt: "Create a Kafka topic to learn more about using Event Streams"
categories: getting-started
slug: creating-topics
toc: true
---

To use Kafka topics to store events in {{site.data.reuse.es_name}}, create and configure a Kafka topic.

## By using the UI

1. {{site.data.reuse.es_ui_login_nonadmin_samesection}}
2. Click **Home** in the primary navigation.
3. Click the **Create a topic** tile.
4. Enter a topic name in the **Topic name** field, for example, `my-topic`.
   This is the name of the topic that an application will be producing to or consuming from.

   Click **Next**.
5. Enter the number of **Partitions**, for example, `1`.
   Partitions are used for scaling and distributing topic data across the Apache Kafka brokers.
   For the purposes of a basic starter application, using only 1 partition is sufficient.

   Click **Next**.
6. Select a **Message retention**,  for example,  **A day**.
   This is how long messages are retained before they are deleted.

   Click **Next**.
7. Select a replication factor in **Replicas**,  for example, **Replication factor: 1**.
   This is how many copies of a topic will be made for high availability. For production environments, select **Replication factor: 3** as a minimum.

8. Click **Create topic**. The topic is created and can be viewed from the **Topics** tab located in the primary navigation.

In the {{site.data.reuse.es_name}} UI **Topics** page, the topic list includes the current state of each topic, and the status icon displays a message providing further information when you hover over the status icon.

**Note:** To view all configuration options you can set for topics, set **Show all available options** to **On**.

**Note:** Kafka supports additional [topic configuration](https://kafka.apache.org/38/documentation/#topicconfigs){:target="_blank"} settings. Enable **Show all available options** to access more detailed configuration settings if required.

## By using the CLI

1. {{site.data.reuse.cncf_cli_login}}

2. {{site.data.reuse.es_cli_init_111_samesection}}

3. Run the following command to create a topic:

   ```shell
   kubectl es topic-create --name <topic-name> --partitions <number-of-partitions> --replication-factor <replication-factor>
   ```

   For example, to create a topic called `my-topic` that has 1 partition, a replication factor of 1, and 1 day set for message retention time (provided in milliseconds):

   ```shell
   kubectl es topic-create --name my-topic --partitions 1 --replication-factor 1 --config retention.ms=86400000
   ```

   **Important:** Do not set `<replication-factor>` to a greater value than the number of available brokers.

 In the {{site.data.reuse.es_name}} CLI, the topic list includes the number of partitions, number of replicas, and the status information for each topic when you run the `kubectl es topics` command.

**Note:** To view all configuration options you can set for topics, use the help option as follows: 

```shell
kubectl es topic-create --help
```

Kafka supports additional [topic configuration](https://kafka.apache.org/38/documentation/#topicconfigs){:target="_blank"} settings. Extend the topic creation command with one or more `--config <property>=<value>` properties to apply additional configuration settings. The following additional properties are currently supported:

* cleanup.policy
* compression.type
* delete.retention.ms
* file.delete.delay.ms
* flush.messages
* flush.ms
* follower.replication.throttled.replicas
* index.interval.bytes
* leader.replication.throttled.replicas
* max.message.bytes
* message.format.version
* message.timestamp.difference.max.ms
* message.timestamp.type
* min.cleanable.dirty.ratio
* min.compaction.lag.ms
* min.insync.replicas
* preallocate
* retention.bytes
* retention.ms
* segment.bytes
* segment.index.bytes
* segment.jitter.ms
* segment.ms
* unclean.leader.election.enable

## By using YAML

You can create a Kafka topic by creating a `KafkaTopic` custom resource in a YAML file, and then running `kubectl apply -f <filename>.yaml`.

The following is an example `KafkaTopic` custom resource:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaTopic
metadata:
   name: <topic-name>
   labels:
   eventstreams.ibm.com/cluster: <cluster-name>
   backup.eventstreams.ibm.com/component: kafkatopic
   namespace: <namespace>
spec:
   topicName: <topic.name.with.special_characters>
   partitions: 1
   replicas: 1
   config:
   min.insync.replicas: '1'
```

**Note:** To create a Kafka topic with a name that is not a valid Kubernetes resource name, specify the required topic name in the `spec.topicName` property. If the `spec.topicName` field is not specified, the value of the `metadata.name` property is used as the topic name.



