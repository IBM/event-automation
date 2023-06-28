---
title: "Managing access"
excerpt: "Managing access for users and applications."
categories: security
slug: managing-access
toc: true
---

You can manage access to your {{site.data.reuse.ep_name}} instance through access controls. Users can be defined through custom configuration files or by different login services and identity providers such as [Keycloak](https://www.keycloak.org/){:target="_blank"}. Users can be authorized and given permissions based on their roles. For more information, see [managing roles](../user-roles).

{{site.data.reuse.ep_name}} supports locally defined authorization for testing purposes and [OpenID Connect (OIDC) authentication](https://openid.net/connect/){:target="_blank"} for production purposes.

**Note:** Before you begin, ensure you have [installed](../../installing/installing) the {{site.data.reuse.ep_name}} operator.

## Setting up local authorization

You can define users explicitly with usernames and passwords, which is typically helpful for testing or prototype instances.

**Important:** Despite being a valid OIDC provider with secure network traffic, the local authorization provider stores user credentials in a single JSON file as unencrypted strings. Therefore, passwords are at a higher risk of being exposed. Although local mode makes configuration and setup easier, it is not recommended for production installations due to minimal password protection.

### Using {{site.data.reuse.openshift_short}} web console

1. {{site.data.reuse.openshift_ui_login}}
2. Click the plus(**+**) button in the top banner to open the **Import YAML** page and then click the editor.
3. Paste the following YAML into the editor to create a custom resource that defines an instance of {{site.data.reuse.ep_name}} called `local-auth`:

    ```yaml
    apiVersion: events.ibm.com/v1beta1
    kind: EventProcessing
    metadata:
      name: local-auth
      namespace: ep
    spec:
      license:
        accept: true
      authoring:
        authConfig:
          authType: LOCAL
    ```

    This YAML creates two secrets `<custom-resource-name>-ibm-ep-user-credentials` and `<custom-resource-name>-ibm-ep-user-roles`. These secrets can be used to define the local user credentials and roles (permissions).

4. Expand **Workloads** in the navigation on the left and click **Secrets**. This lists the secrets available in this project (namespace).
5. To edit the secret `<custom-resource-name>-ibm-ep-user-credentials` with your local user credentials, go to **Actions** and click **Editing Secret**.
6. Configure your user credentials. For example:

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

7. Similarly, edit the secret `<custom-resource-name>-ibm-ep-user-roles` to configure the roles and permissions of your users. For more information, see [managing roles](../user-roles).
   The changed configuration files are automatically picked up by the {{site.data.reuse.ep_name}} instance, and you can then log in with these users. For more information, see [logging in](../../getting-started/logging-in) to an {{site.data.reuse.ep_name}} instance.

### Using the {{site.data.reuse.openshift_short}} CLI

1. {{site.data.reuse.openshift_cli_login}}
2. Run the following command to create an instance of {{site.data.reuse.ep_name}}:

    ```bash
    cat <<EOF | oc apply -f -
    apiVersion: events.ibm.com/v1beta1
    kind: EventProcessing
    metadata:
      name: local-auth
      namespace: ep
    spec:
      license:
        accept: true
      authoring:
        authConfig:
          authType: LOCAL
    EOF
    ```

    This creates two secrets `<custom-resource-name>-ibm-ep-user-credentials` and `<custom-resource-name>-ibm-ep-user-roles`. These secrets are used to define the local user credentials and roles (permissions).
3. To edit the secret `<custom-resource-name>-ibm-ep-user-credentials` with the local user credentials, run the following command:

    ```bash
    oc edit secret/<custom-resource-name>-ibm-ep-user-credentials -o json
    ```

4. Configure your user credentials. For example:

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

5. Similarly, edit the secret `<custom-resource-name>-ibm-ep-user-roles` to configure the roles and permissions of your users. For more information, see [managing roles](../user-roles).
   The changed configuration files are automatically picked up by the {{site.data.reuse.ep_name}} instance, and you can then log in with these users. For more information, see [logging in](../../getting-started/logging-in) to an {{site.data.reuse.ep_name}} instance.

## Setting up OpenID Connect (OIDC) based authentication

OpenID Connect (OIDC) is an extension of the [OAuth 2.0](https://oauth.net/2/){:target="_blank"} protocol. OAuth 2.0 is a standard protocol for identifying users and authorizing access to resources.

You can authenticate users from the OIDC identity provider as follows:

### Using {{site.data.reuse.openshift_short}} web console

1. Access your OIDC provider and create a client.

   **Note:** If your OIDC provider asks for redirect urls, this needs to be set to the {{site.data.reuse.ep_name}} URL. If you have already installed {{site.data.reuse.ep_name}}, then see step 9 for the value of these URLs before proceeding. Otherwise, add a random URL `http://www.example.com/`, and proceed with client creation. You can update the redirect urls at a later stage.

2. Retrieve the following properties from the OIDC provider:
   - Client ID
   - Client Secret
   - OIDC Provider Site
3. {{site.data.reuse.openshift_ui_login}}
4. Click the plus(**+**) button in the banner on the top to open the **Import YAML** page and then click the editor.
5. Create a secret that contains the OIDC credentials called `oidc-secret`. To create a secret, paste the following YAML content into the editor and then click **Create**.

    ```yaml
    kind: Secret
    apiVersion: v1
    metadata:
      name: oidc-secret
      namespace: ep
    data:
      client-id: <base_64_encoded_client_id>
      client-secret: <base_64_encoded_client_secret>
    type: Opaque
    ```

6. Create a custom resource that defines an instance of {{site.data.reuse.ep_name}} called `oidc-auth`. To create an instance, paste the following YAML content into the editor and then click **Create**.

    ```yaml
    apiVersion: events.ibm.com/v1beta1
    kind: EventProcessing
    metadata:
      name: oidc-auth
      namespace: ep
    spec:
      license:
        accept: true
      authoring:
        authConfig:
          authType: OIDC
          oidcConfig:
            clientIDKey: client-id
            clientSecretKey: client-secret
            discovery: true
            secretName: oidc-secret
            site: <oidc_provider_site>
    ```

    **Note:** If your OIDC provider does not support [**OIDC Discovery**](https://openid.net/specs/openid-connect-discovery-1_0.html#IssuerDiscovery){:target="_blank"}, ensure you add the following parameters in the `oidcConfig` block:

    ```yaml
    tokenPath: (required) <path to the token endpoint of this provider>
    authorizationPath: (required) <path to the authorization endpoint of this provider>
    endSessionPath: (optional) <path to the end session endpoint of this provider>
    ```

7. You can now log in with these users. For more information, see [logging in](../../getting-started/logging-in) to an {{site.data.reuse.ep_name}} instance.
8. Retrieve the login URL, open the client configuration of your OIDC provider, and update the redirect URLs to include the following addresses:

    ```bash
    https://<login_url_domain>/ep/callback
    https://<login_url_domain>/logout/callback
    ```

9. Retrieve the `subject` value of your user either from your OIDC provider, or by logging into the {{site.data.reuse.ep_name}} UI by adding `/auth/protected/userinfo` to the URL.
10. Open the secret `<custom-resource-name>-ibm-ep-user-roles` to configure the roles and permissions of your users with the `subject` value. For more information, see [managing roles](../user-roles).

### Using the {{site.data.reuse.openshift_short}} CLI

1. Access your OIDC provider and create a client.

   **Note:** If your OIDC provider asks for redirect urls, this needs to be set to the {{site.data.reuse.ep_name}} URL. If you have already installed {{site.data.reuse.ep_name}} then see step 7 for the value of these URLs before proceeding. Otherwise, add the URL `http://www.example.com/`, and proceed with client creation. You can update the redirect urls at a later stage.

2. Retrieve the following properties from the OIDC provider:
   - Client ID
   - Client Secret
   - OIDC Provider Site

3. {{site.data.reuse.openshift_cli_login}}
4. Run the following command to create a secret containing the OIDC credentials:

   ```bash
   cat <<EOF | oc apply -f -
   kind: Secret
   apiVersion: v1
   metadata:
     name: oidc-secret
     namespace: ep
   data:
     client-id: <base_64_encoded_client_id>
     client-secret: <base_64_encoded_client_secret>
   type: Opaque
   EOF
   ```

5. Run the following command to create an instance of {{site.data.reuse.ep_name}}:

   ```shell
   cat <<EOF | oc apply -f -
   apiVersion: events.ibm.com/v1beta1
   kind: EventProcessing
   metadata:
       name: oidc-auth
       namespace: ep
   spec:
      license:
        accept: true
      authoring:
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

    This will create the secret `<custom-resource-name>-ibm-ep-user-roles` and can be used to define user roles (permissions).

    **Note:** If your OIDC provider does not support [OIDC Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html#IssuerDiscovery){:target="_blank"}, ensure you add the following parameters in the `oidcConfig` block:

    ```yaml
    tokenPath: (required) <path to the token endpoint of this provider>
    authorizationPath: (required) <path to the authorization endpoint of this provider>
    endSessionPath: (optional) <path to the end session endpoint of this provider>
    ```

6. You can now log in with these users. For more information, see [logging](../../getting-started/logging-in) into {{site.data.reuse.ep_name}} instance.
7. Retrieve the login URL, open the client configuration of your OIDC provider, and update the redirect URLs to include the following addresses:

    ```bash
    https://<login_url_domain>/ep/callback
    https://<login_url_domain>/logout/callback
    ```

8. Retrieve the `subject` value of your user either from your OIDC provider, or by logging into the {{site.data.reuse.ep_name}} UI by adding `/auth/protected/userinfo` to the URL.
9. Run the following command to edit the secret `<custom-resource-name>-ibm-ep-user-roles` to [manage the user roles](../user-roles).

    ```bash
    oc edit secret/<custom-resource-name>-ibm-ep-user-roles -o json
    ```

## Setting up OIDC based authentication with a custom role identifier

You can use the custom role identifiers from the OIDC provider for defining user roles and permissions. This means the `user-roles` secret does not need to be updated every time a new user id is created.

This is done by asking the OIDC provider to send back additional properties in the authorization token which can be used as the `subject` in the `user-roles` secrets to identify and assign roles.

For this functionality to work, you must add some parameters to the {{site.data.reuse.ep_name}} Custom Resource YAML before applying it to a cluster. Add the following parameters under `spec.manager.authConfig.oidcConfig`:

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
        "org-user"
      ]
    }
  }
}
```
Now {{site.data.reuse.ep_name}} can use the `roles` values to define permissions for all users who have these roles in their OIDC token.

To do this, the {{site.data.reuse.ep_name}} Custom Resource should set `authorizationClaimPointer: /resource_access/demonstration-id/roles`, which allows the {{site.data.reuse.ep_name}} instance to read the properties from this path in the token.

**Note:** The referenced path must contain a value of type string or array of strings.

Finally, you can edit the secret `<custom-resource-name>-ibm-ep-user-roles` to [manage the user roles](../user-roles).

## Setting up OIDC based authentication with custom certificates

If you want to use an OIDC provider with custom certificates that are not publicly available, then the {{site.data.reuse.ep_name}} custom resource can be extended to contain reference to the certificates. Update the `tls.trustedCertificates` to refer custom certificates.

For example:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
metadata:
  name: production-ep
spec:
  license:
    accept: true
  authoring:
    authConfig:
      authType: OIDC
      oidcConfig:
        clientIDKey: <client-id>
        clientSecretKey: <client-secret>
        discovery: true
        secretName: <keycloak-oidc-secret>
        site: <oidc_provider_site>
    tls:
      trustedCertificates:
        - certificate: <ca-key>
          secretName: <keycloak-ca>
```
