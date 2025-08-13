---
title: "Network policies"
excerpt: "Learn about the network connections allowed for Event Endpoint Management."
categories: security
slug: network-policies
toc: true
---

## Inbound network connections (ingress)
{: #inbound-network-connections-ingress}

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
{: #inbound-event-endpoint-management-operator-pod}

| **Type** | **Origin**                                                                                   | **Port** | **Reason**                  | **Enabled in policy**                                                                                  |
|----------|----------------------------------------------------------------------------------------------|----------|-----------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      |  Anywhere                                                                               | 8443     | Operator validating webhook | Always                                                                                                 |

**Note:** By default a network policy is created that restricts traffic to port 8443, but does not restrict where that traffic originates from. For increased security, you can disable this auto-generated network policy and create a more secure network policy that restricts ingress traffic to the operator pod's port to be only from the Kubernetes API server.

To delete the network policy of the {{site.data.reuse.eem_name}} operator:

- On Kubernetes platforms other than OpenShift: install the Helm chart by specifying `--set deployOperatorNetworkPolicy=false`.

- On {{site.data.reuse.openshift_short}}: modify the subscription that was used to install the operator and set the `DEPLOY_OPERATOR_NETWORK_POLICY` environment variable to `false`.  Do this after the initial installation of the operator.

  **By using the OpenShift console**:

  1. {{site.data.reuse.openshift_ui_login}}
  2. Expand `Home` in the navigation menu and click `Search`.
  3. From the `Project` list, select the namespace where you installed the operator.
  4. From the `Resources` list, select `Subscription`.
  5. From the results, select your {{site.data.reuse.eem_name}} subscription by clicking its name.
  6. Click the `YAML` tab.
  7. Scroll to the `spec` section of YAML file, and add the `DEPLOY_OPERATOR_NETWORK_POLICY` environment variable as follows:

     ```yaml
     spec:
       config:
         env:
           - name: DEPLOY_OPERATOR_NETWORK_POLICY
             value: 'false'
     ```

  8. Click `Save`.

  **By using the command line**:

  1. Find the name of your subscription by running the following command. Replace `<OPERATOR_NAMESPACE>` with the namespace where you installed the operator.
     ```shell
     kubectl get subscription -n <OPERATOR_NAMESPACE>
     ```
    
  2. Edit your subscription by using the `kubectl edit subscription <SUBSCRIPTION_NAME> -n <OPERATOR_NAMESPACE>` command, and update the `spec` section to include the `DEPLOY_OPERATOR_NETWORK_POLICY` environment variable.

     ```yaml
     apiVersion: operators.coreos.com/v1alpha1
     kind: Subscription
     metadata:
       name: eem
       namespace: my-eem-ns
     spec:
       channel: v11.4
       installPlanApproval: Automatic
       name: ibm-eventendpointmanagement
       source: eem-operator-catalog
       sourceNamespace: openshift-marketplace
       config:
         env:
           - name: DEPLOY_OPERATOR_NETWORK_POLICY
             value: 'false'
     ```



**Note:** On {{site.data.reuse.openshift_short}}, if the cluster uses OpenShift software-defined networking (SDN) in its default network isolation mode, or OVN-Kubernetes as the [Cluster Network Interface (CNI) plug-in](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/){:target="_blank"}, you can create a more secure network policy that restricts ingress communication to the host-network pods by using a namespace `matchLabel` set to `policy-group.network.openshift.io/host-network: ''`

The following is an example network policy that provides this increased security:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-apiserver-eem-webhook
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/instance: ibm-eem-operator
      app.kubernetes.io/name: ibm-event-endpoint-management
  policyTypes:
  ingress:
    - ports:
        - protocol: TCP
          port: 8443
      from:
        - namespaceSelector:
            matchLabels:
              policy-group.network.openshift.io/host-network: ''
  policyTypes:
    - Ingress
```

If you are using a different CNI plug-in that supports network policies, it might be possible to create a network policy that permits traffic from the Kubernetes API server by allowing access to one or more Classless Inter-Domain Routing (CIDR) blocks. For example, if you are using [Calico](https://www.tigera.io/project-calico/){:target="_blank"}, you can specify CIDR blocks for the IPv4 addresses of the master nodes (`ipv4IPIPTunnelAddr`). You can view CIDR blocks by running and inspecting the output from `kubectl cluster-info dump`.

The following is an example network policy that allows access to a CIDR block:

```yaml
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

**Note:** On clusters where network policies are not supported, use an alternative configuration specific to your CNI plug-in.


### {{site.data.reuse.eem_manager}} pod
{: #inbound-manager-pod}

| **Type** | **Origin**           | **Port** | **Reason**            | **Enabled in policy**                                                                                  |
|----------|----------------------|----------|-----------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere             | 3000     | External access to UI | Always                                                                                                 |
| TCP      | Anywhere             | 8081     | Readiness probe       | Always                                                                                                 |

**Note:** To stop the automatic deployment of the instance's network policy, set the  `spec.deployNetworkPolicies` option for the instance to `false`.


### {{site.data.reuse.egw}} pod
{: #inbound-gateway-pod}

| **Type** | **Origin**           | **Port** | **Reason**                 | **Enabled in policy**                                                                                  |
|----------|----------------------|----------|----------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere             | 8092     | Kafka client communication | Always                                                                                                 |

**Note:** To stop the automatic deployment of the instance's network policy, set the `spec.deployNetworkPolicies` option for the instance to `false`. 


### Considerations for ingress
{: #inbound-considerations-for-ingress}

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
{: #outbound-network-connections-egress}

The following tables provide information about the outbound network connections (egress) initiated by pods in an {{site.data.reuse.eem_name}} installation.

**Note:** Egress policies are not added by default. You must configure the egress policies based on your requirements.


### {{site.data.reuse.eem_name}} operator pod
{: #outbound-event-endpoint-management-operator-pod}

| **Type** | **Destination**                    | **Pod Label**                            | **Port** | **Reason**      |
|----------|------------------------------------|------------------------------------------|----------|-----------------|
| TCP      | {{site.data.reuse.eem_manager}} instance | eem.ei.ibm.com/component=<INSTANCE_NAME> | 8081     | Readiness check |

### {{site.data.reuse.eem_manager}} pod
{: #outbound-manager-pod}

| **Type** | **Destination**   | **Pod Label**                               | **Port**      | **Reason**                                            |
|----------|-------------------|---------------------------------------------|---------------|-------------------------------------------------------|
| TCP      | Licensing Service |             | User Supplied | Licensing metrics in usage-based licensing mode |

### {{site.data.reuse.egw}} pod
{: #outbound-gateway-pod}

| **Type** | **Destination**           | **Pod Label**                               | **Port**      | **Reason**                              |
|----------|---------------------------|---------------------------------------------|---------------|-----------------------------------------|
| TCP      | {{site.data.reuse.eem_name}} | eem.ei.ibm.com/component=<INSTANCE_NAME>            | 3000          | Registering with {{site.data.reuse.eem_name}} |
| TCP      | Kafka                     |             | User Supplied | Configuring gateway for Kafka           |
