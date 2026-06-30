---
title: "Post-installation tasks"
excerpt: "Post-installation tasks after successfully installing Event Endpoint Management."
categories: installing
slug: post-installation
toc: true
---

Consider the following tasks after installing {{site.data.reuse.eem_name}}.
 
## Verifying an installation
{: #verifying-an-installation}

To verify that your {{site.data.reuse.eem_name}} installation deployed successfully, you can check the status of your
instance either by using the command line (CLI), or if you are running on {{site.data.reuse.openshift_short}}, by using the web console (UI).

### Using the {{site.data.reuse.openshift_short}} UI
{: #using-the-openshift-ui}

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}
4. Select the **{{site.data.reuse.eem_name}}** tab.
5. The **Status** column displays the current state of the `EventEndpointManagement` custom resource. When the 
{{site.data.reuse.eem_manager}} instance is ready, the status displays `Phase: Running`.

### Using the CLI
{: #using-the-cli}

After all the components of an {{site.data.reuse.eem_manager}} instance are active and ready, the `EventEndPointManagement`
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
{: #setting-up-access}

After the {{site.data.reuse.eem_manager}} instance is successfully created, set up user authentication, authorization, and roles
for your chosen implementation.

- LOCAL: Define a list of users and passwords locally in your {{site.data.reuse.eem_name}} environment.
- OIDC: Use an existing [OIDC-compatible](https://openid.net/connect/){:target="_blank"} security provider that is available in your environment.
- INTEGRATION_KEYCLOAK: Use an {{site.data.reuse.cp4i}} installation on the same cluster to manage users and roles.

Authentication is configured in the `EventEndpointManagement` custom resource.

The following code snippet is an example of a configuration that has authentication set to LOCAL.

   ```yaml
   apiVersion: events.ibm.com/v1beta1
   kind: EventEndpointManagement
   ...
   spec:
     ...
     manager:
       authConfig:
          authType: LOCAL
     ...
   ```

Edit the `spec.manager.authConfig` section to include `authType` as `LOCAL`, `OIDC`, or `INTEGRATION_KEYCLOAK` as required.

For more information, see [managing access](../../security/managing-access) and [managing roles](../../security/user-roles).


## Backup the data encryption key
{: #backup-the-data-encryption-key}

The secret `<instance-name>-ibm-eem-mek` contains an important key for decrypting the data that is stored by {{site.data.reuse.eem_name}}. Ensure you back up and store the key safely outside your cluster.

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
{: #validating-a-usage-based-deployment}

You can confirm if a usage-based deployment is operating as expected by checking the logs and the `/ready` endpoint of a running {{site.data.reuse.eem_manager}} instance.

When you start the {{site.data.reuse.eem_manager}} instance, verify in the {{site.data.reuse.eem_manager}} logs if it is operating in usage-based mode. If it is, the Manager performs an initial test of the provided configuration settings. The following example shows a successful check:

```shell
...
<DATETIME> INFO  com.ibm.ei.eim.ubp.UBPCollector (UBP Collector) - [configReceived:181] Usage Based Pricing enabled : License Service reporting usage to: <ENDPOINT>
...
<DATETIME> INFO  com.ibm.ei.eim.ubp.UBPCollector (UBP Collector) - [lambda$configReceived$8:188] Usage Based Pricing configuration test successful..
...
```

If at any time an issue occurs when reporting metrics, including the initial test, a message is written to the logs, detailing the cause of the error, and the payload that was being sent. The following example shows an error message:

```shell
...
<DATETIME> WARN  com.ibm.ei.eim.ubp.UBPCollector (UBP Collector) - [lambda$sendMetrics$18:295] Failed to send data to the license service : <ENDPOINT> : <ERROR> : <PAYLOAD>
```

**Note:** If an error occurs when submitting the number of API calls to the Licensing Service, the actual number of API calls made is not lost. They will be reported, in addition to any new API calls, in the next submission.

This message and status is also available in the {{site.data.reuse.eem_manager}} instance `/ready` endpoint on port 8081, under the `UBP.Reporting.Status` ID. This endpoint can be queried at any time. The following example shows a query:

```shell
kubectl exec $(kubectl get pod -l app.kubernetes.io/instance=<INSTANCE_NAME> -n <NAMESPACE> -o name) -n <NAMESPACE> curl http://localhost:8081/ready
```

The result returns the current status of the gateway. The following example shows the result from a healthy system with usage-based licensing configured:

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

The following example shows the result of a system that has usage-based licensing configured, but is running with errors:

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
      "description" : "Failed to send data to the license service : https://ibm-licensing-service-instance.ibm-common-services.svc.example.com:8089/v2/metric_upload?token=cEDdqE9sodSl8n87Vz82Im39 : No route to host: ibm-licensing-service-instance.ibm-common-services.svc.example.com/172.30.42.210:8089 : {\"cloudpakId\":\"279abae6bfe647eca1f0efcbf136099c\",\"cloudpakName\":\"IBM Cloud Pak for Integration - API Calls\",\"productId\":\"3af7dda8ce3e4369b1c461c2982719c8\",\"productName\":\"IBM {{site.data.reuse.eem_name}} Non Production\",\"productMetric\":\"MONTHLY_API_CALL\",\"productCloudpakRatio\":\"2:1\",\"cloudpakMetric\":\"RESOURCE_VALUE_UNIT\",\"aggregationPolicy\":\"ADD\",\"metricValue\":0}",
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

