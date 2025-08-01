---
title: "Installing the Manager in an online OpenShift environment"
excerpt: "Find out how to install Event Endpoint Management in an online OpenShift environment."
categories: installing
slug: installing
toc: true
---

The following sections provide instructions about installing {{site.data.reuse.eem_name}} on the {{site.data.reuse.openshift}}. The instructions are based on using the {{site.data.reuse.openshift_short}} web console and `oc` command-line utility.

## Before you begin

- Ensure that you set up your environment [according to the prerequisites](../prerequisites), including setting up your {{site.data.reuse.openshift_short}} and [installing](../prerequisites#certificate-management) a supported version of a certificate manager.
- Ensure that you [planned for your installation](../planning), such as preparing for persistent storage, considering security options, and considering adding resilience through multiple availability zones.
- Obtain the connection details for your {{site.data.reuse.openshift_short}} cluster from your administrator.
- If you want to authenticate with Keycloak, ensure that you have {{site.data.reuse.cp4i}} 16.1.0 (operator version 7.3.0) or later [installed](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.2?topic=installing){:target="_blank"}, including the required dependencies.

## Create a project (namespace)

Create a namespace into which {{site.data.reuse.eem_name}} will be installed by creating a [project](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/building_applications/projects#working-with-projects){:target="_blank"}.
When you create a project, a namespace with the same name is also created.
Ensure that you use a namespace that is dedicated to a single deployment of {{site.data.reuse.eem_name}}. This is required because {{site.data.reuse.eem_name}} uses network security policies to restrict network connections between its internal components. A single namespace per instance also allows for finer control of user accesses.

**Important:** Do not use any of the default or system namespaces to install {{site.data.reuse.eem_name}}. For example: `default`, `kube-system`, `kube-public`, and `openshift-operators`.

### Creating a project by using the web console

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Home** dropdown and select **Projects** to open the **Projects** panel.
3. Click **Create Project**.
4. Enter a new project name in the **Name** field, and optionally, a display name in the **Display Name** field, and a description in the **Description** field.
5. Click **Create**.

### Creating a project by using the CLI

1. {{site.data.reuse.openshift_cli_login}}
2. Run the following command to create a new project:

   ```shell
   oc new-project <project_name> --description="<description>" --display-name="<display_name>"
   ```

   The `description` and `display-name` command arguments are optional settings that you can use to specify a description and a custom name for your project.
3. When you create a project, your namespace automatically switches to your new namespace. Ensure that you are using the project that you created by selecting it as follows:

   ```shell
   oc project <new-project-name>
   ```

   The following message is displayed if successful:

   ```shell
   Now using project "<new-project-name>" on server "https://<OpenShift-host>:6443".
   ```

## Create an image pull secret

Before you install an instance, create an image pull secret that is called `ibm-entitlement-key` in the namespace where you want to create an instance of the {{site.data.reuse.eem_manager}}. The secret enables container images to be pulled from the registry.

1. Obtain an entitlement key from the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}.
2. Create the secret in the namespace that will be used to deploy an instance of the {{site.data.reuse.eem_manager}} as follows.

   Name the secret `ibm-entitlement-key`, use `cp` as the username, your entitlement key as the password, and `cp.icr.io` as the docker server:

   ```shell
   oc create secret docker-registry ibm-entitlement-key --docker-username=cp --docker-password="<your-entitlement-key>" --docker-server="cp.icr.io" -n <target-namespace>
   ```

**Note:** If you do not create the required secret, pods fail to start with `ImagePullBackOff` errors. In this case, ensure that the secret is created and allow the pod to restart.

## Choose the operator installation mode

Before you install an operator, decide whether you want the operator to:

- Manage instances in **any namespace**.

  To use this option, select `All namespaces on the cluster (default)` later. The operator is deployed into the system namespace `openshift-operators`, and can manage instances in any namespace.

- Manage instances only in a **single namespace**.

  To use this option, select `A specific namespace on the cluster` later. The operator is deployed into the specified namespace, and cannot manage instances in any other namespace.

  **Note:** Installing different versions of {{site.data.reuse.eem_name}} in different namespaces on the same cluster is not supported. 

## Creating the catalog sources

Before you can install the required IBM operators, make them available for installation by adding the catalog sources to your cluster. Two options are available for creating your {{site.data.reuse.eem_name}} catalog sources:

1. Specify the {{site.data.reuse.eem_name}} version that you want available in your cluster by downloading the Container Application Software for Enterprises (CASE) files for that version. This option is suitable for production deployments where you want to control what versions are available and when upgrades are applied. See [Add specific version sources for production environments (CASE)](#add-specific-version-sources-for-production-environments-case).

2. Add the IBM Operator Catalog to your cluster to make the latest version of {{site.data.reuse.eem_name}} available in your cluster and for updates to be applied automatically. This option is suitable for nonproduction deployments where you always want to be on the latest version and are not concerned about an unexpected outage when {{site.data.reuse.eem_name}} is updated automatically. See [Add auto-updating sources for development or test environments (IBM Operator Catalog)](#add-auto-updating-sources-for-development-or-test-environments-ibm-operator-catalog).


### Add specific version sources for production environments (CASE)

Before you can install the required operator versions and use them to create instances of the {{site.data.reuse.eem_manager}}, make their catalog source available in your cluster as described in the following steps.

**Note:** This procedure must be done by using the CLI.

1. Before you begin, ensure that you have the following set up for your environment:

   - The {{site.data.reuse.openshift_short}} CLI (`oc`) [installed](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/cli_tools/openshift-cli-oc#cli-about-cli_cli-developer-commands){:target="_blank"}.
   - The IBM Catalog Management Plug-in for IBM Cloud Paks (`ibm-pak`) [installed](https://github.com/IBM/ibm-pak#readme){:target="_blank"}. After the plug-in is installed, you can run `oc ibm-pak` commands against the cluster. Run the following command to confirm that `ibm-pak` is installed:

   ```shell
   oc ibm-pak --help
   ```

2. Run the following command to download, validate, and extract the latest CASE version.

   ```shell
   oc ibm-pak get ibm-eventendpointmanagement 
   ```

   **Note:** To install an earlier version of {{site.data.reuse.eem_name}}, add the argument: `--version <case-version>`. See the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) to identify the CASE version that corresponds to your required {{site.data.reuse.eem_name}} version.

3. Generate mirror manifests by running the following command:

   ```shell
   oc ibm-pak generate mirror-manifests ibm-eventendpointmanagement icr.io 
   ```
 
   The previous command generates the following files based on the target internal registry provided:

   - catalog-sources.yaml
   - catalog-sources-linux-`<arch>`.yaml (if there are architecture-specific catalog sources)
   - image-content-source-policy.yaml
   - images-mapping.txt

4. Apply the catalog sources for the operator to the cluster by running the following command:

   ```shell
   oc apply -f ~/.ibm-pak/data/mirror/ibm-eventendpointmanagement/<case-version>/catalog-sources.yaml
   ```

   Where `<case-version>` is the version of the CASE that you want to install. Refer to the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) to identify the CASE version that corresponds to the {{site.data.reuse.eem_name}} version that you want to install.

The preceding steps add the catalog source for {{site.data.reuse.eem_name}}, making the operator available to install.

Install the operator by using the [OpenShift web console](#installing-by-using-the-web-console) or the [CLI](#installing-by-using-the-command-line).


### Add auto-updating sources for development or test environments (IBM Operator Catalog)

**Important:** Use this method of installation only if you want {{site.data.reuse.eem_name}} updates to be applied automatically when they become available.

Before you can install the latest operators and use them to create instances of the {{site.data.reuse.eem_manager}}, make the IBM Operator Catalog available in your cluster.

If you have other IBM products that are installed in your cluster, then you might already have the IBM Operator Catalog available. If it is configured for automatic updates as described in the following section, it already contains the required operators, and you can skip the deployment of the IBM Operator Catalog.

If you are installing the {{site.data.reuse.eem_name}} operator as the first IBM operator in your cluster, to make the operators available in the OpenShift OperatorHub catalog, create the following YAML file and apply it as follows.

To add the IBM Operator Catalog:

1. Create a file for the IBM Operator Catalog source with the following content, and save as `ibm_catalogsource.yaml`:

   ```yaml
   apiVersion: operators.coreos.com/v1alpha1
   kind: CatalogSource
   metadata:
      name: ibm-operator-catalog
      namespace: openshift-marketplace
   spec:
      displayName: "IBM Operator Catalog"
      publisher: IBM
      sourceType: grpc
      image: icr.io/cpopen/ibm-operator-catalog
      updateStrategy:
        registryPoll:
          interval: 45m
   ```

   Automatic updates of your IBM Operator Catalog can be disabled by removing the polling attribute `spec.updateStrategy.registryPoll`.
   To disable automatic updates, remove the following parameters in the IBM Operator Catalog source YAML under the `spec` field:

   ```yaml
      updateStrategy:
        registryPoll:
          interval: 45m
   ```

   **Important:** Other factors such as Subscription might enable the automatic updates of your deployments. For tight version control of your operators or to install a specific version use a [CASE bundle](#add-specific-version-sources-for-production-environments-case) instead of the IBM Operator catalog.

2. {{site.data.reuse.openshift_cli_login}}
3. Apply the source by using the following command:

   ```shell
   oc apply -f ibm_catalogsource.yaml
   ```

Alternatively, you can add the catalog source through the OpenShift web console by using the Import YAML option:

1. Select the plus icon on the upper right.
2. Paste the IBM Operator Catalog source YAML in the YAML editor. You can also drag-and-drop the YAML files into the editor.
3. Select **Create**.

The preceding steps add the catalog source for {{site.data.reuse.eem_name}} to the OperatorHub catalog, making the operator available to install.


## Install the {{site.data.reuse.eem_name}} operator

Follow the instructions to install the {{site.data.reuse.eem_name}} operator.

### Installing by using the web console

To install the operator by using the {{site.data.reuse.openshift_short}} web console, complete the following steps:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Operators** dropdown and select **OperatorHub** to open the **OperatorHub** dashboard.
3. In the **All Items** search box, enter `IBM Event Endpoint Management` to locate the operator title.
4. Click the **IBM Event Endpoint Management** tile to open the install side panel.
5. Click the **Install** button to open the **Install Operator** dashboard.
6. Select the chosen [installation mode](#choose-the-operator-installation-mode) that suits your requirements.
   If the installation mode is **A specific namespace on the cluster**, select the target namespace that you created previously.
7. Set **Update approval** to **Automatic**.
8. Click **Install** to begin the installation.

The installation can take a few minutes to complete.

### Installing by using the command line

To install the operator by using the {{site.data.reuse.openshift_short}} command line, complete the following steps:

1. Change to the namespace (project) where you want to install the operator. For command line installations, this sets the chosen [installation mode](#choose-the-operator-installation-mode) for the operator: 
   
   - Change to the system namespace `openshift-operators` if you are installing the operator to be able to manage instances in all namespaces.
   - Change to the custom namespace if you are installing the operator for use in a specific namespace only.
   
   ```shell
   oc project <target-namespace>
   ```

2. Check whether there is an existing `OperatorGroup` in your target namespace:
   
   ```shell
   oc get OperatorGroup
   ```
   
   If there is an existing `OperatorGroup`, continue to the next step to create a `Subscription`.

   If there is no `OperatorGroup`, create one as follows:

   a. Create a YAML file with the following content, replacing `<target-namespace>` with your namespace:

   ```yaml
   apiVersion: operators.coreos.com/v1
   kind: OperatorGroup
   metadata:
     name: ibm-eventautomation-operatorgroup
     namespace: <target-namespace>
   spec:
     targetNamespaces:
       - <target-namespace>
   ```
   
   b. Save the file as `operator-group.yaml`.
   
   c. Run the following command:
   
   ```shell
   oc apply -f operator-group.yaml
   ```
   <!-- Does user need to do this if installing in openshift-operators? -->

3. Create a `Subscription` for the {{site.data.reuse.eem_name}} operator as follows:
   
   a. Create a YAML file similar to the following example:

   ```yaml
   apiVersion: operators.coreos.com/v1alpha1
   kind: Subscription
   metadata:
     name: ibm-eventendpointmanagement
     namespace: <target-namespace>
   spec:
     channel: <current-channel>
     installPlanApproval: Automatic
     name: ibm-eventendpointmanagement
     source: <catalog-source-name>
     sourceNamespace: openshift-marketplace
   ```

   Where:

   - `<target-namespace>` is the namespace where you want to install {{site.data.reuse.eem_name}} (`openshift-operators` if you are installing in all namespaces, or a custom name if you are installing in a specific namespace).
   - `<current_channel>` is the operator channel for the release you want to install (see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }})). For example "v11.6".
   - `<catalog-source-name>` is the name of the catalog source that was created for this operator. Set this property to `ibm-eventendpointmanagement-catalog` when installing a specific version by using a CASE bundle, or `ibm-operator-catalog` if the source is the IBM Operator Catalog.

   b. Save the file as `subscription.yaml`.

   c. Run the following command:

      ```shell
      oc apply -f subscription.yaml
      ```

### Checking the operator status

You can view the status of the installed operator as follows.

#### By using the web console

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}
4. Scroll down to the **ClusterServiceVersion details** section of the page.
5. Check the **Status** field. After the operator is successfully installed, the status changes to `Succeeded`.

In addition to the status, information about key events that occur can be viewed under the **Conditions** section of the same page. After a successful installation, a condition with the following message is displayed: `install strategy completed with no errors`.

**Note:** If the operator is installed into a specific namespace, then it appears only under the associated project. If the operator is installed for all namespaces, then it appears under any selected project. If the operator is installed for all namespaces, and you select **all projects** from the **Project** drop down, the operator is shown multiple times in the resulting list (once for each project).

When the {{site.data.reuse.eem_name}} operator is installed, the following additional operators appear in the installed operator list:

- Operand Deployment Lifecycle Manager.
- IBM Common Service Operator.

#### By using the CLI

To check the status of the installed operator by using the command line:

```shell
oc get csv
```

The command returns a list of installed operators. The installation is successful if the value in the `PHASE` column for your {{site.data.reuse.eem_name}} operator is `Succeeded`.

## Install an {{site.data.reuse.eem_manager}} instance

Instances of the {{site.data.reuse.eem_manager}} can be created after the {{site.data.reuse.eem_name}} operator is installed. If the operator was installed into **a specific namespace**, then it can be used only to manage instances of the {{site.data.reuse.eem_manager}} in that namespace. If the operator was installed for **all namespaces**, then it can be used to manage instances of the {{site.data.reuse.eem_manager}} in any namespace, including those instances created after the operator was deployed.

When you install an instance of the {{site.data.reuse.eem_manager}}, ensure that you are using a namespace that an operator is managing.

### Installing an {{site.data.reuse.eem_manager}} instance by using the web console

To install an {{site.data.reuse.eem_manager}} instance through the {{site.data.reuse.openshift_short}} web console, complete the following steps:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}

    **Note:** If the operator is not shown, it is either not installed or not available for the selected namespace.
4. In the **Operator Details** dashboard, click the **{{site.data.reuse.eem_name}}** tab.
5. Click the **Create EventEndpointManagement** button to open the **Create EventEndpointManagement** panel. You can use this panel to define an `EventEndpointManagement` custom resource. 

From here, you can install by using the [YAML view](#installing-an-event-endpoint-management-instance-by-using-the-yaml-view) or the [form view](#installing-an-event-endpoint-management-instance-by-using-the-form-view). For advanced configurations or to install one of the samples, see [installing by using the YAML view](#installing-an-event-endpoint-management-instance-by-using-the-yaml-view).

**Important:** If you want to customize the TLS certificates that secure your {{site.data.reuse.eem_manager}} endpoints, then you must configure the certificates before you install the custom resource. See [configuring TLS](../../security/config-tls).
<!-- DRAFT COMMENT: Anything else user must configure before installing? -->

For additional configuration options that you can set in the Custom Resource Definition, see [Configuring](../configuring).

#### Installing an {{site.data.reuse.eem_manager}} instance by using the YAML view

You can configure the `EventEndpointManagement` custom resource by editing YAML documents. Select **YAML view**.

Several sample configurations are provided on which you can base your deployment. These samples range from quick start deployments for non-production development to large scale clusters ready to handle a production workload. Alternatively, a pre-configured YAML file that contains the custom resource can be dragged and dropped onto this screen to apply the configuration.

To view the samples, complete the following steps:

1. Click the **Samples** tab to view the available sample configurations.
2. Click the **Try it** link under any of the samples.

**Note:** If you are experimenting with {{site.data.reuse.eem_name}} for the first time, the **Quick start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.

More information about these samples is available in the [planning](../planning/#sample-deployments-for-event-endpoint-management) section. You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring) as required.

When you modify the sample configuration, the updated document can be exported from the **Create EventEndpointManagement** panel by clicking the **Download** button and re-imported by dragging the resulting file back into the window. You can also directly edit the custom resource YAML by clicking the editor.

When you modify the sample configuration, ensure that the following fields are updated based on your requirements:

- The `spec.license.accept` field in the custom resource YAML is set to `true`.
- The correct values are selected for the `spec.license.use`, `spec.license.license`, and `spec.license.metric` fields before you deploy an {{site.data.reuse.eem_manager}} instance. For information about the right values for your deployment, see the [licensing reference]({{ 'support/licensing' | relative_url }}).
- `manager.storageSpec.type` field is updated as `ephemeral` or `persistent-claim` based on your requirements. See [configuring](../configuring#enabling-persistent-storage) to select the correct storage type and other optional specifications such as storage size, root storage path, and secrets.
- `manager.tls.caSecretName` or `manager.tls.secretName`. If no value is specified for `caSecretName` and `secretName`, then the operator and cert-manager generate self-signed Issuer and CA certificates. For more information about configuring TLS on your endpoints, see [Configuring TLS](../../security/config-tls).

- Optional: If you are installing with a usage-based license, ensure that you [copy the secrets]({{ 'support/licensing#additional-steps-for-usage-based-license' | relative_url }}) created by the IBM License Service before you install the {{site.data.reuse.eem_manager}} instance, and then complete the following steps to provide details of your License Service:

  a. Update `spec.manager.extensionServices` to include license service details as follows:

  ```yaml
  extensionServices:
    - endpoint: <licensing-service-endpoint>
      name: licensing-service
      secretName: <licensing-upload-token>
  ```

  for example:

  ```yaml
  extensionServices:
    - endpoint: https://ibm-licensing-service-instance-ibm-common-services.apps.eem-cluster.cp.fyre.ibm.com
      name: licensing-service
      secretName: ibm-licensing-upload-token
  ```

  b. Update `spec.manager.tls` to include trusted certs for license service:

  ```yaml
  tls:
    trustedCertificates:
      - certificate: <secret-key>
        secretName: <licensing-service-cert-secret>
  ```

  for example:

  ```yaml
  tls:
    trustedCertificates:
      - certificate: tls.crt
        secretName: ibm-license-service-cert
  ```

To deploy an {{site.data.reuse.eem_manager}} instance, use the following steps:

1. Complete any changes to the sample configuration in the **Create EventEndpointManagement** panel.
2. Click **Create** to begin the installation process.
3. Wait for the installation to complete.

#### Installing an {{site.data.reuse.eem_manager}} instance by using the form view

Alternatively, you can configure an `EventEndpointManagement` custom resource by using the interactive form. You can load
samples into the form and then edit as required.

To view a sample in the form view, complete the following steps:

  1. Select **YAML view** in the **Configure via** section.
  2. Click the **Samples** tab to view the available sample configurations.
  3. Click the **Try it** link under any of the samples.
  4. Select **Form view** in the **Configure via** section to switch back to the form view with the data from the sample populated.
  5. Edit as required.

  **Note:** If you are experimenting with {{site.data.reuse.eem_name}} for the first time, the **Quick start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.


To configure an `EventEndpointManagement` custom resource, complete the following steps:

1. Enter a name for the instance in the **Name** field.
2. In **License > License Acceptance**, select the **accept** checkbox, enter the [correct values]({{ 'support/licensing' | relative_url }}#available-licenses) for **License**, **Metric**, and **Use**.
3. In **Manager > storage > type**, select `ephemeral` or `persistent-claim` based on your requirements. See [configuring persistence](../configuring/#enabling-peristent-storage) for information about storage types, and other optional specifications such as storage size, root storage path, and secrets.
4. In **Manager > tls**, use one of the following configurations:

   - User-provided CA certificate: In **caSecretName**, choose the name of the secret that contains the root CA certificate to be used by the operator in generating other certificates.
   - User-provided certificate: In **secretName**, choose the name of the secret that contains a CA certificate, server certificate, and a key that has the required DNS names for accessing the Manager.
   - Operator-configured CA: By default, if no value is provided for **caSecretName** and **secretName**, a self-signed Issuer and CA certificate is generated.

   For more information, see [configuring TLS](../../security/config-tls).

5. Optional: You can configure other components in **Manager**, such as **Extension Service** and **Auth Config** to suit your [requirements](../configuring).

   - If you are installing with a usage-based license, ensure that you [copy the secrets]({{ 'support/licensing#additional-steps-for-usage-based-license' | relative_url }}) created by the IBM License Service before you install the {{site.data.reuse.eem_manager}} instance, and then complete the following steps to provide details of your License Service:

      a. In **Manager > extensionServices**, click **Add extensionService**.

      b. Enter `licensing-service` as the extensionService **name**.

      c. Enter the license service route in **endpoint**.

        - To fetch the endpoint for license service, run the following command:

          ```shell
          oc get routes <INSTANCE> -n <NAMESPACE> -ojsonpath='{.status.ingress[*].host}'
          ```

          For example: If you created license service `instance` in `ibm-common-services` project:

          ```shell
          oc get routes ibm-licensing-service-instance -n ibm-common-services -ojsonpath='{.status.ingress[*].host}' 
          ```

      d. Select the secret `ibm-licensing-upload-token`.

      e. Add License Service CA as a trusted certificate. In **manager > tls > trustedCertificates**, click **Add trustedCertificate**.

      f. In **secretName**, select the secret `ibm-license-service-cert`. In **certificate**, enter the key as `tls.crt`.
6. Scroll down and select **Create** to deploy the {{site.data.reuse.eem_manager}} instance.
7. Wait for the installation to complete.

### Installing an {{site.data.reuse.eem_manager}} instance by using the CLI

To install an instance of the {{site.data.reuse.eem_manager}} from the command-line, you must first prepare an `EventEndpointManagement` custom resource configuration in a YAML file.

Several sample configuration files are available in [GitHub](https://ibm.biz/ea-eem-samples){:target="_blank"} where you can select the GitHub tag for your {{site.data.reuse.eem_name}} version, and then go to `/cr-examples/eventendpointmanagement` to access the samples. These samples range from quick start deployments for non-production development to large scale clusters ready to handle a production workload.

**Note:** If you are experimenting with {{site.data.reuse.eem_name}} for the first time, the **Quick start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.

More information about these samples is available in the [planning](../planning/#sample-deployments) section. You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring) as required.

When you modify the sample configuration, ensure that the following fields are updated based on your requirements:

- The `spec.license.accept` field in the custom resource YAML is set to `true`.
- The correct values are selected for the `spec.license.use`, `spec.license.license`, and `spec.license.metric` fields before you deploy an {{site.data.reuse.eem_manager}} instance. For information about the right values for your deployment, see the [licensing reference]({{ 'support/licensing' | relative_url }}).
- `manager.storageSpec.type` field is updated as `ephemeral` or `persistent-claim` based on your requirements. See [configuring](../configuring#enabling-persistent-storage) to select the correct storage type and other optional specifications such as storage size, root storage path, and secrets.
- `manager.tls.caSecretName` or `manager.tls.secretName` field is updated based on your requirements. If neither is specified, self-signed certificates are used. See the [configuring TLS](../../security/config-tls) section for more information and other optional TLS settings.
- If you are installing with a usage-based license, ensure that you add the license service CA as a trusted certificate by updating the `manager.tls.trustedCertificates`. Set the `trustedCertificates.secretName` as `ibm-license-service-cert` and enter `trustedCertificates.certificate` as `tls.crt`.

To deploy an {{site.data.reuse.eem_manager}} instance, run the following commands:

1. Set the project where your `EventEndpointManagement` custom resource is to be deployed in:

   ```shell
   oc project <project-name>
   ```

2. Apply the configured `EventEndpointManagement` custom resource:

   ```shell
   oc apply -f <custom-resource-file-path>
   ```

   For example:

   ```shell
   oc apply -f production.yaml
   ```

3. Wait for the installation to complete.

