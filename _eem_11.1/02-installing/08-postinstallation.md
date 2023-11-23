---
title: "Post-installation tasks"
excerpt: "Post-installation tasks after successfully installing Event Endpoint Management."
categories: installing
slug: post-installation
toc: true
---

 Consider the following tasks after installing {{site.data.reuse.eem_name}}.
 
## Verifying an installation

To verify that your {{site.data.reuse.eem_name}} installation deployed successfully, you can check the status of your
instance either by using the command line (CLI), or if running on {{site.data.reuse.openshift_short}}, by using the web console (UI).

### Using the {{site.data.reuse.openshift_short}} UI

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}
4. Select the **{{site.data.reuse.eem_name}}** tab.
5. The **Status** column will display the current state of the `EventEndpointManagement` custom resource. When the 
{{site.data.reuse.eem_name}} instance is ready, the status will display `Phase: Running`.

### Using the CLI

After all the components of an {{site.data.reuse.eem_name}} instance are active and ready, the `EventEndPointManagement`
custom resource will have a `Running` phase in the status.

To verify the status:

1. Run the `kubectl get` command as follows:

   ```shell
   kubectl get eventendpointmanagement <instance-name> -n <namespace> -o jsonpath='{.status.phase}'
   ```

   An example output for a successful deployment:

   ```shell
   $ kubectl get eventendpointmanagement development -n eem -o jsonpath='{.status.phase}'
   Running
   ```

**Note:** It might take several minutes for all the resources to be created and the instance to become ready.


## Setting up access

After the {{site.data.reuse.eem_name}} instance is successfully created, set up user authentication and authorization
for your chosen implementation. {{site.data.reuse.eem_name}} supports locally defined authentication for testing
purposes and [OpenID Connect (OIDC) authentication](https://openid.net/connect/){:target="_blank"} for production purposes.

- If you have selected `LOCAL` authentication, ensure you create user credentials before you access the
{{site.data.reuse.eem_name}} instance.  For more information, see [managing access](../../security/managing-access).
- After setting up `LOCAL` or `OIDC` authentication, assign users to roles. For more information, see [managing roles](../../security/user-roles).


## Verifying the Event Gateway configuration

To verify the gateway configuration:

1. Login to your {{site.data.reuse.eem_name}} instance with your configured credentials
2. Navigate to the **Gateways** page on the toolbar on the left side of the page.
3. The **Gateways** page displays all the Event Gateway instances registered with the {{site.data.reuse.eem_manager}} instance and their
configuration status. Verify that the Event Gateway you have configured is present in the table.


## Backup the data encryption key

The secret `<instance-name>-ibm-eem-mek` contains an important key for decrypting the data stored by {{site.data.reuse.eem_name}}. Ensure you back up and store the key safely outside your cluster.

To save the key to a file, complete the following steps.

1. Run the following command to retrieve the encryption secret.

   ```shell
   kubectl get secret <instance-name>-ibm-eem-mek -n <namespace>
   ```

2. Create a backup of the encryption secret with the command:

   ```shell
   kubectl get secret <instance-name>-ibm-eem-mek -n <namespace> -o yaml > encryption-secret.yaml
   ```

   This command retrieves the encryption secret in YAML format and redirects the output to a file named `encryption-secret.yaml`.

3. Ensure that the backup file (`encryption-secret.yaml`) is stored in a secure location outside the cluster.

## Validating a usage-based deployment

You can confirm if a usage-based deployment is operating as expected by checking the logs and the `/ready` endpoint of a running {{site.data.reuse.eem_name}} manager instance.

When starting, verify the {{site.data.reuse.eem_name}} manager logs if it is operating in usage-based mode. If it is, the manager will perform an initial test of the provided configuration settings. The following is an example of a successful check:

```shell
...
<DATETIME> INFO  com.ibm.ei.eim.ubp.UBPCollector (UBP Collector) - [configReceived:181] Usage Based Pricing enabled : License Service reporting usage to: <ENDPOINT>
...
<DATETIME> INFO  com.ibm.ei.eim.ubp.UBPCollector (UBP Collector) - [lambda$configReceived$8:188] Usage Based Pricing configuration test successful..
...
```

If at any time an issue occurs when reporting metrics, including the initial test, a message is written to the logs, detailing the cause of the error, and the payload which was being sent. The following is an example of an error message:

```shell
...
<DATETIME> WARN  com.ibm.ei.eim.ubp.UBPCollector (UBP Collector) - [lambda$sendMetrics$18:295] Failed to send data to the license service : <ENDPOINT> : <ERROR> : <PAYLOAD>
```

**Note:** If an error occurs when submitting the number of API calls to the Licensing Service, the actual number of API calls made is not lost. They will be reported, in addition to any new API calls, in the next submission.

This message and status is also available in the {{site.data.reuse.eem_name}} manager component `/ready` endpoint on port 8081, under the `UBP.Reporting.Status` ID. This endpoint can be queried at any time. The following is an example query:

```shell
kubectl exec $(kubectl get pod -l app.kubernetes.io/instance=<INSTANCE_NAME> -n <NAMESPACE> -o name) -n <NAMESPACE> curl http://localhost:8081/ready
```

The result will return the current status of the gateway. The following is an example result of a healthy system with usage-based licensing configured:

```json
{
  "code" : 200,
  "body" : {
    "components" : [ {
      "id" : "GatewayServices",
      "description" : "ok",
      "code" : 200,
      "conditions" : [ ]
    }, {
      "id" : "FileStorageProvider",
      "description" : "ok",
      "code" : 200,
      "conditions" : [ ]
    }, {
      "id" : "UBP.Reporting.Status",
      "description" : "ok",
      "code" : 200,
      "conditions" : [ ]
    }, {
      "id" : "EEMUI",
      "description" : "ok",
      "code" : 200,
      "conditions" : [ ]
    }, {
      "id" : "OperatorServices",
      "description" : "ok",
      "code" : 200,
      "conditions" : [ ]
    } ],
    "readyComponentCount" : 5,
    "notReadyComponentCount" : 0,
    "code" : 200,
    "status" : "ok"
  }
}
```

The following is an example result of a system that has usage-based licensing configured, but is running with errors:

```json
{
  "code" : 503,
  "body" : {
    "components" : [ {
      "id" : "GatewayServices",
      "description" : "ok",
      "code" : 200,
      "conditions" : [ ]
    }, {
      "id" : "FileStorageProvider",
      "description" : "ok",
      "code" : 200,
      "conditions" : [ ]
    }, {
      "id" : "UBP.Reporting.Status",
      "description" : "Failed to send data to the license service : https://ibm-licensing-service-instance.ibm-common-services.svc.cluster.local:8089/v2/metric_upload?token=cEDdqE9sodSl8n87Vz82Im39 : No route to host: ibm-licensing-service-instance.ibm-common-services.svc.cluster.local/172.30.42.210:8089 : {\"cloudpakId\":\"279abae6bfe647eca1f0efcbf136099c\",\"cloudpakName\":\"IBM Cloud Pak for Integration - API Calls\",\"productId\":\"3af7dda8ce3e4369b1c461c2982719c8\",\"productName\":\"IBM {{site.data.reuse.eem_name}} Non Production\",\"productMetric\":\"MONTHLY_API_CALL\",\"productCloudpakRatio\":\"2:1\",\"cloudpakMetric\":\"RESOURCE_VALUE_UNIT\",\"aggregationPolicy\":\"ADD\",\"metricValue\":0}",
      "code" : 500,
      "conditions" : [ ]
    }, {
      "id" : "EEMUI",
      "description" : "ok",
      "code" : 200,
      "conditions" : [ ]
    }, {
      "id" : "OperatorServices",
      "description" : "ok",
      "code" : 200,
      "conditions" : [ ]
    } ],
    "readyComponentCount" : 4,
    "notReadyComponentCount" : 1,
    "code" : 503,
    "status" : "Not ready"
  }
}
```

## Updating and renewing certificates

After installing {{site.data.reuse.eem_name}}, you can manage your certificates with the Cert Manager operator.

**Important:** When updating or renewing certificates, it is important to also update the `spec.tls.caSecretName` configuration (or `ca.pem` if deployed as a stand-alone gateway) of any {{site.data.reuse.egw}} in step with updates made to the {{site.data.reuse.eem_manager}} instance they are registered with. Communication between the {{site.data.reuse.egw}} and Manager will fail until the certificate configuration is updated.

### Renew an existing certificate

You can use Cert Manager to renew and regenerate a certificate if the secret for the certificate is deleted. You can also use the Cert Manager to renew your expired certificates.

#### By using `cmctl`

Cert Manager provides the cert-manager Command Line Tool (`cmctl`) for managing and renewing certificates.

1. Install the [cert-manager Command Line Tool (`cmctl`)](https://cert-manager.io/docs/reference/cmctl/#installation){:target="_blank"}.
2. {{site.data.reuse.cncf_cli_login}}
3. Ensure you are in the namespace where your {{site.data.reuse.eem_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

4. View the certificates of your {{site.data.reuse.eem_name}} instance by running the following command:

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


#### By using the {{site.data.reuse.openshift_short}} web console

If running on the {{site.data.reuse.openshift_short}}, you can also renew a certificate by deleting the existing secret in the OpenShift web console as follows:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}
4. {{site.data.reuse.task_openshift_select_instance_eem}}
5. In the **EventEndpointManagement details** dashboard, scroll down and locate the **Ca Secret Name** field, and then click the linked secret.
6. Click the **Actions** menu, and select **Delete secret**.

  **Note:** Following deleting the secret, you will be navigated back to the **Secrets** page. Your deleted secret will have been regenerated with a new value, which will be used for your certificate in the IBM Cert Manager. 

#### By using the CLI

You can also renew a certificate by deleting the existing secret. You can do this by using the `kubectl` command as follows:

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.eem_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. Run the following command to display the {{site.data.reuse.eem_name}} instances:

   ```shell
   kubectl get eventendpointmanagement
   ```

4. Run the following command to display the name of the secret representing the certificate for {{site.data.reuse.eem_name}}:

   ```shell
   kubectl get eventendpointmanagement <instance_name> --template '{ {.spec.manager.tls.caSecretName} }'
   ```

5. Run the following command to delete and regenerate the value of the certificate:

   ```shell
   kubectl delete secret <secret_name>
   ```

### Update a certificate to use an external secret

You can provide an externally generated certificate to Cert Manager. To use an externally generated certificate, update the {{site.data.reuse.eem_name}} instance to use the external certificate as follows.

#### Generate a certificate externally

You can generate a certificate externally to register with {{site.data.reuse.eem_name}}. There are several ways to generate a certificate externally. For example, you can create a certificate by using `openssl` as follows.

1. Generate a certificate key file by using `openssl`:
`openssl genrsa --out ca.key 4096`

2. Generate a CA certificate by using the key file:
`openssl req -new -x509 -sha256 -days 10950 -key ca.key -out ca.crt`

#### Register an externally generated certificate

Register an externally generated certificate with {{site.data.reuse.eem_name}} as follows.

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.eem_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. Encode your externally generated certificates to Base 64 format, and make a note of the values:

    `base64 -i ca.crt`

    `base64 -i ca.key`

4. Create a YAML file called `secret.yaml` with the following content:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: ibm-ca-secret
      namespace: <eem namespace>
    type: Opaque
    data:
      ca.crt: <base 64 value for ca.crt>
      tls.crt: <base 64 value for ca.crt>
      tls.key: <base 64 value for ca.key>
    ```

5. Apply the secret by running the following command:

   ```shell
   kubectl apply -f secret.yaml
   ```

6. Edit the custom resource of the {{site.data.reuse.eem_name}} instance by running the following command:  

   ```shell
   kubectl edit eventendpointmanagement <instance-name>
   ```

7. Locate and update the `spec.tls.caSecretName` field to `ibm-ca-secret`, then save and exit.

This will update the certificate used in your {{site.data.reuse.eem_name}} instance. Your pods will reload with the latest certificates in use.

**Note:** If you cannot log in to the {{site.data.reuse.eem_name}} UI after changing your CA certificates, see [troubleshooting](../../troubleshooting/changing-ca-certificate/) to resolve the error.