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

## {{site.data.reuse.es_name}} and Kafka

The official Apache Kafka Java client libraries are included in {{site.data.reuse.es_name}}. If you encounter client-side issues when using Event Automation capabilities with clients that are not provided by IBM, IBM can assist you in working with the open-source community to resolve those issues.

## {{site.data.reuse.eem_name}}

{{site.data.reuse.eem_name}} works with any Kafka distribution that faithfully supports the public-facing [Kafka protocol](https://kafka.apache.org/protocol){:target="_blank"}.

The Kafka protocol is made up of many API keys. Each API key has a range of request and response versions. The Event Gateway supports the use of the following APIs by Kafka clients connecting to it:

| {{site.data.reuse.eem_name}} version | API key name | Supported API key request and response versions |
| ---------------- | -------------------- | ------------------------------------------------- |
| 11.1.5 and later | Produce              | All                                               |
| 11.1.5 and later | InitProducerId       | All                                               |
| 11.0.0 and later | Fetch                | All                                               |
| 11.0.0 and later | ListOffsets          | All                                               |
| 11.0.0 and later | Metadata             | All                                               |
| 11.0.0 and later | OffsetCommit         | All                                               |
| 11.0.0 and later | OffsetFetch          | All                                               |
| 11.0.0 and later | FindCoordinator      | All                                               |
| 11.0.0 and later | JoinGroup            | All                                               |
| 11.0.0 and later | Heartbeat            | All                                               |
| 11.0.0 and later | LeaveGroup           | All                                               |
| 11.0.0 and later | SyncGroup            | All                                               |
| 11.0.0 and later | SaslHandshake        | All                                               |
| 11.0.0 and later | ApiVersions          | All                                               |
| 11.0.0 and later | OffsetForLeaderEpoch | All                                               |
| 11.0.0 and later | SaslAuthenticate     | All                                               |
| 11.0.0 and later | OffsetDelete         | All                                               |

## {{site.data.reuse.ep_name}} and Flink

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
