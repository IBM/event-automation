---
title: "Managing source topic editors"
excerpt: "Find out more about how you can manage source topic editors."
categories: describe
slug: source-topic-editors
toc: true
---

You can assign specific [user groups](../../about/key-concepts/#user-groups) to edit selected source topics.

To manage which user groups can edit source topics, you can assign user groups when you [create a virtual topic](../../describe/managing-virtual-topics/#create-virtual-topic), [manage source topics](../../describe/managing-source-topics/#adding-source-topic-editors), or through the [**User groups**](#add-group) page that is described in this topic.

The **Source topic editors** tab on the **User groups** page displays all the topics that are available to selected user groups. You can use the **User groups** page to [add](#add-group) and [edit](#edit-group-permission-source-topics) user group availability to topics.

To access the **Source topic editors** tab on the **User groups** page:

1. Log in to the {{site.data.reuse.eem_name}} UI with your login credentials.
1. In the navigation pane, click **Manage > User groups**.
1. Select the **Source topic editors** tab.

## Adding a user group
{: #add-group}

To add a user group to edit source topics, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups**.
1. Select the **Source topic editors** tab.
1. Click **Add user group**. The **Add a user group to edit topics** pane is displayed.   
1. Select a user group from the list displayed. If the group that you want is not displayed, click **Enable user group** to add a group from your organization.  

   **Note:** Any user groups that you enable must exist within the organization that is provided by your OIDC provider.
1. Enter a name for the user group that you want to add.
1. Click **Next**. The **Add topics** pane is displayed.
1. Select the topics that you want the group to access. 
1. Click **Save**. 

The new group is added to the table in the **Topic editors** tab with all the  topics that the group can edit displayed.

## Editing user group permissions to topics
{: #edit-group-permission-source-topics}

To edit the source topics that are available to a user group for editing, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups**.
1. Select the **Source topic editors** tab.
1. Click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"} for the group that you want to edit. The **Edit topics** pane is displayed.
  - To add source topics, click **Add topics**. The **Add topics** window is displayed.
  - To remove source topics, click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"}.
1. Click **Save**.

## Removing user group permissions to source topics
{: #removing-user-group-visibility-to-source-topics}

To remove a user group from being able to edit source topics, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups**.
1. Select the **Source topic editors** tab.
1. Click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} for the group that you want to remove. The **Remove user group** dialog is displayed.
1. Enter the name of the user group to confirm that you no longer want this group to edit topics.
1. Click **Confirm**.

The user group is removed from the page and members of that user group are no longer able to edit the topics that were associated with it.
