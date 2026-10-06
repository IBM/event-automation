---
title: "Migrating Kafka Connect"
excerpt: "Migrate your Kafka Connect cluster from Event Streams to Confluent Platform."
categories: migration
slug: connect-migration
toc: true
---

Migrate your {{site.data.reuse.es_name}} Kafka Connect cluster to Confluent for Kubernetes (CFK). Complete [before you begin](#before-you-begin) and [building the plugin image](#plugin-image) before starting the migration steps.

## Overview
{: #overview}

{{site.data.reuse.es_name}} runs Kafka Connect as a `KafkaConnect` deployment, with connectors defined as `KafkaConnector` custom resources. CFK runs the equivalent as a `Connect` custom resource managed by the Confluent Operator, with connectors defined as `Connector` custom resources.

The migration covers the following areas:

- **Before you begin:** Collect your existing connector configuration, state topic names, data formats, and offset handling requirements before making any changes.
- **Plugin image:** Connector plugin JARs must be packaged into a CFK-compatible container image before the new Connect cluster can start.
- **Stopping in the correct order:** Connectors and then the Connect cluster must be stopped in the correct order to avoid data loss or offset corruption.
- **Topic handling:** Decide whether to mirror the Kafka topic to Confluent by using Cluster Linking or create a new topic on Confluent for the connector to write to.
- **Offset continuity:** Ensure that the Confluent connector resumes from the position where the {{site.data.reuse.es_name}} connector stopped. You can do this either by extracting and injecting the offset manually, or by mirroring the internal Connect state topics to Confluent by using Cluster Linking.

### Determining connector offset handling requirements
{: #offset-applicability}

Some connectors track their read position in the Connect offset-storage topic, while others track offsets differently or rely on transactional mechanisms in the source system. [Step 2](#extract-offset) and [step 9](#configure-offset) are conditional and apply only to connectors that use the Connect offset topic. Use the following table to determine which action to take for your connector type:

| Connector type | Uses the Connect offset topic? | Action |
|---|---|---|
| Most source connectors (for example, JDBC, Debezium, or File connectors) | Yes. | Complete steps 2 and 9. |
| IBM open-source MQ source connector, at-least-once delivery | No. Relies on JMS queue transactions. | Skip steps 2 and 9. |
| IBM open-source MQ source connector, exactly-once delivery | Yes. Tracks a `sequence-id` in Connect offset storage alongside the MQ state queue. | Complete steps 2 and 9, and retain the MQ state queue. |
| Sink connectors | No. Position is tracked by using standard Kafka consumer groups. | Skip steps 2 and 9. |

**Note:** Both the connector you are migrating from and the connector you are migrating to determine which steps apply. If you are replacing the IBM open-source MQ connector with the Confluent IBM MQ connector, the class name and offset format change, so there is no offset to inject even if the original connector recorded one. In that case, skip steps 2 and 9, and instead confirm in [step 5](#verify-consumer-lag) that downstream consumers have processed everything the original connector produced.

For connector-specific offset behavior, see [migrating connectors](../connector-migration/#connector-offset-handling).

## Before you begin
{: #before-you-begin}

Ensure you have the following information from {{site.data.reuse.es_name}} before you begin the migration.

Run the following commands to list your existing Kafka Connect resources:

```bash
oc get kafkaconnect -n <es-namespace> -o yaml
oc get kafkaconnectors -n <es-namespace> -o yaml
```

Note the following from the output:

- For each `KafkaConnect` custom resource: the names of the three internal state topics: `config.storage.topic`, `offset.storage.topic`, and `status.storage.topic`.
- For each `KafkaConnector` custom resource: the connector class (`spec.class`), task count (`spec.tasksMax`), full `spec.config` map, and the topic the connector writes to or reads from.
- The data format that the connector uses, including message format, schema, and serialization. Determine whether the Confluent connector equivalent produces or consumes data in the same format, as any differences affect how you update the client application.

## Building the plugin image
{: #plugin-image}

Both {{site.data.reuse.es_name}} and CFK package connector plugin JARs into a custom container image. You must build a CFK-compatible image before you can deploy the new Connect cluster. Use the `cp-server-connect` base image from [Docker Hub: confluentinc/cp-server-connect](https://hub.docker.com/r/confluentinc/cp-server-connect/tags){:target="_blank"} and add your plugin JARs to it. Match the image tag to your target Confluent Platform version (for example, `7.8.0` for CP 7.8). If your cluster has no internet access, mirror the base image into your internal registry before building.

For other options on installing connector plugins, see the [Confluent documentation](https://docs.confluent.io/operator/current/co-configure-connect.html#install-connector-plugin){:target="_blank"}.

Complete the following steps to build and push the image:

1. Create a Dockerfile with the following base image by using any Docker-compatible tool, such as Docker Desktop, Podman, Buildah, or a build pipeline:

   ```dockerfile
   FROM confluentinc/cp-server-connect:<cp-version>
   ```

   Where `<cp-version>` is the Confluent Platform version that matches your target deployment, available on [Docker Hub: confluentinc/cp-server-connect](https://hub.docker.com/r/confluentinc/cp-server-connect/tags){:target="_blank"}.

2. Add your connector plugins to the Dockerfile by using one of the following approaches:

   - By installing from Confluent Hub (requires internet access at build time):

     ```dockerfile
     RUN confluent-hub install --no-prompt confluentinc/kafka-connect-ibmmq:<source-version> \
         && confluent-hub install --no-prompt confluentinc/kafka-connect-ibmmq-sink:<sink-version>
     ```

     Where:
     - `<source-version>` is your required version of the IBM MQ source connector, available on [Confluent Hub: kafka-connect-ibmmq](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq){:target="_blank"}.
     - `<sink-version>` is your required version of the IBM MQ sink connector, available on [Confluent Hub: kafka-connect-ibmmq-sink](https://www.confluent.io/hub/confluentinc/kafka-connect-ibmmq-sink){:target="_blank"}.

     **Important:** The IBM MQ connectors for Confluent Platform do not include the IBM MQ client library. For more information, see the [Confluent instructions for installing the IBM MQ client library](https://docs.confluent.io/kafka-connectors/ibmmq-sink/current/overview.html#install-ibm-mq-client-library){:target="_blank"}.

   - By copying a single custom JAR (place it in a dedicated subdirectory, because Kafka scans each subdirectory as a separate plugin):

     ```dockerfile
     COPY ./my-custom-connector-1.0.0.jar /opt/kafka/plugins/my-custom-connector/
     ```

   - By copying a full plugins directory from your existing {{site.data.reuse.es_name}} image:

     ```dockerfile
     COPY ./plugins/ /opt/kafka/plugins/
     ```

3. Run the following commands to build and push the image:

   ```bash
   docker build -t <your-registry>/confluent-connect-custom:1.0.0 .
   docker push <your-registry>/confluent-connect-custom:1.0.0
   ```

**Important:** The image must be available in a registry that the CFK cluster can pull from. Ensure that `pullSecretRef` is set correctly in the `Connect` custom resource.

## Migrating Kafka Connect
{: #migration-steps}

Complete the following steps to migrate Kafka Connect. Steps 2 and 9 apply only to certain connector types. Before you start, check the [connector offset handling requirements table](#offset-applicability) to confirm which steps apply to your connector.

### Step 1: Stopping the connectors on {{site.data.reuse.es_name}}
{: #stop-connectors}

Stop each `KafkaConnector`. After this step, the source system stops sending messages and Kafka stops receiving them.

Run the following command to stop each connector:

```bash
kubectl patch kafkaconnectors.eventstreams.ibm.com <name> -n <es-namespace> \
  --type merge -p '{"spec":{"state":"stopped"}}'
```

Repeat for each connector. Confirm each connector status shows `STOPPED` before proceeding.

### Step 2 (Optional): Extracting the offset from the {{site.data.reuse.es_name}} connector
{: #extract-offset}

**Note:** This step applies only to connectors that use the Connect offset topic to track their read position. If your connector does not use the offset topic, skip this step. For more information, see the [connector offset handling requirements table](#offset-applicability).

Use one of the following methods to extract the offset position of each source connector, and save the output. You need it in [step 9](#configure-offset) to resume each connector from the same point on Confluent Platform:

#### By using the Connect REST API
{: #extract-offset-rest-api}

Use this method while the cluster is still running. The Connect REST API is unavailable after the cluster is scaled down.

Run the following command to retrieve the current offset for a connector:

```bash
curl http://<es-connect>:8083/connectors/<connector-name>/offsets
```

The response is a partition and offset map specific to the connector type. For example, when the IBM MQ source connector runs in exactly-once delivery mode, it records a `sequence-id` in Kafka Connect offset storage.

#### By using the KafkaConnector custom resource
{: #extract-offset-kafkaconnector-cr}

If the cluster is still managed by {{site.data.reuse.es_name}}, use the `KafkaConnector` custom resource to export offsets to a ConfigMap without running a command directly in the pod. Complete the following steps for each connector:

1. Update the `KafkaConnector` custom resource to trigger the offset export:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1
   kind: KafkaConnector
   metadata:
     name: <connector-name>
     namespace: <es-namespace>
   spec:
     listOffsets:
       toConfigMap:
         name: <connector-name>-offsets
   ```

2. Run the following command to annotate the connector and start the export:

   ```bash
   oc annotate kafkaconnector <connector-name> \
     eventstreams.ibm.com/connector-offsets=list -n <es-namespace>
   ```

3. Run the following command to read the offsets from the resulting ConfigMap:

   ```bash
   oc get configmap <connector-name>-offsets -n <es-namespace> -o yaml
   ```

   The `data.offsets.json` field contains the partition and offset map you need for [step 9](#configure-offset).

#### By reading the offset topic directly
{: #extract-offset-topic}

Use this method if the Connect cluster is already stopped and neither of the earlier methods is available.

Complete the following steps:

1. Log in to the {{site.data.reuse.es_name}} user interface.
2. Click **Topics** in the navigation panel.
3. Click the name of your offset topic.
4. Click the **Messages** tab and read the records directly.

**Note:** Internal Kafka Connect topics might be hidden by default. If you cannot see them in the topic list, enable **Show internal topics** in the topic filter.

### Step 3: Stopping the {{site.data.reuse.es_name}} Kafka Connect cluster
{: #stop-connect-cluster}

After all connectors are stopped and offsets are recorded, scale down the `KafkaConnect` cluster so no further offset commits occur.

Run the following command to scale down the cluster:

```bash
kubectl patch kafkaconnects.eventstreams.ibm.com <name> -n <es-namespace> \
  --type merge -p '{"spec":{"replicas":0}}'
```

### Step 4: Deciding how to handle the topic
{: #handle-topic}

Choose one of the following approaches for the Kafka topic that the connector was reading from or writing to:

- **Mirror the topic by using Cluster Linking:** If the business topic on {{site.data.reuse.es_name}} needs to be available on Confluent, mirror it by using a Cluster Link and wait for the lag to reach zero before promoting. For instructions, see [migrating topics](../migrating-topics/).
- **Create the topic directly in Confluent:** Create the corresponding topic directly in the Confluent cluster, by using the same partition count and configuration as the original.

**Important:** Cluster Linking does not support mirroring topics that contain transactional messages. If the {{site.data.reuse.es_name}} Connect cluster ran with `exactly.once.source.support` set to `enabled`, create the topic directly in Confluent instead of mirroring it, and use the [consumer lag check](#verify-consumer-lag) to confirm that downstream consumers have drained the original topic first.

### Step 5: Ensuring the consuming application has processed all messages
{: #verify-consumer-lag}

Before proceeding with the migration, confirm that all downstream consumers have processed every message that the {{site.data.reuse.es_name}} connector produced.

To check consumer group lag, complete the following steps:

1. Log in to the {{site.data.reuse.es_name}} user interface.
2. Click **Topics** in the navigation panel.
3. Click the name of your topic.
4. Click the **Consumer groups** tab, select the relevant consumer group, and confirm the lag is zero for all partitions.

### Step 6: Understanding configuration and data format changes
{: #understand-config-format}

Before configuring the Confluent connector, review the following areas:

- **Connector configuration:** Review how the Confluent connector equivalent is configured and where it differs from the {{site.data.reuse.es_name}} connector. For the field mapping, see [migrating connectors](../connector-migration/).
- **Data format:** Confirm that the Confluent connector produces or consumes data in the same message format, schema, and serialization as the {{site.data.reuse.es_name}} connector. Any differences require updates to the client application before the migration.

### Step 7: Updating the client application
{: #update-client-application}

If the data format or schema produced or consumed by the Confluent connector differs from the {{site.data.reuse.es_name}} connector, update the client application to handle the new format before starting the Confluent connector.

**Important:** Do not start the Confluent connector until the client application is deployed and ready to process messages in the new format. Starting the connector before the client is ready causes processing failures.

### Step 8: Deploying the CFK Connect cluster
{: #deploy-cfk-connect}

Deploy the Confluent for Kubernetes Connect cluster by applying a `Connect` custom resource that points to your custom plugin image. Choose one of the following approaches for how the new cluster handles the internal Connect state topics:

| | Approach A: New empty topics (default) | Approach B: Mirror state topics by using Cluster Linking |
|---|---|---|
| Use when | Switching connector classes, the connector name is changing, or you require manual control over the offset | Migrating to the same source connector class, keeping the same connector name, and not using exactly-once source support |
| Offset handling | Manual. Inject the offset in [step 9](#configure-offset). | Automatic. The connector resumes from the mirrored offset topic. [Step 9](#configure-offset) is not required if resumption is verified. |
| Sink connector support | Yes | No. Sink connectors track position by using consumer groups, not the Connect offset topic, so mirroring state topics does not apply. |
| Extra prerequisite | None | A Cluster Link from {{site.data.reuse.es_name}} to Confluent Platform must already exist. |

**Important:** Set `spec.groupID` to a value that is unique across all Connect clusters sharing the same Confluent Kafka cluster. Two Connect clusters on the same Kafka cluster must not share a `group.id` or internal state topics.

Offset resumption does not depend on `groupID`. A source connector resumes from whichever offset topic its Connect cluster is pointed at, by using records keyed by connector name and source partition. For resumption to work, all three of the following conditions must be met:

- **The offset topic contains the original records.** This is why [approach B](#deploy-cfk-connect-cluster-linking) mirrors the {{site.data.reuse.es_name}} state topics. Without them there is nothing to resume from, and you must inject the offset manually in [step 9](#configure-offset).
- **The connector name is unchanged.** Sink connector consumer groups are named `connect-<connector-name>`, so a renamed connector loses its position too.
- **The source partition format is compatible.** The connector class and its configuration must produce the same partition keys as before.

Before applying the `Connect` custom resource, retrieve the bootstrap address of your Confluent Kafka cluster, as you need it in the `bootstrapEndpoint` field. Run the following command to retrieve the internal listener endpoint from the `status.listeners` field of your `Kafka` custom resource:

```bash
kubectl get kafkas.platform.confluent.io <kafka-name> -n <cp-namespace> \
  -o jsonpath='{.status.listeners.internal.internalEndpoint}'
```

To list all configured listeners and their endpoints, run the following command:

```bash
kubectl get kafkas.platform.confluent.io <kafka-name> -n <cp-namespace> \
  -o jsonpath='{.status.listeners}'
```

#### Approach A: New empty topics (default)
{: #deploy-cfk-connect-new-topics}

Complete the following steps to deploy the Connect cluster with new empty topics:

1. Apply the following `Connect` manifest:

   ```yaml
   apiVersion: platform.confluent.io/v1beta1
   kind: Connect
   metadata:
     name: connect
     namespace: <cp-namespace>
   spec:
     replicas: 1
     groupID: cfk-connect-cluster
     internalTopicNames:
       configs: cfk-connect-configs
       offsets: cfk-connect-offsets
       status: cfk-connect-status
     image:
       application: <your-registry>/confluent-connect-custom:1.0.0
       init: confluentinc/confluent-init-container:<init-version>
       pullSecretRef:
         - <your-pull-secret>
     configOverrides:
       server:
         - plugin.path=/usr/share/java,/usr/share/confluent-hub-components,/opt/kafka/plugins
     dependencies:
       kafka:
         bootstrapEndpoint: <kafka-name>.<cp-namespace>.svc.cluster.local:9071
   ```

   The custom resource sets a `groupID` that is unique on the Confluent cluster, and creates three new, empty state topics with the names specified in `internalTopicNames`. The topic names in this example are illustrative. You can use any names that follow your local conventions. For more information, see [changing the state topic names](#changing-state-topic-names).

   Where `<init-version>` is the Confluent init container version that matches your CFK deployment. For the correct value, see the [Confluent documentation](https://docs.confluent.io/operator/current/release-notes.html){:target="_blank"}.

2. Run the following commands to apply the manifest and wait for the cluster to be ready:

   ```bash
   kubectl apply -f connect.yaml
   kubectl wait connects.platform.confluent.io/connect -n <cp-namespace> \
     --for=jsonpath='{.status.phase}'=RUNNING \
     --timeout=300s
   ```

3. After the cluster is running, continue with [step 9](#configure-offset) to inject the offset manually.

#### Approach B: Mirror state topics by using Cluster Linking
{: #deploy-cfk-connect-cluster-linking}

In this approach, the three internal Connect state topics (`offset.storage.topic`, `config.storage.topic`, `status.storage.topic`) are mirrored from {{site.data.reuse.es_name}} to Confluent. The new Connect cluster then points at the promoted topics and resumes from the last committed offset position. Offset records are keyed as `[connector-name, {source-partition-map}]`, so the connector resumes correctly as long as the connector name remains the same. If resumption is verified when [creating the connector](#deploy-cfk-connect-cluster-linking-verify), skip [step 9](#configure-offset).

**Important:** Do not use this approach if the {{site.data.reuse.es_name}} Connect cluster ran with `exactly.once.source.support` set to `enabled`. Under exactly-once source support, tasks commit their offsets to the offset topic inside a Kafka transaction, and Cluster Linking does not support mirroring topics that contain messages produced by using Kafka transactions. Because `exactly.once.source.support` is a worker-level setting that applies to every worker in the Connect cluster, the offset topic is affected for all source connectors on that cluster, not only the connectors that require exactly-once delivery. In this case, use [Approach A](#deploy-cfk-connect-new-topics) and inject the offset manually in [step 9](#configure-offset).

**Note:** Validate this approach in a non-production environment before applying it in a production migration. The `config.storage.topic` carries worker-generation records in addition to connector configuration, which a new cluster might need to reconcile. If you are switching connector classes, the offset partition key format might also differ. If any issues arise, use Approach A and inject the offset manually in [step 9](#configure-offset) instead.

**Prerequisites:**

Before completing the steps in this approach, ensure the following prerequisites are met:

- A Cluster Link is established from {{site.data.reuse.es_name}} to Confluent Platform. For instructions, see [migrating topics](../migrating-topics/).
- You have scaled the {{site.data.reuse.es_name}} Connect cluster to zero replicas in [step 3](#stop-connect-cluster), so no further writes occur before mirroring completes.

Complete the following steps to deploy the Connect cluster by using mirrored state topics:

1. **Mirror and promote the Connect state topics:** For each of the three state topics (`config.storage.topic`, `offset.storage.topic`, `status.storage.topic`), create a mirror topic on the Confluent cluster, wait for replication lag to reach zero, and then promote it to a writable topic. Use the same mirror, verify, and promote sequence described in [migrating topics](../migrating-topics/). After promotion, the topics are fully writable and no longer linked to {{site.data.reuse.es_name}}.

   **Important:** Confirm that the offset topic lag is zero before promoting. Promoting before all offset records have replicated means the Confluent connector will not see the final committed position and will not resume correctly.

2. **Deploy the CFK Connect cluster pointing at the mirrored topics:** Apply the following `Connect` manifest by using the promoted topic names. Set `spec.groupID` to a new, unique value.

   ```yaml
   apiVersion: platform.confluent.io/v1beta1
   kind: Connect
   metadata:
     name: connect
     namespace: <cp-namespace>
   spec:
     replicas: 1
     groupID: <new-unique-group-id>
     internalTopicNames:
       configs: <es-config-topic-name>
       offsets: <es-offset-topic-name>
       status: <es-status-topic-name>
     image:
       application: <your-registry>/confluent-connect-custom:1.0.0
       init: confluentinc/confluent-init-container:<init-version>
       pullSecretRef:
         - <your-pull-secret>
     configOverrides:
       server:
         - plugin.path=/usr/share/java,/usr/share/confluent-hub-components,/opt/kafka/plugins
     dependencies:
       kafka:
         bootstrapEndpoint: <kafka-name>.<cp-namespace>.svc.cluster.local:9071
   ```

   Where:
   - `<es-config-topic-name>`, `<es-offset-topic-name>`, and `<es-status-topic-name>` are the topic names recorded in [Before you begin](#before-you-begin).
   - `<init-version>` is the Confluent init container version that matches your CFK deployment. For the correct value, see the [Confluent documentation](https://docs.confluent.io/operator/current/release-notes.html){:target="_blank"}.

   **Note:** Use `spec.groupID` and `spec.internalTopicNames` for the group ID and state topic names rather than setting them in `configOverrides.server`. CFK reads these from its own model to populate the custom resource status. Values set only in `configOverrides.server` are not reflected there. Use `configOverrides.server` only for properties that have no dedicated custom resource field, such as `plugin.path`. To use different topic names, see [changing the state topic names](#changing-state-topic-names).

3. **Create the connector and verify resumption.** Complete the following steps to create the connector and confirm that it resumes from the correct position:
   {: #deploy-cfk-connect-cluster-linking-verify}

   a. Run the following command to apply the `Connector` custom resource:

      ```bash
      kubectl apply -f connector.yaml
      ```

   b. Run the following command to verify that the reported offset matches the value recorded in [step 2](#extract-offset):

      ```bash
      curl <connect-endpoint>/connectors/<connector-name>/offsets
      ```

      If the offsets match, the connector has resumed correctly. Skip [step 9](#configure-offset) and continue from [step 10](#start-confluent-connector).

      **Note:** If the offset does not match, pause the connector immediately by annotating the `Connector` custom resource with `platform.confluent.io/pause-connector="true"`, and use Approach A with manual injection in [step 9](#configure-offset) instead.

### Step 9 (Optional): Configuring the Confluent connector to start from the correct offset
{: #configure-offset}

**Note:** Skip this step if either of the following conditions apply:
- Your connector does not use the Connect offset topic. See the [connector offset handling requirements table](#offset-applicability) to check.
- You used [approach B](#deploy-cfk-connect-cluster-linking) and confirmed resumption when [creating the connector](#deploy-cfk-connect-cluster-linking-verify).

Before creating the connector on Confluent Platform, set the offset position so that it resumes from exactly where the {{site.data.reuse.es_name}} connector stopped. Choose one of the following options:

| | Option A: REST API with a stopped connector | Option B: Write to the offset topic directly |
|---|---|---|
| Requires | Confluent Platform 7.7 or later (Kafka Connect 3.7 or later, for `initial_state`) and Platform 7.6 or later (Kafka Connect 3.6 or later, for the offsets API) | Any Confluent Platform version. |
| Use when | Option A is available. | Option A is not available and you are familiar with the connector's exact offset-key format |
| Risk | Lowest. The offset is injected before the connector runs. | Tightly coupled to connector-specific serialization. Validate in a non-production environment first. |

#### Option A: By using the Connect REST API with a stopped connector
{: #option-a-rest-api}

Creating the connector in a stopped state by using the REST API gives you a clean window to inject and verify the offset before any messages are read from the source.

**Note:** The CFK `Connector` custom resource does not support a `spec.state` field, which means you cannot declare a connector in a stopped state by using `kubectl apply`. Create the connector directly by using the Connect REST API, inject the offset, and then apply the matching CFK `Connector` custom resource to bring it under operator management.

**Important:** If the REST API for your Connect cluster is secured with HTTPS, add `--cacert <ca-cert-path>` to the `curl` commands in this step. Calls through the internal Kubernetes service endpoint are often plain HTTP within the cluster. Check `restConfig` in your `Connect` custom resource to determine the scheme in use.

1. Run the following command to check your `Connect` custom resource status and retrieve the Connect REST endpoint:

   ```bash
   kubectl get connects.platform.confluent.io <connect-name> -n <cp-namespace> \
     -o jsonpath='{.status.restConfig.internalEndpoint}'
   ```

   Use the internal endpoint from within the cluster (for example, from a `kubectl run` debug pod in the same namespace). To reach the REST API from your local machine, run the following command to set up port forwarding:

   ```bash
   kubectl port-forward -n <cp-namespace> svc/connect 8083:8083
   ```

2. Run the following command to create the connector by using the REST API with `initial_state` set to `STOPPED`:

   ```bash
   curl -X POST <connect-endpoint>/connectors \
     -H 'Content-Type: application/json' \
     -d '{
       "name": "<connector-name>",
       "config": { <connector-config> },
       "initial_state": "STOPPED"
     }'
   ```

   Where `<connector-config>` is the Confluent connector configuration that corresponds to your {{site.data.reuse.es_name}} `KafkaConnector` custom resource, as reviewed in [step 6](#understand-config-format). For the field mapping, see [migrating connectors](../connector-migration/).

3. Run the following command to confirm that the connector is stopped before you inject the offset:

   ```bash
   curl <connect-endpoint>/connectors/<connector-name>/status
   ```

   The response must show `STOPPED` in the `connector.state` field.

4. Run the following command to inject the offset that was extracted from {{site.data.reuse.es_name}} in [step 2](#extract-offset):

   ```bash
   curl -X PATCH <connect-endpoint>/connectors/<connector-name>/offsets \
     -H 'Content-Type: application/json' \
     -d '<offset-payload-from-step-2>'
   ```

5. Run the following command to retrieve the offset and confirm that the value matches before you resume the connector:

   ```bash
   curl <connect-endpoint>/connectors/<connector-name>/offsets
   ```

6. After you verify the offset, run the following command to apply the matching CFK `Connector` custom resource to bring it under operator management. Confirm that reconciliation does not overwrite the configuration or state:

   ```bash
   kubectl apply -f connector.yaml
   ```

For more information about translating the `KafkaConnector` custom resource to a CFK `Connector` custom resource, see [migrating connectors](../connector-migration/).

#### Option B: By writing the offset directly to the offset topic
{: #option-b-write-offset-topic}

Use this option only if Option A is not available. This approach is tightly coupled to the exact source-partition format, converters, and serialization of the connector class. Validate the format in a non-production environment before applying it.

The offset topic stores entries as compacted key-value records, where the key identifies the connector instance and source partition, and the value contains the position. The exact format depends on the connector class. Use the offset values saved in [step 2](#extract-offset) to construct the record.

**Important:** In a production cluster, Kafka brokers are secured by using TLS encryption and client authentication. The commands in this step address the internal listener (port `9071`) from inside the broker pod without TLS. In a secured environment, add `--producer.config /path/to/producer.properties` to the producer command and `--consumer.config /path/to/consumer.properties` to the consumer command, where the properties files contain `security.protocol`, `ssl.truststore.*`, and SASL settings for your cluster. Confirm the port for your deployment in the `status.listeners` field of the `Kafka` custom resource.

1. Run the following command to start the `kafka-console-producer` and write to the offset topic:

   ```bash
   kubectl exec -n <cp-namespace> kafka-0 -c kafka -- \
     kafka-console-producer \
       --bootstrap-server localhost:9071 \
       --topic cfk-connect-offsets \
       --property "parse.key=true" \
       --property "key.separator=|"
   ```

2. Enter the key and value on one line separated by `|`, by using the values from [step 2](#extract-offset):

   ```
   ["<connector-name>",{"<partition-key>":"<partition-value>"}]|{"<offset-key>":"<offset-value>"}
   ```

3. Run the following command to verify that the entry is readable before you create the connector:

   ```bash
   kubectl exec -n <cp-namespace> kafka-0 -c kafka -- \
     kafka-console-consumer \
       --bootstrap-server localhost:9071 \
       --topic cfk-connect-offsets \
       --from-beginning \
       --property "print.key=true" \
       --timeout-ms 5000
   ```

4. Run the following command to create the `Connector` custom resource:

   ```bash
   kubectl apply -f connector.yaml
   ```

   Connect workers consume the offset topic continuously, and each connector task reads its offset when the task starts, so the connector starts at the position you specified.

For more information about translating the `KafkaConnector` custom resource to a CFK `Connector` custom resource, see [migrating connectors](../connector-migration/).

### Step 10: Starting the Confluent connector
{: #start-confluent-connector}

Resume the connector so that it starts reading. The connector starts from the offset position set in [step 9](#configure-offset), or from the mirrored offset topic if you used [Approach B](#deploy-cfk-connect-cluster-linking).

Because the connector is managed by CFK at this point, resume it by annotating the `Connector` custom resource. Run the following command:

```bash
kubectl annotate connectors.platform.confluent.io <connector-name> -n <cp-namespace> \
  platform.confluent.io/resume-connector="true"
```

CFK provides equivalent `platform.confluent.io/pause-connector`, `platform.confluent.io/restart-connector`, and `platform.confluent.io/restart-task` annotations, and the same operations are available through the `kubectl confluent connector` plugin. For more information, see the [Confluent documentation](https://docs.confluent.io/operator/current/co-manage-connectors.html){:target="_blank"}.

**Note:** If you created the connector in the `STOPPED` state by using [option A](#option-a-rest-api), confirm that it reaches `RUNNING` after you apply the annotation. If it remains stopped, resume it through the Connect REST API instead, by using the endpoint that you retrieved in [step 9](#option-a-rest-api). Run the following command:

```bash
curl -X PUT <connect-endpoint>/connectors/<connector-name>/resume
```

After resuming the connector, run the following command to confirm that the connector task is in `RUNNING` state:

```bash
curl <connect-endpoint>/connectors/<connector-name>/status
```

### Step 11: Starting the client application
{: #start-client-application}

Start the downstream client application. Confirm that the application is processing messages produced or consumed by the Confluent connector correctly, with no duplicate or missing records.

### Step 12: Validating and monitoring
{: #validate-and-monitor}

Complete the following validation checks:

- Confirm no duplicate or missing records in the external system or downstream consumer.
- Monitor connector task health and consumer group lag.
- Keep the {{site.data.reuse.es_name}} Connect cluster stopped (not deleted) for the validation period. Delete it only after the Confluent cluster has passed validation.

## Rolling back
{: #rolling-back}

If validation fails at any point, use the following guidance to recover without losing data:

- **Approach B resumption offset does not match:** If the offset verified when [creating the connector](#deploy-cfk-connect-cluster-linking-verify) does not match, pause the connector immediately and use [Approach A](#deploy-cfk-connect-new-topics) with manual offset injection in [step 9](#configure-offset) instead.
- **Client application is not ready for the new data format:** Do not proceed to [step 8](#deploy-cfk-connect) until the client is deployed and verified against the new format.
- **Validation fails after migration:** Because the {{site.data.reuse.es_name}} Connect cluster is kept stopped (not deleted) through validation, you can scale it back up (`spec.replicas` > 0) and resume the original connectors, if the source topic and consumer offsets have not been altered since [step 3](#stop-connect-cluster).

## Changing the state topic names
{: #changing-state-topic-names}

To use different names for the three internal state topics (for example, to avoid naming conflicts or follow local conventions), configure the dedicated fields in the `Connect` custom resource before deploying:

```yaml
spec:
  internalTopicNames:
    configs: <your-config-topic>
    offsets: <your-offset-topic>
    status: <your-status-topic>
```

Use `spec.internalTopicNames` instead of `configOverrides.server` for these settings. Confluent for Kubernetes (CFK) populates the custom resource status from its own model rather than from `configOverrides`. Setting `config.storage.topic` or `offset.storage.topic` in `configOverrides.server` causes the custom resource status to display the default Confluent values even though the override takes effect at runtime. Using dedicated custom resource fields ensures that the custom resource status remains accurate.

If you are injecting the offset from the {{site.data.reuse.es_name}} connector ([step 9](#configure-offset)), the offset topic name does not affect injection. The REST API writes directly to the topic that the Connect cluster is configured to use. The topic name only needs to be consistent across the `Connect` custom resource and any tooling that reads the topic directly.

**Note:** The state topic names are fixed for the lifetime of the Connect cluster. Changing topic names after the cluster is running requires a full redeployment, which resets all connector state.

