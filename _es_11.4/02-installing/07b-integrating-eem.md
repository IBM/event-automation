---
title: "Integrating with Event Endpoint Management"
excerpt: "Find out how to integrate Event Streams with an Event Endpoint Management instance."
categories: installing
slug: integrating-eem
toc: true
---

{{site.data.reuse.eem_name}} provides the capability to describe and catalog your Kafka topics as event sources, and to share the details of the topics with application developers within the organization. Application developers can discover the event sources and configure their applications to subscribe to the stream of events, providing self-service access to the message content from the event stream.

{{site.data.reuse.es_name}} can be integrated with [{{site.data.reuse.eem_name}}]({{ 'eem/about/overview/' | relative_url }}), after which you can share topics as event sources with {{site.data.reuse.eem_name}} from the {{site.data.reuse.es_name}} UI. You can then create options for each topic to control how the topic’s stream of events are presented to consumers, and publish the option you want in the {{site.data.reuse.eem_name}} UI.

Follow the instructions as an administrator to integrate your {{site.data.reuse.es_name}} deployment with {{site.data.reuse.eem_name}}.

**Note:** You must have authenticated to the {{site.data.reuse.openshift_short}} UI with a Keycloak user or an IAM user to be able to share your topic within the UI. To share your topic within the UI as a SCRAM user, you must have an administrator role with the `cluster.alter` permission enabled. For more information, see [Managing access](../../security/managing-access/).

## Prerequisites

Ensure your environment meets the following prerequisites.

- To authenticate {{site.data.reuse.eem_name}} to access {{site.data.reuse.es_name}}, ensure that an external listener is [configured](../../installing/configuring/#kafka-ingress-example) with SCRAM authentication.
- {{site.data.reuse.eem_name}} version 11.1.1 or later is [installed]({{ 'eem/installing/overview' | relative_url }}).
- You have an [access token]({{ 'eem/security/api-tokens/#creating-a-token' | relative_url }}) from the {{site.data.reuse.eem_name}} UI.
- You [downloaded]({{ 'eem/integrating-with-apic/configure-eem-for-apic/#obtain-certificates-for-a-tls-client-profile-on-openshift' | relative_url}}) the SSL certificate of your {{site.data.reuse.eem_name}} instance as a `.crt` file and then formatted the certificate by running the following command:

  ```shell
  awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' <eem-ssl-certificate>.crt
  ```

## Setting up the connection

To set up a connection between your {{site.data.reuse.es_name}} and {{site.data.reuse.eem_name}} instances, complete the following steps:

1. {{site.data.reuse.cncf_cli_login}}
1. Create a file called `es-eem-configmap.yaml` and copy the following YAML content into the file to create the ConfigMap that has the details for creating a server connection to your {{site.data.reuse.eem_name}} instance:

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: <event-streams-instance>-ibm-es-discovery-endpoints
     namespace: <event-streams-namespace>
   data:
     endpoints.json: |-
       {
         "instances": [
           {
             "name": "<event-endpoint-management-instance>",
             "type": "event-endpoint-manager",
             "server": {
               "host": "<eem-api-hostname>",
               "port": <eem-api-port>,
               "ssl": true,
               "certificates": ["-----BEGIN CERTIFICATE-----\n<eem-ssl-certificate>\n-----END CERTIFICATE-----\n"]
             },
             "additional-info": {
               "eem-ui-url": "<ui-url-eem-instance>"
             }
           }
         ]
       }
   ```

   Where:

   - `<event-streams-instance>` is the name of the {{site.data.reuse.es_name}} instance.
   - `<event-streams-namespace>` is the namespace where your {{site.data.reuse.es_name}} instance is installed.
   - `<event-endpoint-management-instance>` is the name of the {{site.data.reuse.eem_name}} instance.
   - `<eem-api-hostname>` is the hostname of the [API endpoint URI]({{ 'eem/getting-started/logging-in/#retrieving-the-urls' | relative_url}}) of the {{site.data.reuse.eem_manager}}.
   - `<eem-api-port>` is the port number of the [API endpoint URI]({{ 'eem/getting-started/logging-in/#retrieving-the-urls' | relative_url}}) of the {{site.data.reuse.eem_manager}}.
   - `<eem-ssl-certificate>` is the CA certificate of the {{site.data.reuse.eem_name}} instance that you downloaded earlier.
   - `<ui-url-eem-instance>` is the hostname of the [UI endpoint URI]({{ 'eem/getting-started/logging-in/#retrieving-the-urls' | relative_url}}) of the {{site.data.reuse.eem_name}} UI.

2. Apply the ConfigMap by running the following command:

   ```shell
   kubectl apply -f es-eem-configmap.yaml
   ```

After the ConfigMap is created, you can [share your topics](../../getting-started/sharing-topic/) with {{site.data.reuse.eem_name}} from the {{site.data.reuse.es_name}} UI.
