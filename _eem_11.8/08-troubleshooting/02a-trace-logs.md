---
title: "Configuration for trace logging"
excerpt: "How to configure trace logging"
categories: troubleshooting
slug: trace-logging
toc: true
---

When requested by IBM support, trace logging can be configured in {{site.data.reuse.eem_name}}. Trace logs are useful for debugging the system, as they capture more details about what is happening in {{site.data.reuse.eem_name}}.

{: #how-to-configure-trace-logging}

You can configure trace logging for the [{{site.data.reuse.eem_manager}} instance](#for-the-event-endpoint-management-instance), [{{site.data.reuse.egw}} instance](#for-the-event-gateway-instance) or [in the {{site.data.reuse.eem_name}} UI](#in-the-event-endpoint-management-ui).

Various trace levels are available, but the most common levels that are used for troubleshooting are `trace` or `debug`. The value to set for trace logging is provided by [IBM Support]({{ 'support' | relative_url }}).

## Configuring trace logging on the {{site.data.reuse.eem_manager}} pods
{: #for-the-event-endpoint-management-instance}

Trace logging can be configured for an {{site.data.reuse.eem_manager}} instance by editing the `EventEndpointManagement` custom resource.

### Configuring trace logging by using the custom resource `traceSpec` setting
{: #mgr-by-using-the-custom-resource-tracespec-setting}

A pod restart is not required when you change the trace setting in the custom resource.

To enable trace logging by using the custom resource setting, update the `spec.manager` field in your `EventEndpointManagement` custom resource as follows:

```yaml
# excerpt from {{site.data.reuse.eem_name}} CRD
spec:
  manager:
    traceSpec: "<VALUE>"
```


### Configuring trace logging by using the TRACE_SPEC environment variable
{: #mgr-by-using-the-trace_spec-environment-variable}

**Note:** Enabling trace logging through the environment variable causes a restart of the pod.

In versions earlier than 11.5.1, to enable trace logging through the environment variable, update `env` in your `EventEndpointManagement` custom resource as follows:

```yaml
# excerpt from {{site.data.reuse.eem_name}} CRD
spec:
  manager:
    template:
      pod:
        spec:
          containers:
            - name: manager
              env:
                - name: TRACE_SPEC
                  value: "<VALUE>"
```

To enable trace logging when you are deploying with an overridden image, update the `env` field in your `EventEndpointManagement` custom resource as follows:

```yaml
# excerpt from {{site.data.reuse.eem_name}} CRD
template:
  pod:
    spec:
      containers:
        - env:
            - name: TRACE_SPEC
              value: "<VALUE>"
          image: >-
            <image-address>
          name: manager
```

## Configuring trace logging on the {{site.data.reuse.egw}} pod
{: #for-the-event-gateway-instance}

### Operator-managed gateways
{: #opman-gateways}

To enable trace logging on an operator-managed gateway, update the `spec` field in your `EventGateway` custom resource as follows:

```yaml
spec:
  traceSpec: "<VALUE>"
```

### Kubernetes Deployment gateways
{: #k8s-gateways}

Trace logging can be configured for a Kubernetes Deployment {{site.data.reuse.egw}} instance by adding `trace.spec=<package>:<trace level>` to your gateway ConfigMap. 

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: "<gateway group>-<gateway id>-config"
  labels:
    app: "testexample"
    gatewayGroup: "<gateway group>"
    gatewayId: "<gateway id>"
data:
  gateway.properties: |
    trace.spec=<value>
```

For more information about updating the gateway ConfigMap, refer to the [gateway properties reference](../../reference/gateway-properties).

A pod restart is not required when you update `trace.spec` in the ConfigMap.

### Docker gateways
{: #docker-gateway}

On a Docker gateway, restart the gateway with a `docker run` command that includes the `TRACE_SPEC` argument. For example, `docker run ... -e TRACE_SPEC=<VALUE>`



## In the Event Endpoint Management UI
{: #in-the-event-endpoint-management-ui}

It is possible to configure trace specifically for actions completed in the {{site.data.reuse.eem_name}} UI. UI trace is configured by adding a query parameter to the browser URL.

IBM support might ask you to add trace logging for the UI, by updating the URL of your {{site.data.reuse.eem_name}} UI:

```shell
https://some.eem.instance.com/catalog?logging=<VALUE>
```

When you navigate around the UI, it might seem that your logging configuration is not available. However, trace logging is enabled until you either close the UI browser page or click refresh.