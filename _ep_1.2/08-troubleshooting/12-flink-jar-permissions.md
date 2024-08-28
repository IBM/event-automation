---
title: "Flink instances cannot access SQL Runner JAR file"
excerpt: "When creating a Flink instance as an application cluster, the error `JAR file can't be read` is logged."
categories: troubleshooting
slug: flink-jar-permissions
toc: true
---

## Symptoms

When creating an instance of a `FlinkDeployment` to deploy flows in a [production](../../advanced/deploying-production) environment, the Flink job manager pods go into `CrashLoopBackOff` state and an error similar to the following is displayed in the logs:

```shell
Caused by: java.io.IOException: JAR file can't be read '/opt/flink/usrlib/sql-runner.jar'
```

## Causes

The non-root user running the Flink instance is unable to read the SQL runner JAR file as the non-root user does not have the required permissions.

## Resolving the problem

To resolve the problem, complete the following steps:

1. Modify the file system or the Dockerfile to have the read permissions (644) for your JAR file.
2. Build a new docker image.
3. After the new image is pushed to your registry, update your `FlinkDeployment` custom resource to use the new image.