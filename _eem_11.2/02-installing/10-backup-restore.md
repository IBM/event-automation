---
title: "Backing up and restoring"
excerpt: "Find out how you can back up and restore your Event Endpoint Management and Event Gateway instances"
categories: installing
slug: backup-restore
toc: true
---


To back up and restore your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances, you can use a backup tool such as [Velero](https://velero.io/){:target="_blank"}. In addition, consider using a [storage class](../prerequisites#data-storage-requirements) that supports the [Container Storage Interface (CSI) snapshotting](https://docs.openshift.com/container-platform/4.15/storage/container_storage_interface/persistent-storage-csi-snapshots.html){:target="_blank"} (for example, the [Ceph File System](https://docs.ceph.com/en/latest/cephfs/){:target="_blank"}).

If you are running on the {{site.data.reuse.openshift}}, the [OADP operator](https://docs.openshift.com/container-platform/4.15/backup_and_restore/index.html#application-backup-restore-operations-overview){:target="_blank"} uses Velero 
and simplifies the installation of the backup software on your cluster, and the management of your backups and restorations.  

On other Kubernetes platforms, Velero provides a Helm chart which you can use to install the software or a command line tool.

Follow these instructions to back up and restore your Event Endpoint Management and Event Gateway instances.

## Before you begin

To back up and restore the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances, you must back up the following resources:

  - The main encryption key that is stored in a Kubernetes secret.
  - The data that is added to the instance. This is stored on Kubernetes Persistent Volumes (PVs) and within Kubernetes Persistent Volume Claims (PVCs).
  - Secrets containing certificates that are associated with the related instances.
  - The {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resource configurations.

  This means that your backup location and configuration must be able to store both Kubernetes objects and volumes. For more information about the solutions you can use to back up PVs and PVCs, see the [{{site.data.reuse.openshift_short}}](https://docs.openshift.com/container-platform/4.15/backup_and_restore/application_backup_and_restore/oadp-features-plugins.html#oadp-plugins_oadp-features-plugin){:target="_blank"} or [Velero](https://velero.io/plugins/) documentation. For example, you can use a remote object store such as `AWS S3` and a `CSI` compliant storage class to create the PVC for your instance.

- If you are on the {{site.data.reuse.openshift_short}} and using the OADP operator to back up your instances, you must specify backup and snapshot configurations in the `DataProtectionApplication` custom resource. For more information about installing and configuring the `DataProtectionApplication` custom resource, see the [{{site.data.reuse.openshift_short}} documentation](https://docs.openshift.com/container-platform/4.15/backup_and_restore/application_backup_and_restore/installing/about-installing-oadp.html){:target="_blank"} and select the storage type you want to configure.

- In your CSI supported storage provider (such as Ceph), ensure you have the `VolumeSnapshotClass` configured for the `CSI` storage provider in your cluster.

- To ensure that the correct items are backed up and restored properly, you can [install the Velero client.](https://velero.io/docs/main/basic-install/){:target="_blank"}

## Backing up

If applicable, after your `DataProtectionApplication` is configured and other dependencies are prepared, you can back up your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.

Create two `Backup` custom resources to back up your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances:

  - One for the main encryption key, secrets, and the PVCs containing the data of your instance deployments.
  - The other for the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resource configurations.

 Complete the following steps to create two `Backup` custom resources:

1. To ensure that only the main encryption key, secrets, and the PVCs that contain the data are configured for back up, and to easily separate them from the other resources that are related to the {{site.data.reuse.eem_manager}} instance, ensure that the `events.ibm.com/backup: required` label and the `app.kubernetes.io/name: ibm-event-endpoint-management` label are added to the following resources:

   - The PVCs in the {{site.data.reuse.eem_manager}} instance namespace with names starting with `manager-storage-<event-manager-instance-name>-ibm-eem-manager-`.
   - Any custom named PVC configured on the {{site.data.reuse.eem_manager}} instance.
   - The secret in the {{site.data.reuse.eem_manager}} instance namespace with the name that ends with `-mek-bak`. For example, `<eem_instance_name>-ibm-eem-mek-bak`.
   - Any custom secrets containing certificates added to the {{site.data.reuse.eem_manager}} instance as `trustedCertificates`.

   In addition, add labels to the following secrets:

   - If using the cert manager default configuration for the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances, add the `events.ibm.com/backup: required` and `app.kubernetes.io/name: ibm-event-endpoint-management` labels to secrets with the names `<event-manager-instance-name>-ibm-eem-manager-ca`, `<event-manager-instance-name>-ibm-eem-manager`, and `<egw_instance_name>-ibm-egw-cert`.

   - If using custom secrets, add the `events.ibm.com/backup: required` and `app.kubernetes.io/name: ibm-event-endpoint-management` labels to all secrets supplied on the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resource TLS configurations.

   **Note:** If you want to include your user role mappings configuration in the backup, add the labels to the secret named `<eem_instance_name>-ibm-eem-user-roles`.

2. To ensure the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resource configurations are configured for back up, add the `events.ibm-event-endpoint-management.ibm.com/backup=required` label to the following custom resources if not present:

   - The {{site.data.reuse.eem_manager}} custom resource
   - The {{site.data.reuse.egw}} custom resource

3. After the labels are applied, create and apply a `Backup` custom resource as follows that backs up secrets containing the encryption key and certificates, and the PVCs containing the data of your instance. Also, include the snapshots in the custom resource if you are using a `CSI` storage provider.

   ```yaml
   apiVersion: velero.io/v1
   kind: Backup
   metadata:
     name: <unique_name>
     namespace: openshift-adp
   spec:
     includedResources:
       - secrets
       - persistentvolumeclaims
       # To ensure the volume data is backed up when using CSI
       - volumesnapshots 
       - volumesnapshotcontents
     storageLocation: <backup_storage_location_cr_name>
     includeClusterResources: true
     labelSelector:
       matchLabels:
         app.kubernetes.io/name: ibm-event-endpoint-management
         events.ibm.com/backup: required
     includedNamespaces:
       - <event-manager-instance-namespace>
       - <event-gateway-instance-namespace>
     excludedResources: []
   ```

   **Note:** Under `spec.includedNamespaces`, add all namespaces where {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances are installed.

   See the [OADP](https://docs.openshift.com/container-platform/4.15/backup_and_restore/application_backup_and_restore/installing/about-installing-oadp.html){:target="_blank"} and [Velero](https://velero.io/){:target="_blank"} documentation for more configuration options for the `Backup` custom resource.

4. After the `Backup` custom resource is applied, check whether the custom resource is updated with status information similar to the following snippet:

   ```yaml
   status:
     progress:
       itemsBackedUp: 11
       totalItems: 11
     csiVolumeSnapshotsCompleted: 1
     csiVolumeSnapshotsAttempted: 1
     phase: Completed
   ```

5. To ensure the resources specified in the `Backup` custom resource are backed up properly, run the following command: 

   ```shell
   velero backup describe <backup_name> --details -n openshift-adp
   ```

6. Create and apply another `Backup` custom resource as follows to back up the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resource configurations.

   ```yaml
   apiVersion: velero.io/v1
   kind: Backup
   metadata:
     name: <unique_name>
     namespace: openshift-adp
   spec:
     defaultVolumesToRestic: false
     includeClusterResources: true
     storageLocation: <backup_storage_location_cr_name>
     includedNamespaces:
       - <event-manager-instance-namespace>
       - <event-gateway-instance-namespace>
     orLabelSelectors:
     - matchExpressions:
       - key: events.ibm-event-endpoint-management.ibm.com/backup
         operator: In
         values:
         - required
   ```

   **Note:** Under `spec.includedNamespaces`, add all namespaces where {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances are installed. 

7. After the `Backup` of your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resources is applied, check whether the `Backup` custom resource is updated with status information similar to the following:

   ```yaml
   status:
     progress:
       itemsBackedUp: 5
       totalItems: 5
     phase: Completed
   ```

8. To ensure your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resource configurations are backed up properly, run the following command:

   ```shell
   velero backup describe <backup_name> --details -n openshift-adp
   ```

If you are facing problems in creating a backup, see the [troubleshooting information for OADP](https://docs.openshift.com/container-platform/4.15/backup_and_restore/application_backup_and_restore/troubleshooting.html){:target="_blank"}.

**Important:** The name of your `Backup` custom resource is required to [restore](#restoring) your instance from the backup.

## Restoring

Restoring your instance might be required for a number of reasons:

- Loss of the entire Kubernetes cluster.
- Loss of a namespace.
- Loss of the {{site.data.reuse.eem_manager}} data or the encryption key.
- To wind back the data to a previous state.
- Loss of the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.

You can restore the backed up {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances as follows.

Before restoring your instance, the {{site.data.reuse.eem_name}} operator must be installed again in the previously installed namespace if it was lost.

**Note:** In the namespace that you are restoring to, ensure that you do not have an instance with the same name as the one you are restoring. You cannot restore {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances in the namespace if another instance with the same name already exists there. If you are trying to rewind your data, you must [uninstall](../uninstalling) the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances you are restoring.

To restore your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances, complete the following steps:

1. To restore the encryption key secret, certificate secrets, and the PVC resources, create and apply a `Restore` custom resource similar to the following YAML:

   ```yaml
   apiVersion: velero.io/v1
   kind: Restore
   metadata:
     name: <unique_name>
     namespace: openshift-adp
   spec:
     backupName: <name_of_the_backup_to_restore>
     existingResourcePolicy: update
     excludedResources: []
     includedResources: []
     restorePVs: true
   ```
    Where `<name_of_the_backup_to_restore>` is the backup of the encryption key secret, certificate secrets, and the PVC resources.

    See the [OADP](https://docs.openshift.com/container-platform/4.15/backup_and_restore/application_backup_and_restore/installing/about-installing-oadp.html){:target="_blank"} and [Velero](https://velero.io/){:target="_blank"} documentation for more configuration options for the `Restore` custom resource. For example, you can configure your custom resource to restore to an alternative namespace.

2. When you are applying this custom resource, the backup is loaded from the backup location and the `<eem_instance_name>-ibm-eem-mek-bak` secret, `manager-storage-<event-manager-instance-name>-ibm-eem-manager-0` PVC and secrets containing TLS certificates are re-created.

    Before proceeding to the next step, wait for the `Restore` custom resource to be applied and in `Completed` state, then check that the encryption key secret, the PVC resources and certficate secrets are created, and ensure that the resources are in `Ready` state.

    **Note:** Velero removes some labels and annotations such as the `volume.beta.kubernetes.io/storage-provisioner` annotation when restoring PVCs. For some providers, this might leave the PVC in a `Pending` state. To fix this manually, add the `volume.beta.kubernetes.io/storage-provisioner` annotation back into the PVC with the same value as the `volume.kubernetes.io/storage-provisioner` annotation.

3. After the encryption key secret, TLS secrets, and the PVC resources are restored, and in `Ready` state, you can restore the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resource configurations. To do this, create and apply another `Restore` custom resource similar to the following YAML:

    ```yaml
    apiVersion: velero.io/v1
    kind: Restore
    metadata:
      name: <unique_name>
      namespace: openshift-adp
    spec:
      backupName: <name_of_the_backup_to_restore>
      includeClusterResources: true
      existingResourcePolicy: update
      hooks: {}
      includedNamespaces:
      - < event-manager-instance-namespace>
      - <event-gateway-instance-namespace>
      itemOperationTimeout: 1h0m0s
      orLabelSelectors:
      - matchExpressions:
        - key: events.ibm-event-endpoint-management.ibm.com/backup
          operator: In
          values:
          - required
    ```
    Where `<name_of_the_backup_to_restore>`is the backup of the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resource configurations. 
 
    **Note:** Under `spec.includedNamespaces`, add all namespaces where {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances are installed.

4. After the `Restore` custom resource is applied and in `Completed` state, check that both the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances are created, and are in `Running` state.

5. Secure your access again by following guidance in the [managing access](../../security/managing-access) and [managing roles](../../security/user-roles) topics.

You can access the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances again with the same configuration and data as when the back up happened.
