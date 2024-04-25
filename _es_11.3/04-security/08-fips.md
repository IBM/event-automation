---
title: "Enabling Federal Information Processing Standards (FIPS)"
excerpt: "Find out how to set up Event Streams in a FIPS-compliant manner."
categories: security
slug: fips
toc: true
---

Find out how to set up {{site.data.reuse.es_name}} to be FIPS-compliant by using a boundary approach that is enabled by the ["FIPS Wall"](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2023.4?topic=reference-fips-compliance){:target="_blank"}.

## Requirements

To run a FIPS-compliant {{site.data.reuse.es_name}} deployment, ensure that you have a [FIPS-enabled OpenShift Container Platform cluster](https://docs.openshift.com/container-platform/4.14/installing/installing-fips.html#installing-fips-mode_installing-fips){:target="_blank"} available with {{site.data.reuse.es_name}} version of 11.3.0 or later installed.

### Configuring {{site.data.reuse.es_name}} for FIPS

To configure your {{site.data.reuse.es_name}} instance for deployment within a FIPS-compliant boundary wall, set the following options in the {{site.data.reuse.es_name}} custom resource that defines your instance:

1. Restrict external access to Kafka listeners, the Apicurio Registry, the Admin API, and the REST Producer by setting the value of `type` to `internal` in the following sections:
  - Kafka listeners: `spec.strimziOverrides.kafka.listeners`
  - Apicurio Registry: `spec.apicurioRegistry.endpoints`
  - Admin API: `spec.adminApi.endpoints`
  - REST Producer: `spec.restProducer.endpoints`

1. Disable the {{site.data.reuse.es_name}} UI by removing the `spec.adminUI` section.

For more information about these configuration options, see [configuring](../../installing/configuring/#configuring-access).

## Limitations

The FIPS-complaint {{site.data.reuse.es_name}} deployment limits the use of the following features:

- External endpoints are not supported for Kafka listeners, the Apicurio Registry, the Admin API, and the REST Producer.
- {{site.data.reuse.es_name}} UI, geo-replication, and CLI cannot be used.
