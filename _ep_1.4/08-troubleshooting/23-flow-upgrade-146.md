---
title: "Read-only flows after upgrading to Event Processing 1.4.6"
excerpt: "After upgrading to Event Processing 1.4.6, flows might become read-only if they were authored with an earlier Event Processing version and are present in the Event Processing application when upgrading."
categories: troubleshooting
slug: flow-read-only-after-upgrade-146
toc: true
---

## Symptoms
{: #symptoms}

After upgrading to {{site.data.reuse.ep_name}} 1.4.6, flows present in the {{site.data.reuse.ep_name}} application might become read-only. When the issue occurs, the {{site.data.reuse.ep_name}} UI can look as in the following example:

![Read-only flow after upgrade]({{ 'images' | relative_url }}/flow-read-only-after-upgrade-146.png "Read-only flow after upgrade to {{site.data.reuse.ep_name}} 1.4.6")

**Notes:**
- This issue does not occur if using an {{site.data.reuse.ep_name}} instance configured without persistent storage, nor when importing flows exported to **JSON** format from earlier versions of {{site.data.reuse.ep_name}}.
- This issue is resolved in {{site.data.reuse.ep_name}} 1.4.7.

## Causes
{: #causes}

Because of a change in the internal storage of flows, this issue can occur when flows were created using an earlier {{site.data.reuse.ep_name}} version.

## Resolving the problem
{: #resolving-the-problem}

To make the flow editable again, complete one of the following steps:
* [Upgrade](../../installing/upgrading/) to {{site.data.reuse.ep_name}} 1.4.7.
* Duplicate the flow and use the duplicated flow (the original one can be deleted).
* Run the flow, then stop it. For more information, see [Running a flow](../../getting-started/canvas#run-flow).
* Export the flow to the **JSON** format, then import it (the original flow can be deleted). For more information, see [Exporting and importing flows](../../advanced/exporting-flows/#importing-flows).
