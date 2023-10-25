---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

You can upgrade {{site.data.reuse.ep_name}} and the {{site.data.reuse.flink_long}} to the latest 1.0.x version by using the operator channel v1.0. Upgrade your {{site.data.reuse.ep_name}} installation as follows.

**Note:** 

- If your operator upgrades are set to automatic, minor version upgrades are completed automatically. This means that the {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}} operators will be upgraded to 1.0.x when they are available in the catalog, and your {{site.data.reuse.ep_name}} and Flink instances are then also automatically upgraded.

- You will experience some downtime during the {{site.data.reuse.ep_name}} upgrade while the pods for the relevant components are recycled.

- If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying advanced flows in [production environments](../../advanced/deploying-production), the automatic upgrade cannot update the custom Flink image built by extending the IBM-provided Flink image. In this case, after the successful upgrade of the operator, complete steps 1a, 1b, 1e, and 2c in [Build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

## Prerequisites

- If you installed as part of {{site.data.reuse.cp4i}}, ensure that you have followed the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.2?topic=upgrading){:target="_blank"} before you upgrade {{site.data.reuse.ep_name}}.

- To upgrade without data loss, your {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}} instances must have [persistent storage enabled](../configuring/#enabling-persistent-storage). If you upgrade instances which use ephemeral storage, all data will be lost.

- If you [installed the {{site.data.reuse.ep_name}} operator](../installing) to manage instances of {{site.data.reuse.ep_name}} in any namespace (one per namespace), then you might need to control when each of these instances is upgraded to the latest version. You can control the updates by pausing the reconciliation of the instance configuration as described in the following sections.
  
  **Note:** Pausing the reconciliation of the instance configuration is not available for {{site.data.reuse.flink_long}} instances.

### Scheduling the upgrade of an instance

If your operator manages more than one instance of {{site.data.reuse.ep_name}}, you can control when each instance is upgraded by pausing the reconciliation of the configuration settings for each instance, running the upgrade, and then unpausing the reconciliation when ready to proceed with the upgrade for a selected instance.

#### Pausing reconciliation by using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. To apply the annotation to an `EventProcessing` instance, run the following command:

   ```shell
   kubectl annotate EventProcessing <instance-name> -n <instance-namespace> events.ibm.com/pause='true'
   ```

3. Follow the steps to upgrade by using [the `oc` CLI](#upgrading-by-using-the-openshift-cli), [the OpenShift web console](#upgrading-by-using-the-openshift-web-console) or [the `kubectl` CLI](#upgrading-on-other-kubernetes-platforms-by-using-helm).

#### Unpausing reconciliation by using the CLI

To unpause the reconciliation and continue with the upgrade of an {{site.data.reuse.ep_name}} instance, run the following command:

```shell
kubectl annotate EventProcessing <instance-name> -n <instance-namespace> events.ibm.com/pause-
```

When the annotation is removed, the configuration of your instance is updated, and the upgrade to the latest version of {{site.data.reuse.ep_name}} completes.

#### Pausing reconciliation by using the OpenShift web console

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}

3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.ep_name}} instance in the namespace. It is called **{{site.data.reuse.ep_name}}** in the **Name** column. Click the **{{site.data.reuse.ep_name}}** link in the row.
5. Select the instance you want to pause and click the `YAML` tab.
6. In the `YAML` for the custom resource, add `events.ibm.com/pause: 'true'` to the `metadata.annotations` field as follows:

   ```yaml
   apiVersion: events.ibm.com/v1beta1
   kind: EventProcessing
   metadata:
   name: <instance-name>
   namespace: <instance-namespace>
   annotations:
      events.ibm.com/pause: 'true'
   ```

7. Follow the steps to upgrade by using [the `oc` CLI](#upgrading-by-using-the-openshift-cli) or [the OpenShift web console](#upgrading-by-using-the-openshift-web-console).

#### Unpausing reconciliation by using the OpenShift web console

To unpause the reconciliation and continue with the upgrade of an {{site.data.reuse.ep_name}} instance, remove the annotation from the `EventProcessing` instance. When the annotation is removed, the configuration of your instance is updated, and the upgrade to the latest version of {{site.data.reuse.ep_name}} completes.

## Upgrading on the {{site.data.reuse.openshift_short}}

Upgrade your {{site.data.reuse.ep_name}} and Flink instances running on the {{site.data.reuse.openshift_short}} by using the CLI or web console as follows.


### Upgrading by using the OpenShift CLI

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
6. Select the version number in the **Update channel** section (for example, **v1.0**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select the required channel, for example **v1.1**, and click the **Save** button on the **Change Subscription update channel** dialog.

All {{site.data.reuse.ep_name}} pods that need to be updated as part of the upgrade will be rolled.

For Flink:

1. {{site.data.reuse.openshift_ui_login}}
2. If your Flink instance uses persistent storage, [backup the Flink instance](../backup-restore/#backing-up).
3. Expand **Operators** in the navigation on the left, and click **Installed Operators**.
4. From the **Project** list, select the namespace (project) the instance is installed in.
5. Locate the operator that manages your Flink instance in the namespace. It is called **{{site.data.reuse.flink_long}}** in the **Name** column. Click the **{{site.data.reuse.flink_long}}** in the row.
6. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.ep_name}} operator.
7. Select the version number in the **Update channel** section (for example, **v1.0**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
8. Select the required channel, for example **v1.1**, and click the **Save** button on the **Change Subscription update channel** dialog.
9. If your Flink instance uses persistent storage, [restore the backed up Flink instance](../backup-restore/#restoring).
10. If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying advanced flows in [production environments](../../advanced/deploying-production), complete steps 1a, 1b, 1e, and 2c in [Build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

All Flink pods that need to be updated as part of the upgrade will be rolled.

## Upgrading on other Kubernetes platforms by using Helm

If you are running {{site.data.reuse.ep_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers, upgrade {{site.data.reuse.ep_name}} by using the Helm chart as follows:

1. {{site.data.reuse.cncf_cli_login}}
2. If your Flink instance uses persistent storage, [backup the Flink instance](../backup-restore/#backing-up).
3. Add the [IBM Helm repository](https://github.com/IBM/charts/tree/master/repo/ibm-helm){:target="_blank"} if you have not already done so:

   ```shell
   helm repo add ibm-helm https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
   ```

4. Update the Helm repository:

   ```shell
   helm repo update ibm-helm
   ```

5. Ensure you are running in the namespace containing the Helm release of the {{site.data.reuse.flink_long}} CRDs. 
6. Upgrade the Helm release by running the command:

   ```shell
   helm upgrade <flink_crd_release_name> ibm-helm/ibm-eventautomation-flink-operator-crd
   ```

7. Upgrade the Helm release of {{site.data.reuse.flink_long}}. Switch to the right namespace if your CRD Helm release is in a different namespace to your operator and then run:

   ```shell
   helm upgrade <flink_release_name> ibm-helm/ibm-eventautomation-flink-operator
   ```

8. Identify the namespace where the {{site.data.reuse.ep_name}} installation is located and the Helm release managing the CRDs by looking at the annotations on the CRDs:

   ```shell
   kubectl get crd eventprocessings.events.ibm.com -o jsonpath='{.metadata.annotations}'
   ```

   The following is an example output showing CRDs managed by Helm release `ep-crds` in namespace `my-ep`:

   ```shell
   {"meta.helm.sh/release-name": "ep-crds", "meta.helm.sh/release-namespace": "ep"}
   ```

9. Ensure you are using the namespace where your {{site.data.reuse.ep_name}} CRD Helm release is located (see previous step):

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

10. Run the following command to upgrade the Helm release that manages your {{site.data.reuse.ep_name}} CRDs:

    ```shell
    helm upgrade <crd_release_name> ibm-helm/ibm-ep-operator-crd
    ```

11. Run the following command to upgrade the Helm release of your operator installation. Switch to the right namespace if your CRD Helm release is in a different namespace to your operator.

    ```shell
    helm upgrade <ep_release_name> ibm-helm/ibm-ep-operator <install_flags>
    ```

Where:

- `<crd_release_name>` is the Helm release name of the Helm installation that manages the {{site.data.reuse.ep_name}} CRDs.
- `<ep_release_name>` is the Helm release name of the Helm installation of the operator.
- `<install_flags>` are any optional installation property settings, such as `--set watchAnyNamespace=true`.

**Note:**
After you completed the previous steps, you can restore your Flink instances as follows:

- If your Flink instance uses persistent storage, [restore the backed up Flink instance](../backup-restore/#restoring).
- If your Flink instance is an [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} for deploying advanced flows in [production environments](../../advanced/deploying-production), complete steps 1a, 1b, 1e, and 2c in [Build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner) to make use of the upgraded Flink image.

## Verifying the upgrade

After the upgrade, verify the status of the {{site.data.reuse.ep_name}} and Flink instances, by using the [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).
