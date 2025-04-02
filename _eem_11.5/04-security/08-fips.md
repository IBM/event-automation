---
title: "Enabling Federal Information Processing Standards (FIPS)"
excerpt: "Find out how to set up Event Endpoint Management in a FIPS-compliant manner."
categories: security
slug: fips
toc: true
---

Find out how to set up {{site.data.reuse.eem_name}} to be FIPS-compliant by using a boundary approach that is enabled by the ["FIPS Wall"](https://www.ibm.com/docs/en/cloud-paks/cp-integration/16.1.0?topic=reference-fips-compliance){:target="_blank"}.


## Requirements

To run a FIPS-compliant {{site.data.reuse.eem_name}} deployment, you need a [FIPS-enabled OpenShift Container Platform cluster](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/installation_overview/installing-fips){:target="_blank"} available with the {{site.data.reuse.eem_name}} operator that is installed with a version of 11.1.0 or later.

Ensure that you run both the {{site.data.reuse.eem_manager}} and the {{site.data.reuse.egw}} with the default TLS version of 1.3 and ensure that all clients have the following cipher suites available:

- `TLS_AES_128_GCM_SHA256`
- `TLS_AES_256_GCM_SHA384`

### Installation instructions

Both the {{site.data.reuse.eem_manager}} and the {{site.data.reuse.egw}} applications pick up the `FIPS_MODE` environment variable and sets FIPS-compliant ciphers on secure endpoints if the value of this environment variable is `wall`. The {{site.data.reuse.eem_name}} operator allows you to handle the installation entirely in the corresponding custom resource. 

To enable the FIPS wall, complete the following steps.

1. In the `EventEndpointManagement` custom resource for the {{site.data.reuse.eem_manager}} instance, set the value of `spec.manager.fips.mode` to `wall`. The operator sets the corresponding environment variable in the manager pod.

1. For the {{site.data.reuse.egw_short}}, complete one of the following steps appropriate for your installation.

    **a.** For operator-managed and [Kubernetes Deployment {{site.data.reuse.egw}}](../../installing/install-gateway#remote-gateways) {{site.data.reuse.egw_short}} instances, set the value of `spec.fips.mode` to `wall`.  

    **b.** For {{site.data.reuse.egw_short}}s deployed as Docker instances, in the Docker `run` command, start the container with the `FIPS_MODE` environment variable set to `wall`. For example: `docker run -e FIPS_MODE="wall"`
