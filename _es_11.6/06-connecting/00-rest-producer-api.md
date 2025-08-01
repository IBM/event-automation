---
title: "Event Streams producer API"
excerpt: "Use the Event Streams producer API to connect other systems to your Kafka cluster."
categories: connecting
slug: rest-api
toc: true
---

{{site.data.reuse.es_name}} provides a REST API to help connect your existing systems to your {{site.data.reuse.es_name}} Kafka cluster. Using the API, you can integrate {{site.data.reuse.es_name}} with any system that supports RESTful APIs.

The REST producer API is a scalable REST interface for producing messages to {{site.data.reuse.es_name}} over a secure HTTP endpoint. Send event data to {{site.data.reuse.es_name}}, utilize Kafka technology to handle data feeds, and take advantage of {{site.data.reuse.es_name}} features to manage your data.

Use the API to connect existing systems to {{site.data.reuse.es_name}}, such as IBM Z mainframe systems with IBM z/OS Connect, systems using IBM DataPower Gateway, and so on.

![Event Streams Producer API architecture]({{ 'images' | relative_url }}/architectures/previous/ibm-event-automation-diagrams-es-restproducer.svg "Diagram showing the architecture of the Event Streams producer API as part of IBM Event Automation.")

## About authorization

By default {{site.data.reuse.es_name}} requires clients to be authorized to write to topics. The available authentication mechanisms for use with the REST Producer are MutualTLS (`tls`) and SCRAM SHA 512 (`scram-sha-512`). For more information about these authentication mechanisms, see the information about [managing access](../../security/managing-access/).

The REST producer API requires any authentication credentials be provided with each REST call to grant access to the requested topic. This can be done in one of the following ways:
1. **In an HTTP authorization header**:

   You can use this method when you have control over what HTTP headers are sent with each call to the REST producer API. For example, this is the case when the API calls are made by code you control.
2. **Mutual TLS authentication** (also referred to as **SSL client authentication** or **SSL mutual authentication**):

   You can use this method when you cannot control what HTTP headers are sent with each REST call. For example, this is the case when you are using third-party software or systems such as CICS events over HTTP.

**Note:** You must have {{site.data.reuse.es_name}} version 2019.1.1 or later to use the REST API. In addition, you must have {{site.data.reuse.es_name}} version 2019.4.1 or later to use the REST API with SSL client authentication.

## Content types

The following are supported for the value of the `Content-Type` header:

 - `application/octet-stream`
 - `text/plain`
 - `application/json`
 - `text/xml`
 - `application/xml`

For each content type the message body is copied "as is" into the Kafka record value. Both the `application/octet-stream` and `text/plain` types must specify a length header to avoid accidental truncation if the HTTP connection drops prematurely. The payload of a request that uses the `application/json` header must parse as valid JSON. Otherwise, the request will be rejected.

The {{site.data.reuse.es_name}} REST Producer API also supports the following vendor content types:

 - `vnd.ibm-event-streams.json.v1` as a synonym for `application/json`
 - `vnd.ibm-event-streams.binary.v1` as a synonym for `application/octet-stream`
 - `vnd.ibm-event-streams.text.v1` as a synonym for `text/plain`

These content types can be used to pin applications at the version 1 API level.

## Prerequisites

To be able to produce to a topic, ensure you have the following available:
- The URL of the {{site.data.reuse.es_name}} REST Producer API endpoint.
- The topic you want to produce to.
- If using a REST Producer API endpoint that requires HTTPS, the {{site.data.reuse.es_name}} certificate.

To retrieve the full URL for the {{site.data.reuse.es_name}} API endpoint, you can use the Kubernetes command-line tool (`kubectl`) or {{site.data.reuse.es_name}} UI.

Using the Kubernetes command-line tool (`kubectl`):
1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to list available {{site.data.reuse.es_name}} REST Producer API endpoints:

   ```shell
   kubectl get eventstreams <instance-name> -n <namespace> -o=jsonpath='{.status.endpoints[?(@.name=="restproducer")].uri}{"\n"}'
   ```

3. Copy the full URL of the required endpoint from the `HOST/PORT` section of the response.

Using the UI:
1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Click **Connect to this cluster** on the right.
3. Go to the **Resources** tab.
4. Scroll down to the **Producer endpoint and credentials** section.
5. Click **Copy Producer API endpoint**.

By default the {{site.data.reuse.es_name}} REST Producer API endpoint requires a HTTPS connection. If this has not been disabled for the endpoint the {{site.data.reuse.es_name}} certificate must be retrieved. You can use the {{site.data.reuse.es_name}} CLI or UI.

Using the CLI:
1. Ensure you have the {{site.data.reuse.es_name}} CLI [installed](../../installing/post-installation/#installing-the-event-streams-command-line-interface).

2. {{site.data.reuse.es_cli_init_111}}
   If you have more than one {{site.data.reuse.es_name}} instance installed, select the one where the topic you want to produce to is.

   Details of your {{site.data.reuse.es_name}} installation are displayed.
3. Download the server certificate for {{site.data.reuse.es_name}}:

   ```shell
   kubectl es certificates --format pem
   ```

   By default, the certificate is written to a file called `es-cert.pem`.

Using the UI:
1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Click **Connect to this cluster** on the right.
3. Go to the **Resources** tab.
4. Scroll down to the **Certificates** section.
5. In the **PEM certificate** section, click **Download certificate**.

For information on how to create a topic to produce to, see the information about [creating topics](../../getting-started/creating-topics/).

### Key and message size limits

The REST producer API has a configured limit for the key size (default is `4096` bytes) and the message size (default is `65536` bytes). If the request sent has a larger key or message size than the limits set, the request will be rejected.

You can [configure](../../installing/configuring/) the key and message size limits at the time of [installation](({{ 'installpagedivert' | relative_url }})) or later as described in [modifying](../../administering/modifying-installation/) installation settings. The limits are configured by setting environment variables on the REST Producer component:

```yaml
spec:
  restProducer:
    env:
      - name: MAX_KEY_SIZE
        value: "4096"
      - name: MAX_MESSAGE_SIZE
        value: "65536"
```

**Important:** Do not set the `MAX_MESSAGE_SIZE` to a higher value than the maximum message size that can be received by the Kafka broker or the individual topic (`max.message.bytes`). By default, the maximum message size for Kafka brokers is `1000012` bytes. If the limit is set for an individual topic, then that setting overrides the broker setting. Any message larger than the maximum limit will be rejected by Kafka.

**Note:** Sending large requests to the REST producer increases latency, as it will take the REST producer longer to process the requests.

## Producing messages using REST with HTTP authorization

Ensure you have gathered all the details required to use the producer API, as described in the [prerequisites](#prerequisites). Before producing you must also create authentication credentials.

To create authentication credentials to use in an HTTP authorization header, you can use the {{site.data.reuse.es_name}} CLI or UI.

Using the CLI:
1. Ensure you have the {{site.data.reuse.es_name}} CLI [installed](../../installing/post-installation/#installing-the-event-streams-command-line-interface).

2. {{site.data.reuse.es_cli_init_111}}
   If you have more than one {{site.data.reuse.es_name}} instance installed, select the one where the topic you want to produce to is.

   Details of your {{site.data.reuse.es_name}} installation are displayed.
3. Create a KafkaUser with the required permissions to produce to your topic.

   {{site.data.reuse.es_cli_kafkauser_note}} 
   You can also use the {{site.data.reuse.es_name}} UI to generate the Kafka users.
4. Follow the steps in [managing access](../../security/managing-access/#retrieving-credentials-later) to retrieve the SCRAM SHA 512 username and password.

Using the UI:
1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Click **Connect to this cluster** on the right.
3. Go to the **Resources** tab.
4. Scroll down to the **Producer endpoint and credentials** section, then click **Generate credentials**.
5. Select **SCRAM username and password**, then click **Next**.
6. Fill in a **Credential Name**, this name must be unique.
7. Select **Produce messages, consume messages and create topics and schemas**, then click **Next**.
8. Select **A specific topic** and fill in the topic name, then click **Next**.
9. Click **Next** on the consumer group panel, then **Generate credentials** on the transactional IDs panel using the default settings.
10. Take a copy of either the username and password or Basic authentication token.

You can use the usual languages for making the API call. For example, to use cURL to produce messages to a topic with the producer API using a Basic authentication header, run the `curl` command as follows:

```shell
curl -v -X POST -H "Authorization: Basic <auth_token>" -H "Content-Type: text/plain" -H "Accept: application/json" -d 'test message' --cacert es-cert.pem "https://<api_endpoint>/topics/<topic_name>/records"
```

Where:
- `<auth_token>` is the Basic authentication token you generated earlier.
- `<api_endpoint>` is the full URL copied from the `Producer API endpoint` field earlier. Use `http` instead of `https` if the provided Producer API endpoint has TLS disabled.
- `<topic_name>` is the name of the topic you want to produce messages to.
- `--cacert es-cert.pem` can be ommitted if the provided Producer API endpoint has TLS disabled

To use cURL to produce messages to a topic with the producer API using a SCRAM username and password, run the `curl` command as follows:

```shell
curl -v -X POST -u <user>:<password> -H "Content-Type: text/plain" -H "Accept: application/json" -d 'test message' --cacert es-cert.pem "https://<api_endpoint>/topics/<topic_name>/records"
```

Where:
- `<user>` is the SCRAM username provided when generating credentials.
- `<password>` is the SCRAM password retrieved earlier.
- `<api_endpoint>` is the full URL copied from the `Producer API endpoint` field earlier.  Use `http` instead of `https` if the provided Producer API endpoint has TLS disabled.
- `<topic_name>` is the name of the topic you want to produce messages to.
- `--cacert es-cert.pem` can be omitted if the provided Producer API endpoint has TLS disabled.

For full details of the API, see the [API reference]({{ 'api' | relative_url }}).

## Producing messages using REST with Mutual TLS authentication

Ensure you have gathered all the details required to use the producer API, as described in the [prerequisites](#prerequisites). Before producing you must also create TLS credentials.

To create authentication credentials to use with Mutual TLS authentication, you can use the {{site.data.reuse.es_name}} UI.

1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Click **Connect to this cluster** on the right.
3. Go to the **Resources** tab.
4. Scroll down to the **Producer endpoint and credentials** section, then click **Generate credentials**.
5. Select **Mutual TLS certificate**, then click **Next**.
6. Fill in a **Credential Name**, this name must be unique.
7. Select **Produce messages, consume messages and create topics and schemas**, then click **Next**.
8. Select **A specific topic** and fill in the topic name, then click **Next**.
9. Click **Next** on the consumer group panel, then **Generate credentials** on the transactional IDs panel using the default settings.
10. Click **Download certificates** and unzip the downloaded ZIP archive containing the TLS certificates and keys.

Each KafkaUser has a related secret that stores all credentials needed for the mutual TLS authentication. These secrets are:

- `ca.crt` - the client CA certificate
- `user.key` - the client private key
- `user.crt` - the client certificate
- `user.password` - password for accessing the client private key
- `user.p12` - PKCS #12 archive containing the client certificate and private key

By default, the name of the secret is same as the name of the KafkaUser. For more information about secrets, see the [Strimzi documentation](https://strimzi.io/docs/operators/0.45.0/deploying.html#user_secrets_generated_by_the_user_operator){:target="_blank"}.

For some systems, for example CICS, you need to download and import the client CA certificate into your truststore. The client CA certificate can be downloaded using the Kubernetes command-line tool (`kubectl`) or the {{site.data.reuse.openshift_short}} web console.

Using the Kubernetes command-line tool (`kubectl`):
1. {{site.data.reuse.es_ui_login_nonadmin}}
2. Run the following command to view details of the KafkaUser you want the client CA certificate for:

   ```shell
   kubectl get ku/<kafka-user> -o jsonpath='{.status.secret}'
   ```

3. Note down the name of the secret associated with the KafkaUser.
4. Run the following `kubectl` command to get the client CA certificate from the secret found in the previous command:

   ```shell
   kubectl get secret <KafkaUser-name> -o jsonpath='{.data.ca\.crt}' | base64 -d > ca.crt
   ```

   Where `<KafkaUser-name>` is the name of your KafkaUser.

  Using the OpenShift web console:
  1. {{site.data.reuse.openshift_ui_login}}
  2. Expand the **Workloads** dropdown and select **Secrets** to open the **Secrets** dashboard.
  3. Find and click the secret created for your Kafka User.
  4. Go to **Data** section in the **Secret details** which lists the available certificates.
  5. Click on **Reveal values** and get the ca.crt certificate.

If you are using Java keystores, the client certificate can be imported by using the `keytool -importcert ...` command as described in the [IBM SDK, Java Technology Edition documentation](https://www.ibm.com/docs/en/sdk-java-technology/8?topic=keystore-importcert){:target="_blank"}.

Some systems require the client certificate and private key to be combined into one PKCS12 file (with extension `.p12` or `.pfx`). A PKCS12 file and associated password file is included in the KafkaUser secret and the ZIP file downloaded from the {{site.data.reuse.es_name}} UI.

You can use the usual languages for making the API call. Consult the documentation for your system to understand how to specify the client certificate and private key for the outgoing REST calls to {{site.data.reuse.es_name}}. For example, to use cURL to produce messages to a topic with the producer API, run the `curl` command as follows:

```shell
curl -v -X POST -H "Content-Type: text/plain" -H "Accept: application/json" -d 'test message' --cacert es-cert.pem --key user.key --cert user.crt "https://<api_endpoint>/topics/<topic_name>/records"
```

Where:
- `<api_endpoint>` is the full URL copied from the `Producer API endpoint` field earlier.
- `<topic_name>` is the name of the topic you want to produce messages to.
- `es-cert.pem` is the {{site.data.reuse.es_name}} server certificate downloaded as part of the [prerequisites](#prerequisites)
- `user.key` is the private key of the user downloaded from the UI or read from the KafkaUser secret
- `user.crt` is the user certificate that contains the public key of the user downloaded from the UI or read from the KafkaUser secret

 For example, the steps to configure a CICS URIMAP as an HTTP client is described in the  [CICS Transaction Server documentation](https://www.ibm.com/docs/en/cics-ts/5.4?topic=application-creating-urimap-resource-cics-as-http-client){:target="_blank"}. In this case, load the client certificate and private key, together with the {{site.data.reuse.es_name}} server certificate into your RACF key ring. When defining the URIMAP:

- `Host` is the client authentication API endpoint obtained as part of the [prerequisites](#prerequisites), without the leading `https://`
- `Path` is `/topics/<topic-name>/records`
- `Certificate` is the label given to the client certificate when it was loaded into the key ring.

For full details of the API, see the [API reference]({{ 'api' | relative_url }}).
