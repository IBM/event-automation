---
title: "Client fails to connect with a NullPointerException error"
excerpt: "A client application fails to connect with a NullPointerException error."
categories: troubleshooting
slug: key-null
toc: true
---

## Symptoms
You are trying to [configure a client application to connect to an event endpoint](../../subscribe/configure-your-application-to-connect/#example-kcat-test). The client fails to connect and the logs include an unhandled exception similar to the following example:


```
ERROR NULL io.vertx.core.impl.ContextImpl - [:] Unhandled exception
java.lang.NullPointerException: Cannot invoke "java.lang.String.getBytes(java.nio.charset.Charset)" because "this.key" is null
```

The exception message appears every few minutes in the {{site.data.reuse.egw}} logs and does not disappear even after a restart of the gateway.

## Causes
The client identity is misconfigured. Multiple clients connect by using the same subscription and group ID, but use different client IDs, or do not set a client ID at all.


## Resolving the problem
Set both client ID and group ID, and ensure every client that shares the subscription uses the same pair of values. For example,

```
myClientApplication1: <GROUP_ID>=BOB, <CLIENT_ID>=ABC
myClientApplication2: <GROUP_ID>=BOB, <CLIENT_ID>=ABC
```

Restart the clients after you update the configuration.