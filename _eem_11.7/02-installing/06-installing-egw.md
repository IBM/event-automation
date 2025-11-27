---
title: "Installing the Event Gateway"
excerpt: "Generate gateway deployment configurations in the {{site.data.reuse.eem_name}} UI, to deploy gateways in your environment. You can install and configure Event Gateways as a Docker container, Kubernetes Deployment, or operator-managed Custom Resource."
categories: installing
slug: install-gateway
toc: true
---

{{site.data.reuse.egw}}s are added to {{site.data.reuse.eem_name}} by deploying them with a configuration that points to your {{site.data.reuse.eem_manager}}. When the gateway is deployed, it registers itself with the {{site.data.reuse.eem_manager}} that is specified in its configuration. Use the {{site.data.reuse.eem_name}} UI to generate the configuration properties for your gateway. The {{site.data.reuse.eem_name}} UI can generate {{site.data.reuse.egw}} configurations for the following deployment methods:

- Docker container. The {{site.data.reuse.eem_name}} UI generates a Docker command to run an {{site.data.reuse.egw}}. The gateway configuration is contained in the Docker run command’s arguments.
- Kubernetes Deployment. The {{site.data.reuse.eem_name}} UI generates the YAML for a Kubernetes Deployment that runs the {{site.data.reuse.egw}}. 
- Operator-managed custom resource (CR). The {{site.data.reuse.eem_name}} UI generates the YAML for a custom resource that runs the {{site.data.reuse.egw}}. Your {{site.data.reuse.eem_name}} operator manages this custom resource.

Key points to consider:

- The Kubernetes Deployment and operator-managed gateways are monitored and managed by the Kubernetes environment, restarting the {{site.data.reuse.egw}} pod if necessary. If a gateway that is deployed directly as a Docker container fails, then it must be restarted manually. 
- To minimize latency, locate {{site.data.reuse.egw}}s as close as possible to the Kafka cluster.
- Maintain the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} at the same {{site.data.reuse.eem_name}} version.
- The operator-managed gateway is the only gateway that is upgraded automatically when {{site.data.reuse.eem_manager}} is upgraded. You are responsible for upgrading Kubernetes Deployment and Docker {{site.data.reuse.egw}}s at the same time as you upgrade the {{site.data.reuse.eem_manager}}.

## System requirements
{: #system-requirements}

The {{site.data.reuse.egw}} container is provided as a multi-architecture docker image, with support for Linux 64-bit (x86_64) systems and Linux on IBM z (s390x) architectures. For more information about container and resource requirements see [Resource requirements](../prerequisites).

## {{site.data.reuse.egw}} planning
{: #gateway-planning}

Consider the following:

- How many {{site.data.reuse.egw}}s and [gateway groups](../../about/key-concepts#gateway-group) do you require?
- Where do you want to run your {{site.data.reuse.egw}}s? In the same environment as your {{site.data.reuse.eem_manager}}, or closer to your Kafka cluster?
- How will the {{site.data.reuse.egw}}s be run and managed? As an operator-managed gateway, a Kubernetes Deployment, or as a stand-alone Docker container?
- What network access is required? Are your Kafka clients connecting from the public internet, or from a private network?
- What certificates will secure the {{site.data.reuse.egw}} endpoint? You must provide the TLS certificates to secure your {{site.data.reuse.egw}}. If your organization does not have its own certificates, then you can create your own:
  - For operator-managed and Kubernetes Deployment gateways, use [cert-manager](../install-k8s-egw#self-signed) to generate certificates stored in Kubernetes secrets. 
  - For Docker gateways, use [openssl](../install-docker-egw#openssl) to create certificate files.
  <!--- _DRAFT COMMENT: what do we say about operator-managed gateways here? Certs are created by the operator, but user can replace them?_ -->
- What hostnames do you want for your {{site.data.reuse.egw}}s? 

  If the Kafka cluster that you intend your {{site.data.reuse.egw}} to manage traffic for has multiple brokers, then you must have a separate hostname and port combination for each broker.


## Operator-managed gateways
{: #operator-managed-gateways}

If you want to install the {{site.data.reuse.egw}} on the same cluster as the {{site.data.reuse.eem_manager}}, use the {{site.data.reuse.eem_name}} operator to install instances by applying the `EventGateway` custom resource type.

[Generate](#operator-managed-install) your `EventGateway` custom resource YAML file from the {{site.data.reuse.eem_name}} UI.

Instances of the {{site.data.reuse.egw}} can be created only after the {{site.data.reuse.eem_name}} operator and the {{site.data.reuse.eem_manager}} instance are installed. 
- If the operator is installed into **a specific namespace**, then it can be used to manage only instances of the {{site.data.reuse.egw}} in that namespace. 
- If the operator is installed for **all namespaces**, then it can be used to manage instances of the {{site.data.reuse.egw}} in any namespace.

When you install an instance of the operator-managed {{site.data.reuse.egw}}, ensure that you are using a namespace that an {{site.data.reuse.eem_name}} operator is managing.

**Note:** On Kubernetes platforms other than {{site.data.reuse.openshift_short}}, "all namespaces" refers to an installation where `watchAnyNamespace=true` was set during the [Helm installation](../installing-on-kubernetes).


## Kubernetes Deployment and Docker gateways
{: #remote-gateways}

The typical scenario for using Kubernetes Deployment or Docker gateways is when your Kafka cluster is in a different environment from your {{site.data.reuse.eem}} operator, and you want to locate the gateway as close as possible to the Kafka cluster for optimum performance. 

**Note:** Kubernetes Deployment or Docker {{site.data.reuse.egw}} instances can be installed only in an online environment.

- The Docker {{site.data.reuse.egw}} is provided as a Docker image and can be used only where a single Docker engine is deployed on the host. 

- Entitlement and usage are tracked by different licensing tools depending on your deployment. If you have a usage-based license for tracking the number of API calls, ensure that you configure the gateway for the IBM License Service. Otherwise, use the [IBM License Management Tool](https://www.ibm.com/docs/en/license-metric-tool?topic=tool-installing){:target="_blank"} for any other deployments. <!--_DRAFT COMMENT: Update based on outcome of https://jsw.ibm.com/browse/EVI-13487_ -->
- A supported container host environment as defined in the [Red Hat Enterprise Linux Container Compatibility Matrix](https://access.redhat.com/support/policy/rhel-container-compatibility){:target="_blank"} is required.


## Installing an operator-managed {{site.data.reuse.egw}}
{: #operator-managed-install}

Follow the steps in [installing an operator-managed {{site.data.reuse.egw}}](../install-opman-egw).

## Installing the {{site.data.reuse.egw}} as a Kubernetes Deployment
{: #install-k8s-deploy}

Follow the steps in [installing the {{site.data.reuse.egw}} as a Kubernetes Deployment](../install-k8s-egw).

## Installing the {{site.data.reuse.egw}} as a Docker container
{: #installing-docker-gateway}

Follow the steps in [installing the {{site.data.reuse.egw}} as a Docker container](../install-docker-egw).

## Verifying the {{site.data.reuse.egw}}
{: #verify-gateway}

Confirm that your {{site.data.reuse.egw}} is able to connect to your Kafka clusters, and that Kafka clients can connect to your gateway.

### Verifying the {{site.data.reuse.egw}} endpoint
{: #verify-gateway-endpoint}

Verify that your {{site.data.reuse.egw}} endpoint is accessible to your Kafka clients and is secured with the TLS certificate that you expect.

1. In a web browser, navigate to your {{site.data.reuse.egw}} endpoint.

   The browser responds with a security warning, and an option to view the endpoint's TLS certificate.

   **Note:** Instead of a browser you can use command line tools such as OpenSSL to view the certificate, for example:

   ```shell
   openssl s_client -connect <gateway endpoint>:443 -servername <gateway endpoint> -showcerts
   ```
2. View the certificate, and confirm that it matches the certificate that you configured for your {{site.data.reuse.egw}} endpoint.
3. Exit from the browser. 

   **Note:** The gateway endpoint does not host any HTTP service, so no HTTP response is returned to the browser. This test is to check only that a client can make a TCP connection with your gateway endpoint.

### Verifying the {{site.data.reuse.egw}} to Kafka cluster communication
{: #verify-gateway-kafka}

To verify the connection between the gateway and your Kafka clusters, complete the following steps:

1. Log in to the {{site.data.reuse.eem_name}} UI with your login credentials.
2. In the navigation pane, click **Manage clusters**.
3. Confirm that your clusters show `All gateways connected` in the **Gateway visibility** column.


## {{site.data.reuse.egw}} license requirements
{: #gateway-license-requirements}

The {{site.data.reuse.egw}} must use the same license as the {{site.data.reuse.eem_manager}}. You accept the license by setting `ACCEPT_LICENSE` to `"true"` in the gateway configuration.

The gateway configuration templates generated from the {{site.data.reuse.eem_name}} UI preset the `LICENSE_ID` based on the license used by the  {{site.data.reuse.eem_manager}}. 

If your {{site.data.reuse.eem_manager}} is not using a usage-based license and your gateway is not operator-managed, then you must install additional IBM licensing software:

- If your gateway is installed as a Kubernetes Deployment, then install the IBM Licensing Service in the same environment as the gateway. The gateway YAML generated by the {{site.data.reuse.eem_name}} UI sets the appropriate license configuration in `metadata.annotations`.
- If your gateway is installed as a Docker container, then install the [IBM License Management Tool](../install-docker-egw#licensing) in the same environment as your gateway and set the [**swid**](../install-docker-egw#generating-gateway-docker-config) as follows:
   - If the {{site.data.reuse.eem_manager}} uses an {{site.data.reuse.ea_short}} license, then set `swid="EA"`.
   - If the {{site.data.reuse.eem_manager}} uses a {{site.data.reuse.cp4i}} license, then set `swid="CP4I"`.


