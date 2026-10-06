---
title: "Decommissioning Event Streams"
excerpt: "Remove your Event Streams instance after migration to Confluent Platform."
categories: migration
slug: decommission
toc: true
---

Remove your {{site.data.reuse.es_name}} instance and any remaining infrastructure after all components and applications are validated on Confluent Platform.

**Important:** Do not start this phase until [validation](../validation/) is complete. Until {{site.data.reuse.es_name}} is deleted, you can still roll back to it.

## Decommissioning checklist
{: #decommission-checklist}

Review the following checklist before and during the decommissioning process:

- Complete all checks in the [validation](../validation/) page before starting decommissioning.
- Confirm that no client applications are connecting to {{site.data.reuse.es_name}}. Check broker connection metrics and consumer groups for any remaining activity.
- Confirm that all topics required for migration have been promoted and validated, and that no mirror topics are still active on the `ClusterLink`.
- If tiered storage is enabled, archive the {{site.data.reuse.es_name}} object-storage data before deleting or releasing the storage.
- Delete the {{site.data.reuse.es_name}} instance and the custom resources managed by it.
- Remove the {{site.data.reuse.es_name}} operator if no other {{site.data.reuse.es_name}} instances remain.
- Release the infrastructure that was used only by {{site.data.reuse.es_name}}, including persistent volume claims (PVCs), routes, load balancers, firewall rules, and the source object storage bucket after confirming the archive.
- Update runbooks, monitoring configurations, and on-call references to reflect Confluent Platform only.

## Decommissioning steps
{: #order-of-operations}

Complete the decommissioning tasks in the following order:

1. **Verify that {{site.data.reuse.es_name}} is idle:** Confirm that no producers, consumers, connectors, or REST clients are connected. Broker metrics must show zero client traffic before you proceed.
2. **Remove MirrorMaker 2:** If your deployment used MirrorMaker 2 for geo-replication, remove the `KafkaMirrorMaker2` custom resource and any associated MirrorMaker 2 resources after confirming that the replacement Cluster Linking or Replicator flows on Confluent Platform are healthy with zero lag.
3. **Delete the ClusterLink:** Delete the `ClusterLink` custom resource or stop the Confluent Replicator connector. Confirm that no mirror topics remain active before deleting the cluster link.
4. **Archive before deleting:** If tiered storage is enabled, archive the {{site.data.reuse.es_name}} object-storage data and any other operational data that you need to retain before deletion.
5. **Delete {{site.data.reuse.es_name}} resources:** Remove the `EventStreams` custom resource and the custom resources managed by it, and wait for the deletion to complete.
6. **Release infrastructure:** Delete the PVCs, remove OpenShift routes, load balancers, and firewall rules used only by {{site.data.reuse.es_name}}, and delete the source object-storage bucket after confirming the archive.

## Post-decommissioning tasks
{: #post-decommission}

- Kafka version upgrades and any Confluent Platform configuration changes that were deferred during the migration can now be planned and carried out as separate activities.
- Remove any {{site.data.reuse.es_name}}-specific tools, such as the `kubectl es` CLI plug-in and dashboards, and standardize on the Confluent CLI and Confluent Control Center.

Migration is complete when {{site.data.reuse.es_name}} and all associated infrastructure are removed and all components and applications are running on Confluent Platform.
