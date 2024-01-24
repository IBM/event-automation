---
title: "The Kafka consumer is not picking up changes made to controls"
excerpt: "If a schema filtering or redaction control is added to an option that has active consumers, those consumers continue without the controls applied"
categories: troubleshooting
slug: new-controls-not-picked-up
toc: true
---

## Symptoms

The running Kafka consumer continues to see messages that don't match the configured schema even though the [schema filtering control](../../describe/option-controls#schema-filter) has been added to the option. Also, the consumer continues to see messages with fields that should have redacted values as configured in the [redaction control](../../describe/option-controls#redaction). 

## Causes

When the first [redaction](../../describe/option-controls#redaction) or [schema filtering](../../describe/option-controls#schema-filter) control is added to an option that is being used in an active Kafka consumer, the changes are not automatically picked up by that consumer.

## Resolving the problem

To resolve the problem, disconnect and reconnect the consumer.
