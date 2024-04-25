---
title: "Configuring a client application to connect to an event endpoint"
excerpt: "Configure your client applications to access event data through the Event Gateway."
categories: consume-subscribe
slug: setting-your-application-to-consume
toc: true
---

Whether you want your application to produce to or consume from an event endpoint, you need to configure your client applications to connect to the {{site.data.reuse.egw}} through which the application can make use of the selected event endpoints. You can use the [snippets provided](../discovering-topics#the-catalog) for each event endpoint, and you will need the [access credentials](../subscribing-to-topics) you requested to the event endpoint.

**Note**: ![Event Endpoint Management 11.1.5 icon]({{ 'images' | relative_url }}/11.1.5.svg "In Event Endpoint Management 11.1.5 and later") The ability to produce events is only available in {{site.data.reuse.eem_name}} version 11.1.5 and later.

## Configuring a client

Access to event endpoints in {{site.data.reuse.eem_name}} is managed by the {{site.data.reuse.egw}}. Configure your client applications to connect to the {{site.data.reuse.egw}} by using standard Kafka client configuration options.

The way you provide the configuration settings to your client varies from client to client. However, configure the following settings for each client:

- `Bootstrap servers`: The set of {{site.data.reuse.egw}} **Server** addresses that provide access to a topic can be found in the **Catalog** page for that topic, in the **Server** table. More than one address can be used, when separated by commas in your client configuration.
- `Security mechanism`: Set as `SASL_SSL`. This is the only available option.
- `SSL configuration`: The {{site.data.reuse.egw}} only exposes a TLS endpoint for clients to connect to. Per **Gateway endpoint** address, a `.pem` certificate can be downloaded to allow clients to be configured with the expected client certificate to trust.
- `SASL` credentials : Update `SASL mechanism`, `SASL username`, and `SASL password` with the values retrieved when [subscribing to the event source](../subscribing-to-topics#requesting-access).
- `Topic name`: The name of the event source (topic) you want your application to produce to or consume from. The name is displayed in the **Catalog** table under the **Topic name** column and as the heading of the **Catalog** detail page when viewing more information about a topic.

