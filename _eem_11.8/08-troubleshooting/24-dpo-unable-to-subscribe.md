---
title: "Unable to subscribe to a virtual topic in IBM API Connect Developer Portal v12.1.1 or later"
excerpt: "Developers cannot subscribe to a virtual topic in IBM Developer Portal."
categories: troubleshooting
slug: dpo-unable-to-subscribe
toc: true
---

## Symptoms
{: #symptoms}

Users cannot consume a virtual topic or produce to a virtual topic from their Kafka clients configured using the information in {{site.data.reuse.wm_portal_short}}.

## Causes
{: #causes}

This issue can occur due to several reasons:

- The {{site.data.reuse.egw}} associated with the virtual topic is not running or is not accessible.
- The gateway group does not have sufficient capacity or hostnames configured.
- The event data controls configured on the virtual topic are blocking access.

## Resolving the problem
{: #resolving-the-problem}

To resolve this issue, complete the following steps:

1. Verify that the {{site.data.reuse.egw}} associated with the virtual topic is running and accessible.
2. Check that the gateway group has sufficient capacity and hostnames configured.
3. Ensure that the user has the necessary permissions to subscribe to virtual topics.
4. Review the event data controls configured on the virtual topic to ensure they are not blocking access.