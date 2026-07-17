---
title: "Unable to access Event Manager endpoints"
excerpt: "Accessing some or all of the Event Manager endpoints fails"
categories: troubleshooting
slug: mgr-endpoints
toc: true
---

## Symptoms
{: #symptoms}

Misconfiguration of your network and TLS can cause various issues in {{site.data.reuse.eem_name}}, such as:

- The page does not load when you attempt to access the {{site.data.reuse.eem_name}} UI. 

- The [{{site.data.reuse.egw}}s](../../administering/managing-gateways) page shows the status of `This Event Gateway might require attention`.

- {{site.data.reuse.egw}} pod logs show: `Failed to register with Event Manager`.

<!-- COMMENT: Be good to add some more here. However, I didn't find much in the way of error messages with default logging to use here. -->

## Causes
{: #causes}

The following are the most common causes of {{site.data.reuse.eem_manager}} connection errors:

- Kubernetes [ingresses](../../installing/configuring#configuring-ingress) and {{site.data.reuse.openshift_short}} routes are misconfigured and not directing client requests to the {{site.data.reuse.eem_manager}}.
- Firewalls blocking access to the {{site.data.reuse.eem_manager}}.
- Load-balancers in front of the {{site.data.reuse.eem_manager}} are terminating TLS connections. TLS passthrough must be enabled on your load-balancer.
- {{site.data.reuse.eem_manager}} CA certificate not trusted by clients.
- {{site.data.reuse.eem_manager}} server certificate was not updated after the CA certificate was updated.

## Resolving the problem
{: #resolving-the-problem}

### Check for network problems
{: #check-network}

- Verify that the endpoint that the client is attempting to connect to matches a [route or ingress](../../installing/configuring/#configuring-ingress) in your Kubernetes environment.

- Try to connect to the endpoint from within your Kubernetes environment by using the following curl command:

   ```shell
   curl -k -L https:<endpoint>
   ```

   If the local connection attempt is successful, then the problem is in the network connection from your client to your Kubernetes environment.

### Check {{site.data.reuse.eem_manager}} TLS configuration
{: #check-tls}

Verify that the {{site.data.reuse.eem_manager}} CA and server certificates are [configured](../../security/config-tls) correctly.

By default, the {{site.data.reuse.eem_manager}} endpoints are secured by the `<instance name>-ibm-eem-manager` certificate, which is signed by `<instance name>-ibm-eem-manager-ca`.

To see what certificate an endpoint is secured with, you can use the following OpenSSL command:

```shell
openssl s_client -connect <endpoint>:443 -servername <endpoint> -showcerts
```

The following are common problems with {{site.data.reuse.eem_manager}} TLS configuration, and ways to resolve them:

- The CA certificate was updated, but not the leaf certificate that it signs. To resolve this problem, complete step 4 on [custom CA certificate for {{site.data.reuse.eem_manager}}](../../security/config-tls#custom-ca-recreate-leaf).

- The {{site.data.reuse.eem_manager}} endpoint certificates were updated, but the client's truststore was not updated with the new {{site.data.reuse.eem_manager}} CA certificate. 

  It might still be possible to access the {{site.data.reuse.eem_name}} UI because you can enable your browser to trust the new certificate when you connect, but any registered {{site.data.reuse.egw}}s must be manually updated with the new {{site.data.reuse.eem_manager}} CA certificate.
  
  Update the {{site.data.reuse.eem_manager}} CA certificate on your {{site.data.reuse.egw}}s with the following steps:
  
   1. Extract the CA certificate from the `<instance name>-ibm-eem-manager-ca` secret in the {{site.data.reuse.eem_manager}} namespace by running the following command: 

      ```shell
      kubectl -n <manager namespace> get -o yaml secret quick-start-manager-ibm-eem-manager-ca | grep ca.crt | awk '{print $2}' | base64 -d`
      ```

      The command returns the CA certificate in PEM format, for example:

      ```
      ----BEGIN CERTIFICATE----
      MIIDbTCCAlWgA... 
      ...
      n4AsuumaDi8d5oLmPEMV+Gk=
      -----END CERTIFICATE-----
      ```

  2. Update your gateway as follows depending on the deployment type: 

     - For Kubernetes Deployment gateways, edit the gateway instance's ConfigMap and update `manager.client.trust.pem`.

       a. To edit the ConfigMap, run:

       `kubectl -n <namespace> edit configmap <gateway group>-<gateway id>-config`

       b. Update the property `manager.client.trust.pem` with the new {{site.data.reuse.eem_manager}} CA certificate.

     - For operator-managed gateways, edit the gateway's custom resource and update the property `spec.manager.trustedCertificate`.

     - For Docker gateways: Restart the Docker gateway with the CA certificate specified in `-e MANAGER_CLIENT_TRUST_PEM`.

  3. Update your gateway configuration [backup](../../installing/backup-restore).


