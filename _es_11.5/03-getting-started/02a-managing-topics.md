---
title: "Managing Kafka topics"
excerpt: "Find out how you can edit and remove Kafka topics in Event Streams."
categories: getting-started
slug: managing-topics
toc: true
---

## Editing a Kafka topic

### By using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to initialize the {{site.data.reuse.es_name}} CLI on the cluster:

   ```shell
   kubecl es init
   ```
3. Run the following command to edit the configuration of a topic:

   ```shell
   kubectl es topic-update --name <topic-name> --config KEY[=VALUE]
   ```

   For example:
   - To update a topic called `my-topic` to have `min.insync.replicas` as `2`:

     ```shell
     kubectl es topic-update --name my-topic --config min.insync.replicas=2
     ```

   - To update the number of topic partitions to `5` :

     ```shell
     kubectl es topic-partitions-set -n my-topic -p 5
     ```

   **Note:** To view all configuration options you can set for topics, use the help option as follows:
 
      ```shell
      kubectl es topic-update --help
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
