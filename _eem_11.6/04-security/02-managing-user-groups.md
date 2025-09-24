---
title: "Managing user groups"
excerpt: "Configure access to groups of users in your organization."
categories: security
slug: groups
toc: true
---

![Event Endpoint Management 11.6.3 icon]({{ 'images' | relative_url }}/11.6.3.svg "In Event Endpoint Management 11.6.3 and later.") In {{site.data.reuse.eem_name}} 11.6.3 and later, after you [configure access](../managing-access) to your {{site.data.reuse.eem_manager}} instance, you can configure {{site.data.reuse.eem_name}} to access and utilize [user groups](../../about/key-concepts/#user-groups) that are provided by an external identity provider. This means that {{site.data.reuse.eem_name}} can recognize and manage the user groups that are established by your organization's administrators to control visibility to {{site.data.reuse.eem_name}} components such as [options](../../about/key-concepts/#options).

**Note:** Access to user groups is available with [OpenID Connect (OIDC)](https://openid.net/developers/how-connect-works/){:target="_blank"} authentication only.

## ![Event Endpoint Management 11.6.4 icon]({{ 'images' | relative_url }}/11.6.4.svg "In Event Endpoint Management 11.6.4 and later.") User group actions in {{site.data.reuse.eem_name}} 11.6.4 and later
{: #group-actions}

In {{site.data.reuse.eem_name}} 11.6.4 and later, you can use user groups to enable members of the group to edit event sources and maintain clusters. When users are added as part of a group to perform a particular task, they can only perform certain actions. The following sections describe the different types of users and the actions that they can perform. As the owner, you have elevated permissions, including the ability to assign user groups to tasks.

In the UI, users are identified as follows with an **Editor**, **Maintainer**, or **Owner** graphic:

- **Event source editor**:  ![Event source editor pill]({{ 'images' | relative_url }}/editor.svg "Event source editor pill.") 
- **Cluster maintainer**:   ![Cluster maintainer pill]({{ 'images' | relative_url }}/maintainer.svg "Cluster maintainer pill.") 
- **Owner**:                ![Owner pill]({{ 'images' | relative_url }}/owner.svg "Owner pill.")
   
**Note:** As the user assigning user groups to a task, you are identified as the owner.


### Option viewers
{: #option-viewers}

Option viewers are a group of users that, in addition to existing public options, can also view and subscribe to selected options in the catalog. Users can view and subscribe to the [options that are assigned](../../describe/user-groups/) to their user group. 

Option viewers can:
- View options
- Subscribe to options

Option viewers cannot:
- Create, publish, or delete options
- Manage event sources (add or delete topics, edit topic information, or manage access)
- Manage clusters (add, delete, or edit)

### Event source editors
{: #event-source-editors}

Event source editors can update [event source information](../../describe/managing-event-sources/#overview-information) and [manage](../../describe/managing-options/) options for the event sources that are added to their user group.

Event source editors can:
- Create, publish, and delete options
- Edit event source information
- Revoke subscriptions
- Manage access requests

Event source editors cannot:
- Delete event sources
- Change event source editors

### Cluster maintainers
{: #cluster-maintainers}

Cluster maintainers can [edit](../../administering/managing-clusters/#editing-a-cluster) and maintain cluster connection definitions for the clusters that are added to their user group.

Cluster maintainers can:
- Edit clusters

Cluster maintainers cannot:
- Delete clusters
- Change cluster maintainers


## Accessing user groups
{: #access-user-groups}

You can set up access to user groups by using a custom identifier. To use a custom identifier, you must configure your {{site.data.reuse.eem_manager}} instance to set where it can find the groups property. During login, {{site.data.reuse.eem_name}} checks for the configured property in the user information received from the OIDC provider in the following order:

1. `ID token`
2. `Access Token`
3. `User Info`

To configure the custom property (claim) to use, set the `userGroupClaimPointer`. If required, set the `additionalScopes` fields in the `spec.manager.authConfig.oidcConfig` section of your `EventEndpointManagement` custom resource:

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
        userGroupClaimPointer: <required "/" separated JSON path to the location of the required property>
        additionalScopes: <optional additional scopes to be requested during OIDC-based authentication to retrieve additional properties>
#...
```

**Note:** The property that you use must refer to a string or a list of strings. Do not use forward slashes (`/`) in the property names. Forward slashes are used as a JSON path separator, but will fail to work correctly if present in a property name.

To configure the `userGroupClaimPointer` field, use the `/auth/protected/userinfo` endpoint to view all attributes determined about you from your login, ID token, access token (if it is a JWT), or user information endpoint. Set the URL path to `/auth/protected/userinfo` to display these attributes, which helps you configure the `userGroupClaimPointer` field correctly.

Determine the required path from the source that you are interested in. For example, consider the following` /auth/protected/userinfo` response:

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
If you want to map groups from the user info, set the `userGroupClaimPointer` value to `/meta/organization`. This path is derived from the `userInfo` source, which contains the `organization` value that you need.

**Note:** This data includes your PII and you must not share it with others or IBM support.

### Example configuration
{: #example-configuration}

The following example describes how to set up user groups.

An OIDC provider always provides an ID token, but you might receive additional data from the provider, and you can use this data as the source for a user group.

The OIDC provider might store additional user information that can be returned to the client (in this case, {{site.data.reuse.eem_name}}) if the client asks for it by requesting the appropriate scope.

For example, the provider supports a `data` scope that returns the following additional user information when requested:

```json
{
  "data": {
    "group": "test",
    "roles": ["developer", "manager"]
  }
}
```

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


1. Add the path to the required property (in this example, `/data/group`) to the `userGroupClaimPointer` field in the `EventEndpointManagement` custom resource as follows:

   ```yaml
   userGroupClaimPointer: /data/group
   ```


**Note:** {{site.data.reuse.eem_name}} checks multiple sources for the configured property. If it does not find the `/data/group` field in the `ID token`, it checks for it next in the `Access Token`, then finally it checks in the response to the `User Info` API, which is available in all OIDC providers. {{site.data.reuse.eem_name}} uses the value from the first match. If no match is found, assume that the user has no groups.

## Retrieving user groups for the Admin API
{: #retrieving-user-groups-for-the-admin-api}

When you use the {{site.data.reuse.eem_name}} Admin API, the [access token for the API](../api-tokens) has the same permissions as the user who created it.


**Important:** If you [access user groups by using a custom identifier](#access-user-groups), additional configuration is required to ensure that Admin API users have their groups read and see the correct options in the catalog. This is because a custom property in OIDC is used instead of the unique user subject (the owner of the token).

{{site.data.reuse.eem_name}} supports the use of the OIDC scope `offline_access`, and you can configure {{site.data.reuse.eem_name}} to request this additional property by adding the `offline_access` scope to `additionalScopes` in your `EventEndpointManagement` custom resource:

```yaml
additionalScopes: ["offline_access"]
```

You must use an `offline_access` token to retrieve [user groups](../../about/key-concepts/#user-groups).

The `offline_access` scope allows {{site.data.reuse.eem_name}} to refresh user information and retrieve up-to-date ID tokens, access tokens, and user information for users who were previously logged in to the {{site.data.reuse.eem_name}} UI (even when they are no longer logged in to the UI).


**Important:** Some OIDC providers allow the length of time before offline access expires to be configured. In such cases, the offline access might expire before the {{site.data.reuse.eem_name}} token expires. If this happens, the user must log back in to the UI to enable {{site.data.reuse.eem_name}} to refresh offline access.

**Note:** Not all OIDC providers support the `offline_access` scope. Also, you might not want to give {{site.data.reuse.eem_name}} permission to perform offline access. In either of these cases, an Admin API user cannot use groups, and will see public options only.
