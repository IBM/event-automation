---
title: "Java application fails with SSLHandshakeException"
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

To resolve the problem, configure the gateway instance to support earlier versions of the TLS protocol.

### Kubernetes Deployment gateways
{: #k8s-gateways}

In the Kubernetes Deployment gateways, set `tls.versions` in the ConfigMap:

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
    tls.versions="TLSv1.2,TLSv1.3"
```

### Operator-managed gateways
{: #opman-gateways}

In operator-manager {{site.data.reuse.egw}}s, set the `TLS_VERSIONS` environment variable in the custom resource.

```yaml
    env:
    - name: TLS_VERSIONS
      value: 'TLSv1.2,TLSv1.3'
```

### Docker gateways
{: #docker-gateways}

In Docker {{site.data.reuse.egw}}s, set the `TLS_VERSIONS` argument in the Docker `run` command: `docker run -e TLS_VERSIONS="TLSv1.2,TLSv1.3"`

