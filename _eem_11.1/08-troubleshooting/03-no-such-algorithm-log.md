---
title: "No such algorithm exception log"
excerpt: "Unexpected exception log in the {{site.data.reuse.eem_manager}} pod, indicating an algorithm is missing."
categories: troubleshooting
slug: no-such-algorithm-log
toc: true
---

## Symptoms

When you connect to an external OpenID Connect(OIDC) provider, such as [Keycloak](https://www.keycloak.org/){:target="_blank"}, you might see an exception logged in the manager pod. The exception starts with the following lines.

```sh
WARN  io.vertx.ext.auth.oauth2.impl.OAuth2AuthProviderImpl - [:] Unsupported JWK
java.lang.RuntimeException: java.security.NoSuchAlgorithmException: <Algorithm>
    at io.vertx.ext.auth.impl.jose.JWK.<init>(JWK.java:464) ~[vertx-auth-common-4.4.1.jar:4.4.1]
```

Where `<Algorithm>` indicates the unsupported algorithm. Keycloak, for example, does not support the algorithm `RSA-OAEP`. 

## Causes

The OIDC provider has a `JWK` in its `jwks_uri` endpoint that uses an algorithm that is not supported by {{site.data.reuse.eem_name}}.

## Resolving the problem

Typically, this warning can be ignored because the key is not needed in the OIDC flow. For example, when using a default Keycloak setup, the `jwks_uri` endpoint from the OIDC discovery document returns two keys, and the key with `"use": "sig"` (for validating the tokens) has the `RSA256` algorithm which is supported, so the OIDC flow can complete successfully despite the warning.

If the only key returned from the `jwks_uri` endpoint uses an unsupported algorithm, this will cause the login to fail. To resolve this, you need to configure the OIDC provider to use a different algorithm, such as `RSA256`. If the OIDC provider does not support an alternative algorithm, you have to use a different OIDC provider, or raise a request with {{site.data.reuse.eem_name}} to support that algorithm.