---
title: "Filters are not applied after enriching events with database nodes"
excerpt: "Filter nodes that use database properties immediately after a database node fail to fail to filter properties and affect the results of the running flow."
categories: troubleshooting
slug: enrichment-filter
toc: true
---

## Symptoms

[Filter nodes](../../nodes/processornodes/#filter) that are added to a flow immediately after a [database node](../../nodes/enrichmentnode) fail to filter properties and affect the results of the running flow.

This occurs when you filter a property that came from the database node.

For example, the results are incorrect for the following filter expression, where the `database_field` is an output property that came from the database node:

```sql
`database_field` > 100
```

In this case, the results from the flow incorrectly include events where `database_field` is less than 100.


## Causes

The Flink table optimizer that is used by {{site.data.reuse.ep_name}} incorrectly removes the filter expression.


## Resolving the problem

You can resolve the problem by completing any one of the following methods.

### Add a cast to filter expression

You can cast the database output property that is used in the filter expression to avoid the problem. The cast prevents the table optimizer from removing the filter expression.

For example, add `CAST` to your filter expression:

```sql
CAST(`database_field` AS DOUBLE) > 100
```

An appropriate `CAST` depends on the type of your database property. Use a cast that does not modify the output value.


### Disable the behavior of the table optimizer

Alternatively, if you are [exporting your flow](../../advanced/exporting-flows) to run as SQL, you can disable the behavior of the [table optimizer](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/dev/table/config/#table-optimizer-source-predicate-pushdown-enabled){:target="_blank"} (`predicate-pushdown-enabled`) that causes the filter expression to be removed.

You can disable the behavior by adding the following statement to your exported SQL file:

```sql
SET table.optimizer.source.predicate-pushdown-enabled=false;
```

