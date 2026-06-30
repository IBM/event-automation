---
title: "Event Manager CRD reference"
excerpt: "Reference for the Custom Resource Definitions (CRDs) that is used by the Event Manager."
categories: reference
slug: mgr-api-reference
toc: true
---

Find out more about the {{site.data.reuse.eem_manager}} custom resource properties.

**Note:** This reference page includes only the {{site.data.reuse.eem_manager}} CR properties that you might want to view or update. Do not edit any CR properties that are not listed on this page.

## `spec`
{: #manager-resource-spec}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| deployNetworkPolicies | boolean | Control deployment of NetworkPolicies used by the instance. (default: true) |
| license | [license](#manager-resource-license) | Object containing product licensing details. |
| manager | [manager](#manager-resource-manager) | Object containing {{site.data.reuse.eem_manager}} configuration. |

### `spec.license`
{: #manager-resource-license}

For more information about licensing, see the [licensing reference]({{ 'support/licensing' | relative_url }}).

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| accept | boolean | Setting to true will declare that you have accepted the license terms and conditions. (default: false) |
| license | string | The license with which you are installing the product. |
| metric | string | The license metric being used for your product license. |
| use | string | The usage of the license with which you are installing the product. |


### `spec.manager`
{: #manager-resource-manager}

| Field             | Type                               | Description                                             |
|-------------------|------------------------------------|---------------------------------------------------------|
| apic              | [apic](#manager-resource-apic)             | Object containing {{site.data.reuse.apic_short}} connection configuration. |
| authConfig        | [authConfig](#manager-resource-authconfig) | Object containing authentication configuration.         |
| endpoints         | [][endpoint](#manager-resource-endpoint)   | List of endpoint configuration.                         |
| extensionServices | object                             | Configure extension service endpoints.                  |
| storage           | [storage](#manager-resource-storage)       | Object containing persistence configuration.            |
| template          | [template](#manager-resource-template)     | Object containing Kubernetes resource overrides.        |
| tls               | [tls](#manager-resource-tls)               | Object containing TLS configuration.                    |
| fips              | [fips](#manager-resource-fips)             | Object containing Federal Information Processing Standard (FIPS) configuration.    |
| openTelemetry     | [openTelemetry](#manager-resource-opentelemetry) | Object containing OpenTelemetry configuration.    |
| traceSpec         | string                             | Dynamically configurable trace specification.           |


#### `spec.manager.apic`
{: #manager-resource-apic}

For integration with {{site.data.reuse.apic_long}} v12.1.1 and later releases:

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| developerPortal | array[developerPortal](#manager-resource-developer-portal) | Array of objects containing {{site.data.reuse.apic_short}} configuration. |

For integration with {{site.data.reuse.apic_long}} v10.0.6 and later 10.x.x releases:

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| clientSubjectDN | string | Common name used for mTLS with {{site.data.reuse.apic_long}}. |
| jwks | [jwks](#manager-resource-jwks) | Object containing jwks configuration. |
| tls | boolean | Enable/Disable mTLS with {{site.data.reuse.apic_short}}. |

##### `spec.manager.apic.developer-portal`
{: #manager-resource-developer-portal}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| organization | string | The organization name. Must use `"eem"`. |
| endpoint | string | The {{site.data.reuse.apic_long}} v12.1.1 or later URL. Must use https protocol. |
| authentication | [authentication](#manager-resource-developer-portal-authentication) | Authentication configuration. |

##### `spec.manager.apic.developerPortal`
{: #manager-resource-developer-portal-authentication}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| key | string | The key in the secret that holds the value of the basic authentication credentials in the format `<username>:<password>`. |
| secretName | string | The name of the secret holding the credentials. |


##### `spec.manager.apic.jwks`
{: #manager-resource-jwks}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| endpoint | string | Service endpoint to provide JWKS URL. |


#### `spec.manager.authConfig`
{: #manager-resource-authconfig}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| authType | string | The authentication method you are going to use. One of `LOCAL`, `OIDC`, or `INTEGRATION_KEYCLOAK`. |
| oidcConfig | [oidcConfig](#manager-resource-oidcconfig) | Object containing OIDC configuration. |

##### `spec.manager.authConfig.oidcConfig`
{: #manager-resource-oidcconfig}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| additionalScopes | array[string] | Additional scopes over openid, profile, email that should be required, useful when using the `authorizationClaimPointer`. |
| authorizationClaimPointer | string | A JSON pointer to a claim in the ID token from the provider, which will be used for mapping authorization roles (for example, `"/resource_access/client_id/roles"`). |
| authorizationPath | string | The path to the authorization endpoint of this provider. |
| clientIDKey | string | The key in the secret that contains the OIDC Client ID. |
| clientSecretKey | string | The key in the secret that contains the OIDC Secret Key. |
| discovery | boolean | Whether to use OIDC discovery to retrieve the configuration for this provider. |
| endSessionPath | string | The path to the end session endpoint of this provider. |
| secretName | string | Secret containing OIDC credentials. |
| site | string | The site of the OIDC provider. |
| tokenPath | string | The path to the token endpoint of this provider. |
| userGroupClaimPointer | string | A JSON pointer to a claim in the ID token from the provider, which is used for adding user groups, for example `\"/resource_access/client_id/groups\"`. |
| userInfoPath | string | The path to the user info endpoint of this provider |

**Important:** Removing `groups` from the `userGroupClaimPointer` field can have unintended consequences. Before you change the value for this field, review the information in [disabling user groups](../../security/groups/#disable-user-groups).


####  `spec.manager.authentication`
{: #resource-authentication}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| maxRetries | integer | The maximum number of failed authentication attempts after which further attempts are blocked. Default is -1 (no limit). |
| retryBackoffMs | integer | The backoff time in milliseconds between consecutive failed authentication attempts. Default is 0. |
| lockoutPeriod | integer | The duration in seconds while the account is locked after an unsuccessful authentication attempt. Default is 0. |

#### `spec.manager.endpoints`
{: #manager-resource-endpoint}

| Field       | Type              | Description                                                                                                                |
|-------------|-------------------|----------------------------------------------------------------------------------------------------------------------------|
| annotations | map[string]string | The annotations to use in place of the [default ingress annotations](../../installing/configuring/#ingress-default-settings). |
| class       | string            | The ingress class name to use on the ingress resource, defaults to `nginx`.                                                |
| host        | string            | The DNS resolvable hostname to set on the ingress endpoint.                                                                |
| name        | string            | The name of the endpoint being configured. For valid values, see the following important notes.   

**Important:**
- On the {{site.data.reuse.openshift_short}}, `annotations` and `class` are not valid configuration options because OpenShift routes are created.
- On other Kubernetes platforms you must specify host values for exposed endpoints. <!--_DRAFT COMMENT: Host must be provided in OCP while creating wildcarded routes._-->
- Valid values for `name` are: `ui`, `gateway`, `admin`, `server`, and `apic`.

#### `spec.manager.fips`
{: #manager-resource-fips}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| mode | string | The value for Federal Information Processing Standard (FIPS) mode. Valid value is 'wall'. |

#### `spec.manager.template`
{: #manager-resource-template}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| annotations | object | Annotations that will be added to all Kubernetes resources used by the instance. Any annotations that are added to the template object and subsequently deleted are not automatically removed from resources that are already instantiated. These annotations need to be manually removed from the existing resources. |
| labels | object | Labels that will be added to all Kubernetes resources used by the instance. |
| pod | [pod](#manager-resource-pod) | Object containing pod override configuration. |

##### `spec.manager.template.pod`
{: #manager-resource-pod}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| spec | [podSpec](https://v1-35.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.26/#podspec-v1-core){:target="_blank"} | Kubernetes pod spec overrides. |


#### `spec.manager.storage`
{: #manager-resource-storage}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| deleteClaim | boolean | Specifies if the persistent volume claim has to be deleted when the instance is deleted. |
| existingClaimName | string | The name of a pre-created Persistence Volume Claim (PVC). |
| root | string | The root storage path where data will be stored. |
| rotationSecretName | string | The Kubernetes secret used for supplying a new encryption key. This field should only be set temporarily during the process of rotating the encryption key. |
| selectors | object | Labels to be used during PVC bind. |
| size | string | The storage size limit for the volume. Default is 500Mi. |
| storageClassName | string | The storage class name to use on created Persistent Volume Claims (PVCs). |
| type | string | Type of persistence to use. One of `ephemeral` or `persistent-claim`. |

#### `spec.manager.tls`
{: #manager-resource-tls}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| caCertificate | string | The key in the secret that holds the value of the CA certificate. |
| caSecretName | string | The name of a secret containing a root CA certificate that the product should use when creating additional certificates. |
| key | string | The key in the secret that holds the value of the private key. |
| secretName | string | The name of a secret containing certificates for securing component communications. |
| serverCertificate | string | The key in the secret that holds the value of the server certificate. |
| trustedCertificates | array[[trustedCertificate](#manager-resource-trustedcertificate)] | A set of secrets containing certificates which the {{site.data.reuse.eem_manager}} should trust when communicating with other services, such as gateways or OIDC providers. |
| ui | [ui](#manager-resource-ui) | Object containing TLS configuration explicitly for the UI. (Not present in eventgateway.events.ibm.com/v1beta1) |

#### `spec.manager.tls.trustedCertificates`
{: #manager-resource-trustedcertificate}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| certificate | string | The key within the specified secret that holds the value of the CA certificate. |
| secretName | string | The name of a Kubernetes secret containing a CA certificate to add to the truststore. |

#### `spec.manager.tls.ui`
{: #manager-resource-ui}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| caCertificate | string | The key in the secret that holds the value of the CA certificate. |
| key | string | The key in the secret that holds the value of the private key. |
| secretName | string | The name of a secret containing certificates for securing component communications. |
| serverCertificate | string | The key in the secret that holds the value of the server certificate. |

### `spec.manager.openTelemetry`
{: #manager-resource-opentelemetry}

| Field            | Type    | Description |
| ---------------- | --------| ----------- |
| endpoint         | string  | The endpoint to send the OpenTelemetry metrics.  Must include protocol http:// or https:// |
| protocol         | string  | The transport protocol to use, grpc (default) or http/protobuf. |
| interval         | integer | The interval between reporting of metrics in milliseconds. Default is 30000. |
| tls              | [otelTLS](#manager-resource-opentelemetry-tls) | The configuration of SSL Certificates for mTLS and a trusted certificate for endpoint server validation. |
| instrumentations | [][instrumentation](#manager-resource-instrumentation) | A list of instrumentations to enable in addition to those for the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}}. |

#### `spec.manager.openTelemetry.tls`
{: #manager-resource-opentelemetry-tls}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| clientCertificate | string | The key in the secret that holds the value of the PKCS8 encoded client certificate to use for mutualTLS (mTLS). |
| clientKey | string | The key in the secret that holds the value of the PKCS8 encoded private key certificate to use for mutualTLS (mTLS). |
| secretName | string | The name of a secret containing certificates for securing component communications for mutualTLS (mTLS). |
| trustedCertificate | [] | Configuration of a secret containing a TLS certificate to trust to validate the endpoint servers identity. |



#### `spec.manager.openTelemetry.instrumentation`
{: #manager-resource-instrumentation}

| Field        | Type    | Description |
| ------------ | --------| ----------- |
| name         | string  | The instrumentation name.  |
| enabled      | boolean  | Whether to enable or disabled the specified instrumentation. |

**Important:**
- The instrumentation name should be the instrumentation shortname. The supplied shortname is then configured as an env var against the relevant pod as `OTEL_INSTRUMENTATION_<name>_ENABLED=<enabled>` automatically.


## `status`
{: #manager-resource-status}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| conditions | array[[condition](#manager-status-resource-condition)] | A list of conditions representing the state of the custom resource. |
| versions | [versions](#manager-status-resource-versions) | Object containing versioning information. |
| endpoints | array[[endpoint](#manager-status-resource-endpoint)] | A list of endpoints exposed by the instance. |
| phase | string | A value representing the phase in which the instance is operating. One of `Running`, `Failed` or `Pending`. |

### `status.versions`
{: #status-resource-versions}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| reconciled | string | The reconciled version of the instance |
| available | [available](#manager-status-resource-available) | Object containing available versions. |

#### `status.versions.available`
{: #manager-status-resource-available}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| versions | array[[version](#manager-status-resource-versions)] | A list of the available versions. |
| channels | array[[channel](#manager-status-resource-channel)]  | A list of the available channels. |

##### `status.versions.available.versions`
{: #manager-status-resource-versions}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| licenses | array[] | A list of available licenses. |

##### `status.versions.available.channels`
{: #manager-status-resource-channel}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| licenses | array[] | A list of available licenses. |


### `status.conditions`
{: #manager-status-resource-condition}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| lastTransitionTime | string | The time at which the condition was applied. |
| message | string | Human-readable message indicating details about the condition. |
| reason | string | Machine-readable, UpperCamelCase text indicating the reason for the condition. |
| status | string | Indicates whether that condition is applicable. One of `True`, `False` or `Unknown`. |

### `status.endpoints`
{: #manager-status-resource-endpoint}

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | Unique name for the endpoint. |
| type | string | Type of service the endpoint is exposing. For example `UI` or `API`. |
| scope | string | The scope of the endpoint. For example `External`, `Internal`. |
| uri | string | The URI of the endpoint. |




