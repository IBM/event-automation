---
title: "Event Gateway loses connection to OAuth-authenticated Kafka cluster after upgrading to 11.6.2"
excerpt: "After upgrading to 11.6.2, one or more Event Gateways are unable to connect to your Kafka clusters."
categories: troubleshooting
slug: v2-gateways-oauth
toc: true
---

## Symptoms

After upgrading to {{site.data.reuse.eem_name}} 11.6.2, some or all {{site.data.reuse.egw}}s fail to forward events to and from your Kafka clusters. The {{site.data.reuse.eem_name}} UI displays a warning message.

<!-- DRAFT COMMENT: Can we get exact text of the warning and error messages UI users and kafka clients would see? So that a search on this text would return this page. -->

## Causes

{{site.data.reuse.egw}}s that were deployed from the {{site.data.reuse.openshift_short}} web console or [online samples](https://github.com/IBM/ibm-event-automation/tree/main/event-endpoint-management/cr-examples/eventgateway){:target="_blank"} do not support OAuth authentication with Kafka clusters in {{site.data.reuse.eem_name}} 11.6.2 and later. 

OAuth support for {{site.data.reuse.egw}}s in release 11.6.2 is available only in gateways that were deployed by using the generated configurations created in the [{{site.data.reuse.eem_name}} UI](../../installing/install-gateway).


## Resolving the problem

1. Generate a configuration for a replacement gateway in the [{{site.data.reuse.eem_name}} UI](../../installing/install-gateway). Specify the same gateway group as your failed gateway.
2. Install the replacement gateway from the generated configuration.
3. Verify that the replacement gateway is able to connect to your Kafka cluster.
4. Delete the original gateway.