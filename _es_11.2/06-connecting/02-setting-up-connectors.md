---
title: "Setting up and running connectors"
excerpt: "Event Streams helps you set up a Kafka Connect environment, add connectors to it, and run the connectors to help integrate external systems."
categories: connecting
slug: setting-up-connectors
toc: true
---

{{site.data.reuse.es_name}} helps you set up a Kafka Connect environment, prepare the connection to other systems by adding connectors to the environment, and start Kafka Connect with the connectors to help integrate external systems.

[Log in](../../getting-started/logging-in/) to the {{site.data.reuse.es_name}} UI, and click **Toolbox** in the primary navigation. Scroll to the **Connectors** section and follow the guidance for each main task. You can also find additional help on this page.


## Using Kafka Connect

The most straightforward way to run Kafka Connect on a Kubernetes platform is to use a custom resource called `KafkaConnect`. An instance of this custom resource represents a Kafka Connect distributed worker cluster. In this mode, workload balancing is automatic, scaling is dynamic, and tasks and data are fault-tolerant. Each connector is represented by another custom resource called `KafkaConnector`.

### Kafka Connect topics

When running in distributed mode, Kafka Connect uses three topics to store configuration, current offsets and status. Kafka Connect can create these topics automatically as it is started by the {{site.data.reuse.es_name}} operator. By default, the topics are:

- **connect-configs**: This topic stores the connector and task configurations.
- **connect-offsets**: This topic stores offsets for Kafka Connect.
- **connect-status**: This topic stores status updates of connectors and tasks.

If you want to run multiple Kafka Connect environments on the same cluster, you can override the default names of the topics in the configuration.

### Authentication and authorization

Kafka Connect uses an Apache Kafka client just like a regular application, and the usual authentication and authorization rules apply.

Kafka Connect will need authorization to:

* Produce and consume to the internal Kafka Connect topics and, if you want the topics to be created automatically, to create these topics
* Produce to the target topics of any source connectors you are using
* Consume from the source topics of any sink connectors you are using.

**Note:** For more information about authentication and the credentials and certificates required, see the information about [managing access](../../security/managing-access/).

### Kafka Connect Source-to-Image deprecation

The `KafkaConnectS2I` custom resource is deprecated in {{site.data.reuse.es_name}} version 10.4.0 and later. When installing new Kafka Connect instances, use the `KafkaConnect` custom resource and provide a pre-built image. The `KafkaConnectS2I` custom resource will be removed in future versions of {{site.data.reuse.es_name}}. Ensure your existing Kafka Connect clusters are migrated to use the `KafkaConnect` custom resource.

To migrate an existing Kafka Connect cluster from the `KafkaConnectS2I` custom resource to the `KafkaConnect` custom resource:

1. [Download the Kafka connect ZIP](#download-kafka-connect-configuration) from the  {{site.data.reuse.es_name}} UI.
2. [Build and push](#adding-connectors-to-your-kafka-connect-environment) a Kafka Connect image that includes your connectors.
3. Follow the steps in the [Strimzi documentation](https://strimzi.io/docs/operators/0.22.0/using.html#proc-migrating-kafka-connect-s2i-str){:target="_blank"} to migrate the custom resource, setting the `.spec.image` property to be the image you built earlier.

## Set up a Kafka Connect environment

To begin using Kafka Connect, do the following.

### Download Kafka Connect configuration

1. In the {{site.data.reuse.es_name}} UI, click **Toolbox** in the primary navigation. Scroll to the **Connectors** section.
2. Go to the **Set up a Kafka Connect environment** tile, and click **Set up**.
3. Click **Download Kafka Connect ZIP** to download the compressed file, then extract the contents to your preferred location.

You will have a Kubernetes manifest for a `KafkaConnect`, a `Dockerfile`, and an empty directory called `my-plugins`.

### Configure Kafka Connect

Edit the downloaded `kafka-connect.yaml` file to enable Kafka Connect to connect to your Kubernetes cluster. You can use the snippets in the {{site.data.reuse.es_name}} UI as guidance to configure Kafka Connect.

1. Choose a name for your Kafka Connect instance.
2. You can run more than one worker by increasing the `replicas` from 1.
3. Set `bootstrapServers` to connect the bootstrap server address of a listener. If using an internal listener, this will be the address of a service. If using an external listener, this will be the address of a route.

   To get the `bootstrapServers`, run the following command:

   ```shell
   kubectl get eventstreams <instance-name> -n <namespace> -o=jsonpath='{.status.kafkaListeners[?(@.name=="<external_listener_name>")].bootstrapServers}{"\n"}'
   ```

   Where `<external_listener_name>` is the name of your external Kafka listener.

4. If you have fewer than 3 brokers in your {{site.data.reuse.es_name}} cluster, you must set `config.storage.replication.factor`, `offset.storage.replication.factor` and `status.storage.replication.factor` to 1.
5. If {{site.data.reuse.es_name}} has any form of authentication enabled, ensure you use the appropriate credentials in the Kafka Connect YAML configuration file.
6. To connect to a listener that requires a certificate, provide a reference to the appropriate certificate in the `spec.tls.trustedCertificates` section of the `KafkaConnect` custom resource.

For example, when connecting to a listener with `tls` authentication and  Mutual TLS encryption (`tls: true`), the Kafka Connect credentials will resemble the following:

```yaml
tls:
  trustedCertificates:
      - secretName: <instance_name>-cluster-ca-cert
        certificate: ca.crt
authentication:
  type: tls
  certificateAndKey:
    certificate: user.crt
    key: user.key
    secretName: kafka-connect-user
```

## Adding connectors to your Kafka Connect environment

Prepare Kafka Connect for connections to your other systems by adding the required connectors.

You can use one of the following methods that are provided by {{site.data.reuse.es_name}} to prepare a Kafka Connect image that includes your specified connectors:

- Specify the connectors within a Kafka Connect custom resource. You can download the required connectors by using the {{site.data.reuse.es_name}} operator, and then build and run a new image that contains the connectors by using the kaniko builder.
- Manually create the Kafka Connect image that contains the required connectors.

### Specifying connectors in your Kafka Connect custom resource

You can use the [kaniko builder](https://github.com/GoogleContainerTools/kaniko){:target="_blank"} that is supported by the {{site.data.reuse.es_name}} operator to build container images within your Kubernetes cluster. You can configure the Kafka Connect custom resource with the details of the required connectors and any dependencies the connectors might have. The {{site.data.reuse.es_name}} operator provides this configuration to the kaniko builder, which builds an image and pushes the image to a specified registry. The {{site.data.reuse.es_name}} operator then creates a Kafka Connect deployment that uses the previously created image, as specified in the `KafkaConnect` custom resource.

To set up and configure the `KafkaConnect` custom resource to use the kaniko builder, complete the following steps:

1. Add the `spec.build` field to the `KafkaConnect` custom resource.

2. Specify the registry where the new image is stored. The registry is specified in `spec.build.output`. For example:

   ```yaml
   spec:
     # ...
     build:
       # ...
       output:
         image: my-image-registry.my-kafka-connect-image:latest
         type: docker
   ```

   Where:
   - `type` must be set to `docker`
   - `image` is the registry address and image name for the new image. For example: `my-registry.io/my-connect-cluster-image:latest`
   - (Optional) `pushSecret` is the name of the secret that contains credentials with permission to push into a secured image registry.

3. In the `spec.build.plugins` field, enter the list of required Kafka Connector JAR, ZIP, or TGZ files.

   Each entry in the `plugins` field has an `artifacts` and a `name` section for providing details about the connector and the dependencies you want to retrieve. For example:

   ```yaml
   spec:
     # ...
     build:
       # ...
       plugins:
         - artifacts:
             - type: jar
               url: <url>
               sha512sum: <sha512sum>
           name: mq-source
   ```

   The following example shows a configuration that adds dependencies for a connector that uses `maven` as the artifact type, which retrieves the `slf4j-api` dependency:

   ```yaml
    plugins:
      - artifacts:
        - artifact: slf4j-api
          group: org.slf4j
          type: maven
          version: <version>
          sha512sum: <sha512sum of the jar>
        name: mq-sink
   ```

   Where:
    - `type` is the file format for the connector image that you will download (`jar`, `tgz`, `maven`, or `zip`).
    - `<url>` defines the location to download the connector from. For example, the `url` for the IBM MQ source connector v2 is the location of the connector JAR that is accessible from your cluster.
    - `<sha512sum>` is the checksum that you use to verify that the downloaded artifact is correct before it adds it to your Kafka Connect environment.

   **Note:** If you encounter issues while retrieving the maven artifacts, consider encoding your artifacts. For example, to retrieve the `com.ibm.mq.allclient` artifact, configure your YAML as follows:

   ```yaml
   - type: maven
     artifact: com%2Eibm%2Emq%2Eallclient
     group: com.ibm.mq
     version: 9.3.3.1
   ```

4. Provide your `ibm-entitlement-key` secret in the `spec.template.buildConfig.pullSecret` field within the `KafkaConnect` custom resource to retrieve the {{site.data.reuse.es_name}} Kafka Connect image, which is used as the base image for the build.

   ```yaml
   spec:
     # ...
     template:
       buildConfig:
         pullSecret: ibm-entitlement-key
   ```

5. If you want to push the image into a secured image registry, enter the name of the `imagePullSecret` in the `spec.template.pod.imagePullSecrets` field:

  ```yaml
  spec:
    #...
    template:
      pod:
        imagePullSecrets:
          - name: default-dockercfg-abcde
  ```

**Important:** The secrets that are referenced in the `KafkaConnect` custom resource must be present in the same namespace as the `KafkaConnect` instance.

The following example shows a complete `KafkaConnect` custom resource. The `KafkaConnect` custom resource includes the IBM MQ source and sink connectors, which are built into a new image named `my-image-registry.my-kafka-connect-image:latest`. When Kafka Connect starts, the image is pulled from the registry. Then, the image is connected to a mutual-TLS configured Kafka listener on the {{site.data.reuse.es_name}} cluster at `mtls-listener.my-cluster:443` by using the credentials in the `my-kafka-user` secret.

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaConnect
metadata:
  name: mq-connectors
  namespace: es
spec:
  authentication:
    certificateAndKey:
      certificate: user.crt
      key: user.key
      secretName: my-kafka-user
    type: tls
  bootstrapServers: >-
    mtls-listener.my-cluster:443
  build:
    output:
      image: >-
        my-image-registry.my-kafka-connect-image:latest
      type: docker
    plugins:
      - artifacts:
          - type: jar
            url: >-
              https://github.com/ibm-messaging/kafka-connect-mq-source/releases/download/v1.3.2/kafka-connect-mq-source-1.3.2-jar-with-dependencies.jar
            sha512sum: fdfde75c42698be06f96c780b5fd42759e1f79dc7a099b32466a32bdd795d3e00a754e6844dd40207174e787d680d5356dc3710d53d55d80d3cdf1d0c8382514
        name: mq-source
      - artifacts:
          - type: jar
            url: >-
              https://github.com/ibm-messaging/kafka-connect-mq-sink/releases/download/v1.5.0/kafka-connect-mq-sink-1.5.0-jar-with-dependencies.jar
            sha5125sum: a85f16caba085244a39444dcb98dea4c528951cbe6cfd800467faaad0adbae36b8e2f05d5bd755091b16368afceb7c66a530ce062ff3c5b3775a01dfef41b342
        name: mq-sink
  template:
    buildConfig:
      pullSecret: ibm-entitlement-key
    pod:
      imagePullSecrets:
        - name: default-dockercfg-abcde
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


### Manually build connectors into your Kafka Connect Image

After you [configured Kafka Connect](#configure-kafka-connect), click **Next** at the end of the page to go to the **Add connectors to your Kafka Connect environment** section. You can also access this page by clicking **Toolbox** in the primary navigation, scrolling to the **Connectors** section, and clicking **Add connectors** on the **Add connectors to your Kafka Connect environment** tile.

To run a particular connector, Kafka Connect must have access to a JAR file or set of JAR files for the connector.

If your connector consists of just a single JAR file, you can copy it directly into the `my-plugins` directory.

If your connector consists of multiple JAR files or requires additional dependencies, create a directory for the connector inside the `my-plugins` directory and copy all the connector's JAR files into that directory.

An example of how the directory structure might look with 3 connectors:

```shell
+--  my-plugins
|    +--  connector1.jar
|    +--  connector2
|    |    +-- connector2.jar
|    |    +-- connector2-lib.jar
|    +-- connector3.jar
```

#### Build a Kafka Connect Docker image

Build a custom Kafka Connect Docker image that includes your chosen connectors.

Navigate to the directory where you extracted the Kafka Connect `.zip` file and run the following command:

```bash
docker build -t my-connect-cluster-image:latest <extracted_zip>/
```

**Note:** You might need to log in to the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"} before building the image to allow the base image that is specified in the `Dockerfile` to be pulled successfully.

#### Push the Kafka Connect Docker image to your registry

Push the custom Kafka Connect image containing your connector JAR files to an image registry that is accessible to your {{site.data.reuse.es_name}} instance.

To retag the image for your chosen registry:

```bash
docker tag my-connect-cluster-image:latest <registry>/my-connect-cluster-image:latest
```

To push the image:

```bash
docker push <registry>/my-connect-cluster-image:latest
```

#### Add the image to the Kafka Connect file

Remove the `spec.build` property in the downloaded `kafka-connect.yaml` file and add the `spec.image` property to match the image tag that was pushed to your image registry. See the {{site.data.reuse.es_name}} UI for an example.

## Rebuild the Kafka Connect image

Rebuild the Kafka Connect image regularly to ensure that your Kafka Connect environment is up-to-date with changes to Kafka Connect and any new releases of connectors.

The rebuild process is different depending on how you initially built and deployed the image:

- If the Kafka Connect image was built by using the kaniko builder and by configuring the `spec.build` field in the Kafka Connect custom resource:

  Trigger the build again to update to the latest version of Kafka Connect by applying the following annotation to the deployment named `<kafka connect instance name>-connect` in the same namespace as the Kafka Connect instance.

  ```shell
  eventstreams.ibm.com/force-rebuild: true
  ```

  This forces a rebuild of the image and the redeployment of the pod for this Kafka Connect instance.

  You can upgrade a connector to a new version by updating the corresponding artifact entry in the Kafka Connect custom resource. Provide the new connector download URL that links to the new version of the connector in the `spec.build.plugins.artifacts.url` field. If a checksum is required, update the `spec.build.plugins.artifacts.sha512sum` field with the new checksum value. Updating the Kafka Connect custom resource `spec.build` section forces a rebuild of the connector image.

- If the Kafka Connect image was built manually:

  Repeat the instructions provided earlier, starting with [downloading Kafka Connect from the {{site.data.reuse.es_name}} UI](#download-kafka-connect-configuration).

## Starting Kafka Connect with your connectors

Click **Next** at the end of the page to go to the **Start Kafka Connect with your connectors** section. You can also access this page by clicking **Toolbox** in the primary navigation, scrolling to the **Connectors** section, and clicking **Start Kafka Connect** on the **Start Kafka Connect with your connectors** tile.

### Start Kafka Connect with your connectors

By using the Kubernetes command-line tool (`kubectl`), deploy the Kafka Connect instance by applying the YAML file:

```shell
kubectl apply -f kafka-connect.yaml
```

If you are using the kaniko builder supported by the {{site.data.reuse.es_name}} operator to build your Kafka Connect image:
1. A Kafka Connect build pod is started.
2. The Kafka Connect build pod creates the Kafka Connect image that contains all the connectors that are specified in the `spec.build.plugins` property. 
3. The previously created image is pushed into the registry that is specified in the `spec.build.output` property. 
4. When the build is completed, a Kafka Connect pod is started, which uses the previously created image. 


Wait for the Kafka Connect pod to become `Ready`.

If the image was built manually and specified in the Kafka Connect custom resource `spec.image` property, the Kafka Connect pod is created. Wait for the Kafka Connect pod to become `Ready`.

You can check status with the following command:

```shell
kubectl get pods
```

When it is ready, you can use the following command to check the status and view which connectors are available:

```shell
kubectl describe kafkaconnect my-connect-cluster
```

**Note:** If Kafka Connect fails to connect to Kafka with timeout errors, then check to make sure all the connection details are correct. If the problem persists, try duplicating the following connection properties in your `KafkaConnect` custom resource, adding the `producer` prefix for source connectors, the `consumer` prefix for sink connectors, or both if both sink and source connectors are in use.

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

### Start a connector

Create a YAML file for the connector configuration. For the IBM MQ connectors, you can use the {{site.data.reuse.es_name}} UI or CLI to generate the YAML file. Alternatively, you can use the following template, taking care to replace `<kafka_connect_name>` with the name of the `KafkaConnect` instance:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: KafkaConnector
metadata:
  name: <connector_name>
  labels:
    # The eventstreams.ibm.com/cluster label identifies the KafkaConnect instance
    # in which to create this connector. That KafkaConnect instance
    # must have the eventstreams.ibm.com/use-connector-resources annotation
    # set to true.
    eventstreams.ibm.com/cluster: <kafka_connect_name>
spec:
  class: <connector_class_name>
  tasksMax: 1
  config:
  # The connector configuration goes here
```

Where:

- `<connector_name>` is the name of your connector. For example, in the sample YAML provided for the [IBM MQ source connector](../mq/source/#using-the-cli), `<connector_name>` is `mq-source`.
- `<kafka_connect_name>` is the name of the Kafka Connect instance that you [configured](#configure-kafka-connect) earlier.
- `<connector_class_name>` is the class of the connector. For example, in the sample YAML provided for the [MQ source connector](../mq/source/#using-the-cli), `<connector_class_name>` is `com.ibm.eventstreams.connect.mqsource.MQSourceConnector`.

Start the connector by applying the YAML file:

```shell
kubectl apply -f <connector_filename>.yaml
```

You can view the status of the connector by describing the custom resource:

```shell
kubectl describe kafkaconnector <connector_name>
```
