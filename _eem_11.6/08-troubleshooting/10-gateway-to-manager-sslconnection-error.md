---
title: "Event Gateway fails with SSL errors"
excerpt: "When certificates are renewed, Event Gateway fails to connect to Event Endpoint Manager with `PKIX path validation failed` error."
categories: troubleshooting
slug: ssl-error
toc: true
---

## Symptoms

<!-- DRAFT COMMENT: This topic needs updating to consider users with custom manager certs. -->

The {{site.data.reuse.egw}} fails to connect to the {{site.data.reuse.eem_manager}}, and throws the following exception:

```java
WARN com.ibm.ei.gateway.eem.core.BackendClient (EEM Backend Client) - [lambda$checkData$15:293] Error updating resources from https://<eem-manager-gateway-route>/clusters : Failed to create SSL connection
javax.net.ssl.SSLHandshakeException: PKIX path validation failed: java.security.cert.CertPathValidatorException: Path does not chain with any of the trust anchors
```

## Causes

Certificates are automatically renewed by the Cert Manager if you are using it to generate TLS certificates. The {{site.data.reuse.eem_manager}} and the [operator-managed {{site.data.reuse.egw}}](../../installing/install-gateway#operator-managed-gateways) pick up the renewed CA certificate. If the {{site.data.reuse.eem_manager}} or the {{site.data.reuse.egw}} renews at a different time, the {{site.data.reuse.eem_manager}} and the {{site.data.reuse.egw}} get a different CA certificate. 

To confirm this issue, examine the `ca.crt` in the {{site.data.reuse.eem_manager}} secret `<instance_name>-ibm-eem-manager`, and compare to the secret in the {{site.data.reuse.egw}}`<instance_name>-ibm-egw-cert`.


## Resolving the problem

### [Operator-managed](../../installing/install-gateway#operator-managed-gateways) and [Kubernetes Deployment {{site.data.reuse.egw}}](../../installing/install-gateway#remote-gateways) {{site.data.reuse.egw}}s

Delete both the {{site.data.reuse.eem_manager}} and the {{site.data.reuse.egw}} secrets to allow the certificates to be renewed by the Cert Manager.

You might see the following error around 5 minutes after you deleted both the {{site.data.reuse.eem_manager}} and the {{site.data.reuse.egw}} secrets:

```java
WARN com.ibm.ei.gateway.eem.core.BackendClient (EEM Backend Client) - [lambda$checkData$15:293] Error updating resources from https://quick-start-manager-ibm-eem-gateway-eim.apps.tag.cp.fyre.ibm.com/clusters : javax.net.ssl.SSLHandshakeException: Received fatal alert: certificate_unknown
javax.net.ssl.SSLHandshakeException: Received fatal alert: certificate_unknown
```

If you see this error, delete the {{site.data.reuse.eem_manager}} pod. After the {{site.data.reuse.eem_manager}} becomes `Ready` again, the {{site.data.reuse.egw}} will reconnect to the {{site.data.reuse.eem_manager}}.

### [Docker](../../installing/install-gateway#remote-gateways) {{site.data.reuse.egw}}s

Update the contents of the certificate files supplied in your Docker `run` command. For example:   `-v "path:/certs/client.pem" -v "path:/certs/client.key"`.

If you change the certificate file names, then you must restart the {{site.data.reuse.egw}} with the updated name in the Docker `run` command.



