---
title: "Configure Event Endpoint Management to integrate with IBM API Connect Developer Portal"
excerpt: "Find out how to configure Event Endpoint Management to integrate with IBM API Connect Developer Portal 12.1.1.2 or later."
categories: dpo-integration
slug: configure-eem-for-dpo-apic12
toc: true
---

The following sections provide instructions for configuring the integration of your {{site.data.reuse.eem_manager}} instance with [{{site.data.reuse.apic_long}} 12.1.1.2](https://www.ibm.com/docs/en/api-connect/software/12.1.1){:target="_blank"} or later.

**Important:**
- You can configure an integration with either {{site.data.reuse.apic_short}} 10.x.x or {{site.data.reuse.apic_short}} 12.1.1.2 or later, but not both simultaneously.
- Each {{site.data.reuse.eem_name}} instance integrates with only one {{site.data.reuse.apic_short}} instance, and each {{site.data.reuse.apic_short}} instance integrates with only one {{site.data.reuse.eem_name}} instance.


## Before you begin

In {{site.data.reuse.apic_short}}, [identify a {{site.data.reuse.wm_portal_short}} user](https://www.ibm.com/docs/en/api-connect/software/12.1.1?topic=users-user-onboarding){:target="_blank"} that has administrator privileges, or create a new user that has administrator privileges.  


## Create a secret that contains your {{site.data.reuse.wm_portal_short}} credentials
{: #create-user-secret}

In the {{site.data.reuse.eem_name}} namespace, create a secret that contains the basic authentication credentials of your {{site.data.reuse.wm_portal_short}} user. The user must have administrator privileges.

Run the following command to create a secret called `devportal-api-secret` that contains your {{site.data.reuse.wm_portal_short}} user credentials:
```bash
kubectl -n <event endpoint management namespace> create secret generic devportal-api-secret \
  --from-literal="key"="<username>:<password>"
```

Substitute `<username>:<password>` with the authentication credentials or your {{site.data.reuse.wm_portal_short}} user.

## Enable TLS trust between {{site.data.reuse.eem_name}} and the {{site.data.reuse.wm_portal_short}}
{: #copy-admin-client-cert}

Copy the [`devportal-admin-client`](https://www.ibm.com/docs/en/api-connect/software/12.1.1?topic=certificates-tls-organized-by-usage){:target="_blank"} secret to your {{site.data.reuse.eem_name}} namespace so that your {{site.data.reuse.eem_manager}} instance and your {{site.data.reuse.wm_portal_short}} instance trust each other.

1. Log in to your {{site.data.reuse.wm_portal_short}} container environment.
2. Extract the [`devportal-admin-client`](https://www.ibm.com/docs/en/api-connect/software/12.1.1?topic=certificates-tls-organized-by-usage){:target="_blank"} secret to a file called `devportal-admin-client.yaml`:

   ```bash
   kubectl -n <api connect namespace> get secret devportal-admin-client -o yaml > devportal-admin-client.yaml
   ```
3. Edit the `devportal-admin-client.yaml` file. Set `metadata.name=devportal-ca` and delete all the other `metadata` fields. The resulting file contents look like this:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: devportal-ca
    type: kubernetes.io/tls
    data:
      ca.crt: ...
      tls.crt: ...
      tls.key: ...
    ```

4. Create the `devportal-ca` secret in your {{site.data.reuse.eem_name}} namespace.

    - To create the secret by using the CLI, run the following command:

      ```bash
      kubectl -n <event endpoint management namespace> apply -f devportal-admin-client.yaml
      ``` 
    - To create the secret by using the {{site.data.reuse.openshift_short}} web console, follow these steps:

      a. {{site.data.reuse.openshift_ui_login}}

      b. Expand the **Project** drop-down menu and select the project where your {{site.data.reuse.eem_name}} instance is installed.

      c. Click the **+** (Quick create) icon on the upper-right corner of the window.

      d. Paste the contents of `devportal-admin-client.yaml` in the YAML editor.

      e. Click **Create**.



## Configure {{site.data.reuse.eem_name}} to integrate with API Connect {{site.data.reuse.wm_portal_short}}
{: #configure-eem}

Update your {{site.data.reuse.eem_name}} custom resource with the {{site.data.reuse.apic_short}} configuration details as follows:

Create or update the `spec.manager.apic.developerPortal` section as follows:
{: #developerPortal}

```yaml
spec:
  manager:
    apic:
      developerPortal:
        - organization: eem
          endpoint: <devportal URL>
          authentication:
            secretName: devportal-ca
            key: key
```

Set `<devportal URL>` to the URL of the {{site.data.reuse.wm_portal_short}}. For example, `https://devportal.apps.example.com`. Do not include the `/devportal` path in the URL.   

In the `spec.manager.tls.trustedCertificates` property, add the `devportal-ca` certificate:
{: #trustedCerts}

```yaml
spec:
  manager:
    tls:
      trustedCertificates:
        - certificate: ca.crt
          secretName: devportal-ca
```

### By using the CLI
{: #cli-update}

1. Edit the `EventEndpointManagement` custom resource:

    ```bash
    kubectl -n <event endpoint management namespace> edit eventendpointmanagement/<custom-resource-name>
    ```
2. Make the required updates to [`spec.manager.apic.developerPortal`](#developerPortal) and [`trustedCertificates`](#trustedCerts).

### By using the {{site.data.reuse.openshift_short}} web console
{: #webconsole-update}

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}
4. {{site.data.reuse.task_openshift_select_instance_eem}}
5. Click the **YAML** tab to edit the custom resource.
6. Make the required updates to [`spec.manager.apic.developerPortal`](#developerPortal) and [`trustedCertificates`](#trustedCerts).
7. Click **Save** to apply your changes.

## Verify the configuration
{: #config-verification}

To verify that the integration between {{site.data.reuse.eem_name}} and {{site.data.reuse.wm_portal_long}} deployed successfully, complete the following steps:

1. Log in to the {{site.data.reuse.eem_manager}} UI with an account that has the Administrator role.
2. Navigate to **Administration > External integrations**.

A tile for {{site.data.reuse.apic_short}} is displayed with the URL that you specified when you [configured the {{site.data.reuse.eem_name}} {{site.data.reuse.wm_portal_short}} integration](#configure-eem). 

If you do not see the tile for {{site.data.reuse.apic_short}}, then check the pod logs of the {{site.data.reuse.eem_manager}} instance and verify the contents of the `devportal-api-secret` and `devportal-ca` secrets that you created. 

## Post configuration tasks
{: #post-config-tasks}

Update your {{site.data.reuse.eem_name}} [backup](../../installing/backup-restore) so that you do not lose your {{site.data.reuse.wm_portal_short}} integration configuration.

