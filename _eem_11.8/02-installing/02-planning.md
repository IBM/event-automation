---
title: "Planning your installation"
excerpt: "Planning your installation of Event Endpoint Management."
categories: installing
slug: planning
toc: true
---

Consider the following when planning your installation of {{site.data.reuse.eem_name}}.

Decide the purpose of your deployment, for example, whether you want to try a starter deployment for testing purposes, or start setting up a production deployment.

- Use the sample deployments described in the following sections as a starting point if you need something to base your deployment on.
- For production use, and whenever you want your data to be saved in the event of a restart, set up [persistent storage](#planning-for-persistent-storage).
- Consider the options for [securing](#planning-for-security) your deployment.

## Sample deployments for {{site.data.reuse.eem_manager}}
{: #sample-deployments-for-event-manager}

A number of sample configurations are available when installing {{site.data.reuse.eem_name}} on which you can base your deployment. These range from smaller deployments for non-production development or general experimentation to deployments that can handle a production workload.

If you are installing on the {{site.data.reuse.openshift_short}} or on other Kubernetes platforms, the following samples are available:

- [Quick start](#example-deployment-quick-start)
- [Quick start - with ephemeral storage](#example-deployment-quick-start-with-ephemeral)
- [Quick start with {{site.data.reuse.apic_short}} v10 integration](#example-deployment-quick-start-with-api-connect-integration)
- [Production](#example-deployment-production)
- [Production with {{site.data.reuse.wm_portal_long}} v12.1.1 or later integration](#example-deployment-production-with-api-connect-dpo-integration)

If you are installing in the {{site.data.reuse.cp4i}} UI, you can select the following sample configurations:

- [Quick start](#example-deployment-quick-start)
- [Quick start - with ephemeral storage](#example-deployment-quick-start-with-ephemeral)
- [Quick start with {{site.data.reuse.apic_short}} v10 integration](#example-deployment-quick-start-with-api-connect-integration)
- [Production](#example-deployment-production)
- [Production with {{site.data.reuse.wm_portal_long}} v12.1.1 or later integration](#example-deployment-production-with-api-connect-dpo-integration)
- [Usage-based pricing](#example-deployment-usage-based-pricing)

The sample configurations for both the {{site.data.reuse.openshift_short}} and other Kubernetes platforms are also available in [GitHub](https://ibm.biz/ea-eem-samples){:target="_blank"} where you can select the GitHub tag for your {{site.data.reuse.eem_name}} version, and then go to `/cr-examples/eventendpointmanagement/openshift` or `/cr-examples/eventendpointmanagement/kubernetes` to access the samples.

**Important:** For a production setup, the sample configuration values are for guidance only, and you might need to change them.

### Example deployment: **Quick start**
{: #example-deployment-quick-start}

Overview: A development {{site.data.reuse.eem_manager}} instance with reduced resources, dynamically provisioned persistence storage, and local authentication.

This example provides a starter deployment that can be used if you simply want to try {{site.data.reuse.eem_name}} with a minimum resource footprint. This example is deployed with persistence and reduced resources.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.25                | 0.5               | 0.25                | 0.5               | 1     |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_manager}} instance is able to consume.

### Example deployment: **Quick start - with ephemeral**
{: #example-deployment-quick-start-with-ephemeral}

Overview: A development {{site.data.reuse.eem_manager}} instance with reduced resources that uses ephemeral storage and local authentication, suitable for prototyping, but not long-term use.

This example provides a starter deployment that can be used if you simply want to try {{site.data.reuse.eem_name}} with a minimum resource footprint. This example is deployed without persistence and reduced resources.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.25                | 0.5               | 0.25                | 0.5               | 1     |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_manager}} instance is able to consume.

**Important:** All data will be lost if the manager pod is restarted.

### Example deployment: **Production**
{: #example-deployment-production}

Overview: A production instance with support for persistence and OpenID Connect (OIDC) authentication.

This example installs a production-ready {{site.data.reuse.eem_manager}} instance, with dynamically provisioned persistence, using OIDC authentication with keycloak, using provided CA and custom UI certificates.

Resource requirements for this deployment:


| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.5                 | 1.0               | 0.5                 | 1.0               | 1                                |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_manager}} instance is able to consume.

### Example deployment: Production with {{site.data.reuse.wm_portal_long}} v12.1.1 or later integration
{: #example-deployment-production-with-api-connect-dpo-integration}

This example installs a production-ready {{site.data.reuse.eem_manager}} instance, with dynamically provisioned persistence, using OIDC authentication with keycloak, using a provided CA and custom UI certificates, and configuration options for the integration with {{site.data.reuse.wm_portal_long}} v12.1.1 or later.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.5                 | 1.0               | 0.5                 | 1.0               | 1                                |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_manager}} instance is able to consume.

### Example deployment: Quick start with {{site.data.reuse.apic_short}} integration v10 integration
{: #example-deployment-quick-start-with-api-connect-integration}

Overview: A development {{site.data.reuse.eem_manager}} instance with no persistence, local authentication, and configuration options for the {{site.data.reuse.apic_short}} integration v10.0.6 or later 10.x.x.

This example is suitable for testing a starter deployment of {{site.data.reuse.eem_manager}} that can be configured to integrate with {{site.data.reuse.apic_short}} v10.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.5                 | 1.0               | 0.5                 | 1.0               | 1                                |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_manager}} instance is able to consume.

### Example deployment: **Usage-based pricing**
{: #example-deployment-usage-based-pricing}

Overview: A production instance with additional fields to point to an installed License Service server to record usage-based metrics.

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.5                 | 1.0               | 0.5                 | 1.0               | 1                                |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_manager}} instance is able to consume.

## Planning for persistent storage
{: #planning-for-persistent-storage}

If you plan to have persistent volumes, consider the disk space required for storage. {{site.data.reuse.eem_name}} stores
data in JSON format. The amount of data stored is proportional to the number of entries in the {{site.data.reuse.eem_name}}
catalog and the number of subscribers. For storage classes that support resizing, it might be sufficient to begin with `100Mi`,
monitor and extend as needed. By default, a value of `500Mi` is used. <!-- DRAFT COMMENT: impact of applications? !>

You either need to create a [persistent volume](https://v1-35.docs.kubernetes.io/docs/concepts/storage/persistent-volumes/#static){:target="_blank"}, a persistent volume and persistent volume claim, or specify a storage class that supports [dynamic provisioning](https://v1-35.docs.kubernetes.io/docs/concepts/storage/persistent-volumes/#dynamic){:target="_blank"}.

For information about creating persistent volumes and creating a storage class that supports dynamic provisioning:

- For {{site.data.reuse.openshift_short}}, see the [{{site.data.reuse.openshift_short}} documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/storage/understanding-persistent-storage){:target="_blank"}.
- For other Kubernetes platforms, see the [Kubernetes documentation](https://v1-35.docs.kubernetes.io/docs/concepts/storage/persistent-volumes/){:target="_blank"}.

You must have the `Cluster Administrator` role for creating persistent volumes or a storage class.

- If these persistent volumes are to be created manually, this must be done by the cluster administrator before installing {{site.data.reuse.eem_name}}. These will then be claimed from a central pool when the {{site.data.reuse.eem_manager}} instance is deployed.
- If these persistent volumes are to be created automatically, ensure a [dynamic provisioner](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/storage/dynamic-provisioning){:target="_blank"} is configured for the storage class you want to use. See [data storage requirements](../prerequisites/#data-storage-requirements) for information about storage systems supported by {{site.data.reuse.eem_name}}.

**Important:** When creating persistent volumes ensure the **Access mode** is set to `ReadWriteOnce` for the volume.

To use persistent storage, [configure the storage properties](../configuring#enabling-persistent-storage) in your `EventEndpointManagement` custom resource.

**Note:** If you intend to [back up](../backup-restore#before-you-begin) your {{site.data.reuse.eem_manager}} instance, consider a storage class that supports `CSI snapshotting`.

## Planning for security
{: #planning-for-security}

Before you install {{site.data.reuse.eem_name}}, decide how to authenticate users and how to secure the {{site.data.reuse.eem_name}} network endpoints.  

<!-- FUTURE: we don't mention network policies here, we probably should. -->

### User authentication
{: #user-security}

To authenticate users of the {{site.data.reuse.eem_name}} UI, you can choose from the following options:

   - LOCAL: Define a list of users and passwords locally in your {{site.data.reuse.eem_name}} environment.
   - OIDC: Use an existing [OIDC-compatible](https://openid.net/connect/){:target="_blank"} security provider that is available in your environment.
   - INTEGRATION_KEYCLOAK: Use an {{site.data.reuse.cp4i}} installation on the same cluster to manage users and roles.

To modify your authentication configuration, see [managing access](../../security/managing-access)

<!-- FUTURE: we should cover Admin API too -->

### Endpoint TLS configuration
{: #endpoint-tls-security}

TLS is used to secure your {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} endpoints. The {{site.data.reuse.eem_name}} operator and cert-manager can generate default self-signed TLS certificates for you, or you can configure your own custom certificates to secure the endpoints.

To secure {{site.data.reuse.eem_manager}} endpoints, use one of the following configurations, which are listed in order of complexity to configure (from simplest to most complex):

- **Operator-configured CA**: The operator creates a self-signed CA certificate that is used to generate all the other required certificates. This configuration is the default.
- **Custom UI certificate**: Provide a secret that contains the TLS certificate that you want {{site.data.reuse.eem_name}} UI users to see when they log in to the UI. For more information, see [custom UI certificates](../../security/config-tls#custom-ui-certs).
- **Custom CA certificate**: Provide a secret that contains a certificate authority (CA) certificate, which is used to generate the {{site.data.reuse.eem_manager}} server certificate. See [Custom CA certificate](../../security/config-tls#custom-ca-certificate-manager).
- **Custom certificate**: Provide a secret that contains a CA certificate, server certificate, and a key that has the required DNS names for accessing the {{site.data.reuse.eem_manager}}. See [Custom CA and leaf certificates](../../security/config-tls#custom-ca-and-leaf).

To secure your {{site.data.reuse.egw}} endpoint on Kubernetes and OpenShift platforms, you must either create a Kubernetes secret that contains your CA certificate, server certificate, and key, or provide these as separate PEM files. <!-- CONTEXT: I know you don't actually need the server cert for operator-managed gway, but I don't think it's vital user knows this at this point and it would only complicate this section. -->

To secure a Docker {{site.data.reuse.egw}} endpoint, you must provide a CA certificate, server certificate, and key as separate PEM files.

For more information about configuring and managing endpoint security, see [configuring TLS](../../security/config-tls).

## {{site.data.reuse.egw}} deployment planning
{: #gateway-planning}

### Deciding which {{site.data.reuse.egw}} deployment type to use
{: #deciding-gateway-type}

Deciding which method to use for your gateway deployment depends on the location of your Kafka clusters and {{site.data.reuse.eem_manager}}.

If the Kafka cluster is located in a different environment from your {{site.data.reuse.eem_manager}}, then to minimize latency it is recommended to install a gateway as a [Docker container or Kubernetes Deployment](../install-gateway#remote-gateways) in the same environment as the Kafka cluster, or as close as possible.

If the Kafka cluster is located in the same environment as your {{site.data.reuse.eem_manager}}, then it is recommended to install the [operator-managed](../install-gateway#operator-managed-gateways) gateway, so that your gateway is monitored and maintained by the {{site.data.reuse.eem_name}} operator.

Key points:

- To minimize latency, locate gateways as close as possible to the Kafka cluster.
- You are responsible for monitoring and upgrading the gateways. When {{site.data.reuse.eem_name}} is upgraded, the {{site.data.reuse.eem_name}} UI displays an alert for you to upgrade the gateways. 

### {{site.data.reuse.egw}} hostnames
{: #gateway-hostnames}

Before you add any {{site.data.reuse.egw}}s to your deployment, work out the number of gateway hostnames that you require:

Calculate the total number of Kafka brokers across all the Kafka clusters that you expect your {{site.data.reuse.egw}} instances to connect to. If you plan to use different gateway groups for different Kafka clusters, then calculate the total number of brokers for each gateway group.

The total number of hostnames for all gateways in a gateway group must be the same or greater than the total number of Kafka brokers that you plan the gateway group to serve topics from. If this requirement is not met, then your gateway group does not have enough unique hostnames to use for all the Kafka brokers.

**Note:** If you create multiple connections to the same Kafka cluster, then the total number of hostnames that are required are equal to the number of brokers on that Kafka cluster multiplied by the number of connections you create to that cluster.


## Licensing
{: #licensing}

Licensing tracking as part of a {{site.data.reuse.cp4i}} deployment is either based on Virtual Processing Cores (VPCs) or Monthly API Calls (usage-based license) depending on the purchased license. If you are using an Event Automation license, VPCs are the only option.

For more information about available licenses, chargeable components, and tracking license usage, see the [licensing reference]({{ 'support/licensing' | relative_url }}).

## FIPS compliance
{: #fips-compliance}

{{site.data.reuse.eem_name}} can be implemented in a Federal Information Processing Standards (FIPS) compliant manner.

For more information about requirements, configuring, and limitations of setting up {{site.data.reuse.eem_name}} in a FIPS-compliant manner, see [Enabling FIPS](../../security/fips).
