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

On Kubernetes, install the cert-manager [community operator](https://cert-manager.io/docs/){:target="_blank"}. Cert-manager is included on [Red Hat OpenShift](https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/security_and_compliance/cert-manager-operator-for-red-hat-openshift#cert-manager-securing-routes){:target="_blank"}. 

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
    - `gateway_cr_original.yaml`
    - `gateway_cr.yaml`

    **Important:** Keep `gateway_cr_original.yaml` in a safe location and do not edit it. To remove write permissions to avoid accidental updates to this file, you can run `chmod a-w gateway_cr_original.yaml`.

6. Update the `gateway_cr.yaml` file and set `spec.license.accept` to `true`.

7. Configure TLS certificates. The following TLS configuration options are available:

   - Use the default self-signed issuer and certificate that is specified in the `gateway_cr.yaml` file. 
   
     **Note:** The default certificate and issuer have names that are generated from the gateway group and ID that you specified in step 4.

   - Modify the default self-signed issuer and certificate specifications in the `gateway_cr.yaml` file to suit your requirements. For example, you might want to update the specification in the following scenarios: 
     
     - If you plan to install multiple {{site.data.reuse.egw}} instances and want to use the same certificate and issuer for all of them, then remove `<gateway id>` from the issuer and certificate names, and from `spec.template.pod.spec.containers[egw].env[GATEWAY_TRUST_PEM]` (which is set to the certificate name).
     - If you already have a cert-manager issuer or ClusterIssuer that you want to use, then delete the issuer specification and update the certificate specification to refer to your existing issuer.

   - If you [created a Kubernetes secret from your own CA and server certificate](#bring-your-own-cert), then update `gateway_cr.yaml` as follows:
   
      a. Delete the `Issuer` and `Certificate` sections:

      ```yaml
      apiVersion: cert-manager.io/v1
      kind: Issuer
      ...
      ---
      apiVersion: cert-manager.io/v1
      kind: Certificate
      ...
      ```

      b. Set the `spec.template.pod.spec.containers[egw].env[GATEWAY_TRUST_PEM]` environment variable.

       - If you want the gateway CA certificate to be downloadable by consumers from the [{{site.data.reuse.eem_name}} UI](../../subscribe/configure-your-application-to-connect#configuring-a-client), then update the `spec.template.pod.spec.containers[egw].env[GATEWAY_TRUST_PEM]` section to refer to the CA certificate in your Kubernetes secret:

         ```yaml
              - name: GATEWAY_TRUST_PEM
                valueFrom:
                  secretKeyRef:
                    key: ca.crt
                    name: "<Kubernetes secret that contains your CA and server certificates and key>"     
         ```
        
       - If you do not want the CA certificate to be downloadable from the {{site.data.reuse.eem_name}} UI, then delete the `spec.template.pod.spec.containers[egw].env[GATEWAY_TRUST_PEM]` environment variable.

         **Note:** Delete the `GATEWAY_TRUST_PEM` variable only if you are certain that all consumers are configured to trust your CA, or you have another procedure for supplying consumers with your CA certificate. 
      
      d. Configure the `spec.tls` section to refer to your server certificate:
   
      ```yaml
      spec:
        tls:
         secretName: <Kubernetes secret that contains your CA and server certificates and key>"
         key: tls.key
         serverCertificate: tls.crt
         caCertificate: ca.crt
      ```

8. Replace any other placeholder variables in the YAML.

9. Create a backup of the updated `gateway_cr.yaml` file, in addition to the `gateway_cr_original.yaml` file.

10. To install the {{site.data.reuse.egw}} through the {{site.data.reuse.openshift_short}} web console, complete the following steps:

      a. {{site.data.reuse.openshift_ui_login}}

      b. Click the **+** (Quick create) icon in the upper-right.

      c. Select **Import YAML**.

      d. Set **Project** to the namespace where you want to install the {{site.data.reuse.egw}}.

      e. Paste in the contents of your updated `gateway_cr.yaml` file. 

      h. Click **Create** to start the {{site.data.reuse.egw}} installation process.

11. To install the {{site.data.reuse.egw}} by using the CLI, run the following commands:
   
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

12. Return to the **Event Gateways** page to monitor the status of the new {{site.data.reuse.egw}}. When the gateway is registered, the status reports **Running**.

13. Complete the [gateway verification](../install-gateway#verify-gateway) checks.