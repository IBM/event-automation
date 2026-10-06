---
title: "Setting up Confluent Platform"
excerpt: "Set up Confluent for Kubernetes ready for migration from Event Streams."
categories: migration
slug: setup
toc: true
---

Before setting up Confluent Platform, complete [setting up certificates](../certificates/). If your cluster uses a multi-zone deployment, also complete [configuring rack awareness](../migrating-rack-awareness/). In this phase, install the Confluent for Kubernetes (CFK) operator and deploy the required component custom resources in your target namespace.

## Setup checklist
{: #setup-checklist}

Review the following setup tasks:

- [Determining components to deploy](#determining-components-to-deploy): Identify the Confluent Platform custom resources needed to match your {{site.data.reuse.es_name}} deployment.
- [Installing CFK and deploying custom resources](#installing-cfk-and-deploying-custom-resources): Install the CFK operator in your target namespace, and deploy custom resources in the required sequence by using the Kafka version, broker count, and topic defaults determined during planning.
- [Configuring listeners and security](#configuring-listeners-and-security): Reference your pre-created TLS secrets, and configure network listeners, authentication mechanisms, and authorization rules.
- [Configuring tiered storage](#configuring-tiered-storage): Provision a dedicated object-storage bucket for Confluent Platform if tiered storage is enabled. Do not reuse the {{site.data.reuse.es_name}} bucket.
- [Verifying cluster readiness](#verifying-cluster-readiness): Confirm that all deployed components report a `Ready` status before starting migration.

## Determining components to deploy
{: #determining-components-to-deploy}

Deploy only the Confluent Platform components that match your existing {{site.data.reuse.es_name}} deployment.

| Component | CFK custom resource | When to deploy |
|-----------|---------------------|----------------|
| Kafka | `Kafka` | Always |
| Schema Registry | `SchemaRegistry` | If you are using Apicurio Registry |
| Control Center | `ControlCenter` | To replace the {{site.data.reuse.es_name}} UI |
| Kafka Connect | `Connect` | If you are using Kafka Connect |
| REST Proxy | `KafkaRestProxy` | If you are using the Kafka Bridge or REST producer |
| Self-Balancing Clusters | Setting on the `Kafka` custom resource | If you are replacing Cruise Control |

## Installing CFK and deploying custom resources
{: #installing-cfk-and-deploying-custom-resources}

Install the CFK operator in your target namespace by following the [Confluent documentation](https://docs.confluent.io/operator/current/co-deploy-cfk.html){:target="_blank"}, and then create the component custom resources by running `kubectl apply -f`. Confluent Platform 8.x uses KRaft mode for cluster metadata management. Deploy the custom resources in the following order:

| Step | Custom resource | Notes |
|------|-----------------|-------|
| 1 | `KRaftController` | Manages cluster metadata. Deploy 3 replicas for high availability. |
| 2 | `Kafka` | The broker component. References the `KRaftController` through `spec.dependencies.kRaftController.clusterRef`. |
| 3 | `SchemaRegistry` | Deploy if you are using Apicurio Registry. |
| 4 | `Connect` | Deploy if you are using Kafka Connect. |
| 5 | `ControlCenter` | Replaces the {{site.data.reuse.es_name}} UI. |
| 6 | `KafkaRestClass` | Required for destination-initiated `ClusterLink` resources and for `KafkaTopic` resources on RBAC-enabled clusters. |

Wait for each resource to reach a `Ready` state before deploying the next. Run the following command to check the rollout status:

```bash
kubectl rollout status statefulset/kafka -n <cp-namespace>
```

Where:
- `<cp-namespace>` is the Kubernetes namespace where you are deploying Confluent Platform.

Use a Confluent Platform image that includes the same Kafka version as your {{site.data.reuse.es_name}} deployment. Verify the exact versions by checking the [Confluent Platform and Kafka interoperability matrix](https://docs.confluent.io/platform/current/installation/versions-interoperability.html){:target="_blank"}.

## Configuring listeners and security
{: #configuring-listeners-and-security}

Configure the Confluent Platform listeners and security settings to match your {{site.data.reuse.es_name}} security configuration. For more information, see the [Confluent security documentation](https://docs.confluent.io/operator/current/co-authenticate-kafka.html){:target="_blank"}.

| Layer | {{site.data.reuse.es_name}} | Confluent Platform equivalent |
|-------|-----------------------------|-------------------------------|
| Wire encryption | TLS 1.2+ | TLS 1.2+ |
| External authentication | SCRAM-SHA-512 | SASL/PLAIN over TLS (`type: plain`, `tls.enabled: true`) |
| External authentication (mTLS) | Mutual TLS (`authentication: tls`) | mTLS (`type: mtls`) with `principalMappingRules` |
| External authentication (OAuth) | OAUTHBEARER (`strimzi-kafka-oauth` library) | OAUTHBEARER (native Kafka `OAuthBearerLoginCallbackHandler`, `type: oauth` listener) |
| Internal authentication | Mutual TLS (mTLS) | mTLS or TLS without client authentication |
| Authorization | Kafka ACLs (`KafkaUser` custom resource) | Kafka ACLs (`type: simple`, with `superUsers`) |
| Authorization (OAuth) | `KeycloakAuthorizer` (Keycloak RBAC rules) | `AclAuthorizer` or `Confluent RBAC` |
| Schema Registry authentication | SCRAM or mTLS | TLS (typically no authentication on the internal listener) |

**Note:** CFK's primary external listener authentication method is SASL/PLAIN over TLS, so external client applications connect securely by using a username and password. You can configure SCRAM-SHA-512 on a CFK listener through `configOverrides`, but this configuration is not supported through the CFK API and is outside the scope of Confluent Support. Plan to update your external client applications from SCRAM-SHA-512 to SASL/PLAIN. For more information, see [component mapping](../feature-compatibility/).

### mTLS listener configuration
{: #mtls-listener-configuration}

If your {{site.data.reuse.es_name}} deployment uses mTLS-authenticated external clients, configure the Confluent Platform external listener for mTLS. This requires two certificates: one for internal Kafka/KRaft communication and one for the external listener. The following examples use cert-manager to issue these certificates. If you are using a different certificate management mechanism, issue equivalent certificates with the same SANs and usages through your chosen tooling.

Before you create these certificates, choose your certificate migration path and set up your certificate authorities. For the instructions, see [setting up certificates](../certificates/#migration-paths). The issuer names referenced in the following section (`cluster-ca-issuer` and `client-ca-issuer`) represent the mechanism you use to sign certificates from your CAs, whether that is cert-manager, your corporate PKI, or another tool.

**Broker replication certificate (`cluster-tls`):** Issue a certificate signed by your Cluster CA issuer, with `secretName: cluster-tls`. The SANs must cover the internal cluster DNS for each CFK component you deploy, including `*.<namespace>.svc.cluster.local`, `*.<kafka-cr-name>.<namespace>.svc.cluster.local`, and `*.<kraftcontroller-cr-name>.<namespace>.svc.cluster.local`. Add equivalent entries for any other components (`SchemaRegistry`, `Connect`, `ControlCenter`) you deploy. Set `usages` to `server auth` and `client auth`. For the cert-manager `Certificate` field reference, see the [cert-manager API documentation](https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.CertificateSpec){:target="_blank"}.

**External listener certificate (`client-tls`):** Issue a certificate signed by your Client CA issuer, with `secretName: client-tls`. The SANs must cover the internal cluster DNS (`*.<namespace>.svc.cluster.local`, `*.<kafka-cr-name>.<namespace>.svc.cluster.local`) and the external broker addresses that clients connect to. Set `usages` to `server auth` only. This certificate is the broker TLS server certificate on the external listener. Client certificates used for mTLS authentication are separate and must have `client auth`. The `ca.crt` embedded in this secret is the trust anchor the broker uses to verify incoming mTLS client certificates. It must be the Client CA, not the Cluster CA.

Run the following command to verify both certificates are issued before deploying the Kafka custom resource:

```bash
kubectl get certificate -n <cp-namespace>
# Both certificates must show READY=True
```

Where:
- `<cp-namespace>` is the Kubernetes namespace where you are deploying Confluent Platform.

Configure the external listener on the `Kafka` custom resource to use mTLS and reference these secrets:

```yaml
listeners:
  external:
    authentication:
      type: mtls
      mtls:
        principalMappingRules:
          - 'RULE:.*CN[\s]?=[\s]?([a-zA-Z0-9.-]*)?.*/$1/'
        sslClientAuthentication: required
    externalAccess:
      type: route
      route:
        bootstrapPrefix: kafka-bootstrap
        brokerPrefix: kafka-broker
        domain: apps.<openshift-domain>
    tls:
      enabled: true
      secretRef: client-tls      # external listener trusts the Client CA
  replication:
    tls:
      enabled: true
      secretRef: cluster-tls
```

The `principalMappingRules` regular expression extracts the `CN` value from the client certificate DN and uses it as the Kafka principal (for example, `User:admin`). Set the `commonName` in each client certificate to match the original {{site.data.reuse.es_name}} `KafkaUser` name to preserve ACLs. For the full mTLS user migration workflow, including CA setup, user certificate creation, and client configuration, see [migrating mTLS users](../migrating-mtls-users/).

**Note:** If you used the `brokerCertChainAndKey` listener certificate override in {{site.data.reuse.es_name}}, you can reuse your existing PKI broker certificate on the CFK external listener so that client truststores require no changes. Follow the steps in [migrating listener certificate override](../certificates/#cert-overrides-migration) to build the `client-tls` secret from your existing PKI certificate before you deploy the `Kafka` custom resource.

## Configuring tiered storage
{: #configuring-tiered-storage}

{{site.data.reuse.es_name}} uses the Aiven Remote Storage Manager plugin for tiered storage. Confluent Platform uses its own native tiered storage implementation. Because the two implementations use different storage formats, you must create a separate object-storage bucket for Confluent Platform. Do not point Confluent Platform at the bucket used by {{site.data.reuse.es_name}}.

Enable Confluent tiered storage on the `Kafka` custom resource through `configOverrides` and a mounted credentials secret. For configuration details, see the [Confluent Tiered Storage documentation](https://docs.confluent.io/platform/current/clusters/tiered-storage.html){:target="_blank"}.

Your existing remote data on {{site.data.reuse.es_name}} does not need to be copied separately. Cluster Linking accesses and migrates the remote data through the source broker during replication. After you promote a topic on Confluent Platform, enable tiered storage for that topic so that Confluent Platform starts offloading data to its own bucket. For step-by-step instructions, see [migrating topic configuration and data](../migrating-topics/#enabling-tiered-storage).

## Verifying cluster readiness
{: #verifying-cluster-readiness}

Run the following command to check the status of all deployed resources:

```bash
kubectl get kraftcontrollers.platform.confluent.io,kafkas.platform.confluent.io,schemaregistries.platform.confluent.io,connects.platform.confluent.io,controlcenters.platform.confluent.io,kafkarestclasses.platform.confluent.io -n <cp-namespace>
```

Where:
- `<cp-namespace>` is the Kubernetes namespace where you are deploying Confluent Platform.

Each deployed resource must show `READY = True` before you proceed with migration.