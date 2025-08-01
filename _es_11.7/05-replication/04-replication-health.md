---
title: "Monitoring and managing geo-replication"
excerpt: "Check the status of your geo-replication."
categories: georeplication
slug: health
toc: true
---
When you have geo-replication set up, you can monitor and manage your geo-replication, such as checking the status of your geo-replicators, pausing and resuming geo-replication, removing replicated topics from destination clusters, and so on.

## From a destination cluster

You can check the status of your geo-replication and manage geo-replicators (such as pause and resume) on your destination cluster.

You can view the following information for geo-replication on a destination cluster:

* The total number of origin clusters that have topics being replicated to the destination cluster you are logged into.
* The total number of topics being geo-replicated to the destination cluster you are logged into.
* Information about each origin cluster that has geo-replication set up on the destination cluster you are logged into:
    - The cluster name, which includes the release name.
    - The health of the geo-replication for that origin cluster: **Creating**, **Running**, **Updating**, **Paused**, **Stopping**, **Assigning**, **Offline**, and **Error**.
    - Number of topics replicated from each origin cluster.

**Tip:** As your cluster can be used as a destination for more than one origin cluster and their replicated topics, this information is useful to understand the status of all geo-replicators running on the cluster.

### Using the UI

To view this information on the destination cluster by using the UI:
1. Log in to your destination {{site.data.reuse.es_name}} cluster as an administrator.
2. Click **Topics** in the primary navigation and then click **Geo-replication**.
3. Click the **Origin locations** tab for details.

To manage geo-replication on the destination cluster by using the UI:
1. Log in to your destination {{site.data.reuse.es_name}} cluster as an administrator.
2. Click **Topics** in the primary navigation and then click **Geo-replication**.
3. Click the **Origin locations** tab for details.
4. Locate the name of the origin cluster for which you want to manage geo-replication for, and choose from one of the following options:
    - ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Overflow menu at end of each row."){:height="30px" width="15px"} **Overflow menu > Pause running replicators**: To pause geo-replication and suspend replication of data from the origin cluster.
    - ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Overflow menu at end of each row."){:height="30px" width="15px"} **Overflow menu > Resume paused replicators**: To resume geo-replication and restart replication of data from the origin cluster.
    - ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Overflow menu at end of each row."){:height="30px" width="15px"} **Overflow menu > Restart failed replicators**: To restart a geo-replicator that experienced problems.
    - ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Overflow menu at end of each row."){:height="30px" width="15px"} **Overflow menu > Stop replication**: To stop geo-replication from the origin cluster.
    
      **Important:** Stopping replication also removes the origin cluster from the list.

**Note:** You cannot perform these actions on the destination cluster by using the CLI.

## From an origin cluster

On the origin cluster, you can check the status of all of your destination clusters, and drill down into more detail about each destination.

You can also manage geo-replicators (such as pause and resume), and remove entire destination clusters as a target for geo-replication. You can also add topics to geo-replicate.

You can view the following high-level information for geo-replication on an origin cluster:

* The name of each destination cluster.
* The total number of topics being geo-replicated to all destination clusters from the origin cluster you are logged into.
* The total number of workers running for the destination cluster you are geo-replicating topics to.

You can view more detailed information about each destination cluster after they are set up and running like:

* The topics that are being geo-replicated to the destination cluster.
* The health status of the geo-replication on each destination cluster: **Awaiting creation**, **Pending**, **Running**, **Resume**, **Resuming**, **Pausing**, **Paused**, **Removing**, and **Error**. When the status is **Error**, the cause of the problem is also provided to aid resolution.

### Using the UI

To view this information on the origin cluster by using the UI:
1. Log in to your origin {{site.data.reuse.es_name}} cluster as an administrator.
2. Click **Topics** in the primary navigation and then click **Geo-replication**.
3. Click the **Destination locations** tab for details.

To manage geo-replication on the origin cluster by using the UI:
1. Log in to your origin {{site.data.reuse.es_name}} cluster as an administrator.
2. Click **Topics** in the primary navigation and then click **Geo-replication**.
3. Click the name of the destination cluster for which you want to manage geo-replication.
4. Choose from one of the following options using the top right ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Three vertical dots for the overflow icon at end of each row."){:height="30px" width="15px"} **Overflow menu**:
    - ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Three vertical dots for the overflow icon at end of each row."){:height="30px" width="15px"} **Overflow menu > Pause running geo-replicator**: To pause the geo-replicator for this destination and suspend replication of data to the destination cluster for all topics.
    - ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Three vertical dots for the overflow icon at end of each row."){:height="30px" width="15px"} **Overflow menu > Resume paused geo-replicator**: To resume the paused geo-replicator for this destination and resume replication of data to the destination cluster for all topics.
    - ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Three vertical dots for the overflow icon at end of each row."){:height="30px" width="15px"} **Overflow menu > Restart failed geo-replicator**: To restart a geo-replicator that experienced problems.
    - ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Three vertical dots for the overflow icon at end of each row."){:height="30px" width="15px"} **Overflow menu > Remove cluster as destination**: To remove the cluster as a destination for geo-replication.

To stop an individual topic from being replicated and remove it from the geo-replicator, select ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Three vertical dots for the overflow icon at end of each row."){:height="30px" width="15px"} **Overflow menu > Stop replicating topic**.

### Using the CLI

To view this information on the origin cluster by using the CLI:
1. Go to your origin cluster. {{site.data.reuse.cncf_cli_login}}
2. {{site.data.reuse.es_cli_init_111}}
3. Retrieve destination cluster IDs by using the following command:

   ```shell
   kubectl es geo-clusters
   ```

4. Retrieve information about a destination cluster by running the following command and copying the required destination cluster ID from the previous step:

   ```shell
   kubectl es geo-cluster --destination <destination-cluster-id>
   ```

   For example:

   ```shell
   kubectl es geo-cluster --destination destination_byl6x
   ```

   The command returns the following information:

   ```shell
   Details of destination cluster destination_byl6x
      Cluster ID          Cluster name   REST API URL                                                                     Skip SSL validation?
      destination_byl6x   destination    https://destination-ibm-es-admapi-external-myproject.apps.geodest.ibm.com:443    false

      Geo-replicator details
      Geo-replicator name                       Status          Origin bootstrap servers
      origin_es->destination-mm2connector       RUNNING         origin_es-kafka-bootstrap-myproject.apps.geosource.ibm.com:443

      Geo-replicated topics
      Geo-replicator name                       Origin topic    Destination topic
      origin_es->destination-mm2connector       topic1          origin_es.topic1
      origin_es->destination-mm2connector       topic2          origin_es.topic2

   ```

Each geo-replicator creates a MirrorSource connector and a MirrorCheckpoint connector. The MirrorSource connector replicates data from the origin to the destination cluster. You can use the MirrorCheckpoint connector during [failover](../../mirroring/failover/#updating-consumer-group-offsets-by-using-checkpoints) from the origin to the destination cluster.

To manage geo-replication on the origin cluster by using the CLI:
1. Go to your origin cluster. {{site.data.reuse.cncf_cli_login}}
2. {{site.data.reuse.es_cli_init_111}}
3. Run the following commands as required:

   - ```shell
     kubectl es geo-replicator-pause --destination <destination-cluster-id> --name "<replicator-name>"
     ```

     For example:

     ```shell
     kubectl es geo-replicator-pause --destination destination_byl6x  --name "origin_es->destination-mm2connector"
     ```

     This will pause both the MirrorSource connector and the MirrorCheckpoint connector for this geo-replicator.  Geo-replication for all topics that are part of this geo-replicator will be paused.

   - ```shell
     kubectl es geo-replicator-resume --destination <destination-cluster-id> --name "<replicator-name>"
     ```

     For example:

     ```shell
     kubectl es geo-replicator-resume --destination destination_byl6x  --name "origin_es->destination-mm2connector"
     ```

     This will resume both the MirrorSource connector and the MirrorCheckpoint connector for this geo-replicator after they have been paused. Geo-replication for all topics that are part of this geo-replicator will be resumed.

   - ```shell
     kubectl es geo-replicator-restart --destination <destination-cluster-id> --name "<replicator-name>" --connector <connector-name>
     ```

     For example:

     ```shell
     kubectl es geo-replicator-restart --destination destination_byl6x  --name "origin_es->destination-mm2connector" --connector MirrorSourceConnector
     ```

     This will restart a failed geo-replicator MirrorSource connector.

   - ```shell
     kubectl es geo-replicator-topics-remove --destination <destination-cluster-id> --name "<replicator-name>" --topics <comma-separated-topic-list>
     ```

     For example:

     ```shell
     kubectl es geo-replicator-topics-remove --destination destination_byl6x  --name "origin_es->destination-mm2connector " --topics topic1,topic2
     ```

     This will remove the listed topics from this geo-replicator.

   - ```shell
     kubectl es geo-replicator-delete --destination <destination-cluster-id> --name "<replicator-name>"
     ```

     For example:

     ```shell
     kubectl es geo-replicator-delete --destination destination_byl6x  --name "origin_es->destination-mm2connector"
     ```

     This will remove all MirrorSource and MirrorCheckpoint connectors for this geo-replicator.

   - ```shell
     kubectl es geo-cluster-remove --destination <destination-cluster-id>
     ```

     For example:

     ```shell
     kubectl es geo-cluster-remove --destination destination_byl6x
     ```

     This will permanently remove a destination cluster.

     **Note:** If you are unable to remove a destination cluster due to technical issues, you can use the `--force` option with the `geo-cluster-remove` command to remove the cluster.


## Restarting a geo-replicator with Error status

Running geo-replicators constantly consume from origin clusters and produce to destination clusters. If the geo-replicator receives an unexpected error from Kafka, it might stop replicating and report a status of **Error**.

Monitor your geo-replication cluster to confirm that your geo-replicator is replicating data.

To restart a geo-replicator that has an **Error** status from the UI:
1. Log in to your origin {{site.data.reuse.es_name}} cluster as an administrator.
2. Click **Topics** in the primary navigation and then click **Geo-replication**.
3. Locate the name of the destination cluster for the geo-replicator that has an **Error** status.
4. Locate the reason for the **Error** status under the entry for the geo-replicator.
5. Either fix the reported problem with the system or verify that the problem is no longer present.
6. Select ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Three vertical dots for the overflow icon at end of each row."){:height="30px" width="15px"} **Overflow menu > Restart failed replicator** to restart the geo-replicator.

## Using Grafana dashboards to monitor geo-replication

Metrics are useful indicators of the health of geo-replication. They can give warnings of potential problems as well as providing data that can be used to alert on outages. Monitor the health of your geo-replicator using the available metrics to ensure replication continues.

Configure your {{site.data.reuse.es_name}} geo-replicator to export metrics, and then view them using the example [Grafana dashboard](http://ibm.biz/es-grafana-dashboards){:target="_blank"}.


### Configuring metrics

Enable export of metrics in {{site.data.reuse.es_name}} geo-replication by editing the associated KafkaMirrorMaker2 custom resource.

#### Using the {{site.data.reuse.openshift_short}} web console

1. Go to where your destination cluster is installed. {{site.data.reuse.openshift_ui_login}}
2. From the navigation menu, click **Operators > Installed Operators**.
3. In the **Projects** dropdown list, select the project that contains the destination {{site.data.reuse.es_name}} instance.
4. Select the {{site.data.reuse.es_name}} operator in the list of installed operators.
5. Click the **Kafka Mirror Maker 2** tab to see the list of KafkaMirrorMaker2 instances.
6. Click the KafkaMirrorMaker2 instance with the name of the instance that you are adding metrics to.
7. Click the **YAML** tab.
8. Add the `spec.metrics` property. For example:

   ```yaml
   # ...
   spec:
   metrics: {}
   # ...
   ```

9. Click **Save**.


#### Using the CLI

To modify the number of geo-replicator workers run the following using the CLI:
1. Go to where your destination cluster is installed. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to select the namespace that contains the existing destination cluster:

   ```shell
   kubectl namespace <namespace-name>
   ```

3. Run the following command to list your `KafkaMirrorMaker2` instances:

   ```shell
   kubectl get kafkamirrormaker2s
   ```

4. Run the following command to edit the custom resource for your `KafkaMirrorMaker2` instance:

   ```shell
   kubectl edit kafkamirrormaker2 <instance-name>
   ```

5. Add the `spec.metrics` property. For example:

   ```yaml
   spec:
     metrics: {}
   ```

6. Save your changes and close the editor.

