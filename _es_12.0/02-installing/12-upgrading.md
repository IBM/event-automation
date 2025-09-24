---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.es_name}} installation as follows. The {{site.data.reuse.es_name}} operator handles the upgrade of your {{site.data.reuse.es_name}} instance.

Before you begin, review the upgrade procedure and determine the appropriate steps for your deployment based on your platform, current version, and target version.

## Planning your upgrade
{: #planning-your-upgrade}

{{site.data.reuse.es_name}} 12.0.0 includes Kafka 4.0.0.

**Important:** Kafka 4.0.0 introduces several significant improvements and includes updates to the Kafka APIs that might require changes to existing Kafka client, streaming, and Connect applications. Before upgrading, review the [notable changes in Kafka 4.0.0](https://kafka.apache.org/40/documentation/#upgrade_servers_400_notable){:target="_blank"} carefully.

Before upgrading, you must review the following breaking changes to ensure that your applications are compatible:

- **Deprecated API versions removed:** Kafka 4.0.0 removes several deprecated protocol API versions. Applications still using these deprecated APIs might fail to connect or operate correctly after the upgrade. Before upgrading, [check whether any client applications are using deprecated Kafka APIs](#checking-for-deprecated-kafka-apis) to ensure your applications use only the APIs supported by Kafka 4.0.0 brokers.

- **Java and Kafka client compatibility:** Kafka 4.0.0 removes support for earlier Java versions and Kafka client versions. For more information, see the [prerequisites](../prerequisites/#kafka-clients).

- **Kafka Connect compatibility:** Kafka 4.0.0 removes several deprecated Kafka Connect APIs. Before upgrading, ensure that all Kafka Connect plugins, including connectors, converters, and transformations, are compatible with Kafka Connect 4.0.0.

   **Note:** 
   - IBM MQ source connector v2.5.0 and earlier are not compatible with Kafka Connect 4.0.0. Versions v2.6.0 and later are compatible.
   - IBM Connectivity Pack connectors v2.0.0 and earlier are not compatible with Kafka Connect 4.0.0. Versions v3.0.0 and later are compatible.

  Kafka Connect plugins that include JAR files from Kafka Connect 3.x are incompatible with Kafka Connect 4.0.0. For example, Apicurio-based Avro converters that include Kafka 3.x JAR files do not load successfully in Kafka Connect 4.0.0 runtime. For more information about resolving such issues, see the [Kafka Connect troubleshooting guidance](../../troubleshooting/kafka-connect-kafka4-compatibility/).

- **Log4j v1 configuration not supported:** Kafka 4.0.0 requires Log4j 2.x configuration for Kafka logging. If you are using custom Log4j v1 configuration for Kafka, you must migrate them to the Log4j 2 format. For more information, see [configuring Kafka logging](../configuring/#configuring-kafka-logging).

### Checking for deprecated Kafka APIs
{: #checking-for-deprecated-kafka-apis}

Before upgrading, identify any applications using deprecated Kafka APIs and update them by completing the following steps:

1. Edit your `EventStreams` custom resource to enable JMX access on the Kafka brokers. Add the following to the `spec.strimziOverrides.kafka` section:

    ```yaml
    spec:
      strimziOverrides:
        kafka:
          jmxOptions:
            authentication:
              type: "password"
    ```

    This enables secure JMX access. The operator manages the JMX port and creates a Kubernetes secret with a JMX username and password. The update triggers a rolling update of the Kafka pods to apply the JMX configuration. Wait until all pods are ready.

2. Retrieve the username and password for JMX access by running the following commands:

    ```bash
    JMX_USERNAME=$(kubectl get secret <es-instance-name>-kafka-jmx -n <your-namespace> -o jsonpath='{.data.jmx-username}' | base64 --decode)
    JMX_PASSWORD=$(kubectl get secret <es-instance-name>-kafka-jmx -n <your-namespace> -o jsonpath='{.data.jmx-password}' | base64 --decode)

    echo "JMX Username: $JMX_USERNAME"
    echo "JMX Password: $JMX_PASSWORD"
    ```

    Where `<es-instance-name>` is the name of the {{site.data.reuse.es_name}} instance.

3. Run your client applications so that any deprecated APIs in use generate activity.

4. Run the preinstalled `kafka-jmx.sh` script on each Kafka broker pod.

    ```bash
    kubectl exec <es-instance-name>-<node-pool-name>-<node-id> -n <your-namespace> -- \
      /opt/kafka/bin/kafka-jmx.sh \
      --jmx-auth-prop "$JMX_USERNAME=$JMX_PASSWORD" \
      --jmx-url service:jmx:rmi:///jndi/rmi://:9999/jmxrmi \
      --object-name 'kafka.network:type=RequestMetrics,name=DeprecatedRequestsPerSec,request=*,version=*,clientSoftwareName=*,clientSoftwareVersion=*' \
      --attributes Count \
      --one-time
    ```

    Where:
    - `<es-instance-name>-<node-pool-name>-<node-id>` is the name of a Kafka broker pod, for example, `dev-scram-kafka-0`.
    - `<your-namespace>` is the namespace where your Kafka instance is running.
    - `JMX_USERNAME` and `JMX_PASSWORD` are the JMX credentials obtained in step 2.

    **Note:** The output includes a count for each deprecated request type and version along with the client name and version. Use this information to identify which client applications are using deprecated APIs and need to be updated.
    
    If the output includes `value = <number greater than 0>`, it confirms that deprecated APIs are being used by client applications. The number indicates how many such requests occurred after the Kafka broker pod last started.

    If the output displays `No matched attributes for the queried objects [...]` or `value = 0`, it indicates that no deprecated requests were made after the Kafka broker pod was last restarted, indicating that your client applications are using supported APIs.

5. If deprecated APIs are detected:

   1. Update the client application to only use client libraries and APIs supported by Kafka 4.x or later. After updating, verify that the client applications start and operate correctly.

   1. Add the following annotation to the `StrimziPodSet` resource to reset the `DeprecatedRequestsPerSec` metric. This initiates a rolling restart of the Kafka broker pods.

      ```yaml
      kubectl annotate strimzipodset <cluster_name>-<nodepool-name> eventstreams.ibm.com/manual-rolling-update="true"
      ```
      Where `<cluster_name>` is the Kafka cluster name of your {{site.data.reuse.es_name}} instance.

      Wait for the {{site.data.reuse.es_name}} operator to detect the change and perform a rolling update of all Kafka broker pods.

   1. Repeat steps 3 to 5 on each Kafka broker pod until no deprecated APIs are in use.

### Upgrade paths
{: #upgrade-paths}

You can upgrade {{site.data.reuse.es_name}} to the [latest 12.0.x version]({{ 'support/matrix/#event-streams' | relative_url }}) directly from any earlier 12.0.x or any 11.8.x version by using the latest 12.0.x operator. The upgrade procedure depends on whether you are upgrading to a major, minor, or patch level version, and what your catalog source is.

If you are upgrading from {{site.data.reuse.es_name}} version 11.7.x or earlier, you must first [upgrade your installation to 11.8.x]({{ 'es/es_11.8' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade from 11.8.x to 12.0.x.

- On OpenShift, you can upgrade to the latest version by using operator channel v12.0. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on OpenShift](#upgrading-on-the-openshift).

  **Note:** If your operator upgrades are set to automatic, patch level upgrades are completed automatically. This means that the {{site.data.reuse.es_name}} operator is upgraded to the latest 12.0.x version when it is available in the catalog, and your {{site.data.reuse.es_name}} instance is then also automatically upgraded, unless you [set a schedule for the upgrade](#scheduling-the-upgrade-of-an-instance) by pausing the reconciliation.

- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), and then upgrade by using the Helm chart. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm).


### Prerequisites
{: #prerequisites}

- The images for {{site.data.reuse.es_name}} release 12.0.x are available in the IBM Cloud Container Registry. Ensure you redirect your catalog source to use `icr.io/cpopen` as described in [Implementing ImageContentSourcePolicy to redirect to the IBM Container Registry](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=clusters-migrating-from-docker-container-registry#implementing-imagecontentsourcepolicy-to-redirect-to-the-ibm-container-registry){:target="_blank"}.

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

- Ensure all applications connecting to your instance of {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.5.0 or later before migrating.

   **Important:** Support for Apicurio Registry Core REST API version 1 is deprecated and will be removed in a future release. To ensure continued compatibility, it is recommended to update all Apicurio client libraries to use API version 2. For more information, see [what's new](../../about/whats-new/#deprecation-of-support-for-apicurio-registry-core-rest-api-version-1).

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

## Preparing the operator for upgrade
{: #preparing-the-operator-for-upgrade}

Before upgrading the operator, set the following field in the `EventStreams` custom resource:

```yaml
spec:
  strimziOverrides:
    kafka:
      metadataVersion: 3.9-IV0
```
Wait for the operator to reconcile the change and update the status of the Kafka custom resource to reflect the metadata version in the `status.kafkaMetadataVersion` field.

## Upgrading on the {{site.data.reuse.openshift_short}}
{: #upgrading-on-the-openshift}

Upgrade your {{site.data.reuse.es_name}} instance running on the {{site.data.reuse.openshift_short}} by using the CLI or web console as follows.

### Pre-upgrade checks and preparation
{: #pre-upgrade-checks-and-preparation-openshift}

Complete the following steps to plan your upgrade on OpenShift.

- Ensure the [Kafka metadata version](#preparing-the-operator-for-upgrade) is updated.

- Determine which Operator Lifecycle Manager (OLM) channel is used by your existing Subscription. You can check the channel you are subscribed to in the [web console](#upgrading-subscription-ui) (see **Update channel** section), or by using the CLI as follows (this is the [subscription created during installation](../installing/#install-the-event-streams-operator)):
   
   1. Run the following command to check your subscription details:
   
      ```shell
      oc get subscription
      ```
      
   2. Check the `CHANNEL` column for the channel you are subscribed to, for example, v3.8 in the following snippet:
      
      ```
      NAME                        PACKAGE                     SOURCE                      CHANNEL
      ibm-eventstreams            ibm-eventstreams            ibm-eventstreams-catalog    v3.8
      ```

- If your existing Subscription does not use the v12.0 channel, your upgrade is a change in a major version. Complete the following steps to upgrade:
  1. Ensure the [catalog source for new version is available](#making-new-catalog-source-available).
  2. Change your Subscription to the `v12.0` channel by using [the CLI](#upgrading-subscription-by-using-the-cli) or [the web console](#upgrading-subscription-ui). The channel change will upgrade your operator, and then the operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

- If your existing Subscription is already on the v12.0 channel, your upgrade is a change to the patch level (third digit) only. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed by using the IBM Operator Catalog with the `latest` label, new versions are automatically available. The operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

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

2. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v3.8`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventstreams --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```

Wait for the operator to reconcile the {{site.data.reuse.es_name}} instance and roll all the pods.

**Note:** During this reconciliation process, the Kafka controller pod might temporarily enter a `CrashLoopBackOff` state with the following error. This happens because the new operator has updated the ConfigMap, but the pod is still using the previous image. This is expected and resolves automatically within a few minutes after the new image is updated by the operator. No manual intervention is required, and the Kafka cluster remains operational throughout this period.

```
cat: /opt/kafka/custom-config/metadata.state: No such file or directory
```

### Upgrading Subscription by using the web console
{: #upgrading-subscription-by-using-the-web-console}

If you are using the {{site.data.reuse.openshift_es_name}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.es_name}} installation.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.es_name}} instance in the namespace. It is called **{{site.data.reuse.es_name}}** in the **Name** column. Click the **{{site.data.reuse.es_name}}** link in the row.
4. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.es_name}} operator.
5. Click the version number link in the **Update channel** section (for example, **v3.8**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
6. Select **v12.0** and click the **Save** button on the **Change Subscription Update Channel** dialog.

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

- Ensure the [Kafka metadata version](#preparing-the-operator-for-upgrade) is updated.

- Determine the chart version for your existing deployment:
   
   1. Change to the namespace where your {{site.data.reuse.es_name}} instance is installed:
      
      ```shell
      kubectl config set-context --current --namespace=<namespace>
      ```
   
   2. Run the following command to check what version is installed:
      
      ```shell
      helm list
      ```
      
   3. Check the version installed in the `CHART` column, for example, `<chart-name>-3.8.1` in the following snippet:
      
      ```
      NAME                      NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                            APP VERSION    
      ibm-eventstreams          es         1         2023-11-20 11:49:27.221411789 +0000 UTC deployed ibm-eventstreams-operator-3.8.1  3.8.1
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
      
      Check the `version:` value in the output, for example: `version: 12.0.0`

- If the chart version for your existing deployment is earlier than 3.8.x, you must first [upgrade your installation to 11.8.x]({{ 'es/es_11.8' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade to chart version 12.0.x.

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
- `<previous-version>` is the version of the Helm chart being upgraded from. For example, if your Helm chart version is 3.8.0, set the field as: `--set previousVersion=3.8.0`. You can retrieve the version of your existing Helm chart by running the following command:

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

After the upgrade, verify the version and status of {{site.data.reuse.es_name}} by using the [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).

Ensure that all Kafka clients, streaming, and Connect applications are running without errors. If any errors are detected, do not proceed with the post-upgrade tasks.

## Post-upgrade task
{: #post-upgrade-tasks}

### Update Kafka metadata version
{: #update-kafka-metadata-version}

Ensure that the upgrade has completed successfully, and you have [verified your applications (Kafka Clients, Kafka Streams, and Kafka Connect)](#verifying-the-upgrade) are running without errors.

To complete the Kafka upgrade, remove the `spec.strimziOverrides.kafka.metdataVersion: 3.9-IV0` from your `EventStreams` custom resource that you modified [earlier](#pre-upgrade-tasks).

Wait for the operator to reconcile the change and update the `status.kafkaMetadataVersion` field in the `EventStreams` custom resource to `4.0-IV3`.