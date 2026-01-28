---
title: "Configuring TLS"
excerpt: "Manage the TLS certificates that are used to secure communication to and between your Event Endpoint Management components."
categories: security
slug: config-tls
toc: true
---

{{site.data.reuse.eem_name}} uses TLS to secure all network communication between the {{site.data.reuse.eem_name}} components and Kafka clients and clusters.

All {{site.data.reuse.eem_manager}} endpoints are secured by the `<instance name>-ibm-eem-manager` certificate. UI and admin API users see this certificate when they connect to the {{site.data.reuse.eem_manager}}. If you want to replace `<instance name>-ibm-eem-manager` with your own certificate, then you must supply this certificate during installation. 

The {{site.data.reuse.egw}}s secure their endpoint with the `<gateway group>-<gateway name>-ibm-egw-cert` certificate. Kafka client applications see this certificate when they connect to the {{site.data.reuse.egw}}. You configure this certificate when you install the {{site.data.reuse.egw}}.

The certificates used to secure mTLS [security controls](../../describe/security-option-controls) are configured in the {{site.data.reuse.eem_name}} UI. For more information, see [Managing mTLS control certificates](../cred-sets#config-mtls).

The certificates used to secure communication between the {{site.data.reuse.eem_name}} and Kafka clusters are configured in the {{site.data.reuse.eem_name}} UI. See [adding the cluster](../../administering/managing-clusters).



## Key points
{: #key-points}

- [Cert-manager](https://cert-manager.io/docs/) is used to create and maintain the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} endpoint certificates. If you require the use of your own organization's certificates, then you can override the default cert-manager certificates during [installation](../../installing/planning). <!-- NOTE: not currently as simple as this for egw cert, user must do extra steps for cert-manager to create egw cert, but no need to go into this here. -->
- {{site.data.reuse.eem_name}} TLS certificates are stored in Kubernetes Secrets.
- The Certificate objects that cert-manager creates contain pointers to a Kubernetes Secret (of the same name) that contains the actual X.509 certificate strings. 
- Cert-manager monitors and renews all the certificates that it creates.
- You are responsible for monitoring and renewing any custom certificates that you provide.
- Your certificates must be included in your [back up](../../installing/backup-restore). They are required for disaster recovery.


The following table lists the secrets that contain the TLS certificates that secure your {{site.data.reuse.eem_name}} endpoints:

| Secret name | Description |
| --- | --- |
| `<gateway group>-<gateway name>-ibm-egw-cert` | Server certificate that secures the {{site.data.reuse.egw}} endpoint (the certificate that Kafka clients see when they contact the gateway).
| `<gateway group>-<gateway name>-certs` | CA certificate for the {{site.data.reuse.egw}} endpoint. Signs the `<gateway group>-<gateway name>-ibm-egw-cert`. |
| `<instance name>-ibm-eem-manager` | Server certificate of the {{site.data.reuse.eem_manager}} (the certificate that UI and admin API users see when they connect to the {{site.data.reuse.eem_manager}}). |
| `<instance name>-ibm-eem-manager-ca` | CA certificate for `<instance name>-ibm-eem-manager`. |

<!-- DRAFT COMMENT: In this table we should add the hard requirements for these certs, such as DNS altnames and Common name.-->


## Default {{site.data.reuse.eem_manager}} TLS configuration
{: #default-tls-config}

If you do not specify any custom certificates when you install your {{site.data.reuse.eem_manager}} instance, then the {{site.data.reuse.eem_name}} operator uses cert-manager to generate a CA certificate with a self-signed issuer. The operator uses this self-signed CA certificate to generate the leaf certificate that secures your {{site.data.reuse.eem_manager}} endpoints. Cert-manager stores the CA certificate in a secret called `<my-instance>-ibm-eem-manager-ca`. 

Cert-manager and the {{site.data.reuse.eem_name}} operator create the following objects in the {{site.data.reuse.eem_manager}} namespace:

- Issuers:

  - `<my-instance>-ibm-eem-manager`
  - `<my-instance>-ibm-eem-manager-selfsigned`

- Certificates:

  - `<my-instance>-ibm-eem-manager-ca`
  - `<my-instance>-ibm-eem-manager`

- Secrets:

  - `<my-instance>-ibm-eem-manager-ca`
  - `<my-instance>-ibm-eem-manager`


## Certificate customization options
{: #customize-options}

If you want to customize your {{site.data.reuse.eem_manager}} certificates, you have the following options:

1. Customize only the [UI endpoint](#custom-ui-certs) certificate. This is the certificate that {{site.data.reuse.eem_name}} UI user's browser sees when it connects to the UI. If the user's browser does not trust this certificate, then the browser presents a warning to the user. 
2. Customize the {{site.data.reuse.eem_manager}} [CA certificate](#custom-ca-certificate-manager). The {{site.data.reuse.eem_name}} operator uses the custom CA certificate to sign the endpoint server certificate that it creates. 
3. Customize the {{site.data.reuse.eem_manager}} endpoint [server certificate](#custom-ca-and-leaf).

These options are mutually exclusive.

<!-- DRAFT COMMENT: not sure if true, might be possible to use option 1 with either 2 or 3, but would need testing and confirmation. -->

## Custom UI certificate
{: #custom-ui-certs}

A separate custom certificate can be configured for the UI endpoint. This certificate is presented to the browser when a user accesses the {{site.data.reuse.eem_name}} UI.
To supply a custom certificate to the UI, follow these steps:

1. Ensure that you have the certificate files `tls.crt`, `ca.crt`, and `tls.key` in PEM format, and that the Subject Alternative Name (SAN) in `tls.crt` includes your UI endpoint. <!-- COMMENT: SAN is not essential here, but user might get browser warning when accessing UI without it. -->
2. Create a Kubernetes secret from your certificate files:

   ```shell
   kubectl -n <namespace> create secret generic custom-ui-cert-secret --from-file=ca.crt=ca.crt --from-file=tls.crt=tls.crt --from-file=tls.key=tls.key
   ```   
3. Set `spec.manager.tls.ui.secretName` to `custom-ui-cert-secret`.
4. Set `spec.manager.tls.trustedCertificates` to include the `custom-ui-cert-secret` CA certificate. 
5. If you are updating an existing {{site.data.reuse.eem_name}} instance, then confirm that the manager pod restarts. 

### Example custom UI certificate configuration:
{: #example-ui-cert}

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
        secretName: custom-ui-cert-secret
      trustedCertificates:
        - secretName: custom-ui-cert-secret
          certificate: ca.crt
# ...
```

**Note:** On {{site.data.reuse.openshift}}, if you already have a Kubernetes secret that you want to use for your UI endpoint, and it does not use the property names `ca.crt`, `tls.crt`, and `tls.key` to store the certificate strings (for example: `data.ca_cert.crt` instead of `data.ca.crt`), then complete the following additional steps:

1. Edit your {{site.data.reuse.eem_manager}} custom resource.
2. Specify the property names that are used in your UI endpoint secret as shown: 

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
           # ...
           caCertificate: "ca_cert.crt"
           serverCertificate: "server_cert.crt"
           key: "private_key.key"
   # ...
   ```

## Custom CA certificate for {{site.data.reuse.eem_manager}}
{: #custom-ca-certificate-manager}

You can provide your own custom CA certificate to the {{site.data.reuse.eem_manager}} instance. Cert-manager then uses the custom CA certificate to generate the server certificate that secures your {{site.data.reuse.eem_manager}} endpoints.

To configure {{site.data.reuse.eem_manager}} to use your custom CA certificate, complete the following steps:

1. Ensure that you have the `ca.crt` and `tls.key` files for your CA certificate in PEM format. 
2. Create a Kubernetes secret called `custom-ca-secret` that contains your CA certificate files:

   ```shell
   kubectl -n <namespace> create secret generic custom-ca-secret --from-file=ca.crt=ca.crt --from-file=tls.crt=ca.crt --from-file=tls.key=tls.key
   ```
<!-- COMMENT: No, 'tls.crt=ca.crt' is not a mistake: "cert-manager will create CA certs with both ca.crt and tls.crt and they will have the same value. It they have different values then that will not be a CA cert." -->

3. Edit your {{site.data.reuse.eem_manager}} custom resource and set `spec.manager.tls.caSecretName` to `custom-ca-secret`.
4. {: #custom-ca-recreate-leaf}If you are updating an existing {{site.data.reuse.eem_name}} instance, then follow these extra steps: <!-- IMPORTANT: This step is referenced in troubleshooting -->

   a. Regenerate the endpoint server certificate so that it is re-created as signed-by `custom-ca-secret`:

   ```shell
   kubectl -n <namespace> delete secret <instance name>-ibm-eem-manager
   ```
   b. Restart the {{site.data.reuse.eem_manager}} pod:

   ```shell
   kubectl -n <namespace> delete <manager pod name>
   ```

   c. If your {{site.data.reuse.eem_manager}} instance has any registered {{site.data.reuse.egw}}s, then update the {{site.data.reuse.egw}} with the new {{site.data.reuse.eem_manager}} CA certificate. The {{site.data.reuse.eem_manager}} CA certificate is stored in the gateway's `BACKEND_CA_CERTIFICATES` environment variable. Where `BACKEND_CA_CERTIFICATES` is set depends on your gateway deployment type:
   
   - Operator-managed gateway: `spec.template.pod.spec.containers.env[BACKEND_CA_CERTIFICATES]`.
   - Kubernetes Deployment gateway: `spec.template.spec.containers.env[BACKEND_CA_CERTIFICATES]`.
   - Docker gateway: `-e BACKEND_CA_CERTIFICATES`.


## Custom server certificates for {{site.data.reuse.eem_manager}}
{: #custom-ca-and-leaf}

If you want to supply your own server certificate for all your {{site.data.reuse.eem_manager}} endpoints, then you can create a Kubernetes secret that contains your TLS certificate strings and configure your {{site.data.reuse.eem_manager}} to use this secret. 


### Subject Alternative Name (SAN) requirements
{: #san-requirements}

Subject Alternative Names (SANs) are extensions to X.509 digital certificates that allow multiple domain names, IP addresses, or other identifiers to be associated with a single TLS certificate.

The certificate that secures your {{site.data.reuse.eem_manager}} must include your endpoints as SAN entries.

On {{site.data.reuse.openshift_short}}, your SANs must include the following entries:
```
<instance name>-ibm-eem-manager.<namespace>.svc.cluster.local # Required for local authentication only.
<instance name>-ibm-eem-apic-<namespace>.<cluster api>
<instance name>-ibm-eem-gateway-<namespace>.<cluster api>
<instance name>-ibm-eem-manager-<namespace>.<cluster api>
<instance name>-ibm-eem-admin-<namespace>.<cluster api>
eem.<instance name>-ibm-eem-server-<namespace>.<cluster api>
```
Where:
- `<instance name>` is the name of the {{site.data.reuse.eem_manager}} instance.
- `<namespace>` is the namespace of your {{site.data.reuse.eem_manager}} instance.
- `<cluster api> `is derived from the URL of your {{site.data.reuse.openshift_short}} cluster. If the URL is `https://console-openshift-console.apps.clusterapi.example.com/` then `<cluster api>` is `apps.clusterapi.example.com`.

On other Kubernetes platforms, your SANs must include the [service endpoints](../../installing/configuring/#configuring-ingress) that you define during installation.

Additional points to consider:

- Include any additional routes or ingresses to your {{site.data.reuse.eem_manager}} that you create.
- If you plan to [integrate with {{site.data.reuse.apic_long}}](../../api-and-event-management/overview), then include the `apic` endpoint hostnames.
- Wildcard SAN entries are supported. 
- If you use [LOCAL](../../security/managing-access#setting-up-local-authentication) authentication, then include a SAN entry for the local cluster network.

#### Example SAN entries for {{site.data.reuse.openshift_short}}
{: #ocp-example-sans}

When you use [LOCAL](../managing-access#setting-up-local-authentication) authentication with the {{site.data.reuse.eem_manager}}, the required SAN entries are as follows:

```yaml
spec:
  dnsNames:
    - '*.<NAMESPACE>.svc.cluster.local'
    - '*.<CLUSTER_API>'
    - eem.*.<CLUSTER_API>'
```

When you use [OIDC](../managing-access#setting-up-openid-connect-oidc-based-authentication) authentication with the {{site.data.reuse.eem_manager}}, the required SAN entries are as follows:

```yaml
spec:
  dnsNames:
    - '*.<CLUSTER_API>'
    - eem.*.<CLUSTER_API>'
```

### Configuring a custom {{site.data.reuse.eem_manager}} certificate
{: #config-custom-cert}

To configure a custom {{site.data.reuse.eem_manager}} server certificate, follow these steps:

1. Ensure that you have the `ca.crt`, `tls.crt`, and `tls.key` files for the certificate in PEM format. Your `tls.crt` must comply with the SAN [requirements](#san-requirements).

2. Create a Kubernetes secret that contains your TLS certificate strings by running the following command:

   ```shell
   kubectl -n <namespace> create secret generic custom-cert-secret --from-file=ca.crt=ca.crt --from-file=tls.crt=tls.crt --from-file=tls.key=tls.key
   ```

3. Edit your {{site.data.reuse.eem_manager}} custom resource and set `spec.manager.tls.secretName` to `custom-cert-secret`. If you are updating an existing deployment, then the {{site.data.reuse.eem_manager}} pod restarts. 

4. If your {{site.data.reuse.eem_manager}} instance has any registered {{site.data.reuse.egw}}s, then update the {{site.data.reuse.egw}} with the new {{site.data.reuse.eem_manager}} CA certificate. The {{site.data.reuse.eem_manager}} CA certificate is stored in the gateway's `BACKEND_CA_CERTIFICATES` environment variable. Where `BACKEND_CA_CERTIFICATES` is set depends on your gateway deployment type:
   
   - Operator-managed gateway: `spec.template.pod.spec.containers.env[BACKEND_CA_CERTIFICATES]`.
   - Kubernetes Deployment gateway: `spec.template.spec.containers.env[BACKEND_CA_CERTIFICATES]`.
   - Docker gateway: `-e BACKEND_CA_CERTIFICATES`. 


## Renewing certificates
{: #renew-certs}

The cert-manager automatically renews the certificates that it manages when they are approaching their expiration. Any custom certificates that you create you must monitor and renew manually. 

## Example OpenSSL commands to create TLS certificate files
{: #example-openssl}

The following examples show how to use [OpenSSL](https://www.openssl.org/){:target="_blank"} to generate TLS certificates that you can use in demonstration and test deployments of {{site.data.reuse.eem_name}}.

### Creating a CA certificate and key
{: #create-ca-crt-openssl}

You can create a CA certificate and key with the following OpenSSL commands:

```
openssl genrsa -out tls.key 2048
openssl req -new -x509 -key tls.key -days 730 -out ca.crt
```

### Creating a server certificate
{: #create-server-cert-openssl}

The following example uses OpenSSL and [gettext](https://www.gnu.org/software/gettext/){:target="_blank"} to generate a CA and server certificate for {{site.data.reuse.eem_manager}} on Red Hat OpenShift with [LOCAL user authentication](../../security/managing-access#setting-up-local-authentication).

1. Set the following environment variables:

   ```shell
   EMAIL=<email-address>
   MANAGER_NAME=<name-of-the-event-manager-instance>
   CLUSTER_API=<cluster-api>
   NAMESPACE=<event-endpoint-management-installation-namespace>
   ```

   Where:

   - MANAGER_NAME is the name of the {{site.data.reuse.eem_manager}} instance.
   - CLUSTER_API is the cluster URL that can be obtained from the cluster. If the URL is `https://console-openshift-console.apps.clusterapi.example.com/` then the CLUSTER_API must be set to `apps.clusterapi.example.com`.

2. Create a file called `csr_ca.txt` and paste in the following contents:

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

3. Create a file called `my-eem-manager_answer.txt` and paste in the following contents:

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
   DNS.4 = ${MANAGER_NAME}-ibm-eem-manager.${NAMESPACE}.svc.cluster.local
   DNS.5 = ${MANAGER_NAME}-ibm-eem-apic-${NAMESPACE}.${CLUSTER_API}
   DNS.6 = ${MANAGER_NAME}-ibm-eem-gateway-${NAMESPACE}.${CLUSTER_API}
   DNS.7 = ${MANAGER_NAME}-ibm-eem-manager-${NAMESPACE}.${CLUSTER_API}
   DNS.8 = ${MANAGER_NAME}-ibm-eem-admin-${NAMESPACE}.${CLUSTER_API}
   DNS.9 = eem.${MANAGER_NAME}-ibm-eem-server-${NAMESPACE}.${CLUSTER_API}
   ```

4. Generate the required certificates by running the following commands:

   a. Generate `ca.key`:

   ```shell
   openssl genrsa -out ca.key 4096
   ```

   b. Generate `ca.crt`:

   ```shell
   openssl req -new -x509 -key ca.key -days 730 -out ca.crt -config <( envsubst < csr_ca.txt )
   ```

   **Note:** The `envsubst` utility is available on Linux and can be installed by default as part of the `gettext` package.

   c. Generate `manager.key`:

   ```shell
   openssl genrsa -out ${MANAGER_NAME}.key 4096
   ```

   d. Generate `manager.csr`:

   ```shell
   openssl req -new -key ${MANAGER_NAME}.key -out ${MANAGER_NAME}.csr -config <(envsubst < my-eem-manager_answer.txt )
   ```

6. Sign the `csr` to create the manager certificate:

   ```shell
   openssl x509 -req -in ${MANAGER_NAME}.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out ${MANAGER_NAME}.crt -days 730 -extensions 'req_ext' -extfile <(envsubst < my-eem-manager_answer.txt)
   ```

7. Verify the manager certificate:

   ```shell
   openssl verify -CAfile ca.crt ${MANAGER_NAME}.crt
   ```

