---
title: "Invalid exported AsyncAPI for API Connect"
excerpt: "Invalid schema payload in exported AsyncAPI for API Connect"
categories: troubleshooting
slug: invalid-async-api
toc: true
---

## Symptoms

If you create an event source in {{site.data.reuse.eem_name}} and edit the event source without adding a schema, and then click **Export AsyncAPI for IBM API Connect**, the exported AsyncAPI is invalid for usage in {{site.data.reuse.apic_long}}. The value for `channels.<topic_name>.subscribe.message.payload` is an empty string:

```yaml
# excerpt from exported AsyncApi
channels:
  topic_name:
    bindings:
      kafka:
        partitions: 1
        replicas: 3
    subscribe:
      message:
        payload: 
        schemaFormat: application/vnd.apache.avro;version=1.9.0
---
```

If you use the invalid AsyncAPI document in {{site.data.reuse.apic_short}}, the following error will occur in the {{site.data.reuse.apic_short}} Developer Portal:

```shell
Error: Cannot read properties of null (reading 'type')
```

## Causes

The {{site.data.reuse.eem_name}} stores an empty string for any unpopulated fields, following an edit of an event source. This means that if you do not add a schema when you edit your event source, {{site.data.reuse.eem_name}} is storing an empty string for your event source schema. When you use that information to generate the AsyncAPI document, an invalid document is generated.

## Resolving the problem

This can be resolved in one of two ways:

- Upload a valid schema for your event source by [editing your event source](../../describe/managing-event-sources#edit-event-source). If a schema is present when you try to export the AsyncAPI, {{site.data.reuse.eem_name}} generates a document with the correct payload.

- If you do not want to add a schema for your event source and you want to export the event source to be used in {{site.data.reuse.apic_short}}, you can amend the downloaded document to make it valid for an {{site.data.reuse.apic_short}} import. You can do this by editing the downloaded AsyncAPI and amending the `channels.<topic_name>.subscribe.message.payload` field to be equal to `{}` and removing the `channels.<topic_name>.subscribe.schemaFormat` field. After you make these edits, the AsyncAPI document is valid and can be imported into {{site.data.reuse.apic_short}}.
