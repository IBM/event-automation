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

### Determine the gateway address
{: #gateway-address}

Determine the hostname and decide the ports to use for your gateway. If your Kafka clients are run on the same system as the gateway Docker container, then use `localhost` for the hostname. If your Kafka clients are not on the same system as the gateway, then use the hostname of or proxy to the system that runs your Docker gateway.

See the guidance about [gateway deployment planning](../planning#gateway-planning) to determine how many hostnames you require for each gateway and gateway group. In a test scenario, if you are deploying only one gateway, and have a single Kafka cluster that has 3 brokers, then use the following hostname and port combinations:

- `localhost:9092`
- `localhost:9093`
- `localhost:9094`

The hostnames must match the DNS `alt_names` that are specified in the certificate that secures the gateway endpoints. Using the preceding example, the `alt_names` in the certificate must specify `localhost`:

```
[alt_names]
DNS.1 = localhost
```

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

2. Create a file that is called `my-gateway-cert.txt` and paste in the following contents:

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
4. Provide a gateway group, ID, and address for your gateway, then click **Next**.

   - **Gateway group**: Create or specify an existing [gateway group](../../about/key-concepts#gateway-group) for your new gateway.
   - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group.
   - **Server URL**: The address or comma-separated addresses for the gateway to be used by [Kafka clients](../../subscribe/configure-your-application-to-connect). These addresses might be to a proxy in front of the gateway, or the gateway itself. Alternatively, you can specify a single hostname with a wildcard, for example: `*-gwy1-grp1.example.com`.


     For more information about the gateway address, see the guidance about [gateway deployment planning](../planning#gateway-planning). Setting this value here is optional, but if not set, then the generated Docker command includes the placeholder argument `KAFKA_LISTENER_LISTENER_GROUP_GROUP_ADDRESSES` where you must set this value.

   The remaining properties are described and set in the next step.
5. When you click **Next**, a Docker command is generated that contains the configuration that is required to deploy an {{site.data.reuse.egw}} as a Docker container. Complete the configuration by replacing the placeholder values:

    - `KAFKA_LISTENER_LISTENER_GROUP_GROUP_ADDRESSES`: If you did not specify a value for `Server URL` in step 4, then you must specify it here. 
    - `<provide-path-to-tls-certificate>`:  Filepath to the TLS certificate that secures your gateway endpoint.
    - `<provide-path-to-tls-key>`: Filepath to the private key that the TLS certificate uses.
    - `<provide-path-to-CA-certificates-to-trust-gateway>`: Filepath to the CA that signs the TLS certificate.
    - `ACCEPT_LICENSE`: Set to `true` to accept the license terms.

    The TLS certificate files must be in PEM format. The TLS certificate must contain the gateway address in the SAN. For more information about the TLS requirements, see [Create TLS certificates](#create-certs).

    - `swid`: If the `swid` property is included in the Docker command, then set it as follows: 
      - If your {{site.data.reuse.eem_manager}} uses an {{site.data.reuse.ea_short}} license, then set `swid="EA"`.
      - If your {{site.data.reuse.eem_manager}} uses an {{site.data.reuse.cp4i}} license, then set `swid="CP4I"`.


6. Back up the Docker command to a file and keep it in a safe location.

7. Run the generated Docker command to deploy the gateway in your environment. 

    If you see the error message `java.nio.file.AccessDeniedException`, then check the file permissions of your certificate files, the Docker process must have read access to the certificate files that you specified.

8. Return to the **Event Gateways** page to monitor the status of the new {{site.data.reuse.egw}}. When the gateway is registered, the status reports **Running**.
