---
title: "Managing gateways"
excerpt: "Find out how you can monitor deployed Event Gateway instances in the Event Endpoint Management UI."
categories: administering
slug: managing-gateways
toc: true
---

When a gateway is [deployed](../../installing/install-gateway) and configured to work with an {{site.data.reuse.eem_manager}} instance, it automatically registers and pulls the configuration from that Manager instance. 

To find your gateways in {{site.data.reuse.eem_name}}, in the navigation pane, click **Administration** > **{{site.data.reuse.egw}}s**. 

Note: The [Admin user role](../../security/user-roles) is required to view and edit gateways.

## Gateway details
{: #gateway-details}

Use the **{{site.data.reuse.egw}}s** page to verify that your gateway instances are running and download the configuration details for your gateways.

Your gateway instances are listed in a table that shows the following details:

- The gateway's unique ID.
- The endpoints (hostname and port) that client applications use to access the gateway.
- The last time this gateway interacted with the {{site.data.reuse.eem_manager}} instance (Last connection).
- The [gateway group](../../about/key-concepts#gateway-group) that the gateway belongs to.
- A high-level gateway status indication.
- The version of {{site.data.reuse.eem_name}} that the gateway is from.

Click ![More options icon]({{ 'images' | relative_url }}/more_options.png "More options icon at end of each row."){:height="30px" width="15px"} **More options** next to the instance to access the following options:

- ![Event Endpoint Management 11.6.3 icon]({{ 'images' | relative_url }}/11.6.3.svg "In Event Endpoint Management 11.6.3 and later.") **View configuration details**: Access the YAML or Docker command that can be used to re-create the gateway instance. By default, the deployment type that was used at [installation](../../installing/install-gateway) is shown.
- **Regenerate key**: Regenerate the API key that the gateway instance uses to identify itself with the Manager instance.
- **Remove**: Delete the gateway instance.


**Note**: The status of a gateway is derived through the last connection time. To provide access to event sources, gateways frequently contact the {{site.data.reuse.eem_manager}} instance that they are registered with. If a gateway does not contact the {{site.data.reuse.eem_manager}} instance within the scan interval, a potential problem might exist with the gateway or the network.  

- For gateways created in {{site.data.reuse.eem_name}} 11.4.2 and later, the scan interval is 30 seconds and after three missed contact attempts, the gateway is moved to a warning state.
- For gateways created in {{site.data.reuse.eem_name}} 11.4.1 and earlier, the gateway shows a warning state if it has not contacted the {{site.data.reuse.eem_name}} instance within the last 15 minutes.


