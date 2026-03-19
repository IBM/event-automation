---
title: "Broker pods fail to start after upgrade due to SSL private key format"
excerpt: "After upgrading to 12.2.x, Kafka broker pods enter `CrashLoopBackOff` state with SSL private key format errors."
categories: troubleshooting
slug: upgrade-ssl-private-key-format
toc: true
---

## Symptoms
{: #symptoms}

After upgrading {{site.data.reuse.es_name}} to 12.2.x, Kafka broker pods fail to start and enter a `CrashLoopBackOff` state. The broker logs show errors similar to the following:

```
Caused by: java.io.IOException: algid parse error, not a sequence
```

## Causes
{: #causes}

In {{site.data.reuse.es_name}} 12.2.x and later, Kafka brokers migrated from P12/JKS keystores to PEM-based keystores, which require SSL private keys to be in PKCS#8 format (BEGIN PRIVATE KEY). If your Kafka cluster is configured with custom listener certificates using SSL private keys in PKCS#1 format (BEGIN RSA PRIVATE KEY), the brokers cannot parse the keys and fail to start.

This only affects clusters using custom listener certificates. Clusters using operator-managed certificates are not affected.


## Resolving the problem
{: #resolving-the-problem}

Convert your SSL private keys from PKCS#1 format to PKCS#8 format:

```shell
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in <PKCS1.key> -out <PKCS8.key>
```

Where:
- `<PKCS1.key>` is the path to your existing private key file in PKCS#1 format.
- `<PKCS8.key>` is the path for the converted private key file in PKCS#8 format.

After conversion, update the Kubernetes Secret referenced in the `brokerCertChainAndKey` property of your Kafka listener configuration with the converted key. The Cluster Operator will automatically detect the change and perform a rolling restart of the broker pods.

