---
title: "Approval controls for options"
excerpt: "Find out how you can control who subscribes to your event source"
categories: describe
slug: approval-controls
toc: true
---

![Event Endpoint Management 11.1.1 icon]({{ 'images' | relative_url }}/11.1.1.svg "In Event Endpoint Management 11.1.1 and later") When an option is published, it is available for everyone in your organization to view. If you want to control who can subscribe to your option, you can enable approval control. When an option is set up with approval control enabled, a viewer must submit a request to subscribe to the option. The request includes a reason to justify the need for a subscription along with the requesters contact information. The option owner can then approve or reject the request as required.

**Note:** A viewer can only have one request for a subscription to an option open at a time.

## Setting up approval control
{: #setting_up_approval_controls}

When an option is created for an event source, it appears in the **Options** tab of the **Topic details** page. To enable approval control for an option, complete the following steps.

1. In the navigation pane, click **Topics**.
1. Find the topic that you want to work with in the list, and click the name of the topic.
1. Click the **Options** tab.
1. For the option that you want to edit, click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. A pop-up window to edit your option is displayed.
1. In the side bar, click **Controls**. The **Controls** pane is displayed.
1. Click **Add control**.
1. Click the **Approval** tile.
1. Click **Add** > **Next** > **Save**. 

This option now requires viewers to create a request to justify having a subscription to your topic.

## Viewing requests
{: #viewing_requests}

As the owner of an event source with an option that has approval control enabled, you can view requests from the event source or from the access requests page.

### To view requests from an event source
{: #viewing_requests_from_event_source}

To view requests for all the options that have approval control enabled, complete the following steps.

1. In the navigation pane, click **Topics**.
1. Find the topic that you want to work with in the list, and click the name of the topic.
1. Click the **Manage** tab for this topic.
1. Click **Requests** to see a list of all of the requests made against this event source.

### To view requests from Access requests
{: #viewing_requests_from_option}

To view requests from the access request page, complete the following steps.

1. In the navigation pane, click **Access**. The **Access requests** page is displayed.
1. All the requests against options that you own is displayed.

In each case the contact details of the requester and which option the request is for is displayed within the table.

## Approving or rejecting requests
{: #approving_rejecting_requests}

To approve or reject requests, complete the following steps.

1. For the request you want to review, click **View request** . An approval pop-up window appears. All the details about the request including the event source, option, contact details of the requester and the justification for the request is displayed.
1. Review the information that is provided and click **Approve** or **Reject** as required.

When a request is approved, the viewer can make a new subscription.
