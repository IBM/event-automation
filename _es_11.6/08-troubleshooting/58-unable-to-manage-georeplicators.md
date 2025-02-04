---
title: "Unable to manage geo-replicators on the Event Streams destination cluster"
excerpt: "Geo-replication management actions fail on destination cluster, but no error messages are displayed."
categories: troubleshooting
slug: error-managing-geo-replicators
toc: true
---

## Symptoms

You are unable to pause, resume, or stop geo-replication on the destination {{site.data.reuse.es_name}} cluster. Geo-replication remains in running state, and no error messages are displayed in the {{site.data.reuse.es_name}} UI.

## Causes

{{site.data.reuse.es_name}} is unable to manage geo-replication from the destination {{site.data.reuse.es_name}} cluster.

## Resolving the problem

This issue is resolved in {{site.data.reuse.es_name}} 11.5.2 and later versions.

If you are using an earlier {{site.data.reuse.es_name}} version, the workaround is to manage geo-replication on the origin cluster by using the {{site.data.reuse.es_name}} UI:

1. Log in to your origin {{site.data.reuse.es_name}} cluster as an administrator.
1. Click **Topics** in the primary navigation and then click **Geo-replication**.
1. Click the **Destination location** tab.
1. Depending on the action you want to achieve, go to the ![Overflow menu icon]({{ 'images' | relative_url }}/overflow_menu.png "Three vertical dots for the overflow icon at end of each row."){:height="30px" width="15px"} **Overflow menu** and click one of the following options:
    - **Pause running replicators**: To pause geo-replication and suspend copying of data from the origin cluster.
    - **Resume paused replicators**: To resume geo-replication from the origin cluster.
    - **Restart failed replicators**: To restart geo-replication from the origin cluster for geo-replicators that experienced problems.
    - **Stop replication**: To stop geo-replication from the origin cluster.
  


