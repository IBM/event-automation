---
title: "Uninstalling"
excerpt: "Uninstalling Event Endpoint Management."
categories: installing
slug: uninstalling
toc: true
---

Find out how to remove {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} instances.
You can also remove the {{site.data.reuse.eem_name}} operator itself.

## Uninstalling instances

### By using the {{site.data.reuse.openshift_short}} web console

To delete an {{site.data.reuse.eem_name}} instance:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}
4. In the **Operator Details** panel, select the **Event Endpoint Management** tab to show the {{site.data.reuse.eem_name}} instances in the selected namespace.
5. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the instance to be deleted to open the actions menu.
6. Click the **Delete EventEndpointManagement** menu option to open the confirmation panel.
7. Check the namespace and instance name and click **Delete** to shutdown the associated pods and delete the instance.

To delete an {{site.data.reuse.egw}} instance in an OpenShift cluster:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}
4. In the **Operator Details** panel, select the **Event Gateway** tab to show the {{site.data.reuse.egw}} instances in the selected namespace.
5. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the instance to be deleted to open the actions menu.
6. Click the **Delete EventGateway** menu option to open the confirmation panel.
7. Check the namespace and instance name, and then click **Delete** to shutdown the associated pods and delete the instance.

#### Check uninstallation progress

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Workloads** dropdown and select **Pods** to open the **Pods** dashboard.
3. Click **Select All Filters** to display pods in any state.
4. Enter the name of the {{site.data.reuse.eem_name}} instance being deleted in the **Filter by name** box.
5. Wait for all the {{site.data.reuse.eem_name}} pods to be displayed as **Terminating** and then be removed from the list.

#### Removing persistence resources

If you had enabled persistence for the {{site.data.reuse.eem_name}} instance but set the `deleteClaim` storage property to `false`, you will need to manually remove the associated Persistent Volumes (PVs) and Persistent Volume Claims (PVCs) that were created at installation time.

The `deleteClaim` property is configured in the `EventEndpointManagement` custom resource and can be set to `true` during installation to ensure the PVs and PVCs are automatically removed when the instance is deleted. 

You can find this property under `spec.<component_name>.storage.deleteClaim`.

**Important:** This change will cause data to be removed during an upgrade.

To remove any remaining storage, delete the PVCs first, and then delete any remaining PVs as follows.

Delete the Persistent Volume Claims (PVCs):

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Storage** dropdown and select **Persistent Volume Claims** to open the **Persistent Volume Claims** page.
3. In the **Project** dropdown select the required namespace.
4. Click **Select All Filters** to display PVCs in any state.
5. Enter the name of the {{site.data.reuse.eem_name}} instance in the **Filter by name** box.
6. For each PVC to be deleted, make a note of the **Persistent Volume** listed for that PVC and then click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** to open the actions menu.
7. Click the **Delete Persistent Volume Claim** menu option to open the confirmation panel.
8. Check the PVC name and namespace, then click **Delete** to remove the PVC.

Delete remaining Persistent Volumes (PVs):

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Storage** dropdown and select **Persistent Volumes** to open the **Persistent Volumes** page.
3. In the **Project** dropdown select the required namespace.
4. For each PV you made a note of when deleting PVCs, click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** to open the actions menu.
5. Click the **Delete Persistent Volume** menu option to open the confirmation panel.
6. Check the PV name and click **Delete** to remove the PV.


### By using the CLI

You can delete an {{site.data.reuse.eem_name}} instance using the `oc` command-line tool:

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure you are using the project where your {{site.data.reuse.eem_name}} instance is located:

   ```shell
   oc project <project_name>
   ```

3. Run the following command to display the {{site.data.reuse.eem_name}} instances:

   ```shell
   oc get eventendpointmanagement
   ```

4. Run the following command to delete your instance:

   ```shell
   oc delete eventendpointmanagement --selector app.kubernetes.io/instance=<instance_name>
   ```

To delete an {{site.data.reuse.egw}} instance using the `oc` command-line tool:

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure you are using the project where your {{site.data.reuse.egw}} instance is located:

   ```shell
   oc project <project_name>
   ```

3. Run the following command to display the {{site.data.reuse.egw}} instances:

   ```shell
   oc get eventgateway
   ```

4. Run the following command to delete your instance:

   ```shell
   oc delete eventgateway --selector app.kubernetes.io/instance=<instance_name>
   ```

#### Check uninstallation progress

Run the following command to check the progress:

```shell
oc get pods --selector app.kubernetes.io/instance=<instance_name>
```

Pods will initially display a **STATUS** `Terminating` and then be removed from the output as they are deleted.

```shell
$ oc get pods --selector app.kubernetes.io/instance=minimal-prod
>
NAME                                                 READY     STATUS        RESTARTS    AGE
minimal-prod-ibm-eem-manager-0                       0/1       Terminating   0           10s
minimal-prod-gw-ibm-egw-gateway-664b4f8998-52bqc     0/1       Terminating   0           15h
```

#### Removing persistence resources

If you had enabled persistence for the {{site.data.reuse.eem_name}} instance but set the `deleteClaim` storage property to `false`, you will need to manually remove the associated Persistent Volumes (PVs) and Persistent Volume Claims (PVCs) that were created at installation time.

The `deleteClaim` property is configured in the `EventEndpointManagement` custom resource and can be set to `true` during installation to ensure the PVs and PVCs are automatically removed when the instance is deleted.

**Note:** You do not need to configure `deleteClaim` property for the `EventGateway` custom resource. {{site.data.reuse.egw}} instance does not have any PVs and PVCs.

You can find this property under `spec.<component_name>.storage.deleteClaim`.

**Important:** This change will cause data to be removed during an upgrade.

To remove any remaining storage, delete the PVCs first, and then delete any remaining PVs as follows.

Delete the PVCs:

1. Run the following command to list the remaining PVCs associated with the deleted instance:

   ```shell
   oc get pvc --selector app.kubernetes.io/instance=<instance_name>
   ```

2. Run the following to delete a PVC:

   ```shell
   oc delete pvc <pvc_name>
   ```

Delete remaining PVs:

1. Run the following command to list the remaining PVs:

   ```shell
   oc get pv
   ```

2. Run the following command to delete any PVs that were listed in the **Volume** column of the deleted PVCs: 

   ```shell
   oc delete pv <pv_name>
   ```

**Note:** Take extreme care to select the correct PV name to ensure you do not delete storage associated with a different application instance.


## Uninstalling the {{site.data.reuse.eem_name}} operator

To delete the {{site.data.reuse.eem_name}} operator:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. In the **Project** dropdown select the required namespace. For cluster-wide operators, select the `openshift-operators` project.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the {{site.data.reuse.eem_name}} operator to be deleted to open the actions menu.
5. Click the **Uninstall Operator** menu option to open the confirmation panel.
6. Check the namespace and operator name, then click **Remove** to uninstall the operator.

## Uninstalling the IBM Cert Manager

To delete the IBM Cert Manager operator:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. In the **Project** dropdown select the required namespace. For cluster-wide operators, select the `openshift-operators` project.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the IBM Cert Manager operator to be deleted to open the actions menu.
5. Click the **Uninstall Operator** menu option to open the confirmation panel.
6. Check the namespace and operator name, then click **Remove** to uninstall the operator.

## Removing {{site.data.reuse.eem_name}} Custom Resource Definitions

The {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} Custom Resource Definitions (CRDs) are not deleted automatically. You must manually delete any CRDs that you do not want:

To delete {{site.data.reuse.eem_name}} CRDs:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Administration** and click **CustomResourceDefinitions**.
3. Enter `EventEndpointManagement` in the **Filter by name** box to filter the CRDs associated with {{site.data.reuse.eem_name}}.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the CRD to be deleted to open the actions menu.
5. Click the **Delete CustomResourceDefinition** menu option to open the confirmation panel.
6. Check the name of the CRD and click **Delete** to remove the CRD.

To delete {{site.data.reuse.egw}} CRDs:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Administration** and click **CustomResourceDefinitions**.
3. Enter `EventGateway` in the **Filter by name** box to filter the CRDs associated with {{site.data.reuse.egw}}.
4. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the CRD to be deleted to open the actions menu.
5. Click the **Delete CustomResourceDefinition** menu option to open the confirmation panel.
6. Check the name of the CRD and click **Delete** to remove the CRD.

## Removing the secrets

Secrets that are created by the IBM Cert Manager are not are not deleted automatically. You must manually delete any secrets that you do not want.

To delete {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} secrets by using the web console:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Workloads** dropdown and select **Secrets** to open the **Secrets** dashboard.
3. The secrets created for {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} begin with the name of your {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} instances.
4. Search the instance by name and click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the secret to be deleted to open the actions menu.
5. Click the **Delete Secret** menu option to open the confirmation panel.
6. Check the name of the secret and click **Delete** to remove the secret.

## Uninstalling a stand-alone Event Gateway

To remove a stand-alone Event Gateway:

1. Run the following command to list the running containers:

   ```
   docker ps
   ```

2. Locate the stand-alone gateway in the list and stop the gateway container:

   ```shell
   docker stop <container_id>
   ```

3. After the container is stopped, delete the stand-alone gateway container and image:

   ```shell
   docker rm <stand-alone-gateway_container>
   ```

   ```shell
   docker rmi <stand-alone-gateway_image_name>
   ```
