---
title: "Managing Kafka topics"
excerpt: "Find out how you can edit and remove Kafka topics in Event Streams."
categories: getting-started
slug: managing-topics
toc: true
---

## Editing a Kafka topic

You can modify the configuration of a Kafka topic by using the CLI to customize it. 

### By using the CLI

You can edit a Kafka topic by using the CLI as follows:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to initialize the {{site.data.reuse.es_name}} CLI on the cluster:

   ```shell
   kubectl es init
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

To optimize data distribution, scalability, and performance, you can configure the number of partitions for a Kafka topic by using the UI or CLI. 

**Notes:** 
- If you are a SCRAM user, you require specific access and permissions to set topic partitions. For more information, see [managing access](../../security/managing-access#managing-access-to-the-ui-and-cli-with-scram).
- You cannot set topic partitions when the topic is in any of the following states: `Unmanaged`, `Paused`, `Pending`, or `Updating`.


### By using the UI

To set the number of partitions for Kafka topics by using the UI:

1. {{site.data.reuse.es_ui_login_nonadmin}}
1. Click **Topics** in the primary navigation.
1. Select a topic from the list, then click ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Overflow menu at end of each row."){:height="30px" width="15px"} **Overflow menu** > **Set topic partitions** to set the partitions.

### By using the CLI

To set the number of partitions for Kafka topics by using the CLI:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to initialize the {{site.data.reuse.es_name}} CLI on the cluster:

   ```shell
   kubectl es init
   ```
3. Run the following command to set the number of topic partitions:

   ```shell
   kubectl es topic-partitions-set -n <topic-name> -p <partition-count>
   ```

   For example, to update a topic called `my-topic` to have `5` partitions:

   ```shell
   kubectl es topic-partitions-set -n my-topic -p 5
   ```

## Setting topic replicas

To ensure data durability and high availability, you can update the replication factor for a Kafka topic by using the UI or CLI.

**Notes:** 
- If you are a SCRAM user, you require specific access and permissions to set topic replicas. For more information, see [managing access](../../security/managing-access#managing-access-to-the-ui-and-cli-with-scram).
- You cannot set topic replicas when the topic state is not displayed and when the topic is in any of the following states: `Unmanaged`, `Paused`, `Pending`, or `Updating`.

  In some cases, a topic might not have a custom resource when created directly in Kafka or through Kafka Connect. In these situations, the topic state is not available in the UI and CLI, and you cannot set topic replicas.

- The **Set topic replicas** option is only available for topics that have a custom resource defined.

### Prerequisite

To set the replication factor, your {{site.data.reuse.es_name}} instance must have Cruise Control enabled. For more information, see [enabling and configuring Cruise Control](../../installing/configuring/#enabling-and-configuring-cruise-control). 

### By using the UI

To set the replication factor for Kafka topics by using the UI:

1. {{site.data.reuse.es_ui_login_nonadmin}}
1. Click **Topics** in the primary navigation.
1. Select a topic from the list, then click ![Overflow menu]({{ 'images' | relative_url }}/overflow_menu.png "Overflow menu at end of each row."){:height="30px" width="15px"} **Overflow menu** > **Set topic replicas** to set the replication factor.

### By using the CLI

To set the replication factor for Kafka topics by using the CLI:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to initialize the {{site.data.reuse.es_name}} CLI on the cluster:

   ```shell
   kubectl es init
   ```
3. Run the following command to set the replication factor:

   ```shell
   kubectl es topic-replicas-set [--name] <topic-name> --replicas <replica-count>
   ```

   For example, to update a topic called `my-topic` to have `3` replicas:

   ```shell
   kubectl es topic-replicas-set --name my-topic --replicas 3
   ```

## Deleting a Kafka topic

To delete a Kafka topic, complete the following steps:

### By using the UI

1. {{site.data.reuse.es_ui_login_nonadmin}}
1. Click **Topics** in the primary navigation.
1. Click **Topic Delete** button in the ![Overflow menu]({{ 'images' | relative_url }}/overflow_menu.png "Overflow menu at end of each row."){:height="30px" width="15px"} overflow menu of the topic you want to delete. The topic is deleted and is removed from the list of topics.

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
