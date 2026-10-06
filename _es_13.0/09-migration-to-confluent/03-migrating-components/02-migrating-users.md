---
title: "Migrating users"
excerpt: "Migrate user permissions and credentials from Event Streams to Confluent Platform."
categories: migration
slug: migrating-users
toc: true
---

Migrate user permissions and credentials to Confluent Platform as described in the following sections:

- [Migrating access control lists](#migrate-access-control-lists): Export ACLs by using the {{site.data.reuse.es_name}} CLI and import them by using the Confluent REST Proxy.
- [Migrating mutual TLS users](#migrate-mutual-tls-users): Make existing mTLS certificates available to Confluent for Kubernetes (CFK) or issue new certificates.
- [Migrating SCRAM-SHA-512 credentials to SASL/PLAIN](#migrate-scram-sha-512-credentials-to-sasl-plain): Recreate SCRAM-SHA-512 user credentials as SASL/PLAIN secrets in CFK.
- [Migrating OAuth server and client configuration](#migrate-oauth-server-and-client-configuration): Update client configuration to point to the new CFK listener endpoints.

## Migrating access control lists
{: #migrate-access-control-lists}

Access control lists (ACLs) are not automatically transferred as part of topic data replication. You can migrate ACLs by exporting them in a Confluent-compatible format by using the {{site.data.reuse.es_name}} CLI and then importing them directly to the Confluent Platform cluster by using the Confluent REST Proxy.

### Before you begin
{: #before-you-begin}

Complete the following steps before you start the migration:

- Install and initialize the {{site.data.reuse.es_name}} CLI by following the instructions in [logging in](../../getting-started/logging-in/#logging-in-to-event-streams-cli).
- If you have [logged in to the {{site.data.reuse.es_name}} CLI by using SCRAM](../../getting-started/logging-in/#logging-in-with-scram), ensure that your SCRAM user has `cluster.alter` and `cluster.describe` permissions required to export ACLs.
- Deploy a REST Proxy server and enable external access by following the instructions in the [Confluent documentation](https://docs.confluent.io/operator/current/co-configure-rest-proxy.html#configure-crest).
- Ensure that the user that the REST Proxy uses to [authenticate to Kafka](https://docs.confluent.io/operator/current/co-configure-rest-proxy.html#authenticate-crest-with-ak) has `cluster.alter` permission required to create and manage ACLs in Confluent.

### Migrating ACLs
{: #migration-steps}

To migrate ACLs to Confluent Platform, complete the following steps:

1. Export ACLs by running the following {{site.data.reuse.es_name}} CLI command. The command returns all the ACLs that are present in your {{site.data.reuse.es_name}} instance in a JSON file:

   ```bash
   kubectl es acls-ccompat-export --output <export-filename>
   ```

   Where:
   - `<export-filename>` is the name of the JSON file where the exported ACLs are stored.

   **Note:** You can export ACLs for a specific user or topic by using the flags provided in the command. Run the command with the `--help` option to list all the flags and understand their usage.

2. Run the following curl command to import the ACLs to Confluent Platform by using the REST Proxy:

   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -d @<export-filename> \
     https://<rest-proxy-host>:<rest-proxy-port>/v3/clusters/<cluster-id>/acls:batch
   ```

   For more information about the `acls:batch` endpoint, see the [REST proxy API documentation](https://docs.confluent.io/platform/current/kafka-rest/api.html#post--clusters-cluster_id-acls-batch).

   Where:
   - `<rest-proxy-host>` is the host address of the REST Proxy server.
   - `<rest-proxy-port>` is the port of the server.
   - `<cluster-id>` is your Kafka cluster ID. Run the following command to retrieve it:

   ```bash
   CLUSTER_ID=$(curl "https://<rest-proxy-host>:<rest-proxy-port>/v3/clusters" | jq -r '.data[0].cluster_id')
   ```

**Note:** Enable authentication and encryption in your REST proxy server to secure access to your endpoints by following the instructions in the [Confluent documentation](https://docs.confluent.io/operator/current/co-configure-rest-proxy.html#configure-crest). Use curl flags to pass credentials and certificates in your requests.

**Note:** Kafka supports a maximum of 10,000 ACL entries in a single batch upload. If your export file contains more than 10,000 ACL entries, split the entries across multiple files and use those files to add the ACLs to the Confluent Platform cluster in smaller batches by using the Confluent REST Proxy.

## Migrating mutual TLS users
{: #migrate-mutual-tls-users}

To migrate mTLS-authenticated Kafka users from {{site.data.reuse.es_name}} to Confluent Platform, issue new client certificates and update each client application to connect to CFK. For detailed instructions, see [migrating mTLS users](../migrating-mtls-users/).

## Migrating SCRAM-SHA-512 credentials to SASL/PLAIN
{: #migrate-scram-sha-512-credentials-to-sasl-plain}

CFK reads SASL/PLAIN credentials from a Kubernetes secret that contains a `plain-users.json` key. Add your SCRAM credentials inside the JSON referenced by this key to configure them as SASL/PLAIN credentials.

**Note:** Before you begin, ensure that the `jq` command-line utility is installed.

To migrate all the SCRAM credentials at once, complete the following steps:

1. {{site.data.reuse.cncf_cli_login}}
2. In the namespace where your Confluent Platform cluster is installed, run the following command to create a secret to store plain user credentials if it does not already exist:

   ```shell
   kubectl create secret generic <secret-name> --from-literal=plain-users.json='{}' -n <confluent-namespace>
   ```

   Where:
   - `<secret-name>` is the name of the Kubernetes secret for plain user credentials.
   - `<confluent-namespace>` is the namespace where Confluent Platform is installed.

3. Run the following command to switch to the namespace where your {{site.data.reuse.es_name}} instance is installed:

   ```shell
   kubectl config set-context --current --namespace=<eventstreams-namespace>
   ```

   Where:
   - `<eventstreams-namespace>` is the namespace where {{site.data.reuse.es_name}} is installed.

4. Create a shell script that contains the following commands:

   ```shell
   PLAIN_USERS_JSON='{}'
   for username in $(kubectl get kafkausers.eventstreams.ibm.com -o jsonpath='{.items[?(@.spec.authentication.type=="scram-sha-512")].metadata.name}'); do
       printf 'Migrating credentials for user %s\n' "$username"
       if printf '%s' "$PLAIN_USERS_JSON" | jq -e --arg u "$username" 'has($u)' > /dev/null; then
           printf 'Username key %s is already present in the json, skipping adding %s to the json\n' "$username" "$username"
           continue
       fi
       SECRET_NAME=$(kubectl get kafkausers.eventstreams.ibm.com "$username" -o jsonpath='{.status.secret}')
       PASSWORD=$(kubectl get secret "$SECRET_NAME" -o jsonpath='{.data.password}' | base64 --decode)
       if [ -z "$PASSWORD" ]; then
           echo "Secret not found, skipping adding $username to the json"
           continue
       fi
       JQ_FILTER='. += {($u): $p}'
       PLAIN_USERS_JSON=$(printf '%s' "$PLAIN_USERS_JSON" | jq --arg u "$username" --arg p "$PASSWORD" "$JQ_FILTER")
   done
   echo "$PLAIN_USERS_JSON"
   ```

   **Note:** If credentials already exist in the `plain-users` secret, initialize `PLAIN_USERS_JSON` with the existing credentials so that the migrated credentials are appended to them:

   ```shell
   PLAIN_USERS_JSON=$(kubectl get secret <secret-name> -n <confluent-namespace> -o jsonpath='{.data.plain-users\.json}' | base64 --decode)
   ```

5. Run the script and store the output in a variable:

   ```shell
   OUTPUT_JSON=$(./<script-name>.sh)
   ```

   The script outputs a JSON with the credentials to be migrated.
6. Verify the output. Run the following command to update the `plain-users` secret with the JSON containing the credentials to be migrated:

   ```shell
   kubectl create secret generic <secret-name> \
   --from-literal=plain-users.json="$OUTPUT_JSON" \
   --dry-run=client -o yaml -n <confluent-namespace> | kubectl apply -f - -n <confluent-namespace>
   ```

## Migrating OAuth server and client configuration
{: #migrate-oauth-server-and-client-configuration}

OAuth server credentials do not require migration. Your applications continue to authenticate with the same identity provider. After you set up Confluent Platform, update the following configuration in your client applications:

- **Kafka bootstrap address:** Update with the CFK OAuth listener bootstrap address.
- **`ssl.truststore.location` property:** Update with the location of the truststore file containing the CA certificate to verify the CFK OAuth listener certificate.
- **OAuth settings:** Update `sasl.oauthbearer.token.endpoint.url` and any related OAuth properties to match the CFK listener configuration.
- **OAuth client credentials properties:** Use the top-level `sasl.oauthbearer.client.credentials.*` and `sasl.oauthbearer.scope` properties, which are the Kafka 4.1 preferred form. Setting `clientId`, `clientSecret`, and `scope` inside `sasl.jaas.config` is deprecated in Kafka 4.1 and will be removed in a future version. The top-level properties take precedence if both are set.
- **`sasl.login.callback.handler.class`:** If your client applications use the Strimzi OAuth library (`io.strimzi.kafka.oauth.client.JaasClientOauthLoginCallbackHandler`), update the handler class to the native Kafka handler (`org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler`).

The following example shows a complete client properties file for connecting to the CFK OAuth listener:

```properties
security.protocol=SASL_SSL
sasl.mechanism=OAUTHBEARER

sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler
sasl.login.connect.timeout.ms=15000

sasl.oauthbearer.token.endpoint.url=https://<oauth-server-host>:<oauth-server-port>/<realm-name>/protocol/openid-connect/token

sasl.oauthbearer.client.credentials.client.id=kafka-client
sasl.oauthbearer.client.credentials.client.secret=<kafka-client-secret>
sasl.oauthbearer.scope=openid

sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required ;

ssl.truststore.location=./oauth-server-ca.crt
ssl.truststore.type=PEM
```

Where:
- `<oauth-server-host>` is the hostname of your OAuth server.
- `<oauth-server-port>` is the port that your OAuth server is listening on.
- `<realm-name>` is the realm or tenant name configured in your OAuth server.
- `<kafka-client-secret>` is the client secret for the `kafka-client` retrieved from your OAuth server.

**Note:** The `sasl.oauthbearer.client.credentials.*` and `sasl.oauthbearer.scope` properties are the Kafka 4.1 preferred form. In Kafka 4.1, setting `clientId`, `clientSecret`, and `scope` inside `sasl.jaas.config` is deprecated. Those JAAS options remain supported for backward compatibility but will be removed in a future version. The top-level properties take precedence if both are set.

**Important:** If you are migrating from {{site.data.reuse.es_name}}, update `sasl.login.callback.handler.class` from `io.strimzi.kafka.oauth.client.JaasClientOauthLoginCallbackHandler` to `org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler`. In addition, move `oauth.token.endpoint.uri`, `oauth.client.id`, and `oauth.client.secret` out of `sasl.jaas.config` and into the top-level `sasl.oauthbearer.*` properties shown previously.

Run the following command to set the Java option so that the Kafka client can access the OAuth server token and JWKS endpoints:

```bash
export KAFKA_OPTS="-Dorg.apache.kafka.sasl.oauthbearer.allowed.urls=https://<oauth-server-host>:<oauth-server-port>/<realm-name>/protocol/openid-connect/token,https://<oauth-server-host>:<oauth-server-port>/<realm-name>/protocol/openid-connect/certs"
```

### Configuring OAuth authentication
{: #configure-oauth-authentication}

Configure an OAuth listener in CFK to authenticate your Kafka clients after migrating from {{site.data.reuse.es_name}}.

#### Prerequisites
{: #configure-the-oauth-listener-prerequisites}

Complete the following steps before you configure the OAuth listener:

1. Extract the CA certificate from your existing OAuth server TLS secret and create a Kubernetes secret in the `confluent` namespace by running the following commands:

   ```bash
   kubectl get secret <oauth-server-tls-secret> -n <oauth-server-namespace> \
     -o jsonpath='{.data.ca\.crt}' | base64 -d > oauth-server-ca.crt

   kubectl create secret generic oauth-server-ca \
     --from-file=tls.crt=oauth-server-ca.crt \
     -n <cp-namespace>
   ```

   Where:
   - `<oauth-server-tls-secret>` is the name of your OAuth server TLS secret.
   - `<oauth-server-namespace>` is the namespace where your OAuth server is deployed.

2. Add the following `mountedSecrets` configuration to your CFK Kafka CR so that the broker mounts the OAuth server CA and accesses the OAuth server token introspection endpoint over TLS:

   ```yaml
   mountedSecrets:
     - secretRef: oauth-server-ca
   ```

#### Configuring the OAuth listener
{: #configure-the-oauth-listener}

To configure the OAuth listener, complete the following steps:

1. Create the CFK OAuth JAAS secret by completing the following steps:

   a. Retrieve the `clientId` and `clientSecret` of your existing Kafka broker OAuth client from your OAuth server.

   b. Create `oauth.txt` with the following content, by using your Kafka broker OAuth client credentials:

      ```properties
      clientId=<your-broker-client>
      clientSecret=<your-broker-client-secret>
      ```

      Where:
      - `<your-broker-client>` is the client ID of your Kafka broker OAuth client.
      - `<your-broker-client-secret>` is the client secret retrieved from your OAuth server.

   c. Run the following command to create the Kubernetes secret:

      ```bash
      kubectl create secret generic oauth-jaas \
        --from-file=oauth.txt=oauth.txt \
        -n <cp-namespace>
      ```

      Reference this secret in the `jaasConfig` section of the CFK Kafka CR as follows:

      ```yaml
      jaasConfig:
        secretRef: oauth-jaas
      ```

2. Configure the Kafka OAuth listener in your CFK Kafka CR. For the properties and their expected values, see the [CFK OAuth/OIDC authentication documentation](https://docs.confluent.io/operator/current/co-authenticate-kafka.html#oauth-oidc-authentication){:target="_blank"}.

   **Important:** When configuring `oauthSettings`, set `subClaimName: azp`. This setting instructs the CFK broker to extract the `azp` ("authorized party") claim from the JWT and use it as the Kafka principal. In an OAuth client credentials flow, `azp` is set to the `client_id` of the client that requested the token. When `kafka-client` retrieves a token, the broker resolves the principal as `User:kafka-client`. If you change the client ID, update your ACL principal or role binding to match.

3. If you use OAuth server RBAC rules for authorization in {{site.data.reuse.es_name}}, create [ACLs](https://docs.confluent.io/operator/current/co-simple-acls.html){:target="_blank"} or a [Confluent role binding](https://docs.confluent.io/operator/current/co-rbac.html){:target="_blank"} to grant the client access to Kafka resources.

## Next steps
{: #next-steps}

- If you have mutual TLS (mTLS) users, see [migrating mTLS users](../migrating-mtls-users/).
- To migrate schemas, see [migrating schemas](../migrate-schemas/).
