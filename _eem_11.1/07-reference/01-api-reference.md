---
title: "API reference for the CRDs"
excerpt: "API reference for the Custom Resource Definitions (CRDs) that are used by Event Endpoint Management."
categories: reference
slug: api-reference
toc: true
---

Find out more abut the Custom Resource Definitions (CRDs) used by {{site.data.reuse.eem_name}}.

## `eventendpointmanagement.events.ibm.com/v1beta1`

### Resource: `spec`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| deployNetworkPolicies | boolean | Control deployment of NetworkPolicies used by the instance. (default: true) |
| license | [license](#resource-license) | Object containing product licensing details. |
| manager | [manager](#resource-manager) | Object containing {{site.data.reuse.eem_manager}} configuration. |

## `eventgateway.events.ibm.com/v1beta1`

### Resource: `spec`

| Field                 | Type                             | Description                                                                 |
|-----------------------|----------------------------------|-----------------------------------------------------------------------------|
| config                | string                           | N/A. Usage not advised.                                                     |
| deployNetworkPolicies | boolean                          | Control the deployment of NetworkPolicies that are used by the instance. (default: true) |
| endpoints             | [][endpoint](#resource-endpoint) | List of endpoint configurations.                                            |
| gatewayGroupName      | string                           | The name of the gateway group to which this gateway is to be added.          |
| gatewayID             | string                           | The identifier of the gateway group to which this gateway is to be added.          |
| license               | [license](#resource-license)     | Object containing product licensing details.                                |
| managerEndpoint       | string                           | The endpoint address for an {{site.data.reuse.eem_manager}} instance.       |
| template              | [template](#resource-template)   | Object containing Kubernetes resource overrides.                            |
| tls                   | [tls](#resource-tls)             | Object containing TLS configuration.                                        |
| fips                  | [fips](#resource-fips)           | Object containing Federal Information Processing Standard (FIPS) configuration.    |

## API Reference of Objects Used in the CRDs

### Resource: `apic`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| clientSubjectDN | string | Common name used for mTLS with API Connect. |
| jwks | [jwks](#resource-jwks) | Objects containing jwks configuration. |
| tls | boolean | Enable/Disable mTLS with API Connect. |

### Resource: `authConfig`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| authType | string | The authentication method you are going to use. One of `LOCAL` or `OIDC`. |
| oidcConfig | [oidcConfig](#resource-oidcconfig) | Object containing OIDC configuration. |

### Resource: `endpoint`

| Field       | Type              | Description                                                                                                                |
|-------------|-------------------|----------------------------------------------------------------------------------------------------------------------------|
| annotations | map[string]string | The annotations to use in place of the [default ingress annotations](../installing/configuring/#ingress-default-settings). |
| class       | string            | The ingress class name to use on the ingress resource, defaults to `nginx`.                                                |
| host        | string            | The DNS resolvable hostname to set on the ingress endpoint.
| name        | string            | The name of the endpoint being configured. For valid values, see the following important notes.                            |
| type        | string            | The type of exposure for an endpoint. Either `external`, `internal`, or `disabled` (default is `external`). The type option is only applicable to the `admin` endpoint. The `external` type will expose the endpoint to network traffic from outside the cluster. The `internal` type will expose the endpoint to network traffic only from the cluster's internal network. The `disabled` type will not expose the endpoint to any traffic.  

**Important:**
- On the {{site.data.reuse.openshift_short}}, `annotations` and `class` are not valid configuration options because OpenShift routes are created.
- On other Kubernetes platforms you must specify host values for exposed endpoints.
- Valid values for `name` are:
  - For `EventEndpointManagement` resources: `ui`, `gateway`, `admin`, and `apic`.
  - For `EventGateway` resources: `gateway`. 

### Resource: `jwks`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| endpoint | string | Service endpoint to provide JWKS URL. |

### Resource: `license`

For more information about licensing, see the [licensing reference]({{ 'support/licensing' | relative_url }}).

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| accept | boolean | Setting to true will declare that you have accepted the license terms and conditions. (default: false) |
| license | string | The license with which you are installing the product. |
| metric | string | The license metric being used for your product license. |
| use | string | The usage of the license with which you are installing the product. |

### Resource: `manager`

| Field             | Type                               | Description                                             |
|-------------------|------------------------------------|---------------------------------------------------------|
| apic              | [apic](#resource-apic)             | Object containing API Connect connection configuration. |
| authConfig        | [authConfig](#resource-authconfig) | Object containing authentication configuration.         |
| endpoints         | [][endpoint](#resource-endpoint)   | List of endpoint configuration.                         |
| extensionServices | object                             | Configure extension service endpoints.                  |
| storage           | [storage](#resource-storage)       | Object containing persistence configuration.            |
| template          | [template](#resource-template)     | Object containing Kubernetes resource overrides.        |
| tls               | [tls](#resource-tls)               | Object containing TLS configuration.                    |
| fips              | [fips](#resource-fips)             | Object containing Federal Information Processing Standard (FIPS) configuration.    |

### Resource: `oidcConfig`

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


### Resource: `pod`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| spec | [podSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.26/#podspec-v1-core){:target="_blank"} | Kubernetes pod spec overrides. |

### Resource: `storage`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| deleteClaim | boolean | Specifies if the persistent volume claim has to be deleted when the instance is deleted. |
| existingClaimName | string | The name of a pre-created Persistence Volume Claim (PVC). |
| root | string | The root storage path where data will be stored. |
| rotationSecretName | string | The Kubernetes secret used for supplying a new encryption key. |
| selectors | object | Labels to be used during PVC bind. |
| size | string | The storage size limit for the volume. |
| storageClassName | string | The storage class name to use on created Persistent Volume Claims (PVCs). |
| type | string | Type of persistence to use. One of `ephemeral` or `persistent-claim`. |

### Resource: `template`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| annotations | object | Annotations that will be added to all Kubernetes resources used by the instance. |
| labels | object | Labels that will be added to all Kubernetes resources used by the instance. |
| pod | [pod](#resource-pod) | Object containing pod override configuration. |

### Resource: `tls`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| caCertificate | string | The key in the secret that holds the value of the CA certificate. |
| caSecretName | string | The name of a secret containing a root CA certificate that the product should use when creating additional certificates. |
| key | string | The key in the secret that holds the value of the private key. |
| secretName | string | The name of a secret containing certificates for securing component communications. |
| serverCertificate | string | The key in the secret that holds the value of the server certificate. |
| trustedCertificates | array[[trustedCertificate](#resource-trustedcertificate)] | A set of secrets containing certificates which the {{site.data.reuse.eem_manager}} should trust when communicating with other services, such as gateways or OIDC providers. |
| ui | [ui](#resource-ui) | Object containing TLS configuration explicitly for the UI. (Not present in eventgateway.events.ibm.com/v1beta1) |

### Resource: `fips`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| mode | string | The value for Federal Information Processing Standard (FIPS) mode. Valid value is 'wall'. |

### Resource: `trustedCertificate`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| certificate | string | The key within the specified secret that holds the value of the CA certificate. |
| secretName | string | The name of a Kubernetes secret containing a CA certificate to add to the truststore. |

### Resource: `ui`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| caCertificate | string | The key in the secret that holds the value of the CA certificate. |
| key | string | The key in the secret that holds the value of the private key. |
| secretName | string | The name of a secret containing certificates for securing component communications. |
| serverCertificate | string | The key in the secret that holds the value of the server certificate. |

## status

Find the CRDs supported by `status`.

**Important:** Status field is used to display specific information about the instance. Do not edit the status field manually.

### Resource: `status`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| conditions | array[[condition](#resource-condition)] | A list of conditions representing the state of the custom resource. |
| versions | [versions](#resource-versions) | Object containing versioning information. |
| endpoints | array[[endpoint](#resource-endpoint)] | A list of endpoints exposed by the instance. |
| phase | string | A value representing the phase in which the instance is operating. One of `Running`, `Failed` or `Pending`. |

### Resource: `available`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| versions | array[[version](#resource-version)] | A list of the available versions. |
| channels | array[[channel](#resource-channel)]  | A list of the available channels. |

### Resource: `availableLicense`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| displayName | string | Optional display name for the license. |
| link | string | Link to the license content. |
| matchesCurrentType | boolean | True if the license matches the type of license used by the current operand. |
| licenseUseList | array[string] | A list of available license uses. |
| availableMetrics | array[string] | A list of available licenses metrics. |

### Resource: `condition`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| lastTransitionTime | string | The time at which the condition was applied. |
| message | string | Human-readable message indicating details about the condition. |
| reason | string | Machine-readable, UpperCamelCase text indicating the reason for the condition. |
| status | string | Indicates whether that condition is applicable. One of `True`, `False` or `Unknown`. |

### Resource: endpoint

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | Unique name for the endpoint. |
| type | string | Type of service the endpoint is exposing. For example `UI` or `API`. |
| scope | string | The scope of the endpoint. For example `External`, `Internal`. |
| uri | string | The URI of the endpoint. |

### Resource: `channel`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| licenses | array[[availableLicense](#resource-availablelicense)] | A list of available licenses. |
| type | string | The identifier of the condition. |  

### Resource: `version`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| licenses | array[[availableLicense](#resource-availablelicense)] | A list of available licenses. |

### Resource: `versions`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| reconciled | string | The reconciled version of the instance |
| available | [available](#resource-available) | Object containing available versions. |

