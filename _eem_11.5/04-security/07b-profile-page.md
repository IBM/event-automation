---
title: "Managing access to the Admin API"
excerpt: "Access to the Event Endpoint Management Admin API is controlled by access tokens. Find out how to create and manage tokens that provide access to your Event Endpoint Management deployment and features from other systems."
categories: security
slug: api-tokens
toc: true
---

The {{site.data.reuse.eem_name}} [Admin API]({{ 'eem-api' | relative_url }}) provides a set of APIs you can use to access the features of {{site.data.reuse.eem_name}} programmatically without depending on the browser-based UI.

To make API requests to {{site.data.reuse.eem_name}}, you require an [access token](#api-access-tokens).

The following features are available by using the Admin API:

- [Clusters](../../describe/managing-clusters) (Create, Read, Update, Delete)
- [Event sources](../../describe/adding-topics) (Create, Read, Update, Delete)
- [Option lifecycle states](../../describe/managing-options#option-lifecycle-states) (Publish, Unpublish, Archive)
- [Subscriptions](../../subscribe/managing-subscriptions/) (Create, Read, Update, Delete)
- [Gateways](../../describe/managing-gateways) (Read gateway list)

**Note:** If you are working with Kafka topics and clusters that you add manually, you must wait for the event source and the associated cluster to pass the connection tests against your gateways after creating an event source. Only after these tests successfully pass can you proceed to publish any options that you create for the event source.

## Prerequisites

If you installed {{site.data.reuse.eem_name}} on the {{site.data.reuse.openshift_short}}, the {{site.data.reuse.eem_name}} Admin API is enabled by default and is accessible from outside the cluster.

If you installed {{site.data.reuse.eem_name}} on a Kubernetes platform other than OpenShift, ensure you [configure ingress](../../installing/configuring/#configuring-ingress) for the Admin API by setting the correct values in the `spec.manager.endpoints[]` section of the `EventEndpointManagement` custom resource that defines your {{site.data.reuse.eem_manager}} instance.

The URL for the Admin API is displayed in the {{site.data.reuse.eem_name}} [**Profile** page](#api-access-tokens).

The Admin API is available from outside the cluster.

**Note:** To manage access to {{site.data.reuse.eem_name}}, authorization is provided through [role mappings](../user-roles/). When using OpenID Connect (OIDC) authorization and a custom claim from your OIDC provider, retrieving authorization depends on whether your provider supports offline access or not.
- If your OIDC provider supports the [offline access scope](https://openid.net/specs/openid-connect-core-1_0.html#OfflineAccess){:target="_blank"}, you can retrieve authorizations for a user when the user is not logged into the UI. To use this feature, ensure `offline_access` is added to the  [additional scopes configuration](../../reference/api-reference/#resource-oidcconfig).
- If your OIDC provider does not support the `offline_access` scope, or you do not want to use it, ensure you add the user to the role mappings file. For information about adding the `offline_access` scope, see [setting up authorization with a custom role identifier](../managing-access/#setting-up-oidc-based-authorization-with-a-custom-role-identifier).

  **Important:** When using `offline_access`, your provider might control how long the offline session can last before expiring. If the session lifetime is shorter than the [lifetime of {{site.data.reuse.eem_name}} tokens](#creating-a-token) (90 days), then the user might receive unauthorized error responses when trying to make API calls with their token. To use the API again, the user must log in to the {{site.data.reuse.eem_name}} UI again to retrieve a new offline access token.

## API access tokens
{: #api-access-tokens}

To make API requests to {{site.data.reuse.eem_name}}, you require an access token. You can create and manage tokens in the **Profile** page.

The **Profile** page displays the following information:

- The URL to use for making API requests to {{site.data.reuse.eem_name}} programmatically.
- A list of previously created tokens.
- The current {{site.data.reuse.eem_name}} organization that you are a member of. Every user in {{site.data.reuse.eem_name}} is a member of the organization called **eem**. This organization value is required for making API requests.

You can also use access tokens to [set up integration]({{'es/installing/integrating-eem/' | relative_url}}) with {{site.data.reuse.es_name}}, so you can share your Kafka topics with {{site.data.reuse.eem_name}} from the {{site.data.reuse.es_name}} UI.

**Note:** The access token is only displayed in the {{site.data.reuse.eem_name}} UI when it is generated, and it cannot be retrieved later in the UI or through any API. If you forget the token, you need to delete it from the list of tokens and create a new one.

### Creating a token

To create an access token, complete the following steps:

1. {{site.data.reuse.eem_ui_login}}
2. Click the user icon ![User icon]({{ 'images' | relative_url }}/usericon.svg "The user icon."){:height="30px" width="15px"} in the header, and then click **Profile** to open the **Profile** page.
3. If your user has the [author role](../../security/user-roles), then within the **Profile** page, switch to the **Access tokens** tab.
4. Click **Create token** to open the dialog.
5. Read the message and note that API access tokens expire.
6. Provide a token description that can be used to identify your token and then click **Create**.
7. A new token is generated.

   - To view the token, click **Show token** within the **Token** field.
   - To copy the token, click **Copy token**.

   **Note:** The API access token is displayed one time, it cannot be retrieved later. Ensure you copy and save the token. If you forget the token, you need to [delete it](#removing-an-api-token) from the list of tokens and create a new token to access the API.

8. Click **Close** to close the dialog.

The created token is added to the **Tokens** table.

### Removing a token

Token entries are displayed in the **Tokens** table on the **Profile** page until they are deleted. You can delete expired tokens or tokens that are no longer required. 

**Note:** API requests that use an expired token are rejected by {{site.data.reuse.eem_name}}.

To delete a token, complete the following steps:

1. {{site.data.reuse.eem_ui_login}}
2. Click the user icon ![User icon]({{ 'images' | relative_url }}/usericon.svg "The user icon."){:height="30px" width="15px"} in the header, and then click **Profile** to open the **Profile** page.
3. If your user has the [author role](../../security/user-roles), then within the **Profile** page, switch to the **Access tokens** tab.
3. Click **Delete** ![Delete icon]({{ 'images' | relative_url }}/trashcan.svg "The delete icon."){:height="30px" width="15px"} in the row of the token you want to remove.
4. Read the **Delete token** warning, and provide confirmation by entering the token description in the field exactly as it is displayed in the message.
5. Click **Delete**.
   **Important:** Deleting a token is permanent and cannot be reversed.
