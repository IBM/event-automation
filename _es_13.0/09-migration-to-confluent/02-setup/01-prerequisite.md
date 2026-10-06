---
title: "Before you begin"
excerpt: "Prepare your Event Streams instance and client applications before migrating to Confluent Platform."
categories: migration
slug: preparation
toc: true
---

Complete the following before you start the migration. Review your {{site.data.reuse.es_name}} instance, clean up unneeded resources, and prepare client application configurations for switchover.

## Prerequisites checklist
{: #prerequisites-checklist}

Complete the following prerequisites before you set up Confluent Platform:

- Verify source version: Ensure your {{site.data.reuse.es_name}} deployment is running version 13.x.
- [Matching the Confluent Platform version](#matching-the-confluent-platform-version): Identify the Confluent Platform release that corresponds to your {{site.data.reuse.es_name}} Kafka version.
- [Recording broker and topic configurations](#recording-broker-and-topic-configurations): Capture existing broker settings, topic configurations, and client properties.
- [Removing unused resources](#removing-unused-resources): Clean up inactive topics and obsolete schema versions to streamline replication.
- [Preparing client applications](#preparing-client-applications): Update serialization libraries, REST API calls, and authentication settings in client configurations.
- [Preparing Kafka Connect and connectors](#preparing-kafka-connect-and-connectors): If you use Kafka Connect, review connector configuration differences and build the CFK Connect plugin image.
- [Planning TLS certificate management](#planning-tls-certificate-management): Determine your certificate authority (CA) strategy and certificate lifecycle tooling.

## Matching the Confluent Platform version
{: #matching-the-confluent-platform-version}

{{site.data.reuse.es_name}} 13.0 includes Apache Kafka 4.2.0. Deploy Confluent Platform 8.x or later by using Confluent for Kubernetes (CFK) 3.x.

Matching the target Confluent Platform Kafka version to your {{site.data.reuse.es_name}} Kafka version ensures that the migration changes only the platform, not the underlying Kafka protocol or broker behaviour.

For the full list of supported environment and component version combinations, see the [Confluent documentation](https://docs.confluent.io/operator/current/co-supported-environments.html){:target="_blank"}.

**Note:** Plan any Kafka version upgrades as a separate activity after the migration is complete.

## Recording broker and topic configurations
{: #recording-broker-and-topic-configurations}

Use the configuration details recorded during the [planning](../planning/) phase to document all broker defaults and per-topic settings. Apply these values to Confluent Platform during [setting up Confluent Platform](../setup/) and verify them during topic configuration migration.

## Removing unused resources
{: #removing-unused-resources}

Delete any topics and schemas that are no longer in use. Removing unused resources before the migration reduces replication time and simplifies post-migration validation.

## Preparing client applications
{: #preparing-client-applications}

Review and update client application configurations in advance to minimize changes during switchover. Depending on your deployment, this preparation might include updating serialization libraries, REST API endpoints, security protocols, and authentication credentials.

### Schema Registry compatibility
{: #schema-registry-compatibility}

Verify that your client applications use Schema Registry libraries and wire formats that are compatible with [Confluent Schema Registry](https://docs.confluent.io/platform/current/schema-registry/index.html){:target="_blank"}:

- Confirm that each Avro client application uses a Confluent-compatible Schema Registry client, specifically Confluent serializers and deserializers pointed at the Apicurio `/apis/ccompat/v7` endpoint.
- Confirm that your Avro clients use payload mode, where the schema ID is embedded in the message body. If your clients use headers mode, where the schema ID is stored in a message header, they cannot be read by Confluent serializers without reproducing the messages. For more information, see [component mapping](../feature-compatibility/).

### Kafka Bridge and REST producer applications
{: #kafka-bridge-and-rest-producer-applications}

Update applications that produce messages through the {{site.data.reuse.es_name}} Kafka Bridge or REST producer to use the Confluent REST Proxy API before you migrate.

The Confluent REST Proxy supports two API versions. The v2 API uses topic-name-based paths such as `POST /topics/{topic}` and is the closest equivalent to the {{site.data.reuse.es_name}} REST producer. The v3 API is the latest version and requires a cluster ID lookup before producing messages, by using paths such as `POST /v3/clusters/{cluster_id}/topics/{topic}/records`. For more information, see [migrating Kafka Bridge and REST producer](../migrating-to-rest-proxy/).

### Migrating from SCRAM-SHA-512 authentication
{: #migrating-from-scram-sha-512-authentication}

Confluent for Kubernetes (CFK) does not natively support `SCRAM-SHA-512`. `SCRAM-SHA-512` cannot be configured as a listener `authentication.type` in the Kafka custom resource. Additionally, SCRAM credentials are neither created nor managed by the operator. You must create and manage them manually in Kafka.

To continue authenticating to Kafka securely by using a username and password, use [SASL/PLAIN authentication mechanism](https://docs.confluent.io/operator/current/co-authenticate-kafka.html#sasl-plain-authentication){:target="_blank"} combined with TLS encryption in CFK.

To switch your external client applications from `SCRAM-SHA-512` to `SASL/PLAIN` authentication, make the following changes in your Kafka configurations:

- Update `sasl.mechanism` from `SCRAM-SHA-512` to `PLAIN`.
- Change the login module in `sasl.jaas.config` to `org.apache.kafka.common.security.plain.PlainLoginModule` from `org.apache.kafka.common.security.scram.ScramLoginModule`.

The `security.protocol` setting remains `SASL_SSL`.

Prepare these configuration changes in advance so that you can apply them to all the applications when you switch over.

You can continue to use the existing credentials for authentication by migrating the SCRAM credentials from {{site.data.reuse.es_name}} to CFK and storing them as SASL/PLAIN credentials. For more information, see [migrating SCRAM-SHA-512 credentials to SASL/PLAIN](../migrating-users/#migrate-scram-sha-512-credentials-to-sasl-plain).

## Preparing Kafka Connect and connectors
{: #preparing-kafka-connect-and-connectors}

If your {{site.data.reuse.es_name}} deployment uses Kafka Connect, build the CFK Connect plugin image with your connector plugin JARs before you start the migration. The image must be available before the CFK Connect cluster can be deployed. For step-by-step instructions, see [building the plugin image](../connect-migration/#plugin-image).

## Planning TLS certificate management
{: #planning-tls-certificate-management}

If you enable TLS for broker and inter-broker communication, Confluent Platform requires TLS certificates. Decide how you will issue and manage these certificates before you set up Kafka, because the approach affects how you configure Confluent for Kubernetes (CFK).

Unless you use CFK built-in auto-generated TLS certificates, you are responsible for managing the full certificate lifecycle, including CA creation, certificate issuance, rotation, and distribution to client applications. You can fulfill this responsibility with any tooling your organization already has in place, such as an internal PKI, an external certificate authority, or a certificate management tool such as cert-manager. On Red Hat OpenShift, the [Red Hat cert-manager Operator](https://docs.openshift.com/container-platform/latest/security/cert_manager_operator/index.html){:target="_blank"} automates issuance and renewal. For the fully automated option with no external PKI required, see [auto-generated TLS certificates](https://docs.confluent.io/operator/3.0/co-network-encryption.html#use-auto-generated-tls-certificates){:target="_blank"}.

For step-by-step guidance on setting up CAs and secrets for CFK, see [setting up certificates](../certificates/).

## Next steps
{: #next-steps-prep}

After completing the preparation tasks, proceed to [setting up certificates](../certificates/).