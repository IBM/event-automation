---
title: "Upgrading"
excerpt: "Upgrade your installation to the latest version."
categories: installing
slug: upgrading
toc: true
---

Upgrade your {{site.data.reuse.es_name}} installation as follows. The {{site.data.reuse.es_name}} operator handles the upgrade of your {{site.data.reuse.es_name}} instance.

## Upgrade paths

You can upgrade {{site.data.reuse.es_name}} to the [latest 11.3.x version]({{ 'support/matrix/#event-streams' | relative_url }}) directly from any 11.2.x version by using operator version 3.3.x. The upgrade procedure depends on whether you are upgrading to a major, minor, or patch level version, and what your catalog source is.

- On OpenShift, you can upgrade to the latest version by using operator channel v3.3. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on OpenShift](#upgrading-on-the-openshift-container-platform).
   
   **Note:** If your operator upgrades are set to automatic, patch level upgrades are completed automatically. This means that the {{site.data.reuse.es_name}} operator is upgraded to the latest 3.3.x version when it is available in the catalog, and your {{site.data.reuse.es_name}} instance is then also automatically upgraded, unless you [set a schedule for the upgrade](#scheduling-the-upgrade-of-an-instance) by pausing the reconciliation.
   
- On other Kubernetes platforms, you must update the Helm repository for any level version update (any digit update: major, minor, or patch), and then upgrade by using the Helm chart. Review the general upgrade [prerequisites](#prerequisites) before following the instructions to [upgrade on other Kubernetes platforms](#upgrading-on-other-kubernetes-platforms-by-using-helm).

## Prerequisites

- The images for {{site.data.reuse.es_name}} release 11.3.x are available in the IBM Cloud Container Registry. Ensure you redirect your catalog source to use `icr.io/cpopen` as described in [Implementing ImageContentSourcePolicy to redirect to the IBM Container Registry](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=clusters-migrating-from-docker-container-registry#implementing-imagecontentsourcepolicy-to-redirect-to-the-ibm-container-registry){:target="_blank"}.

- To upgrade successfully, your {{site.data.reuse.es_name}} instance must have more than one ZooKeeper node or have persistent storage enabled. If you upgrade an {{site.data.reuse.es_name}} instance with a single ZooKeeper node that has ephemeral storage, all messages and all topics will be lost and both ZooKeeper and Kafka pods will move to an error state. To avoid this issue, increase the number of ZooKeeper nodes before upgrading as follows:


   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: EventStreams
   metadata:
     name: example-pre-upgrade
     namespace: myproject
   spec:
     # ...
     strimziOverrides:
       zookeeper:
         replicas: 3
   ```

- If you [installed the {{site.data.reuse.es_name}} operator]({{ 'installpagedivert' | relative_url }}) to manage instances of {{site.data.reuse.es_name}} in any namespace (one per namespace), then you might need to control when each of these instances is upgraded to the latest version. You can control the updates by pausing the reconciliation of the instance configuration as described in the following sections.

- If you are running {{site.data.reuse.es_name}} as part of {{site.data.reuse.cp4i}}, ensure you meet the following requirements:

  - Follow the [upgrade steps for {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=upgrading){:target="_blank"} before upgrading {{site.data.reuse.es_name}}.
  - If you are planning to configure {{site.data.reuse.es_name}} with Keycloak, ensure you have  {{site.data.reuse.cp4i}} 2023.4.1 (operator version 7.2.0) or later [installed](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=installing){:target="_blank"}, including the required dependencies.
  
    **Note:** After upgrading {{site.data.reuse.es_name}} to the latest version, if you are changing authentication type from IAM to Keycloak, modify the `EventStreams` custom resource as described in [post-upgrade tasks](#configure-eventstreams-custom-resource-to-use-keycloak).

**Note:** There is no downtime during the {{site.data.reuse.es_name}} upgrade. The Kafka pods are rolled one at a time, so a Kafka instance will always be present to serve traffic. However, if the number of brokers you have matches the `min.insync.replicas` value set for any of your topics, then that topic will be unavailable to write to while the Kafka pods are rolling.

- If you have overridden the certificates for any of the Kafka listeners by using the `BrokerCertChainAndKey` configuration, you must now [provide the public Certificate Authority (CA) certificates](../configuring/#providing-external-ca-certificates) that were used to sign the overriding certificates.

   Ensure you create the secret containing the external CA certificates before you upgrade to avoid {{site.data.reuse.es_name}} pods going into a failed state during the upgrade.

### Scheduling the upgrade of an instance

In 11.1.x and later, the {{site.data.reuse.es_name}} operator handles the upgrade of your {{site.data.reuse.es_name}} instance automatically after the operator is upgraded. No additional step is required to change the instance (product) version.

If your operator manages more than one instance of {{site.data.reuse.es_name}}, you can control when each instance is upgraded by pausing the reconciliation of the configuration settings for each instance, running the upgrade, and then unpausing the reconciliation when ready to proceed with the upgrade for a selected instance.

#### Pausing reconciliation by using the CLI

  1. {{site.data.reuse.cncf_cli_login}}
  2. To apply the annotation first to the `EventStreams` and then to the `Kafka` custom resource, run the following command, where `<type>` is either `EventStreams` or `Kafka`:

     ```shell
     kubectl annotate <type> <instance-name> -n <instance-namespace> eventstreams.ibm.com/pause-reconciliation='true'
     ```

  3. Follow the steps to [upgrade on OpenShift](#upgrading-on-the-openshift-container-platform).

#### Unpausing reconciliation by using the CLI

To unpause the reconciliation and continue with the upgrade of an {{site.data.reuse.es_name}} instance, run the following command to first remove the annotations from the `Kafka` custom resource, and then from the `EventStreams` custom resource, where `<type>` is either `Kafka` or `EventStreams`:

```shell
kubectl annotate <type> <instance-name> -n <instance-namespace> eventstreams.ibm.com/pause-reconciliation-
```

When the annotations are removed, the configuration of your instance is updated, and the upgrade to the latest version of {{site.data.reuse.es_name}} completes.

#### Pausing reconciliation by using the OpenShift web console

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}

3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.es_name}} instance in the namespace. It is called **{{site.data.reuse.es_name}}** in the **Name** column. Click the **{{site.data.reuse.es_name}}** link in the row.
5. Select the instance you want to pause and click the `YAML` tab.
6. In the `YAML` for the custom resource, add `eventstreams.ibm.com/pause-reconciliation: 'true'` to the `metadata.annotations` field as follows:

   ```yaml
   apiVersion: eventstreams.ibm.com/v1beta2
   kind: EventStreams
   metadata:
     name: <instance-name>
     namespace: <instance-namespace>
     annotations:
       eventstreams.ibm.com/pause-reconciliation: 'true'
   spec:
     # ...
   ```

7. This annotation also needs to be applied to the corresponding `Kafka` custom resource. Expand **Home** in the navigation on the left,  click **API Explorer**, and type `Kafka` in the `Filter by kind...` field. Select `Kafka`.
8. From the **Project** list, select the namespace (project) the instance is installed in and click the **Instances** tab.
9. Select the instance with the name `<instance-name>` (the same as the {{site.data.reuse.es_name}} instance).
10. In the `YAML` for the custom resource, add `eventstreams.ibm.com/pause-reconciliation: 'true'` to the `metadata.annotations` field as follows:

    ```yaml
    apiVersion: eventstreams.ibm.com/v1beta2
    kind: Kafka
    metadata:
    name: <instance-name>
    namespace: <instance-namespace>
    annotations:
       eventstreams.ibm.com/pause-reconciliation: 'true'
    ```

11. Follow the steps to [upgrade on OpenShift](#upgrading-on-the-openshift-container-platform).

#### Unpausing reconciliation by using the OpenShift web console

To unpause the reconciliation and continue with the upgrade of an {{site.data.reuse.es_name}} instance, first remove the annotations from the `Kafka` custom resource, and then from the `EventStreams` custom resource. When the annotations are removed, the configuration of your instance is updated, and the upgrade to the latest version of {{site.data.reuse.es_name}} completes.

## Upgrading on the {{site.data.reuse.openshift_short}}

Upgrade your {{site.data.reuse.es_name}} instance running on the {{site.data.reuse.openshift_short}} by using the CLI or web console as follows.

### Planning your upgrade

Complete the following steps to plan your upgrade on OpenShift.

- Determine which Operator Lifecycle Manager (OLM) channel is used by your existing Subscription. You can check the channel you are subscribed to in the [web console](#upgrading-subscription-ui) (see **Update channel** section), or by using the CLI as follows (this is the [subscription created during installation](../installing/#install-the-event-streams-operator)):
   
   1. Run the following command to check your subscription details:
   
      ```shell
      oc get subscription
      ```
      
   2. Check the `CHANNEL` column for the channel you are subscribed to, for example, v11.2 in the following snippet:
      
      ```
      NAME                        PACKAGE                     SOURCE                      CHANNEL
      ibm-eventstreams            ibm-eventstreams            ibm-eventstreams-catalog    v3.2
      ```

- If your existing Subscription does not use the v3.3 channel, your upgrade is a change in a minor version. Complete the following steps to upgrade:
  1. Ensure the [catalog source for new version is available](#making-new-catalog-source-available).
  2. Change your Subscription to the `v3.3` channel by using [the CLI](#upgrading-subscription-by-using-the-cli) or [the web console](#upgrading-subscription-ui). The channel change will upgrade your operator, and then the operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

- If your existing Subscription is already on the v3.3 channel, your upgrade is a change to the patch level (third digit) only. [Make the catalog source for your new version available](#making-new-catalog-source-available) to upgrade to the latest level. If you installed by using the IBM Operator Catalog with the `latest` label, new versions are automatically available. The operator will upgrade your {{site.data.reuse.es_name}} instance automatically.

### Making new catalog source available

Before you can upgrade to the latest version, the catalog source for the new version must be available on your cluster. Whether you have to take action depends on how you set up [version control](../installing/#decide-version-control-and-catalog-source) for your deployment.

- Latest versions: If your catalog source is the IBM Operator Catalog, latest versions are always available when published, and you do not have to make new catalog sources available.

- Specific versions: If you applied a catalog source for a specific version to control the version of the operator and instances that are installed, you must [apply the new catalog source](../installing/#adding-specific-versions) you want to upgrade to.

### Upgrading Subscription by using the CLI

If you are using the OpenShift command-line interface (CLI), the `oc` command, complete the steps in the following sections to upgrade your {{site.data.reuse.es_name}} installation.

1. {{site.data.reuse.openshift_cli_login}}
2. Ensure the required {{site.data.reuse.es_name}} Operator Upgrade Channel is available:

   ```shell
   oc get packagemanifest ibm-eventstreams -o=jsonpath='{.status.channels[*].name}'
   ```

2. Change the subscription to move to the required update channel, where `vX.Y` is the required update channel (for example, `v3.3`):

   ```shell
   oc patch subscription -n <namespace> ibm-eventstreams --patch '{"spec":{"channel":"vX.Y"}}' --type=merge
   ```

All {{site.data.reuse.es_name}} pods that need to be updated as part of the upgrade will be gracefully rolled. Where required, ZooKeeper pods will roll one at a time, followed by Kafka brokers rolling one at a time.

### Upgrading Subscription by using the web console {#upgrading-subscription-ui}

If you are using the {{site.data.reuse.openshift_es_name}} web console, complete the steps in the following sections to upgrade your {{site.data.reuse.es_name}} installation.

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Operators** in the navigation on the left, and click **Installed Operators**.

   ![Operators > Installed Operators]({{ 'images' | relative_url }}/rhocp_menu_installedoperators.png "Screen capture showing how to select Operators > Installed Operators from navigation menu"){:height="50%" width="50%"}
3. From the **Project** list, select the namespace (project) the instance is installed in.
4. Locate the operator that manages your {{site.data.reuse.es_name}} instance in the namespace. It is called **{{site.data.reuse.es_name}}** in the **Name** column. Click the **{{site.data.reuse.es_name}}** link in the row.
4. Click the **Subscription** tab to display the **Subscription details** for the {{site.data.reuse.es_name}} operator.
5. Click the version number link in the **Update channel** section (for example, **v3.2**). The **Change Subscription update channel** dialog is displayed, showing the channels that are available to upgrade to.
6. Select **v3.3** and click the **Save** button on the **Change Subscription Update Channel** dialog.

All {{site.data.reuse.es_name}} pods that need to be updated as part of the upgrade will be gracefully rolled. Where required, ZooKeeper pods will roll one at a time, followed by Kafka brokers rolling one at a time.

**Note:** The number of containers in each Kafka broker will reduce from 2 to 1 as the TLS-sidecar container will be removed from each broker during the upgrade process.

<!--- Alternative steps for PlatformUI to be added. Sounds like CP4I don’t support our latest setting in this release, but might do in the next (or later).-->

## Upgrading on other Kubernetes platforms by using Helm

If you are running {{site.data.reuse.es_name}} on Kubernetes platforms that support the Red Hat Universal Base Images (UBI) containers, you can upgrade {{site.data.reuse.es_name}} by using the Helm chart.

### Planning your upgrade

Complete the following steps to plan your upgrade on other Kubernetes platforms.

- Determine the chart version for your existing deployment:
   
   1. Change to the namespace where your {{site.data.reuse.es_name}} instance is installed:
      
      ```shell
      kubectl config set-context --current --namespace=<namespace>
      ```
   
   2. Run the following command to check what version is installed:
      
      ```shell
      helm list
      ```
      
   3. Check the version installed in the `CHART` column, for example, `<chart-name>-3.2.5` in the following snippet:
      
      ```
      NAME                      NAMESPACE  REVISION  UPDATED                                 STATUS   CHART                            APP VERSION    
      ibm-eventstreams          es         1         2023-11-20 11:49:27.221411789 +0000 UTC deployed ibm-eventstreams-operator-3.2.5  3.2.5
      ```

- Check the latest chart version that you can upgrade to:
   
   1. {{site.data.reuse.cncf_cli_login}}
   2. Add the [IBM Helm repository](https://github.com/IBM/charts/tree/master/repo/ibm-helm){:target="_blank"}:
      
      ```shell
      helm repo add ibm-helm https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
      ```
      
   3. Update the Helm repository:
      
      ```shell
      helm repo update ibm-helm
      ```
      
   4. Check the version of the chart you will be upgrading to is the intended version:
      
      ```shell
      helm show chart ibm-helm/ibm-eventstreams-operator
      ```
      
      Check the `version:` value in the output, for example: `version: 3.3.0`

- If the chart version for your existing deployment is 3.2.x, your upgrade is a change in a minor version. If your existing chart version is 3.3.x, your upgrade is a change in the patch level version only. Complete the steps in [upgrading by using Helm](#upgrading-by-using-helm) to update your Custom Resource Definitions (CRDs) and operator charts to the latest version. The operator will then upgrade your {{site.data.reuse.es_name}} instance automatically.

### Upgrading by using Helm

You can upgrade your {{site.data.reuse.es_name}} on other Kubernetes platforms by using Helm.

To upgrade {{site.data.reuse.es_name}} to the latest version, run the following command:

```shell
helm upgrade \
<release-name> ibm-helm/ibm-eventstreams-operator \
-n <namespace> \
--set watchAnyNamespace=<true/false>
--set previousVersion=<previous-version>
```

Where:

- `<release-name>` is the name you provide to identify your operator.
- `<namespace>` is the name of the namespace where you want to install the operator.
- `watchAnyNamespace=<true/false>` determines whether the operator manages instances of {{site.data.reuse.es_name}} in any namespace or only a single namespace (default is `false` if not specified). For more information, see [choosing operator installation mode](../installing-on-kubernetes/#choosing-operator-installation-mode).
- `<previous-version>` is the version of the Helm chart being upgraded from. For example, if your Helm chart version is 3.2.5, set the field as: `--set previousVersion=3.2.5`. You can retrieve the version of your existing Helm chart by running the following command:

  ```shell
  helm list --filter <release-name> -n <namespace> -o json | jq '.[0].app_version'
  ```

## Post-upgrade tasks

### Enable collection of producer metrics

In {{site.data.reuse.es_name}} version 11.0.0 and later, a Kafka Proxy handles gathering metrics from producing applications. The information is displayed in the [**Producers** dashboard](../../administering/topic-health/). The proxy is optional and is not enabled by default. To enable metrics gathering and have the information displayed in the dashboard, [enable the Kafka Proxy](../../installing/configuring/#enabling-collection-of-producer-metrics).

### Enable metrics for monitoring

To display metrics in the monitoring dashboards of the {{site.data.reuse.es_name}} UI:

- If you are running {{site.data.reuse.es_name}} on the {{site.data.reuse.openshift_short}}, ensure you [enable](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=administering-enabling-openshift-container-platform-monitoring){:target="_blank"} the monitoring stack.

- If you are running {{site.data.reuse.es_name}} on other Kubernetes platforms, you can use any monitoring solution compatible with Prometheus and JMX formats to collect, store, visualize, and set up alerts based on metrics provided by Event Streams.

### Migrate to latest Apicurio Registry

Apicurio client libraries versions 2.3.1 and earlier use a [date format that is not compatible](../../troubleshooting/upgrade-apicurio) with Apicurio Registry server versions 2.5.0 or later. Apicurio Registry is only deployed when you update the {{site.data.reuse.es_name}} custom resource to use the latest version of Apicurio Registry included with {{site.data.reuse.es_name}}.

Migrate your schema registry to use the latest Apicurio Registry as follows:

1. Ensure all applications connecting to your instance of {{site.data.reuse.es_name}} that use the schema registry are using Apicurio client libraries version 2.5.0 or later before migrating.
2. {{site.data.reuse.openshift_cli_login}}
3. Add the `eventstreams.ibm.com/apicurio-registry-version='>=2.4'` annotation to your {{site.data.reuse.es_name}} custom resource with the following command:

   ```shell
   oc annotate --namespace <namespace> EventStreams <instance-name> eventstreams.ibm.com/apicurio-registry-version='>=2.4'
   ```

The {{site.data.reuse.es_name}} operator will update your schema registry to use the latest version of Apicurio Registry included with {{site.data.reuse.es_name}}.

### Configure your instance to use Keycloak

If your existing instance is configured to use IAM and you want to use Keycloak, update your `EventStreams` custom resource as follows:

1. Remove the `spec.requestIbmServices` section.
2. Set the `adminUI` [authentication type](../../installing/configuring/#configuring-ui-and-cli-security) to `integrationKeycloak`:

   ```yaml
   # ...
   spec:
     # ...
     adminUI:
       authentication:
         - type: integrationKeycloak
   ```


### Update authentication mechanisms

In versions 11.3.0 and later, each authentication mechanism you want to use for the {{site.data.reuse.es_name}} [REST endpoints](../configuring/#rest-services-access) must have a corresponding [Kafka listener](../configuring/#kafka-access) configured with the same authentication type set.

If you are upgrading an existing installation where you have a specific authentication mechanism set (for example, `tls`), and at upgrade you do not have a Kafka listener configured with the same authentication type (`tls`), then the upgrade process will warn you of not having a Kafka listener with the corresponding `tls` authentication type available.

In previous {{site.data.reuse.es_name}} versions, all authentication mechanisms were enabled by default if you did not set any specific mechanism (`iam-bearer`,`tls`,`scram-sha-512`; with `iam-bearer` only available if you have {{site.data.reuse.icpfs}} installed on the {{site.data.reuse.openshift_short}}). In such cases, ensure you have a [Kafka listener](../configuring/#kafka-access) set up with the authentication type set to the authentication mechanism you want to use for your REST endpoints.

For example, the following configuration in {{site.data.reuse.es_name}} 11.2.5 enabled all authentication mechanisms for the REST endpoint as none were specified. After upgrading to 11.3.0, this configuration means that only SCRAM can be used as the authentication mechanism.

```yaml
# ...
spec:
  # ...
  adminApi:
    endpoints:
      - name: routes-example
        containterPort: 9080
        type: route

  # ...
  strimziOverrides:
    # ...
    kafka:
      listeners:
        - name: intscram
          type: internal
          port: 9092
          tls: false
          authentication:
            type: scram-sha-512
```

To enable other authentication mechanisms, for example, TLS, add an additional Kafka listener configuration with `tls` set as follows:

```yaml
# ...
spec:
  # ...
  adminApi:
    endpoints:
      - name: routes-example
        containterPort: 9080
        type: route

  # ...
  strimziOverrides:
    # ...
    kafka:
      listeners:
        - name: intscram
          type: internal
          port: 9092
          tls: false
          authentication:
            type: scram-sha-512
        - name: inttls
          type: internal
          port: 9093
          tls: true
          authentication:
            type: tls
```

### Verifying the upgrade

After the upgrade, verify the status of {{site.data.reuse.es_name}} by using the [CLI](../post-installation/#using-the-openshift-container-platform-cli) or the [UI](../post-installation/#using-the-openshift-container-platform-ui).
