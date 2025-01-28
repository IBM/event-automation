---
title: "Supported Flink SQL functions"
excerpt: "The list of Flink SQL functions that are supported by Event Processing."
categories: reference
slug: supported-functions
toc: true
---

The following lists the Flink built-in SQL functions supported by {{site.data.reuse.ep_name}}. For more information about Flink SQL functions, see the [Apache Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/functions/systemfunctions){:target="_blank"}.

Additionally, [user-defined SQL functions](#user-defined-functions-in-the-exported-sql) can be used by editing the SQL exported from the {{site.data.reuse.ep_name}} UI when deploying jobs in a [development](../../advanced/deploying-development) or [production](../../advanced/deploying-production) environment.

## Temporal functions

| SQL function                                          | Description                                                                                                             |
|------------------------------------------------------ |-------------------------------------------------------------------------------------------------------------------------|
| `CEIL(timepoint TO timeintervaluntit)`                | This function returns a value that rounds timepoint up to the time unit timeintervalunit. For example, CEIL(TIME `12:44:31` TO MINUTE) returns 12:45:00. |
| `CONVERT_TZ(string1, string2, string3)`               | This function converts a datetime string1 (with default ISO timestamp format `yyyy-MM-dd HH:mm:ss`) from time zone string2 to time zone string3. Time zone names should be abbreviated, full names, or custom IDs. For example, CONVERT_TZ(`1970-01-01 00:00:00`, `UTC`, `America/Los_Angeles`) returns `1969-12-31 16:00:00`. |
| `CURRENT_DATE`                                        | This function returns the current SQL date in the local time zone for each record in streaming mode and once for the query in batch mode as the query starts and uses the same result for every row. |
| `CURRENT_ROW_TIMESTAMP()`                             | The function returns the SQL timestamp in the local time zone. It evaluates every record in batch and streaming mode. The return type is TIMESTAMP_LTZ(3).|
| `CURRENT_TIME`                                        | This function returns the current SQL time in the local time zone, this is a synonym of `LOCALTIME`.|
| `CURRENT_TIMESTAMP`                                   |  This function returns the current SQL timestamp in the local time zone for each record in streaming mode and once for the query in batch mode as the query starts and uses the same result for every row. The return type is TIMESTAMP_LTZ(3). |
| `DATE string`                                         | This function returns a SQL date parsed from string in form of `yyyy-MM-dd`.|
| `DATE_FORMAT(timestamp, string)`                      | This function returns a timestamp as a string that matches the date format string. The format string is compatible with Java’s SimpleDateFormat. |
| `DAYOFMONTH(date)`                                    | This function returns the day of a month (an integer between 1 and 31) from SQL date. For example, DAYOFMONTH(DATE `1994-09-27`) returns 27. |
| `DAYOFWEEK(date)`                                     | This function returns the day of a week (an integer between 1 and 7) from SQL date. For example, DAYOFWEEK(DATE `1994-09-27`) returns 3. |
| `DAYOFYEAR(date)`                                     | This function returns the day of a year (an integer between 1 and 366) from SQL date. For example, DAYOFYEAR(DATE `1994-09-27`) returns 270. |
| `FLOOR(timepoint TO timeintervalunit)`                | This function returns a value that rounds timepoint down to the time unit timeintervalunit. For example, FLOOR(TIME `12:44:31` TO MINUTE) returns 12:44:00. |
| `FROM_UNIXTIME(numeric[, string])`                    | This function converts a numeric argument into a string representation of a date and time (default is `yyyy-MM-dd HH:mm:ss`). `numeric` value is an internal timestamp measured in seconds since `1970-01-01 00:00:00` UTC (as produced by the UNIX_TIMESTAMP() function). The return value is expressed in the session time zone. For example, FROM_UNIXTIME(44) returns `1970-01-01 00:00:44` if in the UTC time zone, but returns `1970-01-01 09:00:44` if in the `Asia/Tokyo` time zone. |
| `HOUR(timestamp)`                                     | This function returns the hour of a day (an integer between 0 and 23) from SQL timestamp timestamp. For example, MINUTE(TIMESTAMP `1994-09-27 13:14:15`) returns 14. |
| `LOCALTIME`                                           | This function returns the current SQL time in the local time zone for each record in streaming mode and once for the entire query in batch mode as the query starts and uses the same result for every row. The return type is TIME(0).|
| `LOCALTIMESTAMP`                                      | This function returns the current SQL timestamp in the local time zone for each record in streaming mode and once for the query in batch mode as the query starts and uses the same result for every row. The return type is TIMESTAMP(3).|
| `MINUTE(timestamp)`                                   | This function returns the minute of an hour (an integer between 0 and 59) from SQL timestamp timestamp. For example, MINUTE(TIMESTAMP `1994-09-27 13:14:15`) returns 14. |
| `MONTH(date)`                                         | This function returns the month of a year (an integer between 1 and 12) from SQL date. For example, MONTH(DATE `1994-09-27`) returns 9. |
| `NOW()`                                               | This function returns the current SQL timestamp in the local time zone, this is a synonym of CURRENT_TIMESTAMP. |
| `QUARTER(date)`                                       | This function returns the quarter of a year (an integer between 1 and 4) from SQL date. For example, QUARTER(DATE `1994-09-27`) returns 3.|
| `SECOND(timestamp)`                                   | This function returns the second of a minute (an integer between 0 and 59) from SQL timestamp. For example, SECOND(TIMESTAMP `1994-09-27 13:14:15`) returns 15. |
| `TIME string`                                         | This function returns a SQL time parsed from string in form of `HH:mm:ss`.  |
| `TIMESTAMP string`                                    | This function returns a SQL timestamp parsed from string in form of `yyyy-MM-dd HH:mm:ss[.SSS]`.|
| `TIMESTAMPADD(timeintervalunit, interval, timepoint)` | This function returns the date and time added to timepoint based on the result of interval and timeintervalunit. For example, TIMESTAMPADD(WEEK, 1, DATE '2003-01-02') returns 2003-01-09. |
| `TIMESTAMPDIFF(timepointunit, timepoint1, timepoint2)`| This function returns the (signed) number of timepointunit between timepoint1 and timepoint2. The unit for the interval is given by the first argument, which is one of the following values: SECOND, MINUTE, HOUR, DAY, MONTH, or YEAR.  |
| `(timepoint1, temporal1) OVERLAPS (timepoint2, temporal2)` | This function returns TRUE if two time intervals defined by (timepoint1, temporal1) and (timepoint2, temporal2) overlap. The temporal values could be either a time point or a time interval. For example (TIME ‘2:55:00’, INTERVAL ‘1’ HOUR) OVERLAPS (TIME ‘3:30:00’, INTERVAL ‘2’ HOUR) returns TRUE; (TIME ‘9:00:00’, TIME ‘10:00:00’) OVERLAPS (TIME ‘10:15:00’, INTERVAL ‘3’ HOUR) returns FALSE.|
| `TO_DATE(string1[, string2])`                         | This function converts a date string string1 with format string2 (by default `yyyy-MM-dd`) to a date. |
| `TO_TIMESTAMP_LTZ(numeric, precision)`                | This function converts a epoch seconds or epoch milliseconds to a TIMESTAMP_LTZ, the valid precision is 0 or 3, the 0 represents TO_TIMESTAMP_LTZ(epochSeconds, 0), the 3 represents TO_TIMESTAMP_LTZ(epochMilliseconds, 3).  |
| `TO_TIMESTAMP(string1[, string2])`                    | This function converts date time string string1 with format string2 (by default: `yyyy-MM-dd HH:mm:ss`) to a timestamp, without time zone. |
| `WEEK(date)`                                          | This function returns the week of a year (an integer between 1 and 53) from SQL date. For example, WEEK(DATE `1994-09-27`) returns 39. |
| `YEAR(date)`                                          | This function returns the year from SQL date. For example, YEAR(DATE `1994-09-27`) returns 1994. |

## Comparison functions

| SQL function                                          | Description                                                                                                             |
|------------------------------------------------------ |-------------------------------------------------------------------------------------------------------------------------|
| `string1 LIKE string2`                                | This function returns TRUE if string1 matches pattern string2 and returns UNKNOWN if string1 or string2 is NULL.|
| `string1 NOT LIKE string2`                            | This function returns TRUE if string1 does not match pattern string2 and returns UNKNOWN if string1 or string2 is NULL.|
| `string1 SIMILAR TO string2`                          | This function returns TRUE if string1 matches SQL regular expression string2 and returns UNKNOWN if string1 or string2 is NULL.|
| `string1 NOT SIMILAR TO string2`                      | This function returns TRUE if string1 does not match SQL regular expression string2 and returns UNKNOWN if string1 or string2 is NULL. |
| `value IN (sub-query)`                               | This function returns TRUE if value is equal to a row returned by sub-query.  |
| `value NOT IN (sub-query)`                            | This function returns TRUE if value is not equal to a row returned by sub-query. |
| `value1 BETWEEN [ ASYMMETRIC | SYMMETRIC ] value2 AND value3` |   By default (or by using the ASYMMETRIC keyword), returns TRUE if Value1 is greater than or equal to Value2 and less than or equal to Value3. The SYMMETRIC keyword returns TRUE if Value1 is between Value2 and Value3. Returns FALSE or UNKNOWN if either value2 or value3 is NULL. For example, 12 BETWEEN 15 AND 12 returns FALSE; 12 BETWEEN SYMMETRIC 15 AND 12 returns TRUE; 12 BETWEEN 10 AND NULL returns UNKNOWN; 12 BETWEEN NULL AND 10 returns FALSE; 12 BETWEEN SYMMETRIC NULL AND 12 returns UNKNOWN.|
| `value1 NOT BETWEEN [ ASYMMETRIC | SYMMETRIC ] value2 AND value3` |  By default (or using the ASYMMETRIC keyword), returns TRUE if Value1 is less than Value2 or greater than Value3. The SYMMETRIC keyword returns TRUE if Value1 is not between Value2 and Value3. Returns TRUE or UNKNOWN if either Value2 or Value3 is NULL. For example, 12 NOT BETWEEN 15 AND 12 returns TRUE; 12 NOT BETWEEN SYMMETRIC 15 AND 12 returns FALSE; 12 NOT BETWEEN NULL AND 15 returns UNKNOWN; 12 NOT BETWEEN 15 AND NULL returns TRUE; 12 NOT BETWEEN SYMMETRIC 12 AND NULL returns UNKNOWN.|

## Arithmetic functions

| SQL function                                          | Description                                                                                                             |
|------------------------------------------------------ |-------------------------------------------------------------------------------------------------------------------------|
| `ABS(numeric)`                                        | This function returns the absolute value of numeric. |
| `CEIL(numeric)`                                       | This function rounds numeric up, and returns the smallest number that is greater than or equal to numeric. |
| `EXP(numeric)`                                        | This function returns e raised to the power of numeric.|
| `FLOOR(numeric)`                                      | This function rounds numeric down, and returns the largest number that is less than or equal to numeric.|
| `LN(numeric)`                                         | This function returns the natural logarithm (base e) of numeric.|
| `LOG10(numeric)`                                      | This function returns the base 10 logarithm of numeric. |
| `LOG2(numeric)`                                       | This function returns the base 2 logarithm of numeric.|
| `LOG(numeric2)`                                       | This function returns the natural logarithm of numeric2.|
| `POWER(numeric1, numeric2)`                           | This function returns the value of numeric1.power(numeric2). |
| `ROUND(NUMERIC, INT)`                                 | This function returns a number rounded to INT decimal places for NUMERIC.|
| `SQRT(numeric)`                                       | This function returns the square root of numeric. |
| `TRUNCATE(numeric1, integer2)`                        | This function returns a numeric truncated to integer2 decimal places. NULL is returned if numeric1 or integer2 is NULL. If integer2 is 0, the result does not contain a decimal point or fraction. When integer2 is negative, the digits left of the decimal point will become zero. The function can accept just one numeric1 parameter and not use the Integer2 parameter. For example, 42.324.truncate(2) returns 42.32 and 42.324.truncate() returns 42.0.|

## String functions

| SQL function                                          | Description                                                                                                             |
|------------------------------------------------------ |-------------------------------------------------------------------------------------------------------------------------|
| `CHAR_LENGTH(string)`                                 | This function returns the number of characters in string.|
| `CONCAT(string1, string2,...)`  | This function returns a string that concatenates string1, string2,.... Also, returns NULL if any argument is NULL.|
| `CONCAT_WS(string1, string2, string3,...)` | This function returns a string that concatenates string1, string3, ... with a separator string2. The separator is added between the strings to be concatenated. Also, returns NULL If string1 is NULL. Compared with concat(), concat_ws() automatically skips NULL arguments. For example, concat_ws('~', 'AA', Null(STRING), 'BB', '', 'CC') returns “AA~BB~~CC”.|
| `FROM_BASE64(string)`  | This function returns the BASE64-decoded result from string. Returns NULL if string is NULL. For example, FROM_BASE64(‘aGVsbG8gd29ybGQ=’) returns “hello world”.|
| `INITCAP(string)` | This function returns a string with the first character converted to uppercase and the rest to lowercase. Here, a word refers to a sequence of alphanumeric characters.|
| `INSTR(string1, string2)` | This function returns the position of the first occurrence of string2 in string1. Returns NULL if any of arguments is NULL. |
| `LEFT(string, integer)`   | This function returns the leftmost integer characters from the string. Returns EMPTY String if integer is negative. Returns NULL if any argument is NULL. |
| `LOCATE(string1, string2[, integer])` | This function returns the position of the first occurrence of string1 in string2 after position integer. Returns 0 if not found. Returns NULL if any of arguments is NULL. |
| `LOWER(string)`                                        | This function returns string in lowercase. |
| `LPAD(string1, integer, string2)` | This function returns a new string from string1 left-padded with string2 to a length of integer characters. If the length of string1 is shorter than integer, returns string1 shortened to integer characters. For example, LPAD(‘hi’, 4, ‘??’) returns “??hi” and LPAD(‘hi’, 1, ‘??’) returns “h”.|
| `LTRIM(string)`                                         | This function returns a string that removes the left whitespaces from string. For example, “ This is a test String.“.ltrim() returns “This is a test String.”. |
| `POSITION(string1 IN string2)`                        | This function returns the position (start from 1) of the first occurrence of string1 in string2; returns 0 if string1 cannot be found in string2. |
| `REGEXP(string1, string2)` | This function returns TRUE if any (possibly empty) substring of string1 matches the Java regular expression string2, otherwise FALSE. Returns NULL if any of arguments is NULL. |
| `REGEXP_EXTRACT(string1, string2[, integer])`   | The regex match group index starts at 1 and 0 means matching the entire regex. In addition, the regex match group index should not exceed the number of the defined groups. For example, REGEXP_EXTRACT(‘foothebar’, ‘foo(.*?)(bar)’, 2)" returns “bar”. |
| `REGEXP_REPLACE(string1, string2, string3)`              | This function returns a string from string1 with all the substrings that match a regular expression string2 consecutively being replaced with string3.  For example, toolbar.REGEXP_REPLACE(‘oo‘, ‘’) returns tlbar.|
| `REPLACE(string1, string2, string3)`  | This function returns a new string which replaces all the occurrences of string2 with string3 (non-overlapping) from string1. For example, ‘hello world’.replace(‘world’, ‘flink’) returns “hello flink”. |
| `REPEAT(string, int)`                                   |This function returns a string that repeats the base string integer times. For example, REPEAT(‘This is a test String.’, 2) returns This is a test String.This is a test String.  |
| `REVERSE(string)`  | This function returns the reversed string. Returns NULL if string is NULL.|
| `RIGHT(string, integer)`  | This function returns the rightmost integer characters from the string. Returns EMPTY String if integer is negative. Returns NULL if any argument is NULL. |
| `RPAD(string1, integer, string2)` | This function returns a new string from string1 right-padded with string2 to a length of integer characters. If the length of string1 is shorter than integer, returns string1 shortened to integer characters.For example, RPAD(‘hi’, 4, ‘??’) returns “hi??”, RPAD(‘hi’, 1, ‘??’) returns “h”. |
| `RTRIM(string)`                                         | This function returns a string that removes the right whitespaces from string. For example, “This is a test String. ”.rtrim() returns “This is a test String.”|
| `SPLIT_INDEX(string1, string2, integer1)`  | This function splits string1 by the delimiter string2, and returns the integerth (zero-based) string of the split strings. Returns NULL if integer is negative. Returns NULL if any of arguments is NULL. |
| `SUBSTR(string, integer1[, integer2])` | This function returns a substring of string starting from position integer1 with length integer2 (to the end by default). |
| `SUBSTRING(string FROM integer1 [ FOR integer2 ])`  | This function returns a substring of string starting from position integer1 with length integer2 (to the end by default).|
| `TO_BASE64(string)` | This function returns the BASE64-encoded result from string. Returns NULL if string is NULL. For example, TO_BASE64(‘hello world’) returns “aGVsbG8gd29ybGQ=”. |
| `TRIM([ BOTH | LEADING | TRAILING ] string1 FROM string2)`    | This function returns a string that removes leading or trailing characters string2 from string1. By default, whitespaces at both sides are removed. |                  
| `UPPER(string)`                                       | This function returns string in uppercase.|

## Conditional functions

| SQL function                                          | Description                                                                                                             |
|------------------------------------------------------ |-------------------------------------------------------------------------------------------------------------------------|
| `IF(condition, true_value, false_value)` | This function returns the true_value if condition is met, otherwise false_value. For example, IF(5 > 3, 5, 3) returns 5. |
| `IFNULL(input, null_replacement)`  | Returns null_replacement if input is NULL; otherwise input is returned. The function allows to pass nullable columns into a function or table that is declared with a NOT NULL constraint. For example, IFNULL(nullable_column, 5) returns never NULL.|
| `IS_ALPHA(string)` | This function returns true if all characters in string are letter, otherwise false. |
| `IS_DECIMAL(string)` | This function returns true if string can be parsed to a valid numeric, otherwise false. |
| `IS_DIGIT(string)`   | This function returns true if all characters in string are digit, otherwise false. |

## Type conversion functions

| SQL function                                          | Description                                                                                                             |
|------------------------------------------------------ |-------------------------------------------------------------------------------------------------------------------------|
| `CAST(value AS type)`| This function returns a new value being cast to type type. A CAST error throws an exception and fails the job. When performing a cast operation that might fail, like STRING to INT, one should rather use TRY_CAST, in order to handle errors. If “table.exec.legacy-cast-behaviour” is enabled, CAST behaves like TRY_CAST. For example, CAST(‘42’ AS INT) returns 42; CAST(NULL AS STRING) returns NULL of type STRING; CAST(’non-number’ AS INT) throws an exception and fails the job. |
| `TRY_CAST(value AS type)` | This function is similar to CAST, but returns NULL instead of failing the job in case of error. For example, TRY_CAST(‘42’ AS INT) returns 42; TRY_CAST(NULL AS STRING) returns NULL of type STRING; TRY_CAST(’non-number’ AS INT) returns NULL of type INT; COALESCE(TRY_CAST(’non-number’ AS INT), 0) returns 0 of type INT. |

## Collection functions

| SQL function                                          | Description                                                                                                             |
|------------------------------------------------------ |-------------------------------------------------------------------------------------------------------------------------|
| `ARRAY_CONTAINS(haystack, needle)`  | This function returns whether the given element exists in an array. Checking for NULL elements in the array is supported. If the array itself is NULL, the function will return NULL. The given element is cast implicitly to the array’s element type if necessary. |
| `ARRAY_DISTINCT(haystack)`  | This function returns an array with unique elements. If the array itself is NULL, the function will return NULL. Keeps ordering of elements. |
| `ARRAY_JOIN(array, delimiter[, nullReplacement])` | Returns a string that represents the concatenation of the elements in the given array and the elements’ data type in the given array is string. The delimiter is a string that separates each pair of consecutive elements of the array. The optional nullReplacement is a string that replaces NULL elements in the array. If nullReplacement is not specified, NULL elements in the array will be omitted from the resulting string. Returns NULL if input array or delimiter or nullReplacement are NULL. |
| `ARRAY_MAX(array)` | This function returns the maximum value from the array, if array itself is NULL, the function returns NULL. |
| `ARRAY_POSITION(haystack, needle)` | This function returns the position of the first occurrence of an element in the given array as INT. Returns 0 if the value cannot be found in the array. Returns NULL if either argument is NULL. This isn't a zero-based index, but a 1-based index. The array's first element is indexed 1.
| `ARRAY_REMOVE(haystack, needle)`  | This function removes all elements that equal to element from array. If the array itself is NULL, the function will return NULL. Keeps ordering of elements. |
| `ARRAY_REVERSE(haystack)` | This function returns an array in reverse order. If the array itself is NULL, the function will return NULL. |
| `ARRAY_SLICE(array, start_offset[, end_offset])` | This function returns a subarray of the input array between start_offset and end_offset inclusive. The offsets are 1-based however 0 is also treated as the beginning of the array. Positive values are counted from the beginning of the array while negative from the end. If ’end_offset’ is omitted then this offset is treated as the length of the array. If start_offset is after end_offset or both are out of array bounds an empty array will be returned. Returns NULL if any input is NULL.|
| `ARRAY_UNION(array1, array2)`  | This function returns an array of the elements in the union of array1 and array2, without duplicates. If any of the array is NULL, the function will return NULL. |
| `CARDINALITY(array)` | This function returns the number of elements in array. |
| `ELEMENT(array)`  | This function returns the sole element of array (whose cardinality should be one). Returns NULL if array is empty. Throws an exception if array has more than one element. |


## User-defined functions in the exported SQL

User-defined functions (UDFs) are extension points allowing to implement a custom logic. For more information about UDFs, see the [Apache Flink documentation](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/functions/udfs/){:target="_blank"}.

For implementing UDFs, see the following resources:

* The [implementation guide](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/dev/table/functions/udfs/#implementation-guide){:target="_blank"} in the Apache Flink documentation.
* The [sample project](https://ibm.biz/ep-flink-udf-sample){:target="_blank"} in the {{site.data.reuse.ea_long}} GitHub repository.

In {{site.data.reuse.ep_name}}, UDFs can be used by editing the SQL exported from the {{site.data.reuse.ep_name}} UI when [deploying jobs for development purposes](../../advanced/deploying-development) or [deploying jobs in a production environment](../../advanced/deploying-production).

**Note:** UDFs cannot be used in the {{site.data.reuse.ep_name}} UI.

Complete the following steps:

1. Implement the UDF in a Java project and package the compiled classes of this implementation in a JAR file, for example `udf.jar`.

2. [Export](../../advanced/exporting-flows) a flow that you want in the SQL format and edit the SQL to add the following statement:

   ```sql
   CREATE FUNCTION <UDF_NAME> AS '<udf_fully_qualified_class_name>';
   ```

   For example:

   ```sql
   CREATE FUNCTION ANALYZE_STRING AS 'org.example.AnalyzeStringFunction';
   ```

3. Use the UDF in the exported SQL at any place where the built-in functions can be used.

4. To add the JAR file that contains the UDF classes (for example `udf.jar`) to be available to the Flink runtime, complete any one of the following steps:

   * For [deploying jobs in development environments by using the Flink SQL client](../../advanced/deploying-development), see step 3 in [Submit a Flink SQL job](../../advanced/deploying-development/#submit-a-flink-sql-job).
   * For deploying jobs in production environments by using the Apache SQL Runner sample, see step 1c in [Build and deploy a Flink SQL runner](../../advanced/deploying-production#build-and-deploy-a-flink-sql-runner).
   <!-- HIDE until supported at authoring time * ![Event Processing 1.2.3 icon]({{ 'images' | relative_url }}/1.2.3.svg "In Event Processing 1.2.3 and later.") For deploying jobs customized for production or test environments, see [Use Flink user-defined functions](../../advanced/deploying-production#use-fink-user-defined-functions). -->
