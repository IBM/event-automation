---
title: "Event structure definition"
excerpt: "Find out about the event structure of message formats such as JSON and Apache Avro."
categories: reference
slug: event-structure
toc: true
---

To define the [event](../../about/key-concepts#event) structure, you must provide the structure of messages consumed from the Kafka topic. Depending on the expected format of incoming Kafka messages, see the following sections.

## Avro

If the topic contains Apache Avro binary-encoded messages, the incoming event structure must be provided as an Avro schema.

See the following list of data types that are supported in **Avro** and **Avro (schema registry)**:

- Primitive data types (`string`, `int`, `long`, `float`, `double`, `boolean`)
- Logical types (`uuid`, `date`, `time-millis`, `timestamp-millis`, `timestamp-micros`)
- Optional primitive types (such as union of `[null, <primitive-data-type>]`)
- Objects with multi-levels of nesting
- Primitive arrays
- Complex arrays (nested arrays, arrays of objects, arrays of nested objects, and nested primitive arrays)

  **Note:** Arrays of fields with `logicalType` are not supported.
- Optional elements in arrays
- Optional arrays
- Optional records are only supported in **Avro (schema registry)**


**Note:** Fields inside an object of an array cannot be deselected, but you can still assign a data type for each of them. Use the **Transform** node to remove a complex array from the event.

For example, the following schema describes the supported Avro schema structure in {{site.data.reuse.ep_name}}, where: 

- `Order` is of `record` type and contains `orderID` which is a primitive data type `int`
- `optionalComments` is an optional field (a union of `null` and `<type>`)
- `product` is of `record` type which contains:
  - `id`, `price`, and `quantity` of primitive data types
  - `optionalTimestamp` is an optional field with `logicalType`
- `productDetails` is an array of records
- `inventoryDetails` and `contactDetails` are nullable arrays of primitive data types



```json
{
"name": "Order",
"type": "record",
"fields": [
   { "name": "orderID", "type": "int" },
   { "name": "optionalComments", "type": ["null", "string"] },
   {
      "name": "product",
      "type": {
      "type": "record",
      "name": "product",
      "fields": [
         { "name": "id", "type": "long" },
         { "name": "price", "type": "double" },
         { "name": "quantity", "type": "long" },
         { "name": "optionalTimestamp", "type": ["null", { "type": "long", "logicalType": "timestamp-millis" }] }
         ]
      }
   },
   {
      "name": "productDetails",
      "type": {
         "type": "array",
         "items": {
         "type": "record",
         "fields": [
            {
               "name": "productName",
               "type": "string"
            },
            {
               "name": "codes",
               "type": {
               "type": "array",
               "items": [
                  "null",
                  "int"
               ]
               }
            }
         ]
         }
      }
   },
   {
      "name": "inventoryDetails",
      "type": [
         "null",
         {
         "type": "array",
         "items": [
            "null",
            {
               "type": "array",
               "items": {
               "type": "record",
               "fields": [
                  {
                     "name": "inventoryName",
                     "type": [
                     "null",
                     {
                        "type": "array",
                        "items": [
                           "null",
                           "string"
                        ]
                     }
                     ]
                  },
                  {
                     "name": "productCodes",
                     "type": [
                     "null",
                     {
                        "type": "array",
                        "items": [
                           "null",
                           "int"
                        ]
                     }
                     ]
                  }
               ]
               }
            }
         ]
         }
      ]
   },
   {
      "name": "contactDetails",
      "type": [
         "null",
         {
         "type": "array",
         "items": [
            "null",
            {
               "type": "array",
               "items": [
               "null",
               "string"
               ]
            }
         ]
         }
      ]
   }
 ]
}
```

## JSON

If the topic contains JSON formatted messages, the incoming event structure must be provided as a sample JSON message. 

The following table describes the supported data types in **JSON**:

- Primitive data types (string, number, boolean)
- Objects

  **Note:** Objects can have primitive types, objects, or arrays as properties. Multiple levels of nesting are supported.
- Null and optional values
  
  **Note:** When running a flow, if a value is null or missing in an incoming event, the event in {{site.data.reuse.ep_name}} will have a null value. However, the sample JSON message must contain only non-null values to determine the property type.
- Primitive arrays (string, number, boolean)
- Complex arrays (such as array of arrays, array of objects)

  **Note:** However, arrays of timestamp strings cannot be mapped to the timestamp types.

For example, the following schema describes the supported JSON structure in {{site.data.reuse.ep_name}}, where:

- `orderID`, `orderTime` are of primitive data types
- `products` is an array of strings
- `productDetails` is an array of objects
- `inventoryDetails` and `contactDetails` are nested arrays of primitive data types


```json
{
  "orderId": 123456789,
  "orderTime": 1708363158092,
  "products": [
      "ProductA",
      "ProductB",
      "ProductC"
  ],
  "address": {
      "postal_code": 91001,
      "city": "a city",
      "contact_nos": [
          99033,
          92236
      ]
  },
  "productDetails": [
      {
          "productName": "item1",
          "purchase": "online",
          "codes": [
              65456,
              76577
          ]
      }
  ],
  "inventoryDetails": [
      [
          {
              "inventoryName": [
                  "item1",
                  "item2"
              ],
              "productCodes": [
                  65456,
                  76577
              ]
          }
      ]
  ],
  "contactDetails": [
      [
          "8623464"
      ],
      [
          "2754274"
      ]
  ]
}
```