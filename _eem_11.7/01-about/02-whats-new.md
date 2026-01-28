---
title: "What's new"
excerpt: "Find out what is new in Event Endpoint Management."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.eem_name}} version 11.7.1.

## Release {{site.data.reuse.eem_current_version}}
{: #release-1171}

### Client authentication sets
{: #client-auth-sets}

{{site.data.reuse.eem_name}} version 11.7.1 introduces the feature for administrators to manage the types of authentication that are available for authors to secure their event endpoints. The following authentication methods are available: Mutual TLS, OAuth 2.0, and SASL credentials, and combinations of these methods. For more information, see [managing event endpoint security](../../security/cred-sets).

### OAuth 2.0 authentication of event endpoints
{: #oauth2}

{{site.data.reuse.eem_name}} version 11.7.1 introduces support for clients to use OAuth 2.0 authentication when connecting to event endpoints. For more information, see [defining OAuth 2.0 authentication providers](../../security/cred-sets#oauth).

### Guided tutorial with mock gateway and Kafka cluster
{: #tutorial-gateway}

{{site.data.reuse.eem_name}} version 11.7.1 introduces tutorials that cover the end-to-end use case of using 
{{site.data.reuse.eem_name}}, including adding an {{site.data.reuse.egw}}, and publishing and subscribing to an event endpoint. The tutorials include a mock {{site.data.reuse.egw}}, mock Kafka cluster, and test data, designed to demonstrate the value of {{site.data.reuse.eem_name}} to users. You can access the tutorials from the **Help and support** menu in the UI.

### Security and bug fixes
{: #security-and-bug-fixes-1171}

{{site.data.reuse.eem_name}} release 11.7.1 contains security and bug fixes.

### Documentation: Highlighting differences between versions
{: #documentation-highlighting-differences-between-versions}

Any difference in features or behavior introduced by {{site.data.reuse.eem_name}} 11.7.1 compared to 11.7.0 is highlighted in this documentation by using the following graphic: ![Event Endpoint Management 11.7.1 icon]({{ 'images' | relative_url }}/11.7.1.svg "In Event Endpoint Management 11.7.1 and later.").
