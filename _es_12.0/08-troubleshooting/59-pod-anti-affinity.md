---
title: "Pod anti-affinity rules are not set up properly for Kafka Node Pools"
excerpt: "Learn how to troubleshoot Kafka broker pods being scheduled on the same node due to missing or misconfigured anti-affinity rules in Event Streams."
categories: troubleshooting
slug: pod-anti-affinity
toc: true
---

## Symptoms
{: #symptoms}

You run the `kubectl get pods -n <namespace> -o wide` command to check the Kafka broker pods and see an output similar to the following:

```shell
kubectl get pods -n <namespace> -o wide

NAME                     READY   STATUS    RESTARTS   AGE     IP               NODE                       NOMINATED NODE   READINESS GATES
affinity-controller-0    1/1     Running   0          2m46s   10.144.16.142    worker0.my-cluster.cp      <none>           <none>
affinity-controller-1    1/1     Running   0          2m46s   10.144.28.180    worker0.my-cluster.cp      <none>           <none>
affinity-xhmp6           1/1     Running   0          2m42s   10.144.28.136    worker0.my-cluster.cp      <none>           <none>
```

Kafka broker pods are scheduled on the same worker node, which reduces fault tolerance and resilience.

## Causes
{: #causes}

In {{site.data.reuse.es_name}} 12.0.x, the default pod anti-affinity rules are not optimized for KRaft-based deployments. If no rules are configured, the Kubernetes scheduler might place multiple Kafka broker pods on the same node.

## Resolving the problem
{: #resolving-the-problem}

To ensure Kafka broker pods are distributed across multiple nodes, you must configure custom pod anti-affinity rules manually in each Kafka Node Pool.

Update your `EventStreams` custom resource to include anti-affinity rules under `spec.strimziOverrides.nodePools.template.pod.affinity`.

For example:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  strimziOverrides:
    kafka:
      # ...
    nodePools:
      - name: kafka
        replicas: 2
        roles:
          - broker
        storage:
          # ...
        template:
          pod:
            affinity:
              podAntiAffinity:
                preferredDuringSchedulingIgnoredDuringExecution:
                  - weight: 10
                    podAffinityTerm:
                      labelSelector:
                        matchExpressions:
                          - key: eventstreams.ibm.com/pool-name
                            operator: In
                            values:
                              - kafka
                      topologyKey: kubernetes.io/hostname
                  - weight: 5
                    podAffinityTerm:
                      labelSelector:
                        matchExpressions:
                          - key: eventstreams.ibm.com/cluster
                            operator: In
                            values:
                              - min-prod-scram
                          - key: eventstreams.ibm.com/component-type
                            operator: In
                            values:
                              - kafka
                      topologyKey: kubernetes.io/hostname

```

The previous example defines two preferred pod anti-affinity rules that improve Kafka pod distribution across nodes:

- Rule 1 (weight 10): Aims to place pods from the same node pool on different hosts.
- Rule 2 (weight 5): Aims to place Kafka pods from the same {{site.data.reuse.es_name}} instance on different hosts.
