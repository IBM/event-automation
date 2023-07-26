---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.ep_name}} installation as follows. The {{site.data.reuse.ep_name}} operator handles the upgrade of your {{site.data.reuse.ep_name}} instances.

**Note:** You will experience some downtime during the {{site.data.reuse.ep_name}} upgrade while the pods for the relevant components are recycled.

## Upgrade path

You can upgrade {{site.data.reuse.ep_name}} and the {{site.data.reuse.flink_long}} to the latest 1.0.x version by using the operator channel v1.0. 

**Note:** If your operator upgrades are set to automatic, minor version upgrades are completed automatically. This means that the {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}} operators will be upgraded to 1.0.x when it is available in the catalog, and your {{site.data.reuse.ep_name}} and Flink instances are then also automatically upgraded.

**Note:** If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying advanced flows in [production environments](../../advanced/deploying-production), the automatic upgrade cannot update the custom Flink image built by extending the IBM-provided Flink image. In this case, after the successful upgrade of the operator, complete steps 1a, 1b, 1e, and 2c in [Build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.


## Prerequisites

- If you installed as part of {{site.data.reuse.cp4i}}, ensure that you have followed the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.2?topic=upgrading){:target="_blank"} before you upgrade {{site.data.reuse.eem_name}}.

- To upgrade without data loss, your {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}} instances must have [persistent storage enabled](../configuring/#enabling-persistent-storage). If you upgrade instances which use ephemeral storage, all data will be lost.

## Upgrading on the {{site.data.reuse.openshift_short}}

Upgrade your {{site.data.reuse.ep_name}} and Flink instances running on the {{site.data.reuse.openshift_short}} by using the CLI or web console as follows.

### Upgrading by using the CLI

If you are using the OpenShift command-line interface (CLI), the `oc` command, complete the steps in the following sections to upgrade your {{site.data.reuse.ep_name}} and Flink installations.

For {{site.data.reuse.ep_name}}:

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.ep_name}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventprocessing -o=jsonpath='{.status.channels[*].name}'
   ```

3. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v1.1`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventprocessing --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```

For Flink:

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.flink_long}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventautomation-flink -o=jsonpath='{.status.channels[*].name}'
   ```

3. If your Flink instance uses persistent storage, [backup the Flink instance](../backup-restore/#backing-up).
4. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v1.1`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventautomation-flink --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```

5. If your Flink instance uses persistent storage, [restore the backed up Flink instance](../backup-restore/#restoring).
6. If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying advanced flows in [production environments](../../advanced/deploying-production), complete steps 1a, 1b, 1e, and 2c in [Build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

All {{site.data.reuse.ep_name}} and Flink pods that need to be updated as part of the upgrade will be rolled.


### Upgrading by using the OpenShift web console

If you are using the {{site.data.reuse.openshift_short}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.ep_name}} installation.

For {{site.data.reuse.ep_name}}:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.ep_name}} instance in the namespace. It is called **{{site.data.reuse.ep_name}}** in the **Name** column. Click the **{{site.data.reuse.ep_name}}** in the row.
5. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.ep_name}} operator.
6. Click the version number in the **Update channel** section (for example, **v1.0**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select the required channel, for example **v1.1**, and click the **Save** button on the **Change Subscription Update Channel** dialog.

All {{site.data.reuse.ep_name}} pods that need to be updated as part of the upgrade will be rolled.

For Flink:

1. {{site.data.reuse.openshift_ui_login}}
2. If your Flink instance uses persistent storage, [backup the Flink instance](../backup-restore/#backing-up).
3. Expand **Operators** in the navigation on the left, and click **Installed Operators**.
4. From the **Project** list, select the namespace (project) the instance is installed in.
5. Locate the operator that manages your Flink instance in the namespace. It is called **{{site.data.reuse.flink_long}}** in the **Name** column. Click the **{{site.data.reuse.flink_long}}** in the row.
6. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.ep_name}} operator.
7. Click the version number in the **Update channel** section (for example, **v1.0**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
8. Select the required channel, for example **v1.1**, and click the **Save** button on the **Change Subscription Update Channel** dialog.
9. If your Flink instance uses persistent storage, [restore the backed up Flink instance](../backup-restore/#restoring).
10. If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying advanced flows in [production environments](../../advanced/deploying-production), complete steps 1a, 1b, 1e, and 2c in [Build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

All Flink pods that need to be updated as part of the upgrade will be rolled.


## Verifying the upgrade

After the upgrade, verify the status of the {{site.data.reuse.ep_name}} and Flink instances, by using the {{site.data.reuse.openshift_short}} [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).
