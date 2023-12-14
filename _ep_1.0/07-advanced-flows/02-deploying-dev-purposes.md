---
title: "Deploying jobs in development environments"
excerpt: "Find out how to deploy your advanced flows in a Flink cluster for development and testing purposes."
categories: advanced
slug: deploying-development
toc: true
---

Find out how to deploy your advanced flows in a Flink cluster for development and testing purposes.

## Prerequisites

- Ensure you have configured [persistent storage](../../installing/configuring#configuring-persistent-storage) before you trigger a savepoint.

- You have [installed](../../installing/installing#install-a-flink-instance) a [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} instance of Flink by using a `FlinkDeployment` custom resource, and you successfully [verified](../../installing/post-installation/#verifying-an-installation) it.

  For more information, see [Installing a Flink deployment instance](../../installing/installing#install-a-flink-instance) and [Flink sample deployments](../../installing/planning/#flink-sample-deployments).

  **Note:** When deploying Flink for non-production environments (such as development or testing purposes), set `license.use` to `EventAutomationNonProduction` in the `FlinkDeployment` custom resource:

  ```yaml
  spec:
    flinkConfiguration:
      license.use: EventAutomationNonProduction
      license.license: L-HRZF-DWHH7A
      license.accept: 'true'
  ```

- The SQL statements are exported from the {{site.data.reuse.ep_name}} UI and saved to a file, for example, `statements.sql`.

  For more information, see [Exporting flows](../exporting-flows).

- You updated the Flink SQL Kafka connectors properties and values defined in file `statements.sql` to match your target environment: 

  - Sensitive credentials.

    For security reasons, the values containing sensitive credentials are removed from the {{site.data.reuse.ep_name}} UI when exporting the SQL statements, so you must restore them.

    For more information about Flink SQL Kafka connectors, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/connectors/table/kafka/){:target="_blank"}.

  - Connector properties values.

    For more information about how events can be consumed from Kafka topics, see the [Flink Documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/connectors/table/kafka/#start-reading-position){:target="_blank"}.

    **Note:** The Kafka [connector](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/connectors/table/kafka/#connector){:target="_blank"} value must be `kafka`. 

  - To deploy a running Flink job, the SQL statements in file `statements.sql` must contain one of the following:
       - A definition of a Flink SQL Kafka sink (also known as event destination), and an `INSERT INTO` clause that selects the columns of the last temporary view into this sink.
       - A `SELECT` clause that takes one or all of the columns of the last temporary view.

    For more information about how to define a Flink SQL sink, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/sql/insert/#insert-from-select-queries){:target="_blank"}.
  
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

  For more information about `table.exec.state.ttl`, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/config/#table-exec-state-ttl){:target="_blank"}.

- Specify a timeout period for event sources when they are marked idle. This allows downstream tasks to advance their watermark. Idleness is not detected by default.

  For example:

  ```sql
  SET 'table.exec.source.idle-timeout' = '15 s';
  ```

  For more information about `table.exec.source.idle-timeout`, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/config/#table-exec-source-idle-timeout){:target="_blank"}.

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

### Setup a connection to the Flink cluster

1. {{site.data.reuse.cncf_cli_login}}


2. Switch to the namespace where the {{site.data.reuse.flink_long}} is installed.

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


2. Copy the file `statements.sql` to the target container `flink-main-container` of the Flink `JobManager` pod

   ```shell
   kubectl cp -c flink-main-container statements.sql ${FLINK_JOB_MANAGER}:/tmp
   ```


3. Submit the Flink SQL job to the Flink cluster.

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