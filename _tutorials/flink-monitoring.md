---
title: "Monitoring Flink with Prometheus and Grafana"
description: "Find out how to monitor Flink with Prometheus and setup Grafana."
permalink: /tutorials/flink-monitoring/
section: "Tutorials for Event Processing"
cardType: "large"
toc: true
order: 12
---

Prometheus and Grafana can be used to monitor a Flink instance by showing key metrics on dashboards and setting up alerts that trigger when the cluster is not functioning normally. Monitoring Flink is essential for ensuring the stability, performance, and reliability of Flink jobs.

To set up Prometheus for your Flink instance and visualize the collected metrics in Grafana dashboards, complete the following tasks as described in the following sections:

1. Integrate Flink with Prometheus.
2. Install and configure Grafana with Prometheus.

## Integrating Flink with Prometheus

Before you can configure Grafana dashboards to view the metrics, integrate your Flink instance with Prometheus as follows.

1. Ensure you have [installed]({{ 'ep/installing/installing/#installing-the-ibm-operator-for-apache-flink' | relative_url }}) the {{site.data.reuse.flink_long}} on the {{site.data.reuse.openshift}}. Also ensure you have installed the Prometheus stack on your cluster by using the `kube-prometheus` project. For more information, see the [kube-prometheus GitHub repository](https://github.com/prometheus-operator/kube-prometheus){:target="_blank"}.

2. Create the following ConfigMap in the `openshift-monitoring` namespace if it does not yet exist. If a ConfigMap already exist, ensure that the configuration is similar to the following:


    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: cluster-monitoring-config
      namespace: openshift-monitoring
    data:
      config.yaml: |
        enableUserWorkload: true
    ```

3. Change the existing `FlinkDeployment` to include the following metrics parameters:

    ```yaml
    spec:
      flinkConfiguration:
        metrics.reporter.prom.class: org.apache.flink.metrics.prometheus.PrometheusReporter
        metrics.reporter.prom.factory.class: org.apache.flink.metrics.prometheus.PrometheusReporterFactory
        metrics.reporter.prom.port: 9250-9260
        metrics.reporters: prom
        taskmanager.network.detailed-metrics: true
    ```

   **Important:** The `FlinkDeployment` must be deployed in the namespace where the Flink operator is installed.

4. Deploy the `PodMonitor` resource in the same namespace where `FlinkDeployment` instance is deployed:

    ```yaml
    apiVersion: monitoring.coreos.com/v1
    kind: PodMonitor
    metadata:
      labels:
        release: prometheus
      name: flink-pod-monitor
    spec:
      namespaceSelector:
        matchNames:
          - <your-namepace>
      podMetricsEndpoints:
        - path: /
          relabelings:
            - action: replace
              replacement: '$1:9250'
              sourceLabels:
                - __meta_kubernetes_pod_ip
              targetLabel: __address__
      selector:
        matchLabels:
          type: flink-native-kubernetes
    ```

    **Important:** Replace `<your-namespace>` with the name of the namespace where your `FlinkDeployment` instance is deployed.

The metrics sent by Flink to Prometheus are now visible in OpenShift Container Platform. To verify that the data is being made available, ensure that the data is visible by clicking **Observe > Metrics**.

## Install and configure Grafana with Prometheus metrics

### Prerequisites

Ensure you have the following set up:

- The {{site.data.reuse.flink_long}} [installed]({{ 'ep/installing/installing/#installing-the-ibm-operator-for-apache-flink' | relative_url }}).
- The [integration of Flink with Prometheus](#integrating-flink-with-prometheus) completed.

### Installing Grafana

Install the Grafana operator and instance in the `openshift-user-workload-monitoring` namespace, and configuring the Grafana service account as described in the following sections.


#### Installing the Grafana operator

To install the operator by using the {{site.data.reuse.openshift_short}} web console, do the following:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Operators** dropdown and select **OperatorHub** to open the **OperatorHub** dashboard.
3. Select the project you want to deploy the {{site.data.reuse.short_name}} instance in.
4. In the **All Items** search box enter `Grafana` to locate the operator title.
5. Click the **Grafana Operator provided by Red Hat** tile to open the install side panel.
6. Click the **Install** button to open the **Create Operator Subscription** dashboard.
7. Select the installation mode as **A specific namespace on the cluster**, select the target namespace as `openshift-user-workload-monitoring`.
8. Click **Subscribe** to begin the installation.

   The installation can take a few minutes to complete.

#### Installing a Grafana instance

To install a Grafana instance through the {{site.data.reuse.openshift_short}} web console, do the following:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. Expand the **Project** dropdown and select the project where you installed Grafana operator.

   **Note:** If the operator is not shown, it is either not installed or not available for the selected namespace.
4. In the **Operator Details** dashboard, click the **Grafana** tab.
5. Click the **Create Grafana** button to open the **Create Grafana** panel. You can use this panel to define an `Grafana` custom resource.
6. In the **YAML view**, add the following YAML:

    ```yaml
    apiVersion: integreatly.org/v1alpha1
    kind: Grafana
    metadata:
      name: example-grafana
      namespace: test01
    spec:
      config:
        auth:
          disable_signout_menu: true
        auth.anonymous:
          enabled: true
        log:
          level: warn
          mode: console
        security:
          admin_password: secret
          admin_user: root
      ```

7. Click **Create**.

#### Configuring the Grafana service account
To configure the Grafana service account, do the following:
1. {{site.data.reuse.openshift_cli_login}}
2. Configure role-based access control (RBAC) for the Grafana service account:

    ```shell
    oc adm policy add-cluster-role-to-user cluster-monitoring-view -z grafana-serviceaccount -n openshift-user-workload-monitoring
    ```

3. The bearer API token for this service account is used to authenticate access to Prometheus in the `openshift-user-workload-monitoring` namespace. The following command will display this token.

   ```shell
   oc serviceaccounts get-token grafana-serviceaccount -n openshift-user-workload-monitoring
   ```

   For new clusters in OpenShift 4.11 and above, a service account token secret can be created as follows:

    ```shell
    oc create token grafana-serviceaccount --duration=8760h -n openshift-user-workload-monitoring
    ```

   Alternatively, In the OpenShift web console, expand the `grafana-serviceaccount` service account in the `openshift-user-workload-monitoring` namespace and copy the bearer API token from the secret. This bearer API token will be used in the following sections.

### Configuring a Grafana data source

Create and configure a Grafana data source for Prometheus to integrate the Grafana with Prometheus. To create a Grafana data source, complete the following steps.

1. Get the Prometheus API URL by running the following command:

    ```sh
    oc get route -n openshift-monitoring
    ```

2. Create a `GrafanaDataSource` custom resource in the namespace `openshift-user-workload-monitoring`:

    ```yaml
    apiVersion: integreatly.org/v1alpha1
    kind: GrafanaDataSource
    metadata:
      name: prometheus-grafanadatasource
      namespace: openshift-user-workload-monitoring
    spec:
      datasources:
      - access: proxy
        editable: true
        isDefault: true
        jsonData:
          httpHeaderName1: 'Authorization'
          timeInterval: 5s
          tlsSkipVerify: true
        name: Prometheus
        secureJsonData:
          httpHeaderValue1: 'Bearer <token>'
        type: prometheus
        url: '<prometheus-thanos-querier-url>'
      name: prometheus-grafanadatasource.yaml
    ```

   Where `<token>` is the bearer API token that you obtained earlier, and `<prometheus-thanos-querier-url>` is the Prometheus API URL.

3. Create a route by running the following command:

   ```shell
   oc expose svc/grafana-service -n openshift-user-workload-monitoring
   ```

4. Retrieve the Grafana credentials from the `grafana-admin-credentials` secret in the `openshift-user-workload-monitoring` namespace.

5. In the OpenShift web console, go to **Workload > Networking > Routes** and get the Grafana URL.

You can use this Grafana URL to create dashboards.

## Access the Prometheus instance from an external Grafana instance

If you have configured an external Grafana instance and want to access your Prometheus instance from the external Grafana instance, complete the following steps.

### Prerequisites

Ensure you have the following set up:

- Ensure you have [installed]({{ 'ep/installing/installing/#installing-the-ibm-operator-for-apache-flink' | relative_url }}) the {{site.data.reuse.flink_long}} on the {{site.data.reuse.openshift}}. Also ensure you have installed the Prometheus stack on your cluster by using the `kube-prometheus` project. For more information, see the [kube-prometheus GitHub repository](https://github.com/prometheus-operator/kube-prometheus){:target="_blank"}.
- [Integration of Flink with Prometheus](#integrating-flink-with-prometheus) is completed. 


### Configuring integration between external Grafana and Prometheus

To enable a cluster to be monitored by an external Grafana, configure the cluster as follows.

1. {{site.data.reuse.openshift_ui_login}}
2. Create a service account for Grafana in the **openshift-user-workload-monitoring** namespace.

    ```shell
    oc create serviceaccount grafana-serviceaccount -n openshift-user-workload-monitoring
    ```

3. In the same namespace, add the **cluster-monitoring-view** role to the Grafana service account.

    ```shell
    oc adm policy add-cluster-role-to-user cluster-monitoring-view -z grafana-serviceaccount -n openshift-user-workload-monitoring
    ```

4. Go to the **openshift-monitoring** namespace, search `thanos-querier`, and obtain the endpoint URL.

5. Obtain the Grafana service account token that is used in the configuration of the external Grafana data source:

    ```shell
    oc sa get-token grafana-serviceaccount -n openshift-user-workload-monitoring
    ```

6. Log in to Grafana and in the **Settings > Data Sources**, create a new Grafana data source (or change the existing prometheus data source).

7. In the **HTTP** section, paste the endpoint URL that is obtained from step 3.

8. If you are using self-signed certificates, enable the **Skip TLS Verify** flag in the **Auth** section.

9. In the **Custom HTTP Headers** section, add a header called `Authorization` and in the **Value** field, enter **Bearer `<token>`**, where `<token>` is the bearer API token you obtained earlier.

10. Click **Save & test**.

Grafana data source is configured and you can create dashboards based on your requirement.

## Creating a dashboard

Follow the instructions in the [Grafana documentation](https://grafana.com/docs/grafana/latest/getting-started/build-first-dashboard/#create-a-dashboard){:target="_blank"} to create a dashboard.

![Dashboard example of Grafana.]({{ 'images' | relative_url }}/Flink_grafana.png "Diagram that shows the dashboard for Grafana with Flink"){:height=“100%” width=“100%“}
