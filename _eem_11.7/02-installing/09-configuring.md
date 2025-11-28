---
title: "Configuring initial installation"
excerpt: "Configure persistent storage, external network access, and advanced gateway properties on your Event Endpoint Management Installation."
categories: installing
slug: configuring
toc: true
---

## Setting environment variables
{: #setting-environment-variables}

You can configure the {{site.data.reuse.eem_manager}} or the {{site.data.reuse.egw}} by setting environment variables. On [operator-managed](../install-gateway#operator-managed-gateways) and [Kubernetes Deployment](../install-gateway#remote-gateways) {{site.data.reuse.egw}}s you specify the environment variables in a template override (`env`) which specifies one or more name-value pairs. On [Docker](../install-gateway#remote-gateways) gateways, add the environment variable to your Docker `run` command, for example: `-e <variable name>`.

**Important:** Remember to [backup](../backup-restore) your gateway configuration after you make updates. 

The format for {{site.data.reuse.eem_manager}} instances is:

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

The format for [operator-managed](../install-gateway#operator-managed-gateways) {{site.data.reuse.egw}} instances is:

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

Where:

- `<name>` is the specification that you want to configure.
- `<value>` is the value to configure the specification.

For [Kubernetes Deployment](../install-gateway#remote-gateways) {{site.data.reuse.egw}} instances the path in the Kubernetes Deployment is `spec.template.spec.containers`.


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

## Enabling persistent storage
{: #enabling-persistent-storage}

To persist the data input into an {{site.data.reuse.eem_manager}} instance, configure persistent storage in your `EventEndpointManagement` configuration.

To enable persistent storage for `EventEndpointManagement` set `spec.manager.storage.type` to `persistent-claim`, and then configure the storage in one of the following ways:

- [dynamic provisioning](#dynamic-provisioning)
- [providing persistent volume](#providing-persistent-volumes)
- [providing persistent volume and persistent volume claim](#providing-persistent-volume-and-persistent-volume-claim).

Ensure that you have sufficient disk space for persistent storage.

**Note:** `spec.manager.storage.type` can also be set to `ephemeral`, although no persistence is provisioned with this configuration. This is not recommended for production usage because it results in lost data.

### Dynamic provisioning
{: #dynamic-provisioning}

If there is a [dynamic storage provisioner](https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/storage/dynamic-provisioning) present on the system, you can use the dynamic storage provisioner to dynamically provision the persistence for {{site.data.reuse.eem_name}}.
To configure this, set `spec.manager.storage.storageClassName` to the name of the storage class provided by the provisioner.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    storage:
      type: persistent-claim
      storageClassName: csi-cephfs
# ...
```


- Optionally, specify the storage size in `storage.size` (for example, the default value used would be `"100Mi"`). Ensure that the [quantity suffix](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/quantity/), such as `Mi` or `Gi`, is included. <!-- what do we mean by the 'the default value used would be 100Mi'? Is that the value if you don't specify any size? -->
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt/storage"`).
- Optionally, specify the retention setting for the storage if the instance is deleted in `storage.deleteClaim` (for example, `"true"`).


### Providing persistent volumes
{: #providing-persistent-volumes}

Before you install {{site.data.reuse.eem_name}}, you can create a persistent volume for it to use as storage.
To use a persistent volume that you created earlier, set the `spec.manager.storage.selectors` to match the labels on the persistent volume and set the `spec.manager.storage.storageClassName` to match the `storageClassName` on the persistent volume.
The following example creates a persistent volume claim to bind to a persistent volume with the label `precreated-persistence: my-pv` and `storageClassName: manual`.
Multiple labels can be added as selectors, and the persistent volume must have all labels present to match.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    storage:
      type: persistent-claim
      selectors:
        precreated-persistence: my-pv
      storageClassName: manual
# ...

```


- Optionally, specify the storage size in `storage.size` (for example, the default value used would be `"100Mi"`). Ensure that the [quantity suffix](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/quantity/), such as `Mi` or `Gi`, is included.
- Optionally, specify the root storage path where data is stored in `storage.root` (for example, `"/opt/storage"`).
- Optionally, specify the retention setting for the storage if the instance is deleted in `storage.deleteClaim` (for example, `"true"`).


### Providing persistent volume and persistent volume claim
{: #providing-persistent-volume-and-persistent-volume-claim}

A persistent volume and persistent volume claim can be pre-created for {{site.data.reuse.eem_name}} to use as storage.
To use this method, set `spec.manager.storage.existingClaimName` to match the name of the pre-created persistent volume claim.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  manager:
    storage:
      type: persistent-claim
      existingClaimName: my-existing-pvc
# ...
```

## Deploy network policies for operator-managed {{site.data.reuse.egw}}s
{: #deploy-network-policies-for-operator-managed-event-gateways}

By default, the operator deploys an instance-specific network policy when an instance of `EventEndpointManagement` or `EventGateway` is created.
The deployment of these network policies can be turned off by setting the `spec.deployNetworkPolicies` to `false`.

The following code snippet is an example of a configuration that turns off the deployment of the network policy:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  license:
    # ...
  deployNetworkPolicies: false
# ...
---
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  deployNetworkPolicies: false  
```

## Configuring ingress
{: #configuring-ingress}

If you are running on the {{site.data.reuse.openshift}}, routes are automatically configured to provide external access.

Optional: You can set a host for each exposed route on your {{site.data.reuse.eem_manager}} and operator-managed {{site.data.reuse.egw}} instances by setting values under `spec.manager.endpoints[]` in your `EventEndpointManagement` custom resource, and under `spec.endpoints[]` in your `EventGateway` custom resource.

If you are running on other Kubernetes platforms, the {{site.data.reuse.eem_name}} operator creates ingress resources to provide external access. No default hostnames are assigned to the ingress resource, and you must set hostnames for each exposed endpoint that is defined for the {{site.data.reuse.eem_manager}} and {{site.data.reuse.egw}} instances.

For the {{site.data.reuse.eem_manager}} instance, the `spec.manager.endpoints[]` section of your `EventEndpointManagement` custom resource must contain entries for the following service endpoints:

- The {{site.data.reuse.eem_name}} UI (service name: `ui`)
- The {{site.data.reuse.egw}} (service name: `gateway`)
- The {{site.data.reuse.eem_name}} Admin API (service name: `admin`)
- The {{site.data.reuse.eem_name}} server for deploying gateways and exposing the Admin API (service name: `server`)  

   **Note:**
   - The `server` service endpoint is required to [deploy](../../installing/install-gateway/#remote-gateways) an {{site.data.reuse.egw}} by using the {{site.data.reuse.eem_name}} UI.
   - The `server` service endpoint also exposes the {{site.data.reuse.eem_name}} [Admin API](../../security/api-tokens/) on path `/admin`, and can be used for making API requests to {{site.data.reuse.eem_name}} programmatically. The Admin API URL is displayed on the [**Profile** page](../../security/api-tokens/#api-access-tokens).
   - The value that is supplied in `endpoints[server].host` must start with `eem.`
   
For each service endpoint, set the following values:
  - `name` is the name of the service: `ui`, `gateway`, `admin`, or `server` as applicable.
  - `host` is a DNS-resolvable hostname for accessing the named service.

For example:
```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventEndpointManagement
# ...
spec:
  manager:
    endpoints:
      - name: ui
        host: my-eem-ui.mycluster.com
      - name: gateway
        host: my-eem-gateway.mycluster.com
      - name: admin
        host: my-eem-admin.mycluster.com
      - name: server
        host: eem.my-eem-server.mycluster.com
```


For the operator-managed {{site.data.reuse.egw}} instance, set the gateway endpoint host in the `spec.endpoints[]` section of your `EventGateway` custom resource, as shown in the following code snippet:


```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  endpoints:
    - name: gateway
      host: my-gateway.mycompany.com
# ... 
```

<!-- K8S deployment gateway users should be able to work it out, but it would be good to add a Kubernetes Deployment example here. This is NA for docker gateway btw. -->

### Ingress default settings
{: #ingress-default-settings}

If you are not running on the {{site.data.reuse.openshift}}, the following ingress defaults are set unless overridden:

- `class`: The ingress class name is set by default to `nginx`. Set the `class` field on endpoints to use a different ingress class.

- `annotations`: The following annotations are set by default on generated ingress endpoints:

```yaml
  ingress.kubernetes.io/ssl-passthrough: 'true'
  nginx.ingress.kubernetes.io/backend-protocol: HTTPS
  nginx.ingress.kubernetes.io/ssl-passthrough: 'true'
```

If you specify a `spec.manager.tls.ui.secretName` on an `EventEndpointManagement` instance, the following reencrypt annotations are set on the `ui` ingress. Other ingresses are configured for pass-through.

```yaml
    nginx.ingress.kubernetes.io/backend-protocol: HTTPS
    nginx.ingress.kubernetes.io/configuration-snippet: proxy_ssl_name "<HOSTNAME>";
    nginx.ingress.kubernetes.io/proxy-ssl-protocols: TLSv1.3
    nginx.ingress.kubernetes.io/proxy-ssl-secret: <NAMESPACE>/<SECRETNAME>
    nginx.ingress.kubernetes.io/proxy-ssl-verify: 'on'
```

Ingress annotations can be overridden by specifying an alternative set of annotations on an endpoint. The following code snippet is an example of overriding the annotations set on an operator-managed `EventGateway` gateway endpoint ingress.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
  # ...
  endpoints:
    - name: gateway
      host: my-gateway.mycompany.com
      annotations:
        some.annotation.foo: "true"
        some.other.annotation: value
# ... 
```

<!-- K8S deployment gateway users should be able to work it out, but it would be good to add a Kubernetes Deployment example here. This is NA for docker gateway btw. -->

## Configuring external access to the operator-managed and Kubernetes Deployment {{site.data.reuse.egw}}
{: #configuring-external-access-to-event-gateway}

A Kafka client implementation might require access to at least one route or ingress for each broker that the client is expected to connect to. To present a route or an ingress, you can manually configure the number of routes that are associated with an operator-managed {{site.data.reuse.egw}} in the `EventGateway` custom resource or Kubernetes Deployment.

For example, you can set the number of routes in the `spec.maxNumKafkaBrokers` field of your `EventGateway` custom resource, as shown in the following code snippet:

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
  maxNumKafkaBrokers: 3
# ... 
```

<!-- K8S deployment gateway users should be able to work it out, but it would be good to add a Kubernetes Deployment example here. This is NA for docker gateway btw. -->

If `spec.maxNumKafkaBrokers` value is not provided, the default (`20`) is used. The value of the `spec.maxNumKafkaBrokers` must be greater than or equal to the total number of brokers managed by this {{site.data.reuse.egw}}.

## Configuring gateway security on the {{site.data.reuse.egw}}s
{: #configuring-gateway-security}

You can configure various settings that help protect the {{site.data.reuse.egw_short}} from uncontrolled resource consumption such as excessive memory usage, or connection exhaustion. Enable these features to help you ensure that the gateway remains available and responsive. 

For operator-managed gateways the following table lists the parameters that are available in the `EventGateway` custom resource in the `security` section. All parameters are optional. 

  | Parameter | Description | Default |
  | ------    | --------| ---------|
  | `spec.security.connection.closeDelayMs` | The minimum delay in milliseconds after you close a connection. This helps prevent spam. | 8000 |
  | `spec.security.connection.closeJitterMs` | Additional delay in milliseconds after you close a connection. This helps prevent attacks. | 4000 |
  | `spec.security.connection.perSubLimit` | The maximum allowed TCP connections for each subscription. | -1 (no limit) |
  | `spec.security.authentication.maxRetries` | The maximum number of failed authentication attempts after which further attempts are blocked. | -1 (no limit) |
  | `spec.security.authentication.retryBackoffMs` | The backoff time in milliseconds between consecutive failed authentication attempts. | 0 |
  | `spec.security.authentication.lockoutPeriod` | The duration in seconds while the account is locked after an unsuccessful authentication attempt. (-1 for permanent lockout) | 0 |
  | `spec.security.request.maxSizeBytes` | The maximum size allowed for the request payload in bytes. | -1 (no limit) |
{: caption="Table 1. Parameter description" caption-side="bottom"}

The default values for these parameters are shown in the following sample. A value of -1 represents no limit.

```yaml
apiVersion: events.ibm.com/v1beta1
kind: EventGateway
# ...
spec:
  license:
    # ...
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
# ... 
```

<!-- K8S deployment gateway users should be able to work it out, but it would be good to add a Kubernetes Deployment example here. -->

For the [Docker](../install-gateway#remote-gateways) gateway, the equivalent environment variable names are:

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

