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

A number of sample configuration files are available in [GitHub](https://ibm.biz/ea-ep-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.ep_name}} version, and then go to `/cr-examples/eventprocessing/openshift` or `/cr-examples/eventprocessing/kubernetes` to access the samples. These range from smaller deployments for non-production development or general experimentation to deployments that can handle a production workload.


The following {{site.data.reuse.ep_name}} sample configurations are available to deploy:

- Quick Start: A development instance with reduced resources, using ephemeral storage and Local authentication.
- Production: A production instance with placeholders for persistence and OpenID Connect (OIDC) authentication.

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

A number of sample configuration files are available in [GitHub](https://ibm.biz/ea-flink-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.flink_long}} version, and then go to `/cr-examples/flinkdeployment/openshift` or `/cr-examples/flinkdeployment/kubernetes` to access the samples. These range from smaller deployments for non-production development or general experimentation to deployments that can handle a production workload.

The following table provides an overview of the Flink sample configurations and their resource requirements:

| Sample | CPU limit per Task Manager | Memory per Task Manager | Slots per Task Manager | Parallelism | Max. number of flows per Task Manager | Job Manager High Availability | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
|--------|---------------------------|-------------------------|------------------------|-------------|---------------------------------------|-------------------------------|-----|
| Quick Start | 0.5 | 2GB | 4 | 1 | 2 | No | 1 |
| Minimal Production | 1 | 2GB | 10 | 1 | 5 | Yes (but with 1 replica) | 2 |
| Production | 2 | 4GB | 10 | 1 | 5 | Yes | 3 |
| Production - Flink Application Cluster | 2 | 4GB | 2 | Typically > 1 but set to 1 in the sample | 1 | Yes | 3 |

**Important:**
- Quick Start, Minimal Production, and Production are [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} samples. They are suitable when deploying Flink for use with the {{site.data.reuse.ep_name}} flow authoring UI, and for deploying your advanced flows in a Flink cluster for [development environments](../../advanced/deploying-development).
- The Production - Flink Application Cluster sample is suitable for deploying your advanced flows in a Flink cluster for [production environments](../../advanced/deploying-production). It is not suitable when deploying Flink for use with the {{site.data.reuse.ep_name}} flow authoring UI.

The sample configurations for both the {{site.data.reuse.openshift_short}} and other Kubernetes platforms are available in [GitHub](https://ibm.biz/ea-flink-samples){:target="_blank"} where you can select the GitHub tag for your {{site.data.reuse.flink_long}} version, and then go to `/cr-examples/flinkdeployment/openshift` or `/cr-examples/flinkdeployment/kubernetes` to access the samples.

Points to consider for resource requirements:

- Both the Minimal Production and Production [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} samples are preconfigured with 10 Task Manager slots, allowing for a maximum of 5 {{site.data.reuse.ep_name}}-authored flows to run at the same time on one Task Manager (one Java Virtual Machine). 
  
  **Note:** Each flow generates 2 Flink jobs, and each job is allocated its own Task Manager slot. If you have 6 or more flows, a new Task Manager will be automatically provisioned. With all session cluster configurations, horizontal scaling can happen, constrained only by resource availability. A Task Manager is terminated when all its flows are stopped in the {{site.data.reuse.ep_name}} flow authoring UI, preventing unnecessary allocation of resources.

- All jobs in the same Task Manager compete for the CPU capacity of the Task Manager as defined in the sample. The amount of memory defined for a Task Manager is equally pre-allocated to each Task Manager slot. 
  
  For example, if only 4 flows are running, 1/5 (20%) of the memory is not available to the running jobs. This is because the job parallelism is set to 1, and cannot be modified in the flow authoring UI.
  
  **Note:** `spec.job.parallelism` is a Flink configuration parameter that enables a single job to be allocated up to as many Task Manager slots as the value of the parallelism parameter. For resource-intensive large jobs, the parallelism typically needs to be greater than 1. For more information about running large jobs, see the [Flink production application cluster sample](#flink-production-application-cluster-sample).

- To determine the right sample to use that meets your requirements, establish if your typical {{site.data.reuse.ep_name}} flows can be handled by the Minimal Production or the Production sample. For this purpose, find out if the CPU requirements of a typical job, along with the CPU requirements of all the other competing jobs that may be running on the same Task Manager, do not exceed the allocated amount of CPU. In addition, the memory required by a job should not exceed 80% of the limit defined in the sample.

- What happens if the resource limits are exceeded?
   * If the CPU limit is exceeded, Kubernetes CPU throttling is activated. When sustained, this can have a significant negative impact on performance. If the memory limit is exceeded, the Kubernetes [out-of-memory condition](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/#exceed-a-container-s-memory-limit){:target="_blank"} can terminate the Task Manager container.
   * A good practice is to avoid resource usage consistently exceeding 70% of CPU or 80% of memory capacity. The spare capacity is often enough to take care of short-lived CPU peaks, Flink checkpoint processing, and minor fluctuations in memory usage. If either of the thresholds is being exceeded after choosing the Minimal Production sample despite performance optimizations on a flow, consider the larger Production sample.

High-level criteria for choosing between Minimal Production and Production samples:

- Minimal Production sample (per Task Manager: 1 CPU core, 2GB memory)
  - Jobs have smaller CPU and memory requirements.
  - Message sizes are typically less than 1KB.
  - Flows consist predominantly of filters and transformations.
  - Workloads are stable and predictable.
  - If the Flink Job Manager fails, some downtime is expected.

- Production sample (per Task Manager: 2 CPU cores, 4GB memory)
  - Jobs may have higher CPU and memory requirements.
  - Message sizes are typically greater than 1KB.
  - Flows consist predominantly of interval joins and aggregations.
  - Workloads may contain spikes, but not sustained very high event rates.
  - You have stricter high availability requirements.

To create a configuration optimized for jobs that have high throughput, low latency requirements, or both, estimate your resource requirements, including network capacity.

### Flink Quick Start sample

The Quick Start sample is a Flink [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} suitable only for very small workloads that have no persistence or reliability requirements. It is capable of running in a single Flink Task Manager a maximum of 2 parallel flows submitted from the {{site.data.reuse.ep_name}} flow authoring tool. If you need to run more than 2 flows, a new Task Manager will be automatically created.

This sample does not configure Flink with High Availability for the Flink Job Manager, thus Flink jobs are not automatically restarted if the Flink cluster restarts.

### Flink Minimal Production sample

The Minimal Production sample is a Flink [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} suitable for small production workloads.


This sample configures Flink with minimal High Availability for the Flink Job Manager. This means that Flink jobs are restarted automatically if the Flink cluster restarts. However, some downtime is expected as there is only a single Job Manager replica. 


### Flink Production sample

The Production sample is a Flink [session cluster](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/concepts/flink-architecture/#flink-session-cluster){:target="_blank"} suitable for large production workloads. This sample configures Flink with High Availability for the Flink Job Manager, thus Flink jobs are automatically restarted if the Flink cluster restarts.

### Flink Production Application Cluster sample

The Production – Flink Application Cluster sample is suitable for running a single large Flink job in [application cluster](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/concepts/flink-architecture/#flink-application-cluster){:target="_blank"} mode. You can configure the job parallelism (`spec.job.parallelism`) and the number of slots (`spec.flinkConfiguration["taskmanager.numberOfTaskSlots"]`) to suit the characteristics of your flow and your workload. As this sample configures 2 slots, assuming your job is consuming events from a Kafka topic with 10 partitions, to run a large job you can select a parallelism of 10, which requires 5 Task Managers.

This sample configures Flink with High Availability for the Flink Job Manager. Being a Flink application cluster, the Flink jobs are automatically restarted if the Flink cluster restarts.

For information about using this sample, see [deploying jobs in production environments](../../advanced/deploying-production).

### Deploying the Flink PVC

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

   **Important:** The storage capacity needs to be large enough for Flink to store data, which includes the Flink [checkpoints](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/ops/state/checkpoints/#checkpoint-storage){:target="_blank"} and [savepoints](https://nightlies.apache.org/flink/flink-docs-release-1.18/docs/ops/state/savepoints/){:target="_blank"}, and the stateful event processing data.

5. Run the following command to deploy the `PersistentVolumeClame`:

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


## Planning for persistent storage

If you plan to have persistent volumes, consider the disk space required for storage.

You either need to create a [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#static){:target="_blank"}, persistent volume claim, or specify a storage class that supports [dynamic provisioning](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#dynamic){:target="_blank"}. Each component can use a different storage class to control how physical volumes are allocated.

For information about creating persistent volumes and creating a storage class that supports dynamic provisioning:

- For {{site.data.reuse.openshift_short}}, see the [{{site.data.reuse.openshift_short}} documentation](https://docs.openshift.com/container-platform/4.14/storage/understanding-persistent-storage.html){:target="_blank"}.

- For other Kubernetes platforms, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/){:target="_blank"}.

You must have the Cluster Administrator role for creating persistent volumes or a storage class.

- If these persistent volumes are to be created manually, this must be done by the system administrator before installing {{site.data.reuse.ep_name}}. These will then be claimed from a central pool when the {{site.data.reuse.ep_name}} instance is deployed. The installation will then claim a volume from this pool.
- If these persistent volumes are to be created automatically, ensure a [dynamic provisioner](https://docs.openshift.com/container-platform/4.14/storage/dynamic-provisioning.html){:target="_blank"} is configured for the storage class you want to use. See [data storage requirements](../prerequisites/#data-storage-requirements) for information about storage systems supported by {{site.data.reuse.ep_name}}.

**Important:**

- **For Flink**, when creating persistent volumes, ensure the **Access mode** is set to `ReadWriteMany`. For more information, see [storage requirements for Flink](../prerequisites/#storage-requirements-for-flink).
- **For {{site.data.reuse.ep_name}}**, when creating persistent volumes, ensure the **Access mode** is set to `ReadWriteOnce`. To use persistent storage, [configure the storage properties](../configuring/#enabling-persistent-storage) in your `EventProcessing` custom resource.

## Planning for security

There are two areas of security to consider when installing {{site.data.reuse.ep_name}}:

1. The type of authentication the {{site.data.reuse.ep_name}} UI uses. {{site.data.reuse.ep_name}} UI supports locally defined authentication for testing purposes and OpenID Connect (OIDC) authentication for production purposes.
    - If you are configuring with locally defined authentication, the {{site.data.reuse.ep_name}} UI uses a secret that has a list of username and passwords.
    - If you are configuring with OIDC authentication, you must provide the required information to connect to your OIDC provider.
2. Certificates for the encryption of data in flight, that you must provide to the Event Processing deployment when you create an instance.
    - Provide a secret containing a CA certificate, we will use this to generate other certificates.
    - Provide a secret that contains a CA certificate, server certificate, and key that has the required DNS names for accessing the deployment.
    - The operator creates a CA certificate, which is used to generate all the other certificates.

To configure authentication, see [managing access](../../security/managing-access).

To configure the certificates, see [configuring TLS](../configuring/#configuring-tls).


## Licensing

Licensing is typically based on Virtual Processing Cores (VPC).

For more information about available licenses, chargeable components, and tracking license usage, see the [licensing reference]({{ 'support/licensing' | relative_url }}).
