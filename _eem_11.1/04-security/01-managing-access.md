---
title: "Managing access"
excerpt: "Managing access for users and applications."
categories: security
slug: managing-access
toc: true
---

You can manage access to your {{site.data.reuse.eem_name}} instance by defining authentication and authorization rules. Authentication rules control login access, and authorization rules control what actions the user has permissions to take after logging in.

You can set up authentication in {{site.data.reuse.eem_name}} in one of the following ways:
1. Create [local definitions](#setting-up-local-authentication) on the cluster where {{site.data.reuse.eem_name}} runs.
2. [Integrate with an external identity provider](#setting-up-openid-connect-oidc-based-authentication){:target="_blank"} that follows the [OpenID Connect (OIDC) standard](https://openid.net/developers/how-connect-works/){:target="_blank"}, such as [Keycloak](https://www.keycloak.org/){:target="_blank"}, or various public login services.

After a user is authenticated, they are authorized to perform actions based on their assigned roles. You can set up authorization in one of the following ways:
1. Create local definitions to assign roles to specific users.
2. Define mappings to custom roles in the OIDC provider if you have used an OIDC provider for authentication.
For more information these options, see [managing roles](../user-roles).

**Important:** Before you begin, ensure you have [installed the {{site.data.reuse.eem_name}} operator](../../installing/installing).

## Setting up local authentication

You can use local authentication to define users explicitly with usernames and passwords in a Kubernetes secret on the cluster. Local authentication is best suited for testing, prototyping, and demonstration purposes.

**Important:** Despite local authentication being a valid internal OIDC provider with secure network traffic, the local authentication provider stores user credentials in a single JSON file as unencrypted strings. This makes local authentication simpler to set up than OIDC-based authentication, but passwords are at a higher risk of being exposed.

### Using {{site.data.reuse.openshift_short}} UI

1. {{site.data.reuse.openshift_ui_login}}
2. In the **Installed Operators** view, switch to the namespace where you installed your existing {{site.data.reuse.eem_name}} (`manager`) instance. If you have not created one yet, follow the [installation instructions](../../installing/installing/#install-an-event-endpoint-management-manager-instance) to create an instance.
3. Edit the custom resource for the instance and add the `spec.manager.authConfig` section to include `authType: LOCAL` as follows:
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

   This will create two secrets: 
   
   - `<custom-resource-name>-ibm-eem-user-credentials` 
   - `<custom-resource-name>-ibm-eem-user-roles`
   
   To add users and define their roles, update these secrets.

4. Expand **Workloads** in the navigation on the left and click **Secrets**. This lists the secrets available in this project (namespace).
5. To edit the secret `<custom-resource-name>-ibm-eem-user-credentials` with your local user credentials, go to **Actions** and click **Edit Secret**.
6. Edit the mappings, for example:

   ```json
   {
       "users": [
           {
               "username": "author1",
               "password": "Password1$"
           },
           {
               "username": "viewer1",
               "password": "Password2$"
           }
       ]
   }
   ```
   
7. Click **Save**.
8. Similarly, edit the secret `<custom-resource-name>-ibm-eem-user-roles` to configure the roles and permissions of your users. For more information, see [managing roles](../user-roles).

   The changed configuration files are automatically picked up by the {{site.data.reuse.eem_name}} instance after a few minutes. and you can then log in with these users. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).


### Using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. Find the existing {{site.data.reuse.eem_name}} (`manager`) instance that you want to configure. If you have not created one yet, create one by using one of the templates for [OpenShift](../../installing/installing/#install-an-event-endpoint-management-manager-instance), or on other [Kubernetes platforms](../../installing/installing-on-kubernetes/#install-an-event-endpoint-management-manager-instance).
3. Change to the namespace where your instance is installed.
4. Edit the custom resource for the instance as follows:

   ```bash
   kubectl edit eventendpointmanagement/<custom-resource-name>
   ```

   Edit the `spec.manager.authConfig` section to include `authType: LOCAL` as follows:

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

    This will create two secrets: 
    
    - `<custom-resource-name>-ibm-eem-user-credentials`
    - `<custom-resource-name>-ibm-eem-user-roles`
    
    To add users and define their roles, update these secrets.
    
5. Create a JSON file called `myusers.json` that contains the user credentials for your {{site.data.reuse.eem_name}} instance, for example:

   ```json
   {
       "users": [
           {
               "username": "author1",
               "password": "Password1$"
           },
           {
               "username": "viewer1",
               "password": "Password2$"
           }
       ]
   }
   ```

6. Obtain the Base64-encoded string representing the file content. For example, you can run the following command to obtain the string:

   ```shell
   cat myusers.json | base64
   ```

7. Patch the `<custom-resource-name>-ibm-eem-user-credentials` secret with the local user credentials by running the following command:

   ```shell
   kubectl patch secret <custom-resource-name>-ibm-eem-user-credentials --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-credentials.json" ,"value" : "<your-Base64-value>"}]'
   ```
   
   where:
     - `<custom-resource-name>` is the name of your {{site.data.reuse.eem_name}} instance.
     - `<your-base64-value>` is the Base64-encoded string returned from the previous command.
   
   For example:

   ```shell
   kubectl patch secret quick-start-manager-ibm-eem-user-credentials --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-credentials.json" ,"value" : "ewogICAgInVzZXJzIjogWwogICAgICAgIHsKICAgICAgICAgICAgInVzZXJuYW1lIjogImF1dGhvcjEiLAogICAgICAgICAgICAicGFzc3dvcmQiOiAiUGFzc3dvcmQxJCIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICAgInVzZXJuYW1lIjogInZpZXdlcjEiLAogICAgICAgICAgICAicGFzc3dvcmQiOiAiUGFzc3dvcmQyJCIKICAgICAgICB9CiAgICBdCn0KCg=="}]'
   ```

   **Note:** Alternatively, edit the secret directly and replace the Base64 value associated with `data.user-credentials.json`. To edit the secret directly, run the following command:

   ```bash
   kubectl edit secret/<custom-resource-name>-ibm-eem-user-credentials -o json
   ```

8. **Important:** For security reasons, delete the local file you created.

9. Similarly, edit the secret `<custom-resource-name>-ibm-eem-user-roles` to configure the roles and permissions of your users. For more information, see [managing roles](../user-roles).
   
   **Note:** The patch replaces a `path` of `"/data/user-mapping.json"` not `"/data/user-credentials.json"` for this secret.
      
    The changed configuration files are automatically picked up by the {{site.data.reuse.eem_name}} instance after up to a few, and you can then log in with these users. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).


## Setting up OpenID Connect (OIDC)-based authentication

You can authenticate users from an OIDC Identification Provider as follows. By using OIDC authentication, you can centralize authentication across all your applications, providing a more secure setup than local authentication.

Before you start, ensure you retrieve the following configuration values for your OIDC provider:
  - Client ID
  - Client Secret
  - OIDC Provider base URL

**Note:** Ensure you have the right permission in your organization to retrieve these values or set up an OIDC client with your provider. You might need to contact your security administrator for permission or to set up a new OIDC client.

If your OIDC provider does not implement the Open ID Connect Discovery standard, ensure you also have the following values:
  - The `tokenPath` used by that provider (this extends the OIDC Provider base URL noted earlier).
  - The `authorizationPath` used by that provider, which also extends the base URL.
  - Optionally, the `endSessionPath` for that provider, which also extends the base URL.

When creating an OIDC client in your provider, it will ask for redirect URLs for logging in to the UI, and potentially for logging out as well. Ensure you set these URLs to the appropriate {{site.data.reuse.eem_name}} UI URLs. If you have already installed {{site.data.reuse.eem_name}}, then see step 8 in [the UI steps](#using-openshift-container-platform-ui-1) for the value of these URLs before proceeding. Otherwise, add the URL `http://www.example.com/`, and proceed with creating the client. You can update the redirect URLs in a later step.

### Using {{site.data.reuse.openshift_short}} UI

1. If you do not already have one, access your OIDC provider and create a client.
2. Retrieve the following required configuration values from your client:
    - Client ID
    - Client Secret
    - OIDC Provider base URL
3. {{site.data.reuse.openshift_ui_login}}
4. In the **Installed Operators** view, switch to the namespace where you installed your existing {{site.data.reuse.eem_name}} (`manager`) instance. If you have not created one yet, follow the [installation instructions](../../installing/installing/#install-an-event-endpoint-management-manager-instance) to create an instance.
5. Click the **+** button in the navigation on the top. The text editor opens.
6. Paste the following Secret YAML into the editor:

    ```yaml
    kind: Secret
    apiVersion: v1
    metadata:
      name: oidc-secret
      namespace: <your_namespace>
    data:
      client-id: <base_64_encoded_client_id>
      client-secret: <base_64_encoded_client_secret>
    type: Opaque
    ```
7. Edit the custom resource for your existing {{site.data.reuse.eem_name}} (`manager`) instance and add the `spec.manager.authConfig` section to include the following settings for OIDC:
    ```yaml
    apiVersion: events.ibm.com/v1beta1
    kind: EventEndpointManagement
    ...
    spec:
      ...
      manager:
        authConfig:
          authType: OIDC
          oidcConfig:
            clientIDKey: client-id
            clientSecretKey: client-secret
            discovery: true
            secretName: oidc-secret
            site: <oidc_provider_base_url>
      ...
    ```
    **Note:** The values of `clientIDKey` and `clientSecretKey` must match the keys in the secret created in previous step. The `oidc_provider_base_url` is the URL for your OIDC provider where discovery is performed, with  `/.well-known/openid-configuration` removed from the end of the path. If the there is no discovery endpoint it is the URL that precedes the required paths above.

    **Important:** If your OIDC provider does not support **OIDC Discovery**, add the following parameters in the `oidcConfig` section:

    ```yaml
    discovery: false
    tokenPath: (required) <path to the token endpoint of this provider>
    authorizationPath: (required) <path to the authorization endpoint of this provider>
    endSessionPath: (optional) <path to the end session endpoint of this provider for logging out>
    ```

8. After your instance reports `Ready` in its status field, retrieve the UI URL from the status information in the custom resource, open the client configuration of your OIDC provider, and update the redirect URLs to include the following addresses:

    For logging in:
    ```bash
    https://<ui_url>/callback
    ```

    For logging out (if supported by your OIDC provider):
    ```bash
    https://<ui_url>/logout/callback
    ```

    Users defined in your OIDC provider will now be able to log in. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).

9.  Edit the secret `<custom-resource-name>-ibm-eem-user-roles` to configure roles and permissions for your users. For more information, see [managing roles](../user-roles).

    The changed configuration files are automatically picked up by the {{site.data.reuse.eem_name}} instance after up to a few, and you can then log in with these users. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).

### Using the CLI

1. If you do not already have one, access your OIDC provider and create a client.
2. Retrieve the following required configuration values from your client:
    - Client ID
    - Client Secret
    - OIDC Provider base URL
3. {{site.data.reuse.cncf_cli_login}}
4. Run the following command to create a secret containing the OIDC credentials, in the namespace where your {{site.data.reuse.eem_name}} will run: 
   ```bash
   cat <<EOF | kubectl apply -f -
   kind: Secret
   apiVersion: v1
   metadata:
     name: oidc-secret
     namespace: <namespace_for_your_eem_instance>
   data:
     client-id: <base_64_encoded_client_id>
     client-secret: <base_64_encoded_client_secret>
   type: Opaque
   EOF
   ```
5. Find the existing {{site.data.reuse.eem_name}} (`manager`) instance that you want to configure. If you have not created one yet, create one by using one of the templates for [OpenShift](../../installing/installing/#install-an-event-endpoint-management-manager-instance), or on other [Kubernetes platforms](../../installing/installing-on-kubernetes/#install-an-event-endpoint-management-manager-instance).
6. Edit the custom resource for the instance as follows:
   
   ```bash
   kubectl edit eventendpointmanagement/<custom-resource-name>
   ```
   
   Edit the `spec.manager.authConfig` section and add the `spec.manager.authConfig` section to include the following settings for OIDC::
   
   ```yaml
      apiVersion: events.ibm.com/v1beta1
      kind: EventEndpointManagement
      ...
      spec:
        ...
        manager:
          authConfig:
            authType: OIDC
            oidcConfig:
              clientIDKey: client-id
              clientSecretKey: client-secret
              discovery: true
              secretName: oidc-secret
              site: <oidc_provider_base_url>
   ```
   
    **Note:** The values of `clientIDKey` and `clientSecretKey` must match the keys in the secret created in previous step. The `oidc_provider_base_url` is the URL for your OIDC provider where discovery is performed, with  `/.well-known/openid-configuration` removed from the end of the path. If the there is no discovery endpoint it is the URL that precedes the required paths above.

    **Important:** If your OIDC provider does not support **OIDC Discovery**, add the following parameters in the `oidcConfig` section:

    ```yaml
    discovery: false
    tokenPath: (required) <path to the token endpoint of this provider>
    authorizationPath: (required) <path to the authorization endpoint of this provider>
    endSessionPath: (optional) <path to the end session endpoint of this provider for logging out>
    ```

6. After your instance reports `Ready` in its status field, retrieve the UI URL from the status information in the custom resource, open the client configuration of your OIDC provider, and update the redirect URLs to include the following addresses:

    For logging in:
    ```bash
    https://<ui_url>/callback
    ```

    For logging out (if supported by your OIDC provider):
    ```bash
    https://<ui_url>/logout/callback
    ```

    Users defined in your OIDC provider will now be able to log in. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).
7. Edit the secret `<custom-resource-name>-ibm-eem-user-roles` to configure roles and permissions for your users. For more information, see [managing roles](../user-roles).

    The changed configuration files are automatically picked up by the {{site.data.reuse.eem_name}} instance after a few minutes, and you can then log in with these users. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).

### Setting up OIDC-based authentication with custom certificates

If your OIDC provider uses TLS certificates that are not publicly trusted, you can extend the `EventEndpointManagement` custom resource to include references to certificates that the {{site.data.reuse.eem_name}} instance can use to trust the OIDC provider.

For example:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
metadata:
  name: custom-certs-auth
  namespace: eem
spec:
  ...
  manager:
    authConfig:
      authType: OIDC
      oidcConfig:
        clientIDKey: client-id
        clientSecretKey: client-secret
        discovery: true
        secretName: oidc-secret
        site: <oidc_provider_base_url>
    tls:
      trustedCertificates:
        - secretName: oidc-ca
          certificate: ca.crt
        - ...
```
