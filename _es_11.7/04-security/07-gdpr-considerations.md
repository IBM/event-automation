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
- New obligations for companies and organisations handling personal data
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
The exact requirements will depend on the nature of the information that will be stored or transmitted by {{site.data.reuse.es_name}}.
Areas for consideration to address these aspects of the GDPR legislation include:

- Physical access to the assets where the product is installed
- [Encryption of data](../encrypting-data) both at rest and in flight
- [Managing access](../managing-access) to topics which hold sensitive material.

## Data Life Cycle

{{site.data.reuse.es_name}} is a general purpose pub-sub technology built on [Apache Kafka®](https://kafka.apache.org/){:target="_blank"} which can
be used for the purpose of connecting applications. Some of these applications may be IBM-owned but others may be third-party products
provided by other technology suppliers. As a result, {{site.data.reuse.es_name}} can be used to exchange many forms of data,
some of which could potentially be subject to GDPR.

### What types of data flow through {{site.data.reuse.es_name}}?

There is no one definitive answer to this question because use cases vary through application deployment.

### Where is data stored?

As messages flow through the system, message data is stored on physical storage media configured by the deployment. It may also reside in logs collected
by pods within the deployment. This information may include data governed by GDPR.

### Personal data used for online contact with IBM

{{site.data.reuse.es_name}} clients can submit online comments/feedback requests to contact IBM about {{site.data.reuse.es_name}} in a variety of
ways, primarily:

- Public issue reporting and feature suggestions via {{site.data.reuse.es_name}} Git Hub portal
- Private issue reporting via IBM Support

Typically, only the client name and email address are used to enable personal replies for the subject of the contact. The use of personal data conforms to the [IBM Online Privacy Statement](https://www.ibm.com/privacy/us/en/){:target="_blank"}.

## Data Collection

{{site.data.reuse.es_name}} can be used to collect personal data. When assessing your use of {{site.data.reuse.es_name}} and the demands
of GDPR, you should consider the types of personal data which in your circumstances are passing through the system. You
may wish to consider aspects such as:

- How is data being passed to an {{site.data.reuse.es_name}} topic? Has it been encrypted or digitally signed beforehand?
- What type of storage has been configured within the {{site.data.reuse.es_name}}? Has [encryption](../encrypting-data) been enabled?
- How does data flow between nodes in the {{site.data.reuse.es_name}} deployment? Has internal network traffic been [encrypted](../encrypting-data)?

## Data Storage

When messages are published to topics, {{site.data.reuse.es_name}} will store the message data on stateful media within the cluster for
one or more nodes within the deployment. Consideration should be given to [securing this data](../encrypting-data) when at rest.

The following items highlight areas where {{site.data.reuse.es_name}} may indirectly persist application provided data which
users may also wish to consider when ensuring compliance with GDPR.

- Kubernetes activity logs for containers running within the Pods that make up the {{site.data.reuse.es_name}} deployment
- Logs captured on the local file system for the Kafka container running in the Kakfa pod for each node

By default, messages published to topics are retained for a week after their initial receipt, but this can be configured by modifying [Kafka broker settings](https://kafka.apache.org/39/documentation/#brokerconfigs){:target="_blank"}. These settings are [configured](../../installing/configuring/#applying-kafka-broker-configuration-settings) by using the `EventStreams` custom resource.

## Data Access

The Kafka core APIs can be used to access message data within the {{site.data.reuse.es_name}} system:

- [Producer](http://kafka.apache.org/37/documentation/#producerapi){:target="_blank"} API to allow data to be sent to a topic
- [Consumer](http://kafka.apache.org/37/documentation/#consumerapi){:target="_blank"} API to allow data to be read from a topic
- [Streams](http://kafka.apache.org/37/documentation/#streamsapi){:target="_blank"} API to allow transformation of data from an input topic to an output topic
- [Connect](http://kafka.apache.org/37/documentation/#connectapi){:target="_blank"} API to allow connectors to continually move data in or out of a topic from an external system

For more information about controlling access to data stored in {{site.data.reuse.es_name}}, see [managing access](../managing-access).

Cluster-level configuration and resources, including logs that might contain message data, are accessible through your Kubernetes platform.

[Access and authorization controls](https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/){:target="_blank"} can be used to control which users are able to access this cluster-level information.

## Data Processing

### Encryption of connection to {{site.data.reuse.es_name}}

Connections to {{site.data.reuse.es_name}} are [secured using TLS](../../installing/configuring/#configuring-access). If you want to [use your own CA certificates](../../installing/configuring/#using-your-own-certificates) instead of those generated by the operator, you can provide them in the `EventStreams` custom resource settings.

### Encryption of connections within {{site.data.reuse.es_name}}

Internal communication between {{site.data.reuse.es_name}} pods is [encrypted by default](../../installing/configuring/#configuring-encryption-between-pods) using TLS.

## Data Monitoring

{{site.data.reuse.es_name}} provides a range of [monitoring](../../administering/cluster-health/) features that users can exploit to gain a better understanding of how applications are performing.
