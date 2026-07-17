---
title: "Cannot create topics in the UI with only topic-level ACLs"
excerpt: "Users with only topic-level ACLs cannot create topics in the UI because broker count validation requires cluster-level permissions."
categories: troubleshooting
slug: topic-create-acl-validation
toc: true
---

## Symptoms
{: #symptoms}

In the {{site.data.reuse.es_name}} UI, if you have only topic-level ACLs, such as `topic.read` and `topic.create`, you cannot create topics, and the **Create** button in the **Create topic** window is disabled.

## Causes
{: #causes}

When creating a topic, the UI validates that the replication factor and minimum in-sync replicas values are less than the broker count.

To retrieve the broker count for this validation, the following cluster ACLs are required:

- `cluster.describe`
- `cluster.describeConfigs`

If you do not have these cluster-level permissions, the UI cannot complete the validation, and topic creation is blocked.

## Resolving the problem
{: #resolving-the-problem}

Use one of the following workarounds to avoid this problem:

### Grant cluster permissions

Ensure that you have the following cluster ACLs:

- `cluster.describe`
- `cluster.describeConfigs`

For more information about managing access and ACLs, see [managing access](../../security/managing-access/).

### Create topics by using the CLI

If cluster permissions cannot be granted, create topics by using the {{site.data.reuse.es_name}} CLI instead of the UI.

For example:

```shell
kubectl es topic-create --name my-topic --partitions 1 --replication-factor 1 --config retention.ms=86400000
```

For more information, see [creating topics by using the CLI](../../getting-started/creating-topics/#by-using-the-cli).