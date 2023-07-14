---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.eem_name}} installation as follows. The {{site.data.reuse.eem_name}} operator handles the upgrade of your {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} instances.

**Note:** You will experience some downtime during the {{site.data.reuse.eem_name}} upgrade while the pods for the relevant components are recycled.

## Upgrade path

You will be able to upgrade {{site.data.reuse.eem_name}} to the latest 11.0.x version directly from 11.0.0 version by using operator version v11.0.

**Note:** If your operator upgrades are set to automatic, minor version upgrades are completed automatically. This means that the {{site.data.reuse.eem_name}} operator will be upgraded to 11.0.x when it is available in the catalog, and your {{site.data.reuse.eem_name}} instance is then also automatically upgraded.

## Prerequisites

- If you installed as part of {{site.data.reuse.cp4i}}, ensure that you have followed the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.2?topic=upgrading){:target="_blank"} before you upgrade {{site.data.reuse.eem_name}}.

- To upgrade successfully, your {{site.data.reuse.eem_name}} instance must have persistent storage enabled. If you upgrade an {{site.data.reuse.eem_name}} instance with ephemeral storage, all data will be lost.

## Upgrading on the {{site.data.reuse.openshift_short}}

Upgrade your {{site.data.reuse.eem_name}} instance running on the {{site.data.reuse.openshift_short}} by using the CLI or web console as follows.

### Upgrading by using the CLI

If you are using the OpenShift command-line interface (CLI), the `oc` command, complete the steps in the following sections to upgrade your {{site.data.reuse.eem_name}} installation.

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.eem_name}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventendpointmanagement -o=jsonpath='{.status.channels[*].name}'
   ```

3. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v11.1`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventendpointmanagement --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```


All {{site.data.reuse.eem_name}} pods that need to be updated as part of the upgrade will be rolled.

### Upgrading by using the OpenShift web console

If you are using the {{site.data.reuse.openshift_eem_name}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.eem_name}} installation.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.eem_name}} instance in the namespace. It is called **{{site.data.reuse.eem_name}}** in the **Name** column. Click the **{{site.data.reuse.eem_name}}** link in the row.
5. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.eem_name}} operator.
6. Click the version number link in the **Update channel** section (for example, **v11.0**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select the required channel, for example **v11.1**, and click the **Save** button on the **Change Subscription Update Channel** dialog.

All {{site.data.reuse.eem_name}} pods that need to be updated as part of the upgrade will be rolled.

## Verifying the upgrade

1. Wait for all {{site.data.reuse.eem_name}} pods to reconcile. This is indicated by the `Running` state.
2. {{site.data.reuse.openshift_cli_login}}
3. To retrieve a list of {{site.data.reuse.eem_name}} instances, run the following command:

   ```shell
   oc get eem -n <namespace>
   ```

4. For the instance of {{site.data.reuse.eem_name}} that you upgraded, check that the status returned by the following command is `Running`.

   ```shell
   oc get eem -n <namespace> <name-of-the-eem-instance> -o jsonpath="{.status.phase}"
   ```

5. To check the version of your {{site.data.reuse.eem_name}} instance, run the following command:

   ```shell
   oc get eem -n <namespace> <name-of-the-eem-instance> -o jsonpath="{.status.versions.reconciled}"
   ```
