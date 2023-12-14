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

A Flink savepoint is a consistent image of a Flink job's execution state. Backing up your Flink instances involves backing up savepoints.

### Prerequisites

This procedure assumes that you have the following deployed: 
- An [instance of Flink deployed](../installing/) by the {{site.data.reuse.flink_long}} and configured with persistent storage with a PersistentVolumeClaim (PVC).
- Flink jobs as [application deployments](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.6/docs/custom-resource/overview/#flinkdeployment){:target="_blank"}.

The `FlinkDeployment` custom resource that configures your Flink instance must define the hereafter parameters, each pointing to a different directory on the persistent storage.
- `spec.flinkConfiguration.state.checkpoints.dir`
- `spec.flinkConfiguration.state.savepoints.dir`
- `spec.flinkConfiguration.high-availability.storageDir` (if high availability is required)

**Note:** These directories are automatically created by Flink if they do not exist.

### Backing up

To back up your Flink instance, update each of your deployed instances by editing their respective `FlinkDeployment` custom resources as follows:

1. Ensure that the status section indicates that a `JobManager` is ready and the Flink job is running by checking the `FlinkDeployment` custom resource.

   ```yaml
   status:
     jobManagerDeploymentStatus: READY
     jobStatus:
       state: RUNNING
   ```

2. Edit the `FlinkDeployment` custom resource and make the following changes:

   a. Set the value of `spec.job.upgradeMode` to `savepoint`.

   b. Set the value of `spec.job.state` to `running`.

   c. Set the value of `spec.job.savepointTriggerNonce` to an integer that has never been used before for that option.

   For example:


   ```yaml
   job:
      jarURI: local:///opt/flink/usrlib/sql-runner.jar
      args: ["/opt/flink/usrlib/sql-scripts/statements.sql"]
      savepointTriggerNonce: <integer value>
      state: running
      upgradeMode: savepoint
   ```

3. Save the `FlinkDeployment` custom resource to make it available later for restoring your deployment.

### Restoring

To restore a Flink instance that you previously backed up, update your `FlinkDeployment` custom resource as follows.

1. Edit the saved `FlinkDeployment` custom resource that you saved when backing up your instance:

   a. Ensure that the value of `spec.job.upgradeMode` is `savepoint`.

   b. Ensure that the value of `spec.job.state` is `running` to resume the Flink job.

   c. Ensure that the same directory is set for the parameters `spec.job.initialSavepointPath` and `spec.flinkConfiguration["state.savepoints.dir"]`.

   For example:

   ```yaml
   job:
      jarURI: local:///opt/flink/usrlib/sql-runner.jar
      args: ["/opt/flink/usrlib/sql-scripts/statements.sql"]
      state: running
      upgradeMode: savepoint
      initialSavepointPath: <savepoint directory>
      allowNonRestoredState: true
   ```

2. Apply the modified `FlinkDeployment` custom resource.

