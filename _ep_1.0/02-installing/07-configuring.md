---
title: "Configuring"
excerpt: "Configure your Event Processing installation."
categories: installing
slug: configuring
toc: true
---

## Configuring Flink

### Before you begin

Consider the following resources before configuring your `FlinkDeployment` custom resource:

- [Flink documentation](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.5/docs/custom-resource/reference/#flinkdeployment){:target="_blank"}
- [Flink configuration options](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/config/#common-setup-options){:target="_blank"}
- [Flink Event Time and Watermark](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/time/){:target="_blank"}
- [Kafka SQL connector](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/connectors/table/kafka/){:target="_blank"}
- [Flink SQL CREATE statement](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/sql/create/){:target="_blank"}
- [Job and scheduling](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/internals/job_scheduling/){:target="_blank"}

### Configuring Flink checkpointing

When Flink can't complete writing a checkpoint during the checkpointing time interval, the throughput of Flink jobs decreases.
This might happen when Flink jobs experience backpressure, meaning that they can't process events as fast as they are ingested.

The following options can be used to adjust the way checkpoints can be taken in the checkpointing time interval:

- `execution.checkpointing.interval`
- `execution.checkpointing.min-pause`

In addition, two other Flink capabilities can help reduce the time taken to write checkpoints:

- Unaligned checkpoints

  - Set the deployment option `execution.checkpointing.unaligned.enabled` to true.
  - Set the deployment option `execution.checkpointing.max-concurrent-checkpoints` to 1.
  - Set the deployment option `execution.checkpointing.mode` to 'EXACTLY_ONCE'.

- Buffer debloating
  - Set deployment option `taskmanager.network.memory.buffer-debloat.enabled` to `true`. 

For more information about checkpointing under backpressure, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/ops/state/checkpointing_under_backpressure/){:target="_blank"}.

For more information about tuning checkpointing, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/ops/state/large_state_tuning/#tuning-checkpointing){:target="_blank"}.

For more information about checkpointing options, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/config/#checkpointing){:target="_blank"}.

### Configuring RocksDB

RocksDB is an embeddable persistent key-value store for fast storage provided by Flink.

Most of the time, Flink operations such as aggregate, rolling aggregate, and interval join involve a large number of interactions with RocksDB for maintining states.

If the Flink job experiences a fall in throughput due to backpressure, consider enabling the incremental checkpointing Flink capability by setting the deployment option `state.backend.incremental` to `true`. 
For more information about RocksDB state backend, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/ops/state/state_backends/#rocksdb-state-backend-details){:target="_blank"}.

You can tune RocksDB operations to optimize the overall performance of your Flink jobs.

A good starting point is to adjust the way RocksDB keeps states in memory and transfers them to disk, using the following deployment options:

- `state.backend.rocksdb.memory.write-buffer-ratio` (the default value is 0.5).
- `state.backend.rocksdb.memory.high-prio-pool-ratio` (the default value is 0.1).
- `state.backend.rocksdb.checkpoint.transfer.thread.num` (the default value is 4).

For more information about tuning RocksDB, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/ops/state/large_state_tuning/#tuning-rocksdb){:target="_blank"}.


### Configuring parallelism

A Flink program consists of multiple tasks. A task can be split into several parallel instances for execution and each parallel instance processes a subset of the task’s input data. The number of parallel instances of a task is called its parallelism.

In order to increase the throughput of your Flink job, you can perform the following actions:
- Increase the number of partitions in the Kafka ingress topics used by your Flink event sources.
- Set the Flink job parallelism to a value equal to this number of partitions.

For more information, see [Deploying jobs for development purposes](../../advanced/deploying-development) and [Deploying jobs in a production environment](../../advanced/deploying-production).


## Configuring {{site.data.reuse.ep_name}}

### Enabling persistent storage

In order to persist the data input into a {{site.data.reuse.ep_name}} instance, configure persistent storage in your `EventProcessing` configuration.

To enable persistent storage for `EventProcessing`, set `spec.authoring.storage.type` to `persistent-claim`.
Then configure storage in one of the following ways:

- [Dynamic provisioning](#dynamic-provisioning)
- [Providing persistent volume](#providing-persistent-volume)
- [Providing persistent volume and persistent volume claim](#providing-persistent-volume-and-persistent-volume-claim).

Ensure that you have sufficient disk space for persistent storage.

**Note:** `spec.authoring.storage.type` can also be set to `ephemeral`, although no persistence is provisioned with this configuration. This is not recommended for production usage because it results in lost data.

### Dynamic provisioning

If there is a [dynamic storage provisioner](https://docs.openshift.com/container-platform/4.12/storage/dynamic-provisioning.html){:target="_blank"} present on the system, {{site.data.reuse.ep_name}} can use it to dynamically provision the persistence.
To configure this, set `spec.authoring.storage.storageClassName` to the name of the storage class provided by the provisioner.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring
    storage:
      type: persistent-claim
      storageClassName: csi-cephfs
# ...

```
- Optionally, specify the storage size in `storage.size` (for example, `"100GiB"`).
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt"`).
- Optionally, specify the retention setting for the storage if the instance is deleted in `storage.deleteClaim` (for example, `"true"`).


### Providing persistent volume

A persistent volume can be precreated for {{site.data.reuse.ep_name}} to use as storage.
To use a precreated persistent volume set the `spec.authoring.storage.selectors` to match the labels on the precreated persistent volume.
The following example creates a persistent volume claim to bind to a persistent volume with the label `precreated-persistence: my-pv`.
Multiple labels can be added as selectors, the persistent volume must have all labels present to match.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring
    storage:
      type: persistent-claim
      selectors:
        precreated-persistence: my-pv
# ...

```

- Optionally, specify the storage size in `storage.size` (for example, `"100GiB"`).
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt"`).
- Optionally, specify the retention setting for the storage if the instance is deleted in `storage.deleteClaim` (for example, `"true"`).

### Providing persistent volume and persistent volume claim

A persistent volume and persistent volume claim can be precreated for {{site.data.reuse.ep_name}} to use as storage.
To use this method set `spec.authoring.storage.existingClaimName` to match the name of the precreated persistent volume claim.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring
    storage:
      type: persistent-claim
      existingClaimName: 
# ...

```

### Configuring TLS

TLS can be configured for the `EventProcessing` instance in one of the following ways:

- [Operator configured CA certificate](#operator-configured-ca-certificate)
- [User-provided CA certificate](#user-provided-ca-certificate)
- [User-provided certificates](#user-provided-certificates)
- [User-provided UI certificates](#user-provided-ui-certificates)

#### Operator configured CA certificate

By default the operator configures its own TLS.
The operator uses the IBM Certificate Manager installed on the system to generate a CA certificate with a self-signed issuer. It then uses this self signed CA certificate to sign the certificates used for secure communication by the {{site.data.reuse.ep_name}} instance.
IBM Certificate manager puts the CA certificate into a secret named `<my-instance>-ibm-ep-root-ca`.

#### User-provided CA certificate

A custom CA certificate can be provided to the {{site.data.reuse.ep_name}} instance.
The operator uses the IBM Certificate Manager installed on the system to use this provided CA certificate to sign the certificates used for secure communication by the {{site.data.reuse.ep_name}} instance.
To provide a custom CA certificate set `spec.authoring.tls.caSecretName` to be the name of the secret that contains the CA certificate.

The following snippet is an example of a configuration that uses a user provided CA certificate:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring
    tls:
      caSecretName: myCASecret
# ...

```

**Note:** The secret that is referenced here must contain the keys `ca.crt`, `tls.crt`, `tls.key`. The `ca.crt` key and the `tls.crt` key can have the same value.

#### User-provided certificates

A custom certificate can be used for secure communication by the {{site.data.reuse.ep_name}} instance.
This method does not use the IBM Certificate Manager so the certificates that are provided must be managed by the user.
To use a custom certificate set `spec.authoring.tls.secretName` to be the name of the secret containing a CA certificate, server certificate, and a key. The certificate must have the required DNS names.

The following snippet is an example of a configuration that uses a user provided certificate:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring
    tls:
      secretName: mySecret
# ...
```

- Optionally, specify the key in the secret that is pointing to the CA certificate `tls.caCertificate` (default, `ca.crt`).
- Optionally, specify the key in the secret that is pointing to the server certificate `tls.serverCertificate` (default, `tls.crt`).
- Optionally, specify the key in the secret that is pointing to the private key `tls.key` (default, `tls.key`).


#### User-provided UI certificates

A separate custom certificate can be used for the UI. This certificate is presented to the browser when the {{site.data.reuse.ep_name}} user interface is navigated.
To supply a custom certificate to the UI set `spec.authoring.tls.ui.secretName` to be the name of the secret containing the certificate.

The following snippet is an example of a configuration that uses a user provided certificate:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring
    tls:
      ui:
        secretName: myUiSecret
# ...
```

- Optionally, specify the key in the secret that is pointing to the CA certificate `ui.caCertificate` (default, `ca.crt`).
- Optionally, specify the key in the secret that is pointing to the server certificate `ui.serverCertificate` (default, `tls.crt`).
- Optionally, specify the key in the secret that is pointing to the private key `ui.key` (default, `tls.key`).


### Deploy NetworkPolicies

By default, the operator will deploy an instance specific NetworkPolicy when an instance of `EventProcessing` is created.
The deployment of these network policies can be turned off with the property `spec.deployNetworkPolicies`

The following snippet is an example of a configuration that turns off the deployment of the NetworkPolicy:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  deployNetworkPolicies: false
# ...
```

For information, see [Network Policies](../../security/network-policies).