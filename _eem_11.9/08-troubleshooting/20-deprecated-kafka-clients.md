---
title: "Warnings about clients that use deprecated Kafka APIs"
excerpt: "The Manage Event Gateways page shows a warning about clients that use this Event Gateway requiring attention."
categories: troubleshooting
slug: deprecated-kafka
toc: true
---

[Kafka 4.0.0 and later](https://kafka.apache.org/blog#apache_kafka_400_release_announcement){:target="_blank"} introduces new APIs and removes support for previous client libraries.

{{site.data.reuse.eem_name}} version 11.8.1 and later uses Kafka 4.3.0.

The {{site.data.reuse.egw}} reports if any clients are calling deprecated APIs and presents a warning message in the {{site.data.reuse.eem_name}} UI.

Contact the client application owners and advise them to upgrade their Kafka client library to version 4.3.0 or later.
