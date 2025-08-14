---
title: "Configuring a client application to connect to an event endpoint"
excerpt: "Configure your client applications to access event data through the Event Gateway."
categories: subscribe
slug: configure-your-application-to-connect
toc: true
---

Configure your client applications to connect to the {{site.data.reuse.egw}} to access your subscriptions.

If your client applications are Java, [Node.JS](https://nodejs.org/){:target="_blank"}, or [kcat](https://github.com/edenhill/kcat){:target="_blank"}, then you can use the [code accelerator samples](../discovering-event-endpoints#code-accelerator-samples) for each event endpoint, along with your subscription details.

![Configuring a client application to connect to an event endpoint.]({{ 'images' | relative_url }}/eem-client-app-connect.png "Diagram that shows what happens when you configure your client application to connect to an event endpoint.")

## Configuring a client
{: #configuring-a-client}

The {{site.data.reuse.egw}} manages access to event endpoints in {{site.data.reuse.eem_name}}. Configure your client applications to connect to the {{site.data.reuse.egw}} by using standard Kafka client configuration options.

The way that you provide the configuration settings to your client varies from client to client. However, the following settings are common for every client:

- `Bootstrap servers`: The set of {{site.data.reuse.egw}} **Server** addresses that provide access to an event endpoint can be found in the **Catalog** page for that event endpoint, in the **Server** table. If multiple addresses are used, separate them with commas.
- `Security mechanism`: Set as `SASL_SSL` if username and password are used in the subscription. Set as `SSL` if mTLS is used without a username and password.
- `SSL configuration`: The {{site.data.reuse.egw}} exposes only a TLS-secured endpoint for clients to connect to. For each **Gateway endpoint** address, the server certificate can be downloaded (in PEM format) from the **Catalog** detail page. Configure your client to trust this certificate.
- `SASL` credentials : If `SASL_SSL` is specified as the `SASL mechanism`, then set `SASL username`, and `SASL password` with the values retrieved when you [subscribed to the event source](../subscribing-to-event-endpoints#requesting-access).
- `Topic name`: The name of the event endpoint you want your application to use. The name is displayed in the **Catalog** table under the **Topic name** column and as the heading of the **Catalog** detail page when you view more information about an event endpoint.


