---
title: "Error while rotating encryption key"
excerpt: "If the new encryption key is not correctly formatted and the manager pod is deleted, then it can fail to restart with `Too many keys` error."
categories: troubleshooting
slug: too-many-keys
toc: true
---

## Symptoms

You [rotated the encryption key](../../security/data-encryption#rotating-the-encryption-key) and the {{site.data.reuse.eem_manager}} pod fails because the key was formatted incorrectly. You delete the {{site.data.reuse.eem_manager}} pod to resolve the issue. However, when you restart the pod, it goes into a `CrashLoopBackOff` state, and the following error is displayed in the logs:  

```java
ERROR Events Gateway - [lambda$start$15:270] An error occurred starting the gateway verticle Bootstrap.
io.vertx.core.impl.NoStackTraceThrowable: Too many data encryption keys found, unable to start storage provider
```

## Causes

While rotating the encryption key, the manager creates a backup of the current encryption key before the rotation process begins. This backup is not cleared correctly from storage, so the manager has 2 keys instead of 1. 

## Resolving the problem

To resolve the problem, delete the backup key from the underlying file system of the manager pod. The file for the backup key ends with `-dek.enc.bak` and is stored in the root directory of the {{site.data.reuse.eem_manager}} file system.
