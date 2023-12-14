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
of your instances either by using the command line (CLI), or if running on {{site.data.reuse.openshift_short}}, by using the web console (UI).


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

### Using the CLI

After all the components of an {{site.data.reuse.ep_name}} instance are active and ready, the `EventProcessing` custom resource will have a `Running` phase in the status.

To verify the status:

1. {{site.data.reuse.cncf_cli_login}}
2. For {{site.data.reuse.ep_name}}, run the following command:

   ```sh
   kubectl get eventprocessing <instance-name> -n <namespace> -o jsonpath='{.status.phase}'
   ```

   An example output for a successful deployment:

   ```sh
   kubectl get eventprocessing development -n myepnamespace -o jsonpath='{.status.phase}'
   Running
   ```

3. For Flink, run the following commands:

   ```sh
   kubectl get flinkdeployment <instance-name> -n <namespace> -o jsonpath='{.status.lifecycleState}'
   kubectl get flinkdeployment <instance-name> -n <namespace> -o jsonpath='{.status.jobManagerDeploymentStatus}'
   ```

   An example output for a successful deployment:

   ```sh
   kubectl get flinkdeployment session-cluster-quick-start -n myepnamespace -o jsonpath='{.status.lifecycleState}'
   STABLE
   kubectl get flinkdeployment session-cluster-quick-start -n myepnamespace -o jsonpath='{.status.jobManagerDeploymentStatus}'
   READY
   ```

**Note:** It might take several minutes for all the resources to be created and the instance to become ready.

## Setting up access

After the {{site.data.reuse.ep_name}} instance is successfully created, set up user authentication and authorization for your chosen implementation. {{site.data.reuse.ep_name}} supports locally defined authentication for testing purposes and [OpenID Connect (OIDC) authentication](https://openid.net/connect/){:target="_blank"} for production purposes.

- If you have selected `LOCAL` authentication, ensure you create user credentials before you access the {{site.data.reuse.ep_name}} instance.  For more information, see [managing access](../../security/managing-access).
- After setting up `LOCAL` or `OIDC` authentication, assign users to roles. For more information, see [managing roles](../../security/user-roles).

## Backup the data encryption key

The secret `<instance-name>-ibm-ep-mek` contains an important key for decrypting the data stored by {{site.data.reuse.ep_name}}. Ensure you back up and store the key safely outside your cluster.

To save the key to a file, complete the following steps.

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to retrieve the encryption secret:

   ```sh
   kubectl get secret <instance-name>-ibm-ep-mek -n <namespace>
   ```

3. Create a backup of the encryption secret with the command:

   ```sh
   kubectl get secret <instance-name>-ibm-ep-mek -n <namespace> -o yaml > encryption-secret.yaml
   ```

   This command retrieves the encryption secret in YAML format and redirects the output to a file named `encryption-secret.yaml`.

4. Ensure that the backup file (`encryption-secret.yaml`) is stored in a secure location outside the cluster.

## Updating and renewing certificates

After installing {{site.data.reuse.ep_name}}, you can manage your certificates with the Cert Manager operator. Follow the instructions to update and renew your certificates.

### Renew an existing certificate

You can use the Cert Manager to renew and regenerate a certificate if the secret for the certificate is deleted. You can also use the Cert Manager to renew your expired certificates.

#### By using the CLI

You can also renew a certificate by deleting the existing secret. You can do this by using the `kubectl` command as follows:

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.ep_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. Run the following command to display the {{site.data.reuse.ep_name}} instances:

   ```shell
   kubectl get eventprocessing
   ```

4. Run the following command to display the name of the secret representing the certificate for {{site.data.reuse.ep_name}}:

   ```shell
   kubectl get eventprocessing <instance_name> --template '{ {.spec.authoring.tls.caSecretName} }'
   ```

5. Run the following command to delete and regenerate the value of the certificate:

   ```shell
   kubectl delete secret <secret_name>
   ```

#### By using `cmctl`

Cert Manager provides the cert-manager Command Line Tool (`cmctl`) for managing and renewing certificates.

1. Install the [cert-manager Command Line Tool (`cmctl`)](https://cert-manager.io/docs/reference/cmctl/#installation){:target="_blank"}.
2. {{site.data.reuse.cncf_cli_login}}
3. Ensure you are in the namespace where your {{site.data.reuse.ep_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

4. View the certificates of your {{site.data.reuse.ep_name}} instance by running the following command:

   ```shell
   kubectl get certificate
   ```

5. View the status of an existing certificate by running the following command:

   ```shell
   cmctl status certificate <certificate_name>
   ```

6. Renew a certificate by running the following command:

   ```shell  
   cmctl renew <certificate_name>
   ```


#### By using the OpenShift web console

If running on the {{site.data.reuse.openshift_short}}, you can also renew a certificate by deleting the existing secret. You can do this in the OpenShift web console as follows:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_ep}}
4. {{site.data.reuse.task_openshift_select_instance_ep}}
5. In the **EventProcessing details** dashboard, scroll down and locate the **Ca Secret Name** field, and then click the linked secret.
6. Click the **Actions** menu, and select **Delete secret**.

  **Note:** Following deleting the secret, you will be navigated back to the **Secrets** page. Your deleted secret will have been regenerated with a new value, which will be used for your certificate in the IBM Cert Manager.

#### By using the OpenShift CLI (`oc`)

You can also renew a certificate by deleting the existing secret. You can do this by using the `oc` CLI as follows:

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure you are in the project where your {{site.data.reuse.ep_name}} instance is installed:

   ```shell
   oc project <project_name>
   ```

3. Run the following command to display the {{site.data.reuse.ep_name}} instances:

   ```shell
   oc get eventprocessing
   ```

4. Run the following command to display the name of the secret representing the certificate for {{site.data.reuse.ep_name}}:

   ```shell
   oc get eventprocessing <instance_name> --template '{ {.spec.authoring.tls.caSecretName} }'
   ```

5. Run the following command to delete and regenerate the value of the certificate:

   ```shell
   oc delete secret <secret_name>
   ```



### Update a certificate to use an external secret

You can provide an externally generated certificate to the Cert Manager. To use an externally generated certificate, update the {{site.data.reuse.ep_name}} instance to use the external certificate as follows.

#### Generate a certificate externally

You can generate a certificate externally to register with {{site.data.reuse.ep_name}}. There are several ways to generate a certificate externally. For example, you can create a certificate by using `openssl` as follows.

1. Generate a certificate key file by using `openssl`:

   ```shell
   openssl genrsa --out ca.key 4096
   ```

2. Generate a CA certificate by using the key file:

   ```shell
   openssl req -new -x509 -sha256 -days 10950 -key ca.key -out ca.crt
   ```

#### Register an externally generated certificate

Register an externally generated certificate with {{site.data.reuse.ep_name}} as follows.

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.ep_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. Encode your externally generated certificates to Base64 format, and make a note of the values:

    `base64 -i ca.crt`

    `base64 -i ca.key`

4. Create a YAML file called `secret.yaml` with the following content:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: ibm-ca-secret
      namespace: <ep namespace>
    type: Opaque
    data:
      ca.crt: <Base64 value for ca.crt>
      tls.crt: <Base64 value for ca.crt>
      tls.key: <Base64 value for ca.key>
    ```

5. Apply the secret by running the following command:

   ```shell
   kubectl apply -f secret.yaml
   ```

6. Edit the custom resource of the {{site.data.reuse.ep_name}} instance by running the following command:  

   ```shell
   kubectl edit eventprocessing <instance-name>
   ```

7. Locate and update the `spec.tls.caSecretName` field to `ibm-ca-secret`, then save and exit.

This will update the certificate used in your {{site.data.reuse.ep_name}} instance. Your pods will reload with the latest certificates in use.


