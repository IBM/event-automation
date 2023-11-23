---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.eem_name}} installation as follows. The {{site.data.reuse.eem_name}} operator handles the upgrade of your {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} instances.

**Note:** You will experience some downtime during the {{site.data.reuse.eem_name}} upgrade while the pods for the relevant components are recycled.

## Upgrading on the {{site.data.reuse.openshift_short}}

You can upgrade {{site.data.reuse.eem_name}} to the latest 11.0.x version directly from any earlier 11.0.x version by using operator version v11.0.

**Note:** If your operator upgrades are set to automatic, minor version upgrades are completed automatically. This means that the {{site.data.reuse.eem_name}} operator will be upgraded to 11.0.x when it is available in the catalog, and your {{site.data.reuse.eem_name}} instance is then also automatically upgraded.

### Prerequisites

- If you installed as part of {{site.data.reuse.cp4i}}, ensure that you have followed the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.2?topic=upgrading){:target="_blank"} before you upgrade {{site.data.reuse.eem_name}}.

- To upgrade successfully, your {{site.data.reuse.eem_name}} instance must have persistent storage enabled. If you upgrade an {{site.data.reuse.eem_name}} instance with ephemeral storage, all data will be lost.

### Upgrading by using the OpenShift CLI

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
6. Select the version number link in the **Update channel** section (for example, **v11.0**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select the required channel, for example **v11.1**, and click the **Save** button on the **Change Subscription update channel** dialog.

All {{site.data.reuse.eem_name}} pods that need to be updated as part of the upgrade will be rolled.


## Upgrading on other Kubernetes platforms

If you are running {{site.data.reuse.eem_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers, you can upgrade {{site.data.reuse.eem_name}} by using the Helm chart.

### Prerequisites

To upgrade successfully, your {{site.data.reuse.eem_name}} instance must have persistent storage enabled. If you upgrade an {{site.data.reuse.eem_name}} instance with ephemeral storage, all data will be lost.

### Upgrading by using Helm

Complete the steps in the following sections to upgrade your {{site.data.reuse.eem_name}} installation.

1. {{site.data.reuse.cncf_cli_login}}
2. Identify the namespace where the installation is located and the Helm release managing the CRDs by looking at the annotations on the CRDs:

   ```shell
   kubectl get crd eventendpointmanagements.events.ibm.com -o jsonpath='{.metadata.annotations}'
   ```
   
   The following is an example output showing CRDs managed by Helm release `eem-crds` in namespace `my-eem`:
   
   ```shell
   {"meta.helm.sh/release-name": "eem-crds", "meta.helm.sh/release-namespace": "eem"}
   ```
   
3. Ensure you are using the namespace where your {{site.data.reuse.eem_name}} CRD Helm release is located (see previous step):

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

4. Add the [IBM Helm repository](https://github.com/IBM/charts/tree/master/repo/ibm-helm){:target="_blank"} if you have not already done so:

   ```shell
   helm repo add ibm-helm https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
   ```

5. Update the Helm repository:

   ```shell
   helm repo update ibm-helm
   ```

6. Run the following command to upgrade the Helm release that manages your {{site.data.reuse.eem_name}} CRDs (as identified in step 2):

   ```shell
   helm upgrade <crd_release_name> ibm-helm/ibm-eem-operator-crd
   ```

7. Run the following command to upgrade the Helm release of your operator installation. Switch to the right namespace if your CRD Helm release is in a different namespace to your operator.

   ```shell
   helm upgrade <eem_release_name> ibm-helm/ibm-eem-operator <install_flags>
   ```

In the earlier commands:
- `<crd_release_name>` is the Helm release name of the Helm installation that manages the {{site.data.reuse.eem_name}} CRDs.
- `<eem_release_name` is the Helm release name of the Helm installation of the operator.
- `<install_flags` are any optional installation property settings, such as `--set watchAnyNamespace=true`

## Verifying the upgrade

1. Wait for all {{site.data.reuse.eem_name}} pods to reconcile. This is indicated by the `Running` state.
2. {{site.data.reuse.cncf_cli_login}}
3. To retrieve a list of {{site.data.reuse.eem_name}} instances, run the following command:

   ```shell
   kubectl get eem -n <namespace>
   ```

4. For the instance of {{site.data.reuse.eem_name}} that you upgraded, check that the status returned by the following command is `Running`.

   ```shell
   kubectl get eem -n <namespace> <name-of-the-eem-instance> -o jsonpath="{.status.phase}"
   ```

5. To check the version of your {{site.data.reuse.eem_name}} instance, run the following command:

   ```shell
   kubectl get eem -n <namespace> <name-of-the-eem-instance> -o jsonpath="{.status.versions.reconciled}"
   ```
