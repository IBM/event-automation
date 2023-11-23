---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.1.x.

## Release {{site.data.reuse.ep_current_version}}

### Apache Flink updated to 1.18.0

The {{site.data.reuse.flink_long}} version 1.1.0 update includes Apache Flink version 1.18.0.

### Support for MySQL database

{{site.data.reuse.ep_name}} release 1.1.0 introduces support for the MySQL database to [connect](../../installing/configuring/#configuring-databases-with-ssl-in-event-processing-and-flink) to the [database](../../nodes/enrichmentnode/#database) node.

### Reuse a time window in aggregate and top-n nodes

{{site.data.reuse.ep_name}} release 1.1.0 introduces the ability to reuse, in aggregate and top-n nodes, a time window that was defined in a previous node.
This feature enables you to implement scenarios such as "Calculate the 3 product types with the highest total sales per hour". For more information, see [Windowed nodes](../../nodes/windowednodes/).

### Stale status when your flow is modified

{{site.data.reuse.ep_name}} 1.1.0 introduces a **Stale** ![Stale]({{ 'images' | relative_url }}/save_error.png "Diagram showing that the flow is stale."){:height="30px" width="15px"} save status. A **Stale** status indicates that another user modified the flow. When this happens, a pop-up window is displayed with the title **Flow edit updates available**, **Flow running**, or **Flow deleted**. Depending on the **Stale** status you are prompted to select one of the following actions:

- **Save as a copy**: Select this action to save the current flow as a new one without incorporating the changes made by the other user. The new flow is called 'Copy of `<flow-name>`'.
- **Accept changes**: Select this action to apply the latest updates that are made by the other user to the flow. For the **Flow running** case, you can view the running flow.
- **Home**: Select this action to navigate back to the home page. The specific flow will no longer be available because it was deleted by another user.

### Support for {{site.data.reuse.openshift}} 4.14

{{site.data.reuse.ep_name}} 1.1.0 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.14.

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.0 and {{site.data.reuse.flink_long}} version 1.1.0 contain security and bug fixes.