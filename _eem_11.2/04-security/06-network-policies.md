---
title: "Network policies"
excerpt: "Learn about the network connections allowed for Event Endpoint Management."
categories: security
slug: network-policies
toc: true
---

## Inbound network connections (ingress)

[Network policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/){:target="_blank"} are used to control inbound connections into pods. These connections can be from pods within the cluster, or from external sources.

When you install an instance of the {{site.data.reuse.eem_manager}}, the required network policies will be automatically created unless they are disabled through configuration options. To review the network policies that have been applied:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to display the installed network policies for a specific namespace:\\

   ```shell
   kubectl get netpol -n <namespace>
   ```

The following tables provide information about the network policies that are applicable to each pod within the {{site.data.reuse.eem_manager}} instance. Information about how to stop deployment of the network policies are included in the notes after each table.

**Note:** Not all networking solutions support network policies. Creating `NetworkPolicy` resources on clusters with solutions that do not support policies has no effect on restricting traffic.


### {{site.data.reuse.eem_name}} operator pod

| **Type** | **Origin**                                                                                   | **Port** | **Reason**                  | **Enabled in policy**                                                                                  |
|----------|----------------------------------------------------------------------------------------------|----------|-----------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      |  See details below                                                                               | 8443     | Operator validating webhook | Always                                                                                                 |

On {{site.data.reuse.openshift_short}}, a network policy is created which restricts ingress communication by using a namespace `matchLabel` that is set to `policy-group.network.openshift.io/host-network: ''`.  If the cluster uses OpenShift SDN in its default network isolation mode, or OVN-Kubernetes as the [Cluster Network Interface (CNI) plugin](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/){:target="_blank"}, then this network policy restricts ingress to the operator port. This means the operator is only accessible from the host network where the Kubernetes API server (`kube-apiserver`) traffic originates.  

On other Kubernetes platforms, a network policy is created that restricts traffic to the individual ports, but does not restrict where that traffic originates from. For increased security, you can delete this auto-generated network policy, and create a more secure network policy that restricts ingress traffic to the operator pod's port to be only from the Kubernetes API server. 

To delete the auto-generated network policy, specify `--set deployOperatorNetworkPolicy=false` when installing the Helm chart. You can then create your own network policy.

If you are using a CNI plugin that supports network policies, it might be possible to create a network policy that permits traffic from the Kubernetes API server by allowing access to one or more Classless Inter-Domain Routing (CIDR) blocks. For example, if you are using [Calico](https://www.tigera.io/project-calico/){:target="_blank"}, you can specify CIDR blocks for the IPv4 address of the master nodes (`ipv4IPIPTunnelAddr`). You can view CIDR blocks by running and inspecting the output from `kubectl cluster-info dump`.

The following is an example network policy that allows access to a CIDR block:

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-apiserver-eem-webhook
spec:
  ingress:
  - from:
    - ipBlock:
        cidr: 192.168.78.128/32
    ports:
    - port: 8443
      protocol: TCP
  podSelector:
    matchLabels:
      app.kubernetes.io/instance: ibm-eem-operator
      app.kubernetes.io/name: ibm-event-endpoint-management
  policyTypes:
  - Ingress
```

**Note:** On clusters where network policies are not supported, use an alternative configuration specific to your CNI plugin.

**Note:** To delete the network policy of the {{site.data.reuse.eem_name}} operator:
- On the {{site.data.reuse.openshift_short}}: modify the subscription that was used to install the operator and set the `DEPLOY_OPERATOR_NETWORK_POLICY` environment variable to `false`.  Do this after the initial installation of the operator.
- On other Kubernetes platforms: install the Helm chart by specifying `--set deployOperatorNetworkPolicy=false`.

### {{site.data.reuse.eem_manager}} pod

| **Type** | **Origin**           | **Port** | **Reason**            | **Enabled in policy**                                                                                  |
|----------|----------------------|----------|-----------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere             | 3000     | External access to UI | Always                                                                                                 |
| TCP      | Anywhere             | 8081     | Readiness probe       | Always                                                                                                 |

**Note:** To stop the automatic deployment of the instance's network policy, set the  `spec.deployNetworkPolicies` option for the instance to `false`.


### {{site.data.reuse.egw}} pod

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
| TCP      | {{site.data.reuse.eem_manager}} instance | eem.ei.ibm.com/component=<INSTANCE_NAME> | 8081     | Readiness check |

### {{site.data.reuse.eem_manager}} pod

| **Type** | **Destination**   | **Pod Label**                               | **Port**      | **Reason**                                            |
|----------|-------------------|---------------------------------------------|---------------|-------------------------------------------------------|
| TCP      | Licensing Service |             | User Supplied | Licensing metrics in usage-based licensing mode |

### {{site.data.reuse.egw}} pod

| **Type** | **Destination**           | **Pod Label**                               | **Port**      | **Reason**                              |
|----------|---------------------------|---------------------------------------------|---------------|-----------------------------------------|
| TCP      | {{site.data.reuse.eem_name}} | eem.ei.ibm.com/component=<INSTANCE_NAME>            | 3000          | Registering with {{site.data.reuse.eem_name}} |
| TCP      | Kafka                     |             | User Supplied | Configuring gateway for Kafka           |
