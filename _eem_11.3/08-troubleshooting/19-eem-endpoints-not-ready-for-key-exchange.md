---
title: "Event Manager is in a pending state with `EEM endpoints not ready for key exchange` message"
excerpt: "Event Manager pending with `EEM endpoints not ready for key exchange` message"
categories: troubleshooting
slug: not-ready-key-exchange
toc: true
---

## Symptoms

In {{site.data.reuse.eem_name}} 11.3.0 and earlier, when an {{site.data.reuse.eem_manager}} instance is created with persistent storage, the {{site.data.reuse.eem_manager}} pods fail to start and the following message is displayed in the custom resource status:

```yaml
status:
  conditions:
    - lastTransitionTime: '<timestamp>'
      message: EEM endpoints not ready for key exchange
      reason: Progressing
      status: 'True'
      type: Pending
    - lastTransitionTime: '<timestamp>'
      message: EEM endpoints not ready for key exchange
      reason: Progressing
      status: 'False'
      type: Ready
```

## Causes

{{site.data.reuse.eem_manager}} storage detects the Unix `lost+found` folder in the directory that it is configured to write data to. Consequently, it does not include data encryption keys, and {{site.data.reuse.eem_manager}} waits for them to appear, causing the system to enter a pending state.


## Resolving the problem

To resolve the problem, [upgrade to {{site.data.reuse.eem_name}} 11.3.1](../../installing/upgrading/). If you are not ready to upgrade, complete the following steps to re-create the instance.

1. In the pod terminal, change the directory to where the `lost+found` file is located by using the following command: `cd opt/storage`. 
2. Use `ls` to check that the `lost+found` file exists and that your data encryption keys were not created. 
3. Remove the `lost+found` file by using the following command: `rm -rf lost+found`. 
4. Restart the {{site.data.reuse.eem_manager}} pod to create a new instance.