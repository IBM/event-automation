---
title: "Unable to register an Event Gateway to an existing gateway group"
excerpt: "A new gateway does not register to an existing group in the Event Manager"
categories: troubleshooting
slug: unable-to-register-gateway
toc: true
---

## Symptoms

You add an {{site.data.reuse.egw}} to an existing gateway group and you receive no confirmation in the UI that it is added successfully. You check [the logs](../gathering-logs) for the {{site.data.reuse.egw}} and the {{site.data.reuse.eem_manager}}, and you find repeated 401 errors with the following messages.

In the {{site.data.reuse.egw}} logs, you see:

```
Failed to register with Event Manager
```

In the {{site.data.reuse.eem_manager}} logs, you see something similar to the following example:

```
Event Gateway: gwgroup/gwid, invalid: Not capable of handling Options: option-1, option-2, option-3. Errors: Option: option-1, invalid: Gateway : gwgroup/gwid, missing capability : quota; Option: option-2, invalid: Gateway : gwgroup/gwid, ...
```

## Causes

The gateway that you want to register to the group does not support the options that are published to that group. This is due to new controls added to {{site.data.reuse.eem_name}} from versions 11.2 and later which are not supported by the gateway that you are trying to register to the group.


## Resolving the problem

Follow the instructions to [Enable {{site.data.reuse.egw}} instances from version 11.2.0 and earlier to work with 11.4.0 and later](../../installing/upgrading/#enable-earlier-egw-instances-to-register).
