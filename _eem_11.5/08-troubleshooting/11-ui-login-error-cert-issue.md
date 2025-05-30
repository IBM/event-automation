---
title: "Error when logging in to UI after certificate rotation"
excerpt: "Logging in to the Event Endpoint Management UI fails after certificate regeneration with error `Failed to create SSL connection`."
categories: troubleshooting
slug: certificate-rotation
toc: true
---

## Symptoms

When using IBM Cert Manager for certificate generation, attempting to log in to the {{site.data.reuse.eem_name}} UI fails with the following error:

```json
{
  "error_code" : 500,
  "message" : "Failed to create SSL connection"
}
```

## Causes

IBM Cert Manager automatically regenerates certificates after approximately 60 days. {{site.data.reuse.eem_name}} does not pick up the updated certificate secret, resulting in an SSL handshake failure.

## Resolving the problem

If you see this error, delete the {{site.data.reuse.eem_manager}} pod.