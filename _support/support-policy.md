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

{{site.data.reuse.ea_long}} incorporates both IBM proprietary and open-source components, including Apache Kafka and Apache Flink. In case of a problem with any of these components, IBM will investigate, identify, and provide a fix when possible. Where the fix applies to an open-source component, IBM will work with the open-source community to contribute the fix to the open-source project as appropriate. 

The official Apache Kafka Java client libraries are included in {{site.data.reuse.es_name}}. If you encounter client-side issues when using Event Automation capabilities with clients that are not provided by IBM, IBM can assist you in working with the open-source community to resolve those issues.

## Flink support policy 

For Apache Flink, support is provided if the following conditions are met:

- A Flink instance deployed and managed by the IBM Operator for Apache Flink on the Red Hat OpenShift Container Platform or, in Event Processing version 1.0.5 and later, on any other Kubernetes platform that supports the Red Hat Universal Base Images (UBI) containers. Only [session mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/deployment/overview/#session-mode){:target="_blank"} and [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/deployment/overview/#application-mode){:target="_blank"} deployments are supported. 


- IBM supports the use of IBM Flink images with:

  - Jobs authored in the Event Processing canvas
  - Flink SQL code
  - Java applications

- The following Flink Java connectors are supported:

  - Flink built-in connectors
  - [Kafka](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/kafka/){:target="_blank"} and [Upsert Kafka](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/upsert-kafka/){:target="_blank"}
  - [JDBC](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/jdbc/){:target="_blank"}

**Note:** The Apache Flink Web UI is provided for development purposes only.

### Deprecated APIs 

Deprecated Apache Flink APIs will be removed in future Flink updates and, as a result, any code that uses these deprecated APIs will not function with these future releases. It is strongly advised that users do not make use of any deprecated APIs to ensure that future Flink updates can be consumed. For a list of deprecated Java APIs, see the [Apache Flink JavaDocs](https://javadoc.io/doc/org.apache.flink/flink-java/latest/index.html){:target="_blank"} of the supported version.