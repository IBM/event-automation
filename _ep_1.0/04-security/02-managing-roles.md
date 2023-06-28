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

Continuing from the example in [managing access](../managing-access#setting-up-oidc-based-authorization-with-a-custom-role-identifier), the following is an example of user mappings:

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