---
title: "Configuring"
excerpt: "Configure your Event Processing installation."
categories: installing
slug: configuring
toc: true
---

Configure your Flink and {{site.data.reuse.ep_name}} deployments as follows.

## Configuring Flink

Consider the following resources before configuring your `FlinkDeployment` custom resource:


- [Flink documentation](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.11/docs/custom-resource/reference/#flinkdeployment){:target="_blank"}
- [Flink configuration options](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/deployment/config/#common-setup-options){:target="_blank"}
- [Flink Event Time and Watermark](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/time/){:target="_blank"}
- [Kafka SQL connector](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/kafka/){:target="_blank"}
- [Flink SQL CREATE statement](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/sql/create/){:target="_blank"}
- [Job and scheduling](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/internals/job_scheduling/){:target="_blank"}

### Configuring TLS to secure communication with Flink deployments

You can configure TLS to secure communication with Flink deployments.

Before you create a Flink instance, create a secret that contains the JKS truststore, which you will be using for your `FlinkDeployment` instances and a secret that contains the password for this JKS truststore. The truststore secret must be called `flink-operator-cert` with the key in the secret defined as `truststore.jks`. The truststore password must be defined in the secret `operator-certificate-password` with the key in the secret set as `password` and the associated value being the password.


To create truststores and keystores, complete any one of the following methods:

- See the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/deployment/security/security-ssl/#creating-and-deploying-keystores-and-truststores){:target="_blank"} to manually create keystores and truststores.

- Use the cert-manager operator to create and manage these stores for you. A number of sample configuration files are available in [GitHub](https://ibm.biz/ea-flink-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.ibm_flink_operator}} version, and then go to `/tls-setup` to access the samples. You can also use the Apache Flink samples to create the required keystores and truststores.

  For example, see Flink TLS enabled [pre-install sample](https://github.com/apache/flink-kubernetes-operator/blob/main/examples/flink-tls-example/pre-install.yaml){:target="_blank"} and the [basic secure sample](https://github.com/apache/flink-kubernetes-operator/blob/main/examples/flink-tls-example/basic-secure.yaml){:target="_blank"}, which you can modify to suit your requirements.

  The sample files mentioned earlier creates a self-signed issuer and creates a CA certificate using that self-signed issuer. Then, a CA issuer is created using the generated CA certificate. Additionally, 2 JKS certificates are created, one for the Flink operator, and another for a Flink instance called `basic-secure`.

  For more information about CA issuers, see the [cert-manager documentation](https://cert-manager.io/docs/configuration/selfsigned/#bootstrapping-ca-issuers){:target="_blank"}.

  **Note:** 

  - Ensure that the namespace you are running in and the DNS names used in the certificate match the values of your Flink instance. For example:

    ```yaml
    spec:
      dnsNames:
        - '*.<your-namespace>.svc'
        - '*.svc.cluster.local'
        - '<name-of-your-instance>-rest'
    ```

  - Change the password used for the JKS certificates by providing a Base64-encoded string of the password.
  - Try to increase the lifetime of the CA certificate by adding a duration field to your certificate YAML:

    ```yaml
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
      name: flink-ca-cert
    spec:
      duration: 17520h
      isCA: true
    ```

  **Note:** If you are installing the Flink instance in all namespaces, you should replace the certificate issuer with a cluster issuer so that the operator can communicate with Flink instances in any namespace. The self-signed issuer and the CA certificate must be created in the namespace where the cert-manager operator is installed.

After you created the truststore and keystore secrets, update the `FlinkDeployment`custom resource and `EventProcessing` custom resource as described in [installing](../installing#install-a-flink-instance).

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

For more information about checkpointing under backpressure, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/checkpointing_under_backpressure/){:target="_blank"}.

For more information about tuning checkpointing, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/large_state_tuning/#tuning-checkpointing){:target="_blank"}.

For more information about checkpointing options, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/deployment/config/#checkpointing){:target="_blank"}.

### Configuring RocksDB

RocksDB is an embeddable persistent key-value store for fast storage provided by Flink.

Most of the time, Flink operations such as aggregate, rolling aggregate, and interval join involve a large number of interactions with RocksDB for maintaining states.

If the Flink job experiences a fall in throughput due to backpressure, consider enabling the incremental checkpointing Flink capability by setting the deployment option `execution.checkpointing.incremental` to `true`. 
For more information about RocksDB state backend, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/state_backends/#rocksdb-state-backend-details){:target="_blank"}.

You can tune RocksDB operations to optimize the overall performance of your Flink jobs.

A good starting point is to adjust the way RocksDB keeps states in memory and transfers them to disk, using the following deployment options:

- `state.backend.rocksdb.memory.write-buffer-ratio` (the default value is 0.5).
- `state.backend.rocksdb.memory.high-prio-pool-ratio` (the default value is 0.1).
- `state.backend.rocksdb.checkpoint.transfer.thread.num` (the default value is 4).

For more information about tuning RocksDB, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/large_state_tuning/#tuning-rocksdb){:target="_blank"}.

### Configuring parallelism

A Flink program is made up of many tasks. Each task can be broken down into smaller, identical instances that run at the same time. These instances work on different parts of the task's input data. The number of instances a task is split into is called its parallelism.


To increase the throughput of your Flink job, perform the following actions:

- Increase the number of partitions in the Kafka ingress topics used by your Flink event sources.
- Set the Flink job parallelism to a value equal to this number of partitions.

For more information, see the following sections:

- [Deploying jobs customized for production or test environments](../../advanced/deploying-customized)
- [Deploying jobs in development environments by using the Flink SQL client](../../advanced/deploying-development)
- [Deploying jobs in production environments by using the Apache SQL Runner sample](../../advanced/deploying-production).

### Configuring persistent storage

Persistent storage is required for Flink to be able to recover from transient failures, to create savepoints and to be restored from savepoints, and for configuring High Availability for Flink Job Managers.

To configure persistent storage, complete the following steps:

1. [Deploy the Flink PersistentVolumeClaim (PVC)](../planning/#deploying-the-flink-pvc).

2. Deploy the Flink instance by using a `FlinkDeployment` custom resource with persistent storage configured. See the following example for the relevant persistent storage settings in the custom resource:

   ```yaml
   spec:
     [...]
     flinkConfiguration:
       [...]
       execution.checkpointing.dir: 'file:///opt/flink/volume/flink-cp'
       execution.checkpointing.num-retained: '3'
       execution.checkpointing.savepoint-dir: 'file:///opt/flink/volume/flink-sp'
     podTemplate:
       apiVersion: v1
       kind: Pod
       metadata:
         name: pod-template
       spec:
         containers:
           - name: flink-main-container
             volumeMounts:
           - name: flink-volume
             mountPath: /opt/flink/volume
         volumes:
           - name: flink-volume
             persistentVolumeClaim:
               claimName: ibm-flink-pvc
   ```

**Note:** All the [Flink sample deployments](../planning/#flink-sample-deployments) are configured with persistent storage, except the Quick Start sample.

### Configuring High Availability for Job Manager

1. [Configure persistent storage](#configuring-persistent-storage). Persistent storage is required to configure High Availability for the Flink Job Manager.

2. Deploy the Flink instance by using a `FlinkDeployment` custom resource with High Availability configured. See the following example for the relevant High Availability settings in the custom resource:

   ```yaml
   spec:
     [...]
     flinkConfiguration:
       [...]
       high-availability.type: org.apache.flink.kubernetes.highavailability.KubernetesHaServicesFactory
       high-availability.storageDir: 'file:///opt/flink/volume/flink-ha'
     podTemplate:
       apiVersion: v1
       kind: Pod
       metadata:
         name: pod-template
       spec:
         affinity:
           podAntiAffinity:
             preferredDuringSchedulingIgnoredDuringExecution:
             - weight: 80
               podAffinityTerm:
                 labelSelector:
                   matchExpressions:
                   - key: type
                     operator: In
                     values:
                     - flink-native-kubernetes
                 topologyKey: kubernetes.io/hostname
     jobManager:
       replicas: 2
   ```


**Note:** The Flink samples [Production](../planning/#flink-production-sample) and [Production - Flink Application cluster](../planning/#flink-production-application-cluster-sample) are configured with High Availability for the Flink Job Manager.

**Important:** To ensure the automatic restart of Flink jobs if the cluster restarts, the Flink instances in [session cluster mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} must be configured with High Availability for the Flink Job Manager.

## Configuring `FlinkSessionJob` custom resource
{: #configuring-flinksessionjob}

The following resources are valuable to read before configuring your `FlinkSessionJob` custom resource:

- [Flink documentation](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.11/docs/custom-resource/reference/#flinksessionjob){:target="_blank"}
- [Job and scheduling](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/internals/job_scheduling/){:target="_blank"}

### Configuring session job resource to submit a job to session cluster
{: #configuring-sessioncluster-flinksessionjob}


1. A [Flink session cluster](../installing/#install-a-flink-instance) is deployed and running.
2. Set the `spec.deploymentName` to the name of the Flink session cluster name in the `FlinkSessionJob` custom resource. For example:

   ```yaml
   spec:
     deploymentName: session-cluster-minimal-prod
     job:
       jarURI: <URI of the job jar>
   ```

### Configuring session job resource to submit a job from private registry 
{: #configuring-privateregistry-flinksessionjob}

If a Flink job JAR file is in a registry which requires basic authentication, you must specify custom HTTP headers with the information about your credentials when downloading artifacts for Flink deployments.

1. A [Flink session cluster](../installing/#install-a-flink-instance) is deployed and running.
2. Set `spec.deploymentName` to the name of the Flink session cluster instance in the `FlinkSessionJob` custom resource. For example:

3. In the `spec.flinkConfiguration` section, set the value of `kubernetes.operator.user.artifacts.http.header` field to a custom HTTP header with information about credentials for obtaining the session job artifacts. See the [Flink documentation](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.11/docs/operations/configuration/#resourceuser-configuration){:target="_blank"} for more information about custom HTTP headers.

   For example, if you are using a basic authentication, specify the custom HTTP header as follows:

   ```yaml
   spec:
     flinkConfiguration:
       kubernetes.operator.user.artifacts.http.header: 'Authorization: Basic <Base64-encoded credentials>'
     deploymentName: session-cluster-minimal-prod
     job:
       jarURI: <URI of the job jar>
   ```

## Configuring {{site.data.reuse.ep_name}}

### Enabling persistent storage

In order to persist the data input into a {{site.data.reuse.ep_name}} instance, configure persistent storage in your `EventProcessing` configuration.

To enable persistent storage for `EventProcessing`, set `spec.authoring.storage.type` to `persistent-claim`.
Then configure storage in one of the following ways:

- [Dynamic provisioning](#dynamic-provisioning)
- [Providing persistent volume](#providing-persistent-volumes)
- [Providing persistent volume and persistent volume claim](#providing-persistent-volume-and-persistent-volume-claim).

Ensure that you have sufficient disk space for persistent storage.

**Note:** `spec.authoring.storage.type` can also be set to `ephemeral`, although no persistence is provisioned with this configuration. This is not recommended for production usage because it results in lost data.

### Dynamic provisioning

If there is a [dynamic storage provisioner](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/storage/dynamic-provisioning){:target="_blank"} present on the system, {{site.data.reuse.ep_name}} can use it to dynamically provision the persistence.
To configure this, set `spec.authoring.storage.storageClassName` to the name of the storage class provided by the provisioner.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring:
    storage:
      type: persistent-claim
      storageClassName: csi-cephfs
# ...

```

- Optionally, specify the storage size in `storage.size` (for example, the default value used would be `"100Mi"`). Ensure that the [quantity suffix](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/quantity/), such as `Mi` or `Gi`, is included.
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt/storage"`).
- Optionally, specify the retention setting for the storage if the instance is deleted in `storage.deleteClaim` (for example, `"true"`).


### Providing persistent volumes

Before installing {{site.data.reuse.ep_name}}, you can create a persistent volume for it to use as storage.
To use a persistent volume that you created earlier, set the `spec.authoring.storage.selectors` to match the labels on the persistent volume and set the `spec.authoring.storage.storageClassName` to match the `storageClassName` on the persistent volume.
The following example creates a persistent volume claim to bind to a persistent volume with the label `precreated-persistence: my-pv` and `storageClassName: manual`.
Multiple labels can be added as selectors, and the persistent volume must have all labels present to match.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring:
    storage:
      type: persistent-claim
      selectors:
        precreated-persistence: my-pv
      storageClassName: manual
# ...

```

- Optionally, specify the storage size in `storage.size` (for example, the default value used would be `"100Mi"`). Ensure that the [quantity suffix](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/quantity/), such as `Mi` or `Gi`, is included.
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt/storage"`).
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
  authoring:
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

By default, the operator configures its own TLS.
The operator uses the Cert Manager installed on the system to generate a CA certificate with a self-signed issuer. It then uses this self signed CA certificate to sign the certificates used for secure communication by the {{site.data.reuse.ep_name}} instance.
Cert manager puts the CA certificate into a secret named `<my-instance>-ibm-ep-root-ca`.

The Cert Manager and the {{site.data.reuse.ep_name}} will create the following objects:


- Cert Manager Issuers:
  - `<my-instance>-ibm-eventprocessing`
  - `<my-instance>-ibm-eventprocessing-selfsigned`

  The following snippet is an example of a configuration that uses a user provided CA certificate:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring:
    tls:
      caSecretName: myCASecret
# ...
```

#### User-provided CA certificate

You can provide a custom CA certificate to the {{site.data.reuse.ep_name}} instance.
The operator uses the Cert Manager installed on the system to create the certificates used for secure communication by the {{site.data.reuse.ep_name}} instance. The certificates are signed by using the provided CA certificate.

The CA secret that is created and referenced in the Cert Manager must contain the keys `ca.crt`, `tls.crt`, `tls.key`. The `ca.crt` key and the `tls.crt` key can have the same value.

See the following example to use the user provided certificate files (`ca.crt`, `tls.crt`, and `tls.key`):

1. Set a variable for the `NAMESPACE` by running the following command:

   ```shell
   export NAMESPACE=<instance namespace>
   ```

2. Create the CA secret by running the following command:

   ```shell
   kubectl create secret generic ca-secret-cert --from-file=ca.crt=ca.crt --from-file=tls.crt=tls.crt --from-file=tls.key=tls.key -n ${NAMESPACE}
   ```

3. To provide a custom CA certificate secret, set `spec.authoring.tls.caSecretName` field to be the name of the CA certificate secret that contains the CA certificate.

The following code snippet is an example of a configuration that uses the CA certificate secret that is created in the previous steps:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring:
    tls:
      caSecretName: ca-secret-cert
# ...
```

**Note:** The secret that is referenced here must contain the keys `ca.crt`, `tls.crt`, `tls.key`. The `ca.crt` key and the `tls.crt` key can have the same value.

#### User-provided certificates

You can use a custom certificate for secure communication by the {{site.data.reuse.ep_name}} instance. You can use the OpenSSL tool to generate a CA and certificates that are required for an {{site.data.reuse.ep_name}} instance.

**Note:** The `envsubst` utility is available on Linux and can be installed by default as part of the `gettext` package.

See the following example for setting up OpenSSL tool to generate a CA and Certificate required for an {{site.data.reuse.ep_name}} instance:

1. If you are using a MAC, the following packages are required and can be installed by using `HomeBrew`:

   - gettext
   - openssl@3

   ```shell
   brew install gettext openssl@3
   ```

   Then run `alias openssl=$(brew --prefix)/opt/openssl@3/bin/openssl` to use Openssl3.

2. Set the following variables on your workstation:

   ```shell
   EMAIL = <email address>
   INSTANCE_NAME = <my_instance>
   CLUSTER_API = <cluster api>
   NAMESPACE = <eventprocessing installation namespace>
   ```

   Where:

   - INSTANCE_NAME is the name of the {{site.data.reuse.ep_name}} instance
   - CLUSTER_API is the cluster URL that can be obtained from the cluster. If the URL is `https://console-openshift-console.apps.clusterapi.com/` then the CLUSTER_API must be set to `apps.clusterapi.com`.

3. Create a file called `csr_ca.txt` with the following data:

   ```shell
   [req]
   prompt = no
   default_bits = 4096
   default_md = sha256
   distinguished_name = dn
   x509_extensions = usr_cert
   [dn]
   C = US
   ST = New York
   L = New York
   O = MyOrg
   OU = MyOU
   emailAddress = me@working.me
   CN = server.example.com
   [usr_cert]
   basicConstraints = CA:TRUE
   subjectKeyIdentifier = hash
   authorityKeyIdentifier = keyid,issuer
   ```

4. Create a file called `my-eventprocessing_answer.txt` with the following data:

   ```shell
   [req]
   default_bits = 4096
   prompt = no
   default_md = sha256
   x509_extensions = req_ext
   req_extensions = req_ext
   distinguished_name = dn
   [dn]
   C = US
   ST = New York
   L = New York
   O = MyOrg
   OU = MyOrgUnit
   emailAddress = ${EMAIL}
   CN = ${INSTANCE_NAME}-ibm-eventprocessing-svc
   [req_ext]
   subjectAltName = @alt_names
   [alt_names]
   DNS.1 = ${INSTANCE_NAME}-ibm-eventprocessing-svc
   DNS.2 = ${INSTANCE_NAME}-ibm-eventprocessing-svc.{NAMESPACE}
   DNS.3 = ${INSTANCE_NAME}-ibm-eventprocessing-svc.{NAMESPACE}.svc
   DNS.4 = ${INSTANCE_NAME}-ibm-eventprocessing-svc.{NAMESPACE}.svc.cluster.local
   DNS.5 = ${INSTANCE_NAME}-ibm-eventprocessing-rt-{NAMESPACE}.${CLUSTER_API}
   DNS.7 = ${INSTANCE_NAME}-ibm-eventprocessing-{NAMESPACE}.${CLUSTER_API}
   ```

   **Important:** If you are planning to do any of the following for your deployment, ensure you modify the `[alt_names]` section in the previous example to include the {{site.data.reuse.ep_name}} `ui` endpoint hostname:
    - You are planning to specify hostnames in the `eventprocessing` custom resource under `spec.authoring.endpoints`.
    - You are planning to create additional routes or ingress.
    - You are not running on {{site.data.reuse.openshift_short}}

5. Generate the required certificates by running the following commands:

   - `ca.key`:

     ```shell
     openssl genrsa -out ca.key 4096
     ```

   - `ca.crt`:

     ```shell
     openssl req -new -x509 -key ca.key -days 730 -out ca.crt -config <( envsubst <csr_ca.txt )
     ```

   - `eventprocessing` key:

     ```shell
     openssl genrsa -out my-eventprocessing.key 4096
     ```

   - `eventprocessing csr`:

     ```shell
     openssl req -new -key ${INSTANCE_NAME}.key -out ${INSTANCE_NAME}.csr -config <(envsubst < ${INSTANCE_NAME}_answer.txt )
     ```

6. Sign the `csr` to create the `eventprocessing crt` by running the following command:

   ```shell
   openssl x509 -req -in ${INSTANCE_NAME}.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out ${INSTANCE_NAME}.crt -days 730 -extensions 'req_ext' -extfile <(envsubst < ${INSTANCE_NAME}_answer.txt)
   ```

7. Verify the certificate by running the following command:

   ```shell
   openssl verify -CAfile ca.crt ${INSTANCE_NAME}.crt
   ```

8. Create Secret on the cluster by running the following command:

   **Note:** The Secret must be added to the namespace that the {{site.data.reuse.ep_name}} instance is intended to be created in.

   ```shell
   kubectl create secret generic ${INSTANCE_NAME}-cert --from-file=ca.crt=ca.crt --from-file=tls.crt=${INSTANCE_NAME}.crt --from-file=tls.key=${INSTANCE_NAME}.key -n ${NAMESPACE}
   ```

9. Create an {{site.data.reuse.ep_name}} instance and set the `spec.authoring.tls.secretName` to the name of the created certificate.

   ```yaml
   apiVersion: events.ibm.com/v1beta1
   kind: EventProcessing
   # ...
   spec:
     license:
       # ...
     authoring:
       tls:
         secretName: my-eventprocessing-cert
   # ...
   ```


#### User-provided UI certificates

A separate custom certificate can be used for the UI. This certificate is presented to the browser when the {{site.data.reuse.ep_name}} user interface is navigated.
To supply a custom certificate to the UI:
- Set `spec.authoring.tls.ui.secretName` to be the name of the secret that contains the certificate. 
- Provide the CA certificate that is used to sign your custom certificate to the list of trusted certificates under `spec.authoring.tls.trustedCertificates`.

The following snippet is an example of a configuration that uses a user-provided certificate in a secret, which also contains the signing CA certificate as a trusted certificate:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring:
    tls:
      ui:
        secretName: myUiSecret
      trustedCertificates:
        - secretName: myUiSecret
          certificate: ca.crt
# ...
```

If running on the {{site.data.reuse.openshift}}:

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

For information, see [network policies](../../security/network-policies).


## Configuring ingress

If running on the {{site.data.reuse.openshift}}, routes are automatically configured to provide external access.
You can optionally set a host for each exposed route on `EventProcessing` instance by setting values under `spec.authoring.endpoints[]`.

If you are not running on the {{site.data.reuse.openshift}}, the {{site.data.reuse.ep_name}} operator will create ingress resources to provide external access.

No default hostnames will be assigned to the ingress resource, and you must set hostnames for each exposed endpoint on the `EventProcessing` instance.

The following code snippet shows how to configure the host for the `EventProcessing` UI endpoint:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
    # ...
  authoring:
    endpoints:
      - name: ui
        host: my-ep-ui.mycompany.com
#...
```

### Ingress default settings

If you are not running on the {{site.data.reuse.openshift}}, the following ingress defaults are set unless overriden:

- `class`: The ingress class name is set by default to `nginx`.  Set the `class` field on endpoints to use a different ingress class.

- `annotations`: The following annotations are set by default on generated ingress endpoints:

```yaml
ingress.kubernetes.io/ssl-passthrough: 'true'
nginx.ingress.kubernetes.io/backend-protocol: HTTPS
nginx.ingress.kubernetes.io/ssl-passthrough: 'true'
```

If you specify a `spec.authoring.tls.ui.secretName`, on an `EventProcessing` the following re-encrypt annotations will be set on the `ui` ingress.  Other ingresses will be configured for passthrough.

```yaml
nginx.ingress.kubernetes.io/backend-protocol: HTTPS
nginx.ingress.kubernetes.io/configuration-snippet: proxy_ssl_name "<HOSTNAME>";
nginx.ingress.kubernetes.io/proxy-ssl-protocols: TLSv1.3
nginx.ingress.kubernetes.io/proxy-ssl-secret: <NAMESPACE>/<SECRETNAME>
nginx.ingress.kubernetes.io/proxy-ssl-verify: 'on'
```

Ingress annotations can be overridden by specifying an alternative set of annotations on an endpoint. The following code snippet is an example of overriding the annotations set on a `ui` endpoint ingress.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventProcessing
# ...
spec:
  license:
  # ...
  endpoints:
    - name: ui
      host: my-ui.mycompany.com
      annotations:
        some.annotation.foo: "true"
        some.other.annotation: value
# ... 
```



## Configuring SSL for API server, database, and schema registry

Databases, such as PostgreSQL, MySQL, and Oracle offer a built-in functionality to enhance security by using the Secure Sockets Layer (SSL) connections. 

Schema registry such as Apicurio registry in {{site.data.reuse.es_name}} can also be configured to SSL in {{site.data.reuse.ep_name}} and Flink.

You can use the same procedure mentioned in [Add the CA certificate to the truststore](#add-the-ca-certificate-to-the-truststore) to configure the CA certificate for the API server used for API enrichment.

If an API server, database, or a schema registry exposes a TLS encrypted endpoint where the certificate is self-signed, or has been issued by an internal Certificate Authority (CA), you must configure {{site.data.reuse.ep_name}} and Flink instances to enable verification of the endpoint certificate.

To enable SSL connections to an API server, database, and a schema registry from {{site.data.reuse.ep_name}} and Flink, complete the following steps:

1. Add the CA certificate used to issue the certificate presented by an API server, database, or a schema registry to a Java truststore.

   Additionally, if you want to trust the recommended public CA certificates, include the public CA certificates to a Java truststore.
2. Create a secret with the truststore.
3. Mount the secret through {{site.data.reuse.ep_name}} and the {{site.data.reuse.ibm_flink_operator}}. 


### Add the CA certificate to the truststore

1. Obtain a CA certificate of an API server, database, or schema registry from your administrator.

   For example, to obtain the certificate from an {{site.data.reuse.es_name}} schema registry, see the [{{site.data.reuse.es_name}} documentation]({{ 'es/schemas/using-with-rest-producer/' | relative_url }}).

   To retrieve the certificate from a REST endpoint of an API server, run the following command:

   ```shell
   openssl s_client -showcerts -connect <API_HOSTNAME>[:<PORT>] </dev/null 2>/dev/null|openssl x509 -outform PEM > /tmp/restServerCert.pem
   ```

2. Add the certificate for the CA to the truststore by running the following command:

   ```shell
   keytool -keystore ./truststore.<keystore-extension> -alias <cert_name> -import -file ./<path_to_ca_cert> -noprompt -storepass <choose a password> -trustcacerts
   ```

   Where:
   - `<keystore-extension>` is the extension for your keystore format. For example, `jks` for Java Keystore and `p12` for Public-Key Cryptography Standards.
   - `<cert_name>` is the alias name you want to give to the certificate being imported into the keystore.
   - `<path_to_ca_cert>` is the path to the CA certificate file that you want to import into the keystore.

   **Important:** If you use the `p12` format (not `jks`) for the API server, the whole certificate chain must be in the truststore (CA, intermediate CA and certificate).

#### Add the public CA certificate to the truststore

1. To obtain public CA certificates from a Java truststore, run the following command:


   ```markdown
   docker run --platform linux/amd64 --rm -v $(pwd):/temp us.icr.io/ea-dev/stable/base-images/java21:latest-ubi9 \
   cp /usr/local/openjdk/lib/security/cacerts /temp/cacerts_truststore.jks
   ```

   **Note:** If you are using macOS, ensure that you do not run the command in the `/tmp` folder, as the docker does not mount `/tmp` folder as a volume by default.

1. Add the obtained CA certificates to your truststore by running the following command:

   ```shell
   keytool -importkeystore -srckeystore $(pwd)/cacerts_truststore.jks -destkeystore ./truststore.jks --deststorepass <password> -noprompt
   ``` 


### Create a secret with the truststore

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure you are in the project where your {{site.data.reuse.ep_name}} instance is installed:
  
   ```shell
   oc project <project_name>
   ```

3. Create a secret with the truststore that you added with the following command:

   ```shell
   oc create secret generic ssl-truststore --from-file=truststore.<keystore-extension>
   ```

   Where:
    - `<keystore-extension>` is the extension for your keystore format. For example, `jks` for Java Keystore and `p12` for Public-Key Cryptography Standards.

### Mount the secret

Complete the following steps to mount the secret through {{site.data.reuse.ep_name}} and the {{site.data.reuse.ibm_flink_operator}} by using the OpenShift web console:

1. {{site.data.reuse.openshift_ui_login}}
1. {{site.data.reuse.task_openshift_navigate_installed_operators}}
1. {{site.data.reuse.task_openshift_select_operator_ep}}
1. {{site.data.reuse.task_openshift_select_instance_ep}}
1. Select the YAML tab.
1. Add the following snippet into the {{site.data.reuse.ep_name}} custom resource (`spec.authoring`):

   ```yaml
   template:
     pod:
       spec:
         containers:
           - env:
               - name: JAVA_TOOL_OPTIONS
                 value: >-
                   -Djavax.net.ssl.trustStore=/opt/ibm/sp-backend/certs/truststore.<keystore-extension>
                   -Djavax.net.ssl.trustStorePassword=<chosen password>
             name: backend
             volumeMounts:
               - mountPath: /opt/ibm/sp-backend/certs
                 name: truststore
                 readOnly: true
         volumes:
           - name: truststore
             secret:
               items:
                 - key: truststore.<keystore-extension>
                   path: truststore.<keystore-extension>
               secretName: ssl-truststore
   ```
   **Important:** Use the same value for the `<keystore-extension>` placeholder in both {{site.data.reuse.ep_name}} and Flink custom resources.
1. Save your changes and then click **Reload**.
1. {{site.data.reuse.task_openshift_navigate_installed_operators}}
1. {{site.data.reuse.task_openshift_select_operator_flink}}
1. {{site.data.reuse.task_openshift_select_instance_flink}}
1. Select the YAML tab. 
1. Add the following snippets into the Flink (`FlinkDeployment`) custom resource:

   - In `spec.flinkConfiguration` section, add:

     ```yaml
     env.java.opts.taskmanager: >-
        -Djavax.net.ssl.trustStore=/certs/truststore.<keystore-extension>
        -Djavax.net.ssl.trustStorePassword=<chosen password>
     env.java.opts.jobmanager: >-
        -Djavax.net.ssl.trustStore=/certs/truststore.<keystore-extension>
        -Djavax.net.ssl.trustStorePassword=<chosen password>
     ```

   - In `spec.podTemplate.spec.containers.volumeMounts` section, add:

     ```yaml
     - mountPath: /certs
       name: truststore
       readOnly: true
     ```

   - In `spec.podTemplate.spec.volumes` section, add:

     ```yaml
     - name: truststore
       secret:
         items:
           - key: truststore.<keystore-extension>
             path: truststore.<keystore-extension>
         secretName: ssl-truststore
    ```    
1. Save your changes and then click **Reload**.

Wait for the {{site.data.reuse.ep_name}} and the Flink pods to become ready.

The capability to create SSL connections between an API server, registered database, schema registry, and Flink with {{site.data.reuse.ep_name}} is enabled.


## Configuring multiple databases with SSL

If you have an existing secured SSL connection with a database and want to add a secured SSL connection to another database, follow the instructions to add the certificate of the new database to the existing truststore and update the secret. 

### Configuring the existing truststore

To add the certificate of the new database to your existing truststore, complete the following steps:

1. {{site.data.reuse.openshift_ui_login}}
2. Ensure you are in the project where your {{site.data.reuse.ep_name}} instance is installed.
3. Expand the **Workloads** dropdown and select **Secrets**.
4. Search the **Name** column for the created secret and click the name.
5. In the **Data** section, click **Save File** to download the `truststore.jks`.
6. Obtain the CA certificate of the database from your database administrator and add it to the existing truststore by running the following command:

   ```shell
   keytool -keystore ./truststore.<keystore-extension> -alias <cert_name> -import -file ./<path_to_ca_cert> -noprompt -storepass <choose a password> -trustcacerts
   ```

   Where:

   - `<keystore-extension>` is the extension for your keystore format. For example, `jks` for Java Keystore and `p12` for Public-Key Cryptography Standards.
   - `<cert_name>` is the alias name you want to give to the certificate being imported into the keystore.
   - `<path_to_ca_cert>` is the path to the CA certificate file that you want to import into the keystore.

### Updating the secret with the new truststore

To update the secret with the truststore that you configured earlier, complete the following steps:

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure you are in the project where your {{site.data.reuse.ep_name}} instance is installed:
  
   ```shell
   oc project <project_name>
   ```

3. Update the secret with the current truststore with the following command:

   ```shell
   oc create secret generic ssl-truststore --from-file=truststore.<keystore-extension> --dry-run -o yaml | oc replace -f -
   ```

   Where:
   
   - `<keystore-extension>` is the extension for your keystore format. For example, `jks` for Java Keystore and `p12` for Public-Key Cryptography Standards.

Delete the {{site.data.reuse.ep_name}} pod and wait for the pod to become ready.  After the pods are ready, your certificates are added.
