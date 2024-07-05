---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.2.x.

## Release {{site.data.reuse.eem_current_version}}

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.2.2 contains security and bug fixes.

## Release 11.2.1

### Authenticate with Keycloak provided by {{site.data.reuse.cp4i}}

{{site.data.reuse.eem_name}} release 11.2.1 introduces support for authentication by using [Keycloak in {{site.data.reuse.cp4i}}](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.0?topic=administering-identity-access-management){:target="_blank"}. For more information, see [managing access with Keycloak](../../security/managing-access/#setting-up-integration-keycloak-authentication)

### Support for JSON schemas

In addition to support for Avro schemas, {{site.data.reuse.eem_name}} version 11.2.1 introduces support for JSON schemas to describe the structure of JSON-formatted messages.

### Changes to the backup label

To [back up](../../installing/backup-restore#backing-up) your resources in {{site.data.reuse.eem_name}} 11.2.1 and later, ensure that you use the following label: `backup.events.ibm.com/component: eventendpointmanagement`

### Explaining multi-form management

A new section has been added [to the documentation](../../api-and-event-management/overview) to help explain the value of integrating {{site.data.reuse.eem_name}} with API management solutions, such as {{site.data.reuse.apic_long}}. This is known as [multi-form management](../../integrating-with-apic/apic-eem-concepts/#multi-form-api-management).

In addition, a [glossary of {{site.data.reuse.apic_short}} concepts](../../integrating-with-apic/apic-eem-concepts), and how they map to {{site.data.reuse.eem_name}}, has also been added.


### Documentation: Highlighting differences between versions

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.2.1 compared to 11.2.0 or earlier is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.2.1 icon]({{ 'images' | relative_url }}/11.2.1.svg "In Event Endpoint Management 11.2.1 and later.")

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.2.1 contains security and bug fixes.

## Release 11.2.0

### Updates to supported Kubernetes versions

- {{site.data.reuse.eem_name}} version 11.2.0 introduces support for Kubernetes platforms version 1.30 that support the Red Hat Universal Base Images (UBI) containers.

- To install {{site.data.reuse.eem_name}} 11.2.0 and later 11.2.x versions, ensure that you have installed a Kubernetes version 1.25 or later. 

For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.2.0 contains security and bug fixes.


