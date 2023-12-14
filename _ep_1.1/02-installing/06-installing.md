---
title: "Installing in an online OpenShift environment"
excerpt: "Installing Event Processing in an online OpenShift environment."
categories: installing
slug: installing
toc: true
---


The following sections provide instructions about installing {{site.data.reuse.ep_name}} on the {{site.data.reuse.openshift}}. The instructions are based on using the {{site.data.reuse.openshift_short}} web console and `oc` command-line utility.

## Overview

{{site.data.reuse.ep_name}} is an operator-based release and uses custom resources to define the deployment configuration.
{{site.data.reuse.ep_name}} requires the installation of the {{site.data.reuse.flink_long}} and the {{site.data.reuse.ep_name}}
operator. These operators deploy and manage the entire lifecycle of your Flink and {{site.data.reuse.ep_name}} instances. Custom resources are presented as YAML configuration documents that define instances of the `FlinkDeployment` and `EventProcessing` custom resources.

Installing {{site.data.reuse.ep_name}} has the following phases:

1. Install the {{site.data.reuse.flink_long}}: this deploys the operator that will install and manage your Flink instances.
2. Install the {{site.data.reuse.ep_name}} operator: this deploys the operator that will install and manage your {{site.data.reuse.ep_name}} instances.
3. Install one or more instances of Flink by using the {{site.data.reuse.flink_long}}.
4. Install one or more instances of {{site.data.reuse.ep_name}} by using the {{site.data.reuse.ep_name}} operator.

## Before you begin

- Ensure you have set up your environment [according to the prerequisites](../prerequisites), including setting up your {{site.data.reuse.openshift_short}} and [installing](../prerequisites#ibm-cert-manager) a supported version of the IBM Cert Manager.
- Ensure you have [planned for your installation](../planning), such as preparing for persistent storage, considering security options, and considering adding resilience through multiple availability zones.
- Obtain the connection details for your {{site.data.reuse.openshift_short}} cluster from your administrator.

## Create a project (namespace)

Create a namespace into which the {{site.data.reuse.ep_name}} instance will be installed by creating a [project](https://docs.openshift.com/container-platform/4.14/applications/projects/working-with-projects.html){:target="_blank"}.
When you create a project, a namespace with the same name is also created.

Ensure you use a namespace that is dedicated to a single instance of {{site.data.reuse.ep_name}}. This is required because {{site.data.reuse.ep_name}} uses network security policies to restrict network connections between its internal components. A single namespace per instance also allows for finer control of user accesses.

**Important:** Do not use any of the default or system namespaces to install an instance of {{site.data.reuse.ep_name}} (some examples of these are: `default`, `kube-system`, `kube-public`, and `openshift-operators`).

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

   The `description` and `display-name` command arguments are optional settings you can use to specify a description and a custom name for your project.
3. When you create a project, your namespace automatically switches to your new namespace. Ensure you are using the project that you created by selecting it as follows:

   ```shell
   oc project <new-project-name>
   ```

   The following message is displayed if successful:

   ```shell
   Now using project "<new-project-name>" on server "https://<OpenShift-host>:6443".
   ```

## Create an image pull secret

Before installing an instance, create an image pull secret called `ibm-entitlement-key` in the namespace where you want to create an instance of Flink. The secret enables container images to be pulled from the registry.

1. Obtain an entitlement key from the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}.
2. Create the secret in the namespace that will be used to deploy an instance of {{site.data.reuse.ep_name}} as follows.

   Name the secret `ibm-entitlement-key`, use `cp` as the username, your entitlement key as the password, and `cp.icr.io` as the docker server:

   ```shell
   oc create secret docker-registry ibm-entitlement-key --docker-username=cp --docker-password="<your-entitlement-key>" --docker-server="cp.icr.io" -n <target-namespace>
   ```

**Note:** If you do not create the required secret, pods will fail to start with `ImagePullBackOff` errors. In this case, ensure the secret is created and allow the pod to restart.

## Choose the operator installation mode

Before installing an operator, decide whether you want the operator to:

- Manage instances in **any namespace**.

  To use this option, select `All namespaces on the cluster (default)` later. The operator will be deployed into the system namespace `openshift-operators`, and will be able to manage instances in any namespace.

- Only manage instances in a **single namespace**.

  To use this option, select `A specific namespace on the cluster` later. The operator will be deployed into the specified namespace, and will not be able to manage instances in any other namespace.

## Decide version control and catalog source

Before you can install the required IBM operators, make them available for installation by adding the catalog sources to your cluster. Selecting how the catalog source is added will determine the versions you receive.

Consider how you want to control your deployments, whether you want to install specific versions, and how you want to receive updates.

- Latest versions: You can install the latest versions of all operators from the IBM Operator Catalog as described in [adding latest versions](#adding-latest-versions). This means that every deployment will always have the latest versions made available, and you cannot specify which version is installed. In addition, upgrades to latest versions are automatic and provided when they become available. This path is more suitable for development or proof of concept deployments.

- Specific versions: You can control the version of the operator and instances that are installed by downloading specific Container Application Software for Enterprises (CASE) files as described in [adding specific versions](#adding-specific-versions). This means you can specify the version you deploy, and only receive updates when you take action manually to do so. This is often required in production environments where the deployment of any version might require it to go through a process of validation and verification before it can be pushed to production use.

### Adding latest versions

**Important:** Use this method of installation only if you want your deployments to always have the latest version and if you want upgrades to always be automatic.

Before you can install the latest operators and use them to create instances of Flink and {{site.data.reuse.ep_name}}, make the IBM Operator Catalog available in your cluster.

If you have other IBM products that are installed in your cluster, then you might already have the IBM Operator Catalog available. If it is configured for automatic updates as described in the following section, it already contains the required operators, and you can skip the deployment of the IBM Operator Catalog.

If you are installing the {{site.data.reuse.flink_long}} or the {{site.data.reuse.ep_name}} operator as the first IBM operator in your cluster, to make the operators available in the OpenShift OperatorHub catalog, create the following YAML file and apply it as follows.

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

   Automatic updates of your IBM Operator Catalog can be disabled by removing the polling attribute, `spec.updateStrategy.registryPoll`.
   To disable automatic updates, remove the following parameters in the IBM Operator Catalog source YAML under the `spec` field:

   ```yaml
      updateStrategy:
        registryPoll:
          interval: 45m
   ```

   **Important:** Other factors such as Subscription might enable the automatic updates of your deployments. For tight version control of your operators or to install a fixed version, [add specific versions](#adding-specific-versions) of the CASE bundle, and then install the [{{site.data.reuse.flink_long}}](#installing-the-ibm-operator-for-apache-flink-by-using-the-command-line) and the [{{site.data.reuse.ep_name}}](#installing-the-event-processing-operator-by-using-the-command-line) operator by using the CLI.

2. {{site.data.reuse.openshift_cli_login}}
3. Apply the source by using the following command:

   ```shell
   oc apply -f ibm_catalogsource.yaml
   ```

Alternatively, you can add the catalog source through the OpenShift web console by using the Import YAML option:

1. Select the plus icon on the upper right.
2. Paste the IBM Operator Catalog source YAML in the YAML editor. You can also drag-and-drop the YAML files into the editor.
3. Select **Create**.

This adds the catalog source for both the {{site.data.reuse.flink_long}} and {{site.data.reuse.ep_name}} to the OperatorHub catalog, making these operators available to install.

### Adding specific versions

**Important:** Use this method if you want to install specific versions and do not want to automatically receive upgrades or have the latest versions made available immediately.

Before you can install the required operator versions and use them to create instances of Flink and {{site.data.reuse.ep_name}}, make their catalog source available in your cluster as described in the following sections.

**Note:** This procedure must be performed by using the CLI.

1. Before you begin, ensure that you have the following set up for your environment:

   - The {{site.data.reuse.openshift_short}} CLI (`oc`) [installed](https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html){:target="_blank"}.
   - The IBM Catalog Management Plug-in for IBM Cloud Paks (`ibm-pak`) [installed](https://github.com/IBM/ibm-pak#readme){:target="_blank"}. After installing the plug-in, you can run `oc ibm-pak` commands against the cluster. Run the following command to confirm that `ibm-pak` is installed:

   ```shell
   oc ibm-pak --help
   ```

2. Run the following command to download, validate, and extract the CASE:

   - For {{site.data.reuse.flink_long}}:

     ```shell
     oc ibm-pak get ibm-eventautomation-flink --version <case-version>
     ```
  
     Where `<case-version>` is the version of the CASE you want to install. For example:

     ```shell
     oc ibm-pak get ibm-eventautomation-flink --version {{site.data.reuse.flink_operator_current_version}}
     ```

   - For {{site.data.reuse.ep_name}}:

     ```shell
     oc ibm-pak get ibm-eventprocessing --version <case-version>
     ```

     Where `<case-version>` is the version of the CASE you want to install. For example:

     ```shell
     oc ibm-pak get ibm-eventprocessing --version {{site.data.reuse.flink_operator_current_version}}
     ```

3. Generate mirror manifests by running the following command:

   - For {{site.data.reuse.flink_long}}:

     ```shell
     oc ibm-pak generate mirror-manifests ibm-eventautomation-flink icr.io
     ```

   - For {{site.data.reuse.ep_name}}:

     ```shell
     oc ibm-pak generate mirror-manifests ibm-eventprocessing icr.io
     ```

   **Note**: To filter for a specific image group, add the parameter `--filter <image_group>` to the previous command.

   The previous command generates the following files based on the target internal registry provided:

   - catalog-sources.yaml
   - catalog-sources-linux-`<arch>`.yaml (if there are architecture specific catalog sources)
   - image-content-source-policy.yaml
   - images-mapping.txt

4. Apply the catalog sources for the operator to the cluster by running the following command:

   - For {{site.data.reuse.flink_long}}:

     ```shell
     oc apply -f ~/.ibm-pak/data/mirror/ibm-eventautomation-flink/<case-version>/catalog-sources-linux-amd64.yaml
     ```

     Where `<case-version>` is the version of the CASE you want to install. For example:

     ```shell
     oc apply -f ~/.ibm-pak/data/mirror/ibm-eventautomation-flink/{{site.data.reuse.flink_operator_current_version}}/catalog-sources-linux-amd64.yaml
     ```

   - For {{site.data.reuse.ep_name}}:

     ```shell
     oc apply -f ~/.ibm-pak/data/mirror/ibm-eventprocessing/<case-version>/catalog-sources-linux-amd64.yaml
     ```

     Where `<case-version>` is the version of the CASE you want to install. For example:

     ```shell
     oc apply -f ~/.ibm-pak/data/mirror/ibm-eventprocessing/{{site.data.reuse.ep_current_version}}/catalog-sources-linux-amd64.yaml
     ```

This adds the catalog source for the {{site.data.reuse.flink_long}} and the {{site.data.reuse.ep_name}} making the operators available to install.

## Install the operators

{{site.data.reuse.ep_name}} consists of two operators that must be installed in the {{site.data.reuse.openshift}}:

- {{site.data.reuse.flink_long}}
- {{site.data.reuse.ep_name}}

**Important:** To install the operators by using the OpenShift web console, you must add the operators to the [OperatorHub catalog](#adding-latest-versions). OperatorHub updates your operators automatically when a latest version is available. This might not be suitable for some production environments. For production environments that require manual updates and version control, [add specific versions](#adding-specific-versions), and then install the [{{site.data.reuse.flink_long}}](#installing-the-ibm-operator-for-apache-flink-by-using-the-command-line) and the [{{site.data.reuse.ep_name}}](#installing-the-event-processing-operator-by-using-the-command-line) operator by using the CLI.

### Installing the {{site.data.reuse.flink_long}}

Ensure you have considered the {{site.data.reuse.flink_long}} [requirements](../prerequisites/#operator-requirements),
including resource requirements and, if installing in **any namespace**, the required cluster-scoped permissions.

**Important:**

* {{site.data.reuse.flink_long}} must not be installed in a cluster where Apache Flink operator is also installed. Rationale:
  {{site.data.reuse.flink_long}} leverages the Apache Flink `CustomResourceDefinition` (CRD) resources. These resources
  cannot be managed by more than one operator
  (for more information, see the [Operator Framework documentation](https://sdk.operatorframework.io/docs/best-practices/best-practices/#summary){:target="_blank"}).
* Before installing {{site.data.reuse.flink_long}} on a cluster where Apache Flink operator is already installed, to avoid
  possible conflicts due to different versions, fully uninstall the Apache Flink operator, including the deletion of
  the Apache Flink CRDs as described in the
  [Apache Flink operator documentation](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.6/docs/development/guide/#generating-and-upgrading-the-crd){:target="_blank"}.
* Only one version of {{site.data.reuse.flink_long}} should be installed in a cluster. Installing multiple versions
  is not supported, due to the possible conflicts between versions of the `CustomResourceDefinition` resources.


#### Installing the {{site.data.reuse.flink_long}} by using the web console

To install the operator by using the {{site.data.reuse.openshift_short}} web console, do the following:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Operators** dropdown and select **OperatorHub** to open the **OperatorHub** dashboard.
3. Select the project that you want to deploy the {{site.data.reuse.ep_name}} instance in.
4. In the **All Items** search box, enter `{{site.data.reuse.flink_long}}` to locate the operator title.
5. Click the **{{site.data.reuse.flink_long}}** tile to open the install side panel.
6. Click the **Install** button to open the **Create Operator Subscription** dashboard.
7. Select the chosen [installation mode](#choose-the-operator-installation-mode) that suits your requirements.
   If the installation mode is **A specific namespace on the cluster**, select the target namespace that you created previously.
8. Click **Install** to begin the installation.

The installation can take a few minutes to complete.

#### Installing the {{site.data.reuse.flink_long}} by using the command line

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

3. Create a `Subscription` for the {{site.data.reuse.flink_long}} as follows:
   
   a. Create a YAML file similar to the following example:
   
   ```yaml
   apiVersion: operators.coreos.com/v1alpha1
   kind: Subscription
   metadata:
     name: ibm-eventautomation-flink
     namespace: <target-namespace>
   spec:
     channel: <current_channel>
     name: ibm-eventautomation-flink
     source: <catalog-source-name>
     sourceNamespace: openshift-marketplace
   ```

   Where:

   - `<target-namespace>` is the namespace where you want to install the {{site.data.reuse.flink_long}} (`openshift-operators` if you are installing in all namespaces, or a custom name if you are installing in a specific namespace).
   - `<current_channel>` is the operator channel for the release you want to install (see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }})).
   - `<catalog-source-name>` is the name of the catalog source that was created for this operator. This is `ibm-eventautomation-flink` when installing a specific version by using a CASE bundle, or `ibm-operator-catalog` if the source is the IBM Operator Catalog.

   b. Save the file as `subscription.yaml`.

   c. Run the following command:
 
   ```shell
   oc apply -f subscription.yaml
   ```

#### Checking the operator status

- To see the installed operator and check its status by using the web console, complete the following steps:

  1. {{site.data.reuse.openshift_ui_login}}
  2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
  3. {{site.data.reuse.task_openshift_select_operator_flink}}
  4. Scroll down to the **ClusterServiceVersion details** section of the page.
  5. Check the **Status** field. After the operator is successfully installed, this will change to `Succeeded`.

   In addition to the status, information about key events that occur can be viewed under the **Conditions** section of the same page. After a successful installation, a condition with the following message is displayed: `install strategy completed with no errors`.

- To check the status of the installed operator by using the command line:

  ```shell
  oc get csv
  ```

  The command returns a list of installed operators. The installation is successful if the value in the `PHASE` column for your {{site.data.reuse.flink_long}} is `Succeeded`.

**Note:** If the operator is installed into a specific namespace, then it will only appear under the associated project. If the operator is installed for all namespaces, then it will appear under any selected project. If the operator is installed for all namespaces and you select **all projects** from the **Project** dropdown, the operator will be shown multiple times in the resulting list, once for each project.

When the {{site.data.reuse.flink_long}} is installed, the following additional operators will appear in the installed operator list:

- Operand Deployment Lifecycle Manager.
- IBM Common Service Operator.


### Installing the {{site.data.reuse.ep_name}} operator

Ensure you have considered the {{site.data.reuse.ep_name}} operator [requirements](../prerequisites/#operator-requirements), including resource requirements and the required cluster-scoped permissions.

#### Installing the {{site.data.reuse.ep_name}} operator by using the web console

To install the operator by using the {{site.data.reuse.openshift_short}} web console, do the following:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand the **Operators** dropdown and select **OperatorHub** to open the **OperatorHub** dashboard.
3. Select the project that you want to deploy the {{site.data.reuse.ep_name}} instance in.
4. In the **All Items** search box, enter `Event Processing` to locate the operator title.
5. Click the **Event Processing** tile to open the install side panel.
6. Click the **Install** button to open the **Create Operator Subscription** dashboard.
7. Select the chosen [installation mode](#choose-the-operator-installation-mode) that suits your requirements.
   If the installation mode is **A specific namespace on the cluster**, select the target namespace that you created previously.
8. Click **Install** to begin the installation.

The installation can take a few minutes to complete.

#### Installing the {{site.data.reuse.ep_name}} operator by using the command line

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

3. Create a `Subscription` for the {{site.data.reuse.ep_name}} operator as follows:
   
   a. Create a YAML file similar to the following example:
   
   ```yaml
   apiVersion: operators.coreos.com/v1alpha1
   kind: Subscription
   metadata:
     name: ibm-eventprocessing
     namespace: <target-namespace>
   spec:
     channel: <current_channel>
     name: ibm-eventprocessing
     source: <catalog-source-name>
     sourceNamespace: openshift-marketplace
   ```

   Where:

   - `<target-namespace>` is the namespace where you want to install {{site.data.reuse.ep_name}} (`openshift-operators` if you are installing in all namespaces, or a custom name if you are installing in a specific namespace).
   - `<current_channel>` is the operator channel for the release you want to install (see the [support matrix]({{ 'support/matrix/#event-processing' | relative_url }})).
   - `<catalog-source-name>` is the name of the catalog source that was created for this operator. This is `ibm-eventprocessing` when installing a specific version by using a CASE bundle, or `ibm-operator-catalog` if the source is the IBM Operator Catalog.

   b. Save the file as `subscription.yaml`.

   c. Run the following command:

   ```shell
   oc apply -f subscription.yaml
   ```

#### Checking the operator status

- To see the installed operator and check its status by using the web console, complete the following steps:

  1. {{site.data.reuse.openshift_ui_login}}
  2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
  3. {{site.data.reuse.task_openshift_select_operator_ep}}
  4. Scroll down to the **ClusterServiceVersion details** section of the page.
  5. Check the **Status** field. After the operator is successfully installed, this will change to `Succeeded`.

  In addition to the status, information about key events that occur can be viewed under the **Conditions** section of the same page. After a successful installation, a condition with the following message is displayed: `install strategy completed with no errors`.

- To check the status of the installed operator by using the command line:

  ```shell
  oc get csv
  ```

  The command returns a list of installed operators. The installation is successful if the value in the `PHASE` column for your {{site.data.reuse.ep_name}} is `Succeeded`.

**Note:** If the operator is installed into a specific namespace, then it will only appear under the associated project. If the operator is installed for all namespaces, then it will appear under any selected project. If the operator is installed for all namespaces, and you select **all projects** from the **Project** dropdown, the operator will be shown multiple times in the resulting list, once for each project.


When the {{site.data.reuse.ep_name}} is installed, the following additional operators will appear in the installed operator list:

- Operand Deployment Lifecycle Manager.
- IBM Common Service Operator.

## Install a Flink instance

Instances of Flink can be created after the {{site.data.reuse.flink_long}} is installed. If the operator
was installed into **a specific namespace**, then it can only be used to manage instances of Flink in that namespace.

If the operator was installed for **all namespaces**, then it can be used to manage instances of Flink in any namespace,
including those created after the operator was deployed.

A Flink instance is installed by deploying the `FlinkDeployment` custom resource to a namespace managed by an instance of {{site.data.reuse.flink_long}}.


### Installing a Flink instance by using the web console

To install a Flink instance through the {{site.data.reuse.openshift_short}} web console, do the following:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. Expand the **Project** dropdown and select the project the instance is installed in. Click the operator
   called **{{site.data.reuse.flink_long}}** managing the project.

   **Note:** If the operator is not shown, it is either not installed or not available for the selected namespace.

4. In the **Operator Details** dashboard, click the **Flink Deployment** tab.
5. Click the **Create FlinkDeployment** button to open the **Create FlinkDeployment** panel. You can use this panel
   to define a `FlinkDeployment` custom resource.

From here you can install by using the [YAML view](#installing-a-flink-instance-using-the-yaml-view) or the [form view](#installing-a-flink-instance-by-using-the-form-view). For advanced configurations or to install one of the samples, see [installing by using the YAML view](#installing-a-flink-instance-using-the-yaml-view).

#### Installing a Flink instance using the YAML view

Alternatively, you can configure the `FlinkDeployment` custom resource by editing YAML documents. To do this, select **YAML view**.

A number of sample configurations are provided on which you can base your deployment. These range from quick start deployments for non-production development to large scale clusters ready to handle a production workload. Alternatively, a pre-configured YAML file containing the custom resource can be dragged and dropped onto this screen to apply the configuration.

To view the samples, complete the following steps:

1. Click the **Samples** tab to view the available sample configurations.
2. Click the **Try it** link under any of the samples to open the configuration in the **Create FlinkDeployment** panel.

More information about these samples is available in the [planning](../planning/#flink-sample-deployments) section.
You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring)
on top as required. You can also directly edit the custom resource YAML by clicking on the editor.

When modifying the sample configuration, the updated document can be exported from the **Create FlinkDeployment** panel
by clicking the **Download** button and re-imported by dragging the resulting file back into the window.

**Note:** If you experiment with {{site.data.reuse.flink_long}} and want a minimal CPU and memory footprint,
the **Quick Start** sample is the smallest and simplest example. For the smallest production setup, use the
**Minimal Production** sample configuration.

**Important:** All Flink samples except **Quick Start** use a `PersistentVolumeClaim` (PVC), which must be deployed manually as described in [planning](../planning/#deploying-the-flink-pvc).

**Important:** In all Flink samples, just as in any `FlinkDeployment` custom resource, accept the
license agreement(`spec.flinkConfiguration.license.accept: 'true'`), and set the required [licensing configuration parameters](https://ibm.biz/ea-license){:target="_blank"} for your deployment.

```yaml
spec:
  flinkConfiguration:
    license.use: <license-use-value>
    license.license: L-HRZF-DWHH7A
    license.accept: 'true'
```

Where `<license-use-value>` must be either `EventAutomationProduction` or `EventAutomationNonProduction`, depending on your case.

To deploy a Flink instance, use the following steps:

1. Complete any changes to the sample configuration in the **Create FlinkDeployment** panel.
2. Click **Create** to begin the installation process.
3. Wait for the installation to complete.

#### Installing a Flink instance by using the form view

**Note:** For advanced configurations, such as configuring parameters under `spec.flinkConfiguration`, see [installing by using the YAML view](#installing-a-flink-instance-using-the-yaml-view).

To configure a `FlinkDeployment` custom resource in the **Form view**, do the following:

1. Enter a name for the instance in the **Name** field.
2. You can optionally configure the fields such as **Job Manager**, **Task Manager**, or **Job** to suit your [requirements](../configuring).

   **Note:** Do not fill the fields **Flink Version** and **Image**, as they are automatically filled by {{site.data.reuse.flink_long}}.
3. Switch to the YAML view, accept the license agreement (`spec.flinkConfiguration.license.accept: 'true'`), and set the required [licensing configuration parameters](https://ibm.biz/ea-license){:target="_blank"} for your deployment.

   For example:

   ```yaml
   spec:
     flinkConfiguration:
       license.use: <license-use-value>
       license.license: L-HRZF-DWHH7A
       license.accept: 'true'
   ```

   Where `<license-use-value>` must be either `EventAutomationProduction` or `EventAutomationNonProduction`, depending on your deployment.


   **Note:** License configuration parameters for your Flink instance can only be set by using the YAML view.
4. Scroll down and click the **Create** button to deploy the Flink instance.
5. Wait for the installation to complete.

### Installing a Flink instance by using the CLI

To install an instance of Flink from the command-line, you must first prepare a `FlinkDeployment` custom resource configuration in a YAML file.

A number of sample configuration files are available in [GitHub](https://ibm.biz/ea-flink-samples){:target="_blank"}, where you can select the GitHub tag for your Flink version, and then go to `/cr-examples/flinkdeployment` to access the samples. These range from quick start deployments for non-production development to large scale clusters ready to handle a production workload.

**Important:** All Flink samples except **Quick Start** use a `PersistentVolumeClaim` (PVC), which must be deployed manually as described in [planning](../planning/#deploying-the-flink-pvc).

To deploy a Flink instance, run the following commands:

1. Prepare a `FlinkDeployment` custom resource in a YAML file by using the information provided in [Apache Flink documentation](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.6/docs/custom-resource/reference/#flinkdeployment-reference){:target="_blank"}.

   **Note:** Do not include the fields `spec.image` and `spec.flinkVersion`, as they are automatically included
   by {{site.data.reuse.flink_long}}. Also, accept the license agreement(`spec.flinkConfiguration.license.accept: 'true'`), and set the required [licensing configuration parameters](https://ibm.biz/ea-license){:target="_blank"} for your deployment.

   ```yaml
   spec:
     flinkConfiguration:
       license.use: <license-use-value>
       license.license: L-HRZF-DWHH7A
       license.accept: 'true'
   ```

   Where `<license-use-value>` must be either `EventAutomationProduction` or `EventAutomationNonProduction`, depending on your deployment.

2. Set the project where your `FlinkDeployment` custom resource will be deployed in:

   ```shell
   oc project <project-name>
   ```

3. Apply the configured `FlinkDeployment` custom resource:

   ```shell
   oc apply -f <custom-resource-file-path>
   ```

   For example:

   ```shell
   oc apply -f flinkdeployment_demo.yaml
   ```

4. Wait for the installation to complete.

## Install an {{site.data.reuse.ep_name}} instance

Instances of {{site.data.reuse.ep_name}} can be created after the {{site.data.reuse.ep_name}} operator is installed. If the operator was installed into **a specific namespace**, then it can only be used to manage instances of {{site.data.reuse.ep_name}} in that namespace. If the operator was installed for **all namespaces**, then it can be used to manage instances of {{site.data.reuse.ep_name}} in any namespace, including those created after the operator was deployed.

When installing an instance of {{site.data.reuse.ep_name}}, ensure you are using a namespace that an operator is managing.

### Retrieving the Flink REST endpoint

To retrieve the REST endpoint URL, do the following:

1. Expand **Networking** in the navigation on the left, and select **Services**.
2. Select your service to open **Service details**.
3. Your endpoint URL is hostname and port separated by colon(:). For example, if your hostname is `my-flink-rest.namespace.svc.cluster.local` and the port is `8081`, your REST endpoint URL is `my-flink-rest.namespace.svc.cluster.local:8081`.

### Installing an {{site.data.reuse.ep_name}} instance by using the web console

To install an {{site.data.reuse.ep_name}} instance through the {{site.data.reuse.openshift_short}} web console, do the following:

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. Expand the **Project** dropdown and select the project the instance is installed in. Click the operator called **IBM Event Processing** managing the project.

   **Note:** If the operator is not shown, it is either not installed or not available for the selected namespace.

4. In the **Operator Details** dashboard, click the **{{site.data.reuse.ep_name}}** tab.
5. Click the **Create EventProcessing** button to open the **Create EventProcessing** panel. You can use this panel to define an `EventProcessing` custom resource.

From here you can install by using the [YAML view](#installing-an-event-processing-instance-by-using-the-yaml-view) or the [form view](#installing-an-event-processing-instance-by-using-the-form-view). For advanced configurations or to install one of the samples, see [installing by using the YAML view](#installing-an-event-processing-instance-by-using-the-yaml-view).

#### Installing an {{site.data.reuse.ep_name}} instance by using the YAML view

You can configure the `EventProcessing` custom resource by editing YAML documents. To do this, select **YAML view**.

A number of sample configurations are provided on which you can base your deployment. These range from smaller deployments for non-production development or general experimentation to large scale clusters ready to handle a production workload. Alternatively, a pre-configured YAML file containing the custom resource sample can be dragged and dropped onto this screen to apply the configuration.

To view the samples, complete the following steps:

1. Click the **Samples** tab to view the available sample configurations.
2. Click the **Try it** link under any of the samples to open the configuration in the **Create EventProcessing** panel.

More information about these samples is available in the [planning](../planning/#event-processing-sample-deployments) section. You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring) as required.

**Note:** If experimenting with {{site.data.reuse.ep_name}} for the first time, the **Quick Start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.

When modifying the sample configuration, the updated document can be exported from the **Create EventProcessing** panel by clicking the **Download** button and re-imported by dragging the resulting file back into the window. You can also directly edit the custom resource YAML by clicking on the editor.

When modifying the sample configuration, ensure that the following fields are updated:

- [Flink REST endpoint](#retrieving-the-flink-rest-endpoint) in the `spec.flink.endpoint` field.

- `spec.license.accept` field in the custom resource YAML is set to `true`, and that the [correct values are selected]({{ 'support/licensing' | relative_url }}) for the `spec.license.license` and `spec.license.use` fields before deploying the {{site.data.reuse.ep_name}} instance. See the [licensing]({{ 'support/licensing' | relative_url }}) section for more details about selecting the correct value.


To deploy an {{site.data.reuse.ep_name}} instance, use the following steps:

1. Complete any changes to the sample configuration in the **Create EventProcessing** panel.
2. Click **Create** to begin the installation process.
3. Wait for the installation to complete.
4. You can now verify your installation and consider other [post-installation tasks](../post-installation/).

#### Installing an {{site.data.reuse.ep_name}} instance by using the form view

Alternatively, you can configure an `EventProcessing` custom resource using the interactive form.  You can load
samples into the form and then edit as required.

To view a sample in the form view, complete the following steps:

1. Select **YAML view** in the **Configure via** section at the top of the form.
2. Click the **Samples** tab to view the available sample configurations.
3. Click the **Try it** link under any of the samples.
4. Select **Form view** in the **Configure via** section to switch back to the form view with the data from the sample populated.
5. Edit as required.

**Note:** If experimenting with {{site.data.reuse.ep_name}} for the first time, the **Quick Start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.


To configure an `EventProcessing` custom resource,  complete the following steps:

1. Enter a name for the instance in the **Name** field.
2. Under **License Acceptance**, select the **accept** checkbox.
3. Ensure that the [correct values]({{ 'support/licensing' | relative_url }}) for **License** and **Use** are entered.
4. Under **Flink**, enter the [Flink REST endpoint](#retrieving-the-flink-rest-endpoint) in the **flink > endpoint** text-box.
5. You can optionally configure other components such as **storage**, and **TLS** to suit your [requirements](../configuring).
6. Scroll down and click the **Create** button to deploy the {{site.data.reuse.ep_name}} instance.
7. Wait for the installation to complete.
8. You can now verify your installation and consider other [post-installation tasks](../post-installation/).

### Installing an {{site.data.reuse.ep_name}} instance by using the CLI

To install an instance of {{site.data.reuse.ep_name}} from the command-line, you must first prepare an `EventProcessing` custom resource configuration in a YAML file.

A number of sample configuration files are available in [GitHub](https://ibm.biz/ea-ep-samples){:target="_blank"}, where you can select the GitHub tag for your {{site.data.reuse.ep_name}} version, and then go to `/cr-examples/eventprocessing` to access the samples. These sample configurations range from smaller deployments for non-production development or general experimentation to large scale clusters ready to handle a production workload.

More information about these samples is available in the [planning](../planning/#event-processing-sample-deployments) section. You can base your deployment on the sample that most closely reflects your requirements and apply [customizations](../configuring) as required.

**Note:** If experimenting with {{site.data.reuse.ep_name}} for the first time, the **Quick Start** sample is the smallest and simplest example that can be used to create an experimental deployment. For a production setup, use the **Production** sample configuration.

When modifying the sample configuration, ensure that the following fields are updated:

- [Flink REST endpoint](#retrieving-the-flink-rest-endpoint) in the `spec.flink.endpoint` field.

- `spec.license.accept` field in the custom resource YAML is set to `true`, and that the [correct values are selected]({{ 'support/licensing' | relative_url }}) for the `spec.license.license` and `spec.license.use` fields before deploying the {{site.data.reuse.ep_name}} instance.

To deploy an {{site.data.reuse.ep_name}} instance, run the following commands:

1. Set the project where your `EventProcessing` custom resource will be deployed in:

   ```shell
   oc project <project-name>
   ```

2. Apply the configured `EventProcessing` custom resource:

   ```shell
   oc apply -f <custom-resource-file-path>
   ```

   For example:

   ```shell
   oc apply -f production.yaml
   ```

3. Wait for the installation to complete.
4. You can now verify your installation and consider other [post-installation tasks](../post-installation/).
