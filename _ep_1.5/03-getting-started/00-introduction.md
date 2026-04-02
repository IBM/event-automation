---
title: "Introduction to authoring"
excerpt: "Introduction to the Event Processing authoring UI."
categories: getting-started
slug: introduction
toc: true
---

The {{site.data.reuse.ep_name}} authoring UI is a space to explore ideas and prove hypotheses, providing a rapid feedback loop. You can [export authored flows](../../advanced/exporting-flows) for deployment into other more resilient environments.

## When to use the UI

You can use the authoring UI for the following purposes:

- Developing and testing ideas.
- Testing resiliency with longer duration tests, where you can evaluate qualities of a long-running flow such as:
  - Consumer lag: does the flow have bottlenecks that are causing the source nodes to struggle to keep up?
  - Watermark progression: are new events progressing a source watermark so that temporal operations can function?
  - Checkpoint progression: can the flow checkpoint the state (store the sequence of events) for fault tolerance while keeping up under a given load?
- Creating applications that are not mission critical. For example, applications that can be stopped and restarted, and so miss some messages or read them twice, without that being a problem.

## When to export a job from the UI

Many applications reach a point where they are better managed outside of the authoring environment. Consider exporting a job from the UI in the following situations:

- You have a development, test, staging, or production pipeline, and it is time to move to the test environment.
- Your job must keep running across a change in the version of Flink (for example, across multiple {{site.data.reuse.ep_name}} releases).
- Your job is consuming a lot of memory or disk, or requires a different [state backend](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/state/state_backends){:target="_blank"}. In general, it requires a higher quality of service than those offered in the shared authoring environment.
- Your flow must be isolated so that other flows cannot impact it negatively.

If one or more of these conditions are true, consider deploying that flow as a [customized job](../../advanced/deploying-customized).

**Note:** Other deployment methods are also available for development and testing purposes: [by using the Flink SQL client](../../advanced/deploying-dev-purposes) and [by using the Apache SQL Runner sample](../../advanced/deploying-prod). However, for production deployments that require full control and customization, deploy your flow as a [customized job](../../advanced/deploying-customized).
