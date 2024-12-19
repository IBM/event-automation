---
title: Cast
sortTitle: Cast
connectorID: transforms-cast
direction: transformations
support: community
type: kafkaConnect
iconInitial: C
iconGradient: 4
documentationURL: https://kafka.apache.org/documentation/#org.apache.kafka.connect.transforms.Cast
download:
  -  { type: 'Download', url: 'https://repo1.maven.org/maven2/org/apache/kafka/connect-transforms/3.8.0/connect-transforms-3.8.0.jar' }
  -  { type: 'GitHub', url: 'https://github.com/apache/kafka/blob/trunk/connect/transforms/src/main/java/org/apache/kafka/connect/transforms/Cast.java' }
categories:
  - Developer Tools
---
You can cast fields or the entire key or value to a specific type, such as forcing an integer field to a smaller width. Casting is supported from integers, floats, booleans, and strings to any other type, as well as from binary to string (base64 encoded).