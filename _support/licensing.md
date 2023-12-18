---
title: "Licensing reference"
description: "Find out more about IBM Event Automation licenses."
permalink: /support/licensing/
toc: true
section: "IBM Event Automation support"
cardType: "large"
order: 3
layout: pagesInsideCollection
---

Find out more about {{site.data.reuse.ea_long}} licenses and related topics. 

**Important:** {{site.data.reuse.ea_short}} requires the IBM License Service to be installed. For more information see [tracking license usage](#tracking-license-usage).

## Available licenses

Your use of {{site.data.reuse.ea_long}} and its capabilities must conform to the license agreement that you purchased.

The following sections list license information that must be specified when you create an {{site.data.reuse.es_name}}, {{site.data.reuse.eem_name}}, or {{site.data.reuse.ep_name}} instance. The required license depends on the program that you purchased and the intended use.

From the relevant table in the sections that follow, choose the value for the following parameters that matches your license agreement.

- The license ID (`spec.license.license`) field must contain the license identifier (ID) for the program that you purchased.
- The license use (`spec.license.use`) field must match the intended product usage that you purchased.
- The license acceptance (`spec.license.accept`) field must be set to `true` to indicate the acceptance of the license agreement and to proceed with installation.
- The license metric (`spec.license.metric`) field is the charging metric for the license that you purchased.
  
  **Note:** `spec.license.metric` field is an available option only in {{site.data.reuse.eem_name}}. You can deploy {{site.data.reuse.eem_name}} with a usage-based license, where usage is tracked and charged by the number of API calls handled by {{site.data.reuse.eem_name}}. Usage is reported automatically to the [IBM License Service](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=reporting-viewing-tracking-license-usage){:target="_blank"}, where usage can be tracked, monitored, and audited. Setting license metric (`spec.license.metric`) to `MONTHLY_API_CALL` and License ID (`spec.license.license`) to `{{site.data.reuse.eem_ubp_license_id}}` configures the usage-based license, and sets {{site.data.reuse.eem_name}} to automatically track API usage.

  
  **Note:** For {{site.data.reuse.flink_long}}, the license configuration parameters to include in the `FlinkDeployment` custom resource are the following:

   ```yaml
   spec:
     flinkConfiguration:
       license.use: <license-use-value>
       license.license: L-HRZF-DWHH7A
       license.accept: 'true'
   ```
Where `<license-use-value>` must match the intended product usage that you purchased.
  

### {{site.data.reuse.ea_long}} license information

| Program   | Included capabilities  | License ID (`spec.license.license`) | License use <br> (`spec.license.use`) | License metric <br> (`spec.license.metric`) | 
----------|------------------------|-----------------------------------------|--------------------------------------|--------------------------------------------|
| {{site.data.reuse.ea_long}} 1.0.0.0 |  - Event Streams <br><br> - Event Endpoint Management <br><br> - Event processing | [**L-HRZF-DWHH7A**](https://www.ibm.com/support/customer/csol/terms/?id=L-HRZF-DWHH7A&lc=en#detail-document){:target="_blank"}  | - `EventAutomationNonProduction:` <br> For non-production deployments suitable for basic development and test activities. <br> <br> - `EventAutomationProduction:` <br>  For production deployments. |  N/A |

### {{site.data.reuse.cp4i}} license information

| Program   | Included capabilities  | License ID (`spec.license.license`) | License use (`spec.license.use`) | License metric (`spec.license.metric`) | 
----------|------------------------|-----------------------------------------|--------------------------------------|--------------------------------------------|
{{site.data.reuse.cp4i}} 2023.4.1 Standard <br> <br> For more information, see the [{{site.data.reuse.cp4i}} documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=planning-licensing){:target="_blank"}. | - Event Streams <br> <br> - Event Endpoint Management | [**L-VTPK-22YZPK**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-VTPK-22YZPK){:target="_blank"} |  -`CloudPakForIntegrationNonProduction:` <br> For non-production deployments suitable for basic development and test activities. <br> <br> -`CloudPakForIntegrationProduction:` <br> For production deployments.  | `VIRTUAL_PROCESSOR_CORE` <br><br> **Note:** Only an option for {{site.data.reuse.eem_name}}.
{{site.data.reuse.cp4i}} 2023.4.1 API Calls  <br> <br> For more information, see the [{{site.data.reuse.cp4i}} documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=planning-licensing){:target="_blank"}. | - Event Endpoint Management | [**{{site.data.reuse.eem_ubp_license_id}}**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum={{site.data.reuse.eem_ubp_license_id}}){:target="_blank"} | -`CloudPakForIntegrationNonProduction:` <br> For non-production deployments suitable for basic development and test activities. <br> <br> -`CloudPakForIntegrationProduction:` <br> For production deployments. | `MONTHLY_API_CALL` <br><br> **Note:** Only an option for {{site.data.reuse.eem_name}}. <br> <br> Setting this metric and the related license ID configures the usage-based license. <br> <br> **Note:** For more information about what is charged when using the `MONTHLY_API_CALL` license reporting metric with {{site.data.reuse.eem_name}}, see [the {{site.data.reuse.eem_name}} usage-based pricing example]({{ 'eem/installing/planning/#example-deployment-usage-based-pricing' | relative_url }}).
{{site.data.reuse.cp4i}} 2023.2.1 Standard <br> <br> For more information, see the [{{site.data.reuse.cp4i}} documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.2?topic=planning-licensing){:target="_blank"}. | - Event Streams <br> <br> - Event Endpoint Management | [**L-YBXJ-ADJNSM**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-YBXJ-ADJNSM){:target="_blank"} |  -`CloudPakForIntegrationNonProduction:` <br> For non-production deployments suitable for basic development and test activities. <br> <br> -`CloudPakForIntegrationProduction:` <br> For production deployments.  | `VIRTUAL_PROCESSOR_CORE` <br><br> **Note:** Only an option for {{site.data.reuse.eem_name}}.
{{site.data.reuse.cp4i}} 2023.2.1 API Calls  <br> <br> For more information, see the [{{site.data.reuse.cp4i}} documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.2?topic=planning-licensing){:target="_blank"}. | - Event Endpoint Management | [**L-NRHE-WFD7EY**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-NRHE-WFD7EY){:target="_blank"} | -`CloudPakForIntegrationNonProduction:` <br> For non-production deployments suitable for basic development and test activities. <br> <br> -`CloudPakForIntegrationProduction:` <br> For production deployments. | `MONTHLY_API_CALL` <br><br> **Note:** Only an option for {{site.data.reuse.eem_name}}. <br> <br> Setting this metric and the related license ID configures the usage-based license. <br> <br> **Note:** For more information about what is charged when using the `MONTHLY_API_CALL` license reporting metric with {{site.data.reuse.eem_name}}, see [the {{site.data.reuse.eem_name}} usage-based pricing example]({{ 'eem/installing/planning/#example-deployment-usage-based-pricing' | relative_url }}).
| {{site.data.reuse.cp4i}} 2023.2.1 Reserved or limited <br> <br> For more information, see the [{{site.data.reuse.cp4i}} documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.2?topic=planning-licensing)  | Event Streams   |  [**L-PYRA-849GYQ**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-PYRA-849GYQ){:target="_blank"}  |  -`CloudPakForIntegrationNonProduction:` <br> For non-production deployments suitable for basic development and test activities. <br> <br> -`CloudPakForIntegrationProduction:` <br> For production deployments.    | N/A
| {{site.data.reuse.cp4i}} 2022.4.1 Reserved or limited | &nbsp; | [**L-RJON-CJR2TC**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-RJON-CJR2TC){:target="_blank"} | &nbsp; | &nbsp;
| {{site.data.reuse.cp4i}} 2022.2.1 | &nbsp; | [**L-RJON-CD3JKX**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-RJON-CD3JKX){:target="_blank"} | &nbsp; | &nbsp;
| {{site.data.reuse.cp4i}} 2022.2.1 Reserved or limited  | &nbsp; | [**L-RJON-CD3JJU**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-RJON-CD3JJU){:target="_blank"} | &nbsp; | &nbsp;
| {{site.data.reuse.cp4i}} 2021.4.1  | &nbsp; | [**L-RJON-C7QG3S**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-RJON-C7QG3S){:target="_blank"} | &nbsp; | &nbsp;
|  {{site.data.reuse.cp4i}} 2021.4.1 Reserved or limited  | &nbsp; | [**L-RJON-C7QFZX**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-RJON-C7QFZX){:target="_blank"} | &nbsp; | &nbsp;
| {{site.data.reuse.cp4i}} 2021.3.1  | &nbsp; | [**L-RJON-C5CSNH**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-RJON-C5CSNH){:target="_blank"} | &nbsp; | &nbsp;
| {{site.data.reuse.cp4i}} 2021.3.1 Reserved or limited  | &nbsp; | [**L-RJON-C5CSM2**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-RJON-C5CSM2){:target="_blank"} | &nbsp; | &nbsp;
| {{site.data.reuse.cp4i}} 2021.2.1  | &nbsp; | [**L-RJON-BZFQU2**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-RJON-BZFQU2){:target="_blank"} | &nbsp; | &nbsp;
| {{site.data.reuse.cp4i}} 2021.2.1 Reserved or limited  | &nbsp; | [**L-RJON-BZFQSB**](https://www14.software.ibm.com/cgi-bin/weblap/lap.pl?popup=Y&li_formnum=L-RJON-BZFQSB){:target="_blank"} | &nbsp; | &nbsp;


**Note:** For information about licenses for {{site.data.reuse.es_name}} 11.1.x and earlier, see the [previous licenses for {{site.data.reuse.es_name}} only]({{ '/support/licensing/es-111earlier/' | relative_url }}).


## Chargeable containers

The following table shows the chargeable containers within each {{site.data.reuse.ea_long}} capability. You can also find the list of chargeable containers documented in the product license (see links to [license IDs](#available-licenses) earlier).

All other containers that might form part of the deployment are supported, and do not require additional licenses. 

{{site.data.reuse.es_name}} capability | {{site.data.reuse.eem_name}} capability | {{site.data.reuse.ep_name}} capability
---------------|----------------------------|---
- Kafka brokers <br> - Geo-Replicator nodes <br> - MirrorMaker 2.0 nodes <br> - Kafka Connect nodes hosted by Event Automation | - Event Endpoint Management manager <br> - Event Gateway |  - Flink Job Manager  <br> - Flink Task Manager <br> <br> **Note:** For more information about chargeable containers for Flink, see [guidance about Flink samples]({{ '/ep/installing/planning/#flink-sample-deployments' | relative_url }}).


## Calculating licenses required

Licensing is based on a Virtual Processing Cores (VPC) metric. To use any capability within {{site.data.reuse.ea_short}}, you must have sufficient licenses for the CPUs that the [chargeable containers](#chargeable-containers) have access to (this is the CPU limit setting for these containers). Therefore, the license requirement is calculated by adding up the CPU limit values for all the chargeable containers in your deployment. 

The **chargeable cores** for a deployment depend on the chargeable containers deployed and the resource limits specified on those containers. To understand what you will be charged for, find all your chargeable containers, and add up all the CPU limits for those containers to get the chargeable cores value.

For example, the [Production 3 brokers]({{ '/es/installing/planning/#example-deployment-production-3-brokers' | relative_url }}) sample deployment for {{site.data.reuse.es_name}} uses the setting of `spec.strimziOverrides.kafka.resources.limits.cpu: 2000m` for the CPU limit, which corresponds to 2 chargeable cores per Kakfa container, and there are 3 Kafka containers deployed, so this deployment has 3x2, or 6 chargeable cores.

**Note:** This is an example based purely on the sample configuration. The chargeable cores for your deployment will depend on the configuration you specify. You must use the IBM License Service to track and [report on license usage](#generating-audit-reports).

When deploying {{site.data.reuse.ea_short}}, you require sufficient {{site.data.reuse.ea_short}} VPCs for the number of chargeable cores in your deployment. There are separate production and non-production licenses depending on the intended use of your deployment. 

If you are deploying {{site.data.reuse.es_name}} or {{site.data.reuse.eem_name}} as part of {{site.data.reuse.cp4i}}, see the following section about [how licenses and ratios](#licensing-event-streams-and-event-endpoint-management-within-ibm-cloud-pak-for-integration) are applied.

### Licensing {{site.data.reuse.es_name}} and {{site.data.reuse.eem_name}} within {{site.data.reuse.cp4i}}

The {{site.data.reuse.es_name}} and {{site.data.reuse.eem_name}} capabilities are also included in {{site.data.reuse.cp4i}}. 

{{site.data.reuse.cp4i}} has a ratio table with a 1:1 ratio for production deployments, and a 2:1 ratio for non-production deployments.

For example, if your production deployment consists of 12 chargeable cores, this uses the 1:1 ratio and you would require 12 {{site.data.reuse.cp4i}} VPCs. If you have a non-production deployment with 6 chargeable cores, this uses the 2:1 ratio, and you would require 3 {{site.data.reuse.cp4i}} VPCs for this deployment.


## Tracking license usage

The license usage of {{site.data.reuse.ea_short}} capabilities is tracked by the IBM License Service, which tracks the licensed containers and measures their resource usage. 

The License Service provides useful features for managing virtualized environments and measuring license utilization. The service discovers the software that is installed in your infrastructure, helps you to analyze the consumption data, and allows you to generate audit reports. Each report provides you with different information about your infrastructure, for example, the computer groups, software installations, and the content of your software catalog.

By default, every License Service audit report presents data from the previous 90 days. You can customize the type and amount of information that is displayed in a report by using filters, and save your personal settings for future use. You can also export the reports to .csv or .pdf formats, and schedule report emails so that specified recipients are notified when important events occur.

### Installing the service

You must install and run the License Service on all clusters where you install {{site.data.reuse.ea_short}} capabilities. Ensure you install the License Service as follows depending on your environment and license:
- If you are running {{site.data.reuse.ea_short}} capabilties as stand-alone containerized software, see the information about [installing the service for stand-alone software](https://www.ibm.com/docs/en/cloud-paks/foundational-services/4.3?topic=service-installing-license){:target="_blank"}.
- If you are running {{site.data.reuse.ea_short}} capabilties as part of {{site.data.reuse.cp4i}} on {{site.data.reuse.openshift_short}} with {{site.data.reuse.icpfs}}, see the [{{site.data.reuse.cp4i}} documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=administering-deploying-license-service){:target="_blank"}.
- If you are not on OpenShift and do not have {{site.data.reuse.fs}}, see the [{{site.data.reuse.icpfs}} documentation](https://www.ibm.com/docs/en/cloud-paks/foundational-services/4.3?topic=service-installing-license-kubernetes-cluster){:target="_blank"}.

#### Additional steps for usage-based license

**Important:** If you are planning to install {{site.data.reuse.eem_name}} with a usage-based license, in addition to installing the License Service, ensure you also copy the secrets created by the service before creating the {{site.data.reuse.eem_name}} instance.

To copy the secrets:

1. Validate that you have a running instance of `IBMLicensing`
2. Copy the secrets created by the service. The secrets will be used when creating an {{site.data.reuse.eem_name}} instance.
   
   Copy `ibm-license-service-cert` and `ibm-licensing-upload-token` to the namespace where you are planning to create the {{site.data.reuse.eem_name}} instance.

   To copy `ibm-license-service-cert`:

   ```shell
   oc get secret --namespace=ibm-common-services ibm-license-service-cert -o=jsonpath='{.data.tls\.crt}' | base64 --decode > <path>/tls.crt

   oc get secret --namespace=ibm-common-services ibm-license-service-cert -o=jsonpath='{.data.tls\.key}' | base64 --decode > <path>/tls.key

   oc create secret --namespace=<your-namespace> tls ibm-license-service-cert --cert=<path>/tls.crt --key=<path>/tls.key
   ```

   To copy `ibm-licensing-upload-token`:
   
   ```shell
   oc get secret --namespace=ibm-common-services ibm-licensing-upload-token -o yaml | sed 's/namespace: .*/namespace: <your-namespace>/' | oc apply -f -
   ```

### Generating audit reports

License usage reports can be generated on a per cluster basis as described in the [foundational services documentation](https://www.ibm.com/docs/en/cloud-paks/foundational-services/4.3?topic=service-license-usage-metering-reporting){:target="_blank"}.

It is recommended to generate reports on a monthly basis and adhere to the requirements for container licensing as described on [passport advantage](https://www.ibm.com/software/passportadvantage/containerlicenses.html){:target="_blank"}.

For more information about container licensing, see the [container licensing FAQs](https://www.ibm.com/software/passportadvantage/containerfaqov.html){:target="_blank"}.


The license usage information can be viewed by [obtaining an API token](https://www.ibm.com/docs/en/cloud-paks/foundational-services/4.3?topic=authentication-license-service-api-token#obtaining){:target="_blank"} that is required to make the API calls to retrieve license usage data, and then accessing provided [APIs](https://www.ibm.com/docs/en/cloud-paks/foundational-services/4.3?topic=pcfls-apis){:target="_blank"} for retrieving the license usage data.

There are 3 APIs that can be viewed:
1. **Snapshot (last 30 days)** This provides audit level information in a .zip file and is a superset of the other reports.
2. **Products report (last 30 days)** This shows the VPC usage for all products that are deployed in {{site.data.reuse.cp4i}}, for example:
```shell
[{"name":"{{site.data.reuse.cp4i}}","id":"c8b82d189e7545f0892db9ef2731b90d","metricPeakDate":"2020-06-10","metricQuantity":3,"metricName":"VIRTUAL_PROCESSOR_CORE"}]
```
In this example, the `metricQuantity` is 3 indicating that the peak VPC usage is 3.
3. **Bundled products report (last 30 days)** This shows the breakdown of bundled products that are included in IBM Cloud Paks that are deployed on a cluster with the highest VPC usage within the requested period. The following example shows for {{site.data.reuse.es_name}} the peak number of VPCs in use, the conversion ratio and the number of licenses used:
```shell
[{"productName":"Event Streams for Non Production","productId":"<product_id>","cloudpakId":"<cloudpak_id>","metricName":"VIRTUAL_PROCESSOR_CORE","metricPeakDate":"2020-06-10","metricMeasuredQuantity":6,"metricConversion":"2:1","metricConvertedQuantity":3}]
```
In this example, the `productName` shows the license metrics for a `Event Streams for Non Production` deployment. The `metricMeasuredQuantity` is 6 VPCs, the `metricConversion` is 2:1 and `metricConvertedQuantity` is 3 VPCs so the license usage is 3.

**Note:** The `metricMeasuredQuantity` is the peak number of VPCs used over the timeframe. If a capability instance (for example, {{site.data.reuse.es_name}}) is deleted and a new instance installed, then the quantity will be the maximum used at any one time.


### License usage for multiple instances

If there are multiple production or non-production installations in a cluster, then the API will show the total peak VPC usage for all production or non-production instances in that cluster. For example, if you have 2 production instances of {{site.data.reuse.es_name}} where each instance has 3 Kafka brokers that each use 2 VPCs, then the total peak usage is 12 VPCs which converts to 12 licenses.

If there are production and non-production {{site.data.reuse.es_name}} instances installed in the cluster, then the `metricConvertedQuantity` under `Event Streams` and `Event Streams for Non Production` will need to be added to determine the total license usage. For example:

```shell
[{"productName":"Event Streams for Non Production","productId":"<product_id>","cloudpakId":"<cloudpak_id>","metricName":"VIRTUAL_PROCESSOR_CORE","metricPeakDate":"2020-06-10","metricMeasuredQuantity":6,"metricConversion":"2:1","metricConvertedQuantity":3},{"productName":"Event Streams","productId":"<product_id>","cloudpakId":"<cloudpak_id>","metricName":"VIRTUAL_PROCESSOR_CORE","metricPeakDate":"2020-06-11","metricMeasuredQuantity":8,"metricConversion":"1:1","metricConvertedQuantity":8}]
```

In this example there are {{site.data.reuse.es_name}} installations for non-production and for production. The non-production usage is 6 VPCs which converts to 3 licenses. The production usage is 8 VPCs which converts to 8 licenses. Therefore the total license usage is 11.

### License usage examples

To work out the licenses required for a deployment, you can use the sample configurations provided for each capability, and use the "chargeable cores" values to help you calculate the required licenses based on the guidance in [calculating licenses required](#calculating-licenses-required). This can provide you with examples of license usage for deployments.

See the planning sections for information about chargeable cores for each sample:

- [{{site.data.reuse.es_name}} samples]({{ '/es/installing/planning/#sample-deployments' | relative_url }})
- [{{site.data.reuse.eem_name}} samples]({{ '/eem/installing/planning/#sample-deployments-for-event-endpoint-management' | relative_url }})
- [{{site.data.reuse.egw}} samples]({{ '/eem/installing/planning/#sample-deployments-for-event-gateway' | relative_url }})
- [{{site.data.reuse.ep_name}} samples]({{ '/ep/installing/planning/#event-processing-sample-deployments' | relative_url }})
- [Flink samples]({{ '/ep/installing/planning/#flink-sample-deployments' | relative_url }})

**Note:** The chargeable cores for your deployment will depend on the configuration you specify. If you change the chargeable core values, you will require additional licenses.
