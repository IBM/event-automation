---
title: "Event Processing fails with `Unable to find main key backup` error"
excerpt: "Event Processing fails with `Unable to find main key backup` error after an instance is created"
categories: troubleshooting
slug: no-main-key-backup
toc: true
---


## Symptoms
{: #symptoms}

When an {{site.data.reuse.ep_name}} instance is created, {{site.data.reuse.ep_name}} pods fail to reconcile with the following error in the operator logs:

```java
com.ibm.ei.dependents.EPSecretMainEncryptionKey$NoMainKeyBackupException: Unable to find main key backup
	at com.ibm.ei.dependents.EPSecretMainEncryptionKey.retrieveKeyBackup(EPSecretMainEncryptionKey.java:132)
	at com.ibm.ei.EventProcessingReconciler.reconcile(EventProcessingReconciler.java:226)
```

The following status is displayed in the {{site.data.reuse.ep_name}} custom resource:

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
{: #causes}

When the {{site.data.reuse.ep_name}} pod is started, a handshake takes place between the pod and the operator to initialize storage encryption. If the {{site.data.reuse.ep_name}} pod restarts while initializing the encryption, the handshake might not complete successfully, leaving the {{site.data.reuse.ep_name}} instance and the operator out-of-sync. As a result, the {{site.data.reuse.ep_name}} pod never goes into a `Ready` state.

## Resolving the problem
{: #resolving-the-problem}

To resolve the problem, recreate the instance as follows: 

1. Delete the existing {{site.data.reuse.ep_name}} instance.
2. Delete the `PersistentVolumeClaim` associated with the instance.
3. Create an {{site.data.reuse.ep_name}} instance.