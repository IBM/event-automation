---
title: "Event Manager fails to start when configured with API Connect JWKS endpoint"
excerpt: "Event Manager pod fails to start, with state 'CrashLoopBackoff', when configured with IBM API Connect JSON Web Key Set (JWKS) endpoint."
categories: troubleshooting
slug: crashloop-with-apic-jwks-timeout
toc: true
---


## Symptoms

When {{site.data.reuse.eem_name}} is integrated with {{site.data.reuse.apic_long}} and the {{site.data.reuse.apic_short}} JSON Web Key Set (JWKS) endpoint is [set](../../integrating-with-apic/configure-eem-for-apic/) in the `EventEndpointManagement` custom resource, the {{site.data.reuse.eem_manager}} pod might fail to start, showing a `CrashLoopBackoff` state. Pod logs might contain error messages similar to the following:

```shell
io.vertx.core.impl.NoStackTraceTimeoutException: The timeout of 6000 ms has been exceeded when getting a connection to <apic_jwks_url>:443
```

**Note:** The timeout value `6000` is indicative and might be different depending on your configuration.

## Causes

When the {{site.data.reuse.eem_manager}} pod is configured with an {{site.data.reuse.apic_short}} JWKS endpoint, the pod attempts to access this URL when it starts. However, this connection can fail with a timeout, resulting in the error. This error prevents the {{site.data.reuse.apic_short}} integration from initializing, and the pod from starting. Since the pod cannot start within the scheduled time limit, it fails and restarts, but fails again. This eventually results in the pod to go into a `CrashLoopBackoff` state.


## Resolving the problem

To resolve the problem, increase the timeout limit for connecting to the {{site.data.reuse.apic_short}} JWKS endpoint by setting the `EI_AUTH_WEB_CLIENT_TIMEOUT` environment variable in the `EventEndpointManagement` custom resource:

```YAML
spec:
    manager:
        template:
            pod:
                spec:
                    containers:
                      - name: manager
                        env:
                          - name: EI_AUTH_WEB_CLIENT_TIMEOUT
                            value: '30000'
                        
```

The value must be set in `milliseconds`. In the earlier example, the value is set to 30000 milliseconds (30 seconds).