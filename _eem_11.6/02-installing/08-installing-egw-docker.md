---
title: "Installing the Event Gateway as a Docker container"
excerpt: "Install and configure the Event Gateway as a Docker container"
categories: installing
slug: install-docker-egw
toc: true
---

Find out how you can install an {{site.data.reuse.egw}} as a Docker container with the help of {{site.data.reuse.eem_name}}.

## Before you begin
{: #before-begin}

Review the [planning](../install-gateway#gateway-planning) topic, which covers host system and network requirements for the {{site.data.reuse.egw}}.

Determine the hostname and decide the ports to use for your gateway. If your Kafka clients are run on the same system as the gateway Docker container, then use `localhost` for the hostname. If your Kafka clients are not on the same system as the gateway, then use the hostname of the system that runs your Docker gateway.

If the Kafka cluster that you intend your {{site.data.reuse.egw}} to manage traffic for has multiple brokers, then you must define a hostname and port combination for each broker. 

For example, if your Kafka cluster has 3 brokers, then use the following hostname and port combinations:

- `localhost:9092`
- `localhost:9093`
- `localhost:9094`

### Licensing
{: #licensing}

If your {{site.data.reuse.eem_manager}} is not using a usage-based license, then first install the [IBM License Management Tool](https://www.ibm.com/docs/en/license-metric-tool?topic=tool-installing){:target="_blank"} in the same environment as your {{site.data.reuse.egw}}. Also, review the additional Docker-specific License Metric Tool [considerations](https://www.ibm.com/docs/en/license-metric-tool?topic=concepts-discovering-software-in-containers){:target="_blank"}.

## Create TLS certificates
{: #create-certs}

You must provide the TLS public certificate, private key, and CA certificate for your {{site.data.reuse.egw}} endpoint. You can provide these certificates as PEM files in the {{site.data.reuse.eem_name}} UI when you generate the gateway configuration, or you can provide the path to the PEM files when you run the Docker command.

### Create test certificates with OpenSSL
{: #openssl}

See the following example for using the OpenSSL tool to generate the TLS certificates that are required for the {{site.data.reuse.egw}} endpoint.

In this example, the FQDN of the gateway is `localhost`, and the gateway manages the traffic for a Kafka cluster that has 3 brokers, and so 3 port numbers are used to define the advertised listeners.

1. On MacOS, the `openssl@3` and `gettext` packages are required and can be installed as follows:

    a. Install `openssl@3` and `gettext`:

   ```shell
   brew install gettext openssl@3
   ```

    b. Set the `openssl` command alias:
   
   ```shell
   alias openssl=$(brew --prefix)/opt/openssl@3/bin/openssl
   ```

2. Create a file called `my-gateway-cert.txt` and paste in the following contents:

   ```shell
   [req_ext]
   subjectAltName = @alt_names

   [alt_names]
   DNS.1 = localhost
   ```

3. Generate the TLS certificates by running the following commands:

   a. Certificate Authority (CA) key :

   ```shell
   openssl genrsa -out ca.key 4096
   ```

   b. CA certificate:

   ```shell
   openssl req -new -x509 -key ca.key -days 730 -out ca.crt
   ```
   When prompted for the `Common Name`, enter `IBM EEM`. Answer the other prompts with appropriate values for your organization, or press return to accept the defaults.

   c. Gateway private key:

   ```shell
   openssl genrsa -out gateway.key 4096
   ```

   d. Gateway certificate signing request (CSR):

   ```shell
   openssl req -new -key gateway.key -out gateway.csr
   ```
   When prompted for the `Common Name`, enter `IBM EEM`. Answer the other prompts with appropriate values for your organization, or press return to accept the defaults.


4. Sign the gateway CSR to create the gateway certificate:

   ```shell
   openssl x509 -req -in gateway.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out gateway.crt -days 730 -extensions 'req_ext' -extfile <(envsubst < my-gateway-cert.txt)
   ```

   **Note:** The `envsubst` utility is available on Linux and is installed by default as part of the `gettext` package.


5. Verify the gateway certificate by running the following command:

   ```shell
   openssl verify -CAfile ca.crt gateway.crt
   ```

   If you want to view the gateway certificate properties, run the following command:

   ```
   openssl x509 -in gateway.crt -text -noout
   ```

After completing these steps, you should have the three PEM files that you need to deploy your gateway: `ca.crt`, `gateway.key`, `gateway.crt`.



## Generating {{site.data.reuse.egw}} configurations with the {{site.data.reuse.eem_name}} UI
{: #generating-gateway-docker-config}

1. In the navigation pane, click **Administration > Event Gateways**.
2. Click **Add gateway**.
3. Select the **Docker** tile, then click **Next**.
4. Provide a gateway group and ID for your gateway, then click **Next**.

   - **Gateway group**: Create or specify an existing [gateway group](../../about/key-concepts#gateway-group) for your new gateway.
   - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group.

   The remaining properties are described and set in the next step.
5. When you click **Next**, a Docker command is generated that contains the configuration required to deploy an {{site.data.reuse.egw}} as a Docker container. Complete the configuration by replacing the placeholder values:

    - `<provide-gateway-advertised-listener-addresses>`: Address of your new gateway that [client applications](../../subscribe/configure-your-application-to-connect) use to access event endpoints through the gateway. 

        Ensure that the DNS in the addresses match the alt names in your gateway certificate. Using the previous [openssl](#openssl) example, the listener addresses would be: `localhost:9092,localhost:9093,localhost:9094`.

    - `<provide-path-to-tls-certificate>`:  Filepath to the TLS certificate that secures your gateway endpoint.
    - `<provide-path-to-tls-key>`: Filepath to the private key that the TLS certificate uses.
    - `<provide-path-to-CA-certificates-to-trust-gateway>`: Filepath to the CA that signs the TLS certificate.

    The TLS certificate files must be in PEM format. The TLS certificate must contain the gateway address in the SAN. For more information about the TLS requirements, see [Create TLS certificates](#create-certs).

    **Licensing:** If your {{site.data.reuse.eem_manager}} is not using a usage-based license, then set `swid` as follows:
    - If your {{site.data.reuse.eem_manager}} uses an {{site.data.reuse.ea_short}} license, then set `swid="EA"`.
    - If your {{site.data.reuse.eem_manager}} uses an {{site.data.reuse.cp4i}} license, then set `swid="CP4I"`.

6. Backup the Docker command to a file and keep it in a safe location.

7. Run the generated Docker command to deploy the gateway in your environment. 

    If you see the error message `java.nio.file.AccessDeniedException` then check the file permissions of your certificate files, the Docker process must have read access to the certificate files that you specified.

8. Return to the **Event Gateways** page to monitor the status of the new {{site.data.reuse.egw}}. When the gateway is registered, the status reports **Running**.
9. If you need to customize the gateway for your environment or enable extra gateway features, see [Advanced gateway configuration](../configuring).


## Docker configuration properties reference
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
