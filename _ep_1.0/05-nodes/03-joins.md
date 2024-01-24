---
title: "Joins"
excerpt: "Event Processing provides a set of nodes to create event stream processing flows"
categories: nodes
slug: joins
toc: true
---

An interval join is available in {{site.data.reuse.ep_name}}.

## Interval join

An interval join is used to merge two event streams based on a join condition that matches events within a time period.

### Adding an interval join node

To add an interval join, complete the following steps.

1. {{site.data.reuse.node_step1}}
2. In the **Palette**, under **Joins**, drag the **Interval join** node into the canvas.
3. Connect the node to two event sources by separately dragging the **Output Port** from each source node into the **Input Port** of this node.
4. Hover over the node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit** to configure the node.

The **Configure Interval join** window is displayed.


### Configuring an interval join node

To configure an interval join, complete the following steps.
#### Details
{{site.data.reuse.node_details}}

#### Join condition

To define your join condition, on the **Join condition** section, in the **Define events** text box, enter your expression.

Alternatively, you can use the assistant to create your expression.

1. Click the **Assistant** drop-down menu to open the assistant.
2. In the **Specify property from [name of the first event source]** drop-down menu, select the property that you want to match.
3. In the **Specify property from [name of the second event source]** drop-down menu, select a property to match the one chosen in step 2.
4. Click **Add to expression** to insert the expression into the text-box.

**Note:** Ensure that the property you choose for both sides of your expression has the same data type. 

#### Time window condition

To define the time window condition, complete the following steps.

1. In the *Event to detect* drop-down menu, select the property of the event you are interested in.
2. In the **Event to set the time window** drop-down menu, select the property of an event used to define the time window.
3. In the *Offset from event to start the time window* field, input an integer value and select the corresponding time unit. Then input another integer in the *Offset from event to end the time window* field to define the duration of the time window.

**Note:** Ensure that the end-time of the time window is later than the start-time.

#### Output properties

You can manage the properties that come from this node to suit your requirements.

**Rename a property**

To rename a property, complete the following steps.

1. Hover over the property name and click the **Edit** icon ![rename icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"}.
2. In the text-box, enter a new name for your property.
3. Click outside the text-box or press **Enter** on your keyboard to rename the property.

**Properties to remove**

To remove a property from being displayed in the output, click the **Remove property** icon ![remove icon]({{ 'images' | relative_url }}/remove.svg "Diagram showing remove icon."){:height="30px" width="15px"}.

**Note:** Take extreme care in removing an event time property. By keeping an event time property, you can propagate the event time to downstream nodes on the canvas. The event time property is necessary for time-based calculations in nodes, such as aggregate or another interval join.

**Add a removed property**

To add a property that was previously removed, complete the following steps.

1. Go to the **Properties to remove** table that lists the removed properties.
2. In the row of the property that you want to restore, click the **Add** icon ![add icon]({{ 'images' | relative_url }}/add.svg "Diagram showing add icon."){:height="30px" width="15px"}.

After you have set up the interval join node, click **Configure**.

A green checkbox ![green checkbox]({{ 'images' | relative_url }}/checkbox_green.svg "Diagram showing green checkbox."){:height="30px" width="15px"} appears on the interval join node if the interval join node is configured correctly. If there is any error in your configuration, a red checkbox ![red checkbox]({{ 'images' | relative_url }}/errornode.svg "Diagram showing red checkbox."){:height="30px" width="15px"} appears.

![Event Processing 1.0.5 icon]({{ 'images' | relative_url }}/1.0.5.svg "In Event Processing 1.0.5 and later") User actions are saved automatically. For save status updates, see the canvas header.  

- **Saving** ![Saving]({{ 'images' | relative_url }}/save_inprogress.png "Diagram showing save is in progress."){:height="30px" width="15px"} indicates that saving is in progress.
- **Saved** ![Save successful]({{ 'images' | relative_url }}/save_successful.png "Diagram showing save is successful."){:height="30px" width="15px"} confirms success.
- **Failed** ![Save failed]({{ 'images' | relative_url }}/save_error.png "Diagram showing that the save is failed."){:height="30px" width="15px"} indicates that there are errors. If an action fails to save automatically, you receive a notification to try the save again. Click **Retry** to re-attempt the save. When a valid flow is saved, you can proceed to run the job.

If you are running versions earlier than 1.0.5, click **Save** in the navigation banner to save the flow.
