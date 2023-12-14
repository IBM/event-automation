---
title: "Configuring trace logging"
excerpt: "Find out how to configure trace logging when requested by IBM support."
categories: troubleshooting
slug: trace-logging
toc: true
---

When requested by IBM support, trace logging can be configured in {{site.data.reuse.ep_name}} to add more troubleshoot logging. This is useful for attempting to debug the system, as it captures additional details about what precisely is happening in the product code.

**Note:** Different levels of trace logging are permitted. However, the most relevant levels to use when you configure troubleshooting are `trace` or `debug`.

Configure trace logging for the {{site.data.reuse.ep_name}} or {{site.data.reuse.flink_long}} instances as follows.


## For the {{site.data.reuse.ep_name}} instance

Trace logging can be configured for an {{site.data.reuse.ep_name}} instance by editing the `EventProcessing` custom resource. This enables trace logging that can be observed from the pod logs. To enable trace logging, update your `EventProcessing` custom resource to set the `TRACE_LEVEL` and `TRACE_SPEC` environment variables:

```yaml
kind: EventProcessing
[...]
spec:
  authoring:
    template:
      pod:
        spec:
          containers:
            - env:
                - name: TRACE_LEVEL
                  value: "<VALUE>"
              name: ui
            - env:
                - name: TRACE_SPEC
                  value: "<VALUE>"
              name: backend
  [...]
```

**Note:** `<VALUE>` is provided by [IBM Support]({{ 'support' | relative_url }}).


## For the {{site.data.reuse.flink_long}} instance

It is possible to configure trace logging for an {{site.data.reuse.flink_long}} instance by editing the `FlinkDeployment` custom resource. This enables trace logging that can be observed from the Flink pod logs.

To enable trace logging, update your `FlinkDeployment` custom resource to include the logging configuration:

```yaml
kind: FlinkDeployment
[...]
spec:
  logConfiguration:
    log4j-console.properties: >
      <VALUE>
  [...]
```
**Note:** `<VALUE>` is provided by [IBM Support]({{ 'support' | relative_url }}).

See also the [FlinkDeployment Logging Configuration](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.6/docs/operations/metrics-logging/#flinkdeployment-logging-configuration){:target="_blank"} documentation.
