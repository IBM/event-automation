---
title: "OpenTelemetry metrics"
excerpt: "Metrics reference for the different components of Event Endpoint Management."
categories: reference
slug: metrics-reference
toc: true
---

Find out more abut the OpenTelemetry metrics emitted by the {{site.data.reuse.eem_name}} components: the {{site.data.reuse.eem_manager}} and the {{site.data.reuse.egw}}.

## `{{site.data.reuse.eem_manager}}`
{: #manager}

| Metric | Type |  Description | 
| ----------- | ----------- | ----------- | 
| api_okay | LongCounter | Number of successful API calls handled by the {{site.data.reuse.eem_manager}}. | 
| api_bad_request | LongCounter | Number of failed API calls because the request is badly formed. |
| api_unauthz | LongCounter | Number of failed API calls because the user is not known. | 
| api_forbidden | LongCounter | Number of failed API calls because the user is not authorized. | 
| api_not_found | LongCounter | Number of failed API calls because a referenced resource cannot not be found. |
| api_conflict | LongCounter | Number of failed API calls because the requested change conflicts with the current state. | 
| api_unsupported_media | LongCounter | Number of failed API calls because the content format of the request is not acceptable for the server. | 
| api_internal_server_error | LongCounter | Number of failed API calls because the server had an internal error occur. | 
| api_service_unavailable | LongCounter | Number of failed API calls because the service that is required for the request is unavailable. | 
| api_nine_one_one | LongCounter | Number of failed API calls for {{site.data.reuse.apic_short}} integration errors. | 
| api_responses | LongCounter | Number of API calls handled by the {{site.data.reuse.eem_manager}}. |
| api_response_latency | LongHistogram | Distribution of API responses by response time (ms) into buckets from 0 to 10000 in steps of 500. | 
| options | LongUpDownCounter | Number of options and their associated subscriptions at a specific point in time. | 
| successful_gateway_registration | LongCounter | Number of successful gateway registrations. | 
| failed_gateway_registration | LongCounter |  Number of failed gateway registrations. | 
| services_not_ready | LongGauge | Number of {{site.data.reuse.eem_name}} services that are not yet ready. |
| services_ready | LongGauge | Number of {{site.data.reuse.eem_name}} services that are ready. |
| resource_count | LongGauge | Number of resources created. The resources that are included in this count are: Options and {{site.data.reuse.egw}}s. |
| resource_limit | LongGauge | Number of resources within that can be created. Not present if no resource limit is set. |
| (deprecated) successfulGatewayRegistration | LongCounter | Number of successful gateway registrations. Use `successful_gateway_registration` instead. |
| (deprecated) failedGatewayRegistration | LongCounter |  Number of failed gateway registrations. Use `failed_gateway_registration` instead. |
| (deprecated) storageNotReady | LongCounter | Number of times the storage ready check failed. |
| (deprecated) keyManagerNotReady | LongCounter | Number of times the key manager ready check failed. |

**Note:** Metrics that are marked as deprecated will be removed in a future release. <!-- previously stated: "Use the equivalent metrics not marked as deprecated". Instead we've pointed to the equivalent new one, except for storageNotReady and keyManagerNotReady that have no equivalents. -->

## `{{site.data.reuse.egw}}`
{: #gateway}

| Metric | Type |  Description |
| ----------- | ----------- | ----------- |
| login_success | LongCounter | Number of successful client logins to the {{site.data.reuse.egw}}. |
| login_failed | LongCounter | Number of failed client logins to the {{site.data.reuse.egw}}. |
| topic_authz_failed | LongCounter | Number of topic authorization failures that are caused by clients that use the {{site.data.reuse.egw}}. |
| connected_clients | LongUpDownCounter | Number of clients that are connected to this gateway at a specific point in time. |
| client_api_versions_gauge | LongGauge | Gauge that contains the API versions used per client ID for each Kafka API. |
| consumers_msgs | LongCounter | Number of messages that clients consume through the {{site.data.reuse.egw}}. |
| consumers_bytes | LongCounter | Number of bytes that clients consume through the {{site.data.reuse.egw}}. |
| producers_bytes | LongCounter | Number of messages that clients produce through the {{site.data.reuse.egw}}. |
| producers_msgs | LongCounter | Number of bytes that clients produce through the {{site.data.reuse.egw}}. |
| quota_delay | LongUpDownCounter | Available if the [quota enforcement control](../../about/key-concepts/#controls) is enabled. It provides the delays that are applied to ensure that quota limitations are maintained per client by using metadata attributes. |
