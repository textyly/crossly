# Slices, tickets and facts

Ticket ids are for reference; the GitHub issues are the live tracker. "Cluster repo" means the operator's own repository that holds the cluster wiring. It is outside this project, and nothing in this repository may depend on a particular cluster, domain or piece of hardware. Anything that needs a contact address (for example the OAuth consent screen) must use an existing mailbox.

## S0: Editor image to a public URL

Proves the whole pipeline with the smallest thing.

| Id | Repo | Ticket | Done when |
|---|---|---|---|
| S0-1 | crossly | Track the tickets as issues on the project board, created when work on each starts | An issue exists for every ticket being worked on |
| S0-2 | crossly.ui | Dockerfile: build the editor, serve `dist/` with nginx as non-root; leave `debug/live-reload.js` out of the image | `docker run` serves `index.html` and makes no live-reload request |
| S0-3 | crossly.ui | Workflow: pull requests run tests; a merge to `main` runs tests, then builds and pushes the multi-arch image `main-<short-sha>-<unix-timestamp>` | Both architectures appear in GHCR and the package is public |
| S0-4 | crossly.ui | `deploy/k8s` base for the editor: Deployment with requests, limits, probes and a hardened security context; Service; Ingress with a valid default host (`crossly.localhost`) that the operator overrides with a patch, because a placeholder variable is not a valid hostname and would fail validation | `kubectl kustomize deploy/k8s` renders, and a server-side dry run passes |
| S0-5 | cluster repo | Namespace `crossly` with a ResourceQuota, a LimitRange and a default-deny NetworkPolicy that admits the ingress controller | Namespace exists and a test pod is reachable through the ingress controller |
| S0-6 | crossly.ui | Publish the manifests with the image: CI renders `deploy/k8s` with the new image tag pinned and pushes it as an OCI artifact tagged like the image, plus a moving `main` tag ([decision 0006](../../../docs/decisions/0006-publish-manifests-as-oci-artifact.md)) | A merge to `main` publishes the image and the artifact together, and the artifact can be pulled anonymously |
| S0-7 | cluster repo | Stage 2: install Flux, point an OCI source at the editor's manifest artifact and a Kustomization at it, with the host substituted | A change merged to `main` of the editor reaches the cluster with no manual step |
| S0-8 | operator | Route a public hostname to the ingress controller (a tunnel, a load balancer or DNS, whichever the operator uses) | `curl -I https://<host>/` returns 200 |
| S0-9 | crossly, cluster repo | Update documentation and tick `PLAN.md` (show cluster-repo documentation changes before pushing, per its rules) | Docs match reality |

## S1: Authentication, Postgres, routing

| Id | Repo | Ticket | Done when |
|---|---|---|---|
| S1-1 | crossly.ui | Make backend URLs relative: `src/code/backend/config.ts`, and the hardcoded address in `src/code/repository/persistence.ts` (confirm whether that code is used) | No `localhost` in the built output; requests go to the same origin |
| S1-2 | crossly.client.auth.service | Dockerfile and workflow, as S0-2 and S0-3 | Image in GHCR |
| S1-3 | crossly | Postgres StatefulSet using the cluster's default storage class (never name one), headless Service, credentials from a Secret | Pod Ready, and data survives a pod restart |
| S1-4 | crossly | Auth Deployment, Service and Ingress path `/api/v1/auth`. Configure the public UI address, secure cookies, cookie and JWT secrets, and the database URL (confirm the variable names in the service's config), with probes on `/health` | `POST /api/v1/auth/guest` returns a session, and migrations ran on first start |
| S1-5 | crossly | A helper that generates the required secrets and applies them with `kubectl` without printing the values | Secrets exist and no value appears in logs or git |
| S1-6 | crossly | Path routing: `/` to the editor, `/api/v1/auth` to the service | Session cookie is set for the public host with `Secure` |
| S1-7 | auth service | Trust the proxy in front (TLS terminates outside) and confirm no URL is derived from the request host or protocol | Callback and redirects use the configured public URL |
| S1-8 | crossly | NetworkPolicies for the real flows only: ingress controller to services, auth to Postgres | Everything else is denied |

## S2: Preferences, patterns, Mongo

| Id | Repo | Ticket | Done when |
|---|---|---|---|
| S2-1 | preferences and private.persistence services | Dockerfile and workflow each | Images in GHCR |
| S2-2 | crossly | Mongo StatefulSet on the default storage class. First check that the official image runs on arm64 | Pod Ready, data survives a restart |
| S2-3 | crossly | Deployments, Services and Ingress paths `/api/v1/preferences` and `/api/v1/patterns`; share the JWT secret and set the Mongo URI | Both `/health` endpoints answer through their paths |
| S2-4 | patterns service | Confirm the request body size limit allows large patterns | A 1000 by 1000 pattern can be saved |
| S2-5 | crossly | End-to-end check by hand: guest session, save, reload the page, load | Same pattern comes back for the same client |
| S2-6 | crossly.ui | Optional: create the editor canvas without waiting for the backend, so it works offline | Editor renders with the backend down |

## S3: Google sign-in

| Id | Repo | Ticket | Done when |
|---|---|---|---|
| S3-1 | crossly | Create OAuth credentials with redirect URI `https://<host>/api/v1/auth/callback`; supply the client id and secret as cluster Secrets. The consent screen's support and developer contact addresses must be existing mailboxes | Login page opens |
| S3-2 | crossly | Leave the consent screen in Testing and list test users | A listed user signs in and keeps their client identifier |

## S4: Packaging for others

Single `CROSSLY_PUBLIC_URL` setting (replaces the UI, CORS and callback URLs); Docker Compose stack with a gateway container; an end-to-end smoke test in CI; a Helm chart published as an OCI artifact with a `kind` test in CI; `edge` and `stable` channels; skills for running, testing, developing and deploying (written against scripts that CI runs); rate limiting and cleanup of stale guest data; backups of stored patterns.

## Backlog (unscheduled)

- Loading a very large pattern hangs because `loadPattern` reads the thread's `indexesX` and `indexesY` getters, each of which copies the whole array, inside a per-dot loop. Read them once before the loop. Related costs: an object allocated per iteration, and visibility flags held in a plain array.
- Presize the thread arrays instead of growing them by four times each time, which over-allocates.
- Once S0 is working, merge `main` into the stale `develop` branch of `crossly.ui`.
- Licences and real descriptions for the three scaffold repositories, which are empty on GitHub.

## Facts to verify before relying on them (true on 2026-11-01)

- All three services start with `node dist/app.js`, expose `GET /health`, and their `build` script builds contracts before compiling.
- Service tests need no live database.
- The editor's `npm run build` produces a self-contained `dist/` (`index.html`, `code`, `assets`, `icons`, `styles`, `debug`). `index.html` loads `./debug/live-reload.js`.
- The editor creates its canvas only after the backend session resolves, so with no backend it shows toolbars and nothing else.
- The authentication service migrates on startup under an advisory lock, so several replicas are safe.
- The three services share one HS256 secret to verify the session cookie.

## Early spikes

- Does the official MongoDB image run on arm64, and what minimum CPU does it need?
- How long does an emulated amd64 build take? If too long, use native runners.
- Answered in S0-3: yes. The organisation must first allow public packages (organisation settings, Packages, Package creation, tick Public). Then each new package starts private and is made public once, in its own package settings (Danger Zone, Change visibility). Afterwards an anonymous pull works; check it with an empty Docker config.
- Exact Flux image-automation setup for tags held in a Flux Kustomization.
- How each service reads its port, and the default ports (5001, 5002, 5003).
