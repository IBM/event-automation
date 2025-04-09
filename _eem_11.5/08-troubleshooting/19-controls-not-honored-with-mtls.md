---
title: "Additional controls not applied to options with mTLS only control"
excerpt: "Options configured with only mTLS do not apply additional controls such as redaction, schema filtering, or quota enforcement."
categories: troubleshooting
slug: controls-with-mtls
toc: true
---


## Symptoms

When an option is configured with a Mutual TLS (mTLS) only control, any additional controls, such as redaction, schema filtering, and quota enforcement, are not applied when the option is published to a gateway.

## Causes

This is caused by a bug in {{site.data.reuse.egw}} versions 11.4.1, 11.4.2 and 11.5.0. The bug has been fixed in versions 11.5.1 and later.

## Resolving the problem

To resolve the problem, complete any one of the following steps:

- [Configure mTLS](../../describe/option-controls/#mtls) with SASL identification.
- [Upgrade]({{ 'eem/installing/upgrading/' | relative_url}}) {{site.data.reuse.eem_name}} and the {{site.data.reuse.egw}} to 11.5.1.
