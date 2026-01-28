---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---


## Update to Flink support policy
{: #update-to-flink-support-policy}

IBM's conditions of support for Apache Flink in {{site.data.reuse.ea_long}} has been expanded. For more information, see the [support policy statement]({{ '/support/support-policy/' | relative_url}}).

Find out what is new in {{site.data.reuse.ep_name}} version 1.4.x.

## Release {{site.data.reuse.ep_current_version}}
{: #release-147}

### API enrichment node: improve efficiency with caching
{: #api-enrichment-cache-configuration}

In {{site.data.reuse.ep_name}} 1.4.7 and later, you can enable caching in the API enrichment node to improve efficiency by reducing repeated calls to external APIs. The cache stores API lookup results for a configurable time period and a maximum entry count, optimizing performance for high-volume event streams where data updates are not frequent. For more information, see [configuring an API node](../../nodes/enrichmentnode#configuring-an-api-node).


### API enrichment node: add metadata fields to identify unenriched results
{: #api-enrichment-unenriched-results-metadata}

In {{site.data.reuse.ep_name}} 1.4.7 and later, in the **Unenriched events** pane, when the **Include unenriched events** toggle is set to **On**, you can add metadata fields to your output to identify why the API enrichment failed. For more information, see [configuring an API node](../../nodes/enrichmentnode#configuring-an-api-node).

### Database enrichment node: improve efficiency with caching
{: #database-enrichment-cache-configuration}

In {{site.data.reuse.ep_name}} 1.4.7 and later, you can enable caching in database enrichment node to improve efficiency by limiting repeated queries to external databases. The cache stores database lookup results for a configurable time period and a maximum entry count, optimizing performance for high-volume event streams where data updates are not frequent. For more information, see [configuring a database node](../../nodes/enrichmentnode#configuring-a-database-node).

### Apache Flink updated to 1.20.3
{: #apache-flink-updated-to-1203}

{{site.data.reuse.ibm_flink_operator}} version 1.4.7 update includes Apache Flink version 1.20.3.

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-between-differences-147}

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.4.7 compared to 1.4.6 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.4.7 icon]({{ 'images' | relative_url }}/1.4.7.svg "In Event Processing 1.4.7 and later.")

### Security and bug fixes
{: #security-and-bug-fixes-147}

{{site.data.reuse.ep_name}} release 1.4.7 and {{site.data.reuse.ibm_flink_operator}} version 1.4.7 contain security and bug fixes.

## Release 1.4.6
{: #release-146}


### Filter node: improvements to filter assistant
{: #filter-assistant-improvements}

In {{site.data.reuse.ep_name}} 1.4.6 and later, you can modify your existing expression by using the filter assistant. Open the **Filter assistant**, make your changes, and click **Update expression** to apply them. For more information, see [configuring](../../nodes/processornodes#configuring-a-filter-node) a filter node.

### API enrichment node: control unenriched results
{: #api-enrichment-unenriched-results}

In {{site.data.reuse.ep_name}} 1.4.6 and later, you can configure how to handle unenriched results when the API call does not return a match for the input event. For more information, see [configuring an API node](../../nodes/enrichmentnode#configuring-an-api-node).

### Undo and redo actions in the canvas
{: #undo-redo-actions}

In {{site.data.reuse.ep_name}} 1.4.6 and later, you can revert changes or restore actions while building or editing your event processing flows in the canvas. Use the undo and redo buttons in the toolbar, or use keyboard shortcuts.


### Better insights into your flow
{: #better-insights-into-your-flow}

In {{site.data.reuse.ep_name}} 1.4.6 and later, flow statuses are enhanced to provide more information about the current state of the flow and its underlying Flink job.

### Compare output events of any two nodes in the UI
{: #compare-output-events-in-ui}

In {{site.data.reuse.ep_name}} 1.4.6 and later, you can compare the output events of any two nodes while running the flow by selecting the **Multi node view** tab in the **Output events** table. For more information, see [running a flow](../../getting-started/canvas#run-flow).

### Customize your output events table
{: #customize-output-events-table}

In {{site.data.reuse.ep_name}} 1.4.6 and later, you can customize the **Output events** table to show or hide properties, and reorder them by clicking the **Customize columns** icon ![Customize columns icon]({{ 'images' | relative_url }}/column.svg "Customize columns icon."){: height="32px" width="32px"}. For more information, see [running a flow](../../getting-started/canvas#run-flow-enhancements).

### Change in deletion behavior for Flink instances
{: #change-in-deletion-behavior-for-flink-instances}

In {{site.data.reuse.ep_name}} 1.4.6 and later, by default, Flink instances cannot be deleted while Flink jobs are running. For more information, see [uninstalling](../../installing/uninstalling#uninstalling-instances).

### Apache Flink Kubernetes Operator updated to 1.13.0
{: #apache-flink-kubernetes-operator-updated-to-1130}

{{site.data.reuse.ibm_flink_operator}} version 1.4.6 includes Apache Flink Kubernetes Operator version 1.13.0.

### Support for {{site.data.reuse.openshift}} 4.20
{: #support-for-openshift-420}

{{site.data.reuse.ep_name}} version 1.4.6 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.20.

### Support for Kubernetes 1.33
{: #support-for-kubernetes-133}

{{site.data.reuse.ep_name}} version 1.4.6 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for Kubernetes platforms version 1.33 that support the Red Hat Universal Base Images (UBI) containers.

### Documentation: Highlighting differences between versions
{: #documentation-higlighting-between-differences-146}

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.4.6 compared to 1.4.5 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.4.6 icon]({{ 'images' | relative_url }}/1.4.6.svg "In Event Processing 1.4.6 and later.")

### Security and bug fixes
{: #security-and-bug-fixes-146}

{{site.data.reuse.ep_name}} release 1.4.6 and {{site.data.reuse.ibm_flink_operator}} version 1.4.6 contain security and bug fixes.

## Release 1.4.5
{: #release-145}

### Processor node: deduplicate
{: #deduplicate-node}

{{site.data.reuse.ep_name}} release 1.4.5 introduces the deduplicate node for removing duplicate events from your {{site.data.reuse.ep_name}} flow. Based on one or more properties, the node identifies whether events on an ordered stream are unique within a set time interval, and filters out repeated events. For more information, see [deduplicate node](../../nodes/processornodes/#deduplicate) and the related [tutorial]({{ '/tutorials/event-processing-examples/example-05' | relative_url}}).

### Support for multiple event destination nodes
{: #support-for-multiple-event-destination-nodes}

In {{site.data.reuse.ep_name}} 1.4.5 and later, flows can terminate with multiple nodes, and results can be sent to several destination nodes ([event destination](../../nodes/eventnodes/#event-destination) or [SQL destination](../../nodes/custom/)). Multiple destination nodes can be connected from any node that is not itself a destination node.

### You can view Flink watermarks for any node in your flow
{: #view-watermarks-in-your-flow}

In {{site.data.reuse.ep_name}} 1.4.5 and later, while running your flow, you can view Flink watermarks (displayed as date and time) for any node in the flow. To view watermarks, click the **Customize view** icon ![Customize view icon]({{ 'images' | relative_url }}/customize-view.svg "Customize view icon."), and select **Show Flink watermark** ![View watermark icon]({{ 'images' | relative_url }}/view-watermark.svg "View watermark icon."). For more information, see [running a flow](../../getting-started/canvas#run-flow).

### Filter node: support for multiple filter expressions with the Assistant

In {{site.data.reuse.ep_name}} 1.4.5 and later, you can create a filter expression with multiple conditions in the [filter node](../../nodes/processornodes#configuring-a-filter-node) by using the **Assistant**. You can create complex expressions with the Assistant and join them with `AND` and `OR`.

### Apache Flink updated to 1.20.2
{: #apache-flink-updated-to-1202}

{{site.data.reuse.ibm_flink_operator}} version 1.4.5 update includes Apache Flink version 1.20.2.

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions-145}

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.4.5 compared to 1.4.4 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.4.5 icon]({{ 'images' | relative_url }}/1.4.5.svg "In Event Processing 1.4.5 and later.")

### Security and bug fixes
{: #security-and-bug-fixes}

{{site.data.reuse.ep_name}} release 1.4.5 and {{site.data.reuse.ibm_flink_operator}} version 1.4.5 contain security and bug fixes.


## Release 1.4.4
{: #release-144}


### Filter node: You can now manage output properties
{: #filter-node-manage-output-properties}

The filter node now includes an **Output properties** pane to [manage the output properties](../../nodes/processornodes#configuring-a-filter-node) generated by this node. You can view, edit, or remove these properties as required.

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions-144}


Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.4.4 compared to 1.4.3 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.4.4 icon]({{ 'images' | relative_url }}/1.4.4.svg "In Event Processing 1.4.4 and later.")

### Security and bug fixes
{: #security-and-bug-fixes}

{{site.data.reuse.ep_name}} release 1.4.4 and {{site.data.reuse.ibm_flink_operator}} version 1.4.4 contain security and bug fixes.

## Release 1.4.3
{: #release-143}


### Security and bug fixes
{: #security-and-bug-fixes}

{{site.data.reuse.ep_name}} release 1.4.3 and {{site.data.reuse.ibm_flink_operator}} version 1.4.3 contain security and bug fixes.

## Release 1.4.2
{: #release-142}


### Optimized Flink jobs when running flows containing sink nodes in the {{site.data.reuse.ep_name}} UI
{: #optimized-flink-jobs-when-running-flows-containing-sink-nodes-in-the-event-processing-ui}

In {{site.data.reuse.ep_name}} 1.4.2 or later, when running flows containing event destination nodes in the {{site.data.reuse.ep_name}} authoring UI:

- Only one Flink job is deployed to collect the output events displayed in the UI. In earlier releases, a second job is also deployed.
- For flows containing [database](../../nodes/enrichmentnode/#database), [watsonx.ai](../../nodes/enrichmentnode/#watsonx-node), or [API](../../nodes/enrichmentnode/#enrichment-from-an-api) nodes, the number of calls to the database, watsonx.ai, or the API server is reduced by half. For such flows, this optimization also prevents discrepancies when the output events displayed in the UI could be different from those written in the Kafka output topic, if successive calls to the database, watsonx.ai, or the API server produce different results.

**Note:** When [upgrading](../../installing/upgrading/) from {{site.data.reuse.ep_name}} 1.4.1 or earlier, any flows that are running in the {{site.data.reuse.ep_name}} authoring UI are automatically stopped. You can run those flows again after the upgrade of both {{site.data.reuse.ep_name}} and {{site.data.reuse.ibm_flink_operator}}.

### Enhancements for better insights of a running flow
{: #enhancements-for-better-insights-of-a-running-flow}

In {{site.data.reuse.ep_name}} 1.4.2 and later, when you [run the flow](../../getting-started/canvas/#run-flow), you can view the output events of any particular node and the number of output events for all the nodes. You can also filter output events by searching for a particular text and find matching events of any node.


### Temporal join: Support for multiple join conditions in the primary key
{: #temporal-join-support-for-multiple-join-conditions-in-the-primary-key}

In Event Processing 1.4.2 and later, you can add multiple join conditions in the primary key for the [temporal join](../../nodes/joins/#temporal-join) node.

### Collection of usage metrics
{: #collection-of-usage-metrics}

To improve product features and performance, {{site.data.reuse.ep_name}} 1.4.2 and later collects data about {{site.data.reuse.ep_name}} instances by default. This is in addition to the data collected about Flink instances in 1.4.1 and later.

You can [disable data collection]({{ '/support/licensing/#usage-metrics' | relative_url }}) at any time.

### Support for {{site.data.reuse.openshift}} 4.19
{: #support-for-red-hat-openshift-container-platform-419}

{{site.data.reuse.ep_name}} version 1.4.2 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.19.

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions}

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.4.2 compared to 1.4.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.4.2 icon]({{ 'images' | relative_url }}/1.4.2.svg "In Event Processing 1.4.2 and later.")

### Security and bug fixes
{: #security-and-bug-fixes}

{{site.data.reuse.ep_name}} release 1.4.2 and {{site.data.reuse.ibm_flink_operator}} version 1.4.2 contain security and bug fixes.



## Release 1.4.1
{: #release-141}

### Join: window join
{: #join-window-join}

In {{site.data.reuse.ep_name}} 1.4.1 and later, you can use the [window join](../../nodes/joins/#window-join) node to merge two input event streams based on a join condition that matches events within the same time window.

### Join: temporal join
{: #join-temporal-join}

In Event Processing 1.4.1 and later, you can use the [temporal join](../../nodes/joins/#temporal-join) node to merge a main event source with the most recent supplementary event source based on a join condition and timestamp.

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions}

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.4.1 compared to 1.4.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.4.1 icon]({{ 'images' | relative_url }}/1.4.1.svg "In Event Processing 1.4.1 and later.")

### Security and bug fixes
{: #security-and-bug-fixes}

{{site.data.reuse.ep_name}} release 1.4.1 and {{site.data.reuse.ibm_flink_operator}} version 1.4.1 contain security and bug fixes.


## Release 1.4.0
{: #release-140}


### Collection of usage metrics for Flink instances
{: #collection-of-usage-metrics-for-flink-instances}

To improve product features and performance, {{site.data.reuse.ep_name}} 1.4.1 and later collects data about the usage of deployments by default. Data is collected about all Flink application and session job instances.

You can [disable data collection]({{ '/support/licensing/#usage-metrics' | relative_url }}) at any time.


### New tutorial: nudge customers with abandoned cart by using the watsonx.ai node
{: #new-tutorial-nudge-customers-with-abandoned-cart-by-using-the-watsonxai-node}

A new [tutorial]({{ 'tutorials/notify-abandoned-orders/' | relative_url}}) is available that shows how you can use the watsonx.ai node to check abandoned shopping carts, and attempt to persuade customers to complete their purchase by highlighting the product with the most positive review.


### Security and bug fixes
{: #security-and-bug-fixes}

{{site.data.reuse.ep_name}} release 1.4.0 and {{site.data.reuse.ibm_flink_operator}} version 1.4.0 contain security and bug fixes.

