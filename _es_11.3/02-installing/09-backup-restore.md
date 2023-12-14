---
title: "Backing up and restoring on OpenShift"
excerpt: "Find out how you can back up and restore your Event Streams static configuration."
categories: installing
slug: backup-restore
toc: true
---

A complete disaster recovery mechanism for {{site.data.reuse.es_name}} can be achieved by using the OpenShift APIs for Data Protection (OADP) and [geo-replication](../../georeplication/about/).

OADP is used for creating a backup of {{site.data.reuse.es_name}} static configurations such as custom resources and operator-related configurations. The backup can be used to restore the configuration in the same cluster or a different cluster. High-frequency data updates such as Kafka topic data are not included in these backups.

- If Kafka topic custom resources are included in the {{site.data.reuse.es_name}} installation, the topic configuration can be backed up and restored by using OADP.
- The actual messages within the Kafka topics cannot be preserved through the OADP mechanism. However, after you restore your {{site.data.reuse.es_name}} static configurations onto a new cluster, the topic data can be effectively mirrored by implementing geo-replication, which provides a robust backup system for disaster recovery.
- When you restore the {{site.data.reuse.es_name}} static configurations within your cluster, the topic data remains intact while the persistent storage remains available, ensuring data retention during the restore process.

Find out more about how to set up an OADP operator in an OpenShift cluster for a successful backup and restore.

## Before you begin

Consider the following when planning to back up and restore your {{site.data.reuse.es_name}} configurations.

- Secrets are not included as part of the {{site.data.reuse.es_name}} backup process. For example, if you have created Kafka users in SCRAM, Kafka user definitions of these SCRAM users will be backed up but the secrets will be created again. Ensure you are using the most up-to-date credentials as the secrets will be generated again when restoring.

- Additional ConfigMaps that you create are not included as part of the {{site.data.reuse.es_name}} backup process. For example, if you have created ConfigMaps for accessing the {{site.data.reuse.es_name}} features such as monitoring with Prometheus, the ConfigMaps will not be backed up. Ensure the ConfigMaps are created again before restoring your {{site.data.reuse.es_name}} configurations.

- Ensure the custom certificates are created again before restoring your {{site.data.reuse.es_name}} configurations.

- When performing a restoration on a new cluster, ensure that the bootstrap address is updated to reflect the address of the new cluster if the bootstrap address is specified in any of the restored custom resources, such as Kafka Connect or Kafka Bridge.

Ensure that the following prerequisites are met before you back up and restore {{site.data.reuse.es_name}} configurations by using OADP:

- A storage mechanism, such as Amazon Simple Storage Service (Amazon S3), to securely retain backed up data. For more information about the supported storage types, see the [{{site.data.reuse.openshift_short}} documentation](https://docs.openshift.com/container-platform/4.14/backup_and_restore/application_backup_and_restore/installing/about-installing-oadp.html#oadp-s3-compatible-backup-storage-providers-supported){:target="_blank"}.

- Ensure that the OADP operator is installed in your cluster along with a `DataProtectionApplication` instance in `Ready` state. Follow the instructions in the [{{site.data.reuse.openshift_short}} documentation](https://docs.openshift.com/container-platform/4.14/backup_and_restore/application_backup_and_restore/installing/oadp-installing-operator.html){:target="_blank"} to install OADP.

## Backing up configurations of {{site.data.reuse.es_name}}

Follow the instructions to back up your {{site.data.reuse.es_name}} configurations.

### Applying backup labels

{{site.data.reuse.es_name}} uses backup labels on resources to ensure that all the important resources are included in the backup. Complete the following steps to add backup labels that are specific to operator and instance resources:

1. {{site.data.reuse.openshift_cli_login}}
2. Run the following commands to label the operator resources such as `operatorgroup`, `catalogsource`, and `Subscription`:

   ```shell
   kubectl label catsrc "${eventstreams-catalog-name}" -n openshift-marketplace backup.eventstreams.ibm.com/component=catalogsource --overwrite=true

   kubectl label operatorgroup -n ${namespace} $(oc get operatorgroup -n ${namespace} | grep "${namespace}" | awk '{ print $1}') backup.eventstreams.ibm.com/component=operatorgroup --overwrite=true

   kubectl label subscription -n ${namespace} $(oc get subscription -n ${namespace} | grep "ibm-eventstreams" | awk '{ print $1}') backup.eventstreams.ibm.com/component=subscription --overwrite=true
   ```

3. Ensure that the {{site.data.reuse.es_name}} custom resource YAML and the related operands are deployed with backup labels.

   ```yaml
    labels:
      backup.eventstreams.ibm.com/component: {OperandName}
    ```

    In {{site.data.reuse.es_name}} 11.2.5 and later, backup labels are included in the custom resource YAML samples. Apply the custom resource YAML to deploy your resources with backup labels.  

    In {{site.data.reuse.es_name}} versions earlier than 11.2.5 and for the upgrade scenarios from an older version to the 11.2.5 version, you can add labels to your custom resources by running the following commands. 

    ```shell
    kubectl label eventstreams -n ${namespace} --all backup.eventstreams.ibm.com/component=eventstreams --overwrite=true
    kubectl label kafkaconnects.eventstreams.ibm.com -n ${namespace} --all backup.eventstreams.ibm.com/component=kafkaconnect --overwrite=true

    kubectl label kafkatopics.eventstreams.ibm.com -n ${namespace} --all backup.eventstreams.ibm.com/component=kafkatopic --overwrite=true
    kubectl label kafkausers.eventstreams.ibm.com -n ${namespace} --all backup.eventstreams.ibm.com/component=kafkauser --overwrite=true

    kubectl label kafkabridges.eventstreams.ibm.com -n ${namespace} --all backup.eventstreams.ibm.com/component=kafkabridge --overwrite=true
    kubectl label kafkaconnectors.eventstreams.ibm.com -n ${namespace} --all backup.eventstreams.ibm.com/component=kafkaconnector --overwrite=true
    kubectl label kafkarebalances.eventstreams.ibm.com  -n ${namespace}  --all backup.eventstreams.ibm.com/component=kafkarebalance --overwrite=true
    ```

### Configuring the backup custom resource

The backup custom resource is responsible for generating backup files for {{site.data.reuse.es_name}} resources and storing them in the designated storage location. Apply the following backup custom resource YAML to create the backup of all application resources that have been labeled for backup.

   ```yaml
   apiVersion: velero.io/v1
   kind: Backup
   metadata:
     name: <eventstreams-backup>
     namespace: openshift-adp
   spec:
     ttl: 720h0m0s
     defaultVolumesToRestic: false
     includeClusterResources: true
     storageLocation: <storage_location>
     includedNamespaces:
     - <eventstreams-namespace>
     - openshift-marketplace
     orLabelSelectors:
     - matchExpressions:
       - key: backup.eventstreams.ibm.com/component
         operator: In
         values:
         - catalogsource
         - operatorgroup
         - subscription
         - eventstreams
         - kafkaconnect
         - kafkatopic
         - kafkauser
         - kafkabridge
         - kafkaconnector
         - kafkarebalance
   ```

Where:

- `<eventstreams-backup>` is the name of the backup that you are creating.
- `<eventstreams_namespace>` is the name of the namespaces to be backed up. You can back up more than one namespace at the same time.
- `<storage_location>` is the name of the `backupstoragelocation` instance that was created when you installed the `DataProtectionApplication` instance. You can get the name of your storage location by running the following command in your cluster:

  ```shell
  oc get backupStorageLocations -n openshift-adp
  ```

After the backup is successfully completed, the status of your backup instance will be `completed`.

## Restoring configurations of {{site.data.reuse.es_name}}

{{site.data.reuse.es_name}} configurations that are [backed up](#backing-up-configurations-of-event-streams) can be restored within your existing cluster or in a new cluster by using the restore custom resource.

### In-place recovery

In-place recovery in {{site.data.reuse.es_name}} refers to recovering configurations and metadata within the same {{site.data.reuse.openshift_short}} cluster without the need of setting up a secondary cluster for moving data and configurations. Such recovery is only possible if the [persistent storage](../planning/#planning-for-persistent-storage) configured for Kafka and ZooKeeper remains intact and can be reused by the restored configuration.

To restore your {{site.data.reuse.es_name}} configurations within your cluster after you have a successful backup of {{site.data.reuse.es_name}} configurations in your storage location, apply the following YAML to restore {{site.data.reuse.es_name}} configurations from the previously created backup.

```yaml
apiVersion: velero.io/v1
kind: Restore
metadata:
  name: <eventstreams-restore>
  namespace: openshift-adp
spec:
  backupName: <eventstreams-backup>
  includeClusterResources: true
  existingResourcePolicy: update
  hooks: {}
  includedNamespaces:
  - <eventstreams-namespace>
  - openshift-marketplace
  itemOperationTimeout: 1h0m0s
  orLabelSelectors:
  - matchExpressions:
      - key: backup.eventstreams.ibm.com/component
        operator: In
        values:
        - catalogsource
        - operatorgroup
        - subscription
        - eventstreams
        - kafkaconnect
        - kafkatopic
        - kafkauser
        - kafkabridge
        - kafkaconnector
        - kafkarebalance
```

Where:

- `<eventstreams-restore>` is the name of your restore YAML.
- `<eventstreams-backup>` is the name of backup that you created earlier.
- `<eventstreams-namespace>` is the name of namespaces to be restored. You can restore more than one namespace at the same time.

Wait for the restore process to be completed. After the status of your restore instance is `completed`, all the application instances will be restored.

### Restoring in a new cluster

Follow the steps to restore your {{site.data.reuse.es_name}} configurations in a new cluster.

1. As mentioned in [before you begin](#before-you-begin), install the OADP operator and the corresponding `DataProtectionApplication` instance in your new cluster and point to the same storage location.

2. After the `DataProtectionApplication` instance is created, the list of all the backups that are created in your old cluster is displayed in the new cluster.

3. Apply the [restore YAML file](#in-place-recovery) and wait for the restoration process to be completed.

4. After restoration is completed, verify that all the {{site.data.reuse.es_name}} resources are restored and functioning as expected.

## Migrating topic data

The backup and restoration process by using OADP is primarily focused on safeguarding and recovering {{site.data.reuse.es_name}} configurations. However, for comprehensive disaster recovery, it is essential to extend these efforts to include the backup and restoration of topic data.

In {{site.data.reuse.es_name}}, data replication can be effectively achieved through the use of geo-replication. Implement geo-replication as part of your data protection strategy to ensure the seamless migration of data.

Learn how to [set up data replication by using geo-replication](../../georeplication/setting-up).
