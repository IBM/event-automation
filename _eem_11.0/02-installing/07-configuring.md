---
title: "Configuring"
excerpt: "Configure your Event Endpoint Management Installation."
categories: installing
slug: configuring
toc: true
---

## Setting environment variables

You can configure {{site.data.reuse.eem_name}} or Event Gateway by setting environment variables. This is done by providing a template override(`env`) which specifies one or more name-value pairs.

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

The format for Event Gateway instances is:

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


For example, to enable trace logging in the Manager:

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

To persist the data input into a {{site.data.reuse.eem_name}} instance, configure persistent storage in your `EventEndpointManagement` configuration.

To enable persistent storage for `EventEndpointManagement` , set `spec.manager.storage.type` to `persistent-claim`, and then configure the storage in one of the following ways:

- [dynamic provisioning](#Dynamic-provisioning)
- [providing persistent volume](#Providing-persistent-volume)
- [providing persistent volume and persistent volume claim](#Providing-persistent-volume-and-persistent-volume-claim).

Ensure that you have sufficient disk space for persistent storage.

**Note:** `spec.manager.storage.type` can also be set to `ephemeral`, although no persistence is provisioned with this configuration. This is not recommended for production usage because it results in lost data.

### Dynamic provisioning

If there is a [dynamic storage provisioner](https://docs.openshift.com/container-platform/4.12/storage/dynamic-provisioning.html) present on the system, you can use the dynamic storage provisioner to dynamically provision the persistence for {{site.data.reuse.eem_name}}.
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

- Optionally, specify the storage size in `storage.size` (for example, `"100GiB"`).
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt"`).
- Optionally, specify the retention setting for the storage if the instance is deleted in `storage.deleteClaim` (for example, `"true"`).

### Providing persistent volume

Before installing  {{site.data.reuse.eem_name}}, you can create a persistent volume for it to use as storage.
To use a persistent volume, set the `spec.manager.storage.selectors` to match the labels on the persistent volume created before installing  {{site.data.reuse.eem_name}}.
The following example creates a persistent volume claim to bind to a persistent volume with the label `precreated-persistence: my-pv`.
Multiple labels can be added as selectors and the persistent volume must have all labels present to match.

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
# ...

```

- Optionally, specify the storage size in `storage.size` (for example, `"100GiB"`).
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
      existingClaimName: 
# ...
```

## Configuring TLS

TLS can be configured for the `EventEndpointManagement` instance in one of the following ways:

- [Operator configured CA certificate](#Operator-configured-CA-certificate)
- [User provided CA certificate](#User-provided-CA-certificate)
- [User provided certificates](#User-provided-certificates)
- [User provided UI certificates](#User-provided-UI-certificates)

After the TLS is configured for the `EventEndpointManagement` instance, the TLS for the `EventGateway` instance must be configured. TLS can be configured for the `EventGateway` instance in one of the following ways:

- [Using CA certificate](#Operator-configured-CA-certificate)
- [User provided certificate for EventGateway](#User-provided-CA-certificate-for-EventGateway)

### Operator configured CA certificate

By default, the operator configures TLS if no value is provided for CA certificate.
The operator uses the IBM Cert Manager installed on the system to generate a CA certificate with a self-signed issuer. It then uses this self-signed CA certificate to sign the certificates used for secure communication by the {{site.data.reuse.eem_name}} instance.
IBM Cert Manager puts the CA certificate into a secret named `<my-instance>-ibm-eem-manager-ca`. This secret can be used for configuring the `EventGateway` TLS communications.

### User-provided CA certificate

A custom CA certificate can be provided to the {{site.data.reuse.eem_name}} instance.
The operator uses the IBM Cert Manager installed on the system to use this provided CA certificate to sign the certificates used for secure communication by the {{site.data.reuse.eem_name}} instance.
To provide a custom CA certificate, set `spec.manager.tls.caSecretName` to the name of the secret that contains the CA certificate.

The following code snippet is an example of a configuration that uses a user provided CA certificate:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    tls:
      caSecretName: myCASecret
# ...
```

**Note:** The secret that is referenced here must contain the keys `ca.crt`, `tls.crt`, `tls.key`. The `ca.crt` key and the `tls.crt` key can have the same value.

### User-provided certificates

A custom certificate can be used for secure communication by the {{site.data.reuse.eem_name}} instance.
This method does not use the IBM Certificate Manager so the certificates that are provided must be managed by the user.
To use a custom certificate, set `spec.manager.tls.secretName` to the name of the secret that contains a CA certificate, server certificate, and a key that has the required DNS names for accessing the {{site.data.reuse.eem_manager}}.

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
      secretName: mySecret
# ...
```

- Optionally, specify the key in the secret that is pointing to the CA certificate `tls.caCertificate` (default, `ca.crt`).
- Optionally, specify the key in the secret that is pointing to the server certificate `tls.serverCertificate` (default, `tls.crt`).
- Optionally, specify the key in the secret that is pointing to the private key `tls.key` (default, `tls.key`).


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

- Optionally, specify the key in the secret that is pointing to the CA certificate `ui.caCertificate` (default, `ca.crt`).
- Optionally, specify the key in the secret that is pointing to the server certificate `ui.serverCertificate` (default, `tls.crt`).
- Optionally, specify the key in the secret that is pointing to the private key `ui.key` (default, `tls.key`).

### Using CA certificate

A CA certificate can be used to securely connect a `EventGateway` instance to an `EventEndpointManagement` instance.
To use a CA certificate in the `EventGateway` configuration, set `spec.tls.caSecretName` to be the name of the secret that contains the CA certificate.
The CA certificate that is provided is used to sign the leaf certificates that are used by the `EventGateway instance` for secure communication.
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

### User-provided certificate for EventGateway

A custom certificate can be used for secure communication by the {{site.data.reuse.eem_name}} instance.
This method does not use the IBM Certificate Manager so the certificates that are provided must be managed by the user.
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
