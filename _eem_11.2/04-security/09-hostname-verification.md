---
title: "Enabling hostname verification"
excerpt: "Find out how you can enable hostname verification between the Event Gateway and a Kafka cluster."
categories: security
slug: hostname-verification
toc: true
---

Hostname verification on the connection between the {{site.data.reuse.egw}} and a Kafka cluster requires that the hostname presented in the Kafka certificates matches the URL that the {{site.data.reuse.egw}} uses to connect to Kafka. By default, hostname verification is not enabled for this connection. However, you can enable it by setting the algorithm that the {{site.data.reuse.egw}} uses for hostname verification.

To mitigate security risks, enable hostname verification.

**Note:** If the certificates on your Kafka cluster do not provide the hostname, ensure you update them to include the hostname. Without the hostname, the connection between Kafka and the {{site.data.reuse.egw}} will be broken, which will cause Kafka clients that are connecting through the {{site.data.reuse.egw}} to fail. 

## Setting the hostname verification algorithm

To set a specific hostname verification algorithm, provide the `TCP_HOSTNAME_VERIFICATION_ALGORITHM` environment variable to the {{site.data.reuse.egw}} container.

For a stand-alone {{site.data.reuse.egw}}, add the new environment variable to the container at start up.

For an operator-deployed {{site.data.reuse.egw}}, you can turn hostname verification on by setting the environment variable in the {{site.data.reuse.egw}} custom resource. For example, to set the hostname verification algorithm to `HTTPS`, provide the environment variable as follows:
```yaml
spec:
  template:
    pod:
      spec:
        containers:
          - name: egw
            env:
              - name: TCP_HOSTNAME_VERIFICATION_ALGORITHM
                value: HTTPS
```
