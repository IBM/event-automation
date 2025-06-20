---
title: "Monitoring deployment health"
excerpt: "Understand the health of your deployment at a glance, and learn how to find information about problems."
categories: administering
slug: deployment-health
toc: true
---

Understand the health of your {{site.data.reuse.es_name}} deployment at a glance, and learn how to find information about problems.

![Event Streams metrics architecture]({{ 'images' | relative_url }}/architectures/previous/ibm-event-automation-diagrams-es-metrics.svg "Diagram showing the architecture of the Event Streams metrics as part of IBM Event Automation.")

## Checking {{site.data.reuse.es_name}} health

### Using the {{site.data.reuse.es_name}} UI

The {{site.data.reuse.es_name}} UI provides information about the health of your environment at a glance. In the bottom right corner of the UI, a message shows a summary status of the system health. If there are no issues, the message states **System is healthy**.

If any of the {{site.data.reuse.es_name}} resources experience problems, the message states **component isn't ready**.
If any of the components are not ready for an extended period of time, see how you can troubleshoot as described in [debugging](#debugging).

### Using the CLI

You can check the health of your {{site.data.reuse.es_name}} environment using the Kubernetes command-line tool (`kubectl`).

1. {{site.data.reuse.cncf_cli_login}}
2. To check the status and readiness of the pods, run the following command, where `<namespace>` is where your {{site.data.reuse.es_name}} instance is installed:

   ```shell
   kubectl -n <namespace> get pods
   ```

   The command lists the pods together with simple status information for each pod.

If any of the components are not ready for an extended period of time, check the [debugging topic](#debugging).

## Debugging

### Using the {{site.data.reuse.openshift_short}} UI

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator}}
4. {{site.data.reuse.task_openshift_select_instance}}
5. Click on the **Resources** tab.
6. To filter only pods, deselect all resource types with the exception of **Pod**.
7. Click the pod _not_ in the **Running** state to display information regarding the pod.
8. In the **Overview**, resource usage, such as CPU and memory, can be viewed.
   ![Example pod overview]({{ 'images' | relative_url }}/pod_overview.png "Example screen capture showing pod details with graphs for memory and CPU usage"){:height="100%" width="100%"}
9. Click on the **Logs** tab to search logs.

**Tip:** You can also use the [cluster logging](https://docs.openshift.com/container-platform/4.16/observability/logging/cluster-logging.html){:target="_blank"} provided by the {{site.data.reuse.openshift_short}} to collect, store, and visualize logs. The cluster logging components are based upon Elasticsearch, Fluentd, and Kibana (EFK). You can download and install the pre-configured {{site.data.reuse.es_name}} Kibana dashboards by following the instructions in [monitoring cluster health](../cluster-health/).

### Using the CLI

1. To retrieve further details about the pods, including events affecting them, use the following command:

   ```shell
   kubectl -n <namespace> describe pod <pod-name>
   ```

2. To retrieve detailed log data for a pod to help analyze problems, use the following command:

   ```shell
   kubectl -n <namespace> logs <pod-name> -c <container_name>
   ```

For more information about debugging, see the [Kubernetes documentation](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application-introspection/#using-kubectl-describe-pod-to-fetch-details-about-pods){:target="_blank"}.

**Note:** After a component restarts, the `kubectl` command retrieves the logs for the new instance of the container. To retrieve the logs for a previous instance of the container, add the `-–previous` option to the `kubectl logs` command.
