---
order: 1
excerpt: Use the ServiceNow connector to stream data from Kafka topics into ServiceNow tables.
forID: kc-sink-servicenow
categories: [sink]
connectorTitle: "ServiceNow"
---

To use the {{page.connectorTitle}} {{page.categories}} connector, complete the following high-level steps:

1. Ensure that you have the required credentials and API access to your ServiceNow instance.

1. Install the Connectivity Pack as part of your Kafka Connect deployment.

1. Create a `KafkaConnect` custom resource to define your Kafka Connect runtime and include the configuration, certificates, and connectors for the installed Connectivity Pack.

1. Apply the configured `KafkaConnect` custom resource to start the Kafka Connect runtime and verify that the connector is available for use.

1. Create a `KafkaConnector` custom resource to define your connector configuration.

1. Apply the configured `KafkaConnector` custom resource to start the connector and verify that the connector is running.

For detailed instructions and configuration options, see the [Connectivity Pack connector documentation](https://github.com/ibm-messaging/connectivity-pack-kafka-connectors/blob/main/README.md){:target="_blank"}.