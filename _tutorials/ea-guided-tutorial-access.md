---
title: "Accessing the tutorial environment"
description: "Learn how to access the web interfaces and connection details for the tutorial environment in IBM Event Automation."
permalink: "/tutorials/guided/tutorial-access"
toc: true
section: "Guided tutorials for IBM Event Automation"
cardType: "large"
order: 1
---

This page contains details for how to access the connection details for {{site.data.reuse.ea_long}} deployments created by using the [tutorial environment setup](./tutorial-0).

## Web interfaces

The tutorial environment includes a deployment of an admin web interface for each of the three {{ site.data.reuse.ea_short }} capabilities. This section explains how you can find the URL and login credentials for accessing them.

### Event Streams

#### URL

To access the {{ site.data.reuse.es_name }} UI, follow these steps to locate the web address in the OpenShift console.

1. From the **Administrator** view in the OpenShift console, navigate to **Operators** > **Installed Operators**.

1. Set the **Project** to `event-automation`.

1. Click the **IBM Event Streams** Operator.

1. Navigate to the **Event Streams** tab, and click the `my-kafka-cluster` item.

1. The web address for the {{ site.data.reuse.es_name }} UI is shown as **Admin UI**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-1.png "OpenShift Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-1.png "OpenShift Console")

#### Login credentials

To log in to the {{site.data.reuse.es_name}} UI, use the default `es-admin` username and follow these steps to retrieve the password from the OpenShift console or by using the CLI.

1. The username for accessing this UI is **`es-admin`**.

1. To find the password for accessing the UI, view the contents of the `password` value of the **es-admin** secret in the `event-automation` project.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-2.png "OpenShift Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-2.png "OpenShift Console")


Alternatively, you can retrieve the {{site.data.reuse.es_name}} UI URL and the password by using the `oc` [CLI](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html#cli-logging-in_cli-developer-commands){:target=\"_blank\"}:

```sh
# URL
oc get route \
    my-kafka-cluster-ibm-es-ui \
    -n event-automation \
    -o jsonpath='https://{.spec.host}'

# password for 'es-admin' user
oc get secret \
    es-admin \
    -n event-automation \
    -o jsonpath='{.data.password}' | base64 -d
```

### Event Endpoint Management

#### URL

To access the {{site.data.reuse.eem_name}} UI, follow these steps to locate the web address in the OpenShift console.

1. From the **Administrator** view in the OpenShift console, navigate to **Operators** > **Installed Operators**.

1. Set the **Project** to `event-automation`.

1. Click the **IBM Event Endpoint Management** Operator.

1. Navigate to the **Event Endpoint Management** tab, and click the `my-eem-manager` item.

1. The web address for the {{ site.data.reuse.eem_name }} UI is shown as **UI Endpoint URI**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-3.png "OpenShift Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-3.png "OpenShift Console")

#### Login credentials

To log in to the {{site.data.reuse.eem_name}} UI, use the default `eem-admin` username and follow these steps to retrieve the password from the OpenShift console or by using the CLI.

1. The username for accessing this UI is **`eem-admin`**.

1. To find the password for accessing the UI, view the contents of the `user-credentials.json` value of the  **my-eem-manager-ibm-eem-user-credentials** secret in the `event-automation` project.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-4.png "OpenShift Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-4.png "OpenShift Console")


Alternatively, you can retrieve the {{site.data.reuse.eem_name}} UI URL and the password by using the `oc` [CLI](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html#cli-logging-in_cli-developer-commands){:target=\"_blank\"}:

```sh
# URL
oc get route \
    my-eem-manager-ibm-eem-manager \
    -n event-automation \
    -o jsonpath='https://{.spec.host}'

# password for 'eem-admin' user
oc get secret \
    my-eem-manager-ibm-eem-user-credentials \
    -n event-automation \
    -o jsonpath='{.data.user-credentials\.json}' | base64 -d
```

### Event Processing

#### URL

To access the {{site.data.reuse.ep_name}} UI, follow these steps to locate the web address in the OpenShift console.

1. From the **Administrator** view in the OpenShift console, navigate to **Operators** > **Installed Operators**.

1. Set the **Project** to `event-automation`.

1. Click the **IBM Event Processing** Operator.

1. Navigate to the **EventProcessing** tab, and click the `my-event-processing` item.

1. The web address for the {{ site.data.reuse.eem_name }} UI is shown as **UI Endpoint URI**.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-5.png "OpenShift Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-5.png "OpenShift Console")

#### Login credentials

To log in to the {{site.data.reuse.ep_name}} UI, use the default `ep-admin` username and follow these steps to retrieve the password from the OpenShift console or by using the CLI.

1. The username for accessing this UI is **`ep-admin`**.

1. To find the password for accessing the UI, view the contents of the `user-credentials.json` value of the  **my-event-processing-ibm-ep-user-credentials** secret in the `event-automation` project.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-6.png "OpenShift Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-6.png "OpenShift Console")


Alternatively, you can retrieve the {{site.data.reuse.ep_name}} UI URL and the password by using the `oc` [CLI](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html#cli-logging-in_cli-developer-commands){:target=\"_blank\"}:

```sh
# URL
oc get route \
    my-event-processing-ibm-ep-rt \
    -n event-automation \
    -o jsonpath='https://{.spec.host}'

# password for 'ep-admin' user
oc get secret \
    my-event-processing-ibm-ep-user-credentials \
    -n event-automation \
    -o jsonpath='{.data.user-credentials\.json}' | base64 -d
```

## Accessing Kafka topics

Some of the tutorials involve configuring a Kafka application. The tutorial playbook automatically sets up credentials that you can use for this.

1. The username for Kafka applications is **`kafka-demo-apps`**.

1. To find the password, view the contents of the `password` value of the **kafka-demo-apps** secret in the `event-automation` project.


   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-6.png "OpenShift Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-6.png "OpenShift Console")

Alternatively, you can retrieve the Kafka application password by using the `oc` [CLI](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html#cli-logging-in_cli-developer-commands){:target=\"_blank\"}:

```sh
oc get secret \
    kafka-demo-apps \
    -n event-automation \
    -o jsonpath='{.data.password}' | base64 -d
```

## Accessing PostgreSQL database tables

Some of the tutorials involve enriching Kafka events by using reference data from a PostgreSQL database. An [optional tutorial playbook](../guided/tutorial-0#postgresql-database) automatically creates this database, and credentials that you can use to access it.

1. The database is called **`pgsqldemo`**.

1. The username is **`demouser`**.

1. To find the JDBC connection string, copy the contents of the `jdbc-uri` value of the **pgsqldemo-pguser-demouser** Secret in the `event-automation` project.

   [![screenshot]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-8.png "OpenShift Console"){: class="tutorial-screenshot" }]({{ 'images' | relative_url }}/ea-tutorials/tutorial-0-8.png "OpenShift Console")

Alternatively, you can retrieve the JDBC connection string by using the `oc` [CLI](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html#cli-logging-in_cli-developer-commands){:target=\"_blank\"}:

```sh
oc get secret \
    pgsqldemo-pguser-demouser \
    -n event-automation \
    -o jsonpath='{.data.jdbc\-uri}' | base64 -d
```

## Accessing Grafana dashboards

Some of the tutorials involve using Grafana dashboards to visualize key Event Automation metrics. An [optional tutorial playbook](../guided/tutorial-0#monitoring) automatically creates a Grafana installation, and credentials that you can use to access the dashboard.

#### URL

Find the OpenShift route that provides access to the Grafana dashboard.

1. From the **Administrator** view in the OpenShift console, navigate to **Networking** > **Routes**.

1. Set the **Project** to `event-automation`.

1. Navigate to the **event-automation-route** route, and click the link in the **Location** column.

#### login credentials

Retrieve the password from the OpenShift console.

1. The username for accessing this UI is **`admin`**.

1. From the **Administrator** view in the OpenShift console, navigate to **Operators** > **Installed Operators**.

1. Set the **Project** to `event-automation`.

1. Click the **Grafana** Operator.

1. Navigate to the **Grafana** tab, and click the `event-automation` item.

1. Click on the YAML tab.

1. The admin password will be displayed at `spec.config.security.admin_password`.


Alternatively, you can retrieve the Grafana dashboard URL and password by using the `oc` [CLI](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html#cli-logging-in_cli-developer-commands){:target=\"_blank\"}:

```sh
# URL
oc get route \
    event-automation-route \
    -n event-automation \
    -o jsonpath='https://{.spec.host}'

# password for 'admin' user
oc get grafana \
    event-automation \
    -n event-automation \
    -o jsonpath='{.spec.config.security.admin_password}'
```
