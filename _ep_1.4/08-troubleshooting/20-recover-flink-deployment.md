---
title: "Recover a Flink application deployment to restore to a specified state"
excerpt: "Recover a Flink application deployment to restore to a specified state."
categories: troubleshooting
slug: recover-flink-deployment
toc: true
---

## Symptoms

The `FlinkDeployment` custom resource is not able to reconcile and have the following error in the `FlinkDeployment` custom resource:

```markdown
org.apache.flink.kubernetes.operator.exception.RecoveryFailureException: HA metadata not available to restore from last state. 
It is possible that the job has finished or terminally failed, or the configmaps have been deleted
```

## Causes

The default configuration `kubernetes.operator.jm-deployment.shutdown-ttl` in the Flink operator is to clean up the `Jobmanager` deployment 1 day after the Flink job reached the terminal state. When a Flink job reaches a terminal state of `Failed` or `Cancelled`, the Flink operator does the following actions, leading to error:

- High Availability (HA) metadata is cleaned up.
- The `Jobmanager` deployment is deleted.

## Resolving the problem

To resolve the problem, set the `spec.job.savepointRedeployNonce` to an integer value that was not used before and set the `spec.job.initialSavepointPath` to value of savepoint. For example:

```yaml
job:
   initialSavepointPath: file:/opt/flink/volume/flink-sp/savepoint-caf2b2-39d09a1c170c
   # If not set previously, set to 1, otherwise increment, e.g. 2
   savepointRedeployNonce: 1
```

Then, apply the `FlinkDeployment` custom resource.
