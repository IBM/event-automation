---
title: "Exporting metrics with OpenTelemetry"
excerpt: "Configure Event Endpoint Management to export OpenTelemetry data."
categories: installing
slug: export-metrics
toc: true
---


To configure an {{site.data.reuse.eem_manager}} or {{site.data.reuse.egw}} instance to emit OpenTelemetry data, you configure the `openTelemetry` section on the associated custom resource or Kubernetes Deployment. On [Docker](../install-gateway#remote-gateways) gateways, set the OpenTelemetry properties as arguments in your Docker `run` command, for example: `-e <property name>`.

- For {{site.data.reuse.eem_manager}} instances, you can configure OpenTelemetry in the `spec.manager.openTelemetry` section of the `EventEndpointManagement` custom resource.
- For operator-managed and [Kubernetes Deployment](../install-gateway#remote-gateways) {{site.data.reuse.egw}} instances, you can configure OpenTelemetry in the `spec.openTelemetry` section of the `EventGateway` custom resource or Kubernetes Deployment.  

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

    `interval`: The interval in milliseconds between the start of two metrics export attempts. The default value is 30000, which indicates that metrics export at 30-second intervals.

    `tls.secretName`: A secret that contains the client's certificates to use for mutualTLS (mTLS).

    `tls.clientKey`: The key in the secret that holds the encoded client key, for example `tls.key`. The certificate must be created with PKCS8 encoding.

    `tls.clientCertificate`: The key in the secret that holds the PKCS8 encoded client certificate/chain, for example `tls.crt`. The certificate must be created with PKCS8 encoding.

    `tls.trustedCertificate.secretName`: A secret that contains a CA certificate to trust to verify the endpoint server's certificate.

    `tls.trustedCertificate.certificate`: The key in the secret that holds the CA certificate to trust, for example `ca.crt`.

    `instrumentations`: Here you can define additional instrumentations to enable. {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} metrics are enabled by default when OpenTelemetry is enabled.

    - `name`: An instrumentation name. This name is then added into an environment variable of the format `OTEL_INSTRUMENTATION_[NAME]_ENABLED`, for a list of instrumentation names, see [Suppressing specific instrumentation](https://opentelemetry.io/docs/zero-code/java/agent/disable/#suppressing-specific-agent-instrumentation){:target="_blank"}.  You do not need to specify the environment variable, only the instrumentation name.

    - `enabled`: A boolean indicating whether to enable or disable the specified instrumentation.

If you want to add additional configuration for the OpenTelemetry agent, then you can [add environment variables](../configuring#setting-environment-variables) to the custom resource.

The following additional OpenTelemetry environment variables are set by default:

- `OTEL_SERVICE_NAME = "EEM Manager - <EventEndpointManagement instance name>"`
- `OTEL_SERVICE_NAME = "EEM Gateway - <EventGateway gateway-group-name/gateway-group-id>"`

- For [Docker](../install-gateway#remote-gateways) gateways, the OpenTelemetry properties are defined in `-e` arguments to the Docker `run` command: 

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

<!-- might be better to combine these properties and their definitions in a single table that covers k8s, cr, and docker. As it stands the docker gateway user has to figure out what the equivalent cr property is to see the definition. -->

OpenTelemetry is disabled by default. When it is enabled, all agent instrumentation other than {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} metrics remains disabled unless individually enabled.

See [the metrics reference](../../reference/metrics-reference) to find out more about the metrics that are emitted.

## Exporting traces with OpenTelemetry 
{: #exporting-traces-with-opentelemetry}

### Tracing Kafka records in the {{site.data.reuse.egw}}
{: #tracing-kafka-records-in-the-event-gateway}

Kafka record tracing can be enabled from the {{site.data.reuse.egw}}. This provides visibility of the gateway's interaction with your Kafka records in your distributed tracing tool such as [Jaeger](https://www.jaegertracing.io/){:target="_blank"}.

To enable traces from the {{site.data.reuse.egw}}, first configure OpenTelemetry. Enable record tracing by adding the `tracesEnablement` configuration to the `spec.openTelemetry` section of the `EventGateway` custom resource:

```yaml
  openTelemetry:
    tracesEnablement:
      - name: kafkaRecord
        enabled: true
```

On Kubernetes Deployment or Docker gateways, use the following environment variables:

```
EGW_ENABLE_OTEL_KAFKA_RECORD_TRACING="true"
OTEL_TRACES_EXPORTER="otlp"
```

If you want only traces from the gateway, but not metrics, then disable metrics as follows:

```yaml
  openTelemetry:
    metricsEnablement:
      - name: gateway
        enabled: false
```

On Kubernetes Deployment or Docker gateways, use the following environment variables:

```
EGW_ENABLE_OTEL_METRICS="false"
OTEL_METRICS_EXPORTER="none"
```
### Tracing API calls in the {{site.data.reuse.eem_manager}}
{: #tracing-api-calls-in-the-event-manager}

![Event Endpoint Management 11.6.2 icon]({{ 'images' | relative_url }}/11.6.2.svg "In Event Endpoint Management 11.6.2 and later.") From {{site.data.reuse.eem_name}} release 11.6.2 and later, API call tracing can be enabled in the manager. 

To enable traces from the {{site.data.reuse.eem_manager}}, first configure OpenTelemetry. Enable record tracing by adding the `tracesEnablement` configuration to the `spec.manager.openTelemetry` section of the `EventGateway` custom resource:

```yaml
  openTelemetry:
    tracesEnablement:
      - name: <trace.name>
        enabled: true
```

Where `trace.name` can be one of the following: 

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

## Example: Exporting metrics from an {{site.data.reuse.eem_manager}}
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

## Example: Exporting metrics and traces from an {{site.data.reuse.egw}}
{: #example-exporting-metrics-from-traces-from-an-event-gateway}

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  openTelemetry:
    endpoint: 'https://some.collector.endpoint:4317'
    tracesEnablement:
      - name: kafkaRecord
        enabled: true
    tls:
      trustedCertificate:
        secretName: mysecret
        certificate: ca.crt
# ... 
```

## Example: Adding additional OpenTelemetry exporter environment variables on an {{site.data.reuse.eem_manager}}
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