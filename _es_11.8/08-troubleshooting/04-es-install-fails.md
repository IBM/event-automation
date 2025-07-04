---
title: "Event Streams installation reports `Blocked` status"
excerpt: "Installation of Event Streams instance reports a failed status when IBM Cloud Pak for Integration is not installed."
categories: troubleshooting
slug: es-install-fails
toc: true
---

## Symptoms

When installing a new instance of {{site.data.reuse.es_name}} on an {{site.data.reuse.openshift_short}} cluster, installation fails with status of the {{site.data.reuse.es_name}} instance as `Blocked`.

The following condition message related to {{site.data.reuse.cp4i}} is displayed in the status of the instance:

  ```terminal
  This instance requires IBM Cloud Pak for Integration operator version 7.2.0 or later.
  Install the required version of the IBM Cloud Pak for Integration operator as described in https://ibm.biz/int-docs.
  This instance will remain in the `Blocked` status until the correct operator version is installed.
  ```

## Causes

There could be several reasons, for example, you are trying to install your instance with Keycloak authentication, but {{site.data.reuse.cp4i}} is not installed in your cluster.


## Resolving the problem

Based on your requirements, [install](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.2?topic=installing){:target="_blank"} {{site.data.reuse.cp4i}} before installing an instance of {{site.data.reuse.es_name}}.
