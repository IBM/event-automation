---
order: 1
forID: transforms-cast
categories: [transformations]
---

The Cast transformation is a Single Message Transform (SMT) for Kafka Connect that you can use to modify the data type of a field in your data. This transformation is useful when adapting data types to meet the requirements of your sink system or rectifying inconsistencies in your source data.

The following parameters are required to configure the Cast transformation:

- `type`: Specifies the type of record to apply the transformation to. Use `org.apache.kafka.connect.transforms.Cast$Key` to apply the transformation to record keys, or `org.apache.kafka.connect.transforms.Cast$Value`  to apply the transformation to record values.
- `spec`: Provides a comma-separated list of field mappings where each mapping is in the format of `[field_name]:[data_type]`, and `[data_type]` can be int8, int16, int32, int64, float32, float64, boolean, or string.

To use the Cast transformation in your Kafka Connect pipeline, add the Cast transformation to your connector configuration as follows:

```yaml
transforms=cast
transforms.cast.type=org.apache.kafka.connect.transforms.Cast$Value
transforms.cast.spec=[field_name]:[data_type],[field_name]:[data_type],...
```
## Examples
- Example 1: Casting a single field

	To cast the age field from string to int32:

	```yaml
	transforms=cast
	transforms.cast.type=org.apache.kafka.connect.transforms.Cast$Value
	transforms.cast.spec=age:int32
	```

- Example 2: Casting multiple fields

	To cast age to int32 and price to float64:

	```yaml
	transforms=cast
	transforms.cast.type=org.apache.kafka.connect.transforms.Cast$Value
	transforms.cast.spec=age:int32,price:float64
	```
- Example 3: Casting the entire value

	To cast the entire value to string (primitive types):

	```yaml
	transforms=cast
	transforms.cast.type=org.apache.kafka.connect.transforms.Cast$Value
	transforms.cast.spec=string
	```