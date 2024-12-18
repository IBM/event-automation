---
title: "Testing jobs by using the Flink SQL client"
excerpt: "Find out how to deploy your flows in a Flink cluster for development and testing purposes."
categories: advanced
slug: deploying-development
toc: true
---

Find out how to deploy your flows in a Flink [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} for development and testing purposes.

**Important:** ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3.svg "In Event Processing 1.2.3 and later.") Event Processing release 1.2.3 introduces the **JSON and configuration YAML** flow [export format](../exporting-flows/#exporting-flows) that can be used for [deploying jobs customized for production or test environments](../deploying-customized). In most cases, this provides a better user experience, and can be used with an automation in a continuous integration and continuous delivery (CI/CD) pipeline.

<!-- pattern node
**Important:**
* ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3.svg "In Event Processing 1.2.3 and later.") introduces a new flow export format, that can be used for [deploying jobs customized for production or test environments](../deploying-customized). In most cases, this provides a better user-experience, and can be used with automation in a continuous integration and continuous delivery (CI/CD) process.
* ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3.svg "In Event Processing 1.2.3 and later.") Cannot be used for flows containing the [Detect patterns node](../../nodes/pattern).
pattern node -->

## Prerequisites

- Ensure you have configured [persistent storage](../../installing/configuring#configuring-persistent-storage) before you trigger a savepoint.

- Ensure that you have installed a [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} instance of Flink by using a `FlinkDeployment` custom resource. This session cluster must be different from the one used by {{site.data.reuse.ep_name}}.

  For more information, see [installing](../../installing/installing#install-a-flink-instance) a Flink instance and [Flink sample deployments](../../installing/planning/#flink-sample-deployments).

  **Note:** When deploying Flink for non-production environments (such as development or testing purposes), set `license.use` to `EventAutomationNonProduction` in the `FlinkDeployment` custom resource:

  ```yaml
  spec:
    flinkConfiguration:
      license.use: EventAutomationNonProduction
      license.license: L-KCVZ-JL5CRM
      license.accept: 'true'
  ```

- The SQL statements are exported from the {{site.data.reuse.ep_name}} UI and saved to a file, for example, `statements.sql`.

  For more information, see [exporting flows](../exporting-flows).

- You updated the Flink SQL connector properties and values that are defined in the file `statements.sql` to match your target environment.

  For security reasons, the values containing sensitive credentials, such as username and password, are removed when exporting the SQL statements from the {{site.data.reuse.ep_name}} UI, so you must restore them.

  Also, the exported SQL contains connector configuration that is applicable to the environment targeted in the {{site.data.reuse.ep_name}} UI. When deploying to a different target environment, you might need to adapt the connector properties to the target environment.

  See the following table for credentials and connector properties information about supported Flink SQL connectors:

  | Flink SQL connector | Used by nodes | Sensitive credentials | Connector properties values |
  | --- | --- | --- | --- |
  | **Kafka** | [Source](../nodes/eventnodes/#event-source) and [destination](../nodes/eventnodes/#event-destination) | [About Kafka connector](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/kafka/){:target="_blank"} <br> <br>  **Note:** When configuring SCRAM authentication for the Kafka connector, ensure you use double quotes only. Do not use a backslash character (`\`) to escape the double quotes. The valid format is: `username="<username>" password="<password>"` |  [Kafka connector options](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/kafka/#connector-options){:target="_blank"} <br> <br> For more information about how events can be consumed from Kafka topics, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/kafka/#start-reading-position){:target="_blank"}. <br> <br>  **Note:** The Kafka [connector](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/kafka/#connector){:target="_blank"} value must be `kafka`. |
  | **JDBC**      | [Database](../nodes/enrichmentnode/#enrichment-from-a-database) | [About JDBC connector](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/jdbc){:target="_blank"} | [JDBC connector options](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/jdbc/#connector-options){:target="_blank"} |
  | **HTTP** | [API](../nodes/enrichmentnode/#enrichment-from-an-api) | [About HTTP connector](https://github.com/getindata/flink-http-connector/blob/0.15.0/README.md){:target="_blank"} | [HTTP connector options](https://github.com/getindata/flink-http-connector/blob/0.15.0/README.md#table-api-connector-options){:target="_blank"}.  <br> <br> ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3.svg "In Event Processing 1.2.3 and later.") **Note:** the HTTP connector version for {{site.data.reuse.ep_name}} versions 1.2.3 and later is 0.16.0. For earlier {{site.data.reuse.ep_name}} 1.2.x releases, see the 0.15.0 connector documentation. |

- To deploy a running Flink job, the SQL statements in the file `statements.sql` must contain one of the following clauses:
  - A definition of a Flink SQL Kafka sink (also known as event destination), and an `INSERT INTO` clause that selects the columns of the last temporary view into this sink.
  - A `SELECT` clause that takes one or all of the columns of the last temporary view.

  For more information about how to define a Flink SQL sink, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/sql/insert/#insert-from-select-queries){:target="_blank"}.


## Set deployment options

You can specify deployment options in the file `statements.sql`.

Each statement is optional and can be added at the top of the file with the following syntax.

```sql
SET 'key' = 'value';
```

- Change the parallelism of the Flink job. The default value is 1.

  For example:

  ```sql
  SET 'parallelism.default' = '2';
  ```

- Give a meaningful name to the Flink job.

  For example:

  ```sql
  SET 'pipeline.name' = 'meaningful-name';
  ```

- Specify a minimum time interval for how long idle Flink job states will be retained. No cleanup is enabled by default.

  For example:

  ```sql
  SET 'table.exec.state.ttl' = '20';
  ```

  For more information about `table.exec.state.ttl`, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/config/#table-exec-state-ttl){:target="_blank"}.

- Specify a timeout period for event sources when they are marked idle. This allows downstream tasks to advance their watermark. Idleness is not detected by default.

  For example:

  ```sql
  SET 'table.exec.source.idle-timeout' = '15 s';
  ```

  For more information about `table.exec.source.idle-timeout`, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/config/#table-exec-source-idle-timeout){:target="_blank"}.

- Use an existing savepoint for the Flink job submission.

  For example:

  ```sql
  SET 'execution.savepoint.path' = '/opt/flink/volume/flink-sp/savepoint-cca7bc-bb1e257f0dab';
  ```

- Allow to skip a savepoint state that cannot be restored. Set this option to `true` if the SQL statements have changed since the savepoint was triggered and are no longer compatible with it. The default is false.

  For example:

  ```sql
  SET 'execution.savepoint.ignore-unclaimed-state' = 'true';
  ```

## Use Flink user-defined functions

Optionally, [user-defined functions (UDFs)](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/functions/udfs/){:target="_blank"} can be used as a complement of the [built-in functions](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/functions/systemfunctions/){:target="_blank"}, by editing the SQL exported from the {{site.data.reuse.ep_name}} UI.

For more information, see [UDFs in the exported SQL](../../reference/supported-functions#user-defined-functions-in-the-exported-sql).

## Setup a connection to the Flink cluster

1. {{site.data.reuse.cncf_cli_login}}


2. Switch to the namespace where the {{site.data.reuse.ibm_flink_operator}} is installed.

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. Get the name of the Flink JobManager pod to connect to.

   a. List the available `FlinkDeployment` custom resources.

   ```shell
   kubectl get flinkdeployment
   ```

   For example:

   ```shell
   kubectl get flinkdeployment
   
   NAME                   JOB STATUS   LIFECYCLE STATE
   my-flink-deployment    RUNNING      STABLE
   ````

   b. Retrieve the name of the first online Flink `JobManager` pod.

   ```shell
   export FLINK_JOB_MANAGER=$(kubectl get pods --selector component=jobmanager,app=<flink-deployment-name> --no-headers=true -o custom-columns=Name:.metadata.name | head -n 1)
   ```

   For example:

   ```shell
   export FLINK_JOB_MANAGER=$(kubectl get pods --selector component=jobmanager,app=my-flink-deployment --no-headers=true -o custom-columns=Name:.metadata.name | head -n 1)
   echo ${FLINK_JOB_MANAGER}
   my-flink-deployment-b5d95dc77-nmgnj
   ```

## Submit a Flink SQL job

1. Setup the connection to the Flink cluster.


2. Copy the file `statements.sql` to the target container `flink-main-container` of the Flink `JobManager` pod:

   ```shell
   kubectl cp -c flink-main-container statements.sql ${FLINK_JOB_MANAGER}:/tmp
   ```

3. If at the previous [optional step](#use-flink-user-defined-functions) you introduced the use of Flink user-defined functions (UDFs), copy the JAR file that contains the UDF classes:

   ```shell
   kubectl cp -c flink-main-container <path-of-the-udf-jar> ${FLINK_JOB_MANAGER}:/opt/flink/lib
   ```

   For example:
   ```shell
   kubectl cp -c flink-main-container /udfproject/target/udf.jar ${FLINK_JOB_MANAGER}:/opt/flink/lib
   ```

4. Submit the Flink SQL job to the Flink cluster:

   ```shell
   kubectl exec ${FLINK_JOB_MANAGER} -- /opt/flink/bin/sql-client.sh -hist /dev/null -f /tmp/statements.sql
   ```


## List the deployed Flink SQL jobs

1. Setup the connection to the Flink cluster.

2. List the Flink jobs:

   ```sql
   kubectl exec -it ${FLINK_JOB_MANAGER} -- /opt/flink/bin/sql-client.sh -hist /dev/null <<< 'SHOW JOBS;'
   ```

   **Output example**

   ```shell
   +----------------------------------+-----------------+---------+-------------------------+
   |                           job id |        job name |  status |              start time |
   +----------------------------------+-----------------+---------+-------------------------+
   | 89112b3a999e37740e2c73b6521d0778 | meaningful-name | RUNNING | 2023-05-11T13:45:59.451 |
   +----------------------------------+-----------------+---------+-------------------------+
   ```

   **Note:** The output displays `Empty set` when no Flink job is deployed.



## Trigger a savepoint for a running Flink SQL job

1. After meeting the required [prerequisites](#prerequisites), [list](#list-the-deployed-flink-sql-jobs) the deployed Flink SQL jobs.

2. Locate the entry corresponding to the `job name`.


3. Check that the status of this job is `RUNNING` and take note of the corresponding `job id`.


4. Execute the following command that triggers the generation of a savepoint without stopping the job:

   ```sql
   kubectl exec -it ${FLINK_JOB_MANAGER} -- /opt/flink/bin/flink savepoint --type canonical <job id>
   ```

   For example:

   ```sql
   kubectl exec -it ${FLINK_JOB_MANAGER} -- /opt/flink/bin/flink savepoint --type canonical 89112b3a999e37740e2c73b6521d0778
   
   Triggering savepoint for job 89112b3a999e37740e2c73b6521d0778.
   Waiting for response...
   Savepoint completed. Path: file:/flink-data/savepoints/savepoint-89112b-8dbd328bf7c9
   ```

   Take note of the savepoint path, you need it to restart the Flink job from this savepoint.

   For information about how to restart a Flink job from a savepoint, see [set deployment options](#set-deployment-options).


## Stop a Flink SQL job with a savepoint

1. After meeting the required [prerequisites](#prerequisites), [list](#list-the-deployed-flink-sql-jobs) the deployed Flink SQL jobs.

2. Locate the entry corresponding to the `job name`.


3. Check that the status of this job is `RUNNING` and take note of the corresponding `job id`.


4. Execute the following command that triggers the generation of a savepoint and stops the Flink job:

   ```sql
   kubectl exec -it ${FLINK_JOB_MANAGER} -- /opt/flink/bin/flink stop --type canonical <job id>
   ```

   For example:

   ```sql
   kubectl exec -it ${FLINK_JOB_MANAGER} -- /opt/flink/bin/flink stop --type canonical 89112b3a999e37740e2c73b6521d0778
   
   Suspending job 89112b3a999e37740e2c73b6521d0778.
   Savepoint completed. Path: file:/flink-data/savepoints/savepoint-89112b-8dbd328bf7c9
   ```

   Take note of the savepoint path, you need it to restart the Flink job from this savepoint.

   For information about how to restart a Flink job from a savepoint, see [set deployment options](#set-deployment-options).