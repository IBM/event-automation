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

**Important:** Ensure you install and configure an instance of both an {{site.data.reuse.eem_manager}} and an {{site.data.reuse.egw}} before configuring API Connect integration with that {{site.data.reuse.eem_manager}} instance.

Follow the steps to configure your {{site.data.reuse.eem_name}} Manager as an {{site.data.reuse.egw}} Service.

## Retrieve the API Connect JSON Web Key Set (JWKS) endpoint

Before beginning, you must retrieve the API Connect `jwksUrl` endpoint.

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. Expand the **Project** drop-down menu and select the project the API Connect instance is installed in.
4. Select the **API Connect** operator.
5. In the **API Connect cluster**, click the installed instance.
6. In the **YAML**, find the `status.endpoints` section of the `APIConnectCluster` custom resource. 
7. Retrieve the value in the `jwksUrl` field.

The value that you retrieved is required to configure trust between API Connect and {{site.data.reuse.eem_name}}.

## Configure {{site.data.reuse.eem_name}} to trust API Connect

To allow communication between API Connect and {{site.data.reuse.eem_name}}, you must add the certificate presented on the `jwksUrl` endpoint to {{site.data.reuse.eem_name}} as a trusted certificate. Additionally, you must provide a JWKS endpoint, which will be used to authenticate messages received from API Connect.

1. Download the server certificate from an API Connect endpoint, either by opening the URL in a browser, or by running the following command and then copying the certificate details into a file:

   ```bash
   openssl s_client -connect <jwksUrl value>
   ```

   Where `<jwksUrl value>` is the API Connect `jwksUrl` endpoint that you retrieved earlier.
2. In the Kubernetes cluster running {{site.data.reuse.eem_name}}, create a secret that contains the downloaded certificate. Create a secret to store the API Connect certificate as follows.

   - Using the {{site.data.reuse.openshift_short}} UI:
     
     1. {{site.data.reuse.openshift_ui_login}}
     2. Expand the **Workloads** drop-down menu and select **Secrets**.
     3. Expand the **Project** drop-down menu and select the project the {{site.data.reuse.eem_name}} instance is installed in.
     4. Expand the **Create** drop-down menu and select **Key/value secret**.
     5. Enter `apim-cpd` as the **Secret name**.
     6. Enter `ca.crt` as the **Key**.
     7. Under **Value**, select **Browse...**, and then select the certificate that you downloaded.
     8. Click **Create**.
   
   - Using the CLI:
     
     1. Run the following command to get a Base64 encoded string of the certificate that you downloaded:
     
        ```bash
        cat <path to the certificate> | base64
        ```
     
     2. {{site.data.reuse.cncf_cli_login}}
     3. Run the following command to create a secret called `apim-cpd`:
        
        ```bash
        cat <<EOF | kubectl apply -f -
        apiVersion: v1
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


3. Update the `EventEndpointManagement` instance with the API Connect configuration details:

   - On {{site.data.reuse.openshift_short}}:

      Use the web console to edit the configuration of the `EventEndpointManagement` instance:

      1. {{site.data.reuse.openshift_ui_login}}
      2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
      3. {{site.data.reuse.task_openshift_select_operator_eem}}
      4. {{site.data.reuse.task_openshift_select_instance_eem}}
      5. Click the **YAML** tab to edit the custom resource.
      6. In the `spec.manager` field, add the following snippet: 

         ```yaml
         apic:
           jwks:
             endpoint: <jwksUrl>
         ```

      7. In the `spec.manager.tls` field, add the following snippet: 

         ```yaml
         trustedCertificates:
           - certificate: ca.crt
             secretName: apim-cpd
         ```

      8. Click **Save** to apply your changes.

   - On other Kubernetes platforms:

      On other Kubernetes platforms, you can either edit the configuration of your `EventEndpointManagement` instance by using the `kubectl edit` command, or modify your original configuration file as follows.

      1. {{site.data.reuse.cncf_cli_login}}
      2. Ensure you are in the namespace where your {{site.data.reuse.eem_name}} instance is installed:

         ```shell
         kubectl config set-context --current --namespace=<namespace>
         ```

      3. Update your `EventEndpointManagement` instance's YAML file on your local system. In the `spec.manager` field, add the following snippet:

         ```yaml
         apic:
           jwks:
             endpoint: <jwksUrl>
         ```

      4. Also in the YAML, in the `spec.manager.tls` field, add the following snippet:

         ```yaml
         trustedCertificates:
           - certificate: ca.crt
             secretName: apim-cpd
         ```
   
      5. Apply the YAML to the Kubernetes cluster:

         ```shell
         kubectl apply -f <file_name>
         ```

## Enabling mutual TLS

JSON Web Token (JWT) authentication is used by default to verify messages that are received from API Connect and cannot be disabled. All communications the {{site.data.reuse.egw}} Service receive from API Connect contain a JWT, and the JWKS endpoint you provided earlier is used to validate this token to ensure the authenticity of each message. 

Based on your security requirements, you can optionally choose to also enable mutual TLS (MTLS), which uses certificates for authentication:

### On {{site.data.reuse.openshift_short}}

   Use the web console to modify the `EventEndpointManagement` instance's configuration:

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
   7. Click **Save** to apply your changes.

### On other Kubernetes platforms

  On other Kubernetes platforms you can either edit the configuration of your `EventEndpointManagement` instance by using the `kubectl edit` command, or modify your original configuration file as follows.

   1. {{site.data.reuse.cncf_cli_login}}
   2. Ensure you are in the namespace where your {{site.data.reuse.eem_name}} instance is installed:

      ```shell
      kubectl config set-context --current --namespace=<namespace>
      ```

   3. Update your `EventEndpointManagement` instance's YAML file on your local system. In the `spec.manager.apic` field, add the following snippet:

      ```yaml
      clientSubjectDN: CN=<commonname>
      ```

      Where <commonname> is the Common Name on the certificates that are used when making the TLS client profile.

   4. Apply the YAML to the Kubernetes cluster:

      ```shell
      kubectl apply -f <file_name>
      ```

## Registering {{site.data.reuse.eem_name}} as an {{site.data.reuse.egw}} Service in API Connect

After configuring the {{site.data.reuse.eem_name}} to trust API Connect, register the {{site.data.reuse.eem_name}} as an {{site.data.reuse.egw}} Service as follows:

### Obtain certificates for a TLS client profile on OpenShift

1. Expand the **Workloads** drop-down menu and select **Secrets**.
2. Expand the **Project** drop-down menu and select the project the {{site.data.reuse.eem_name}} instance is installed in.
3. Use the search bar to locate the secret named `<Event Endpoint Management Manager instance name>-ibm-eem-manager` and click the secret.
4. Scroll down to the `Data` section.
5. Copy the **ca.crt** and save it in a file called `cluster-ca.pem`
6. Copy the **tls.crt** and save it in a file called `manager-client.pem`
7. Copy the **tls.key** and save it in a file called `manager-client-key.pem`

N.b if you provided your own certificate via a secret for the eem manager use the data stored in that

For more information on these certificates, see the [API Connect documentation](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=integration-cp4i-list-issuers-ca-certificates-secrets){:target="_blank"}.

### Obtain certificates for a TLS client profile on other Kubernetes platforms

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.eem_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. Display the secret for your `EventEndpointManagement` instance, it will have the name `<instance_name>-ibm-eem-manager`.

    ```shell
    kubectl get secret <instance_name>-ibm-eem-manager -o yaml
    ```

4. Copy the **ca.crt** and save it in a file called `cluster-ca.pem`
5. Copy the **tls.crt** and save it in a file called `manager-client.pem`
6. Copy the **tls.key** and save it in a file called `manager-client-key.pem`

**Note:** If you provided your own certificate through a secret for the {{site.data.reuse.eem_manager}}, use the data stored in the secret.

For more information about these certificates, see the [API Connect documentation](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=integration-cp4i-list-issuers-ca-certificates-secrets){:target="_blank"}.

### Navigate to Cloud Manager

1. {{site.data.reuse.task_openshift_select_routes}}
2. Expand the **Project** drop-down menu and select the project the API Connect instance is installed in.
3. Use the search bar to find the route with the **Name** ending in `admin`. Click the URL in the **Location** column. This takes you to the Cloud Manager UI.

### Create a TLS Client Profile

Create the TLS Client profile to use when contacting the {{site.data.reuse.egw}} Service through the management endpoint.

1. Create a client TLS keystore. Go to **Home > Resources > TLS > Keystore** and click **Create**.
2. Upload the `manager-client-key.pem` into Step 1.
3. Upload the `manager-client.pem` into Step 2.
4. Click **Save**.
5. Create a client TLS truststore. Go to **Truststore** and click **Create**.
6. Upload the `cluster-ca.pem`.
7. Click **Save**.
8. Create a TLS client profile. Go to **TLS client profile** and click **Create**.
9. Choose the keystore and truststore you created.
10. Tick **Allow insecure server connections**.
11. Click **Save**.

### Retrieving the {{site.data.reuse.egw}} management endpoint

To register an {{site.data.reuse.eem_name}} instance with API Connect, you must provide an endpoint which defines where configuration updates from API Connect are sent. This is referred to as the **Service Endpoint** when registering an {{site.data.reuse.egw}} Service in the Cloud Manager. This endpoint can be retrieved from {{site.data.reuse.eem_name}} as follows:

#### Using the OpenShift web console

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_select_routes}}
3. Expand the **Project** drop-down menu and select the project the {{site.data.reuse.eem_name}} instance is installed in.
4. Use the search bar to find the route with the **Name** ending in `apic`. The URL in the **Location** column is the management endpoint.

#### Using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.eem_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```
3. List the ingress resources and locate the API Connect ingress for your instance, unless overridden the name  ends in `-apic`.

    ```shell
    kubectl get ingress
    ```
4. Obtain the URL for the ingress resource from the **Host** column.

## Retrieving the {{site.data.reuse.egw}} client endpoint

To register an {{site.data.reuse.eem_name}} instance with API Connect, you must provide an endpoint which defines where clients should connect to in order to consume events. Depending where you have [deployed your {{site.data.reuse.egw}}](../../installing/deploy-gateways), the steps to retrieve the client endpoint will differ:

### OpenShift cluster deployment

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_select_routes}}
3. Expand the **Project** drop-down menu and select the project the {{site.data.reuse.egw}} instance is installed in.
4. Use the search bar to find the route with the **Name** ending in `ibm-egw-rt`. The URL in the **Location** column is the client endpoint.
5. Having retrieved the **Location** value, remove the `https://` protocol prefixing the endpoint, and append the port `:443` as a suffix.

### Other Kubernetes platforms

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.egw}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```
3. List the ingress resources and locate the API Connect ingress for your instance, unless overridden the name ends in `-ibm-egw-rt`.

    ```shell
    kubectl get ingress
    ```
4. Obtain the URL for the ingress resource from the **Host** column.

### Stand-alone deployment

When [deployed as a stand-alone gateway](../../installing/standalone-gateways), the client endpoint value to use will be the name of the docker host running the gateway, and the `GATEWAY_PORT` value specified when starting the gateway container.

### Register {{site.data.reuse.eem_name}} as an {{site.data.reuse.egw}} Service

To socialize the {{site.data.reuse.egw}} client endpoint, register the {{site.data.reuse.egw}} through the Cloud Manager as follows.

1. In the Cloud Manager UI, select **Topology > Register Service > Event Gateway Service**.
2. Enter a title and an optional summary.
3. In the **Service endpoint** field, enter the management endpoint that you [obtained earlier](#retrieving-the-event-gateway-management-endpoint).
4. Select the TLS client profile that you created earlier from the **TLS client profile** drop-down menu. 
5. In the **API invocation endpoint** field, enter the [{{site.data.reuse.egw}} API endpoint that you obtained earlier](#retrieving-the-event-gateway-client-endpoint).
6. Use the default TLS server profile that API Connect provides from the drop-down menu.
7. Click **Save**.

The Cloud Manager UI displays a notification to indicate the {{site.data.reuse.egw}} Service is successfully registered. You can now [export an AsyncAPI](../export-asyncapi) to use in API Connect.
