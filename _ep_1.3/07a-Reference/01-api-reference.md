---
title: "API reference for the CRDs"
excerpt: "API reference for the Custom Resource Definitions (CRDs) that are used by Event Processing."
categories: reference
slug: api-reference
toc: true
---
Find out more abut the Custom Resource Definitions (CRDs) used by {{site.data.reuse.ep_name}}.

## `eventprocessing.events.ibm.com/v1beta1`

### Resource: `spec`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| authoring | [authoring](#resource-authoring) | Object containing authoring configuration. |
| deployNetworkPolicies | boolean | Control deployment of NetworkPolicies used by the instance (default: true). |
| flink | [flink](#resource-flink) | Object containing authoring configuration. |
| license | [license](#resource-license) | Object containing product licensing details. |

### Resource: `license`

For more information about licensing, see the [licensing reference]({{ 'support/licensing' | relative_url }}).

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| accept | boolean | Setting to true will declare that you have accepted the license terms and conditions (default: false). |
| license | string | The license with which you are installing the product. |
| metric | string | The license metric that is used for your product license. |
| use | string | The usage of the license with which you are installing the product. |


### Resource: `flink`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| endpoint | string | The address of the Flink cluster's REST endpoint. |

### Resource: `authoring`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| authConfig | [authConfig](#resource-authconfig) | Object containing authentication configuration. |
| storage | [storage](#resource-storage) | Object containing persistence configuration. |
| template | [template](#resource-template) | Object containing Kubernetes resource overrides. |
| tls | [tls](#resource-tls) | Object containing TLS configuration. |

### Resource: `authConfig`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| authType | string | The authentication method that you are going to use. Either `LOCAL` or `OIDC`. |
| oidcConfig | [oidcConfig](#resource-oidcconfig) | Object containing OIDC configuration. |

### Resource: `oidcConfig`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| additionalScopes | array[string] | Additional scopes over openid, profile, email that should be required, useful when using the authorizationClaimPointer. |
| authorizationClaimPointer | string | A JSON pointer to a claim in the ID token from the provider, which will be used for mapping authorization roles (for example, "/resource_access/client_id/roles"). |
| authorizationPath | string | The path to the authorization endpoint of this provider. |
| clientIDKey | string | The key in the secret that contains the OIDC Client ID. |
| clientSecretKey | string | The key in the secret that contains the OIDC Secret Key. |
| discovery | boolean | Whether to use OIDC discovery to retrieve the configuration for this provider. |
| endSessionPath | string | The path to the end session endpoint of this provider. |
| secretName | string | Secret containing OIDC credentials. |
| site | string | The site of the OIDC provider. |
| tokenPath | string | The path to the token endpoint of this provider. |

### Resource: `storage`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| deleteClaim | boolean | Specifies if the persistent volume claim has to be deleted when the instance is deleted. |
| existingClaimName | string | The name of a pre-created Persistence Volume Claim (PVC). |
| root | string | The root storage path where data is stored. |
| rotationSecretName | string | The Kubernetes secret used for supplying a new encryption key. |
| selectors | object | Labels to be used during PVC bind. |
| size | string | The storage size limit for the volume. |
| storageClassName | string | The storage class name to use on created Persistent Volume Claims (PVCs). |
| type | string | Type of persistence to use. Either `ephemeral` or `persistent-claim`. |

### Resource: `template`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| annotations | object | Annotations that will be added to all Kubernetes resources used by the instance. |
| labels | object | Labels that will be added to all Kubernetes resources used by the instance. |
| pod | [pod](#resource-pod) | Object containing pod override configuration. |

### Resource: `pod`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| spec | [podSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.26/#podspec-v1-core){:target="_blank"} | Kubernetes pod spec overrides. |

### Resource: `tls`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| caCertificate | string | The key in the secret that holds the value of the CA certificate. |
| caSecretName | string | The name of a secret containing a root CA certificate that the product should use when creating additional certificates. |
| key | string | The key in the secret that holds the value of the private key. |
| secretName | string | The name of a secret containing certificates for securing component communications. |
| serverCertificate | string | The key in the secret that holds the value of the server certificate. |
| trustedCertificates | array[[trustedCertificate](#resource-trustedcertificate)] | A set of secrets containing certificates which the manager should trust when communicating with other services, such as gateways or OIDC providers. |
| ui | [ui](#resource-ui) | Object containing TLS configuration explicitly for the UI (not present in eventgateway.events.ibm.com/v1beta1). |

### Resource: `ui`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| caCertificate | string | The key in the secret that holds the value of the CA certificate. |
| key | string | The key in the secret that holds the value of the private key. |
| secretName | string | The name of a secret containing certificates for securing component communications. |
| serverCertificate | string | The key in the secret that holds the value of the server certificate. |


## Status

Find the CRDs supported by `status`.

**Important:** Status field is used to display specific information about the instance. Do not edit the status field manually.

### Resource: `status`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| conditions | array[[condition](#resource-condition)] | A list of conditions representing the state of the custom resource. |
| versions | [versions](#resource-versions) | Object containing versioning information. |
| endpoints | array[[endpoint](#resource-endpoint)] | A list of endpoints exposed by the instance. |
| phase | string | A value representing the phase in which the instance is operating. Either `Running`, `Failed` or `Pending`. |

### Resource: `condition`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| lastTransitionTime | string | The time at which the condition was applied. |
| message | string | Human-readable message indicating details about the condition. |
| reason | string | Machine-readable, UpperCamelCase text indicating the reason for the condition. |
| status | string | Indicates whether that condition is applicable. Either `True`, `False` or `Unknown`. |
| type | string | The identifier of the condition. |

### Resource: endpoint

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | Unique name for the endpoint. |
| type | string | Type of service the endpoint is exposing. For example `UI` or `API`. |
| scope | string | The scope of the endpoint. For example `External`, `Internal`. |
| uri | string | The URI of the endpoint. |

### Resource: `versions`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| reconciled | string | The reconciled version of the instance. |
| available | [available](#resource-available) | Object containing available versions. |

### Resource: `available`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| versions | array[[version](#resource-version)] | A list of the available versions. |
| channels | array[[channel](#resource-channel)]  | A list of the available channels. |

### Resource: `version`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| licenses | array[[availableLicense](#resource-availablelicense)] | A list of available licenses. |

### Resource: `channel`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| licenses | array[[availableLicense](#resource-availablelicense)] | A list of available licenses. |


### Resource: `availableLicense`

| Field | Type | Description |
| ----------- | ----------- | ----------- |
| name | string | The semantic version number. |
| displayName | string | Optional display name for the license. |
| link | string | Link to the license content. |
| matchesCurrentType | boolean | True if the license matches the type of license used by the current operand. |
| licenseUseList | array[string] | A list of available license uses. |
| availableMetrics | array[string] | A list of available license metrics. |