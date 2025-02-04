---
title: "What's new"
excerpt: "Find out what is new in Event Streams."
categories: about
slug: whats-new
toc: true
---

Find out what is new in {{site.data.reuse.es_name}} version 11.6.x.


## Release 11.6.0


### Support for IAM and `cloudctl` features are removed

{{site.data.reuse.es_name}} release 11.6.0 and later do not support the following {{site.data.reuse.icpfs}} features: Identity and Access Management (IAM) and the IBM Cloud Pak CLI (`cloudctl`).

- You can continue to configure and manage authentication by using SCRAM or Keycloak for {{site.data.reuse.es_name}} instances. For more information, see [managing access](../../security/managing-access/#accessing-the-event-streams-ui-and-cli).
- You can continue to manage your {{site.data.reuse.es_name}} instance from the command line by using the {{site.data.reuse.es_name}} CLI plug-in for the Kubernetes command-line tool, `kubectl`. For more information, see [installing the {{site.data.reuse.es_name}} command-line interface](../../installing/post-installation/#installing-the-event-streams-command-line-interface).

### Support for Kubernetes 1.32

{{site.data.reuse.es_name}} version 11.6.0 introduces [support]({{ 'support/matrix/#event-streams' | relative_url }}) for Kubernetes platforms version 1.32 that support the Red Hat Universal Base Images (UBI) containers.


### Security and bug fixes

{{site.data.reuse.es_name}} release 11.6.0 contains security and bug fixes.
