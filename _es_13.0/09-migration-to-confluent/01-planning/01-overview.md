---
title: "Introduction"
excerpt: "Find out more about migrating from Event Streams to Confluent Platform."
categories: migration
slug: overview
toc: true
---

Find out more about migrating from {{site.data.reuse.es_name}} to Confluent Platform by using Confluent for Kubernetes (CFK).

Confluent Platform provides an enterprise-ready event streaming platform based on Apache Kafka. By migrating your {{site.data.reuse.es_name}} deployment to Confluent Platform, you can continue to use Kafka-based event streaming with minimal disruption to your applications and event streaming operations.

This migration guide helps you plan, prepare, and execute your transition from self-managed IBM {{site.data.reuse.es_name}} 13.x deployments on Red Hat OpenShift or other Kubernetes platforms to Confluent Platform 8.x deployed by using Confluent for Kubernetes (CFK) 3.x. For supported version combinations, see the [Confluent documentation](https://docs.confluent.io/operator/current/co-supported-environments.html#cp){:target="_blank"}.

The migration is structured as sequential phases. You can migrate everything at once or in smaller batches by topic, application, or integration. For more information, see [migration phases](../migration-phases/).

For detailed information about configuring and managing individual Confluent Platform components, see the [Confluent documentation](https://docs.confluent.io/){:target="_blank"}.
