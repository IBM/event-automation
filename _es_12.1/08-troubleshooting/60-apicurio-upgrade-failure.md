---
title: "Apicurio V3 fails to start when upgrading"
excerpt: "Find out how to troubleshoot the Apicurio V3 upgrade failing during an Event Streams upgrade"
categories: troubleshooting
slug: apicurio-upgrade-failure
toc: true
---

## Symptoms
{: #symptoms}

When upgrading {{site.data.reuse.es_name}} to version 12.1.0, the Apicurio V3 pods never reach a `ready` state and the Apicurio migration job fails while waiting for the Apicurio Registry to be available.

The logs for the `apicurio-registry` container contain repeated messages similar to the following:

```shell
Request joining group due to: group is already rebalancing
```

## Causes
{: #causes}

The Apicurio Registry creates 2 consumers and 1 producer. In {{site.data.reuse.es_name}} version 12.1.0, a single value is set for the consumer `group.id` property in `apicurio.kafkasql.consumer.group.id`. The Apicurio Registry uses the same `group.id` value for both consumers, which results in both consumers being placed in the same consumer group.

## Resolving the problem
{: #resolving-the-problem}

Each consumer must be created in its own consumer group. The Apicurio Registry generates a unique group id when no value is specified or when a prefix is provided rather than an actual `group.id`.

To resolve the problem, unset the `apicurio.kafkasql.consumer.group.id` property and set the `apicurio.kafkasql.consumer.group-prefix` property instead by using the `APICURIO_REGISTRY_CONFIGURATION` environment variable:

1. Edit the {{site.data.reuse.es_name}} custom resource and add the following to the `spec.apicurioRegistry` section:

   ```yaml
   spec:
     apicurioRegistry:
       env:
         - name: APICURIO_REGISTRY_CONFIGURATION
           value: |
             apicurio.kafkasql.consumer.group-prefix=eventstreams-apicurio-registry-v3-
             apicurio.kafkasql.consumer.group.id=
   ```

2. Delete the failed migration pods to trigger the Apicurio migration job to rerun and complete the migration.