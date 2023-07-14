---
title: "Invalid exported AsyncAPI for API Connect"
excerpt: "Invalid schema payload in exported AsyncAPI for API Connect"
categories: troubleshooting
slug: invalid-async-api
toc: true
---

## Symptoms

If you create a topic in {{site.data.reuse.eem_name}} and edit the topic without adding a schema, and then click **Export AsyncAPI for IBM API Connect** button. The exported AsyncAPI is invalid for usage in IBM API Connect. The value for  `channels.<topic_name>.subscribe.message.payload` is an empty string:

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

If you use the invalid AsyncAPI document in API Connect, the following error will occur in the API Connect Developer Portal:

```shell
Error: Cannot read properties of null (reading 'type')
```

## Causes

The {{site.data.reuse.eem_name}} stores an empty string for any unpopulated fields, following an edit of a topic. This means that if you do not add a schema when you edit your topic, {{site.data.reuse.eem_name}} is storing an empty string for your topic schema. When you use that information to generate the AsyncAPI document, an invalid document is generated.

## Resolving the problem

This can be resolved in one of two ways:

- Upload a valid schema for your topic by [editing your topic](../../describe/managing-topics#editing-a-topic). If a schema is present when you try to export the AsyncAPI, {{site.data.reuse.eem_name}} generates a document with the correct payload.

- If you do not want to add a schema for your topic and you want to export the topic to be used in API Connect, you can amend the downloaded document to make it valid for an API Connect import. You can do this by editing the downloaded AsyncAPI and amending the `channels.<topic_name>.subscribe.message.payload` field to be equal to `{}` and removing the `channels.<topic_name>.subscribe.schemaFormat` field. Once edited, the AsyncAPI document is valid and can be imported into API Connect.
