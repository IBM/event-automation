---
title: "Installing the Event Gateway"
excerpt: "Generate gateway deployment configurations in the {{site.data.reuse.eem_name}} UI, to deploy gateways in your environment. You can install and configure Event Gateways as a Docker container, Kubernetes Deployment, or operator-managed Custom Resource."
categories: installing
slug: install-gateway
toc: true
---

{{site.data.reuse.egw}}s are added to {{site.data.reuse.eem_name}} by deploying them with a configuration that points to your {{site.data.reuse.eem_manager}}. When the gateway is deployed, it registers itself with the {{site.data.reuse.eem_manager}} that is specified in its configuration. Use the {{site.data.reuse.eem_name}} UI to generate the configuration properties for your gateway. The following methods are available to deploy your {{site.data.reuse.egw}}s:

- Docker container. The {{site.data.reuse.eem_name}} UI generates a Docker command to start an {{site.data.reuse.egw}} container. The Docker command contains the necessary arguments to register the gateway with your {{site.data.reuse.eem_manager}}.
- Kubernetes Deployment. The {{site.data.reuse.eem_name}} UI generates the YAML contents for a Kubernetes Deployment that runs the {{site.data.reuse.egw}}. 
- Operator-managed custom resource. The {{site.data.reuse.eem_name}} UI generates the YAML contents for a Kubernetes custom resource that runs the {{site.data.reuse.egw}}. Your {{site.data.reuse.eem_name}} operator manages this custom resource.

Do not add gateways that are at an earlier version from your {{site.data.reuse.eem_name}} instance.

## System requirements
{: #system-requirements}

The {{site.data.reuse.egw}} container is provided as a multi-architecture docker image, with support for Linux 64-bit (x86_64) systems and Linux on IBM z (s390x) architectures.

- Docker gateways: Ensure that you have at least 2 CPU cores and 2 GiB of memory available. 
- Kubernetes Deployment and operator-managed gateways: Review the Kubernetes Requests and Limits requirements in [Resource requirements](../prerequisites#resource-requirements).


## Operator-managed gateways
{: #operator-managed-gateways}

If you want to install the {{site.data.reuse.egw}} on the same cluster as the {{site.data.reuse.eem_manager}}, use the {{site.data.reuse.eem_name}} operator to install instances by applying the `EventGateway` custom resource type.

[Generate](#generating-gateway-configs) your `EventGateway` custom resource YAML file from the {{site.data.reuse.eem_name}} UI.

Instances of the {{site.data.reuse.egw}} can be created only after the {{site.data.reuse.eem_name}} operator and the {{site.data.reuse.eem_manager}} instance is installed. 
- If the operator is installed into **a specific namespace**, then it can be used only to manage instances of the {{site.data.reuse.egw}} in that namespace. 
- If the operator is installed for **all namespaces**, then it can be used to manage instances of the {{site.data.reuse.egw}} in any namespace, including instances created after the operator was deployed.

When you install an instance of the operator-managed {{site.data.reuse.egw}}, ensure that you are using a namespace that an {{site.data.reuse.eem_name}} operator is managing.

**Note:** On Kubernetes platforms other than {{site.data.reuse.openshift_short}}, "all namespaces" refers to an installation where `watchAnyNamespace=true` was set during the [Helm installation](../installing-on-kubernetes).


## Manually deployed gateways
{: #remote-gateways}

The typical scenario for using Kubernetes Deployment or Docker gateways is when your Kafka cluster is in a different environment from your {{site.data.reuse.eem}} operator, and you want to locate the gateway as close as possible to the Kafka cluster for optimum performance. 

**Note:** Kubernetes Deployment or Docker {{site.data.reuse.egw}} instances can be installed only in an online environment.

- The Docker {{site.data.reuse.egw}} is provided as a Docker image and can be used only where a single Docker engine is deployed on the host. 

- Entitlement and usage are tracked by different licensing tools depending on your deployment. If you have a usage-based license for tracking the number of API calls, ensure that you configure the gateway for the IBM License Service. Otherwise, use the [IBM License Metric Tool](#installing-the-ibm-license-metric-tool) for any other deployments.

- A supported container host environment as defined in the [Red Hat Enterprise Linux Container Compatibility Matrix](https://access.redhat.com/support/policy/rhel-container-compatibility){:target="_blank"} is required.

- {{site.data.reuse.egw_compatibility_note}}


### Limitations 

Endpoints that need to be shared between a mixture of remote gateways and those in a Kubernetes cluster must use a host address that is resolvable by all gateways. For example, if the cluster that is associated with a Kafka topic uses an internal service address for a Kafka cluster, then a remote gateway is not be able to resolve that address outside of the cluster. In such cases, separate event source aliases must be created and deployed to different gateways.

A Kafka client implementation might require that the {{site.data.reuse.egw}} presents at least one endpoint for each broker that the client expects to connect to. Therefore, ensure that you manually configure the number of ports that are exposed on the host of the {{site.data.reuse.egw}} to be greater than or equal to the maximum number of brokers across all the clusters that the {{site.data.reuse.egw}} is managing. Also ensure that all the host ports map to the exposed port on the {{site.data.reuse.egw}}.


## Generating {{site.data.reuse.egw}} configurations with the {{site.data.reuse.eem_name}} UI
{: #generating-gateway-configs}

1. In the navigation pane, click **Administration > Event Gateways**.
2. Click **Add gateway**.
3. Select the **Docker**, **Kubernetes Deployment**, or **Operator-managed deployment** tile, according to your preferred gateway deployment method, then click **Next**.
4. Provide the configuration details for your gateway, then click **Next**. 

   - **Gateway group**: Create or specify an existing [gateway group](../../about/key-concepts/gateway-group) for your new gateway.
   - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group.
   - **Replicas**: The number of Kubernetes replicas of the gateway pod to create. Not applicable to Docker gateway.
   - **Server URL**: The address of your new gateway that [client applications](../../subscribe/configure-your-application-to-connect) use to access event endpoints through the gateway. 

   Communication between [client applications](../../subscribe/configure-your-application-to-connect) and your {{site.data.reuse.egw}} is secured with TLS by default on the operator-managed gateway. To configure TLS communication between client applications and the gateway on Docker and Kubernetes Deployments, you must upload the following certificate files:

   - **Gateway private key**: PEM file that contains the private key that is used to encrypt client application connections to your new gateway. The private key must be created with the gateway address in the SAN.
   - **Gateway certificate**: PEM file that contains the public certificate that is used to encrypt client application connections to your new gateway. The certificate must be created with the gateway address in the SAN.
   - **CA certificate**: PEM file that contains the CA certificate that client applications must add to their truststores for secure communication with your new gateway. This CA certificate must be an ancestor of the Gateway certificate.

   **Note:** Setting the Server URL and uploading the Gateway private key and certificate is optional, but if not done then the generated Docker command or YAML file contains placeholders for these properties. Replace the placeholders with the actual Server URL and certificate file paths when you deploy the gateway.  

5. Use the generated Docker command, Kubernetes Deployment, or custom resource YAML to [install](#installing-from-config) the {{site.data.reuse.egw}} in your environment.  
**Important:** keep a [backup](../backup-restore) of the generated Docker command or Kubernetes YAML. These contain important data needed to run the gateway, and you will need to edit these later as new versions are released.

6. Return to the **Event Gateways** page to monitor the status of the new {{site.data.reuse.egw}}. When the gateway is registered, the status reports **Running**.

## Installing the {{site.data.reuse.egw}} from the generated configuration
{: #installing-from-config}

### Installing an operator-managed {{site.data.reuse.egw}} instance by using the {{site.data.reuse.openshift_short}} web console
{: #installing-operator-managed-gateway}

To install an {{site.data.reuse.egw}} instance through the {{site.data.reuse.openshift_short}} web console, complete the following steps:

<!--1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator_eem}}

    **Note:** If the operator is not shown, it is either not installed or not available for the selected namespace.
4. In the **Operator Details** dashboard, click the {{site.data.reuse.egw}} tab.
5. Click **Create EventGateway** to open the **Create EventGateway** panel. 
6. Select **YAML view**. 
7. Paste in the [generated](#generating-gateway-configs) custom resource YAML. Replace any placeholder variables in the YAML, such as the TLS certificates if you did not upload them.
8. Click **Create** to begin the installation process. -->

1. {{site.data.reuse.openshift_ui_login}}
2. Click the **+** (Quick create) icon at the upper-right.
3. Select **Import YAML**.
4. Set **Project** to the namespace where you want to install the {{site.data.reuse.egw}}.
5. Paste in the [generated](#generating-gateway-configs) custom resource YAML. Replace any placeholder variables in the YAML, such as the TLS certificates if you did not upload them. See [Configuring](../configuring) for more information on properties you can configure in the {{site.data.reuse.egw}} YAML.
6. Click **Create** to begin the {{site.data.reuse.egw}} installation process.


### Installing the {{site.data.reuse.egw}} instance by using the CLI (`kubectl`)
{: #installing-gateway-kubectl}

To deploy an operator-managed or Kubernetes Deployment {{site.data.reuse.egw}} instance, run the following commands:

1. Copy the generated YAML to a new file called `EventGateway-<gatewayID>.yaml`.

2. Replace any placeholder values and set `spec.containers.env.ACCEPT_LICENSE` to `"true"`.

3. If you are deploying an operator-managed gateway on other Kubernetes platforms, then add the `spec.endpoints[]` section:

    ```yaml
    spec:
      endpoints:
        - name: gateway
          host: <gateway endpoint>
    ```

    For more information about the `endpoints` property, see [Configuring ingresses](../configuring#configuring-ingress).

4. Apply the file in your Kubernetes environment by using the `kubectl` command. For example:

    ```shell
    kubectl apply -f EventGateway-eg1.yaml -n my-namespace
    ```   

## Installing the {{site.data.reuse.egw}} as a Docker container
{: #installing-docker-gateway}

To install a Docker {{site.data.reuse.egw}}, run the Docker command that you [generated](#generating-gateway-configs). For example:

   ```shell
  docker run \
  -e backendURL="eem-manager.example.com" \
  -e swid="EA" \
  -e KAFKA_ADVERTISED_LISTENER="eem-gateway.example.com" \
  -e BACKEND_CA_CERTIFICATES="-----BEGIN CERTIFICATE-----\nMIID..." \
  -v "<provide-path-to-tls-certificate>:/certs/client.pem" \
  -v "<provide-path-to-tls-key>:/certs/client.key" \
  -e GATEWAY_PORT=8443 \
  -p 8443:8443 \
  -e API_KEY="36e88938-fb08-401b-ab89-191ea9b30503" \
  -e LICENSE_ID="L-AUKS-FKVXVL" \
  -e ACCEPT_LICENSE="true" \
  -d icr.io/cpopen/ibm-eventendpointmanagement/egw:11.5.0
   ```

## Installing the IBM License Metric Tool for Docker gateways

**Important:** This licensing tool is required for all {{site.data.reuse.eem_name}} deployments except usage-based ones.

The IBM License Metric Tool checks usage and entitlement to the Docker {{site.data.reuse.egw}}. The operator-managed and Kubernetes Deployment {{site.data.reuse.egw}}s do not require this additional installation.

Ensure that you [install](https://www.ibm.com/docs/en/license-metric-tool?topic=tool-installing){:target="_blank"} the IBM License Metric Tool before you install the Docker {{site.data.reuse.egw}}. Also review the additional Docker-specific License Metric Tool [considerations](https://www.ibm.com/docs/en/license-metric-tool?topic=configuration-discovering-software-in-docker-containers){:target="_blank"}.


## Configuration properties
{: #config-options-docker}

The following properties are defined in the generated configuration:

- **backendURL**: The URL to be used by the {{site.data.reuse.egw}} to connect to the {{site.data.reuse.eem_manager}}. This URL is the `gateway` API endpoint that is defined in the {{site.data.reuse.eem_manager}}, and contains `ibm-eem-gateway` in the URL. This URL must be an OpenShift route or a Kubernetes ingress. Using a Kubernetes internal service is not supported.
- **KAFKA_ADVERTISED_LISTENER**: A comma-separated list of the hosts and ports that client applications must use to make requests. If applications have direct access, then this is the host and ports (as specified in the **PORT_MAPPINGS** property) of the {{site.data.reuse.egw}}. Otherwise, it is the host and ports of the routing or proxy service that is in front of the {{site.data.reuse.egw}}. 

  For example, if you have a single host `example.com` and **PORT_MAPPINGS** set to `-p 8443:8443 -p 8444:8443`, then set
  `KAFKA_ADVERTISED_LISTENER="example.com:8443,example.com:8444"`
- **BACKEND_CA_CERTIFICATES**: The CA certificate used to secure the connection to the {{site.data.reuse.eem_manager}}.
- **GATEWAY_PORT**: The port on the gateway that Kafka applications connect to.
- **PORT_MAPPINGS**: A sequence of port assignments (`-p <HOST_PORT>:<GATEWAY_PORT>`) that satisfies the requirement that the number of exposed host ports is greater than, or equal to, the total number of Kafka brokers managed by the gateway. Ensure that the **KAFKA_ADVERTISED_LISTENER** property has an entry for each port that you set here.
- **API_KEY**: A GUID that is used to identify the {{site.data.reuse.egw}} with the {{site.data.reuse.eem_manager}}.
- **LICENSE_ID**: The identifier (ID) of the license to use for this {{site.data.reuse.egw}}. This must match the ID that you provided when you installed your {{site.data.reuse.eem_manager}} instance (as set in `spec.license.license`). For information about the right value for your deployment, see the [licensing reference]({{ 'support/licensing' | relative_url }}).
- **swid**: Specifies the license under which the {{site.data.reuse.egw}} is deployed. It must be either **EA** for Event Automation license, or **CP4I** for Cloud Pak for Integration license.
- **ubp**: Optionally, set this environment variable in the Docker container if the {{site.data.reuse.egw}} is licensed under Usage Based Pricing terms. You cannot specify both the **ubp** and **swid** options at the same time as they are mutually exclusive licensing terms.
- **ACCEPT_LICENSE**: Set this to `true` to accept the license terms.


## Example Kubernetes Deployment YAML

   
```shell
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gateway-group-test-gateway1
  labels:
    app: gateway-group-test-gateway1
    gatewayGroup: gateway-group
    gatewayId: test-gateway1
  annotations:
    productChargedContainers: manager;egw
    productID: 46c2d3697ae4406d9157c58de4b66dcc
    productMetric: VIRTUAL_PROCESSOR_CORE
    productName: IBM Event Automation Non-Production
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gateway-group-test-gateway1
      gatewayGroup: gateway-group
      gatewayId: test-gateway1
  template:
    metadata:
      labels:
        app: gateway-group-test-gateway1
        gatewayGroup: gateway-group
        gatewayId: test-gateway1
    spec:
      containers:
      - name: egw
        image: icr.io/cpopen/ibm-eventendpointmanagement/egw:11.5.0
        ports:
        - containerPort: 8443
        env:
        - name: backendURL
          value: "https://eem.eem-manager-instance-ibm-eem-server-eim.k-eem-rc1-11-5-0-master.fyre.ibm.com/gateway"
        - name: GATEWAY_PORT
          value: "8443"
        - name: KAFKA_ADVERTISED_LISTENER
          value: "<provide-gateway-advertised-listener-addresses>"
        - name: BACKEND_CA_CERTIFICATES
          value: "-----BEGIN CERTIFICATE-----\nMIIDbDCCA...vvt7Ew==\n-----END CERTIFICATE-----\n"
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              key: apiKey
              name: gateway-group-test-gateway1
        - name: LICENSE_ID
          value: L-AUKS-FKVXVL
        - name: ACCEPT_LICENSE
          value: "false"
---
apiVersion: v1
kind: Secret
metadata:
  name: gateway-group-test-gateway1
  labels:
    app: gateway-group-test-gateway1
    gatewayGroup: gateway-group
    gatewayId: test-gateway1
type: Opaque
stringData:
  apiKey: "8684cbb3-83f8-452f-9fce-b4b1c9223a47"
```

## Example operator-managed gateway YAML
{: #cr-gateway-options}

```shell
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
metadata:
  name: gateway-group-test-gateway2
spec:
  license:
    accept: false
    license: L-AUKS-FKVXVL
    metric: VIRTUAL_PROCESSOR_CORE
    use: EventAutomationNonProduction
  managerEndpoint: "https://eem.eem-manager-instance-ibm-eem-server-eim.k-eem-rc1-11-5-0-master.fyre.ibm.com/gateway"
  maxNumKafkaBrokers: 20
  gatewayGroupName: gateway-group
  gatewayID: test-gateway2
  replicas: 1
  template:
    pod:
      spec:
        containers:
          - name: egw
            env:
              - name: BACKEND_CA_CERTIFICATES
                value: "-----BEGIN CERTIFICATE-----\nMIIDbDCC...PpLj0vvt7Ew==\n-----END CERTIFICATE-----\n"
              - name: API_KEY
                valueFrom:
                  secretKeyRef:
                    key: apiKey
                    name: gateway-group-test-gateway2
  tls:
    caSecretName: gateway-group-test-gateway2-certs
---
apiVersion: v1
kind: Secret
metadata:
  name: gateway-group-test-gateway2-certs
  labels:
    app: gateway-group-test-gateway2
type: Opaque
stringData:
  # Provide CA certificate and key in PEM format
  tls.crt: <tls-certificate>
  tls.key: <tls-key>
---
apiVersion: v1
kind: Secret
metadata:
  name: gateway-group-test-gateway2
  labels:
    app: gateway-group-test-gateway2
type: Opaque
stringData:
  apiKey: "f28c526b-a292-4198-9016-a35c17995ae4"

```

