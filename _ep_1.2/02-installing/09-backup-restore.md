---
title: "Backing up and restoring"
excerpt: "Find out how you can back up and restore your Event Processing deployments."
categories: installing
slug: backup-restore
toc: true
---

You can backup and restore your {{site.data.reuse.ep_name}} flows and Flink instances as follows.

## {{site.data.reuse.ep_name}} flows

You can export your existing {{site.data.reuse.ep_name}} flows to save them, making them available to import later, as described in [exporting flows](../../advanced/exporting-flows/).

## Flink instances

A Flink savepoint is a consistent image of a Flink job's execution state. Backing up your Flink instances involves backing up savepoints. This document is intended for Flink jobs running in an [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} Flink cluster.

### Prerequisites

This procedure assumes that you have the following deployed: 
- An [instance of Flink deployed](../installing/) by the {{site.data.reuse.ibm_flink_operator}} and configured with persistent storage with a PersistentVolumeClaim (PVC).
- Flink jobs as [application deployments](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.9/docs/custom-resource/overview/#application-deployments){:target="_blank"}.

The `FlinkDeployment` custom resource that configures your Flink instance must define the hereafter parameters, each pointing to a different directory on the persistent storage.
- `spec.flinkConfiguration.state.checkpoints.dir`
- `spec.flinkConfiguration.state.savepoints.dir`
- `spec.flinkConfiguration.high-availability.storageDir` (if high availability is required)

**Note:** These directories are automatically created by Flink if they do not exist.

### Backing up

The backup process captures the latest state of a running Flink job and its specification, allowing to re-create the job from the saved state when required. To back up your Flink instance, update each of your deployed instances by editing their respective `FlinkDeployment` custom resources as follows:

1. Ensure that the `status` section indicates that the Job Manager is in `READY` status and that the Flink job is in `RUNNING` status by checking the `FlinkDeployment` custom resource.

   ```yaml
   status:
     jobManagerDeploymentStatus: READY
     jobStatus:
       state: RUNNING
   ```

2. Set the following values in the `FlinkDeployment` custom resource:

   a. Set the value of `spec.job.upgradeMode` to `savepoint`.

   b. Set the value of `spec.job.state` to `running`.

   c. Set the value of `spec.job.savepointTriggerNonce` to an integer that has never been used before for that option.

   For example:

   ```yaml
   job:
     [...]
     savepointTriggerNonce: <integer value>
     state: running
     upgradeMode: savepoint
   ```

   d. Save the changes in the `FlinkDeployment` custom resource.

   A savepoint is triggered and written to a location in the PVC, which is indicated in the `status.jobStatus.savepointInfo.lastSavepoint.location` field of the `FlinkDeployment` custom resource.

   For example:

   ```yaml
   status:
     [...]
     jobStatus:
       [...]
       savepointInfo:
         [...]
         lastSavepoint:
           formatType: CANONICAL
           location: 'file:/opt/flink/volume/flink-sp/savepoint-e372fa-9069a1c0563e'
           timeStamp: 1733957991559
           triggerNonce: 1
           triggerType: MANUAL
   ```
3. Save a copy of the `FlinkDeployment` custom resource.
4. Keep the `FlinkDeployment` custom resource and the PVC bound to a persistent volume (PV) containing the savepoint to make them available later for restoring your deployment.

### Restoring

To restore a previously backed-up Flink instance, ensure that the PVC bound to a PV containing the snapshot is available, then update your `FlinkDeployment` custom resource as follows.

1. Edit the `FlinkDeployment` custom resource that you saved earlier when [backing up](#backing-up) your instance:

   a. Set the value of `spec.job.upgradeMode` to `savepoint`.

   b. Set the value of `spec.job.state` to `running` to resume the Flink job.

   c. Remove `spec.job.savepointTriggerNonce` and its value.

   d. Set the value of `spec.job.initialSavepointPath` to the savepoint location reported during the backing up operation in step 1.d.

   For example:

   ```yaml
   job:
     [...]
     state: running
     upgradeMode: savepoint
     initialSavepointPath: file:/opt/flink/volume/flink-sp/savepoint-e372fa-9069a1c0563e
     allowNonRestoredState: true
   ```

2. Apply the modified `FlinkDeployment` custom resource.

