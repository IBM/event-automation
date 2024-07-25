---
title: "What's new"
excerpt: "Find out what is new in Event Processing."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.ep_name}} version 1.1.x.

## Release {{site.data.reuse.ep_current_version}}

### Tree view for event properties

{{site.data.reuse.ep_name}} release 1.1.9 introduces a tree view for displaying the input properties of a node. The tree view is available in the following nodes: [processor](../../nodes/processornodes/), [windowed](../../nodes/windowednodes/), [join](../../nodes/joins/), and [enrichment](../../nodes/enrichmentnode/).

### Support for {{site.data.reuse.openshift}} 4.16

{{site.data.reuse.ep_name}} version 1.1.9 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.16.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.1.9 compared to 1.1.8 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.1.9 icon]({{ 'images' | relative_url }}/1.1.9.svg "In Event Processing 1.1.9 and later.")


### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.9 and {{site.data.reuse.ibm_flink_operator}} version 1.1.9 contain security and bug fixes.

## Release 1.1.8

### Support for events with complex array properties

{{site.data.reuse.ep_name}} release 1.1.8 and later includes support for events containing properties that are an array of objects or an array of arrays. Complex arrays are supported in JSON and Avro formats and can be at any nested level. For more information, see [complex arrays](../../nodes/eventnodes/#complex-arrays).


### Event source node does not process uncommitted events from Kafka topics

{{site.data.reuse.ep_name}} release 1.1.8 enhances the ability for the event source node to process committed events from Kafka topics. This update ensures that uncommitted events sent within a Kafka transaction are not processed by {{site.data.reuse.ep_name}} when the transaction fails or is aborted.


### Flink user-defined functions (UDFs) in the exported SQL

In {{site.data.reuse.ep_name}} release 1.1.0 and later, UDFs can be used when deploying jobs in [development](../../advanced/deploying-development) or [production](../../advanced/deploying-production) environments. For more information, see [UDFs in the exported SQL](../../reference/supported-functions#user-defined-functions-in-the-exported-sql) and the related [GitHub samples](https://ibm.biz/ep-flink-udf-sample){:target="_blank"}.


### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.1.8 compared to 1.1.7 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.1.8 icon]({{ 'images' | relative_url }}/1.1.8.svg "In Event Processing 1.1.8 and later.")


### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.8 and {{site.data.reuse.ibm_flink_operator}} version 1.1.8 contain security and bug fixes.

## Release 1.1.7

### Auto-detection of a topic message format in the event source node

When you configure the [event source node](../../nodes/eventnodes/#event-source) and select the Kafka topic from which to consume messages, {{site.data.reuse.ep_name}} attempts to determine the format of messages from the topic. For more information, see [auto-detection](../../nodes/eventnodes/#auto-detection-of-message-format). 


### Processor node: Unpack arrays

{{site.data.reuse.ep_name}} release 1.1.7 introduces a node to unpack the array properties in the events within your {{site.data.reuse.ep_name}} flow. With the unpack array node, you can unpack each array element into a new property in separate events, or unpack the array elements into new properties. For more information, see [Unpack arrays](../../nodes/processornodes/#unpack-arrays).


### Enrichment node: API

{{site.data.reuse.ep_name}} release 1.1.7 introduces the **API** node. With the API node, you can establish connections with external APIs and integrate the data with the events within your {{site.data.reuse.ep_name}} flow. For more information, see the [API node](../../nodes/enrichmentnode/#enrichment-from-an-api).

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.1.7 compared to 1.1.5 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.1.7 icon]({{ 'images' | relative_url }}/1.1.7.svg "In Event Processing 1.1.7 and later.")

### Support for Kubernetes 1.30

{{site.data.reuse.ep_name}} version 1.1.7 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for Kubernetes platforms version 1.30 that support the Red Hat Universal Base Images (UBI) containers.

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.7 and {{site.data.reuse.ibm_flink_operator}} version 1.1.7 contain security and bug fixes.

## Release 1.1.5

### Support for Avro schemas that use a schema registry

{{site.data.reuse.ep_name}} release 1.1.5 includes support for Avro schemas that use a schema registry from {{site.data.reuse.es_name}} or a registry that supports the Confluent REST API. In addition to message formats **JSON** and **Avro**, the event source node now supports a new message format **Avro (schema registry)**. For more information, see [event nodes](../../nodes/eventnodes/#configuring-a-source-node) and the associated [tutorial]({{ 'tutorials' | relative_url }}/event-processing-examples/example-13) about handling formats that use a schema registry.


### Support for Linux on IBM Z

In addition to Linux 64-bit (x86_64) systems, {{site.data.reuse.ep_name}} 1.1.5 and later is also [supported]({{ 'support/matrix/#event-processing' | relative_url }}) on OpenShift deployments running on Linux on IBM Z systems (s390x).

**Note:** You cannot install {{site.data.reuse.ep_name}} on other Kubernetes platforms except OpenShift when running on IBM Z systems.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.1.5 compared to 1.1.4 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.1.5 icon]({{ 'images' | relative_url }}/1.1.5.svg "In Event Processing 1.1.5 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.5 and {{site.data.reuse.ibm_flink_operator}} version 1.1.5 contain security and bug fixes.

## Release 1.1.4

### Secure communication with Flink deployments

{{site.data.reuse.ibm_flink_operator}} and {{site.data.reuse.ep_name}} can now [communicate](../../installing/planning/#securing-communication-with-flink-deployments) with TLS enabled Flink deployments to enhance security.

### Support for events with primitive array properties

{{site.data.reuse.ep_name}} release 1.1.4 includes support for events with [primitive type array](../../nodes/eventnodes/#define-event-structure) properties. Primitive arrays are supported in both JSON and Apache Avro formats with any level of nesting.

### Support for {{site.data.reuse.openshift}} 4.15

{{site.data.reuse.ep_name}} version 1.1.4 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.15.

### Support for Kubernetes 1.29

{{site.data.reuse.ep_name}} version 1.1.4 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for Kubernetes platforms version 1.29 that support the Red Hat Universal Base Images (UBI) containers.

### Apache Flink updated to 1.18.1

{{site.data.reuse.ibm_flink_operator}} version 1.1.4 update includes Apache Flink version 1.18.1.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.1.4 compared to 1.1.3 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.1.4 icon]({{ 'images' | relative_url }}/1.1.4.svg "In Event Processing 1.1.4 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.4 and {{site.data.reuse.ibm_flink_operator}} version 1.1.4 contain security and bug fixes.

## Release 1.1.3

### Support for events with nested properties

Event Processing release 1.1.3 and later includes support for events containing properties describing objects. You can now process events including more complex data.

**Note:** [Nested properties](../../about/key-concepts/#nested-properties/) are supported in both JSON and AVRO formats.

### Support for ISO timestamps and timestamps with time zone

{{site.data.reuse.ep_name}} release 1.1.3 introduces support for new timestamp types. You can now configure events that contain timestamps in ISO format and timestamps with different time zones. For more information, see [event nodes](../../nodes/eventnodes/#configuring-a-source-node/).


### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.1.3 compared to 1.1.2 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.1.3 icon]({{ 'images' | relative_url }}/1.1.3.svg "In Event Processing 1.1.3 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.3 and {{site.data.reuse.ibm_flink_operator}} version 1.1.3 contain security and bug fixes.



## Release 1.1.2

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.1.2 compared to 1.1.1 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.1.2 icon]({{ 'images' | relative_url }}/1.1.2.svg "In Event Processing 1.1.2 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.2 and {{site.data.reuse.ibm_flink_operator}} version 1.1.2 contain security and bug fixes.


## Release 1.1.1

### Support for Avro binary-encoded events and epoch timestamps

{{site.data.reuse.ep_name}} release 1.1.1 includes support for events that are in binary-encoded Avro format. Support for epoch timestamps containing second, millisecond, and microsecond precision is also included. For more information, see [event nodes](../../nodes/eventnodes/#configuring-a-source-node/).

### Support for Oracle database

{{site.data.reuse.ep_name}} release 1.1.1 introduces support for enriching your events from an Oracle database. You can now [connect](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry) to an Oracle database and integrate the Oracle data with the events within your {{site.data.reuse.ep_name}} flow by using the [database](../../nodes/enrichmentnode/#database) node.

### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.ep_name}} 1.1.1 compared to 1.1.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Processing 1.1.1 icon]({{ 'images' | relative_url }}/1.1.1.svg "In Event Processing 1.1.1 and later.")

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.1 and {{site.data.reuse.ibm_flink_operator}} version 1.1.1 contain security and bug fixes.

## Release 1.1.0

### Apache Flink updated to 1.18.0

The {{site.data.reuse.ibm_flink_operator}} version 1.1.0 update includes Apache Flink version 1.18.0.

### Support for MySQL database

{{site.data.reuse.ep_name}} release 1.1.0 introduces support for enriching your events from a MySQL database. You can now [connect](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry) to a MySQL database and integrate the MySQL data with the events within your {{site.data.reuse.ep_name}} flow by using the [database](../../nodes/enrichmentnode/#database) node.

### Reuse a time window in aggregate and top-n nodes

{{site.data.reuse.ep_name}} release 1.1.0 introduces the ability to reuse, in aggregate and top-n nodes, a time window that was defined in a previous node.
This feature enables you to implement scenarios such as "Calculate the 3 product types with the highest total sales per hour". For more information, see [Windowed nodes](../../nodes/windowednodes/).

### Stale status when your flow is modified

{{site.data.reuse.ep_name}} 1.1.0 introduces a **Stale** ![Stale]({{ 'images' | relative_url }}/save_error.png "Icon showing that the flow is stale."){:height="30px" width="15px"} save status. A **Stale** status indicates that another user modified the flow. When this happens, a pop-up window is displayed with the title **Flow edit updates available**, **Flow running**, or **Flow deleted**. Depending on the **Stale** status you are prompted to select one of the following actions:

- **Save as a copy**: Select this action to save the current flow as a new one without incorporating the changes made by the other user. The new flow is called 'Copy of `<flow-name>`'.
- **Accept changes**: Select this action to apply the latest updates that are made by the other user to the flow. For the **Flow running** case, you can view the running flow.
- **Home**: Select this action to navigate back to the home page. The specific flow will no longer be available because it was deleted by another user.

### Support for {{site.data.reuse.openshift}} 4.14

{{site.data.reuse.ep_name}} 1.1.0 introduces [support]({{ 'support/matrix/#event-processing' | relative_url }}) for {{site.data.reuse.openshift}} 4.14.

### Security and bug fixes

{{site.data.reuse.ep_name}} release 1.1.0 and {{site.data.reuse.ibm_flink_operator}} version 1.1.0 contain security and bug fixes. 
