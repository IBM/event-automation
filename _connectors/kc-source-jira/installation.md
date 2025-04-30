---
order: 1
forID: kc-source-jira
categories: [source]
excerpt: Use Jira API to stream Jira issues to Kafka topics.
connectorTitle: "Jira"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following high-level steps:

1. Ensure that you have the required API access and permissions to enable the streaming of Jira issue events.

1. Install the Connectivity Pack as part of your Kafka Connect deployment.

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the configuration, certificates, and connectors for the Connectivity Pack installed.

1. Apply the configured `KafkaConnect` custom resource to start the Kafka Connect runtime and verify that the connector is available for use.

1. Create a `KafkaConnector` custom resource to define your connector configuration.

1. Apply the configured `KafkaConnector` custom resource to start the connector and verify that the connector is running.

For detailed instructions and configuration options, see the [Connectivity Pack connector documentation](https://github.com/ibm-messaging/connectivity-pack-kafka-connectors/blob/main/README.md){:target="_blank"}.