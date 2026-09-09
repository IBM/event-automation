---
title: "Errors in IBM MQ connectors"
excerpt: "Find out how to troubleshoot the common errors in IBM MQ connectors"
categories: troubleshooting
slug: mq-connector-fails
toc: true
---

Find out how to troubleshoot the common errors in IBM MQ connectors such as the IBM MQ source connector and the IBM MQ sink connector.

## Exactly-once failure scenarios

The MQ connector is designed to fail on start-up in certain cases to ensure that exactly-once delivery is not compromised.
In some of these failure scenarios, an IBM MQ administrator should remove messages from the exactly-once state queue before the MQ connector can start up and deliver messages from the sink or the source queue again. In these cases, the MQ connector has the `FAILED` status and the Kafka Connect logs describe any required administrative action.

## `MQRC_NOT_AUTHORIZED` exception in MQ sink connector when enabling MQMD

### Sypmtoms
When attempting to send a message to an IBM MQ queue, an MQException with code `MQRC_NOT_AUTHORIZED` (reason code `2035`) and completion code 2 is thrown. 

### Causes

The `MQRC_NOT_AUTHORIZED` exception indicates insufficient permissions on the queue and the queue manager.

### Resolving the problem

1. **Review permissions**: Ensure that the user has necessary permissions for accessing the queue and the queue manager.
2. **Grant authority**: If the user does not have the necessary permissions, assign required authorities to the user.
3. **Set Context**: Set `WMQ_MQMD_MESSAGE_CONTEXT` property for required properties.

### Additional guidance

See the following guidance to help you avoid this error:

- Verify that the length of all properties are correctly set within the allowed limit.
- Do not set the `JMS_IBM_MQMD_BackoutCount` property.
- Refer to the IBM MQ documentation for detailed configuration guidance:

  - [IBM MQ JMS Message Object Properties](https://www.ibm.com/docs/en/ibm-mq/9.3?topic=application-jms-message-object-properties): This documentation provides details about various properties that can be set on IBM MQ JMS message objects, including their names, types, and descriptions.
  - [IBM MQ Developer Community](https://community.ibm.com/community/user/integration/home): The developer community for IBM MQ, where you can find forums, articles, and resources related to development and troubleshooting for IBM MQ.
  - [IBM MQ troubleshooting guide](https://www.ibm.com/docs/en/ibm-mq/9.3?topic=mq-troubleshooting-support): IBM guide for troubleshooting common issues and errors in IBM MQ.
