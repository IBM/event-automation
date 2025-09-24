---
title: "Deploying customized jobs"
excerpt: "Find out how to deploy in a Flink cluster your flows customized for production or test environments."
categories: advanced
slug: deploying-customized
toc: true
---

Find out how to deploy your Flink jobs that are customized for production or test environments in an [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} Flink cluster.

Benefits of customized Flink jobs include:

* Compatibility when working on an automation in a continuous integration and continuous delivery (CI/CD) pipeline.
* The ability to reuse and easily customize the connector configuration across different targeted environments, such as test, staging, pre-production, and production (with the **JSON and configuration YAML** export option).
* Can be used for flows containing the [detect patterns node](../../nodes/processornodes#detect-patterns).
* Support for the automatic upgrade of your {{site.data.reuse.ibm_flink_operator}} version.
  

**Important:** This deployment cannot be used with the {{site.data.reuse.ep_name}} UI.


## Prerequisites
{: #prerequisites}

- You [exported](../exporting-flows) your flow from the {{site.data.reuse.ep_name}} UI in the **JSON and configuration YAML** format, and saved it to a file, for example, `flow.zip`. 

- You downloaded the exported flow file (for example, `flow.zip`), and extracted it to have the `flow.json` and `config.yaml` files.


## Preparing the `config.yaml` file to match the target environment
{: #preparing-the-configyaml-file-to-match-the-target-environment}

Before deploying the Flink job, edit the `config.yaml` file. The following is an example `config.yaml` file exported from the {{site.data.reuse.ep_name}} UI:

```yaml
config:
  source:
    source___TABLE:
      properties.sasl.jaas.config: org.apache.kafka.common.security.scram.ScramLoginModule
        required username="<username_redacted>" password="<password_redacted>";
      connector: kafka
      format: json
      json.ignore-parse-errors: 'true'
      properties.bootstrap.servers: kafka.01:9002
      properties.isolation.level: read_committed
      properties.sasl.mechanism: SCRAM-SHA-512
      properties.security.protocol: SASL_SSL
      properties.ssl.endpoint.identification.algorithm: ''
      properties.ssl.truststore.certificates: '-----BEGIN CERTIFICATE----- [...] -----END CERTIFICATE-----'
      properties.ssl.truststore.type: PEM
      properties.tls.pemChainIncluded: 'false'
      scan.startup.mode: earliest-offset
      topic: input-topic
  sink_1:
    sink_1:
      properties.sasl.jaas.config: org.apache.kafka.common.security.scram.ScramLoginModule
        required username="<username_redacted>" password="<password_redacted>";
      connector: kafka
      format: json
      properties.bootstrap.servers: kafka.01:9002
      properties.sasl.mechanism: SCRAM-SHA-512
      properties.security.protocol: SASL_SSL
      properties.ssl.endpoint.identification.algorithm: ''
      properties.ssl.truststore.certificates: '-----BEGIN CERTIFICATE----- [...] -----END CERTIFICATE-----'
      properties.ssl.truststore.type: PEM
      properties.tls.pemChainIncluded: 'false'
      topic: output-topic

```


The `config.yaml` file contains information about the nodes, tables, and their connector properties where:

- `config`: Lists the names of the nodes that use [Kafka](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/kafka/){:target="_blank"}, [JDBC](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/jdbc){:target="_blank"}, and [HTTP](https://github.com/getindata/flink-http-connector/blob/0.19.0/README.md){:target="_blank"} connectors. In the example snippet, the `source` and `sink_1` nodes are listed.
- `config.source`: Lists the tables present in the SQL generated for the `source` node. In the example snippet, there is only one table for the `source` node: `source___TABLE`
- `config.source.source___TABLE`: Lists the connector properties of the `source___TABLE` table.
- `config.sink_1`: Lists the tables present in the SQL generated for the `sink_1` node.  In the example snippet, there is only one table for the `sink_1` node: `sink_1` (table name is same as the node name).
- `config.sink_1.sink_1`: Lists the connector properties of the `sink_1` table. 

**Note:** Sensitive properties, which have redacted values, are listed first, in alphabetical order of the connector property name. Unredacted properties are then listed also in the alphabetical order. Their value is based on what you configured in the {{site.data.reuse.ep_name}} UI.


You can edit the `config.yaml` file as follows:

* An actual value must be provided for the properties with redacted values. Otherwise, the deployment fails.
* Do not modify node names and table names. It must match the values in the `flow.json` file.
* Optional: values of unredacted properties can be modified.
  * **Important:** The property `scan.startup.mode` has always the value `earliest-offset` in the exported `config.yaml` file. It can be changed for instance to `latest-offset`, as required.
* Optional: connector properties can be added or removed.
* For security reasons, the values containing sensitive credentials, such as username and password, are removed when exporting the flow from the {{site.data.reuse.ep_name}} UI, so you must restore them.

Also, the exported `config.yaml` file contains connector configuration that is applicable to the environment targeted in the {{site.data.reuse.ep_name}} UI. When deploying to a different target environment, you might need to adapt the connector properties to the target environment.

See the following table for credentials and connector properties information about supported Flink SQL connectors:

  | Flink SQL connector | Used by nodes | Sensitive credentials | Connector properties |
  | --- | --- | --- | --- |
  | **Kafka** | [Source](../../nodes/eventnodes/#event-source) and [destination](../../nodes/eventnodes/#event-destination) | [About Kafka connector](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/kafka/){:target="_blank"} <br> <br>  **Note:** When configuring SCRAM authentication for the Kafka connector, ensure you use double quotes only. Do not use a backslash character (`\`) to escape the double quotes. The valid format is: `username="<username>" password="<password>"` |  [Kafka connector properties](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/kafka/#connector-options){:target="_blank"} <br> <br> For more information about how events can be consumed from Kafka topics, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/kafka/#start-reading-position){:target="_blank"}. <br> <br>  **Note:** The Kafka [connector](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/kafka/#connector){:target="_blank"} value must be `kafka`. The Kafka connector version for {{site.data.reuse.ep_name}} versions 1.4.0 and later is 3.4.0-1.20. |
  | **JDBC** | [Database](../../nodes/enrichmentnode/#enrichment-from-a-database) | [About JDBC connector](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/jdbc){:target="_blank"} | [JDBC connector properties](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/jdbc/#connector-options){:target="_blank"} <br> <br> **Note:** The JDBC connector version for {{site.data.reuse.ep_name}} versions 1.4.0 and later is 3.3.0-1.20. |
  | **HTTP** | [API](../../nodes/enrichmentnode/#enrichment-from-an-api) | [About HTTP connector](https://github.com/getindata/flink-http-connector/blob/0.19.0/README.md){:target="_blank"} | [HTTP connector properties](https://github.com/getindata/flink-http-connector/blob/0.19.0/README.md#table-api-connector-options){:target="_blank"}. <br> <br> **Note:** The HTTP connector version for {{site.data.reuse.ep_name}} versions 1.4.0 and later is 0.19.0. |


**Important:**
* The value of the `format` property of the [Kafka connector](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/table/kafka/){:target="_blank"}, which allows to select between Avro, Avro (schema registry), and JSON, should not be changed in the `config.yaml`. Instead, change it by editing the flow in the {{site.data.reuse.ep_name}} UI, test the flow, then export the flow again.
* The `flow.json` file must not be modified.


## Use of templating
{: #use-of-templating}

The values of the connector properties in the `config.yaml` file can be turned into template variables by manually editing the `config.yaml` file.

The actual values can then be provided in a CI/CD pipeline, by using any templating engine.

For example (the exact syntax might vary based on the templating engine):
{% raw %}
```yaml
properties.sasl.jaas.config: org.apache.kafka.common.security.scram.ScramLoginModule
  required username="{{ kafka.username }}" password="{{ kafka.password }}";
```
{% endraw %}


## Deploy the Flink job
{: #deploy-the-flink-job}

You can use a Kubernetes `FlinkDeployment` custom resource in [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} to deploy a Flink job.

1. {{site.data.reuse.cncf_cli_login}}


1. Switch to the namespace where the {{site.data.reuse.ibm_flink_operator}} is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

1. Deploy a Kubernetes secret holding the `flow.json` and `config.yaml` files:

   ```shell
   kubectl create secret generic <k8s_secret_name> \
     --from-file=flow.json=./flow.json \
     --from-file=config.yaml=./config.yaml
   ```

   For example, to create a secret named `application-cluster-prod`:

   ```shell
   kubectl create secret generic application-cluster-prod \
     --from-file=flow.json=./flow.json \
     --from-file=config.yaml=./config.yaml
   ```

   Ensure that you make a note of the secret name that you provide in the `<k8s_secret_name>` field to use in the next step.

   A simple way for allowing the coexistence of multiple Flink instances in the same namespace is to use for the Kubernetes secret the same name as for the Flink instance. This way, the mapping between Flink instances and Kubernetes secrets is clear, and there is no clash.

1. Create the {{site.data.reuse.ibm_flink_operator}} `FlinkDeployment` custom resource.

   a. Choose the [Production - Flink Application cluster](../../installing/planning/#flink-production-application-cluster-sample) sample, or a Flink custom resource in [application mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"}, configured with persistent storage. 


   If you prefer to not use a provided sample, add the following parameters:

   - Set a timeout period for event sources when they are marked idle. This allows downstream tasks to advance their watermark. Idleness is not detected by default. The parameter is included in all the provided samples.

     ```yaml
     spec:
       flinkConfiguration:
         table.exec.source.idle-timeout: '30 s'
     ```
  
      For more information about `table.exec.source.idle-timeout`, see the [Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/config/#table-exec-source-idle-timeout){:target="_blank"}.

   - Add the following `volume` declaration, setting the `secret.secretName` field to the secret name that you created in step 3 earlier, for example:

     ```yaml
     volumes:
       - name: flow-volume
         secret:
           secretName: application-cluster-prod
     ```

   - Add the volume mount declaration:

     ```yaml
     spec:
       # [...]
       podTemplate:
        # [...]
         spec:
           # [...]
           containers:
             - name: flink-main-container
               volumeMounts:
                 # [...]
                 - name: flow-volume
                   mountPath: /opt/flink/ibm-flow/flow.json
                   subPath: flow.json
                   readOnly: true
                 - name: flow-volume
                   mountPath: /opt/flink/ibm-flow/config.yaml
                   subPath: config.yaml
                   readOnly: true
     ```

   - Configure the `spec.job` field:

     ```yaml
     spec:
       # [...]
       job:
         jarURI: 'local:///opt/flink/ibm-flow/ibm-ep-flow-deployer.jar'
         args: []
         parallelism: 1
         state: running
         upgradeMode: savepoint
         allowNonRestoredState: true
     ```

   b. Prepare the `FlinkDeployment` custom resource as described in step 1 of [installing a Flink instance](../../installing/installing#installing-a-flink-instance-by-using-the-cli).


1. Optional: If your flow connects to databases or API servers, ensure that you have [configured the SSL connection](#enable-ssl-connection-for-your-database-and-api-server).

1. Apply the modified `FlinkDeployment` custom resource by using the [UI](../../installing/installing#Installing-a-flink-instance-using-the-yaml-view) or the [CLI](../../installing/installing#Installing-a-flink-instance-by-using-the-cli).

<!-- HIDE UDF until supported at authoring time
## Use Flink user-defined functions
{: #use-flink-user-defined-functions}

Optionally, [user-defined functions (UDFs)](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/functions/udfs/){:target="_blank"} can be used as a complement of the [built-in functions](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/functions/systemfunctions/){:target="_blank"}. UDFs can be used in the SQL of [SQL processor nodes](../../nodes/custom) authored in the {{site.data.reuse.ep_name}} UI.

For more information, see [UDFs in the exported SQL](../../reference/supported-functions#user-defined-functions-in-the-exported-sql).

For deploying jobs that use UDFs, the JAR file that contains the UDF classes needs to be copied into the Flink image, using the following steps:

1. Execute the following command to extract the Flink image name including its SHA digest from the `ClusterServiceVersion` (CSV). For example, if you are running on Flink version {{site.data.reuse.flink_operator_current_version}}:

   ```shell
   kubectl get csv -o jsonpath='{.spec.install.spec.deployments[*].spec.template.spec.containers[0].env[?(@.name=="IBM_FLINK_IMAGE")].value}' ibm-eventautomation-flink.v{{site.data.reuse.flink_operator_current_version}}
   ```
   
   Alternatively, you can obtain the image name from the Flink operator pod's environment variable:

   ```shell
   kubectl set env pod/<flink_operator_pod_name> --list -n <flink_operator_namespace> | grep IBM_FLINK_IMAGE
   ```

2. Create a `Dockerfile` with a `FROM` clause to use the IBM Flink image with its SHA digest, as determined in the previous step, and adding the UDF jar.

    ```Dockerfile
    FROM --platform=<platform> <IBM Flink image with digest>
    COPY --chown=flink:root <path-of-the-udf-jar> /opt/flink/lib
    ```

   Where `<platform>` is `linux/amd64` or `linux/s390x`, depending on your deployment target, and `<path-of-the-udf-jar>` is the path of the UDF jar, for instance `/udfproject/target/udf.jar`.

3. Build the docker image and push it to a registry accessible from your {{site.data.reuse.openshift_short}}. If your registry requires authentication, configure the image pull secret, for example, by using the [global cluster pull secret](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/images/managing-images#images-update-global-pull-secret_using-image-pull-secrets){:target="_blank"}.

4. Specify this image in the `spec.image` field of the Flink custom resource.

   ```yaml
   spec:
     image: <image built at step 3>
   ```

## Changing the parallelism
{: #changing-the-parallelism}

1. Edit the `FlinkDeployment` custom resource.

   a. Ensure that the Flink cluster has enough task slots to fulfill the targeted parallelism value.

   ```shell
   Task slots = spec.taskmanager.replicas × spec.flinkConfiguration["taskmanager.numberOfTaskSlots"] 
   ```

   b. Change the `spec.job.parallelism` value, then set `spec.job.state` to `running` and `spec.job.upgradeMode` to `savepoint`.

   ```yaml
   spec:
     job:
       jarURI: local:///opt/flink/ibm-flow/ibm-ep-flow-deployer.jar
       args: []
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
-->

## Stop a Flink job with a savepoint
{: #stop-a-flink-job-with-a-savepoint}

You can temporarily stop a running Flink job while capturing its current state by creating a savepoint, and allowing you to restart the job from the exact point where it stopped by using the savepoint when required.

1. Edit the `FlinkDeployment` custom resource.

2. Make the following modifications:

   a. Ensure that the value of `spec.job.upgradeMode` is `savepoint`.

   b. Ensure that the value of `spec.job.state` is `suspended` to stop the Flink job.

   ```yaml
   spec:
     job:
       jarURI: local:///opt/flink/ibm-flow/ibm-ep-flow-deployer.jar
       args: []
       state: suspended
       upgradeMode: savepoint
   ```

3. Save the changes in the `FlinkDeployment` custom resource.

4. The `FlinkStateSnapshots` custom resource is created by the operator with a name that starts with the name of your `FlinkDeployment` custom resource, and a savepoint is triggered and written to a location in the PVC, which is indicated in the `status.path` of `FlinkStateSnapshots` custom resource.

   For example:

   ```yaml
   status:
     failures: 0
     path: 'file:/opt/flink/volume/flink-sp/savepoint-caf2b2-39d09a1c170c'
     state: COMPLETED
   ```

## Resume a suspended Flink job
{: #resume-a-suspended-flink-job}

You can resume a suspended job from the exact point where it stopped by using the savepoint created during its suspension.

1. Edit the `FlinkDeployment` custom resource of a Flink job that you [suspended](#stop-a-flink-job-with-a-savepoint) earlier:

   a. Set the value of `spec.job.upgradeMode` is `savepoint`.

   b. Set the value of `spec.job.state` is `running` to resume the Flink job.

   c. Set the value of `spec.job.initialSavepointPath` to the savepoint location found in the `status.path` field of the `FlinkStateSnapshots` custom resource from step 4 of [stopping a Flink job with a savepoint](./#stop-a-flink-job-with-a-savepoint).

   For example:

   ```yaml
      job:
        jarURI: local:///opt/flink/ibm-flow/ibm-ep-flow-deployer.jar
        args: []
        state: running
        upgradeMode: savepoint
        initialSavepointPath: file:/opt/flink/volume/flink-sp/savepoint-caf2b2-39d09a1c170c
        allowNonRestoredState: true
   ```

2. Apply the modified `FlinkDeployment` custom resource.

For more information on manually restoring a job, see [manual recovery](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.12/docs/custom-resource/job-management/#manual-recovery).

## Enable SSL connection for your database and API server
{: #enable-ssl-connection-for-your-database-and-api-server}

To securely connect Flink jobs to an API server or a database such as PostgreSQL, MySQL, or Oracle, enable an SSL connection as follows:

1. Ensure that you have [added the CA certificate](../../installing/configuring/#add-the-ca-certificate-to-the-truststore) for your database or API server to the truststore, and [created a secret](../../installing/configuring/#create-a-secret-with-the-truststore) that includes the truststore.

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

A secure SSL connection is enabled between Flink and your API server or the database.


## Troubleshooting
{: #troubleshooting}

The successful execution of the Flink job when deploying depends on the correctness of the actual connector configuration.

For troubleshooting:

* Check the logs of the active Flink Job Manager (for errors due to invalid `config.yaml` file, search for `com.ibm.ei.streamproc.model.deploy.imports.ConfigModelException`).
* Errors due to incorrect configuration can also lead to Flink exceptions, which are logged in the Flink task manager pods.
