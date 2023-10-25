---
title: "API reference for the `EventStreams/v1beta2` CRDs"
excerpt: "API reference for the Custom Resource Definitions (CRDs) that are used by Event Streams."
categories: reference
slug: api-reference-es
toc: true
---

Find out more abut the Custom Resource Definitions (CRDs) that are used by {{site.data.reuse.es_name}}.

## spec

| Property | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| spec     | object | The specification of the {{site.data.reuse.es_name}} instance. |

### adminApi

| Property | Type | Description |
| --- | --- | --- |
| spec.adminApi | object | Configuration of the {{site.data.reuse.es_name}} administration API server. |
| spec.adminApi.endpoints | array | Defines endpoints that will be created to communicate with the component. If nothing is specified, a default endpoint is created that is externally accessible via a Route with Bearer Authentication.  |
| spec.adminApi.env | array | Apply additional custom environment variables to this component. |
| spec.adminApi.image | string | Identify a custom image to use for this component. |
| spec.adminApi.livenessProbe | object | Modify the Kubernetes liveness probe applied to this component. |
| spec.adminApi.livenessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.adminApi.livenessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.adminApi.livenessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.adminApi.livenessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.adminApi.livenessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.adminApi.logging | object | Specify custom logging for this component. |
| spec.adminApi.logging.loggers | object | A Map from logger name to logger level. |
| spec.adminApi.logging.type | string | Logging type, must be either 'inline' or 'external'. |
| spec.adminApi.logging.valueFrom | object | `ConfigMap` entry where the logging configuration is stored.  |
| spec.adminApi.logging.valueFrom.configMapKeyRef | object | Reference to the key in the ConfigMap containing the configuration. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#define-container-environment-variables-using-configmap-data){:target="_blank"}. |
| spec.adminApi.readinessProbe | object | Modify the Kubernetes readiness probe applied to this component. |
| spec.adminApi.readinessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.adminApi.readinessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.adminApi.readinessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.adminApi.readinessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.adminApi.readinessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.adminApi.replicas | integer | The number of instances to deploy. |
| spec.adminApi.resources | object | Modifies the resource limits and requests to apply to this component. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits){:target="_blank"}. |
| spec.adminApi.template | object | Template to specify how resources are generated. |
| spec.adminApi.template.pod | object | Template to override attributes for pods created for this component. |
| spec.adminApi.template.pod.affinity | object | The pod's affinity rules. |
| spec.adminApi.template.pod.enableServiceLinks | boolean | Indicates whether information about services should be injected into Pod's environment variables. |
| spec.adminApi.template.pod.hostAliases | array | The pod's HostAliases. HostAliases is an optional list of hosts and IPs that will be injected into the Pod's hosts file if specified. |
| spec.adminApi.template.pod.imagePullSecrets | array | List of references to secrets in the same namespace to use for pulling any of the images used by this Pod. When the `STRIMZI_IMAGE_PULL_SECRETS` environment variable in Cluster Operator and the `imagePullSecrets` option are specified, only the `imagePullSecrets` variable is used and the `STRIMZI_IMAGE_PULL_SECRETS` variable is ignored. |
| spec.adminApi.template.pod.metadata | object | Metadata applied to the resource. |
| spec.adminApi.template.pod.metadata.annotations | object | Annotations added to the Kubernetes resource. |
| spec.adminApi.template.pod.metadata.labels | object | Labels added to the Kubernetes resource. |
| spec.adminApi.template.pod.priorityClassName | string | The name of the priority class used to assign priority to the pods. For more information about priority classes, see {K8sPriorityClass}. |
| spec.adminApi.template.pod.schedulerName | string | The name of the scheduler used to dispatch this `Pod`. If not specified, the default scheduler will be used. |
| spec.adminApi.template.pod.securityContext | object | Configures pod-level security attributes and common container settings. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/){:target="_blank"}. |
| spec.adminApi.template.pod.terminationGracePeriodSeconds | integer | The grace period is the duration in seconds after the processes running in the pod are sent a termination signal, and the time when the processes are forcibly halted with a kill signal. Set this value to longer than the expected cleanup time for your process. Value must be a non-negative integer. A zero value indicates delete immediately. You might need to increase the grace period for very large Kafka clusters, so that the Kafka brokers have enough time to transfer their work to another broker before they are terminated. Defaults to 30 seconds. |
| spec.adminApi.template.pod.tmpDirSizeLimit | string | Defines the total amount (for example `1Gi`) of local storage required for temporary EmptyDir volume (`/tmp`). Default value is `5Mi`. |
| spec.adminApi.template.pod.tolerations | array | The pod's tolerations. |
| spec.adminApi.template.pod.topologySpreadConstraints | array | The pod's topology spread constraints. |


### adminUI

| Property | Type | Description |
| --- | --- | --- |
| spec.adminUI | object | Configuration of the web server that hosts the administration user interface. |
| spec.adminUI.authentication | array | Defines the authentication mechanism for the UI. |
| spec.adminUI.endpoints | array | Defines endpoints that will be created to communicate with the component. If nothing is specified, a default endpoint is created that is externally accessible via a Route with Bearer Authentication.  |
| spec.adminUI.env | array | Apply additional custom environment variables to this component. |
| spec.adminUI.image | string | Identify a custom image to use for this component. |
| spec.adminUI.livenessProbe | object | Modify the Kubernetes liveness probe applied to this component. |
| spec.adminUI.livenessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.adminUI.livenessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.adminUI.livenessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.adminUI.livenessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.adminUI.livenessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.adminUI.logging | object | Specify custom logging for this component. |
| spec.adminUI.logging.loggers | object | A Map from logger name to logger level. |
| spec.adminUI.logging.type | string | Logging type, must be either 'inline' or 'external'. |
| spec.adminUI.logging.valueFrom | object | `ConfigMap` entry where the logging configuration is stored.  |
| spec.adminUI.logging.valueFrom.configMapKeyRef | object | Reference to the key in the ConfigMap containing the configuration. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#define-container-environment-variables-using-configmap-data){:target="_blank"}. |
| spec.adminUI.readinessProbe | object | Modify the Kubernetes readiness probe applied to this component. |
| spec.adminUI.readinessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.adminUI.readinessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.adminUI.readinessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.adminUI.readinessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.adminUI.readinessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.adminUI.redis | object | Configuration options for the redis container used to store UI login sessions. |
| spec.adminUI.redis.env | array | Apply additional custom environment variables to this component. |
| spec.adminUI.redis.image | string | Identify a custom image to use for this component. |
| spec.adminUI.redis.livenessProbe | object | Modify the Kubernetes liveness probe applied to this component. |
| spec.adminUI.redis.livenessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.adminUI.redis.livenessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.adminUI.redis.livenessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.adminUI.redis.livenessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.adminUI.redis.livenessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.adminUI.redis.readinessProbe | object | Modify the Kubernetes readiness probe applied to this component. |
| spec.adminUI.redis.readinessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.adminUI.redis.readinessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.adminUI.redis.readinessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.adminUI.redis.readinessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.adminUI.redis.readinessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.adminUI.redis.resources | object | Modifies the resource limits and requests to apply to this component. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits){:target="_blank"}. |
| spec.adminUI.replicas | integer | The number of instances to deploy. |
| spec.adminUI.resources | object | Modifies the resource limits and requests to apply to this component. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits){:target="_blank"}. |

### apicurioRegistry

| Property | Type | Description |
| --- | --- | --- |
| spec.apicurioRegistry | object | Configuration of the Apicurio Registry server. |
| spec.apicurioRegistry.config | object | Apicurio registry config properties with the following prefixes cannot be set:  (with the exception of: ). |
| spec.apicurioRegistry.endpoints | array | Defines endpoints that will be created to communicate with the component. If nothing is specified, a default endpoint is created that is externally accessible via a Route with Bearer Authentication.  |
| spec.apicurioRegistry.env | array | Apply additional custom environment variables to this component. |
| spec.apicurioRegistry.image | string | Identify a custom image to use for this component. |
| spec.apicurioRegistry.livenessProbe | object | Modify the Kubernetes liveness probe applied to this component. |
| spec.apicurioRegistry.livenessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.apicurioRegistry.livenessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.apicurioRegistry.livenessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.apicurioRegistry.livenessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.apicurioRegistry.livenessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.apicurioRegistry.logging | object | Specify custom logging for this component. |
| spec.apicurioRegistry.logging.loggers | object | A Map from logger name to logger level. |
| spec.apicurioRegistry.logging.type | string | Logging type, must be either 'inline' or 'external'. |
| spec.apicurioRegistry.logging.valueFrom | object | `ConfigMap` entry where the logging configuration is stored.  |
| spec.apicurioRegistry.logging.valueFrom.configMapKeyRef | object | Reference to the key in the ConfigMap containing the configuration. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#define-container-environment-variables-using-configmap-data){:target="_blank"}. |
| spec.apicurioRegistry.proxyContainer | object | Specify overrides for the proxy container. |
| spec.apicurioRegistry.proxyContainer.env | array | Apply additional custom environment variables to this component. |
| spec.apicurioRegistry.proxyContainer.image | string | Identify a custom image to use for this component. |
| spec.apicurioRegistry.proxyContainer.logging | object | Specify custom logging for this component. |
| spec.apicurioRegistry.proxyContainer.logging.loggers | object | A Map from logger name to logger level. |
| spec.apicurioRegistry.proxyContainer.logging.type | string | Logging type, must be either 'inline' or 'external'. |
| spec.apicurioRegistry.proxyContainer.logging.valueFrom | object | `ConfigMap` entry where the logging configuration is stored.  |
| spec.apicurioRegistry.proxyContainer.logging.valueFrom.configMapKeyRef | object | Reference to the key in the ConfigMap containing the configuration. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#define-container-environment-variables-using-configmap-data){:target="_blank"}. |
| spec.apicurioRegistry.proxyContainer.resources | object | Modifies the resource limits and requests to apply to this component. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits){:target="_blank"}. |
| spec.apicurioRegistry.readinessProbe | object | Modify the Kubernetes readiness probe applied to this component. |
| spec.apicurioRegistry.readinessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.apicurioRegistry.readinessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.apicurioRegistry.readinessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.apicurioRegistry.readinessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.apicurioRegistry.readinessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.apicurioRegistry.replicas | integer | The number of instances to deploy. |
| spec.apicurioRegistry.resources | object | Modifies the resource limits and requests to apply to this component. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits){:target="_blank"}. |

### collector

| Property | Type | Description |
| --- | --- | --- |
| spec.collector | object | Configuration of the collector server responsible for aggregating metrics from Kafka brokers. |
| spec.collector.env | array | Apply additional custom environment variables to this component. |
| spec.collector.image | string | Identify a custom image to use for this component. |
| spec.collector.livenessProbe | object | Modify the Kubernetes liveness probe applied to this component. |
| spec.collector.livenessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.collector.livenessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.collector.livenessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.collector.livenessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.collector.livenessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.collector.logging | object | Specify custom logging for this component. |
| spec.collector.logging.loggers | object | A Map from logger name to logger level. |
| spec.collector.logging.type | string | Logging type, must be either 'inline' or 'external'. |
| spec.collector.logging.valueFrom | object | `ConfigMap` entry where the logging configuration is stored.  |
| spec.collector.logging.valueFrom.configMapKeyRef | object | Reference to the key in the ConfigMap containing the configuration. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#define-container-environment-variables-using-configmap-data){:target="_blank"}. |
| spec.collector.readinessProbe | object | Modify the Kubernetes readiness probe applied to this component. |
| spec.collector.readinessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.collector.readinessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.collector.readinessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.collector.readinessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.collector.readinessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.collector.replicas | integer | The number of instances to deploy. |
| spec.collector.resources | object | Modifies the resource limits and requests to apply to this component. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits){:target="_blank"}. |
| spec.collector.template | object | Template to specify how resources are generated. |
| spec.collector.template.pod | object | Template to override attributes for pods created for this component. |
| spec.collector.template.pod.affinity | object | The pod's affinity rules. |
| spec.collector.template.pod.enableServiceLinks | boolean | Indicates whether information about services should be injected into Pod's environment variables. |
| spec.collector.template.pod.hostAliases | array | The pod's HostAliases. HostAliases is an optional list of hosts and IPs that will be injected into the Pod's hosts file if specified. |
| spec.collector.template.pod.imagePullSecrets | array | List of references to secrets in the same namespace to use for pulling any of the images used by this Pod. When the `STRIMZI_IMAGE_PULL_SECRETS` environment variable in Cluster Operator and the `imagePullSecrets` option are specified, only the `imagePullSecrets` variable is used and the `STRIMZI_IMAGE_PULL_SECRETS` variable is ignored. |
| spec.collector.template.pod.metadata | object | Metadata applied to the resource. |
| spec.collector.template.pod.metadata.annotations | object | Annotations added to the Kubernetes resource. |
| spec.collector.template.pod.metadata.labels | object | Labels added to the Kubernetes resource. |
| spec.collector.template.pod.priorityClassName | string | The name of the priority class used to assign priority to the pods. For more information about priority classes, see {K8sPriorityClass}. |
| spec.collector.template.pod.schedulerName | string | The name of the scheduler used to dispatch this `Pod`. If not specified, the default scheduler will be used. |
| spec.collector.template.pod.securityContext | object | Configures pod-level security attributes and common container settings. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/){:target="_blank"}. |
| spec.collector.template.pod.terminationGracePeriodSeconds | integer | The grace period is the duration in seconds after the processes running in the pod are sent a termination signal, and the time when the processes are forcibly halted with a kill signal. Set this value to longer than the expected cleanup time for your process. Value must be a non-negative integer. A zero value indicates delete immediately. You might need to increase the grace period for very large Kafka clusters, so that the Kafka brokers have enough time to transfer their work to another broker before they are terminated. Defaults to 30 seconds. |
| spec.collector.template.pod.tmpDirSizeLimit | string | Defines the total amount (for example `1Gi`) of local storage required for temporary EmptyDir volume (`/tmp`). Default value is `5Mi`. |
| spec.collector.template.pod.tolerations | array | The pod's tolerations. |
| spec.collector.template.pod.topologySpreadConstraints | array | The pod's topology spread constraints. |

### images

| Property | Type | Description |
| --- | --- | --- |
| spec.images | object | Configuration for accessing {{site.data.reuse.es_name}} Docker images. |
| spec.images.pullPolicy | string | The image pull policy to use for the components. |
| spec.images.pullSecrets | array | The image pull secrets to use for the components. |

### kafkaProxy

| Property | Type | Description |
| --- | --- | --- |
| spec.kafkaProxy | object | Configuration of the Kafka Proxy. |
| spec.kafkaProxy.env | array | Apply additional custom environment variables to this component. |
| spec.kafkaProxy.image | string | Identify a custom image to use for this component. |
| spec.kafkaProxy.livenessProbe | object | Modify the Kubernetes liveness probe applied to this component. |
| spec.kafkaProxy.livenessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.kafkaProxy.livenessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.kafkaProxy.livenessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.kafkaProxy.livenessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.kafkaProxy.livenessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.kafkaProxy.readinessProbe | object | Modify the Kubernetes readiness probe applied to this component. |
| spec.kafkaProxy.readinessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.kafkaProxy.readinessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.kafkaProxy.readinessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.kafkaProxy.readinessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.kafkaProxy.readinessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.kafkaProxy.resources | object | Modifies the resource limits and requests to apply to this component. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits){:target="_blank"}. |
| spec.kafkaProxy.template | object | Template to specify how resources are generated. |
| spec.kafkaProxy.template.pod | object | Template to override attributes for pods created for this component. |
| spec.kafkaProxy.template.pod.affinity | object | The pod's affinity rules. |
| spec.kafkaProxy.template.pod.enableServiceLinks | boolean | Indicates whether information about services should be injected into Pod's environment variables. |
| spec.kafkaProxy.template.pod.hostAliases | array | The pod's HostAliases. HostAliases is an optional list of hosts and IPs that will be injected into the Pod's hosts file if specified. |
| spec.kafkaProxy.template.pod.imagePullSecrets | array | List of references to secrets in the same namespace to use for pulling any of the images used by this Pod. When the `STRIMZI_IMAGE_PULL_SECRETS` environment variable in Cluster Operator and the `imagePullSecrets` option are specified, only the `imagePullSecrets` variable is used and the `STRIMZI_IMAGE_PULL_SECRETS` variable is ignored. |
| spec.kafkaProxy.template.pod.metadata | object | Metadata applied to the resource. |
| spec.kafkaProxy.template.pod.metadata.annotations | object | Annotations added to the Kubernetes resource. |
| spec.kafkaProxy.template.pod.metadata.labels | object | Labels added to the Kubernetes resource. |
| spec.kafkaProxy.template.pod.priorityClassName | string | The name of the priority class used to assign priority to the pods. For more information about priority classes, see {K8sPriorityClass}. |
| spec.kafkaProxy.template.pod.schedulerName | string | The name of the scheduler used to dispatch this `Pod`. If not specified, the default scheduler will be used. |
| spec.kafkaProxy.template.pod.securityContext | object | Configures pod-level security attributes and common container settings. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/){:target="_blank"}. |
| spec.kafkaProxy.template.pod.terminationGracePeriodSeconds | integer | The grace period is the duration in seconds after the processes running in the pod are sent a termination signal, and the time when the processes are forcibly halted with a kill signal. Set this value to longer than the expected cleanup time for your process. Value must be a non-negative integer. A zero value indicates delete immediately. You might need to increase the grace period for very large Kafka clusters, so that the Kafka brokers have enough time to transfer their work to another broker before they are terminated. Defaults to 30 seconds. |
| spec.kafkaProxy.template.pod.tmpDirSizeLimit | string | Defines the total amount (for example `1Gi`) of local storage required for temporary EmptyDir volume (`/tmp`). Default value is `5Mi`. |
| spec.kafkaProxy.template.pod.tolerations | array | The pod's tolerations. |
| spec.kafkaProxy.template.pod.topologySpreadConstraints | array | The pod's topology spread constraints. |

### license

| Property | Type | Description |
| --- | --- | --- |
| spec.license | object | Specify the license information for the instance of {{site.data.reuse.es_name}}. |
| spec.license.accept | boolean | Accept the selected product license by following the guidance in [licensing]({{ 'support/licensing' | relative_url }}){:target="_blank"}. |
| spec.license.license | string | License ID that the user is selecting and accepting. For more information, see [licensing]({{ 'support/licensing' | relative_url }}){:target="_blank"}. |
| spec.license.use | string | Specify if you intend for this installation to be used in a production environment. For more information, see [licensing]({{ 'support/licensing' | relative_url }}).|

### requestIbmServices

| Property | Type | Description |
| --- | --- | --- |
| spec.requestIbmServices | object | Specify the IBM Cloud Pak foundational services you want to configure. |
| spec.requestIbmServices.iam | boolean | Specifies whether to create a request for deploying the Identity and Access Management (IAM) service as part of the IBM Cloud Pak foundational services. You can use the IAM service for controlling access to the UI. |
| spec.requestIbmServices.monitoring | boolean | Specifies whether to create a request for deploying the Monitoring service as part of the IBM Cloud Pak foundational services. You can use the Monitoring service to monitor the status of your cluster and applications by using Grafana dashboards. |


### restProducer

| Property | Type | Description |
| --- | --- | --- |
| spec.restProducer | object | Configuration of the REST Producer server that allows messages to be produced to Kafka topics from REST clients. |
| spec.restProducer.endpoints | array | Defines endpoints that will be created to communicate with the component. If nothing is specified, a default endpoint is created that is externally accessible via a Route with Bearer Authentication.  |
| spec.restProducer.env | array | Apply additional custom environment variables to this component. |
| spec.restProducer.image | string | Identify a custom image to use for this component. |
| spec.restProducer.livenessProbe | object | Modify the Kubernetes liveness probe applied to this component. |
| spec.restProducer.livenessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.restProducer.livenessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.restProducer.livenessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.restProducer.livenessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.restProducer.livenessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.restProducer.logging | object | Specify custom logging for this component. |
| spec.restProducer.logging.loggers | object | A Map from logger name to logger level. |
| spec.restProducer.logging.type | string | Logging type, must be either 'inline' or 'external'. |
| spec.restProducer.logging.valueFrom | object | `ConfigMap` entry where the logging configuration is stored.  |
| spec.restProducer.logging.valueFrom.configMapKeyRef | object | Reference to the key in the ConfigMap containing the configuration. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#define-container-environment-variables-using-configmap-data){:target="_blank"}. |
| spec.restProducer.readinessProbe | object | Modify the Kubernetes readiness probe applied to this component. |
| spec.restProducer.readinessProbe.failureThreshold | integer | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. |
| spec.restProducer.readinessProbe.initialDelaySeconds | integer | The initial delay before first the health is first checked. Default to 15 seconds. Minimum value is 0. |
| spec.restProducer.readinessProbe.periodSeconds | integer | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. |
| spec.restProducer.readinessProbe.successThreshold | integer | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1. |
| spec.restProducer.readinessProbe.timeoutSeconds | integer | The timeout for each attempted health check. Default to 5 seconds. Minimum value is 1. |
| spec.restProducer.replicas | integer | The number of instances to deploy. |
| spec.restProducer.resources | object | Modifies the resource limits and requests to apply to this component. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits){:target="_blank"}. |
| spec.restProducer.template | object | Template to specify how resources are generated. |
| spec.restProducer.template.pod | object | Template to override attributes for pods created for this component. |
| spec.restProducer.template.pod.affinity | object | The pod's affinity rules. |
| spec.restProducer.template.pod.enableServiceLinks | boolean | Indicates whether information about services should be injected into Pod's environment variables. |
| spec.restProducer.template.pod.hostAliases | array | The pod's HostAliases. HostAliases is an optional list of hosts and IPs that will be injected into the Pod's hosts file if specified. |
| spec.restProducer.template.pod.imagePullSecrets | array | List of references to secrets in the same namespace to use for pulling any of the images used by this Pod. When the `STRIMZI_IMAGE_PULL_SECRETS` environment variable in Cluster Operator and the `imagePullSecrets` option are specified, only the `imagePullSecrets` variable is used and the `STRIMZI_IMAGE_PULL_SECRETS` variable is ignored. |
| spec.restProducer.template.pod.metadata | object | Metadata applied to the resource. |
| spec.restProducer.template.pod.metadata.annotations | object | Annotations added to the Kubernetes resource. |
| spec.restProducer.template.pod.metadata.labels | object | Labels added to the Kubernetes resource. |
| spec.restProducer.template.pod.priorityClassName | string | The name of the priority class used to assign priority to the pods. For more information about priority classes, see {K8sPriorityClass}. |
| spec.restProducer.template.pod.schedulerName | string | The name of the scheduler used to dispatch this `Pod`. If not specified, the default scheduler will be used. |
| spec.restProducer.template.pod.securityContext | object | Configures pod-level security attributes and common container settings. For more information, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/){:target="_blank"}. |
| spec.restProducer.template.pod.terminationGracePeriodSeconds | integer | The grace period is the duration in seconds after the processes running in the pod are sent a termination signal, and the time when the processes are forcibly halted with a kill signal. Set this value to longer than the expected cleanup time for your process. Value must be a non-negative integer. A zero value indicates delete immediately. You might need to increase the grace period for very large Kafka clusters, so that the Kafka brokers have enough time to transfer their work to another broker before they are terminated. Defaults to 30 seconds. |
| spec.restProducer.template.pod.tmpDirSizeLimit | string | Defines the total amount (for example `1Gi`) of local storage required for temporary EmptyDir volume (`/tmp`). Default value is `5Mi`. |
| spec.restProducer.template.pod.tolerations | array | The pod's tolerations. |
| spec.restProducer.template.pod.topologySpreadConstraints | array | The pod's topology spread constraints. |

### security

| Property | Type | Description |
| --- | --- | --- |
| spec.security | object | Security configuration for the {{site.data.reuse.es_name}} components. |
| spec.security.internalTls | string | Configure what TLS version {{site.data.reuse.es_name}} components use to communicate with one another. |

### strimziOverrides

| Property | Type | Description |
| --- | --- | --- |
| spec.strimziOverrides | object | Configuration of the Kafka and ZooKeeper clusters. Spec can be viewed at [Strimzi documentation](https://strimzi.io/docs/operators/latest/configuring.html){:target="_blank"}. |

### version

| Property | Type | Description |
| --- | --- | --- |
| spec.version | string | Version of the {{site.data.reuse.es_name}} instance. |

## status

| Property | Type | Description |
| --- | --- | --- |
| status | object | The status of the {{site.data.reuse.es_name}} instance. |
| status.adminUiUrl | string | Web address for the {{site.data.reuse.es_name}} administration UI. |
| status.bootstrapRoutes | array | Routes for the new bootstrap connections. |
| status.conditions | array | Current state of the {{site.data.reuse.es_name}} cluster. |
| status.customImages | boolean | Identifies whether any of the Docker images have been modified from the defaults for this version of {{site.data.reuse.es_name}}. |
| status.endpoints | array | Addresses of the interfaces provided by the {{site.data.reuse.es_name}} cluster. |
| status.kafkaListeners | array | Addresses of the internal and external listeners. |
| status.licenseVersion | string | The License version the user has selected. |
| status.observedGeneration | integer | The generation of the resource at the last successful reconciliation. |
| status.phase | string | Identifies the current state of the {{site.data.reuse.es_name}} instance. |
| status.routes | object | OpenShift Routes created as part of the {{site.data.reuse.es_name}} cluster. |
| status.versions | object | Information about the version of this instance and it's upgradable versions. |
| status.versions.available | object | The versions that this instance of {{site.data.reuse.es_name}} can be upgraded to. |
| status.versions.available.channels | array | A list of versions that the operator is able to automatically upgrade from. |
| status.versions.available.versions | array | A list of versions that the operator is able to upgrade this instance of {{site.data.reuse.es_name}} to. |
| status.versions.reconciled | string | The current running version of this operator. |

