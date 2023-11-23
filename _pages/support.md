---
layout: collection
title: "Support"
collection: support
permalink: /support/
author_profile: false
mastheadNavItem: Support
sort_by: order
sections:
  - name: IBM Event Automation support
    description: Find support information for IBM Event Automation.
---

## Support policy

IBM Event Automation incorporates both IBM proprietary and open source components, including Apache Kafka and Apache Flink. In case of a problem with any of these components, IBM will investigate, identify, and provide a fix when possible. Where the fix applies to an open source component, IBM will work with the open source community to contribute the fix to the open source project as appropriate.

If you encounter client-side issues when using {{site.data.reuse.es_name}} with clients that are not provided by IBM, IBM can assist you in working with the open source community to resolve those issues.

For Apache Flink, support is provided if the following conditions are met:

- A Flink instance deployed and managed by the {{site.data.reuse.flink_long}} on the {{site.data.reuse.openshift}} or, in {{site.data.reuse.ep_name}} version 1.0.5 and later, on any other Kubernetes platform that supports the Red Hat Universal Base Images (UBI) containers. Only [session mode](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/overview/#session-mode){:target="_blank"} and [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/overview/#application-mod){:target="_blank"} deployments are supported.

- Only deployments that are using the IBM images for both the operator and the operand (instance) are supported.
- Flink is supported for the execution of Flink SQL programs. They can be executed by using the Java [Table API](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/tableapi/){:target="_blank"} or the [SQL Client](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/sqlclient/){:target="_blank"}.
- Only the [Kafka connector](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/connectors/table/kafka/){:target="_blank"} is supported for connecting to external systems.
