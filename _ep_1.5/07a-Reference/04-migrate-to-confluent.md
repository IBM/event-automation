---
title: "Migrating flows to Confluent Platform for Apache Flink"
excerpt: "Find out how to migrate flows authored in Event Processing to Confluent Platform for Apache Flink."
categories: reference
slug: migrate-to-confluent
toc: true
---

This topic covers the migration tools and steps for migrating flows created in the {{site.data.reuse.ep_name}} low-code canvas to {{site.data.reuse.cpf_long}}.

**Note:** Confluent provides two methods to create and manage Flink jobs, either as applications or SQL statements. In this topic, your Flink job from {{site.data.reuse.ep_name}} is migrated to be executed as a [Flink application](https://docs.confluent.io/cp-flink/current/jobs/applications/overview.html){:target="_blank"}.

## Overview
{: #overview}

IBM announced the [Support lifecycle transition and software ordering completion for {{site.data.reuse.ea_long}}](https://www.ibm.com/docs/en/announcements/withdrawl-event-automation){:target="_blank"}, stating that IBM intends to provide migration tools, services, and entitlement flexibility to assist with migrating Event Streams and {{site.data.reuse.ep_name}} deployments to IBM Confluent Platform.


The following table describes the methods available in {{site.data.reuse.ep_name}} for creating Flink workloads and their migration process:

| Workload type | Migration process |
|---|---|
| Flows created in the {{site.data.reuse.ep_name}} low-code visual editor | Flows are exported as SQL files, migrated, and executed on {{site.data.reuse.cpf_long}} as an application, ensuring native {{site.data.reuse.cpf_long}} support. The following sections explain how to migrate flows. |
| Java applications written directly to Flink's Datastream and Table APIs | Outside the scope of this document. The following are the high level steps to migrate a Java application: <br><br>1. Understand how your Flink application is deployed and what state it holds. <br><br>2. Read the [{{site.data.reuse.cpf_long}} documentation](https://docs.confluent.io/cp-flink/current/overview.html){:target="_blank"}. <br><br>3. [Repackage your application](https://docs.confluent.io/cp-flink/current/jobs/applications/packaging.html){:target="_blank"} for {{site.data.reuse.cpf_long}}. <br><br>4. Migrate your state. The [copy-savepoint.sh](https://github.com/IBM/ibm-event-automation/blob/main/event-processing/migration-tools/copy-savepoint.sh){:target="_blank"} script might be useful. <br><br>5. Deploy your application. The [deploy.sh](https://github.com/IBM/ibm-event-automation/blob/main/event-processing/migration-tools/deploy.sh){:target="_blank"} script might also help. |

Resources to assist with migrating your flows are available in the [{{site.data.reuse.ea_long}} GitHub repository](https://github.com/IBM/ibm-event-automation/tree/main/event-processing/migration-tools){:target="_blank"}.


## Limitations
{: #limitations}

- {{site.data.reuse.ep_name}} flows that use the [detect patterns node](../../nodes/processornodes#detect-patterns) or the [deduplicate node](../../nodes/processornodes#deduplicate) cannot be migrated directly to {{site.data.reuse.cpf_long}}.

- In many cases, pattern detection nodes can be replaced with a [Free SQL](../../nodes/custom/) node that uses Flink's `MATCH_RECOGNIZE` syntax. In some cases, it is necessary to rewrite those flows as Flink Java applications that use the [Complex Event Processing API](https://nightlies.apache.org/flink/flink-docs-stable/docs/libs/cep/){:target="_blank"}.
- Deduplicate nodes can be replaced with a [Free SQL](../../nodes/custom/) node that uses Flink's `ROW_NUMBER() AS rownum ... WHERE rownum=1` syntax (see the [Flink SQL cookbook](https://github.com/ververica/flink-sql-cookbook/blob/main/aggregations-and-analytics/06_dedup/06_dedup.md){:target="_blank"}).

## Prerequisites
{: #prerequisites}

This migration process applies to {{site.data.reuse.ep_name}} flows that have at least one connected destination node. Flows that contain the [detect patterns node](../../nodes/processornodes#detect-patterns) cannot be migrated by using this process.

Before you begin, complete the following steps:

1. [Export](../../advanced/exporting-flows/) each of your flows from {{site.data.reuse.ep_name}} as an SQL file.
1. Restore [redacted credentials](../../advanced/deploying-production/#prerequisites) and amend the SQL for the target environment.
1. Install [{{site.data.reuse.cmf_long}}](https://docs.confluent.io/cp-flink/current/get-started/get-started-application.html){:target="_blank"} and [Confluent for Kubernetes](https://docs.confluent.io/operator/current/co-deploy-cfk.html){:target="_blank"} in your target environment.

## How deployed flows are structured
{: #how-deployed-flows-are-structured}

Flows deployed in {{site.data.reuse.ep_name}} usually consists of:

- An image containing the Apache Flink runtime, and custom {{site.data.reuse.ep_name}} libraries that support {{site.data.reuse.ep_name}} flows.
- The exported `flow.sql` or `flow.json` file.
- The `config.yaml` file (only available if the flow was exported as **JSON + Configuration YAML**).

Migrating to {{site.data.reuse.cpf_long}} changes the following:

- The Java dependencies used at compilation and runtime.
- The base Apache Flink image.
- The source of Flink connectors.
- The source of user-defined functions (UDFs) and process table functions (PTFs).
- The deployment mechanism.

The flow SQL exported from {{site.data.reuse.ep_name}} requires custom libraries at runtime:

- `CREATE TABLE` statements use the `TO_TIMESTAMP_LTZ` UDF. This function smoothes over timestamp processing differences between the SQL and ISO-8601 standards, and between the Avro and JSON formats.

Migrated flows therefore assemble the following components:

- Confluent's Apache Flink runtime image.
- A JAR file containing the `TO_TIMESTAMP_LTZ` UDF and the deduplicate node PTF.
- The exported `flow.sql` file.
- Connectors supported by Confluent, from Confluent's Maven repository.
- Connectors not supported by Confluent, either from IBM or the Apache Flink project.
- An Apache Flink SQL Runner JAR file.

## Step 1: Build the application Docker image
{: #building-the-application-docker-image}

Your exported flow must be packaged as a custom docker image as described in the [Confluent documentation](https://docs.confluent.io/cp-flink/current/jobs/applications/packaging.html){:target="_blank"}.

A [Dockerfile](https://github.com/IBM/ibm-event-automation/blob/main/event-processing/migration-tools/Dockerfile){:target="_blank"} is provided that packages all required components. It compiles the Apache Flink SQL Runner JAR file with Confluent Maven coordinates, downloads the required Confluent connectors and the IBM UDF+PTF JAR file, and assembles everything alongside the exported `flow.sql` into a single deployable image.

Run the following command to build the image:

```shell
docker build --build-arg FLOW_SQL_PATH=/path/to/exported.sql -t my/image -f /path/to/Dockerfile
```

After building the image, push it to a registry accessible from your Kubernetes cluster. If your registry requires authentication, configure the image pull secret. For example, in OpenShift, you can use the [global cluster pull secret](https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/images/managing-images#images-update-global-pull-secret_using-image-pull-secrets){:target="_blank"}. 

The following sections describe the components of the image in more detail.

### New application base: Apache Flink SQL runner
{: #new-application-base-apache-flink-sql-runner}

The [Flink Kubernetes Operator SQL Example](https://github.com/apache/flink-kubernetes-operator/tree/main/examples/flink-sql-runner-example){:target="_blank"} forms the base for migrated applications. To use the Flink dependencies provided as part of {{site.data.reuse.cpf_long}}, you must add the Confluent Maven repository and change the Maven group ID and version for supported components in the POM file for your project, as described in the [Confluent documentation](https://docs.confluent.io/cp-flink/current/jobs/applications/packaging.html#set-up-the-project-configuration){:target="_blank"}.

The provided Dockerfile follows this approach: the Apache Flink Operator repository is cloned, the Maven coordinates are patched to point to Confluent's libraries, and the application is compiled to produce the SQL runner JAR file that serves as the entry point for the migrated application.

### Common dependencies
{: #common-dependencies}

The following dependencies are required by all migrated flows. See the [Confluent documentation](https://docs.confluent.io/cp-flink/current/jobs/applications/overview.html){:target="_blank"} for more information.

| Dependency | Description | Source |
|---|---|---|
| Confluent Apache Flink image | Base image for {{site.data.reuse.cpf_long}} applications | [confluentinc/cp-flink](https://hub.docker.com/r/confluentinc/cp-flink){:target="_blank"}, as described in the [Confluent documentation](https://docs.confluent.io/cp-flink/current/jobs/applications/create.html#create-the-application){:target="_blank"} |
| `flow.sql` | The exported flow SQL file | [Exported from {{site.data.reuse.ep_name}}](../../advanced/exporting-flows) |
| Apache Flink SQL Runner JAR | The SQL runner entry point, patched and built as described in [New application base: Apache Flink SQL runner](#new-application-base-apache-flink-sql-runner) | Built from the Apache Flink Kubernetes Operator repository |
| IBM UDF+PTF JAR | Contains the `TO_TIMESTAMP_LTZ` UDF and the deduplicate node PTF | Available to [download](https://github.com/IBM/ibm-event-automation/releases){:target="_blank"} from the {{site.data.reuse.ea_short}} GitHub repository |

### Connectors from Confluent
{: #connectors-from-confluent}

Confluent-supported connectors are listed in the [Confluent documentation](https://docs.confluent.io/cp-flink/current/jobs/applications/supported-features.html#connectors){:target="_blank"}.

| {{site.data.reuse.ep_name}} node | Connector | Notes |
|---|---|---|
| [Event source](../../nodes/eventnodes/#event-source) and [event destination](../../nodes/eventnodes/#event-destination) | Kafka connector | Also requires the `org.apache.kafka:kafka-clients` library from Maven Central alongside it. |
| [Database enrichment](../../nodes/enrichmentnode/#enrichment-from-a-database) | JDBC connector | — |

**Note:** All connectors and supporting libraries must be stored in `/opt/flink/lib` in the packaged deployment.

### Connectors from open source
{: #connectors-from-open-source}

{{site.data.reuse.ep_name}} flows that use the [API enrichment](../../nodes/enrichmentnode/#enrichment-from-an-api) or [watsonx nodes](../../nodes/enrichmentnode/#watsonx-node) require an HTTP connector:

- {{site.data.reuse.ep_name}} 1.5.5 and later uses the Apache Flink HTTP connector at `org.apache.flink:flink-sql-connector-http`. For more information, see the [GitHub repository](https://github.com/apache/flink-connector-http){:target="_blank"} and [Maven Central](https://central.sonatype.com/artifact/org.apache.flink/flink-sql-connector-http){:target="_blank"}.
- Flows that were deployed with {{site.data.reuse.ep_name}} versions earlier than 1.5.5 must use `com.getindata:flink-http-connector`. For more information, see the [GitHub repository](https://github.com/getindata/flink-http-connector){:target="_blank"} and [Maven Central](https://central.sonatype.com/artifact/com.getindata/flink-http-connector){:target="_blank"}.

## Step 2: Migrate the state of your Flink deployment
{: #migrating-state-flink-deployment}

To preserve the state of a running Flink deployment, stop the Flink deployment and take a savepoint before migrating.

**Note:** If your source and target deployments share a Kubernetes namespace, you can skip this step and reuse the original persistent volume. However, the {{site.data.reuse.ibm_flink_operator}} and the {{site.data.reuse.cpf_long}} Operator cannot be configured to manage resources in the same namespace because both operators manage the same custom resources. Before installing the {{site.data.reuse.cpf_long}} Operator, you must delete or suspend all existing `FlinkDeployment` custom resources and uninstall the {{site.data.reuse.ibm_flink_operator}}.

### Stop the Flink deployment and take a savepoint
{: #stop-the-flink-deployment-and-take-a-savepoint}

To stop the Flink deployment and capture a savepoint at the same time, update the `spec.job.state` field in the associated `FlinkDeployment` custom resource:

```yaml
apiVersion: flink.apache.org/v1beta1
kind: FlinkDeployment
...
spec:
  job:
    state: suspended
    upgradeMode: savepoint
```

A savepoint is created and the job enters a suspended state. A new entry appears in the `FlinkDeployment` status, for example:

```yaml
status:
  jobStatus:
    upgradeSavepointPath: file:/opt/flink/volume/flink-sp/savepoint-e574c6-638b6089cdd2
```

A `FlinkStateSnapshot` custom resource is also created that contains the same information. For example:

```yaml
apiVersion: flink.apache.org/v1beta1
kind: FlinkStateSnapshot
metadata:
  labels:
    snapshot.state: COMPLETED
    snapshot.trigger-type: UPGRADE
    snapshot.type: SAVEPOINT
  name: <flink-deployment-name>-upgrade-1782304978581
spec:
  jobReference:
    kind: FlinkDeployment
    name: <flink-deployment-name>
  savepoint:
    alreadyExists: true
    disposeOnDelete: false
    formatType: CANONICAL
    path: file:/opt/flink/volume/flink-sp/savepoint-e574c6-638b6089cdd2
status:
  state: COMPLETED
```

Make a note the value of the `spec.savepoint.path` field. This file, or a copy of it, must be accessible to the migrated application.

### Copy the savepoint to the target environment
{: #copy-the-savepoint-to-the-target-environment}

In most cases, you need to copy the savepoint files from the persistent volume mounted in the original deployment to a persistent volume available in the target namespace.

A [copy-savepoint.sh](https://github.com/IBM/ibm-event-automation/blob/main/event-processing/migration-tools/copy-savepoint.sh){:target="_blank"} script is provided for this purpose. The script uses a temporary pod in each namespace to stage the copy through local disk, and works with any storage class and access mode.

```shell
# copy-savepoint.sh — copy Flink state from a PVC in one namespace to a PVC in another.
#
# Usage:
#   ./copy-savepoint.sh [options]
#
# Options (all optional — omitted values are prompted interactively):
#   --src-namespace  <ns>    Namespace containing the source PVC (e.g. event-automation)
#   --src-pvc        <pvc>   Source PVC name
#   --src-path       <path>  Path inside the source PVC to copy (e.g. /flink-sp)
#   --dst-namespace  <ns>    Namespace containing the destination PVC (e.g. confluent)
#   --dst-pvc        <pvc>   Destination PVC name
#   --dst-path       <path>  Path inside the destination PVC to write to (default: same as --src-path)
#   --dry-run                Show what would be done without executing
#
# Example:
#   ./copy-savepoint.sh \
#     --src-namespace event-automation --src-pvc basic-datagen --src-path /flink-sp \
#     --dst-namespace confluent        --dst-pvc flink-state
#
# Requires: kubectl (or oc), bash, docker, and sufficient local disk for a temporary copy of the data.
```

## Step 3: Deploy the migrated application
{: #deploying-the-migrated-application}

Follow the [{{site.data.reuse.cpf_long}} documentation](https://docs.confluent.io/cp-flink/current/jobs/applications/packaging.html#submit-the-application-definition){:target="_blank"} to deploy your migrated application.

Use the [deploy.sh](https://github.com/IBM/ibm-event-automation/blob/main/event-processing/migration-tools/deploy.sh){:target="_blank"} script to deploy your Flink job as an application. This script uses the Confluent CLI to deploy a `FlinkApplication` custom resource into the target {{site.data.reuse.cmf_long}} environment.

```shell
# deploy.sh — deploy a migrated IBM Event Processing flow to Confluent Platform for Apache Flink, using Confluent for Kubernetes
#
# Usage:
#   ./deploy.sh [options]
#
# Options (all optional — omitted values are prompted interactively):
#   --name                <name>       Application name (Kubernetes resource name)
#   --image               <image>      Docker image containing sql-runner.jar, e.g. myregistry.io/flink-runner:v1
#   --sql                 <file>       Path to the exported flow.sql file
#   --namespace           <namespace>  Kubernetes namespace to deploy into
#   --flink-env           <env>        FlinkEnvironment custom resource name
#   --pvc                 <pvc>        PersistentVolumeClaim name for Flink state storage
#   --savepoint           <path>       Savepoint path for state migration (e.g. file:///opt/flink/...)
#                                      Omit for a fresh deployment (no state restore).
#   --cmfrestclass        <name>       CMFRestClass custom resource name (default: "default")
#   --cmfrestclass-namespace <ns>      Namespace of the CMFRestClass custom resource (default: same as --namespace)
#   --dry-run                          Print the rendered YAML instead of submitting it.
```

The SQL from the exported application is stored in a Kubernetes Secret and mounted into the Flink pods at runtime. For more information, see the [Confluent for Kubernetes documentation](https://docs.confluent.io/operator/current/co-manage-flink.html){:target="_blank"}.
