---
title: "Exporting metrics with OpenTelemetry"
excerpt: "Configure Event Endpoint Management to export OpenTelemetry data."
categories: installing
slug: export-metrics
toc: true
---

OpenTelemetry is disabled by default. When it is enabled, all agent instrumentation other than {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} metrics remains disabled unless individually enabled.

See [the metrics reference](../../reference/metrics-reference) to find out more about the metrics that are emitted.

## Exporting metrics from the {{site.data.reuse.eem_manager}}
{: #manager-export}

To configure an {{site.data.reuse.eem_manager}} to emit OpenTelemetry data, you configure the `openTelemetry` section on the associated custom resource.

```yaml
  openTelemetry:
    endpoint: 'https://my.collector.endpoint.example.com:4317'
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

   `interval`: The interval in milliseconds between the start of two metrics export attempts. The default value is 30000, which indicates that metrics export at 30-second intervals.

   `tls.secretName`: A secret that contains the client's certificates to use for mutualTLS (mTLS).

   `tls.clientKey`: The key in the secret that holds the encoded client key, for example `tls.key`. The certificate must be created with PKCS8 encoding.

   `tls.clientCertificate`: The key in the secret that holds the PKCS8 encoded client certificate/chain, for example `tls.crt`. The certificate must be created with PKCS8 encoding.

   `tls.trustedCertificate.secretName`: A secret that contains a CA certificate to trust to verify the endpoint server's certificate.

   `tls.trustedCertificate.certificate`: The key in the secret that holds the CA certificate to trust, for example `ca.crt`.

   `instrumentations`: Here you can define additional instrumentations to enable. {{site.data.reuse.eem_manager}} metrics are enabled by default when OpenTelemetry is enabled.

   - `name`: An instrumentation name. This name is then added into an environment variable of the format `OTEL_INSTRUMENTATION_[NAME]_ENABLED`, for a list of instrumentation names, see [Suppressing specific instrumentation](https://opentelemetry.io/docs/zero-code/java/agent/disable/#suppressing-specific-agent-instrumentation){:target="_blank"}.  You do not need to specify the environment variable, only the instrumentation name.

   - `enabled`: A boolean indicating whether to enable or disable the specified instrumentation.

If you want to add additional configuration for the OpenTelemetry agent, then you can [set environment variables](../advancedconfig#setting-manager-env-vars).

The following additional OpenTelemetry environment variable is set by default:

- `OTEL_SERVICE_NAME = "EEM Manager - <EventEndpointManagement instance name>"`

### Tracing API calls in the {{site.data.reuse.eem_manager}}
{: #tracing-api-calls-in-the-event-manager}

To enable traces from the {{site.data.reuse.eem_manager}}, first configure OpenTelemetry. Enable record tracing by adding the `tracesEnablement` configuration to the `spec.manager.openTelemetry` section of the `EventGateway` custom resource:

```yaml
  openTelemetry:
    tracesEnablement:
      - name: <trace.name>
        enabled: true
```

Where `trace.name` can be one of the following values: 

- `httpInfo`: emits otel spans for calls within the {{site.data.reuse.eem_manager}} with the status code between 100-199
- `httpSuccess`: emits otel spans for calls within the {{site.data.reuse.eem_manager}} with the status code between 200-299
- `httpRedirect`: emits otel spans for calls within the {{site.data.reuse.eem_manager}} with the status code between 300-399
- `httpClientError`: emits otel spans for calls within the {{site.data.reuse.eem_manager}} with the status code between 400-499
- `httpServerError`: emits otel spans for calls within the {{site.data.reuse.eem_manager}} with the status code between 500-599

You can put multiple entries in to the `tracesEnablement` array to see multiple ranges of status code in your distributed tracing tool such as [Jaeger](https://www.jaegertracing.io/){:target="_blank"}.

If you want only traces from the {{site.data.reuse.eem_manager}}, but not metrics, then disable metrics as follows:

```yaml
  openTelemetry:
    metricsEnablement:
      - name: manager
        enabled: false
```


### Example: Exporting metrics from an {{site.data.reuse.eem_manager}}
{: #example-exporting-metrics-from-an-event-manager}

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    openTelemetry:
      endpoint: 'https://some.collector.endpoint:4317'
      tls:
        trustedCertificate:
          secretName: mysecret
          certificate: ca.crt
# ... 
```



### Example: Adding additional OpenTelemetry exporter environment variables on an {{site.data.reuse.eem_manager}}
{: #example-adding-additional-opentelemetry-exporter-environment-variables-on-an-event-manager}

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    openTelemetry:
      endpoint: 'https://some.collector.endpoint:4317'
      tls:
        trustedCertificate:
          secretName: mysecret
          certificate: ca.crt
    template:
        pod:
          spec:
            containers:
              - env:
                  - name: OTEL_EXPORTER_OTLP_HEADERS
                    value: "api-key=key,other-config-value=value"
# ... 
```


## Exporting metrics from the {{site.data.reuse.egw}}
{: #gateway-export}

Set the OTEL properties to enable your {{site.data.reuse.egw}} instance to send OpenTelemetry data.

The [gateway properties reference](../../reference/gateway-properties#otel-config) lists all the OTEL properties.

### Configuring OTEL properties on a Kubernetes Deployment {{site.data.reuse.egw}}
{: #otel-config-gway}

To enable OTEL metrics, set `egw.enable.otel.metrics="true"` in your {{site.data.reuse.egw}} [ConfigMap](../advancedconfig#config-map).

Set the OTEL configuration by using environment variables in your gateway CR or Kubernetes Deployment. For example,

```yaml
spec:
  template:
    pod:
      spec:
        containers:
          - name: egw
            env:
              - name: OTEL_EXPORTER_OTLP_ENDPOINT
                value: <value>
```

### Configuring OTEL properties on an operator-managed {{site.data.reuse.egw}}
{: #otel-opman}

To enable OTEL metrics on an operator-managed {{site.data.reuse.egw}}, update the `spec.openTelemetry` section of the custom resource.

```yaml
openTelemetry:
  endpoint: 'https://my.collector.endpoint.example.com:4317'
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

`endpoint`: The server endpoint where the OpenTelemetry data is sent. This is a required property when you configure the OpenTelemetry section, and the specified endpoint must include the protocol, `http://` or `https://`.

`protocol`: The communication protocol to use for communicating with the endpoint. Example values are `grpc` and `http/protobuf`, the default value is `grpc`.

`interval`: The interval in milliseconds between the start of two metrics export attempts. The default value is 30000 (30 second intervals).

`tls.secretName`: A secret that contains the client's certificates to use for mutualTLS (mTLS).

`tls.clientKey`: The key in the secret that contains the encoded client key, for example `tls.key`. The certificate must be created with PKCS8 encoding.

`tls.clientCertificate`: The key in the secret that contains the PKCS8 encoded client certificate chain, for example `tls.crt`. The certificate must be created with PKCS8 encoding.

`tls.trustedCertificate.secretName`: A secret that contains a CA certificate to trust to verify the endpoint server's certificate.

`tls.trustedCertificate.certificate`: The key in the secret that contains the CA certificate to trust, for example `ca.crt`.

`instrumentations`: Section for defining additional instrumentation to enable. {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} metrics are enabled by default when OpenTelemetry is enabled.

- `name`: An instrumentation name. This name is then added to an environment variable with the format `OTEL_INSTRUMENTATION_[NAME]_ENABLED`. For a list of instrumentation names, see [suppressing specific instrumentation](https://opentelemetry.io/docs/zero-code/java/agent/disable/#suppressing-specific-agent-instrumentation){:target="_blank"}.  You do not need to specify the environment variable, only the instrumentation name.

- `enabled`: A boolean indicating whether to enable or disable the specified instrumentation.

If you want to add additional configuration for the OpenTelemetry agent, then you can add environment variables to the custom resource.

The following additional OpenTelemetry environment variables are set by default:

- `OTEL_SERVICE_NAME = "EEM Manager - <EventEndpointManagement instance name>"`
- `OTEL_SERVICE_NAME = "EEM Gateway - <EventGateway gateway-group-name/gateway-group-id>"`

### Configuring OTEL properties on Docker {{site.data.reuse.egw}}s
{: #otel-config-docker-gway}


For [Docker](../install-gateway#remote-gateways) gateways, the OpenTelemetry properties are defined in the `-e` arguments for the Docker `run` command: 

```
OTEL_EXPORTER_OTLP_PROTOCOL
OTEL_EXPORTER_OTLP_ENDPOINT
OTEL_METRIC_EXPORT_INTERVAL
OTEL_EXPORTER_OTLP_HEADERS
OTEL_INSTRUMENTATION_[NAME]_ENABLED
OTEL_EXPORTER_OTLP_CLIENT_KEY
OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE
OTEL_EXPORTER_OTLP_CERTIFICATE
OTEL_SERVICE_NAME
```

To enable OpenTelemetry on the Docker gateway, you must also set these arguments:

```
OTEL_LOGS_EXPORTER="none"
IBM_JAVA_OPTIONS="-javaagent:/opt/ibm/eim-backend/lib/opentelemetry-javaagent.jar"
```

### Tracing Kafka records in a Kubernetes Deployment {{site.data.reuse.egw}}
{: #tracing-kafka-records-in-the-event-gateway}

Kafka record tracing can be enabled from the {{site.data.reuse.egw}}. Kafka record tracing provides visibility of the gateway's interaction with your Kafka records in your distributed tracing tool such as [Jaeger](https://www.jaegertracing.io/){:target="_blank"}.

The procedure to enable Kafka record tracing depends on your {{site.data.reuse.egw}} deployment type:

- Operator-managed gateways: Enable record tracing by adding the `tracesEnablement` configuration to the `spec.openTelemetry` section of the EventGateway custom resource:

  ```yaml
    openTelemetry:
    tracesEnablement:
      - name: kafkaRecord
        enabled: true
  ```
- Kubernetes Deployment gateways: Enable record tracing by setting `kafka.otel.record.tracing.enabled=true` in the ConfigMap. 
- Docker gateways: set `EGW_ENABLE_OTEL_KAFKA_RECORD_TRACING="true"` in your `docker run` command. 