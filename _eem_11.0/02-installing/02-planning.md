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

## Sample deployments for {{site.data.reuse.eem_name}}

A number of sample configurations are available when installing {{site.data.reuse.eem_name}} on which you can base your deployment. These range from smaller deployments for non-production development or general experimentation to deployments that can handle a production workload.

If you are [installing](../installing#installing-an-event-endpoint-management-instance-by-using-the-web-console) on the {{site.data.reuse.openshift_short}}, you can view and apply the following sample configurations in the web console:

- [Quick start](#example-deployment-quick-start)
- [Production](#example-deployment-production)
- [Quick start with API Connect integration](#example-deployment-quick-start-with-api-connect-integration)

If you are installing in the {{site.data.reuse.cp4i}} UI, you can select the following sample configurations:

- [Quick start](#example-deployment-quick-start)
- [Production](#example-deployment-production)
- [Usage-based pricing](#example-deployment-usage-based-pricing)

If you are installing on other Kubernetes platforms, the following samples are available in the Helm chart package:

- [Quick start](#example-deployment-quick-start)
- [Production](#example-deployment-production)
- [Quick start with API Connect integration](#example-deployment-quick-start-with-api-connect-integration)

The sample configurations for both the {{site.data.reuse.openshift_short}} and other Kubernetes platforms are also available in [GitHub](https://ibm.biz/ea-eem-samples){:target="_blank"} where you can select the GitHub tag for your {{site.data.reuse.eem_name}} version, and then go to `/cr-examples/eventendpointmanagement/openshift` or `/cr-examples/eventendpointmanagement/kubernetes` to access the samples.

**Important:** For a production setup, the sample configuration values are for guidance only, and you might need to change them.

### Example deployment: **Quick start**

Overview: A development {{site.data.reuse.eem_name}} instance with reduced resources, using ephemeral storage and local authentication.

This example provides a starter deployment that can be used if you simply want to try {{site.data.reuse.eem_name}} with a minimum resource footprint. This example is deployed with no persistence and reduced resources.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.25                | 0.5               | 0.25                | 0.5               | 1  <!-- Licensing for cores is always rounded up to whole number-->   |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_name}} instance is able to consume.

### Example deployment: **Production**

Overview: A production instance with support for persistence and OpenID Connect (OIDC) authentication.

This example installs a production-ready {{site.data.reuse.eem_name}} instance, with dynamically provisioned persistence, using OIDC authentication with keycloak, using provided CA and custom UI certificates.

Resource requirements for this deployment:


| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.5                 | 1.0               | 0.5                 | 1.0               | 1                                |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_name}} instance is able to consume.

### Example deployment: **Quick start with API Connect integration**

Overview: A production instance with support for persistence OpenID Connect (OIDC) authentication and includes configuration options for API Connect integration.

This example installs a production-ready {{site.data.reuse.eem_name}} instance, with persistence and using local authentication.

Resource requirements for this deployment:

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.5                 | 1.0               | 0.5                 | 1.0               | 1                                |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_name}} instance is able to consume.

### Example deployment: **Usage-based pricing**

Overview: A production instance with additional fields to point to an installed License Service server to record usage-based metrics.

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.5                 | 1.0               | 0.5                 | 1.0               | 1                                |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.eem_name}} instance is able to consume.

## Sample deployments for {{site.data.reuse.egw}}

A number of sample configurations are available when installing {{site.data.reuse.egw}} on which you can base your deployment. These range from smaller deployments for non-production development or general experimentation to deployments that can handle a production workload.

In the {{site.data.reuse.openshift_short}} web console and in the Helm chart package on other Kubernetes platforms:

- [Quick start](#example-deployment-event-gateway-quick-start)
- [Production](#example-deployment-event-gateway-production)

The sample configurations for both {{site.data.reuse.openshift_short}} and other Kubernetes platforms are also available in [GitHub](https://ibm.biz/ea-eem-samples){:target="_blank"} where you can select the GitHub tag for your {{site.data.reuse.eem_name}} version, and then go to `/cr-examples/eventgateway/openshift` or `/cr-examples/eventgateway/kubernetes` to access the samples.

**Important:** For a production setup, the sample configuration values are for guidance only, and you might need to change them.

### Example deployment: **Event Gateway quick start**

Overview: A quick start {{site.data.reuse.egw}} deployment using reduced resources.

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 0.5                 | 1.0               | 0.5                 | 1.0               | 1                                |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.egw}} instance is able to consume.

### Example deployment: **Event Gateway production**

Overview: A production-ready {{site.data.reuse.egw}} deployment.

| CPU request (cores) | CPU limit (cores) | Memory request (GiB) | Memory limit (GiB) | Chargeable cores (see [licensing]({{ '/support/licensing/#calculating-licenses-required' | relative_url }})) |
| ------------------- | ----------------- | ------------------- | ----------------- | ---------------------------------- |
| 1.0                 | 2.0               | 1.0                 | 2.0               | 2                                |

Ensure you have sufficient CPU capacity and physical memory in your environment to service at least the resource **request** values. The resource **limit** values constrain the amount of resource the {{site.data.reuse.egw}} instance is able to consume.

## Planning for persistent storage

If you plan to have persistent volumes, consider the disk space required for storage. {{site.data.reuse.eem_name}} stores
data in JSON format. The amount of data stored is proportional to the number of entries in the {{site.data.reuse.eem_name}}
catalog and the number of subscribers. For storage classes that support resizing, it might be sufficient to begin with `100Mi`,
monitor and extend as needed. By default, a value of `500Mi` is used.

You either need to create a [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#static){:target="_blank"}, a persistent volume and persistent volume claim, or specify a storage class that supports [dynamic provisioning](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#dynamic){:target="_blank"}.

For information about creating persistent volumes and creating a storage class that supports dynamic provisioning:

- For {{site.data.reuse.openshift_short}}, see the [{{site.data.reuse.openshift_short}} documentation](https://docs.openshift.com/container-platform/4.12/storage/understanding-persistent-storage.html){:target="_blank"}.
- For other Kubernetes platforms, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/){:target="_blank"}.

You must have the `Cluster Administrator` role for creating persistent volumes or a storage class.

- If these persistent volumes are to be created manually, this must be done by the cluster administrator before installing {{site.data.reuse.eem_name}}. These will then be claimed from a central pool when the {{site.data.reuse.eem_name}} instance is deployed.
- If these persistent volumes are to be created automatically, ensure a [dynamic provisioner](https://docs.openshift.com/container-platform/4.12/storage/dynamic-provisioning.html){:target="_blank"} is configured for the storage class you want to use. See [data storage requirements](../prerequisites/#data-storage-requirements) for information about storage systems supported by {{site.data.reuse.eem_name}}.

**Important:** When creating persistent volumes ensure the **Access mode** is set to `ReadWriteOnce` for the volume.

To use persistent storage, [configure the storage properties](../configuring/#enabling-persistent-storage) in your `EventEndpointManagement` custom resource.

**Note:** If you intend to [back up](../backup-restore/#before-you-begin) your {{site.data.reuse.eem_name}} instance, consider a storage class that supports `CSI snapshotting`.

## Planning for security

There are two main areas of security to consider when installing {{site.data.reuse.eem_name}}

1. The type of authentication the UI uses. You can choose LOCAL or OIDC.
   - If LOCAL, then the UI will use a secret that has a list of users and passwords.
   - If OIDC, then you must provide all the required information to connect to your OIDC provider.
2. The certificates you provide when configuring the {{site.data.reuse.eem_name}} instance and Event Gateway instance. Both use mutual TLS.
   - For an {{site.data.reuse.eem_name}} instance, use **one** of the following configurations:
     - **User-provided CA certificate**: Provide a secret containing a certificate authority (CA) certificate, which is used to generate other certificates.
     - **User-provided certificate**: Provide a secret that contains a CA certificate, server certificate, and a key that has the required DNS names for accessing the {{site.data.reuse.eem_manager}}.
     - **Operator-configured CA**: The operator creates a self-signed CA certificate and you can use it to generate all the other required certificates.
   - For an Event Gateway instance, provide one of the following items:
     - A secret containing the CA certificate.
     - A secret with the CA certificate, a server certificate, and a key correctly configured for the Event Gateway.

To modify authentication, see [configuring authentication](../configuring/#configuring-authentication).

To modify TLS, see [configuring TLS](../configuring/#configuring-tls).

## Licensing

Licensing tracking as part of a {{site.data.reuse.cp4i}} deployment is either based on Virtual Processing Cores (VPCs) or Monthly API Calls (usage-based license) depending on the purchased license. If you are using an Event Automation license, VPCs are the only option.

For more information about available licenses, chargeable components, and tracking license usage, see the [licensing reference]({{ 'support/licensing' | relative_url }}).
