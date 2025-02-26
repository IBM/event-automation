---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.eem_name}} installation as follows. The {{site.data.reuse.eem_name}} operator handles the upgrade of your {{site.data.reuse.eem_manager}}, and all {{site.data.reuse.egw}} instances that are on the same cluster. To upgrade a stand-alone {{site.data.reuse.egw}}, see [upgrading a stand-alone {{site.data.reuse.egw}}](../standalone-gateways/#upgrade-stand-alone-egw).

Review the upgrade procedure and decide the right steps to take for your deployment based on your platform, current version, and target version.

## Upgrade paths

<!-- Below text to be used for .1, .2,... releases (non .0 releases) -->
You can upgrade {{site.data.reuse.eem_name}} to the [latest 11.4.x version]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) directly from any earlier 11.4.x or 11.3.x version by using the latest 11.4.x operator. 

<!-- Below text to be used for .0 releases -->
<!-- You can upgrade {{site.data.reuse.eem_name}} to the [11.4.0]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) directly from any 11.3.x by using the latest 11.4.0 operator. -->

If you are upgrading from {{site.data.reuse.eem_name}} version 11.2.x or earlier, you must first [upgrade your installation to 11.3.x]({{ 'eem/eem_11.3' | relative_url }}/installing/upgrading/), and then follow these instructions to upgrade to 11.4.1.

- On OpenShift, you can upgrade to the latest version by using operator channel v11.4. Review the general upgrade [prerequisites](#prerequisites) before you follow the instructions to [upgrade on OpenShift](#upgrading-on-the-openshift-container-platform).

- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), and then upgrade by using the Helm chart. Review the general upgrade [prerequisites](#prerequisites) before you follow the instructions to [upgrade on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm).

## Prerequisites

- Ensure that you have a supported version of the {{site.data.reuse.openshift_short}} installed. For supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

- If you installed as part of {{site.data.reuse.cp4i}}, ensure that you followed the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.0?topic=upgrading){:target="_blank"} before you upgrade {{site.data.reuse.eem_name}}.

- To upgrade successfully, your {{site.data.reuse.eem_manager}} instance must have persistent storage enabled. If you upgrade an {{site.data.reuse.eem_manager}} instance with ephemeral storage, all data is lost.

- {{site.data.reuse.egw_compatibility_note}}

- Upgrade stand-alone {{site.data.reuse.egw}} instances after you upgrade your {{site.data.reuse.eem_manager}}.

**Important:** If you have {{site.data.reuse.egw}} instances from {{site.data.reuse.eem_name}} version 11.2.0 and earlier, [review the additional upgrade steps](#enable-earlier-egw-instances-to-register).

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
      
   b. Check the `CHANNEL` column for the channel you are subscribed to, for example, v11.3 in the following snippet:
      
      ```
      NAME                                      PACKAGE                          SOURCE                                     CHANNEL
      ibm-eventendpointmanagement               ibm-eventendpointmanagement      ibm-eventendpointmanagement-catalog        v11.3
      ```

    This is the [subscription created during installation](../installing/#install-the-event-endpoint-management-operator).

If your existing Subscription uses a channel earlier than v11.3, you must first [upgrade your installation to 11.3.x]({{ 'eem/eem_11.3' | relative_url }}/installing/upgrading/) before you can upgrade to 11.4.x.


<!-- Below line for non .0 releases only -->
If your existing Subscription is already on the v11.4 channel, your upgrade is a change to the patch level (third digit) only. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed by using the IBM Operator Catalog with the `latest` label, new versions are automatically available. The operator will upgrade your {{site.data.reuse.eem_name}} instance automatically.


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
4. If you are upgrading from 11.3.x, then update the `spec.license.license` ID in the custom resources of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances to the [license ID]({{ '/support/licensing/#ibm-event-automation-license-information' | relative_url }}) for 11.4.0 and later. The instances will not upgrade until the license ID is updated.

All {{site.data.reuse.eem_name}} pods that are updated as part of the upgrade are restarted.

### Upgrading Subscription by using the OpenShift web console

If you are using the {{site.data.reuse.openshift_eem_name}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.eem_name}} installation.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the project (namespace) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.eem_manager}} instance in the project. It is called **{{site.data.reuse.eem_name}}** in the **Name** column. Click the **{{site.data.reuse.eem_name}}** link in the row.
5. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.eem_name}} operator.
6. Select the version number link in the **Update channel** section (for example, **v11.3**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select the required channel, for example **v11.4**, and click **Save** on the **Change Subscription update channel** dialog.
<!-- This step can be commented out from releases that do not require license updates. -->
8. If you are upgrading from 11.3.x, then update the `spec.license.license` ID in the custom resources of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances to the [license ID]({{ '/support/licensing/#ibm-event-automation-license-information' | relative_url }}) for 11.4.0 and later. The instances will not upgrade until the license ID is updated.


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
      
   c. Check the version installed in the `CHART` column, for example, `<chart-name>-11.3.2` in the following snippet:
      
      ```
      NAME                  NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                        APP VERSION    
      ibm-eem-operator      eem        1         2023-11-22 12:27:03.6018574 +0000 UTC   deployed ibm-eem-operator-11.3.2      7133459-483976d  
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
      
      Check the `version:` value in the output, for example: `version: {{site.data.reuse.eem_current_version}}`

If the chart version for your existing deployment is earlier than 11.3.x, you must first [upgrade your installation to 11.3.x]({{ 'eem/eem_11.3' | relative_url }}/installing/upgrading/), including any post-upgrade tasks. Return to these instructions to complete your upgrade to the 11.4.1 version.

If your existing installation is in an offline environment, you must repeat the steps in the offline installation instructions to [Download the CASE bundle](../offline/#download-the-case-bundle) and [mirror the images](../offline/#mirror-the-images) before you upgrade. 

If the chart version for your existing deployment is 11.3.x, then proceed to [helm upgrade](#upgrading-by-using-helm).

<!-- Below line applies to non .0 releases only -->
If the chart version for your existing deployment is 11.4.x, your upgrade is a change in patch level only. Follow the steps in [upgrading by using Helm](#upgrading-by-using-helm) to update your Custom Resource Definitions (CRDs) and operator charts to the latest version. The operator will then upgrade your {{site.data.reuse.eem_manager}} instance automatically.

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

<!-- This step can be commented out from releases that do not require license updates. -->
8. If you are upgrading from 11.3.x, then update the `spec.license.license` ID in the custom resources of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances to the [license ID]({{ '/support/licensing/#ibm-event-automation-license-information' | relative_url }}) for 11.4.0 and later. The instances will not upgrade until the license ID is updated.


Where:
- `<crd_release_name>` is the Helm release name of the Helm installation that manages the {{site.data.reuse.eem_name}} CRDs.
- `<eem_release_name>` is the Helm release name of the Helm installation of the operator.
- `<install_flags>` are any optional installation property settings, such as `--set watchAnyNamespace=true`
- `<ibm-eem-operator namespace>` is the namespace where your {{site.data.reuse.eem_name}} is installed.

## Post-upgrade tasks

### Verifying the upgrade

After the upgrade, verify the status of the {{site.data.reuse.eem_name}}, by using the [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).

### Enable {{site.data.reuse.egw}} instances from version 11.2.0 and earlier to work with 11.4.0 and later
{: #enable-earlier-egw-instances-to-register}

By default, {{site.data.reuse.eem_name}} 11.4.0 and later versions do not allow any {{site.data.reuse.egw}} from {{site.data.reuse.eem_name}} version 11.2.0 and earlier to register with the {{site.data.reuse.eem_manager}} and publish topics to them.

You can configure any such {{site.data.reuse.egw}} instances to continue to work with {{site.data.reuse.eem_manager}} instances from {{site.data.reuse.eem_name}} 11.4.x as follows.

**Note:** Support for using an {{site.data.reuse.egw}} from {{site.data.reuse.eem_name}} version 11.2.0 and earlier with 11.4.0 and later deployments will be removed in a future release.

1. Determine your current {{site.data.reuse.egw}} version by obtaining the `sha256` digests for the deployed {{site.data.reuse.egw}} container images. The steps to do this depend on whether your {{site.data.reuse.egw}} is [operator-managed](#operator-managed-event-gateway-instances) or a [stand-alone deployment](#stand-alone-event-gateway-instances).

2. Check if your {{site.data.reuse.egw}} images match any of the following digests:

   - 11.2.0: `sha256:3a0651f5cf79bdb29afffa7328db796c06d27fe62748a86701f4bdbf501cf570`
   - 11.1.5: `sha256:168a2017976c6b59ff32a5966994946abb880ae8ddb3ee8e79dac2aab8f1f504`
   - 11.1.4: `sha256:6369e5416cbb55e861eafae7657bbccddf5b360a67e9626e922f2636a94a5be0`
   - 11.1.3: `sha256:83ae7964b1b85e690b50784889355b28f2d5181f9d793bf9f5fb004a112cbd4f`
   - 11.1.2: `sha256:fa0e266f1974467297469392b22175111541933619b2419d68ee7f4dd387d321`
   - 11.1.1: `sha256:2e4c371259b599b01bacf29ac96bc1cc90764c3a33cb202fb127472dffddc6c7`
   - 11.1.0: `sha256:8fa25e9f2774f20181e8fe8108d58aa1f473108ead013271a0a75dc0e3e87de6`
   - 11.0.5: `sha256:cf303004c78434741ec3bd492c4df84b7647091a8f1e13e44c919fa8aad8092c`
   - 11.0.4: `sha256:cade81de88d1567e04c319e2b6dd5115e7b1042e772253eadb728e543aef8794`
   - 11.0.3: `sha256:4e4a05f15639ed76e134a8d75f925fca68c86bb639c45da024bf8f26fb8d40f9`
   - 11.0.2: `sha256:ccaea352f4453bbc162692016af78b1b72dcdc466fdd477a356a34bdf198a12f`
   - 11.0.1: `sha256:96597a18b0bd50a71d1d341fb2d9acdda970d006fa35ceadfbe4d2396fec3eed`
   - 11.0.0: `sha256:cfdf937b0c1e20debb4f13bb63027ee8cb0840f96850095e3ceb6141f490a590`

3. If your gateway matches one of the digests listed in the previous step, it will not work with your {{site.data.reuse.eem_manager}} after upgrading unless you complete one of the following tasks:
   
   - Upgrade your {{site.data.reuse.egw}} instance to the version from the {{site.data.reuse.eem_name}} you are upgrading to.
   - Apply the following configuration to the `EventEndpointManagement` custom resource that defines your {{site.data.reuse.eem_manager}} instance:

   ```yaml
   spec:
     manager:
       template:
         pod:
           spec:
             containers:
               - name: manager
                 env:
                   - name: ALLOW_PRE_V11.2.0_GATEWAYS
                     value: "true"
   ```

   **Important:** The `ALLOW_PRE_V11.2.0_GATEWAYS` configuration option will be removed in a future {{site.data.reuse.eem_name}} release. To ensure  compatibility, it is recommended that both your {{site.data.reuse.egw}} and {{site.data.reuse.eem_manager}} instances are from the same version of {{site.data.reuse.eem_name}}.

#### Operator-managed {{site.data.reuse.egw}} instances

The `sha256` digest is visible in the `Deployment` of any {{site.data.reuse.egw}}, which has been created and managed by the Operator.

 For example, where the `Deployment` is named `<GATEWAY INSTANCE NAME>-ibm-egw-gateway`, where `<GATEWAY INSTANCE NAME>` is the name of your `EventGateway` custom resource, the `sha256` value is a part of the `image` value:

```yaml
...
          ports:
            - name: egw
              containerPort: 8092
              protocol: TCP
          imagePullPolicy: IfNotPresent
          volumeMounts:
            - name: egw-certs
              readOnly: true
              mountPath: /certs/eem
            - name: config
              readOnly: true
              mountPath: /config
            - name: manager-cache
              mountPath: /tmp
            - name: manager-audit
              mountPath: /var/log/audit
          terminationMessagePolicy: File
          image: 'cp.icr.io/cp/ibm-eventendpointmanagement/egw@sha256:3a0651f5cf79bdb29afffa7328db796c06d27fe62748a86701f4bdbf501cf570'
      serviceAccount: <GATEWAY INSTANCE NAME>-ibm-egw-sa
...
```

#### Stand-alone {{site.data.reuse.egw}} instances

If you have a stand-alone {{site.data.reuse.egw}} instance, run the following command to list the digests of the running images on the host system:

```sh
docker image inspect $(docker ps -a --filter label="description=gateway microservice" --format {% raw %}"{{.Image}}" | sort) --format="{{.RepoTags}}:{{.Id}}"{% endraw %}
```

The following shows an example result:

```sh
[cp.icr.io/cp/ibm-eventendpointmanagement/egw:11.0.0]:sha256:b328f6c844117e1c59ce0e6406c7691b8169d72dd73665bbe602835b8e06388c
```

Review the returned `sha256` string or tag that is associated with the image to determine the version of your {{site.data.reuse.egw}} instance.