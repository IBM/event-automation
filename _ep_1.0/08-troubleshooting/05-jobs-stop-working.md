---
title: "Running flows stop working"
excerpt: "Event Processing flows that consume from TLS-secured endpoints stop working."
categories: troubleshooting
slug: flows-stop-working
toc: true
---

## Symptom

{{site.data.reuse.ep_name}} flows that consume from TLS-secured endpoints stop working with the following error:

```
org.apache.kafka.common.errors.SslAuthenticationException: SSL handshake failed
Caused by: javax.net.ssl.SSLHandshakeException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
```

## Causes

The certificates that are on the endpoint might change compared to the certificates stored in {{site.data.reuse.ep_name}}, which causes issues when running the flow.

## Resolving the problem

Use the Event Source wizard to replace the certificate stored in {{site.data.reuse.ep_name}} and restart the flow as follows:

1. Click your flow in the {{site.data.reuse.ep_name}} UI.
2. Stop the flow.
2. Hover over the source node and click ![Edit icon]({{ 'images' | relative_url }}/rename.svg "The edit icon."){:height="30px" width="15px"} **Edit**. The **Configure event source** window is displayed.
5. Accept the new certificates and complete the wizard steps.
6. Restart your {{site.data.reuse.ep_name}} flow. In the navigation banner, expand **Run** and select either **Events from now** or **Include historical** to run your flow.
