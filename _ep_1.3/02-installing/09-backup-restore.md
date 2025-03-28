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
- Flink jobs as [application deployments](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.10/docs/custom-resource/overview/#application-deployments){:target="_blank"}.

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

2. You can use the `FlinkStateSnapshots` custom resource to create a savepoint. In the [FlinkSnapshots custom resource](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.10/docs/custom-resource/snapshots/){:target="_blank"}, make the following modifications:

   a. Set the name of your `FlinkDeployment` custom resource in `spec.jobReference.name`.

   b. Set the value of `spec.savepoint.disposeOnDelete` to `false` to ensure that the savepoint is not deleted even after `FlinkStateSnapshot` custom resource is deleted.

   For example:

   ```yaml
   spec:
     [...]
     jobReference:
       kind: FlinkDeployment
       name: application-cluster-prod
     savepoint:
       alreadyExists: false
       disposeOnDelete: false
    ```

   c. Save the changes in the `FlinkStateSnapshots` custom resource.

   d. The savepoint written to a location in the PVC is indicated in the `status.path` field of the `FlinkStateSnapshots` custom resource. For example:

   ```yaml
   status:
     failures: 0
     path: 'file:/opt/flink/volume/flink-sp/savepoint-caf2b2-39d09a1c170c'
     state: COMPLETED
   ```

3. Save a copy of the `FlinkStateSnapshots` and `FlinkDeployment` custom resources. 
4. Keep the `FlinkDeployment` custom resource and the PVC bound to a persistent volume (PV) containing the savepoint to make them available later for restoring your deployment.

### Restoring

To restore a previously backed-up Flink instance, ensure that the PVC bound to a PV containing the snapshot is available, then update your `FlinkDeployment` custom resource as follows.

1. Edit the `FlinkDeployment` custom resource that you saved earlier when [backing up](#backing-up) your instance:

   a. Set the value of `spec.job.upgradeMode` to `savepoint`.

   b. Set the value of `spec.job.state` to `running` to resume the Flink job.

   c. Set the value of `spec.job.initialSavepointPath` to the savepoint location reported in `status.path` field of the `FlinkStateSnapshots` custom resource that you saved earlier.

   For example:

   ```yaml
   job:
     [...]
     state: running
     upgradeMode: savepoint
     initialSavepointPath: file:/opt/flink/volume/flink-sp/savepoint-caf2b2-39d09a1c170c
     allowNonRestoredState: true
   ```

2. Apply the modified `FlinkDeployment` custom resource.

