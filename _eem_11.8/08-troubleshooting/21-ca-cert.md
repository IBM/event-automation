---
title: "Invalid certificates error after adding a Kafka cluster"
excerpt: "After adding a Kafka cluster, the gateway visibility reports that certificates are invalid."
categories: troubleshooting
slug: ca-cert
toc: true
---

## Symptoms
When you [add a Kafka cluster](../../administering/managing-clusters#add-cluster), the [gateway visibility](../../administering/managing-clusters#cluster-states) reports the status of `Error`, with the details: `Certificates Invalid`. This error status might be intermittent.

## Resolving the problem
To resolve this problem, [edit the cluster](../../administering/managing-clusters#editing-a-cluster) and upload the Kafka cluster's CA certificate in the TLS configuration.