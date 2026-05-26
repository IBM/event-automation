---
title: "Job manager pod crashes after High Availability data deletion"
excerpt: "The job manager pod crashes in a loop when trying to recover a job after High Availability data is deleted."
categories: troubleshooting
slug: not-able-to-recover-flink-job
toc: true
---

## Symptom
{: #symptoms}

The job manager pod is stuck in a crash loop and you cannot submit any new Flink jobs. The log of your job manager pod displays the following error message:

```java
ERROR org.apache.flink.runtime.entrypoint.ClusterEntrypoint        [] - Fatal error occurred in the cluster entrypoint.
java.util.concurrent.CompletionException: org.apache.flink.util.FlinkRuntimeException: Could not recover job with job id 9ec1f602c07f585123c6d2efe60245b6.
	at java.base/java.util.concurrent.CompletableFuture.encodeThrowable(Unknown Source) [?:?]
	at java.base/java.util.concurrent.CompletableFuture.completeThrowable(Unknown Source) [?:?]
	at java.base/java.util.concurrent.CompletableFuture$UniApply.tryFire(Unknown Source) [?:?]
	at java.base/java.util.concurrent.CompletableFuture$Completion.run(Unknown Source) [?:?]
	at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(Unknown Source) [?:?]
	at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(Unknown Source) [?:?]
	at java.base/java.lang.Thread.run(Unknown Source) [?:?]
Caused by: org.apache.flink.util.FlinkRuntimeException: Could not recover job with job id 9ec1f602c07f585123c6d2efe60245b6.
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.tryRecoverJob(SessionDispatcherLeaderProcess.java:187) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.recoverJobs(SessionDispatcherLeaderProcess.java:154) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.lambda$recoverJobsIfRunning$2(SessionDispatcherLeaderProcess.java:143) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.AbstractDispatcherLeaderProcess.supplyUnsynchronizedIfRunning(AbstractDispatcherLeaderProcess.java:198) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.recoverJobsIfRunning(SessionDispatcherLeaderProcess.java:143) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.lambda$createDispatcherBasedOnRecoveredExecutionPlansAndRecoveredDirtyJobResults$1(SessionDispatcherLeaderProcess.java:133) ~[flink-dist-2.2.1.jar:2.2.1]
	... 5 more
Caused by: org.apache.flink.util.FlinkException: Could not retrieve submitted ExecutionPlan from state handle under executionPlan-9ec1f602c07f585123c6d2efe60245b6. This indicates that the retrieved state handle is broken. Try cleaning the state handle store.
	at org.apache.flink.runtime.jobmanager.DefaultExecutionPlanStore.recoverExecutionPlan(DefaultExecutionPlanStore.java:178) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.tryRecoverJob(SessionDispatcherLeaderProcess.java:178) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.recoverJobs(SessionDispatcherLeaderProcess.java:154) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.lambda$recoverJobsIfRunning$2(SessionDispatcherLeaderProcess.java:143) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.AbstractDispatcherLeaderProcess.supplyUnsynchronizedIfRunning(AbstractDispatcherLeaderProcess.java:198) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.recoverJobsIfRunning(SessionDispatcherLeaderProcess.java:143) ~[flink-dist-2.2.1.jar:2.2.1]
	at org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess.lambda$createDispatcherBasedOnRecoveredExecutionPlansAndRecoveredDirtyJobResults$1(SessionDispatcherLeaderProcess.java:133) ~[flink-dist-2.2.1.jar:2.2.1]
	... 5 more
```

## Causes
{: #causes}

This error occurs when High Availability (HA) data is accidentally deleted without removing the related configurations in your Flink session cluster. The job manager tries to recover the job but fails because the data is no longer available.

## Resolving the problem
{: #resolving-the-problem}

To resolve this problem, remove the configuration data for the job that is failing to recover by completing the following steps:

1. Find the job ID from the error message. In the example error, the job ID is `9ec1f602c07f585123c6d2efe60245b6`.

2. Delete the ConfigMap for the failed job:

   ```shell
   kubectl delete configmap <flink-deployment-name>-<job-id>-config-map -n <target-namespace>
   ```

   Where:
   - `<flink-deployment-name>` is the name of your Flink deployment.
   - `<job-id>` is the job ID that is failing to recover (for example, `9ec1f602c07f585123c6d2efe60245b6`).
   - `<target-namespace>` is the namespace where your Flink deployment is installed.

3. Remove the execution plan entry from the ConfigMap of your session cluster:

   ```shell
   kubectl patch configmap <flink-deployment-name>-cluster-config-map \
     --type=json \
     -p='[{"op": "remove", "path": "/data/executionPlan-<job-id>"}]' \
     -n <target-namespace>
   ```

   Replace `<job-id>` with the job ID from step 1.

   **Note:** If multiple jobs are affected, repeat this command for each job ID, or use a script similar to the following example to remove multiple entries at once:

   ```shell
   for JOB_ID in <job-id-1> <job-id-2> <job-id-3>; do
     kubectl patch configmap <flink-deployment-name>-cluster-config-map \
       --type=json \
       -p="[{\"op\": \"remove\", \"path\": \"/data/executionPlan-${JOB_ID}\"}]" \
       -n <target-namespace>
   done
   ```

   Replace `<job-id-1>`, `<job-id-2>`, and `<job-id-3>` with the actual job IDs.

4. Wait for the pod to restart. After the cleanup completes, the job manager starts successfully and you can submit new jobs.