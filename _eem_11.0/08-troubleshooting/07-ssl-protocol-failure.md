---
title: "Kafka application fails with SSLHandshakeException"
excerpt: "Applications cannot connect to the Event Gateway, fails to establish an SSL connection."
categories: troubleshooting
slug: ssl-protocol-failure
toc: true
---

## Symptoms

When a Java application attempts to connect to the {{site.data.reuse.egw}}, it fails to establish an SSL connection, and throws the following exception:

```java
javax.net.ssl.SSLHandshakeException: Received fatal alert: protocol_version
```

## Causes

The {{site.data.reuse.egw}} default deployment is to only allow `TLS v1.3` application connections. The version of Java being used to run the application does not support this level of the TLS protocol.

## Resolving the problem

To resolve the problem, configure the {{site.data.reuse.egw}} deployment to support older versions of the TLS protocol by setting an [environment variable](../../installing/configuring#setting-environment-variables) for `TLS_VERSIONS`. For example:

```yaml
# {{site.data.reuse.egw}} CRD 
    env:
    - name: TLS_VERSIONS
      value: 'TLSv1.2,TLSv1.3'
```
