---
title: "Backing up and restoring"
excerpt: "Find out how you can back up and restore your Event Endpoint Management and Event Gateway instances"
categories: installing
slug: backup-restore
toc: true
---

To back up and restore your {{site.data.reuse.eem_manager}} and operator-managed {{site.data.reuse.egw}} instances, you can use a backup tool such as [Velero](https://velero.io/){:target="_blank"}. In addition, consider using a [storage class](../prerequisites#data-storage-requirements) that supports the [Container Storage Interface (CSI) snapshotting](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/storage/using-container-storage-interface-csi#persistent-storage-csi-snapshots-overview_persistent-storage-csi-snapshots){:target="_blank"} (for example, the [Ceph File System](https://docs.ceph.com/en/latest/cephfs/){:target="_blank"}).

If you are running on {{site.data.reuse.openshift}}, the [OADP operator](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/backup_and_restore/backup-restore-overview#application-backup-restore-operations-overview){:target="_blank"} uses Velero and simplifies the installation of the backup software on your cluster, and the management of your backups and restorations.  

On other Kubernetes platforms, Velero provides a Helm chart that you can use to install the software or a command-line tool.

**Note:** Only the {{site.data.reuse.eem_manager}} and [operator-managed](../install-gateway#operator-managed-gateways) {{site.data.reuse.egw}}s are backed up by OADP. If you have [Docker or Kubernetes Deployment](../install-gateway#remote-gateways) gateways, they must be backed up manually by keeping a copy of their configuration.

Follow these instructions to back up and restore your Event Endpoint Management and operator-managed {{site.data.reuse.egw}} instances.

## Before you begin

To back up and restore the {{site.data.reuse.eem_manager}} and operator-managed {{site.data.reuse.egw}} instances, you must back up the following resources:

  - The main encryption key that is stored in a Kubernetes secret.
  - The data that is added to the instance. This is stored on Kubernetes Persistent Volumes (PVs) and within Kubernetes Persistent Volume Claims (PVCs).
  - Secrets containing certificates that are associated with the related instances.
  - The {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} resource configurations.

This means that your backup storage location and configuration must be able to store both Kubernetes objects and volumes. For more information about the solutions available to back up PVs and PVCs, see the [{{site.data.reuse.openshift_short}}](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/backup_and_restore/oadp-application-backup-and-restore#oadp-features-plugins){:target="_blank"} or [Velero](https://velero.io/plugins/){:target="_blank"} documentation. For example, you can use a remote object store such as `AWS S3` and a `CSI` compliant storage class to create the PVC for your instance.

In your CSI-supported storage provider (such as Ceph), ensure you have the `VolumeSnapshotClass` configured.

If you are on the {{site.data.reuse.openshift_short}} and use the OADP operator to back up your instances, you must specify backup and snapshot configurations in the `DataProtectionApplication` custom resource. For more information about installing the OADP operator, see the [installing OADP documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/backup_and_restore/oadp-application-backup-and-restore#about-installing-oadp){:target="_blank"}. You can also find more links about configuring the `DataProtectionApplication` custom resource for different backup locations in the installing OADP documentation. An example `DataProtectionApplication` configured against a [quickstart minio instance](https://velero.io/docs/main/contributions/minio/#set-up-server){:target="_blank"} would look as follows:
```yaml
apiVersion: oadp.openshift.io/v1alpha1
kind: DataProtectionApplication
metadata:
  name: velero-minio
  namespace: openshift-adp
spec:
  backupLocations:
    - velero:
        config:
          profile: default
          region: minio
          s3ForcePathStyle: 'true'
          s3Url: 'http://minio.velero.svc:9000'
        credential:
          key: minio
          name: minio-credentials
        default: true
        objectStorage:
          bucket: velero
          prefix: velero
        provider: aws
  configuration:
    nodeAgent:
      uploaderType: restic
    velero:
      defaultPlugins:
        - openshift
        - aws
        - kubevirt
        - csi
```

Optionally, to ensure that the correct items are backed up and restored properly, you can [install the Velero client](https://velero.io/docs/main/basic-install/){:target="_blank"}.



## Backing up
{: #backing-up}

**Note:** If you have gateways that are not managed by your {{site.data.reuse.eem_name}} operator, then back up their configurations separately following the steps in [backing up Docker gateways](#backup-docker-gateway) or [backing up Kubernetes Deployment gateways](#backup-k8s-gateway), depending on your deployment.

The label used to identify resources to back up is: 

```shell
backup.events.ibm.com/component: eventendpointmanagement
```

When you have configured the Velero instance, complete the following steps to create a backup of your {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} instances.

1. Add the appropriate back up label, for your version of {{site.data.reuse.eem_name}}, to the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} custom resource. The {{site.data.reuse.eem_name}} operator adds the label to the other Kubernetes resources required for back up and restore. 

    If the label is added to an existing instance of {{site.data.reuse.eem_manager}} or {{site.data.reuse.egw}}, the labels are treated as metadata only and are not added to other Kubernetes resources. To ensure that the label is added to other Kubernetes resources, roll the operator pod after the label change, or change any parameter in the `.spec` section of the custom resource when you change the label. To validate this process has worked correctly, use an example resource such as the Kubernetes secret `<eem_instance_name>-ibm-eem-mek-bak`, with the backup label present on this secret.

2. Create and apply a `Backup` custom resource by using the following snippet template.  

   In `spec.includedNamespaces`, add all the namespaces where the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances are installed. 

    ```yaml
    apiVersion: velero.io/v1
    kind: Backup
    metadata:
      name: <unique_name>
      namespace: openshift-adp
    spec:
      storageLocation: <backup_storage_location>
      includeClusterResources: true
      snapshotVolumes: true
      orLabelSelectors:
        - matchExpressions:
            - key: backup.events.ibm.com/component
              operator: In
              values:
                - catalogsource
                - operatorgroup
                - subscription
                - eventendpointmanagement
                - eventgateway
        - matchExpressions:
            - key: events.ibm.com/backup
              operator: In
              values:
                - required
      includedNamespaces:
        - <event-manager-instance-namespace>
        - <event-gateway-instance-namespace>
    ```  

3. After the `Backup` custom resource is applied, check whether the custom resource is updated with status information similar to the following snippet:

   ```yaml
   status:
     progress:
       itemsBackedUp: 12
       totalItems: 12
     csiVolumeSnapshotsCompleted: 1
     csiVolumeSnapshotsAttempted: 1
     phase: Completed
   ```

4. Optional: Run the following command in the Velero CLI to ensure that the resources that are specified in the `Backup` custom resource are backed up properly: 

   ```shell
   velero backup describe <backup_name> --details -n openshift-adp
   ```

5. If you have gateways that are not managed by your {{site.data.reuse.eem_name}} operator, such as Docker container or Kubernetes Deployment gateways, your backup for them is the configuration that you [downloaded](../installing/install-gateway) from the {{site.data.reuse.eem_name}} UI.

If you have problems creating a backup, see the [troubleshooting information for OADP](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/backup_and_restore/oadp-application-backup-and-restore#troubleshooting){:target="_blank"}.


### Backing up Docker {{site.data.reuse.egw}} instances
{: #backup-docker-gateway}

Keep a copy of the Docker command that you [generated](../install-gateway#generating-gateway-configs) to deploy the gateway, along with details of any extra [gateway configuration](../configuring) that you set.

### Backing up Kubernetes Deployment {{site.data.reuse.egw}} instances
{: #backup-k8s-gateway}

Export your Kubernetes Deployment to a YAML file. For example:

```shell
kubectl -n <namespace> get -o yaml <gateway deployment> > gatewaybackup.YAML
```

## Restoring

Restoring your instance might be required for a number of reasons:

- Loss of the entire Kubernetes cluster.
- Loss of a namespace.
- Loss of the {{site.data.reuse.eem_manager}} data or the encryption key.
- To wind back the data to a previous state.
- Loss of the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.

Before you restore your instance, the {{site.data.reuse.eem_name}} operator must be installed.

**Note:** You must restore your instance into a namespace with the same name that the backup was taken from. Ensure that you do not have an instance with the same name as the one you are restoring. You cannot restore {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances in the namespace if another instance with the same name exists there. If you are trying to rewind your data, you must [uninstall](../uninstalling) the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances that you are restoring.

To restore your {{site.data.reuse.eem_manager}} and operator-managed {{site.data.reuse.egw}} instances, complete the following steps:

1. Create and apply a `Restore` custom resource by using the following snippet.  

   In `spec.includedNamespaces`, add all the namespaces where {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances were previously installed, these namespaces should exist before the restore.

   ```yaml
   apiVersion: velero.io/v1
   kind: Restore
   metadata:
     name: <unique_name>
     namespace: openshift-adp
   spec:
     backupName: <name_of_the_backup_to_restore>
     existingResourcePolicy: update
     restorePVs: true
     orLabelSelectors:
     - matchExpressions:
       - key: backup.events.ibm.com/component
         operator: In
         values:
         - catalogsource
         - operatorgroup
         - subscription
         - eventendpointmanagement
         - eventgateway
     - matchExpressions:
       - key: events.ibm.com/backup
         operator: In
         values:
           - required
     includedNamespaces:
       - <event-manager-instance-namespace>
       - <event-gateway-instance-namespace>
   ```

2. After the `Restore` custom resource is applied and in `Completed` state, check that both the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances are created, and are in `Running` state.

3. Restore any Docker or Kubernetes Deployment gateways, using the backups taken in [backup Docker gateways](#backup-docker-gateway) and [backup Kubernetes Deployment gateways](#backup-k8s-gateway).

4. Secure your access again by following guidance in the [managing access](../../security/managing-access) and [managing roles](../../security/user-roles) topics.

You can access the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances again with the same configuration and data that you used when you backed up the data.

## Handling multiple instances

You can customize the label `backup.events.ibm.com/component: eventendpointmanagement` to differentiate between different instances of {{site.data.reuse.eem_name}} that might exist in the same namespace. 

To customize the label, complete the following steps:

1. Change the `eventendpointmanagement` value to any custom value. For example, `my-eem`. 
1. Ensure that the custom value is listed in the list of values in the backup and restore custom resources.
