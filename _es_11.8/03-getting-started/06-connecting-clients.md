---
title: "Connecting clients"
excerpt: "Find out how to discover connection details to connect your client applications to Event Streams."
categories: getting-started
slug: connecting
toc: true
---

Learn how to discover connection details to connect your clients to your {{site.data.reuse.es_name}} instance.

## Obtaining the bootstrap address

Use one of the following methods to obtain the bootstrap address for your connection to your {{site.data.reuse.es_name}} instance, choosing the listener **`type`** appropriate for your client. More information on configuring listener types can be found in the [configuring Kafka access section](../../installing/configuring/#kafka-access).

### Using the CLI

1. {{site.data.reuse.cncf_cli_login}} Then, log in to [{{site.data.reuse.es_name}} CLI](../../getting-started/logging-in/#logging-in-to-event-streams-cli).
2. To find the type and address of the Kafka bootstrap host for each listener, run the following command:

   ```shell
   kubectl get eventstreams <instance-name> -o=jsonpath='{range .status.kafkaListeners[*]}{.type} {.bootstrapServers}{"\n"}{end}'
   ```

   Where `<instance-name>` is the name of your {{site.data.reuse.es_name}} instance.

**Note:** If using an external Kafka listener on the {{site.data.reuse.openshift_short}}, the OpenShift route is an HTTPS address, and the port in use is 443.

### Using the {{site.data.reuse.es_name}} UI

1. {{site.data.reuse.es_ui_login_nonadmin_samesection}}
2. Click the **Connect to this cluster** tile.
3. Go to the **Kafka listener and credentials** section, and select the listener from the list.

   - Click the **External** tab for applications connecting from outside of the Kubernetes cluster.
   - Click the **Internal** tab for applications connecting from inside the Kubernetes cluster.

   **Note:** The list reflects the listeners [configured](../../installing/configuring) in `spec.strimziOverrides.kafka.listeners`. For example, you will have external listeners displayed if you have any listeners configured with a type of `route` or `ingress`. If `spec.strimziOverrides.kafka.listeners` is empty for your instance (not configured), then no address is displayed here.

### Using the {{site.data.reuse.es_name}} CLI

**Note:** You can only use the {{site.data.reuse.es_name}} CLI to retrieve the address if your {{site.data.reuse.es_name}} instance has at least one external listener [configured](../../installing/configuring) in `spec.strimziOverrides.kafka.listeners`.

1. [Install the {{site.data.reuse.es_name}} CLI plug-in](../../installing/post-installation/#installing-the-event-streams-command-line-interface) if not already installed.

2. {{site.data.reuse.es_cli_init_111}}
   Make note of the **Event Streams bootstrap address** value. This is the Kafka bootstrap address that your application will use.

   **Note:** If you have multiple listeners defined in `spec.strimziOverrides.kafka.listeners`, only the external listener is displayed. If you only have internal listeners defined, nothing is displayed.

### Using the {{site.data.reuse.openshift_short}} web console

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator}}
4. {{site.data.reuse.task_openshift_select_instance}}
5. Select the **YAML** tab.
6. Scroll down and look for `status.kafkaListeners`.
7. The `kafkaListeners` field will contain one or more listeners each with a `bootstrapServers` property.
   Find the `type` of listener you want to connect to and use the `bootstrapServers` value from the entry.

**Note:** If using an external Kafka listener, the OpenShift route is an HTTPS address, and the port in use is 443.

## Obtaining Kafka connection properties from {{site.data.reuse.es_name}} UI

To access Kafka connection properties for your Kafka client application from the {{site.data.reuse.es_name}} UI, follow these steps:

1. Log in to your {{site.data.reuse.es_name}} UI.
1. Click **Connect to this cluster** tile to view the **Cluster connection** panel.
1. In the **Resources** tab, in the **Kafka listener and credentials** section, click the **Generate SCRAM credentials** or **Generate TLS credentials** button for the **External** listener, and fill in the fields based on your requirements to generate the credentials.
1. If using SCRAM, note down the **Username and password**.
1. If using TLS, click **Download certificates** and extract the contents of the downloaded .zip file to a preferred location.
1. In the **Certificates** section, download either the **PKCS12 certificate** or **PEM certificate** for server connection:
   - If you are using a Java client, download the PKCS12 certificate and note down the truststore password displayed in **Certificate password** during the download.
   - Otherwise, download the **PEM certificate**.
1. Click the **Sample code** tab, in the **Sample configuration properties** section, select a server from the **Select bootstrap server** drop-down. You can either copy the snippet or click the **Download properties** button to download the properties file for your Kafka client application.
1. Replace the placeholders with your actual values based on the authentication method ([SCRAM](#configuring-kafka-properties-for-a-scram-client), [TLS](#configuring-kafka-properties-for-a-tls-client), or [OAuth](#configuring-kafka-properties-for-an-oauth-client)) of the selected server.

### Configuring Kafka connection properties by using SCRAM

After obtaining the Kafka connection properties from the {{site.data.reuse.es_name}} UI, configure the SCRAM client by setting the following properties.

For example:

```shell
bootstrap.servers= ibm-es-external-bootstap-03:1234

# SCRAM Properties             
security.protocol=SASL_SSL
ssl.protocol=TLSv1.3

# PEM
ssl.truststore.type=PEM
ssl.truststore.location=<path-to-truststore>

# PKCS12
# ssl.truststore.type=PKCS12
# ssl.truststore.location=<path-to-truststore>
# ssl.truststore.password=<truststore-password>

sasl.mechanism=SCRAM-SHA-512
sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="<scram-username>" password="<scram-password>";
```

Where:
- `<path-to-truststore>` is the path to your truststore certificate. To use PKCS12 certificates, uncomment the PKCS12 lines (remove the # symbol), and comment out the PEM lines (add the # symbol).
- `<truststore-password>`is the truststore password.

### Configuring Kafka connection properties by using TLS

After obtaining the Kafka properties from the {{site.data.reuse.es_name}} UI, configure the TLS client by setting the following properties.

For example:

```shell
bootstrap.servers= ibm-es-external-bootstap-03:1235

# TLS Properties
security.protocol=SSL
ssl.protocol=TLSv1.3

# PEM
ssl.truststore.type=PEM
ssl.truststore.location=<path-to-truststore>
ssl.keystore.type=PEM
ssl.keystore.location=<path-to-pem-keystore>

# PKCS12
# ssl.truststore.type=PKCS12
# ssl.truststore.location=<path-to-truststore>
# ssl.truststore.password=<truststore-password>
# ssl.keystore.type=PKCS12
# ssl.keystore.location=<path-to-p12-keystore>
# ssl.keystore.password=<p12-password>;
```

Where:
- `<path-to-truststore>` is the path to your truststore certificate. To use PKCS12 certificates, uncomment the PKCS12 lines (remove the # symbol), and comment out the PEM lines (add the # symbol).
- `<path-to-pem-keystore>` is the path to your PEM keystore certificate.
- `<truststore-password>` is the truststore password.
- `<path-to-p12-keystore>` is the path to your PKCS12 keystore certificate.
- `<p12-password>` is the PKCS12 certificate password.

**Important:** If you are using a PEM certificate as the keystore type for a TLS connection, you will need to combine the `user.key` and `user.crt` files that were extracted from the downloaded ZIP file when generating TLS credentials. The `user.key` and `user.crt` files need to be combined into a single file because the TLS connection requires a single certificate file that contains both the private key and the certificate. To combine the files, navigate to the location where you extracted the contents of the ZIP file and run the following command in your terminal:

```bash
cat user.key user.crt > keystore.pem
```

### Configuring Kafka connection properties by using OAuth

After obtaining the Kafka properties from the {{site.data.reuse.es_name}} UI, configure the OAuth client by setting the following properties.

For example:

```shell
bootstrap.servers=ibm-es-external-bootstap-03:1236

# OAUTH Properties
security.protocol=SASL_SSL
ssl.protocol=TLSv1.3

# PEM
ssl.truststore.type=PEM
ssl.truststore.location=<path-to-truststore>

# PKCS12
# ssl.truststore.type=PKCS12
# ssl.truststore.location=<path-to-truststore>
# ssl.truststore.password=<truststore-password>

sasl.mechanism=OAUTHBEARER
sasl.login.callback.handler.class=io.strimzi.kafka.oauth.client.JaasClientOauthLoginCallbackHandler

# Use token endpoint
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required oauth.ssl.truststore.type=PKCS12 oauth.ssl.truststore.location="<oauth-server-certs.p12-file-location>" oauth.ssl.truststore.password="<oauth-server-truststore-password>"  oauth.client.id="<oauth-client-id>" oauth.client.secret="<oauth-client-password>" oauth.token.endpoint.uri="<oauth-token-endpoint>";

# Use introspection
# sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required oauth.ssl.truststore.type=PKCS12 oauth.ssl.truststore.location="<oauth-server-certs.p12-file-location>" oauth.ssl.truststore.password="<oauth-server-truststore-password>"  oauth.client.id="<oauth-client-id>" oauth.client.secret="<oauth-client-password>" oauth.introspection.endpoint.uri="<oauth-introspection-endpoint>";`;
```

Where:
- `<path-to-truststore>` is the path to your truststore certificate. To use PKCS12 certificates, uncomment the PKCS12 lines (remove the # symbol), and comment out the PEM lines (add the # symbol).
- `<truststore-password>` is the truststore password.
- `<oauth-server-certs.p12-file-location>` is the path to the OAuth server truststore certificate.
- `<oauth-server-truststore-password>` is the OAuth server truststore password.
- `<oauth-client-id>` is the OAuth client ID.
- `<oauth-client-password>` is the OAuth client ID password.
- `<oauth-token-endpoint>` is the URI of the OAuth server token endpoint.
- `<oauth-introspection-endpoint>` is the URI of the introspection endpoint. To use the introspection endpoint, uncomment the introspection line (remove the # symbol), and comment out the token endpoint line (add the # symbol).


## Securing the connection

To connect client applications to a secured {{site.data.reuse.es_name}}, you must obtain the following:

- A copy of the server-side public certificate to add to your client-side trusted certificates.
- SCRAM-SHA-512 (`username` and `password`) or Mutual TLS (user certificates) Kafka credentials.

### Obtaining the server-side public certificate from the CLI

To extract the server-side public certificate to a `ca.p12` file, run the following command:

```shell
kubectl get secret <cluster_name>-cluster-ca-cert -o jsonpath='{.data.ca\.p12}' | base64 -d > ca.p12
```

Where `<instance-name>` is the name of your {{site.data.reuse.es_name}} instance.

To extract the password for the certificate to a `ca.password` file, run the following command:

```shell
kubectl get secret <cluster_name>-cluster-ca-cert -o jsonpath='{.data.ca\.password}' | base64 -d > ca.password
```

**Note:** If a `PEM` certificate is required, run the following command to extract the certificate to a `ca.crt` file:

```shell
kubectl get secret <cluster_name>-cluster-ca-cert -o jsonpath='{.data.ca\.crt}' | base64 -d > ca.crt
```

**Important:** If you have configured [external CA certificates](../../installing/configuring/#providing-external-ca-certificates) in the `externalCACertificates` secret, these will not be included in the secret `<cluster_name>-cluster-ca-cert`. To obtain the external CA certificates, use secret name `<cluster-name>-combined-cluster-ca-certs` instead, or obtain them from the UI or CLI as described in the following sections.

### Obtaining the server-side public certificate from the {{site.data.reuse.es_name}} UI

1. {{site.data.reuse.es_ui_login_nonadmin_samesection}}
2. Click **Connect to this cluster** on the right.
3. From the **Certificates** section, download the server certificate. If you are using a Java client, use the **PKCS12 certificate**, remembering to copy the truststore password presented during download. Otherwise, use the **PEM certificate**.

**Note:** If you have configured [external CA certificates](../../installing/configuring/#providing-external-ca-certificates) in the `externalCACertificates` secret, these will be included in the downloaded server certificate.

### Obtaining the server-side public certificate from the {{site.data.reuse.es_name}} CLI

1. [Install the {{site.data.reuse.es_name}} CLI plug-in](../../installing/post-installation/#installing-the-event-streams-command-line-interface) if not already installed.

2. {{site.data.reuse.es_cli_init_111}}
3. Use the `certificates` command to download the cluster's public certificate in the required format:

   ```shell
   kubectl es certificates --format p12
   ```

   The truststore password will be displayed in the output for the command. The following example has a truststore password of `mypassword`:

   ```shell
   $ kubectl es certificates --format p12

   Trustore password is mypassword
   Certificate successfully written to /es-cert.p12.
   OK
   ```

   **Note:** You can optionally change the format to download a `PEM` Certificate if required.

**Note:** If you have configured [external CA certificates](../../installing/configuring/#providing-external-ca-certificates) in the `externalCACertificates` secret, these will be included in the downloaded server certificate.

### Obtaining the server-side public certificate from the {{site.data.reuse.openshift_short}} web console

1. {{site.data.reuse.openshift_ui_login}}
2. {{site.data.reuse.task_openshift_navigate_installed_operators}}
3. {{site.data.reuse.task_openshift_select_operator}}
4. {{site.data.reuse.task_openshift_select_instance}}
5. Select the **Resources** tab.
6. To filter only secrets, deselect all resource types with the exception of **Secret**.
7. Locate and select the `<instance-name>-cluster-ca-cert` secret. Where `<instance-name>` is the name of your {{site.data.reuse.es_name}} instance.
8. In the **Secret Overview** panel scroll down to the **Data** section. Then, click the copy button to transfer the `ca.p12` certificate to the clipboard. The password can be found under `ca.password`.

**Note:** For a `PEM` certificate, click the copy button for `ca.crt` instead.

### Generating or Retrieving Client Credentials

See the [assigning access to applications](../../security/managing-access/#managing-access-to-kafka-resources) section to learn how to create new application credentials or retrieve existing credentials.


### Configuring your SCRAM client

Add the [truststore certificate details](#securing-the-connection) and the [SCRAM credentials](#generating-or-retrieving-client-credentials) to your Kafka client application to set up a secure connection from your application to your {{site.data.reuse.es_name}} instance.

You can configure a Java application as follows:

```shell
Properties properties = new Properties();
properties.put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, "<bootstrap-address>");
properties.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL");
properties.put(SslConfigs.SSL_PROTOCOL_CONFIG, "TLSv1.3");
properties.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, "<certs.p12-file-location>");
properties.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, "<truststore-password>");
properties.put(SaslConfigs.SASL_MECHANISM, "SCRAM-SHA-512");
properties.put(SaslConfigs.SASL_JAAS_CONFIG, "org.apache.kafka.common.security.scram.ScramLoginModule required "
    + "username=\"<scram-username>\" password=\"<scram-password>\";");
```

| Property Placeholder        | Description                                                                                                                              |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `<bootstrap-address>`       | [Bootstrap servers address](#obtaining-the-bootstrap-address)                                                                            |
| `<certs.p12-file-location>` | Path to your truststore certificate. This must be a fully qualified path. As this is a Java application, the PKCS12 certificate is used. |
| `<truststore-password>`     | Truststore password.                                                                                                                     |
| `<scram-username>`          | SCRAM username.                                                                                                                          |
| `<scram-password>`          | SCRAM password.                                                                                                                          |

### Configuring your Mutual TLS client

Add the [truststore and keystore certificate details](#securing-the-connection) to your Kafka client application to set up a secure connection from your application to your {{site.data.reuse.es_name}} instance.

You can configure a Java application as follows:

```shell
Properties properties = new Properties();
properties.put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, "<bootstrap-address>");
properties.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SSL");
properties.put(SslConfigs.SSL_PROTOCOL_CONFIG, "TLSv1.3");
properties.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, "<certs.p12-file-location>");
properties.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, "<truststore-password>");
properties.put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, "<user.p12-file-location>");
properties.put(SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG, "<user.p12-password>");
```

| Property Placeholder        | Description                                                                                                                                        |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<bootstrap-address>`       | [Bootstrap servers address](#obtaining-the-bootstrap-address).                                                                                     |
| `<certs.p12-file-location>` | Path to your truststore certificate. This must be a fully qualified path. As this is a Java application, the PKCS12 certificate is used.           |
| `<truststore-password>`     | Truststore password.                                                                                                                               |
| `<user.p12-file-location>`  | Path to `user.p12` keystore file from [credentials zip archive](#generating-or-retrieving-client-credentials).                                     |
| `<user.p12-password>`       | The `user.p12` keystore password found in the `user.password` file in the [credentials zip archive](#generating-or-retrieving-client-credentials). |

### Configuring your OAuth client

Add the [truststore certificate details](#securing-the-connection) and the [OAuth credentials](#generating-or-retrieving-client-credentials) to your Kafka client application to set up a secure connection from your application to your {{site.data.reuse.es_name}} instance.

You can configure a Java application as follows:

```shell
Properties properties = new Properties();
properties.put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, "<bootstrap-address>");
properties.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL");
properties.put(SslConfigs.SSL_PROTOCOL_CONFIG, "TLSv1.3");
properties.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, "<certs.p12-file-location>");
properties.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, "<truststore-password>");
properties.put(SaslConfigs.SASL_MECHANISM, "OAUTHBEARER");
properties.put(SaslConfigs.SASL_JAAS_CONFIG, "org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required "
 + "oauth.ssl.truststore.location=\"<oauth-server-certs.p12-file-location>\" "
 + "oauth.ssl.truststore.type=PKCS12 "
 + "oauth.ssl.truststore.password=\"<oauth-server-truststore-password>\" "
 + "oauth.client.id=\"<oauth-clientid>\" "
 + "oauth.client.secret=\"<oauth-client-password>\" "
 + "oauth.token.endpoint.uri=\"<oauth-authentication-token-endpoint>\";");
```

| Property Placeholder        | Description                                                                                                                                        |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<bootstrap-address>`       | [Bootstrap servers address](#obtaining-the-bootstrap-address).                                                                                     |
| `<certs.p12-file-location>` | Path to your truststore certificate. This must be a fully qualified path. As this is a Java application, the PKCS12 certificate is used.           |
| `<truststore-password>`     | Truststore password.|
| `<oauth-server-certs.p12-file-location>`     | Path to the OAuth server truststore certificate. This must be a fully qualified path. As this is a Java application, the PKCS12 certificate is used.|
| `<oauth-server-truststore-password>`     | OAuth server truststore password.|
| `<oauth-clientid>`     | OAuth client ID.|
| `<oauth-client-secret>`     | OAuth client ID password.|
| `<oauth-authentication-token-endpoint>` | The URI of the OAuth server token endpoint. |

### Obtaining Java code samples from the {{site.data.reuse.es_name}} UI

For a Java application, you can copy the connection code snippet from the {{site.data.reuse.es_name}} UI by doing the following:

1. {{site.data.reuse.es_ui_login_nonadmin_samesection}}
2. Click the **Connect to this cluster** tile.
3. Click the **Sample code** tab.
4. Copy the snippet from the **Sample connection code** section into your Java Kafka client application. Uncomment the relevant sections and replace the property placeholders with the values from the relevant table for [SCRAM](#configuring-your-scram-client) or [Mutual TLS](#configuring-your-mutual-tls-client).
