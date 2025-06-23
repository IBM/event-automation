---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.es_name}} installation as follows. The {{site.data.reuse.es_name}} operator handles the upgrade of your {{site.data.reuse.es_name}} instance.

## Upgrade paths

You can upgrade {{site.data.reuse.es_name}} to the [latest 11.8.x version]({{ 'support/matrix/#event-streams' | relative_url }}) directly from any earlier 11.8.x or any 11.7.x version by using the latest 3.8.x operator. The upgrade procedure depends on whether you are upgrading to a major, minor, or patch level version, and what your catalog source is.

If you are upgrading from {{site.data.reuse.es_name}} version 11.6.x or earlier, you must first [upgrade your installation to 11.7.x]({{ 'es/es_11.7' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade from 11.7.x to 11.8.x.

- On OpenShift, you can upgrade to the latest version by using operator channel v3.8. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on OpenShift](#upgrading-on-the-openshift-container-platform).

  **Note:** If your operator upgrades are set to automatic, patch level upgrades are completed automatically. This means that the {{site.data.reuse.es_name}} operator is upgraded to the latest 3.8.x version when it is available in the catalog, and your {{site.data.reuse.es_name}} instance is then also automatically upgraded, unless you [set a schedule for the upgrade](#scheduling-the-upgrade-of-an-instance) by pausing the reconciliation.

- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), and then upgrade by using the Helm chart. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm).


## Prerequisites

- The images for {{site.data.reuse.es_name}} release 11.8.x are available in the IBM Cloud Container Registry. Ensure you redirect your catalog source to use `icr.io/cpopen` as described in [Implementing ImageContentSourcePolicy to redirect to the IBM Container Registry](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=clusters-migrating-from-docker-container-registry#implementing-imagecontentsourcepolicy-to-redirect-to-the-ibm-container-registry){:target="_blank"}.

- Ensure that you have installed a supported container platform and system. For supported container platform versions and systems, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).

- To upgrade successfully, your {{site.data.reuse.es_name}} instance must include a node pool with the `controller` role and persistent storage enabled. If you upgrade an {{site.data.reuse.es_name}} instance that has a single ZooKeeper node with ephemeral storage, all messages and topics will be lost, and the instance will move to an error state. To avoid this issue, when you upgrade an {{site.data.reuse.es_name}} instance to use KRaft, ensure that your KRaft configuration includes multiple controller nodes (recommended for quorum) configured with persistent storage.

   **Note:** From {{site.data.reuse.es_name}} version 11.8.0 and later, ZooKeeper is no longer supported, and controller node pools are required. During the upgrade, if your {{site.data.reuse.es_name}} instance does not have a defined controller node pool, the upgrade will be blocked. For more information about the migration to KRaft, including important prerequsites, see the [migration overview](#migration-to-kraft-overview).
   
   For example:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: EventStreams
   metadata:
     name: example-pre-upgrade
     namespace: myproject
   spec:
     # ...
     strimziOverrides:
     #...
      kafka:
      #...
      nodePools:
      - name: kafka
         replicas: 3
         storage:
            type: persistent-claim
            #...
         roles:
            - broker
      - name: controller
         replicas: 3
         storage:
            type: persistent-claim
            #...
         roles:
            - controller
   ```

- If you [installed the {{site.data.reuse.es_name}} operator]({{ 'installpagedivert' | relative_url }}) to manage instances of {{site.data.reuse.es_name}} in any namespace (one per namespace), then you might need to control when each of these instances is upgraded to the latest version. You can control the updates by pausing the reconciliation of the instance configuration as described in the following sections.

- If you are running {{site.data.reuse.es_name}} as part of {{site.data.reuse.cp4i}}, ensure you meet the following requirements:

  - Follow the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.2?topic=upgrading){:target="_blank"} before upgrading {{site.data.reuse.es_name}}.
  - If you are planning to configure {{site.data.reuse.es_name}} with Keycloak, ensure you have the {{site.data.reuse.cp4i}} 2023.4.1 (operator version 7.2.0) or later [installed](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.2?topic=installing){:target="_blank"}, including the required dependencies.

- Ensure all applications connecting to your instance of {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.6.2 or later before migrating.

**Note:** There is no downtime during the {{site.data.reuse.es_name}} upgrade. The Kafka pods are rolled one at a time, so a Kafka instance will always be present to serve traffic. However, if the number of brokers you have matches the `min.insync.replicas` value set for any of your topics, then that topic will be unavailable to write to while the Kafka pods are rolling.

### Migration to KRaft overview

This section provides an overview of the migration from ZooKeeper to Kafka Raft metadata (KRaft).

From {{site.data.reuse.es_name}} version 11.8.x and later, all Kafka clusters in {{site.data.reuse.es_name}} must run in KRaft mode. ZooKeeper is no longer supported, removing the dependency on ZooKeeper for metadata management.

To migrate your Kafka cluster to KRaft, a controller node pool is required. The controller node pool is added during the upgrade of your instance. The upgrade process is blocked until you run a [patch command](#initiate-kraft-migration) that copies configuration settings from the existing ZooKeeper specification to a new node pool with a controller role. After the controller node is added, the {{site.data.reuse.es_name}} operator automatically migrates the cluster to KRaft.

**Important:** KRaft migration is irreversible. After migration, you cannot roll back to the ZooKeeper-based cluster.

#### Prerequisites for KRaft migration

For a successful migration to KRaft during the upgrade to {{site.data.reuse.es_name}} 11.8.x, ensure the following:

- You are running {{site.data.reuse.es_name}} version 11.7.0 or later, which includes a node pool with the `broker` role.
- Your cluster has sufficient CPU, memory, and storage to support the temporary increase in workload during migration.

   KRaft controllers run in parallel with existing ZooKeeper nodes, resulting in a temporary increase in resource usage. Ensure that your cluster can temporarily support approximately double the current CPU, memory, and storage used by the ZooKeeper nodes.

   For example, in a cluster with 3 Kafka brokers and 3 ZooKeeper nodes, you might require enough capacity to run 3 controller nodes with similar CPU and memory settings as the ZooKeeper nodes.
   
**Note:** The migration process triggers multiple rolling updates to Kafka brokers and controllers. This can increase the overall migration time and might temporarily reduce cluster capacity.

After the migration to KRaft is complete and ZooKeeper is removed, resource usage will return to the original state, and any temporary increase in resource limits set before the upgrade can be reverted to their previous values.

### Scheduling the upgrade of an instance

In 11.1.x and later, the {{site.data.reuse.es_name}} operator handles the upgrade of your {{site.data.reuse.es_name}} instance automatically after the operator is upgraded. No additional step is required to change the instance (product) version.

If your operator manages more than one instance of {{site.data.reuse.es_name}}, you can control when each instance is upgraded by pausing the reconciliation of the configuration settings for each instance, running the upgrade, and then unpausing the reconciliation when ready to proceed with the upgrade for a selected instance.

#### Pausing reconciliation by using the CLI

  1. {{site.data.reuse.cncf_cli_login}}
  2. To apply the annotation first to the `EventStreams` and then to the `Kafka` custom resource, run the following command, where `<type>` is either `EventStreams` or `Kafka`:

     ```shell
     kubectl annotate <type> <instance-name> -n <instance-namespace> eventstreams.ibm.com/pause-reconciliation='true'
     ```

  3. Follow the steps to [upgrade on OpenShift](#upgrading-on-the-openshift-container-platform).

#### Unpausing reconciliation by using the CLI

To unpause the reconciliation and continue with the upgrade of an {{site.data.reuse.es_name}} instance, run the following command to first remove the annotations from the `Kafka` custom resource, and then from the `EventStreams` custom resource, where `<type>` is either `Kafka` or `EventStreams`:

```shell
kubectl annotate <type> <instance-name> -n <instance-namespace> eventstreams.ibm.com/pause-reconciliation-
```

When the annotations are removed, the configuration of your instance is updated, and the upgrade to the latest version of {{site.data.reuse.es_name}} completes.

#### Pausing reconciliation by using the OpenShift web console

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}

3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.es_name}} instance in the namespace. It is called **{{site.data.reuse.es_name}}** in the **Name** column. Click the **{{site.data.reuse.es_name}}** link in the row.
5. Select the instance you want to pause and click the `YAML` tab.
6. In the `YAML` for the custom resource, add `eventstreams.ibm.com/pause-reconciliation: 'true'` to the `metadata.annotations` field as follows:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: EventStreams
   metadata:
     name: <instance-name>
     namespace: <instance-namespace>
     annotations:
       eventstreams.ibm.com/pause-reconciliation: 'true'
   spec:
     # ...
   ```

7. This annotation also needs to be applied to the corresponding `Kafka` custom resource. Expand **Home** in the navigation on the left, click **API Explorer**, and type `Kafka` in the `Filter by kind...` field. Select `Kafka`.
8. From the **Project** list, select the namespace (project) the instance is installed in and click the **Instances** tab.
9. Select the instance with the name `<instance-name>` (the same as the {{site.data.reuse.es_name}} instance).
10. In the `YAML` for the custom resource, add `eventstreams.ibm.com/pause-reconciliation: 'true'` to the `metadata.annotations` field as follows:

    ```yaml
    apiVersion: eventstreams.ibm.com/v1beta2
    kind: Kafka
    metadata:
    name: <instance-name>
    namespace: <instance-namespace>
    annotations:
       eventstreams.ibm.com/pause-reconciliation: 'true'
    ```

11. Follow the steps to [upgrade on OpenShift](#upgrading-on-the-openshift-container-platform).

#### Unpausing reconciliation by using the OpenShift web console

To unpause the reconciliation and continue with the upgrade of an {{site.data.reuse.es_name}} instance, first remove the annotations from the `Kafka` custom resource, and then from the `EventStreams` custom resource. When the annotations are removed, the configuration of your instance is updated, and the upgrade to the latest version of {{site.data.reuse.es_name}} completes.

## Upgrading on the {{site.data.reuse.openshift_short}}

Upgrade your {{site.data.reuse.es_name}} instance running on the {{site.data.reuse.openshift_short}} by using the CLI or web console as follows.

### Planning your upgrade

Complete the following steps to plan your upgrade on OpenShift.

- Determine which Operator Lifecycle Manager (OLM) channel is used by your existing Subscription. You can check the channel you are subscribed to in the [web console](#upgrading-subscription-ui) (see **Update channel** section), or by using the CLI as follows (this is the [subscription created during installation](../installing/#install-the-event-streams-operator)):
   
   1. Run the following command to check your subscription details:
   
      ```shell
      oc get subscription
      ```
      
   2. Check the `CHANNEL` column for the channel you are subscribed to, for example, v3.7 in the following snippet:
      
      ```
      NAME                        PACKAGE                     SOURCE                      CHANNEL
      ibm-eventstreams            ibm-eventstreams            ibm-eventstreams-catalog    v3.7
      ```

- If your existing Subscription does not use the v3.8 channel, your upgrade is a change in a minor version. Complete the following steps to upgrade:
  1. Ensure the [catalog source for new version is available](#making-new-catalog-source-available).
  2. Change your Subscription to the `v3.8` channel by using [the CLI](#upgrading-subscription-by-using-the-cli) or [the web console](#upgrading-subscription-ui). The channel change will upgrade your operator, and then the operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

- If your existing Subscription is already on the v3.8 channel, your upgrade is a change to the patch level (third digit) only. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed by using the IBM Operator Catalog with the `latest` label, new versions are automatically available. The operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

### Making new catalog source available

Before you can upgrade to the latest version, the catalog source for the new version must be available on your cluster. Whether you have to take action depends on how you set up the [catalog sources](../installing/#creating-the-catalog-sources) for your deployment.

- Latest versions: If your catalog source is the IBM Operator Catalog, latest versions are always available when published, and you do not have to make new catalog sources available.

- Specific versions: If you used the CASE bundle to install catalog source for a specific previous version, you must download and use a new CASE bundle for the version you want to upgrade to.
  - If you previously used the CASE bundle for an online install, [apply the new catalog source](../installing/#add-specific-version-sources-for-production-environments-case) to update the `CatalogSource` to the new version.
  - If you used the CASE bundle for an offline install that uses a private registry, follow the instructions in [installing offline](../offline/#download-the-case-bundle) to remirror images and update the `CatalogSource` for the new version.
 - In both cases, wait for the `status.installedCSV` field in the `Subscription` to update. It eventually reflects the latest version available in the new `CatalogSource` image for the currently selected channel in the `Subscription`:
   - In the {{site.data.reuse.openshift_short}} web console, the current version of the operator is displayed under `Installed Operators`.
   - If you are using the CLI, check the status of the `Subscription` custom resource, the `status.installedCSV` field shows the current operator version.
 

### Upgrading Subscription by using the CLI

If you are using the OpenShift command-line interface (CLI), the `oc` command, complete the steps in the following sections to upgrade your {{site.data.reuse.es_name}} installation.

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.es_name}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventstreams -o=jsonpath='{.status.channels[*].name}'
   ```

2. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v3.7`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventstreams --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```
3. Add a controller node pool by running the [patch command](#initiate-kraft-migration). The upgrade will be blocked until a controller node pool is added.

All {{site.data.reuse.es_name}} pods that need to be updated as part of the upgrade will be gracefully rolled. During the KRaft migration, Kafka controller nodes and Kafka broker nodes will be rolled multiple times as the migration progresses through different [phases](#migration-phases).

### Upgrading Subscription by using the web console {#upgrading-subscription-ui}

If you are using the {{site.data.reuse.openshift_es_name}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.es_name}} installation.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.es_name}} instance in the namespace. It is called **{{site.data.reuse.es_name}}** in the **Name** column. Click the **{{site.data.reuse.es_name}}** link in the row.
4. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.es_name}} operator.
5. Click the version number link in the **Update channel** section (for example, **v3.5**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
6. Select **v3.8** and click the **Save** button on the **Change Subscription Update Channel** dialog.
7. Add a controller node pool by running the [patch command](#initiate-kraft-migration). The upgrade will be blocked until a controller node pool is added.


All {{site.data.reuse.es_name}} pods that need to be updated as part of the upgrade will be gracefully rolled. During the KRaft migration, Kafka controller nodes and Kafka broker nodes will be rolled multiple times as the migration progresses through different [phases](#migration-phases).

**Note:** The number of containers in each Kafka broker will reduce from 2 to 1 as the TLS-sidecar container will be removed from each broker during the upgrade process.

<!--- Alternative steps for PlatformUI to be added. Sounds like CP4I don’t support our latest setting in this release, but might do in the next (or later).-->

## Upgrading on other Kubernetes platforms by using Helm

If you are running {{site.data.reuse.es_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers, you can upgrade {{site.data.reuse.es_name}} by using the Helm chart.

### Planning your upgrade

Complete the following steps to plan your upgrade on other Kubernetes platforms.

- Determine the chart version for your existing deployment:
   
   1. Change to the namespace where your {{site.data.reuse.es_name}} instance is installed:
      
      ```shell
      kubectl config set-context --current --namespace=<namespace>
      ```
   
   2. Run the following command to check what version is installed:
      
      ```shell
      helm list
      ```
      
   3. Check the version installed in the `CHART` column, for example, `<chart-name>-3.7.0` in the following snippet:
      
      ```
      NAME                      NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                            APP VERSION    
      ibm-eventstreams          es         1         2023-11-20 11:49:27.221411789 +0000 UTC deployed ibm-eventstreams-operator-3.7.0  3.7.0
      ```

- Check the latest chart version that you can upgrade to:
   
   1. {{site.data.reuse.cncf_cli_login}}
   2. Add the [IBM Helm repository](https://github.com/IBM/charts/tree/master/repo/ibm-helm){:target="_blank"}:
      
      ```shell
      helm repo add ibm-helm https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
      ```
      
   3. Update the Helm repository:
      
      ```shell
      helm repo update ibm-helm
      ```
      
   4. Check the version of the chart you will be upgrading to is the intended version:
      
      ```shell
      helm show chart ibm-helm/ibm-eventstreams-operator
      ```
      
      Check the `version:` value in the output, for example: `version: 3.8.0`

- If the chart version for your existing deployment is earlier than 3.7.x, you must first [upgrade your installation to 11.7.x]({{ 'es/es_11.7' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade to chart version 3.8.x.

- If your existing installation is in an offline environment, you must carry out the steps in the offline installation instructions to [download the CASE bundle](../offline/#download-the-case-bundle) and [mirror the images](../offline/#mirror-the-images) for the new version you want to upgrade to, before running any `helm` commands.

- Complete the steps in [Helm upgrade](#upgrading-by-using-helm) to update your Custom Resource Definitions (CRDs) and operator charts to the latest version. The operator will then upgrade your {{site.data.reuse.es_name}} instance automatically.

### Upgrading by using Helm

You can upgrade your {{site.data.reuse.es_name}} on other Kubernetes platforms by using Helm.

To upgrade {{site.data.reuse.es_name}} to the latest version, run the following command:

```shell
helm upgrade \
<release-name> ibm-helm/ibm-eventstreams-operator \
-n <namespace> \
--set watchAnyNamespace=<true/false>
--set previousVersion=<previous-version>
```

Where:

- `<release-name>` is the name you provide to identify your operator.
- `<namespace>` is the name of the namespace where you want to install the operator.
- `watchAnyNamespace=<true/false>` determines whether the operator manages instances of {{site.data.reuse.es_name}} in any namespace or only a single namespace (default is `false` if not specified). For more information, see [choosing operator installation mode](../installing-on-kubernetes/#choosing-operator-installation-mode).
- `<previous-version>` is the version of the Helm chart being upgraded from. For example, if your Helm chart version is 3.7.0, set the field as: `--set previousVersion=3.7.0`. You can retrieve the version of your existing Helm chart by running the following command:

  ```shell
  helm list --filter <release-name> -n <namespace> -o json | jq '.[0].app_version'
  ```

**Important:** The upgrade will be blocked if your instance does not include a controller node pool.
Run the [patch command](#initiate-kraft-migration) to add a controller node pool and proceed with the upgrade.

## Post-upgrade tasks

### Initiate KRaft migration

When upgrading to {{site.data.reuse.es_name}} version 11.8.x and later, the upgrade will be blocked if your instance does not include a Kafka node pool with the `controller` role. To proceed, you must define a controller-only node pool.

Run the following command to add a controller node pool by copying configuration properties from the existing ZooKeeper specification. This step initiates the migration to KRaft mode.

```shell
oc patch eventstreams <instance-name> -n <namespace> --type=json -p='[
  {"op": "add", "path": "/spec/strimziOverrides/nodePools/0", "value": {"name": "controller", "roles": ["controller"]}},
  {"op": "copy", "from": "/spec/strimziOverrides/zookeeper/replicas", "path": "/spec/strimziOverrides/nodePools/0/replicas"},
  {"op": "copy", "from": "/spec/strimziOverrides/zookeeper/storage", "path": "/spec/strimziOverrides/nodePools/0/storage"}
]'
```

Additionally, if resource configurations are defined in the custom resource under the ZooKeeper component, they must be moved to the `nodePools` section for the controller node pool. Run the following command to copy the resource configurations to the controller node pool:

```shell
oc patch eventstreams <instance-name> -n <namespace> --type=json -p='[
{"op":"copy","from":"/spec/strimziOverrides/zookeeper/resources","path":"/spec/strimziOverrides/nodePools/0/resources"}]'
```

Where:

- `<instance-name>` is the name of your {{site.data.reuse.es_name}} instance.
- `<namespace>` is the namespace where the instance is installed.

For guidance about setting up Kafka node pools, see [Kafka node pool configuration](../../installing/configuring/#configuring-kafka-node-pools).

#### Migration phases

During KRaft migration, the {{site.data.reuse.es_name}} operator updates the status of the `EventStreams` custom resource to reflect the current state of the migration. The following `kafkaMetadataState` transitions occur during this process:


| Phase               | State Value         | Description  |
|---------------------|---------------------|-------------------------------------------|
| Initial             | `ZooKeeper`         | Initial state where the Kafka cluster uses ZooKeeper for metadata. |
| Migration start     | `KRaftMigration`    | Metadata transfer from ZooKeeper to KRaft begins. The migration can take some time depending on the number of topics and partitions in the cluster. |
| Dual writing        | `KRaftDualWriting`  | Cluster writes metadata to both ZooKeeper and KRaft to ensure consistency. |
| Post-migration      | `KRaftPostMigration`| KRaft mode is enabled for Kafka brokers. Metadata are still being stored in both Kafka and ZooKeeper. |
| ZooKeeper cleanup | `PreKRaft`        | ZooKeeper is no longer used and all ZooKeeper-related resources are deleted.|
| Final               | `KRaft`             | Kafka cluster operates fully in KRaft mode.|


### Enable collection of producer metrics

In {{site.data.reuse.es_name}} version 11.0.0 and later, a Kafka Proxy handles gathering metrics from producing applications. The information is displayed in the [**Producers** dashboard](../../administering/topic-health/). The proxy is optional and is not enabled by default. To enable metrics gathering and have the information displayed in the dashboard, [enable the Kafka Proxy](../../installing/configuring/#enabling-collection-of-producer-metrics).

### Enable metrics for monitoring

To display metrics in the monitoring dashboards of the {{site.data.reuse.es_name}} UI, ensure that you [enable the **Monitoring** dashboard](../post-installation/#enabling-metrics).

### Update SCRAM Kafka User permissions

{{site.data.reuse.es_name}} 11.5.0 and later uses `KafkaTopic` custom resources (CRs) and topic operator for managing topics through {{site.data.reuse.es_name}} UI and CLI. If access to the {{site.data.reuse.es_name}} UI and CLI has been configured with [SCRAM authentication](../../installing/configuring/#configuring-ui-and-cli-security), see the [managing access](../../security/managing-access/#managing-access-to-ui-and-cli-with-scram) to update the `KafkaUser` permissions accordingly. 

### Verifying the upgrade

After the upgrade, verify the status of {{site.data.reuse.es_name}} by using the [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).

