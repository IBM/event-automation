---
title: "Kafka Connect plugins fail to load with Kafka Connect 4.x"
excerpt: "Find out how to troubleshoot plugin loading failures in Kafka Connect 4.x caused by incompatible JAR files from earlier versions, such as Kafka Connect 3.x."
categories: troubleshooting
slug: kafka-connect-kafka4-compatibility
toc: true
---

## Symptoms

In {{site.data.reuse.es_name}} 12.0.0, Kafka Connect plugins (Connectors, Converters, and Transformations) might fail to start and display an error similar to the following:

```shell
Caused by: java.lang.NoSuchMethodError: 'java.util.Set org.apache.kafka.connect.util.Utils.mkSet'
```

## Causes

Kafka Connect plugins that include JAR files from Kafka Connect 3.x are incompatible with Kafka Connect 4.x. For example, Apicurio-based Avro converters that include Kafka 3.9 JAR files do not load successfully in Kafka Connect 4.0.0.

## Resolving the problem

To resolve this issue, use one of the following options based on your connector image setup.

### Use an alternative plugin package without Kafka Connect JAR files

If you are using Kafka Connect build capability to create a Kafka Connect environment, use an alternative plugin package that does not include the Kafka Connect JAR files. Removing these Kafka Connect 3.x JAR files from the plugin package will resolve the conflict between versions of the same JAR file in the plugin and Kafka Connect 4.x runtime.

If you are importing Avro converters from the Apicurio Maven repository, use the prebuilt Kafka Connect converter assembly instead of individual artifacts. This prevents runtime issues caused by conflicting Kafka libraries.

Instead of:

```yaml
- artifact: apicurio-registry-serdes-avro-serde
  group: io.apicurio
  type: maven
  version: <VERSION>
- artifact: apicurio-registry-utils-converter
  group: io.apicurio
  type: maven
  version: <VERSION>
```

Use:

```yaml
- type: zip
  url: https://repo1.maven.org/maven2/io/apicurio/apicurio-registry-distro-connect-converter/<VERSION>/apicurio-registry-distro-connect-converter-<VERSION>.zip
```

Where `<VERSION>` is the version of the Apicurio Kafka Connect converter assembly that you want to use.

This assembly provides the same capabilities but does not include any Kafka JAR files that could cause conflicts.

### Remove conflicting Kafka JAR files from your custom Kafka Connect image

If you are building a custom connector image, for example, by using the `maven-assembly-plugin` or shaded JAR files, ensure that the image does not include Kafka libraries that conflict with those already provided by {{site.data.reuse.es_name}}.

- Check your plugin directory, for example:

	```bash
	/opt/kafka/plugins/avro-kafka-apicurio
	```

- Remove any of the following JAR files if they are present:

	```bash
	- rm kafka-clients-*.jar
	- rm connect-json-*.jar
	```

**Important:** Ensure that the Kafka runtime already provides compatible versions of these JAR files on the classpath before removing them. This prevents version mismatches and runtime exceptions.

**Tip:** If you are using Maven to build the connector image, mark Kafka Connect dependencies with `scope: provided` to prevent them from being added to your connector JAR file:

```xml
<dependency>
  <groupId>org.apache.kafka</groupId>
  <artifactId>connect-json</artifactId>
  <version>4.0.0</version>
  <scope>provided</scope>
</dependency>
```