---
title: "Managing Event Gateways"
excerpt: "Find out how you can monitor deployed Event Gateway instances in the Event Endpoint Management UI."
categories: admin
slug: managing-gateways
toc: true
---

When an {{site.data.reuse.egw}} is [deployed](../event-gateways) and configured to work with an {{site.data.reuse.eem_manager}} instance, it automatically registers and pulls the configuration from that Manager instance.

To find your gateways in {{site.data.reuse.eem_name}}, in the navigation pane, click **Administration** > **{{site.data.reuse.egw}}s**. 

## {{site.data.reuse.egw}} details
{: #gateway-details}

You can use the **{{site.data.reuse.egw}}s** page to verify that the expected set of gateway instances are deployed and configured correctly.

The following details are available for each configured {{site.data.reuse.egw}} instance:

- The gateway's unique ID
- The addresses (hostname and port) client applications use to access the gateway
- The last time this gateway interacted with the {{site.data.reuse.eem_manager}} instance (Last connection)
- The [gateway group](../../about/key-concepts#gateway-group) that this gateway belongs to
- A high-level gateway status indication 

The status of an {{site.data.reuse.egw}} is derived through the last connection time with the {{site.data.reuse.eem_manager}} instance. The gateways contact the {{site.data.reuse.eem_manager}} instance that they are registered with every 30s (default) to retrieve configuration. If an {{site.data.reuse.egw}} misses 3 of these scan intervals, then it is moved to a warning state in the UI.