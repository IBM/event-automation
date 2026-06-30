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

Two options are available for configuring TLS on your operator-managed {{site.data.reuse.egw}}:

- Specify the CA certificate and key for your gateway. When you specify the CA certificate, the {{site.data.reuse.eem_name}} operator automatically generates and maintains the server certificate that secures your gateway endpoint. 
- Specify the server certificate, the server certificate key, and the CA certificate for your gateway.


### Creating a self-signed CA certificate with cert-manager
{: #self-signed-cert-manager}

The best way to create and manage TLS certificates is to use cert-manager. Cert-manager creates TLS certificates based on a YAML definition, stores them in Kubernetes secrets, and automatically renews them before they expire. Cert-manager supports integration with external public signers, and can also create self-signed certificates.

On Kubernetes, install the cert-manager [community operator](https://cert-manager.io/docs/){:target="_blank"}. Cert-manager is included on [Red Hat OpenShift](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/security_and_compliance/cert-manager-operator-for-red-hat-openshift#cert-manager-securing-routes){:target="_blank"}. 

The {{site.data.reuse.egw}} YAML files that the {{site.data.reuse.eem_name}} UI creates includes the definitions of a self-signed certificate and issuer.

If you want to create externally-signed certificates with cert-manager, see the [cert-manager documentation](https://cert-manager.io/docs){:target="_blank"}.


### Generating a CA certificate with OpenSSL
{: #openssl}

For test and demonstration purposes, you can create a CA certificate and key with the following OpenSSL commands:

```
openssl genrsa -out tls.key 2048
openssl req -new -x509 -key tls.key -days 730 -out tls.crt
```

**Important:** It is recommended to use [cert-manager](#self-signed-cert-manager) to create and manage your certificates. Do not use this example certificate in production environments.


### Supplying your own server certificate and key
{: #bring-your-own-cert}

If you already have a server certificate that you want to use, then create a Kubernetes secret that contains this certificate, along with its key and CA certificate.

The Subject Alternative Names (SANs) in your certificate must include the path to all the hostnames that are used for your {{site.data.reuse.egw}}. You can use a wildcard SAN entry, for example: `*.<CLUSTER_API>` - where `<CLUSTER_API>` is derived from the URL of your {{site.data.reuse.openshift_short}} cluster. If the URL is `https://console-openshift-console.apps.clusterapi.com/` then `<cluster api>` is `apps.clusterapi.com`.

If your certificate is not signed by a well-known public CA chain, then you must provide the full signing chain.

1. Create a file called `custom-gateway-cert.yaml` and paste in the following contents:

   ```yaml
   apiVersion: v1
   data:
     ca.crt: <base64 encoded CA certificate>
     tls.crt: <base64 encoded server certificate>
     tls.key: <base64 encoded key>
   metadata:
     name: custom-gateway-cert
   kind: Secret
   type: kubernetes.io/tls
   ```

2. Apply the file to create the Kubenetes secret in the same namespace where your {{site.data.reuse.egw}} is to be deployed:

   ```shell
   kubectl -n <namespace> apply -f custom-gateway-cert.yaml
   ```


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
    - `<gateway name>-gateway_cr_original.yaml`
    - `<gateway name>-gateway_cr.yaml`

    **Important:** Keep the `<gateway name>-gateway_cr_original.yaml` file in a safe location and do not edit it. To remove write permissions to avoid accidental updates to this file, you can run `chmod a-w <filename>`.

6. Update the `<gateway name>-gateway_cr.yaml` file and set `spec.license.accept` to `true`.

7. (Optional) To create a gateway using wildcard routes, update `<gateway name>-gateway_cr.yaml` as follows:

      ```yaml
      spec:
      ...
        listeners:
          - groups:
              - endpoint:
                  host: wildcard.<group-name>.<listener-name>-<instance-name>-<namespace>.<clusterDomain>
                name: <group-name>
                type: WILDCARD
            name: <listener-name>
            port: <port>
            tls:
              certificateType: WILDCARD
      ```

      **Note:** Wildcard routes are not enabled by default in {{site.data.reuse.openshift_short}}. See [wildcard policy](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/operator_apis/ingresscontroller-operator-openshift-io-v1#spec-routeadmission){:target="_blank"} to enable wildcard routes in your Ingress Controller.

      **Note:** Wildcard hostnames on operator-managed gateways are supported only in {{site.data.reuse.openshift_short}}.

8. Configure TLS certificates. The following TLS configuration options are available:

   - Use the default self-signed certificate that is generated by the {{site.data.reuse.eem_name}} operator. No action is required, continue to step 8.

   - If you want {{site.data.reuse.eem_name}} to generate leaf certificates from your own CA certificate, then update `<gateway name>-gateway_cr.yaml` as follows: 

     In the custom resource section, define the `tls` property in `spec.listeners[listener]` to refer to a Kubernetes secret that contains your CA certificate: 

     ```yaml
       spec:
         listeners:
         - name: listener
           tls:
             caSecret:
               secretName: "<Kubernetes secret that contains your root CA certificate and key pair>" 
     ```
     
   - If already have a Kubernetes secret that contains your [own server certificate](#bring-your-own-cert) and you want to use this secret, or if you have an existing gateway instance in the same namespace and you want to use the same secret, then update `<gateway name>-gateway_cr.yaml` as follows:

      In the custom resource section, define the `tls` property in `spec.listeners[listener]` to refer to your server certificate: 
   
      ```yaml
      spec:
        listeners:
        - name: listener
          tls:
            certificateType: "WILDCARD|EXPLICIT" # "The type of certificate to generate: 'wildcard' for a single wildcard certificate (*.example.com), or 'explicit' for a single certificate with explicit hostnames as SANs. 
            secretName: "<Kubernetes secret that contains your CA and server certificate and key>"
            key: "tls.key"
            serverCertificate: "tls.crt"
            caCertificate: "ca.crt" 
      ```

      If your Kubernetes secret does not use the key names `tls.key`, `tls.crt`, and `ca.crt`, then update `tls.key`, `tls.serviceCertificate`, and `tls.caCertificate` to match the key names that you use in your secret. For example, if your Kubernetes secret is:

      ```yaml
      apiVersion: v1
      kind: Secret
      metadata:
        name: custom-tls-certs
      data:
        certKey: <BASE64_KEY>
        serverCert: <BASE64_CERT>
        caCert: <BASE64_CA_CERT>
      ```

      then update `spec.listeners[listener].tls` to specify these key names:

      ```yaml
       spec:
         listeners:
         - name: listener
           tls:
             ...
             key: "certKey"
             serverCertificate: "serverCert"
             caCertificate: "caCert" 
      ```
      
      **Important:** If you do not supply a CA certificate in the secret that is referenced by `spec.listeners[listener].tls.secretName` and use it from `spec.listeners[listener].tls.caCertificate`, then users cannot download the gateway certificate from the {{site.data.reuse.eem_name}} UI catalog page.

9. If you are deploying an operator-managed gateway on other Kubernetes platforms, then add the `spec.listeners[].groups[].endpoint` section to your `<gateway name>-gateway_cr.yaml` file:

      ```yaml
      spec:
        listeners:
          - name: <listener-name>
            groups:
            - name: <group-name>
              endpoint:
                host: my-gateway.example.com
      ```

      For more information about the `endpoints` property, see [configuring ingresses](../configuring#configuring-ingress).
      
10. Replace any other placeholder variables in the YAML.

11. Create a backup of the updated `<gateway name>-gateway_cr.yaml` file, in addition to the `<gateway name>-gateway_cr_original.yaml` file.

12. To install the {{site.data.reuse.egw}} through the {{site.data.reuse.openshift_short}} web console, complete the following steps:

      a. {{site.data.reuse.openshift_ui_login}}

      b. Click the **+** (Quick create) icon in the upper-right.

      c. Select **Import YAML**.

      d. Set **Project** to the namespace where you want to install the {{site.data.reuse.egw}}.

      e. Paste in the contents of your updated `<gateway name>-gateway_cr.yaml` file. 

      h. Click **Create** to start the {{site.data.reuse.egw}} installation process.

13. To install the {{site.data.reuse.egw}} by using the CLI, run the following commands:
   
      ```shell
      kubectl -n <gateway namespace> apply -f <gateway name>-gateway_cr.yaml
      ```  

14. Return to the **Event Gateways** page to monitor the status of the new {{site.data.reuse.egw}}. When the gateway is registered, the status reports **Running**.

15. Complete the [gateway verification](../install-gateway#verify-gateway) checks.