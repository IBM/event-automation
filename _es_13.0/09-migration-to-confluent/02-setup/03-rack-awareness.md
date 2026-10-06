---
title: "Configuring rack awareness"
excerpt: "Configure rack awareness and RBAC permissions in Confluent for Kubernetes."
categories: migration
slug: migrating-rack-awareness
toc: true
---

Rack awareness is a native Apache Kafka feature that distributes partition replicas across different failure domains, typically Kubernetes availability zones. When you migrate from {{site.data.reuse.es_name}} to Confluent for Kubernetes (CFK), the underlying Kafka behavior is identical, but the operator configuration and RBAC requirements differ.

In CFK, rack awareness is configured on the `Kafka` custom resource by using the `rackAssignment` and `oneReplicaPerNode` settings.

For background on how {{site.data.reuse.es_name}} configures rack awareness across multiple availability zones, see the [multi-zone deployment tutorial](https://ibm.github.io/event-automation/tutorials/multi-zone-tutorial/){:target="_blank"}. For information about confiugring rack awareness in Confluent, see [Confluent documentation](https://docs.confluent.io/operator/current/co-configure-rack-awareness.html){:target="_blank"}.

## How rack awareness works
{: #how-rack-awareness-works}

Both {{site.data.reuse.es_name}} and Confluent for Kubernetes (CFK) set the `broker.rack` property on each broker to the value of a Kubernetes node label such as `topology.kubernetes.io/zone`. Kafka then ensures that no two replicas of the same partition share the same rack, so a zone outage does not cause data loss when the replication factor is 3 or higher.

The key difference is how `broker.rack` is resolved:

- **{{site.data.reuse.es_name}}:** An init container injected into each broker pod reads the node label by using the Kubernetes API and writes the value to the broker configuration.
- **Confluent for Kubernetes:** The broker pod itself reads its own node's zone label directly by using the Kubernetes API at startup, so you must create a dedicated `ServiceAccount` with `get` and `list` permissions on `nodes` and `pods` before deploying the cluster.

The following table summarizes the key configuration differences between {{site.data.reuse.es_name}} and CFK:

| Configuration | {{site.data.reuse.es_name}} | Confluent for Kubernetes |
|---|---|---|
| Kafka `broker.rack` property | Set by init container | Set by broker pod at startup |
| Node label source | `spec.strimziOverrides.kafka.rack.topologyKey` | `spec.rackAssignment.nodeLabels` |
| `ServiceAccount` required | Operator's own `ServiceAccount` | Dedicated `ServiceAccount` created manually |
| RBAC scope | `clusterrolebindings` + `nodes` | `nodes` + `pods` (`get`/`list`) |
| One broker per node | Anti-affinity rules | `oneReplicaPerNode: true` |

## Existing {{site.data.reuse.es_name}} configuration
{: #existing-es-configuration}

The following examples show how rack awareness is configured in {{site.data.reuse.es_name}}. In {{site.data.reuse.es_name}}, rack awareness is enabled by setting `topologyKey` in the `EventStreams` custom resource:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
metadata:
  name: <instance-name>
  namespace: <es-namespace>
spec:
  strimziOverrides:
    kafka:
      rack:
        topologyKey: topology.kubernetes.io/zone
```

Where:
- `<instance-name>` is the name of your {{site.data.reuse.es_name}} instance.
- `<es-namespace>` is the namespace where {{site.data.reuse.es_name}} is deployed.

The accompanying RBAC grants the operator's own `ServiceAccount` (`eventstreams-cluster-operator`) permission to read node labels and manage `ClusterRoleBinding` resources:

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: eventstreams-kafka-broker
rules:
  - apiGroups:
      - rbac.authorization.k8s.io
    resources:
      - clusterrolebindings
    verbs:
      - get
      - create
      - watch
      - update
      - delete
      - list
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
      - create
      - watch
      - update
      - delete
      - list
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: eventstreams-kafka-broker
subjects:
  - kind: ServiceAccount
    name: eventstreams-cluster-operator
    namespace: <operator_namespace>
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: eventstreams-kafka-broker
```

Where `<operator_namespace>` is the namespace where the {{site.data.reuse.es_name}} operator is installed.

**Note:** The `ClusterRole` and `ClusterRoleBinding` resources shown here use standard Kubernetes RBAC APIs and apply to both OpenShift and other Kubernetes platforms. The `ServiceAccount` name (`eventstreams-cluster-operator`) and namespace might differ depending on how the {{site.data.reuse.es_name}} operator was deployed in your environment.

## Before you begin
{: #before-you-begin}

Verify that all worker nodes have a zone label configured. If worker nodes do not have zone labels, rack awareness does not work. Run the following command to check the node zone labels:

```bash
kubectl get node \
  -o=custom-columns=NODE:.metadata.name,ZONE:.metadata.labels."topology\.kubernetes\.io/zone" \
  | sort -k2
```

Example output:

```
NODE          ZONE
worker-1      us-east-1a
worker-2      us-east-1b
worker-3      us-east-1c
```

## Configuring rack awareness in Confluent for Kubernetes
{: #configuring-rack-awareness}

To configure rack awareness in Confluent for Kubernetes, complete the following steps:

### Step 1: Create the ServiceAccount and RBAC resources
{: #step-1-create-serviceaccount-rbac}

Unlike {{site.data.reuse.es_name}}, CFK does not reuse the operator `ServiceAccount`. Before deploying the Kafka cluster, create a dedicated `ServiceAccount`, `ClusterRole`, and `ClusterRoleBinding`.

1. Create `kafka-rack-awareness.yaml`:

   ```yaml
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: <service-account-name>
     namespace: <cp-namespace>
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRole
   metadata:
     name: kafka-rack-awareness
   rules:
     - apiGroups: [""]
       resources:
         - nodes
         - pods
       verbs:
         - get
         - list
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: kafka-rack-awareness
   subjects:
     - kind: ServiceAccount
       name: <service-account-name>
       namespace: <cp-namespace>
   roleRef:
     kind: ClusterRole
     name: kafka-rack-awareness
     apiGroup: rbac.authorization.k8s.io
   ```

   Where:
   - `<service-account-name>` is the name to assign to the `ServiceAccount`, for example, `kafka`.
   - `<cp-namespace>` is the Kubernetes namespace where your Confluent for Kubernetes cluster is deployed.

2. Apply the file:

   ```bash
   kubectl apply -f kafka-rack-awareness.yaml
   ```

### Step 2: Configure the Kafka custom resource
{: #step-2-configure-kafka-cr}

Add the following fields to your `Kafka` custom resource. The `rackAssignment` block replaces `spec.strimziOverrides.kafka.rack.topologyKey` from {{site.data.reuse.es_name}}.

```yaml
spec:
  rackAssignment:
    nodeLabels:
      - topology.kubernetes.io/zone

  podTemplate:
    serviceAccountName: <service-account-name>

  oneReplicaPerNode: true
```

Where `<service-account-name>` is the name of the `ServiceAccount` that you created in [step 1](#step-1-create-serviceaccount-rbac).

The following table describes the rack awareness fields in the `Kafka` custom resource:

| Field | Description |
|---|---|
| `rackAssignment.nodeLabels` | The Kubernetes node label that is used as the rack identifier. |
| `podTemplate.serviceAccountName` | The `ServiceAccount` that grants broker pods access to the Kubernetes API to read zone labels. |
| `oneReplicaPerNode` | Ensures that each broker runs on a separate node for maximum fault isolation. |

## Verifying the configuration
{: #verifying-rack-awareness}

After configuring rack awareness, verify that partition replicas are distributed correctly across availability zones.

- Confirm that each broker pod is scheduled on a different worker node:

  ```bash
  kubectl get pod \
    -o=custom-columns=NODE:.spec.nodeName,NAME:.metadata.name \
    | grep kafka | sort
  ```

  Example output:

  ```
  NODE        NAME
  worker-1    kafka-0
  worker-2    kafka-1
  worker-3    kafka-2
  ```

- Check that `broker.rack` is set correctly inside each broker pod. Repeat for every broker pod in your cluster:

  ```bash
  kubectl exec -it <kafka-pod-name> -- \
    grep 'broker.rack' /opt/confluentinc/etc/kafka/kafka.properties
  ```

  Where `<kafka-pod-name>` is the name of the broker pod, for example, `kafka-0`.

  Example output:

  ```
  broker.rack=us-east-1a
  ```

- For a topic with replication factor 3, confirm that replicas are spread across zones:

  1. Describe the topic to get the replica broker IDs for each partition:

     ```bash
     kubectl exec -it <kafka-pod-name> -- \
       kafka-topics \
         --bootstrap-server <bootstrap-server> \
         --describe \
         --topic <topic-name>
     ```

     Where:
     - `<kafka-pod-name>` is the name of a broker pod, for example, `kafka-0`.
     - `<topic-name>` is the name of the topic to inspect.

     Example output:

     ```
     Topic: <topic-name>    PartitionCount: 3    ReplicationFactor: 3
       Topic: <topic-name>    Partition: 0    Leader: 0    Replicas: 0,1,2    Isr: 0,1,2
       Topic: <topic-name>    Partition: 1    Leader: 1    Replicas: 1,2,0    Isr: 1,2,0
       Topic: <topic-name>    Partition: 2    Leader: 2    Replicas: 2,0,1    Isr: 2,0,1
     ```

     Note the broker IDs in the `Replicas` column (for example, `0,1,2`). These are broker IDs, not zone names. To confirm that each ID maps to a different zone, continue to the next step.

  2. For each broker ID in the `Replicas` list, read the `broker.rack` value from the corresponding broker pod:

     ```bash
     for pod in kafka-0 kafka-1 kafka-2; do
       echo -n "$pod → "; \
       kubectl exec "$pod" -- \
         grep 'broker.rack' /opt/confluentinc/etc/kafka/kafka.properties; \
     done
     ```

     Example output:

     ```
     kafka-0 → broker.rack=us-east-1a
     kafka-1 → broker.rack=us-east-1b
     kafka-2 → broker.rack=us-east-1c
     ```

     If all three broker IDs shown in the `Replicas` column map to different `broker.rack` values (that is, different availability zones), rack awareness is working correctly. If any two brokers share the same zone, review your `rackAssignment` and RBAC configuration.


**Important:** If your rack awareness changes are not taking effect, check the Confluent for Kubernetes operator logs for permission errors. Depending on your cluster configuration, the operator might require additional permissions beyond `nodes` and `pods`.

