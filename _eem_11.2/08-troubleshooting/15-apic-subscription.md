---
title: "Subscribed topics not available with API Connect subscription credentials"
excerpt: "API Connect subscriptions that reference more than one topic cannot be used to handle messages from additional topics."
categories: troubleshooting
slug: apic-subscription-topics-unavailable
toc: true
---

## Symptoms

A Kafka client can connect to topics as event endpoints through {{site.data.reuse.eem_name}} by using {{site.data.reuse.apic_short}} [application credentials](https://www.ibm.com/docs/en/api-connect/10.0.x?topic=portal-registering-application){:target="_blank"}. However, the client can only interact with one of the topics that the application is subscribed to. The client returns an `unknown topic` error message similar to the following if it attempts to connect to any of the other topics.

```
Waiting for group rebalance
ERROR: Topic topic-name [0] error: Subscribed topic not available: topic-name: Broker: Unknown topic or partition
```

## Causes

Topics can be socialized through {{site.data.reuse.eem_name}}, and made available in the Developer Portal in {{site.data.reuse.apic_long}}. Topics are added to the API Manager catalog as event sources by [exporting the AsyncAPI documents](../../integrating-with-apic/export-asyncapi/) and publishing them to products. An {{site.data.reuse.apic_short}} application is created and subscribes to these products.

The `unknown topic` error message occurs when more than one API is published to a single product and an application is subscribed to that product. This error can also occur when the application is subscribed to multiple products.

As a result, the single application is subscribed to multiple event source options in {{site.data.reuse.eem_name}}. This causes the {{site.data.reuse.egw}} to incorrectly handle requests to those options. It will only process one of the requests successfully, even if the options are being accessed from different consumers, or if one request is for producing and the other for consuming.

## Resolving the problem

Verify you can publish the AsyncAPI documents to separate products in the {{site.data.reuse.apic_short}} catalog. In addition, ensure that only one {{site.data.reuse.apic_short}} application is subscribed to a single product. This means that your clients will use unique {{site.data.reuse.apic_short}} credentials to interact with each topic.