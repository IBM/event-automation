---
title: "Event Gateway pods fail after upgrading with MissingElementException error"
excerpt: "When integrated with IBM API Connect, Event Gateway pods fail after upgrading Event Endpoint Management to 11.1.0."
categories: troubleshooting
slug: gateway-pods-fail
toc: true
---

## Symptoms

When integrated with {{site.data.reuse.apic_long}}, {{site.data.reuse.egw}} pods fail after upgrading {{site.data.reuse.eem_name}} to 11.1.0. The {{site.data.reuse.eem_manager}} logs display the following `MissingElementException` error:

```shell
ERROR com.ibm.ei.data.core.AdminManager - [lambda$getOrganization$101:574]
com.ibm.ei.core.utils.MissingElementException: MissingElementException{path='contact'}
```

## Causes

The `Subscription` data that is created by using {{site.data.reuse.apic_short}} is not migrated as expected when upgrading your {{site.data.reuse.eem_manager}} instance.

## Resolving the problem

To resolve the problem, complete the following steps:

1. {{site.data.reuse.cncf_cli_login}}
2. Ensure you are in the namespace where your {{site.data.reuse.eem_manager}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```

3. Run the following command to display the {{site.data.reuse.eem_manager}} instances:

   ```shell
   kubectl get eventendpointmanagement
   ```

4. Remove the `opt/storage/APIC` directory:

   ```shell
   rm -rf opt/storage/APIC
   ```

5. Run the following command to delete your {{site.data.reuse.eem_manager}} pod:

   ```shell
   kubectl delete pod <pod-name> -n <namespace>
   ```

The `MissingElementException` error is resolved when the pod restarts.