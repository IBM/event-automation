---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.es_name}} installation as follows. The {{site.data.reuse.es_name}} operator handles the upgrade of your {{site.data.reuse.es_name}} instance.

Before you begin, review the upgrade procedure and determine the appropriate steps for your deployment based on your platform, current version, and target version.

## Upgrade paths
{: #upgrade-paths}

You can upgrade {{site.data.reuse.es_name}} to the [latest 12.2.x version]({{ 'support/matrix/#event-streams' | relative_url }}) directly from any 12.1.x version by using the latest 12.2.x operator. The upgrade procedure depends on whether you are upgrading to a major, minor, or patch level version, and what your catalog source is.

If you are upgrading from {{site.data.reuse.es_name}} version 12.0.x or earlier, you must first [upgrade your installation to 12.1.x]({{ 'es/es_12.1' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade from 12.1.x to 12.2.x.

- On OpenShift, you can upgrade to the latest version by using operator channel v12.2. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on OpenShift](#upgrading-on-the-openshift).

  **Note:** If your operator upgrades are set to automatic, patch level upgrades are completed automatically. This means that the {{site.data.reuse.es_name}} operator is upgraded to the latest 12.2.x version when it is available in the catalog, and your {{site.data.reuse.es_name}} instance is then also automatically upgraded, unless you [set a schedule for the upgrade](#scheduling-the-upgrade-of-an-instance) by pausing the reconciliation.

- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), and then upgrade by using the Helm chart. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm).


## Prerequisites
{: #prerequisites}

- The images for {{site.data.reuse.es_name}} release 12.2.x are available in the IBM Cloud Container Registry. Ensure you redirect your catalog source to use `icr.io/cpopen` as described in [Implementing ImageContentSourcePolicy to redirect to the IBM Container Registry](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=clusters-migrating-from-docker-container-registry#implementing-imagecontentsourcepolicy-to-redirect-to-the-ibm-container-registry){:target="_blank"}.

- Ensure that you have installed a supported container platform and system. For supported container platform versions and systems, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).

- To upgrade successfully, your {{site.data.reuse.es_name}} instance must include a node pool with the `controller` role and persistent storage enabled. A minimum of three controller nodes is recommended to maintain quorum. If your instance is not configured with a controller node pool that uses persistent storage, the upgrade will fail, and data loss might occur.
   
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

- Ensure all applications connecting to your instance of {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.5.0 or later.

   **Important:** Support for Apicurio Registry Core REST API version 2 is deprecated and will be removed in a future release. To ensure continued compatibility, update all Apicurio client libraries to use API version 3. For more information, see [prerequisites](../../installing/prerequisites#schema-requirements).

**Note:** There is no downtime during the {{site.data.reuse.es_name}} upgrade. The Kafka pods are rolled one at a time, so a Kafka instance will always be present to serve traffic. However, if the number of brokers you have matches the `min.insync.replicas` value set for any of your topics, then that topic will be unavailable to write to while the Kafka pods are rolling.

### Scheduling the upgrade of an instance
{: #scheduling-the-upgrade-of-an-instance}

In 11.1.x and later, the {{site.data.reuse.es_name}} operator handles the upgrade of your {{site.data.reuse.es_name}} instance automatically after the operator is upgraded. No additional step is required to change the instance (product) version.

If your operator manages more than one instance of {{site.data.reuse.es_name}}, you can control when each instance is upgraded by pausing the reconciliation of the configuration settings for each instance, running the upgrade, and then unpausing the reconciliation when ready to proceed with the upgrade for a selected instance.

#### Pausing reconciliation by using the CLI
{: #pausing-reconciliation-by-using-the-cli}

  1. {{site.data.reuse.cncf_cli_login}}
  2. To apply the annotation first to the `EventStreams` and then to the `Kafka` custom resource, run the following command, where `<type>` is either `EventStreams` or `Kafka`:

     ```shell
     kubectl annotate <type> <instance-name> -n <instance-namespace> eventstreams.ibm.com/pause-reconciliation='true'
     ```

  3. Follow the steps to [upgrade on OpenShift](#upgrading-on-the-openshift).

#### Unpausing reconciliation by using the CLI
{: #unpausing-reconciliation-by-using-the-cli}

To unpause the reconciliation and continue with the upgrade of an {{site.data.reuse.es_name}} instance, run the following command to first remove the annotations from the `Kafka` custom resource, and then from the `EventStreams` custom resource, where `<type>` is either `Kafka` or `EventStreams`:

```shell
kubectl annotate <type> <instance-name> -n <instance-namespace> eventstreams.ibm.com/pause-reconciliation-
```

When the annotations are removed, the configuration of your instance is updated, and the upgrade to the latest version of {{site.data.reuse.es_name}} completes.

#### Pausing reconciliation by using the OpenShift web console
{: #pausing-reconciliation-by-using-the-openshift-web-console}

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

11. Follow the steps to [upgrade on OpenShift](#upgrading-on-the-openshift).

#### Unpausing reconciliation by using the OpenShift web console
{: #unpausing-reconciliation-by-using-the-openshift-web-console}

To unpause the reconciliation and continue with the upgrade of an {{site.data.reuse.es_name}} instance, first remove the annotations from the `Kafka` custom resource, and then from the `EventStreams` custom resource. When the annotations are removed, the configuration of your instance is updated, and the upgrade to the latest version of {{site.data.reuse.es_name}} completes.


## Upgrading on the {{site.data.reuse.openshift_short}}
{: #upgrading-on-the-openshift}

Upgrade your {{site.data.reuse.es_name}} instance running on the {{site.data.reuse.openshift_short}} by using the CLI or web console as follows.

### Pre-upgrade checks and preparation
{: #pre-upgrade-checks-and-preparation-openshift}

Complete the following steps to plan your upgrade on OpenShift.

- Determine which Operator Lifecycle Manager (OLM) channel is used by your existing Subscription. You can check the channel you are subscribed to in the [web console](#upgrading-subscription-ui) (see **Update channel** section), or by using the CLI as follows (this is the [subscription created during installation](../installing/#install-the-event-streams-operator)):
   
   1. Run the following command to check your subscription details:
   
      ```shell
      oc get subscription
      ```
      
   2. Check the `CHANNEL` column for the channel you are subscribed to, for example, v12.0 in the following snippet:
      
      ```
      NAME                        PACKAGE                     SOURCE                      CHANNEL
      ibm-eventstreams            ibm-eventstreams            ibm-eventstreams-catalog    v12.1
      ```

- If your existing Subscription does not use the v12.2 channel, your upgrade is a change in a major version. Complete the following steps to upgrade:
  1. Ensure the [catalog source for new version is available](#making-new-catalog-source-available).
  2. Change your Subscription to the `v12.1` channel by using [the CLI](#upgrading-subscription-by-using-the-cli) or [the web console](#upgrading-subscription-ui). The channel change will upgrade your operator, and then the operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

- If your existing Subscription is already on the v12.2 channel, your upgrade is a change to the patch level (third digit) only. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed by using the IBM Operator Catalog with the `latest` label, new versions are automatically available. The operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

### Making new catalog source available
{: #making-new-catalog-source-available}

Before you can upgrade to the latest version, the catalog source for the new version must be available on your cluster. Whether you have to take action depends on how you set up the [catalog sources](../installing/#creating-the-catalog-sources) for your deployment.

- Latest versions: If your catalog source is the IBM Operator Catalog, latest versions are always available when published, and you do not have to make new catalog sources available.

- Specific versions: If you used the CASE bundle to install catalog source for a specific previous version, you must download and use a new CASE bundle for the version you want to upgrade to.
  - If you previously used the CASE bundle for an online install, [apply the new catalog source](../installing/#add-specific-version-sources-for-production-environments-case) to update the `CatalogSource` to the new version.
  - If you used the CASE bundle for an offline install that uses a private registry, follow the instructions in [installing offline](../offline/#download-the-case-bundle) to remirror images and update the `CatalogSource` for the new version.
 - In both cases, wait for the `status.installedCSV` field in the `Subscription` to update. It eventually reflects the latest version available in the new `CatalogSource` image for the currently selected channel in the `Subscription`:
   - In the {{site.data.reuse.openshift_short}} web console, the current version of the operator is displayed under `Installed Operators`.
   - If you are using the CLI, check the status of the `Subscription` custom resource, the `status.installedCSV` field shows the current operator version.
 

### Upgrading Subscription by using the CLI
{: #upgrading-subscription-by-using-the-cli}

If you are using the OpenShift command-line interface (CLI), the `oc` command, complete the steps in the following sections to upgrade your {{site.data.reuse.es_name}} installation.

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.es_name}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventstreams -o=jsonpath='{.status.channels[*].name}'
   ```

2. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v12.2`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventstreams --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```

Wait for the operator to reconcile the {{site.data.reuse.es_name}} instance and roll all the pods.

**Note:** During this reconciliation process, the Kafka controller pod might temporarily enter a `CrashLoopBackOff` state with the following error. This happens because the new operator has updated the ConfigMap, but the pod is still using the previous image. This is expected and resolves automatically within a few minutes after the new image is updated by the operator. No manual intervention is required, and the Kafka cluster remains operational throughout this period.

```
cat: /opt/kafka/custom-config/metadata.state: No such file or directory
```

### Upgrading Subscription by using the web console
{: #upgrading-subscription-ui}

If you are using the {{site.data.reuse.openshift_es_name}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.es_name}} installation.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.es_name}} instance in the namespace. It is called **{{site.data.reuse.es_name}}** in the **Name** column. Click the **{{site.data.reuse.es_name}}** link in the row.
4. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.es_name}} operator.
5. Click the version number link in the **Update channel** section (for example, **v12.1**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
6. Select **v12.2** and click the **Save** button on the **Change Subscription Update Channel** dialog.

Wait for the operator to reconcile the {{site.data.reuse.es_name}} instance and roll all the pods.

**Note:** During this reconciliation process, the Kafka controller pod might temporarily enter a `CrashLoopBackOff` state with the following error. This happens because the new operator has updated the ConfigMap, but the pod is still using the previous image. This is expected and resolves automatically within a few minutes after the new image is updated by the operator. No manual intervention is required, and the Kafka cluster remains operational throughout this period.

```
cat: /opt/kafka/custom-config/metadata.state: No such file or directory
```

**Note:** The number of containers in each Kafka broker will reduce from 2 to 1 as the TLS-sidecar container will be removed from each broker during the upgrade process.

<!--- Alternative steps for PlatformUI to be added. Sounds like CP4I don’t support our latest setting in this release, but might do in the next (or later).-->

## Upgrading on other Kubernetes platforms by using Helm
{: #upgrading-on-other-kubernetes-platforms-by-using-helm}

If you are running {{site.data.reuse.es_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers, you can upgrade {{site.data.reuse.es_name}} by using the Helm chart.

### Pre-upgrade checks and preparation on other Kubernetes platforms
{: #pre-upgrade-checks-and-preparation-on-other-kubernetes-platforms}

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
      
   3. Check the version installed in the `CHART` column, for example, `<chart-name>-12.1.0` in the following snippet:
      
      ```
      NAME                      NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                            APP VERSION    
      ibm-eventstreams          es         1         2025-11-30 11:49:27.221411789 +0000 UTC deployed ibm-eventstreams-operator-12.1.0  12.1.0
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
      
      Check the `version:` value in the output, for example: `version: 12.2.0`

- If the chart version for your existing deployment is earlier than 12.1.x, you must first [upgrade your installation to 12.1.x]({{ 'es/es_12.1' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade to chart version 12.2.x.

- If your existing installation is in an offline environment, you must carry out the steps in the offline installation instructions to [download the CASE bundle](../offline/#download-the-case-bundle) and [mirror the images](../offline/#mirror-the-images) for the new version you want to upgrade to, before running any `helm` commands.

- Complete the steps in [Helm upgrade](#upgrading-by-using-helm) to update your Custom Resource Definitions (CRDs) and operator charts to the latest version. The operator will then upgrade your {{site.data.reuse.es_name}} instance automatically.

### Upgrading by using Helm
{: #upgrading-by-using-helm}

You can upgrade your {{site.data.reuse.es_name}} on other Kubernetes platforms by using Helm.

To upgrade {{site.data.reuse.es_name}} to the latest version, run the following command:

```shell
helm upgrade \
<release-name> ibm-helm/ibm-eventstreams-operator \
-n <namespace> \
--set watchAnyNamespace=<true/false> \
--set previousVersion=<previous-version>
```

Where:

- `<release-name>` is the name you provide to identify your operator.
- `<namespace>` is the name of the namespace where you want to install the operator.
- `watchAnyNamespace=<true/false>` determines whether the operator manages instances of {{site.data.reuse.es_name}} in any namespace or only a single namespace (default is `false` if not specified). For more information, see [choosing operator installation mode](../installing-on-kubernetes/#choosing-operator-installation-mode).
- `<previous-version>` is the version of the Helm chart being upgraded from. For example, if your Helm chart version is 12.1.0, set the field as: `--set previousVersion=12.1.0`. You can retrieve the version of your existing Helm chart by running the following command:

  ```shell
  helm list --filter <release-name> -n <namespace> -o json | jq '.[0].app_version'
  ```

Wait for the operator to reconcile the {{site.data.reuse.es_name}} instance and roll all the pods.

**Note:** During this reconciliation process, the Kafka controller pod might temporarily enter a `CrashLoopBackOff` state with the following error. This happens because the new operator has updated the ConfigMap, but the pod is still using the previous image. This is expected and resolves automatically within a few minutes after the new image is updated by the operator. No manual intervention is required, and the Kafka cluster remains operational throughout this period.

```
cat: /opt/kafka/custom-config/metadata.state: No such file or directory
```

## Verifying the upgrade
{: #verifying-the-upgrade}

After the upgrade, verify the version and status of {{site.data.reuse.es_name}} by using the [CLI](../post-installation/#check-the-status-of-the-event-streams-instance-through-the-command-line) or the [UI](../post-installation/#check-the-status-of-the-eventstreams-instance-through-the-openshift-web-console).


## Post-upgrade task
{: #post-upgrade-task}

### Remove the Kafka Proxy
{: #remove-kafka-proxy}

In {{site.data.reuse.es_name}} 12.2.0 and later, the Kafka Proxy is deprecated. Your applications can continue to use Kafka Proxy services to access Kafka. Consider updating your applications to use the default Kafka services and then remove the Kafka Proxy services as follows.

To remove the Kafka Proxy, delete the `spec.kafkaProxy: {}` property from your `EventStreams` custom resource:


**Note:** When removing the Kafka Proxy, ensure that your producers and consumers do not depend on a Kafka Proxy and are connected directly to Kafka brokers.


```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  kafkaProxy: {} # Delete this line
# ...
```

