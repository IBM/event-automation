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

For the operator and operand pods of {{site.data.reuse.flink_long}}, network policies are not deployed automatically, but can be deployed as described in [Flink network policies](#flink-network-policies).

The following tables provide information about the network connections of {{site.data.reuse.ep_name}} and Flink pods.


### {{site.data.reuse.ep_name}} operator pod

| **Type** | **Origin**                                                                                   | **Port** | **Reason**                  | **Enabled in policy**          |
|----------|----------------------------------------------------------------------------------------------|----------|-----------------------------|--------------------------------|
| TCP      | Anywhere                                                                                     | 8443     | Operator validating webhook | Always                         |

**Note:** To delete the network policy of the {{site.data.reuse.ep_name}} operator:

- On the {{site.data.reuse.openshift_short}}: Modify the subscription that was used to install the operator and set the `DEPLOY_OPERATOR_NETWORK_POLICY` environment variable to `false`. Do this after the initial installation of the operator.
- On other Kubernetes platforms: Install the Helm chart by specifying `--set deployOperatorNetworkPolicy=false`.

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

Network policies are not deployed automatically when installing {{site.data.reuse.flink_long}}. For increased security, you can
deploy the deny-all-ingress policy as shown in [Considerations for ingress](#considerations-for-ingress). In this case,
network policies for Flink pods need to be deployed following these steps:

1. {{site.data.reuse.cncf_cli_login}}
2. Add the following network policy to the namespace where the {{site.data.reuse.flink_long}} is installed.

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
           - protocol: TCP
             port: 443
     policyTypes:
       - Ingress
```

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

If you configure Flink to [export](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/metric_reporters){:target="_blank"}
the [Flink Metrics](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/ops/metrics){:target="_blank"}, the port
configured for emitting metrics needs to be opened by following these steps:

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
