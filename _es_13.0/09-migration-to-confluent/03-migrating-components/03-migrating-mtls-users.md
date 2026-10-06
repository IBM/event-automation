---
title: "Migrating mTLS users"
excerpt: "Migrate mTLS authenticated Kafka users and certificates from Event Streams to Confluent for Kubernetes."
categories: migration
slug: migrating-mtls-users
toc: true
---

Migrate mutual TLS (mTLS) authenticated Kafka users from {{site.data.reuse.es_name}} to Confluent for Kubernetes (CFK) by completing the following steps:

- [**Review certificate model differences**](#background-and-key-differences): Understand how {{site.data.reuse.es_name}} and CFK handle mTLS certificates differently.
- [**Complete prerequisites**](#prerequisites): Confirm that the setup phase is complete and that the CFK external listener is configured for mTLS.
- [**Set up certificate authorities**](#set-up-certificate-authorities): Set up the CAs used to sign user certificates.
- [**Create user certificates**](#create-user-certificates): Issue one client certificate per mTLS user being migrated.
- [**Connect client applications to CFK**](#connect-client-applications): Update each client application's truststore and keystore to use the new certificates.
- [**Verify the migration**](#verifying-the-migration): Confirm that client applications are authenticating correctly.

## Certificate model differences
{: #background-and-key-differences}

Before you begin, review how {{site.data.reuse.es_name}} and CFK handle mTLS certificates differently.

### {{site.data.reuse.es_name}} certificate model
{: #es-certificate-model}

{{site.data.reuse.es_name}} manages two distinct certificate authorities:

The following table describes the certificate authority types in {{site.data.reuse.es_name}}:

| CA | Purpose | Secret name |
|---|---|---|
| **Cluster CA** | Signs broker server certificates, including the external listener certificate. External clients must include this CA in their truststore to verify the broker. | `<cluster-name>-cluster-ca-cert` (public) / `<cluster-name>-cluster-ca` (private key) |
| **Clients CA** | Signs `KafkaUser` client certificates. The broker uses this CA to verify client identity during mTLS. External clients do not use this CA as their truststore. On CFK, the role of signing the external listener certificate moves to the Client CA (see the CFK model description in the following section). | `<cluster-name>-clients-ca-cert` (public) / `<cluster-name>-clients-ca` (private key) |

Each `KafkaUser` with `authentication.type: tls` receives a dedicated client certificate signed by the Clients CA, stored in a secret named after the user (for example, `admin`), containing `user.crt`, `user.key`, and `user.p12`.

### CFK certificate model
{: #cfk-certificate-model}

The following table describes the unified certificate model in CFK:

| Secret type | Purpose |
|---|---|
| **Broker TLS secret** (`ca.crt`, `tls.crt`, `tls.key`) | The TLS identity for the broker. Clients use `ca.crt` as their truststore. |
| **Client CA trust** | The broker uses the `ca.crt` in the listener TLS secret to verify client certificates during mTLS. |

**Note:** Unlike {{site.data.reuse.es_name}}, where each broker has an individually named certificate, CFK uses one certificate per listener. That certificate uses wildcard SANs (for example, `*.<namespace>.svc.cluster.local`) to cover all broker pods, so no per-pod certificate is needed.

## Prerequisites
{: #prerequisites}

Ensure that the following prerequisites are met before you begin:

- Complete the [preparation](../preparation/) and [setup](../setup/) phases.
- Configure the CFK external listener for mTLS, with broker certificates issued by your chosen PKI tooling (see [setting up Confluent Platform](../setup/#mtls-listener-configuration)).
- Obtain a list of all mTLS `KafkaUser` resources to migrate. Run the following command to list all mTLS users on your {{site.data.reuse.es_name}} cluster:

  ```bash
  kubectl get kafkausers.eventstreams.ibm.com -n <eventstreams-namespace> -o json \
    | jq -r '.items[] | select(.spec.authentication.type == "tls") | .metadata.name'
  ```

  Where:
  - `<eventstreams-namespace>` is the namespace where {{site.data.reuse.es_name}} is installed.

### Principal mapping
{: #understanding-principal-mapping}

Configure principal mapping correctly to ensure that Kafka principals and ACLs are preserved after migration.

In {{site.data.reuse.es_name}}, the `KafkaUser` resource name becomes the Kafka principal (for example, a `KafkaUser` named `admin` has principal `User:CN=admin`). {{site.data.reuse.es_name}} sets the certificate `CN` to match the user name.

**Note:** In {{site.data.reuse.es_name}}, mTLS user principals include the `CN=` prefix in the format `User:CN=<kafka-user-name>`. ACLs that reference this format must be transformed before Confluent Platform can evaluate them correctly. For more information, see the [principal transform step](../migrating-users/#migrate-access-control-lists) in migrating users.

CFK applies a `principalMappingRules` regular expression to the client certificate distinguished name. The rule is as follows:

```
RULE:.*CN[\s]?=[\s]?([a-zA-Z0-9.-]*)?.*/$1/
```

This extracts the `CN` value and uses it as the Kafka principal, producing `User:admin` rather than `User:CN=admin`.

You must set the `commonName` in each new client certificate to exactly match the original {{site.data.reuse.es_name}} `KafkaUser` name (for example, `admin`), regardless of which PKI tooling you use to issue it. This preserves the Kafka principal (`User:admin`) so that any existing ACLs remain valid after migration.

## Migrating mTLS users to CFK
{: #migrating-mtls-users-to-cfk}

Complete the following steps to migrate each mTLS user from {{site.data.reuse.es_name}} to CFK:

### Step 1: Setting up certificate authorities
{: #set-up-certificate-authorities}

Before you create user certificates, set up the certificate authorities you use to sign them. This migration uses two CAs: a cluster CA for broker certificates and a client CA for client certificates. For instructions about setting up your CAs with your chosen PKI tooling, see [setting up certificates](../certificates/#migration-paths).

These steps assume two CAs are in place in your Confluent Platform namespace: a Cluster CA for signing broker certificates and a Client CA for signing client (user) certificates and the external listener certificate. The names `cluster-ca-issuer` and `client-ca-issuer` refer to those CAs, regardless of the tooling used to set them up.

If your {{site.data.reuse.es_name}} deployment used the `brokerCertChainAndKey` listener certificate override, build the `client-tls` secret from your existing PKI broker certificate before creating user certificates. For instructions, see [migrating listener certificate override](../certificates/#cert-overrides-migration).

### Step 2: Creating user certificates
{: #create-user-certificates}

Issue one client certificate per mTLS user being migrated by using your chosen PKI tooling. Each certificate must satisfy the following requirements:

- **Common name (`CN`)** must exactly match the original {{site.data.reuse.es_name}} `KafkaUser` name (for example, `admin`). This is what the `principalMappingRules` regular expression extracts to derive the Kafka principal. If it does not match, the user ACLs do not apply.
- **Key usage** must include `client auth`.
- **Signing CA** must be your Client CA. The broker trusts the Client CA on the external listener, so certificates signed by any other CA are rejected.

Place the resulting certificate and key, along with the Client CA certificate, in a Kubernetes secret with the following fields:

- `tls.crt`: the client certificate
- `tls.key`: the client private key
- `ca.crt`: the Client CA certificate (the CA that signed `tls.crt`)

The `ca.crt` field is required because step 3 extracts it from this secret to use as the truststore when connecting to CFK. If you are not using cert-manager, you must include the `ca.crt` field explicitly when creating the secret. cert-manager populates the `ca.crt` field automatically, but other PKI tooling does not.

Note the secret name so that you can reference it when configuring the client application. Repeat for each mTLS user being migrated.

### Step 3: Connecting client applications to CFK
{: #connect-client-applications}

After you create the user certificates in step 2, update the truststore (the CA used to verify the broker) and keystore (the client certificate presented to the broker) for each client application. In {{site.data.reuse.es_name}}, the truststore contained the Cluster CA and the keystore contained the {{site.data.reuse.es_name}}-issued `user.crt` and `user.key`. In CFK, the truststore must contain the Client CA and the keystore must contain the new client certificate and key issued in step 2.

Complete the following steps to configure each client application to connect to CFK:

1. Extract the certificate and key from the Kubernetes secret created in step 2. The following example assumes PEM format (`tls.crt`, `tls.key`, `ca.crt`). Adjust the field names if you used a different format. Run the following commands:

   ```bash
   kubectl get secret <user-cert-secret> -n <cp-namespace> \
     -o jsonpath='{.data.ca\.crt}' | base64 -d > ca.crt

   kubectl get secret <user-cert-secret> -n <cp-namespace> \
     -o jsonpath='{.data.tls\.crt}' | base64 -d > client.crt

   kubectl get secret <user-cert-secret> -n <cp-namespace> \
     -o jsonpath='{.data.tls\.key}' | base64 -d > client.key

   # Convert to PKCS8 (required for Java clients)
   openssl pkcs8 -topk8 -nocrypt -in client.key -out client.key.pem

   # Combine cert and key into a single PEM (required when using ssl.keystore.location with ssl.keystore.type=PEM)
   cat client.crt client.key.pem > client-combined.pem
   ```

   Where:
   - `<user-cert-secret>` is the name of the secret you set in the `Certificate` resource for this user.
   - `<cp-namespace>` is the Kubernetes namespace where you deploy Confluent Platform.

2. Configure the Kafka client with the following properties to connect to CFK by using mTLS:

   ```properties
   security.protocol=SSL
   ssl.protocol=TLSv1.2

   ssl.truststore.type=PEM
   ssl.truststore.location=/path/to/ca.crt

   ssl.keystore.type=PEM
   ssl.keystore.location=/path/to/client-combined.pem
   ```

After you complete these steps, [verify the migration](#verifying-the-migration) to confirm that the application connects successfully and that the correct Kafka principal is mapped.

**Note:** Keep both connections running for a period to confirm the new connection is stable before switching over fully. To roll back, revert the client configuration to the original bootstrap address and the {{site.data.reuse.es_name}}-issued certificate.

## Verifying the migration
{: #verifying-the-migration}

Use the following checks to confirm that the migration is complete and that client applications authenticate correctly.

### Verifying the broker certificate chain
{: #verify-broker-certificate-chain}

Run the following command to confirm that the broker presents a certificate signed by the expected CA:

```bash
openssl s_client -connect <bootstrap-address>:<port> \
  -showcerts </dev/null 2>/dev/null \
  | openssl x509 -noout -issuer -subject
```

Where:
- `<bootstrap-address>` is the bootstrap address of your Confluent cluster.
- `<port>` is the port number (for example, `9092`).

### Verifying the client certificate common name
{: #verify-client-certificate-cn}

Run the following command to confirm that the common name in the certificate matches the original `KafkaUser` name:

```bash
openssl x509 -noout -subject -in client.crt
# Expected output contains: CN=admin
# The CN value must match the original KafkaUser name. 
```


### Verifying the broker trusts the client CA
{: #verify-broker-trusts-client-ca}

Run the following command to confirm that the broker accepts the client certificate during the TLS handshake:

```bash
openssl s_client \
  -connect <bootstrap-address>:<port> \
  -cert client.crt \
  -key client.key \
  -CAfile ca.crt
```

A successful TLS handshake confirms that the broker trusts the client CA.

### Verifying the Kafka principal mapping
{: #verify-kafka-principal}

Run the following command to check the broker logs for the authenticated principal after a connection attempt:

```bash
kubectl logs -n <cp-namespace> -l app=<kafka-cr-name> --tail=50 \
  | grep "Principal\|authentication\|ANONYMOUS"
```

Where:
- `<cp-namespace>` is the Kubernetes namespace where you deploy Confluent Platform.
- `<kafka-cr-name>` is the name of your `Kafka` custom resource (for example, `kafka`).

