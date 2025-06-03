---
title: "Configuring"
excerpt: "Configure your Event Endpoint Management Installation."
categories: installing
slug: configuring
toc: true
---

## Setting environment variables

You can configure the {{site.data.reuse.eem_manager}} or the {{site.data.reuse.egw}} by setting environment variables. On [operator-managed](../install-gateway#operator-managed-gateways) and [Kubernetes Deployment](../install-gateway#remote-gateways) {{site.data.reuse.egw}}s you specify the environment variables in a template override (`env`) which specifies one or more name-value pairs. On [Docker](../install-gateway#remote-gateways) gateways, add the environment variable to your Docker `run` command, for example: `-e <variable name>`.

**Important** Remember to [backup](../backup-restore) your gateway configuration after you make updates. 

The format for {{site.data.reuse.eem_manager}} instances is:

```yaml
spec:
  manager:
    template:
      pod:
        spec:
          containers:
            - name: manager
              env:
                - name: <name>
                  value: <value>
```

The format for [operator-managed](../install-gateway#operator-managed-gateways) {{site.data.reuse.egw}} instances is:

```yaml
spec:
  template:
    pod:
      spec:
        containers:
          - name: egw
            env:
              - name: <name>
                value: <value>
```

Where:

- `<name>` is the specification that you want to configure.
- `<value>` is the value to configure the specification.

For [Kubernetes Deployment](../install-gateway#remote-gateways) {{site.data.reuse.egw}} instances the path in the Kubernetes Deployment is `spec.template.spec.containers`.


For example, to enable trace logging in the {{site.data.reuse.eem_manager}}:

```yaml
spec:
  manager:
    template:
      pod:
        spec:
          containers:
            - name: manager
              env:
                - name: TRACE_SPEC
                  value: "<package>:<trace level>"
```

## Enabling persistent storage

To persist the data input into an {{site.data.reuse.eem_manager}} instance, configure persistent storage in your `EventEndpointManagement` configuration.

To enable persistent storage for `EventEndpointManagement` set `spec.manager.storage.type` to `persistent-claim`, and then configure the storage in one of the following ways:

- [dynamic provisioning](#dynamic-provisioning)
- [providing persistent volume](#providing-persistent-volumes)
- [providing persistent volume and persistent volume claim](#providing-persistent-volume-and-persistent-volume-claim).

Ensure that you have sufficient disk space for persistent storage.

**Note:** `spec.manager.storage.type` can also be set to `ephemeral`, although no persistence is provisioned with this configuration. This is not recommended for production usage because it results in lost data.

### Dynamic provisioning

If there is a [dynamic storage provisioner](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/storage/dynamic-provisioning) present on the system, you can use the dynamic storage provisioner to dynamically provision the persistence for {{site.data.reuse.eem_name}}.
To configure this, set `spec.manager.storage.storageClassName` to the name of the storage class provided by the provisioner.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    storage:
      type: persistent-claim
      storageClassName: csi-cephfs
# ...
```


- Optionally, specify the storage size in `storage.size` (for example, the default value used would be `"100Mi"`). Ensure that the [quantity suffix](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/quantity/), such as `Mi` or `Gi`, is included. <!-- what do we mean by the 'the default value used would be 100Mi'? Is that the value if you don't specify any size? -->
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt/storage"`).
- Optionally, specify the retention setting for the storage if the instance is deleted in `storage.deleteClaim` (for example, `"true"`).


### Providing persistent volumes

Before you install {{site.data.reuse.eem_name}}, you can create a persistent volume for it to use as storage.
To use a persistent volume that you created earlier, set the `spec.manager.storage.selectors` to match the labels on the persistent volume and set the `spec.manager.storage.storageClassName` to match the `storageClassName` on the persistent volume.
The following example creates a persistent volume claim to bind to a persistent volume with the label `precreated-persistence: my-pv` and `storageClassName: manual`.
Multiple labels can be added as selectors, and the persistent volume must have all labels present to match.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    storage:
      type: persistent-claim
      selectors:
        precreated-persistence: my-pv
      storageClassName: manual
# ...

```


- Optionally, specify the storage size in `storage.size` (for example, the default value used would be `"100Mi"`). Ensure that the [quantity suffix](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/quantity/), such as `Mi` or `Gi`, is included.
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt/storage"`).
- Optionally, specify the retention setting for the storage if the instance is deleted in `storage.deleteClaim` (for example, `"true"`).


### Providing persistent volume and persistent volume claim

A persistent volume and persistent volume claim can be pre-created for {{site.data.reuse.eem_name}} to use as storage.
To use this method, set `spec.manager.storage.existingClaimName` to match the name of the pre-created persistent volume claim.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    storage:
      type: persistent-claim
      existingClaimName: my-existing-pvc
# ...
```

## Configuring TLS
{: #config-tls}

TLS can be configured for the `EventEndpointManagement` instance in one of the following ways:

- [Operator configured CA certificate](#operator-configured-ca-certificate)
- [User provided CA certificate](#user-provided-ca-certificate)
- [User provided certificates](#user-provided-certificates)
- [User provided UI certificates](#user-provided-ui-certificates)

### Operator configured CA certificate
{: #operator-configured-ca-certifcate}

By default, the operator configures TLS if no value is provided for CA certificate when creating the instance. The operator uses the Cert Manager that is installed on the system to generate a CA certificate with a self-signed issuer. It then uses this self-signed CA certificate to sign the certificates used for secure communication by the {{site.data.reuse.eem_manager}} instance. Cert Manager puts the CA certificate into a secret named `<my-instance>-ibm-eem-manager-ca`. This secret can be used for configuring the `EventGateway` TLS communications.

Cert Manager and {{site.data.reuse.eem_name}} creates the following objects:


- Cert Manager Issuers:

  - `<my-instance>-ibm-eem-manager`
  - `<my-instance>-ibm-eem-manager-selfsigned`

- Cert Manager Certificates:

  - `<my-instance>-ibm-eem-manager-ca`
  - `<my-instance>-ibm-eem-manager`

The following code snippet is an example of a configuration where Cert Manager creates all certificates and {{site.data.reuse.eem_name}}:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
# ...
```

### User-provided CA certificate
{: #user-provided-ca-certificate}

You can provide a custom CA certificate to the {{site.data.reuse.eem_manager}} instance.


The operator uses the Cert Manager that is installed on the system to create the certificates that are used to secure all endpoints on the {{site.data.reuse.eem_manager}} instance. The certificates are signed by using the provided CA certificate.

The CA secret that is created and referenced in the certificate manager must contain the keys `ca.crt`, `tls.crt`, `tls.key`. The `ca.crt` key and the `tls.crt` key can have the same value.

See the following example to use the user provided certificate files (`ca.crt`, `tls.crt`, and `tls.key`):

1. Set a variable for the `NAMESPACE` by running the following command:

   ```shell
   export NAMESPACE=<instance namespace>
   ```

2. Create the CA secret by running the following command:

   ```shell
   kubectl create secret generic ca-secret-cert --from-file=ca.crt=ca.crt --from-file=tls.crt=tls.crt --from-file=tls.key=tls.key -n ${NAMESPACE}
   ```

3. To provide a custom CA certificate secret, set `spec.manager.tls.caSecretName` key to be the name of the CA certificate secret that contains the CA certificate.

The following code snippet is an example of a configuration that uses the CA certificate secret that is created in the previous steps:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    tls:
      caSecretName: ca-secret-cert
# ...
```

#### Create a certificate with openssl
{: #create-a-certificate-with-openssl}

You can generate a certificate externally that can be used when you configure a [custom CA certificate](#user-provided-ca-certificate). 

For example, the following steps describe how to generate a self-signed CA certificate by using openssl, store that certificate as a Kubernetes secret and use that secret in an {{site.data.reuse.eem_name}} instance.

1. Generate a certificate key file by using `openssl`:
`openssl genrsa --out ca.key 4096`
1. Generate a CA certificate by using the key file:
`openssl req -new -x509 -sha256 -days 10950 -key ca.key -out ca.crt`
1. {{site.data.reuse.cncf_cli_login}}
1. Ensure that you are in the namespace where your {{site.data.reuse.eem_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<namespace>
   ```
1. Encode your externally generated certificates to Base64 format, and make a note of the values:

    `base64 -i ca.crt`

    `base64 -i ca.key`
1. Create a YAML file called `secret.yaml` with the following content:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: ibm-ca-secret
      namespace: <eem namespace>
    type: Opaque
    data:
      ca.crt: <Base64 value for ca.crt>
      tls.crt: <Base64 value for ca.crt>
      tls.key: <Base64 value for ca.key>
    ```
1. Apply the secret by running the following command:

   ```shell
   kubectl apply -f secret.yaml
   ```
1. To use this secret in your {{site.data.reuse.eem_name}} instance, set `spec.manager.tls.caSecretName` key to be the name of the CA certificate secret that contains the CA certificate.

**Note:** If you are updating an existing instance and cannot log in to the {{site.data.reuse.eem_name}} UI after you changed your CA certificates, see [troubleshooting](../../troubleshooting/changing-ca-certificate/) to resolve the error.

### User-provided certificates

You can use a custom certificate for secure communication by the {{site.data.reuse.eem_manager}} instance. You can use the OpenSSL tool to generate a CA and certificates that are required for an {{site.data.reuse.eem_manager}} instance.

**Note:** The `envsubst` utility is available on Linux and can be installed by default as part of the `gettext` package.

See the following example for using the OpenSSL tool to generate a CA and certificates that are required for an {{site.data.reuse.eem_manager}} instance:

1. If you are using a MAC, the following packages are required and can be installed by using `HomeBrew`:

   - gettext
   - openssl@3

   ```shell
   brew install gettext openssl@3
   ```

   Then run `alias openssl=$(brew --prefix)/opt/openssl@3/bin/openssl` to use Openssl3.

2. Set the following variables on your workstation:

   ```shell
   EMAIL=<email-address>
   MANAGER_NAME=<name-of-the-event-manager-instance>
   CLUSTER_API=<cluster-api>
   NAMESPACE=<event-endpoint-management-installation-namespace>
   ```

   Where:

   - MANAGER_NAME is the name of the {{site.data.reuse.eem_manager}} instance.
   - CLUSTER_API is the cluster URL that can be obtained from the cluster. If the URL is `https://console-openshift-console.apps.clusterapi.com/` then the CLUSTER_API must be set to `apps.clusterapi.com`.

3. Create a file called `csr_ca.txt` with the following data:

   ```shell
   [req]
   prompt = no
   default_bits = 4096
   default_md = sha256
   distinguished_name = dn
   x509_extensions = usr_cert

   [dn]
   C=US
   ST=New York
   L=New York
   O=MyOrg
   OU=MyOU
   emailAddress=me@working.me
   CN = server.example.com

   [usr_cert]
   basicConstraints=CA:TRUE
   subjectKeyIdentifier=hash
   authorityKeyIdentifier=keyid,issuer
   ```

4. Create a file called `my-eem-manager_answer.txt` with the following data:

   ```shell
   [req]
   default_bits = 4096
   prompt = no
   default_md = sha256
   x509_extensions = req_ext
   req_extensions = req_ext
   distinguished_name = dn

   [dn]
   C=US
   ST=New York
   L=New York
   O=MyOrg
   OU=MyOrgUnit
   emailAddress=${EMAIL}
   CN = ${MANAGER_NAME}-ibm-eem-manager

   [req_ext]
   subjectAltName = @alt_names

   [alt_names]
   DNS.1 = ${MANAGER_NAME}-ibm-eem-manager
   DNS.2 = ${MANAGER_NAME}-ibm-eem-manager.${NAMESPACE}
   DNS.3 = ${MANAGER_NAME}-ibm-eem-manager.${NAMESPACE}.svc
   DNS.4 = ${MANAGER_NAME}-ibm-eem-manager.${NAMESPACE}.svc.cluster.local
   DNS.5 = ${MANAGER_NAME}-ibm-eem-apic-${NAMESPACE}.${CLUSTER_API}
   DNS.6 = ${MANAGER_NAME}-ibm-eem-gateway-${NAMESPACE}.${CLUSTER_API}
   DNS.7 = ${MANAGER_NAME}-ibm-eem-manager-${NAMESPACE}.${CLUSTER_API}
   DNS.8 = ${MANAGER_NAME}-ibm-eem-admin-${NAMESPACE}.${CLUSTER_API}
   DNS.9 = eem.${MANAGER_NAME}-ibm-eem-server-${NAMESPACE}.${CLUSTER_API}
   ```

    **Important:** If you are planning to do any of the following for your deployment, ensure that you modify the `[alt_names]` section in the previous example to include the {{site.data.reuse.eem_manager}} `ui`, `gateway`, `admin` (for the Admin API), and, if integration with {{site.data.reuse.apic_long}} is required, the `apic` endpoint hostnames:
    - You are planning to specify hostnames in the `EventEndpointManagement` custom resource under `spec.manager.endpoints`.
    - You are planning to create additional routes or ingress.
    - You are not running on {{site.data.reuse.openshift_short}}.

    You can use wildcard SAN entries in certificates. You must include a SAN entry for the local cluster network when you use [LOCAL](../../security/managing-access#setting-up-local-authentication) authentication.

    When you use [LOCAL](../../security/managing-access#setting-up-local-authentication) authentication with the {{site.data.reuse.eem_manager}}, the required SAN entries are as follows:

    ```yaml
    spec:
      dnsNames:
        - '*.<NAMESPACE>.svc.cluster.local'
        - '*.<CLUSTER_API>'
        - eem.*.<CLUSTER_API>'
    ```

    When you use [OIDC](../../security/managing-access#setting-up-openid-connect-oidc-based-authentication) authentication with the {{site.data.reuse.eem_manager}}, the required SAN entries are as follows:

    ```yaml
    spec:
      dnsNames:
        - '*.<CLUSTER_API>'
        - eem.*.<CLUSTER_API>'
    ```

    The required SAN entries for the {{site.data.reuse.egw}} are as follows:

    ```yaml
    spec:
      dnsNames:
        - '*.<CLUSTER_API>'
    ```


5. Generate the required certificates by running the following commands:

   - `ca.key`:

     ```shell
     openssl genrsa -out ca.key 4096
     ```

   - `ca.crt`:

     ```shell
     openssl req -new -x509 -key ca.key -days 730 -out ca.crt -config <( envsubst <csr_ca.txt )
     ```

   - `manager` key:

     ```shell
     openssl genrsa -out ${MANAGER_NAME}.key 4096
     ```

   - `manager csr`:

     ```shell
     openssl req -new -key ${MANAGER_NAME}.key -out ${MANAGER_NAME}.csr -config <(envsubst < my-eem-manager_answer.txt )
     ```

6. Sign the `csr` to create the `manager crt` by running the following command:

   ```shell
   openssl x509 -req -in ${MANAGER_NAME}.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out ${MANAGER_NAME}.crt -days 730 -extensions 'req_ext' -extfile <(envsubst < my-eem-manager_answer.txt)
   ```

7. Verify the certificate by running the following command:

   ```shell
   openssl verify -CAfile ca.crt ${MANAGER_NAME}.crt
   ```

8. Create a secret on the cluster by running the following command:

   **Note:** The secret must be added to the namespace where the {{site.data.reuse.eem_manager}} instance is to be deployed in.

   ```shell
   kubectl create secret generic ${MANAGER_NAME}-cert --from-file=ca.crt=ca.crt --from-file=tls.crt=${MANAGER_NAME}.crt --from-file=tls.key=${MANAGER_NAME}.key -n ${NAMESPACE}
   ```

9. Create an {{site.data.reuse.eem_manager}} instance called `${MANAGER_NAME}` in the same namespace where you generated the secret in step 8. Ensure the `spec.manager.tls.secretName` field is set to the name of the secret from step 8. For example:

   ```yaml
   apiVersion: events.ibm.com/v1beta1
   kind: EventEndpointManagement
   metadata:
     name: my-eem
     namespace: eem
   spec:
     license:
       # ...
     manager:
       tls:
         secretName: my-eem-manager-cert
   # ...
   ```

### User-provided UI certificates
{: #user-provided-ui-certs}

A separate custom certificate can be configured for the UI endpoint. This certificate is presented to the browser when a user accesses the {{site.data.reuse.eem_name}} UI.
To supply a custom certificate to the UI:
- Set `spec.manager.tls.ui.secretName` to be the name of the secret that contains the certificate.
- Add the CA certificate that is used to sign your custom certificate to the list of trusted certificates under `spec.manager.tls.trustedCertificates`.

The following snippet is an example of a configuration that uses a user-provided certificate in a secret, which also contains the signing CA certificate as a trusted certificate:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    tls:
      ui:
        secretName: myUiSecret
      trustedCertificates:
        - secretName: myUiSecret
          certificate: ca.crt
# ...
```

Optionally, if you are running on the {{site.data.reuse.openshift}}:

- Specify the key in the secret that is pointing to the CA certificate `ui.caCertificate` (default, `ca.crt`).
- Specify the key in the secret that is pointing to the server certificate `ui.serverCertificate` (default, `tls.crt`).
- Specify the key in the secret that is pointing to the private key `ui.key` (default, `tls.key`).


## Configuring authentication
{: #configuring-authentication}

Authentication is configured in the `EventEndpointManagement` configuration.

The following authentication types are available: LOCAL, OIDC, and INTEGRATION_KEYCLOAK if you are deploying as part of {{site.data.reuse.cp4i}}.

The following code snippet is an example of a configuration that has authentication set to LOCAL.

   ```yaml
   apiVersion: events.ibm.com/v1beta1
   kind: EventEndpointManagement
   ...
   spec:
     ...
     manager:
       authConfig:
          authType: LOCAL
     ...
   ```

Edit the `spec.manager.authConfig` section to include `authType` as `LOCAL`, `OIDC`, or `INTEGRATION_KEYCLOAK` as required.

For more information, see [managing access](../../security/managing-access).

## Deploy network policies for operator-managed {{site.data.reuse.egw}}s

By default, the operator deploys an instance-specific network policy when an instance of `EventEndpointManagement` or `EventGateway` is created.
The deployment of these network policies can be turned off by setting the `spec.deployNetworkPolicies` to `false`.

The following code snippet is an example of a configuration that turns off the deployment of the network policy:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  deployNetworkPolicies: false
# ...
---
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  deployNetworkPolicies: false  
```

## Configuring ingress
{: #configuring-ingress}

If you are running on the {{site.data.reuse.openshift}}, routes are automatically configured to provide external access.
Optional: You can set a host for each exposed route on your {{site.data.reuse.eem_manager}} and operator-managed {{site.data.reuse.egw}} instances by setting values under `spec.manager.endpoints[]` in your `EventEndpointManagement` custom resource, and under `spec.endpoints[]` in your `EventGateway` custom resource.

If you are running on other Kubernetes platforms, the {{site.data.reuse.eem_name}} operator creates ingress resources to provide external access. No default hostnames are assigned to the ingress resource, and you must set hostnames for each exposed endpoint that is defined for the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.

For the {{site.data.reuse.eem_manager}} instance, the `spec.manager.endpoints[]` section of your `EventEndpointManagement` custom resource must contain entries for the following service endpoints:

- The {{site.data.reuse.eem_name}} UI (service name: `ui`)
- The {{site.data.reuse.egw}} (service name: `gateway`)
- The {{site.data.reuse.eem_name}} Admin API (service name: `admin`)
- The {{site.data.reuse.eem_name}} server for deploying gateways and exposing the Admin API (service name: `server`)  

   **Note**:
   - The `server` service endpoint is required to [deploy](../../installing/install-gateway/#remote-gateways) an {{site.data.reuse.egw}} by using the {{site.data.reuse.eem_name}} UI.
   - The `server` service endpoint also exposes the {{site.data.reuse.eem_name}} [Admin API](../../security/api-tokens/) on path `/admin`, and can be used for making API requests to {{site.data.reuse.eem_name}} programmatically. The Admin API URL is displayed on the [**Profile** page](../../security/api-tokens/#api-access-tokens).
   - The value that supplied in `host` for `name: server` must start with `eem.`
   
For each service endpoint, set the following values:
  - `name` is the name of the service: `ui`, `gateway`, `admin`, or `server` as applicable.
  - `host` is a DNS-resolvable hostname for accessing the named service.

For example:
```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  manager:
    endpoints:
      - name: ui
        host: my-eem-ui.mycluster.com
      - name: gateway
        host: my-eem-gateway.mycluster.com
      - name: admin
        host: my-eem-admin.mycluster.com
      - name: server
        host: eem.my-eem-server.mycluster.com
```


For the operator-managed {{site.data.reuse.egw}} instance, set the gateway endpoint host in the `spec.endpoints[]` section of your `EventGateway` custom resource, as shown in the following code snippet:


```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  endpoints:
    - name: gateway
      host: my-gateway.mycompany.com
# ... 
```

<!-- K8S deployment gateway users should be able to work it out, but it would be good to add a Kubernetes Deployment example here. This is NA for docker gateway btw. -->

### Ingress default settings
{: ingress-default-settings}

If you are not running on the {{site.data.reuse.openshift}}, the following ingress defaults are set unless overridden:

- `class`: The ingress class name is set by default to `nginx`. Set the `class` field on endpoints to use a different ingress class.

- `annotations`: The following annotations are set by default on generated ingress endpoints:

```yaml
  ingress.kubernetes.io/ssl-passthrough: 'true'
  nginx.ingress.kubernetes.io/backend-protocol: HTTPS
  nginx.ingress.kubernetes.io/ssl-passthrough: 'true'
```

If you specify a `spec.manager.tls.ui.secretName` on an `EventEndpointManagement` instance, the following reencrypt annotations are set on the `ui` ingress. Other ingresses are configured for pass-through.

```yaml
    nginx.ingress.kubernetes.io/backend-protocol: HTTPS
    nginx.ingress.kubernetes.io/configuration-snippet: proxy_ssl_name "<HOSTNAME>";
    nginx.ingress.kubernetes.io/proxy-ssl-protocols: TLSv1.3
    nginx.ingress.kubernetes.io/proxy-ssl-secret: <NAMESPACE>/<SECRETNAME>
    nginx.ingress.kubernetes.io/proxy-ssl-verify: 'on'
```

Ingress annotations can be overridden by specifying an alternative set of annotations on an endpoint. The following code snippet is an example of overriding the annotations set on an operator-managed `EventGateway` gateway endpoint ingress.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
  # ...
  endpoints:
    - name: gateway
      host: my-gateway.mycompany.com
      annotations:
        some.annotation.foo: "true"
        some.other.annotation: value
# ... 
```

<!-- K8S deployment gateway users should be able to work it out, but it would be good to add a Kubernetes Deployment example here. This is NA for docker gateway btw. -->

### Configuring external access to the operator-managed and Kubernetes Deployment {{site.data.reuse.egw}}
{: #configuring-external-access-to-the-operator-managed-event-gateway}

A Kafka client implementation might require access to at least one route or ingress for each broker that the client is expected to connect to. To present a route or an ingress, you can manually configure the number of routes that are associated with an operator-managed {{site.data.reuse.egw}} in the `EventGateway` custom resource or Kubernetes Deployment.

For example, you can set the number of routes in the `spec.maxNumKafkaBrokers` field of your `EventGateway` custom resource, as shown in the following code snippet:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  maxNumKafkaBrokers: 3
# ... 
```

<!-- K8S deployment gateway users should be able to work it out, but it would be good to add a Kubernetes Deployment example here. This is NA for docker gateway btw. -->

If `spec.maxNumKafkaBrokers` value is not provided, the default (`20`) is used. The value of the `spec.maxNumKafkaBrokers` must be greater than or equal to the total number of brokers managed by this {{site.data.reuse.egw}}.

### Configuring gateway security on the {{site.data.reuse.egw}}s
{: #configuring-gateway-security-on-operator-managed-event-gateways}

You can configure various settings that help protect the {{site.data.reuse.egw_short}} from uncontrolled resource consumption such as excessive memory usage, or connection exhaustion. Enable these features to help you ensure that the gateway remains available and responsive. 

For operator-managed gateways the following table lists the parameters that are available in the `EventGateway` custom resource in the `security` section. All parameters are optional. 

  | Parameter | Description | Default |
  | ------    | --------| ---------|
  | `spec.security.connection.closeDelayMs` | The minimum delay in milliseconds after you close a connection. This helps prevent spam. | 8000 |
  | `spec.security.connection.closeJitterMs` | Additional delay in milliseconds after you close a connection. This helps prevent attacks. | 4000 |
  | `spec.security.connection.perSubLimit` | The maximum allowed TCP connections for each subscription. | -1 (no limit) |
  | `spec.security.authentication.maxRetries` | The maximum number of failed authentication attempts after which further attempts are blocked. | -1 (no limit) |
  | `spec.security.authentication.retryBackoffMs` | The backoff time in milliseconds between consecutive failed authentication attempts. | 0 |
  | `spec.security.authentication.lockoutPeriod` | The duration in seconds while the account is locked after an unsuccessful authentication attempt. (-1 for permanent lockout) | 0 |
  | `spec.security.request.maxSizeBytes` | The maximum size allowed for the request payload in bytes. | -1 (no limit) |
{: caption="Table 1. Parameter description" caption-side="bottom"}

The default values for these parameters are shown in the following sample. A value of -1 represents no limit.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  security:
    connection:
      closeDelayMs: 8000
      closeJitterMs: 4000
      perSubLimit: -1
    authentication:
      maxRetries: -1
      retryBackoffMs: 0
      lockoutPeriod: 0
    request:
      maxSizeBytes: -1
# ... 
```

<!-- K8S deployment gateway users should be able to work it out, but it would be good to add a Kubernetes Deployment example here. -->

For the [Docker](../install-gateway#remote-gateways) gateway, the equivalent environment variable names are:

```
CONNECTION_CLOSE_DELAY_MS
CONNECTION_CLOSE_JITTER_MS
MAX_CONNECTIONS_PER_SUBSCRIPTION
AUTHN_MAX_RETRIES
AUTHN_BACKOFF_DELAY_INCREMENT_MILLIS
AUTHN_LOCKOUT_PERIOD_SECONDS
KAFKA_MAX_MESSAGE_LENGTH
```

<!-- might be better to combine these properties and their definitions in a single table that covers k8s, cr, and docker. As it stands the docker gateway user has to figure out what the equivalent cr property is to see the definition. -->


Add these properties as arguments to your Docker `run` command, for example: `docker run ... -e MAX_CONNECTIONS_PER_SUBSCRIPTION=10 ...`


## Exporting metrics with OpenTelemetry 
{: #exporting-metrics-with-opentelemetry}

To configure an {{site.data.reuse.eem_manager}} or {{site.data.reuse.egw}} instance to emit metrics, you configure the `openTelemetry` section on the associated custom resource or Kubernetes Deployment. On [Docker](../install-gateway#remote-gateways) gateways, set the OpenTelemetry properties as arguments in your Docker `run` command, for example: `-e <property name>`.

 - For {{site.data.reuse.eem_manager}} instances, you can configure OpenTelemetry in the `spec.manager.openTelemetry` section of the `EventEndpointManagement` custom resource.
- For operator-managed and [Kubernetes Deployment]((../install-gateway#remote-gateways)) {{site.data.reuse.egw}} instances, you can configure OpenTelemetry in the `spec.openTelemetry` section of the `EventGateway` custom resource or Kubernetes Deployment.  

    ```yaml
      openTelemetry:
        endpoint: 'https://my.collector.endpoint:4317'
        protocol: grpc
        interval: 30000
        tls:
          secretName: my-mtls-secret
          clientKey: tls.key
          clientCertificate: tls.crt 
          trustedCertificate:
            secretName: my-collector-endpoint-ca-secret
            certificate: ca.crt
        instrumentations:
          - name: netty
            enabled: true
          - name: runtime-telemetry
            enabled: true
    ```

    Where:

    `endpoint`: The server endpoint where the OpenTelemetry data is sent. This is a required property when you configure the OpenTelemetry section and the specified endpoint must include the protocol, `http://` or `https://`.

    `protocol`: The communication protocol to use for communicating to the endpoint. Example values are `grpc` and `http/protobuf`, the default value is `grpc`.

    `interval`: The interval in milliseconds between the start of two export attempts. The default value is 30000, which indicates that metrics export at 30-second intervals.

    `tls.secretName`: A secret that contains the client's certificates to use for mutualTLS (mTLS).

    `tls.clientKey`: The key in the secret that holds the encoded client key, for example `tls.key`. The certificate must be created with PKCS8 encoding.

    `tls.clientCertificate`: The key in the secret that holds the PKCS8 encoded client certificate/chain, for example `tls.crt`. The certificate must be created with PKCS8 encoding.

    `tls.trustedCertificate.secretName`: A secret that contains a CA certificate to trust to verify the endpoint server's certificate.

    `tls.trustedCertificate.certificate`: The key in the secret that holds the CA certificate to trust, for example `ca.crt`.

    `instrumentations`: Here you can define additional instrumentations to enable. {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} metrics are enabled by default when OpenTelemetry is enabled.

      - `name`: An instrumentation name. This name is then added into an environment variable of the format `OTEL_INSTRUMENTATION_[NAME]_ENABLED`, for a list of instrumentation names, see [Suppressing specific instrumentation](https://opentelemetry.io/docs/zero-code/java/agent/disable/#suppressing-specific-agent-instrumentation){:target="_blank"}.  You do not need to specify the environment variable, only the instrumentation name.

      - `enabled`: A boolean indicating whether to enable or disable the specified instrumentation.

- For [Docker](../install-gateway#remote-gateways) gateways, the OpenTelemetry properties are defined in `-e` arguments to the Docker `run` command: 

     ```
     OTEL_EXPORTER_OTLP_PROTOCOL
     OTEL_EXPORTER_OTLP_ENDPOINT
     OTEL_METRIC_EXPORT_INTERVAL
     OTEL_EXPORTER_OTLP_HEADERS
     OTEL_INSTRUMENTATION_[NAME]_ENABLED
     OTEL_EXPORTER_OTLP_CLIENT_KEY
     OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE
     OTEL_EXPORTER_OTLP_CERTIFICATE
     ```

     To enable OpenTelemetry on the Docker gateway, you must also set these arguments:

     ```
     OTEL_LOGS_EXPORTER="none"
     OTEL_TRACES_EXPORTER="none"
     IBM_JAVA_OPTIONS="-javaagent:/opt/ibm/eim-backend/lib/opentelemetry-javaagent.jar"
     ```

<!-- might be better to combine these properties and their definitions in a single table that covers k8s, cr, and docker. As it stands the docker gateway user has to figure out what the equivalent cr property is to see the definition. -->

See [the metrics reference](../../reference/metrics-reference) to find out more about the metrics that are emitted.

OpenTelemetry is disabled by default. When it is enabled, all agent instrumentation other than {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} remains disabled unless individually enabled. Further customization is possible with environment variables:


The following additional OpenTelemetry metric environment variables are set by default:

- `OTEL_SERVICE_NAME = "EEM Manager - <EventEndpointManagement instance name>"`
- `OTEL_SERVICE_NAME = "EEM Gateway - <EventGateway gateway-group-name/gateway-group-id>"`

If you want to add additional configuration for the OpenTelemetry agent, then you can [add environment variables](#setting-environment-variables) to the custom resource.


### Example: Exporting metrics from an {{site.data.reuse.eem_manager}}

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    openTelemetry:
      endpoint: 'https://some.collector.endpoint:4317'
      tls:
        trustedCertificate:
          secretName: mysecret
          certificate: ca.crt
# ... 
```

### Example: Exporting metrics from an {{site.data.reuse.egw}}

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  openTelemetry:
    endpoint: 'https://some.collector.endpoint:4317'
    tls:
      trustedCertificate:
        secretName: mysecret
        certificate: ca.crt
# ... 
```

### Example: Adding additional OpenTelemetry exporter environment variables on an {{site.data.reuse.eem_manager}}

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    openTelemetry:
      endpoint: 'https://some.collector.endpoint:4317'
      tls:
        trustedCertificate:
          secretName: mysecret
          certificate: ca.crt
    template:
        pod:
          spec:
            containers:
              - env:
                  - name: OTEL_EXPORTER_OTLP_HEADERS
                    value: "api-key=key,other-config-value=value"
# ... 
```
