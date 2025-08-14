---
title: "Audit logging"
excerpt: "Find out how to configure audit logging for Event Endpoint Management."
categories: administering
slug: audit-logging
toc: true
---

Find out how to configure {{site.data.reuse.eem_name}} to log audit data that permit administrators to monitor user activity and identify security breaches.


## Event model
{: #event-model}

{{site.data.reuse.eem_name}} uses the event model defined by the [Cloud Auditing Data Federation](https://www.dmtf.org/standards/cadf) (CADF) to record auditable events arising from interaction with users and other systems. In this model, events are recorded against *resources*, which can be infrastructure components such as servers, applications or databases, or business entities, such as users, accounts and roles. In general terms, the CADF model creates audit records that follow a basic pattern: 

- An `observer` resource records an `action` performed by an `initiator` resource against a `target` resource resulting in a specific `outcome`.

In {{site.data.reuse.eem_name}}, the observer is the {{site.data.reuse.eem_manager}}. The observer can record three types of events:

- Monitoring: Information about the status of a resource.
- Activity: Information about the change in a resource's state or configuration.
- Control: Information about how policies or constraints apply to a resource's operation.

The observer also attaches more contextual information to the event record, such as a timestamp, severity, and descriptive message.

### Examples
{: #examples}

The following are examples of audit events logged by the {{site.data.reuse.eem_manager}} that show the event model in use:

1. Creating a user `shen` with role `viewer`:
```json
{
    "id": "8deefc4d-c3a6-4802-a368-f553d559496d",
    "eventTime": "2024-06-10T09:11:25.217703389Z",
    "eventType": "ACTIVITY",
    "action": "UPDATE",
    "severity": "CRITICAL",
    "outcome": "SUCCESS",
    "initiator": {
        "id": "/opt/ibm/eim-backend/roles/user-mapping.json",
        "ip": "127.0.0.1",
        "type": "http://schemas.dmtf.org/cloud/audit/1.0/taxonomy/resource/data/file"
    },
    "observer": {
        "app": "ibm-event-endpoint-management",
        "class": "PlaintextJsonFileAuthorizationProvider"
    },
    "target": {
        "id": "role-mappings/shen",
        "type": "http://schemas.dmtf.org/cloud/audit/1.0/taxonomy/resource/storage/memory/cache"
    },
    "message": "shen created with roles viewer"
}
```
2. User `kevin` updating a cluster:
```json
{
    "id": "53f316ee-a91b-4825-a429-befc5daf4d98",
    "eventTime": "2024-07-02T15:51:07.580379030Z",
    "eventType": "ACTIVITY",
    "action": "UPDATE",
    "severity": "NORMAL",
    "outcome": "SUCCESS",
    "initiator": {
        "id": "kevin",
        "ip": "10.89.0.58:60884",
        "type": "http://schemas.dmtf.org/cloud/audit/1.0/taxonomy/resource/data/file"
    },
    "observer": {
        "app": "ibm-event-endpoint-management",
        "class": "AuditHelpers"
    },
    "target": {
        "id": "eem/Cluster/6f77be05-dacc-481a-a995-36413ece43ee",
        "type": "http://schemas.dmtf.org/cloud/audit/1.0/taxonomy/resource/data/file"
    },
    "message": "Data accessed : Cluster"
}
```

## Configuring audit logging
{: #configuring-audit-logging}

{{site.data.reuse.eem_name}} can be configured to produce audit logging in one of three formats:

1. `CADF`: The audit log output follows the full JSON format for logging defined by [CADF](https://www.dmtf.org/sites/default/files/standards/documents/DSP4009_1.0.0.pdf).
2. `SIMPLE`: A succinct version of the `CADF` format that contains only essential elements. The previous [examples](#examples) were produced using this format.
3. `NONE`: No audit logging is produced.

Additionally, {{site.data.reuse.eem_name}} can be configured to write audit logging to one of two destinations:

1. `FILE`: Audit logging is written to a file separate from the standard output logs. When a file reaches a set size, it is rotated, and the old file can be retained. For details about managing file handling, see [Environment variables](#environment-variables).
2. `STDOUT`: Audit logging is included in the standard output logs.

### Environment Variables
{: #environment-variables}

The following environment variables can be used to control audit logging:

|Name|Possible values|Default|Notes|
|---|---|---|---|
|`AUDIT_LOG_FORMAT`|`CADF`, `SIMPLE`, `NONE`|`SIMPLE`|See [Configuring Audit Logging](#configuring-audit-logging)|
|`AUDIT_LOG_WRITER`|`FILE`, `STDOUT`|`FILE`|See [Configuring Audit Logging](#configuring-audit-logging)|
|`AUDIT_LOG_DIRECTORY`|string|`/var/log/audit`||
|`AUDIT_LOG_FILE`|string|`eem-audit.log`||
|`AUDIT_LOG_FILE_WRITER_MAX_FILES`|int|5|The maximum number of previous log files to be retained before being removed.|
|`AUDIT_LOG_FILE_WRITER_MAX_FILE_MBYTES`|int|50|The maximum size in Mb of log file before rotation to new file.|
|`AUDIT_LOG_WRITE_INTERVAL_SECONDS`|int|30|The maximum interval in seconds before flushing log entries to file.|

Environment variables can be set in the `EventEndpointManagement` custom resource as follows:

```yaml
spec:
    manager:
        template:
            pod:
                spec:
                    containers:
                      - name: manager
                        env:
                          - name: <variable_name>
                            value: <variable_value>
                          - name: <variable_name>
                            value: <variable_value>
                          ...
                        
```

