---
title: "Managing access to the Admin API"
excerpt: "Access to the Event Endpoint Management Admin API is controlled by API tokens. Find out how to create and manage tokens that provide access to your Event Endpoint Management deployment and features from other systems."
categories: admin
slug: api-tokens
toc: true
---

The {{site.data.reuse.eem_name}} [Admin API]({{ 'eem-api' | relative_url }}) provides a set of APIs you can use to access the features of {{site.data.reuse.eem_name}} programmatically without depending on the browser-based UI.

The following features are available by using the Admin API:

- [Clusters](../managing-clusters) (Create, Read, Update, Delete)
- [Event sources](../../describe/adding-topics) (Create, Read, Update, Delete)
- [Option lifecycle states](../../describe/managing-options#option-lifecycle-states) (Publish, Unpublish, Archive)
- [Subscriptions](../../subscribe/managing-subscriptions/) (Create, Read, Update, Delete)
- [Gateways](../managing-gateways) (Read gateway list)

**Note**: After you create an event source for Kafka topics and clusters that you've added manually, you must wait for the event source and its associated cluster to pass the connection tests against your gateways. Only after these tests successfully pass can you proceed to publish any options that you create for the event source.

A dedicated {{site.data.reuse.eem_name}} Admin API endpoint is provided for each organization upon provisioning of an {{site.data.reuse.eem_name}} service. To make API requests to this endpoint, you require an [API token](#api-tokens).

## API tokens
{: #api-tokens}

To make [API requests](../api-tokens) to {{site.data.reuse.eem_name}}, you require an API token. You can create and manage tokens in the **Profile** page. The **Profile** page displays the current {{site.data.reuse.eem_name}} organization that you are a member of, and the list of any previously created tokens in the **Tokens** table.

**Note:** The API token is only displayed in the {{site.data.reuse.eem_name}} UI when it is generated. You cannot retrieve it later in the UI or through any API. If you forget the token, you need to delete it from the **Tokens** table and create a new one.

A maximum of 10 API tokens can be created per user. If you reach this limit, the **Create token** button is disabled. You need to delete old API tokens before you can create new ones.

API tokens are valid for 90 days after which they expire. API requests that use an expired token are rejected by {{site.data.reuse.eem_name}}.

An expired token should be deleted and a new token created and used in its place.


### Creating a token
{: #creating-a-token}

To create an API token, complete the following steps:

1. Log in to your {{site.data.reuse.eem_name}} UI from a supported web browser.
2. Click the user icon ![User icon]({{ 'images' | relative_url }}/usericon.svg "The user icon."){:height="30px" width="15px"} in the header, and then click **Profile** to open the **Profile** page.
3. Switch to the **Access tokens** tab.
4. Within the **Profile** page, click **Create token** to open the dialog.
5. Read the message and note that API tokens expire.
6. Provide a token description that can be used to identify your token and then click **Create**.
7. A new token is generated.

   - To view the token, click **Show token** within the **Token** field.
   - To copy the token, click **Copy token**.

   **Note:** The API token is displayed once and you cannot retrieve it later. For this reason, ensure that you copy and save the token. If you forget the token, you need to [delete it](#removing-a-token) from the list of tokens and create a new token to access the API.

8. Click **Close** to exit the dialog.

The created token is added to the **Tokens** table.

**Note:** You can also create API tokens in the [Multi-cloud Saas Platform](https://www.ibm.com/docs/en/hybrid-ipaas/saas?topic=using-saas-console-accounts){:target="_blank"} (MCSP) user console. Tokens that are created in the MCSP console are visible in the **Tokens** table when the page is displayed or refreshed. The 10 token limit applies whether they are created in the **Profile** page or the MCSP console.

There might be a small interval between creating a token in the MSCP console and it being displayed in the **Tokens** table. Tokens that are created in the {{site.data.reuse.eem_name}} **Profile** page might fail if the 10-token limit is reached in the MCSP console. To avoid this, ensure that you refresh the **Profile** page in {{site.data.reuse.eem_name}} before you create a new token.

### Removing a token
{: #removing-a-token}

Token entries are displayed in the **Tokens** table on the **Profile** page until they are deleted. You can delete expired tokens or tokens that are no longer required. 

**Note:** API requests that use an expired token are rejected by {{site.data.reuse.eem_name}}.

To delete a token, complete the following steps:

1. Log in to your {{site.data.reuse.eem_name}} UI from a supported web browser.
2. Click the user icon ![User icon]({{ 'images' | relative_url }}/usericon.svg "The user icon."){:height="30px" width="15px"} in the header, and then click **Profile** to open the **Profile** page.
3. Switch to the **Access tokens** tab.
4. Click **Delete** ![Delete icon]({{ 'images' | relative_url }}/trashcan.svg "The delete icon."){:height="30px" width="15px"} in the row of the token you want to remove.
5. Read the **Delete token** warning, and provide confirmation by entering the token description in the field exactly as it is displayed in the message.
6. Click **Delete**.  

   **Important:** Deleting a token is permanent and cannot be reversed.
