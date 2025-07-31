---
order: 1
forID: converter-xml
categories: [converters]
connectorTitle: "Kafka Connect XML converter"
---

A Kafka Connect plug-in to make it easier to work with XML data in Kafka Connect.

**Note:** The Kafka Connect XML converter is not included by default in Kafka Connect. Ensure that you download it and add it to the plug-in path by following the instructions in [setting up and running connectors]({{ 'es/connecting/setting-up-connectors/' | relative_url }}).

## Configuration

To use the Kafka Connect XML converter in your Kafka Connect environment, configure the Kafka Connect XML converter in your connector or worker properties as follows:

1. Depending on your deployment mode, configure the Kafka Connect XML converter as follows:

   - For standalone mode, add the following settings to your worker properties file:

     ```yaml
     key.converter=com.ibm.eventstreams.kafkaconnect.plugins.xml.XmlConverter
     value.converter=com.ibm.eventstreams.kafkaconnect.plugins.xml.XmlConverter
     ```

   - For distributed mode, add the following properties to your connector configuration:

     ```yaml
     {
       "name": "your-connector-name",
       "config":
         {
           "connector.class": "your.connector.class",
           "key.converter": "com.ibm.eventstreams.kafkaconnect.plugins.xml.XmlConverter",
           "value.converter": "com.ibm.eventstreams.kafkaconnect.plugins.xml.XmlConverter",
           // other connector-specific configs,
         },
     }
     ```

1. Optionally, you can further customize the Kafka Connect XML converter behavior with the following settings:

   - `<key-or-value>.converter.schemas.enable`: Set to `true` to include schema information in the output. The default value is `false`.
   - `<key-or-value>.converter.schemas.size`: The maximum number of schemas that can be cached in this converter instance. The default value is `1000`.
   - `<key-or-value>.converter.root.element.name`: Name of the root element in the XML document being parsed, defaults to `root`.
   - `<key-or-value>.converter.xsd.schema.path`: Location of a schema file to use to parse the XML string.
   - `<key-or-value>.converter.xml.doc.flat.enable`: Set to `true` if the XML strings contain a single value (for example, `<root>the message</root>`)

     Where `<key-or-value>` is either `key` or `value` depending on your requirement.

     For example:

     ```yaml
     value.converter.root.element.name=root
     value.converter.xsd.schema.path="/tmp/schema.xsd"
     key.converter.xml.doc.flat.enable=true
     value.converter.xml.doc.flat.enable=true
     value.converter.schemas.enable=true
     ```

After saving the configuration settings, the Kafka Connect XML converter automatically handles the conversion between Kafka Connect's internal data format and XML strings as follows:

- Schemaless XML: If `schemas.enable` is set to `false`, the converter produces plain XML without schema information.
- Schema-enabled XML: If `schemas.enable` is set to `true`, the output includes both schema and payload, as shown in the following example:

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <order xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="#connectSchema">
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" id="connectSchema">
        <xs:element name="order">
            <xs:complexType>
                <xs:sequence>
                    <xs:any maxOccurs="1" minOccurs="0" namespace="http://www.w3.org/2001/XMLSchema"
                        processContents="skip" />
                    <xs:element name="id" type="xs:string" />
                    <xs:element name="customer" type="xs:string" />
                    <xs:element name="customerid" type="xs:string" />
                    <xs:element name="description" type="xs:string" />
                    <xs:element name="price" type="xs:double" />
                    <xs:element name="quantity" type="xs:integer" />
                    <xs:element name="region" type="xs:string" />
                    <xs:element name="ordertime" type="xs:string" />
                </xs:sequence>
            </xs:complexType>
        </xs:element>
    </xs:schema>
    <id>e3ecfb09-39ee-4501-b729-db45cab07358</id>
    <customer>Miss Jere Streich</customer>
    <customerid>1116c519-8fcd-4a82-b82a-fcfde8ab921f</customerid>
    <description>XS Denim Tall Jeans</description>
    <price>50.39</price>
    <quantity>5</quantity>
    <region>APAC</region>
    <ordertime>2024-11-13 13:24:55.894</ordertime>
  </order>
  ```
