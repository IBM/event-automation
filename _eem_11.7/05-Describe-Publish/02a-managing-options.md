---
title: "Managing options"
excerpt: "Find out more about options including how you can create, edit and delete options."
categories: describe
slug: managing-options
toc: true
---

Options enable you to socialize one event source multiple times and in different ways. When you publish an option to your catalog, the consumer sees the published option as an event endpoint. By publishing multiple options for a single event source, you can provide consumers with different ways to access the event source according to their requirements. 


An option can have various [security](../security-option-controls) and [event data](../data-option-controls) controls that you can use to have greater control over how the events are used. One event source can have many options and each option can contain numerous controls as demonstrated in the following diagram. 

![Options and controls]({{ 'images' | relative_url }}/options-controls.png "Diagram showing the relationship between options and controls."){:height="60%" width="60%"}

For example, one event source can have 3 options. One of those options has the schema filtering and redaction control set; the other option has no controls; and the other option has 3 controls (schema filtering, redaction, and mTLS). So, each option is providing a different control set for a subscriber to interact with. In each case, the original event source remains untouched and all the controls that you add are enforced by the {{site.data.reuse.egw_short}}. 

You can control visibility to options by assigning specific user groups to have access to selected options only. When {{site.data.reuse.eem_name}} is connected to your external identity provider, it provides an automatically populated list of groups that are discoverable when you add options to user groups. When you create an option, you can decide which user groups are able to access and use the option in the catalog after you publish it. You can assign user groups when you [create an option](#create-option) or through the [**User groups**](../../describe/user-groups) page. 

**Note**: Options that do not have any user groups are considered public and are visible to all users with the viewer role.


## Creating an option
{: #create-option}

To create an option, complete the following steps: 

1. In the navigation pane, click **Manage > Topics**.
2. Click the event source that you want to work with. 
3. Click the **Options** tab on the **Topic detail** page. 
4. Click **Create option**. The configuration properties for the option are split into separate panes.
5. In the **Details** pane, provide a name and a unique alias for your option. The alias must be an alphanumeric string that is under 200 characters in length, but can contain underscores, hyphens, and periods.

6. {: #data-controls}In the **Event data controls** pane, you can define operations that are applied to the event data. 

   For consume-enabled endpoints, the following event data controls are available:
      - [Quota enforcement](../data-option-controls#quota-enforcement): Set a quota for the maximum megabytes or messages per second that can be read from the endpoint.
      - [Schema filtering](../data-option-controls#schema-filter): Removes events that do not match the schema that is defined for the event source.
      - [Redaction](../data-option-controls#consume-redaction): Redact specific fields in events with a replacement or hash value. Redaction is available only when a schema is defined for the event source, or if its message format is specified as JSON.

   For produce-enabled endpoints, the following event data controls are available:
      - [Quota enforcement](../data-option-controls#quota-enforcement): Set a quota for the maximum megabytes or messages per second that can be sent to the endpoint.
      - [Schema enforcement](../data-option-controls#produce-controls-schema-enforcement): The endpoint accepts only events that comply with the schema that is defined for the event source.

7. If [user groups](../../security/groups) are enabled, then the **Visibility** pane is displayed.
   Select the visibility type for the option from one of the following options:
   - **Public**. If you select **Public**, the option is visible to all users with the viewer role.
   - **Custom**. If you select **Custom**, you are prompted to select the user groups that you want to make the option available to.

   If the group you want is not displayed, then click **Add group** to add a group.  

   **Important:** Any user groups that you add manually must exist within the organization that is provided by your external identity provider.   
8. {: #security-controls}In the **Security controls** pane, select the **Client authentication set** that you want to use to secure your event endpoint, and if you want to enable approval. For more information, see [adding security controls to options](../security-option-controls).

You can [publish the option](../publishing-options) from the **Options** tab when you are ready.


## Editing an option
{: #edit_option}

To edit an option, complete the following steps:

1. In the navigation pane, click **Manage > Topics**.
1. Click the event source that you want to work with. 
1. In the **Topic detail** page, click the **Options** tab.
1. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "The more options icon."){:height="30px" width="15px"} **More options**, and select **Edit**. The **Edit option** window is displayed. 
1. In the **Details** pane, edit the fields that you want to change. 

    **Note:**  You can only edit the **Alias** when the option is in an [unpublished state](#option-lifecycle-states).
1. On the **Event data controls** pane, edit the event data controls as required.
1. On the **Visibility** pane, select or add the user groups that you want to make the option available to.  

    **Note**: You cannot remove groups from published or archived options.
1. On the **Security controls** pane, select the **Client authentication set** that you want to use to secure your event endpoint, and if you want to enable approval. When you are finished, click **Save**.


## Option lifecycle states
{: #option-lifecycle-states}

After you add an option to an event source in {{site.data.reuse.eem_name}}, the option can have different lifecycle states. The lifecycle state of your option determines whether it can be [subscribed](../../subscribe/subscribing-to-event-endpoints) to by users and [socialized in the catalog](../../subscribe/discovering-event-endpoints).

The lifecycle of an option in {{site.data.reuse.eem_name}} progresses as follows:

- **Unpublished**: This option is not socialized in the **Catalog**. It cannot be subscribed to by other users and has no current subscriptions.
- **Published**: This option is socialized in the **Catalog**. Users can create new subscriptions to use it.
- **Archived**: This option is socialized in the **Catalog** and has existing subscriptions. Users cannot create new subscriptions to use it.

The **Options** tab on the **Topic detail** page allows users to manage options and the state of an option is shown in the status field of the option's tile. 

To change the lifecycle state of an option, complete the following steps:

1. In the navigation pane, click **Manage > Topics**.
1. Click the event source that you want to work with. 
1. Click the **Options** tab on the **Topic detail** page.
1. For the option that you want to edit, click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"}. A pop-up window to edit your option is displayed.
1. In the side bar, click **Publish option**.

    - To change the **Unpublished** state to **Published**, click **Publish**.
    - To change the **Published** state to **Archived**, click **Archive**.
      - **Note:** This option is only available if a published option has subscribers.
    - To change the **Published** state to **Unpublished**, click **Unpublish**.
      - **Note:** This option is only available if a published option has no current subscribers.
    - To change the **Archived** state to **Published**, click **Publish**.
1. After you make changes, click **Save**.
1. To cancel changes, click **Cancel**.

**Note:** **Archived** options automatically return to the **Unpublished** state when all subscribers have their [subscriptions removed](../../subscribe/managing-subscriptions#removing-subscriptions) from using this option.

An option can be [edited](#edit_option) in any lifecycle state. However, the set of fields that can be edited is restricted when in **Published** or **Archived** states to prevent changes that cause runtime issues for subscribed users.

**Note:** Only **Unpublished** options can be [deleted](#delete-option) from {{site.data.reuse.eem_name}}.


## Deleting an option
{: #delete-option}

An option can be deleted from an event source if it's in an **Unpublished** state. To move your option into a state so that you can delete it, refer to the different [lifecycle states](#option-lifecycle-states) of an option.

To delete an option from {{site.data.reuse.eem_name}}, complete the following steps. 

1. In the navigation pane, click **Manage > Topics**.
1. Find the event source that the option belongs to and check that the status is `0 published`. All options in the **Unpublished** state have a delete icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} in their row in the event source table.
1. Click the event source that you want to work with. 
1. Open the **Options** tab within the **Topic detail** page. 
1. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "The more options icon."){:height="30px" width="15px"} **More options**, and select **Delete**. The **Delete option** window is displayed. 
1. Enter the name of the option to confirm the option that you want to delete. 
1. Click **Delete**. (**Delete** is highlighted in the footer if you entered the name of the option that you want to delete correctly).