---
title: "Managing user group visibility to options"
excerpt: "Find out more about how you can manage user group visibility to options."
categories: describe
slug: user-groups
toc: true
---

<!-- In 11.7.0 update this page to talk more about "option viewers" -->

You can manage which options are available to users by assigning specific [user groups](../../about/key-concepts/#user-groups) to selected options. This means that only users in the groups you select can view and subscribe to the options that you have specified. 

User group visibility to options requires an external identity provider, such as [Keycloak](https://www.keycloak.org/){:target="_blank"}, capable of managing user groups. When {{site.data.reuse.eem_name}} connects to your external identity provider, it suggests groups that are already in use, or that you belong to. You can then select one or more of these user groups to add to options. 

**Important:** Not all groups that are defined in the external identity provider are displayed. Only a filtered list based on the user's membership and option associations.

To manage which user groups can view and subscribe to the option in the catalog after you have published it, you can assign user groups when you [create an option](../../describe/managing-options/#create-option), [edit an option](../../describe/managing-options/#edit_option), or through the [**User groups**](#add-group) page.

The **User groups** page displays all the options that are visible to user groups. You can use the **User groups** page to [add](#add-group) and [edit](#edit-group-visible-options) user groups.

To access the **User groups** page:

1. Log in to the {{site.data.reuse.eem_name}} UI with your login credentials.
1. In the navigation pane, click **Manage > User groups**.

## Adding a user group
{: #add-group}

To add a user group, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups**.
1. Click **Add user group**. The **Authorize a user group to view options** pane is displayed.   

   **Note:** Any user groups that you add manually must exist within the organization provided by your OAuth provider.
1. Enter a name for the user group that you want to add.
1. Click **Next**. The **Add options** pane is displayed with a list of unpublished options.
1. Select the options that you want the group to access. 
1. Click **Add user group**. 

The new group is added to the table on the **User groups** page.

## Adding a user group
{: #add-group-1164}

Complete the following steps to add a user group to view options:

1. In the navigation pane, click **Manage > User groups**. The **Option viewers** tab is displayed.
1. Click **Add user group**. The **Authorize a user group to view options** pane is displayed.   
1. Select a user group from the list displayed. If the group that you want is not displayed, click **Enable user group** to add a group from your organization.  

   **Note:** Any user groups that you enable must exist within the organization that is provided by your OAuth provider.
1. Enter a name for the user group that you want to add.
1. Click **Next**. The **Add options** pane is displayed with a list of unpublished, and published and archived options if they have custom visibility.  
1. Select the options that you want the group to view. 
1. Click **Save**. 

The new group is added to the table in the **Option viewers** tab with all the options that the group can view displayed.

## Editing user group visibility to options
{: #edit-group-visible-options}

To edit the options available to a user group, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups**.
1. Click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"} for the group that you want to edit. The **Edit user group Details** pane is displayed.
1. In the side bar, click **Options**.
1. To add options, click **Add options**. The **Add options** pane is displayed with a list of unpublished options.
1. Select the options that you want, then click **Save**.   

   **Tip**: Use the filter menu icon to help you find the options that you want quicker.
1. Click **Save**. 

## Editing user group visibility
{: #edit-group-visible-options-1164}

Complete the following steps to edit the options available to a user group:

1. In the navigation pane, click **Manage > User groups**. The **Option viewers** tab is displayed.
1. Click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"} for the group that you want to edit. The **Edit options** pane is displayed.
1. To add options, click **Add options**. The **Add options** pane is displayed with a list of unpublished, and published and archived options if they have custom visibility.
1. Select the options that you want, then click **Save**.   
1. Click **Save**. 

**Note:** The following rules apply when you edit the visibility for published and archived options:
- You cannot change public options to be custom.
- You can change custom options to be public.
- You can add groups to custom options, but you cannot remove existing groups already added to a custom option.


If you need to perform an action that is not permitted (for example, removing groups from a published custom option), complete the following steps:

1. [Remove](../../subscribe/managing-subscriptions/#removing-subscriptions) subscribers.
1. [Unpublish](../../describe/managing-options/#option-lifecycle-states) the option.
1. [Update](#edit-group-visible-options-1164) the visibility settings as needed.
1. [Publish](../../describe/publishing-options/#publishing-options) the option again.

## Removing user group visibility to options
{: #removing-user-group-visibility-to-options}

To remove a user group from an option, complete the following steps:

**Note**: You can only remove user groups from [unpublished](../../describe/managing-options/#option-lifecycle-states) options.

1. In the navigation pane, click **Manage > Topics**.
1. Click the event source that you want to work with. 
1. In the **Topic detail** page, click the **Options** tab.
1. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "The more options icon."){:height="30px" width="15px"} **More options**, and select **Edit**. The **Edit option** window is displayed. 
1. In the side panel, click **Visibility**.
1. In the **Visibility** pane, click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} for the group that you want to remove from the option.
1. After you make changes, click **Save**.
