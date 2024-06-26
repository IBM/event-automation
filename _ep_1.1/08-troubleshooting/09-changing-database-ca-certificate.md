---
title: "Error when you connect to a database after modifying a CA certificate"
excerpt: "Event Processing fails with error when you connect to PostgreSQL database server after rotating the CA certificate."
categories: troubleshooting
slug: changing-database-ca-certificate
toc: true
---

## Symptoms

- If the CA certificate of a secure database server is modified, any running flows that are connected to the database stop processing events.

- When you enter the URL of a secured database while [configuring](../../nodes/enrichmentnode/#configuring-a-database-node) your database node in the {{site.data.reuse.ep_name}} UI, the `Invalid JDBC URL` error is displayed.

- When you view the logs as a system administrator for the Flink `taskmanager` while attempting to establish a connection to the database, an error message similar to the following is displayed:

  ```shell
  (CERTIFICATE_UNKNOWN): PKIX path validation failed: java.security.cert.CertPathValidatorException: Path does not chain with any of the trust anchors
  ```

## Causes

The certificates that are used to validate the identity of the database server might be modified. {{site.data.reuse.ep_name}} fails to recognize the certificate secret that was updated and causes the error.


## Resolving the problem

To resolve the error, the system administrator must complete the following steps:

1. [Update the secret](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry) through {{site.data.reuse.ep_name}} again.
2. Delete the {{site.data.reuse.ep_name}} pod.
3. Wait for the pods to become ready.
