---
title: "Managing user roles"
excerpt: "Add roles for users to determine their permissions."
categories: security
slug: user-roles
toc: true
---

After [configuring access](../managing-access) to your {{site.data.reuse.eem_manager}} instance, you must specify roles for your users to determine their permissions. 

{{site.data.reuse.eem_name}} supports the following roles:
- `viewer`: Assigns users viewer access to the {{site.data.reuse.eem_name}} UI and shared resources
- `author`: Assigns users viewer access to the {{site.data.reuse.eem_name}} UI and shared resources. This role also gives users permissions to create and share their own resources.
- `admin`: Assigns users the required permissions to view and manage {{site.data.reuse.egw}}s, including [adding and configuring](../../installing/install-gateway/#remote-gateways) them.

**Note:** You must assign at least one of these roles to each user.

You can set up authorization in one of the following ways:
1. [Assign individual roles to users](#assigning-individual-roles-to-users) with local or OIDC authentication.
2. Optional: If using an OIDC provider for authentication, you can [set up roles by using a custom identifier](#setting-up-roles-by-using-a-custom-identifier), where the custom identifier maps to fields in your external security manager.
3. If using the {{site.data.reuse.cp4i}} identity provider, you must [assign roles to specific Keycloak groups](#assigning-roles-to-your-keycloak-users-and-groups) to match your {{site.data.reuse.cp4i}} installation, then manage authorization though its Keycloak instance.

## Assigning individual roles to users

Users are assigned roles in {{site.data.reuse.eem_name}} through user mapping, where an identifier for the user or a group of users is mapped to a role or set of roles. The mappings are defined in a configuration file that is exposed through the Kubernetes secret `<custom-resource-name>-ibm-eem-user-roles`.

By default, this file requires separate mapping information for each user, where the `id` in the mappings file is the unique identifier of the user:

- When using local authentication, it is the `username` for the user as set in the `<custom-resource-name>-ibm-eem-user-credentials` secret. For more information, see [managing access](../managing-access).

- When using OIDC-based authentication, it is the user's `subject`. You can retrieve this either directly from your OIDC provider, or by logging in to the {{site.data.reuse.eem_name}} UI and setting the path to `/auth/protected/userinfo` in the URL.

The following example shows a user mappings file:

```json
{
  "mappings": [
    {
      "id": "adminAndAuthor1",
      "roles": [
        "author",
        "admin"
      ]
    },
    {
      "id": "author1",
      "roles": [
        "author"
      ]
    },
    {
      "id": "viewer1",
      "roles": [
        "viewer"
      ]
    }
  ]
}
```

### Using {{site.data.reuse.openshift_short}} web console

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Workloads** in the navigation on the left and click **Secrets**. This lists the secrets available in this project (namespace).
3. To edit the secret `<custom-resource-name>-ibm-eem-user-roles` with your role mappings, go to **Actions**, and click **Edit Secret**.
4. Edit the mappings, as described in the [setting up roles per user](#assigning-individual-roles-to-users) or [setting up roles by using a custom identifier](#setting-up-roles-by-using-a-custom-identifier) sections depending on your use case.
5. Click **Save**.

### Using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. Create a `myroles.json` JSON file that contains the user role mappings for your {{site.data.reuse.eem_manager}} instance as described in the [setting up roles per user](#assigning-individual-roles-to-users) or [setting up roles by using a custom identifier](#setting-up-roles-by-using-a-custom-identifier) sections depending on your use case.

3. Obtain the Base64-encoded string representing the file content. For example, you can run the following command to obtain the string:

   ```shell
   cat myroles.json | base64
   ```

4. Patch the `<custom-resource-name>-ibm-eem-user-roles` secret with the local user credentials by running the following command:

   ```shell
   kubectl patch secret <custom-resource-name>-ibm-eem-user-roles --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-mapping.json" ,"value" : "<your-Base64-value>"}]'
   ```

   Where:
    - \<custom-resource-name\> is the name of your {{site.data.reuse.eem_manager}} instance.
    - \<your-Base64-value\> is the Base64-encoded string returned from the previous command.

   For example:

   ```shell
   kubectl patch secret quick-start-manager-ibm-eem-user-roles --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-mapping.json" ,"value" : "ewogICJtYXBwaW5ncyI6IFsKICAgIHsKICAgICAgImlkIjogImF1dGhvcjEiLAogICAgICAicm9sZXMiOiBbCiAgICAgICAgImF1dGhvciIKICAgICAgXQogICAgfSwKICAgIHsKICAgICAgImlkIjogInZpZXdlcjEiLAogICAgICAicm9sZXMiOiBbCiAgICAgICAgInZpZXdlciIKICAgICAgXQogICAgfQogIF0KfQo="}]'
   ```

   **Note:** Alternatively, edit the secret directly and replace the Base64 value associated with `data.user-mapping.json`. To edit the secret directly, run the following command:

   ```bash
   kubectl edit secret/<custom-resource-name>-ibm-eem-user-roles -o json
   ```

5. For security reasons, delete the local file you created.

**Note:** The changed configuration file is automatically picked up by the {{site.data.reuse.eem_manager}} instance after a few minutes.






## Setting up roles by using a custom identifier

Using a custom identifier is a more advanced configuration only available with OIDC-based authentication. It means you can map users to their roles through a custom property (claim) associated with the user in the configured OIDC provider.

To use a custom identifier, you must configure your {{site.data.reuse.eem_manager}} instance to set where it can find the property to use for the mapping. During log in, {{site.data.reuse.eem_name}} checks for the configured property in the user information received from the OIDC provider in the following order: 

1. `ID token`
2. `Access Token`
3. `User Info`

**Note:** If the property is not found, {{site.data.reuse.eem_name}} will attempt to map the user directly by using their `subject` (as mentioned in [setting up roles per user](#assigning-individual-roles-to-users)).

To configure the custom property (claim) to use, set the `authorizationClaimPointer` and the `additionalScopes` fields in the `spec.manager.authConfig.oidcConfig` section of your `EventEndpointManagement` custom resource:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  # ...
  manager:
    authConfig:
      authType: OIDC
      oidcConfig:
     # ...
        authorizationClaimPointer: <required "/" separated JSON path to the location of the required property>
        additionalScopes: <optional additional scopes to be requested during OIDC-based authentication to retrieve additional properties>
#...
```

**Note:** The property being mapped must either be a string or a list of strings.

To configure the `authorizationClaimPointer` field, use the `/auth/protected/userinfo` endpoint to view all attributes determined about you from your login, ID token, access token (if it is a JWT), or User Info endpoint. Set the URL path to `/auth/protected/userinfo` to display these attributes, which helps you configure the `authorizationClaimPointer` field correctly.

Determine the required path from the source you are interested in. For example, consider the following` /auth/protected/userinfo` response:

```json
{
  ...
  "attributes": {
    "idToken": {
      "data": {
        "roles": ["my-role"]
      }
    },
    "accessToken": {
      "groups": ["my-group"]
    },
    "userInfo": {
      "meta": {
        "organization": "hr"
      }
    }
  }
}
```
If you want to map roles from the ID token, set the `authorizationClaimPointer` value to `/data/roles`. This path is derived from the `idToken` source, which contains the desired `roles` value.

**Note:** This data includes your PII and you must not share it with others or IBM support. 

### Example configuration

The following example describes how to set up roles for a custom identifier called `developer`.

An OIDC provider always provides an ID token, but you might receive additional data from the provider, and you can use this data for mapping user roles to the roles in {{site.data.reuse.eem_name}}.

The OIDC provider might store additional user information that can be returned to the client (in this case, {{site.data.reuse.eem_name}}) if the client asks for it by requesting the appropriate scope.

For example, the provider supports a `data` scope which returns the following additional user information when requested:

```json
{
  "data": {
    "group": "test",
    "roles": ["developer", "manager"]
  }
}
```

With a single mapping in the user mappings file, you can assign `viewer` access to {{site.data.reuse.eem_name}} for all users that have the `developer` role (the custom identifier as listed in the `roles` field of the updated ID token). 

Complete the following steps to assign access:

1. Configure {{site.data.reuse.eem_name}} to request this additional user information by adding the mentioned `data` scope to the `additionalScopes` field in your `EventEndpointManagement` custom resource:

   ```yaml
   additionalScopes: ["data"]
   ```

   This setting means that the next time the user logs in, their ID token will also include the additional information from `data`:

   ```json
   {
     "sub": "user-xyz-123",
     "name": "xyz-123",
     "data": {
       "group": "test",
       "roles": ["developer", "manager"]
   },
   ...
   "exp": 123456
   }
   ```


1. Add the path to the required property (in this example, `/data/roles`) to the `authorizationClaimPointer` field in the `EventEndpointManagement` custom resource as follows:

   ```yaml
   authorizationClaimPointer: /data/roles
   ```

1. Update the role mappings file as follows to map the `developer` role as an `id` to have the {{site.data.reuse.eem_name}} `viewer` role:

   ```json
   {
     "mappings": [
       {
         "id": "developer",
         "roles": [
           "viewer"
         ]
       }
     ]
   }
   ```

   This instructs {{site.data.reuse.eem_name}} to look inside the ID token for the value at `/data/roles`, and it will then be able to map the `developer` role in the OIDC provider to the `viewer` role in {{site.data.reuse.eem_name}} by using the mappings file.

   This means that any user who is known to the OIDC provider and has the `developer` role will be able to use {{site.data.reuse.eem_name}}.

**Note:** {{site.data.reuse.eem_name}} checks multiple sources for the configured property. If it does not find the `/data/roles` field in the `ID token`, it will check for it next in the `Access Token`, then finally it will check in the response to the `User Info` API, which is available in all OIDC providers. {{site.data.reuse.eem_name}} uses the value from the first match. If no match is found, it defaults to checking for the user's `subject` directly in the mappings file.


## Assigning roles to your Keycloak users and groups
{: #assign-roles-keycloak}

If you want to authenticate with Keycloak, ensure that you have {{site.data.reuse.cp4i}} 16.1.0 (operator version 7.3.0) or later [installed](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.0?topic=installing){:target="_blank"}, including the required dependencies.

When you configure an {{site.data.reuse.eem_name}} instance with the `INTEGRATION_KEYCLOAK` authentication type, to integrate with a {{site.data.reuse.cp4i}} installation, you must configure the Kubernetes secret `<custom-resource-name>-ibm-eem-user-roles` with the following contents:

```json
{
    "mappings": [
        {
            "id": "admin",
            "roles": [
                "admin",
                "author"
            ]
        },
        {
            "id": "viewer",
            "roles": [
                "viewer"
            ]
        },
        {
            "id": "eventendpointmanagement-admin",
            "roles": [
                "admin",
                "author"
            ]
        },
        {
            "id": "eventendpointmanagement-viewer",
            "roles": [
                "viewer"
            ]
        },
        {
            "id": "eem-admin",
            "roles": [
                "admin"
            ]
        },
        {
            "id": "eem-author",
            "roles": [
                "author"
            ]
        },
        {
            "id": "eem-viewer",
            "roles": [
                "viewer"
            ]
        },
        {
            "id": "author",
            "roles": [
                "author"
            ]
        }
    ]
}
```

For each {{site.data.reuse.eem_name}} instance, a Keycloak client is created with the name `ibm-eem-<namespace>-<eem-instance-name>`. Attached to this client are the following roles:

- `eem-author`
- `eem-viewer`
- `author` (deprecated). 

For your user or group to have author privileges in the UI, assign the `eem-author` role to the user or group in the {{site.data.reuse.cp4i}} security console as follows:

1. {{site.data.reuse.openshift_ui_login}}
1. Expand the **Networking** drop-down, and select **Routes** to open the **Routes** page. 
1. Select the project where the Keycloak operator is installed.
1. In the row for **Keycloak**, select the link provided in the **Location** column. For example, `https://keycloak-<namespace>.apps.<cluster-domain>`.
1. In the **Red Hat build of Keycloak** welcome page, select **Administration Console** and log in with your credentials. See how to [retrieve](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.0?topic=management-getting-initial-administrator-password){:target="_blank"} your credentials.
1. To display the list of realms, click the arrow and select **cloudpak** in the navigation on the left.
1. Select either **Users** or **Groups**.
1. Click the name of the user or group that you want to work with.
1. Click the **Role mapping** tab.
1. Click **Assign role**.
1. In the drop-down menu, select **Filter by clients**, and then click the eem-author role defined by the relevant Keycloak client.
1. Click **Assign**.

**Note:** The following table lists the roles that INTEGRATION_KEYCLOAK provides for {{site.data.reuse.cp4i}} components:

| Role | Description |
| --- | --- |
| **admin** | Admin and author access to all {{site.data.reuse.cp4i}} components |
|**viewer** | Viewer access to all {{site.data.reuse.cp4i}} components |
| **eventendpointmanagement-admin** | Author access to any {{site.data.reuse.eem_name}} instance created within {{site.data.reuse.cp4i}} |
| **eventendpointmanagement-viewer** | Viewer access to any {{site.data.reuse.eem_name}} instance within {{site.data.reuse.cp4i}} |


## Retrieving roles for the Admin API

When using the {{site.data.reuse.eem_name}} Admin API, the [access token for the API](../api-tokens) has the same permissions as the user who created it. 

If you have [set up roles per user](#assigning-individual-roles-to-users), the permissions are assigned by using the same role mappings file as mentioned earlier without any additional configuration. However, instead of mapping information from the OIDC log in flow, the role is mapped by using the owner of the token.

**Important:** If you have [set up roles by using a custom identifier](#setting-up-roles-by-using-a-custom-identifier), additional configuration is required to ensure Admin API users have the expected permissions. This is because to map users to roles, a custom property in OIDC is used instead of the unique user subject (the owner of the token).

{{site.data.reuse.eem_name}} supports the use of the OIDC scope `offline_access`, and you can configure {{site.data.reuse.eem_name}} to request this additional property by adding the `offline_access` scope to `additionalScopes` in your `EventEndpointManagement` custom resource:

```yaml
additionalScopes: ["offline_access"]
```

The `offline_access` scope allows {{site.data.reuse.eem_name}} to refresh user information and retrieve up-to-date ID and Access tokens for users previously logged in to the {{site.data.reuse.eem_name}} UI (even when they are no longer logged in to the UI). 

These tokens are then used to perform user mapping as [described earlier](#setting-up-roles-by-using-a-custom-identifier), assigning the correct permissions to the token being used.

**Important:** Some OIDC providers allow the length of time before offline access expires to be configured. In such cases, the offline access might expire before the {{site.data.reuse.eem_name}} token expires. If this happens, the user will have to log back in to the UI to enable {{site.data.reuse.eem_name}} to refresh offline access.

**Note:** Not all OIDC providers support the `offline_access` scope. Also, you might not want to give {{site.data.reuse.eem_name}} permission to perform offline access. In either of these cases, to continue to use the Admin API, reference each user individually in the user mappings file.
