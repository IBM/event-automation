---
title: "Configuring a client application to connect to an event endpoint"
excerpt: "Configure your client applications to access event data through the Event Gateway."
categories: subscribe
slug: configure-your-application-to-connect
toc: true
---

Configure your client applications to connect to the {{site.data.reuse.egw}} to access your subscriptions.

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

<!-- If the event endpoint is secured with OAuth2, then the following additional properties are required:

```
sasl.mechanism: "OAUTHBEARER"
sasl.oauthbearer.method: "oidc"
sasl.oauthbearer.grant.type: "client_credentials"
https.ca.location: <oidc CA location>
sasl.oauthbearer.token.endpoint.url: <oauth token endpoint>
sasl.oauthbearer.client.id: <oauth client id>
sasl.oauthbearer.client.secret: <oauth client secret>
sasl.oauthbearer.scope: "openid"
```
-->

## Testing event endpoints with the Code accelerator
{: #code-accelerator-samples}

Before using the downloaded configuration for an event endpoint in a complex application, you can test the event endpoint configuration using the [code accelerator samples](../discovering-event-endpoints#code-accelerator-samples).

<!-- In the ipaas version of this page we might also link to https://www.ibm.com/docs/en/wm-integration-ipaas?topic=kafka-account-types  -->

### Example kcat test of consumer event endpoint
{: #example-kcat-test}

[kcat](https://github.com/edenhill/kcat) is an open source test tool for Kafka. Follow these steps to test a SASL secured event endpoint with the kcat code accelerator sample:

1. Install [kcat](https://github.com/edenhill/kcat) on a system that has network access to your {{site.data.reuse.egw}}.
2. Log in to the {{site.data.reuse.eem_name}} UI by using your login credentials.
3. In the navigation pane, click **Catalog**.
4. Select the event endpoint that you want to test. 
5. If you do not already have a subscription to this event endpoint, then [subscribe](../subscribing-to-event-endpoints) to get a SASL username and password.
6. Expand the **Code accelerator** section.
7. Switch to the **kcat** tab.
8. Copy the kcat sample command and replace the placeholder variables:
   - `<GROUP_ID>` - Replace with a unique string.
   - `<CLIENT_ID>` - Replace with a unique string.
   - `<CREDENTIALS_USERNAME>` - set to your SASL username.
   - `<CREDENTIALS_PASSWORD>` - set to your SASL password.
9. Run the kcat sample command. For example:

   ```
   kcat -J -G group1 \
     -b "grp1-gwy1-ibm-egw-example.apps.ibm.com:443,grp1-gwy1-ibm-egw-example.ibm.com:443,grp1-gwy1-ibm-egw-example.ibm.com:443" \
     -X client.id=client1 \
     -X security.protocol="SASL_SSL" \
     -X ssl.ca.pem="-----BEGIN CERTIFICATE-----
   ...
   -----END CERTIFICATE-----" \
     -X sasl.mechanisms="PLAIN" \
     -X sasl.username="eem-7f0c68e8-3c40-432b-a926-921080c9661d" \
     -X sasl.password="f742c545-0ce2-4958-a801-114f242c3d3e" \
     "noop"; : # Note: in some versions of kcat the '-t' flag must precede the topic name
   ```

   The kcat command output displays the events that the event endpoint produces. For example:

   ```
   % Waiting for group rebalance
   % Group group1 rebalanced (memberid client1-730ea6d6-6968-4a8b-9900-8652d4f5e310): assigned: noop [0]
   % Reached end of topic noop [0] at offset 15
   {"topic":"noop","partition":0,"offset":15,"tstype":"create","ts":1754311306587,"broker":1,"key":null,"payload":"Sample message value"}
   % Reached end of topic noop [0] at offset 16
   {"topic":"noop","partition":0,"offset":16,"tstype":"create","ts":1754311308412,"broker":1,"key":null,"payload":"Sample message value"}
   % Reached end of topic noop [0] at offset 17
   ```

   **Tip:** If your Kafka cluster is an {{site.data.reuse.es_name}} instance, you can create test events with the [starter application]({{'es/getting-started/generating-starter-app/' | relative_url}}).

