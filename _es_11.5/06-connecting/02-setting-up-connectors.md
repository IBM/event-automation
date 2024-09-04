---
title: "Setting up and running connectors"
excerpt: "Event Streams helps you set up a Kafka Connect environment, add connectors to it, and run the connectors to help integrate external systems."
categories: connecting
slug: setting-up-connectors
toc: true
---

{{site.data.reuse.es_name}} helps you integrate Kafka with external systems by setting up and managing [Kafka Connect and connectors](../connectors/#what-is-kafka-connect) as custom resources.

## Using Kafka Connect

To start Kafka Connect, define a `KafkaConnect` custom resource and configure it for your environment. A `KafkaConnect` custom resource represents a Kafka Connect distributed cluster and contains information about your Kafka cluster, the connectors that you want to use, and how you want to distribute the workload. Each connector is started and managed by configuring and creating a `KafkaConnector` custom resource. 

Complete the following sections to set up your Kafka Connect environment.

## Configure connection to Kafka

Configure the `KafkaConnect` custom resource with information about your Kafka cluster:

- `bootstrapservers`: Kafka bootstrap servers to connect to. Use a comma-separated list for `<hostname>:<port>` pairs. For example:

  ```yaml
  bootstrapServers: 'my-es-kafka-bootstrap-es.hostname:443'
  ```

  To get the `bootstrapServers` for your {{site.data.reuse.es_name}} instance, run the following command:

  ```shell
  kubectl get eventstreams <instance-name> -n <namespace> -o=jsonpath='{.status.kafkaListeners[?(@.name=="<external_listener_name>")].bootstrapServers}{"\n"}'
  ```

  Where `<external_listener_name>` is the name of your external Kafka listener.

- `authentication`: If {{site.data.reuse.es_name}} instance is secured with authentication, configure the `spec.authentication` field of `KafkaConnect` custom resource with credentials, which allow the connectors to read and write to Kafka Connect topics. For more information, see [authentication and authorization](../connectors/#authentication-and-authorization).

  If {{site.data.reuse.es_name}} instance is secured with SCRAM authentication, use the following configuration:

  ```yaml
  authentication:    
    type: scram-sha-512
    username: my-user
    passwordSecret:
      password: password
      secretName: my-kafka-user     
  ```  

  If {{site.data.reuse.es_name}} instance is secured with Transport Layer Security (TLS) authentication, use the following configuration:

  ```yaml
  authentication:
    type: tls
    certificateAndKey:
      certificate: user.crt
      secretName: kafka-connect-user
      key: user.key
  ```  

- `tls`: If {{site.data.reuse.es_name}} instance is secured with TLS encryption, configure the `spec.tls` field of `KafkaConnect` custom resource with reference to required certificates for connecting securely to Kafka listeners.
  
  ```yaml
  tls:
    trustedCertificates:
      - secretName: <instance_name>-cluster-ca-cert
        certificate: ca.crt
  ```

## Add connectors you want to use

Prepare Kafka Connect for connecting to external systems by adding the required connectors using one of the methods described below:

- [Use the {{site.data.reuse.es_name}} operator](#use-the-sitedatareusees_name-operator) to add the connectors by specifying the connectors within a `KafkaConnect` custom resource. The {{site.data.reuse.es_name}} operator will create a container image with Kafka Connect and all the specified connector artifacts, and use it to start Kafka Connect.  

- [Manually add required connectors](#manually-add-required-connectors) and Kafka Connect to a container image and specify the image in `KafkaConnect` custom resource. The {{site.data.reuse.es_name}} operator will use the specified image to start Kafka Connect.

### Use the {{site.data.reuse.es_name}} operator

The {{site.data.reuse.es_name}} operator can create a container image with Kafka Connect and all the specified connector artifacts, tag and push the image to the specified container registry, and use the built image to start Kafka Connect.

To build the connector image by using the {{site.data.reuse.es_name}} operator, configure the `spec.build` section of `KafkaConnect` custom resource as follows:

- `spec.build.plugins`: Specify the connectors you want to use in `spec.build.plugins` section.

  Each connector can be specified as a plugin with a name and a list of artifacts that represent the connector and any other dependencies you want to use with that connector.

  Each artifact has a type, and additional fields that define how the artifact can be downloaded and used. {{site.data. reuse.es_name}} supports the following types of artifacts:

  - JAR files, which are downloaded and used directly
  - TGZ and ZIP archives, which are downloaded and unpacked
  - Maven artifacts, which uses Maven coordinates
  - Other artifacts, which are downloaded and used directly

  If the artifact is of type `jar`, `tgz`, `zip`, or other, then the plugin can be defined as follows:

  ```yaml
  plugins:
     - name: plugin-1
       artifacts:
          - type: jar
            url: <url>
            sha512sum: <sha512sum>
  ```

  Where:

  - `type` is the file format for the connector image that you will download.
  - `<url>` defines the location accessible from your cluster to download the connector from.
  - `<sha512sum>` is the checksum that you use to verify that the downloaded artifact is correct before it adds it to your Kafka Connect environment.

  If the artifact type is `maven`, then the plugin can be defined as follows:

  ```yaml
  plugins:
    - name: mq-sink
      artifacts:
        - type: maven
          group: <group name>
          artifact: <artifact name>
          version: <version> 
  ```

  **Note:** If you encounter issues while retrieving the maven artifacts, consider encoding the configuration values. For example, to retrieve the `com.ibm.mq.allclient` artifact, configure your value as `artifact: com%2Eibm%2Emq%2Eallclient`.

- `spec.build.output`: Configure this section to specify the output that you want from the `KafkaConnect` build process.

  For example:

  ```yaml
  output:
    image: my-image-registry.my-kafka-connect-image:latest
    type: docker
    pushSecret: my-registry-credentials
  ```

  Where:
  
  - `type` can be `docker` if you want to create a container image or `imagestream` if you are using `OpenShift ImageStream`.
  - `image` is the full name of the new container image including registry address, port number (if listening to a non-standard port), and tag. For example, `my-registry.io/my-connect-cluster-image:my-tag` where:
    - `my-registry.io/my-connect-cluster-image` is the address of the registry.
    - `my-tag` is the tag of the new container image.
  - `pushSecret` if the image registry is secured, you can optionally provide the name of the secret that contains credentials with write permission.

If the build process needs to pull or push images from or to a secured container registry, specify the secret containing the credentials in the `spec.template` section. For example, to retrieve the {{site.data.reuse.es_name}} Kafka Connect image, which is used as the base image for the build, provide your `ibm-entitlement-key` secret:

- If running on OpenShift, specify the secret in `spec.template.buildConfig.pullSecret` section:

  ```yaml
  template:
    buildConfig:
      pullSecret: ibm-entitlement-key
  ```

- If running on other Kubernetes platforms, specify the secret in `spec.template.builPod.imagePullSecrets` section:

  ```yaml
  template:
    buildPod:
      imagePullSecrets:
        - name: ibm-entitlement-key 
  ```

- To provide the secret for pulling any of the images that are used by the specific pod where Kafka Connect is running, specify the secret in `spec.template.pod.imagePullSecrets` section:.

  ```yaml
  template:
    pod:
      imagePullSecrets:
        - name: default-dockercfg-abcde
  ```

  **Important:** The secrets that are referenced in the `KafkaConnect` custom resource must be present in the same namespace as the `KafkaConnect` instance.

#### Rebuild the Kafka Connect image
 
Rebuild the Kafka Connect image regularly to ensure that your Kafka Connect environment is up-to-date with changes to Kafka Connect and any new releases of connectors.

When you change the image (`spec.image`) or the connector plugin artifacts configuration (`spec.build.plugins`) in the `KafkaConnect` custom resource, container image is built automatically.

To pull an upgraded base image or to download the latest connector plugin artifacts without changing the `KafkaConnect` resource, you can trigger a rebuild of the container image that is used by your Kafka Connect cluster by applying the following annotation to the `StrimziPodSet` resource named `<kafka-connect-instance-name>-connect`:

```shell
eventstreams.ibm.com/force-rebuild: true
``` 

### Manually add required connectors

You can create a container image with Kafka Connect and all the required connector artifacts yourself and use it to start Kafka Connect. This approach is useful when the required connectors cannot be included using the operator, for example, when authentication is required to access to connector artifacts. 

- {{site.data.reuse.es_name}} Kafka image is a convenient starting point as it includes everything you need to start Kafka Connect. You can prepare a directory containing all the required connectors and use the sample `Dockerfile` to add them to the {{site.data.reuse.es_name}} Kafka image:

  ```yaml
  FROM cp.icr.io/cp/ibm-eventstreams-kafka:<version>
  COPY ./my-plugins/ /opt/kafka/plugins/
  USER 1001
  ```

  Where:
  - `<version>` is the version of {{site.data.reuse.es_name}} that you are using.
  - `my-plugins` is the folder containing all connector artifacts.

  **Note:** Both components must be in a single directory. For example, the following snippet shows the directory structure:

  ```shell
  +--  KafkaConnectComponents
  |    +--  Dockerfile
  |    +--  my-plugins  
  ```

- If your connector consists of just a single JAR file, you can copy the JAR file directly into the `my-plugins` directory. If your connector consists of multiple JAR files or requires additional dependencies, create a directory for the connector inside the `my-plugins` directory and copy all the JAR files of your connector into `my-plugins` directory. For example, the following snippet shows the directory structure with three connectors:

  ```shell
  +--  my-plugins
  |    +--  connector1.jar
  |    +--  connector2
  |    |    +-- connector2.jar
  |    |    +-- connector2-lib.jar
  |    +-- connector3.jar
  ```

- Run the following commands to build the container image and push it to an image registry that is accessible to your {{site.data.reuse.es_name}} instance:

  ```bash
  docker build -t <registry>/<image>:<tag>
  docker push <registry>/<image>:<tag>
  ```

  **Note:** You might need to log in to the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"} before building the image to allow the base image that is specified in the `Dockerfile` to be pulled successfully.


- Specify the image in the `spec.image` field of `KafkaConnect` resource to start Kafka Connect with the image you have built with your connectors.

#### Rebuild the Kafka Connect image

Rebuild the Kafka Connect image regularly with a new unique tag and update the `KafkaConnect` resource to use the new image. This ensures that your Kafka Connect environment is up-to-date with changes to Kafka Connect and any new releases of connectors.

## Configure workers

{{site.data.reuse.es_name}} runs Kafka Connect in distributed mode, distributing data streaming tasks across one or more worker pods.

- You can configure the number of workers in the `replicas` section of the `KafkaConnect` resource:

  ```yaml
  replicas: 1
  ```

- Worker configuration can be optionally specified in the `spec.config` section of `KafkaConnect` resource. For example:

  ```yaml
  config:
    group.id: connect-cluster
    offset.storage.topic: connect-cluster-offsets
    config.storage.topic: connect-cluster-configs
    status.storage.topic: connect-cluster-status
    config.storage.replication.factor: 1
    offset.storage.replication.factor: 1
    status.storage.replication.factor: 1
  ```

  Where:

  - `group.id` is the unique name used by the Kafka Connect cluster to identify the workers in the cluster.
  - `offset.storage.topic` is the topic that Kafka Connect uses to store source connector offsets.
  - `config.storage.topic` is the topic that Kafka Connect uses to store connector configurations.
  - `status.storage.topic` is the topic that Kafka Connect uses to store the status of connectors.

  **Note:** Set the following factors to `1` if you have less than three brokers in your {{site.data.reuse.es_name}} cluster:

  - `config.storage.replication.factor`
  - `offset.storage.replication.factor`  
  - `status.storage.replication.factor`

## Starting Kafka Connect

- Start Kafka Connect by creating the `KafkaConnect` custom resource with the required configuration. For example, if you are using the MQ source and sink connectors, the `KafkaConnect` custom resource might be similar to the following YAML:

  ```yaml
  apiVersion: eventstreams.ibm.com/v1beta2
  kind: KafkaConnect
  metadata:
    name: mq-connectors
    namespace: es
    annotations:
      eventstreams.ibm.com/use-connector-resources: true  
    labels:
      backup.eventstreams.ibm.com/component: kafkaconnect
  spec:
    authentication:
      certificateAndKey:
        certificate: user.crt
        key: user.key
        secretName: my-kafka-user
      type: tls
    bootstrapServers: mtls-listener.my-cluster:443  
    build:
      output:
        image: my-image-registry.my-kafka-connect-image:latest  
        type: docker
      plugins:
        - artifacts:
            - type: jar
              url: https://github.com/ibm-messaging/kafka-connect-mq-source/releases/download/v2.1.0/kafka-connect-mq-source-2.1.0-jar-with-dependencies.jar     
          name: mq-source
        - artifacts:
            - type: jar
              url: https://github.com/ibm-messaging/kafka-connect-mq-sink/releases/download/v2.2.0/kafka-connect-mq-sink-2.2.0-jar-with-dependencies.jar 
          name: mq-sink
    template:
      buildConfig:
        pullSecret: ibm-entitlement-key
      pod:
        imagePullSecrets:
          - name: default-dockercfg-abcde
        affinity:
          nodeAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
                - matchExpressions:
                    - key: kubernetes.io/arch
                      operator: In
                      values:
                        - amd64
                        - s390x
                        - ppc64le
      connectContainer:
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
              - ALL
          privileged: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
    tls:
      trustedCertificates:
        - certificate: ca.crt
          secretName: <eventstreams-instance>-cluster-ca-cert
  ```

- {{site.data.reuse.es_name}} operator will populate the `status` section of the `KafkaConect` custom resource. Use the following command to verify that your Kafka Connect cluster is running and connectors configured are available for use:

  ```shell
  kubectl describe kafkaconnect my-connect-cluster
  ```

  The following snippet is an example output for the previous command:

  ```output
  Status:  
    Conditions:  
       Last Transition Time: 2024-06-25T07:56:40.943007974Z  
       Status:               True
       Type:                 Ready  
    Connector Plugins:  
        Class:              com.ibm.eventstreams.connect.mqsource.MQSourceConnector
        Type:               source
        Version:            1.3.2
        Class:              com.ibm.eventstreams.connect.mqsink.MQSinkConnector
        Type:               sink
        Version             1.5.0
  ```

**Note:** If Kafka Connect fails to connect to Kafka with timeout errors, then ensure that all the connection details are correct. If the problem persists, try duplicating the following connection properties in your `KafkaConnect` custom resource, adding the `producer` prefix for source connectors, the `consumer` prefix for sink connectors, or both if both sink and source connectors are in use.

| Connection property       | Required for TLS | Required for SCRAM | Source Connector property          | Sink Connector Property             |
| ------------------------- | ---------------- | ------------------ | ---------------------------------- | ----------------------------------- |
| `bootstrap.servers`       | Yes              | Yes                | `producer.bootstrap.servers`       | `consumer.bootstrap.server`         |
| `ssl.protocol`            | Yes              | No                 | `producer.ssl.protocol`            | `consumer.ssl.protocol`             |
| `ssl.truststore.location` | Yes              | No                 | `producer.ssl.truststore.location` | `consumer.ssl.truststore.location`  |
| `ssl.truststore.password` | Yes              | No                 | `producer.ssl.truststore.password` | `consumer.ssl.truststore.password`  |
| `ssl.truststore.type`     | Yes              | No                 | `producer.ssl.truststore.type`     | `consumer.ssl.truststore.type`      |
| `security.protocol`       | No               | Yes                | `producer.security.protocol`       | `consumer.security.protocol`        |
| `sasl.mechanism`          | No               | Yes                | `producer.sasl.mechanism`          | `consumer.sasl.mechanism`           |
| `sasl.jaas.config`        | No               | Yes                | `producer.sasl.jaas.config`        | `consumer.sasl.jaas.config`         |


These values can also be set on a per connector level using the `producer.override` and `consumer.override` prefixes.

## Set up a Kafka connector

Set up a connector by defining a `KafkaConnector` custom resource with the required connector configuration.

**Note:** To use `KafkaConnector` resources for managing each connector rather than using Kafka Connect REST API directly, set `eventstreams.ibm.com/use-connector-resources` to `true` in the `metadata.annotations` section of the `KafkaConnect` custom resource.

### Configure the connector

- Kafka Connect cluster: Add the label `eventstreams.ibm.com/cluster: <kafka_connect_name>` to `KafkaConnector` custom resource to specify the Kafka Connect cluster where the connector must be started. The value of this label must be set to the name of the corresponding Kafka Connect instance.


- `class`: Specifies the complete class name for starting the connector. For example, to set up a MQ sink connector, the name of the connector class is as follows:

  ```yaml
  spec:
    class: com.ibm.eventstreams.connect.mqsink.MQSinkConnector
  ```

- `tasksMax`: Specify the maximum number of tasks that must be used to run this connector.

- `autorestart`: Specify if the Kafka Connect must automatically restart the connector to recover from failures, and optionally specify the maximum number of attempts that must be made before stopping the connector.

  ```yaml
  autoRestart:
      enabled: true
      maxRestarts: 10
  ```

- `config`: Each connector documents the supported configuration options that allow users to specify details about the external system and control the connector behavior during the data transfer. These configuration properties can be specified as a set of key-value pairs in the `spec.config` section of the `KafkaConnector` custom resource. For example, if you are trying to connect to a database by using this connector, then the configurations might include parameters such as the database URL, credentials to connect to the database, and table names. See the documentation of your connector to view the full list of supported configuration properties.

- `state`: Optionally, specify the state you want the connector to be in. Valid states are:
  - To start or resume the connector: `running` (default)
  - To pause the connector: `paused`
  - To stop the connector: `stopped`

### Start the connector

Start the connector by creating `KafkaConnector` custom resource with the required configuration. For example, if you are using the MQ source connector, the `KafkaConnector` custom resource might be similar to the following snippet:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaConnector
metadata:
  name: mq-source
  labels:
    # The eventstreams.ibm.com/cluster label identifies the KafkaConnect instance
    # in which to create this connector. That KafkaConnect instance
    # must have the eventstreams.ibm.com/use-connector-resources annotation
    # set to true.
    eventstreams.ibm.com/cluster: <kafka_connect_name>
    backup.eventstreams.ibm.com/component: kafkaconnector
spec:
  class: com.ibm.eventstreams.connect.mqsource.MQSourceConnector
  tasksMax: 1
  config:
    topic: TSOURCE
    mq.queue.manager: QM1
    mq.connection.name.list: localhost(1414)
    mq.channel.name: MYSVRCONN
    mq.queue: MYQSOURCE
    mq.user.name: alice
    mq.password: passw0rd
    key.converter: org.apache.kafka.connect.storage.StringConverter
    value.converter: org.apache.kafka.connect.storage.StringConverter
    mq.record.builder: com.ibm.eventstreams.connect.mqsource.builders.DefaultRecordBuilder 
```  

{{site.data.reuse.es_name}} operator will populate the `status` section of the `KafkaConnector` resource. Use the following command to verify that your connector is running as expected:

```shell
kubectl describe kafkaconnector <connector_name>
```

This command provides the complete description of the connector that you created. You can verify the current status of the connector from the `status` section. For example:

```output
Status: 
    Conditions:  
       Last Transition Time: 2024-07-13T07:56:40.943007974Z  
       Status:               True
       Type:                 Ready  
    Connector Status:  
       Connector:  
         State:      RUNNING
         worker_id:  mq-connectors-connect-0.mq-connectors-connect-0.es.svc:8083
        Name:        mq-sink  
        Tasks:  
          Id:               0 
          State:            RUNNING  
          worker_id:        mq-connectors-connect-0.mq-connectors-connect-0.es.svc:8083
        Type:               sink  
    Observerd Generation:   1
    Tasks Max:              1  
```  

