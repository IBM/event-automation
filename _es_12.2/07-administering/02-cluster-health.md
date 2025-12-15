---
title: "Monitoring Kafka cluster health"
excerpt: "Understand the health of your Kafka cluster at a glance."
categories: administering
slug: cluster-health
toc: true
---

Monitoring the health of your Kafka cluster helps to verify that your operations are running smoothly. The {{site.data.reuse.es_name}} UI includes a [preconfigured dashboard](#viewing-the-preconfigured-dashboard) that monitors Kafka data.

{{site.data.reuse.es_name}} also provides a number of ways to export metrics from your Kafka brokers to external monitoring and logging applications. These metrics are useful indicators of the health of the cluster, and can provide warnings of potential problems. You can use any monitoring solution that is compatible with Prometheus and JMX formats to collect, store, visualize, and set up alerts based on metrics provided by {{site.data.reuse.es_name}}. The following sections provide an overview of the available options.

For information about the health of your topics, check the [producer activity](../topic-health/) dashboard.

## JMX Exporter
{: #jmx-exporter}

You can use {{site.data.reuse.es_name}} to collect JMX metrics from Kafka brokers, Kafka controller nodes, and Kafka Connect nodes, and export them to Prometheus.

For an example of how to configure the JMX exporter, see [configuring the JMX Exporter](../../installing/configuring#configuring-the-jmx-exporter).

## Kafka Exporter
{: #kafka-exporter}

You can use {{site.data.reuse.es_name}} to export Kafka metrics to Prometheus. These metrics are otherwise only accessible through the Kafka command-line tools. This allows topic metrics such as consumer group lag to be collected.

For an example of how to configure a Kafka Exporter, see [configuring the Kafka Exporter](../../installing/configuring#configuring-the-kafka-exporter).

## Grafana
{: #grafana}

You can use [Grafana](https://grafana.com/docs/grafana/latest/){:target="_blank"} and configure the example [Grafana dashboards](http://ibm.biz/es-grafana-dashboards){:target="_blank"} to monitor the health and performance of your Kafka clusters by collecting and displaying metrics from Prometheus.

## Kibana
{: #kibana}

You can use Kibana on OpenShift and other Kubernetes platforms, where it might also be included, or you can install Kibana externally. You can use the example [Kibana dashboards](https://github.com/IBM/ibm-event-automation/tree/master/event-streams/kibana-dashboards){:target="_blank"} to monitor for specific errors in the logs and set up alerts for when a number of errors occur over a period of time in your {{site.data.reuse.es_name}} instance.

To install the {{site.data.reuse.es_name}} Kibana dashboards, download the JSON file that includes the example Kibana dashboards for {{site.data.reuse.es_name}} from [GitHub](https://github.com/IBM/ibm-event-automation/tree/master/event-streams/kibana-dashboards){:target="_blank"}, and configure your dashboard based on your platform.

## IBM Instana
{: #ibm-instana}

Instana is an observability tool that can be used to monitor your {{site.data.reuse.es_name}} deployment.

Instana also offers [Kafka-centric monitoring](https://www.instana.com/supported-technologies/apache-kafka-observability/){:target="_blank"} that can provide useful insights into the performance and the health of your Kafka cluster.

For information about installing and configuring an Instana host agent on the {{site.data.reuse.openshift}}, see the [Instana documentation for OpenShift](https://www.ibm.com/docs/en/instana-observability/current?topic=requirements-installing-host-agent-openshift){:target="_blank"}. To use Instana on other Kubernetes platforms, see the [Instana documentation for Kubernetes](https://www.ibm.com/docs/en/instana-observability/current?topic=requirements-installing-host-agent-kubernetes){:target="_blank"}.

After installing, Instana can monitor all aspects of an {{site.data.reuse.es_name}} instance with no extra configuration required.

**Note**: You might receive the following error message in the Instana dashboards when you check monitoring metrics for the {{site.data.reuse.es_name}} UI container:

```shell
Monitoring issue: nodejs_collector_not_installed

The @instana/collector package is not installed in this Node.js application, or the @instana/collector package cannot announce itself to the host agent, for example due to networking issues.
```

If you require monitoring of the {{site.data.reuse.es_name}} UI, you can enable Instana to monitor the UI by setting the following in the `EventStreams` custom resource:

```yaml
apiVersion: eventstreams.ibm.com/v1beta2
kind: EventStreams
# ...
spec:
# ...
adminUI:
   env:
   -  name: INSTANA_AGENT_HOST
      valueFrom:
            fieldRef:
               fieldPath: status.hostIP
```

## Other Monitoring Tools
{: #other-monitoring-tools}

You can also use [external monitoring tools](../external-monitoring/) to monitor the deployed {{site.data.reuse.es_name}} Kafka cluster.

## Viewing the preconfigured dashboard
{: #viewing-the-preconfigured-dashboard}

To get an overview of the cluster health, you can view a selection of metrics on the {{site.data.reuse.es_name}} **Monitoring** dashboard.

**Important:** Ensure that you [enable the **Monitoring** dashboard](../../installing/post-installation/#enabling-metrics) before accessing the dashboard.

1. {{site.data.reuse.es_ui_login}}
2. Click **Monitoring** in the primary navigation. A dashboard is displayed with overview charts for messages, partitions, and replicas.
3. Select **1 hour**, **1 day**, **1 week**, or **1 month** to view data for different time periods.
