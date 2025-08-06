---
title: "Configuring trace logging"
excerpt: "Find out how to configure trace logging when requested by IBM support."
categories: troubleshooting
slug: trace-logging
toc: true
---

When requested by IBM support, trace logging can be configured in {{site.data.reuse.ep_name}} to add more troubleshoot logging. This is useful for attempting to debug the system, as it captures additional details about what precisely is happening in the product code.

**Note:** Different levels of trace logging are permitted. However, the most relevant levels to use when you configure troubleshooting are `trace` or `debug`.

Configure trace logging for the {{site.data.reuse.ep_name}} or {{site.data.reuse.ibm_flink_operator}} instances as follows.


## For the {{site.data.reuse.ep_name}} instance
{: #for-the-event-processing-instance}

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


## For the {{site.data.reuse.ibm_flink_operator}} instance
{: #for-the-ibm-operator-for-apache-flink-instance}

You can configure trace logging without recreating the `JobManager` or `TaskManager` pods for an {{site.data.reuse.ibm_flink_operator}} instance, which consists of editing the ConfigMap associated with the `FlinkDeployment` custom resource. New Flink deployments introduce a `monitorInterval` log property, which defaults to 30 seconds. This property enables dynamic updates to the log4j configuration.

To enable dynamic trace logging, edit the ConfigMap associated with the `FlinkDeployment` custom resource as follows:

1. Locate the ConfigMap associated with your `FlinkDeployment`. It is typically named in the format: `flink-config-<FlinkDeployment-name>`.
2. Edit the ConfigMap, specifically the section related to `log4j-console.properties`.
3. Within `log4j-console.properties`, change the value of the `rootLogger.level` property to `<VALUE>`.
4. Save the changes to the ConfigMap.

After completing this update, the new configuration will be automatically reflected in the Flink deployment and future changes will be reflected within approximately 30 seconds without restarting the `taskManager` or the `JobManager` pods.


See also the [FlinkDeployment Logging Configuration](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.11/docs/operations/metrics-logging/#flinkdeployment-logging-configuration){:target="_blank"} documentation.