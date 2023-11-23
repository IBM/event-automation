---
title: "Configuration for trace logging"
excerpt: "How to configure trace logging"
categories: troubleshooting
slug: trace-logging
toc: true
---

When requested by IBM support, trace logging can be configured in {{site.data.reuse.eem_name}} to add more troubleshoot logging. This is useful for attempting to debug the system, as it captures additional details about what precisely is happening in the {{site.data.reuse.eem_name}} code.

## How to configure trace logging

You can configure trace logging for the [{{site.data.reuse.eem_name}} instance](#for-the-event-endpoint-management-instance), [{{site.data.reuse.egw}} instance](#for-the-event-gateway-instance) or [in the {{site.data.reuse.eem_name}} UI](#in-the-event-endpoint-management-ui).

Different levels of trace logging are permitted, however the most relevant ones to use when you configure troubleshooting are `trace` or `debug`.

### For the Event Endpoint Management instance

Trace logging can be configured for an {{site.data.reuse.eem_name}} instance by editing the `EventEndpointManagement` custom resource. This enables trace logging that can be observed from the pod logs. To enable trace logging, update `env` in your `EventEndpointManagement` custom resource as follows:

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

To add trace logging when you are deploying with an overridden image, update `env` in your `EventEndpointManagement` custom resource as follows:

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

### For the Event Gateway instance

It is possible to configure trace logging for an {{site.data.reuse.egw}} instance by editing the `EventGateway` custom resource. This enables trace logging that can be observed from the pod logs. To enable trace logging, update `env` in your `EventGateway` custom resource as follows:

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

**Note:** `<VALUE>` is provided by [IBM Support]({{ 'support' | relative_url }}).

### In the Event Endpoint Management UI

Additionally, it is possible to configure trace logging specifically for actions completed in the {{site.data.reuse.eem_name}} UI. This can be done by adding a query parameter to the browser URL.

IBM support might ask you to add trace logging for the UI, by updating the URL of your {{site.data.reuse.eem_name}} UI:

```shell
https://some.eem.instance.com/catalog?logging=<VALUE>
```

**Note:** `<VALUE>` will be provided by IBM support. When navigating around the UI, it might look as though your logging configuration has disappeared. You do not need to worry, as the trace logging is enabled until you either close the UI webpage or press the refresh button.