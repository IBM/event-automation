---
title: "Managing options"
excerpt: "Find out more about options including how you can create, edit and delete options."
categories: describe
slug: managing-options
toc: true
---

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") In {{site.data.reuse.eem_name}} 11.1.1 and later, you no longer publish a topic (event source) to the catalog directly. Instead, you create another view of the topic to be published, that is called an option. An option enables you to describe the topic once and socialize it many times in different ways. 

An option can have a variety of [controls](../../describe/option-controls/) that enable you to have greater control over how the topic is consumed. One topic can have many options and each option can contain numerous controls as demonstrated in the following diagram. For example, one topic can have 3 options. One of those options has the schema filtering and redaction control set; the other option has no controls; and the other option has all 3 controls (schema filtering, redaction and approval). So each option is providing a different control set for a subscriber to interact with. In each case, the original topic remains untouched and all the controls that you add are enforced as it passes through the {{site.data.reuse.egw_short}}. 

![Options and controls]({{ 'images' | relative_url }}/options-controls.png "Diagram showing the relationship between options and controls."){:height="60%" width="60%"}


## ![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") Creating an option
{: #create_option}

To create an option, complete the following steps: 

1. In the navigation pane, click **Topics**.
1. Click the topic that you want to work with. 
1. Click the **Options** tab on the **Topic detail** page. 
1. Click **Create option**. The **Details** pane is displayed.
1. In the **Option** field, provide a name for your option.
1. In the **Alias** field, provide a valid Kafka topic name.  

   **Note:** The alias must meet the following conditions:
      - Be less than 200 characters in length, 
      - Have no white space included,
      - Must not use invalid characters: `'/', '\\', ',', '\u0000', ':', '"', '\'', ';', '*', '?', ' ', '\t', '\r', '\n', '='`
1. In the **Description** field, provide a description of your option.
1. Click **Next**. The **Controls** pane is displayed.
1. Optional: If you want to add controls, click **Add control**. For more information about controls, see [adding controls to options](../option-controls).

   ![Event Endpoint Management 11.1.4 icon]({{ 'images' | relative_url }}/11.1.4.svg "In Event Endpoint Management 11.1.4 and later") **Note:** If you are using {{site.data.reuse.eem_name}} 11.1.4 and later, click **Save**. The **Options** tab in the **Topic detail** page is displayed. You can publish the option from this page when you are ready.

   
1. Click **Next**. The **Publish option** pane is displayed.
1. If you are ready to publish your option, click **Publish**. For more information about publishing options, see [publishing options](../publishing-topics).
1. To complete the option, click **Save**.


## Editing an option
{: #edit_option}

To edit an option's details, complete the following steps:

1. In the navigation pane, click **Topics**.
1. Click the topic that you want to work with. 
1. In the **Topic detail** page, click the **Options** tab.
1. Depending on your version of {{site.data.reuse.eem_name}}, complete one of the following steps to edit the option:
   - If you are using {{site.data.reuse.eem_name}} version 11.1.3 or earlier, click **Edit** ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} for the option that you want to edit. The **Edit option** window is displayed.
   - ![Event Endpoint Management 11.1.4 icon]({{ 'images' | relative_url }}/11.1.4.svg "In Event Endpoint Management 11.1.4 and later") If you are using {{site.data.reuse.eem_name}} version 11.1.4 and later, click ![More options icon]({{ 'images' | relative_url }}/more_options.png "The more options icon."){:height="30px" width="15px"} **More options**, and select **Edit**. The **Edit option** window is displayed. 
1. In the **Details** pane, edit the fields that you want to change. 

    **Note:** 
    - Restrictions and validation checks ensure each field meets requirements for options.
    - The **Alias** is only editable when the option is in an [unpublished state](#option-lifecycle-states).
1. On the **Controls** pane, edit the controls as required.
1. After you make changes, click **Save**.
1. To cancel changes, click **Cancel**.

## Option lifecycle states
{: #option-lifecycle-states}

After adding an option to a topic in {{site.data.reuse.eem_name}}, the option can have different lifecycle states. The lifecycle state of your option determines whether it can be [subscribed](../../consume-subscribe/subscribing-to-topics) to by users and [socialized in the catalog](../../consume-subscribe/discovering-topics).

The lifecycle of an option in {{site.data.reuse.eem_name}} progresses as follows:

- **Unpublished**: This option is not socialized in the **Catalog**. It cannot be subscribed to by other users and has no current subscriptions.
- **Published**: This option is socialized in the **Catalog**. Users can create new subscriptions to use it.
- **Archived**: This option is socialized in the **Catalog** and has existing subscriptions. Users cannot create new subscriptions to use it.

The **Options** tab on the **Topic detail** page allows users to manage a topics options and the state of an option is shown in the status field of the option's tile. 

To change the lifecycle state of an option, complete the following steps:

1. In the navigation pane, click **Topics**.
1. Click the topic that you want to work with. 
1. Click the **Options** tab on the **Topic detail** page.
1. For the option that you want to edit, click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"}. A pop-up window to edit your option is displayed.
1. In the side bar, click **Publish option**. You can see the option's current state and a button to advance it to the next state in this pane.

    - To change the **Unpublished** state to **Published**, click **Publish**.
    - To change the **Published** state to **Archived**, click **Archive**.
      - **Note:** This option is only available if a published topic has subscribers.
    - To change the **Published** state to **Unpublished**, click **Unpublish**.
      - **Note:** This option is only available if a published topic has no current subscribers.
    - To change the **Archived** state to **Published**, click **Publish**.
1. After you make changes, click **Save**.
1. To cancel changes, click **Cancel**.

**Note:** **Archived** options automatically return to the **Unpublished** state when all subscribers have their [subscriptions revoked](../managing-user-access-to-options#revoking-subscriptions) from using this topic.

An option can be [edited](#edit_option) in any lifecycle state. However, the set of fields that can be edited is restricted when in **Published** or **Archived** states to prevent changes that cause runtime issues for subscribed users.

**Note:** Only **Unpublished** options can [be deleted from {{site.data.reuse.eem_name}}](#deleting-an-option).


## Deleting an option

An option can be deleted from a topic if it's in an **Unpublished** state. Deleting an option removes all the details and controls about the option but the topic will remain. To move your option into a state so that you can delete it, refer to the different [lifecycle states](#option-lifecycle-states) of an option.

To delete an option from {{site.data.reuse.eem_name}}, complete the following steps. 

1. In the navigation pane, click **Topics**.
1. Find the topic that the option belongs to and ensure that the Option status is 0 published. All options in the **Unpublished** state will have a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the topic table.
1. Click the topic that you want to work with. 
1. Open the **Options** tab within the **Topic detail** page. 
1. Depending on your version of {{site.data.reuse.eem_name}}, complete one of the following steps to delete the option:
   - If you are using {{site.data.reuse.eem_name}} version 11.1.3 or earlier, click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"}.
   - ![Event Endpoint Management 11.1.4 icon]({{ 'images' | relative_url }}/11.1.4.svg "In Event Endpoint Management 11.1.4 and later") If you are using {{site.data.reuse.eem_name}} version 11.1.4 and later, click ![More options icon]({{ 'images' | relative_url }}/more_options.png "The more options icon."){:height="30px" width="15px"} **More options**, and select **Delete**. The **Delete option** window is displayed. 
1. Enter the name of the option to confirm the option that you want to delete. 
1. Click **Delete**. (**Delete** is visible in the footer if you entered the topic name that you want to delete correctly).