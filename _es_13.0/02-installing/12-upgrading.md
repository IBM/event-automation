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

You can upgrade {{site.data.reuse.es_name}} to the [latest 13.0.x version]({{ 'support/matrix/#event-streams' | relative_url }}) directly from any 12.3.x version by using the latest 13.0.x operator. The upgrade procedure depends on whether you are upgrading to a major, minor, or patch level version, and what your catalog source is.

If you are upgrading from {{site.data.reuse.es_name}} version 12.2.x or earlier, you must first [upgrade your installation to 12.3.x]({{ 'es/es_12.3' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade from 12.3.x to 13.0.x.

- On OpenShift, you can upgrade to the latest version by using operator channel v13.0. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on OpenShift](#upgrading-on-the-openshift).

  **Note:** If your operator upgrades are set to automatic, patch level upgrades are completed automatically. This means that the {{site.data.reuse.es_name}} operator is upgraded to the latest 13.0.x version when it is available in the catalog, and your {{site.data.reuse.es_name}} instance is then also automatically upgraded, unless you [set a schedule for the upgrade](#scheduling-the-upgrade-of-an-instance) by pausing the reconciliation.

- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), and then upgrade by using the Helm chart. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm).

## Prerequisites
{: #prerequisites}

- Ensure you [migrate your CRDs and custom resources to the v1 API](#migrate-to-v1-api) before upgrading to {{site.data.reuse.es_name}} 13.0.0 or later.

- Ensure you are on version 12.3.x before upgrading to {{site.data.reuse.es_name}} 13.0.0 or later.

- The images for {{site.data.reuse.es_name}} release 13.0.x are available in the IBM Cloud Container Registry. Ensure you redirect your catalog source to use `icr.io/cpopen` as described in [Implementing ImageContentSourcePolicy to redirect to the IBM Container Registry](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=clusters-migrating-from-docker-container-registry#implementing-imagecontentsourcepolicy-to-redirect-to-the-ibm-container-registry){:target="_blank"}.

- Ensure that you have installed a supported container platform and system. For supported container platform versions and systems, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}).

-  Ensure persistent storage is enabled for your {{site.data.reuse.es_name}} instance to prevent data loss, and ensure that broker and controller nodes have at least 3 replicas to maintain service availability.

- If you [installed the {{site.data.reuse.es_name}} operator]({{ 'installpagedivert' | relative_url }}) to manage instances of {{site.data.reuse.es_name}} in any namespace (one per namespace), then you might need to control when each of these instances is upgraded to the latest version. You can control the updates by pausing the reconciliation of the instance configuration as described in the following sections.

   **Note:** Some updates, such as changes to Custom Resource Definitions (CRDs), are applied at the cluster level and affect all {{site.data.reuse.es_name}} instances in the cluster.

- If you are running {{site.data.reuse.es_name}} as part of {{site.data.reuse.cp4i}}, ensure you meet the following requirements:

  - Follow the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.2?topic=upgrading){:target="_blank"} before upgrading {{site.data.reuse.es_name}}.
  - If you are planning to configure {{site.data.reuse.es_name}} with Keycloak, ensure you have the {{site.data.reuse.cp4i}} 2023.4.1 (operator version 7.2.0) or later [installed](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.2?topic=installing){:target="_blank"}, including the required dependencies.

- Ensure all applications connecting to your instance of {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.5.0 or later.

   **Important:** Support for Apicurio Registry Core REST API version 2 is deprecated and will be removed in a future release. To ensure continued compatibility, update all Apicurio client libraries to use API version 3. For more information, see [prerequisites](../../installing/prerequisites#schema-requirements).

**Note:** There is no downtime during the {{site.data.reuse.es_name}} upgrade. The Kafka pods are rolled one at a time, so a Kafka instance will always be present to serve traffic. However, if the number of brokers you have matches the `min.insync.replicas` value set for any of your topics, then that topic will be unavailable to write to while the Kafka pods are rolling.

### Migrate to v1 API
{: #migrate-to-v1-api}

**Important:**

- The `v1beta2` API is not supported in {{site.data.reuse.es_name}} 13.0.0 and later. You must migrate your CRDs and custom resources to the `v1` API before upgrading to 13.0.0.

- {{site.data.reuse.es_name}} 13.0.0 removes the `v1beta2` API from the CRDs. This is a cluster-scoped change, so if different versions of {{site.data.reuse.es_name}} operators are installed across multiple namespaces in the same cluster, you must plan to upgrade operators in all namespaces to version 13.0.0 at the same time.

{{site.data.reuse.es_name}} 13.0.0 includes a conversion tool for migrating your custom resources from the `v1beta2` API to the `v1` API, including updates to CRDs. The migration is a multi-step process that updates your resources and CRDs in stages. Most updates are automated, but in some cases, manual updates might be required.

**Note:** The conversion tool prompts you to manually update unsupported fields that cannot be automatically converted. The following table lists the fields that require manual conversion. In some cases, replacing fields such as `oauth` or `keycloak` with `custom` requires additional configuration. For more information, see the [Strimzi documentation](https://strimzi.io/docs/operators/latest/deploying.html#con-oauth-migration-str){:target="_blank"}.

| Resource type | Field location | Unsupported field | Replacement |
|---------------|----------------|------------------|-------------|
| EventStreams | `spec.strimziOverrides.kafka.listeners[].authentication` | `oauth` | `custom` (additional configuration required, [see Strimzi documentation](https://strimzi.io/docs/operators/latest/deploying.html#assembly-oauth-server-config-str){:target="_blank"}) |
| EventStreams | `spec.strimziOverrides.kafka.listeners[].authentication.secrets` | Any secrets | Move to additional volumes in template section |
| EventStreams | `spec.strimziOverrides.kafka.authorization` | `keycloak`, `opa` | `custom` (additional configuration required, [see Strimzi documentation](https://strimzi.io/docs/operators/latest/configuring.html#type-KafkaAuthorizationCustom-reference){:target="_blank"}) |
| KafkaConnect, KafkaBridge | `spec.authentication` | `oauth` | `custom` (additional configuration required, [see Strimzi documentation](https://strimzi.io/docs/operators/latest/deploying.html#con-oauth-client-config-str){:target="_blank"}) |
| KafkaConnect | `spec.externalConfiguration` | Any external configuration | Move to `spec.template` section |
| KafkaMirrorMaker2 | `spec.clusters[].authentication`, `spec.target.authentication`, `spec.mirrors[].source.authentication` | `oauth` | `custom` |

#### Before you begin

Before starting the migration, ensure you have the following:

- Java 21 or later installed on your system.
- `kubectl` configured with access to your Kubernetes cluster.
- Required permissions to list, get, and update custom resources in your cluster.
- Optional: A backup of all your Kafka custom resources.
- Download the [conversion tool](https://ibm.biz/v1-api-migration-tool) as a packaged archive (JAR + launch scripts) from the IBM Digital Hub Enterprise (DHE). After downloading, extract the archive.


**Note:** When running the conversion commands in the following steps, use `v1-api-conversion.sh` if you are on Linux or macOS, or use `v1-api-conversion.cmd` if you are on Windows.


#### Step 1: Identify resources that need migration
{: #identify-resources-for-migration}

List all {{site.data.reuse.es_name}} custom resources across all namespaces in the cluster to identify the resources and namespaces that require migration from `v1beta2` to `v1`:

```shell
bin/v1-api-conversion.sh list-resource --all-namespaces
```

Resources with deprecation warnings require migration. The migration can be performed while {{site.data.reuse.es_name}} 12.3.x is running.

#### Step 2: Remove unsupported fields
{: #removing-deprecated-fields}

Remove [fields]({{ 'es/es_12.3' | relative_url }}/installing/upgrading/#deprecated-fields) that are no longer supported to make your custom resources compatible with the v1 API.

**Note:** In {{site.data.reuse.es_name}} 12.3.x, resources that use deprecated fields are flagged with warnings. You can review each {{site.data.reuse.es_name}} instance for these deprecation warnings to identify the fields that require updates.

Complete one of the following procedures:

- If you manage your custom resources as YAML files, follow the procedure to [remove unsupported fields from YAML files](#convert-yaml-files-step2).
- If your custom resources are already deployed in your cluster, follow the procedure to [remove unsupported fields from deployed custom resources](#convert-in-cluster-step2).

#### Remove unsupported fields from YAML files
{: #convert-yaml-files-step2}

If you manage your {{site.data.reuse.es_name}} custom resources as YAML files (for example, stored locally or in a version control system), remove unsupported fields from the YAML files as follows:

1. Convert your YAML files by running one of the following commands for each YAML file:

   - To save the result to a new YAML file:

     ```shell
     bin/v1-api-conversion.sh convert-file-shape --file <input-file> --output <output-file>
     ```

   - To update the file in place:

     ```shell
     bin/v1-api-conversion.sh convert-file-shape --file <input-file> --in-place
     ```

   Where:
   - `<input-file>` is the path to your existing YAML file.
   - `<output-file>` is the path where you want to save the converted YAML file.

   **Note:** The conversion tool will prompt you to manually update certain fields. See the [unsupported fields table](#migrate-to-v1-api) for the replacement fields.

2. Apply the converted files to your cluster:

   ```shell
   kubectl apply -f <converted-file>
   ```

   Where `<converted-file>` is the path to the converted YAML file.

#### Remove unsupported fields from deployed custom resources
{: #convert-in-cluster-step2}

If your {{site.data.reuse.es_name}} custom resources are already deployed in your cluster, remove unsupported fields from the deployed custom resources by running the following command:

```shell
bin/v1-api-conversion.sh convert-resource-shape --namespace <namespace-name>
```

Repeat this step for each namespace that contains {{site.data.reuse.es_name}} resources until all resources listed in [Step 1](#identify-resources-for-migration) no longer have deprecation warnings.

**Note:** The conversion tool will prompt you to manually update certain fields. See the [unsupported fields table](#migrate-to-v1-api) for replacement fields.

Review the output from the previous command to ensure that all custom resources were converted and that all unsupported fields have been removed. The tool logs any errors encountered during the conversion. Resolve any errors or warnings, then re-run the conversion command to ensure all resources are successfully converted before proceeding to the next step.

**Note:** If you encounter 409 conflict errors when running the conversion commands, retry the command. If the error persists, [pause reconciliation](#pausing-reconciliation-by-using-the-cli) before running the conversion commands, and then [unpause reconciliation](#unpausing-reconciliation-by-using-the-cli) after completing the migration.

#### Step 3: Enable v1 API version
{: #enabling-v1-api-version}

After removing all unsupported fields, run the following command to enable the v1 API version in the CRDs:

```shell
bin/v1-api-conversion.sh enable-v1-api-version
```

**Important:** Both `v1beta2` and `v1` API versions are now enabled. This affects how {{site.data.reuse.es_name}} resources are displayed in the OpenShift web console and other Kubernetes management tools. Tools and scripts must explicitly specify the API version when accessing these resources (for example, `apiVersion: eventstreams.ibm.com/v1`).

#### Step 4: Convert custom resources to v1 API version
{: #converting-resources-to-v1}

Convert your custom resources from v1beta2 to v1 API version. This changes the `apiVersion` field from `eventstreams.ibm.com/v1beta2` to `eventstreams.ibm.com/v1`.

Complete one of the following procedures:

- If you manage your custom resources as YAML files, follow the procedure to [convert YAML files to v1 API version](#convert-yaml-files-step4).
- If your custom resources are already deployed in your cluster, follow the procedure to [convert deployed custom resources to v1](#convert-in-cluster-step4).

#### Convert YAML files to v1 API version
{: #convert-yaml-files-step4}

If you manage your {{site.data.reuse.es_name}} custom resources as YAML files (for example, stored locally or in a version control system), convert the files to use the v1 API version, then apply them to your cluster.

1. Convert your YAML file to v1 API version by running one of the following commands for each YAML file:

   - To save the result to a new file:

      ```shell
      bin/v1-api-conversion.sh convert-file --file <input-file> --output <output-file>
      ```

   - To update the file in place:

      ```shell
      bin/v1-api-conversion.sh convert-file --file <input-file> --in-place
      ```

   Where:
   - `<input-file>` is the path to your existing YAML file.
   - `<output-file>` is the path where you want to save the converted YAML file.

2. Apply the converted files to your cluster:

   ```shell
   kubectl apply -f <converted-file>
   ```

   Where `<converted-file>` is the path to the converted YAML file.

#### Convert deployed custom resources to v1
{: #convert-in-cluster-step4}

If your {{site.data.reuse.es_name}} custom resources are already deployed in your cluster, convert the deployed custom resources to use the v1 API version by running the following command:

```shell
bin/v1-api-conversion.sh convert-resource --namespace <namespace-name>
```

Repeat this step for each namespace that contains {{site.data.reuse.es_name}} resources.

#### Step 5: Update CRDs to use v1 as stored version
{: #updating-crds-to-v1-stored-version}

Update the CRDs to use v1 as the stored version and complete the migration.

**Important:** This step affects all {{site.data.reuse.es_name}} instances across your cluster. All instances will be reconciled by the operator, potentially causing rolling updates.

**Note:** After this step, rollback is not possible without restoring from backups.

1. Run the following command:

   ```shell
   bin/v1-api-conversion.sh crd
   ```

   This command updates the CRDs to set v1 as the stored version, updates all custom resources to be stored as v1, and removes v1beta2 from the list of served versions.

2. Verify that all resources are stored as v1 by running the following command:

   ```shell
   kubectl get crds -o jsonpath='{range .items[?(@.spec.group=="eventstreams.ibm.com")]}{.metadata.name}{"\t"}{.status.storedVersions}{"\n"}{end}'
   ```

   All {{site.data.reuse.es_name}} CRDs must show `v1` as the stored version.
   
   **Note:** The `eventstreamsgeoreplicators.eventstreams.ibm.com` CRD will still show `v1beta1`. This CRD is no longer used in {{site.data.reuse.es_name}} 13.0.0 and later, and can be safely ignored.


### Scheduling the upgrade of an instance
{: #scheduling-the-upgrade-of-an-instance}

The {{site.data.reuse.es_name}} operator handles the upgrade of your {{site.data.reuse.es_name}} instance automatically after the operator is upgraded. No additional step is required to change the instance (product) version.

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
   apiVersion: eventstreams.ibm.com/v1
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
    apiVersion: eventstreams.ibm.com/v1
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

- Ensure you have [migrated your CRDs and custom resources to the v1 API](#migrate-to-v1-api) before upgrading to {{site.data.reuse.es_name}} 13.0.0 or later.

- If your Kafka cluster uses custom listener certificates with SSL private keys, ensure that they are in PKCS#8 format (BEGIN PRIVATE KEY) before upgrading. Private keys in PKCS#1 format (BEGIN RSA PRIVATE KEY) are not compatible with {{site.data.reuse.es_name}} 12.3.0 and later.
  
  Run the following command to convert your private key to PKCS#8 format:
  
  ```shell
  openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in PKCS1.key -out PKCS8.key
  ```
  
  For more information, see [troubleshooting](../../troubleshooting/upgrade-ssl-private-key-format/).

- Determine which Operator Lifecycle Manager (OLM) channel is used by your existing Subscription. You can check the channel you are subscribed to in the [web console](#upgrading-subscription-ui) (see **Update channel** section), or by using the CLI as follows (this is the [subscription created during installation](../installing/#install-the-event-streams-operator)):
   
   1. Run the following command to check your subscription details:
   
      ```shell
      oc get subscription
      ```
      
   2. Check the `CHANNEL` column for the channel you are subscribed to, for example, v12.3 in the following snippet:
      
      ```
      NAME                        PACKAGE                     SOURCE                      CHANNEL
      ibm-eventstreams            ibm-eventstreams            ibm-eventstreams-catalog    v12.3
      ```

- If your existing Subscription does not use the v13.0 channel, your upgrade is a change in a major version. Complete the following steps to upgrade:
  1. Ensure the [catalog source for new version is available](#making-new-catalog-source-available).
  2. Change your Subscription to the `v13.0` channel by using [the CLI](#upgrading-subscription-by-using-the-cli) or [the web console](#upgrading-subscription-ui). The channel change will upgrade your operator, and then the operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

- If your existing Subscription is already on the v13.0 channel, your upgrade is a change to the patch level (third digit) only. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed by using the IBM Operator Catalog with the `latest` label, new versions are automatically available. The operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

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

2. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v13.0`):

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
5. Click the version number link in the **Update channel** section (for example, **v12.3**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
6. Select **v13.0** and click the **Save** button on the **Change Subscription Update Channel** dialog.

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


- Ensure you have [migrated your CRDs and custom resources to the v1 API](#migrate-to-v1-api) before upgrading to {{site.data.reuse.es_name}} 13.0.0 or later.

- Ensure you have Helm version 3.x installed. The upgrade to {{site.data.reuse.es_name}} 13.0.x is not compatible with Helm 4.x. You can check your Helm version by running `helm version`.


- Determine the chart version for your existing deployment:
   
   1. Change to the namespace where your {{site.data.reuse.es_name}} instance is installed:
      
      ```shell
      kubectl config set-context --current --namespace=<namespace>
      ```
   
   2. Run the following command to check what version is installed:
      
      ```shell
      helm list
      ```
      
   3. Check the version installed in the `CHART` column, for example, `<chart-name>-12.3.1` in the following snippet:
      
      ```
      NAME                      NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                            APP VERSION
      ibm-eventstreams          es         1         2026-03-20 11:49:27.221411789 +0000 UTC deployed ibm-eventstreams-operator-12.3.1  12.3.1
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
      
      Check the `version:` value in the output, for example: `version: 13.0.0`

- If the chart version for your existing deployment is earlier than 12.3.x, you must first [upgrade your installation to 12.3.x]({{ 'es/es_12.3' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade to chart version 13.0.x.

- If your existing installation is in an offline environment, you must carry out the steps in the offline installation instructions to [download the CASE bundle](../offline/#download-the-case-bundle) and [mirror the images](../offline/#mirror-the-images) for the new version you want to upgrade to, before running any `helm` commands.

- Complete the steps in [Helm upgrade](#upgrading-by-using-helm) to update your Custom Resource Definitions (CRDs) and operator charts to the latest version. The operator will then upgrade your {{site.data.reuse.es_name}} instance automatically.

**Note:** If you use the Helm diff plugin, you might encounter a failure during the upgrade. For more information, see [troubleshooting](../../troubleshooting/helm-diff-plugin-failure/).

### Upgrading by using Helm
{: #upgrading-by-using-helm}

You can upgrade your {{site.data.reuse.es_name}} on other Kubernetes platforms by using Helm.

Depending on how you installed the operator, select one of the following upgrade approaches:

- If you installed the operator with all required resources together, follow the instructions in [upgrading the operator with cluster-scoped resources](#upgrading-the-operator-with-crds).
- If you installed the cluster-scoped resources and operator separately, follow the instructions in [upgrading the operator and cluster-scoped resources separately](#upgrading-by-using-separate-releases).

#### Upgrading the operator with cluster-scoped resources
{: #upgrading-the-operator-with-crds}

If you [installed the {{site.data.reuse.es_name}} operator and cluster-scoped resources](../installing-on-kubernetes/#installing-the-operator-with-crds) together, upgrade to the latest version by running the following command:

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
- `<previous-version>` is the version of the Helm chart being upgraded from. For example, if your Helm chart version is 12.3.1, set the field as: `--set previousVersion=12.3.1`. You can retrieve the version of your existing Helm chart by running the following command:

  ```shell
  helm list --filter <release-name> -n <namespace> -o json | jq '.[0].app_version'
  ```

Wait for the operator to [reconcile](#upgrade-reconciliation) the {{site.data.reuse.es_name}} instance and roll all the pods.

#### Upgrading the operator and cluster-scoped resources separately
{: #upgrading-by-using-separate-releases}

If you [installed the {{site.data.reuse.es_name}} operator and cluster-scoped resources separately](../installing-on-kubernetes/#installing-by-using-separate-releases), upgrade them in the following order:

1. Upgrade the operator:

   ```shell
   helm upgrade \
   <operator-release-name> ibm-helm/ibm-eventstreams-operator \
   -n <namespace> \
   --set clusterScopedResources=false \
   --set watchAnyNamespace=<true/false> \
   --set previousVersion=<previous-version>
   ```

   Where:
   - `<operator-release-name>` is the name of the Helm release for the operator (for example, `eventstreams`).
   - `<namespace>` is the namespace where the operator is installed.
   - `clusterScopedResources=false` ensures that only namespace-scoped resources are upgraded.
   - `watchAnyNamespace=<true/false>` must match the value used during installation.
   - `<previous-version>` is the version of the Helm chart being upgraded from (for example, `12.3.1`).

   Wait for the operator to [reconcile](#upgrade-reconciliation) the {{site.data.reuse.es_name}} instance and roll all the pods.

   Repeat this step for each namespace that contains an {{site.data.reuse.es_name}} operator.

2. After all {{site.data.reuse.es_name}} operators are upgraded, upgrade the cluster-scoped resources (CRDs and ClusterRoles):

   ```shell
   helm upgrade \
   <crd-release-name> ibm-helm/ibm-eventstreams-operator \
   -n <namespace> \
   --set namespaceScopedResources=false \
   --set watchAnyNamespace=<true/false> \
   --set previousVersion=<previous-version>
   ```

   Where:
   - `<crd-release-name>` is the name of the Helm release for the cluster-scoped resources (for example, `es-crds`).
   - `<namespace>` is the namespace where the cluster-scoped resources were installed.
   - `namespaceScopedResources=false` ensures that only cluster-scoped resources are upgraded.
   - `watchAnyNamespace=<true/false>` must match the value used during installation.
   - `<previous-version>` is the version of the Helm chart being upgraded from (for example, `12.3.1`). 

### Upgrade reconciliation
{: #upgrade-reconciliation}

Wait for the operator to reconcile the {{site.data.reuse.es_name}} instance and roll all the pods.

**Note:** During this reconciliation process, the Kafka controller pod might temporarily enter a `CrashLoopBackOff` state with the following error. This happens because the new operator has updated the ConfigMap, but the pod is still using the previous image. This is expected and resolves automatically within a few minutes after the new image is updated by the operator. No manual intervention is required, and the Kafka cluster remains operational throughout this period.

```
cat: /opt/kafka/custom-config/metadata.state: No such file or directory
```

## Verifying the upgrade
{: #verifying-the-upgrade}

After the upgrade, verify the version and status of {{site.data.reuse.es_name}} by using the [CLI](../post-installation/#check-the-status-of-the-event-streams-instance-through-the-command-line) or the [UI](../post-installation/#check-the-status-of-the-eventstreams-instance-through-the-openshift-web-console).

## Post-upgrade tasks
{: #post-upgrade-tasks}

### Removing the `EventStreamsGeoReplicator` CRD
{: #removing-the-eventstreamsgeoreplicator-crd}

The `EventStreamsGeoReplicator` custom resource is no longer used in {{site.data.reuse.es_name}} 13.0.0 and later. The `eventstreamsgeoreplicators.eventstreams.ibm.com` CRD might still exist after the upgrade and can be safely deleted.

**Note:** Only delete this CRD after all {{site.data.reuse.es_name}} instances in your cluster are upgraded to version 13.0.0 or later.

To remove the CRD, run the following command:

```shell
kubectl delete crd eventstreamsgeoreplicators.eventstreams.ibm.com
```

### Migrate ImageContentSourcePolicy to ImageDigestMirrorSet
{: #migrate-imagecontentsourcepolicy-to-imagedigestmirrorset}

The `ImageContentSourcePolicy` API is deprecated in OpenShift 4.14 and later versions. If you have `ImageContentSourcePolicy` resources configured, you must migrate them to `ImageDigestMirrorSet`.

**Note:** This migration is only required if you are running in an offline environment and have existing `ImageContentSourcePolicy` resources from a previous installation.

Complete the following steps to migrate:

1. {{site.data.reuse.openshift_cli_login}}
2. Get the name of the `ImageContentSourcePolicy` resources on your cluster:

   ```shell
   oc get ImageContentSourcePolicy
   ```

3. For {{site.data.reuse.es_name}}, migrate the `ImageContentSourcePolicy` to `ImageDigestMirrorSet`:

   a. Set an environment variable to the name of the {{site.data.reuse.es_name}} `ImageContentSourcePolicy`. For example, if the policy name is `ibm-eventstreams`:

   ```shell
   export ES_ICSP=ibm-eventstreams
   ```

   b. Save the `ImageContentSourcePolicy` as a YAML file:

   ```shell
   oc get ImageContentSourcePolicy ${ES_ICSP} -o yaml >> ${ES_ICSP}.yaml
   ```

   c. Convert the `ImageContentSourcePolicy` to `ImageDigestMirrorSet`:

   ```shell
   oc create -f $(oc adm migrate icsp ${ES_ICSP}.yaml | cut -f 4 -d ' ')
   ```

   **Note:** This command might trigger node upgrades. Wait for all the nodes to be in `Ready` state before you proceed to the next step.

   d. Delete the `ImageContentSourcePolicy`:

   ```shell
   oc delete ImageContentSourcePolicy ${ES_ICSP}
   ```

   **Note:** This command might trigger node upgrades. Wait for all the nodes to be in `Ready` state before you proceed to the next step.

4. Verify that the `ImageDigestMirrorSet` resources are created:

   ```shell
   oc get imagedigestmirrorset
   ```

   **Important:** After the `ImageDigestMirrorSet` resources are applied, you might see the node status as `Ready`, `Scheduling`, or `Disabled`. Wait until all the nodes show a `Ready` status.

5. Verify your cluster node status and wait for all nodes to be updated before proceeding:

   ```shell
   oc get MachineConfigPool -w
   ```

For more information, see the [OpenShift documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/images/image-configuration-classic#images-configuration-registry-mirror-convert_image-configuration){:target="_blank"}.