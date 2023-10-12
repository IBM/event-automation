---
title: "Installing Event Gateways on the same cluster"
excerpt: "To provide access to your socialized topics, find out how to install and configure Gateways and Gateway groups on the same cluster as the {{site.data.reuse.eem_manager}} instance."
categories: installing
slug: deploy-gateways
toc: true
---

If you want to install the {{site.data.reuse.egw}} on the same cluster as the {{site.data.reuse.eem_manager}}, use the {{site.data.reuse.eem_name}} operator to install instances by applying the `EventGateway` custom resource type.

Instances of the {{site.data.reuse.egw}} can be created after the {{site.data.reuse.eem_name}} operator and the {{site.data.reuse.eem_name}} instance is installed. 
- If the operator was installed into **a specific namespace**, then it can only be used to manage instances of {{site.data.reuse.egw}} in that namespace. 
- If the operator was installed for **all namespaces**, then it can be used to manage instances of {{site.data.reuse.egw}} in any namespace, including those created after the operator was deployed.

When installing an instance of the {{site.data.reuse.egw}}, ensure you are using a namespace that an operator is managing.

**Note:** When running on Kubernetes platforms other than {{site.data.reuse.openshift_short}}, "all namespaces" refers to an installation where `watchAnyNamespace=true` was set during the [Helm installation](../installing-on-kubernetes).

## Installing an {{site.data.reuse.egw}} instance by using the {{site.data.reuse.openshift_short}} web console

To install an {{site.data.reuse.egw}} instance through the {{site.data.reuse.openshift_short}} web console, do the following:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}

    **Note:** If the operator is not shown, it is either not installed or not available for the selected namespace.
4. In the **Operator Details** dashboard, click the {{site.data.reuse.egw}} tab.
5. Click the **Create EventGateway** button to open the **Create EventGateway** panel. You can use this panel to define an `EventGateway` custom resource.

From here you can install by using the [YAML view](#installing-an-event-gateway-instance-by-using-the-yaml-view) or the [form view](#installing-an-event-gateway-instance-by-using-the-form-view). For advanced configurations or to install one of the samples, see [installing by using the YAML view](#installing-an-event-gateway-instance-by-using-the-yaml-view).

Refer to the configuring section to find out more information about the available options in the Custom Resource definition.

### Installing an {{site.data.reuse.egw}} instance by using the YAML view

You can configure the `EventGateway` custom resource by editing YAML documents. To do this, select **YAML view**.

A number of sample configurations are provided on which you can base your deployment. These range from quick start deployments for non-production development to large scale clusters ready to handle a production workload. Alternatively, a pre-configured YAML file containing the custom resource sample can be dragged and dropped onto this screen to apply the configuration.

To view the samples, complete the following steps:

1. Click the **Samples** tab to view the available sample configurations.
2. Click the **Try it** link under any of the samples to open the configuration in the **Create EventGateway** panel.

More information about these samples is available in the [planning](../planning/#sample-deployments) section. You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring) as required.

**Note:** If experimenting with {{site.data.reuse.eem_name}} for the first time, the **Quick start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.

When modifying the sample configuration, the updated document can be exported from the **Create EventGateway** panel by clicking the **Download** button and re-imported by dragging the resulting file back into the window. You can also directly edit the custom resource YAML by clicking on the editor.

When modifying the sample configuration, ensure the following fields are updated based on your requirements:

- `spec.license.accept` field in the custom resource YAML is set to `true` and that the [correct values](../planning/#licensing) are selected for `spec.license.use`, `spec.license.license`, and `spec.license.metric` fields.
- `spec.ManagerEndpoint` is set to the `gateway` API endpoint URI of an {{site.data.reuse.eem_manager}} (`EventEndpointManagement`) instance. The `gateway` API endpoint will contain `ibm-eem-gateway` in the URL.
- `spec.tls.caSecretName` field is updated with the name of a secret that contains the root CA certificate.

   **Important:** The `caSecretName` of an {{site.data.reuse.egw}} instance must be the same as the `caSecretName` of the {{site.data.reuse.eem_name}} instance you referred to when setting the endpoint URI in `spec.ManagerEndpoint`. If you are using the [operator-provided certificate](../configuring/#operator-configured-ca-certificate), enter the value as `<my-instance>-ibm-eem-manager-ca`.
- `spec.gatewayGroupName` field is updated with the name of a Gateway group to which this Gateway should be added.
- `spec.gatewayID` field is updated with the ID of a Gateway group to which this Gateway should be added.

To deploy an {{site.data.reuse.egw}} instance, use the following steps:

1. Complete any changes to the sample configuration in the **Create EventGateway** panel.
2. Click **Create** to begin the installation process.
3. Wait for the installation to complete.
4. You can now verify your installation and consider other [post-installation tasks](../post-installation/).

### Installing an {{site.data.reuse.egw}} instance by using the form view

Alternatively, you can configure an `EventGateway` custom resource using the interactive form.  You can load
samples into the form and then edit as required.

To view a sample in the form view, complete the following steps:

1. Select **YAML view** in the **Configure via** section.
2. Click **Samples** to view the available sample configurations.
3. Click **Try it** under any of the samples.
4. Select **Form view** in the **Configure via** section to switch back to the form view with the data from the sample populated.
5. Edit as required.

**Note:** If experimenting with {{site.data.reuse.eem_name}} for the first time, the **Quick start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.


To configure an `EventGateway` custom resource,  complete the following steps:

1. Enter a name for the instance in the **Name** field.
2. In **License > License Acceptance**, select the **accept** checkbox and ensure that the [correct values]({{ 'support/licensing' | relative_url }}) for **License**, **Metric**, and **Use** are entered.
3. In **gatewayGroupName**, enter the name of a Gateway group to which this Gateway must be added. See [configuring](../configuring) on how to retrieve the details of Gateway groups.
4. In **gatewayID**, enter the ID of a Gateway group to which this Gateway must be added. See [configuring](../configuring) on how to retrieve the details of Gateway groups.
5. In **eemManager > endpoint**, enter the `gateway` API endpoint URI of {{site.data.reuse.eem_manager}} instance. See [configuring](../configuring) on how to retrieve the `gateway` API endpoint URI of manager instance.
6. In **tls > caSecretName**, enter the name of the secret that contains the root CA certificate. You can also optionally [configure](../configuring#configuring-tls) other TLS specifications such as details of the secrets, keys, and certificates.

   **Important:** The `caSecretName` of an {{site.data.reuse.egw}} instance must be the same as the `caSecretName` of the {{site.data.reuse.eem_name}} instance you referred to when setting the endpoint URI in **eemManager > endpoint**. If you are using the [operator-provided certificate](../configuring/#operator-configured-ca-certificate), enter the value as `<my-instance>-ibm-eem-manager-ca`.

7. If you have any trusted certificates, you can add them in **eemManager > tls > trustedCertificates**.
8. Scroll down and click the **Create** button to deploy the {{site.data.reuse.egw}} instance.
9. Wait for the installation to complete.
10. You can now verify your installation and consider other [post-installation tasks](../post-installation/).

## Installing an {{site.data.reuse.egw}} instance by using the CLI (`kubectl`)

To install an instance of {{site.data.reuse.egw}} from the command-line (`kubectl`), you must first prepare an `EventGateway` custom resource configuration in a YAML file.

A number of sample configuration files are available in [GitHub](https://ibm.biz/ea-eem-samples){:target="_blank"} where you can select the GitHub tag for your {{site.data.reuse.eem_name}} version, and then go to `/cr-examples/eventgateway` to access the samples relevant for your Kubernetes platform. These range from quick start deployments for non-production development to large scale clusters ready to handle a production workload.

More information about these samples is available in the [planning](../planning/#sample-deployments) section. You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring) as required.

**Note:** If experimenting with {{site.data.reuse.egw}} for the first time, the **Quick start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.

When modifying the sample configuration, ensure the following fields are updated based on your requirements:

- `spec.license.accept` field in the custom resource YAML is set to `true` and that the [correct values](../planning/#licensing) are selected for `spec.license.use`, `spec.license.license`, and `spec.license.metric` fields.
- `spec.ManagerEndpoint` is set to the `gateway` API endpoint URI of {{site.data.reuse.eem_manager}} (`EventEndpointManagement`) instance.
- `spec.tls.caSecretName` field is updated with the name of a secret that contains the root CA certificate.

   **Important:** The `caSecretName` of an {{site.data.reuse.egw}} instance must be the same as the `caSecretName` of the {{site.data.reuse.eem_name}} instance you referred to when setting the endpoint URI in `spec.ManagerEndpoint`. If you are using the [operator-provided certificate](../configuring/#operator-configured-ca-certificate), enter the value as `<my-instance>-ibm-eem-manager-ca`.
- `spec.gatewayGroupName` field is updated with the name of a Gateway group to which this Gateway should be added.
- `spec.gatewayID` field is updated with the ID of a Gateway group to which this Gateway should be added.

On Kubernetes platforms other than the {{site.data.reuse.openshift_short}}, ensure you set the following additional fields:

- `spec.endpoints[]` must contain an endpoint with:
  - `name` set to `gateway`
  - `host` set to a DNS resolvable hostname for accessing the service.
     
     ![Event Endpoint Management 11.0.4 icon]({{ 'images' | relative_url }}/11.0.4.svg "In Event  Endpoint Management 11.0.4 only")**Note:** The hostname is limited to 64 characters.


To deploy an {{site.data.reuse.egw}} instance, run the following commands:

1. Apply the configured `EventGateway` custom resource to your target namespace:

   ```shell
   kubectl apply -f <custom-resource-file-path> -n <target-namespace>
   ```

   For example:

   ```shell
   kubectl apply -f production.yaml -n my-namespace
   ```

3. Wait for the installation to complete.
4. You can now verify your installation and consider other [post-installation tasks](../post-installation/).

