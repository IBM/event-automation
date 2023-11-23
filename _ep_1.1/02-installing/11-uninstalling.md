---
title: "Uninstalling"
excerpt: "Uninstalling Event Processing."
categories: installing
slug: uninstalling
toc: true
---

Find out how to remove your {{site.data.reuse.ep_name}} and related Flink deployments.

## Uninstalling instances

### By using the OpenShift web console

To delete a Flink instance:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_flink}}
4. In the **Operator Details** panel, select the **Flink Deployment** tab to show the  {{site.data.reuse.ep_name}} instances in the selected namespace.
5. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the instance to be deleted to open the actions menu.
6. Click the **Delete FlinkDeployment** menu option to open the confirmation panel.
7. Check the namespace and instance name and click **Uninstall** to shutdown the associated pods and delete the instance.

To delete an {{site.data.reuse.ep_name}} instance:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_ep}}
4. In the **Operator Details** panel, select the **Event Processing** tab to show the  {{site.data.reuse.ep_name}} instances in the selected namespace.
5. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the instance to be deleted to open the actions menu.
6. Click the **Delete EventProcessing** menu option to open the confirmation panel.
7. Check the namespace and instance name and click **Delete** to shutdown the associated pods and delete the instance.

#### Check uninstallation progress

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Workloads** dropdown and select **Pods** to open the **Pods** dashboard.
3. Click **Select All Filters** to display pods in any state.
4. Enter the name of the {{site.data.reuse.ep_name}} or the Flink instance being deleted in the **Filter by name** box.
5. Wait for all the {{site.data.reuse.ep_name}} or the Flink instance pods to be displayed as **Terminating** and then be removed from the list.

#### Removing persistence resources

If you had enabled persistence for the {{site.data.reuse.ep_name}} and the Flink instance, but set the `deleteClaim` storage property to `false`, you need to manually remove the associated Persistent Volumes (PVs) and Persistent Volume Claims (PVCs) that were created at installation time.

The `deleteClaim` property is configured in the `EventProcessing` and the `FlinkDeployment` custom resource and can be set to `true` during installation to ensure the PVs and PVCs are automatically removed when the instance is deleted.

You can find this property under `spec.<component_name>.storage.deleteClaim`.

**Important:** This change will cause data to be removed during an upgrade.

To remove any remaining storage, delete the PVCs first, and then delete any remaining PVs as follows.

Delete the Persistent Volume Claims (PVCs) related to {{site.data.reuse.ep_name}} and Flink as follows:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Storage** dropdown and select **Persistent Volume Claims** to open the **Persistent Volume Claims** page.
3. In the **Project** dropdown select the required namespace.
4. Click **Select All Filters** to display PVCs in any state.
5. For each PVC to be deleted, make a note of the **Persistent Volume** listed for that PVC and then click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** to open the actions menu.
6. Click the **Delete Persistent Volume Claim** menu option to open the confirmation panel.
7. Check the PVC name and namespace, then click **Delete** to remove the PVC.

Delete remaining Persistent Volumes (PVs) related to {{site.data.reuse.ep_name}} and Flink as follows:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Storage** dropdown and select **Persistent Volumes** to open the **Persistent Volumes** page.
3. In the **Project** dropdown select the required namespace.
4. For each PV you made a note of when deleting PVCs, click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** to open the actions menu.
5. Click the **Delete Persistent Volume** menu option to open the confirmation panel.
6. Check the PV name and click **Delete** to remove the PV.

### By using the CLI

You can delete your Flink and {{site.data.reuse.ep_name}} instances by using the `kubectl` command-line tool:

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.ep_name}} and Flink instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. Run the following commands to delete your {{site.data.reuse.ep_name}} and Flink instances from the project:

   ```shell
   kubectl delete eventprocessing --all
   kubectl delete flinkdeployment --all
   ```

#### Check uninstallation progress

Run the following command to check the progress:

```shell
kubectl get pods --selector app.kubernetes.io/instance=<instance_name>
```

Pods will initially display a **STATUS** `Terminating` and then be removed from the output as they are deleted.

```shell
$ kubectl get pods --selector app.kubernetes.io/instance=quick-start
>
NAME                                              READY     STATUS        RESTARTS   AGE
quick-start-flink-kubernetes-65f555b884-fvtks     0/2       Terminating   0          7d17h
quick-start-flink-stream-authoring-ep-sts-0       0/1       Terminating   0          46h
quick-start-flink-ep-operator-578556d4cc-p5w58    0/1       Terminating   0          7d11h
```

#### Removing persistence resources

If you had enabled persistence for the {{site.data.reuse.ep_name}} and the Flink instance, but set the `deleteClaim` storage property to `false`, you must manually remove the associated Persistent Volumes (PVs) and Persistent Volume Claims (PVCs) that were created at installation time.

The `deleteClaim` property is configured in the `EventProcessing` and the `FlinkDeployment` custom resource and can be set to `true` during installation to ensure the PVs and PVCs are automatically removed when the instance is deleted.

You can find this property under `spec.<component_name>.storage.deleteClaim`.

**Important:** This change will cause data to be removed during an upgrade.

To remove any remaining storage, delete the PVCs first, and then delete any remaining PVs as follows.

Delete the PVCs:

1. Run the following command to list the remaining PVCs associated with the deleted instances:

   ```shell
   kubectl get pvc --selector app.kubernetes.io/instance=<instance_name>
   ```

2. Run the following to delete a PVC:

   ```shell
   kubectl delete pvc <pvc_name>
   ```

Delete remaining PVs:

1. Run the following command to list the remaining PVs:

   ```shell
   kubectl get pv
   ```

2. Run the following command to delete any PVs that were listed in the **Volume** column of the deleted PVCs.

   ```shell
   kubectl delete pv <pv_name>
   ```

**Note:** Take extreme care to select the correct PV name to ensure you do not delete storage associated with a different application instance.

## Uninstalling operators

### By using the OpenShift web console

To delete the {{site.data.reuse.flink_long}}:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** and click **Installed Operators**.
3. In the **Project** dropdown select the required namespace. For cluster-wide operators, select the `openshift-operators` project.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the {{site.data.reuse.flink_long}} to be deleted to open the actions menu.
5. Click the **Uninstall Operator** menu option to open the confirmation panel.
6. Check the namespace and operator name, then click **Remove** to uninstall the operator.

To delete the {{site.data.reuse.ep_name}} operator:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** and click **Installed Operators**.
3. In the **Project** dropdown select the required namespace. For cluster-wide operators, select the `openshift-operators` project.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the {{site.data.reuse.ep_name}} operator to be deleted to open the actions menu.
5. Click the **Uninstall Operator** menu option to open the confirmation panel.
6. Check the namespace and operator name, then click **Remove** to uninstall the operator.

### By using the OpenShift CLI (`oc`)

Run the following commands to uninstall your {{site.data.reuse.ep_name}} operator and the {{site.data.reuse.flink_long}} from the namespace:

```shell
oc delete subscription ibm-eventprocessing
oc delete subscription ibm-eventautomation-flink

oc delete clusterserviceversion ibm-eventprocessing.v<version>
oc delete clusterserviceversion ibm-eventautomation-flink.v<version>
```

Where `<version>` is the version of your operator. For example:

```shell
oc delete clusterserviceversion ibm-eventprocessing.v{{site.data.reuse.ep_current_version}}
oc delete clusterserviceversion ibm-eventautomation-flink.v{{site.data.reuse.flink_operator_current_version}}
```

To see the version of your operators, run the following commands:

```shell
oc get subscription ibm-eventprocessing -o yaml | grep currentCSV
oc get subscription ibm-eventautomation-flink -o yaml | grep currentCSV
```

### By using the Helm CLI (`helm`)

Run the following commands to uninstall your {{site.data.reuse.ep_name}} operator and the {{site.data.reuse.flink_long}} from the namespace:

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.ep_name}} and flink operators are installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. List your Helm releases and identify the releases that matches the {{site.data.reuse.ep_name}} operator and the {{site.data.reuse.flink_long}}:

   ```shell
   helm list
   ```

4. Uninstall the operators by using the following commands:

   ```shell
   helm uninstall <eventprocessing-operator-release-name>
   helm uninstall <eventautomation-flink-operator-release-name>
   ```

## Uninstalling IBM Cert Manager

Follow the instructions in the [{{site.data.reuse.icpfs}} documentation](https://www.ibm.com/docs/en/cloud-paks/foundational-services/4.0?topic=manager-manual-steps-uninstalling-singleton-services-cert){:target="_blank"} to uninstall the singleton services.

To delete the IBM Cert Manager operator by using the OpenShift web console:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** and click **Installed Operators**.
3. In the **Project** dropdown select the required namespace. For cluster-wide operators, select the `openshift-operators` project.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the Cert Manager operator to be deleted to open the actions menu.
5. Click the **Uninstall Operator** menu option to open the confirmation panel.
6. Check the namespace and operator name, then click **Remove** to uninstall the operator.


## Removing the secrets

Secrets that are created by the Cert Manager are not deleted automatically. You must manually delete any secrets that you do not want.

### By using the OpenShift web console

To delete {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}} secrets by using the web console:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Workloads** dropdown and select **Secrets** to open the **Secrets** dashboard.
3. The secrets created for Flink and {{site.data.reuse.ep_name}} begin with the name of your {{site.data.reuse.ep_name}} and Flink instances.
4. Search the instance by name and click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the secret to be deleted to open the actions menu.
5. Click the **Delete Secret** menu option to open the confirmation panel.
6. Check the name of the secret and click **Delete** to remove the secret.

### By using the CLI

To delete {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}} secrets by using the CLI:

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are using the namespace where your {{site.data.reuse.ep_name}} operator was located:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. List the secrets and identify any that match the instance you deleted. The secrets created for {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}} begin with the name of your {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}} instances.

   ```shell
   kubectl get secrets
   ```

4. Delete the relevant secrets:

   ```shell
   kubectl delete secret <secretName>
   ```

## Removing {{site.data.reuse.ep_name}} Custom Resource Definitions

The {{site.data.reuse.flink_long}} and the {{site.data.reuse.ep_name}} Custom Resource Definitions (CRDs) are not deleted automatically. You must manually delete any CRDs that you do not want.

### By using the OpenShift web console

To delete Flink CRDs:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Administration** and click **CustomResourceDefinitions**.
3. Enter `flinkdeployment` in the **Filter by name** box to filter the CRDs associated with {{site.data.reuse.flink_long}}.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the CRD to be deleted to open the actions menu.
5. Click the **Delete Custom Resource Definition** menu option to open the confirmation panel.
6. Check the name of the CRD and click **Delete** to remove the CRD.

To delete {{site.data.reuse.ep_name}} CRDs:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Administration** and click **CustomResourceDefinitions**.
3. Enter `eventprocessing` in the **Filter by name** box to filter the CRDs associated with {{site.data.reuse.ep_name}}.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the CRD to be deleted to open the actions menu.
5. Click the **Delete Custom Resource Definition** menu option to open the confirmation panel.
6. Check the name of the CRD and click **Delete** to remove the CRD.

### By using the Helm CLI

If you are running on other Kubernetes platforms, you can simply uninstall the Helm releases that are managing the {{site.data.reuse.ep_name}} and {{site.data.reuse.flink_long}} CRDs. Run the following commands to delete the CRDs:

```shell
helm uninstall <eventprocessing-operator-crd-release-name>
helm uninstall <eventautomation-flink-operator-crd-release-name>
```