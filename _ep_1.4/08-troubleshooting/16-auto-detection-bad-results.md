---
title: "Auto-detection message format issues"
excerpt: "Message format that is automatically populated by Event Processing does not match the actual format of topic messages."
categories: troubleshooting
slug: bad-output-from-auto-detection
toc: true
---

## Symptom

{{site.data.reuse.ep_name}} tries to automatically determine the message format by analyzing the most recent message in the topic. However, this auto-detection might sometimes result in incorrect message format, resulting in flow failures.


## Causes

The following are some of the causes when {{site.data.reuse.ep_name}} is unable to detect the correct message format:

- **Detected format is Avro but the message is not encoded using an Avro schema:** {{site.data.reuse.ep_name}} detects binary-encoded messages and assumes that the message was encoded using an Avro schema, however, it is possible that the message might not be encoded using an Avro schema.
- **Auto-detected format is Avro (schema registry) but the actual format of the message is Avro:** Depending on the definition of the Avro schema and the value of the first property in the last message on the topic, {{site.data.reuse.ep_name}} could interpret the message as encoded with an Avro schema from a registry.
- **Auto-detected format is Avro (schema registry) but the encoding of the message is not compatible with the Avro confluent format:** Messages are not produced to use a compatible schema registry.

## Resolving the problem

- If the auto-detected format does not match the actual expected format of the messages of your topic, you can manually set the message format.
- When you produce messages to the topic, ensure that following requirements are followed:
  - A valid JSON format must be used for JSON messages.
  - Binary-encoded Avro format must be used for Avro schemas.
  - [Schema registry requirements](../../installing/prerequisites/#schema-registry-requirements) are met before producing messages that use Avro schemas that are stored in schema registry.