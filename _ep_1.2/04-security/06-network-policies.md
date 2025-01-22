---
title: "Network policies"
excerpt: "Learn about the network policies for Event Processing and Flink pods."
categories: security
slug: network-policies
toc: true
---

## Inbound network connections (ingress)

[Network policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/){:target="_blank"} are used to control inbound connections into pods. These connections can be from pods within the cluster, or from external sources.

When you install an instance of {{site.data.reuse.ep_name}}, the required network policies for {{site.data.reuse.ep_name}} pods are automatically created unless they are disabled through a configuration option. To review the network policies that have been applied:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command to display the installed network policies for a specific namespace:

   ```shell
   kubectl get netpol -n <namespace>
   ```

For the operator and operand pods of {{site.data.reuse.ibm_flink_operator}}, network policies are not deployed automatically, but can be deployed as described in [Flink network policies](#flink-network-policies).

The following tables provide information about the network connections of {{site.data.reuse.ep_name}} and Flink pods.

**Note:** Not all networking solutions support network policies. Creating `NetworkPolicy` resources on clusters with solutions that do not support policies has no effect on restricting traffic.


### {{site.data.reuse.ep_name}} operator pod

| **Type** | **Origin**                                                                                   | **Port** | **Reason**                  | **Enabled in policy**          |
|----------|----------------------------------------------------------------------------------------------|----------|-----------------------------|--------------------------------|
| TCP      | See details below                                                                                     | 8443     | Operator validating webhook | Always                         |

On {{site.data.reuse.openshift_short}}, a network policy is created which restricts ingress communication by using a namespace `matchLabel` that is set to `policy-group.network.openshift.io/host-network: ''`.  If the cluster uses OpenShift SDN in its default network isolation mode, or OVN-Kubernetes as the [Cluster Network Interface (CNI) plug-in](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/){:target="_blank"}, then this network policy restricts ingress to the operator port. This means the operator is only accessible from the host network where the Kubernetes API server (`kube-apiserver`) traffic originates.

On other Kubernetes platforms, a network policy is created that restricts traffic to the individual ports, but does not restrict where that traffic originates from. For increased security, you can delete this auto-generated network policy, and create a more secure network policy that restricts ingress traffic to the operator pod's port to be only from the Kubernetes API server. 

To delete the auto-generated network policy, specify `--set deployOperatorNetworkPolicy=false` when installing the Helm chart. You can then create your own network policy.

If you are using a CNI plug-in that supports network policies, it might be possible to create a network policy that permits traffic from the Kubernetes API server by allowing access to one or more Classless Inter-Domain Routing (CIDR) blocks. For example, if you are using [Calico](https://www.tigera.io/project-calico/){:target="_blank"}, you can specify CIDR blocks for the IPv4 address of the master nodes (`ipv4IPIPTunnelAddr`). You can view CIDR blocks by running and inspecting the output from `kubectl cluster-info dump`.

The following is an example network policy that allows access to a CIDR block:

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ibm-ep-allow-webhook
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
      app.kubernetes.io/instance: ibm-ep-operator
      app.kubernetes.io/name: ibm-event-processing
  policyTypes:
  - Ingress
```

**Note:** On clusters where network policies are not supported, use an alternative configuration specific to your CNI plug-in.

**Note:** By default a network policy is created that restricts traffic to port 8443, but does not restrict where that traffic originates from. For increased security, you can disable this auto-generated network policy and create a more secure network policy that restricts ingress traffic to the operator pod's port to be only from the Kubernetes API server.

To delete the network policy of the {{site.data.reuse.ep_name}} operator:

- On Kubernetes platforms other than OpenShift: install the Helm chart by specifying `--set deployOperatorNetworkPolicy=false`.

- On {{site.data.reuse.openshift_short}}: modify the subscription that was used to install the operator and set the `DEPLOY_OPERATOR_NETWORK_POLICY` environment variable to `false`.  Do this after the initial installation of the operator.

  **By using the OpenShift console**:

  1. {{site.data.reuse.openshift_ui_login}}
  2. Expand `Home` in the navigation menu and click `Search`.
  3. From the `Project` list, select the namespace where you installed the operator.
  4. From the `Resources` list, select `Subscription`.
  5. From the results, select your {{site.data.reuse.ep_name}} subscription by clicking its name.
  6. Click the `YAML` tab.
  7. Scroll to the `spec` section of the YAML file, and add the `DEPLOY_OPERATOR_NETWORK_POLICY` environment variable as follows:

     ```yaml
     spec:
       config:
         env:
           - name: DEPLOY_OPERATOR_NETWORK_POLICY
             value: 'false'
     ```

  8. Click `Save`.

  **By using the command line**:

  1. Find the name of your subscription by running the following command. Replace <OPERATOR_NAMESPACE> with the namespace where you installed the operator.

      ```shell
      kubectl get subscription -n <OPERATOR_NAMESPACE>
      ```

  2. Edit your subscription using the `kubectl edit subscription <SUBSCRIPTION_NAME> -n <OPERATOR_NAMESPACE>` command, and update the spec section to include the `DEPLOY_OPERATOR_NETWORK_POLICY` environment variable.

      ```yaml
      apiVersion: operators.coreos.com/v1alpha1
      kind: Subscription
      metadata:
        name: ibm-eventprocessing
        namespace: my-ep-ns
      spec:
        channel: v1.1
        installPlanApproval: Automatic
        name: ibm-eventprocessing
        source: ibm-operator-catalog
        sourceNamespace: openshift-marketplace
        config:
          env:
            - name: DEPLOY_OPERATOR_NETWORK_POLICY
              value: 'false'
      ```




**Note:** On {{site.data.reuse.openshift_short}}, if the cluster uses OpenShift software-defined networking (SDN) in its default network isolation mode, or OVN-Kubernetes as the [Cluster Network Interface (CNI) plug-in](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/){:target="_blank"}, you can create a more secure network policy that restricts ingress communication to the host-network pods using a namespace `matchLabel` set to `policy-group.network.openshift.io/host-network: ''`

The following is an example network policy that provides this increased security:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-apiserver-ep-webhook
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/instance: ibm-ep-operator
      app.kubernetes.io/name: ibm-event-processing
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
  name: allow-apiserver-ep-webhook
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
      app.kubernetes.io/instance: ibm-ep-operator
      app.kubernetes.io/name: ibm-event-processing
  policyTypes:
  - Ingress
```

**Note:** On clusters where network policies are not supported, use an alternative configuration specific to your CNI plug-in.


### Flink operator pod

| **Type** | **Origin**                                                                                   | **Port** | **Reason**                  |
|----------|----------------------------------------------------------------------------------------------|----------|-----------------------------|
| TCP      | Anywhere                                                                                     | 9443     | Operator validating webhook |

**Note:** The [network policies for Flink](#flink-network-policies) pods are not deployed automatically. They can be manually deployed.

### {{site.data.reuse.ep_name}} pod

| **Type** | **Origin**                           | **Port** | **Reason**            | **Enabled in policy**                                                                                  |
|----------|--------------------------------------|----------|-----------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere                             | 8443     | External access to UI | Always                                                                                                 |
| TCP      | Any pod in {{site.data.reuse.ep_name}} instance | 7000     | Kafka administration  | Always                                                                                     |
| TCP      | Any pod in {{site.data.reuse.ep_name}} instance | 3000     | UI frontend           | Always                                                                                     |
| TCP      | Any pod in {{site.data.reuse.ep_name}} instance | 8888     | UI backend            | Always                                                                                     |

**Note:** To disable the automatic deployment of the instance's network policy, set the `spec.deployNetworkPolicies` option for the instance to `false`.


### Flink operand pods (job and task managers)

| **Type** | **Origin**                           | **Port** | **Reason** |
|----------|--------------------------------------|----------|------------|
| TCP      | Anywhere   | 8081  | REST API inside the Kubernetes cluster  |
| TCP      | Flink pods | 6123  | RPC inside the Flink cluster            |
| TCP      | Flink pods | 6124  | Blob server inside the Flink cluster    |

**Note:** The [network policies for Flink](#flink-network-policies) pods are not deployed automatically. They can be manually deployed.

### Considerations for ingress

Consider the use of a deny-all-ingress network policy to limit communication with all pods in a namespace to only those communications specifically allowed in network policies.  A deny-all network policy is not created by default as it would interfere with other applications
installed in the namespace that do not have the required network policies set to allow inbound communications.

To create a deny-all-ingress network policy you can simply apply the following yaml to your cluster in the relevant namespace(s).

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

**Note:** When deploying the deny-all-ingress network policy, ensure the network policies for Flink and {{site.data.reuse.ep_name}}
are deployed. The network policies for {{site.data.reuse.ep_name}} pods are automatically deployed by default.
The network policies for Flink are not automatically deployed and can be deployed as described in [Flink network policies](#flink-network-policies).


## Outbound network connections (egress)

The following tables provide information about the outbound network connections (egress) initiated by pods in an {{site.data.reuse.ep_name}} installation.

**Note:** Egress policies are not added by default. You must configure the egress policies based on your requirements.


### {{site.data.reuse.ep_name}} pod

| **Type** | **Destination** | **Port**      | **Reason**                                   |
|----------|-----------------|---------------|----------------------------------------------|
| TCP      | Flink           | User Supplied | Submission of Flink jobs                     |
| TCP      | Kafka           | User Supplied | Display topics and define connection details |


### Flink pods

| **Type** | **Destination**    | **Port** | **Reason**                |
|----------|--------------------|----------|---------------------------|
| TCP      | Flink pods | 6123  | RPC inside the Flink cluster         |
| TCP      | Flink pods | 6124  | Blob server inside the Flink cluster |


## Flink network policies

Network policies are not deployed automatically when installing {{site.data.reuse.ibm_flink_operator}}. For increased security, you can
deploy the deny-all-ingress policy as described in [considerations for ingress](#considerations-for-ingress). In this case,
network policies for Flink pods need to be deployed following these steps:

1. {{site.data.reuse.cncf_cli_login}}
2. Add the following network policy to the namespace where the {{site.data.reuse.ibm_flink_operator}} is installed.

  - On {{site.data.reuse.openshift_short}}:

   ```yaml
      kind: NetworkPolicy
      apiVersion: networking.k8s.io/v1
      metadata:
        name: ibm-eventautomation-flink-operator
      spec:
        podSelector:
          matchLabels:
            app.kubernetes.io/instance: ibm-eventautomation-flink-operator
            app.kubernetes.io/name: flink-kubernetes-operator
            name: ibm-eventautomation-flink-operator
        ingress:
          - ports:
              - protocol: TCP
                port: 9443
            from:
              - namespaceSelector:
                  matchLabels:
                    policy-group.network.openshift.io/host-network: ''
        policyTypes:
          - Ingress
   ```

   **Note**: If the cluster uses OpenShift SDN in its default network isolation mode, or OVN-Kubernetes as the [Cluster Network Interface (CNI) plug-in](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/){:target="_blank"}, then this network policy restricts ingress to the operator port. This means the operator is only accessible from the host network where the Kubernetes API server (`kube-apiserver`) traffic originates.
   
  - On Kubernetes platforms using a CNI plug-in that supports network policies, it might be possible to create a network policy that permits traffic from the Kubernetes API server by allowing access to one or more Classless Inter-Domain Routing (CIDR) blocks. For example, if you are using [Calico](https://www.tigera.io/project-calico/){:target="_blank"}, you can specify CIDR blocks for the IPv4 address of the master nodes (`ipv4IPIPTunnelAddr`). You can view CIDR blocks by running and inspecting the output from `kubectl cluster-info dump`.

  The following is an example network policy that allows access to a CIDR block:

  ```yaml
      apiVersion: networking.k8s.io/v1
      kind: NetworkPolicy
      metadata:
        name: ibm-eventautomation-flink-operator
      spec:
        ingress:
        - from:
          - ipBlock:
              cidr: 192.168.78.128/32
          ports:
          - port: 9443
            protocol: TCP
        podSelector:
          matchLabels:
              app.kubernetes.io/instance: ibm-eventautomation-flink-operator
              app.kubernetes.io/name: flink-kubernetes-operator
              name: ibm-eventautomation-flink-operator
        policyTypes:
        - Ingress
  ```

  - On clusters where network policies are not supported, use an alternative configuration specific to your CNI plug-in.

3. Set the following environment variable to store the namespace of your Flink instance. If you are deploying the network policies before installing your Flink instance, ensure the namespace is already created.

   ```shell
   export FLINK_NAMESPACE=<your-namespace>
   ```

4. Run the following command to deploy the network policies for Flink:

   ```yaml
   kubectl apply -n ${FLINK_NAMESPACE} -f - << EOF
   kind: NetworkPolicy
   apiVersion: networking.k8s.io/v1
   metadata:
     name: ibm-eventautomation-flink-jobmanager
   spec:
     podSelector:
       matchLabels:
         app.kubernetes.io/instance: ibm-eventautomation-flink
         app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
         app.kubernetes.io/name: ibm-eventautomation-flink
         component: jobmanager
     ingress:
       - from:
     # Uncomment if the IBM Operator for Apache Flink is in another namespace
     #           - namespaceSelector:
     #               matchLabels:
     #                 kubernetes.io/metadata.name: {{ flink_operator_namespace }}
           - podSelector:
               matchLabels:
                 app.kubernetes.io/instance: ibm-eventautomation-flink
                 app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
                 app.kubernetes.io/name: ibm-eventautomation-flink
                 component: jobmanager
           - podSelector:
               matchLabels:
                 app.kubernetes.io/instance: ibm-eventautomation-flink
                 app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
                 app.kubernetes.io/name: ibm-eventautomation-flink
                 component: taskmanager
           - podSelector:
               matchLabels:
                 app.kubernetes.io/instance: ibm-eventautomation-flink-operator
                 app.kubernetes.io/name: flink-kubernetes-operator
                 name: ibm-eventautomation-flink-operator
         ports:
           - protocol: TCP
             port: 8081
     policyTypes:
       - Ingress
   ---
   kind: NetworkPolicy
   apiVersion: networking.k8s.io/v1
   metadata:
     name: ibm-eventautomation-flink-jobmanager-rpc-blob
   spec:
     podSelector:
       matchLabels:
         app.kubernetes.io/instance: ibm-eventautomation-flink
         app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
         app.kubernetes.io/name: ibm-eventautomation-flink
     ingress:
       - from:
           - podSelector:
               matchLabels:
                 app.kubernetes.io/instance: ibm-eventautomation-flink
                 app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
                 app.kubernetes.io/name: ibm-eventautomation-flink
         ports:
           - protocol: TCP
             port: 6123
           - protocol: TCP
             port: 6124
     policyTypes:
       - Ingress
   ---
   kind: NetworkPolicy
   apiVersion: networking.k8s.io/v1
   metadata:
     name: ibm-eventautomation-flink-jobmanager-stream-authoring
   spec:
     podSelector:
       matchLabels:
         app.kubernetes.io/instance: ibm-eventautomation-flink
         app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
         app.kubernetes.io/name: ibm-eventautomation-flink
         component: jobmanager
     ingress:
       - from:
           - podSelector:
               matchLabels:
                 app.kubernetes.io/component: ibm-ep
                 app.kubernetes.io/managed-by: ibm-ep-operator
         ports:
           - protocol: TCP
             port: 8081
     policyTypes:
       - Ingress
   ---
   kind: NetworkPolicy
   apiVersion: networking.k8s.io/v1
   metadata:
     name: ibm-eventautomation-flink-taskmanager
   spec:
     podSelector:
       matchLabels:
         app.kubernetes.io/instance: ibm-eventautomation-flink
         app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
         app.kubernetes.io/name: ibm-eventautomation-flink
         component: taskmanager
     ingress:
       - from:
           - podSelector:
               matchLabels:
                 app.kubernetes.io/instance: ibm-eventautomation-flink
                 app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
                 app.kubernetes.io/name: ibm-eventautomation-flink
         ports:
           - protocol: TCP
             port: 8081
     policyTypes:
       - Ingress
   EOF
   ```

**Note**: The ports that are used in the previous YAML are the default ones. If you customize Flink ports in the `FlinkDeployment` custom resource,
ensure the ports used in the network policies match the custom ports.

If you configure Flink to [export](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/deployment/metric_reporters){:target="_blank"} the [Flink Metrics](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/ops/metrics){:target="_blank"}, the port
configured for emitting metrics must be opened by following these steps:

1. {{site.data.reuse.cncf_cli_login}}
2. Set the following environment variable to hold the namespace of the Flink instance. If deploying the network policies before
installing the Flink instance, ensure the namespace is already created.  

    ```shell
    export FLINK_NAMESPACE=<your-namespace>
    ```

3. Set the following environment variable to hold the port you configured for emitting metrics.  

   ```shell
   export METRICS_PORT_NUMBER=<your-port>
   ```

4. Run the following command to deploy the network policy for metrics exporter:

   ```yaml
   kubectl apply -n ${FLINK_NAMESPACE} -f - << EOF
   kind: NetworkPolicy
   apiVersion: networking.k8s.io/v1
   metadata:
     name: ibm-eventautomation-flink-jobmanager-monitoring
   spec:
     podSelector:
       matchLabels:
         app.kubernetes.io/instance: ibm-eventautomation-flink
         app.kubernetes.io/managed-by: ibm-eventautomation-flink-operator
         app.kubernetes.io/name: ibm-eventautomation-flink
         component: jobmanager
     ingress:
       - ports:
           - protocol: TCP
             port: ${METRICS_PORT_NUMBER}
     policyTypes:
       - Ingress
   EOF
   ```
