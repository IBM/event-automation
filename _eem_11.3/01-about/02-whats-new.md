---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.3.x.

## Release {{site.data.reuse.eem_current_version}}

### Quota control

{{site.data.reuse.eem_name}} release 11.3.0 introduces the ability to enforce quotas on [consumers](../../describe/option-controls/#quota-consume) and [producers](../../describe/option-controls/#quota-produce) that connect through the {{site.data.reuse.egw}}.

### New roles to use with Keycloak in {{site.data.reuse.cp4i}}

{{site.data.reuse.eem_name}} release 11.3.0 introduces new roles to use with Keycloak when deployed as part of {{site.data.reuse.cp4i}}. For more information, see [Assigning roles to your Keycloak users and groups](../../security/managing-access/#assign-roles).

### Hostname verification is now enabled by default

In {{site.data.reuse.eem_name}} 11.3.0 and later, hostname verification is enabled on the connection between your Kafka cluster and the {{site.data.reuse.egw}}. For more information, see [Ensuring Kafka certificates include their hostname](../../installing/upgrading/#ensuring-kafka-certificates-include-their-hostname).

### Support for IBM z13 (s390x) is removed

Support for IBM z13 (s390x) is removed in {{site.data.reuse.eem_name}} version 11.3.0 and later. Ensure that you deploy {{site.data.reuse.eem_name}} 11.3.0 on IBM z14 or later systems.

For more information about supported versions, see the [support matrix]({{ 'support/matrix/#event-endpoint-management' | relative_url }}).

### Security and bug fixes

{{site.data.reuse.eem_name}} release 11.3.0 contains security and bug fixes.

