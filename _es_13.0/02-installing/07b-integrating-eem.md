---
title: "Integrating with Event Endpoint Management"
excerpt: "Find out how to integrate Event Streams with an Event Endpoint Management instance."
categories: installing
slug: integrating-eem
toc: true
---

[{{site.data.reuse.eem_name}}]({{ 'eem/about/overview/' | relative_url }}) provides the capability to describe and catalog your Kafka topics as event sources, and to share the details of the topics with application developers within the organization. Application developers can discover the event sources and configure their applications to subscribe to the stream of events, providing self-service access to the message content from the event stream.

The following methods are available to integrate {{site.data.reuse.eem_name}} with {{site.data.reuse.es_name}}:

- Share all topics in your {{site.data.reuse.es_name}} instance with an {{site.data.reuse.eem_name}} instance. You must have administrator access to the {{site.data.reuse.eem_name}} UI and your {{site.data.reuse.eem_name}} instance must have access to your {{site.data.reuse.es_name}} bootstrap endpoint. The procedure is described in the [{{site.data.reuse.eem_name}} documentation]({{ '/eem/administering/managing-clusters' | relative_url }}).
- Share specific topics from your {{site.data.reuse.es_name}} instance with an {{site.data.reuse.eem_name}} instance. The procedure is described in this topic.


## Prerequisites
{: #prerequisites}

Ensure that your environment meets the following prerequisites:

- To authenticate {{site.data.reuse.eem_name}} to access {{site.data.reuse.es_name}}, ensure that an external listener is [configured](../../installing/configuring/#kafka-ingress-example) with SCRAM authentication.  <!-- DRAFT COMMENT: what about keycloak? -->
- [Keycloak](../../security/managing-access#managing-access-with-keycloak) users must be authenticated to the {{site.data.reuse.openshift_short}} UI.
- [SCRAM](../../security/managing-access#managing-access-to-the-ui-and-cli-with-scram) users must have an administrator role with the `cluster.alter` permission enabled.
- Kafka Proxy is not enabled. If you previously enabled it, [remove the proxy](../../installing/upgrading#remove-kafka-proxy) and verify that clients can connect directly to the Kafka brokers.
- {{site.data.reuse.eem_name}} version 11.1.1 or later is [installed]({{ 'eem/installing/overview' | relative_url }}).
- You have an [access token]({{ 'eem/security/api-tokens/#creating-a-token' | relative_url }}) from the {{site.data.reuse.eem_name}} UI.
- You [downloaded]({{ 'eem/integrating-with-apic/configure-eem-for-apic/#obtain-certificates-for-a-tls-client-profile-on-openshift' | relative_url}}) the TLS CA certificate of your {{site.data.reuse.eem_name}} instance as a PEM file and then formatted the certificate to be a single line by running the following command:

  ```shell
  awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' cluster-ca.pem
  ```

## Setting up the connection
{: #setting-up-the-connection}

To set up a connection between your {{site.data.reuse.es_name}} and {{site.data.reuse.eem_name}} instances, complete the following steps:

1. {{site.data.reuse.cncf_cli_login}}
2. Create a file that is called `es-eem-configmap.yaml` and copy the following YAML content into the file to create the ConfigMap that has the details for creating a server connection to your {{site.data.reuse.eem_name}} instance:

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: <event streams instance>-ibm-es-discovery-endpoints
     namespace: <event streams namespace>
   data:
     endpoints.json: |-
       {
         "instances": [
           {
             "name": "<event endpoint management instance>",
             "type": "event-endpoint-manager",
             "server": {
               "host": "<eem admin endpoint>",
               "port": 443,
               "ssl": true,
               "certificates": ["<event manager CA certificate>"]
             },
             "additional-info": {
               "eem-ui-url": "<event manager UI FQDN>"
             }
           }
         ]
       }
   ```

   Where:

   - `<event streams instance>` is the name of the {{site.data.reuse.es_name}} instance. 
   - `<event streams namespace>` is the namespace where your {{site.data.reuse.es_name}} instance is installed.
   - `<event endpoint management instance>` is the name of the {{site.data.reuse.eem_name}} instance. To get this name, run `kubectl get eventendpointmanagement` in your {{site.data.reuse.eem_name}} namespace.
   - `<eem admin endpoint>` is the {{site.data.reuse.eem_name}} [admin API endpoint]({{ 'eem/installing/configuring#configuring-ingress' | relative_url}}). For example: `eeminst-eem-admin-1.test.example.com`. <!-- FUTURE: We need a better EEM link than this (is non-OCP specific), but it's the best one we have that covers the admin API endpoint atm. -->
   - `<event manager CA certificate>` is the CA certificate of the {{site.data.reuse.eem_name}} instance that you downloaded earlier, and formatted as a single line. For example:

      ```yaml
      "certificates": ["-----BEGIN CERTIFICATE-----\nMIIDbTCCAlWgAwIBAgIRAOfIo8zI8tnbTM/k5yJ0P6gwDQYJKoZIhvcNAQELBQAw\nUD...sY=\n-----END CERTIFICATE-----\n"]
      ```

   - `<event manager UI FQDN>` is the fully qualified domain name of the [{{site.data.reuse.eem_name}} UI]({{ 'eem/getting-started/logging-in/#retrieving-the-urls' | relative_url}}). For example: `eeminst-eem-ui-1.test.example.com`

3. Create the ConfigMap by running the following command:

   ```shell
   kubectl apply -f es-eem-configmap.yaml
   ```

   The `<event streams instance>-ibm-es-ui` and `<event streams instance>-ibm-es-admapi` pods restart.

After the ConfigMap is created, you can [share your topics](../../getting-started/sharing-topic/) with {{site.data.reuse.eem_name}} from the {{site.data.reuse.es_name}} UI.

**Note:** To update the ConfigMap, restart the `<event streams instance>-ibm-es-ui` and `<event streams instance>-ibm-es-admapi` pods after the ConfigMap is created.

<!-- DRAFT COMMENT: I had to restart them after changing server.port for the change to take effect. I didn;t have to restart after changing EEM UI URL -->
