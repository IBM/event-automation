---
title: "Configure an Event Endpoint Management Manager as an Event Gateway Service"
excerpt: "Configure an Event Endpoint Management Manager as an Event Gateway Service."
categories: integrating-with-apic
slug: configure-eem-for-apic
toc: true
---

You can configure your {{site.data.reuse.eem_name}} instance (Manager) to be registered as an {{site.data.reuse.egw}} Service in IBM API Connect, which you can use to manage events and APIs in one place.


To register {{site.data.reuse.eem_name}} instance as an {{site.data.reuse.egw}} Service:

1. Add the server certificate of API Connect and the JSON Web Key Set (JWKS) endpoint as configuration in your {{site.data.reuse.eem_name}} instance so that communications received from API Connect are trusted. 
2. Use the {{site.data.reuse.egw}} API and the {{site.data.reuse.eem_manager}} Manager endpoint to configure an {{site.data.reuse.egw}} Service in Cloud Manager.

Follow the steps to configure your {{site.data.reuse.eem_name}} Manager as an {{site.data.reuse.egw}} Service.

## Retrieve the Manager endpoint

Before beginning, you must retrieve the {{site.data.reuse.eem_manager}} Manager endpoint, as this is needed for the following sections.

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. Expand the **Project** drop-down menu and select the project the API Connect instance is installed in.
4. Select the **API Connect** operator.
5. In the **API Connect cluster**, click the installed instance.
6. In the **YAML**, find the `status.endpoints` section of the `APIConnectCluster` custom resource. 
7. Retrieve the value in the `platformApi` field.

The value that you retrieved previously is the Manager endpoint, which is used in the following sections.

## Configure {{site.data.reuse.eem_name}} to trust API Connect

To allow communication between API Connect and the {{site.data.reuse.egw}} Service, you must add the API Connect certificate to {{site.data.reuse.eem_name}} trusted certificates. Additionally, you need to provide JWKS endpoint, which will be used to authenticate messages received from API Connect.

1. Download the server certificate from the {{site.data.reuse.eem_manager}} endpoint, either by opening the URL in a browser, or by running the following command and then copying the certificate details into a file:

    ```bash
    openssl s_client -connect <manager endpoint hostname>:443
    ```

    Where `<manager endpoint hostname>` is the {{site.data.reuse.eem_manager}} endpoint that you retrieved earlier.
2. In the {{site.data.reuse.openshift_short}}, [create a secret](#creating-a-secret) that contains the downloaded certificate.
3. {{site.data.reuse.openshift_ui_login}}
4. {{site.data.reuse.task_openshift_navigate_installed_operators}}
5. {{site.data.reuse.task_openshift_select_operator_eem}}
6. {{site.data.reuse.task_openshift_select_instance_eem}}
7. Click the **YAML** tab to edit the custom resource.
8. In the `spec.manager` field, add the following snippet: 

    ```yaml
    apic:
          jwks:
              endpoint: >-
                  <platformApi endpoint>/cloud/oauth2/certs   
    ```

9. In the `spec.manager.tls` field, add the following snippet: 

    ```yaml
    trustedCertificates:
          - certificate: ca.crt
            secretName: apim-cpd
    ```

10. Click the **Save** button to apply your changes.

### Creating a Secret

Create a secret to store the API Connect certificate as follows:

#### Using {{site.data.reuse.openshift_short}} UI 

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Workloads** drop-down menu and select **Secrets**.
3. Expand the **Project** drop-down menu and select the project the {{site.data.reuse.eem_name}} instance is installed in.
4. Expand the **Create** drop-down menu and select **Key/value secret**.
5. Enter `apim-cpd` as the **Secret name**.
6. Enter `ca.crt` as the **Key**.
7. Under **Value**, select **Browse...**, and then select the certificate that you downloaded.
8. Click **Create**.

#### Using the {{site.data.reuse.openshift_short}} CLI

1. Run the following command to get a Base64 encoded string of the certificate that you downloaded:

    ```bash
    cat <path to the certificate> | base64
    ```

2. {{site.data.reuse.openshift_cli_login}}
3. Run the following command to create a secret called `apim-cpd`:

    ```bash
    cat <<EOF | oc apply -f -
    apiVersion: events.ibm.com/v1beta1
    kind: Secret
    metadata:
      name: apim-cpd
      namespace: <namespace the {{site.data.reuse.eem_name}} instance is installed in>
    data:
      ca.crt: >-
        <base64-certificate>
    type: Opaque
    EOF
    ```

    Where:

    - `<namespace>` is the namespace the {{site.data.reuse.eem_name}} instance is installed in.
    - `<base64-certificate>` is the Base64 encoded certificate that you obtained in step 1.

## Enabling mutual TLS

JSON Web Token (JWT) authentication is used by default to verify messages that are received from API Connect and cannot be disabled. All communications the {{site.data.reuse.egw}} Service receive from API Connect contain a JWT, and the JWKS endpoint you provided earlier is used to validate this token to ensure the authenticity of each message. 

Based on your security requirements, you can optionally choose to also enable mutual TLS (MTLS), which uses certificates for authentication:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}
4. {{site.data.reuse.task_openshift_select_instance_eem}}
5. Click the **YAML** tab to edit the custom resource.
6. In the `spec.manager.apic` field, add the following snippet:

    ```yaml
    clientSubjectDN: CN=<commonname>
    ```
    Where `<commonname>` is the Common Name on the certificates that are used when making the [TLS client profile](#obtain-certificates-for-a-tls-client-profile).
7. Click the **Save** button to apply your changes.

## Registering {{site.data.reuse.eem_name}} as an {{site.data.reuse.egw}} Service in API Connect

After configuring the {{site.data.reuse.eem_name}} to trust API Connect, register the {{site.data.reuse.eem_name}} as an {{site.data.reuse.egw}} Service as follows:

### Retrieve the {{site.data.reuse.egw}} API and management endpoints

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_select_routes}}
3. Expand the **Project** drop-down menu and select the project the {{site.data.reuse.eem_name}} instance is installed in.
4. Use the search bar to find the route with the **Name** ending in `gateway`. The URL in the **Location** column is the {{site.data.reuse.egw}} API endpoint.
5. Use the search bar to find the route with the **Name** ending in `apic`. The URL in the **Location** column is the management endpoint.

### Obtain certificates for a TLS client profile 

1. Expand the **Workloads** drop-down menu and select **Secrets**.
2. Expand the **Project** drop-down menu and select the project the API Connect instance is installed in.
3. Use the search bar to locate the secret named `<API Connect instance name>-ingress-ca` and click the secret.
4. Scroll down to the `Data` section.
5. Copy the **ca.crt** and save it in a file called `cluster-ca.pem`
6. Copy the **tls.crt** and save it in a file called `apim-client.pem`
7. Copy the **tls.key** and save it in a file called `apim-client-key.pem`

For more information on these certificates, see the [API Connect documentation](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=integration-cp4i-list-issuers-ca-certificates-secrets){:target="_blank"}.

### Navigate to Cloud Manager

1. {{site.data.reuse.task_openshift_select_routes}}
2. Expand the **Project** drop-down menu and select the project the API Connect instance is installed in.
3. Use the search bar to find the route with the **Name** ending in `admin`. Click the URL in the **Location** column. This takes you to the Cloud Manager UI.

### Create a TLS Client Profile

Create the TLS Client profile to use when contacting the {{site.data.reuse.egw}} Service through the management endpoint.

1. Create a client TLS keystore. Go to **Home > Resources > TLS > Keystore** and click **Create**.
2. Upload the `apim-client-key.pem` into Step 1.
3. Upload the `apim-client.pem` into Step 2.
4. Click **Save**.
5. Create a client TLS truststore. Go to **Truststore** and click **Create**.
6. Upload the `cluster-ca.pem`.
7. Click **Save**.
8. Create a TLS client profile. Go to **TLS client profile** and click **Create**.
9. Choose the keystore and truststore you created.
10. Tick **Allow insecure server connections**.
11. Click **Save**.

### Create a Gateway TLS Server Profile

Create the TLS server profile that the {{site.data.reuse.egw}} Service uses for the endpoints that Kafka clients connect to.

1. In the Cloud Manager, click **Manage Resources** in the navigation, then click **TLS** in the menu.
2. Scroll down to the **Keystore** section, then click **Create**.
3. Enter a title and optional summary for the keystore.
4. Upload the CA certificate from the `caSecretName` of the [{{site.data.reuse.egw}}](../../installing/deploy-gateways).
5. Save the keystore.
6. In the **TLS server profile** section, click **Create**.
7. Enter a title and optional summary for the profile.
8. In the **Keystore** section, select the store that is created earlier.
9. Click **Save**.

### Register {{site.data.reuse.eem_name}} as an {{site.data.reuse.egw}} Service

To socialize the {{site.data.reuse.egw}} client endpoint, register the {{site.data.reuse.egw}} through the Cloud Manager as follows.

1. In the Cloud Manager UI, select **Topology > Register Service > Event Gateway Service**.
2. Enter a title and an optional summary.
3. In the **Service endpoint**, enter the management endpoint that you obtained earlier.
4. Select the TLS client profile that you created earlier from the **TLS client profile** drop-down menu. 
5. In the **API invocation endpoint**, enter the {{site.data.reuse.egw}} API endpoint base that you obtained earlier and add `:443` at the end of the value. For example, `eem-manager-instance-ibm-eem-gateway.mycompany.com:443`
6. Select the TLS server profile that you created earlier from the drop-down menu.
7. Click **Save**.

The Cloud Manager UI displays a notification to indicate the {{site.data.reuse.egw}} Service is successfully registered. You can now [export an AsyncAPI](../export-asyncapi) to use in API Connect.