---
title: "Installing an operator-managed Event Gateway"
excerpt: "Install and configure an operator-managed Event Gateway"
categories: installing
slug: install-opman-egw
toc: true
---

## Before you begin
{: #before-begin}

Review the pre-installation planning sections in [Installing the Event Gateway](../install-gateway).

## Creating TLS certificates for the {{site.data.reuse.egw}}
{: #certs}

Your operator-managed {{site.data.reuse.egw}} requires a CA certificate and key to generate the TLS certificate that secures your gateway endpoint.

The best way to create and manage TLS certificates is to use cert-manager. Cert-manager creates TLS certificates based on a YAML definition, stores them in Kubernetes secrets, and automatically renews them before they expire. Cert-manager supports integration with external public signers, and can also create self-signed certificates.

On Kubernetes, install the cert-manager [community operator](https://cert-manager.io/docs/){:target="_blank"}. Cert-manager is included on [Red Hat OpenShift](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/security_and_compliance/cert-manager-operator-for-red-hat-openshift#cert-manager-securing-routes){:target="_blank"}. 


### Creating a self-signed CA certificate with cert-manager
{: #self-signed-cert-manager}

The following steps show how to create a self-signed CA certificate and key that you can use to secure your gateway endpoint.

If you want to create externally-signed certificates with cert-manager, see the [cert-manager documentation](https://cert-manager.io/docs){:target="_blank"}.

1. If you do not already have a cert-manager Issuer or ClusterIssuer in your environment, then create one by following these steps:

   a. Create a file called `issuer.yaml` and paste in the following contents:

   ```yaml
   apiVersion: cert-manager.io/v1
   kind: <issuer type>
   metadata:
     name: gateway-selfsigned-issuer
     namespace: <namespace>
   spec:
     selfSigned: {}
   ```
   
   If you want the issuer to be available in all namespaces, then replace `<issuer type>` with `ClusterIssuer`, and `<namespace>` with `cert-manager`. 
   
   If you want the issuer to be available only in your gateway namespace, then replace `<issuer type>` with `Issuer`, and `<namespace>`, with your gateway namespace.

   b. Apply the file to create the issuer:

   ```shell
   kubectl apply -f issuer.yaml
   ```

2. Create a file called `CACertificate.yaml` and paste in the following contents:

   ```yaml
   apiVersion: cert-manager.io/v1
   kind: Certificate
   metadata:
     name: gateway-eem-selfsigned-ca
   spec:
     isCA: true
     commonName: <common name>
     secretName: <gateway group id>-<gateway name>-certs
     privateKey:
       algorithm: RSA
     issuerRef:
       name: <issuer name>
       kind: <issuer type>
       group: cert-manager.io
   ```

   Replace the placeholder values as follows:

   - `<common name>` Set to a unique common name for your CA certificate.
   - `<gateway group id>` Set to the name of your gateway group. The name must match the group name that you specify when you [generate](#install-steps) your gateway CR YAML.
   - `<gateway name>` Set to the name of your gateway. The name must match the name that you specify for your gateway when you [generate](#install-steps) your gateway CR YAML.
   - `<issuer name>` Set to the name of your cert-manager issuer. If you created an issuer in step 1, then set to `gateway-selfsigned-issuer`.
   - `<issuer type>` Set to your issuer type, either `Issuer` or `ClusterIssuer`.

3. Create your CA certificate and secret by applying the file in your gateway namespace:

   ```shell
   kubectl -n <namespace> apply -f CACertificate.yaml
   ```

4. Verify that the secret is created and contains the `tls.key` and `ca.crt` properties:

   ```shell
   kubectl -n <namespace> get -o yaml secret <gateway group id>-<gateway name>-certs
   ```

### Generating a TLS certificate with OpenSSL
{: #openssl}

For test and demonstration purposes, you can create a CA certificate and key with the following OpenSSL commands:

```
openssl genrsa -out tls.key 2048
openssl req -new -x509 -key tls.key -days 730 -out tls.crt
```

**Important:** It is recommended to use [cert-manager](#self-signed-cert-manager) to create and manage your certificates. Do not use this example certificate in production environments.



## Operator-managed {{site.data.reuse.egw}} installation steps
{: #install-steps}

1. In the navigation pane, click **Administration > Event Gateways**.
2. Click **Add gateway**.
3. Select the **Operator-managed deployment** tile, then click **Next**.
4. Provide the configuration details for your gateway, then click **Next**. 

   - **Gateway group**: Create or specify an existing [gateway group](../../about/key-concepts#gateway-group) for your new gateway.
   - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group.
   - **Replicas**: The number of Kubernetes replicas of the gateway pod to create.

5. Copy the generated custom resource YAML to two separate files:
    - `gateway_cr_original.yaml`
    - `gateway_cr.yaml`

    **Important:** Keep `gateway_cr_original.yaml` in a safe location and do not edit it. To remove write permissions to avoid accidental updates to this file, you can run `chmod a-w gateway_cr_original.yaml`.

7. Update the `gateway_cr.yaml` file as follows:

   a. Set `spec.license.accept` to `true`.

   b. If you already have a Kubernetes secret that contains the CA certificate and key for your gateway endpoint, then delete the `<gateway group>-<gateway ID>-certs` secret definition from `gateway_cr.yaml`, and set `spec.tls.caSecretName` to the name of your Kubernetes secret. 
   
   c. If you do not have a Kubernetes secret that contains the CA certificate and key for your gateway endpoint, then you can set `<tls-certificate>` and `<tls-key>` directly in `gateway_cr.yaml`.

   Paste the certificate and key into your `gateway_cr.yaml` file as follows:

   ```
   ...
   stringData:
     # Provide CA certificate and key in PEM format
     tls.crt: |
       -----BEGIN CERTIFICATE-----
       MIIDizCCAnOgAwIBAgIUQFS1LnATi4S/Cp7v/qpC8RWHtJYwDQYJKoZIhvcNAQEL
       ...
       ...
       FbI5AUFaY4/6B9C8L5x7EDQCIGYJ3SJMdvBXkFFAA+/bdMVJG7AgkH6ReHH5NDk=
       -----END CERTIFICATE-----
     tls.key: |
       -----BEGIN PRIVATE KEY-----
       MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQD1URQNSfFOgx2P
       ...
       P3/fdFOUp0I54BfD1D/03NT4zw==
       -----END PRIVATE KEY-----
   ---
   ```

   d. Replace any other placeholder variables in the YAML, and set other properties as required. For more information about properties that you can configure in the {{site.data.reuse.egw}} YAML file, see [configuring](../configuring).

   e. Create a backup of the updated `gateway_cr.yaml` file, in addition to the `gateway_cr_original.yaml` file.

7. To install the {{site.data.reuse.egw}} through the {{site.data.reuse.openshift_short}} web console, complete the following steps:

      a. {{site.data.reuse.openshift_ui_login}}

      b. Click the **+** (Quick create) icon in the upper-right.

      c. Select **Import YAML**.

      d. Set **Project** to the namespace where you want to install the {{site.data.reuse.egw}}.

      e. Paste in the contents of your updated `gateway_cr.yaml` file. 

      h. Click **Create** to start the {{site.data.reuse.egw}} installation process.

8. To install the {{site.data.reuse.egw}} by using the CLI, run the following commands:

   a. If you are deploying an operator-managed gateway on other Kubernetes platforms, then add the `spec.endpoints[]` section to your `gateway_cr.yaml` file:

   ```yaml
   spec:
     endpoints:
       - name: gateway
         host: <gateway endpoint>
   ```
   
   For more information about the `endpoints` property, see [Configuring ingresses](../configuring#configuring-ingress).

   b. Apply the `gateway_cr.yaml` file in your Kubernetes environment by using the `kubectl` command. For example:

   ```shell
   kubectl -n <gateway namespace> apply -f gateway_cr.yaml
   ```  

9. Return to the **Event Gateways** page to monitor the status of the new {{site.data.reuse.egw}}. When the gateway is registered, the status reports **Running**.

10. Complete the [gateway verification](../install-gateway#verify-gateway) checks.