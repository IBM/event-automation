---
title: "Kafka application fails with SSLHandshakeException"
excerpt: "Applications cannot connect to the Event Gateway, fails to establish an SSL connection."
categories: troubleshooting
slug: ssl-protocol-failure
toc: true
---

## Symptoms
{: #symptoms}

When a Java application attempts to connect to the {{site.data.reuse.egw}}, it fails to establish an SSL connection, and throws the following exception:

```java
javax.net.ssl.SSLHandshakeException: Received fatal alert: protocol_version
```

## Causes
{: #causes}

The {{site.data.reuse.egw}} default deployment is to allow only `TLS v1.3` application connections. The version of Java being used to run the application does not support this level of the TLS protocol.

## Resolving the problem
{: #resolving-the-problem}

To resolve the problem, configure the gateway instance to support older versions of the TLS protocol by setting an [environment variable](../../installing/configuring#setting-environment-variables) for `TLS_VERSIONS`. 

For example, in the [operator-managed {{site.data.reuse.egw}}](../../installing/install-gateway#operator-managed-gateways):

```yaml
# {{site.data.reuse.egw}} CRD 
    env:
    - name: TLS_VERSIONS
      value: 'TLSv1.2,TLSv1.3'
```

For a [Docker {{site.data.reuse.egw}}](../../installing/install-gateway#remote-gateways), set the `TLS_VERSIONS` argument in the Docker `run` command: `docker run -e TLS_VERSIONS="TLSv1.2,TLSv1.3"`

