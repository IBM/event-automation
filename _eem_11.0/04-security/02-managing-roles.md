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
- `author`: Assigns users viewer access to the {{site.data.reuse.eem_name}} UI and shared resources. This role also gives them permissions to create and share their own resources. 

**Note:** You must assign at least one of these roles to each user as the first role.

## Setting up roles for Local authorization

Along with [configuring the user credentials](../managing-access), you must define user mappings through the secret `<custom-resource-name>-ibm-eem-user-roles` to define the roles for each local user.

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
Where the `id` is the username specified for the user. 

## Setting up roles for OIDC based authorization

You must provide user mappings through the secret `<custom-resource-name>-ibm-eem-user-roles` to match the OIDC Identification Provider's user subjects. 

The following example shows a user mappings file:
```json
{
  "mappings": [
    {
      "id": "<user_subject_1>",
      "roles": [
        "author"
      ]
    },
    {
      "id": "<user_subject_2>",
      "roles": [
        "viewer"
      ]
    }
  ]
}
```

For more information about retrieving the `user subjects`, see [managing access](../managing-access) section.

### Setting up OIDC based authorization with a custom role identifier

Custom role identifiers can be used as the `id` in the user mappings JSON stored in the `<custom-resource-name>-ibm-eem-user-roles` secret. 

Following on from the example in [managing access](../managing-access#setting-up-oidc-based-authorization-with-a-custom-role-identifier), the following is an example of user mappings:

```json
{
  "mappings": [
    {
      "id": "org-admin",
      "roles": [
        "author"
      ]
    },
    {
      "id": "org-viewer",
      "roles": [
        "viewer"
      ]
    }
  ]
}
```

Where `org-admin` and `org-viewer` are the custom identifiers, inferred from the OIDC provider token, used to assign user permissions in {{site.data.reuse.eem_name}}.
