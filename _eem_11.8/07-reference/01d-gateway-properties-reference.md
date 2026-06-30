---
title: "Event Gateway property reference"
excerpt: "List of all configurable gateway properties that you can configure with environment variables and in the ConfigMap."
categories: reference
slug: gateway-properties
toc: true
---

The following tables show configurable {{site.data.reuse.egw}} properties. How you set these properties depends on your gateway deployment type:

- [Kubernetes Deployment](../../installing/install-k8s-egw)s use a ConfigMap and environment variables.
- [Operator-managed](../../installing/install-gateway#operator-managed-gateways) gateways use the custom resource and environment variables. 
- [Docker](../../installing/install-docker-egw) gateways use environment variables that are provided as command-line arguments to `docker run`.

**Note:** Where custom resource property fields contain "Not applicable" this means that no one-to-one mapping exists for this property with the ConfigMap or environment variables. The property still exists for the operator-managed gateway, but is derived from multiple properties, for example `KAFKA_LISTENERS` is derived from the custom resource properties `spec.listerners[listener].name` and `spec.listeners[].port`. Refer to the [{{site.data.reuse.egw}} CRD reference](../gwy-api-reference) for details of the {{site.data.reuse.egw}} custom resource properties.


### General {{site.data.reuse.egw}} configuration properties
{: #egw-config}

Configuration properties that apply to all {{site.data.reuse.egw}} deployments.

| Custom resource property | ConfigMap property | Environment variable | Description |  
| - | - | - | - | 
| `spec.manager.trustedCertificate` |`manager.client.trust.pem`|`MANAGER_CLIENT_TRUST_PEM`|The PEM encoded CA Certificates required to trust the {{site.data.reuse.eem_manager}}. Can be provided inline or by file reference with path `file:///path/to/file`.<br><br>Type: String<br>Dynamic: True<br>Required: False<br>|
| Use environment variable.  |`tls.versions`|`TLS_VERSIONS`|The TLS versions that the {{site.data.reuse.egw}} can use.<br><br>Default: `TLSv1.3`<br>Type: String<br>Required: False|
| `spec.manager.endpoint` |`manager.client.url`|`MANAGER_CLIENT_URL`|The URL to the gateway API on the {{site.data.reuse.eem_manager}}.<br><br>Type: String<br>Dynamic: True<br>Required: False<br>|
| `spec.manager.apiKey` |`manager.client.api.key`|`MANAGER_CLIENT_API_KEY`|The API key for access to the gateway API on the {{site.data.reuse.eem_manager}}. Used for access token exchange.<br><br>Type: String<br>Dynamic: True<br>Required: False<br>|
| Use environment variable.  |`manager.scan.interval`|`MANAGER_SCAN_INTERVAL`|The period between checks for {{site.data.reuse.eem_manager}} updates in milliseconds (ms).<br><br>Default: `30000`<br>Type: Integer<br>Required: False|
| Use environment variable.  |`hostname`|`HOSTNAME`|The hostname of this {{site.data.reuse.egw}}.<br><br>Default: Set by Docker<br>Type: String<br>Required: True|
| `spec.gatewayContact` |`gateway.contact`|`GATEWAY_CONTACT`|Contact information for the owner of this {{site.data.reuse.egw}}. This information is displayed in the {{site.data.reuse.eem_name}} UI.<br><br>Type: String<br>Dynamic: True<br>Required: False<br>|
| Use environment variable.  |`bootstrap.connection.timeout`|`BOOTSTRAP_CONNECTION_TIMEOUT`|The bootstrap connection timeout, if a connection attempt exceeds this time in milliseconds (ms) it fails.<br><br>Default: `30000`<br>Type: Integer<br>Dynamic: True<br>Required: False<br>|
| Use environment variable.  |`monitor.scan.interval`|`MONITOR_SCAN_INTERVAL`|The period between running cluster monitor updates in milliseconds (ms).<br><br>Default: `30000`<br>Type: Integer<br>Required: False<br>|
| spec.traceSpec | trace.spec | TRACE_SPEC | Specifies the trace level. For example, `debug`, `info`, `error`.<br><br>Default: `info`<br>Type: String<br>Required: False<br> |
| Not applicable. |Not applicable.|`swid`|SWID Tag ID for IBM License Metric Tool licensing in stand-alone mode. Valid values: CP4I, EA.<br><br>Type: String<br>Dynamic: True<br>Required: False<br>|


### Kafka protocol configuration
{: #kafka-protocol}
Properties that manage how the Kafka protocol is managed by the {{site.data.reuse.egw}}.

| Custom resource property | ConfigMap property | Environment variable | Description |  
| - | - | - | - | 
| Not applicable. |`kafka.listeners`|`KAFKA_LISTENERS`|The Kafka listener. The format is: `<listener name>://<host>:<port>`. For example,: `MY_SERVER_1://:8080`<br><br>Type: String<br>Required: True<br>|
| Not applicable. |`kafka.listener.{0}.sni.enabled`|`KAFKA_LISTENER_{0}_SNI_ENABLED`|This Kafka listener requires clients to use Server Name Indication (SNI).<br><br>Default: `false`<br>Type: Boolean<br>Required: False<br>|
| Not applicable. |`kafka.listener.{0}.groups`|`KAFKA_LISTENER_{0}_GROUPS`|The group that is available on this listener. The format is `<name>://<type>`. For example, `DEFAULT://wildcard`.<br><br>Valid group types are `explicit` and `wildcard`.<br><br>- `explicit` requires an explicit list of hostnames, which must be greater than or equal to the total number of Kafka brokers across all Kafka clusters that this gateway connects to.<br/>-`wildcard` requires a single wildcard address, which is used to create as many hostnames as needed.<br><br>Default: `DEFAULT://explicit`<br>Type: String<br>Required: False<br>|
| Not applicable. |`kafka.listener.{0}.group.{1}.addresses`|`KAFKA_LISTENER_{0}_GROUP_{1}_ADDRESSES`|Comma-separated addresses of the format `<host>:<port>`, for example localhost:8090,localhost:8091,localhost:8092<br>If the address type is `wildcard`, then a single address with a `*` is required, for example: `*.example.com:8080`.<br><br>Type: String<br>Required: False<br>|
| Not applicable. |`kafka.listener.{0}.keystore.location`|`KAFKA_LISTENER_{0}_KEYSTORE_LOCATION`|Absolute path to the listener's keystore. For example,: `/path/to/my/keystore`<br><br>Type: Path<br>Dynamic: True<br>Required: True<br>|
| Not applicable. |`kafka.listener.{0}.keystore.key.location`|`KAFKA_LISTENER_{0}_KEYSTORE_KEY_LOCATION`|Absolute path to the listener's keystore key. For example,: `/path/to/my/key`.<br>Required if keystore type is PEM.<br><br>Type: Path<br>Dynamic: True<br>Required: False<br>|
| Not applicable. |`kafka.listener.{0}.keystore.password`|`KAFKA_LISTENER_{0}_KEYSTORE_PASSWORD`|The password for the keystore.<br><br>Type: String<br>Dynamic: True<br>Required: False<br>|
| Not applicable. | `kafka.listener.{0}.keystore.type`|`KAFKA_LISTENER_{0}_KEYSTORE_TYPE`|The type of the keystore. Valid types: PEM, JKS, PKCS12<br><br>Default: `PEM`<br>Type: Enumeration<br>Values: PEM, JKS, PKCS12<br>Dynamic: True<br>Required: False<br>|
| Not applicable. |`kafka.listener.{0}.group.{1}.trust.pem`|`KAFKA_LISTENER_{0}_GROUP_{1}_TRUST_PEM`|Path to a PEM formatted certificate file (can be multi-PEM format) that contains the certificates that a client must use to trust the gateway group addresses (These certificates are available in the {{site.data.reuse.eem_name}} UI).<br><br>Type: Path<br>Dynamic: True<br>Required: False<br>|
| `spec.security.connection.request.maxSizeBytes` |`kafka.max.message.length`|`KAFKA_MAX_MESSAGE_LENGTH`|Configurable max message length of a Kafka protocol message. Defaults to no limit (-1).<br><br>Default: `-1`<br>Type: Integer<br>Dynamic: True<br>Required: False<br>|



### Security configuration
{: #security-config}
{{site.data.reuse.egw}} security-related properties.

| Custom resource property | ConfigMap property | Environment variable | Description |  
| - | - | - | - | 
| `spec.security.connection.closeDelayMs` |`connection.close.tarpit.time.ms`|`CONNECTION_CLOSE_DELAY_MS`|The time in milliseconds (ms) to tarpit a connection before closing.<br><br>Default: `8000`<br>Type: Integer<br>Dynamic: True<br>Required: False<br>|
| `spec.security.connection.closeJitterMs` |`connection.close.jitter.time.ms`|`CONNECTION_CLOSE_JITTER_MS`|The time in milliseconds (ms) to add as jitter in addition to tarpitting a connection before closing.<br><br>Default: `4000`<br>Type: Integer<br>Dynamic: True<br>Required: False<br>|
| `spec.security.authentication.maxRetries`|`authentication.max.retries`|`AUTHN_MAX_RETRIES`|The maximum number of failed authentication attempts before an account is locked. A value of -1 allows unlimited retries.<br><br>Default: `-1`<br>Type: Integer<br>Required: False<br>|
| `spec.security.authentication.lockoutPeriod` |`authentication.lockout.period.s`|`AUTHN_LOCKOUT_PERIOD_SECONDS`|The duration in seconds (s) that an account is locked for after the maximum number of authentication retries are exceeded. A value of -1 locks the account permanently.<br><br>Default: `0`<br>Type: Integer<br>Required: False<br>|
| `spec.security.authentication.retryBackoffMs` |`authentication.backoff.delay.increment.ms`|`AUTHN_BACKOFF_DELAY_INCREMENT_MILLIS`|The incremental backoff time in milliseconds (ms) added between consecutive failed authentication attempts.<br><br>Default: `0`<br>Type: Integer<br>Required: False<br>|
| Not applicable.  |`authentication.locked.response.delay.s`|`LOCKED_RESPONSE_DELAY_SECONDS`|The delay in seconds (s) added to authentication requests while an account is locked.<br><br>Default: `60`<br>Type: Integer<br>Required: False<br>|
| Not applicable. |`authentication.max.connections.per.application`|`MAX_CONNECTIONS_PER_SUBSCRIPTION`|The maximum allowed TCP connections for each {{site.data.reuse.eem_name}} application. This property prevents reuse of credentials. A single client can use multiple connections, for example a Kafka client can use one connection for each partition and one for metadata updates.<br><br>Default: `-1`<br>Type: Integer<br>Required: False<br>|
| `spec.fips.mode` |`fips.mode`|`FIPS_MODE`|Enable FIPS mode for cryptographic operations.<br><br>Default: `NONE`<br>Type: Enumeration<br>Values: NONE, WALL<br>Dynamic: True<br>Required: False<br>|


### Audit logging configuration
{: #audit-log}
{{site.data.reuse.egw}} audit logging properties.

| Custom resource property | ConfigMap property | Environment variable | Description |  
| - | - | - | - | 
| Use environment variable.  |`audit.log.writer`|`AUDIT_LOG_WRITER`|The writer implementation used to write the audit logs.<br><br>Default: `FILE`<br>Type: Enumeration<br>Values: STDOUT, FILE<br>Required: False<br>|
| Use environment variable.  |`audit.log.format`|`AUDIT_LOG_FORMAT`|The format that the audit logger uses to write logs.<br><br>Default: `SIMPLE`<br>Type: Enumeration<br>Values: NONE, SIMPLE, CADF<br>Required: False<br>|
| Use environment variable. |Use environment variable.|`AUDIT_LOG_FILE`|The name of the audit log file.<br><br>Default: `egw-audit.log`<br>Type: String<br>Required: False<br>|
| Use environment variable. |Use environment variable.|`AUDIT_LOG_DIRECTORY`|The directory path where audit log files are written.<br><br>Default: `/var/log/audit`<br>Type: String<br>Required: False<br>|
| Use environment variable. |Use environment variable.|`AUDIT_LOG_FILE_WRITER_MAX_FILES`|The maximum number of audit log files to maintain. When the maximum is reached, logging rotates back to the first file.<br><br>Default: `15`<br>Type: Integer<br>Required: False<br>|
| Use environment variable. |Use environment variable.|`AUDIT_LOG_FILE_WRITER_MAX_FILE_MBYTES`|The maximum size in megabytes (MB) that an audit log file can reach. When the maximum is reached, a new log file is created.<br><br>Default: `30`<br>Type: Long<br>Required: False<br>|

### OpenTelemetry configuration
{: #otel-config}
{{site.data.reuse.egw}} OpenTelemetry properties.

| Custom resource property | ConfigMap property | Environment variable | Description |  
| - | - | - | - | 
| Not applicable.  |`egw.enable.otel.metrics`|`EGW_ENABLE_OTEL_METRICS`|Enable OpenTelemetry metrics collection and export.<br><br>Default: `true`<br>Type: Boolean<br>Required: False<br>|
| `spec.openTelemetry.endpoint` |Use environment variable.|`OTEL_EXPORTER_OTLP_ENDPOINT`|The OTLP endpoint URL to send telemetry data to.<br><br>Type: String<br>Required: False<br>|
| `spec.openTelemetry.protocol` |Use environment variable.|`OTEL_EXPORTER_OTLP_PROTOCOL`|The OTLP protocol to use for sending telemetry data.<br><br>Type: String<br>Required: False<br>|
| `spec.openTelemetry.interval` |Use environment variable.|`OTEL_METRIC_EXPORT_INTERVAL`|The interval at which OpenTelemetry metrics are exported.<br><br>Type: String<br>Required: False<br>|
| Not applicable. |Use environment variable.|`OTEL_LOGS_EXPORTER`|The OpenTelemetry logs exporter to use.<br><br>Type: String<br>Required: False<br>|
| Not applicable. |Use environment variable.|`OTEL_METRICS_EXPORTER`|The OpenTelemetry metrics exporter to use.<br><br>Type: String<br>Required: False<br>|
| Not applicable. |Use environment variable.|`OTEL_TRACES_EXPORTER`|The OpenTelemetry traces exporter to use.<br><br>Type: String<br>Required: False<br>|
| Use environment variable. |Use environment variable.|`OTEL_SERVICE_NAME`|The service name to identify this {{site.data.reuse.egw}} instance in OpenTelemetry data.<br><br>Type: String<br>Required: False<br>|
| `spec.openTelemetry.tls.clientKey` |Use environment variable.|`OTEL_EXPORTER_OTLP_CLIENT_KEY`|The client key for mTLS authentication with the OTLP exporter.<br><br>Type: String<br>Required: False<br>|
| `spec.openTelemetry.tls.clientCertificate` |Use environment variable.|`OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE`|The client certificate for mTLS authentication with the OTLP exporter.<br><br>Type: String<br>Required: False<br>|
| `spec.openTelemetry.tls.trustedCertificate[]` |Use environment variable.|`OTEL_EXPORTER_OTLP_CERTIFICATE`|The CA certificate to trust when connecting to the OTLP exporter.<br><br>Type: String<br>Required: False<br>|
| Not applicable. |Use environment variable.|`OTEL_EXPORTER_OTLP_HEADERS`|Additional headers to include in data that is sent to the OTLP exporter.<br><br>Type: String<br>Required: False<br>|

### Kafka protocol OpenTelemetry configuration
{: #kafka-otel-config}
Kafka records OpenTelemetry configuration.

| Custom resource property | ConfigMap property | Environment variable | Description |  
| - | - | - | - | 
|`spec.openTelemetry.tracesEnablement[]` |`kafka.otel.record.tracing.enabled`|`EGW_ENABLE_OTEL_KAFKA_RECORD_TRACING`|Export the {{site.data.reuse.egw}} OTEL traces for Kafka records.<br><br>Default: `false`<br>Type: Boolean<br>Required: False<br>|

<!-- "standard" means not the IWHI Embedded streaming gateway or other future flavours, not relevant to these onprem docs. The five properties here can be moved to the general properties table at the top of this page.
### {{site.data.reuse.eem_name}} Gateway specific configuration
{: #eem-config}
Configuration values that configure how the gateway behaves when it's running like a standard {{site.data.reuse.eem_name}} gateway

| Custom resource name  | Property name | Environment variable | Description | 
| - | - | - | - | 
| CR SPEC PATH HERE |`bootstrap.connection.timeout`|`BOOTSTRAP_CONNECTION_TIMEOUT`|The bootstrap connection timeout, if a connection attempt exceeds this time in milliseconds (ms) it fails.<br><br>Default: `30000`<br>Type: Integer<br>Dynamic: True<br>Required: False<br>|
| CR SPEC PATH HERE |`monitor.scan.interval`|`MONITOR_SCAN_INTERVAL`|The period between running cluster monitor updates in milliseconds (ms).<br><br>Default: `30000`<br>Type: Integer<br>Required: False<br>|
-->

<!-- For SaaS only:
### IWHI EmS Gateway specific configuration
Configuration values that configure how the gateway behaves when it's running for IWHI EmS

| CR SPEC PATH HERE | Property | Env | Description |
| - | - | - | - | 
| CR SPEC PATH HERE |`gateway.id`|`GATEWAY_ID`|The ID of this {{site.data.reuse.egw}}'s deployment. Used in Embedded Streaming to differentiate gateways.<br><br>Type: String<br>Required: True<br>| -->
