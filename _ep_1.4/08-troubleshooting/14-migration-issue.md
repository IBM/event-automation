---
title: "Error in flows during upgrade or import"
excerpt: "The flow encounters an unexpected errors when upgrading Event Processing or when importing a flow."
categories: troubleshooting
slug: migration-issue
toc: true
---

## Symptoms
{: #symptoms}

The flow encounters unexpected errors during the following scenarios:


- When you upgrade {{site.data.reuse.ep_name}} to the latest version, it remains accessible but cannot be edited or run, and the following error is displayed: 

  ```This flow could not be migrated. It can be exported or deleted, but it cannot be edited or run.```

- When you import the flow with an invalid format which was exported from an earlier version, import fails with the following error: 

  ```The flow cannot be imported```

## Causes
{: #causes}

If you manually modify the flow after exporting from an earlier version and then import them in the latest {{site.data.reuse.ep_name}} version, or if there is an issue in the migration framework during an upgrade, the flow becomes invalid and incompatible with the current {{site.data.reuse.ep_name}} version, resulting in an error. 

## Resolving the problem
{: #resolving-the-problem}

To resolve the problem, complete the following steps:

1. [Export](../../advanced/exporting-flows/#exporting-flows) the flow and review the fields for any issues.
1. Edit and correct the flow manually and contact [IBM Support]({{ 'support' | relative_url }}) to help with fixing this issue.  
1. [Import](../../advanced/exporting-flows/#importing-flows) the updated flow.