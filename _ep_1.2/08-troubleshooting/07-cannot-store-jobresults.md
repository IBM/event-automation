---
title: "Flink instances cannot access JobResultStore"
excerpt: "When installed in a non-OpenShift Kubernetes environment, the Flink (`FlinkDeployment`) pod goes into a `CrashLoopBackoff` state when trying to access the JobResultStore."
categories: troubleshooting
slug: fsgroup-not-set
toc: true
---

## Symptoms

When installed on a non-OpenShift Kubernetes environment, the Flink (`FlinkDeployment`) pod goes into `CrashLoopBackoff` state when trying to access the `JobResultStore`.

The logs in the Flink instance (`FlinkDeployment`) pod display the following error:

```java
ERROR org.apache.flink.runtime.entrypoint.ClusterEntrypoint        [] - Fatal error occurred in the cluster entrypoint.
java.util.concurrent.CompletionException: java.lang.IllegalStateException: The base directory of the JobResultStore isn't accessible. No dirty JobResults can be restored.
	at java.util.concurrent.CompletableFuture.encodeThrowable(Unknown Source) ~[?:?]
	at java.util.concurrent.CompletableFuture.completeThrowable(Unknown Source) [?:?]
	at java.util.concurrent.CompletableFuture$AsyncSupply.run(Unknown Source) [?:?]
	at java.util.concurrent.ThreadPoolExecutor.runWorker(Unknown Source) [?:?]
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(Unknown Source) [?:?]
	at java.lang.Thread.run(Unknown Source) [?:?]
Caused by: java.lang.IllegalStateException: The base directory of the JobResultStore isn't accessible. No dirty JobResults can be restored.
	at org.apache.flink.util.Preconditions.checkState(Preconditions.java:193) ~[flink-dist-1.17.1.jar:1.17.1]
	at org.apache.flink.runtime.highavailability.FileSystemJobResultStore.getDirtyResultsInternal(FileSystemJobResultStore.java:199) ~[flink-dist-1.17.1.jar:1.17.1]
	at org.apache.flink.runtime.highavailability.AbstractThreadsafeJobResultStore.withReadLock(AbstractThreadsafeJobResultStore.java:118) ~[flink-dist-1.17.1.jar:1.17.1]
	at org.apache.flink.runtime.highavailability.AbstractThreadsafeJobResultStore.getDirtyResults(AbstractThreadsafeJobResultStore.java:100) ~[flink-dist-1.17.1.jar:1.17.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.getDirtyJobResults(SessionDispatcherLeaderProcess.java:194) ~[flink-dist-1.17.1.jar:1.17.1]
	at org.apache.flink.runtime.dispatcher.runner.AbstractDispatcherLeaderProcess.supplyUnsynchronizedIfRunning(AbstractDispatcherLeaderProcess.java:198) ~[flink-dist-1.17.1.jar:1.17.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.getDirtyJobResultsIfRunning(SessionDispatcherLeaderProcess.java:188) ~[flink-dist-1.17.1.jar:1.17.1]
	... 4 more
```

## Causes

The Flink instance (`FlinkDeployment`) is trying to access the FileSystem within the container, but the Flink instance (`FlinkDeployment`) does not have the permission to access the FileSystem.

## Resolving the problem

To resolve the problem, configure the `podTemplate` section in the `FlinkDeployment` custom resource with: `spec.securityContext.fsGroup: 1001`.

For example:

```yaml
# excerpt from a FlinkDeployment CRD 
spec:
  podTemplate:
    spec:
      securityContext:
        fsGroup: 1001
```