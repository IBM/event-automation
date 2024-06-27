---
title: "Installing stand-alone Event Gateways"
excerpt: "To provide access to your socialized event endpoints, find out how to install and configure stand-alone Event Gateways outside your cluster, for example, to place it closer to your Kafka deployment."
categories: installing
slug: standalone-gateways
toc: true
---

A stand-alone gateway is useful when you need to position the gateway closer to your Kafka installation. If you need to install the {{site.data.reuse.egw}} on a different cluster to your {{site.data.reuse.eem_manager}} instance, you can install a stand-alone {{site.data.reuse.egw}} instance. The following sections describe how to install a stand-alone {{site.data.reuse.egw}} instance in an online environment.

**Note:** Stand-alone {{site.data.reuse.egw}} instances can only be installed in an online environment.



## Limitations
Endpoints that need to be shared between a mixture of stand-alone gateways and those in a Kubernetes cluster must use a host address that is resolvable by all gateways. For example, if the cluster that is associated with a Kafka topic uses an internal service address for a Kafka cluster, then a stand-alone gateway will not be able to resolve that address outside of the cluster. In such cases, separate event source aliases must be created and deployed to different gateways.

A Kafka client implementation might require that the {{site.data.reuse.egw}} presents at least one endpoint for each broker that the client is expecting to connect to. Therefore, ensure you manually configure the number of ports exposed on the host of the {{site.data.reuse.egw}} container to be greater than or equal to the maximum number of brokers across all the clusters that the {{site.data.reuse.egw}} is managing. Also ensure that all the host ports map to the exposed port on the {{site.data.reuse.egw}} container.

## Prerequisites
The stand-alone {{site.data.reuse.egw}} is provided as a Docker image and can be used only where a single Docker engine is deployed on the host. Entitlement and usage are tracked by different licensing tools depending on your deployment. If you have a usage-based license for tracking the number of API calls, ensure that you configure the gateway for the IBM License Service. Otherwise, use the [IBM License Metric Tool](#installing-the-ibm-license-metric-tool) for any other deployments.

![Event Endpoint Management 11.2.1 icon]({{ 'images' | relative_url }}/11.2.1.svg "In Event Endpoint Management 11.2.1 and later") In {{site.data.reuse.eem_manager}} 11.2.1 and later, the client certificate for the {{site.data.reuse.egw}} does not require a subject alternative name (SAN) URI to be specified. Instead, this information is set by using the [configuration options](#configuration-options) when deploying the {{site.data.reuse.egw}}. For information about installing a stand-alone gateway by using the previous deployment process, see the [11.1 documentation](../../eem_11.1/installing/standalone-gateways).

## System requirements

Ensure that you have at least 2 CPU cores and 2 GiB of memory available on the system that you want to install and run the stand-alone {{site.data.reuse.egw}}.

## Supported operating systems

- Red Hat Enterprise Linux® Server 7 (x86-64)
- SUSE Linux® Enterprise Server (SLES) 12.0 (x86-64)
- Linux on IBM z13 (s390x) or later systems

## Certificates

The {{site.data.reuse.egw}} uses a number of certificates to ensure that communication is encrypted. You need both the certificate and the associated private key when you run the service. The requirements are as follows:

- A certificate for the {{site.data.reuse.egw}} to present to Kafka applications that are connecting to the gateway.
- A client certificate for the {{site.data.reuse.egw}} to present to the {{site.data.reuse.eem_manager}}, which is used to register, authenticate, and authorize this gateway instance.
- The certificate for the CA that issues the {{site.data.reuse.eem_manager}} certificate that the gateway connects to for its configuration.

Create a local folder called `certs` on the host where you want to run the service and add the following files (all files are in PEM format):

- **client.pem**: The public certificate for {{site.data.reuse.egw}} to present to Kafka clients.
- **client.key**: The private key for the {{site.data.reuse.egw}} client certificate.
- **egwclient.pem**: The public certificate for {{site.data.reuse.egw}} to use a client certificate when it connects to the associated {{site.data.reuse.eem_manager}}.
- **egwclient-key.pem**: The private key for {{site.data.reuse.egw}} to use a client certificate.
- **ca.pem**: The public certificate for the CA that issues the {{site.data.reuse.eem_manager}} certificate.

## {{site.data.reuse.egw}} client certificate

The {{site.data.reuse.egw}} uses a client certificate to register itself with the {{site.data.reuse.eem_manager}}. This certificate provides the authentication and authorization that allows the gateway to pull information about topics and subscriptions from the {{site.data.reuse.eem_manager}}. This means that the certificate must be issued by a CA that the {{site.data.reuse.eem_manager}} trusts.

## Installing

To install a stand-alone {{site.data.reuse.egw}}, download the {{site.data.reuse.egw}} Docker image from the IBM Container software library as follows:

```shell
docker login cp.icr.io -u cp
docker pull cp.icr.io/cp/ibm-eventendpointmanagement/egw:{{site.data.reuse.eem_current_version}}
```

The password to log in to the IBM Container software library is your entitlement key, which you can obtain from the container software library [site](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}.

## Configuration options

Before you start the {{site.data.reuse.egw}}, define the following options:

- **EEM_BACKEND_URL**: The URL to be used by the {{site.data.reuse.egw}} to connect to the {{site.data.reuse.eem_manager}}. This URL is the `gateway` API endpoint defined in the {{site.data.reuse.eem_manager}}, and will contain `ibm-eem-gateway` in the URL.
- **GATEWAY_ID**: The unique ID for this gateway.
- **GATEWAY_GROUP**: The name of the group for the gateway to join.
- **GATEWAY_PORT**: The port on the host that is exposed for external connections from Kafka applications.
- **GATEWAY_CONTACT**: Optional: for providing contact information that is displayed in the {{site.data.reuse.eem_name}} UI.
- **PATH_TO_CERTIFICATES**: A local directory in which the [certificates](#certificates) are placed.
- **KAFKA_ADVERTISED_LISTENER**: The host and port that Kafka applications should receive when making requests. If applications have direct access, then this will be the host and port of the {{site.data.reuse.egw}}, otherwise it should be the host and port of the routing or proxy service that is in front of the {{site.data.reuse.egw}}.
- **PORT_MAPPINGS**: a sequence of port assignments (`-p <HOST_PORT>:<GATEWAY_PORT>`) that satisfies the requirement that the number of exposed host ports is greater than, or equal to, the total number of Kafka brokers that are managed by this gateway.
- **swid**: Specifies the license under which the stand-alone {{site.data.reuse.egw}} is deployed. It must be either **EA** for Event Automation license, or **CP4I** for Cloud Pak for Integration license.
- **ubp**: Optionally, set this environment variable in the Docker container if the stand-alone {{site.data.reuse.egw}} is licensed under Usage Based Pricing terms. You cannot specify both the **ubp** and **swid** options at the same time as they are mutually exclusive licensing terms.

## Starting the {{site.data.reuse.egw}}

To run the {{site.data.reuse.egw}}, use the following command and the configuration options that are described in the previous section:

```shell
docker run -e backendURL="<EEM_BACKEND_URL>" -e swid="EA/CP4I" [-e ubp=true] \
   -e KAFKA_ADVERTISED_LISTENER="<KAFKA_ADVERTISED_LISTENER>" -e GATEWAY_PORT="<GATEWAY_PORT>" \
   -e GATEWAY_ID="<GATEWAY_ID>"  -e GATEWAY_GROUP="<GATEWAY_GROUP>" -e GATEWAY_CONTACT="<GATEWAY_CONTACT>" \
   -e certPaths="/certs/eem/client.pem,/certs/eem/client.key,/certs/eem/ca.pem,/certs/eem/egwclient.pem,/certs/eem/egwclient-key.pem" \
   -v <PATH_TO_CERTIFICATES>:/certs/eem -d -p <HOST_PORT>:<GATEWAY_PORT> <IMAGE_NAME_FROM_CONTAINER_REGISTRY>
```

When the {{site.data.reuse.egw}} starts, it connects to the specified {{site.data.reuse.eem_manager}} at which point it is registered. 

## Installing the IBM License Metric Tool

**Important**: This licensing tool is required for all Event Endpoint Management deployments except usage-based ones.

The IBM License Metric Tool checks usage and entitlement to the stand-alone {{site.data.reuse.egw}}.

Ensure that you [install](https://www.ibm.com/docs/en/license-metric-tool?topic=tool-installing){:target="_blank"} the IBM License Metric Tool before you install the stand-alone {{site.data.reuse.egw}}. Also review the additional Docker-specific License Metric Tool [considerations](https://www.ibm.com/docs/en/license-metric-tool?topic=configuration-discovering-software-in-docker-containers){:target="_blank"}.

**Note:** When deploying a stand-alone gateway on Linux on IBM z13 (s390x), the [IBM License Metric Tool disconnected scanner](https://www.ibm.com/docs/en/license-metric-tool?topic=installing-disconnected-scanners-ansible-lite){:target="_blank"} must be installed and configured alongside the stand-alone gateway. This is in addition to the License Metric Tool running on a supported platform. Submit the results from the disconnected scanner to the License Metric Tool [at regular intervals](https://www.ibm.com/docs/en/license-metric-tool?topic=installing-license-metric-tool-lite-end-end-checklist){:target="_blank"} to maintain licensing compliance.