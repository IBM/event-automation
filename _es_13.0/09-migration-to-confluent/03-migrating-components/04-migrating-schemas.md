---
title: "Migrating schemas"
excerpt: "Migrate schemas from IBM Event Streams Apicurio Registry to Confluent Schema Registry with schema ID preservation."
categories: migration
slug: migrate-schemas
toc: true
---

Migrate your schemas from {{site.data.reuse.es_name}} Apicurio Registry to Confluent Schema Registry with schema ID preservation.

## Overview
{: #overview}

{{site.data.reuse.es_name}} stores schemas in an embedded Apicurio Registry. When applications serialize messages by using a schema registry serializer, each Kafka message payload contains a magic byte and a 4-byte schema ID in its wire format prefix. When Cluster Linking replicates topic data to Confluent, it copies those bytes unchanged. For consumers reading from replicated topics to deserialize messages correctly, Confluent Schema Registry must map those same IDs to the same schemas.

Apicurio Registry refers to a stored schema as an **artifact**. Confluent Schema Registry organizes schemas under **subjects**. During this migration, each Apicurio artifact exposed through the ccompat API is exported and imported as a Confluent subject. This documentation uses **subject** when referring to ccompat or Confluent operations.

Schema migration has two stages:

- **Export:** Use the {{site.data.reuse.es_name}} CLI to export each schema version from Apicurio in ccompat format to local JSON files. The ccompat (Confluent Schema Registry compatibility) API is an Apicurio endpoint that exposes schemas by using the same wire format as Confluent Schema Registry, which allows standard tooling to interact with Apicurio without code changes. For more information, see the [Apicurio ccompat API reference](https://www.apicur.io/registry/docs/apicurio-registry/3.3.x/getting-started/assembly-confluent-schema-registry-compatibility.html){:target="_blank"}.
- **Import:** Register those files into Confluent Schema Registry by using `IMPORT` mode, which is the only method that preserves the original schema IDs.

## Known limitations
{: #known-limitations}

The following limitations apply to this migration process:

| Limitation | Notes |
|------------|-------|
| Header-based wire format | If `ENABLE_HEADERS=true` is set on Apicurio, schema IDs are in message headers rather than the payload. Confluent serializers and deserializers cannot read this format. |
| Soft-deleted versions included | The ccompat API includes soft-deleted versions in its response. The export and import process treats these as live versions on Confluent. Hard-delete unwanted versions on Apicurio before exporting, or exclude the subjects. |
| `DISABLED` and `DEPRECATED` states not visible | The ccompat API returns all schemas unconditionally. Use a targeted `--name` regex to exclude disabled or deprecated subjects. |
| Circular schema references | If subjects reference each other in a cycle, no valid import order exists and the Confluent import fails. Resolve circular references in Apicurio before exporting. |
| Schemas with missing references metadata | If a schema was registered in Apicurio without reference metadata, the export cannot include the subjects it depends on, and Confluent rejects the schema on import. Re-register those schemas in Apicurio with explicit references before exporting. |
| Subject list capped at 1000 by default | The export discovers subjects with a single call to the ccompat `GET /subjects` endpoint. Apicurio limits that response with `apicurio.ccompat.max-subjects` (default `1000`) and truncates silently, so subjects beyond the limit are not exported. A larger subject list also increases response size and latency, which can reach OpenShift Route, Kubernetes Ingress, or endpoint timeout limits before the export finishes. For more information, see [exporting a large number of subjects](#export-large-subject-list). |
| Confluent Schema Registry contexts not supported | The export targets the default context only. Re-import manually into named contexts if required. |
| Schema labels and custom metadata | These have no Confluent equivalent and do not carry over. Recreate relevant tags by using [Confluent Schema Registry properties](https://docs.confluent.io/platform/current/schema-registry/schema-linking.html){:target="_blank"} after migration. |
| Apicurio version strings (such as `"1.0.0"`) | Confluent supports only sequential integer version numbers. A subject that uses non-integer version strings cannot be exported because the ccompat API cannot list its versions. Re-register the schemas in Apicurio without specifying a version so that Apicurio assigns numeric version numbers, and then export them again. Clients that use the Apicurio native v3 API to look up versions by string must replace their registry client when moving to Confluent. |

## Before you begin
{: #before-you-begin}

Complete the following checks before you begin the migration:

- **Destination registry:**

  Confirm that `mode.mutability=true` is set on the destination Confluent Schema Registry. `IMPORT` mode requires this setting. For more information, see [Schema Registry configuration](https://docs.confluent.io/platform/current/schema-registry/installation/config.html){:target="_blank"}.

- **Source registry:**

  - **Wire format:** Schema IDs must be embedded in the message payload, which is the default. If `ENABLE_HEADERS=true` is set on Apicurio, the ID is in message headers instead.
  - **Legacy ID mode:** If `APICURIO_CCOMPAT_LEGACY_ID_MODE_ENABLED=true` is set, the embedded IDs might not match what the ccompat API returns. Verify this setting before exporting.
  - **Undocumented schemas:** Only schemas registered in Apicurio are exported. Audit your producers and consumers and register any missing schemas before you start.

- **CLI:**

  - The `schemas-ccompat-export` command is part of the {{site.data.reuse.es_name}} CLI plug-in for `kubectl`. [Install the {{site.data.reuse.es_name}} CLI plug-in](../../installing/post-installation/#installing-the-event-streams-command-line-interface) if not already installed.

  - {{site.data.reuse.es_cli_init_111}}

## Migration steps
{: #migration-steps}

Complete the steps described in the following sections to migrate your schemas:

### Step 1: Export schemas from {{site.data.reuse.es_name}}
{: #export-schemas}

1. Run the following command to export schemas from Apicurio to local JSON files:

   ```shell
   kubectl es schemas-ccompat-export --name ".*" --output-dir ./schema-export
   ```

   This command exports all schemas to the output directory. For each subject, it creates a subdirectory and saves each schema version as `v{version}.json` (for example, `./orders-value/v1.json`). Each file contains the Confluent-compatible payload ready for import:

   ```json
   {
     "subject": "orders-value",
     "id": 42,
     "version": 1,
     "schemaType": "AVRO",
     "schema": "{...}"
   }
   ```

   If a subject name contains any of the characters `/ \ : * ? " < > |`, each of those characters becomes `_` in the subdirectory name.

1. Review the `manifest.json` file that the command writes to the output directory. This file lists the exported subjects in a safe import order, using the original subject names:

   ```json
   {
     "subjects": ["address-value", "order-with-address-value", "order-summary-value"]
   }
   ```

   The manifest is always written, whether or not your schemas reference each other. You do not have to use it. It matters only when a schema reuses types from another subject, because Confluent rejects such a schema unless the subject it depends on is registered first. Following the manifest order is always safe, and the sample import script uses it.

1. Review the exported files and confirm that the schema IDs match what you expect before you import the schemas.

The `--name` flag accepts a regular expression (regex) that is matched against the full subject name. The expression is automatically anchored, so it must match the entire subject name, not a substring. The following table shows some example expressions:

| Regex | Matches |
|-------|---------|
| `my-topic-value` | Exact subject name |
| `orders\..*` | All subjects starting with `orders.` |
| `topic-a|topic-b` | Two specific subjects |
| `.*` | All subjects |
| `orders\..*(?<!-key)` | All subjects starting with `orders.` except those ending with `-key` |

The following table describes the available flags:

| Flag | Description |
|------|-------------|
| `--name` | Required. Regular expression to match full subject names. |
| `--output-dir` | Required. Directory where output files are created. The directory is created if it does not exist. |
| `--no-references` | Optional. Export only the subjects matched by `--name`. Referenced subjects are not included. |
| `--force` | Skip the confirmation prompt and allow writing to a non-empty directory. |

#### Exporting a large number of subjects
{: #export-large-subject-list}

If your registry has more than 1000 subjects, complete one of the following tasks before you export with `--name ".*"`:

- Raise the Apicurio subject-list limit: Set `apicurio.ccompat.max-subjects` on the Apicurio Registry to a value above your subject count. On {{site.data.reuse.es_name}}, set the equivalent environment variable on the Apicurio Registry component in the `EventStreams` custom resource, for example:

  ```yaml
  spec:
    apicurioRegistry:
      env:
        - name: APICURIO_CCOMPAT_MAX_SUBJECTS
          value: "5000"
  ```

- Export in batches: Use a narrower `--name` regex so that each run stays under the current limit.

Raising the subject-list limit increases the size and duration of the `GET /subjects` response. On OpenShift, that traffic usually goes through a Route. On other Kubernetes platforms, it goes through an Ingress or similar endpoint. Route or Ingress timeouts and per-pod connection limits on the router can then cause the export to fail, even after you raise `max-subjects`.

Use the following options to adjust Route or Ingress timeout and connection limits:

- On OpenShift, increase the Route timeout or related router annotations for the Apicurio Registry route. For example, set `haproxy.router.openshift.io/timeout`. For more information, see [Configuring route timeouts](https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/ingress_and_load_balancing/routes#nw-configuring-route-timeouts_configuring-routes){:target="_blank"} in the OpenShift documentation.
- On {{site.data.reuse.es_name}}, configure the Apicurio Registry endpoint (`spec.apicurioRegistry.endpoints`), including optional route or ingress annotations, as described in [REST services access](../../installing/configuring/#rest-services-access).
- Export in batches by using `--name` if you cannot change Route or Ingress limits in your cluster.

#### Schema references
{: #schema-references}

Most schemas are self-contained and do not depend on any other subject. If none of your schemas reuse types from another subject, this section does not apply to you, and the export and import steps work as described.

A schema can reuse types that are defined in another subject. For example, an `order` schema might use an `Address` type that belongs to the `address-value` subject. Confluent requires the referenced subject to be registered before the schema that uses it.

You do not need to list referenced subjects in `--name`. The export includes them for you, and `manifest.json` gives you an import order that satisfies the dependencies. A subject that is included only as a dependency contains just the version that is referenced, so its subdirectory might hold a single file such as `v3.json` instead of `v1.json`.

Use `--no-references` if you want only the subjects that `--name` matched. In that case, make sure that the referenced subjects already exist in Confluent, and work out the import order yourself.

If the command warns that a referenced subject is not in the registry, restore or re-register that subject in Apicurio and export again. Importing the schema without it fails.

### Step 2: Import schemas into Confluent Schema Registry
{: #import-schemas}

Use the [Confluent Schema Registry REST API](https://docs.confluent.io/platform/current/schema-registry/develop/api.html){:target="_blank"} to import each schema version by using [`IMPORT` mode](https://docs.confluent.io/platform/current/schema-registry/installation/migrate.html){:target="_blank"}.

The following steps import one subject at a time, so you can import a single subject or work through the whole export. If any of your schemas reuse types from another subject, import the subjects in the order listed in `manifest.json`. Otherwise, the order does not matter. To import everything in one run instead, see the [sample script for batch import](#batch-import-script).

**Important:** If your Confluent Schema Registry endpoint requires authentication or uses a custom TLS certificate, add the appropriate options to the `curl` commands in this section:
- For basic authentication or RBAC credentials, add `--user "<username>:<password>"`.
- For TLS validation with an internal or custom CA certificate, add `--cacert <ca-cert-path>`.
- For more information, see [securing Confluent Schema Registry](https://docs.confluent.io/platform/current/schema-registry/security/index.html){:target="_blank"}.

1. Record the original global compatibility value so that you can restore it after the import. Set the global compatibility to `NONE` to prevent Confluent from rejecting versions by running the following command:

   ```bash
   curl -X PUT https://<confluent-sr>/config \
     -H "Content-Type: application/vnd.schemaregistry.v1+json" \
     -d '{"compatibility": "NONE"}'
   ```

2. For each subject that you want to import, complete the following steps:

   a. Set the subject to `IMPORT` mode by running the following command:

      ```bash
      curl -X PUT https://<confluent-sr>/mode/<subject> \
        -H "Content-Type: application/vnd.schemaregistry.v1+json" \
        -d '{"mode": "IMPORT"}'
      ```

      **Note:** Confluent Schema Registry returns HTTP 422 if the subject already has registered versions. This occurs when a subject is pre-created before the import, and in all re-import scenarios. Pass `?force=true` to override this check on an existing subject, or delete the subject before re-importing. For more information, see [re-importing a subject](#re-import).

   b. Register each version in ascending order by using the exported JSON file as the request body. Run the following command:

      ```bash
      curl -X POST https://<confluent-sr>/subjects/<subject>/versions \
        -H "Content-Type: application/vnd.schemaregistry.v1+json" \
        -d @./orders-value/v1.json
      ```

   c. Return the subject to `READWRITE` mode by running the following command:

      ```bash
      curl -X PUT https://<confluent-sr>/mode/<subject> \
        -H "Content-Type: application/vnd.schemaregistry.v1+json" \
        -d '{"mode": "READWRITE"}'
      ```

3. After you import all subjects, restore the global compatibility to its original value by running the following command:

   ```bash
   curl -X PUT https://<confluent-sr>/config \
     -H "Content-Type: application/vnd.schemaregistry.v1+json" \
     -d '{"compatibility": "<original_value>"}'
   ```

**Note:** If a registration returns HTTP 422 with a message such as `Subject 'address-value' not found`, the schema uses types from a subject that is not registered yet. Import that subject first, then try again. If the subject is not in `manifest.json` at all, the schema was registered in Apicurio without reference metadata. Re-register it in Apicurio with explicit references and export again.

#### Sample script for batch import
{: #batch-import-script}

For a sample script that automates the import of multiple subjects and versions, see [Event Streams Schema Registry samples](https://github.com/ibm-messaging/event-streams-samples/tree/master/schema-registry){:target="_blank"}. The script reads `manifest.json` from the export directory to process the subjects in the correct order, and exits if that file is missing.

The script does not cover every migration scenario. Review and extend the script to suit your environment and requirements before you run it.

### Step 3: Validate
{: #validate}

Confirm that each schema ID exported from Apicurio resolves correctly in Confluent before you switch any traffic to Confluent.

For each exported JSON file, take the `id` field and run the following command:

```bash
curl https://<confluent-sr>/schemas/ids/<id>
```

Verify that the response body matches the schema in the exported file. If any ID is missing or returns the wrong schema, [re-import the affected subject](#re-import) before you proceed to application migration.

#### Re-importing a subject
{: #re-import}

If a schema import fails or produces incorrect results, you can re-import the affected subject. `PUT /mode/{subject}` returns HTTP 422 if the subject already has registered versions. The following two options are available depending on the state of the subject:

- **Option A: Append new versions only**

  Use this option when the existing versions are correct and you only need to add versions that were missed or added to Apicurio after the initial export.

  Follow [step 2b in the import steps](#import-schemas) with the following changes:

  - In step 2a, append `?force=true` to the mode URL (`PUT /mode/<subject>?force=true`).
  - In step 2b, register only the new version files, not all versions. Run `GET /subjects/<subject>/versions` on Confluent to identify the versions that already exist. For example, a response of `[1,2]` means that versions 1 and 2 are already registered. Because the exported schema files are named after their version numbers (`v1.json`, `v2.json`, and so on), you only need to register `v3.json` and later files. Compare version numbers rather than the `id` field because multiple versions that contain the same schema share a single schema ID.

- **Option B: Full subject replacement**

  Use this option when the subject has versions with wrong IDs or corrupted data that cannot be corrected by appending.

  1. Soft-delete the subject by running the following command:

     ```bash
     curl -X DELETE https://<confluent-sr>/subjects/<subject>
     ```

  2. Permanently delete the subject (hard delete) by running the following command:

     ```bash
     curl -X DELETE "https://<confluent-sr>/subjects/<subject>?permanent=true"
     ```

  3. Follow [step 2 in the import steps](#import-schemas) to set the subject to `IMPORT` mode, register all versions in ascending order, and return it to `READWRITE` mode.

### Step 4: Client application updates
{: #cutover}

After you verify all schema IDs, update producers and consumers for Confluent Schema Registry. Each client requires the following three configuration changes:

- **Registry URL:** Replace the Apicurio ccompat path with the Confluent Schema Registry root URL.
- **Authentication credentials:** Replace the {{site.data.reuse.es_name}} credentials with Confluent Schema Registry credentials.
- **CA certificate:** Replace the {{site.data.reuse.es_name}} cluster CA with the Confluent cluster CA.

If your applications use the Apicurio native serde, replace the serde library with the Confluent equivalent. For more information, see [Confluent serialization documentation](https://docs.confluent.io/platform/current/schema-registry/serdes-develop/index.html){:target="_blank"}.

If new schema versions are added to Apicurio between the export and cutover, re-export the affected subjects and use [option A](#re-import) to append the new versions. Use [option B](#re-import) only if the subject needs a full replacement.
