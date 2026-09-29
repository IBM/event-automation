---
title: "Warning about not enough hostnames in gateway group"
excerpt: "Administrator sees a warning in the Event Endpoint Management UI that a gateway group might require more hostnames"
categories: troubleshooting
slug: add-gwy-hosts
toc: true
---

## Symptoms
{: #symptoms}

When you view the {{site.data.reuse.egw}}s in the **Administration** > **{{site.data.reuse.egw}}s** page of the {{site.data.reuse.eem_name}} UI, a warning is presented about insufficient hostnames for the gateway group.

## Causes
{: #causes}

The total number of hostnames for all gateways in a gateway group must be the same or greater than the total number of Kafka brokers that the gateway group serves topics from. If this requirement is not met, then your gateway group does not have enough unique hostnames to use for all the Kafka brokers.

If {{site.data.reuse.eem_name}} detects that a gateway group might not have enough hostnames, then you see the warning.

## Resolving the problem
{: #resolving-the-problem}

If authors want to publish more virtual topics to the gateway group, then follow these steps to add more hostnames.

1. Identify which gateways in the gateway group that you want to add new hostnames to.
2. Edit the gateway configuration to add more hostnames.

If your gateway group has only a single {{site.data.reuse.egw}}, then Kafka clients might experience a loss of service while the {{site.data.reuse.egw}} restarts.

### Operator-managed {{site.data.reuse.egw}}s
{: #opman-gateways}

Edit your `EventGateway` custom resource and increase the value that is set in `spec.listener.{0}.groups.{0}.maxNumKafkaBrokers` by the number of extra gateway hostnames that you require.

Restart the {{site.data.reuse.egw}} pod after you make this change.


### Kubernetes Deployment {{site.data.reuse.egw}}s
{: #k8s-gateways}

Edit the {{site.data.reuse.egw}} ConfigMap and set `kafka.listener.{0}.group.{1}.addresses` to include the extra gateway addresses that you require. 

Update the SAN in the TLS certificate that secures your gateway to include the new hostnames.

For each new hostname, create a new Kubernetes Service and Ingress or {{site.data.reuse.openshift_short}} route as described in [creating the Kubernetes service](../../installing/install-k8s-egw#create-kube-service).

### Docker {{site.data.reuse.egw}}s
{: #docker-gateways}

Edit the backup of your `docker run` command and set `KAFKA_LISTENER_LISTENER_GROUP_GROUP_ADDRESSES` to include the extra gateway addresses that you require. Also, update the port mappings to include any new ports that you specify. For example: `-p 9092:8443,9093:8444`

If your new addresses include new hostnames, then add these hostnames to the SAN in the TLS certificate that secures your gateway.

Restart your docker {{site.data.reuse.egw}} by using the updated run command.
