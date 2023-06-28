---
title: "Monitoring Flink with Prometheus and Grafana"
excerpt: "Find out how to monitor flink with Prometheus and setup Grafana."
categories: administering
slug: flink-health
toc: true
---

Monitoring the health of your Flink jobs helps to verify that your operations are running smoothly.

You can use any monitoring solution compatible with Prometheus to collect, store, visualize, and set up alerts based on metrics provided by {{site.data.reuse.flink_long}}.

## Grafana

You can use dashboards in the [Grafana service](https://github.com/grafana-operator/grafana-operator#installation-options){:target="_blank"} to monitor your Flink instance for health and performance of your Flink jobs.

For examples about setting up monitoring with external tools such as  Prometheus, see the [tutorials]({{ 'tutorials' | relative_url }}) page.