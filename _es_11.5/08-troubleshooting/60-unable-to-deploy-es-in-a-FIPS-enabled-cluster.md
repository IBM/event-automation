---
title: "Kafka pods fail to start in a FIPS-enabled OpenShift cluster"
excerpt: "Kafka pods in a FIPS-enabled OpenShift cluster fails to start."
categories: troubleshooting
slug: fips-enabled-cluster-fails
toc: true
---

## Symptoms

When deploying {{site.data.reuse.es_name}} in a FIPS-enabled OpenShift cluster, Kafka pods fail, and logs show errors similar to the following example:

```shell
2024-12-16 17:11:31,768 INFO Starting the log cleaner (kafka.log.LogCleaner) [main]
An OpenSSL error occurred
error:0308010C:digital envelope routines::unsupported
error:03000086:digital envelope routines::initialization error
2024-12-16 17:11:31,960 ERROR [KafkaServer id=0] Fatal error during KafkaServer startup. Prepare to shutdown (kafka.server.KafkaServer) [main]
java.security.NoSuchAlgorithmException: Error constructing implementation (algorithm: MD5, provider: SUN, class: sun.security.provider.NativeMD5)
...
2024-12-16 17:11:32,185 ERROR Exiting Kafka due to fatal exception during startup. (kafka.Kafka$) [main]
```

## Causes

The bundled Java Virtual Machine (JVM) has a known issue where it attempts to use OpenSSL for MD5 algorithm. On a FIPS-enabled cluster, openSSL is running in FIPS mode and does not support use of MD5 algorithm, leading to this error.

## Resolving the problem

Add the following configuration to the `spec.strimziOverrides.kafka` field in the `EventStreams` custom resource in your cluster:

```yaml
jvmOptions:
    javaSystemProperties:
      - name: jdk.nativeDigest
        value: 'false'
```
