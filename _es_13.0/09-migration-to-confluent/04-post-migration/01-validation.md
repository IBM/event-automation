---
title: "Validating your migration"
excerpt: "Verify your migration from Event Streams to Confluent Platform is complete."
categories: migration
slug: validation
toc: true
---

Confirm that all components and applications function as expected and that performance remains within expected parameters before decommissioning {{site.data.reuse.es_name}}.

## Validation checklist
{: #validation-checklist}

Review the following checklist to validate your migration:

- **Data integrity:** Message counts and content match between source and target for every migrated topic.
- **Schema resolution:** Every schema ID embedded in messages resolves on Confluent Schema Registry.
- **Consumer offsets:** Consumers resume at the correct offset with no reprocessing or gaps.
- **Producers:** All producers write to Confluent Platform and no producers write to {{site.data.reuse.es_name}}.
- **Connectors:** Every Kafka Connect connector is `RUNNING` with healthy tasks and no duplicate or missing records at external endpoints.
- **Geo-replication:** Cluster Linking or Replicator flows are healthy and actively replicating. For any mirror topics that have not yet been promoted, verify that mirror lag is `0` before promotion.
- **REST clients:** Kafka Bridge and REST producer clients succeed against the Confluent REST Proxy.
- **Security:** ACLs or RBAC enforce the same access controls as {{site.data.reuse.es_name}} and unauthorized access is denied.
- **Performance:** Throughput and latency remain within expected parameters under representative load.

## Validating data and schemas
{: #data-and-schema-validation}

Validate topic data and schemas by using standard Kafka and Schema Registry tools:

- Check mirror state and lag for Cluster Linking by running the following command:

  ```bash
  kubectl exec -n <cp-namespace> kafka-0 -- kafka-mirrors --describe \
    --links es-to-confluent-link --bootstrap-server <bootstrap-server>
  ```

  Where:
  - `<cp-namespace>` is the Kubernetes namespace where Confluent Platform is deployed.

- Compare end offsets between source and destination by running the following command:

  ```bash
  kubectl exec -n <cp-namespace> kafka-0 -- kafka-get-offsets \
    --bootstrap-server <bootstrap-server> --topic <topic-name>
  ```

  Where:
  - `<cp-namespace>` is the Kubernetes namespace where Confluent Platform is deployed.
  - `<topic-name>` is the name of the topic.

- Verify schema ID resolution on Confluent Schema Registry by running the following command:

  ```bash
  curl -s https://<confluent-sr>:8081/schemas/ids/<id> | jq .
  ```

  Where:
  - `<confluent-sr>` is the host address of Confluent Schema Registry.
  - `<id>` is the schema ID.

For Cluster Linking, a topic is fully replicated when its mirror lag is `0`. For Replicator-based flows, verify the Replicator replication and consumer lag metrics for the topics being migrated, and confirm that the destination has caught up before you proceed.

## Validating consumer offsets
{: #consumer-offset-validation}

Complete the following checks for consumer offsets:

- Describe each consumer group on Confluent and confirm that committed offsets are accurate. Ensure that offsets are not reset to zero and show no unexpectedly large lag.
- Confirm that no consumer reprocesses the full topic history, which indicates that offset synchronization did not complete before switchover.

## Validating performance
{: #performance-validation}

Complete the following checks for performance:

- Run representative producer and consumer load and compare throughput and end-to-end latency against the {{site.data.reuse.es_name}} baseline captured during the [planning](../planning/) phase.
- Verify that tiered storage offloading on Confluent Platform is active (segments appear in the new bucket) if tiered storage is enabled.

After all validation checks pass, proceed to [decommissioning {{site.data.reuse.es_name}}](../decommission/).
