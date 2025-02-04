---
title: "OLM blocks upgrades to 11.6.x due to missing `v1beta1` version in `eventstreams` CRDs"
excerpt: "Find out how to troubleshoot the error when upgrading Event Streams from 11.5.x to 11.6.x"
categories: troubleshooting
slug: crd-version-update-fails-eventstreams
toc: true
---

## Symptoms

When upgrading {{site.data.reuse.es_name}} from 11.5.x to any 11.6.x version, the upgrade fails with an error similar to the following example:

```shell
conditions:
  - lastTransitionTime: '2025-01-26T02:42:13Z'
    lastUpdateTime: '2025-01-26T02:42:13Z'
    message: 'risk of data loss updating "eventstreams.eventstreams.ibm.com": new CRD removes version v1beta1 that is listed as a stored version on the existing CRD'
    reason: InstallComponentFailed
    status: 'False'
    type: Installed
message: 'risk of data loss updating "eventstreams.eventstreams.ibm.com": new CRD removes version v1beta1 that is listed as a stored version on the existing CRD'
phase: Failed
```

## Causes

When moving to a new API version within a Custom Resource Definition (CRD), Kubernetes clusters migrate all instances of a CRD to the new stored version and then update the CRD to remove the reference to the old version from the `status.storedVersions` list. This conversion occurs as a background activity and in some circumstances, it might not be complete before the next CRD change is applied.

When a version listed as `status.storedVersion` is removed by a future CRD version, Operator Lifecycle Manager (OLM) blocks the upgrade.

If the CRDs on the cluster contain references to earlier API version, such as `v1beta1`, in the `status.storedVersions` section, upgrades to {{site.data.reuse.es_name}} 11.6.x are blocked by OLM, as it removes old `apiVersions` from the `eventstreams.eventstreams.ibm.com` CRD.

## Resolving the problem

1. Run the following commands to get a list of CRDs that use the `v1beta1` version:

    ```shell
    oc get crd -o jsonpath='{range .items[*]}{.metadata.name}{" "}{.status.storedVersions}{"\n"}{end}' | grep eventstreams | grep -E 'v1beta1'
    ```

2. Update the `apiVersion` of each resource that uses an earlier version to `v1beta2`, retaining the existing content.

3. After all the resources are migrated to `v1beta2`, run the following command to update the CRD `storedVersions` to `v1beta2`:

    ```shell
    oc patch $(oc get crd -o name | grep eventstreams | grep -v georeplicators) --subresource='status' --type='merge' -p '{"status":{"storedVersions":["v1beta2"]}}'
    ```

    Your system is now ready to upgrade to {{site.data.reuse.es_name}} 11.6.x.

4. Update the `InstallPlan` for OLM to retry the upgrade. For example, if you are planning to upgrade to Event Streams 11.6.0, run the following command:

    ```shell
    oc patch installplan $(oc get installplan | grep ibm-eventstreams.v3.6.0 | awk '{print $1;}') --subresource='status' --type='merge' -p '{"status":{"phase":"Installing"}}'
    ```