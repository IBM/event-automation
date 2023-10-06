---
title: "Problems downloading the CASE bundle"
excerpt: "Downloading CASE bundle for offline OpenShift installation or to install Event Endpoint Management version 11.0.4 specifically fails with an error message, or produces warnings."
categories: troubleshooting
slug: download-case-fails
toc: true
---

## Symptoms

- When [downloading the CASE bundle](../../installing/offline/#download-the-case-bundle) in preparation for installing {{site.data.reuse.eem_name}} on OpenShift in an offline environment, or to install version 11.0.4 specifically, the download fails with the following error:
   
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

- Downloading the CASE bundle might also result in the following warning messages that can be safely ignored:
   
   ```
   [WARNING]: no digest file found for case "ibm-eventendpointmanagement" so unable to check helm reference "ibm-eem-operator-crd" in inventory item "eemOperatorSetup"
   [WARNING]: no digest file found for case "ibm-eventendpointmanagement" so unable to check helm reference "ibm-eem-operator" in inventory item "eemOperatorSetup"
   ```

## Causes

A known issue in the code means the URL for the IBM Cloud repository is incorrect, causing the download to fail as it cannot locate the required repository. This is only an issue in {{site.data.reuse.eem_name}} CASE version 11.0.4.

## Resolving the problem

To resolve the problem, ensure you download and use {{site.data.reuse.eem_name}} CASE version 11.0.5 or later.
