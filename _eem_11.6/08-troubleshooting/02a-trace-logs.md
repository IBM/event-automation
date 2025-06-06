---
title: "Configuration for trace logging"
excerpt: "How to configure trace logging"
categories: troubleshooting
slug: trace-logging
toc: true
---

When requested by IBM support, trace logging can be configured in {{site.data.reuse.eem_name}} to add more troubleshoot logging. This is useful for attempting to debug the system, as it captures additional details about what precisely is happening in the {{site.data.reuse.eem_name}} code.

## How to configure trace logging

You can configure trace logging for the [{{site.data.reuse.eem_manager}} instance](#for-the-event-endpoint-management-instance), [{{site.data.reuse.egw}} instance](#for-the-event-gateway-instance) or [in the {{site.data.reuse.eem_name}} UI](#in-the-event-endpoint-management-ui).

Different levels of trace logging are permitted, however the most relevant ones to use when you configure troubleshooting are `trace` or `debug`.

### For the Event Endpoint Management instance

Trace logging can be configured for an {{site.data.reuse.eem_manager}} instance by editing the `EventEndpointManagement` custom resource. This enables trace logging that can be observed from the pod logs.

#### By using the custom resource traceSpec setting

You can dynamically change the trace setting and the pod will stay running.

To enable trace logging by using the custom resource setting, update the `spec.manager` field in your `EventEndpointManagement` custom resource as follows:

```yaml
# excerpt from {{site.data.reuse.eem_name}} CRD
spec:
  manager:
    traceSpec: "<VALUE>"
```

**Note:** `<VALUE>` is provided by [IBM Support]({{ 'support' | relative_url }}).

#### By using the TRACE_SPEC environment variable

**Note:** Enabling trace logging through the environment variable will cause a restart of the pod.

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

**Note:** `<VALUE>` is provided by [IBM Support]({{ 'support' | relative_url }}).

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

**Note:** `<VALUE>` is provided by [IBM Support]({{ 'support' | relative_url }}).

### For the {{site.data.reuse.egw}} instance

Trace logging can be configured for an {{site.data.reuse.egw}} instance by editing the `EventGateway` custom resource. This enables trace logging that can be observed from the pod logs.

#### By using the custom resource traceSpec setting

You can dynamically change the trace setting and the pod will stay running.

To enable trace logging through the custom resource setting, update the `spec` field in your `EventGateway` custom resource as follows:

```yaml
# excerpt from {{site.data.reuse.egw}} CRD
spec:
  traceSpec: "<VALUE>"
```

**Note:** `<VALUE>` is provided by [IBM Support]({{ 'support' | relative_url }}).

#### By using the TRACE_SPEC environment variable

**Note:** Enabling trace logging through the environment variable will cause a restart of the pod.

In versions earlier than 11.5.1, To enable trace logging on an {{site.data.reuse.egw}} instance, set the environment variable `TRACE_SPEC`. For example, on an [operator-managed {{site.data.reuse.egw}}](../../installing/install-gateway#operator-managed-gateways) edit the `EventGateway` custom resource and set TRACE_SPEC as follows:

```yaml
# excerpt from {{site.data.reuse.egw}} CRD
spec:
  template:
    pod:
      spec:
        containers:
          - env:
            - name: TRACE_SPEC
              value: "<VALUE>"
            name: egw
```

On a Docker gateway, set `TRACE_SPEC` as an argument in the Docker `run` command, for example: `docker run -e TRACE_SPEC=<VALUE>`

**Note:** `<VALUE>` is provided by [IBM Support]({{ 'support' | relative_url }}).

### In the Event Endpoint Management UI

It is possible to configure trace logging specifically for actions completed in the {{site.data.reuse.eem_name}} UI. This can be done by adding a query parameter to the browser URL.

IBM support might ask you to add trace logging for the UI, by updating the URL of your {{site.data.reuse.eem_name}} UI:

```shell
https://some.eem.instance.com/catalog?logging=<VALUE>
```

**Note:** `<VALUE>` is provided by IBM support. When you navigate around the UI, it might look as though your logging configuration is gone. You do not need to be concerned, as the trace logging is enabled until you either close the UI webpage or press the refresh button.