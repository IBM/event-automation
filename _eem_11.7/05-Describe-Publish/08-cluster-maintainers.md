---
title: "Managing cluster maintainers"
excerpt: "Find out more about how you can manage cluster maintainers."
categories: describe
slug: cluster-maintainers
toc: true
---

You can assign specific [user groups](../../about/key-concepts/#user-groups) to maintain selected clusters.

To manage which user groups can maintain clusters, you can assign user groups when you [Add a cluster](../../administering/managing-clusters/#add-cluster) or through the [**User groups**](#add-group) page that is described in this topic.

The **Cluster maintainers** tab on the **User groups** page displays all the clusters that are visible to selected user groups. You can use the **User groups** page to [add](#add-group) and [edit](#edit-group-permission-cluster-maintainer) user groups and clusters.

To access the **Cluster maintainers** tab on the **User groups** page:

1. Log in to the {{site.data.reuse.eem_name}} UI with your login credentials.
1. In the navigation pane, click **Manage > User groups > Cluster maintainers**.

## Adding a user group
{: #add-group}

To add a user group to maintain clusters, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups > Cluster maintainers**.
1. Click **Add user group**. The **Add a user group to maintain clusters** pane is displayed.   
1. Select a user group from the list displayed. If the group that you want is not displayed, click **Enable user group** to add a group from your organization.  

   **Note:** Any user groups that you enable must exist within the organization that is provided by your OAuth provider.
1. Enter a name for the user group that you want to add.
1. Click **Next**. The **Add clusters** pane is displayed.
1. Select the clusters that you want the group to access. 
1. Click **Save**. 

The new group is added to the table in the **Cluster maintainers** tab with all the clusters that the user group can maintain displayed.

## Editing user group permissions to clusters
{: #edit-group-permission-cluster-maintainer}

To edit the clusters that are available to a user group to maintain, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups > Cluster maintainers**.
1. Click the **Edit** icon ![edit icon]({{ 'images' | relative_url }}/rename.svg "Diagram showing edit icon."){:height="30px" width="15px"} for the group that you want to edit. The **Edit clusters** pane is displayed.
1. (Optional) To add clusters, click **Add clusters**. The **Add clusters** window is displayed.
   1. Select the clusters that you want, then click **Save**.   
   1. Click **Save**. 
1. (Optional) To remove clusters, click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"}.
1. Click **Save**.

## Removing user group permissions to clusters
{: #removing-user-group-permission-to-clusters}

To remove a user group from being able to edit clusters, complete the following steps:

1. In the {{site.data.reuse.eem_name}} navigation pane, click **Manage > User groups > Cluster maintainers**.
1. Click the **Delete** icon ![trash icon]({{ 'images' | relative_url }}/trashcan.svg "Diagram showing remove topic icon."){:height="30px" width="15px"} for the group that you want to remove. The **Remove user group** dialog is displayed.
1. Enter the name of the user group to confirm that you no longer want this group to edit clusters.
1. Click **Confirm**.

The user group is removed from the page and members of that user group are no longer able to maintain the clusters that were associated with it.
