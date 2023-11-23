---
title: "Set up the environment"
description: "Quickly create a demo Event Automation environment, including topics with live streams of events that you can use to try the tutorials."
permalink: /tutorials/guided/tutorial-0
toc: true
section: "Guided tutorials for IBM Event Automation"
cardType: "large"
order: 0
---

{% include video.html videoSource="videos/tutorials/guided/00-setup.mp4" %}{: class="tutorial-video" }

## Overview

To help you start exploring the features of {{ site.data.reuse.ea_long }}, the tutorial includes a small selection of topics with a live stream of events that are ready to use.

This page outlines how to set up and access the tutorial environment on your own {{ site.data.reuse.openshift_short }} cluster.

The tutorial topics simulate aspects of a clothing retailer, with topics relating to sales, stock management, and employee activities. Messages on the topics are consistent (for example, events on the topic for cancelled orders use order IDs that are used in events on the orders topic) to allow you to experiment with joining and correlating events from different topics. Some topics include events that are intentionally delayed, duplicated, or produced out of sequence, to allow you to learn how to use {{ site.data.reuse.ea_short }} to correctly process topics like this.

![screenshot]({{ 'images' | relative_url }}/ea-tutorials/scenario.png "Loosehanger scenario")

## Scope

This tutorial environment is not intended to demonstrate a production deployment. It is a quick and simple instance of {{ site.data.reuse.ea_short }} for learning some of the key features. There is no persistent storage, and the deployment uses hard-coded username/passwords.

## Before you begin

### Entitled Registry key

1. Obtain an entitlement key from the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}.

### Tutorial playbook

1. Clone the [event-automation-demo](https://github.com/IBM/event-automation-demo){:target="_blank"} Github repository.

1. Install **Python** and pip on the computer that you will use to run the tutorial playbook.

1. Install **Ansible** on the computer that you will use to run the tutorial playbook.

    If you are using MacOS, you can use [homebrew](https://formulae.brew.sh/formula/ansible){:target="_blank"}.
    Alternatively, you can use a [Python installer](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-and-upgrading-ansible){:target="_blank"}.

    Include the `kubernetes.core` and `community.general` collections:

    ```sh
    ansible-galaxy collection install kubernetes.core
    ansible-galaxy collection install community.general
    ```

### Red Hat OpenShift

You need a {{ site.data.reuse.openshift }} cluster to run the tutorial.

1. {{site.data.reuse.openshift_ui_login}}

    Access to the OpenShift Console will make the following steps easier.

1. {{site.data.reuse.openshift_cli_login}}

    You need to be logged in to run the `ansible-playbook` command in the following step.

## Deploy the tutorial

```sh
ansible-playbook \
    -e license_accept=<true if you accept the IBM EA license> \
    -e install_certmgr=<true if you need a certificate manager> \
    -e ibm_entitlement_key=<your Entitled Registry key> \
    -e eventautomation_namespace=event-automation \
    install/event-automation.yaml
```

### `license_accept`

Set this to `true` if you accept the terms of the {{ site.data.reuse.ea_short }} license. This value is used for each of the components that the playbook installs.

### `install_certmgr`

{{site.data.reuse.ea_long}} requires a certificate manager operator to create and manage SSL/TLS certificates. If you already have a certificate manager operator, you can use that for the tutorial.

Review the installed operators in your OpenShift cluster for operators with names such as IBM Cert Manager.

If you don't have an existing certificate manager operator, set `install_certmgr` to `true`.

Otherwise, you can omit this value or set it to `false` to use your existing operator.

### `ibm_entitlement_key`

Set this to the key you created in the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}.

### `eventautomation_namespace`

Setting this to `event-automation` will install a new instance of all the components of {{site.data.reuse.ea_short}} into the `event-automation` namespace. The namespace will be created if it does not already exist.

### Other options

For details about the other deployment options for the tutorial environment, see the [README.md](https://github.com/IBM/event-automation-demo/blob/main/README.md){:target="_blank"} file for the demo playbook. These include being able to deploy the tutorial cluster with persistent storage, or customizing the simulated events that are generated.

For example, if you are deploying into an {{site.data.reuse.openshift_short}} running in IBM Cloud, you can deploy the tutorial cluster using persistent storage by running:

```sh
ansible-playbook \
    -e license_accept=true \
    -e install_certmgr=true \
    -e ibm_entitlement_key=<your Entitled Registry key> \
    -e eventautomation_namespace=event-automation \
    -e eventstreams_storage_class=ibmc-block-gold \
    -e eventendpointmanagement_storage_class=ibmc-block-bronze \
    -e eventprocessing_storage_class=ibmc-block-bronze \
    install/event-automation.yaml
```


## Populating the catalog

The tutorials depend on being able to discover and use Kafka topics in the {{ site.data.reuse.eem_name }} catalog. To prepare the cluster for the tutorials, you will need to add the demo topics to the catalog.

The `reset-all-data.sh` script in the `eem-seed` folder of the event-automation-demo repository will populate the catalog with documentation for the tutorial topics.

You need an [API access token]({{ '/eem/security/api-tokens#creating-a-token' | relative_url }}) to run the script.

```sh
./eem-seed/reset-all-data.sh event-automation <access-token>
```

You need to be logged in to run `oc` commands to run the script.



## Accessing the tutorial environment

Details of how to access the deployed tutorial environment can be found in [Accessing the tutorial environment](./tutorial-access) which includes how to find the URLs and the correct usernames and passwords to use.



## Deploying optional components

Some of the tutorials demonstrate how {{ site.data.reuse.ea_long }} can be used with other technologies. These are not deployed by default, so you need to run the following additional playbooks to follow those tutorials.

The options for these are the same as for [deploying the default tutorial environment](#deploy-the-tutorial).

### IBM MQ

To create an IBM MQ queue manager:

```sh
ansible-playbook \
    -e license_accept=<true if you accept the IBM EA license> \
    -e ibm_entitlement_key=<your Entitled Registry key> \
    -e eventautomation_namespace=event-automation \
    install/supporting-demo-resources/mq/install.yaml
```

**Note**: The previous command installs {{site.data.reuse.icpfs}}, which requires a default storage class to be available on your OpenShift cluster.

### IBM App Connect

To create an IBM App Connect Designer environment:

```sh
ansible-playbook \
    -e license_accept=<true if you accept the IBM EA license> \
    -e ibm_entitlement_key=<your Entitled Registry key> \
    -e eventautomation_namespace=event-automation \
    install/supporting-demo-resources/appconnect/install.yaml
```

### PostgreSQL database

To create a PostgreSQL database:

```sh
ansible-playbook \
    -e license_accept=true \
    -e ibm_entitlement_key=YOUR-ENTITLEMENT-KEY \
    -e eventautomation_namespace=event-automation \
    install/supporting-demo-resources/pgsql/install.yaml
```

## Next step

In the [next tutorial](./tutorial-1), you will start to use your new {{ site.data.reuse.ea_short }} deployment.
