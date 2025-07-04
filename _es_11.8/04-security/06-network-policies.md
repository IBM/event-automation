---
title: "Network policies"
excerpt: "Learn about the network connections allowed for Event Streams each pod."
categories: security
slug: network-policies
toc: true
---

## Inbound network connections (ingress)

[Network policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/){:target="_blank"} are used to control inbound connections into pods. These connections can be from pods within the cluster, or from external sources.

When you install an instance of {{site.data.reuse.es_name}}, the required network policies will be automatically created. To review the network policies that have been applied:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to display the installed network policies for a specific namespace:

   ```shell
   kubectl get netpol -n <namespace>
   ```

The following tables provide information about the network policies that are applicable to each pod within the {{site.data.reuse.es_name}} instance. If a particular pod is not required by a given {{site.data.reuse.es_name}} configuration, the associated network policy will not be applied.

**Note:** Where a network policy exposes a port to the {{site.data.reuse.es_name}} Cluster operator, it is configured to allow connections from any namespace.

### Kafka broker pod

| **Type** | **Origin**                                                                                   | **Port** | **Reason**                         | **Enabled in policy**                                                                                  |
|----------|----------------------------------------------------------------------------------------------|----------|------------------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere                                        | 8443     | Kafka readiness metrics                | Always                                                                                                 |
| TCP      | Kafka, Cluster operator, Entity operator, Kafka Cruise Control and Kafka Exporter pods       | 9091     | Broker communication               | Always                                                                                                 |
| TCP      | Anywhere (can be restricted by including `networkPolicyPeers` in the listener configuration) | 9092     | Kafka access for Plain listener    | If the [Plain listener](../../installing/configuring/#kafka-access) is enabled                         |
| TCP      | Anywhere (can be restricted by including `networkPolicyPeers` in the listener configuration) | 9093     | Kafka access for TLS listener      | If the [TLS listener](../../installing/configuring/#kafka-access) is enabled                           |
| TCP      | Anywhere (can be restricted by including `networkPolicyPeers` in the listener configuration) | 9094     | Kafka access for External listener | If the [External listener](../../installing/configuring/#kafka-access) is enabled                      |
| TCP      | Anywhere                                                                                     | 9404     | Prometheus access to Kafka metrics | If [metrics](../../installing/configuring/#configuring-external-monitoring-through-prometheus) are enabled |
| TCP      | Anywhere                                                                                     | 9999     | JMX access to Kafka metrics        | If [JMX port is exposed](../secure-jmx-connections#exposing-a-jmx-port-on-kafka)                       |

**Note:** If required, access to listener ports can be restricted to only those pods with specific labels by including additional configuration in the {{site.data.reuse.es_name}} custom resource under `spec.strimziOverrides.kafka.listeners.<listener>.networkPolicyPeers`.

### Kafka controller pod

| **Type** | **Origin**                                                                     | **Port** | **Reason**                              | **Enabled in policy**                                                                                  |
|----------|--------------------------------------------------------------------------------|----------|-----------------------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere                                        | 8443     | Kafka readiness metrics                | Always                                                                                                 |
| TCP      | Other controllers pods                                                           | 9090     | Kafka control plane | Always |
| TCP      | Anywhere                                                                       | 9404     | Exported Prometheus metrics             | If [metrics](../../installing/configuring/#configuring-external-monitoring-through-prometheus) are enabled |

### Geo-replicator pod

| **Type** | **Origin**                                                  | **Port** | **Reason**                     | **Enabled in policy**                                                                                  |
|----------|-------------------------------------------------------------|----------|--------------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | REST API pods                                               | 8083     | Geo-replicator API traffic     | Always                                                                                                 |
| TCP      | Cluster operator and other geo-replicator pods              | 8083     | Geo-replicator cluster traffic | Always                                                                                                 |
| TCP      | Anywhere                                                    | 9404     | Exported Prometheus metrics    | If [metrics](../../installing/configuring/#configuring-external-monitoring-through-prometheus) are enabled |

### Schema registry pod

| **Type** | **Origin**                                         | **Port** | **Reason**              | **Enabled in policy**                                                                            |
|----------|----------------------------------------------------|----------|-------------------------|--------------------------------------------------------------------------------------------------|
| TCP      | Anywhere                                           | 9443     | External access to API  | Always                                                                                           |
| TCP      | Any pod in {{site.data.reuse.es_name}} instance | 7443     | TLS cluster traffic     | If [internal TLS](../../installing/configuring/#configuring-encryption-between-pods) is enabled  |
| TCP      | Any pod in {{site.data.reuse.es_name}} instance | 7080     | Non-TLS cluster traffic | If [internal TLS](../../installing/configuring/#configuring-encryption-between-pods) is disabled |

### Administration UI pod

| **Type** | **Origin**                             | **Port** | **Reason**               | **Enabled in policy** |
|----------|----------------------------------------|----------|--------------------------|-----------------------|
| TCP      | Anywhere                               | 3000     | External access to UI    | Always                |

### Administration server pod

| **Type** | **Origin**                                         | **Port** | **Reason**              | **Enabled in policy**                                                                            |
|----------|----------------------------------------------------|----------|-------------------------|--------------------------------------------------------------------------------------------------|
| TCP      | Anywhere                                           | 9443     | External access to API  | Always                                                                                           |
| TCP      | Any pod in {{site.data.reuse.es_name}} instance | 7443     | TLS cluster traffic     | If [internal TLS](../../installing/configuring/#configuring-encryption-between-pods) is enabled  |
| TCP      | Any pod in {{site.data.reuse.es_name}} instance | 7080     | Non-TLS cluster traffic | If [internal TLS](../../installing/configuring/#configuring-encryption-between-pods) is disabled |

### REST producer server pod

| **Type** | **Origin**                                         | **Port** | **Reason**              | **Enabled in policy**                                                                            |
|----------|----------------------------------------------------|----------|-------------------------|--------------------------------------------------------------------------------------------------|
| TCP      | Anywhere                                           | 9443     | External access to API  | Always                                                                                           |
| TCP      | Any pod in {{site.data.reuse.es_name}} instance | 7443     | TLS cluster traffic     | If [internal TLS](../../installing/configuring/#configuring-encryption-between-pods) is enabled  |
| TCP      | Any pod in {{site.data.reuse.es_name}} instance | 7080     | Non-TLS cluster traffic | If [internal TLS](../../installing/configuring/#configuring-encryption-between-pods) is disabled |

### Metrics collector pod

| **Type** | **Origin**                                         | **Port** | **Reason**                      | **Enabled in policy**                                                                            |
|----------|----------------------------------------------------|----------|---------------------------------|--------------------------------------------------------------------------------------------------|
| TCP      | Anywhere                                           | 7888     | Exported Prometheus metrics     | Always                                                                                           |
| TCP      | Any pod in {{site.data.reuse.es_name}} instance | 7443     | TLS inbound metrics traffic     | If [internal TLS](../../installing/configuring/#configuring-encryption-between-pods) is enabled  |
| TCP      | Any pod in {{site.data.reuse.es_name}} instance | 7080     | Non-TLS inbound metrics traffic | If [internal TLS](../../installing/configuring/#configuring-encryption-between-pods) is disabled |

### Cluster operator pod

| **Type** | **Origin** | **Port** | **Reason**                             | **Enabled in policy**  |
|----------|------------|----------|----------------------------------------|------------------------|
| TCP      | Anywhere   | 8080     | Exported Prometheus metrics            | Always                 |
| TCP      | Anywhere   | 8081     | `EventStreams` custom resource validator | Always                 |

### Cruise Control pod

| **Type** | **Origin**       | **Port** | **Reason**    | **Enabled in policy** |
|----------|------------------|----------|---------------|-----------------------|
| TCP      | Cluster operator | 9090     | Access to API | Always                |

### Kafka Connect pod

| **Type** | **Origin**                                                  | **Port** | **Reason**                       | **Enabled in policy**                                                                                  |
|----------|-------------------------------------------------------------|----------|----------------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Cluster operator and Kafka Connect pods                     | 8083     | Access to Kafka Connect REST API | Always                                                                                                 |
| TCP      | Anywhere                                                    | 9404     | Exported Prometheus metrics      | If [metrics](../../installing/configuring/#configuring-external-monitoring-through-prometheus) are enabled |


## Outbound network connections (egress)

The following tables provide information about the outbound network connections (egress) initiated by pods in an {{site.data.reuse.es_name}} installation. If a particular pod is not required by an {{site.data.reuse.es_name}} configuration, the associated outbound connection is not applicable.

### Kafka broker pod

| **Type** | **Destination**   | **Pod Label**                               | **Port** | **Reason**                       |
|----------|-------------------|---------------------------------------------|----------|----------------------------------|
| TCP      | Kafka controller         | `app.kubernetes.io/name=kafka, eventstreams.ibm.com/controller-role: 'true'`            | 9090     | Kafka controller communication          |
| TCP      | Kafka broker             | `app.kubernetes.io/name=kafka, eventstreams.ibm.com/broker-role: 'true'`                | 9091     | Kafka broker replication               |

### Kafka controller pod

| **Type** | **Destination**   | **Pod Label**                               | **Port** | **Reason**                       |
|----------|-------------------|---------------------------------------------|----------|----------------------------------|
| TCP      | Kafka controller         | `app.kubernetes.io/name=kafka, eventstreams.ibm.com/controller-role: 'true'`           | 9090     | Kafka controller communication             |

### Geo-replicator pod

| **Type** | **Destination**   | **Pod Label**                               | **Port** | **Reason**                       |
|----------|-------------------|---------------------------------------------|----------|----------------------------------|
| TCP      | Geo-replicator    | app.kubernetes.io/name=kafka-mirror-maker-2 | 8083     | Geo-replicator cluster traffic   |

**Note:** Geo-replicator destination is external to the cluster.

### Schema registry pod

| **Type** | **Destination**   | **Pod Label**                               | **Port** | **Reason**                       |
|----------|-------------------|---------------------------------------------|----------|----------------------------------|
| TCP      | Kafka broker            | `app.kubernetes.io/name=kafka, eventstreams.ibm.com/broker-role: 'true'`                | 9091     | Broker communication             |

### Administration server pod

| **Type** | **Destination**   | **Pod Label**                               | **Port** | **Reason**                       |
|----------|-------------------|---------------------------------------------|----------|----------------------------------|
| TCP      | Kafka broker            | `app.kubernetes.io/name=kafka, eventstreams.ibm.com/broker-role: 'true'`                | 9091     | Broker API traffic               |
| TCP      | Geo-replicator    | app.kubernetes.io/name=kafka-mirror-maker-2 | 8083     | Geo-replicator API traffic       |
| TCP      | Kafka Connect     | app.kubernetes.io/name=kafka-connect        | 8083     | Kafka Connect API traffic        |

### REST producer server pod

| **Type** | **Destination**   | **Pod Label**                               | **Port** | **Reason**                       |
|----------|-------------------|---------------------------------------------|----------|----------------------------------|
| TCP      | Kafka broker            | `app.kubernetes.io/name=kafka, eventstreams.ibm.com/broker-role: 'true'`                | 9091     | Producer messages                |

### Cluster operator pod

| **Type** | **Destination**   | **Pod Label**                               | **Port** | **Reason**                       |
|----------|-------------------|---------------------------------------------|----------|----------------------------------|
| TCP      | Kafka broker            | `app.kubernetes.io/name=kafka, eventstreams.ibm.com/broker-role: 'true'`                | 9091     | Configuration                    |
| TCP      | Geo-replicator    | app.kubernetes.io/name=kafka-mirror-maker-2 | 8083     | Configuration                    |
| TCP      | Kafka Connect     | app.kubernetes.io/name=kafka-connect        | 8083     | Configuration                    |
| TCP      | Admin API         | app.kubernetes.io/name=admin-api            | 7443     | Configuration                    |
| TCP      | Metrics collector | app.kubernetes.io/name=metrics              | 7443     | Configuration                    |
| TCP      | Rest producer     | app.kubernetes.io/name=rest-producer        | 7443     | Configuration                    |

### Cruise Control pod

| **Type** | **Destination**  | **Pod Label**                                | **Port** | **Reason**                       |
|----------|------------------|----------------------------------------------|----------|----------------------------------|
| TCP      | Kafka broker           | `app.kubernetes.io/name=kafka, eventstreams.ibm.com/broker-role: 'true'`                 | 9091     | Kafka broker communication             |
| TCP      | Kafka controller        | `app.kubernetes.io/name=kafka, eventstreams.ibm.com/controller-role: 'true'`            | 9090     | Kafka controller communication     |

### Kafka Connect pod

| **Type** | **Destination**  | **Pod Label**                                | **Port** | **Reason**                       |
|----------|------------------|----------------------------------------------|----------|----------------------------------|
| TCP      | Kafka Connect    | app.kubernetes.io/name=kafka-connect         | 8083     | Access to Kafka Connect REST API |
