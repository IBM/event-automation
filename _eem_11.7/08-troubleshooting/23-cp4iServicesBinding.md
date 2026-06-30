---
title: "Event Endpoint Management operator unable to reconcile custom resource"
excerpt: "The Event Endpoint Management instance fails with a timeout error when attempting to reconcile the EventEndpointManagement custom resource."
categories: troubleshooting
slug: cp4i-service-binding
toc: true
---

## Symptoms

On {{site.data.reuse.eem_name}} deployments with {{site.data.reuse.cp4i}}, the {{site.data.reuse.eem_name}} operator fails with a timeout. 

You might see the following error message in the operator logs:

```
Caused by: com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException: Unrecognized field "integrationMonitoring" (class com.ibm.cp4i.v1.cp4iservicesbindingstatus.Metadata), not marked as ignorable (4 known properties: "UIEndpoint", "coreNamespace", "integrationKeycloak", "uiendpoint")
at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 2080]
```

## Causes

An update to the `Cp4iServicesBinding` in {{site.data.reuse.cp4i}} 16.2.0 and later is not compatible with {{site.data.reuse.eem_name}} versions 11.7.x and earlier versions.

## Resolving the problem

Upgrade to {{site.data.reuse.eem_name}} version 11.8.0 or later. For more information about the supported operator and instance versions in {{site.data.reuse.cp4i}}, see the [Cloud Pak documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.2.0?topic=reference-operator-instance-versions-this-release){:target="_blank"}.
