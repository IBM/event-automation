---
title: "Managing user group visibility to virtual topics"
excerpt: "Find out more about how you can manage user group visibility to virtual topics."
categories: describe
slug: user-groups
toc: true
---

<!-- In 11.8.0 update this page to talk more about "virtual topic viewers" -->

You can manage which virtual topics are available to users by assigning specific [user groups](../../about/key-concepts/#user-groups) to selected virtual topics. This means that only users in the groups you select can view and subscribe to the virtual topics that you have specified. 

User group visibility to virtual topics requires an external identity provider, such as [Keycloak](https://www.keycloak.org/){:target="_blank"}, capable of managing user groups. When {{site.data.reuse.eem_name}} connects to your external identity provider, it suggests groups that are already in use, or that you belong to. You can then select one or more of these user groups to add to virtual topics. 


**Important:** Not all groups that are defined in the external identity provider are displayed. Only a filtered list based on the user's membership and virtual topic associations.

To manage which user groups can view and subscribe to the virtual topic in the catalog after you have published it, you can assign user groups when you [create a virtual topic](../../describe/managing-virtual-topics/#create-virtual-topic), [edit a virtual topic](../../describe/managing-virtual-topics/#edit-virtual-topic), or through the [**User groups**](#add-group) page.

The **User groups** page displays all the virtual topics that are visible to user groups. You can use the **User groups** page to [add](#add-group) and [edit](#edit-group-visible-virtual-topics) user groups.

To access the **User groups** page:

1. Log in to the {{site.data.reuse.eem_name}} UI with your login credentials.
1. In the navigation pane, click **Manage > User groups**.

## Adding a user group
{: #add-group}

Complete the following steps to add a user group to view virtual topic:

1. In the navigation pane, click **Manage > User groups**. The **Virtual topic viewers** tab is displayed.
1. Click **Add user group**. The **Authorize a user group to view virtual topics** pane is displayed.   
1. Select a user group from the list displayed. If the group that you want is not displayed, click **Enable user group** to add a group from your organization.  

   **Note:** Any user groups that you enable must exist within the organization that is provided by your OIDC provider.
1. Enter a name for the user group that you want to add.
1. Click **Next**. The **Add virtual topics** pane is displayed with a list of unpublished, and published and archived virtual topics if they have custom visibility.  
1. Select the virtual topics that you want the group to view. 
1. Click **Save**. 

The new group is added to the table in the **Virtual topic viewers** tab with all the virtual topics that the group can view displayed.

## Editing user group visibility
{: #edit-group-visible-virtual-topics}

Complete the following steps to edit the virtual topics available to a user group:

1. In the navigation pane, click **Manage > User groups**. The **Virtual topic viewers** tab is displayed.
1. Click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"} for the group that you want to edit. The **Edit virtual topics** pane is displayed.
1. To add virtual topics, click **Add virtual topics**. The **Add virtual topics** pane is displayed with a list of unpublished, and published and archived virtual topics if they have custom visibility.
1. Select the virtual topics that you want, then click **Save**.   
1. Click **Save**. 

**Note:** The following rules apply when you edit the visibility for published and archived virtual topics:
- You cannot change public virtual topics to be custom.
- You can change custom virtual topics to be public.
- You can add groups to custom virtual topics, but you cannot remove existing groups already added to a custom virtual topic.


If you need to perform an action that is not permitted (for example, removing groups from a published custom virtual topic), complete the following steps:

1. [Remove](../../describe/managing-user-access-to-topics#removing-subscriptions) subscribers.
1. [Unpublish](../../describe/managing-virtual-topics/#virtual-topic-lifecycle-states) the virtual topic.
1. Update the visibility settings as needed.
1. [Publish](../../describe/publishing-virtual-topics/#publishing-virtual-topics) the virtual topic again.

## Removing user group visibility to virtual topics
{: #removing-user-group-visibility-to-virtual-topics}

To remove a user group from a virtual topic, complete the following steps:

**Note**: You can only remove user groups from [unpublished](../../describe/managing-virtual-topics/#virtual-topic-lifecycle-states) virtual topics.

1. In the navigation pane, click **Manage > Topics**.
1. Click the source topic that you want to work with. 
1. In the topic's detail page, click the **Virtual topics** tab.
1. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "The more options icon."){:height="30px" width="15px"} **More options** on the topic that you want to edit, and select **Edit**. The **Edit virtual topic** window is displayed. 
1. In the side panel, click **Visibility**.
1. In the **Visibility** pane, click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} for the group that you want to remove from the virtual topic.
1. After you make changes, click **Save**.
