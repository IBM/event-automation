---
title: "Reverting nodes to an earlier implementation"
excerpt: "Find out how to revert API, watsonx.ai, and deduplicate nodes to the earlier implementation by editing the flow JSON."
categories: troubleshooting
slug: reverting-to-earlier-node-implementations
toc: true
---

![Event Processing 1.5.5 icon]({{ 'images' | relative_url }}/1.5.5.svg "In Event Processing 1.5.5 and later.") In {{site.data.reuse.ep_name}} 1.5.5 and later, the implementation of [API](../../nodes/enrichmentnode/#enrichment-from-an-api), [watsonx.ai](../../nodes/enrichmentnode/#watsonx-node), and [deduplicate](../../nodes/processornodes/#deduplicate) nodes has been enhanced. When you use the {{site.data.reuse.ep_name}} UI, new flows and existing flows are automatically updated to use the new implementations.

If you encounter issues with the new implementation, you can revert individual nodes to the earlier implementation by editing the flow JSON.

## Reverting a node to the earlier implementation
{: #reverting-to-earlier-implementation}

To revert a node to the earlier implementation, complete the following steps:

1. [Export](../../advanced/exporting-flows/#exporting-flows) the flow in **JSON** format.
1. Open the exported file in a text editor and locate the node that you want to revert.
1. Set the property for the node type to `false`:
   - For API and watsonx.ai nodes, set `"useApacheConnector": false`.
   - For deduplicate nodes, set `"useSqlDeduplication": false`.

   If the property is not present, add it to the node object.

1. Save the file and [import](../../advanced/exporting-flows/#importing-flows) the updated flow into {{site.data.reuse.ep_name}}.

**Note:** To restore a node to the new implementation, set the property back to `true`.
