---
title: "Event Manager fails with `Unable to find main key backup` error"
excerpt: "Event Manager fails with `Unable to find main key backup` error after an instance is created"
categories: troubleshooting
slug: no-main-key-backup
toc: true
---


## Symptoms

When an {{site.data.reuse.eem_manager}} instance is created, {{site.data.reuse.eem_manager}} pods fail to reconcile with the following error in the operator logs:

```java
Caused by: com.ibm.eem.dependents.EEMSecretMainEncryptionKey$NoMainKeyBackupException: Unable to find main key backup
	at com.ibm.eem.dependents.EEEMSecretMainEncryptionKey.retrieveKeyBackup(EPSecretMainEncryptionKey.java:129)
	at com.ibm.eem.EventEndpointManagementReconciler.reconcile(EventEndpointManagementReconciler.java:223)
```

The following status is displayed in the {{site.data.reuse.eem_manager}} custom resource:

```yaml
status:
  conditions:
  - lastTransitionTime: '2024-02-26T19:49:43Z'
    message: Unable to find main key backup
    reason: UnhandledException
    status: 'True'
    type: Error
```

## Causes

When the {{site.data.reuse.eem_manager}} pod is started, a handshake takes place between the pod and the operator to initialize storage encryption. If the {{site.data.reuse.eem_manager}} pod restarts while initializing the encryption, the handshake might not complete successfully, leaving the {{site.data.reuse.eem_manager}} instance and the operator out-of-sync. As a result, the {{site.data.reuse.eem_manager}} pod never goes into a `Ready` state.

## Resolving the problem

To resolve the problem, recreate the instance as follows: 

1. Delete the existing {{site.data.reuse.eem_manager}} instance.
2. Delete the `PersistentVolumeClaim` associated with the instance.
3. Create an {{site.data.reuse.eem_manager}} instance.