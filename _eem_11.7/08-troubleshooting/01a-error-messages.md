---
title: "Error messages"
excerpt: "To help troubleshoot issues with the Event Gateway, see the error messages in this page."
categories: troubleshooting
slug: error-messages
toc: false
---

To help troubleshoot issues with the {{site.data.reuse.egw}}, see the error messages in the following table.

| Error message | Description | Explanation | User response |
|---------------|-------------|-------------|---------------|
| EEM:EventGateway:E:1 | Failed to redact the record | The {{site.data.reuse.egw}} could not redact the record. The record’s content was removed before it was sent to the client. | • Verify the record encoding configured in the event source.<br>• Ensure the JSON path mapping points to the correct field.<br>• Confirm the record’s data conforms to the expected schema. |
| EEM:EventGateway:E:2 | Invalid payload produced | The {{site.data.reuse.egw}} detected one or more records in the client’s produce request that do not match the topic’s expected schema. All records rejected.| Check that the producer follows the schema and encoding defined in the {{site.data.reuse.eem_name}} catalog for this topic. |
| EEM:EventGateway:W:1 | Record payload mismatched schema | The {{site.data.reuse.egw}} found one or more records returned to a consumer that do not match the expected schema. Those records were removed (Kafka tombstone) before delivery.| • Review the topic’s content and cross‑reference the producers that write to it.<br>• Use the schema enforcement control to enforce the data shape on your topics.<br>• Confirm the correct schema and encoding are configured when you publish the topic to the {{site.data.reuse.eem_name}} catalog. |
