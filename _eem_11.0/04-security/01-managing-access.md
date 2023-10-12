---
title: "Managing access"
excerpt: "Managing access for users and applications."
categories: security
slug: managing-access
toc: true
---

You can manage access to your {{site.data.reuse.eem_name}} instance through access controls. Users can be defined through custom configuration files or by different login services and identity providers such as [Keycloak](https://www.keycloak.org/){:target="_blank"}. Users can be authorized and given permissions based on their roles. For more information, see [managing roles](../user-roles).

{{site.data.reuse.eem_name}} supports locally defined authorization for testing purposes and OpenID Connect (OIDC) authorization.

**Important:** Before you begin, ensure you have [installed the {{site.data.reuse.eem_name}} operator](../../installing/installing).

## Setting up Local authentication
You can define users explicitly with usernames and passwords, which is typically helpful for testing or prototype instances.

**Important:** Despite being a valid OIDC provider with secure network traffic, the local authentication provider stores user credentials in a single JSON file as unencrypted strings. Therefore, passwords are at a higher risk of being exposed.

### Using {{site.data.reuse.openshift_short}} UI

1. {{site.data.reuse.openshift_ui_login}}
2. Click the **+** button in the navigation on the top. The text editor opens.
3. Paste the following YAML into the editor to create a custom resource that defines an instance of {{site.data.reuse.eem_name}} called `local-auth`:

   ```yaml
   apiVersion: events.ibm.com/v1beta1
   kind: EventEndpointManagement
   metadata:
     name: local-auth
     namespace: eem
   spec:
     license:
       accept: true
     manager:
       authConfig:
         authType: LOCAL
   ```

   This will create two secrets: `<custom-resource-name>-ibm-eem-user-credentials` and `<custom-resource-name>-ibm-eem-user-roles`. You can use these secrets to define the credentials and roles (permissions) of your users.
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

   The changed configuration files are automatically picked up by the {{site.data.reuse.eem_name}} instance, and you can then log in with these users. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).


### Using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to create an instance of {{site.data.reuse.eem_name}}:

   ```bash
   cat <<EOF | kubectl apply -f -
   apiVersion: events.ibm.com/v1beta1
   kind: EventEndpointManagement
   metadata:
     name: local-auth
     namespace: eem
   spec:
     license:
       accept: true
     manager:
       authConfig:
          authType: LOCAL
   EOF
   ```

    This will create two secrets: `<custom-resource-name>-ibm-eem-user-credentials` and `<custom-resource-name>-ibm-eem-user-roles`. You can use these secrets to define the credentials and roles (permissions) of your users.
3. Create a JSON file called `myusers.json` that contains the user credentials for your {{site.data.reuse.eem_name}} instance, for example:

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

4. Obtain the Base64-encoded string representing the file content. For example, you can run the following command to obtain the string:

   ```shell
   cat myusers.json | base64
   ```

5. Patch the `<custom-resource-name>-ibm-eem-user-credentials` secret with the local user credentials by running the following command:

   ```shell
   kubectl patch secret <custom-resource-name>-ibm-eem-user-credentials --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-credentials.json" ,"value" : "<your-base64-value>"}]'
   ```
   
   where:
     - \<custom-resource-name\> is the name of your {{site.data.reuse.eem_name}} instance.
     - \<your-base64-value\> is the Base64-encoded string returned from the previous command.
   
   for example:

   ```shell
   kubectl patch secret quick-start-manager-ibm-eem-user-credentials --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-credentials.json" ,"value" : "ewogICAgInVzZXJzIjogWwogICAgICAgIHsKICAgICAgICAgICAgInVzZXJuYW1lIjogImF1dGhvcjEiLAogICAgICAgICAgICAicGFzc3dvcmQiOiAiUGFzc3dvcmQxJCIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICAgInVzZXJuYW1lIjogInZpZXdlcjEiLAogICAgICAgICAgICAicGFzc3dvcmQiOiAiUGFzc3dvcmQyJCIKICAgICAgICB9CiAgICBdCn0KCg=="}]'
   ```

   **Note:** Alternatively, edit the secret directly and replace the Base64 value associated with `data.user-credentials.json`. To edit the secret directly, run the following command:

   ```bash
   oc edit secret/<custom-resource-name>-ibm-eem-user-credentials -o json
   ```

6. **Important:** For security reasons, delete the local file you created.

7. Similarly, edit the secret `<custom-resource-name>-ibm-eem-user-roles` to configure the roles and permissions of your users. For more information, see [managing roles](../user-roles).
   
   **Note:** The patch replaces a `path` of `"/data/user-mapping.json"` not `"/data/user-credentials.json"` for this secret.
   
   The changed configuration files are automatically picked up by the {{site.data.reuse.eem_name}} instance, and you can then log in with these users. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).

## Setting up OpenID Connect (OIDC) based authentication

You can authenticate users from an OIDC Identification Provider as follows:

### Using {{site.data.reuse.openshift_short}} UI

1. Access your OIDC provider and create a client.

   - If your OIDC provider asks for redirect urls, this needs to be set to the {{site.data.reuse.eem_name}} URL. If you have already installed {{site.data.reuse.eem_name}} then see step 9 for the value of these URLs before proceeding. Otherwise, add the URL `http://www.example.com/`, and proceed with client creation. We will come back to update the redirect urls at a later stage.

2. Retrieve the following properties from the OIDC provider

   - Client ID
   - Client Secret
   - OIDC Provider Site

3. {{site.data.reuse.openshift_ui_login}}
4. Click the **+** button in the navigation on the top. The text editor opens.
5. Paste the following Secret YAML into the editor:

    ```yaml
    kind: Secret
    apiVersion: v1
    metadata:
      name: oidc-secret
      namespace: eem
    data:
      client-id: <base_64_encoded_client_id>
      client-secret: <base_64_encoded_client_secret>
    type: Opaque
    ```

6. Click the **+** button in the navigation on the top. The text editor opens.
7. Paste the following YAML content, into the editor, to create a custom resource that defines an instance of {{site.data.reuse.eem_name}} called `oidc-auth`:

    ```yaml
    apiVersion: events.ibm.com/v1beta1
    kind: EventEndpointManagement
    metadata:
      name: oidc-auth
      namespace: eem
    spec:
      license:
        accept: true
      manager:
        authConfig:
          authType: OIDC
          oidcConfig:
            clientIDKey: client-id
            clientSecretKey: client-secret
            discovery: true
            secretName: oidc-secret
            site: <oidc_provider_site>
    ```

    **Note:** If your OIDC provider does not support **OIDC Discovery**, add the following parameters in the `oidcConfig` block:

    ```yaml
    tokenPath: (required) <path to the token endpoint of this provider>
    authorizationPath: (required) <path to the authorization endpoint of this provider>
    endSessionPath: (optional) <path to the end session endpoint of this provider>
    ```

8. You can now log in with these users. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).
9. Retrieve the login URL, open the client configuration of your OIDC provider, and update the redirect URLs to include the following addresses:

    ```bash
    https://<login_url_domain>/eem/callback
    https://<login_url_domain>/logout/callback
    ```

10. Retrieve the `subject` value of your user either from your OIDC provider, or by logging in to the {{site.data.reuse.eem_name}} UI by adding `/auth/protected/userinfo` to the URL.
11. Open the secret `<custom-resource-name>-ibm-eem-user-roles` to configure the roles and permissions of your user with the `subject` value. For more information, see [managing roles](../user-roles).

### Using the CLI

1. Access your OIDC provider and create a client.

   - If your OIDC provider asks for redirect urls, this needs to be set to the {{site.data.reuse.eem_name}} URL. If you have already installed {{site.data.reuse.eem_name}} then see step 7 for the value of these URLs before proceeding. Otherwise, add the URL `http://www.example.com/`, and proceed with client creation. We will come back to update the redirect urls at a later stage.

2. Retrieve the following properties from the OIDC provider

   - Client ID
   - Client Secret
   - OIDC Provider Site

3. {{site.data.reuse.cncf_cli_login}}
4. Run the following command to create a secret containing the OIDC credentials:

   ```bash
   cat <<EOF | kubectl apply -f -
   kind: Secret
   apiVersion: v1
   metadata:
     name: oidc-secret
     namespace: eem
   data:
     client-id: <base_64_encoded_client_id>
     client-secret: <base_64_encoded_client_secret>
   type: Opaque
   EOF
   ```

5. Run the following command to create an instance of {{site.data.reuse.eem_name}}:

   ```bash
   cat <<EOF | kubectl apply -f -
   apiVersion: events.ibm.com/v1beta1
   kind: EventEndpointManagement
   metadata:
       name: oidc-auth
       namespace: eem
   spec:
       license:
       accept: true
       manager:
          authConfig:
           authType: OIDC
           oidcConfig:
             clientIDKey: client-id
             clientSecretKey: client-secret
             discovery: true
             secretName: oidc-secret
             site: <oidc_provider_site>
   EOF
   ```

   This will create the secret `<custom-resource-name>-ibm-eem-user-roles` and can be used to define user roles (permissions).

   **Note:** If your OIDC provider does not support **OIDC Discovery**, then you will need to add the following parameters in the `oidcConfig` block:

   ```yaml
   tokenPath: (required) <path to the token endpoint of this provider>
   authorizationPath: (required) <path to the authorization endpoint of this provider>
   endSessionPath: (optional) <path to the end session endpoint of this provider>
   ```

6. You can now log in with these users. For more information, see [logging in to {{site.data.reuse.eem_name}}](../../getting-started/logging-in).
7. Retrieve the login URL, open the client configuration of your OIDC provider, and update the redirect URLs to include the following addresses:

   ```bash
   https://<login_url_domain>/eem/callback
   https://<login_url_domain>/logout/callback
   ```

8. Retrieve the `subject` value of your user either from your OIDC provider, or by logging in to the {{site.data.reuse.eem_name}} UI by adding `/auth/protected/userinfo` to the URL.
9. Run the following command to edit the secret `<custom-resource-name>-ibm-eem-user-roles` to [manage the user roles](../user-roles).

   ```bash
   kubectl edit secret/<custom-resource-name>-ibm-eem-user-roles -o json
   ```

### Setting up OIDC based authorization with a custom role identifier

You can use the custom role identifiers from the OIDC provider for defining user roles and permissions. This means the `user-roles` secret does not need to be updated every time a new user id is created.

This is done by asking the OIDC provider to send back additional properties in the authorization token which can be used as the `subject` in the `user-roles` secrets to identify and assign roles.

For this functionality to work, you must add some parameters to the {{site.data.reuse.eem_name}} Custom Resource YAML before applying it to a cluster. Add the following parameters under `spec.manager.authConfig.oidcConfig`:

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

The following example shows requesting the OIDC with `additionalScopes: roles`:

```json
{
  "sub": "user-xyz-123",
  "name": "xyz-123",
  ...
  "exp": 123456
  "resource_access": {
    "demonstration-id": {
      "roles": [
        "org-admin",
        "org-viewer"
      ]
    }
  }
}
```

Now {{site.data.reuse.eem_name}} can use the `roles` values to define permissions for all users who have these roles in their OIDC token.

To do this, the {{site.data.reuse.eem_name}} Custom Resource should set `authorizationClaimPointer: /resource_access/demonstration-id/roles`, which allows the {{site.data.reuse.eem_name}} instance to read the properties from this path in the token.

**Note:** The referenced path must contain a value of type string or array of strings.

Finally, you can edit the secret `<custom-resource-name>-ibm-eem-user-roles` to [manage the user roles](../user-roles).

### Setting up OIDC based authentication and authorization with custom certificates

If you want to use an OIDC provider with custom certificates that are not publicly available, then the {{site.data.reuse.eem_name}} Custom Resource can be extended to contain reference to the certificates.

For example:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
metadata:
  name: custom-certs-auth
  namespace: eem
spec:
  license:
    accept: true
  manager:
    authConfig:
      authType: OIDC
      oidcConfig:
        clientIDKey: client-id
        clientSecretKey: client-secret
        discovery: true
        secretName: oidc-secret
        site: <oidc_provider_site>
    tls:
      trustedCertificates:
        - certificate: ca.crt
          secretName: oidc-ca
        - ...
```
