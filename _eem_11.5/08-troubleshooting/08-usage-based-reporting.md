---
title: "Configuring usage-based reporting"
excerpt: "Configuring usage-based reporting"
categories: troubleshooting
slug: usage-based-reporting
toc: true
---

When requested by IBM support, usage-based reporting can be configured in {{site.data.reuse.eem_name}}.

Usage-based deployments support the following configuration overrides of the default values.

## `submitInterval`

`submitInterval` is the interval in seconds for reporting usage metrics to the License Service. The following YAML is an example of configuring `submitInterval`:

  ```yaml
  apiVersion: events.ibm.com/v1beta1
  kind: EventEndpointManagement
  # ...
  spec:
    license:
      # ...
    manager:
      # ...
      extensionServices:
        - name: licensing-service
          additionalProperties:
            submitInterval: '<interval-in-seconds>'
  ```

  Where `<interval-in-seconds>` is the interval in seconds for reporting usage metrics to the License Service.