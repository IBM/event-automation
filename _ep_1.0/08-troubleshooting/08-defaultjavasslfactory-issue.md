---
title: "Event Processing fails with `Invalid JDBC URL` error"
excerpt: "Event Processing fails with `Invalid JDBC URL` error because the URL of the database is missing the information about the sslfactory."
categories: troubleshooting
slug: defaultjavasslfactory-issue
toc: true
---

## Symptoms

When you enter the URL of a TLS secured PostgreSQL database when you [configure](../../nodes/enrichmentnode/#configuring-a-database-node) your database node, an error similar to the following is displayed in the {{site.data.reuse.ep_name}} UI:

```shell
Invalid JDBC URL
```

Contact your system administrator to provide the backend logs if you encounter this above issue. The following error is displayed in the logs for the `backend` container in the {{site.data.reuse.ep_name}} pod:

```shell
io.vertx.core.eventbus.ReplyException: Could not open SSL root certificate file //.postgresql/root.crt.
```

## Causes

The URL of the secured PostgreSQL database does not include `sslfactory=org.postgresql.ssl.DefaultJavaSSLFactory`.

## Resolving the problem

Ensure that the configuration parameters in the URL for the secured PostgreSQL database contains the configuration parameter `sslfactory=org.postgresql.ssl.DefaultJavaSSLFactory`. For example:

```shell
jdbc:postgresql://<host>:<port>/<database>?sslfactory=org.postgresql.ssl.DefaultJavaSSLFactory&<additional-configuration>
```

**Note:** Ensure that you have correctly [mounted](../../installing/configuring/#configuring-postgresql-ssl-in-event-processing-and-flink) the truststore and password into both the {{site.data.reuse.ep_name}} and the {{site.data.reuse.flink_long}} instances as the administrator.