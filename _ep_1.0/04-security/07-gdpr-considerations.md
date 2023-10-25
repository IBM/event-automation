---
title: "Considerations for GDPR"
excerpt: "Considerations for GDPR."
categories: security
slug: gdpr-considerations
toc: true
---

## Notice:

Clients are responsible for ensuring their own compliance with various laws
and regulations, including the European Union General Data Protection Regulation.
Clients are solely responsible for obtaining advice of competent legal counsel as to
the identification and interpretation of any relevant laws and regulations that may
affect the clients’ business and any actions the clients may need to take to comply
with such laws and regulations.

The products, services, and other capabilities
described herein are not suitable for all client situations and may have restricted
availability. IBM does not provide legal, accounting, or auditing advice or represent or
warrant that its services or products will ensure that clients are in compliance with
any law or regulation.

## GDPR Overview

### What is GDPR?

_GDPR_ stands for General Data Protection Regulation.

GDPR has been adopted by the European Union and will apply from May 25, 2018.

### Why is GDPR important?

GDPR establishes a stronger data protection regulatory framework for processing of personal data of individuals. GDPR brings:

- New and enhanced rights for individuals
- Widened definition of personal data
- New obligations for companies and organizations handling personal data
- Potential for significant financial penalties for non-compliance
- Compulsory data breach notification

This document is intended to help you in your preparations for GDPR readiness.

### Read more about GDPR

- [EU GDPR website](https://gdpr.eu/){:target="_blank"}
- [IBM GDPR website](https://www.ibm.com/data-responsibility/gdpr/){:target="_blank"}

## Product Configuration for GDPR

#### Configuration to support data handling requirements

The GDPR legislation requires that personal data is strictly controlled and that the
integrity of the data is maintained. This requires the data to be secured against loss
through system failure and also through unauthorized access or via theft of computer equipment or storage media.
The exact requirements will depend on the nature of the information that will be sent to {{site.data.reuse.ep_name}}.
Areas for consideration to address these aspects of the GDPR legislation include:

- Physical access to the assets where the product is installed.
- Encryption of data both at rest (see [Data Storage](#data-storage)) and in flight (see [Data Processing](#data-processing)).
- [Managing access](../managing-access) to your {{site.data.reuse.ep_name}} instance.

## Data Life Cycle

{{site.data.reuse.ep_name}} transforms streams of data received through [Apache Kafka®](https://kafka.apache.org/){:target="_blank"}
topics. As a result, {{site.data.reuse.ep_name}} can be used for processing any data, some of which could potentially be subject to GDPR.

### What types of data flow through {{site.data.reuse.ep_name}}?

There is no one definitive answer to this question because use cases vary through application deployment.

### Where is data stored?

See the [Data Storage](#data-storage) section for details about how information is stored by {{site.data.reuse.ep_name}}. This information can include data that is governed by GDPR.

### Personal data used for online contact with IBM

{{site.data.reuse.ep_name}} clients can submit online comments/feedback requests to contact IBM about {{site.data.reuse.ep_name}} in a variety of
ways, primarily:

- Public issue reporting and feature suggestions via {{site.data.reuse.ep_name}} Git Hub portal
- Private issue reporting via IBM Support

Typically, only the client name and email address are used to enable personal replies for the subject of the contact. The use of personal data conforms to the [IBM Online Privacy Statement](https://www.ibm.com/privacy/us/en/){:target="_blank"}.

## Data Collection

{{site.data.reuse.ep_name}} can be used to collect personal data. When assessing your use of {{site.data.reuse.ep_name}} and the demands
of GDPR, you should consider the types of personal data which in your circumstances are passing through the system. You
may wish to consider aspects such as:

- What data is being passed to {{site.data.reuse.ep_name}}?
- What type of storage has been configured within the {{site.data.reuse.ep_name}}? Has encryption been enabled? For more information, see [Data Storage](#data-storage).
- How does data flow between nodes in the {{site.data.reuse.ep_name}} deployment? Has the internal network traffic been encrypted? For more information, see [Data Processing](#data-processing).

## Data Storage

{{site.data.reuse.ep_name}} stores data on stateful media within the cluster. The data stored by {{site.data.reuse.ep_name}} pods is encrypted by default.

Data sent to {{site.data.reuse.flink_long}} through [Apache Kafka®](https://kafka.apache.org/){:target="_blank"} is stored by Flink. In production deployments, persistent storage is used. For encrypting the persistent storage used by Flink, see the documentation for your storage provider, for example, [Red Hat Ceph Storage - Encryption and Key Management](https://access.redhat.com/documentation/en-us/red_hat_ceph_storage/6/html/data_security_and_hardening_guide/assembly-encryption-and-key-management){:target="_blank"}.

## Data Access

For information about controlling access to data stored in {{site.data.reuse.ep_name}}, see [managing access](../managing-access).

Cluster-level configuration and resources are accessible through the {{site.data.reuse.openshift_short}} [web console](https://docs.openshift.com/container-platform/4.12/web_console/web-console.html){:target="_blank"} and by using the [`kubectl` CLI](https://kubernetes.io/docs/tasks/tools/){:target="_blank"}.

[Access and authorization controls](https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/){:target="_blank"} can be used to control which users are able to access this cluster-level information.

## Data Processing

### Encryption of connection to {{site.data.reuse.ep_name}}

Connections to {{site.data.reuse.ep_name}} are [secured using TLS](../../installing/configuring/#configuring-tls). If you want to [use your own CA certificates](../../installing/configuring/#user-provided-ca-certificate) instead of those generated by the operator, you can provide them in the `EventProcessing` custom resource settings.

### Encryption of connections within {{site.data.reuse.ep_name}}

Internal communication between {{site.data.reuse.ep_name}} pods is [encrypted by default](../../installing/configuring/#configuring-tls) using TLS.
