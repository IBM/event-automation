---
title: "Managing user roles"
excerpt: "Add roles for users to determine their permissions."
categories: security
slug: user-roles
toc: true
---

After [configuring access](../managing-access) to your {{site.data.reuse.ep_name}} instance, you can specify roles for your user to determine their permissions.

{{site.data.reuse.ep_name}} supports the `user` role with complete access to the {{site.data.reuse.ep_name}} UI.

**Note:** You must assign this role to each user.

## Setting up roles for local authorization

Along with [configuring the user credentials](../managing-access), you must define user mappings through the secret `<custom-resource-name>-ibm-ep-user-roles` to define the roles for each local user.

The following example shows a sample user mappings file:

```json
{
  "mappings": [
    {
      "id": "user1",
      "roles": [
        "user"
      ]
    }
  ]
}
```

Where the `id` is the username that is specified for the user.

### Using {{site.data.reuse.openshift_short}} web console

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Workloads** in the navigation on the left and click **Secrets**. This lists the secrets available in this project (namespace).
3. To edit the secret `<custom-resource-name>-ibm-ep-user-roles` with your local user credentials, go to **Actions** and click **Edit Secret**.
4. Configure your user credentials. For example:

   ```json
   {
     "mappings": [
       {
         "id": "user1",
         "roles": [
           "user"
         ]
       }
     ]
   }
   ```

5. Click **Save**.

### Using the CLI

1. {{site.data.reuse.cncf_cli_login}}
2. Create a JSON file called `myroles.json` that contains the user role mappings for your {{site.data.reuse.ep_name}} instance, for example:

   ```json
   {
     "mappings": [
       {
         "id": "user1",
         "roles": [
           "user"
         ]
       }
     ]
   }
   ```

3. Obtain the Base64-encoded string representing the file content. For example, you can run the following command to obtain the string:

   ```shell
   cat myroles.json | base64
   ```

4. Patch the `<custom-resource-name>-ibm-ep-user-roles` secret with the local user credentials by running the following command:

   ```shell
   kubectl patch secret <custom-resource-name>-ibm-ep-user-roles --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-mapping.json" ,"value" : "<your-base64-value>"}]'
   ```

   where:
    - \<custom-resource-name\> is the name of your {{site.data.reuse.ep_name}} instance.
    - \<your-base64-value\> is the Base64-encoded string returned from the previous command.

   for example:

   ```shell
   kubectl patch secret quick-start-ep-ibm-ep-user-roles --type='json' -p='[{"op" : "replace" ,"path" : "/data/user-mapping.json" ,"value" : "ewogICJtYXBwaW5ncyI6IFsKICAgIHsKICAgICAgImlkIjogInVzZXIxIiwKICAgICAgInJvbGVzIjogWwogICAgICAgICJ1c2VyIgogICAgICBdCiAgICB9CiAgXQp9Cg=="}]'
   ```

   **Note:** Alternatively, edit the secret directly and replace the Base64 value associated with `data.user-mapping.json`. To edit the secret directly, run the following command:

   ```bash
   oc edit secret/<custom-resource-name>-ibm-ep-user-roles -o json
   ```

5. **Important:** For security reasons, delete the local file you created.

## Setting up roles for OIDC-based authorization

You must provide user mappings through the secret `<custom-resource-name>-ibm-ep-user-roles` to match the user subjects of the OIDC identification provider.

The following example shows a sample user mappings file:

```json
{
  "mappings": [
    {
      "id": "<user_subject_1>",
      "roles": [
        "user"
      ]
    }
  ]
}
```

For more information about retrieving the `user subjects`, see [managing access](../managing-access) section.

## Setting up OIDC-based authorization with a custom role identifier

Custom role identifiers can be used as the `id` in the user mappings JSON stored in the `<custom-resource-name>-ibm-eem-user-roles` secret.

Continuing from the example in [managing access](../managing-access#setting-up-oidc-based-authentication-with-a-custom-role-identifier), the following is an example of user mappings:

```json
{
  "mappings": [
    {
      "id": "org-admin",
      "roles": [
        "user"
      ]
    }
  ]
}
```

Where `org-admin` is a custom identifier, which is inferred from the OIDC provider token, and used to assign user permissions in {{site.data.reuse.ep_name}}.