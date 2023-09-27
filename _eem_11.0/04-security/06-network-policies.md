---
title: "Network policies"
excerpt: "Learn about the network connections allowed for Event Endpoint Management."
categories: security
slug: network-policies
toc: true
---

## Inbound network connections (ingress)

[Network policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/){:target="_blank"} are used to control inbound connections into pods. These connections can be from pods within the cluster, or from external sources.

When you install an instance of {{site.data.reuse.eem_name}}, the required network policies will be automatically created unless they are disabled through configuration options. To review the network policies that have been applied:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to display the installed network policies for a specific namespace:\\

   ```shell
   kubectl get netpol -n <namespace>
   ```

The following tables provide information about the network policies that are applicable to each pod within the {{site.data.reuse.eem_name}} instance. For information about how to stop deployment of the network policies, see the note after each table.


### {{site.data.reuse.eem_name}} operator pod

| **Type** | **Origin**                                                                                   | **Port** | **Reason**                  | **Enabled in policy**                                                                                  |
|----------|----------------------------------------------------------------------------------------------|----------|-----------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere                                                                                     | 8443     | Operator validating webhook | Always                                                                                                 |

**Note:** To delete the network policy of the {{site.data.reuse.eem_name}} operator:
- On the {{site.data.reuse.openshift_short}}: modify the subscription that was used to install the operator and set the `DEPLOY_OPERATOR_NETWORK_POLICY` environment variable to `false`.  Do this after the initial installation of the operator.
- On other Kubernetes platforms: install the Helm chart by specifying `--set deployOperatorNetworkPolicy=false`.

### {{site.data.reuse.eem_name}} pod

| **Type** | **Origin**           | **Port** | **Reason**            | **Enabled in policy**                                                                                  |
|----------|----------------------|----------|-----------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere             | 3000     | External access to UI | Always                                                                                                 |
| TCP      | Anywhere             | 8081     | Readiness probe       | Always                                                                                                 |

**Note:** To stop the automatic deployment of the instance's network policy, set the  `spec.deployNetworkPolicies` option for the instance to `false`.


### Event Gateway pod

| **Type** | **Origin**           | **Port** | **Reason**                 | **Enabled in policy**                                                                                  |
|----------|----------------------|----------|----------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere             | 8092     | Kafka client communication | Always                                                                                                 |

**Note:** To stop the automatic deployment of the instance's network policy, set the `spec.deployNetworkPolicies` option for the instance to `false`.


### Considerations for ingress

Consider the use of a deny-all-ingress network policy to limit communication with all pods in a namespace to only those communications specifically allowed in network policies. A deny-all network policy is not created by default as it would interfere with other applications installed in the namespace that do not have the required network policies set to allow inbound communications. 

To create a deny-all-ingress network policy, apply the following YAML to your cluster in the namespaces where you installed {{site.data.reuse.eem_name}}.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```



## Outbound network connections (egress)

The following tables provide information about the outbound network connections (egress) initiated by pods in an {{site.data.reuse.eem_name}} installation.

**Note:** Egress policies are not added by default. You must configure the egress policies based on your requirements.


### {{site.data.reuse.eem_name}} operator pod

| **Type** | **Destination**                    | **Pod Label**                            | **Port** | **Reason**      |
|----------|------------------------------------|------------------------------------------|----------|-----------------|
| TCP      | {{site.data.reuse.eem_name}} instance | eem.ei.ibm.com/component=<INSTANCE_NAME> | 8081     | Readiness check |

### {{site.data.reuse.eem_name}} pod

| **Type** | **Destination**   | **Pod Label**                               | **Port**      | **Reason**                                            |
|----------|-------------------|---------------------------------------------|---------------|-------------------------------------------------------|
| TCP      | Licensing Service |             | User Supplied | Licensing metrics in usage-based licensing mode |

### Event Gateway pod

| **Type** | **Destination**           | **Pod Label**                               | **Port**      | **Reason**                              |
|----------|---------------------------|---------------------------------------------|---------------|-----------------------------------------|
| TCP      | {{site.data.reuse.eem_name}} | eem.ei.ibm.com/component=<INSTANCE_NAME>            | 3000          | Registering with {{site.data.reuse.eem_name}} |
| TCP      | Kafka                     |             | User Supplied | Configuring gateway for Kafka           |
