---
title: "Redaction fails for nested fields"
excerpt: "If a nested field is redacted by using a schema, then the operation fails with the Event Gateway producing errors."
categories: troubleshooting
slug: nested-redaction-fails
toc: true
---

## Symptoms

The [redaction control](../../describe/option-controls#redaction) fails to work with a property that uses a JSON path with more than one field name. For example `$.person.name`.

A Kafka consumer set up to consume from this option will have connection failures. The {{site.data.reuse.egw}} displays errors in the logs similar to the following example:

```bash
WARN  com.ibm.ei.gateway.eem.core.RecordDataUtils - [encodeAvro:143] The data does not match the schema: Schema with encoding: AVRO_BINARY
java.lang.ClassCastException:

...

ERROR com.ibm.ei.gateway.eem.egress.interceptors.FetchResponseRedactor (Redaction Fetch Response Interceptor) - [lambda$intercept$5:169] 
java.util.NoSuchElementException: No value present
```

## Causes

When the {{site.data.reuse.egw}} tries to encode the message after performing the redaction, it fails to generate the nested fields correctly, and fails to create the redacted message. When the redaction failure occurs, the {{site.data.reuse.egw}} sends a null message to avoid passing on any sensitive information.  

## Resolving the problem

There is currently no resolution for this problem. For more information, [contact IBM support]({{ 'support' | relative_url }}).
