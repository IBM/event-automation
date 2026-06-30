---
title: "Event Gateway Custom Resource reference"
excerpt: "Reference for the Custom Resource Definition that is used by the Event Gateway."
categories: reference
slug: gwy-api-reference
toc: true
---

Find out more about the {{site.data.reuse.egw}} custom resource properties.

**Note:** This reference page includes only the {{site.data.reuse.egw}} custom resource properties that you might want to view or update. Do not edit any custom resource properties that are not listed on this page.

## `spec`
{: #gwy-resource-spec}

| Field                 | Type                             | Description                                                                 |
|-----------------------|----------------------------------|-----------------------------------------------------------------------------|
| config                | string                           | N/A. Usage not advised.                                                     |
| deployNetworkPolicies | boolean                          | Control the deployment of NetworkPolicies that are used by the instance. (default: true) |
| endpoints             | [][endpoint](gwy-resource-endpoint) | **Deprecated:** List of endpoint configurations. Use `spec.listener.{0}.groups.{0}.endpoint instead.                                           |
| fips                  | [fips](#gwy-resource-fips)           | Object containing Federal Information Processing Standard (FIPS) configuration.   |
| gatewayGroupName      | string                           | The name of the gateway group to which this gateway is to be added.          |
| gatewayID             | string                           | The identifier of the gateway group to which this gateway is to be added.          |
| gatewayContact        | string                           | The contact information of the gateway administrator.                      |
| license               | [license](#gwy-resource-license)     | Object containing product licensing details.                                |
| listeners             | [][listener](#gwy-resource-listener) | Configure event gateway listeners.           |
| manager               | [manager](#gwy-resource-gateway-manager) | Configure Event Manager instance to register the gateway. |
| managerEndpoint       | string                           |  **Deprecated:** The endpoint address for an {{site.data.reuse.eem_manager}} instance. Use `spec.manager.endpoint` instead.   |
| maxNumKafkaBrokers    | integer                          |  **Deprecated:** The maximum number of Kafka brokers your Event Gateway can connect to. Default is 20. Use `spec.listener.{0}.groups.{0}.maxNumKafkaBrokers` instead. |
| openTelemetry         | [openTelemetry](#gwy-resource-opentelemetry) | Configuration for OpenTelemetry                     |
| replicas              | integer                          | The number of replicas for the gateway deployment            |
| security              | [security](#gwy-resource-security)   | Object containing security configuration.                                        |
| template              | [template](#gwy-resource-template)   | Object containing Kubernetes resource overrides.                            |
| tls                   | [tls](#gwy-resource-tls)             |  **Deprecated:** Object containing TLS configuration. Use `spec.listener.{0}.tls` instead. |                                     |
| traceSpec             | string                           | Dynamically configurable trace specification                      |


### `spec.fips`
{: #gwy-resource-fips}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| mode | string | The value for Federal Information Processing Standard (FIPS) mode. Valid value is 'wall'. |


### `spec.license`
{: #gwy-resource-license}

For more information about licensing, see the [licensing reference]({{ 'support/licensing' | relative_url }}).

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| accept | boolean | Setting to true will declare that you have accepted the license terms and conditions. (default: false) |
| license | string | The license with which you are installing the product. |
| metric | string | The license metric being used for your product license. |
| use | string | The usage of the license with which you are installing the product. |

### `spec.template`
{: #gwy-resource-template}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| annotations | object | Annotations that will be added to all Kubernetes resources used by the instance. Any annotations that are added to the template object and subsequently deleted are not automatically removed from resources that are already instantiated. These annotations need to be manually removed from the existing resources. |
| labels | object | Labels that will be added to all Kubernetes resources used by the instance. |
| pod | [pod]gwy-resource-pod) | Object containing pod override configuration. |


#### `spec.template.pod`
{: #gwy-resource-pod}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| spec | [podSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.26/#podspec-v1-core){:target="_blank"} | Kubernetes pod spec overrides. |

### `spec.security`
{: #gwy-resource-security}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| connection | [connection](#gwy-resource-connection) | Object containing connection options.  |
| connection | [connection](#gwy-resource-connection) | Object containing connection options.  |
| authentication| [authentication](#gwy-resource-authentication) | Object containing authentication options.  |
| request | [request](#gwy-resource-request) | Object containing request options.  |


#### `spec.security.authentication`
{: #gwy-resource-authentication}


| Field | Type | Description |
| ----------- | ----------- | ----------- |
| maxRetries | integer | The maximum number of failed authentication attempts after which further attempts are blocked. Default is -1 (no limit). |
| retryBackoffMs | integer | The backoff time in milliseconds between consecutive failed authentication attempts. Default is 0. |
| lockoutPeriod | integer | The duration in seconds while the account is locked after an unsuccessful authentication attempt. Default is 0. |


#### `spec.security.connection`
{: #gwy-resource-connection}


| Field | Type | Description |
| ----------- | ----------- | ----------- |
| closeDelayMs | integer | The minimum delay in milliseconds after you close a connection. This helps prevent spam. Default is 8000. |
| closeJitterMs | integer | Additional delay in milliseconds after you close a connection. This helps prevent attacks. Default is 4000.|
| perSubLimit | integer | The maximum allowed TCP connections for each subscription. Default is -1 (no limit). |


##### `spec.security.connection.request`
{: #gwy-resource-request}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| maxSizeBytes | integer | The maximum size allowed for the request payload in bytes. Default is -1 (no limit). |


### `spec.tls`
{: #gwy-resource-tls}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| caCertificate | string | The key in the secret that holds the value of the CA certificate. |
| caSecretName | string | The name of a secret containing a root CA certificate that the product should use when creating additional certificates. |
| key | string | The key in the secret that holds the value of the private key. |
| secretName | string | The name of a secret containing certificates for securing component communications. |
| serverCertificate | string | The key in the secret that holds the value of the server certificate. |
| trustedCertificate | array[[trustedCertificate](#gwy-resource-trustedcertificate)] | A set of secrets containing certificates which the {{site.data.reuse.egw}} should trust when communicating with other services, such as gateways or OIDC providers. |

#### `spec.tls.trustedCertificate`
{: #gwy-resource-trustedcertificate}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| certificate | string | The key within the specified secret that holds the value of the CA certificate. |
| secretName | string | The name of a Kubernetes secret containing a CA certificate to add to the truststore. |


### `spec.openTelemetry`
{: #gwy-resource-opentelemetry}

| Field            | Type    | Description |
| ---------------- | --------| ----------- |
| endpoint         | string  | The endpoint to send the OpenTelemetry metrics.  Must include protocol http:// or https:// |
| protocol         | string  | The transport protocol to use, grpc (default) or http/protobuf. |
| interval         | integer | The interval between reporting of metrics in milliseconds. Default is 30000. |
| tls              | [otelTLS](#gwy-resource-opentelemetry-tls) | The configuration of SSL Certificates for mTLS and a trusted certificate for endpoint server validation. |
| instrumentations | [][instrumentation](#gwy-resource-instrumentation) | A list of instrumentations to enable in addition to those for the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}}. |
| metricsEnablement | [][instrumentation](#gwy-resource-instrumentation) | Configure {{site.data.reuse.egw}} OpenTelemetry metrics enablement. |
| tracesEnablement | [][instrumentation](#gwy-resource-instrumentation) | Configure {{site.data.reuse.egw}} OpenTelemetry trace enablement. |

#### `spec.openTelemetry.tls`
{: #gwy-resource-opentelemetry-tls}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| clientCertificate | string | The key in the secret that holds the value of the PKCS8 encoded client certificate to use for mutualTLS (mTLS). |
| clientKey | string | The key in the secret that holds the value of the PKCS8 encoded private key certificate to use for mutualTLS (mTLS). |
| secretName | string | The name of a secret containing certificates for securing component communications for mutualTLS (mTLS). |
| trustedCertificate | [] | Configuration of a secret containing a TLS certificate to trust to validate the endpoint servers identity. |


#### `spec.openTelemetry.instrumentations`
{: #gwy-resource-instrumentation}

| Field        | Type    | Description |
| ------------ | --------| ----------- |
| name         | string  | The instrumentation name.  |
| enabled      | boolean  | Whether to enable or disabled the specified instrumentation. |

**Important:**
- The instrumentation name should be the instrumentation shortname. The supplied shortname is then configured as an env var against the relevant pod as `OTEL_INSTRUMENTATION_<name>_ENABLED=<enabled>` automatically.


### `spec.listeners`
{: #gwy-resource-listener}


| Field  | Type                                       | Description                                                |
|--------|--------------------------------------------|------------------------------------------------------------|
| groups | [][listenerGroup](#gwy-resource-listenergroup) | Groups of the listener.          |
| name   | string                                     | Name of the listener.                                      |
| port   | integer                                    | Port number of the listener.                               |
| tls    | [listenerTLS](#gwy-resource-listenertls)       | Configure TLS for the Event Gateway listener.              |


#### `spec.listeners.groups`
{: #gwy-resource-listenergroup}


| Field              | Type                                           | Description                                                                                                                |
|--------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| endpoint           | [listenerEndpoint](#gwy-resource-listenerendpoint) | Object containing endpoint configuration for the listener group.                                                           |
| maxNumKafkaBrokers | integer                                        | The maximum number of Kafka brokers your Event Gateway can connect to. Default is 20. (minimum: 1, maximum: 50)           |
| name               | string                                         | Name of the group in the listener.                                                                                         |
| type               | string                                         | Type of the group: 'EXPLICIT' or 'WILDCARD'. Default is 'EXPLICIT'.                                                       |


##### `spec.listeners.groups.endpoint`
{: #gwy-resource-listenerendpoint}


| Field       | Type              | Description                                    |
|-------------|-------------------|------------------------------------------------|
| annotations | map[string]string | Annotations for ingress resources.             |
| class       | string            | The ingress class name.                        |
| host        | string            | The host to set on the endpoint resource.      |


#### `spec.listeners.tls`
{: #gwy-resource-listenertls}


| Field           | Type                             | Description                                                    |
|-----------------|----------------------------------|----------------------------------------------------------------|
| caCertificate   | string                           | The key in the secret that holds the value of the CA certificate. |
| caSecret        | [caSecret](#gwy-resource-casecret)   | The details of the root CA certificate that the product should use when creating additional certificates. |
| certificateType | string                           | The type of certificate to generate: 'wildcard' for a single wildcard certificate (*.example.com), or 'explicit' for a single certificate with explicit hostnames as SANs. Defaults to 'explicit'. |
| key             | string                           | The key in the secret that holds the value of the private key. |
| secretName      | string                           | The name of a secret containing certificates for securing component communications. |
| serverCertificate     | string                    | The key in the secret that holds the value of the server certificate. |

##### `spec.listeners.tls.caSecret`
{: #gwy-resource-casecret}


| Field      | Type   | Description                                                    |
|------------|--------|----------------------------------------------------------------|
| secretName  | string | The name of a secret containing a root CA certificate that the product should use when creating additional certificates. |


### `spec.manager`
{: #gwy-resource-gateway-manager}


| Field              | Type                                           | Description                                                    |
|--------------------|------------------------------------------------|----------------------------------------------------------------|
| apiKey             | [managerApiKey](#gwy-resource-managerapikey)       | Manager API key                                               |
| endpoint           | string                                         | Manager endpoint                                              |
| trustedCertificate | [trustedCertificate](#gwy-resource-trustedcertificate) | Trustore for communicating with the manager.             |

### `spec.manager.apiKey`
{: #gwy-resource-managerapikey}


| Field      | Type   | Description                                                    |
|------------|--------|----------------------------------------------------------------|
| key        | string | The key in the secret that holds the value of the API key.    |
| secretName | string | The name of a secret containing API key for authenticating with the manager. |


## `status`
{: #gwy-resource-status}

**Important:** Status field is used to display specific information about the instance. Do not edit the status field manually.

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| conditions | array[[condition](#gwy-status-resource-conditions)] | A list of conditions representing the state of the custom resource. |
| versions | [versions](#gwy-status-resource-versions) | Object containing versioning information. |
| endpoints | array[[endpoint](#gwy-status-resource-endpoint)] | A list of endpoints exposed by the instance. |
| phase | string | A value representing the phase in which the instance is operating. One of `Running`, `Failed` or `Pending`. |


### `status.versions`
{: #gwy-status-resource-versions}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| reconciled | string | The reconciled version of the instance |
| available | [available](#gwy-status-resource-available) | Object containing available versions. |

#### `status.versions.available`
{: #gwy-status-resource-available}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| versions | array[[version](#gwy-status-resource-version)] | A list of the available versions. |
| channels | array[[channel](#gwy-status-resource-channel)]  | A list of the available channels. |

##### `status.versions.available.versions`
{: #gwy-status-resource-version}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| licenses | array[] | A list of available licenses. |

##### `status.versions.available.channels`
{: #gwy-status-resource-channel}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| licenses | array[[availableLicense](#gwy-status-resource-channel-licenses)] | A list of available licenses. |

###### `status.versions.available.channels.licences`
{: #gwy-status-resource-channel-licenses}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| displayName | string | Optional display name for the license. |
| link | string | Link to the license content. |
| matchesCurrentType | boolean | True if the license matches the type of license used by the current operand. |
| licenseUseList | array[string] | A list of available license uses. |
| availableMetrics | array[string] | A list of available licenses metrics. |


### `status.conditions`
{: #gwy-status-resource-conditions}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| lastTransitionTime | string | The time at which the condition was applied. |
| message | string | Human-readable message indicating details about the condition. |
| reason | string | Machine-readable, UpperCamelCase text indicating the reason for the condition. |
| status | string | Indicates whether that condition is applicable. One of `True`, `False` or `Unknown`. |


### `status.endpoints`
{: #gwy-status-resource-endpoint}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | Unique name for the endpoint. |
| type | string | Type of service the endpoint is exposing. For example `UI` or `API`. |
| uri | string | The URI of the endpoint. |

