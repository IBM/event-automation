---
title: "Unable to pause or stop geo-replication from the UI on the destination cluster with Keycloak authentication"
excerpt: "Find out how to troubleshoot the issue where geo-replication cannot be paused or stopped from the Event Streams UI on the destination cluster when using Keycloak authentication."
categories: troubleshooting
slug: unable-to-pause-or-stop-geo-replication
toc: true
---

## Symptoms

When using Keycloak authentication, you cannot pause or stop geo-replication from the {{site.data.reuse.es_name}} UI on the destination cluster. The replication status remains `Running`, and selecting `Stop` or `Pause` option has no effect.

The logs show errors similar to the following example:


```markdown
2025-02-17 17:18:52 ERROR com.ibm.eventstreams.georeplication.common.async.TraceablePromise - Promise e237dac1-fbd4-4270-99db-9ea1bd71f6ab
failed31io.vertx.core.impl.NoStackTraceThrowable: User integration-admin does not have permission WRITE for resource __eventstreams_georeplicator_offsets322025-02-17
17:18:52 ERROR com.ibm.eventstreams.georeplication.common.async.TraceablePromise - Promise 1d7ff7d6-10d6-45cf-a224-691b498a1771
failed33io.vertx.core.impl.NoStackTraceThrowable: User integration-admin does not have permission WRITE for resource __eventstreams_georeplicator_offsets342025-02-17
17:18:52 ERROR com.ibm.eventstreams.georeplication.common.async.TraceablePromise - Promise d766cb84-a947-45bc-b243-d4173064f06c
failed35io.vertx.core.impl.NoStackTraceThrowable: User integration-admin does not have permission READ for resource __eventstreams_georeplicator_offsets362025-02-17
17:18:52 ERROR com.ibm.eventstreams.georeplication.common.async.TraceablePromise - Promise 2553fd91-bd2a-495a-ba4e-9ef4f9a4498b
failed37io.vertx.core.impl.NoStackTraceThrowable: User integration-admin does not have permission DESCRIBE for resource __eventstreams_georeplicator_offsets382025-
02-17 17:18:52 ERROR com.ibm.eventstreams.georeplication.common.async.TraceablePromise - Promise 7cc5c4fa-d439-4cc2-a8ca-313d013d9a4d
failed39io.vertx.core.impl.NoStackTraceThrowable: User integration-admin does not have permission DESCRIBE_CONFIGS for resource
__eventstreams_georeplicator_offsets402025-02-17 17:18:52 ERROR com.ibm.eventstreams.georeplication.common.async.TraceablePromise - Promise 3c0f5bfd-6ce3-4f46-8f8c-
c8e32c045ec2 failed41io.vertx.core.impl.NoStackTraceThrowable: User integration-admin does not have permission READ for resource
__eventstreams_georeplicator_offsets422025-02-17 17:18:52 ERROR com.ibm.eventstreams.georeplication.georeplicators.handlers.GeoReplicatorACLPermissionsCheckHandler -
Error in System kafka admin client User integration-admin does not have permission WRITE for resource
__eventstreams_georeplicator_offsets43io.vertx.core.impl.NoStackTraceThrowable: User integration-admin does not have permission WRITE for resource
__eventstreams_georeplicator_offsets
```

## Causes

The `integration-admin` user does not have the required Kafka permissions (READ, WRITE, and DESCRIBE) on the destination cluster. This prevents the UI from managing geo-replication when using Keycloak authentication.


## Resolving the problem

To manage geo-replication in your destination cluster, you must create a `KafkaUser` on the destination {{site.data.reuse.es_name}} cluster with the same name as the Keycloak user (for example, integration-admin) and assign it admin privileges.

To create a `KafkaUser` in the {{site.data.reuse.openshift_short}} UI, complete the following steps:

1. Navigate to the **{{site.data.reuse.es_name}}** installed operator menu and select the **KafkaUser** tab. Click **Create KafkaUser**.
2. Switch to the **YAML view**, if not already selected.
3. Click the **Samples** tab, and then click **Try it** for `AdminUser`.
4. In the **YAML view**, update `metadata.name` from the default `admin` user to match the Keycloak username (for example, `integration-admin`).
5. Update `metadata.labels.eventstreams.ibm.com/cluster` from the default `<cluster-name>` to the name of your {{site.data.reuse.es_name}} instance and click **Create**.

Alternatively, you can [create the `KafkaUser` by using YAML](../../security/managing-access/#creating-a-kafkauser-by-using-yaml) with the `kubectl` or `oc` CLI.

After completing these steps, you can update the geo-replication status by using the {{site.data.reuse.es_name}} UI.