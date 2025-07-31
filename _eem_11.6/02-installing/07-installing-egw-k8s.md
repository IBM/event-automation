---
title: "Installing the Event Gateway as a Kubernetes Deployment"
excerpt: "Install and configure the Event Gateway as a Kubernetes Deployment"
categories: installing
slug: install-k8s-egw
toc: true
---

## Before you begin
{: #before-begin}

Review the [planning](../install-gateway#gateway-planning) topic to decide how you want to deploy your {{site.data.reuse.egw}}.

### Licensing
{: #licensing}

If your {{site.data.reuse.eem_manager}} is not using a usage-based license, then first install the IBM Licensing Service in the same environment as the {{site.data.reuse.egw}}. <!-- DRAFT COMMENT: Add link to IBM LS -->

### Required information
{: #req-info}

Decide on hostnames for your {{site.data.reuse.egw}}, identify the DNS domain of your cluster, and confirm the network path to your {{site.data.reuse.egw}} endpoint.

- **DNS domain:** Determine the DNS domain of your cluster's ingress controller. On OpenShift, the default domain can be found with this command:

  ```shell
  oc get ingresses.config/cluster -o jsonpath={.spec.domain}
  ```

- **Hostname:** If the Kafka cluster that you intend your {{site.data.reuse.egw}} to manage traffic for has multiple brokers, then you must have a separate hostname for each broker. 

  **Tip:** To easily identify your {{site.data.reuse.egw}}, set the hostname as `<gateway group>-<gateway-id>-<kafka broker>`, where `<kafka broker>` is an integer to represent each Kafka broker in the Kafka cluster that your {{site.data.reuse.egw}} is to manage traffic for.

- **Fully Qualified Domain Name (FQDN)** Determine the (FQDN) of your {{site.data.reuse.egw}}. The FQDN is formed from `<gateway hostname>.<dns ingress domain>`.

    For example, if your Kafka cluster has 3 brokers, your gateway group name is `grp1`, your gateway ID is `gwy1`, and your DNS domain is `mydomain.com` then the FQDNs for your {{site.data.reuse.egw}} are the following: 

    - `grp1-gwy1-1.mydomain.com`
    - `grp1-gwy1-2.mydomain.com`
    - `grp1-gwy1-3.mydomain.com`

- **External access:**  How is your gateway to be exposed externally? The URL and configuration of the TLS certificate of your gateway endpoint depend on how the gateway endpoint is exposed. On OpenShift you must configure [OpenShift Routes]( 
https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/networking/configuring-routes#nw-creating-a-route_route-configuration) for external access.


## Creating TLS certificates for the {{site.data.reuse.egw}}
{: #certs}

The best way to create the TLS certificates to secure your {{site.data.reuse.egw}} endpoint is to use cert-manager. Cert-manager creates TLS certificates based on a YAML definition, stores them in Kubernetes secrets, and automatically renews them before they expire. Cert-manager supports integration with external public signers, and can also create self-signed certificates.

On Kubernetes, install the cert-manager [community operator](https://cert-manager.io/docs/){:target="_blank"}. Cert-manager is included on Red Hat OpenShift: [Red Hat OpenShift cert-manager](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/security_and_compliance/cert-manager-operator-for-red-hat-openshift#cert-manager-securing-routes){:target="_blank"}. 


### Creating a self-signed certificate
{: #self-signed}

The steps in this section show how to create self-signed certificates that you can use to secure your gateway endpoint.

If you want to create externally signed certificates with cert-manager, then see the [cert-manager documentation](https://cert-manager.io/docs){:target="_blank"}.

1. Create a ClusterIssuer object. A ClusterIssuer object can issue certificates in all namespaces. If you want to confine the issuer to a single namespace, then create an Issuer object instead.
   
   a. Create a YAML file called `ClusterIssuer.yaml` and paste in the following contents:
   
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: selfsigned-issuer
   spec:
     selfSigned: {}
   ---
   apiVersion: cert-manager.io/v1
   kind: Certificate
   metadata:
     name: eem-selfsigned-ca
     namespace: cert-manager
   spec:
     isCA: true 
     commonName: eem-selfsigned-ca
     secretName: root-secret
     privateKey:
       algorithm: RSA
     issuerRef:
       name: selfsigned-issuer
       kind: ClusterIssuer
       group: cert-manager.io
   ---
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: eem-ca-issuer
   spec:
     ca:
       secretName: root-secret
   ```
   b. Apply the YAML file in your Kubernetes environment:
   
   ```shell
   kubectl -n cert-manager apply -f ClusterIssuer.yaml
   ```
   
2. Use the ClusterIssuer to create your gateway certificate.
   
   a. Create a file called `GatewayCertificate.yaml` and paste in the following contents:
   
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: Certificate
   metadata:
     name: eem-gateway-cert-request
   spec:
     secretName: <gateway group>-<gateway ID>-certs
     privateKey:
       algorithm: RSA
     duration: 2160h # 90d
     renewBefore: 360h # 15d
     isCA: false
     usages:
       - server auth
     subject:
       organizations:
         - cert-manager
     commonName: <common name>
     dnsNames:
       - <hostname1.ingressdomain>
       - <hostname2.ingressdomain>
       - <hostname3.ingressdomain> 
     issuerRef:
       name: eem-ca-issuer
       kind: ClusterIssuer
   ```

   Set the following properties:
   - `spec.secretName`: Replace `<gateway group>` and `<gateway ID>` with the names that you intend to use for your gateway group and gateway ID.
   - `spec.commonName`: Set a human-readable name for your certificate.
   - `spec.dnsNames`: Set to a comma-separated list of the FQDNs for your {{site.data.reuse.egw}}.
   
   b. Apply the YAML file in your Kubernetes environment:
   
   ```shell
   kubectl -n <gateway namespace> apply -f GatewayCertificate.yaml
   ```
   
   c. Verify that your gateway secret is created:
   
   ```shell
   kubectl -n <gateway namespace> get secrets
   ```

   The secret contains the gateway certificate and key in the properties `spec.tls.crt` and `spec.tls.key`.

## Generating your {{site.data.reuse.egw}} Kubernetes Deployment YAML
{: #generating-gateway-config}

1. In the {{site.data.reuse.eem_name}} UI navigation pane, click **Administration > Event Gateways**.
2. Click **Add gateway**.
3. Select the **Kubernetes Deployment** tile, then click **Next**.
4. Provide the configuration properties for your gateway.

    You must provide these properties to be able to generate the YAML:
    - **Gateway group**: Create or specify an existing [gateway group](../../about/key-concepts#gateway-group) for your new gateway.
    - **Gateway ID**: Provide an ID for your new gateway that is unique within the gateway group.
    - **Replicas**: The number of Kubernetes replicas of the gateway pod to create.

    The remaining properties are set later in [Configuring your {{site.data.reuse.egw}} Kubernetes Deployment YAML](#config-yaml):
    - **Server URL** is a comma-separated list of the FQDNs and ports of the {{site.data.reuse.egw}}. See [Configuring your {{site.data.reuse.egw}} Kubernetes Deployment YAML](#config-yaml).
    - **Gateway private key**, **Gateway certificate**, **CA certificate** are the TLS certificates used to secure your {{site.data.reuse.egw}} endpoint. It is recommended to not upload certificates here, and to use [cert-manager](#certs) to create and manage your certificates, but if you do not want to use cert-manager, then you can upload the certificate PEM files here.

5. Copy the generated YAML to two separate files:
    - `gateway_k8s_original.yaml`
    - `gateway_k8s.yaml`

    **Important:** Keep `gateway_k8s_original.yaml` in a safe location and do not edit it. To remove write permissions to avoid accidental updates to this file you can run `chmod a-w gateway_k8s_original.yaml`.

## Configuring your {{site.data.reuse.egw}} Kubernetes Deployment YAML
{: #config-yaml}

Open the `gateway_k8s.yaml` file that you [generated](#generating-gateway-config) and replace all `<placeholder>` properties: 

- Set `spec.containers.env.ACCEPT_LICENSE` to `"true"`.
- Set `spec.template.spec.containers[egw].env[KAFKA_ADVERTISED_LISTENER]` to the FQDNs and ports of your gateway. For example:

  ```yaml
    - name: KAFKA_ADVERTISED_LISTENER
    value: "grp1-gwy1-1.ingress.domain:443,grp1-gwy1-2.ingress.domain:443,grp1-gwy1-3.ingress.domain:443"
  ```
<!-- - If you want the gateway CA certificate to be downloadable by users in the **Catalog** page of the {{site.data.reuse.eem_name}} UI, then set the `spec.template.spec.containers[egw].env[GATEWAY_TRUST_PEM]` to refer to the secret that contains your CA certificate: 

  ```yaml
        - name: GATEWAY_TRUST_PEM
          valueFrom:
            secretKeyRef:
              key: ca.crt
              name: "<CA secret>"
  ``` -->
- Delete the `<group name>-<gateway ID>-certs` secret from the YAML file and verify that the name of the secret you [created](#self-signed) matches the value in `spec.template.spec.containers[egw].volumes[certs].secret.secretName`.
- The generated YAML includes a Kubernetes service definition for your gateway. A Kubernetes service is required for client access to your gateway. If the generated service configuration does not suit your requirements then you can either update it in the generated YAML, or delete the definition from the YAML and [create the Kubernetes](#create-kube-service) service later.

## Install your Kubernetes Deployment {{site.data.reuse.egw}}

1. Apply the `gateway_k8s.yaml` file in your Kubernetes environment by using the `kubectl` command. For example:

   ```shell
   kubectl -n <gateway namespace> apply -f gateway_k8s.yaml
   ```   

2. To monitor the deployment of the {{site.data.reuse.egw}} in the {{site.data.reuse.eem_name}} UI navigation pane, click **Administration > Event Gateways**. When the gateway is registered, the status reports **Running**.
3. If you need to customize the gateway for your environment or enable extra gateway features, see [advanced gateway configuration](../configuring).
4. [Enable client network access](#enable-client-access) to your gateway.

## Enabling client network access
{: #enable-client-access}

A Kubernetes [Service](#create-kube-service) must be created on all types of Kubernetes cluster, including OpenShift. The service must allow access to the gateway for all types of traffic.

If the {{site.data.reuse.egw}} is to be exposed outside the host cluster, then you must also create the appropriate [ingresses](https://kubernetes.io/docs/concepts/services-networking/ingress/){:target="_blank"} or OpenShift [Routes](#create-route). 

Ensure that TLS pass-through is enabled in all network infrastructure and software that processes communication between your Kafka client and your {{site.data.reuse.egw}} (such as load balancers).


### Creating the Kubernetes Service
{: #create-kube-service}

The Kubernetes service must map the internal ports that you defined in your gateway endpoint for the generated items to match. The service can be created only after the {{site.data.reuse.egw}} Kubernetes Deployment is created.

A service definition is created for you in the [gateway YAML](#generating-gateway-config). If this definition does not suit your requirements, then you can generate a service definition YAML based on your {{site.data.reuse.egw}} deployment and update as required with the following command:


```shell
kubectl expose deployment/<gateway deployment name> --target-port=<port number> --port=<port number> -o yaml --dry-run=client
```

For example:

```yaml
# generated with oc expose deployment/grp1-gwy1 --target-port=8443 --port=8443 -o yaml --dry-run=client
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: grp1-gwy1
    gatewayGroup: grp1
    gatewayId: gw1
  name: grp1-gwy1
spec:
  ports:
  # should match what was configured on the gateway in EEM Manager
  - port: 8443
    protocol: TCP
    targetPort: 8443
  selector:
    app: grp1-gwy1
    gatewayGroup: grp1
    gatewayId: gw1
```

For more information about creating Kubernetes services, see [How to expose a TCP application with a Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/){:target="_blank"}.

### Creating a Red Hat OpenShift Route
{: #create-route}

On Red Hat OpenShift, create the same number routes as the number of Kafka brokers in the largest Kafka cluster that your {{site.data.reuse.egw}} manages traffic for.

Set `spec.to.name` to the Kubernetes Service that you created in [Creating the Kubernetes Service](#create-kube-service), and set `spec.tls.termination` to `passthrough`.

In the following example, 3 separate routes are defined that all point to the same Kubernetes Service:

```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: gw1-route1
spec:
  # host must match the dnsNames entry in the gateway certificate
  host: grp1-gwy1-1.mydomain.com
  port:
    targetPort: 8443
  tls:
    insecureEdgeTerminationPolicy: None
    termination: passthrough
  to:
    kind: Service
    name: grp1-gw1
    weight: 100
  wildcardPolicy: None
---
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: gw1-route2
spec:
  # host must match the dnsNames entry in the gateway certificate
  host: grp1-gwy1-2.mydomain.com
  port:
    targetPort: 8443
  tls:
    insecureEdgeTerminationPolicy: None
    termination: passthrough
  to:
    kind: Service
    name: grp1-gw1
    weight: 100
  wildcardPolicy: None
---
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: gw1-route3
spec:
  # host must match the dnsNames entry in the gateway certificate
  host: grp1-gwy1-3.mydomain.com
  port:
    targetPort: 8443
  tls:
    insecureEdgeTerminationPolicy: None
    termination: passthrough
  to:
    kind: Service
    name: grp1-gw1
    weight: 100
  wildcardPolicy: None
```

### Creating a Kubernetes Ingress
{: #create-ingress}

Follow the [Kubernetes documentation](https://kubernetes.io/docs/concepts/services-networking/ingress/){:target="_blank"} on creating ingresses. 

