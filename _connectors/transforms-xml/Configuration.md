---
order: 1
forID: transforms-xml
categories: [transformations]
---

The Kafka Connect XML transformation is a Single Message Transform (SMT) that takes a Kafka Connect record containing an XML string and transforms it into a structured connect record.

To configure the Kafka Connect XML transformation, set the following parameters:

- `type`: Use `com.ibm.eventstreams.kafkaconnect.plugins.xml.XmlTransformation`.
- `converter.type`: Specifies the part of the Kafka record to transform. Set to `value` to transform the record's value, or `key` to transform the record's key.
- `root.element.name`: The name to use for the root element of the XML document that is being created. Only used when no name can be found within the schema of the Kafka Connect record.

To use the Kafka Connect XML transformation in your Kafka Connect pipeline, add the Kafka Connect XML transformation to your connector configuration. For example, to convert a single field into an XML string, use the following configuration:

```yaml
transforms: xmlconvert
transforms.xmlconvert.type: com.ibm.eventstreams.kafkaconnect.plugins.xml.XmlTransformation
transforms.xmlconvert.converter.type: value
transforms.xmlconvert.root.element.name: current
```
