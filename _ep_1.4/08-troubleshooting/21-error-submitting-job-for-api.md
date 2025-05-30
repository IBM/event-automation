---
title: "Job failure when deploying customized flows that contain API or watsonx.ai enrichment nodes"
excerpt: "Find out how to resolve the Flink job failure when deploying a job from a flow that contains an API or watsonx.ai node."
categories: troubleshooting
slug: error-submitting-job-for-enrichment
toc: true
---

## Symptoms

When a Flink deployment is created to [deploy a job](../../advanced/deploying-customized/), the job manager pod fails with the following error in the log:

```markdown
ERROR com.ibm.ei.streamproc.model.jobgraph.apinode.connector.ResponseJsonRowDataDeserializationSchema [] - Failed to convert response literal value xxx
```

## Causes

The error might occur because of one of the following reasons:

- Your flow contains a [watsonx.ai](../../nodes/enrichmentnode/#watsonx-node) node, and you mapped a prompt variable with a constant value.
- Your flow contains an [API](../../nodes/enrichmentnode/#enrichment-from-an-api) node, and you mapped an input parameter with a constant value.

## Resolving the problem

To resolve the problem, complete any one of the following steps:

- Use a [transform](../../nodes/processornodes/#transform) node prior to the watsonx.ai or the API node to create new event properties with constant values. In the watsonx.ai or API node, map these new properties to the prompt variables or input parameters.
- Export the flow as SQL and deploy by using the [Apache SQL runner sample](../../advanced/deploying-production/).

