---
title: "Support policy"
description: "Find out about IBM's support policy for IBM Event Automation capabilities, including support provided for the included open-source components."
permalink: /support/support-policy/
toc: true
section: "IBM Event Automation support"
cardType: "large"
order: 4
layout: pagesInsideCollection
---

{{site.data.reuse.ea_long}} incorporates both IBM proprietary and open source components, including Apache Kafka and Apache Flink. In case of a problem with any of these components, IBM will investigate, identify, and provide a fix when possible. Where the fix applies to an open source component, IBM will work with the open source community to contribute the fix to the open source project as appropriate.

The official Apache Kafka Java client libraries are included in {{site.data.reuse.es_name}}. If you encounter client-side issues when using {{site.data.reuse.es_name}} with clients that are not provided by IBM, IBM can assist you in working with the open source community to resolve those issues.

For Apache Flink, support is provided if the following conditions are met:
- A Flink instance deployed and managed by the IBM Operator for Apache Flink on the Red Hat OpenShift Container Platform or, in Event Processing version 1.0.5 and later, on any other Kubernetes platform that supports the Red Hat Universal Base Images (UBI) containers. Only [session mode](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/deployment/overview/#session-mode){:target="_blank"} and [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/deployment/overview/#application-mode){:target="_blank"} deployments are supported. 
- Only deployments that are using the IBM images for both the operator and the operand (instance) are supported.
- Flink is supported for the execution of Flink SQL programs. They can be executed by using the Java [Table API](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/tableapi/){:target="_blank"} or the [SQL Client](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/sqlclient/){:target="_blank"}.
- Only the [Kafka connector](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/connectors/table/kafka/){:target="_blank"} is supported for connecting to external systems.