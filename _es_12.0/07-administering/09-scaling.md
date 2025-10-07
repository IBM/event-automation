---
title: "Scaling"
excerpt: "Modify the capacity of your system by scaling it."
categories: administering
slug: scaling
toc: true
---

You can modify the capacity of your {{site.data.reuse.es_name}} system in a number of ways. See the following sections for details about the different methods, and their impact on your installation.

The [pre-requisite](../../installing/prerequisites/) guidance gives various examples of different production configurations on which you can base your deployment. To verify it meets your requirements, you should test the system with a workload that is representative of the expected throughput. For this purpose, {{site.data.reuse.es_name}} provides a [workload generator application](../../getting-started/testing-loads/) to test different message loads.

If this testing shows that your system does not have the capacity needed for the workload, whether this results in excessive lag or delays, or more extreme errors such as `OutOfMemory` errors, then you can incrementally make the increases detailed in the following sections, re-testing after each change to identify a configuration that meets your specific requirements.

A [performance report]({{ 'pdfs' | relative_url }}/11.0.4 Performance Report_v3.pdf){:target="_blank"} based on example case studies is also available to provide guidance for setting these values.

**Note:** Although the testing for the report was based on Apache Kafka version 2.3.0, the performance numbers are broadly applicable to current versions of Kafka as well. 

## Modifying the settings
{: #modifying-the-settings}

These settings are defined in the `EventStreams` custom resource under the `spec.strimziOverrides` property. For more information on modifying these settings see [modifying installation](../modifying-installation).

## Increase the number of Kafka brokers in the cluster
{: #increase-the-number-of-kafka-brokers-in-the-cluster}

The number of Kafka brokers is defined in the `EventStreams` custom resource in the `spec.strimziOverrides.nodePools` section.

You can scale your Kafka cluster by either:

- Increasing the number of brokers in an existing pool by updating the replicas value.
- Adding a new Kafka node pool by defining a new entry under `spec.strimziOverrides.nodePools` and specifying a unique name and the desired number of replicas.

For example to configure {{site.data.reuse.es_name}} to use 6 Kafka brokers in a pool:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  strimziOverrides:
    nodePools:
      - name: kafka
        replicas: 6
```

**Note:** Controller node pools cannot be scaled or modified dynamically in KRaft mode. For more information, see [KRaft limitations](../../installing/configuring/#kraft-limitations).

For more information about scaling up Kafka node pools, see the [Strimzi documentation](https://strimzi.io/docs/operators/in-development/deploying?utm_source#proc-scaling-up-node-pools-str).

## Increase the CPU request or limit settings for the Kafka brokers
{: #increase-the-cpu-request-or-limit-settings-for-the-kafka-brokers}

The CPU settings for the Kafka brokers are defined in the `EventStreams` custom resource in the `requests` and `limits` properties under `spec.strimziOverrides.kafka.resources` (for all brokers in the Kafka cluster) or under `spec.strimziOverrides.nodePools[].resources` (for brokers within a node pool).

**Example 1: Configure same CPU Settings for all node pools**

To configure {{site.data.reuse.es_name}} Kafka brokers in all pools to have a CPU request set to 2 CPUs and limit set to 4 CPUs:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      # ...
      resources:
        requests:
          cpu: 2000m
        limits:
          cpu: 4000m
      # ...
```
This configuration applies the same CPU settings across all pools. A description of the syntax for these values can be found in the [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-cpu){:target="_blank"}.

**Example 2: Configure different CPU settings for specific node pools**

If you need to set different resource configurations for individual Kafka node pools, you can define the resource properties under `spec.strimziOverrides.nodePools.resources`.

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  strimziOverrides:
    # ...
      nodePools:
        - name: kafka
          resources:
            requests:
              cpu: 2000m
            limits:
              cpu: 4000m
          # ...
        - name: kafka-2
          resources:
            requests:
              cpu: 4000m
            limits:
              cpu: 8000m
          # ...
```

## Increase the memory request or limit settings for the Kafka brokers and Kafka controller nodes
{: #increase-the-memory-request-or-limit-settings-for-the-kafka-brokers-and-kafka-controller-nodes}

The memory settings for the Kafka brokers and controller nodes are defined in the `EventStreams` custom resource in the `requests` and `limits` properties under `spec.strimziOverrides.nodePools[].resources`, based on the assigned roles.

Alternatively, to apply the same memory settings to all Kafka nodes, you can configure them globally under `spec.strimziOverrides.kafka.resources` in the `EventStreams` custom resource. All Kafka node pools will automatically inherit these settings unless overridden at the node pool level.

For example to configure a pool of Kafka brokers and controllers to have a memory request set to `4GB` and limit set to `8GB`:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      # ...
    nodePools:
      - name: kafka
        role: broker
        resources:
          requests:
            memory: 4096Mi
          limits:
            memory: 8096Mi
      - name: controller
        role: controller
        resources:
          requests:
            memory: 4096Mi
          limits:
            memory: 8096Mi
```

The syntax for these values can be found in the [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-memory){:target="_blank"}.


## Modifying the resources available to supporting components
{: #modifying-the-resources-available-to-supporting-components}

The resource settings for each supporting component are defined in the `EventStreams` custom resource in their corresponding component key the `requests` and `limits` properties under `spec.<component>.resources`.
For example, to configure the Apicurio Registry to have a memory request set to `4GB` and limit set to `8GB`:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  apicurioRegistry:
    # ...
    resources:
      requests:
        memory: 4096Mi
      limits:
        memory: 8096Mi
```

The syntax for these values can be found in the [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-memory){:target="_blank"}.


## Modifying the JVM settings for Kafka brokers
{: #modifying-the-jvm-settings-for-kafka-brokers}

If you have specific requirements, you can modify the JVM settings for the Kafka brokers.

**Note:** Take care when modifying these settings as changes can have an impact on the functioning of the product.

**Note:** Only a [selected subset](https://strimzi.io/docs/operators/latest/configuring.html#con-common-configuration-jvm-reference){:target="_blank"} of the available JVM options can be configured.

JVM settings for the pools of Kafka brokers are defined in the `EventStreams` custom resource in the `spec.strimziOverrides.kafka.jvmOptions` property for all Kafka brokers. Alternatively, you can configure the JVM settings separately for each Kafka node pool by using `spec.strimziOverrides.kafka.nodePools.jvmOptions`. 

For example, to set JVM options for all Kafka brokers:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  strimziOverrides:
    # ...
    kafka:
      # ...
      jvmOptions:
        -Xms: 4096m
        -Xmx: 4096m
```

## Increase the disk space available to each Kafka broker
{: #increase-the-disk-space-available-to-each-kafka-broker}

The Kafka brokers need sufficient storage to meet the retention requirements for all of the topics in the cluster. Disk space requirements grow with longer retention periods for messages, increased message sizes and additional topic partitions.

The amount of storage made available to brokers in Kafka node pools is defined at the time of installation in the `EventStreams` custom resource in the `spec.strimziOverrides.nodePools[].storage.size` property. For example:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  strimziOverrides:
    # ...
      nodePools:
        - name: kafka
          storage:
            # ...
            size: 100Gi
```
