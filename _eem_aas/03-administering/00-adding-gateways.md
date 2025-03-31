---
title: "Installing Event Gateways"
excerpt: "To provide access to your socialized event endpoints, find out how to install and configure Event Gateways as a Docker container or Kubernetes Deployment."
categories: admin
slug: event-gateways
toc: true
copyright:
  years: 2025
lastupdated: "2025-01-15"
---

{{site.data.reuse.egw}}s are added to {{site.data.reuse.eem_name}} by deploying them with a configuration that points to your {{site.data.reuse.eem_manager}}. When the gateway is deployed, it registers itself with the {{site.data.reuse.eem_manager}} that is specified in its configuration. Use the {{site.data.reuse.eem_name}} UI to generate the configuration properties for your gateway. The following methods are available to deploy your {{site.data.reuse.egw}}s:

- Docker container. The {{site.data.reuse.eem_name}} UI generates a Docker command to run an {{site.data.reuse.egw}}. The gateway configuration is contained in the Docker command's arguments.
- Kubernetes Deployment. The {{site.data.reuse.eem_name}} UI generates the YAML contents for a Kubernetes Deployment that runs the {{site.data.reuse.egw}}. 

The difference between these deployment types is that a Kubernetes Deployment monitors and manages the {{site.data.reuse.egw}} pod, restarting it if necessary. A gateway deployed directly as a Docker container must be restarted manually if it fails. 

Key points to consider:

- To minimize latency, locate {{site.data.reuse.egw}}s as close as possible to the Kafka cluster.
- Your {{site.data.reuse.egw}}s must be at the same version as your {{site.data.reuse.eem_name}} instance. The Docker command and Kubernetes Deployment configuration that the {{site.data.reuse.eem_manager}} generates always specifies the latest version of the {{site.data.reuse.egw}}.
- You are responsible for monitoring and upgrading the {{site.data.reuse.egw}}s. When {{site.data.reuse.eem_name}} is automatically updated in {{site.data.reuse.ipaas_name}}, the {{site.data.reuse.eem_name}} UI displays an alert for you to upgrade the gateways. <!-- add a link here to upgrading page when we have it -->


## System and resource requirements
{: #system-and-resource-requirements}

<!-- **DRAFT COMMENT** List supported k8s/docker versions, and any other environmental requirements. -->

Ensure that you have at least 2 CPU cores and 2 GiB of memory available on the system that you want to install and run the {{site.data.reuse.egw}}.

The {{site.data.reuse.egw}} image is provided as a multi-architecture Docker image, with support for Linux 64-bit (x86_64) systems and Linux on IBM z (s390x) architectures.


## Generating {{site.data.reuse.egw}} configurations with the {{site.data.reuse.eem_name}} UI
{: #generating-gateway-config}

1. In the navigation pane, click **Administration > Event Gateways**.
2. Click **Add gateway**.
3. Select the **Docker** or **Kubernetes Deployment** tile, according to your preferred gateway deployment method, then click **Next**.
4. Provide the configuration details for your gateway, then click **Next**.

   - **Gateway group**: Create or specify an existing [gateway group](../../about/key-concepts/gateway-group) for your new gateway.
   - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group.
   - **Replicas**: The number of Kubernetes replicas of the gateway pod to create. Not applicable to Docker gateway.
   - **Server URL**: The address of your new gateway that [client applications](../../subscribe/configure-your-application-to-connect) use to access event endpoints through the gateway.

    To configure TLS communication between client applications and the gateway, you must upload the following certificate files:

   - **Gateway private key**: PEM file that contains the private key that is used to encrypt client application connections to your new gateway. The private key must be created with the gateway address in the SAN.
   - **Gateway certificate**: PEM file that contains the public certificate that is used to encrypt client application connections to your new gateway. The certificate must be created with the gateway address in the SAN.
   - **CA certificate**: PEM file that contains the CA certificate that client applications must add to their truststores for secure communication with your new gateway. This CA certificate must be an ancestor of the Gateway certificate.

   **Note:** Setting the Server URL and uploading the Gateway private key and certificate is optional, but if not done then the generated Docker command or YAML file contains placeholders for these properties. Replace the placeholders with the actual Server URL and certificate file paths when you deploy the gateway.

5. Use the generated Docker command or Kubernetes Deployment YAML to deploy the gateway in your environment. 
   - Docker: Run the generated command in your Docker environment. For example:

      ```shell
      docker run \
      -e backendURL="<provide-gateway-url>" \
      -e KAFKA_ADVERTISED_LISTENER="<provide-gateway-advertised-listener-addresses>" \
      -e BACKEND_CA_CERTIFICATES="-----BEGIN CERTIFICATE-----\nMIID..." \
      -e GATEWAY_PORT=8443 \
      -p 8443:8443 \
      -e API_KEY="36e88938-fb08-401b-ab89-191ea9b30503" \
      -e LICENSE_ID="L-AUKS-FKVXVL" \
      -e ACCEPT_LICENSE="true" \
      -d icr.io/cpopen/ibm-eventendpointmanagement/egw:11.5.0
      ```

   - Kubernetes Deployment: 

        a. Copy the generated YAML to a new file called `EventGateway-<gatewayID>.yaml`.

        b. Replace any placeholder values and set `spec.containers.env.ACCEPT_LICENSE` to `"true"`.

        c. Apply the file in your Kubernetes environment by using the `kubectl` command. For example:

        ```shell
        kubectl -n <namespace> apply -f EventGateway-eg1.yaml
        ```   

6. Return to the **Event Gateways** page to monitor the status of the new {{site.data.reuse.egw}}. When the gateway is registered, the status reports **Running**.
7. If you need to customize the gateway for your environment or enable extra gateway features, see [Advanced gateway configuration](../configuring).



## Configuration properties
{: #config-options-docker}

The following properties are defined in the generated configuration:

- **backendURL**: The URL to be used by the {{site.data.reuse.egw}} to connect to the {{site.data.reuse.eem_manager}}. This URL is the `gateway` API endpoint that is defined in the {{site.data.reuse.eem_manager}}, and contains `ibm-eem-gateway` in the URL.
- **KAFKA_ADVERTISED_LISTENER**: A comma-separated list of the hosts and ports that client applications must use to make requests. If applications have direct access, then this is the host and ports (as specified in the **PORT_MAPPINGS** property) of the {{site.data.reuse.egw}}. Otherwise, it is the host and ports of the routing or proxy service that is in front of the {{site.data.reuse.egw}}. 

  For example, if you have a single host `example.com` and **PORT_MAPPINGS** set to `-p 8443:8443 -p 8444:8443`, then set `KAFKA_ADVERTISED_LISTENER="example.com:8443,example.com:8444"`.
- **BACKEND_CA_CERTIFICATES**: The CA certificate used to secure the connection to the {{site.data.reuse.eem_manager}}.
- **GATEWAY_PORT**: The port on the gateway that Kafka applications connect to.
- **PORT_MAPPINGS**: A sequence of port assignments (`-p <HOST_PORT>:<GATEWAY_PORT>`) that satisfies the requirement that the number of exposed host ports is greater than, or equal to, the total number of Kafka brokers managed by the gateway. Ensure that the **KAFKA_ADVERTISED_LISTENER** property has an entry for each port that you set here.
- **API_KEY**: A GUID that is used to identify the {{site.data.reuse.egw}} with the {{site.data.reuse.eem_manager}}.
- **LICENSE_ID**: The identifier (ID) of the license to use for this {{site.data.reuse.egw}}.
- **ACCEPT_LICENSE**: Set this to `true` to accept the license terms.


## Example Kubernetes Deployment YAML

   
```shell
apiVersion: apps/v1
kind: Deployment
metadata:
  name: testgroup-testid2
  labels:
    app: testgroup-testid2
    gatewayGroup: testgroup
    gatewayId: testid2
spec:
  replicas: 3
  selector:
    matchLabels:
      app: testgroup-testid2
      gatewayGroup: testgroup
      gatewayId: testid2
  template:
    metadata:
      labels:
        app: testgroup-testid2
        gatewayGroup: testgroup
        gatewayId: testid2
    spec:
      containers:
      - name: egw
        image: us.icr.io/ea-dev/stable/eem/ibm-eventendpointmanagement/egw@sha256:d5d9932351326d6a8b61a376ecb58e95a8d4bb04647bb9884637baa02d7cef97
        ports:
        - containerPort: 8443
        env:
        - name: backendURL
          value: "<provide-gateway-url>"
        - name: GATEWAY_PORT
          value: "8443"
        - name: KAFKA_ADVERTISED_LISTENER
          value: "<provide-gateway-advertised-listener-addresses>"
        - name: BACKEND_CA_CERTIFICATES
          value: "-----BEGIN CERTIFICATE-----\nMIIDbDCCAlSgAwIBAgIQPCwReKdHhQ8o6Rot...wQ==\n-----END CERTIFICATE-----\n"
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              key: apiKey
              name: testgroup-testid2
        - name: LICENSE_ID
          value: L-AUKS-FKVXVL
        - name: ACCEPT_LICENSE
          value: "false"
---
apiVersion: v1
kind: Secret
metadata:
  name: testgroup-testid2
  labels:
    app: testgroup-testid2
    gatewayGroup: testgroup
    gatewayId: testid2
type: Opaque
stringData:
  apiKey: "8455dfd7-faf6-428d-a909-e170425925c0"
```
