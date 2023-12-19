---
title: "Gather logs for your capability"
description: "To help IBM support troubleshoot any issues with your Event Automation deployments, run the log gathering script for the right capability."
permalink: /support/gathering-logs/
toc: true
section: "IBM Event Automation support"
cardType: "large"
order: 2
layout: pagesInsideCollection
---

To help IBM Support troubleshoot any issues with your {{site.data.reuse.ea_long}} installation, run the log gathering script as follows to capture the logs. The logs are stored in a folder in the current working directory.

## Prerequisites

To run the log gathering script, ensure you have the following installed on your system:

- If using OpenShift, the [{{site.data.reuse.openshift_short}} CLI (`oc`)](https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html){:target="_blank"} version 4.10 or later.
- If using other Kubernetes platforms, the [Kubernetes command-line tool (`kubectl`)](https://kubernetes.io/docs/tasks/tools/){:target="_blank"} version 1.24 or later.
- The latest 1.1.1 version of [`openssl` command-line tool](https://www.openssl.org/source/){:target="_blank"}.

**Important:** The gather scripts are written in bash. To run the scripts on Windows, ensure that you are running the scripts from a bash prompt. For example, git bash is a suitable shell environment and is available as part of the Git for Windows distribution.

## Online environments

To gather logs from an online environment:
1. Clone the Git repository `ibm-event-automation` as follows:

   ```shell
   git clone https://github.com/IBM/ibm-event-automation
   ```

2. Log in to your cluster as a cluster administrator by setting your [`kubectl` context](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/){:target="_blank"} or by using the [`oc` CLI](https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html#cli-logging-in_cli-developer-commands){:target="_blank"} (`oc login`) on {{site.data.reuse.openshift_short}}.
3. Change directory to the `/support` folder of the cloned repository.
4. Run the `./ibm-events-must-gather` script to capture the relevant logs:

   ```shell
   ./ibm-events-must-gather -n <instance-namespace> [--es-namespace <eventstreams-instance-namespace>  --eem-namespace <event-endpoint-management-instance-namespace> --ep-namespace <event-processing-instance-namespace> --flink-namespace <flink-instance-namespace>] -m <gather-modules> -i <image-address>
   ```

   - For example, to gather logs for {{site.data.reuse.es_name}}, run the following command:

      ```shell
      ./ibm-events-must-gather -n samplenamespace -m eventstreams 
      ```

   - For example, to gather logs for {{site.data.reuse.eem_name}}, run the following command:

      ```shell
      ./ibm-events-must-gather -n samplenamespace -m eem
      ```

   - For example, to gather logs for {{site.data.reuse.ep_name}}, run the following command:

      ```shell
      ./ibm-events-must-gather -n samplenamespace -m eventprocessing
      ```

   - For example, to gather logs for {{site.data.reuse.flink_long}}, run the following command:

     ```shell
     ./ibm-events-must-gather -n samplenamespace -m flink
     ```

   Where:
   - `<gather-modules>` is a comma separated list of [modules](#gather-modules), where valid values are `eventstreams`, `kafka`, `eem`, `eventprocessing`, `flink`, `schema`, `failure`, `overview` and `system`.
   - `<image-address>` is the address of the image to use for gathering logs. If `<image-address>` is not specified, then the default image (`icr.io/cpopen/ibm-events-must-gather`) is set. You can set a different image if instructed by IBM Support.
   - `<instance-namespace>` is the namespace where your capability instance is installed, and where the script gathers log data from.  

      If specifying more than one of `eventstreams`, `eem`, `eventprocessing`, and `flink` modules, individual namespace flags must be used:
        - `--es-namespace` specifies the namespace containing the {{site.data.reuse.es_name}} instance to gather data from.
        - `--eem-namespace` specifies the namespace containing the {{site.data.reuse.eem_name}} instance to gather data from.
        - `--ep-namespace` specifies the namespace containing the {{site.data.reuse.ep_name}} instance to gather data from.
        - `--flink-namespace` specifies the namespace containing the {{site.data.reuse.flink_long}} instance to gather data from.

The logs gathered are stored in an archive file called `ibm-events-must-gather-<timestamp>.tar.gz`, which is added to the current working directory.

## Offline (air-gapped) environments

To gather diagnostic logs in an offline (also referred to as air-gapped or disconnected) environment:

1. Pull the {{site.data.reuse.es_name}} `must-gather` image as follows:

   ```shell
   docker pull icr.io/cpopen/ibm-events-must-gather
   ```

2. Tag the image:

   ```shell
   docker image -t icr.io/cpopen/ibm-events-must-gather <private-registry-image-address>:<tag>
   ```

3. Push the tagged image to the internal registry of your offline environments:

   ```shell
   docker push <private-registry-image-address:tag>
   ```

   **Note:** Automatic updates to the `must-gather` image are not supported in an offline environment. Repeat the previous steps frequently to ensure you are gathering logs with the most recent image.
4. Clone the Git repository `ibm-event-automation` as follows:

   ```shell
   git clone https://github.com/IBM/ibm-event-automation
   ```

5. Log in to your cluster as a cluster administrator by setting your [`kubectl` context](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/){:target="_blank"} or by using the [`oc` CLI](https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html#cli-logging-in_cli-developer-commands){:target="_blank"} (`oc login`) on {{site.data.reuse.openshift_short}}.

6. Change directory to the `/support` folder of the cloned repository.

7. Run the `./ibm-events-must-gather` script to capture the relevant logs:

   ```shell
   ./ibm-events-must-gather -n <instance-namespace> [--es-namespace <eventstreams-instance-namespace>  --eem-namespace <event-endpoint-management-instance-namespace> --ep-namespace <event-processing-instance-namespace>] -m <gather-modules> -i <image-address>
   ```

   - For example, to gather logs for {{site.data.reuse.es_name}}, run the following command:

      ```shell
      ./ibm-events-must-gather -n samplenamespace -m eventstreams 
      ```

   - For example, to gather logs for {{site.data.reuse.eem_name}}, run the following command:

      ```shell
      ./ibm-events-must-gather -n samplenamespace -m eem
      ```

   - For example, to gather logs for {{site.data.reuse.ep_name}}, run the following command:

      ```shell
      ./ibm-events-must-gather -n samplenamespace -m eventprocessing
      ```

   - For example, to gather logs for {{site.data.reuse.flink_long}}, run the following command:

     ```shell
     ./ibm-events-must-gather -n samplenamespace -m flink
     ```

   Where:

   - `<gather-modules>` is a comma separated list of [modules](#gather-modules), where valid values are `eventstreams`, `kafka`, `eem`, `eventprocessing`, `schema`, `failure`, `overview` and `system`.
   - `<image-address>` is the cluster accessible location where you have pushed the `must-gather` image (see step 3).
   - `<instance-namespace>` is the namespace where your capability instance is installed, and where the script gathers log data from.  


   **Note:** If you are running in an offline environment and need to specify your internal registry as the image location, run the command as follows:

   ```shell
   ./ibm-events-must-gather -n samplenamespace -m eventstreams -i <image-address> --mustgather-namespace <mustgather-namespace> --image-pull-secret <image-pull-secret-name>
   ```

   Where:
   - `<image-address>` is the address of the image to use for gathering logs. If you are running on the {{site.data.reuse.openshift_short}} and have defined a repository in `ImageContentSourcePolicies`, you do not need to provide `<image-address>`.
   - `<mustgather-namespace>` is the namespace where you want to run the script for gathering logs.
   - `<image-pull-secret-name>` is the name of the secret that enables the `must-gather` image to be pulled from your internal registry. If you are running on the {{site.data.reuse.openshift_short}} and have specified credentials for pulling images in the global `pull-secret` in the `openshift-config` namespace, `--image-pull-secret <image-pull-secret-name>` is not required because the credentials for pulling the image are already available in the global `pull-secret`. 
  
      If specifying more than one of `eventstreams`, `eem`, `eventprocessing`, and `flink` modules, individual namespace flags must be used:
        - `--es-namespace` specifies the namespace containing the {{site.data.reuse.es_name}} instance to gather data from.
        - `--eem-namespace` specifies the namespace containing the {{site.data.reuse.eem_name}} instance to gather data from.
        - `--ep-namespace` specifies the namespace containing the {{site.data.reuse.ep_name}} instance to gather data from.
        - `--flink-namespace` specifies the namespace containing the {{site.data.reuse.flink_long}} instance to gather data from.

The logs gathered are stored in an archive file called `ibm-events-must-gather-<timestamp>.tar.gz`, which is added to the current working directory.

## Gather modules

See the following table for information about the modules that are supported by the gather script and the components it can run on:

| Module            | Description                                                                                                       | For use with components        |
|-------------------|-------------------------------------------------------------------------------------------------------------------|--------------------------------|
| `eventstreams`    | Gathers logs relating to instances of {{site.data.reuse.es_name}} and the {{site.data.reuse.es_name}} operator.   | {{site.data.reuse.es_name}}    |
| `kafka`           | Gathers internal information about the Kafka environment.                                                         | {{site.data.reuse.es_name}}    |
| `schema`          | Gathers internal information about the Schema Registry.                                                           | {{site.data.reuse.es_name}}    |
| `eem`             | Gathers logs relating to instances of {{site.data.reuse.eem_name}} and the {{site.data.reuse.eem_name}} operator. | {{site.data.reuse.eem_name}}   |
| `eventprocessing` | Gathers logs relating to instances of {{site.data.reuse.ep_name}} and the {{site.data.reuse.ep_name}} operator.   | {{site.data.reuse.ep_name}}    |
| `flink`           | Gathers logs relating to your {{site.data.reuse.flink_long}} and the Flink instances it manages.                  | {{site.data.reuse.flink_long}} |
| `failure`         | Gathers logs relating to unhealthy Kubernetes objects on the cluster.                                             | All                            |
| `overview`        | Gathers general information about the cluster environment.                                                        | All                            |
| `system`          | Gathers information about the system, resource usage, and the network.                                            | All                            |

## Additional information

If your issues relate to running flows in {{site.data.reuse.ep_name}}, it is also helpful to provide IBM Support with a copy of the relevant flows. You can do this by [exporting the flows to SQL](../../ep/advanced/exporting-flows#exporting-flows) and including the SQL files with the logs that you return.
