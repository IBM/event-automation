---
title: "Configure Event Endpoint Management to integrate with IBM API Connect Developer Portal"
excerpt: "Find out how to configure Event Endpoint Management to integrate with IBM API Connect Developer Portal 12.1.1 or later."
categories: dpo-integration
slug: configure-eem-for-dpo-apic12
toc: true
---

The following sections provide instructions for configuring the integration of your {{site.data.reuse.eem_manager}} instance with [{{site.data.reuse.apic_long}} 12.1.1](https://www.ibm.com/docs/en/api-connect/software/12.1.1){:target="_blank"} or later.

**Important:** You can configure an integration with either {{site.data.reuse.apic_short}} 10.x.x or {{site.data.reuse.apic_short}} 12.1.1 or later, but not both simultaneously.


## Before you begin

- In {{site.data.reuse.apic_short}}, [identify a user](https://www.ibm.com/docs/en/api-connect/software/12.1.1?topic=users-user-onboarding){:target="_blank"} with Administrator privileges, or create a new one.  In a next step, you will provide the username and password of this user in the {{site.data.reuse.eem_manager}}.
<!-- In a next step, you will provide the username and password of this user in the {{site.data.reuse.eem_manager}} configuration for allowing the service-to-service authentication. Guidance for this operation is provided in the {{site.data.reuse.apic_short}} documentation. -->
- In {{site.data.reuse.apic_short}}, obtain a copy of the Certificate Authority (CA) certificate from the secret [devportal-admin-client](https://www.ibm.com/docs/en/api-connect/software/12.1.1?topic=certificates-tls-organized-by-usage){:target="_blank"}.


## Create a secret with credentials for the {{site.data.reuse.eem_name}} REST API
{: #secret}

In the Kubernetes cluster running {{site.data.reuse.eem_name}}, create a secret that contains the basic authentication credentials of the administrator that you identified or created.

### By using the {{site.data.reuse.openshift_short}} CLI
{: #open-shift-cli}

1. {{site.data.reuse.openshift_ui_login}}
2. Run the following command to create a secret called `devportal-api-secret`:
   ```bash
   oc -n <ns_containing_EEM> secret generic devportal-api-secret \
     --from-literal="key"="<username>:<password>"
   ```

### By using the CLI of other Kubernetes platforms
{: #k8s}

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to create a secret called `devportal-api-secret`:
   ```bash
   kubectl -n <ns_containing_EEM> secret generic devportal-api-secret \
     --from-literal="key"="<username>:<password>"
   ```
 
## Create a secret to store the {{site.data.reuse.apic_short}} certificate
{: #secret-certificate}

Create a secret to store the {{site.data.reuse.apic_short}} certificate as follows:

### By using the {{site.data.reuse.openshift_short}} web console
{: #secret-certificate-ops}

**Note:** When you create a secret in the {{site.data.reuse.openshift_short}} UI, the input value must not be encoded. Therefore, ensure you retrieve a decoded value in step 1, or if you have a Base64-encoded certificate, decode it before you complete the following steps.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Workloads** drop-down menu and select **Secrets**.
3. Expand the **Project** drop-down menu and select the project the {{site.data.reuse.eem_manager}} instance is installed in.
4. Expand the **Create** drop-down menu and select **Key/value secret**.
5. Enter `devportal-ca` as the **Secret name**.
6. Enter `ca.crt` as the **Key**.
7. Under **Value**, select the text area, and enter the decoded certificate.
8. Click **Create**.

### By using the CLI
{: #secret-certificate-cli}

**Note:** When you create a secret by using the CLI, the certificate must be Base64-encoded.

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to create a secret called `devportal-ca`:

   ```bash
   cat <<EOF | kubectl apply -f -
   apiVersion: v1
   kind: Secret
   metadata:
     name: devportal-ca
     namespace: <namespace the {{site.data.reuse.eem_manager}} instance is installed in>
   data:
     ca.crt: >-
     <Base64-certificate>
   type: Opaque
   EOF
   ```

   Where:
   - `<namespace>` is the namespace the {{site.data.reuse.eem_manager}} instance is installed in.
   - `<Base64-certificate>` is the Base64-encoded certificate that you obtained in the [Before you begin](#before-you-begin) secton.

## Configure {{site.data.reuse.eem_name}} to integrate with API Connect {{site.data.reuse.wm_portal_short}}
{: #configure-eem}

<!--_**DRAFT COMMENT**: Section title TBD_-->

Update your {{site.data.reuse.eem_name}} instance with the {{site.data.reuse.apic_short}} configuration details as follows:

### By using the {{site.data.reuse.openshift_short}} web console
{: # }

Use the web console to edit the configuration of your `EventEndpointManagement` instance:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}
4. {{site.data.reuse.task_openshift_select_instance_eem}}
5. Click the **YAML** tab to edit the custom resource.
6. In the `spec.manager` field, add the following snippet:

   ```yaml
   apic:
     developerPortal:
       - organization: eem
         endpoint: <devportal_URL>
         authentication:
           secretName: <secret_name>
           key: <key_name>
   ```

   Where:
   - `organization`: must be `eem`.  
   - `endpoint`: the URL of {{site.data.reuse.wm_portal_short}}. For example: `https://devportal.apps.mycluster.com`. Do not include in the URL the `/devportal` path.  
   - `secretName`: the name of the Kubernetes secret containing the Basic Authentication credentials of a {{site.data.reuse.wm_portal_short}} user with Administrator privileges. Example: `devportal-admin-credentials`.  
   - `key`: the name of the key in the Kubernetes secret containing the credentials.

7. In the `spec.manager.tls` field, add the following snippet:

   ```yaml
   trustedCertificates:
     - certificate: ca.crt
       secretName: <secret_name>
   ```
   Where:
   - `certificate`: the name of the key in the secret.
   - `secretName`: the name of the Kubernetes secret containing the certificate.

8. Click **Save** to apply your changes.

### By using other Kubernetes platforms
{: # }

On other Kubernetes platforms, you can either edit the configuration of your `EventEndpointManagement` instance by using the `kubectl edit` command, or modify your original configuration file as follows.  

1. {{site.data.reuse.cncf_cli_login}}
1. Ensure you are in the namespace where your {{site.data.reuse.eem_manager}} instance is installed:  
```shell
kubectl config set-context --current --namespace=<namespace>
```  
1. Update your `EventEndpointManagement` instance's YAML file on your local system. In the `spec.manager` field, add the following snippet:  

   ```yaml
   apic:
     developerPortal:
       - organization: eem
         endpoint: <devportal_URL>
         authentication:
           secretName: <secret_name>
           key: <key_name>
   ``` 

   Where:
   - `organization`: Must be `eem`.
   - `endpoint`: The URL of {{site.data.reuse.wm_portal_short}}. Example: `https://devportal.apps.mycluster.com`. Do not include in the URL the `/devportal` path.
   - `secretName`: The name of the Kubernetes secret containing the Basic Authentication credentials of a {{site.data.reuse.wm_portal_long}} user with Administrator privileges. Example: `devportal-admin-credentials`.
   - `key`: The name of the key in the Kubernetes secret containing the credentials.  

1. Also in the YAML, in the `spec.manager.tls` field, add the following snippet:  

   ```yaml 
   trustedCertificates:
     - certificate: ca.crt
       secretName: <secret_name>
   ```
1. Apply the YAML to the Kubernetes cluster:
   ```shell
   kubectl apply -f <file_name>
   ```

           
## Verify the configuration
{: #config-verification}

To verify that the integration between {{site.data.reuse.eem_name}} and {{site.data.reuse.wm_portal_long}} deployed successfully, complete the following steps:

1. Log into the {{site.data.reuse.eem_manager}} UI using an account Administrator role.
2. Navigate to **Administration > External integrations**.

A tile for {{site.data.reuse.apic_short}} is displayed with the URL that you specified when you [configured {{site.data.reuse.eem_name}}](#configure-sitedatareuseeem_name). 


## Post configuration tasks
{: #post-config-tasks}

 To troubleshoot any issues you experience after you finish the configuration, complete the following steps:

- Check if the {{site.data.reuse.eem_manager}} is reachable.
- Check if you can log into the {{site.data.reuse.eem_manager}} UI using the user account with Administrator privileges that you configured when you [created a secret](#create-a-secret).
- Check the validity of the CA certificate you configured [before you began](#before-you-begin).
- Check the logs of the {{site.data.reuse.eem_manager}} pods.

