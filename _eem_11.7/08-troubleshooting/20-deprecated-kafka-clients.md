---
title: "Warnings about clients that use deprecated Kafka APIs"
excerpt: "The Manage Event Gateways page shows a warning about clients that use this Event Gateway requiring attention."
categories: troubleshooting
slug: deprecated-kafka
toc: true
---

[Kafka 4.0.0 and later](https://kafka.apache.org/blog#apache_kafka_400_release_announcement){:target="_blank"} introduces new APIs and removes support for previous client libraries.

{{site.data.reuse.eem_name}} version {{site.data.reuse.eem_current_version}} uses Kafka 3.9.1 where previous client libraries are supported, but future releases of {{site.data.reuse.eem_name}} will use Kafka 4.0.0 or later.

To help users prepare their clients for the move to Kafka 4.0.x, the {{site.data.reuse.egw}} reports if any clients are calling the deprecated APIs and presents a warning message on the **{{site.data.reuse.egw}}s** and **Subscriptions** pages of the {{site.data.reuse.eem_name}} UI.

Contact the client application owners and advise them to upgrade their Kafka client library to version 4.0.0 or later to avoid issues with their requests failing when {{site.data.reuse.eem_name}} moves to Kafka 4.0.0 or later.