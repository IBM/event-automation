---
title: "Modifying installation settings"
excerpt: "Modify your existing Event Streams installation."
categories: administering
slug: modifying-installation
toc: true
---

You can modify the configuration settings for your existing {{site.data.reuse.es_name}} installation by using the {{site.data.reuse.openshift_short}} web console or the Kubernetes command-line tool (`kubectl`). The configuration changes are applied by updating the `EventStreams` custom resource.
You can modify existing values and introduce new properties as outlined under [configuration settings](../../installing/configuring).

**Note:** Some settings might cause affected components of your {{site.data.reuse.es_name}} instance to restart.

For examples of changes you might want to make for performance reasons, see [scaling your {{site.data.reuse.es_name}} instance](../scaling/).

## Using the {{site.data.reuse.openshift_short}} web console
{: #using-the-openshift-web-console}

To modify configuration settings by using the {{site.data.reuse.openshift_short}} web console:
1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator}}
4. {{site.data.reuse.task_openshift_select_instance}}
5. Click the **YAML** tab to edit the custom resource.
6. Make the required changes on the page, or you can click **Download** and make the required changes in a text editor.
   If you clicked **Download** you will need to drag and drop the modified custom resource file onto the page so that it updates in the web console.
7. Click the **Save** button to apply your changes.


## Using the Kubernetes command-line tool (`kubectl`)
{: #using-the-kubernetes-command-line-tool-kubectl}

To modify configuration settings by using the Kubernetes command-line tool (`kubectl`):
1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to edit your `EventStreams` custom resource in your default editor:

   ```shell
   kubectl edit eventstreams <instance_name>
   ```

3. Make the required changes in your editor.
4. Save and quit the editor to apply your changes.


## Modifying Kafka broker configuration settings
{: #modifying-kafka-broker-configuration-settings}

Kafka supports a number of [key/value pair settings](http://kafka.apache.org/37/documentation/#brokerconfigs){:target="_blank"} for broker configuration, typically provided in a properties file.

In {{site.data.reuse.es_name}}, these settings are defined in an `EventStreams` custom resource under the `spec.strimziOverrides.kafka.config` property.

For example, to set the number of I/O threads to `24` you can add the `spec.strimziOverrides.kafka.config["num.io.threads"]` property:

```yaml
apiVersion: eventstreams.ibm.com/v1
kind: EventStreams
metadata:
  name: example-broker-config
  namespace: myproject
spec:
  # ...
  strimziOverrides:
    kafka:
      # ...
      config:
         # ...
         num.io.threads: 24
```

You can specify all the broker configuration options supported by Kafka except those managed directly by {{site.data.reuse.es_name}}. For further information, see the list of [supported configuration options](https://strimzi.io/docs/operators/1.0.0/configuring.html#type-KafkaClusterSpec-reference){:target="_blank"}.

## Modifying message browser configuration settings
{: #modifying-message-browser-configuration-settings}

The message browser, available through the **Messages** tab in the {{site.data.reuse.es_name}} UI, displays messages from your topics. The message browser uses a Kafka consumer client configured with default Kafka settings. The consumer reads all messages from all partitions and processes the partitions in batches. For topics with a large number of partitions, the messages are consumed in batches of up to 20 partitions at a time. If the partitions contain large messages, you can reduce the number of partitions in the batch to reduce the amount of data transferred in each consumer poll. If the message sizes are very small, you can consume from more than 20 partitions at a time. You can modify this batch size based on your topic configuration.

The Kafka consumer client defaults limit the consumer to fetch a maximum of 1 MiB per partition and a maximum of 50 MiB total per topic on each fetch. This means the message browser cannot read messages larger than 1 MiB. For topics with larger messages, you must increase these limits to view those messages.

The Kafka consumer client reads messages as an infinite stream through multiple polling calls. To simulate this behavior within the HTTP request and response window, the Kafka consumer client issues one or more polls until all messages are returned, or until either the time limit is reached or the maximum number of consecutive empty polls is reached. The message browser allows a maximum of 5 seconds for the consumer to retrieve messages. In a busy cluster, it is possible that a consumer poll might return no messages. If 10 consecutive poll requests return no messages, the request is also terminated. You can modify these values to increase the time limit or the maximum number of consecutive empty polls.

To reduce memory usage, the message browser limits the size of message data that it displays. Message header values are limited to 1024 bytes, and message keys and values are limited to 8192 bytes each. You can modify these limits if your messages exceed these values or if you want to adjust memory usage.

The following table shows the environment variables you can configure for the message browser:

| Environment variable | Type | Default | Description |
|---------------------|------|---------|-------------|
| `MESSAGE_BROWSER_BATCH_SIZE` | Integer | 20 | Number of partitions to process in each batch. |
| `MESSAGE_BROWSER_MAX_PARTITION_FETCH_BYTES` | Integer | 1,048,576 (1 MiB) | Maximum bytes per partition per request. |
| `MESSAGE_BROWSER_FETCH_MAX_BYTES` | Integer | 52,428,800 (50 MiB) | Maximum total bytes per request. |
| `MESSAGE_BROWSER_MAX_FETCH_TIME` | Long | 5000 (5 seconds) | Maximum time to retrieve messages. |
| `MESSAGE_BROWSER_MAX_EMPTY_POLLS` | Integer | 10 | Maximum consecutive empty reads before stopping. |
| `MESSAGE_BROWSER_HEADER_VALUE_LENGTH` | Integer | 1024 | Maximum size for message headers. |
| `MESSAGE_BROWSER_KEY_LENGTH` | Integer | 8192 | Maximum size for message keys. |
| `MESSAGE_BROWSER_VALUE_LENGTH` | Integer | 8192 | Maximum size for message values. |

To configure the environment variables, edit the `eventstreams` custom resource and add the variables to the `adminApi` section of the `spec`. For example:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
  # ...
  adminApi:
    env:
      - name: MESSAGE_BROWSER_BATCH_SIZE
        value: '20'
      - name: MESSAGE_BROWSER_MAX_PARTITION_FETCH_BYTES
        value: '1048576'
      - name: MESSAGE_BROWSER_FETCH_MAX_BYTES
        value: '52428800'
      - name: MESSAGE_BROWSER_MAX_FETCH_TIME
        value: '5000'
      - name: MESSAGE_BROWSER_MAX_EMPTY_POLLS
        value: '10'
      - name: MESSAGE_BROWSER_HEADER_VALUE_LENGTH
        value: '1024'
      - name: MESSAGE_BROWSER_KEY_LENGTH
        value: '8192'
      - name: MESSAGE_BROWSER_VALUE_LENGTH
        value: '8192'
```