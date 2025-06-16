---
title: "Upgrading Event Manager and operator-managed Event Gateways"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.eem_name}} installation as follows. The {{site.data.reuse.eem_name}} operator handles the upgrade of your {{site.data.reuse.eem_manager}}, and all [operator-managed](../install-gateway#operator-managed-gateways) {{site.data.reuse.egw}} instances that are on the same cluster. To upgrade a Docker or Kubernetes {{site.data.reuse.egw}}, see [Upgrading Docker and Kubernetes {{site.data.reuse.egw}}s](../upgrading-gateways).

Review the upgrade procedure and decide the right steps to take for your deployment based on your platform, current version, and target version.

## Planning your upgrade
{: #planning-upgrade}

### Upgrade paths
{: #upgrade-paths}

<!-- Below text to be used for .1, .2,... releases (non .0 releases) -->
You can upgrade {{site.data.reuse.eem_name}} to the [latest 11.6.x version]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) directly from any earlier 11.6.x or 11.5.x version by using the latest 11.6.x operator.

<!-- Below text to be used for .0 releases -->
<!-- You can upgrade {{site.data.reuse.eem_name}} to [11.6.0]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) directly from any 11.5.x by using the 11.6.0 operator. -->

If you are upgrading from {{site.data.reuse.eem_name}} version 11.4.x or earlier, you must first [upgrade your installation to 11.5.x]({{ 'eem/eem_11.5' | relative_url }}/installing/upgrading/), and then return to these instructions to upgrade to 11.6.x.

On OpenShift, you can upgrade to the latest version by using operator channel v11.6. 

On other Kubernetes platforms, you must update the Helm repository and then upgrade {{site.data.reuse.eem_name}} by using the Helm chart. 

### Prerequisites
{: #upgrade-prereqs}

- Ensure that you have a supported version of the {{site.data.reuse.openshift_short}} installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

- If you installed as part of {{site.data.reuse.cp4i}}, ensure that you followed the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.2?topic=upgrading){:target="_blank"} before you upgrade {{site.data.reuse.eem_name}}.

- To keep your data, your {{site.data.reuse.eem_manager}} instance must have persistent storage enabled. If you upgrade an {{site.data.reuse.eem_manager}} instance with ephemeral storage, then all data is lost.

- {{site.data.reuse.egw_compatibility_note}}

- Upgrade Docker or Kubernetes Deployment {{site.data.reuse.egw}} instances after you upgrade your {{site.data.reuse.eem_manager}}.

- Rolling back an upgrade is not supported. If your upgrade fails, then reinstall {{site.data.reuse.eem_name}} and restore your data from your [backup](../backup-restore).

**Important:** The upgrade process requires some downtime as {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} pods are restarted.


## Upgrading on the {{site.data.reuse.openshift_short}}
{: #upgrading-openshift}

Find out how to upgrade your deployment on an {{site.data.reuse.openshift_short}}.

### Pre-upgrade checks and preparation
{: #pre-upgrade-checks-and-preparation-openshift}

The pre-upgrade checks and preparation ensure that your {{site.data.reuse.eem_name}} installation is ready to upgrade. These steps do not commit you to completing the upgrade, so you can do them before your upgrade window.

1. Determine which Operator Lifecycle Manager (OLM) channel is used by your existing Subscription. You can check the channel that you are subscribed to in the OpenShift web console, or by using the CLI as follows:
   
   a. Run the following command to check your subscription details:
   
   ```shell
   oc -n <namespace> get subscription
   ```

   `<namespace>` is the {{site.data.reuse.eem_name}} operator namespace.
      
   b. Check the `CHANNEL` column for the channel you are subscribed to, for example, v11.5 in the following snippet:
      
   ```
   NAME                                      PACKAGE                          SOURCE                                     CHANNEL
   ibm-eventendpointmanagement               ibm-eventendpointmanagement      ibm-eventendpointmanagement-catalog        v11.5
   ```

   This is the subscription that is created during [installation](../installing/#install-the-event-endpoint-management-operator).

   If your existing Subscription uses a channel earlier than v11.5, you must first [upgrade your installation to 11.5.x]({{ 'eem/eem_11.5' | relative_url }}/installing/upgrading/) before you can upgrade to 11.6.x.

2. [Back up](../backup-restore) your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.

3. If you are managing your [catalog sources](../installing/#creating-the-catalog-sources) with a CASE bundle, then download the CASE bundle for your target version.

   a. Download and extract the latest {{site.data.reuse.eem_name}} CASE version:

   ```shell
   oc ibm-pak get ibm-eventendpointmanagement 
   ```

    **Note:** You can specify an earlier version of the CASE by using `--version <case version>`.

   b. Generate mirror manifests:

   ```shell
   oc ibm-pak generate mirror-manifests ibm-eventendpointmanagement icr.io
   ```

<!-- ### Upgrading from v11.6.0 to v11.6.1 -->

If you installed by using the IBM Operator Catalog with the `latest` label, then the latest {{site.data.reuse.eem_name}} release for your update channel is always available and updates are applied automatically. Proceed directly to [verify your upgrade](#verify-upgrade). 


### Upgrading by using the OpenShift CLI
{: #ocp-cli-upgrade}

If you are using the OpenShift command-line interface (CLI), complete the steps in the following sections to upgrade your {{site.data.reuse.eem_name}} installation. Set `<namespace>` to the namespace of your {{site.data.reuse.eem_name}} operator.

1. {{site.data.reuse.openshift_cli_login}}

2. If you are managing your [catalog sources](../installing/#creating-the-catalog-sources) with a CASE bundle, then apply the CASE bundle: <!-- this is the point of no return for patch updates, they get applied automatically -->
    
   ```shell
   oc apply -f ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case version>/catalog-sources.yaml
   ```
   
   <!-- Below line for non .0 releases only -->
   If your existing subscription is already on the v11.6 channel, then the upgrade to 11.6.x is applied automatically. Skip the remaining steps and proceed to [verify your upgrade](#verify-upgrade).
   
   If you used the CASE bundle for an offline installation that uses a private registry, follow the instructions in [installing offline](../offline/#download-the-case-bundle) to remirror images and update the `CatalogSource`.

3. Verify that the target version {{site.data.reuse.eem_name}} Operator Upgrade Channel is available:

   ```shell
   oc -n <namespace> get packagemanifest ibm-eventendpointmanagement -o=jsonpath='{.status.channels[*].name}'
   ```

4. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v11.6`):

   <!-- this step is the point-of-no-return for minor version upgrades -->

   ```shell
   oc -n <namespace> patch subscription ibm-eventendpointmanagement --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```
<!-- Below step can be commented out from releases that do not require license updates. -->
5. If you are upgrading from 11.5.x, then update the `spec.license.license` field in the custom resources of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances to the [license ID]({{ '/support/licensing/#available-licenses' | relative_url }}) for 11.6.0 and later. The instances will not upgrade until the license ID is updated. Set `<namespace>` to the namespace of your {{site.data.reuse.eem_name}} instance.

    a. Get the names of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances:

   ```shell
   oc -n <namespace> get eventendpointmanagements.events.ibm.com
   ```

   ```shell
   oc -n <namespace> get eventgateways.events.ibm.com
   ```

   b. For each instance, update the license:

   ```shell
   oc -n <namespace> patch eventendpointmanagements.events.ibm.com <manager instance name> --patch '{"spec":{"license":{"license":"<license ID>"}}}' --type=merge
   ```

   ```shell
   oc -n <namespace> patch eventgateway.events.ibm.com <gateway instance name> --patch '{"spec":{"license":{"license":"<license ID>"}}}' --type=merge
   ```

6. Check the status of the `Subscription` custom resource to confirm that your {{site.data.reuse.eem_name}} operator was updated to your target version.

   ```shell
   oc -n <namespace> get -o yaml subscription
   ```

   `<namespace>` is the {{site.data.reuse.eem_name}} operator namespace. The `status.installedCSV` field in the output shows the current operator version.


All {{site.data.reuse.eem_name}} pods that are updated as part of the upgrade are restarted.

### Upgrading Subscription by using the OpenShift web console
{: #ocp-console-upgrade}

If you are using the {{site.data.reuse.openshift_eem_name}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.eem_name}} installation.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the project (namespace) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.eem_manager}} instance in the project. It is called **{{site.data.reuse.eem_name}}** in the **Name** column. Click the **{{site.data.reuse.eem_name}}** link in the row.
5. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.eem_name}} operator.
6. Select the version number link in the **Update channel** section (for example, **v11.5**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select the required channel, for example **v11.6**, and click **Save** on the **Change Subscription update channel** dialog.<!-- This step can be commented out from releases that do not require license updates. -->
8. If you are upgrading from 11.5.x, then update the `spec.license.license` field in the custom resources of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances to the [license ID]({{ '/support/licensing/#available-licenses' | relative_url }}) for 11.6.0 and later. The instances will not upgrade until the license ID is updated.
9. Monitor your {{site.data.reuse.eem_name}} operator and instance in the web console to confirm that the upgrade completes.

All {{site.data.reuse.eem_name}} pods that are updated as part of the upgrade are restarted.


## Upgrading on other Kubernetes platforms by using Helm
{: #helm-upgrade}

If you are running {{site.data.reuse.eem_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers, you can upgrade {{site.data.reuse.eem_name}} by using the Helm chart.

### Pre-upgrade checks and preparation on other Kubernetes platforms
{: #pre-upgrade-checks-and-preparation-on-other-kubernetes-platforms}

Complete the following steps to plan your upgrade on other Kubernetes platforms.

1. Ensure that you have a recent [backup](../backup-restore) of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.
2. Identify the name, namespace, and chart of your {{site.data.reuse.eem_name}} operators:

   a. {{site.data.reuse.cncf_cli_login}}

   b. Run the following command:

   ```shell
   helm list --all-namespaces
   ```

   If you have several Helm releases installed, you can filter for `eem`, for example: 

   ```shell
   helm list --all-namespaces | grep eem
   ```
   <!-- we could use `-o json | jq ...` instead of grep, but we can't always assume jq is installed on users system -->
      
   c. Take note of the `NAME`, `NAMESPACE`, and `CHART` values for `ibm-eem-operator` and `ibm-eem-operator-crd`:
   
   ```shell
   NAME     NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART                                   	APP VERSION     
   eem-crd  eemns   	1       	2024-12-04 02:10:55.343886423 -0800 PST	deployed	ibm-eem-operator-crd-11.6.0             	26955880-704cca1
   eem-op   eemns  	1         	2024-12-04 02:11:08.814270035 -0800 PST	deployed	ibm-eem-operator-11.6.0                 	26955880-704cca1
   ```

           
3. Check the latest chart version that you can upgrade to:
   
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
      
   Check the `version:` value in the output, for example: `version: {{site.data.reuse.eem_current_version}}`

If the chart version for your existing deployment is earlier than 11.5.x, you must first [upgrade your installation to 11.5.x]({{ 'eem/eem_11.5' | relative_url }}/installing/upgrading/), including any post-upgrade tasks. Return to these instructions to complete your upgrade to the 11.6.x version.

If the chart version for your existing deployment is 11.5.x, then proceed to [upgrading by using Helm](#helm-upgrade-steps).

<!-- Below line applies to non .0 releases only -->
If the chart version for your existing deployment is 11.6.x, your upgrade is a change in patch level only. Follow the steps in [upgrading by using Helm](#helm-upgrade-steps) to update your Custom Resource Definitions (CRDs) and operator charts to the latest version. The operator will then upgrade your {{site.data.reuse.eem_manager}} instance automatically.

### Upgrading by using Helm
{: #helm-upgrade-steps}

You can upgrade your {{site.data.reuse.eem_name}} on other Kubernetes platforms by using Helm.

1. {{site.data.reuse.cncf_cli_login}}

2. Upgrade the Helm release that manages your {{site.data.reuse.eem_name}} Custom Resource Definitions (CRDs):

   ```shell
   helm -n <EEM CRD namespace> upgrade <EEM CRD name> ibm-helm/ibm-eem-operator-crd
   ```

   Replace `<EEM CRD namespace>` and `<EEM CRD name>` with the NAMESPACE and NAME values that you identified in the [pre-upgrade checks](#pre-upgrade-checks-and-preparation-on-other-kubernetes-platforms).


3. Upgrade the Helm release of your operator installation. 

   ```shell
   helm -n <EEM operator namespace> upgrade <EEM operator name> ibm-helm/ibm-eem-operator 
   ```

   Replace `<EEM operator namespace>` and `<EEM operator name>` with the NAMESPACE and NAME values that you identified in the [pre-upgrade checks](#pre-upgrade-checks-and-preparation-on-other-kubernetes-platforms). 
 
4. If you are upgrading from 11.5.x, then update the `spec.license.license` field in the custom resources of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances to the [license ID]({{ '/support/licensing/#available-licenses' | relative_url }}) for 11.6.0 and later. The instances will not upgrade until the license ID is updated.

   a. Retrieve the names of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances:

   ```shell
   kubectl -n <namespace> get eventendpointmanagements.events.ibm.com
   ```

   ```shell
   kubectl -n <namespace> get eventgateways.events.ibm.com
   ```

   b. For each instance, update the license:

   ```shell
   kubectl -n <namespace> patch eventendpointmanagements.events.ibm.com <manager instance name> --patch '{"spec":{"license":{"license":"<license ID>"}}}' --type=merge
   ```

   ```shell
   kubectl -n <namespace> patch eventgateways.events.ibm.com <gateway instance name> --patch '{"spec":{"license":{"license":"<license ID>"}}}' --type=merge
   ```

   <!-- Above step can be commented out from releases that do not require license updates. -->

5. Verify that your upgrade completed:

   ```shell
   helm list -n <namespace>
   ```

   Confirm that the CHART column shows your target version for your {{site.data.reuse.eem_name}} CRDs and operator.


## Post-upgrade tasks
{: #post-upgrade}

### Verifying the upgrade
{: #verify-upgrade}

After the upgrade, verify the status of the {{site.data.reuse.eem_name}}, by using the [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).



