---
title: "Managing gateways"
excerpt: "Find out how you can monitor deployed Event Gateway instances in the Event Endpoint Management UI."
categories: administering
slug: managing-gateways
toc: true
---

When a gateway is [deployed](../../installing/install-gateway) and [configured](../../installing/configuring) to work with an {{site.data.reuse.eem_manager}} instance, it automatically registers and pulls the configuration from that Manager instance.

To find your gateways in {{site.data.reuse.eem_name}}, in the navigation pane, click **Administration** > **{{site.data.reuse.egw}}s**. 

Note: The [Admin user role](../../security/user-roles) is required to view and edit gateways.

## Gateway details

You can use the **{{site.data.reuse.egw}}s** page to verify that the expected set of gateway instances has been deployed and configured correctly.

The following details are available for each configured gateway instance:

- The gateway's unique ID
- The addresses (hostname and port) client applications will use to access the gateway
- The last time this gateway interacted with the {{site.data.reuse.eem_manager}} instance (Last connection)
- The [gateway group](../../about/key-concepts#gateway-group) the gateway belongs to
- A high level gateway status indication
- The version of {{site.data.reuse.eem_name}} that they were created in.

The status of a gateway is derived through the last connection time. To provide access to event sources, gateways frequently contact the {{site.data.reuse.eem_manager}} instance that they are registered with. If a gateway does not contact the {{site.data.reuse.eem_manager}} instance within the scan interval, a potential problem might exist with the gateway or the network.  

**Note**:
- For gateways created in {{site.data.reuse.eem_name}} 11.4.2 and later, the scan interval is 30 seconds and after three missed contact attempts, the gateway is moved to a warning state.
- For gateways created in {{site.data.reuse.eem_name}} 11.4.1 and earlier, the gateway shows a warning state if it has not contacted the {{site.data.reuse.eem_name}} instance within the last 15 minutes.


