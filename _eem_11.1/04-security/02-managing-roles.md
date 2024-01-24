---
title: "Managing user roles"
excerpt: "Add roles for users to determine their permissions."
categories: security
slug: user-roles
toc: true
---

After [configuring access](../managing-access) to your {{site.data.reuse.eem_name}} instance, you can specify roles for your users to determine their permissions. 

{{site.data.reuse.eem_name}} supports the following roles:
- `viewer`: Assigns users viewer access to the {{site.data.reuse.eem_name}} UI and shared resources
- `author`: Assigns users viewer access to the {{site.data.reuse.eem_name}} UI and shared resources. This role also gives users permissions to create and share their own resources.

**Note:** You must assign at least one of these roles to each user.

You can set up authorization in one of the following ways:
1. [Assign each user their roles individually](#setting-up-roles-per-user).
2. If using an OIDC provider for authentication, [define mappings to custom roles in your OIDC provider](#setting-up-roles-by-using-a-custom-identifier).

## Assigning roles to users

Users are assigned roles in {{site.data.reuse.eem_name}} through user mapping, where an identifier for the user or a group of users is mapped to a role or set of roles. The mappings are defined in a configuration file that is exposed through the Kubernetes secret `<custom-resource-name>-ibm-eem-user-roles`. By default, this file requires separate mapping information for each user.

The following example shows a user mappings file:

```json
{
  "mappings": [
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
3. To edit the secret `<custom-resource-name>-ibm-eem-user-roles` with your role mappings, go to **Actions** and click **Edit Secret**.
4. Edit the mappings, as described in the [setting up roles per user](#setting-up-roles-per-user) or [setting up roles by using a custom identifier](#setting-up-roles-by-using-a-custom-identifier) sections depending on your use case, for example:

   ```json
   {
     "mappings": [
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
5. Click **Save**.

### Using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. Create a JSON file called `myroles.json` that contains the user role mappings for your {{site.data.reuse.eem_name}} instance. As described in the [setting up roles per user](#setting-up-roles-per-user) or [setting up roles by using a custom identifier](#setting-up-roles-by-using-a-custom-identifier) sections depending on your use case, for example:

   ```json
   {
     "mappings": [
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

3. Obtain the Base64-encoded string representing the file content. For example, you can run the following command to obtain the string:

   ```shell
   cat myroles.json | base64
   ```

4. Patch the `<custom-resource-name>-ibm-eem-user-roles` secret with the local user credentials by running the following command:

   ```shell
   kubectl patch secret <custom-resource-name>-ibm-eem-user-roles --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-mapping.json" ,"value" : "<your-Base64-value>"}]'
   ```

   where:
    - \<custom-resource-name\> is the name of your {{site.data.reuse.eem_name}} instance.
    - \<your-Base64-value\> is the Base64-encoded string returned from the previous command.

   for example:

   ```shell
   kubectl patch secret quick-start-manager-ibm-eem-user-roles --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-mapping.json" ,"value" : "ewogICJtYXBwaW5ncyI6IFsKICAgIHsKICAgICAgImlkIjogImF1dGhvcjEiLAogICAgICAicm9sZXMiOiBbCiAgICAgICAgImF1dGhvciIKICAgICAgXQogICAgfSwKICAgIHsKICAgICAgImlkIjogInZpZXdlcjEiLAogICAgICAicm9sZXMiOiBbCiAgICAgICAgInZpZXdlciIKICAgICAgXQogICAgfQogIF0KfQo="}]'
   ```

   **Note:** Alternatively, edit the secret directly and replace the Base64 value associated with `data.user-mapping.json`. To edit the secret directly, run the following command:

   ```bash
   oc edit secret/<custom-resource-name>-ibm-eem-user-roles -o json
   ```

5. **Important:** For security reasons, delete the local file you created.

**Note:** The changed configuration file is automatically picked up by the {{site.data.reuse.eem_name}} instance after a few minutes.

### Setting up roles per user

This is the default set up, where the `id` in the file is the unique identifier of the user:
- When using local authentication, it is the `username` for the user as set in the `<custom-resource-name>-ibm-eem-user-credentials` secret (for more information, see [managing access](../managing-access)).
- When using OIDC-based authentication, it is the user's `subject`. You can retrieve this either directly from your OIDC provider, or by logging in to the {{site.data.reuse.eem_name}} UI and setting the path to `/auth/protected/userinfo` in the URL.

### Setting up roles by using a custom identifier

Using a custom identifier is a more advanced configuration only available with OIDC-based authentication. It means you can map users to their roles through a custom property (claim) associated with the user in the configured OIDC provider.

To use a custom identifier, you must configure your {{site.data.reuse.eem_name}} instance to set where it can find the property to use for the mapping. During log in, {{site.data.reuse.eem_name}} checks for the configured property in the user information received from the OIDC provider in the following order: 
1. `ID token`
2. `Access Token`
3. `User Info`

If the property is not found, {{site.data.reuse.eem_name}} will attempt to map the user directly by using their `subject` (as mentioned in [setting up roles per user](#setting-up-roles-per-user)). 

To configure the custom property (claim) to use, add details to the following fields in the `spec.manager.authConfig.oidcConfig` section of your `EventEndpointManagement` custom resource:

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
         ...
         authorizationClaimPointer: <required "/" separated JSON path to the location of the required property>
         additionalScopes: <optional additional scopes to be requested during OIDC-based authentication to retrieve additional properties>
   ...
```

**Note:** The property being mapped must either be a String or a list of Strings.

For example, the following is an ID token received from an OIDC provider at authentication:

```json
{
  "sub": "user-xyz-123",
  "name": "xyz-123",
  ...
  "exp": 123456
}
```

An OIDC provider always provides an ID token, but you might receive additional data from the provider, and you can use this data for mapping user roles to the roles in {{site.data.reuse.eem_name}}.

The OIDC provider might store additional user information that can be returned to the client (in this case, {{site.data.reuse.eem_name}}) if the client asks for it by requesting the appropriate scope. 

For example, in the following scenario the provider supports a `data` scope which when requested returns the following additional user information:

```json
{
  "data": {
    "group": "test",
    "roles": ["developer", "manager"]
  }
}
```

In this example, you could configure {{site.data.reuse.eem_name}} to request this additional user information by adding the mentioned `data` scope to `additionalScopes` as follows:

```yaml
additionalScopes: ["data"]
```

This setting means that the next time the user logs in, their ID token will include the information from `data`:

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

Using this information, all developers (as listed in the `roles` field of the updated ID token) can be granted `viewer` access to {{site.data.reuse.eem_name}} with a single mapping in the user mappings file. To do this, add the path to property in `authorizationClaimPointer` in the {{site.data.reuse.eem_name}} custom resource as follows:

```yaml
authorizationClaimPointer: /data/roles
```

Then update the role mappings file as follows to map the `developer` role as an `id` to have the {{site.data.reuse.eem_name}} `viewer` role:

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

**Note:** {{site.data.reuse.eem_name}} checks multiple sources for the configured property. If it does not find the `/data/roles` field in the `ID token`, it will check for it next in the `Access Token`, then finally it will check in the response to the `User Info` API, which is available in all OIDC providers. {{site.data.reuse.eem_name}} uses the value from the first match. If no match is found, it defaults to checking for the user's `subject` directly in the mappings file and the logs produced in the manager logs.


## Retrieving roles for the Admin API

When using the {{site.data.reuse.eem_name}} Admin API, the [access token for the API](../api-tokens) has the same permissions as the user who created it. 

If you have [set up roles per user](#setting-up-roles-per-user), the permissions are assigned by using the same role mappings file as mentioned earlier without any additional configuration. However, instead of mapping information from the OIDC log in flow, the role is mapped by using the owner of the token.

**Important:** If you have [set up roles by using a custom identifier](#setting-up-roles-by-using-a-custom-identifier), additional configuration is required to ensure Admin API users have the expected permissions. This is because to map users to roles, a custom property in OIDC is used instead of the unique user subject (the owner of the token).

{{site.data.reuse.eem_name}} supports the use of the OIDC scope `offline_access`, and you can configure {{site.data.reuse.eem_name}} to request this additional property by adding the `offline_access` scope to `additionalScopes` in your `EventEndpointManagement` custom resource:

```yaml
additionalScopes: ["offline_access"]
```

The `offline_access` scope allows {{site.data.reuse.eem_name}} to refresh user information and retrieve up-to-date ID and Access tokens for users previously logged in to the {{site.data.reuse.eem_name}} UI (even when they are no longer logged in to the UI). 

These tokens are then used to perform user mapping as [described earlier](#setting-up-roles-by-using-a-custom-identifier), assigning the correct permissions to the token being used.

**Important:** Some OIDC providers allow the length of time before offline access expires to be configured. In such cases, the offline access might expire before the {{site.data.reuse.eem_name}} token expires. If this happens, the user will have to log back in to the UI to enable {{site.data.reuse.eem_name}} to refresh offline access.

**Note:** Not all OIDC providers support the `offline_access` scope. Also, you might not want to give {{site.data.reuse.eem_name}} permission to perform offline access. In either of these cases, to continue to use the Admin API, reference each user individually in the user mappings file.
