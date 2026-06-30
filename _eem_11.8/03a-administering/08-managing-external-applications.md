---
title: "Managing external applications"
excerpt: "Find out how to manage external applications" 
categories: administering
slug: managing-external-applications
toc: true
---


The **External applications** page displays external applications that are supported for integration with {{site.data.reuse.eem_name}}.

To access the **External applications** page:

1. Log in to the {{site.data.reuse.eem_name}} UI using an account with administrator privileges.
2. In the navigation pane, click **Manage > External applications**.

The page displays a tile for the integration with {{site.data.reuse.wm_portal_long}} 12.1.1 or later.

## {{site.data.reuse.wm_portal_long}} v12.1.1 or later

{{site.data.reuse.wm_portal_long}} is a web-based, self-service portal that enables an organization to securely expose APIs to external developers, partners, and other consumers for use in building their own applications on their platforms.
The tile shows the connection status between Event Endpoint Management and {{site.data.reuse.wm_portal_short}} v12.1.1 or later:

- If {{site.data.reuse.eem_name}} is configured to interact with {{site.data.reuse.wm_portal_short}}, the **endpoint URL** of {{site.data.reuse.wm_portal_short}} is displayed.
- If {{site.data.reuse.eem_name}} is not configured to interact with {{site.data.reuse.wm_portal_short}}, a **No configuration** message is displayed, indicating that the integration is not configured.

To learn more about {{site.data.reuse.wm_portal_short}}, see [Using {{site.data.reuse.wm_portal_short}}](https://www.ibm.com/docs/en/api-connect/software/12.1.1){:target="_blank"}.

## Adding an external application

To add {{site.data.reuse.wm_portal_long}} as an external application, follow the instructions in [Configure {{site.data.reuse.eem_name}} and {{site.data.reuse.wm_portal_long}} 12.1.1 or later ](../../dpo-integration/configure-eem-for-dpo-apic12/).

