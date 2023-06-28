---
title: "Monitoring Event Streams cluster health with Prometheus and Grafana"
description: "Set up Prometheus to monitor your Event Streams installations and visualize the data through Grafana."
permalink: /tutorials/monitor-es-using-prometheus/
toc: true
section: "Tutorials for Event Streams"
cardType: "large"
---


Prometheus and Grafana can be used to monitor an {{site.data.reuse.es_name}} instance by showing key metrics on dashboards and setting up alerts that trigger when the cluster is not functioning normally. Metrics are available for each of the Kafka and Zookeeper components of {{site.data.reuse.es_name}}. 

You can configure Prometheus with a set of rules for Kafka and ZooKeeper metrics. These rules govern how Prometheus consumes key metrics from Kafka and ZooKeeper pods. You can then view the metrics in dashboards that are provided by Grafana.

## Prerequisites

- Ensure you have an {{site.data.reuse.es_name}} installation available. This tutorial is based on {{site.data.reuse.es_name}} version 11.2.0.
- Ensure you have the Prometheus stack that is installed on the cluster by using the `kube-prometheus` project. For more information, see the [kube-prometheus GitHub repository](https://github.com/prometheus-operator/kube-prometheus){:target="_blank"}.

## Setting up Prometheus to monitoring {{site.data.reuse.es_name}}
To set up Prometheus for your {{site.data.reuse.es_name}} instance and visualize the collected metrics in Grafana dashboards, complete the following main tasks as described in the following sections:
1.  Configure {{site.data.reuse.es_name}} to expose metrics
2.  Connect Prometheus to {{site.data.reuse.es_name}}
3.  Enable the Grafana dashboard

### Configuring {{site.data.reuse.es_name}} to expose metrics
You can configure {{site.data.reuse.es_name}} to expose JMX metrics from Kafka and ZooKeeper pods. You can do this by referencing a ConfigMap that defines the rules for the JMX metrics for each component.

To enable the collection of JMX metrics from an {{site.data.reuse.es_name}} instance, set the value of `spec.strimziOverrides.kafka.metricsConfig.type` and `spec.strimziOverrides.zookeeper.metricsConfig.type` to `jmxPrometheusExporter`, and set the `valueFrom` field to refer to the appropriate data within the`metrics-config` ConfigMap, for example:
``` yaml
  apiVersion: eventstreams.ibm.com/v1beta1
  kind: EventStreams
  # ...
  spec:
  # ...
    strimziOverrides:
        kafka:
          metricsConfig:
            type: jmxPrometheusExporter
            valueFrom:
              configMapRef:
                key: kafka-metrics-config.yaml
                name: metrics-config
        # ...
        zookeepers:
            metricsConfig:
                type: jmxPrometheusExporter
                valueFrom:
                    configMapRef:
                        key: zookeeper-metrics-config.yaml
                        name: metrics-config
        # ...
```    

A ConfigMap is used by {{site.data.reuse.es_name}}  to set up the rules for the metrics that Prometheus can obtain from Kafka and ZooKeeper pods. The following is the default metrics configuration provided by {{site.data.reuse.es_name}}:

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: metrics-config
data:
  kafka-metrics-config.yaml: |
    lowercaseOutputName: true
    rules:
    - attrNameSnakeCase: false
      name: kafka_controller_$1_$2_$3
      pattern: kafka.controller<type=(\w+), name=(\w+)><>(Count|Value|Mean)
    - attrNameSnakeCase: false
      name: kafka_server_BrokerTopicMetrics_$1_$2
      pattern: kafka.server<type=BrokerTopicMetrics, name=(BytesInPerSec|BytesOutPerSec)><>(Count)
    - attrNameSnakeCase: false
      name: kafka_server_BrokerTopicMetrics_$1__alltopics_$2
      pattern: kafka.server<type=BrokerTopicMetrics, name=(BytesInPerSec|BytesOutPerSec)><>(OneMinuteRate)
    - attrNameSnakeCase: false
      name: kafka_server_ReplicaManager_$1_$2
      pattern: kafka.server<type=ReplicaManager, name=(\w+)><>(Value)
  zookeeper-metrics-config.yaml: |
    lowercaseOutputName: true
    rules: [] 
```

To verify that the data is being made available, expose the `<instance>-kafka-brokers` service or the `<instance>-zookeeper-nodes` service by using the following command:
```
kubectl port-forward svc/<instance-name>-kafka-brokers 9404
```
Go to `localhost:9404` in your browser to display all the metrics data. To view this data in a more insightful format, configure Prometheus and Grafana to provide dashboards for monitoring your {{site.data.reuse.es_name}} instance as described later. 

### Connecting Prometheus to {{site.data.reuse.es_name}}

Prometheus scrapes metrics data from components in Kubernetes by using either a pod monitor or a service monitor.

- A pod monitor gathers the data from a component by directly contacting the pod that is exposing metrics. This is an unencrypted connection within the cluster.
- A service monitor monitors a service that the pod is pushing metrics to, and this provides an encrypted connection between Prometheus and the component being monitored.

By default, {{site.data.reuse.es_name}} creates the following services to expose metrics:
- The Kafka metrics are exposed by the service called `<instance-name>-kafka-brokers` on port 9404.
- The Zookeeper metrics are exposed by the service called `<instance-name>-zookeeper-nodes` on port 9404.

Create a `ServiceMonitor` custom resource for each of these services as shown in the following examples. These use the selector field to specify which service is being targeted by the labels that are present.   

The following `ServiceMonitor` selects the `<instance-name>-kafka-brokers` service:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: <instance-name>-ibm-es-kafka
  namespace: <instance-namespace>
spec:
  endpoints:
    - port: tcp-prometheus
      scheme: http
  selector:
    matchLabels:
      app.kubernetes.io/instance: <instance-name>
      app.kubernetes.io/name: kafka
      prometheus-jmx-metrics: enabled
  targetLabels:
    - eventstreams.ibm.com/cluster
```  

The following `ServiceMonitor` selects the `<instance-name>-zookeeper-nodes` service:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: <instance-name>-ibm-es-zookeeper
  namespace: <instance-namespace>
spec:
  endpoints:
    - port: tcp-prometheus
      scheme: http
  selector:
    matchLabels:
      app.kubernetes.io/instance: <instance-name>
      app.kubernetes.io/name: zookeeper
      prometheus-jmx-metrics: enabled
  targetLabels:
    - eventstreams.ibm.com/cluster
``` 

To verify that Prometheus is scraping the metrics data from these services, you can expose the `prometheus-operated` service on port `9090` as follows:
```
kubectl port-forward  -n  monitoring svc/prometheus-operated 9090
``` 
Go to `localhost:9090` in your browser and view the **Targets** page under the **Status** heading to see whether the intended metrics targets have been found. 

**Note:** If the metrics targets do not display in the Prometheus UI, you might need to add role and rolebinding permissions in the namespace where your {{site.data.reuse.es_name}} instance is installed to allow the Prometheus instance to scrape the metrics data.

Create a `Role` custom resource to provide the permissions required by Prometheus, as shown in the following example:

```
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  labels:
    app.kubernetes.io/component: prometheus
    app.kubernetes.io/instance: k8s
    app.kubernetes.io/name: prometheus
  name: prometheus-k8s
  namespace: <instance-namespace>
rules:
- apiGroups:
  - ""
  resources:
  - services
  - endpoints
  - pods
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - extensions
  resources:
  - ingresses
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - networking.k8s.io
  resources:
  - ingresses
  verbs:
  - get
  - list
  - watch
```

Create a `RoleBinding` custom resource to link the role to the Prometheus service account, as shown in the following example:

```
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  labels:
    app.kubernetes.io/component: prometheus
    app.kubernetes.io/instance: k8s
    app.kubernetes.io/name: prometheus
  name: prometheus-k8s
  namespace: <instance-namespace>
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: prometheus-k8s
subjects:
- kind: ServiceAccount
  name: prometheus-k8s
  namespace: <prometheus-namespace>
```

You can view individual graphs of the data collected in the **Graph** tab of the Prometheus UI. For a complete overview of your cluster's health, you can use Grafana to combine individual statistics and graphs, and display them in dashboards.


## Enabling Grafana dashboards

Grafana is included in the `kube-prometheus` stack. To access the Grafana UI, expose the `grafana` service on port `3000`:
```
kubectl port-forward -n monitoring svc/grafana 3000
```
Go to `localhost:3000` in your browser to access the Grafana UI, and [set up Prometheus as a datasource](https://grafana.com/docs/grafana/latest/datasources/add-a-data-source/){:target="_blank"}.

To configure the {{site.data.reuse.es_name}} dashboard:
1. Click the dashboard icon in the navigation panel on the left.
2. Click **New** and select **+ Import**.
3. Import the dashboard JSON file named `ibm-eventstreams-kafka.json` from the `grafana-dashboards` directory in the [{{site.data.reuse.es_name}} samples](https://ibm.biz/ea-es-samples){:target="_blank"}.

Your dashboard will provide a view similar to the following example:

![Example Grafana dashboard]({{ 'images' | relative_url }}/grafana_dashboard.png "Example Grafana dashboard"){:height="100%" width="100%"}
