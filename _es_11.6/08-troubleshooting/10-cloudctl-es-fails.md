---
title: "Event Streams CLI command produces 'FAILED' message"
excerpt: "Event Streams CLI command responds with a FAILED error."
categories: troubleshooting
slug: kubectl-es-fails
toc: true
---

## Symptoms

When running the `kubectl es` command, the following error message is displayed:

```shell
FAILED
...
```

## Causes

This error occurs when you have not logged in to the cluster and initialized the command-line tool.

## Resolving the problem

{{site.data.reuse.es_cli_init_111}}

Re-run the failed operation again.
