---
title: "Exporting and importing flows"
excerpt: "Find out how you can export your existing flows to make them available for advanced authoring and for use in other Flink instances."
categories: advanced
slug: exporting-flows
toc: true
---

Follow the instructions to export and import your flows in {{site.data.reuse.ep_name}}.

## Exporting flows

Export your flow to the format that you require. Exported flows can be used as a backup of your work items you created in {{site.data.reuse.ep_name}}, and they can be imported later to reuse in other {{site.data.reuse.ep_name}} instances, as a starting point for authoring new flows, or for running the flows in Flink instances.

You can export your flow in the following formats:

| Export format | Exported file | Sensitive credentials | Additional comments |
| --- | --- | --- |
| ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3.svg "In Event Processing 1.2.3 and later.") **JSON and configuration YAML** | `<flow-name>.zip` file that contains `<flow-name>.json` + `config.yaml` |  Sensitive values are redacted. | For deploying jobs customized for production or test environments, by using command-line, possibly as part of a CI/CD pipeline. |
| **JSON** | `<flow-name>.json` | Contains credentials | For backing up and sharing flows with others. |
| **SQL** | `<flow-name>.sql` | Sensitive values are redacted. | - For deploying jobs by using the [Flink SQL client](../deploying-development) or the [Apache SQL Runner sample](../deploying-production). <br/> <br/> - Cannot be imported into the {{site.data.reuse.ep_name}} UI. |

   <!-- pattern node * Cannot be used for flows containing the [Detect patterns node](../../nodes/pattern). pattern node -->

**Notes:** 
* The credentials used for the configuration of the [Kafka](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/kafka/){:target="_blank"}, [JDBC](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/jdbc){:target="_blank"}, and [HTTP](https://github.com/getindata/flink-http-connector/blob/0.16.0/README.md){:target="_blank"} connectors are redacted in the **JSON and configuration YAML** and **SQL** export formats, except for the [HTTP](https://github.com/getindata/flink-http-connector/blob/0.16.0/README.md){:target="_blank"} connector when used in [SQL processor nodes](../../nodes/custom).
* Exporting a flow as **JSON and configuration YAML** or as **SQL** requires the following prerequisites to be met:
   - [Source nodes](../../nodes/eventnodes/#event-source) are connected to the same graph.
   - Connected nodes are configured and valid. A valid graph has a green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} for all configured nodes.
   - Connected nodes define a graph that ends with only one node, which must be an [event destination node](../../nodes/eventnodes/#event-destination).

To export a flow, complete the following steps:

1. Go to the {{site.data.reuse.ep_name}} home page.
2. Find the flow that you want to export.
3. In the tile of the flow you want to export, click the **Options** icon ![options icon]({{ 'images/' | relative_url }}options.png "Diagram showing more options."){:height="30px" width="15px"} and then select **Export** to open the **Export** dialog.
4. Choose the export format.
5. Click **Export**.


![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3.svg "In Event Processing 1.2.3 and later.") The **Export** features are also available in **More options** ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} next to **Run flow** in the navigation banner of the canvas.


## Importing flows

Flows that are exported in JSON format can be imported in the {{site.data.reuse.ep_name}} UI to reuse any number of times.

To import a flow, complete the following steps:

1. Go to the {{site.data.reuse.ep_name}} home page.
2. In the **Create a new flow** card, click **Import** to open the **Import a flow** dialog.
3. In **Upload files**, drag your files in to the dialog or upload the file that you want to import.
4. After your file is uploaded, click **Create** to import your flow.

**Note:** Flows that you import are saved by using their flow name at export time. You can rename your file for easier identification.