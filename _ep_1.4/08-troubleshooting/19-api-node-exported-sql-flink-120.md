---
title: "Customized SQL queries with a `TIMESTAMP_LTZ` join condition fail to produce expected results"
excerpt: "Customized SQL queries with a `TIMESTAMP_LTZ` join condition fail to produce expected results after upgrading to Event Processing 1.4.x."
categories: troubleshooting
slug: api-node-exported-sql-flink-120
toc: true
---

## Symptoms
{: #symptoms}

After upgrading from {{site.data.reuse.ep_name}} 1.3.x to any 1.4.x version, customized SQL queries containing an API enrichment node `JOIN` condition on a root property of type `TIMESTAMP_LTZ` no longer produce the expected results.

This issue affects only customized SQL queries with a join condition involving a root property of type `TIMESTAMP_LTZ`, which were exported and deployed before upgrading to {{site.data.reuse.ep_name}} 1.4.x.

This issue arises when the SQL query includes a statement such as the following, where `timestamp_ltz_param`
is of type `TIMESTAMP_LTZ`.

```sql
CREATE TEMPORARY VIEW `<view_name>` AS
SELECT [...]
FROM `source_view`
JOIN `lookup_table` FOR SYSTEM_TIME AS OF `source_view`.`proc_time`
ON  [...]
AND `lookup_table`.`request_param` = `source_view`.`timestamp_ltz_param`;
```

**Note:** If the SQL query does not include this join condition and the API node fails to produce expected events, refer to [Enrichment from API produces no output events](../no-output-event-from-api-node/).

## Causes
{: #causes}

After upgrading to {{site.data.reuse.ep_name}} 1.4.x, the lookup join condition involving a root property of type `TIMESTAMP_LTZ` fails to make accurate comparisons due to a discrepancy in timestamp precision. This results in the SQL statement not returning the expected results.

## Resolving the problem
{: #resolving-the-problem}

To resolve the problem, add an explicit `CAST` as `TIMESTAMP_LTZ(6)` to the join condition. For example:

```sql
CREATE TEMPORARY VIEW `<view_name>` AS
SELECT [...]
FROM `source_view`
JOIN `lookup_table` FOR SYSTEM_TIME AS OF `source_view`.`proc_time`
ON  [...]
AND `lookup_table`.`request_param` = CAST(`source_view`.`timestamp_ltz_param` AS TIMESTAMP_LTZ(6));
```
