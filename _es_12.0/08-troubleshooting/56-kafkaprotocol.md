---
title: "Upgrading Event Streams fails due to `inter.broker.protocol.version` mismatch"
excerpt: "Find out how to troubleshoot the error when upgrading Event Streams on IBM Cloud Pak for Integration deployments."
categories: troubleshooting
slug: kafka-protocol-error
toc: true
---

## Symptoms
{: #symptoms}

When upgrading from an earlier version of {{site.data.reuse.es_name}} that is deployed on {{site.data.reuse.cp4i}} and you did not explicitly set the `inter.broker.protocol.version` in the `spec.strimziOverrides.kafka.config` section of your `EventStreams` custom resource, the upgrade fails with the following errors and warnings:


- `EventStreams` custom resource shows status as `Failed` with the following error:

  ```shell
  FatalProblem-Error while waiting for restarted pod <kafka-pod-name> to become ready.
  ```

- Kafka pods go into a `CrashLoopBackOff` state, and the following error is displayed in the logs:

  ```shell
  CrashLoopBackOff indicates that the application within the container is failing to start properly.
  ```

- A warning similar to the following is displayed in the Kafka pod logs:

  ```shell
  Node <node-number> disconnected. 
  Cancelled in-flight FETCH request with correlation id <id> due to node <node-number> being disconnected Client requested connection close from node <node-number>
  Error sending fetch request (sessionId=INVALID, epoch=INITIAL) to node <node-number>: 
  java.io.IOException: Connection to 2 was disconnected before the response was read
  ...
  Error in response for fetch request...
  java.io.IOException: Connection to 2 was disconnected before the response was read
  ...
  ```

## Causes
{: #causes}

Some Kafka brokers are using the newer protocol version while other Kafka brokers are still on the earlier versions.

## Resolving the problem
{: #resolving-the-problem}

1. In the `spec.strimziOverrides.kafka.config` section of your `EventStreams` custom resource, add the `inter.broker.protocol.version` value to match the Kafka version that you are using. For example, if you are currently using the Kafka version `3.6.1`, set the value to `3.6`.
1. Wait for the Kafka pods to roll and the `EventStreams` instance to become ready.
1. Continue to [upgrade](../../installing/upgrading/) your {{site.data.reuse.es_name}} version.
1. Change the `inter.broker.protocol.version` value in the `EventStreams` custom resource to the Kafka version that is supported in your {{site.data.reuse.es_name}} version as described in the [post-upgrade tasks](../../installing/upgrading/#upgrade-the-kafka-broker-protocol-version).
