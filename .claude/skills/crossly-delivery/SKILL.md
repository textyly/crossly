---
name: crossly-delivery
description: Continue delivering Crossly end to end, one vertical slice at a time: containers, CI, GitHub Container Registry images, Kubernetes manifests, Flux deployment and the public test instance. Use when asked to work on CI/CD, Dockerfiles, deployment, the test instance, "what is next" for delivery, or to pick up a delivery ticket.
---

# Crossly delivery

Crossly is delivered as a **walking skeleton**: the thinnest slice through every layer first, then thicker slices. Read [decision 0005](../../../docs/decisions/0005-deliver-in-vertical-slices.md) for the reasoning and [decision 0003](../../../docs/decisions/0003-pull-based-deployment.md) for why the cluster pulls instead of being pushed to.

## Before you start

1. Read `PLAN.md` to find the current slice (S0 to S4) and what is already ticked.
2. List the open issues for that slice's milestone in `textyly/crossly`. If the milestones and issues do not exist yet, create them from [reference/slices.md](reference/slices.md), after asking the maintainer.
3. Read `AGENTS.md` for the project rules, which apply here too.
4. Take one ticket at a time. Finish it, verify it, then report before starting the next.

## The slices in one table

| Slice | Deployed | Done when |
|---|---|---|
| S0 | Editor image only | A merge to `main` ends with the editor reachable on the public test URL, with no manual step |
| S1 | + authentication service, Postgres, path routing | The editor renders with a guest session |
| S2 | + preferences and patterns services, Mongo | Saving and loading a pattern works |
| S3 | Google sign-in | A listed test user can sign in |
| S4 | Packaging for others | Compose, a Helm chart and an end-to-end test exist |

Exact tickets, acceptance checks and the facts they rely on are in [reference/slices.md](reference/slices.md).

## Pipeline rules

- **Trigger:** pull requests run tests only. A merge to `main` runs tests, then builds and pushes images.
- **Images:** amd64 and arm64, pushed to `ghcr.io/textyly/crossly-<service>` with the tag `main-<short-sha>-<unix-timestamp>`. Packages must be public so a cluster pulls them without credentials.
- **Manifests:** in this repository under `deploy/k8s`. Nothing in them may name a particular cluster, domain or secret value.
- **Deploying:** the cluster pulls. Introduce Flux in stages (manual apply, then Flux, then image automation) and confirm each stage works before the next.
- **Secrets:** never in git, images or workflow files. They are created in the cluster by the operator. Document the names and keys a deployment needs, never the values.
- **Dockerfiles:** multi-stage, run as a non-root user, install with `npm ci`, and add a `.dockerignore`. Services build their contracts before compiling and start with `node dist/app.js`. The editor is built with its existing scripts and served as static files from `dist/`.

## Working rules

- **Never commit or push without review and an explicit "yes".** Show the maintainer what changed, wait for a clear "yes" for that commit or push, and leave the work uncommitted until then. This applies to every repository involved, including the cluster repository, and approval for one commit does not carry over to the next.
- Ask the maintainer before changing anything in a live cluster or on GitHub settings.
- Cluster-side wiring lives in the maintainer's separate cluster repository (`bozov-lab`), which has its own `CLAUDE.md`. Read it before touching anything there, and follow its rule to show documentation changes before pushing them.
- The test cluster is powered off between sessions and cannot be powered on remotely. If it does not answer, say so and stop rather than treating it as a fault.
- Verify against live state instead of trusting notes. Say what you checked and what you could not.
- Keep this skill and the reference file lean: durable facts only. Progress belongs in `PLAN.md` and the issues.
