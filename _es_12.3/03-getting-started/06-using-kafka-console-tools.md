---
title: "Using Apache Kafka console tools"
excerpt: "Using Apache Kafka console tools with Event Streams."
categories: getting-started
slug: using-kafka-console-tools
toc: true
---

Apache Kafka comes with a variety of console tools for simple administration and messaging operations. You can find these console tools in the `bin` directory of your [Apache Kafka download](https://www.apache.org/dyn/closer.cgi?path=/kafka/4.0.0/kafka_2.13-4.0.0.tgz){:target="_blank"}.

{{site.data.reuse.es_name}} also provides its own [command-line interface (CLI)](../../installing/post-installation/#installing-the-event-streams-command-line-interface) and this offers many of the same capabilities as the Kafka tools in a simpler form.

**Note:** Kafka console tools can be used with {{site.data.reuse.es_name}}. However, using the tools to manage Kafka resources is not recommended because {{site.data.reuse.es_name}} manages resources through custom resources, which means that changes made by using Kafka console tools might be overwritten. To avoid this issue, use the {{site.data.reuse.es_name}} CLI.

The following table shows which Apache Kafka 4.0 or later console tools are recommended or not recommended for use with {{site.data.reuse.es_name}}, and whether there are CLI equivalents.

| Console tool     | Recommended for use with {{site.data.reuse.es_name}} | CLI equivalent  |
|:-----------------|:-----------------|:-----------------|
| `kafka-acls.sh`    | Not recommended | `kubectl es acls` |
| `kafka-broker-api-versions.sh` | Recommended | |
| `kafka-configs.sh --entity-type topics` | Not recommended | `kubectl es topic-update` |
| `kafka-configs.sh --entity-type brokers` | Not recommended | `kubectl es broker-config` |
| `kafka-configs.sh --entity-type brokers --entity-default` | Not recommended | `kubectl es cluster-config` |
| `kafka-configs.sh --entity-type clients` | Not recommended | No - see the `KafkaUser` [quota support](../../administering/quotas/) |
| `kafka-configs.sh --entity-type users` | Not recommended | `kubectl es kafka-user` |
| `kafka-console-consumer.sh` | Recommended | |
| `kafka-console-producer.sh` | Recommended | |
| `kafka-consumer-groups.sh --list` | Recommended | `kubectl es groups` |
| `kafka-consumer-groups.sh --describe` | Recommended | `kubectl es group` |
| `kafka-consumer-groups.sh --reset-offsets` | Recommended | `kubectl es group-reset` |
| `kafka-consumer-groups.sh --delete` | Recommended | `kubectl es group-delete` |
| `kafka-consumer-perf-test.sh` | Recommended | |
| `kafka-delete-records.sh` | Not recommended | `kubectl es topic-delete-records` |
| `kafka-producer-perf-test.sh` | Recommended | |
| `kafka-streams-application-reset.sh` | Recommended | |
| `kafka-topics.sh --list` | Not recommended | `kubectl es topics` |
| `kafka-topics.sh --describe` | Not recommended | `kubectl es topic` |
| `kafka-topics.sh --create` | Not recommended | `kubectl es topic-create` |
| `kafka-topics.sh --delete` | Not recommended | `kubectl es topic-delete` |
| `kafka-topics.sh --alter --config` | Not recommended | `kubectl es topic-update` |
| `kafka-topics.sh --alter --partitions` | Not recommended | `kubectl es topic-partitions-set` |
| `kafka-topics.sh --alter --replica-assignment` | Recommended |  |
| `kafka-verifiable-consumer.sh` | Recommended | |
| `kafka-verifiable-producer.sh` | Recommended | |

**Note:** For tools marked as not recommended, consider using the CLI equivalents where available to avoid issues, or manage resources through {{site.data.reuse.es_name}} custom resources.

## Using the console tools with {{site.data.reuse.es_name}}
{: #using-the-console-tools-with-event-streams}

The console tools are Kafka client applications and connect in the same way as regular applications.

Follow the [instructions for securing a connection](../../getting-started/connecting/#securing-the-connection) to obtain:
* Your cluster’s broker URL
* The truststore certificate
* An API key

Many of these tools perform administrative tasks and will need to be authorized accordingly.

Create a properties file based on the following example:

```shell
security.protocol=SASL_SSL
ssl.protocol=TLSv1.3
ssl.truststore.location=<certs.jks_file_location>
ssl.truststore.password=<truststore_password>
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="token" password="<api_key>";
```

Replace:
* `<certs.jks_file_location>` with the path to your truststore file
* `<truststore_password>` with `"password"`
* `<api_key>` with your API key


### Example - console producer
{: #example---console-producer}

You can use the Kafka console producer tool with {{site.data.reuse.es_name}}.

After you've created the properties file as described previously, you can run the console producer in a terminal as follows:

```shell
./kafka-console-producer.sh --broker-list <broker_url> --topic <topic_name> --producer.config <properties_file>
```

Replace:
* `<broker_url>` with your cluster's broker URL
* `<topic_name>` with the name of your topic
* `<properties_file>` with the name of your properties file including full path to it


### Example - console consumer
{: #example---console-consumer}

You can use the Kafka console consumer tool with {{site.data.reuse.es_name}}.

After you've created the properties file as described previously, you can run the console consumer in a terminal as follows:

```shell
./kafka-console-consumer.sh --bootstrap-server <broker_url> --topic <topic_name> --from-beginning --consumer.config <properties_file>
```

Replace:
* `<broker_url>` with your cluster's broker URL
* `<topic_name>` with the name of your topic
* `<properties_file>` with the name of your properties file including full path to it
