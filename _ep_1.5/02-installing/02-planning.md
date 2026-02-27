---
title: "Planning your installation"
excerpt: "Planning your installation of Event Processing."
categories: installing
slug: planning
toc: true
---


Consider the following when planning your installation of {{site.data.reuse.ep_name}} and Flink.

Decide the purpose of your deployment, for example, whether you want a starter deployment for testing purposes, or a production deployment.

- Use the [{{site.data.reuse.ep_name}} sample deployments](#event-processing-sample-deployments) and the [Flink sample deployments](#flink-sample-deployments) as a starting point to base your deployment on.
- For production deployments, and whenever you want your data to be saved in the event of a restart, set up [persistent storage](#planning-for-persistent-storage).
- Consider the options for [securing](#planning-for-security) your deployment.
- Customize the [configuration](../configuring) to suit your needs.

## {{site.data.reuse.ep_name}} sample deployments
{: #event-processing-sample-deployments}

A number of sample configuration files are available in [GitHub](https://ibm.biz/ea-ep-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.ep_name}} version, and then go to `/cr-examples/eventprocessing/openshift` or `/cr-examples/eventprocessing/kubernetes` based on your platform to access the samples. These range from smaller deployments for non-production development or general experimentation to deployments that can handle a production workload.


The following {{site.data.reuse.ep_name}} sample configurations are available to deploy:

- Quick Start: A development instance with reduced resources, using ephemeral storage and Local authentication.

- Production: A production instance with placeholders for persistence and OpenID Connect (OIDC) authentication.


**Important:** When selecting an {{site.data.reuse.ep_name}} sample, you must pair it with a Flink deployment created by using the equivalent Flink sample. This pairing is required because the {{site.data.reuse.ep_name}} Quick Start sample is designed to communicate with a Flink setup that does not use TLS, whereas the {{site.data.reuse.ep_name}} Production sample expects a Flink setup that has TLS enabled.  
You can customize the Flink sample, for example, by adding truststores or making other configuration changes, as long as the TLS configuration remains consistent. This means TLS must stay enabled if it was originally enabled, or stay disabled if it was originally disabled. For example:

- The {{site.data.reuse.ep_name}} Quick Start sample must be used with the Quick Start Flink sample.
- The {{site.data.reuse.ep_name}} Production sample must be used with either the Flink Minimal Production sample or the Flink Production sample.

By default, both samples require the following resources:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | 
|---------------------|-------------------|---------------------|-------------------|
| 1.0                 | 2.0               | 1.0                 | 2.0               |    

If you are [installing](../installing/#installing-an-event-processing-instance-by-using-the-web-console) on the {{site.data.reuse.openshift_short}}, you can view and apply the sample configurations in the web console.

If you are installing on other Kubernetes platforms, the following samples are available in the Helm chart package:

- Quick start
- Production

The sample configurations for both the {{site.data.reuse.openshift_short}} and other Kubernetes platforms are also available in [GitHub](https://ibm.biz/ea-ep-samples){:target="_blank"} where you can select the GitHub tag for your {{site.data.reuse.ep_name}} version, and then go to `/cr-examples/eventprocessing/openshift` or `/cr-examples/eventprocessing/kubernetes` to access the samples.

**Important:** For a production setup, the sample configuration values are for guidance only, and you might need to change them.

## Flink sample deployments
{: #flink-sample-deployments}

A number of sample configuration files are available in [GitHub](https://ibm.biz/ea-flink-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.ibm_flink_operator}} version, and then go to `/cr-examples/flinkdeployment/openshift` or `/cr-examples/flinkdeployment/kubernetes` based on your platform to access the samples. These range from smaller deployments for non-production development or general experimentation to deployments that can handle a production workload.

To determine the right sample to use that meets your requirements, establish if your typical {{site.data.reuse.ep_name}} flows can be handled by the Minimal Production or the Production sample. For this purpose, find out if the CPU requirements of a typical job, along with the CPU requirements of all the other competing jobs that might be running on the same Task Manager, do not exceed the allocated amount of CPU. In addition, the memory required by a job should not exceed 80% of the limit defined in the sample.

**Important:** To [secure your communication](#securing-communication-with-flink-deployments) with Flink deployments, all samples, except the Quick Start one, require that you specify a secret containing a JKS keystore and truststore, and the password for that keystore and truststore.

### Points to consider for resource requirements

- Each authored flow requires only 1 Task Manager slot. With both the Minimal Production and Production [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} samples preconfigured with 10 Task Manager slots, you can run up to 10 flows at the same time on one Task Manager (one Java Virtual Machine).
  
  **Note:** Each flow generates a new Flink job, which requires at least one Task Manager slot. Task Manager pods are scaled up and down horizontally on demand. A new Task Manager replica is created when a job is deployed that exceeds the current slot capacity across all the currently running Task Managers, which is determined by the parameter `spec.flinkConfiguration.taskmanager.numberOfTaskSlots` in the `FlinkDeployment` custom resource.

- All jobs in the same Task Manager compete for the CPU capacity of the Task Manager as defined in the sample. The amount of memory defined for a Task Manager is equally pre-allocated to each Task Manager slot.

- What happens if the resource limits are exceeded?
  - If the CPU limit is exceeded, Kubernetes CPU throttling is activated. When sustained, the throttling can have a significant negative impact on performance. If the memory limit is exceeded, the Kubernetes [out-of-memory condition](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/#exceed-a-container-s-memory-limit){:target="_blank"} can terminate the Task Manager container.
  - A good practice is to avoid exceeding resource usage beyond 70% of CPU or 80% of memory capacity for prolonged periods. The spare capacity can cover short-lived CPU peaks, Flink checkpoint processing, and minor fluctuations in memory usage. If either of the thresholds is exceeded consistently after choosing the Minimal Production sample despite performance optimizations on a flow, consider the larger Production sample.

High-level criteria for choosing between Minimal Production and Production samples:

| Criteria | Minimal Production (1 CPU core, 2GB memory) | Production (2 CPU cores, 4GB memory) |
|---|---|---|
| Job resource requirements | Smaller CPU and memory needs. | Higher CPU and memory needs. |
| Typical message size | Less than 1KB. | Greater than 1KB. |
| Flow composition | Mostly filters and transformations. | Mostly interval joins and aggregations. |
| Workload characteristics | Stable and predictable. | Might contain spikes (not sustained high rates). |
| Job Manager replicas | Single replica (slower recovery: jobs are paused while Job Manager restarts). | Multiple replicas (faster recovery: jobs are paused while failover to the standby Job Manager completes). |

To create a configuration optimized for jobs that have high throughput, low latency requirements, or both, estimate your resource requirements, including network capacity.

The following table provides an overview of the Flink sample configurations and their resource requirements:


| Sample | CPU limit per Task Manager | Memory per Task Manager | Slots per Task Manager | Parallelism | Maximum number of flows per Task Manager | Job Manager High Availability | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
|---|---|---|---|---|---|---|---|
| Quick Start | 0.5 | 2GB | 4 | 1 | 4 | No | 1 |
| Minimal Production | 1 | 2GB | 10 | 1 | 10 | Yes (but with 1 replica) | 2 |
| Production | 2 | 4GB | 10 | 1 | 10 | Yes | 3 |

### Flink session cluster samples

With [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} samples, you can run multiple Flink jobs on the same cluster. They are suitable when deploying Flink for use with the {{site.data.reuse.ep_name}} flow authoring UI, and for deploying your flows in a Flink cluster for [development environments](../../advanced/deploying-development).

See the following table for a comparison of the available Flink samples, highlighting their key characteristics, and High Availability configurations:

| Sample | Description | High Availability | Automatic job restart |
|---|---|---|---|
| **Flink Quick Start** | Ephemeral setup with no persistence or reliability. Supports up to 4 parallel flows from the flow authoring tool. If the Job Manager or a job fails, the flow must be manually resubmitted. Suitable for development and experimentation workloads. | No | No |
| **Flink Minimal Production** | Suitable for workloads that use a single Job Manager, offering minimal High Availability. | Minimal | Yes |
| **Flink Production** | Suitable for workloads that use multiple Job Managers for faster failover and improved reliability. | Yes | Yes |


### Flink application cluster sample

The Flink Production Application Cluster sample runs a single Flink job in its own isolated [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} with High Availability (multiple Job Managers) and automatic job restart enabled.

The Flink application cluster sample is not compatible when deploying Flink for use with the {{site.data.reuse.ep_name}} UI. This sample is designed for running an exported flow. It is suitable for production-grade deployments where isolation and customization are required. For the deployment procedure, see [deploying jobs customized for production or test environments](../../advanced/deploying-customized).

The following table provides an overview of the Flink Production Application Cluster configuration and its resource requirements:

| CPU limit per Task Manager | Memory per Task Manager | Slots per Task Manager | Parallelism | Maximum number of flows per Task Manager | Job Manager High Availability | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
|---|---|---|---|---|---|---|
| 2 | 4GB | 2 | Typically more than 1 but set to 1 in the sample. | 1 | Yes | 3 |


### Parallelism

All Flink samples support parallelism, enabling parts of a {{site.data.reuse.ep_name}} flow to scale and run concurrently. You can configure parallelism to increase the number of tasks required for each job.

The parallelism setting directly controls the number of Kafka consumers created. For example, if your topic has 10 partitions and you set parallelism to 10, Flink creates 10 consumers (one per partition). If you set parallelism lower than the number of partitions, fewer consumers are created and each consumer will consume from multiple partitions.

For an application cluster, the application cluster sample is configured with two slots per Task Manager. With the default slot sharing of Flink, a job with parallelism set to 10 typically requires about 10 task slots. If you set parallelism to 10, Flink creates 5 Task Managers to provide the 10 slots required.

You can control parallelism to suit the characteristics of your flow and your workload by using the following parameters in the `FlinkDeployment` custom resource:

- `spec.job.parallelism`: Defines the parallelism for each job. For resource-intensive jobs, parallelism typically requires to be set to greater than 1. For more information about running large jobs, see the [Flink production application cluster sample](#flink-application-cluster-sample).
- `spec.flinkConfiguration["taskmanager.numberOfTaskSlots"]`: Specifies the number of task slots available per Task Manager. This setting controls how many tasks a single Task Manager can execute concurrently.

### Deploying the Flink PVC
{: #deploying-the-flink-pvc}

All Flink samples except the Quick Start sample configure Flink to use persistent storage. Before installing a Flink instance (`FlinkDeployment` custom resource), the following [PersistentVolumeClaim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims){:target="_blank"} must be deployed as follows.

1. {{site.data.reuse.cncf_cli_login}}
2. If the namespace where the Flink instance will be deployed does not exist yet, create it:

   ```shell
   kubectl create namespace <your-namespace>
   ```

3. Set the following environment variable to hold the namespace of the Flink instance:

   ```shell
   export FLINK_NAMESPACE=<your-namespace>
   ```

4. Set the following environment variables to hold the name of the storage class and the storage capacity:

   ```shell
   export STORAGE_CLASS=<your-storage-class>
   export STORAGE_CAPACITY=<your-storage-capacity>
   ```

   For example:

   ```shell
   export STORAGE_CLASS=rook-cephfs
   export STORAGE_CAPACITY=20Gi
   ```

   **Important:** The storage class must comply with the [storage requirements for Flink](../prerequisites/#storage-requirements-for-flink).

   **Important:** The storage capacity needs to be large enough for Flink to store data, which includes the Flink [checkpoints](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/checkpoints/#checkpoint-storage){:target="_blank"} and [savepoints](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/){:target="_blank"}, and the stateful event processing data.

5. Run the following command to deploy the `PersistentVolumeClaim`:

   ```yaml
   kubectl apply -n ${FLINK_NAMESPACE} -f - << EOF
   kind: PersistentVolumeClaim
   apiVersion: v1
   metadata:
     name: ibm-flink-pvc
   spec:
     accessModes:
       - ReadWriteMany
     resources:
       requests:
         storage: ${STORAGE_CAPACITY}
     storageClassName: ${STORAGE_CLASS}
   EOF
   ```

**Note:** The name of the PVC, `ibm-flink-pvc`, must match the name of the PVC configured in the `FlinkDeployment` custom resource. The samples which use persistent storage configure this PVC name.

## Flink session job sample deployments
{: #flink-session-samples}

See the following table for a comparison of the available Flink session job samples, highlighting their key characteristics, High Availability configurations, and suitability for different use cases.

| Sample Name | Suitable for | High Availability | Automatic job restart |
| --- | --- | --- | --- |
| **Flink Session Job Quick Start** | Small workloads, no persistence or reliability requirements. | No | No |
| **Flink Session Job Minimal Production** | Suitable for workloads that use a single Job Manager. | Minimal | Yes, with downtime. |
| **Flink Session Job Production** | Suitable for workloads that use multiple Job Managers. | Yes | Yes |

## Planning for persistent storage
{: #planning-for-persistent-storage}

If you plan to have persistent volumes, consider the disk space required for storage.

You either need to create a [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#static){:target="_blank"}, persistent volume claim, or specify a storage class that supports [dynamic provisioning](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#dynamic){:target="_blank"}. Each component can use a different storage class to control how physical volumes are allocated.

For information about creating persistent volumes and creating a storage class that supports dynamic provisioning:

- For {{site.data.reuse.openshift_short}}, see the [{{site.data.reuse.openshift_short}} documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/storage/understanding-persistent-storage){:target="_blank"}.

- For other Kubernetes platforms, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/){:target="_blank"}.

You must have the Cluster Administrator role for creating persistent volumes or a storage class.

- If these persistent volumes are to be created manually, this must be done by the system administrator before installing {{site.data.reuse.ep_name}}. These will then be claimed from a central pool when the {{site.data.reuse.ep_name}} instance is deployed. The installation will then claim a volume from this pool.
- If these persistent volumes are to be created automatically, ensure a [dynamic provisioner](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/storage/dynamic-provisioning){:target="_blank"} is configured for the storage class you want to use. See [data storage requirements](../prerequisites/#data-storage-requirements) for information about storage systems supported by {{site.data.reuse.ep_name}}.

**Important:**

- **For Flink**, when creating persistent volumes, ensure the **Access mode** is set to `ReadWriteMany`. For more information, see [storage requirements for Flink](../prerequisites/#storage-requirements-for-flink).
- **For {{site.data.reuse.ep_name}}**, when creating persistent volumes, ensure the **Access mode** is set to `ReadWriteOnce`. To use persistent storage, [configure the storage properties](../configuring/#enabling-persistent-storage) in your `EventProcessing` custom resource.

## Planning for security
{: #planning-for-security}

There are two areas of security to consider when installing {{site.data.reuse.ep_name}}:

1. The type of authentication the {{site.data.reuse.ep_name}} UI uses. {{site.data.reuse.ep_name}} UI supports locally defined authentication for testing purposes and OpenID Connect (OIDC) authentication for production purposes.
    - If you are configuring with locally defined authentication, the {{site.data.reuse.ep_name}} UI uses a secret that has a list of username and passwords.
    - If you are configuring with OIDC authentication, you must provide the required information to connect to your OIDC provider.
2. Certificates for the encryption of data in flight require the following configuration when deploying {{site.data.reuse.ep_name}}:
    - Provide a secret containing a CA certificate, which will be used to generate other certificates.
    - Provide a secret that contains a CA certificate, server certificate, and key that has the required DNS names for accessing the deployment.
    - The operator creates a CA certificate, which is used to generate all the other certificates.

To configure authentication, see [managing access](../../security/managing-access).

To configure the certificates, see [configuring TLS](../configuring/#configuring-tls).

### Securing communication with Flink deployments
{: #securing-communication-with-flink-deployments}

When you install {{site.data.reuse.ibm_flink_operator}} in a production environment, enable TLS in your `FlinkDeployment` instance, so that all communication between Flink pods, such as Flink Job Manager and Task Manager pods, use mutual TLS, and the REST endpoint is encrypted. To secure the communication between {{site.data.reuse.ep_name}} and Flink pods:

- Create a secret that contains a JKS keystore, and a truststore that contains the correct CA certificate.
- Create a secret that contains the password for those keystore and truststore.
- Provide access for {{site.data.reuse.ibm_flink_operator}} to a truststore that contains the CA certificate, so that the operator can communicate with the `FlinkDeployment` instance.

For more information, see [configuring TLS for Flink](../configuring/#configuring-tls-to-secure-communication-with-flink-deployments).

## Licensing
{: #licensing}

Licensing is typically based on Virtual Processing Cores (VPC).

For more information about available licenses, chargeable components, and tracking license usage, see the [licensing reference]({{ 'support/licensing' | relative_url }}).