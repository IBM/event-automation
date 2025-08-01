---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.ep_name}} deployment as follows. Review the upgrade procedure and decide the right steps to take for your deployment based on your platform and the version level you are upgrading to.

**Note:** {{site.data.reuse.ep_flink_version_align_note}}

## Upgrade paths

You can upgrade {{site.data.reuse.ep_name}} and the associated {{site.data.reuse.ibm_flink_operator}} to the [latest 1.4.x version]({{ 'support/matrix/#event-processing' | relative_url }}) directly from any earlier 1.4.x or any 1.3.x version by using the latest 1.4.x operators. The upgrade procedure depends on whether you are upgrading to a major, minor, or patch level version, and what your catalog source is.

If you are upgrading from {{site.data.reuse.ep_name}} version 1.2.x or earlier, you must first [upgrade your installation to 1.3.x]({{ 'ep/ep_1.3' | relative_url }}/installing/upgrading/) and then follow these instructions to upgrade to 1.4.x.

- On OpenShift, you can upgrade {{site.data.reuse.ep_name}} and the {{site.data.reuse.ibm_flink_operator}} to the latest 1.4.x version by using the operator channel v1.4. Review the general upgrade [prerequisites](#prerequisites) before following the instructions for [upgrading on OpenShift](#upgrading-on-the-openshift-container-platform).

- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), and then upgrade by using the Helm chart. Review the general upgrade [prerequisites](#prerequisites) before following the instructions for [upgrading on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm).

## Prerequisites

- Ensure you have a supported version of the {{site.data.reuse.openshift_short}} installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

- To upgrade without data loss, your {{site.data.reuse.ep_name}} and Flink instances must have [persistent storage enabled](../configuring/#enabling-persistent-storage). If you upgrade instances which use ephemeral storage, all data will be lost.

- If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying flows in [production environments by using the Apache SQL Runner sample](../../advanced/deploying-production), the automatic upgrade cannot update the custom Flink image built by extending the IBM-provided Flink image. In this case, after the successful upgrade of the operator, complete steps 1 and 2c in [build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

- If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying flows in [production environments](../../advanced/deploying-production), the automatic upgrade cannot update the custom Flink image built by extending the IBM-provided Flink image. In this case, after the successful upgrade of the operator, complete steps 1 and 2c in [build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

**Important:** You will experience some downtime during the {{site.data.reuse.ep_name}} upgrade while the pods for the relevant components are recycled.

## Upgrading on the {{site.data.reuse.openshift_short}}

You can upgrade your {{site.data.reuse.ep_name}} and Flink instances running on the {{site.data.reuse.openshift_short}} by using the CLI or the web console.

### Planning your upgrade

Complete the following steps to plan your upgrade on OpenShift.

- Determine which Operator Lifecycle Manager (OLM) channel is used by your existing Subscription. You can check the channel you are subscribed to in the [web console](#upgrading-subscription-by-using-the-web-console) (see **Update channel** section), or by using the CLI as follows (this is the [subscription created during installation](../installing/#install-the-operators)):
   
   1. Run the following command to check your subscription details:
   
      ```shell
      oc get subscription
      ```
      
   2. Check the `CHANNEL` column for the channel you are subscribed to, for example, v1.3 in the following snippet:
      
      ```shell
      NAME                        PACKAGE                     SOURCE                      CHANNEL
      ibm-eventautomation-flink   ibm-eventautomation-flink   ea-flink-operator-catalog   v1.3
      ibm-eventprocessing         ibm-eventprocessing         ea-sp-operator-catalog      v1.3
      ```

- If your existing Subscription does not use the v1.4 channel, your upgrade is a change in a minor version. Complete the following steps to upgrade:
  1. [Stop your flows](#stopping-flows-for-major-and-minor-upgrades).
  2. [Change the catalog source definition](#making-new-catalog-source-available) to the new version.
  3. Wait for existing operators to upgrade to the latest version on the old channel.
  4. Change your Subscription to the `v1.4` channel by using [the CLI](#upgrading-subscription-by-using-the-cli) or [the web console](#upgrading-subscription-by-using-the-web-console). The channel change will upgrade your {{site.data.reuse.ep_name}} and {{site.data.reuse.ibm_flink_operator}} operators, and your {{site.data.reuse.ep_name}} and Flink instances are then also automatically upgraded.
  5. [Update the license ID](#update-license-ids) in all of your {{site.data.reuse.ep_name}} and Flink custom resources, to allow upgrade to proceed.
  6. [Restart your flows](#restart-your-flows) after the upgrade.
  7. Optional: Implement [secure communications between your Flink components](#securing-communication-with-flink-deployments) after your components are running the new version.

- If your existing Subscription is already on the v1.4 channel, your upgrade is a change to the patch level (third digit) only. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed by using the IBM Operator Catalog with the `latest` label, new versions are automatically available.

  The {{site.data.reuse.ep_name}} and {{site.data.reuse.ibm_flink_operator}} operators will be automatically upgrade to the latest 1.4.x when they are available in the catalog, and your {{site.data.reuse.ep_name}} and Flink instances are then also automatically upgraded.

### Stopping flows for major and minor upgrades

When upgrading to a new major or minor release (first and second digit change), stop any running flows in the {{site.data.reuse.ep_name}} UI before upgrading. This is because running flows may contain artifacts built using the previous release that are not compatible with the newer version. If flows are not stopped, they may enter into an error state following the upgrade. You can run those flows again after the upgrade.

This step is not required for patch level (third digit) upgrades.

To stop all the running flows in the {{site.data.reuse.ep_name}} UI, complete the following steps:

1. [Log in](../../getting-started/logging-in) to your {{site.data.reuse.ep_name}} UI.
2. In the flow that you want to stop, select **View flow**.
3. In the navigation banner, click **Stop flow** to stop the flow.

![Event Processing 1.4.2 icon]({{ 'images' | relative_url }}/1.4.2.svg "In Event Processing 1.4.2 and later.") Exception to the previous statement when upgrading to {{site.data.reuse.ep_name}} 1.4.2: running flows will automatically stop after the upgrade as {{site.data.reuse.ep_name}} 1.4.2 has improved the mechanism for rendering results in the UI. You can [run those flows](#restart-your-flows) again after the upgrade completes.

**Note:** When upgrading to a new major or minor version (such as upgrading from v1.3 to v1.4), ensure you upgrade both the {{site.data.reuse.ep_name}} and the {{site.data.reuse.ibm_flink_operator}} operator, then complete the [post-upgrade tasks](#post-upgrade-tasks), before using your flows again.

### Making new catalog source available

Before you can upgrade to the latest version, the catalog source for the new version must be available on your cluster. Whether you have to take action depends on how you set up [version control](../installing/#decide-version-control-and-catalog-source) for your deployment.

- Latest versions: If your catalog source is the IBM Operator Catalog, then the latest versions are always available when published, and you do not have to make new catalog sources available.

- Specific versions: If you used the CASE bundle to install catalog source for a specific previous version, you must download and use a new CASE bundle for the version you want to upgrade to.
  - If you used the CASE bundle for an online install, [apply the new catalog source](../installing/#adding-specific-versions) to update the `CatalogSource`.
  - If you used the CASE bundle for an offline install that uses a private registry, follow the instructions in [installing offline](../offline/#download-the-case-bundle) to remirror images and update the `CatalogSource`.

  - In both cases, wait for the `status.installedCSV` field in the `Subscription` to update. It eventually reflects the latest version available in the new `CatalogSource` image for the currently selected channel in the `Subscription`:
    - In the {{site.data.reuse.openshift_short}} web console, the current version of the operator is displayed under `Installed Operators`. 
    - If you are using the CLI, check the status of the `Subscription` custom resource, the `status.installedCSV` field shows the current operator version.  



### Upgrading Subscription by using the CLI

If you are using the OpenShift command-line interface (CLI), the `oc` command, complete the steps in the following sections to upgrade your {{site.data.reuse.ep_name}} and Flink installations.

For {{site.data.reuse.ep_name}}:

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.ep_name}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventprocessing -o=jsonpath='{.status.channels[*].name}'
   ```

3. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v1.4`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventprocessing --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```

For Flink:

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.ibm_flink_operator}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventautomation-flink -o=jsonpath='{.status.channels[*].name}'
   ```

3. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v1.4`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventautomation-flink --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```

4. If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying flows in [production environments](../../advanced/deploying-production), complete steps 1 and 2c in [build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

**Note:** If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying jobs in production environments by using the [Apache SQL Runner](../../advanced/deploying-production) or [by using customized jobs](../../advanced/deploying-customized), operator will automatically pause or resume a job by using the snapshot during the upgrade. 

All {{site.data.reuse.ep_name}} and Flink pods that need to be updated as part of the upgrade will be rolled.

### Upgrading Subscription by using the web console

If you are using the {{site.data.reuse.openshift_short}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.ep_name}} installation.

For {{site.data.reuse.ep_name}}:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.ep_name}} instance in the namespace. It is called **{{site.data.reuse.ep_name}}** in the **Name** column. Click the **{{site.data.reuse.ep_name}}** in the row.
5. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.ep_name}} operator.
6. Select the version number in the **Update channel** section (for example, **v1.1**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select the required channel, for example **v1.4**, and click the **Save** button on the **Change Subscription update channel** dialog.

All {{site.data.reuse.ep_name}} pods that need to be updated as part of the upgrade will be rolled.

For Flink:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your Flink instance in the namespace. It is called **{{site.data.reuse.ibm_flink_operator}}** in the **Name** column. Click the **{{site.data.reuse.ibm_flink_operator}}** in the row.
5. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.ep_name}} operator.
6. Select the version number in the **Update channel** section (for example, **v1.1**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select the required channel, for example **v1.4**, and click the **Save** button on the **Change Subscription update channel** dialog.
8. If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying flows in [production environments](../../advanced/deploying-production), complete steps 1 and 2c in [build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

**Note:** If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying jobs in production environments by using the [Apache SQL Runner](../../advanced/deploying-production) or [by using customized jobs](../../advanced/deploying-customized), operator will automatically pause or resume a job by using the snapshot during the upgrade. 

All Flink pods that need to be updated as part of the upgrade will be rolled.

## Upgrading on other Kubernetes platforms by using Helm

If you are running {{site.data.reuse.ep_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers, you can upgrade {{site.data.reuse.ep_name}} by using the Helm chart.

### Planning your upgrade

Complete the following steps to plan your upgrade on other Kubernetes platforms.

- Determine the chart version for your existing deployment:
   
   1. Change to the namespace where your {{site.data.reuse.ep_name}} instance is installed:
      
      ```shell
      kubectl config set-context --current --namespace=<namespace>
      ```
   
   2. Run the following command to check what version is installed:
      
      ```shell
      helm list
      ```
      
   3. Check the version installed in the `CHART` column, for example, `<chart-name>-1.3.2` in the following snippet:
      
      ```
      NAME                      NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                            APP VERSION    
      ibm-eventautomation-flink ep         1         2025-05-20 11:49:52.565373278 +0000 UTC deployed ibm-eventautomation-flink-1.3.2  9963366-651feed
      ibm-eventprocessing       ep         1         2025-05-20 11:49:27.221411789 +0000 UTC deployed ibm-eventprocessing-1.3.2        9963366-651feed

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
      helm show chart ibm-helm/ibm-eventautomation-flink-operator
      ```

      Check the `version:` value in the output, for example: `version: {{site.data.reuse.flink_operator_current_version}}`

- If your existing installation is in an offline environment, you must carry out the steps in the offline installation instructions to [Download the CASE bundle](../offline/#download-the-case-bundle) and [mirror the images](../offline/#mirror-the-images) for the new version you want to upgrade to, before completing the steps below.


- If the chart version for your existing deployment is 1.3.x, your upgrade is a change in a minor version. Complete the following steps to upgrade:
  1. [Stop your flows](#stopping-flows-for-major-and-minor-upgrades) before the upgrade (this is the same process as on the OpenShift platform).
  2. Follow steps in [Upgrading using Helm](#upgrading-by-using-helm) to update your Custom Resource Definitions (CRDs) and operator charts to the latest version. The operators will then upgrade your instances automatically.
  3. [Update the license ID](#update-license-ids) in all of your {{site.data.reuse.ep_name}} and Flink custom resources, to allow upgrade to proceed.
  4. [Restart your flows](#restart-your-flows) after the upgrade.
  5. Optional: Implement [secure communications between your Flink components](#securing-communication-with-flink-deployments) after your components are running the new version.

- If your existing chart version is 1.4.x, your upgrade is a change in the patch level version only, and you only need to follow the steps in [upgrading by using Helm](#upgrading-by-using-helm) to update your Custom Resource Definitions (CRDs) and operator charts to the latest version. The operators will then upgrade your instances automatically.

### Upgrading by using Helm

You can upgrade your {{site.data.reuse.ep_name}} and Flink instances running on other Kubernetes platforms by using Helm.

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are running in the namespace containing the Helm release of the {{site.data.reuse.ibm_flink_operator}} CRDs.
3. Run the following command to upgrade the Helm release that manages your Flink CRDs:


   ```shell
   helm upgrade <flink_crd_release_name> ibm-helm/ibm-eventautomation-flink-operator-crd
   ```

4. Download and unpack the chart archive to your local destination path.

   ```shell
   helm pull ibm-helm/ibm-eventautomation-flink-operator-crd -d <DESTINATION_PATH> --untar
   ```

   Where `<DESTINATION_PATH>` is the local path where you download the chart.

5. In the terminal of your choice, run the following commands. 

   ```shell
   kubectl replace -f <DESTINATION_PATH>/ibm-eventautomation-flink-operator-crd/crds/flinkdeployments.flink.apache.org-v1.yml
   ```

   ```shell
   kubectl replace -f <DESTINATION_PATH>/ibm-eventautomation-flink-operator-crd/crds/flinksessionjobs.flink.apache.org-v1.yml
   ```

   ```shell
   kubectl apply -f <DESTINATION_PATH>/ibm-eventautomation-flink-operator-crd/crds/flinkstatesnapshots.flink.apache.org-v1.yml
   ```

6. Upgrade the Helm release of {{site.data.reuse.ibm_flink_operator}}. Switch to the correct namespace if your CRD Helm release is in a different namespace to your operator and then run:

   ```shell
   helm upgrade <flink_release_name> ibm-helm/ibm-eventautomation-flink-operator <install_flags>
   ```

   Where:

   - `<flink_crd_release_name>` is the Helm release name of the Helm installation that manages the Flink CRDs.
   - `<flink_release_name>` is the Helm release name of the Flink operator.
   - `<install_flags>` are any optional installation property settings such as `--set watchAnyNamespace=true`.

7. Identify the namespace where the {{site.data.reuse.ep_name}} installation is located and the Helm release managing the CRDs by looking at the annotations on the CRDs:

   ```shell
   kubectl get crd eventprocessings.events.ibm.com -o jsonpath='{.metadata.annotations}'
   ```

   The following is an example output showing CRDs managed by Helm release `ep-crds` in namespace `my-ep`:

   ```shell
   {"meta.helm.sh/release-name": "ep-crds", "meta.helm.sh/release-namespace": "ep"}
   ```

8. Ensure you are using the namespace where your {{site.data.reuse.ep_name}} CRD Helm release is located (see previous step):

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

9. Run the following command to upgrade the Helm release that manages your {{site.data.reuse.ep_name}} CRDs:

   ```shell
   helm upgrade <crd_release_name> ibm-helm/ibm-ep-operator-crd
   ```

10. Run the following command to upgrade the Helm release of your operator installation. Switch to the right namespace if your CRD Helm release is in a different namespace to your operator.

    ```shell
    helm upgrade <ep_release_name> ibm-helm/ibm-ep-operator <install_flags>
    ```

Where:

- `<crd_release_name>` is the Helm release name of the Helm installation that manages the {{site.data.reuse.ep_name}} CRDs.
- `<ep_release_name>` is the Helm release name of the {{site.data.reuse.ep_name}} operator.
- `<install_flags>` are any optional installation property settings such as `--set watchAnyNamespace=true`.


**Note:** After you completed the previous steps, you can restore your Flink instances as follows:

- If your Flink instance is a [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} and you disabled the webhook of the Flink operator (`--set webhook.create=false`), you must update the `spec.flinkVersion` and `spec.image` fields of your `FlinkDeployment` custom resource to match the new values of the `IBM_FLINK_IMAGE` and `IBM_FLINK_VERSION` [environment variables](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) on the Flink operator pod.

- If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying flows in [production environments](../../advanced/deploying-production), complete steps 1 and 2c in [build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

- If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying jobs in production environments by using the [Apache SQL Runner](../../advanced/deploying-production) or [by using customized jobs](../../advanced/deploying-customized), operator will automatically pause or resume a job by using the snapshot during the upgrade.

## Post-upgrade tasks

### Verifying the upgrade

After the upgrade, verify the status of the {{site.data.reuse.ep_name}} and Flink instances, by using the [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).

### Update license IDs

After upgrading your operators to {{site.data.reuse.ep_name}} 1.4.x from version 1.3.x, you must update [the license ID]({{ '/support/licensing/#ibm-event-automation-license-information' | relative_url }}) value in the `spec.license.license` field of your custom resources, depending on the program that you purchased.

You can make this change by using the web console or the CLI, and it is required for both OLM and Helm installations.

The components will show errors and will not work with the new version until you update the license ID. After you change the license IDs, check the custom resource status to confirm they are successfully running the new version.

### Restart your flows

This only applies if you stopped flows before upgrade. After the successful upgrade of both the {{site.data.reuse.ep_name}} and the Flink operators, you can restart the flows that you stopped earlier.

1. [Log in](../../getting-started/logging-in) to your {{site.data.reuse.ep_name}} UI.
2. In the flow that you want to run, select **Edit flow**.
3. In the navigation banner, complete one of the following steps:

   - If your flow includes any event sources, expand **Run flow** and select either **Events from now** or **Include historical**.
   - If your flow uses SQL sources only, click **Run flow** to start the flow.