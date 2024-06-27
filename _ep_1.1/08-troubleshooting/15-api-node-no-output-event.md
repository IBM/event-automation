---
title: "Enrichment from API produces no output events"
excerpt: "No output events from API enrichment node."
categories: troubleshooting
slug: no-output-event-from-api-node
toc: true
---

## Symptom

{{site.data.reuse.ep_name}} flows that include the [API node](../../nodes/enrichmentnode/#enrichment-from-an-api) do not produce output events.

**Note:** For general information not specific to the API node, see the [waiting for output events](../waiting-for-events/) troubleshooting topic if you have been waiting for a while and have not seen any output events. This page provides complementary information specific to the [API node](../../nodes/enrichmentnode/#enrichment-from-an-api).


## Causes

The following sections describe possible causes for not receiving the events.


### API server down or unreachable

The Flink job does not fail, but no output events are generated.

#### To verify

Check the Flink Task Manager log for the following error:

```
ERROR com.getindata.connectors.http.internal.table.lookup.JavaNetHttpPollingClient [] - Exception during HTTP request.
java.net.ConnectException
```

#### Resolving the problem

* Verify the URL of the API server used in the [configuration](../../nodes/enrichmentnode/#configuring-an-api-node) of the API node.
* Verify the health of the API server, or ask the administrator of the API server to do so.


### TLS/SSL misconfiguration

The API node can be configured to call the API using an `https` URL while the certificate for TLS/SSL has not been configured, or is no longer valid.

#### To verify

Check the Flink Task Manager log for any one of the following errors:

```shell
ERROR com.getindata.connectors.http.internal.table.lookup.JavaNetHttpPollingClient [] - Exception during HTTP request.
java.io.IOException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
```

```shell
java.lang.RuntimeException: Unable to create KeyStore for Http Connector Security Context.
	at com.getindata.connectors.http.internal.security.SecurityContext.createFromKeyStore(SecurityContext.java:95) ~[flink-http-connector-0.14.0.jar:?]
```

#### Resolving the problem

* Check the [SSL configuration for the API server](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry).
* If it is not configured, or the configured certificate has expired, or a certificate in its certificate chain has expired, the system administrator must complete the following steps:
  1. Complete or update the [SSL configuration for the API server](../../installing/configuring/#configuring-ssl-for-api-server-database-and-schema-registry) through {{site.data.reuse.ep_name}} and Flink.
  1. Stop the flow.
  1. Delete the {{site.data.reuse.ep_name}} and Flink pods.
  1. Wait for the pods to become ready.
  1. Restart your {{site.data.reuse.ep_name}} flow. In the navigation banner, expand **Run flow** and select either **Events from now** or **Include historical** to run your flow.

### API credentials misconfiguration

The API node can be configured to use basic authentication or API key authentication when calling the API. If the credentials are wrong, are expired or have been revoked, the API calls cannot succeed.

#### To verify

Check the Flink Task Manager log for the following warning, indicating the 401 (Unauthorized) or 403 (Forbidden) status code:

```
WARN  com.getindata.connectors.http.internal.table.lookup.JavaNetHttpPollingClient [] - Returned Http status code was invalid or returned body was empty. Status Code [401]
```

#### Resolving the problem

Complete the following steps:
1. Stop the flow.
2. Correct the configuration of the API credentials in the [node configuration](../../nodes/enrichmentnode/#configuring-an-api-node).
6. Restart your {{site.data.reuse.ep_name}} flow. In the navigation banner, expand **Run flow** and select either **Events from now** or **Include historical** to run your flow.


### No usable response from the API server

If the URL of the API server is reachable, TLS/SSL is properly configured and the API credentials are correct, the absence of output events can be due to the passed values of the API parameters, which can lead to unsuccessful responses from the API server.

**Note:** If an API fails to respond or returns a status code other than the 200-299 success code, the Flink job does not fail, but no output events are generated.


#### To verify

Check the Flink Task Manager log for the following warning:

```
WARN  com.getindata.connectors.http.internal.table.lookup.JavaNetHttpPollingClient [] - Returned Http status code was invalid or returned body was empty. Status Code [404]
```

In the earlier example, the status code is 404, but it can be any code other than the 2xx success code.

#### Resolving the problem

If possible, check the log of the API server, which might provide useful information about why the API calls do not succeed.

If the API server log is not accessible, or does not display the values of the input parameters passed to the API, the configuration of the Flink instance can be modified such that the log of the Flink Task Managers displays the values of the API input parameters, and displays the request body and response. For that, the `API_ENRICHMENT_LOG_API_PARAMETERS` environment variable can be set to `true` in the `FlinkDeployment` custom resource for the main container as follows:


```yaml
kind: FlinkDeployment
[...]
spec:
 podTemplate:
    [...]
    spec:
      env:
        - name: API_ENRICHMENT_LOG_API_PARAMETERS
          value: true
```

With this option enabled, the additional information can be found in the log of the Flink Task Manager after the following log entry:
```
INFO  com.ibm.ei.streamproc.model.jobgraph.apinode.connector.logger.CustomHttpLookupPostRequestCallback [] - Got response for a request.
```

**Important:**
- Enabling the display of the values of API parameters, request bodies and responses can reveal sensitive data from the events or from the configured literal values of API parameters. If sensitive data must not be present in the logs, do not enable this option. The option is disabled by default.
- The same sensitive data can also be included in logs if the default logging level of Flink is [customized](../trace-logging/#for-the-ibm-operator-for-apache-flink-instance) at `DEBUG` or `TRACE` level. Do not set the `DEBUG` or `TRACE` level if sensitive data must not be present in the logs.

