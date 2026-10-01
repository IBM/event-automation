---
title: "Events are silently dropped in flows that contain a watsonx.ai node"
excerpt: "Some events are not enriched and are lost when the watsonx.ai service returns HTTP 429 Too Many Requests."
categories: troubleshooting
slug: watsonx-events-lost-rate-limiting
toc: true
---

## Symptom
{: #symptom}

When running a flow that contains a [watsonx.ai](../../nodes/enrichmentnode/#watsonx-node) node, some events are not enriched and do not appear in the output. The flow continues to run and no errors are reported.

The Flink Task Manager logs display the following warning:

```
WARN  com.getindata.connectors.http.internal.table.lookup.JavaNetHttpPollingClient [] - Returned Http status code was invalid or returned body was empty. Status Code [429]
```

## Causes
{: #causes}

This issue affects flows that were created before {{site.data.reuse.ep_name}} 1.5.5, or flows that have been [reverted to the earlier implementation](../reverting-to-earlier-node-implementations/).

In the earlier implementation, the watsonx.ai node issued HTTP calls to watsonx.ai concurrently (`asyncPolling: true`). When multiple events arrive at the node at the same time, the number of concurrent requests can exceed the rate limit of the watsonx.ai service, which returns an HTTP 429 (Too Many Requests) status code. Because the earlier implementation used `'http.source.lookup.continue-on-error' = 'true'`, the error is suppressed, the affected events are not enriched, and they are silently dropped from the output.

For more information about the `asyncPolling` and `http.source.lookup.continue-on-error` options, see the [Flink HTTP connector documentation](https://nightlies.apache.org/flink/flink-docs-master/docs/connectors/table/http/#lookup-source-connector-options){:target="_blank"}.

## Resolving the problem
{: #resolving-the-problem}

In {{site.data.reuse.ep_name}} 1.5.5 and later, the watsonx.ai node uses an updated implementation where HTTP calls to watsonx.ai are issued sequentially (`'asyncPolling' = 'false'`). This prevents concurrent requests from triggering rate limiting, so no events are lost.

To use the new implementation, open and save the flow in the {{site.data.reuse.ep_name}} UI. The flow is automatically updated to use the new implementation.

**Note:** 
- Sequential HTTP calls might affect the throughput of your flow. If the watsonx.ai response time is a concern for your use case, monitor flow performance after updating. 
- If you are using a version earlier than 1.5.5, or if you [revert nodes to the earlier implementation](../reverting-to-earlier-node-implementations/), ensure that the volume of concurrent events does not exceed the rate limit of your watsonx.ai deployment.
