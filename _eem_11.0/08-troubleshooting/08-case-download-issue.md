---
title: "CASE bundle download fails"
excerpt: "Downloading CASE bundle for offline OpenShift installation fails with a no repositories found error."
categories: troubleshooting
slug: download-case-fails
toc: true
---

## Symptoms

When [downloading the CASE bundle](../../installing/offline/#download-the-case-bundle) in preparation for installing on OpenShift in an offline environment, the download fails with the following error:

```shell
Downloading and extracting the CASE ...
- Success
Retrieving CASE version ...
- Success
Validating the CASE ...
Validating the signature for the ibm-eventendpointmanagement CASE...
- Success
Creating inventory ...
- Success
Finding inventory items
- Success
Resolving inventory items ...
Parsing inventory items
Error: No Helm repositories found for chart ibm-eem-operator-crd-v11.0.4.tgz with the given repository URL information
```

## Causes

A known issue in the code means the URL for the IBM Cloud repository is incorrect, causing the download to fail as it cannot locate the required repository.

## Resolving the problem

To resolve the problem, set the following environment variable before downloading the CASE bundle:

```shell
   export CASECTL_RESOLVE_CHARTS=false
```

**Tip:** You can do this as part of setting environment variables in step 1 of [downloading the CASE bundle](../../installing/offline/#download-the-case-bundle):

```shell
   export CASE_NAME=ibm-eventendpointmanagement && export CASE_VERSION={{site.data.reuse.eem_current_version}} && export CASE_INVENTORY_SETUP=eemOperatorSetup && export CASECTL_RESOLVE_CHARTS=false
```