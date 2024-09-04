---
title: "IAM and Keycloak: 403 error when logging in to Event Streams UI"
excerpt: "When signing into the Event Streams UI, the 403 Not Authorized page is displayed."
categories: troubleshooting
slug: ui-403-error
toc: true
---

## Symptoms

Logging in to the {{site.data.reuse.es_name}} UI as a Keycloak user or an Identity and Access Management (IAM) user fails with the message `403 Not authorized`, indicating that the user does not have permission to access the {{site.data.reuse.es_name}} instance.

{{site.data.reuse.iam_note}}

## Causes

To access the {{site.data.reuse.es_name}} UI:

- The IAM user must either have the `Cluster Administrator` role or the `Administrator` role and be in a team with a namespace resource added for the namespace containing the {{site.data.reuse.es_name}} instance. If neither of these applies, the error will be displayed.

- The Keycloak user must either have the `eventstreams-admin` role or the `admin` role and be in a team with a namespace resource added for the namespace containing the {{site.data.reuse.es_name}} instance. If neither of these applies, the error will be displayed.

## Resolving the problem

[Assign access to users](../../security/managing-access/#accessing-the-event-streams-ui-and-cli) with an administrator role by ensuring they are in a group with access to the correct namespace.

- If you configured {{site.data.reuse.es_name}} with Keycloak, assign access to the `eventstreams-admin` or the `admin` role.
- If you configured {{site.data.reuse.es_name}} with IAM, assign the `Cluster Administrator` role or the `Administrator` role.
