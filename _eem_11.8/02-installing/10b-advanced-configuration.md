---
title: "Managing your installation and advanced configuration"
excerpt: "How to manage your Event Endpoint Management installation and configure advanced features."
categories: installing
slug: advancedconfig
toc: true
---
Find out how you can further configure and manage your initial installation setup.
## Configuring the {{site.data.reuse.eem_manager}}
{: #config-event-mgr}

### Setting {{site.data.reuse.eem_manager}} environment variables
{: #setting-manager-env-vars}

You configure the {{site.data.reuse.eem_manager}} by setting environment variables. 

The format for the {{site.data.reuse.eem_manager}} instances is:

```yaml
spec:
  manager:
    template:
      pod:
        spec:
          containers:
            - name: manager
              env:
                - name: <name>
                  value: <value>
```

For example, to enable trace logging in the {{site.data.reuse.eem_manager}}:

```yaml
spec:
  manager:
    template:
      pod:
        spec:
          containers:
            - name: manager
              env:
                - name: TRACE_SPEC
                  value: "<package>:<trace level>"
```


## Configuring the {{site.data.reuse.egw}}
{: #gwy-config}

How your {{site.data.reuse.egw}} is configured depends on the deployment method of that gateway instance. Refer to the [gateway property reference](../../reference/gateway-properties) for details of all the {{site.data.reuse.egw}} configuration properties. 

**Important:** Remember to [back up](../backup-restore) your gateway configuration after you make updates. 

### Operator-managed {{site.data.reuse.egw}}s
{: #opman-operator-gways}

Operator-managed {{site.data.reuse.egw}}s are configured in the [{{site.data.reuse.egw}} custom resource](../../reference/gwy-api-reference). The {{site.data.reuse.eem_name}} operator observes, reconciles, and enforces the configuration that is specified in the custom resource.


#### Setting {{site.data.reuse.egw}} environment variables
{: #egw-env-vars}

Environment variables can be set as follows for [operator-managed](../install-gateway#operator-managed-gateways) {{site.data.reuse.egw}} instances by using template overrides:

```yaml
spec:
  template:
    pod:
      spec:
        containers:
          - name: egw
            env:
              - name: <name>
                value: <value>
```

### Kubernetes Deployment {{site.data.reuse.egw}}s
{: #opman-k8s-gways}

Kubernetes Deployment {{site.data.reuse.egw}}s are configured in the [{{site.data.reuse.egw}} ConfigMap](#setting-sitedatareuseegw-configmap-properties). The [{{site.data.reuse.eem_name}} UI](../installing-on-kubernetesgenerating-gateway-config) generates the ConfigMap when you install the {{site.data.reuse.egw}}.

#### Setting ConfigMap properties on Kubernetes Deployment {{site.data.reuse.egw}}s
{: #egw-config-map}

**Important:** For operator-managed gateways, do not configure gateway properties in the ConfigMap, set gateway properties in the [custom resource](#opman-operator-gways).

The format of the [Kubernetes Deployment](../install-gateway#remote-gateways) {{site.data.reuse.egw}}'s ConfigMap is as follows:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: "<gateway group>-<gateway id>-config"
  labels:
    app: "testexample"
    gatewayGroup: "<gateway group>"
    gatewayId: "<gateway id>"
data:
  gateway.properties: |
    # Gateway Configuration
    egw.enable.otel.metrics=true
    kafka.otel.record.tracing.enabled=true
    ...
```

Run the following command to edit the ConfigMap:

```
kubectl -n <namespace> edit configmap <gateway group>-<gateway id>-config
```


- If you want to supply string-type properties without them being visible in the ConfigMap, then you can set the property to a filepath with `file://<filepath>`, where the specified file contains the property value. You can append `?jsonpath=<json-path>` to pull out a single string value from a JSON file. 

- Property names that contain `{n}` must be updated to replace `{n}` with a string of your choice. You can use this string to group properties together. For example, replace `kafka.listener.{0}.groups` with `kafka.listener.external.groups`.


### Docker {{site.data.reuse.egw}}s
{: #docker-gways}

On [Docker](../install-gateway#remote-gateways) gateways, properties are configured by providing arguments in the Docker `run` command, for example: `-e <variable name>`.

To update Docker gateway properties:

1. Uninstall the gateway as described in [uninstalling a Docker {{site.data.reuse.egw}}](../uninstalling/#uninstall-docker-gateway)
2. Deploy the docker gateway again with the properties that you want to change specified in the `docker run` arguments.

### Configuring {{site.data.reuse.egw}} security
{: #configuring-gateway-security}

You can configure various settings that help protect the {{site.data.reuse.egw_short}} from uncontrolled resource consumption such as excessive memory usage or connection exhaustion. Enable these features to ensure that the gateway remains available and responsive. 

For information about the security properties that you can configure, see the [gateway properties reference](../../reference/gateway-properties#security-config).



