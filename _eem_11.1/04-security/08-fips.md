---
title: "Enabling Federal Information Processing Standards (FIPS)"
excerpt: "Find out how to set up Event Endpoint Management in a FIPS-compliant manner."
categories: security
slug: fips
toc: true
---

Find out how to set up {{site.data.reuse.eem_name}} to be FIPS-compliant by using a boundary approach that is enabled by the ["FIPS Wall"](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=reference-fips-compliance){:target="_blank"}.


## Requirements

To run a FIPS-compliant {{site.data.reuse.eem_name}} deployment, you need a [FIPS-enabled OpenShift Container Platform cluster](https://docs.openshift.com/container-platform/4.14/installing/installing-fips.html#installing-fips-mode_installing-fips){:target="_blank"} available with the {{site.data.reuse.eem_name}} operator that is installed with a version of 11.1.0 or later.

Ensure that you run {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} with the default TLS version of 1.3 and ensure that all clients have the following cipher suites available:
- `TLS_AES_128_GCM_SHA256`
- `TLS_AES_256_GCM_SHA384`

### Installation instructions

Both the {{site.data.reuse.eem_name}} Manager and the {{site.data.reuse.egw_short}} applications pick up the `FIPS_MODE` environment variable and sets FIPS-compliant ciphers on secure endpoints if the value of this environment variable is `wall`. The {{site.data.reuse.eem_name}} operator allows you to handle the installation entirely in the corresponding custom resource. 

To enable the FIPS wall, complete the following steps.

1. In the {{site.data.reuse.eem_name}} Manager custom resource, set the value of `spec.manager.fips.mode` to `wall`.  The operator sets the corresponding environment variable in the manager pod.

1. For the {{site.data.reuse.egw_short}}, complete one of the following steps appropriate for your installation.

    **a.** If the {{site.data.reuse.egw_short}} is running on a Kubernetes cluster managed by the {{site.data.reuse.eem_name}} operator, in the {{site.data.reuse.egw_short}} custom resource, set the value of `spec.fips.mode` to `wall`.  

    **b.** If the {{site.data.reuse.egw_short}} is running as a container in a stand-alone docker engine (as opposed to being managed in an OpenShift Container Platform or Kubernetes by the operator), in the docker run command, start the container with the `FIPS_MODE` environment variable set to `wall`. For example:

```shell
docker run -e backendURL="<EEM_BACKEND_URL>" -e swid="EA/CP4I" [-e ubp=true] -e FIPS_MODE="wall" \
    -e KAFKA_ADVERTISED_LISTENER="<KAFKA_ADVERTISED_LISTENER>" -e GATEWAY_PORT="<GATEWAY_PORT> \
    -e certPaths="/certs/eem/client.pem,/certs/eem/client.key,/certs/eem/ca.pem,/certs/eem/egwclient.pem,/certs/eem/egwclient-key.pem" \
    -v <PATH_TO_CERTIFICATES>:/certs/eem -d -p <GATEWAY_PORT>:8080 <IMAGE_NAME_FROM_CONTAINER_REGISTRY>
```
