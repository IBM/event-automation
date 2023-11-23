---
title: "502 Bad Gateway error when logging in to Event Endpoint Management UI"
excerpt: "Connecting to the Event Endpoint Management UI fails with `502 Bad Gateway` because ingress fails to establish an SSL connection."
categories: troubleshooting
slug: 502-bad-gateway
toc: true
---

## Symptoms

Logging in to the {{site.data.reuse.eem_name}} UI through the exposed ingress fails with a `502 Bad Gateway` error message.

Some of the following SSL handshake connection errors are displayed in the ingress controller logs:


```shell
2023/11/09 06:42:05 [error] 3243#3243: *28844669 SSL_do_handshake() failed (SSL: error:0A00042E:SSL routines::tlsv1 alert protocol version:SSL alert number 70) while SSL handshaking to upstream, client: 10.132.134.27, server: qs-eem-ui.mycluster.containers.appdomain.cloud, request: "GET / HTTP/2.0", upstream: "https://172.10.132.123:3000/", host: "qs-eem-ui.mycluster.containers.appdomain.cloud"
{"time_date": "2023-11-09T06:42:05+00:00", "client": "10.132.134.27", "host": "qs-eem-ui.mycluster.containers.appdomain.cloud", "scheme": "https", "request_method": "GET", "request_uri": "/", "request_id": "a1b2c3", "status": 502, "upstream_addr": "172.10.132.123:3000, 172.10.132.123:3000, 172.10.132.123:3000", "upstream_status": 502, 502, 502, "request_time": 0.026, "upstream_response_time": 0.010, 0.008, 0.008, "upstream_connect_time": -, -, -, "upstream_header_time": -, -, -}
```


```java
javax.net.ssl.SSLHandshakeException: Received fatal alert: protocol_version
```

## Causes

The default deployment of {{site.data.reuse.eem_name}} only allows `TLS v1.3` connections but the incoming connection is `TLS v1.2`, which might be due to configuration of the ingress controller or the client.

## Resolving the problem

To resolve the problem, configure the {{site.data.reuse.eem_manager}} deployment to support earlier versions of the TLS protocol by setting an [environment variable](../../installing/configuring#setting-environment-variables) for `TLS_VERSIONS` on the `containers.manager` section of the {{site.data.reuse.eem_name}} custom resource. For example:

```yaml
# {{site.data.reuse.eem_name}} CRD 
  spec:  
    manager:
      template:
        pod:
          spec:
            containers:
              - name: manager
                env:
                  - name: TLS_VERSIONS
                    value: 'TLSv1.2,TLSv1.3'
```

**Note:** You can establish client connections by using earlier versions of TLS. However, this can result in a higher security risk.

