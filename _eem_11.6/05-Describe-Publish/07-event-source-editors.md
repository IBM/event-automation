---
title: "Managing event source editors"
excerpt: "Find out more about how you can manage event source editors."
categories: describe
slug: event-source-editors
toc: true
---

![Event Endpoint Management 11.6.4 icon]({{ 'images' | relative_url }}/11.6.4.svg "In Event Endpoint Management 11.6.4 and later.") In {{site.data.reuse.eem_name}} 11.6.4 and later, you can assign specific [user groups](../../about/key-concepts/#user-groups) to edit selected event sources.

To manage which user groups can edit event sources, you can assign user groups when you [create an option](../../describe/managing-options/#create-option), [manage event sources](../../describe/managing-event-sources/#-adding-event-source-editors), or through the [**User groups**](#add-group) page that is described in this topic.

The **Event source editors** tab on the **User groups** page displays all the event sources that are available to selected user groups. You can use the **User groups** page to [add](#add-group) and [edit](#edit-group-visible-event-sources) user group availability to event sources.

To access the **Event source editors** tab on the **User groups** page:

1. Log in to the {{site.data.reuse.eem_name}} UI with your login credentials.
1. In the navigation pane, click **Manage > User groups > Event source editors**.

## Adding a user group
{: #add-group}

To add a user group to edit event sources, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups > Event source editors**.
1. Click **Add user group**. The **Add a user group to edit event sources** pane is displayed.   
1. Select a user group from the list displayed. If the group that you want is not displayed, click **Enable user group** to add a group from your organization.  

   **Note:** Any user groups that you enable must exist within the organization that is provided by your OAuth provider.
1. Enter a name for the user group that you want to add.
1. Click **Next**. The **Add event sources** pane is displayed.
1. Select the event sources that you want the group to access. 
1. Click **Save**. 

The new group is added to the table in the **Event source editors** tab with all the event sources that the group can edit displayed.

## Editing user group permissions to event sources
{: #edit-group-permission-event-sources}

To edit the event sources that are available to a user group for editing, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups > Event source editors**.
1. Click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"} for the group that you want to edit. The **Edit event sources** pane is displayed.
1. (Optional) To add event sources, click **Add event sources**. The **Add event sources** window is displayed.
   1. Select the event sources that you want, then click **Save**.   
   1. Click **Save**. 
1. (Optional) To remove event sources, click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"}.
1. Click **Save**.

## Removing user group permissions to event sources
{: #removing-user-group-visibility-to-event-sources}

To remove a user group from being able to edit event sources, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups > Event source editors**.
1. Click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} for the group that you want to remove. The **Remove user group** dialog is displayed.
1. Enter the name of the user group to confirm that you no longer want this group to edit event sources.
1. Click **Confirm**.

The user group is removed from the page and members of that user group are no longer able to edit the event sources that were associated with it.
