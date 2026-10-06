---
title: "Migration phases"
excerpt: "Understand the phases involved in migrating from Event Streams to Confluent Platform."
categories: migration
slug: migration-phases
toc: true
---

The migration process consists of sequential phases. Complete each phase in order:

| Phase | Purpose |
|-------|---------|
| [Planning your migration](../planning/) | Review your current deployment and produce a migration plan. |
| [Before you begin](../preparation/) | Prepare your {{site.data.reuse.es_name}} instance and client applications before you start the migration. |
| [Setting up Confluent Platform](../setup/) | Deploy the target Confluent Platform cluster by using CFK. |
| [Migrating components and applications](../migrating-components/) | Migrate users, schemas, topics, data, client applications, and Kafka Connect and connectors. |
| [Validating your migration](../validation/) | Verify that applications, connectors, and performance meet expectations on Confluent Platform. |
| [Decommissioning {{site.data.reuse.es_name}}](../decommission/) | Remove your {{site.data.reuse.es_name}} instance after all applications and integrations are validated. |
