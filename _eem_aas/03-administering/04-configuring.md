---
title: "Advanced gateway configuration"
excerpt: "Configure advanced settings on your gateway."
categories: admin
slug: configuring
toc: true
---

## Setting environment variables
{: #setting-environment-variables}

You can configure the {{site.data.reuse.egw}} by setting environment variables. On Kubernetes Deployment {{site.data.reuse.egw}}s you specify the environment variables in a template override (`env`) which specifies one or more name-value pairs. On Docker {{site.data.reuse.egw}}s, add the environment variable to your Docker `run` command, for example: `-e <variable name>`.

**Important:** Keep a backup of your Docker `run` arguments or Kubernetes Deployment YAML. Update this backup when you make configuration changes. 

The format for Kubernetes Deployment {{site.data.reuse.egw}} instances is:

```yaml
spec:
  template:
    spec:
      containers:
        - name: egw
          env:
            - name: <name>
              value: <value>
```

Where:

- `<name>` is the specification that you want to configure. For example: `TRACE_SPEC` (to enable trace logging).
- `<value>` is the value to configure the specification. For example: `debug`.


## Configuring {{site.data.reuse.egw}} security
{: #configuring-gateway-security}

You can configure several settings that can protect the {{site.data.reuse.egw_short}} from uncontrolled resource consumption such as excessive memory usage, or connection exhaustion. Enable these features to help you ensure that the gateway remains available and responsive. 

The following table lists the parameters that are available in the Event Gateway Kubernetes Deployment `spec.security` section. All parameters are optional. 

| Parameter | Description | Default |
| ------    | --------| ---------|
| `spec.security.connection.closeDelayMs` | The minimum delay in milliseconds after you close a connection. This helps prevent spam. | 8000 |
| `spec.security.connection.closeJitterMs` | Additional delay in milliseconds after you close a connection. This helps prevent attacks. | 4000 |
| `spec.security.connection.perSubLimit` | The maximum allowed TCP connections for each subscription. | -1 (no limit) |
| `spec.security.authentication.maxRetries` | The maximum number of failed authentication attempts after which further attempts are blocked. | -1 (no limit) |
| `spec.security.authentication.retryBackoffMs` | The backoff time in milliseconds between consecutive failed authentication attempts. | 0 |
| `spec.security.authentication.lockoutPeriod` | The duration in seconds while the account is locked after an unsuccessful authentication attempt. | 0 |
| `spec.security.request.maxSizeBytes` | The maximum size allowed for the request payload in bytes. | -1 (no limit) |
{: caption="Table 1. Parameter description" caption-side="bottom"}

Sample YAML that shows the default values of the `spec.security` properties, a value of -1 represents no limit:

```yaml
spec:
  security:
    connection:
      closeDelayMs: 8000
      closeJitterMs: 4000
      perSubLimit: -1
    authentication:
      maxRetries: -1
      retryBackoffMs: 0
      lockoutPeriod: 0
    request:
      maxSizeBytes: -1
```

For the Docker gateway, the equivalent environment variable names are:

```
CONNECTION_CLOSE_DELAY_MS
CONNECTION_CLOSE_JITTER_MS
MAX_CONNECTIONS_PER_SUBSCRIPTION
AUTHN_MAX_RETRIES
AUTHN_BACKOFF_DELAY_INCREMENT_MILLIS
AUTHN_LOCKOUT_PERIOD_SECONDS
KAFKA_MAX_MESSAGE_LENGTH
```

<!-- might be better to combine these properties and their definitions in a single table that covers k8s, cr, and docker. As it stands the docker gateway user has to figure out what the equivalent cr property is to see the definition. -->

Add these properties as arguments to your Docker `run` command, for example: `docker run ... -e MAX_CONNECTIONS_PER_SUBSCRIPTION=10 ...`

## Exporting metrics with OpenTelemetry 
{: #exporting-metrics-with-opentelemetry}

To configure an {{site.data.reuse.egw}} instance to emit metrics, you configure the `openTelemetry` section on the associated Kubernetes Deployment. On [Docker](../event-gateways) gateways, set the OpenTelemetry properties as arguments in your Docker `run` command, for example: `-e <property name>`.

Example of OpenTelemetry configuration in a Kubernetes Deployment {{site.data.reuse.egw}}:

  ```yaml
  openTelemetry:
    endpoint: 'https://my.collector.endpoint:4317'
    protocol: grpc
    interval: 30000
    tls:
      secretName: my-mtls-secret
      clientKey: tls.key
      clientCertificate: tls.crt 
      trustedCertificate:
        secretName: my-collector-endpoint-ca-secret
        certificate: ca.crt
    instrumentations:
      - name: netty
        enabled: true
      - name: runtime-telemetry
        enabled: true
  ```

Where:

`endpoint`: The server endpoint where the OpenTelemetry data is sent. This is a required property when you configure the OpenTelemetry section and the specified endpoint must include the protocol, `http://` or `https://`.

`protocol`: The communication protocol to use for communicating to the endpoint. Example values are `grpc` and `http/protobuf`, the default value is `grpc`.

`interval`: The interval in milliseconds between the start of two export attempts. The default value is 30000, which indicates that metrics export at 30-second intervals.

`tls.secretName`: A secret that contains the client's certificates to use for mutualTLS (mTLS).

`tls.clientKey`: The key in the secret that holds the encoded client key, for example `tls.key`. The certificate must be created with PKCS8 encoding.

`tls.clientCertificate`: The key in the secret that holds the PKCS8 encoded client certificate/chain, for example `tls.crt`. The certificate must be created with PKCS8 encoding.

`tls.trustedCertificate.secretName`: A secret that contains a CA certificate to trust to verify the endpoint server's certificate.

`tls.trustedCertificate.certificate`: The key in the secret that holds the CA certificate to trust, for example `ca.crt`.

`instrumentations`: Here you can define additional instrumentations to enable. {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} metrics are enabled by default when OpenTelemetry is enabled.

  - `name`: An instrumentation name. This name is then added into an environment variable of the format `OTEL_INSTRUMENTATION_[NAME]_ENABLED`, for a list of instrumentation names, see [Suppressing specific instrumentation](https://opentelemetry.io/docs/zero-code/java/agent/disable/#suppressing-specific-agent-instrumentation){:target="_blank"}.  You do not need to specify the environment variable, only the instrumentation name.

  - `enabled`: A boolean indicating whether to enable or disable the specified instrumentation.

For [Docker](../event-gateways) gateways, the OpenTelemetry properties are defined in `-e` arguments to the Docker `run` command: 

  ```
  OTEL_EXPORTER_OTLP_PROTOCOL
  OTEL_EXPORTER_OTLP_ENDPOINT
  OTEL_METRIC_EXPORT_INTERVAL
  OTEL_EXPORTER_OTLP_HEADERS
  OTEL_INSTRUMENTATION_[NAME]_ENABLED
  OTEL_EXPORTER_OTLP_CLIENT_KEY
  OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE
  OTEL_EXPORTER_OTLP_CERTIFICATE
  ```

  To enable OpenTelemetry on the Docker gateway, you must also set these arguments:

  ```
  OTEL_LOGS_EXPORTER="none"
  OTEL_TRACES_EXPORTER="none"
  IBM_JAVA_OPTIONS="-javaagent:/opt/ibm/eim-backend/lib/opentelemetry-javaagent.jar"
  ```

<!-- might be better to combine these properties and their definitions in a single table that covers k8s, cr, and docker. As it stands the docker gateway user has to figure out what the equivalent cr property is to see the definition. -->

See [metrics reference](#opentelemetry-metrics-reference) to find out more about the metrics that are emitted.

OpenTelemetry is disabled by default. When it is enabled, all agent instrumentation other than {{site.data.reuse.egw}} remains disabled unless individually enabled. Further customization is possible with environment variables:


The following additional OpenTelemetry metric environment variables are set by default:

- `OTEL_SERVICE_NAME = "EEM Manager - <EventEndpointManagement instance name>"`
- `OTEL_SERVICE_NAME = "EEM Gateway - <EventGateway gateway-group-name/gateway-group-id>"`

If you want to add additional configuration for the OpenTelemetry agent, then you can [add environment variables](#setting-environment-variables) to the custom resource.


### Example: Exporting metrics from a Kubernetes Deployment {{site.data.reuse.egw}}

```yaml
spec:
  license:
  openTelemetry:
    endpoint: 'https://some.collector.endpoint:4317'
    tls:
      trustedCertificate:
        secretName: mysecret
        certificate: ca.crt
```

### OpenTelemetry metrics reference
{: #opentelemetry-metrics-reference}

The following table shows the OpenTelemetry metrics that are emitted by the {{site.data.reuse.egw}}:

  | Metric | Type |  Description |
  | ----------- | ----------- | ----------- |
  | login_success | LongCounter | Counts the number of successful client logins to the {{site.data.reuse.egw}}. |
  | login_failed | LongCounter | Counts the number of failed client logins to the {{site.data.reuse.egw}}. |
  | topic_authz_failed | LongCounter | Counts the number of topic authorization failures that are caused by clients that use the {{site.data.reuse.egw}}. |
  | connected_clients | LongUpDownCounter | Total number of clients connected to this gateway at a specific point in time. |
  | consumers_msgs | LongCounter | Counts the number of messages that clients consume through the {{site.data.reuse.egw}}. |
  | consumers_bytes | LongCounter | Counts the number of bytes that clients consume through the {{site.data.reuse.egw}}. |
  | producers_bytes | LongCounter | Counts the number of messages that clients produce through the {{site.data.reuse.egw}}. |
  | producers_msgs | LongCounter | Counts the number of bytes that clients produce through the {{site.data.reuse.egw}}. |
  | quota_delay | LongUpDownCounter | Available if the [quota enforcement control](../../about/key-concepts#controls) is enabled. It provides the delays that are applied to ensure that quota limitations are maintained per client by using metadata attributes. |


## Configuring {{site.data.reuse.egw}} network policies on a Kubernetes Deployment
{: #gateway-network-policies}

The Kubernetes Deployment of the {{site.data.reuse.egw}} supports configuration of inbound and outbound network policies.

### Inbound network connections (ingress)
{: #ingress}

Network policies are used to control inbound connections to your {{site.data.reuse.egw}} pod. These connections can be from pods within the cluster, or from external sources.

When you install the {{site.data.reuse.egw}}, the required network policies are automatically created unless they are disabled through configuration options. 

To review the active network policies, run the following command:

   ```shell
   kubectl get netpol -n <gateway namespace>
   ```


The following table provides information about the network policies that are applicable to the {{site.data.reuse.egw}} pod. 

**Note:** Not all networking solutions support network policies. Creating `NetworkPolicy` resources on clusters with solutions that do not support policies has no effect on restricting traffic.

| **Type** | **Origin**           | **Port** | **Reason**                 | **Enabled in policy**                                                                                  |
|----------|----------------------|----------|----------------------------|--------------------------------------------------------------------------------------------------------|
| TCP      | Anywhere             | 8092     | Kafka client communication | Always                                                                                                 |

**Note:** To stop the automatic deployment of the {{site.data.reuse.egw}}'s network policy, set `spec.deployNetworkPolicies` in the {{site.data.reuse.egw}} Kubernetes Deployment YAML to `false`.


### Considerations for ingress
{: #considerations-for-ingress}

Consider the use of a deny-all-ingress network policy to limit communication with all pods in a namespace to only those communications specifically allowed in network policies. A deny-all network policy is not created by default as it would interfere with other applications that are installed in the namespace that do not have the required network policies set to allow inbound communications. 

To create a deny-all-ingress network policy, apply the following YAML to your cluster in the namespaces where you installed {{site.data.reuse.egw}}s.

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

### Ingress default settings
{: ingress-default-settings}

If you are not running on the {{site.data.reuse.openshift}}, the following ingress defaults are set unless overridden:

- `class`: The ingress class name is set by default to `nginx`. Set the `class` field on endpoints to use a different ingress class.

- `annotations`: The following annotations are set by default on generated ingress endpoints:

```yaml
  ingress.kubernetes.io/ssl-passthrough: 'true'
  nginx.ingress.kubernetes.io/backend-protocol: HTTPS
  nginx.ingress.kubernetes.io/ssl-passthrough: 'true'
```

Ingress annotations can be overridden by specifying an alternative set of annotations on an endpoint. The following code snippet is an example of overriding the annotations set on a gateway endpoint ingress.

```yaml
spec:
  endpoints:
    - name: gateway
      host: my-gateway.mycompany.com
      annotations:
        some.annotation.foo: "true"
        some.other.annotation: value
```

### Outbound network connections (egress)
{: #outbound-network-connections}

The following table provides information about the outbound network connections (egress) initiated by the {{site.data.reuse.egw}} pods.

**Note:** Egress policies are not added by default. Configure the egress policies based on your requirements.

| **Type** | **Destination**           | **Pod Label**                               | **Port**      | **Reason**                              |
|----------|---------------------------|---------------------------------------------|---------------|-----------------------------------------|
| TCP      | {{site.data.reuse.eem_name}} | eem.ei.ibm.com/component=<INSTANCE_NAME>            | 3000          | Registering with {{site.data.reuse.eem_name}} |
| TCP      | Kafka                     |             | User Supplied | Configuring gateway for Kafka           |


### Configuring external access to the Kubernetes Deployment {{site.data.reuse.egw}}
{: #configuring-external-access-to-the-k8s-gateway}

A Kafka client implementation might require access to at least one route or ingress for each broker that the client is expected to connect to. To present a route or an ingress, you can manually configure the number of routes that are associated with an {{site.data.reuse.egw}} in the Kubernetes Deployment.

For example, you can set the number of routes in the `spec.maxNumKafkaBrokers` field of your {{site.data.reuse.egw}} Kubernetes Deployment, as shown in the following code snippet:

```yaml
spec:
  maxNumKafkaBrokers: 3
```

If `spec.maxNumKafkaBrokers` is not specified, then the default (`20`) is used. The value of the `spec.maxNumKafkaBrokers` must be greater than or equal to the total number of brokers managed by this {{site.data.reuse.egw}}.


## Uninstalling an {{site.data.reuse.egw}} instance

### Uninstalling a Docker {{site.data.reuse.egw}}
{: #uninstall-docker-gateway}

To remove a Docker {{site.data.reuse.egw}}:

1. Run the following command to list the running containers:

   ```
   docker ps
   ```

2. Locate the gateway in the list and stop the gateway container:

   ```shell
   docker stop <container_id>
   ```

3. After the container is stopped, delete the gateway container and image:

   ```shell
   docker rm <gateway_container>
   ```

   ```shell
   docker rmi <gateway_image_name>
   ```

### Uninstall a Kubernetes Deployment {{site.data.reuse.egw}}
{: #uninstall-k8s-gateway}

To delete a Kubernetes Deployment {{site.data.reuse.egw}} instance:

1. Delete the deployment:

   ```shell
   kubectl -n <namespace> delete <gateway-deployment>
   ```

2. Delete the secret associated with the gateway:

   ```shell
   kubectl -n <namespace> delete <gateway-secret>
   ```

   The secret has the same name as the gateway deployment.

3. Delete any associated Kubernetes Services and Ingresses that you created for your {{site.data.reuse.egw}} instance.

   ```shell
   kubectl -n <namespace> delete <service/ingress>
   ```