---
title: "Upgrading Event Manager and operator-managed Event Gateways"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.eem_name}} installation as follows. The {{site.data.reuse.eem_name}} operator handles the upgrade of your {{site.data.reuse.eem_manager}}, and all [operator-managed](../install-gateway#operator-managed-gateways) {{site.data.reuse.egw}} instances that are on the same cluster. To upgrade a Docker or Kubernetes {{site.data.reuse.egw}}, see [Upgrading Docker and Kubernetes {{site.data.reuse.egw}}s](../upgrading-gateways).

Review the upgrade procedure and decide the right steps to take for your deployment based on your platform, current version, and target version.

## Upgrade paths

<!-- Below text to be used for .1, .2,... releases (non .0 releases) -->
You can upgrade {{site.data.reuse.eem_name}} to the [latest 11.5.x version]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) directly from any earlier 11.5.x or 11.4.x version by using the latest 11.5.x operator.

<!-- Below text to be used for .0 releases -->
<!-- You can upgrade {{site.data.reuse.eem_name}} to [11.5.0]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) directly from any 11.4.x by using the latest 11.5.0 operator. -->

If you are upgrading from {{site.data.reuse.eem_name}} version 11.3.x or earlier, you must first [upgrade your installation to 11.4.x]({{ 'eem/eem_11.4' | relative_url }}/installing/upgrading/), and then follow these instructions to upgrade to 11.5.1.

- On OpenShift, you can upgrade to the latest version by using operator channel v11.5. Review the general upgrade [prerequisites](#prerequisites) before you follow the instructions to [upgrade on OpenShift](#upgrading-on-the-openshift-container-platform).

- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), and then upgrade by using the Helm chart. Review the general upgrade [prerequisites](#prerequisites) before you follow the instructions to [upgrade on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm).

## Prerequisites

- Ensure that you have a supported version of the {{site.data.reuse.openshift_short}} installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

- Ensure that you have [installed](../../installing/prerequisites/#certificate-management) the certificate manager.

- If you installed as part of {{site.data.reuse.cp4i}}, ensure that you followed the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.0?topic=upgrading){:target="_blank"} before you upgrade {{site.data.reuse.eem_name}}.

- To upgrade successfully, your {{site.data.reuse.eem_manager}} instance must have persistent storage enabled. If you upgrade an {{site.data.reuse.eem_manager}} instance with ephemeral storage, all data is lost.

- {{site.data.reuse.egw_compatibility_note}}

- Upgrade Docker or Kubernetes Deployment {{site.data.reuse.egw}} instances after you upgrade your {{site.data.reuse.eem_manager}}.

**Important:** The upgrade process requires some downtime as {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} pods are restarted.


## Upgrading on the {{site.data.reuse.openshift_short}}

Find out how to upgrade your deployment on an {{site.data.reuse.openshift_short}}.

### Planning your upgrade

Complete the following steps to plan your upgrade on OpenShift.

1. Determine which Operator Lifecycle Manager (OLM) channel is used by your existing Subscription. You can check the channel that you are subscribed to in the [web console](#upgrading-subscription-by-using-the-openshift-web-console) (see **Update channel** section), or by using the CLI as follows:
   
   a. Run the following command to check your subscription details:
   
      ```shell
      oc get subscription
      ```
      
   b. Check the `CHANNEL` column for the channel you are subscribed to, for example, v11.4 in the following snippet:
      
      ```
      NAME                                      PACKAGE                          SOURCE                                     CHANNEL
      ibm-eventendpointmanagement               ibm-eventendpointmanagement      ibm-eventendpointmanagement-catalog        v11.4
      ```

    This is the [subscription created during installation](../installing/#install-the-event-endpoint-management-operator).

If your existing Subscription uses a channel earlier than v11.4, you must first [upgrade your installation to 11.4.x]({{ 'eem/eem_11.4' | relative_url }}/installing/upgrading/) before you can upgrade to 11.5.x.


<!-- Below line for non .0 releases only -->
If your existing Subscription is already on the v11.5 channel, your upgrade is a change to the patch level (third digit) only. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed by using the IBM Operator Catalog with the `latest` label, new versions are automatically available. The operator will upgrade your {{site.data.reuse.eem_name}} instance automatically.


### Making new catalog source available

Before you can upgrade, make the catalog source for the target version available in your cluster. The procedure depends on how you created the [catalog sources](../installing/#creating-the-catalog-sources) for your deployment:

- Latest versions: If your catalog source is the IBM Operator Catalog, the latest versions are always available when published, and you do not have to make new catalog sources available.

- Specific versions: If you used the CASE bundle to install the catalog source for a previous version, you must download and use a new CASE bundle for your target version.
  - If you used the CASE bundle for an online installation, [apply the new catalog source](../installing/#add-specific-version-sources-for-production-environments-case) to update the `CatalogSource`.
  - If you used the CASE bundle for an offline installation that uses a private registry, follow the instructions in [installing offline](../offline/#download-the-case-bundle) to remirror images and update the `CatalogSource`.
  - In both cases, wait for the `status.installedCSV` field in the `Subscription` to update. It eventually reflects the latest version available in the new `CatalogSource` image for the currently selected channel in the `Subscription`:
    - In the {{site.data.reuse.openshift_short}} web console, the current version of the operator is displayed under `Installed Operators`. 
    - If you are using the CLI, check the status of the `Subscription` custom resource, the `status.installedCSV` field shows the current operator version.  


### Upgrading Subscription by using the OpenShift CLI

If you are using the OpenShift command-line interface (CLI), complete the steps in the following sections to upgrade your {{site.data.reuse.eem_name}} installation.

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.eem_name}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventendpointmanagement -o=jsonpath='{.status.channels[*].name}'
   ```

3. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v11.4`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventendpointmanagement --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```
<!-- This step can be commented out from releases that do not require license updates. -->
4. If you are upgrading from 11.4.x, then update the `spec.license.license` field in the custom resources of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances to the [license ID]({{ '/support/licensing/#ibm-event-automation-license-information' | relative_url }}) for 11.5.0 and later. The instances will not upgrade until the license ID is updated.

All {{site.data.reuse.eem_name}} pods that are updated as part of the upgrade are restarted.

### Upgrading Subscription by using the OpenShift web console

If you are using the {{site.data.reuse.openshift_eem_name}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.eem_name}} installation.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the project (namespace) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.eem_manager}} instance in the project. It is called **{{site.data.reuse.eem_name}}** in the **Name** column. Click the **{{site.data.reuse.eem_name}}** link in the row.
5. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.eem_name}} operator.
6. Select the version number link in the **Update channel** section (for example, **v11.4**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select the required channel, for example **v11.4**, and click **Save** on the **Change Subscription update channel** dialog.<!-- This step can be commented out from releases that do not require license updates. -->
8. If you are upgrading from 11.4.x, then update the `spec.license.license` field in the custom resources of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances to the [license ID]({{ '/support/licensing/#ibm-event-automation-license-information' | relative_url }}) for 11.5.0 and later. The instances will not upgrade until the license ID is updated.


All {{site.data.reuse.eem_name}} pods that are updated as part of the upgrade are restarted.


## Upgrading on other Kubernetes platforms by using Helm

If you are running {{site.data.reuse.eem_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers, you can upgrade {{site.data.reuse.eem_name}} by using the Helm chart.

### Planning your upgrade

Complete the following steps to plan your upgrade on other Kubernetes platforms.

1. Determine the chart version for your existing deployment:
   
   a. Change to the namespace where your {{site.data.reuse.eem_manager}} instance is installed:
      
      ```shell
      kubectl config set-context --current --namespace=<namespace>
      ```
   
   b. Run the following command to check what version is installed:
      
      ```shell
      helm list
      ```
      
   c. Check the version installed in the `CHART` column, for example, `<chart-name>-11.4.2` in the following snippet:
      
      ```
      NAME                  NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                        APP VERSION    
      ibm-eem-operator      eem        1         2023-11-22 12:27:03.6018574 +0000 UTC   deployed ibm-eem-operator-11.4.2      7133459-483976d  
      ```

2. Check the latest chart version that you can upgrade to:
   
   a. {{site.data.reuse.cncf_cli_login}}
   
   b. Add the [IBM Helm repository](https://github.com/IBM/charts/tree/master/repo/ibm-helm){:target="_blank"}:
      
      ```shell
      helm repo add ibm-helm https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
      ```
      
   c. Update the Helm repository:
      
      ```shell
      helm repo update ibm-helm
      ```
      
   d. Confirm the version of the chart that you are upgrading to:
      
      ```shell
      helm show chart ibm-helm/ibm-eem-operator
      ```
      
      Check the `version:` value in the output, for example: `version: 11.5.1`

If the chart version for your existing deployment is earlier than 11.4.x, you must first [upgrade your installation to 11.4.x]({{ 'eem/eem_11.3' | relative_url }}/installing/upgrading/), including any post-upgrade tasks. Return to these instructions to complete your upgrade to the 11.5.x version.

If your existing installation is in an offline environment, you must repeat the steps in the offline installation instructions to [Download the CASE bundle](../offline/#download-the-case-bundle) and [mirror the images](../offline/#mirror-the-images) before you upgrade. 

If the chart version for your existing deployment is 11.4.x, then proceed to [helm upgrade](#upgrading-by-using-helm).

<!-- Below line applies to non .0 releases only -->
If the chart version for your existing deployment is 11.5.x, your upgrade is a change in patch level only. Follow the steps in [upgrading by using Helm](#upgrading-by-using-helm) to update your Custom Resource Definitions (CRDs) and operator charts to the latest version. The operator will then upgrade your {{site.data.reuse.eem_manager}} instance automatically.

### Upgrading by using Helm

You can upgrade your {{site.data.reuse.eem_name}} on other Kubernetes platforms by using Helm.

1. {{site.data.reuse.cncf_cli_login}}
2. Identify the namespace where the installation is located and the Helm release that is managing the CRDs:

   ```shell
   kubectl get crd eventendpointmanagements.events.ibm.com -o jsonpath='{.metadata.annotations}'
   ```
   
   Example output that shows CRDs managed by Helm release `eem-crds` in namespace `my-eem`:
   
   ```shell
   {"meta.helm.sh/release-name": "eem-crds", "meta.helm.sh/release-namespace": "eem"}
   ```
   
3. Set your current namespace to the namespace that you identified in step 2.
   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

4. Add the [IBM Helm repository](https://github.com/IBM/charts/tree/master/repo/ibm-helm){:target="_blank"}:

   ```shell
   helm repo add ibm-helm https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
   ```

5. Update the Helm repository:

   ```shell
   helm repo update ibm-helm
   ```

6. Upgrade the Helm release that manages your {{site.data.reuse.eem_name}} CRDs (as identified in step 2):

   ```shell
   helm upgrade <crd_release_name> ibm-helm/ibm-eem-operator-crd
   ```

7. Upgrade the Helm release of your operator installation. 

   ```shell
   helm -n <ibm-eem-operator namespace> upgrade <eem_release_name> ibm-helm/ibm-eem-operator <install_flags>
   ```
 
8. If you are upgrading from 11.4.x, then update the `spec.license.license` field in the custom resources of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances to the [license ID]({{ '/support/licensing/#ibm-event-automation-license-information' | relative_url }}) for 11.5.0 and later. The instances will not upgrade until the license ID is updated.
<!-- Above step can be commented out from releases that do not require license updates. -->


Where:
- `<crd_release_name>` is the Helm release name of the Helm installation that manages the {{site.data.reuse.eem_name}} CRDs.
- `<eem_release_name>` is the Helm release name of the Helm installation of the operator.
- `<install_flags>` are any optional installation property settings, such as `--set watchAnyNamespace=true`
- `<ibm-eem-operator namespace>` is the namespace where your {{site.data.reuse.eem_name}} is installed.

## Post-upgrade tasks

### Verifying the upgrade

After the upgrade, verify the status of the {{site.data.reuse.eem_name}}, by using the [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).

### Update the service endpoints to define the `server` endpoint

**Note:** Only required when you configure ingress on Kubernetes platforms other than OpenShift.

In {{site.data.reuse.eem_name}} 11.5.0 and later, any existing `EventEndpointManagement` custom resources require a `server` endpoint in array `spec.manager.endpoints[]`. If that is not present, the custom resource shows an error in the status field. Patch your instances by adding a new element called `server` to `spec.manager.endpoints[]`. The hostname that you specify must start with `eem.`.

For example, using the `kubectl` CLI, the following command adds the element to an existing instance `eem-manager-instance` in namespace `my-namespace`:

```shell
kubectl patch EventEndpointManagement eem-manager-instance -n my-namespace --type json -p='[{"op": "add", "path": "/spec/manager/endpoints/0", "value": {"name": "server", "host": "eem.manager.mycluster.example.com"} }]'
```

If you are using an alternative system to manage your custom resources (such as ArgoCD or Ansible), then update your `EventEndpointManagement` definitions accordingly.

**Important:** In {{site.data.reuse.eem_name}} 11.5.0 and later, the `admin` service endpoint no longer includes a `type` option to set the network exposure and availability of the Admin API (`disabled`, `internal`, or `external`). The service endpoint is always available externally, making the API available from outside the cluster.

### Update user roles

In {{site.data.reuse.eem_name}} 11.5.0 and later, the author role no longer has the permissions to manage {{site.data.reuse.egw}}s. You must assign the [admin role](../../security/user-roles/) to any user who requires permissions to [deploy](../../installing/install-gateway/#remote-gateways) or [manage](../../describe/managing-gateways/) {{site.data.reuse.egw}}s.

