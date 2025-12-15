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

{{site.data.reuse.es_name}} 12.1.0 includes Apicurio Registry server 3.1.x. The Apicurio Registry server is automatically migrated to 3.1.x as part of the {{site.data.reuse.es_name}} 12.1.0 upgrade.

**Important:** 

- Ensure that client applications use version 2 or later of the Apicurio Registry Core REST API and client libraries before starting the upgrade. Apicurio Registry server 3.1.x does not support version 1 APIs.

- After migration, client applications can continue to use version 2 APIs and libraries. However, version 2 APIs are deprecated. To use the new features, [update the client applications](#update-apicurio-client-applications-to-version-3) to use version 3 APIs and libraries.

- During the upgrade, the {{site.data.reuse.es_name}} schema registry is set to **read-only** mode. Client applications that perform write operations, such as adding or updating schemas, will be unable to make changes during this time. Applications that only read schema information will continue to function normally.

Apicurio Registry server 3.1.x. introduces new features and breaking changes that can impact applications using the schema registry in {{site.data.reuse.es_name}}. Review the following changes to understand the impact on your applications:

- New v3 REST API: Apicurio Registry server 3.1.x. introduces a new Core REST API with additional capabilities such as empty artifacts, artifact branching, group-level rules, and enhanced search. For more information about the version 3 REST API, see the [Apicurio REST API documentation](https://www.apicur.io/registry/docs/apicurio-registry/3.1.x/assets-attachments/registry-rest-api.htm){:target="_blank"}.

- Refactored `serdes` libraries: The Kafka serializer and deserializer (`serdes`) libraries have been renamed and refactored in Apicurio Registry server 3.1.x. If your Java producer or consumer applications use `serdes`, you must update your dependencies to the new artifact names and review configuration properties for compatibility.

For detailed client migration guidance and configuration examples, see the [Apicurio Registry migration documentation](https://www.apicur.io/registry/docs/apicurio-registry/3.1.x/getting-started/assembly-migrating-registry-v2-v3.html){:target="_blank"}.

### Upgrade paths
{: #upgrade-paths}

You can upgrade {{site.data.reuse.es_name}} to the [latest 12.1.x version]({{ 'support/matrix/#event-streams' | relative_url }}) directly from any 12.0.x version by using the latest 12.1.x operator. The upgrade procedure depends on whether you are upgrading to a major, minor, or patch level version, and what your catalog source is.

If you are upgrading from {{site.data.reuse.es_name}} version 11.8.x or earlier, you must first [upgrade your installation to 12.0.x]({{ 'es/es_12.0' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade from 12.0.x to 12.1.x.

- On OpenShift, you can upgrade to the latest version by using operator channel v12.1. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on OpenShift](#upgrading-on-the-openshift).

  **Note:** If your operator upgrades are set to automatic, patch level upgrades are completed automatically. This means that the {{site.data.reuse.es_name}} operator is upgraded to the latest 12.1.x version when it is available in the catalog, and your {{site.data.reuse.es_name}} instance is then also automatically upgraded, unless you [set a schedule for the upgrade](#scheduling-the-upgrade-of-an-instance) by pausing the reconciliation.

- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), and then upgrade by using the Helm chart. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm).


### Prerequisites
{: #prerequisites}

- The images for {{site.data.reuse.es_name}} release 12.1.x are available in the IBM Cloud Container Registry. Ensure you redirect your catalog source to use `icr.io/cpopen` as described in [Implementing ImageContentSourcePolicy to redirect to the IBM Container Registry](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=clusters-migrating-from-docker-container-registry#implementing-imagecontentsourcepolicy-to-redirect-to-the-ibm-container-registry){:target="_blank"}.

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
      ibm-eventstreams            ibm-eventstreams            ibm-eventstreams-catalog    v12.0
      ```

- If your existing Subscription does not use the v12.1 channel, your upgrade is a change in a major version. Complete the following steps to upgrade:
  1. Ensure the [catalog source for new version is available](#making-new-catalog-source-available).
  2. Change your Subscription to the `v12.1` channel by using [the CLI](#upgrading-subscription-by-using-the-cli) or [the web console](#upgrading-subscription-ui). The channel change will upgrade your operator, and then the operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

- If your existing Subscription is already on the v12.1 channel, your upgrade is a change to the patch level (third digit) only. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed by using the IBM Operator Catalog with the `latest` label, new versions are automatically available. The operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

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

2. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v12.1`):

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
5. Click the version number link in the **Update channel** section (for example, **v12.0**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
6. Select **v12.1** and click the **Save** button on the **Change Subscription Update Channel** dialog.

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
      
   3. Check the version installed in the `CHART` column, for example, `<chart-name>-12.0.2` in the following snippet:
      
      ```
      NAME                      NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                            APP VERSION    
      ibm-eventstreams          es         1         2025-09-30 11:49:27.221411789 +0000 UTC deployed ibm-eventstreams-operator-12.0.2  12.0.2
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
      
      Check the `version:` value in the output, for example: `version: 12.1.0`

- If the chart version for your existing deployment is earlier than 12.0.x, you must first [upgrade your installation to 12.0.x]({{ 'es/es_12.0' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade to chart version 12.1.x.

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
- `<previous-version>` is the version of the Helm chart being upgraded from. For example, if your Helm chart version is 12.0.2, set the field as: `--set previousVersion=12.0.2`. You can retrieve the version of your existing Helm chart by running the following command:

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

To verify that the {{site.data.reuse.es_name}} upgrade migrated the Apicurio Registry server to 3.1.x:

- Ensure that your {{site.data.reuse.es_name}} instance status is **Ready**. You can [check the status through the CLI](../post-installation/#check-the-status-of-the-event-streams-instance-through-the-command-line) by running the following command:

   ```bash
   kubectl get eventstreams
   ```
- In the {{site.data.reuse.es_name}} UI, go to **Schema registry** and verify that your schemas are visible and accessible.


## Post-upgrade tasks
{: #post-upgrade-tasks}

### Optional: Update Apicurio client applications to version 3
{: #update-apicurio-client-applications-to-version-3}

After upgrading, you can update your client applications that use the Apicurio Registry to use the version 3 API.

Update your applications as follows:

1. If your application uses the Kafka `serdes` libraries, update the Maven dependencies in your applications `pom.xml` file to use the renamed Kafka `serdes` artifacts introduced in version 3.x. For example:

     ```xml
     <dependency>
        <groupId>io.apicurio</groupId>
        <artifactId>apicurio-registry-avro-serde-kafka</artifactId>
        <version>3.1.2</version>
     </dependency>
     <dependency>
        <groupId>io.apicurio</groupId>
        <artifactId>apicurio-registry-jsonschema-serde-kafka</artifactId>
        <version>3.1.2</version>
     </dependency>
     <dependency>
        <groupId>io.apicurio</groupId>
        <artifactId>apicurio-registry-protobuf-serde-kafka</artifactId>
        <version>3.1.2</version>
     </dependency>
     ```

   For more information about the renamed and refactored `serdes` libraries in version 3.x, see the [post about evolving serialization and deserialization](https://www.apicur.io/blog/2025/04/03/evolving-serialization){:target="_blank"}.
2. Change the registry URL configuration in your application to point to the v3 API path. For example:

   ```java
   props.putIfAbsent(SerdeConfig.REGISTRY_URL, "<Schema-registry-url>/apis/registry/v3");
   ```
3. Update the import statement for the `SerdeConfig` class to use the new package location of the class. For example:

   |Existing package or class | New package or class |
   |---------------------|-------------------|
   |`io.apicurio.registry.serde.SerdeConfig` |`io.apicurio.registry.serde.config.SerdeConfig` |

4. Configure SSL truststore certificates in your application for secure connections to the registry by using the following Java system properties:

   ```java
   System.setProperty("javax.net.ssl.trustStore", TRUSTSTORE_LOCATION);
   System.setProperty("javax.net.ssl.trustStorePassword", TRUSTSTORE_PASSWORD);
   System.setProperty("javax.net.ssl.trustStoreType", "PKCS12");
   ```
   For additional property configuration changes, see [setting Java applications to use schemas](../../schemas/setting-java-apps/).

For more information about migrating client applications from version 2 to version 3, see the [Apicurio documentation](https://www.apicur.io/registry/docs/apicurio-registry/3.1.x/getting-started/assembly-migrating-registry-v2-v3.html#migrating-registry-applications_registry){:target="_blank"}.

### Optional: Remove existing schema topic
{: #remove-existing-schema-topic}

After the migration to Apicurio Registry server 3.x, the Kafka cluster contains:
- An existing topic that stores schema data from Apicurio Registry server 2.x.
- New schema topics created for Apicurio Registry server 3.x.

The existing 2.x schema topic is not removed automatically during the upgrade. After [verifying the migration is complete](#verifying-the-upgrade), you can remove the topic by using the {{site.data.reuse.es_name}} CLI:

1. Initialize the {{site.data.reuse.es_name}} CLI by following the instructions in [logging in](../../getting-started/logging-in/#logging-in-to-event-streams-cli).
2. Run the following command to delete the existing 2.x schema topic:

   ```bash
   kubectl es topic-delete --name eventstreams-apicurio-registry-kafkasql-topic
   ```
