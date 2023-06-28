---
title: "Managing gateways"
excerpt: "Find out how you can monitor deployed Gateway instances in the {{site.data.reuse.eem_name}} UI"
categories: describe
slug: managing-gateways
toc: true
---

When a gateway is [deployed](../../installing/deploy-gateways) and [configured](../../installing/deploy-gateways#configuring) to work with an {{site.data.reuse.eem_manager}} instance, it automatically registers and pulls the configuration from that Manager instance.

The **Gateways** page displays all the gateway instances registered with the {{site.data.reuse.eem_manager}} instance, their configuration status, and the [gateway group](../../about/key-concepts#gateway-group) to which they belong.


## Gateway details

You can use the **Gateways** page to verify the expected set of gateway instances has been deployed and configured correctly.

The following details are available for each configured gateway instance:

- The gateway's unique ID
- The addresses (hostname and port) client applications will use to access the gateway
- The last time this gateway interacted with the {{site.data.reuse.eem_manager}} instance (Last connection)
- The gateway group this gateway belongs to
- A high level gateway status indication

The status of a gateway is derived through the last connection time. To provide access to event sources, gateways frequently contact the {{site.data.reuse.eem_manager}} instance they are registered with. If a gateway has not been active within 90 minutes, it will be moved to a warning state. 

