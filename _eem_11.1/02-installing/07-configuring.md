---
title: "Configuring"
excerpt: "Configure your Event Endpoint Management Installation."
categories: installing
slug: configuring
toc: true
---

## Setting environment variables

You can configure {{site.data.reuse.eem_name}} or {{site.data.reuse.egw}} by setting environment variables. This is done by providing a template override(`env`) which specifies one or more name-value pairs.

The format for {{site.data.reuse.eem_name}} instances is:

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

The format for {{site.data.reuse.egw}} instances is:

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

To persist the data input into an {{site.data.reuse.eem_name}} instance, configure persistent storage in your `EventEndpointManagement` configuration.

To enable persistent storage for `EventEndpointManagement` , set `spec.manager.storage.type` to `persistent-claim`, and then configure the storage in one of the following ways:

- [dynamic provisioning](#dynamic-provisioning)
- [providing persistent volume](#providing-persistent-volume)
- [providing persistent volume and persistent volume claim](#providing-persistent-volume-and-persistent-volume-claim).

Ensure that you have sufficient disk space for persistent storage.

**Note:** `spec.manager.storage.type` can also be set to `ephemeral`, although no persistence is provisioned with this configuration. This is not recommended for production usage because it results in lost data.

### Dynamic provisioning

If there is a [dynamic storage provisioner](https://docs.openshift.com/container-platform/4.14/storage/dynamic-provisioning.html) present on the system, you can use the dynamic storage provisioner to dynamically provision the persistence for {{site.data.reuse.eem_name}}.
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

- Optionally, specify the storage size in `storage.size` (for example, `"100Gi"`).
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt"`).
- Optionally, specify the retention setting for the storage if the instance is deleted in `storage.deleteClaim` (for example, `"true"`).

### Providing persistent volumes

Before installing {{site.data.reuse.eem_name}}, you can create a persistent volume for it to use as storage.
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

- Optionally, specify the storage size in `storage.size` (for example, `"100Gi"`).
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt"`).
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

TLS can be configured for the `EventEndpointManagement` instance in one of the following ways:

- [Operator configured CA certificate](#operator-configured-ca-certificate)
- [User provided CA certificate](#user-provided-ca-certificate)
- [User provided certificates](#user-provided-certificates)
- [User provided UI certificates](#user-provided-ui-certificates)

After the TLS is configured for the `EventEndpointManagement` instance, the TLS for the `EventGateway` instance must be configured. TLS can be configured for the `EventGateway` instance in one of the following ways:

- [Using CA certificate for `EventGateway`](#using-ca-certificate-for-eventgateway)
- [User provided certificate for `EventGateway`](#user-provided-certificate-for-eventgateway)

### Operator configured CA certificate

By default, the operator configures TLS if no value is provided for CA certificate when creating the instance. The operator uses the Cert Manager installed on the system to generate a CA certificate with a self-signed issuer. It then uses this self-signed CA certificate to sign the certificates used for secure communication by the {{site.data.reuse.eem_name}} instance. Cert Manager puts the CA certificate into a secret named `<my-instance>-ibm-eem-manager-ca`. This secret can be used for configuring the `EventGateway` TLS communications.

Cert Manager and {{site.data.reuse.eem_name}} will create the following objects:


- Cert Manager Issuers:

  - `<my-instance>-ibm-eem-manager`
  - `<my-instance>-ibm-eem-manager-selfsigned`

- Cert Manager Certificates:

  - `<my-instance>-ibm-eem-manager-ca`
  - `<my-instance>-ibm-eem-manager`

The following code snippet is an example of a configuration where all certificates are created by Cert Manager and {{site.data.reuse.eem_name}}:

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

You can provide a custom CA certificate to the {{site.data.reuse.eem_name}} instance.

The operator uses the Cert Manager installed on the system to create the certificates used for secure communication by the {{site.data.reuse.eem_name}} instance. The certificates are signed by using the provided CA certificate.

The CA secret that is created and referenced in the Cert Manager must contain the keys `ca.crt`, `tls.crt`, `tls.key`. The `ca.crt` key and the `tls.crt` key can have the same value.

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

### User-provided certificates

You can use a custom certificate for secure communication by the {{site.data.reuse.eem_name}} instance. You can use the OpenSSL tool to generate a CA and certificates that are required for an {{site.data.reuse.eem_name}} instance.

**Note:** The `envsubst` utility is available on Linux and can be installed by default as part of the `gettext` package.

See the following example for setting up OpenSSL tool to generate a CA and Certificate required for an {{site.data.reuse.eem_name}} instance:

1. If you are using a MAC, the following packages are required and can be installed by using `HomeBrew`:

   - gettext
   - openssl@3

   ```shell
   brew install gettext openssl@3
   ```

   Then run `alias openssl=$(brew --prefix)/opt/openssl@3/bin/openssl` to use Openssl3.

2. Set the following variables on your workstation:

   ```shell
   EMAIL=<email address>
   MANAGER_NAME=<my_instance>
   CLUSTER_API=<cluster api>
   NAMESPACE=<eem installation namespace>
   ```

   Where:

   - MANAGER_NAME is the name of the {{site.data.reuse.eem_name}} instance
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
   CN = ${MANAGER_NAME}-ibm-eem-svc

   [req_ext]
   subjectAltName = @alt_names

   [alt_names]
   DNS.1 = ${MANAGER_NAME}-ibm-eem-svc
   DNS.2 = ${MANAGER_NAME}-ibm-eem-svc.{NAMESPACE}
   DNS.3 = ${MANAGER_NAME}-ibm-eem-svc.{NAMESPACE}.svc
   DNS.4 = ${MANAGER_NAME}-ibm-eem-svc.{NAMESPACE}.svc.cluster.local
   DNS.5 = ${MANAGER_NAME}-ibm-eem-apic-{NAMESPACE}.${CLUSTER_API}
   DNS.6 = ${MANAGER_NAME}-ibm-eem-gateway-{NAMESPACE}.${CLUSTER_API}
   DNS.7 = ${MANAGER_NAME}-ibm-eem-manager-{NAMESPACE}.${CLUSTER_API}
   DNS.8 = ${MANAGER_NAME}-ibm-eem-admin-{NAMESPACE}.${CLUSTER_API}
   ```

    **Important:** If you are planning to do any of the following for your deployment, ensure you modify the `[alt_names]` section in the previous example to include the {{site.data.reuse.eem_manager}} `ui`, `gateway`, `admin` (for the Admin API), and, if integration with IBM API Connect is required, the `apic` endpoint hostnames:
    - You are planning to specify hostnames in the `EventEndpointManagement` custom resource under `spec.manager.endpoints`.
    - You are planning to create additional routes or ingress.
    - You are not running on {{site.data.reuse.openshift_short}}


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
     openssl genrsa -out my-eem-manager.key 4096
     ```

   - `manager csr`:

     ```shell
     openssl req -new -key ${MANAGER_NAME}.key -out ${MANAGER_NAME}.csr -config <(envsubst < ${MANAGER_NAME}_answer.txt )
     ```

6. Sign the `csr` to create the `manager crt` by running the following command:

   ```shell
   openssl x509 -req -in ${MANAGER_NAME}.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out ${MANAGER_NAME}.crt -days 730 -extensions 'req_ext' -extfile <(envsubst < ${MANAGER_NAME}_answer.txt)
   ```

7. Verify the certificate by running the following command:

   ```shell
   openssl verify -CAfile ca.crt ${MANAGER_NAME}.crt
   ```

8. Create Secret on the cluster by running the following command:

   **Note:** The Secret must be added to the namespace that the {{site.data.reuse.eem_name}} instance is intended to be created in.

   ```shell
   kubectl create secret generic ${MANAGER_NAME}-cert --from-file=ca.crt=ca.crt --from-file=tls.crt=${MANAGER_NAME}.crt --from-file=tls.key=${MANAGER_NAME}.key -n ${NAMESPACE}
   ```

9. Create an {{site.data.reuse.eem_name}} instance and set the `spec.manager.tls.secretName` to the name of the created certificate.

   ```yaml
   apiVersion: events.ibm.com/v1beta1
   kind: EventEndpointManagement
   # ...
   spec:
     license:
       # ...
     manager:
       tls:
         secretName: my-eem-manager-cert
   # ...
   ```

### User-provided UI certificates

A separate custom certificate can be used for the UI. This certificate is presented to the browser when the {{site.data.reuse.eem_name}} user interface is navigated.
To supply a custom certificate to the UI set `spec.manager.tls.ui.secretName` to be the name of the secret containing the certificate.

The following code snippet is an example of a configuration that uses a user-provided certificate:

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
# ...
```

If running on the {{site.data.reuse.openshift}}:

- Optionally, specify the key in the secret that is pointing to the CA certificate `ui.caCertificate` (default, `ca.crt`).
- Optionally, specify the key in the secret that is pointing to the server certificate `ui.serverCertificate` (default, `tls.crt`).
- Optionally, specify the key in the secret that is pointing to the private key `ui.key` (default, `tls.key`).

### Using CA certificate for `EventGateway`

A CA certificate can be used to securely connect an `EventGateway` instance to an `EventEndpointManagement` instance.
To use a CA certificate in the `EventGateway` configuration, set `spec.tls.caSecretName` to be the name of the secret that contains the CA certificate.
The CA certificate that is provided is used to sign the leaf certificates that are used by the `EventGateway` instance for secure communication.
The CA certificate that is provided for the `EventGateway` instance should be the same CA certificate that is provided when configuring the TLS for the `EventEndpointManagement` instance.

The following code snippet is an example of an `EventGateway` configuration that uses a user-provided CA certificate:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  tls:
    caSecretName: <my-instance>-ibm-eem-manager-ca
# ...
```

### User-provided certificate for `EventGateway`

A custom certificate can be used for secure communication by the {{site.data.reuse.eem_name}} instance.
This method does not use Cert Manager so the certificates that are provided must be managed by the user.
To use a custom certificate set `spec.tls.secretName` to be the name of the secret that contains a CA certificate, server certificate, and a key that has the required DNS names for accessing the manager.

The following code snippet is an example of an `EventGateway` configuration that uses a user-provided certificate:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  tls:
    secretName: mySecret
# ...
```

If running on the {{site.data.reuse.openshift}}:

- Optionally, specify the key in the secret that is pointing to the CA certificate `tls.caCertificate` (default, `ca.crt`).
- Optionally, specify the key in the secret that is pointing to the server certificate `tls.serverCertificate` (default, `tls.crt`).
- Optionally, specify the key in the secret that is pointing to the private key `tls.key` (default, `tls.key`).

When a custom certificate is used for the `EventEndpointManagement` instance and the `EventGateway` instance in this way, it is required that each instance trusts the certificates of the other. To ensure an instance trusts another, the certificates that are provided to the configuration of one instance must be added to the list of `tls.trustedCertificates` on the other instance.
The following code snippet is an example configuration that uses custom certificates for the `EventEndpointManagement` instance and the `EventGateway` instance.

**Note:** The `EventEndpointManagement` instance uses the secret `myManagementCert` and `trustedCertificates` secret is `myGatewayCert`, whereas the `EventGateway` instance uses the `myGatewayCert` secret and trusts the `myManagementCert` secret.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    tls:
      secretName: myManagementCert
      caCertificate: ca.crt
      serverCertificate: tls.crt
      key: tls.key
      trustedCertificates:
        - secretName: myGatewayCert
          certificate: ca.crt
# ...
---
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  tls:
    secretName: myGatewayCert
    caCertificate: ca.crt
    serverCertificate: tls.crt
    key: tls.key
    trustedCertificates:
      - secretName: myManagementCert
        certificate: ca.crt
# ...
```

## Configuring authentication

Authentication is configured in the `EventEndpointManagement` configuration.

Two types of authentication are available: LOCAL and OIDC. For more information, see [managing access](../../security/managing-access).

## Deploy network policies

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

If running on the {{site.data.reuse.openshift}}, routes are automatically configured to provide external access.
You can optionally set a host for each exposed route on your {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} instances by setting values under `spec.manager.endpoints[]` in your `EventEndpointManagement` custom resource, and under `spec.endpoints[]` in your `EventGateway` custom resource.

If you are running on other Kubernetes platforms, the {{site.data.reuse.eem_name}} operator will create ingress resources to provide external access. No default hostnames will be assigned to the ingress resource, and you must set hostnames for each exposed endpoint defined for the {{site.data.reuse.eem_name}} and {{site.data.reuse.egw}} instances.

For the {{site.data.reuse.eem_name}} instance, the `spec.manager.endpoints[]` section of your `EventEndpointManagement` custom resource must contain entries for the following service endpoints:

- The {{site.data.reuse.eem_name}} UI (service name: `ui`)
- The {{site.data.reuse.egw}} (service name: `gateway`)
- The {{site.data.reuse.eem_name}} [Admin API](../../security/api-tokens/) (service name: `admin`)
   
For each service endpoint, set the following values:
  - `name` is the name of the service: `ui`, `gateway`, or `admin` as applicable.
  - `host` is a DNS-resolvable hostname for accessing the named service.
  - `type` is an optional field only applicable to the `admin` endpoint to control the network exposure and availability of the Admin API. The value can be either `disabled`, `internal`, or `external`. The default is `external`, even if not specified, which makes the API available from outside the cluster. If you want to limit access to the API only from within the cluster's internal network, set type as `internal`.
  
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
        type: external
```

For the {{site.data.reuse.egw}} instance, set the gateway endpoint host in the `spec.endpoints[]` section of your `EventGateway` custom resource, as shown in the following code snippet:

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

### Ingress default settings

If you are not running on the {{site.data.reuse.openshift}}, the following ingress defaults are set unless overridden:

- `class`: The ingress class name is set by default to `nginx`. Set the `class` field on endpoints to use a different ingress class.

- `annotations`: The following annotations are set by default on generated ingress endpoints:

```yaml
  ingress.kubernetes.io/ssl-passthrough: 'true'
  nginx.ingress.kubernetes.io/backend-protocol: HTTPS
  nginx.ingress.kubernetes.io/ssl-passthrough: 'true'
```

If you specify a `spec.manager.tls.ui.secretName` on an `EventEndpointManagement` instance, the following re-encrypt annotations will be set on the `ui` ingress.  Other ingresses will be configured for passthrough.

```yaml
    nginx.ingress.kubernetes.io/backend-protocol: HTTPS
    nginx.ingress.kubernetes.io/configuration-snippet: proxy_ssl_name "<HOSTNAME>";
    nginx.ingress.kubernetes.io/proxy-ssl-protocols: TLSv1.3
    nginx.ingress.kubernetes.io/proxy-ssl-secret: <NAMESPACE>/<SECRETNAME>
    nginx.ingress.kubernetes.io/proxy-ssl-verify: 'on'
```

Ingress annotations can be overridden by specifying an alternative set of annotations on an endpoint. The following code snippet is an example of overriding the annotations set on an `EventGateway` gateway endpoint ingress.

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
