---
title: "OLM blocks upgrades to 11.5.x due to missing `v1alpha1` or `v1beta1` versions in some CRDs"
excerpt: "Find out how to troubleshoot the error when upgrading Event Streams from 11.4.0 to 11.5.x."
categories: troubleshooting
slug: crd-version-update-fails
toc: true
---

## Symptoms

When upgrading {{site.data.reuse.es_name}} from 11.4.0 to any 11.5.x version, the upgrade fails with an error similar to the following example:

```shell
ConstraintsNotSatisfiable
    status: "True"
    type: ResolutionFailed
  - lastTransitionTime: "2024-10-08T11:25:49Z"
    message: 'risk of data loss updating "kafkaconnects.eventstreams.ibm.com": new
      CRD removes version v1beta1 that is listed as a stored version on the existing
      CRD'
    reason: InstallComponentFailed
    status: "True"
    type: InstallPlanFailed
  currentCSV: ibm-eventstreams.v3.5.0
  ```

## Causes

When moving to a new API version within a Custom Resource Definition (CRD), Kubernetes clusters migrate all instances of a CRD to the new stored version and then update the CRD to remove the reference to the old version from the `status.storedVersions` list. This conversion occurs as a background activity and in some circumstances, it might not be complete before the next CRD change is applied.

When a version listed as `status.storedVersion` is removed by a future CRD version, Operator Lifecycle Manager (OLM) blocks the upgrade.

If the CRDs on the cluster contain references to earlier API versions, such as `v1alpha1` and `v1beta1`, in the `status.storedVersions` section, upgrades to {{site.data.reuse.es_name}} 11.5.x are blocked by OLM, as it removes old `apiVersions` from the following CRDs:

- kafkas.eventstreams.ibm.com
- kafkausers.eventstreams.ibm.com
- kafkatopics.eventstreams.ibm.com
- kafkarebalances.eventstreams.ibm.com
- kafkamirrormaker2s.eventstreams.ibm.com
- kafkabridges.eventstreams.ibm.com
- kafkaconnects.eventstreams.ibm.com
- kafkaconnectors.eventstreams.ibm.com

## Resolving the problem

1. Run the following commands to get a list of CRDs that use the `v1alpha1` or `v1beta1` version:

   ```shell
   oc get kafkas.eventstreams.ibm.com,kafkausers.eventstreams.ibm.com,kafkatopics.eventstreams.ibm.com,kafkarebalances.eventstreams.ibm.com,kafkamirrormaker2s.eventstreams.ibm.com,kafkabridges.eventstreams.ibm.com,kafkaconnects.eventstreams.ibm.com,kafkaconnectors.eventstreams.ibm.com - range .items {% raw %}{{ printf "%s %s %s\n" .metadata.name .kind .apiVersion }}{% endraw %} end -' | grep v1alpha1
   ```

   ```shell
   oc get kafkas.eventstreams.ibm.com,kafkausers.eventstreams.ibm.com,kafkatopics.eventstreams.ibm.com,kafkarebalances.eventstreams.ibm.com,kafkamirrormaker2s.eventstreams.ibm.com,kafkabridges.eventstreams.ibm.com,kafkaconnects.eventstreams.ibm.com,kafkaconnectors.eventstreams.ibm.com - range .items {% raw %}{{ printf "%s %s %s\n" .metadata.name .kind .apiVersion }}{% endraw %} end -' | grep v1beta1
   ```

1. Update the `apiVersion` of each resource that uses an earlier version to `v1beta2`, retaining the existing content.
    
1. After all the resources are migrated to `v1beta2`, run the following command to update the CRD `storedVersions` to `v1beta2`:

   ```shell
   oc patch $(oc get crd -o name | grep eventstreams | grep kafka) --subresource='status' --type='merge' -p '{"status":{"storedVersions":["v1beta2"]}}'
   ```
Your system is now ready to upgrade to {{site.data.reuse.es_name}} 11.5.x.
  
1. Update the `InstallPlan` for OLM to retry the upgrade. For example, if you are planning to upgrade to {{site.data.reuse.es_name}} 11.5.0, run the following command:

   ```shell
   oc patch installplan $(oc get installplan | grep ibm-eventstreams.v3.5.0 | awk '{print $1;}') --subresource='status' --type='merge' -p '{"status":{"phase":"Installing"}}'
   ```
