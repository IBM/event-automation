---
title: "Upgrading and migrating"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.es_name}} operator and operand instances as follows.

## Upgrade paths

Upgrade to {{site.data.reuse.es_name}} 11.0.x by following these supported upgrade paths.

### Upgrade paths for EUS releases

You can upgrade to the {{site.data.reuse.es_name}} CD release 11.0.4 from the latest version of the Extended Update Support (EUS) update channel. The latest operator and operand version of the EUS release ensures that you have the updates to enable upgrading to the CD release. 

Before you upgrade to the CD release, [upgrade]({{'es/es_10.2/installing/upgrading/' | relative_url}}) your {{site.data.reuse.es_name}} EUS release to the following versions:
- Earlier operator versions must be upgraded to `2.2.6`.
- Earlier operand versions must be upgraded to `10.2.1-eus`.

### Upgrade paths for CD releases

The following upgrade paths are available for Continuous Delivery (CD) releases (2.x operators and 10.x operands and later, except for 2.2.x operators and 10.2.x operands):
- You can upgrade the {{site.data.reuse.es_name}} operator to the 3.0.5 version directly from versions 3.0.x, 2.5.x, and 2.4.x. Earlier operator versions must be upgraded to 2.4.0 before upgrading to 3.0.5.
- You can upgrade the {{site.data.reuse.es_name}} operand to the 11.0.4 version directly from versions 11.0.x, 10.5.x, and 10.4.x. Earlier operand versions must be upgraded [to 10.4.0]({{ 'es/es_10.4' | relative_url }}/installing/upgrading/) before upgrading to 11.0.4.


## Prerequisites

- Ensure you have followed the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2022.2?topic=upgrading){:target="_blank"} before upgrading {{site.data.reuse.es_name}}.

   **Note:** If you upgrade your Red Hat OpenShift version before upgrading your {{site.data.reuse.es_name}} operator version, the {{site.data.reuse.es_name}} operand might display a `Failed` status temporarily. This will be resolved when you upgrade your operator and then the operand version, the next steps in the upgrade process.

- The images for {{site.data.reuse.es_name}} release 11.0.x are available in the IBM Cloud Container Registry. Ensure you redirect your catalog source to use `icr.io/cpopen` as described in [Implementing ImageContentSourcePolicy to redirect to the IBM Container Registry](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=clusters-migrating-from-docker-container-registry#implementing-imagecontentsourcepolicy-to-redirect-to-the ibm-container-registry){:target="_blank"}.


- To upgrade successfully, your {{site.data.reuse.es_name}} instance must have more than one ZooKeeper node or have persistent storage enabled. If you upgrade an {{site.data.reuse.es_name}} instance with a single ZooKeeper node that has ephemeral storage, all messages and all topics will be lost and both ZooKeeper and Kafka pods will move to an error state. To avoid this issue, increase the number of ZooKeeper nodes before upgrading as follows:

   ```
   apiVersion: eventstreams.ibm.com/v1beta1
   kind: EventStreams
   metadata:
     name: example-pre-upgrade
     namespace: myproject
   spec:
     strimziOverrides:
       zookeeper:
         replicas: 3
   ```

- If you have an {{site.data.reuse.es_name}} 11.0.3 or earlier installation, and you previously added your own Kafka or Zookeeper metrics rules, then ensure you record these elsewhere to be added to the `metrics-config` ConfigMap [after upgrading](#update-metrics-rules).
 
**Important:** If you have configured custom certificates on any of the listeners in your {{site.data.reuse.es_name}} custom resource, there will be an outage when you upgrade the operand to any 11.0.x version until you reconfigure your listeners with your custom certificates. This is because the upgrade involves a migration of the listener format, which removes any reference to the custom certificates. To ensure you are prepared to quickly deal with this outage after a successful upgrade, review how you can [reconfigure your custom certificates](#reconfigure-listeners-with-custom-certificates).

## Back up your instance configuration

Before you upgrade, create a backup of your {{site.data.reuse.es_name}} instance configuration by completing the following steps.

If you are using Red Hat OpenShift command-line interface (CLI):

1. {{site.data.reuse.openshift_cli_login}}
2. Run the following command:

   ```shell
   oc get eventstreams <instance-name> -n <namespace> -o yaml > <filename>.yaml
   ```

If you are using the {{site.data.reuse.openshift_short}} web console, complete the following steps:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the row for **{{site.data.reuse.es_name}}** operator and click the **{{site.data.reuse.es_name}}** link in the **Provided APIs** column.
5. Locate the row for **{{site.data.reuse.es_name}}** instance and click the link in the **Name** column.
6. Click the **YAML** tab to display the **configuration details** for the {{site.data.reuse.es_name}} instance.
7. Copy the definition of your {{site.data.reuse.es_name}} instance and save it as a YAML file.

## Upgrading from EUS releases

Before upgrading your EUS release, ensure you:
- Review the guidance in [prerequisites](#prerequisites).
- Create a [back up your instance configuration](#back-up-your-instance-configuration).
- [Upgrade your {{site.data.reuse.icpfs}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2022.2?topic=upgrading-cloud-pak-foundational-services){:target="_blank"} from EUS version 3.6.x to the latest CD version, and then [clean up the monitoring resources](https://www.ibm.com/docs/en/cpfs?topic=issues-monitoring-resources-not-cleaned-up){:target="_blank"}.

### Uninstall the {{site.data.reuse.es_name}} operator 2.2.6

Uninstall the existing version (`2.2.6`) of the {{site.data.reuse.es_name}} operator by using {{site.data.reuse.openshift_short}} web console.

**Important:** The {{site.data.reuse.es_name}} instance continues to run and it's configuration is not deleted. However, {{site.data.reuse.es_name}} instance is not managed by an operator in this state.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** and click **Installed Operators**.
3. In the Project dropdown, select the required namespace. For cluster-wide operators, select the `openshift-operators` project.
6. Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the {{site.data.reuse.es_name}} operator to be deleted to open the actions menu.
7. Click the **Uninstall Operator** menu option to open the confirmation panel.
8. Check the namespace and operator name, then click **Remove** to uninstall the operator.

### Install the {{site.data.reuse.es_name}} operator 3.0.5

After uninstalling the 2.2.6 operator, install the {{site.data.reuse.es_name}} operator 3.0.5 from `v3.0` update channel by using {{site.data.reuse.openshift_short}} web console. The installation can take a few minutes to complete. All {{site.data.reuse.es_name}} pods that need to be updated as part of the upgrade will be gracefully rolled.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Operators** dropdown and select **OperatorHub** to open the **OperatorHub** dashboard.
3. Select the project that you want to deploy the {{site.data.reuse.es_name}} instance in.
4. In the All Items search box, enter `Event Streams` to locate the operator title.
5. Click the **Event Streams** tile to open the installation side panel.
6. Click the **Install** button to open the **Create Operator Subscription** dashboard.
7. Select the `v3.0` update channel and the [installation mode](#choosing-operator-installation-mode) that suits your requirements.
   If the installation mode is **A specific namespace on the cluster**, select the target namespace.
8. Click **Install** to begin the installation and wait for it to complete.

**Important:** The Entity operator might display a `CrashLoopBackOff` error. In addition, some {{site.data.reuse.es_name}} pods might display errors temporarily when the operator version has been updated. You can ignore these errors and continue with upgrading the {{site.data.reuse.es_name}} operand version, which will resolve these errors.

**Note:** The number of containers in each Kafka broker will reduce from 2 to 1 as the TLS-sidecar container will be removed from each broker during the upgrade process.

### Upgrade the {{site.data.reuse.es_name}} operand (instance)

Upgrade the {{site.data.reuse.es_name}} instance from the existing EUS version (`10.2.1-eus`) to the required version `11.0.4`. All {{site.data.reuse.es_name}} pods will gracefully roll again.

If you are using Red Hat OpenShift command-line interface (CLI), run the following command:
```
oc patch eventstreams -n <namespace> <name-of-the-es-instance> --patch '{"spec":{"version":"11.0.4"}}' --type=merge
```

If you are using the {{site.data.reuse.openshift_short}} web console, complete the following steps:

1. Click **Installed Operators** from the navigation on the left to view the list of installed operators, including the upgraded **{{site.data.reuse.es_name}}** operator.
2. Select the **{{site.data.reuse.es_name}}** operator from the list of **Installed Operators**.
3. Click the **{{site.data.reuse.es_name}}** tab. This lists the **{{site.data.reuse.es_name}}** operands.
4. Find your instance in the **Name** column and click the link for the instance.
5. Click the **YAML** tab. The **{{site.data.reuse.es_name}}** instance custom resource is shown.
6. In the YAML, change the `spec.version` field to the required version `11.0.4`.
7. Click the **Save** button.


## Upgrading from CD releases

Ensure you have reviewed the guidance in [prerequisites](#prerequisites) and [back up your instance configuration](#back-up-your-instance-configuration) sections and then follow all the steps that are outlined in this.

### Upgrade the {{site.data.reuse.es_name}} operator

Update the subscription for the {{site.data.reuse.es_name}} operator from the existing CD channel (`v2.4` or `v2.5`) to the required update channel `v3.0`. All {{site.data.reuse.es_name}} pods that need to be updated as part of the upgrade will be gracefully rolled. Where required, ZooKeeper pods roll one at a time, followed by Kafka brokers rolling one at a time.

If you are using Red Hat OpenShift command-line interface (CLI), run the following commands:

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.es_name}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventstreams -o=jsonpath='{.status.channels[*].name}'
   ```

3. Change the subscription to move to the required update channel `v3.0`:

   ```shell
   oc patch subscription -n <namespace> ibm-eventstreams --patch '{"spec":{"channel":"v3.0"}}' --type=merge
   ```

If you are using {{site.data.reuse.openshift_short}} web console, complete the following steps:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.es_name}} instance in the namespace. It is called **{{site.data.reuse.es_name}}** in the **Name** column. Click the **{{site.data.reuse.es_name}}** link in the row.
5. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.es_name}} operator.
6. Click the version number link in the **Update channel** section (for example, **v2.5**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
7. Select **v3.0** and click the **Save** button on the **Change Subscription Update Channel** dialog.

**Important:** The Entity operator might display a `CrashLoopBackOff` error. In addition, some {{site.data.reuse.es_name}} pods might display errors temporarily when the operator version has been updated. You can ignore these errors and continue with upgrading the {{site.data.reuse.es_name}} operand version, which will resolve these errors.

**Note:** The number of containers in each Kafka broker will reduce from 2 to 1 as the TLS-sidecar container will be removed from each broker during the upgrade process.

### Upgrade the {{site.data.reuse.es_name}} operand (instance)

Upgrade the {{site.data.reuse.es_name}} instance from the existing CD version (`10.4.x` or `10.5.x`) to the required version `11.0.4`. All {{site.data.reuse.es_name}} pods will gracefully roll again.

If you are using Red Hat OpenShift command-line interface (CLI), run the following command:

```shell
oc patch eventstreams -n <namespace> <name-of-the-es-instance> --patch '{"spec":{"version":"11.0.4"}}' --type=merge
```

If you are using the {{site.data.reuse.openshift_short}} web console, complete the following steps:

1. Click **Installed Operators** from the navigation on the left to view the list of installed operators, including the upgraded **{{site.data.reuse.es_name}}** operator.
2. Select the **{{site.data.reuse.es_name}}** operator from the list of **Installed Operators**.
3. Click the **{{site.data.reuse.es_name}}** tab. This lists the **{{site.data.reuse.es_name}}** operands.
4. Find your instance in the **Name** column and click the link for the instance.
5. Click the **YAML** tab. The **{{site.data.reuse.es_name}}** instance custom resource is shown.
6. In the YAML, change the `spec.version` field to the required version `11.0.4`.
7. Click the **Save** button.

If you are using the {{site.data.reuse.cp4i}} Platform UI, complete the following steps:

   1. Log in to the {{site.data.reuse.cp4i}} Platform UI.
   2. Click the **Navigation menu** in the upper left.
   3. Expand **Administration** and click **Integration instances**.
      If an update is available for a runtime, the ![Information icon]({{ 'images' | relative_url }}/icon_info.png) **Information icon** displays next to the runtime's current Version number.
   4. Click the ![More options icon]({{ 'images' | relative_url }}/more_options.png "Three vertical dots for the more options icon at end of each row."){:height="30px" width="15px"} **More options** in the row for the {{site.data.reuse.es_name}} instance, and then click **Change version**.
   5. Select **11.0.4** from the **Select a new channel or version** list.
   6. Click **Change version** to save your selections and start the upgrade.
      In the runtimes table, the **Status** column for the runtime displays the `Upgrading` message. The upgrade is complete when the **Status** is `Ready` and the **Version** displays the new version number.


## Verifying the upgrade

1. Wait for all {{site.data.reuse.es_name}} pods to complete the upgrade process. This is indicated by the `Running` state.
2. {{site.data.reuse.openshift_cli_login}}
3. To retrieve a list of {{site.data.reuse.es_name}} instances, run the following command:\\
   `oc get eventstreams -n <namespace>`
4. For the instance of {{site.data.reuse.es_name}} that you upgraded, check that the status returned by the following command is `Ready`.\\
   `oc get eventstreams -n <namespace> <name-of-the-es-instance> -o jsonpath="'{.status.phase}'"`


## Post-upgrade tasks

### Reconfigure listeners with custom certificates

To enable your clients to connect with the upgraded {{site.data.reuse.es_name}} that uses custom certificates, add the certificate configuration again in the new format as follows:

```
      - name: external
        type: route
        port: 9092
        authentication:
          type: scram-sha-512
        tls: true
        configuration:
          brokerCertChainAndKey:
            certificate: my-listener-certificate.crt
            key: my-listener-key.key
            secretName: my-secret
```

### Enable collection of producer metrics

In {{site.data.reuse.es_name}} version 11.0.0 and later, a Kafka Proxy handles gathering metrics from producing applications. The information is displayed in the [**Producers** dashboard](../../administering/topic-health/). The proxy is optional and is not enabled by default. To enable metrics gathering and have the information that is displayed in the dashboard, [enable the Kafka Proxy](../../installing/configuring/#enabling-collection-of-producer-metrics).

### Update metrics rules

If you previously added your own Kafka or Zookeeper metrics rules, then ensure you add these rules again to the `metrics-config` ConfigMap. The rules in the following ConfigMap are the default rules. Add your own custom rules to `data.kafka-metrics-config.yaml.rules:` or `data.zookeeper-metrics-config.yaml.rules:` after the default rules.

If you do not want to export metrics then delete all of the rules in the `metrics-config` ConfigMap.

```
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

### Deprecation warnings for metrics

The `metrics` configuration option for the `EventStreams` custom resource has been deprecated. If you receive deprecation warnings about `spec.kafka.metrics:
{}` or `spec.zookeeper.metrics:{}` after upgrading, then remove the `metrics: {}` line from the `EventStreams` [custom resource]({{ 'es/es_10.5' | relative_url }}/installing/configuring/#configuring-external-monitoring-through-prometheus).

### Enable metrics for monitoring

To display metrics in the monitoring dashboards of the {{site.data.reuse.es_name}} UI, ensure you [enable](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2022.2?topic=administering-enabling-openshift-container-platform-monitoring){:target="_blank"} the {{site.data.reuse.openshift_short}} monitoring stack.
