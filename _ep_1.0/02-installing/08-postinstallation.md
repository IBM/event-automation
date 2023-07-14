---
title: "Post-installation tasks"
excerpt: "Post-installation tasks after successfully installing Event Processing."
categories: installing
slug: post-installation
toc: true
---

Consider the following tasks after installing {{site.data.reuse.ep_name}} and Flink.

## Verifying an installation

To verify that your {{site.data.reuse.ep_name}} and Flink installations deployed successfully, you can check the status
of your instances either in the {{site.data.reuse.openshift_short}} web user interface (UI) or command line tool (CLI).


### Using the {{site.data.reuse.openshift_short}} UI

For {{site.data.reuse.ep_name}}:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_ep}}
4. Select the **EventProcessing** tab and search for the installed instance(s).
5. The **Status** column displays the current state of the `EventProcessing` custom resource. When the 
{{site.data.reuse.ep_name}} instance is ready, the phase displays `Phase: Running`.

For Flink:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_flink}}
4. Select the **FlinkDeployment** tab and click the installed instance.
5. Select the YAML tab. 
6. The `status` field displays the current state of the `FlinkDeployment` custom resource. When the Flink instance is ready, the custom resource displays `status.lifecycleState: STABLE` and `status.jobManagerDeploymentStatus: READY`.

### Using the {{site.data.reuse.openshift_short}} CLI

After all the components of an {{site.data.reuse.ep_name}} instance are active and ready, the `EventProcessing` custom resource will have a `Running` phase in the status.

To verify the status:

1. {{site.data.reuse.openshift_cli_login}}
2. For {{site.data.reuse.ep_name}}, run the following command:

   ```sh
   oc get eventprocessing <instance-name> -n <namespace> -o jsonpath='{.status.phase}'
   ```

   An example output for a successful deployment:

   ```sh
   oc get eventprocessing development -n myepnamespace -o jsonpath='{.status.phase}'
   Running
   ```

3. For Flink, run the following commands:

   ```sh
   oc get flinkdeployment <instance-name> -n <namespace> -o jsonpath='{.status.lifecycleState}'
   oc get flinkdeployment <instance-name> -n <namespace> -o jsonpath='{.status.jobManagerDeploymentStatus}'
   ```

   An example output for a successful deployment:

   ```sh
   oc get flinkdeployment session-cluster-quick-start -n myepnamespace -o jsonpath='{.status.lifecycleState}'
   STABLE
   oc get flinkdeployment session-cluster-quick-start -n myepnamespace -o jsonpath='{.status.jobManagerDeploymentStatus}'
   READY
   ```

**Note:** It might take several minutes for all the resources to be created and the instance to become ready.

## Setting up access

After the {{site.data.reuse.ep_name}} instance is successfully created, set up user authentication and authorization for your chosen implementation. {{site.data.reuse.ep_name}} supports locally defined authentication for testing purposes and [OpenID Connect (OIDC) authentication](https://openid.net/connect/){:target="_blank"} for production purposes.

- If you have selected `LOCAL` authentication, ensure you create user credentials before you access the {{site.data.reuse.ep_name}} instance.  For more information, see [managing access](../../security/managing-access).
- After setting up `LOCAL` or `OIDC` authentication, assign users to roles. For more information, see [managing roles](../../security/user-roles).

## Backup the data encryption key

The secret `<instance-name>-ibm-ep-mek` contains an important key for decrypting the data stored by
{{site.data.reuse.ep_name}}.  This key should be backed up and stored safely outside your OpenShift cluster.

To save the key to a file, complete the following steps.

1. {{site.data.reuse.openshift_ui_login}}
2. Run the following command to retrieve the encryption secret:

   ```sh
   oc get secret <instance-name>-ibm-ep-mek -n <namespace>
   ```

3. Create a backup of the encryption secret with the command:

   ```sh
   oc get secret <instance-name>-ibm-ep-mek -n <namespace> -o yaml > encryption-secret.yaml
   ```

   This command retrieves the encryption secret in YAML format and redirects the output to a file named `encryption-secret.yaml`.

4. Ensure that the backup file (`encryption-secret.yaml`) is stored in a secure location outside the OpenShift cluster.
