---
title: "Using Apache Kafka console tools"
excerpt: "Using Apache Kafka console tools with Event Streams."
categories: getting-started
slug: using-kafka-console-tools
toc: true
---

Apache Kafka comes with a variety of console tools for simple administration and messaging operations. You can find these console tools in the `bin` directory of your [Apache Kafka download](https://www.apache.org/dyn/closer.cgi?path=/kafka/3.9.0/kafka_2.13-3.9.0.tgz){:target="_blank"}. Many of these tools can be used with {{site.data.reuse.es_name}}.

{{site.data.reuse.es_name}} also provides its own [command-line interface (CLI)](../../installing/post-installation/#installing-the-event-streams-command-line-interface) and this offers many of the same capabilities as the Kafka tools in a simpler form.

The following table shows which Apache Kafka (release 3.x or later) console tools work with {{site.data.reuse.es_name}} and whether there are CLI equivalents.

| Console tool     | Works with {{site.data.reuse.es_name}}      | CLI equivalent  |
|:-----------------|:-----------------|:-----------------|
| `kafka-acls.sh`    | Yes | |
| `kafka-broker-api-versions.sh` | Yes | |
| `kafka-configs.sh --entity-type topics` | No | `kubectl es topic-update` |
| `kafka-configs.sh --entity-type brokers` | No | `kubectl es broker-config` |
| `kafka-configs.sh --entity-type brokers --entity-default` | No | `kubectl es cluster-config` |
| `kafka-configs.sh --entity-type clients` | No | No - see the `KafkaUser` [quota support](../../administering/quotas/) |
| `kafka-configs.sh --entity-type users` | No | No |
| `kafka-console-consumer.sh` | Yes | |
| `kafka-console-producer.sh` | Yes | |
| `kafka-consumer-groups.sh --list` | Yes | `kubectl es groups` |
| `kafka-consumer-groups.sh --describe` | Yes | `kubectl es group` |
| `kafka-consumer-groups.sh --reset-offsets` | Yes | `kubectl es group-reset` |
| `kafka-consumer-groups.sh --delete` | Yes | `kubectl es group-delete` |
| `kafka-consumer-perf-test.sh` | Yes | |
| `kafka-delete-records.sh` | Yes | `kubectl es topic-delete-records` |
| `kafka-preferred-replica-election.sh` | No | |
| `kafka-producer-perf-test.sh` | Yes | |
| `kafka-streams-application-reset.sh` | Yes | |
| `kafka-topics.sh --list` | Yes | `kubectl es topics` |
| `kafka-topics.sh --describe` | Yes | `kubectl es topic` |
| `kafka-topics.sh --create` | Yes | `kubectl es topic-create` |
| `kafka-topics.sh --delete` | Yes | `kubectl es topic-delete` |
| `kafka-topics.sh --alter --config` | Yes | `kubectl es topic-update` |
| `kafka-topics.sh --alter --partitions` | Yes | `kubectl es topic-partitions-set` |
| `kafka-topics.sh --alter --replica-assignment` | Yes | `kubectl es topic-partitions-set` |
| `kafka-verifiable-consumer.sh` | Yes | |
| `kafka-verifiable-producer.sh` | Yes | |

## Using the console tools with {{site.data.reuse.es_name}}

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

You can use the Kafka console consumer tool with {{site.data.reuse.es_name}}.

After you've created the properties file as described previously, you can run the console consumer in a terminal as follows:

```shell
./kafka-console-consumer.sh --bootstrap-server <broker_url> --topic <topic_name> --from-beginning --consumer.config <properties_file>
```

Replace:
* `<broker_url>` with your cluster's broker URL
* `<topic_name>` with the name of your topic
* `<properties_file>` with the name of your properties file including full path to it
