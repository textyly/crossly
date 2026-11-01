# 0002: Serve the editor and all APIs from a single origin

**Status:** Accepted (not yet implemented)

## Context

The editor uses an httpOnly session cookie. Today it calls three services on three different local ports, which needs cross-origin requests with credentials. The same setup deployed on real hostnames would need a shared cookie domain and careful CORS configuration, and every deployment would need its own URLs baked in.

## Decision

Expose Crossly behind one reverse proxy on one origin:

```
/                      the editor
/api/v1/auth           authentication service
/api/v1/preferences    preferences service
/api/v1/patterns       patterns service
```

The editor uses relative URLs. A single setting, `CROSSLY_PUBLIC_URL`, tells the services their public address.

## Consequences

- No CORS configuration, and session cookies stay scoped to one host.
- The same container images work on a laptop, a home cluster or a cloud without rebuilding.
- Every deployment needs a reverse proxy: a small gateway container for Docker Compose, an Ingress for Kubernetes.
- The `/api/v1/<service>` path structure becomes part of the public contract.
