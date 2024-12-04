---
title: "OpenTelemetry metrics"
excerpt: "Metrics reference for the different components of Event Endpoint Management."
categories: reference
slug: metrics-reference
toc: true
---

Find out more abut the OpenTelemetry metrics emitted by the {{site.data.reuse.eem_name}} components: the {{site.data.reuse.eem_manager}} and the {{site.data.reuse.egw}}.

## `{{site.data.reuse.eem_manager}}`

| Metric | Type |  Description | 
| ----------- | ----------- | ----------- | 
| api_okay | LongCounter | Counts the number of successful API calls handled by the {{site.data.reuse.eem_manager}}. | 
| api_bad_request | LongCounter | Counts the number of failed API calls because the request is badly formed. |
| api_unauthz | LongCounter | Counts the number of failed API calls because the user is not known. | 
| api_forbidden | LongCounter | Counts the number of failed API calls because the user is not authorized to perform an action. | 
| api_not_found | LongCounter | Counts the number of failed API calls because a referenced resource cannot not be found. |
| api_conflict | LongCounter | Counts the number of failed API calls because the requested change conflicts with the current state. | 
| api_unsupported_media | LongCounter | Counts the number of failed API calls because the content format of the request is not acceptable for the server. | 
| api_internal_server_error | LongCounter | Counts the number of failed API calls because the server had an internal error occur. | 
| api_service_unavailable | LongCounter | Counts the number of failed API calls because the service that is required for this request is unavailable. | 
| api_nine_one_one | LongCounter | Counts the number of failed API calls for {{site.data.reuse.apic_short}} integration errors. | 
| api_responses | LongCounter | Counts the total number of API calls handled by the {{site.data.reuse.eem_manager}}. |
| api_response_latency | LongHistogram | Distribution of API responses by response time (ms) into buckets from 0 to 10000 in steps of 500. | 
| options | LongUpDownCounter | Provides the total number of options and their associated subscriptions at a specific point in time. | 
| successful_gateway_registration | LongCounter | Counts the number of successful gateway registrations that are accepted by the {{site.data.reuse.eem_manager}}.| 
| failed_gateway_registration | LongCounter |  Counts the number of failed gateway registrations that are handled by the {{site.data.reuse.eem_manager}}. | 
| services_not_ready | LongGuage | Current number of EEM services that are not yet ready. |
| services_ready | LongGuage | Current number of EEM services that are ready. |
| (deprecated) successfulGatewayRegistration | LongCounter | Counts the number of successful gateway registrations that are accepted by the {{site.data.reuse.eem_manager}}.|
| (deprecated) failedGatewayRegistration | LongCounter |  Counts the number of failed gateway registrations that are handled by the {{site.data.reuse.eem_manager}}. |
| (deprecated) storageNotReady | LongCounter | Counts the number of times the storage ready check failed. |
| (deprecated) keyManagerNotReady | LongCounter | Counts the number of times the key manager ready check failed. |

**Note:** Metrics that are marked as deprecated will be removed in a future release. Consider using the equivalent metrics not marked as deprecated.

## `{{site.data.reuse.egw}}`

| Metric | Type |  Description |
| ----------- | ----------- | ----------- |
| login_success | LongCounter | Counts the number of successful client logins to the {{site.data.reuse.egw}}. |
| login_failed | LongCounter | Counts the number of failed client logins to the {{site.data.reuse.egw}}. |
| topic_authz_failed | LongCounter | Counts the number of topic authorization failures that are caused by clients that use the {{site.data.reuse.egw}}. |
| connected_clients | LongUpDownCounter | Total number of clients connected to this gateway at a specific point in time. |
| consumers_msgs | LongCounter | Counts the number of messages that clients consume through the {{site.data.reuse.egw}}. |
| consumers_bytes | LongCounter | Counts the number of bytes that clients consume through the {{site.data.reuse.egw}}. |
| producers_bytes | LongCounter | Counts the number of messages that clients produce through the {{site.data.reuse.egw}}. |
| producers_msgs | LongCounter | Counts the number of bytes that clients produce through the {{site.data.reuse.egw}}. |
| quota_delay | LongUpDownCounter | Available if the [quota enforcement control](../../about/key-concepts/#controls) is enabled. It provides the delays that are applied to ensure that quota limitations are maintained per client by using metadata attributes. |
