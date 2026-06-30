---
title: "Virtual topic is not displayed in IBM API Connect Developer Portal v12.1.1 or later"
excerpt: "Virtual topic does not appear in IBM Developer Portal after publishing."
categories: troubleshooting
slug: dpo-topic-not-appearing
toc: true
---

## Symptoms
{: #symptoms}

A virtual topic does not appear in {{site.data.reuse.wm_portal_long}} after it has been published.

## Causes
{: #causes}

This issue can occur due to several reasons:

- The integration between {{site.data.reuse.eem_name}} and {{site.data.reuse.wm_portal_short}} is not configured correctly.
- The wrong publishing destination was selected during the publish process.
- Errors occurred during the publishing process.

## Resolving the problem
{: #resolving-the-problem}

To resolve this issue, complete the following steps:

1. [Verify](../../dpo-integration/configure-eem-for-dpo-apic12/#config-verification) that the integration between {{site.data.reuse.eem_name}} and {{site.data.reuse.wm_portal_short}} is configured correctly.
1. Check that you selected **{{site.data.reuse.wm_portal_short}}** or **Both** as the publishing destination when you [published the virtual topic](../../describe/publishing-virtual-topics/#publishing-virtual-topics).
1. Check the {{site.data.reuse.eem_name}} logs for any errors during the publishing process.
1. Check the {{site.data.reuse.wm_portal_short}} logs for any errors during the publishing process.