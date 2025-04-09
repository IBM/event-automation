---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.5.x.

## Release {{site.data.reuse.eem_current_version}}

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.5.1 contains security and bug fixes.



## Release 11.5.0

### Admin role

{{site.data.reuse.eem_name}} release 11.5.0 introduces an [admin role](../../security/user-roles/). To [deploy](../../installing/install-gateway/#remote-gateways) or perform any create, read, update, and delete operations with {{site.data.reuse.egw}}s, users must be assigned the admin role. The author role no longer has the necessary permissions to work with {{site.data.reuse.egw}}s.

### A `server` service endpoint when you configure ingress

{{site.data.reuse.eem_name}} release 11.5.0 introduces the [`server` service endpoint](../../installing/configuring/#configuring-ingress). The `server` endpoint is required to [deploy](../../installing/install-gateway/#remote-gateways) an {{site.data.reuse.egw}} by using the {{site.data.reuse.eem_name}} UI.

### Generate {{site.data.reuse.egw}} deployment configuration from the {{site.data.reuse.eem_name}} UI

The {{site.data.reuse.eem_name}} UI can generate {{site.data.reuse.egw}} configurations to simplify installation of {{site.data.reuse.egw}}s. For more information, see [Installing the {{site.data.reuse.egw}}](../../installing/install-gateway). 


### Support for {{site.data.reuse.openshift}} 4.18

{{site.data.reuse.eem_name}} version 11.5.0 introduces [support]({{ 'support/matrix/#event-endpoint-management' | relative_url }}) for {{site.data.reuse.openshift}} 4.18.


### CA certificate management

{{site.data.reuse.eem_name}} release 11.5.0 introduces a feature to upload and manage the CA certificates that are used to secure [Mutual TLS controls](../../describe/option-controls#mtls). For more information, see [Managing CA certificates](../../security/ca-certs).


### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.5.0 contains security and bug fixes.

