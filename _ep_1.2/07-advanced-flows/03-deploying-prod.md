---
title: "Deploying jobs by using the Apache SQL Runner sample"
excerpt: "Find out how to deploy your flows in a Flink cluster as part of your production environment."
categories: advanced
slug: deploying-production
toc: true
---

Find out how to deploy your flows in an [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} Flink cluster as part of your production environment.

**Important:**

* ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3plus.svg "In Event Processing 1.2.3 and later.") Event Processing release 1.2.3 introduces a new flow [export format](../exporting-flows/#exporting-flows), that can be used for [deploying jobs customized for production or test environments](../deploying-customized). In most cases, this provides a better user-experience, and can be used with an automation in a continuous integration and continuous delivery (CI/CD) pipeline.

<!-- pattern node * ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3plus.svg "In Event Processing 1.2.3 and later.") Cannot be used for flows containing the [Detect patterns node](../../nodes/pattern). pattern node -->

* This deployment cannot be used with the {{site.data.reuse.ep_name}} UI.

**Note:** The [Apache operator sample](https://github.com/apache/flink-kubernetes-operator/tree/main/examples/flink-sql-runner-example){:target="_blank"} that is referenced in the following sections points to the version of the sample in the `main` branch, which is up-to-date, and might include fixes that are absent in the release branches.

## Prerequisites

- The SQL statements are exported from the {{site.data.reuse.ep_name}} UI and saved to a file, for example, `statements.sql`.

  For more information, see [exporting flows](../exporting-flows).

- You updated the Flink SQL connector properties and values that are defined in the file `statements.sql` to match your target environment.

  For security reasons, the values containing sensitive credentials, such as username and password, are removed when exporting the SQL statements from the {{site.data.reuse.ep_name}} UI, so you must restore them.

  Also, the exported SQL contains connector configuration that is applicable to the environment targeted in the {{site.data.reuse.ep_name}} UI. When deploying to a different target environment, you might need to adapt the connector properties to the target environment.

  See the following table for credentials and connector properties information about supported Flink SQL connectors:

  | Flink SQL connector | Used by nodes | Sensitive credentials | Connector properties |
  | --- | --- | --- | --- |
  | **Kafka** | [Source](../nodes/eventnodes/#event-source) and [destination](../nodes/eventnodes/#event-destination) | [About Kafka connector](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/kafka/){:target="_blank"} <br> <br>  **Note:** When configuring SCRAM authentication for the Kafka connector, ensure you use double quotes only. Do not use a backslash character (`\`) to escape the double quotes. The valid format is: `username="<username>" password="<password>"` |  [Kafka connector properties](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/kafka/#connector-options){:target="_blank"} <br> <br> For more information about how events can be consumed from Kafka topics, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/kafka/#start-reading-position){:target="_blank"}. <br> <br>  **Note:** The Kafka [connector](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/kafka/#connector){:target="_blank"} value must be `kafka`. |
  | **JDBC**      | [Database](../../nodes/enrichmentnode/#enrichment-from-a-database) | [About JDBC connector](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/jdbc){:target="_blank"} | [JDBC connector properties](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/table/jdbc/#connector-options){:target="_blank"} |
  | **HTTP** | [API](../../nodes/enrichmentnode/#enrichment-from-an-api) | [About HTTP connector](https://github.com/getindata/flink-http-connector/blob/0.16.0/README.md){:target="_blank"} | [HTTP connector properties](https://github.com/getindata/flink-http-connector/blob/0.16.0/README.md#table-api-connector-options){:target="_blank"}.  <br> <br> ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3plus.svg "In Event Processing 1.2.3 and later.") **Note:** the HTTP connector version for Event Processing versions 1.2.3 and later is 0.16.0. For earlier {{site.data.reuse.ep_name}} 1.2.x releases, see the 0.15.0 connector documentation. |

- To deploy a running Flink job, the SQL statements in the file `statements.sql` must contain one of the following clauses:
  - A definition of a Flink SQL Kafka sink (also known as event destination), and an `INSERT INTO` clause that selects the columns of the last temporary view into this sink.
  - A `SELECT` clause that takes one or all of the columns of the last temporary view.

  For more information about how to define a Flink SQL sink, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/sql/insert/#insert-from-select-queries){:target="_blank"}.


## Use Flink user-defined functions

Optionally, [user-defined functions (UDFs)](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/functions/udfs/){:target="_blank"} can be used as a complement of the [built-in functions](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/functions/systemfunctions/){:target="_blank"}, by editing the SQL exported from the {{site.data.reuse.ep_name}} UI.

For more information, see [UDFs in the exported SQL](../../reference/supported-functions#user-defined-functions-in-the-exported-sql).

## Setup a connection to the Flink cluster

1. {{site.data.reuse.cncf_cli_login}}


2. Switch to the namespace where the {{site.data.reuse.ibm_flink_operator}} is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

## Build and deploy a Flink SQL runner

You can use a Kubernetes `FlinkDeployment` custom resource in application mode to deploy a Flink job for processing and deploying the statements in the file `statements.sql`.

A sample application [flink-sql-runner-example](https://github.com/apache/flink-kubernetes-operator/tree/main/examples/flink-sql-runner-example){:target="_blank"} is provided in the Apache Flink GitHub repository for that purpose.

Follow the [instructions](https://github.com/apache/flink-kubernetes-operator/tree/main/examples/flink-sql-runner-example#usage){:target="_blank"} to build:
- the flink-sql-runner-example JAR file (Flink job)
- the Docker image

**Important:** Ensure that the Flink SQL runner JAR file and the `statements.sql` file have read permissions (644) for non-root users. If the JAR file is only readable by the root user, the `FlinkDeployment` instance cannot be started by non-root users.

Some adaptations to this procedure are required to build the Docker image and use the file `statements.sql`:

1. Modify the [Dockerfile](https://github.com/apache/flink-kubernetes-operator/blob/main/examples/flink-sql-runner-example/Dockerfile){:target="_blank"} to use the IBM Flink image:

   a. Execute the following command to extract the Flink image name including its SHA digest from the `ClusterServiceVersion` (CSV). For example, if you are running on Flink version {{site.data.reuse.flink_operator_current_version}}:

   ```shell
   kubectl get csv -o jsonpath='{.spec.install.spec.deployments[*].spec.template.spec.containers[0].env[?(@.name=="IBM_FLINK_IMAGE")].value}' ibm-eventautomation-flink.v{{site.data.reuse.flink_operator_current_version}}
   ```
   
   Alternatively, you can obtain the image name from the Flink operator pod's environment variable:

   ```shell
   kubectl set env pod/<flink_operator_pod_name> --list -n <flink_operator_namespace> | grep IBM_FLINK_IMAGE
   ```

   b. Edit the [Dockerfile](https://github.com/apache/flink-kubernetes-operator/blob/main/examples/flink-sql-runner-example/Dockerfile){:target="_blank"} and change the `FROM` clause to use the IBM Flink image with its SHA digest, as determined in the previous step.
   
   
   ```shell
   FROM --platform=<platform> <IBM Flink image with digest>
   ```

   Where `<platform>` is `linux/amd64` or `linux/s390x`, depending on your deployment target.

   

   c. If at the previous [optional step](#use-flink-user-defined-functions) you introduced the use of Flink user-defined functions (UDFs), edit the [Dockerfile](https://github.com/apache/flink-kubernetes-operator/blob/main/examples/flink-sql-runner-example/Dockerfile){:target="_blank"} to copy the JAR file that contains the UDF classes:

   ```shell
   COPY --chown=flink:root <path-of-the-udf-jar> /opt/flink/lib
   ```

   For example:
   ```shell
   COPY --chown=flink:root /udfproject/target/udf.jar /opt/flink/lib
   ```

   d. Remove the sample SQL statement files from the [sql-scripts](https://github.com/apache/flink-kubernetes-operator/tree/main/examples/flink-sql-runner-example/sql-scripts){:target="_blank"} directory.

   e. Copy the `statements.sql` file to the [sql-scripts](https://github.com/apache/flink-kubernetes-operator/tree/main/examples/flink-sql-runner-example/sql-scripts){:target="_blank"} directory.

   f. [Build the docker image](https://github.com/apache/flink-kubernetes-operator/blob/main/examples/flink-sql-runner-example/README.md#usage){:target="_blank"} and push it to a registry accessible from your {{site.data.reuse.openshift_short}}. If your registry requires authentication, configure the image pull secret, for example, by using the [global cluster pull secret](https://docs.openshift.com/container-platform/4.17/openshift_images/managing_images/using-image-pull-secrets.html#images-update-global-pull-secret_using-image-pull-secrets){:target="_blank"}.

2. Create the {{site.data.reuse.ibm_flink_operator}} `FlinkDeployment` custom resource.

   You can use a Kubernetes `FlinkDeployment` custom resource in application mode to deploy a Flink job for processing and deploying the statements in the `statements.sql` file. 

   a. ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3plus.svg "In Event Processing 1.2.3 and later.") You can start with the following example of an [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} Flink instance:

   ```yaml
   apiVersion: flink.apache.org/v1beta1
   kind: FlinkDeployment
   metadata:
     name: application-cluster-prod
   spec:
     image: <image built FROM icr.io/cpopen/ibm-eventautomation-flink/ibm-eventautomation-flink>
     flinkConfiguration:
       license.use: EventAutomationProduction
       license.license: 'L-KCVZ-JL5CRM'
       license.accept: 'false'
       high-availability.type: org.apache.flink.kubernetes.highavailability.KubernetesHaServicesFactory
       high-availability.storageDir: 'file:///opt/flink/volume/flink-ha'
       restart-strategy.type: failure-rate
       restart-strategy.failure-rate.max-failures-per-interval: '10'
       restart-strategy.failure-rate.failure-rate-interval: '10 min'
       restart-strategy.failure-rate.delay: '30 s'
       execution.checkpointing.interval: '5000'
       execution.checkpointing.unaligned.enabled: 'false'
       state.backend.type: rocksdb
       state.backend.rocksdb.thread.num: '10'
       state.backend.incremental: 'true'
       state.backend.rocksdb.use-bloom-filter: 'true'
       state.checkpoints.dir: 'file:///opt/flink/volume/flink-cp'
       state.checkpoints.num-retained: '3'
       state.savepoints.dir: 'file:///opt/flink/volume/flink-sp'
       taskmanager.numberOfTaskSlots: '2'
       table.exec.source.idle-timeout: '30 s'
       security.ssl.enabled: 'true'
       security.ssl.truststore: /opt/flink/tls-cert/truststore.jks
       security.ssl.truststore-password: <jks-password>
       security.ssl.keystore: /opt/flink/tls-cert/keystore.jks
       security.ssl.keystore-password: <jks-password>
       security.ssl.key-password: <jks-password>
       kubernetes.secrets: '<jks-secret>:/opt/flink/tls-cert'
     serviceAccount: flink
     podTemplate:
       apiVersion: v1
       kind: Pod
       metadata:
         name: pod-template
       spec:
         affinity:
           podAntiAffinity:
             preferredDuringSchedulingIgnoredDuringExecution:
               - weight: 80
                 podAffinityTerm:
                   labelSelector:
                     matchExpressions:
                       - key: type
                         operator: In
                         values:
                           - flink-native-kubernetes
                   topologyKey: kubernetes.io/hostname
         containers:
           - name: flink-main-container
             volumeMounts:
               - name: flink-logs
                 mountPath: /opt/flink/log
               - name: flink-volume
                 mountPath: /opt/flink/volume
         volumes:
           - name: flink-logs
             emptyDir: {}
           - name: flink-volume
             persistentVolumeClaim:
               claimName: ibm-flink-pvc
     jobManager:
       replicas: 2
       resource:
         memory: '4096m'
         cpu: 0.5
     taskManager:
       resource:
         memory: '4096m'
         cpu: 2
     job:
       jarURI: <insert jar file name here>
       args: ['<insert path for statements.sql here>']
       parallelism: 1
       state: running
       upgradeMode: savepoint
       allowNonRestoredState: true
     mode: native
   ```

   In {{site.data.reuse.ep_name}} versions earlier than 1.2.3, select the [Production - Flink Application cluster](../../installing/planning/#flink-production-application-cluster-sample) sample.

   **Note:** The Flink instance must be configured with persistent storage.

   If you do not want to use the examples provided earlier, add the following parameter to set a timeout period for event sources when they are marked idle. This allows downstream tasks to advance their watermark. Idleness is not detected by default. The parameter is included in all Flink samples:

   ```yaml
   spec:
   flinkConfiguration:
      table.exec.source.idle-timeout: '30 s'
   ```

   For more information about `table.exec.source.idle-timeout`, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/config/#table-exec-source-idle-timeout){:target="_blank"}.

   b. Append the following `spec.job` parameter, or edit the existing parameter if using the Production - Flink Application cluster sample:

   ```yaml
   spec:
     job:
       jarURI: local:///opt/flink/usrlib/sql-runner.jar
       args: ["/opt/flink/usrlib/sql-scripts/statements.sql"]
       parallelism: 1
       state: running
       upgradeMode: savepoint
   ```

   c. Set the Flink image:

   ```yaml
   spec:
     image: <image built at step 1.e>
   ```

   d. Set the Flink version (only required if the `--set webhook.create` is set to `false` during the operator installation).  

   1. Obtain the correct version by listing the `IBM_FLINK_VERSION` environment variable on the Flink operator pod:

      ```shell
      kubectl set env pod/<flink_operator_pod_name> --list -n <flink_operator_namespace> | grep IBM_FLINK_VERSION
      ```

   2. Add the version to the `FlinkDeployment`, for example:

      ```yaml
      spec:
        flinkVersion: "v1_19"
      ```

3. Apply the modified `FlinkDeployment` custom resource.


## Changing the parallelism of a Flink SQL runner

<!-- hide autoscaler
#### Using explicit configuration
hide autoscaler -->

1. Edit the `FlinkDeployment` custom resource.

   a. Ensure that the Flink cluster has enough task slots to fulfill the targeted parallelism value.

   ```shell
   Task slots = spec.taskmanager.replicas × spec.flinkConfiguration["taskmanager.numberOfTaskSlots"] 
   ```

   b. Change the `spec.job.parallelism` value, then set `spec.job.state` to `running` and `spec.job.upgradeMode` to `savepoint`.

   ```yaml
   spec:
     job:
       jarURI: local:///opt/flink/usrlib/sql-runner.jar
       args: ["/opt/flink/usrlib/sql-scripts/statements.sql"]
       parallelism: 2
       state: running
       upgradeMode: savepoint
       allowNonRestoredState: true
   ```

2. Apply the modified `FlinkDeployment` custom resource.

   The following operations are automatically performed by Flink:
   - A savepoint is created before the Flink job is suspended.
   - The Flink cluster is shutdown, the `JobManager` and `TaskManager` pods are terminated.
   - A Flink cluster is created with new `JobManager` and `TaskManager` pods.
   - The Flink job is restarted from the savepoint.

<!-- hide autoscaler
#### Using the Flink autoscaler

1. Ensure that the Kafka topics for the sources and the destination are defined with more than one partition.

2. Edit the `FlinkDeployment` custom resource.

   a. Ensure that `spec.job.parallelism` option is not set and `spec.job.upgradeMode` value is set to `savepoint`.

   ```yaml
   spec:
     job:
       jarURI: local:///opt/flink/usrlib/sql-runner.jar
       args: ["/opt/flink/usrlib/sql-scripts/statements.sql"]
       state: running
       upgradeMode: savepoint
   ```

    b. In the `spec.flinkConfiguration`, add the Flink autoscaler parameters to match your workload expectations.

      For more information about the autoscaler and a basic configuration example, see [Flink autoscaler](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.9/docs/custom-resource/autoscaler/)

      For a detailed configuration reference, see the [Flink autoscaler configuration options](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.9/docs/operations/configuration/#autoscaler-configuration)

      **Important:** If you have already defined the `pipeline.max-parallelism` option in `spec.flinkConfiguration` then do not alter the value.
     This would result in an incompatible change when the Job is restarted from an existing savepoint.

3. Apply the modified `FlinkDeployment` custom resource.
hide autoscaler -->

## Stop a Flink SQL job with a savepoint

You can temporarily stop a running Flink job while capturing its current state by creating a savepoint, and allowing you to restart the job from the exact point where it stopped by using the savepoint when required.

1. Edit the `FlinkDeployment` custom resource.

2. Make the following modifications:

   a. Set the value of `spec.job.upgradeMode` to `savepoint`.

   b. Set the value of `spec.job.state` to `suspended` to stop the Flink job.

   ```yaml
   spec:
     job:
       jarURI: local:///opt/flink/usrlib/sql-runner.jar
       args: ["/opt/flink/usrlib/sql-scripts/statements.sql"]
       state: suspended
       upgradeMode: savepoint
   ```

3. Save the changes in the `FlinkDeployment` custom resource.

   A savepoint is triggered and written to a location in the PVC, which is indicated in the `status.jobStatus.savepointInfo.lastSavepoint.location` field of the `FlinkDeployment` custom resource.

   For example:

   ```yaml
   status:
     [...]
     jobStatus:
       [...]
       savepointInfo:
         [...]
         lastSavepoint:
           formatType: CANONICAL
           location: 'file:/opt/flink/volume/flink-sp/savepoint-e372fa-9069a1c0563e'
           timeStamp: 1733957991559
           triggerNonce: 1
           triggerType: UPGRADE
   ```

## Resume a suspended Flink job

You can resume a suspended job from the exact point where it stopped by using the savepoint created during its suspension.

1. Edit the `FlinkDeployment` custom resource of a Flink job that you [suspended](#stop-a-flink-job-with-a-savepoint) earlier:

   a. Set the value of `spec.job.upgradeMode` to `savepoint`.

   b. Set the value of `spec.job.state` to `running` to resume the Flink job.

   c. Remove `spec.job.savepointTriggerNonce` and its value.

   d. Set the value of `spec.job.initialSavepointPath` to the savepoint location described in step 3 of [suspended](./#stop-a-flink-sql-job-with-a-savepoint) the Flink job.

   For example:

   ```yaml
   job:
     jarURI: local:///opt/flink/usrlib/sql-runner.jar
     args: ["/opt/flink/usrlib/sql-scripts/statements.sql"]
     state: running
     upgradeMode: savepoint
     initialSavepointPath: file:/opt/flink/volume/flink-sp/savepoint-e372fa-9069a1c0563e
     allowNonRestoredState: true
   ```

2. Save the changes in the `FlinkDeployment` custom resource.

   A savepoint is triggered and written to a location in the PVC, which is indicated in the `status.jobStatus.savepointInfo.lastSavepoint.location` field of the `FlinkDeployment` custom resource.

   For example:

   ```yaml
   status:
     [...]
     jobStatus:
       [...]
       savepointInfo:
         [...]
         lastSavepoint:
           formatType: CANONICAL
           location: 'file:/opt/flink/volume/flink-sp/savepoint-e372fa-9069a1c0563e'
           timeStamp: 1733957991559
           triggerNonce: 1
           triggerType: MANUAL
   ```

## Enable SSL connection for your database

To securely connect Flink jobs to a database such as PostgreSQL, MySQL, or Oracle, enable an SSL connection with the database as follows:

1. Ensure you [added the CA certificate](../../installing/configuring/#add-the-ca-certificate-to-the-truststore) for your database to the truststore and then [created a secret](../../installing/configuring/#create-a-secret-with-the-truststore) with the truststore.

2. Edit the `FlinkDeployment` custom resource.

3. Complete the following modifications:

   - In the `spec.flinkConfiguration` section, add:

     ```yaml
     env.java.opts.taskmanager: >-
        -Djavax.net.ssl.trustStore=/certs/truststore.<keystore-extension>
        -Djavax.net.ssl.trustStorePassword=<chosen password>
     env.java.opts.jobmanager: >-
        -Djavax.net.ssl.trustStore=/certs/truststore.<keystore-extension>
        -Djavax.net.ssl.trustStorePassword=<chosen password>
     ```

   Where:

   - `<keystore-extension>` is the extension for your keystore format. For example, `jks` for Java Keystore and `p12` for Public-Key Cryptography Standards.
   
   - In `spec.podTemplate.spec.containers.volumeMounts` section, add:

     ```yaml
     - mountPath: /certs
       name: truststore
       readOnly: true
     ```

   - In `spec.podTemplate.spec.volumes` section, add:

     ```yaml
     - name: truststore
       secret:
         items:
           - key: truststore.<keystore-extension>
             path: truststore.<keystore-extension>
         secretName: ssl-truststore
     ```

4. Apply the modified `FlinkDeployment` custom resource:

   ```shell
   kubectl apply -f <custom-resource-file-path>
   ```

   For example:

   ```shell
   kubectl apply -f flinkdeployment_demo.yaml
   ```

A secure SSL connection is enabled between Flink and the database.
