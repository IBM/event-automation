---
title: "Monitoring applications with distributed tracing"
excerpt: "Use the built-in tracing mechanism to monitor the flow of events, find performance issues, and pinpoint problems with applications using Event Streams."
categories: administering
slug: tracing
toc: true
---

{{site.data.reuse.es_name}} 10.3.0 and later versions are built on [Strimzi](https://strimzi.io/){:target="_blank"}. Strimzi 0.14.0 and later support distributed tracing based on the open-source [OpenTracing](https://opentracing.io/){:target="_blank"} and [Jaeger](https://www.jaegertracing.io/){:target="_blank"} projects.

Distributed tracing provides a way to understand how applications work across processes, services, or networks. Tracing uses the trail they leave behind based on requests made, carrying tracing information in the requests as they pass from system to system. Through tracing, you can monitor applications that work with {{site.data.reuse.es_name}}, helping you to understand the shape of the generated traffic, and pinpoint the causes of any potential problems.

To use distributed tracing for your Kafka client applications, you add code to your applications that gets called on the client's send and receive operations. This code adds headers to the client's messages to carry tracing information.


## OpenTelemetry tracing with Instana

[OpenTelemetry (OTel)](https://opentelemetry.io/docs/){:target="_blank"} aims to simplify and automate the collection and analysis of telemetry data by providing a unified and extensible instrumentation framework that can be integrated into any application or infrastructure component.


Integrating OpenTelemetry with {{site.data.reuse.es_name}} can provide a powerful way to gain real-time insights into the performance and behavior of your event-driven applications. By streaming telemetry data to {{site.data.reuse.es_name}}, you can monitor the health of your applications, troubleshoot issues quickly, and optimize your applications for better performance.


[IBM Instana](https://www.ibm.com/docs/en/instana-observability/current){:target="_blank"} supports OpenTelemetry for collecting distributed traces, metrics, and logs from various sources. Instana can seamlessly integrate with OpenTelemetry and can also enhance the data from OpenTelemetry. As an observability backend for OpenTelemetry, use Instana to monitor and analyze the performance and health of your applications in real-time.

There are two ways to ingest the generated OpenTelemetry traces and metrics with Instana: by using the Otel collector or by using an Instana host agent.

**Note:** The OpenTelemetry operator available for the {{site.data.reuse.openshift_short}} does not support Instana as an exporter while using the Otel collector. To collect OTel trace details on an OpenShift deployment of {{site.data.reuse.es_name}}, use an Instana host agent as described in the following sections.


### Configuring the host agent and OpenTelemetry

Instana host agent for OpenTelemetry is a powerful tool for collecting and analyzing telemetry data from hosts, infrastructure, and various applications.


Use the host agent to seamlessly integrate OpenTelemetry data into the Instana observability platform, providing a unified view of telemetry data, which you can use to analyze and troubleshoot issues quickly and efficiently.

To configure the host agent and OpenTelemetry:
1. Install and configure an [Instana host agent](../../administering/cluster-health/#instana) for Event Streams.


2. [Configure OpenTelemetry](https://www.ibm.com/docs/en/instana-observability/current?topic=apis-opentelemetry#sending-otlp-data-to-instana-agent){:target="_blank"} to send tracing and metric data to the Instana host agent.

### Enabling OpenTelemetry tracing

You can enable OpenTelemetry tracing for the following components in {{site.data.reuse.es_name}}:
- Kafka Connect
- Kafka Bridge

To enable OpenTelemetry tracing:
1. Enable OpenTelemetry by setting the `spec.tracing.type` property to `opentelemetry` in the custom resource for the selected component as follows (`KafkaConnect` and `KafkaBridge`):

   ```yaml
   spec:
       # ...
       tracing:
         type: opentelemetry
   ```

2. Configure the tracing environment variables in `spec.template` for the required custom resource as follows:

   Configuration for Kafka Bridge:
   ```yaml
   spec:
     #...
     template:
       bridgeContainer:
         env:
           - name: OTEL_SERVICE_NAME
             value: <instana-agent-service-name>
           - name: OTEL_EXPORTER_OTLP_ENDPOINT
             value: <instana-agent-address>
       tracing:
         type: opentelemetry
   ```

   Configuration for Kafka Connect:
   ```yaml
   spec:
     #...
     template:
       connectContainer:
         env:
           - name: OTEL_SERVICE_NAME
             value: <instana-agent-service-name>
           - name: OTEL_EXPORTER_OTLP_ENDPOINT
             value: <instana-agent-address>
     tracing:
       type: opentelemetry
   ```


For more information about tracing in Apache Kafka and OpenTelemetry, see the [Strimzi documentation](https://strimzi.io/blog/2023/03/01/opentelemetry/){:target="_blank"}.
