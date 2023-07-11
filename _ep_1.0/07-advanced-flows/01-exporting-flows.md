---
title: "Exporting and importing flows"
excerpt: "Find out how you can export your existing flows to make them available for advanced authoring and for use in other Flink instances."
categories: advanced
slug: exporting-flows
toc: true
---

Follow the instructions to export and import your flows in {{site.data.reuse.ep_name}}.

## Exporting flows

Export your flow to the format that you require. Exported flows can be used as a backup of your work items you created in {{site.data.reuse.ep_name}}, and they can be imported later to reuse in other flows or {{site.data.reuse.ep_name}} instances.

You can export your flow as a JSON or an SQL file. Flows that are exported as SQL can be updated and deployed as a Flink job in [development](../deploying-development) or [production](../deploying-production) environments.

**Note:** Flows that are exported as SQL cannot be imported to the {{site.data.reuse.ep_name}} UI. To import flows, the files must be in JSON format.

To export a flow, follow these steps:

1. Go to the {{site.data.reuse.ep_name}} home page.
2. Find the flow that you want to export.
3. In the flow you want to export, click the **Options** icon ![options icon]({{ 'images/' | relative_url }}options.png "Diagram showing more options."){:height="30px" width="15px"} and then select **Export** to open the **Export** dialog.
4. Choose the export format. You can export as a JSON or an SQL file.

   Exporting a file as SQL requires the following prerequisites to be met:

    - Source nodes are connected to the same graph.
    - Connected nodes are configured and valid. A valid graph has a green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} for all configured nodes.
    - Connected nodes define a graph that ends with only one node.

5. Click **Export**.


The flow is downloaded as a `<flowname>.sql` or a `<flowname>.json` file based on the format that you selected.


## Importing flows

Flows that are in JSON format can be imported to reuse any number of times.

To import a flow, follow these steps:

1. Go to the {{site.data.reuse.ep_name}} home page.
2. In the **Create a new flow** card, click **Import** to open the **Import a flow** dialog.
3. In **Upload files**, drag your files in to the dialog or upload the file that you want to import.
4. After your file is uploaded, click **Create** to import your flow.

**Note:** By default, flows that you import are saved as `Untitled flow`. You can rename your file for easier identification.