---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.eem_name}} installation as follows. The {{site.data.reuse.eem_name}} operator handles the upgrade of your {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} instances. 

Review the upgrade procedure and decide the right steps to take for your deployment based on your platform and the version level you are upgrading to.

## Upgrade paths

Consider the possible upgrade paths for your platform.

- On OpenShift, you can upgrade {{site.data.reuse.eem_name}} to the latest 11.1.x version directly from any 11.0.x version by using operator channel v11.1. The upgrade procedure depends on whether you are upgrading to a major, minor, or patch level version, and what your catalog source is. See [upgrading on OpenShift](#upgrading-on-the-openshift-container-platform) for more information, after considering the general upgrade [prerequisites](#prerequisites).

- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), as described in [upgrading on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm), after considering the general upgrade [prerequisites](#prerequisites).

## Prerequisites

- Ensure you have a supported version of the {{site.data.reuse.openshift_short}} installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

- If you installed as part of {{site.data.reuse.cp4i}}, ensure that you have followed the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.2?topic=upgrading){:target="_blank"} before you upgrade {{site.data.reuse.eem_name}}.

- To upgrade successfully, your {{site.data.reuse.eem_name}} instance must have persistent storage enabled. If you upgrade an {{site.data.reuse.eem_name}} instance with ephemeral storage, all data will be lost.

**Important:** You will experience some downtime during the {{site.data.reuse.eem_name}} upgrade while the pods for the relevant components are recycled.

## Upgrading on the {{site.data.reuse.openshift_short}}

Find out how to upgrade your deployment on an {{site.data.reuse.openshift_short}}.

### Planning your upgrade

Complete the following steps to plan your upgrade on OpenShift.

- Determine which Operator Lifecycle Manager (OLM) channel is used by your existing Subscription. You can check the channel you are subscribed to in the [web console](#upgrading-subscription-by-using-the-web-console) (see **Update channel** section), or by using the CLI as follows (this is the [subscription created during installation](../installing/#install-the-operators)):
   
   1. Run the following command to check your subscription details:
   
      ```shell
      oc get subscription
      ```
      
   2. Check the `CHANNEL` column for the channel you are subscribed to, for example, v11.0 in the following snippet:
      
      ```
      NAME                                      PACKAGE                          SOURCE                                     CHANNEL
      ibm-eventendpointmanagement               ibm-eventendpointmanagement      ibm-eventendpointmanagement-catalog        v11.0
      ```

- If your existing Subscription does not use the v11.1 channel, your upgrade is a change in a minor version. Complete the following steps to upgrade:
  1. Ensure the [catalog source for new version is available](#making-new-catalog-source-available).
  1. Change your Subscription to the `v11.1` channel, using [the CLI](#upgrading-subscription-by-using-the-openshift-cli) or [the web console](#upgrading-subscription-by-using-the-openshift-web-console).
  
- If your existing Subscription is already on the v11.1 channel, your upgrade is a change to the patch level (third digit) only. Complete the following steps to upgrade:

  1. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed using the IBM Operator Catalog with the `latest` label, new versions are automatically available.

### Making new catalog source available

Before you can upgrade to the latest version, make the catalog source for the version available in your cluster. This depends on how you set up [version control](../installing/#decide-version-control-and-catalog-source) for your deployment.

- Latest versions: If your catalog source is the IBM Operator Catalog, latest versions are always available when published, and you do not have to make new catalog sources available.

- Specific versions: If you applied a catalog source for a specific version to control the version of the operator and instances that are installed, you must [apply the new catalog source](../installing/#adding-specific-versions) you want to upgrade to.

The change to a new Channel, if needed, would be a later step.

### Upgrading Subscription by using the OpenShift CLI

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

### Upgrading Subscription by using the OpenShift web console

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


## Upgrading on other Kubernetes platforms by using Helm

If you are running {{site.data.reuse.eem_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers, you can upgrade {{site.data.reuse.eem_name}} by using the Helm chart.

### Planning your upgrade

Complete the following steps to plan your upgrade on other Kubernetes platforms.

- Determine the chart version for your current deployment:
   
   1. Change to the namespace where your {{site.data.reuse.eem_name}} instance is installed:
      
      ```shell
      kubectl config set-context --current --namespace=<namespace>
      ```
   
   2. Run the following command to check what version is installed:
      
      ```shell
      helm list
      ```
      
   3. Check the version installed in the `CHART` column, for example, `<chart-name>-11.0.5` in the following snippet:
      
      ```
      NAME                  NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                        APP VERSION    
      ibm-eem-operator      eem        1         2023-11-22 12:27:03.6018574 +0000 UTC   deployed ibm-eem-operator-11.0.5      7133459-483976d  
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
      helm show chart ibm-helm/ibm-eem-operator
      ```
      
      Check the `version:` value in the output, for example: `version: 11.1.0`

- If the existing chart version for your current deployment is 11.0.x, your upgrade involves a change in a minor version. Complete the following steps to upgrade to the latest version:
  1. Before upgrading, [update your instance configuration](#update-your-instance-configuration) to ensure compatibility across the version change.
  2. Follow the steps in [upgrading by using Helm](#upgrading-by-using-helm) to bring your CRD and operator charts to the latest version.

- If the existing chart version for your current deployment is 11.1.x, your upgrade is a change in patch level only. Follow the steps in [upgrading by using Helm](#upgrading-by-using-helm) to bring your CRD and operator charts to the latest version.

### Update your instance configuration

{{site.data.reuse.eem_name}} 11.1.0 and later includes the Admin API feature, which requires a service endpoint to be configured.

To enable the Admin API, [configure the `admin` endpoint](../../installing/configuring/#configuring-ingress) in any existing `EventEndpointManagement` custom resources before you upgrade.

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
- `<eem_release_name>` is the Helm release name of the Helm installation of the operator.
- `<install_flags>` are any optional installation property settings, such as `--set watchAnyNamespace=true`

## Post-upgrade tasks

### Verifying the upgrade

After the upgrade, verify the status of the {{site.data.reuse.eem_name}}, by using the [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).
