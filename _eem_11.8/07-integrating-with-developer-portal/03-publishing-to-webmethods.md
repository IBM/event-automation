---
title: "Publishing virtual topics to IBM API Connect Developer Portal"
excerpt: "Step-by-step guide to publish virtual topics to IBM Developer Portal."
categories: dpo-integration
slug: publishing-to-dpo
toc: true
---

You can publish virtual topics from {{site.data.reuse.eem_name}} to {{site.data.reuse.wm_portal_long}} to make them available to users alongside your organization's APIs and other services.

## Before you begin
{: #before-you-begin}

Ensure that you have the following prerequisites in place:

- {{site.data.reuse.wm_portal_long}} v12.1.1 or later is installed and accessible.
- Integration between {{site.data.reuse.eem_name}} and {{site.data.reuse.wm_portal_short}} is [configured](../../dpo-integration/configure-eem-for-dpo-apic12/).
- At least one [gateway group](../../about/key-concepts#gateway-group) is associated with your {{site.data.reuse.eem_manager}} instance.
- The virtual topic is configured with an authentication set that uses [SASL credentials](../../describe/security-option-controls/#sasl).
- The virtual topic has the [**Require approval**](../security-option-controls/#approval-controls) toggle set to **Off**.

## Publishing a virtual topic to {{site.data.reuse.wm_portal_short}}
{: #publishing-virtual-topic}

To publish a virtual topic to {{site.data.reuse.wm_portal_short}}, complete the following steps:

**Note:** You cannot edit the controls within a virtual topic after it is published.

1. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
2. In the navigation pane, click **Manage > Topics**. A list of source topics is displayed.
3. Select the source topic that contains the virtual topic you want to publish.
4. Click the **Virtual topics** tab.
5. For the virtual topic that you want to publish, click **Publish**.
6. In the **Publish virtual topic** dialog, configure the following settings:
   
   - **Gateway group**: Select a gateway group from the available options. The gateway group provides runtime access to the virtual topic.
   
     **Note:** 
     - When only one gateway is available, it is selected by default. If you have multiple gateways, you can choose a gateway group from the available options.
     - Some controls require a supported gateway. If you attempt to publish a virtual topic to a gateway that does not support specific controls, a notification is displayed to inform you that this action is not possible.
     - You can only publish virtual topics to gateway groups that contain a gateway that has passed the validation checks for the cluster and source topic.
     - The target gateway group must have enough hostnames to match the number of brokers across all Kafka clusters that all the topics published to this gateway group use.
   
   - **Publishing destination**: Select where you want to publish the virtual topic: 
     - **{{site.data.reuse.eem_name}} catalog**: Publish to the {{site.data.reuse.eem_name}} catalog only.
     - **{{site.data.reuse.wm_portal_short}}**: Publish to {{site.data.reuse.wm_portal_long}} only.
     - **Both**: Publish to both the {{site.data.reuse.eem_name}} catalog and {{site.data.reuse.wm_portal_short}}.

7. Click **Publish**.

The virtual topic is now published to the selected destination and is available for discovery and subscription.

## Viewing published virtual topics in {{site.data.reuse.wm_portal_short}}
{: #viewing-published-topics}

After publishing a virtual topic to {{site.data.reuse.wm_portal_short}}, users can discover and subscribe to it through the portal interface:

1. Log in to {{site.data.reuse.wm_portal_short}}.
2. Go to the **Asset gallery**.
3. Search for the published virtual topic that you want to work with.
4. Click on the virtual topic to view its details, including:
   - Description and documentation
   - Schema information
   - Sample messages
   - Code accelerator samples
   - Subscription options

Users can then subscribe to the virtual topic to obtain credentials for accessing it. For more information, see [Using {{site.data.reuse.wm_portal_short}}](https://www.ibm.com/docs/en/api-connect/software/12.1.1?topic=using-developer-portal).

## Managing published virtual topics
{: #managing-published-topics}

After publishing a virtual topic to {{site.data.reuse.wm_portal_short}}, you can manage it from the **Manage topics** page in the {{site.data.reuse.eem_name}} UI.

### Updating virtual topic details
{: #updating-details}

To update the details of a published virtual topic:

1. In the {{site.data.reuse.eem_name}} UI, navigate to **Manage > Topics**.
2. Select the source topic containing the virtual topic.
3. Click the **Virtual topics** tab.
4. Click the virtual topic you want to update.
5. Make the necessary changes to the description, tags, or other editable fields.
6. Click **Save**.

The changes are automatically synchronized with {{site.data.reuse.wm_portal_short}}.

**Note:** You cannot edit controls after a virtual topic is published. To change controls, you must unpublish the virtual topic, make the changes, and then republish it.

### Unpublishing a virtual topic
{: #unpublishing}

To unpublish a virtual topic from {{site.data.reuse.wm_portal_short}}:

1. In the {{site.data.reuse.eem_name}} UI, navigate to **Manage > Topics**.
2. Select the source topic containing the virtual topic.
3. Click the **Virtual topics** tab.
4. For the virtual topic you want to unpublish, click **Unpublish**.
5. In the confirmation dialog, select the destination from which you want to unpublish:
   - **{{site.data.reuse.eem_name}} catalog**
   - **{{site.data.reuse.wm_portal_short}}**
   - **Both**
6. Click **Unpublish**.

The virtual topic is removed from the selected destinations and is no longer available for new subscriptions. Existing subscriptions remain active until they are revoked or expire.

For troubleshooting information related to publishing virtual topics to {{site.data.reuse.wm_portal_short}}, see the [troubleshooting section](../../troubleshooting/intro).