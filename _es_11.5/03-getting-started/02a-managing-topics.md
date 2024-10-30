---
title: "Managing Kafka topics"
excerpt: "Find out how you can edit and remove Kafka topics in Event Streams."
categories: getting-started
slug: managing-topics
toc: true
---

## Editing a Kafka topic

You can modify the configuration of a Kafka topic by using the CLI to customize it. 

**Note:** If you are a SCRAM user, you require specific access and permissions to set topic partitions. For more information, see [managing access](../../security/managing-access#managing-access-to-the-ui-and-cli-with-scram).

### By using the CLI

You can edit a Kafka topic by using the CLI as follows:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to initialize the {{site.data.reuse.es_name}} CLI on the cluster:

   ```shell
   kubecl es init
   ```
3. Run the following command to edit the configuration of a topic:

   ```shell
   kubectl es topic-update --name <topic-name> --config KEY[=VALUE]
   ```

   For example, to update a topic called `my-topic` to have `min.insync.replicas` as `2`:

   ```shell
   kubectl es topic-update --name my-topic --config min.insync.replicas=2
   ```

   **Note:** To view all configuration options you can set for topics, run the following help command. For more information about the available configuration options, see [creating topics](../../getting-started/creating-topics/#by-using-the-cli).
 
   ```shell
   kubectl es topic-update --help
   ```

## Setting topic partitions

![Event Streams 11.5.1 icon]({{ 'images' | relative_url }}/11.5.1.svg "In Event Streams 11.5.1 and later.") You can configure the number of partitions for a Kafka topic by using the UI or CLI to optimize data distribution, scalability, and performance. 

**Notes:** 
- If you are a SCRAM user, you require specific access and permissions to set topic partitions. For more information, see [managing access](../../security/managing-access#managing-access-to-the-ui-and-cli-with-scram).
- You cannot set topic partitions when the topic is in `Unmanaged`, `Paused`, or `Pending` state.


### By using the UI

To set the number of partitions for Kafka topics by using the UI, follow these steps:

1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Click **Home** in the primary navigation.
3. Navigate to **Topics** tab.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options > Set topic partitions** to set the partitions.

### By using the CLI

To set the number of partitions for Kafka topics by using the CLI, follow these steps:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to initialize the {{site.data.reuse.es_name}} CLI on the cluster:

   ```shell
   kubecl es init
   ```
3. Run the following command to set the number of topic partitions:

   ```shell
   kubectl es topic-partitions-set -n <topic-name> -p <partition-count>
   ```

   For example, to update a topic called `my-topic` to have `5` partitions:

   ```shell
   kubectl es topic-partitions-set -n my-topic -p 5
   ```

## Deleting a Kafka topic

To delete a Kafka topic, complete the following steps:

### By using the UI

1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Click **Home** in the primary navigation.
3. Navigate to **Topics** tab.
4. Click **Topic Delete** button in the overflow menu of the topic you want to delete. The topic is deleted and is removed from the list of topics.

### By using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to initialize the {{site.data.reuse.es_name}} CLI on the cluster:

   ```shell
   kubectl es init
   ```
3. Run the following command to delete a topic:

   ```shell
   kubectl es topic-delete --name <topic-name>
   ```
