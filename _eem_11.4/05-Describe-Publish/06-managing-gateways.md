---
title: "Managing gateways"
excerpt: "Find out how you can monitor deployed Event Gateway instances in the Event Endpoint Management UI."
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

The status of a gateway is derived through the last connection time. To provide access to event sources, gateways frequently contact the {{site.data.reuse.eem_manager}} instance they are registered with. If a gateway has not been active within this scan interval, it is moved to a warning state.  

**Note:**

- ![Event Endpoint Management 11.4.2 icon]({{ 'images' | relative_url }}/11.4.2plus.svg "In Event Endpoint Management 11.4.2 and later.") If you are using {{site.data.reuse.eem_name}} version 11.4.2 or later, the following rules apply. 
    - For new gateways, the scan interval defaults to 30 seconds.
    - For existing registered gateways, the scan interval defaults to 15 minutes.
- If you are using {{site.data.reuse.eem_name}} 11.4.1 or earlier, the scan interval defaults to 90 minutes.   

