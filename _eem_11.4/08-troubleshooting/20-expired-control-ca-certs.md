---
title: "Unable to replace the CA certificate uploaded when an mTLS control was created"
excerpt: "It is not possible to replace the CA certificate that you uploaded when you created a control"
categories: troubleshooting
slug: unable-to-replace-ca-cert
toc: true
---

## Symptoms

![Event Endpoint Management 11.4.1 icon]({{ 'images' | relative_url }}/11.4.1.svg "In Event Endpoint Management 11.4.1.") You define an [mTLS control](../../describe/option-controls#mtls), upload a CA certificate, and publish the option. The CA certificate expires and you need to replace it, but the control's mTLS configuration is not editable.

## Causes

Options and controls are immutable after they are published.


## Resolving the problem

1. Remove all [subcriptions](../../describe/managing-user-access-to-topics#removing-subscriptions) to the option.
2. [Unpublish](../../describe/managing-options#option-lifecycle-states) the option.
3. Create a new option and [mTLS control](../../describe/option-controls#mtls) that use your updated CA certificate.
4. All subscribers must create a new subscription to the new option.
