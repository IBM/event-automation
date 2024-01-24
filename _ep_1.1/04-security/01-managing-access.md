---
title: "Managing access"
excerpt: "Managing access for users and applications."
categories: security
slug: managing-access
toc: true
---

You can manage access to your {{site.data.reuse.ep_name}} instance by defining authentication and authorization rules. Authentication rules control login access, and authorization rules control what actions the user has permissions to take after logging in.

You can set up authentication in {{site.data.reuse.ep_name}} in one of the following ways:

1. Create [local definitions](#setting-up-local-authentication) on the cluster where {{site.data.reuse.ep_name}} runs.
2. [Integrate with an external identity provider](#setting-up-openid-connect-oidc-based-authentication){:target="_blank"} that follows the [Open ID Connect standard](https://openid.net/developers/how-connect-works/){:target="_blank"}, such as [Keycloak](https://www.keycloak.org/){:target="_blank"}, or various public login services.

After a user is authenticated, they are authorized to perform actions based on their assigned roles. You can set up authorization in one of the following ways:

1. Create local definitions to assign roles to specific users.
2. Define mappings to custom roles in the OIDC provider if you have used an OIDC provider for authentication.
For more information these options, see [managing roles](../user-roles).

**Important:** Before you begin, ensure you have [installed the {{site.data.reuse.ep_name}} operator](../../installing/installing).

## Setting up Local authentication

You can define users explicitly with usernames and passwords, which is typically helpful for testing or prototype instances.

**Important:** Despite being a valid OIDC provider with secure network traffic, the local authentication provider stores user credentials in a single JSON file as unencrypted strings. Therefore, passwords are at a higher risk of being exposed.

### Using {{site.data.reuse.openshift_short}} UI

1. {{site.data.reuse.openshift_ui_login}}
2. In the **Installed Operators** view, switch to the namespace where you installed your existing {{site.data.reuse.ep_name}} instance. If you have not created one yet, follow the [installation instructions](../../installing/installing/#install-an-event-processing-instance) to create an instance.
3. Edit the custom resource for the instance and add the `spec.authoring.authConfig` section to include `authType: LOCAL` as follows:
   ```yaml
   apiVersion: events.ibm.com/v1beta1
   kind: EventProcessing
   ...
   spec:
     ...
     authoring:
       authConfig:
         authType: LOCAL
     ...
   ```

   This will create two secrets: 
   
   - `<custom-resource-name>-ibm-ep-user-credentials` 
   - `<custom-resource-name>-ibm-ep-user-roles`
   
   To add users and define their roles, update these secrets.

4. Expand **Workloads** in the navigation on the left and click **Secrets**. This lists the secrets available in this project (namespace).
5. To edit the secret `<custom-resource-name>-ibm-ep-user-credentials` with your local user credentials, go to **Actions** and click **Edit Secret**.
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
8. Similarly, edit the secret `<custom-resource-name>-ibm-ep-user-roles` to configure the roles and permissions of your users. For more information, see [managing roles](../user-roles).

   The changed configuration files are automatically picked up by the {{site.data.reuse.ep_name}} instance, and you can then log in with these users. For more information, see [logging in to {{site.data.reuse.ep_name}}](../../getting-started/logging-in).


### Using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. Find the existing {{site.data.reuse.ep_name}} instance that you want to configure. If you have not created one yet, create one by using one of the templates for [OpenShift](../../installing/installing/#install-an-event-processing-instance), or on other [Kubernetes platforms](../../installing/installing-on-kubernetes/#install-an-event-processing-instance).
3. Change to the namespace where your instance is installed.
3. Edit the custom resource for the instance as follows:

   ```bash
   kubectl edit eventprocessing/<custom-resource-name>
   ```

   Edit the `spec.authoring.authConfig` section to include `authType: LOCAL` as follows:

   ```yaml
   apiVersion: events.ibm.com/v1beta1
   kind: EventProcessing
   ...
   spec:
     ...
     authoring:
       authConfig:
          authType: LOCAL
     ...
   ```

    This will create two secrets: 
    
    - `<custom-resource-name>-ibm-ep-user-credentials`
    - `<custom-resource-name>-ibm-ep-user-roles`
    
    To add users and define their roles, update these secrets.
    
3. Create a JSON file called `myusers.json` that contains the user credentials for your {{site.data.reuse.ep_name}} instance, for example:

   ```json
   {
       "users": [
           {
             "username": "user1",
             "password": "Password1$"
           },
           {
             "username": "user2",
             "password": "Password2$"
           }
       ]
   }
   ```

4. Obtain the Base64-encoded string representing the file content. For example, you can run the following command to obtain the string:

   ```shell
   cat myusers.json | base64
   ```

5. Patch the `<custom-resource-name>-ibm-ep-user-credentials` secret with the local user credentials by running the following command:

   ```shell
   kubectl patch secret <custom-resource-name>-ibm-ep-user-credentials --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-credentials.json" ,"value" : "<your-Base64-value>"}]'
   ```
   
   Where:
     - `<custom-resource-name>` is the name of your {{site.data.reuse.ep_name}} instance.
     - `<your-base64-value>` is the Base64-encoded string returned from the previous command.
   
   For example:

   ```shell
   kubectl patch secret quick-start-ep-ibm-ep-user-credentials --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-credentials.json" ,"value" : "ewogICAgInVzZXJzIjogWwogICAgICAgIHsKICAgICAgICAgICAgInVzZXJuYW1lIjogImF1dGhvcjEiLAogICAgICAgICAgICAicGFzc3dvcmQiOiAiUGFzc3dvcmQxJCIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICAgInVzZXJuYW1lIjogInZpZXdlcjEiLAogICAgICAgICAgICAicGFzc3dvcmQiOiAiUGFzc3dvcmQyJCIKICAgICAgICB9CiAgICBdCn0KCg=="}]'
   ```

   **Note:** Alternatively, edit the secret directly and replace the Base64 value associated with `data.user-credentials.json`. To edit the secret directly, run the following command:

   ```bash
   kubectl edit secret/<custom-resource-name>-ibm-ep-user-credentials -o json
   ```

6. **Important:** For security reasons, delete the local file you created.

7. Similarly, edit the secret `<custom-resource-name>-ibm-ep-user-roles` to configure the roles and permissions of your users. For more information, see [managing roles](../user-roles).
   
   **Note:** The patch replaces a `path` of `"/data/user-mapping.json"` not `"/data/user-credentials.json"` for this secret.
   
   The changed configuration files are automatically picked up by the {{site.data.reuse.ep_name}} instance, and you can then log in with these users. For more information, see [logging in to {{site.data.reuse.ep_name}}](../../getting-started/logging-in).

## Setting up OpenID Connect (OIDC) based authentication

You can authenticate users from an OIDC Identification Provider as follows. Before you start, ensure you collect the following configuration values for your OIDC provider:
  - Client ID
  - Client Secret
  - OIDC Provider base URL

If your OIDC provider does not implement the Open ID Connect Discovery standard, ensure you also have the following values:
  - The `tokenPath` used by that provider (this extends the OIDC Provider base URL noted earlier).
  - The `authorizationPath` used by that provider, which also extends the base URL.
  - Optionally, the `endSessionPath` for that provider, which also extends the base URL.

### Using {{site.data.reuse.openshift_short}} UI

1. Access your OIDC provider and create a client.

   - If your OIDC provider asks for redirect urls, set them to the {{site.data.reuse.ep_name}} URL. If you have already installed {{site.data.reuse.ep_name}} then see step 9 for the value of these URLs before proceeding. Otherwise, add the URL `http://www.example.com/`, and proceed with client creation. We will come back to update the redirect urls at a later stage.
2. {{site.data.reuse.openshift_ui_login}}
3. In the **Installed Operators** view, switch to the namespace where you installed your existing {{site.data.reuse.ep_name}} instance. If you have not created one yet, follow the [install instructions](../../installing/installing/#install-an-event-processing-instance) to create an instance.
4. Click the **+** button in the header. The text editor opens.
5. Paste the following Secret YAML into the editor:

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
6. Edit the custom resource for your existing {{site.data.reuse.ep_name}} instance and add the `spec.authoring.authConfig` section to include the following settings for OIDC:
    ```yaml
    apiVersion: events.ibm.com/v1beta1
    kind: EventProcessing
    ...
    spec:
      ...
      authoring:
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

    **Note:** If your OIDC provider does not support **OIDC Discovery**, add the following parameters in the `oidcConfig` block:

    ```yaml
    tokenPath: (required) <path to the token endpoint of this provider>
    authorizationPath: (required) <path to the authorization endpoint of this provider>
    endSessionPath: (optional) <path to the end session endpoint of this provider>
    ```

7. Retrieve the login URL, open the client configuration of your OIDC provider, and update the redirect URLs to include the following addresses:

    ```bash
    https://<ep_instance_url>/ep/callback
    https://<ep_instance_url>/logout/callback
    ```

8. Retrieve the `subject` value of your user either from your OIDC provider, or by logging in to the {{site.data.reuse.ep_name}} UI by adding `/auth/protected/userinfo` to the URL.
9. Edit the generated secret `<custom-resource-name>-ibm-ep-user-roles` to configure the roles and permissions of your users, as described in [managing roles](../user-roles).
10. You can now log in with these users. For more information, see [logging in to {{site.data.reuse.ep_name}}](../../getting-started/logging-in).


### Using the CLI

1. Access your OIDC provider and create a client.
   
   **Note:** If your OIDC provider asks for redirect urls, set them to the {{site.data.reuse.ep_name}} URL. If you have already installed {{site.data.reuse.ep_name}}, then see step 7 for the value of these URLs before proceeding. Otherwise, add the URL `http://www.example.com/`, and proceed with client creation. You can update the redirect urls at a later stage.

2. {{site.data.reuse.cncf_cli_login}}
3. Change to the namespace where your instance is installed.
4. Run the following command to create a secret containing the OIDC credentials, in the namespace where your {{site.data.reuse.ep_name}} will run: 
   ```bash
   cat <<EOF | kubectl apply -f -
   kind: Secret
   apiVersion: v1
   metadata:
     name: oidc-secret
     namespace: <namespace_for_your_ep_instance>
   data:
     client-id: <base_64_encoded_client_id>
     client-secret: <base_64_encoded_client_secret>
   type: Opaque
   EOF
   ```
5. Find the existing {{site.data.reuse.ep_name}} instance that you want to configure. If you have not created one yet, create one by using one of the templates for [OpenShift](../../installing/installing/#install-an-event-processing-instance), or on other [Kubernetes platforms](../../installing/installing-on-kubernetes/#install-an-event-processing-instance).
6. Edit the custom resource for the instance as follows:
   
   ```bash
   kubectl edit eventprocessing/<custom-resource-name>
   ```
   
   Edit the `spec.authoring.authConfig` section and add the `spec.authoring.authConfig` section to include the following settings for OIDC::
   
   ```yaml
      apiVersion: events.ibm.com/v1beta1
      kind: EventProcessing
      ...
      spec:
        ...
        authoring:
          authConfig:
            authType: OIDC
            oidcConfig:
              clientIDKey: client-id
              clientSecretKey: client-secret
              discovery: true
              secretName: oidc-secret
              site: <oidc_provider_base_url>
   ```
   
   **Note:** If your OIDC provider does not support **OIDC Discovery**, then you will need to add the following parameters in the `oidcConfig` block:

   ```yaml
   tokenPath: (required) <path to the token endpoint of this provider>
   authorizationPath: (required) <path to the authorization endpoint of this provider>
   endSessionPath: (optional) <path to the end session endpoint of this provider>
   ```
   
   This will create the secret `<custom-resource-name>-ibm-ep-user-roles` that must be used to define user roles (permissions).

6. Retrieve the login URL, open the client configuration of your OIDC provider, and update the redirect URLs to include the following addresses:
   
   ```bash
   https://<ep_instance_url>/ep/callback
   https://<ep_instance_url>/logout/callback
   ```

7. Retrieve the `subject` value of your user either from your OIDC provider, or by logging in to the {{site.data.reuse.ep_name}} UI by adding `/auth/protected/userinfo` to the URL.
8. Edit the generated secret `<custom-resource-name>-ibm-ep-user-roles` to configure the roles and permissions of your users, as described in [managing roles](../user-roles).
9. You can now log in with these users. For more information, see [logging in to {{site.data.reuse.ep_name}}](../../getting-started/logging-in).


## Setting up OIDC-based authorization with a custom role identifier

You can use the custom role identifiers from the OIDC provider for defining user roles and permissions. This means the `user-roles` secret does not need to be updated every time a new user id is created.

This is done by asking the OIDC provider to send back additional properties in the authorization token which can be used as the `subject` in the `user-roles` secrets to identify and assign roles.

For this functionality to work, you must add some parameters to the `EventProcessing` custom resource YAML before applying it to a cluster. Add the following parameters under `spec.authoring.authConfig.oidcConfig`:

```yaml
authorizationClaimPointer: <path to properties in OIDC token>
additionalScopes: <additional scopes to be request during OIDC connection to retrieve properties>
```

The following example shows the default OIDC token:

```json
{
  "sub": "user-xyz-123",
  "name": "xyz-123",
  ...
  "exp": 123456
}
```

The following example shows requesting the OIDC with `additionalScopes: roles,offline_access`:

```json
{
  "sub": "user-xyz-123",
  "name": "xyz-123",
  ...
  "exp": 123456
  "resource_access": {
    "demonstration-id": {
      "roles": [
        "org-user"
      ]
    }
  }
}
```

Now {{site.data.reuse.ep_name}} can use the `roles` values to define permissions for all users who have these roles in their OIDC token.

The `offline_access` value allows the UI to perform actions for the user even when the user is not online in a browser session.

To do this, configure the `EventProcessing` custom resource to set `authorizationClaimPointer: /resource_access/demonstration-id/roles`, which allows the {{site.data.reuse.ep_name}} instance to read the properties from this path in the token.

**Note:** The referenced path must contain a value of type string or array of strings.

Finally, you can edit the secret `<custom-resource-name>-ibm-ep-user-roles` to [manage the user roles](../user-roles#setting-up-oidc-based-authorization-with-a-custom-role-identifier).

## Setting up OIDC based authentication and authorization with custom certificates

If you want to use an OIDC provider with custom certificates that are not publicly available, then the `EventProcessing` custom resource can be extended to contain reference to the certificates.

For example:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
metadata:
  name: custom-certs-auth
  namespace: ep
spec:
  ...
  authoring:
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
        - certificate: ca.crt
          secretName: oidc-ca
        - ...
```
