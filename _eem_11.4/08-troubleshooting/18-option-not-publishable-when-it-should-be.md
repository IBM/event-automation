---
title: "Unable to publish an option due to incompatible controls"
excerpt: "The option to publish a control is unavailable due to an incompatible Event Gateway group, despite the fact that the gateway should be compatible with the control."
categories: troubleshooting
slug: unexpected-option-not-publishable
toc: true
---


## Symptoms

When you attempt to publish an option with controls, the option is not published. A notification is displayed stating that no acceptable gateways are available, even though all gateways in the group are at a compatible version for the control.

The {{site.data.reuse.eem_manager}} logs contain entries similar to the following example:

```
Contact from Event Gateway: <group>/<id>, received via legacy registration, consider upgrading the Event Gateway
```

## Causes

### 1. Old registration method with SAN URI

In {{site.data.reuse.eem_name}} 11.2.1, a [new registration process for gateways](../../eem_11.2/installing/standalone-gateways/#prerequisites) was introduced which eliminated the need to specify the subject alternative name (SAN) URI in the gateway certificates. For details about the old configuration, see [Event Gateway client certificate in the 11.1 documentation](../../eem_11.1/installing/standalone-gateways/#event-gateway-client-certificate). Gateways that have this URI in their certificates still use the old registration even if they are on newer versions. The old registration did not pass their version information to the {{site.data.reuse.eem_manager}}, and the {{site.data.reuse.eem_manager}} cannot determine whether it is allowed to publish certain controls to that gateway so it prevents publishing.

### 2. Race condition in gateway registration

A potential race condition might arise during the simultaneous updating and registration process of the {{site.data.reuse.eem_manager}} and gateways. In this scenario, an updated gateway might still be perceived as an older version by the {{site.data.reuse.eem_manager}} because it registered after the {{site.data.reuse.eem_manager}} update but before the gateway itself updated. To differentiate this cause from cause 1, there are no error logs in the {{site.data.reuse.eem_manager}} stating that "Contact was received via legacy registration".


## Resolving the problem

### Cause 1

To resolve the problem, update the certificates to remove the URI.

- If you are using an older version of the {{site.data.reuse.eem_name}} operator to run a gateway from a different cluster or namespace, ensure that the operator is upgraded.
- If you are using a stand-alone gateway or you supplied custom certificates to the {{site.data.reuse.egw}}, check whether those certificates contain the URI and if they do, regenerate the certificates without it.

### Cause 2

Restart the {{site.data.reuse.eem_manager}} pod.