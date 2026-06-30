---
title: "Replacing auto-generated mutual TLS credentials"
excerpt: "Mutual TLS credentials are automatically generated for any subscriptions that specify they are secured with mTLS but do not include the TLS credentials. How to replace auto-generated mTLS credentials with your mTLS credentials."
categories: troubleshooting
slug: auto-mtls
toc: true
---

## Symptoms
{: #symptoms}

The **Application** page of the {{site.data.reuse.eem_name}} UI shows the following warning: `When this application was migrated from a subscription, the mutual TLS credentials were auto-generated. You might need to review your credentials to ensure they continue to work as expected.`.

## Causes
{: #causes}

In {{site.data.reuse.eem_name}} 11.7.x, if you define a virtual topic as secured by mTLS and an additional security control (OAuth or SASL), then it is possible to create a subscription that provides only OAuth or SASL credentials, and not supply the mTLS credentials. In 11.8.0, applications that specify mTLS must always include the mTLS credentials. If any of your subscriptions specified mTLS, but did not include mTLS credentials, then when the subscription is converted to an application, appropriate mTLS credentials are automatically generated.

You can also receive this warning if you use the {{site.data.reuse.eem_name}} [Admin API]({{ 'eem-api' | relative_url }}) in version 11.8.0 to create subscriptions. When you create subscriptions with the Admin API, you are not required to provide mTLS credentials, and so wildcard credentials are automatically generated.


## Resolving the problem
{: #resolving}

Follow these steps to replace the auto-generated credentials:

1. Ensure that all your {{site.data.reuse.eem_name}}s [support applications](../../installing/converting-gateways).
2. [Edit the applications](../../subscribe/managing-apps#edit-app) to replace the auto-generated mTLS credentials. You must create new mTLS credentials before you can delete the auto-generated credentials.

**Note** After you replace the mTLS credentials, clients must use these updated credentials. Any clients that are not using these credentials will no longer be able to access the virtual topic. 