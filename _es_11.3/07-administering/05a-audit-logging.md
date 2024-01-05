---
title: "Auditing Kafka"
excerpt: "Use logs for creating an audit trail of activities within your Event Streams Kafka cluster."
categories: administering
slug: auditing-kafka
toc: true
---

{{site.data.reuse.es_name}} can be configured to generate a sequential record of activities within the {{site.data.reuse.es_name}} Kafka cluster. By reviewing this audit trail, administrators can track user activities and investigate security breaches.

## Audit trail for Kafka

{{site.data.reuse.es_name}} uses log records from every request that is sent to Kafka brokers, and extracts records for events that are useful for tracking activities within the broker. The information that is captured for each event can vary in structure and content, but they all include the following key information:

- The user (Kafka principal) that initiated the request.
- The action (Kafka operation) that was requested.
- The entity (Kafka resource) on which the operation was requested.
- The date and time when the request was received.
- The result of the request, including relevant information about reasons for any failures.

As Kafka is a distributed system, the audit events from all brokers must be aggregated in a central location to create a complete audit trail for the {{site.data.reuse.es_name}} Kafka cluster. Aggregating audit records in a separate log aggregator enables the retention and visualization of audit trails without impacting the storage requirements of the {{site.data.reuse.es_name}} instance.

## Before you begin

- Enabling audit trail for Kafka introduces additional processing that can impact the performance of the Kafka system. Ensure that the impact is assessed in your environment before enabling the audit feature.
- The storage that is used for the audit trail must be configured with appropriate size and retention policies to handle the volume of audit records.
- Ensure access to the audit trail is secured by restricting access only to authorized users.

## Configuring audit trail for Kafka

To configure {{site.data.reuse.es_name}} to provide audit trail for the Kafka cluster, complete the following steps:

1. {{site.data.reuse.cncf_cli_login}}

2. Create a file named `es-audit-config.yaml` and copy the following YAML content into the file to create the ConfigMap that has the log4j configuration properties:

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: <event-streams-audit-configuration>
     namespace: <event-streams-namespace>
   data:
     log4j.properties: |-
        <log4j-audit-configuration>
   ```

   Where:

   - `<event-streams-namespace>` is the namespace where your {{site.data.reuse.es_name}} instance is installed.
   - `<log4j-audit-configuration>` is the log4j configuration to:
        - Configure the Kafka root logger with default settings to have standard logs for your Kafka pods as follows:
           
           ```
           # Kafka root logger 
           log4j.rootLogger=INFO, stdout 
           log4j.appender.stdout=org.apache.log4j.ConsoleAppender
           log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
           log4j.appender.stdout.layout.ConversionPattern=[%d] %p %m (%c)%n
           ```

        - Configure the Kafka request logger at `TRACE` level as the source for audit information, and set `additivity=false` to keep audit information separate from the standard logs for your Kafka pods as follows:
            
            ```
            # Kafka request logger
            log4j.logger.kafka.request.logger=TRACE, audit 
            log4j.additivity.kafka.request.logger=false
            ```

        - Define an output destination by setting up an [appender](https://logging.apache.org/log4j/1.2/manual.html#Appenders_and_Layouts){:target="_blank"} to direct filtered audit records to a central system for aggregation, retention, and visualization. Ensure access to the audit trail is secured by restricting access only to authorized users.

        - Define a set of filters based on [Kafka API Keys (protocols)](https://kafka.apache.org/documentation/#operations_resources_and_protocols){:target="_blank"} to include or exclude specific requests in the audit trail.
        
           For sample log4j configurations, see the [example snippets](#example-log4j-configurations) later.

3. Apply the ConfigMap by running the following command:

   ```shell
   kubectl apply -f es-audit-config.yaml
   ```

4. After the ConfigMap is created, Kafka auditing can be enabled by setting `spec.strimziOverrides.kafka.logging` property in the `EventStreams` custom resource to point to the `<event-streams-audit-configuration>` ConfigMap.

    ```yaml
    apiVersion: eventstreams.ibm.com/v1beta2
    kind: EventStreams
    # ...
    spec:
    strimziOverrides:
        kafka:
          # ...
          logging:
            type: external
            valueFrom:
                configMapKeyRef:
                    key: log4j.properties
                    name: <event-streams-audit-configuration>
    ```

The {{site.data.reuse.es_name}} operator applies the previous changes to the Kafka pods one by one. After all Kafka pods have rolled successfully, the Kafka audit trail will be available in the central system configured for aggregation, retention, and visualization.

## Example log4j configurations

See the following log4j configuration examples for auditing purposes. These examples use Syslog for aggregating the audit records from all brokers.

### Auditing all Kafka users and all topics

Use the following log4j configuration to audit all Kafka users and all topics.

```
# Kafka root logger 
log4j.rootLogger=INFO, stdout 
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=[%d] %p %m (%c)%n

# Kafka request logger
log4j.logger.kafka.request.logger=TRACE, audit 
log4j.additivity.kafka.request.logger=false

# Syslog Appender
log4j.appender.audit=org.apache.log4j.net.SyslogAppender
log4j.appender.audit.syslogHost=rsyslog-service.es-audit.svc.cluster.local:514
log4j.appender.audit.facility=AUDIT
log4j.appender.audit.layout=org.apache.log4j.PatternLayout
log4j.appender.audit.layout.conversionPattern=%m%n

# Accept requests for Create/Delete Topics
log4j.appender.audit.filter.1=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.1.StringToMatch="requestApiKeyName":"CREATE_TOPICS"
log4j.appender.audit.filter.1.AcceptOnMatch=true

log4j.appender.audit.filter.2=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.2.StringToMatch="requestApiKeyName":"DELETE_TOPICS"
log4j.appender.audit.filter.2.AcceptOnMatch=true

# Accept requests for Create/Delete User
log4j.appender.audit.filter.3=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.3.StringToMatch="requestApiKeyName":"CREATE_ACLS"
log4j.appender.audit.filter.3.AcceptOnMatch=true

log4j.appender.audit.filter.4=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.4.StringToMatch="requestApiKeyName":"DELETE_ACLS"
log4j.appender.audit.filter.4.AcceptOnMatch=true

# Accept requests for Alter Topic/User/Cluster
log4j.appender.audit.filter.5=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.5.StringToMatch="requestApiKeyName":"ALTER_CONFIGS"
log4j.appender.audit.filter.5.AcceptOnMatch=true

log4j.appender.audit.filter.6=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.6.StringToMatch="requestApiKeyName":"INCREMENTAL_ALTER_CONFIGS"
log4j.appender.audit.filter.6.AcceptOnMatch=true

# Deny All entries that do not match other filters
log4j.appender.audit.filter.7=org.apache.log4j.varia.DenyAllFilter
```

### Auditing all Kafka users and user-created topics

Use the following log4j configuration to audit all Kafka users and only topics created by users (excluding internal {{site.data.reuse.es_name}} topics).

```
# Kafka root logger 
log4j.rootLogger=INFO, stdout 
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=[%d] %p %m (%c)%n

# Kafka request logger
log4j.logger.kafka.request.logger=TRACE, audit
log4j.additivity.kafka.request.logger=false

# SysLog Appender
log4j.appender.audit=org.apache.log4j.net.SyslogAppender
log4j.appender.audit.syslogHost=rsyslog-service.es-audit.svc.cluster.local:514
log4j.appender.audit.facility=AUDIT
log4j.appender.audit.layout=org.apache.log4j.PatternLayout
log4j.appender.audit.layout.conversionPattern=%m%n

# Reject internal topics
log4j.appender.audit.filter.1=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.1.StringToMatch="topics":[{"name":"__
log4j.appender.audit.filter.1.AcceptOnMatch=false

log4j.appender.audit.filter.2=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.2.StringToMatch="topics":[{"name":"eventstreams-apicurio-registry-kafkasql-topic"
log4j.appender.audit.filter.2.AcceptOnMatch=false

# Accept requests for Create/Delete Topics
log4j.appender.audit.filter.3=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.3.StringToMatch="requestApiKeyName":"CREATE_TOPICS"
log4j.appender.audit.filter.3.AcceptOnMatch=true

log4j.appender.audit.filter.4=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.4.StringToMatch="requestApiKeyName":"DELETE_TOPICS"
log4j.appender.audit.filter.4.AcceptOnMatch=true

# Accept requests for Create/Delete User
log4j.appender.audit.filter.5=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.5.StringToMatch="requestApiKeyName":"CREATE_ACLS"
log4j.appender.audit.filter.5.AcceptOnMatch=true

log4j.appender.audit.filter.6=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.6.StringToMatch="requestApiKeyName":"DELETE_ACLS"
log4j.appender.audit.filter.6.AcceptOnMatch=true

# Accept requests for Alter Topic/User/Cluster
log4j.appender.audit.filter.7=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.7.StringToMatch="requestApiKeyName":"ALTER_CONFIGS"
log4j.appender.audit.filter.7.AcceptOnMatch=true

log4j.appender.audit.filter.8=org.apache.log4j.varia.StringMatchFilter
log4j.appender.audit.filter.8.StringToMatch="requestApiKeyName":"INCREMENTAL_ALTER_CONFIGS"
log4j.appender.audit.filter.8.AcceptOnMatch=true

# Deny All entries that do not match other filters
log4j.appender.audit.filter.9=org.apache.log4j.varia.DenyAllFilter
```

## Example audit records

See the following examples for audit records of different actions and outcomes from within an audit trail.

### Successful user creation

The following audit record indicates an attempt to create a Kafka user that was successful:

```json
{
    "requestHeader": {
        "clientId": "adminclient-1",
        "requestApiKeyName": "CREATE_ACLS"
        ...
    },
    "request": {
        "creations": [
            {
                "resourceType": 2,
                "resourceName": "your.topic.name",
                "resourcePatternType": 3,
                "principal": "User:consumer",
                "host": "*",
                "operation": 3,
                "permissionType": 3
            }
            ...
        ]
    },
    "response": {
        "results": [
            {
                "errorCode": 0,
                "errorMessage": ""
            }
            ...
        ]
        ...
    },
    "securityProtocol": "SSL",
    "principal": "User:CN=dev-scram-entity-user-operator,O=io.strimzi",
    "listener": "REPLICATION-9091",
    ...
}
```

### Failed topic creation

The following audit record indicates an attempt to create a Kafka topic that has failed due to user authorization failure:

```json
{
    "requestHeader": {
        "clientId": "adminclient-2955",
        "requestApiKeyName": "CREATE_TOPICS",
        ...
    },
    "request": {
        "topics": [
            {
                "name": "aaaa",
                "numPartitions": 1,
                "replicationFactor": 1,
                "assignments": [],
                "configs": [
                    {
                        "name": "min.insync.replicas",
                        "value": "1"
                    },
                    ...
                ]
            }
        ]
        ...
    },
    "response": {
        "throttleTimeMs": 0,
        "topics": [
            {
                "name": "aaaa",
                "topicId": "AAAAAAAAAAAAAAAAAAAAAA",
                "errorCode": 29,
                "errorMessage": "Authorization failed.",
                ...
            }
        ]
    },
    "securityProtocol": "SASL_SSL",
    "principal": "User:user2",
    "listener": "EXTERNAL-9094",
    ...
}
```

