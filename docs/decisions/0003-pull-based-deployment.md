# 0003: Deploy by having the cluster pull, not by pushing into it

**Status:** Accepted (not yet implemented)

## Context

The test instance runs on a cluster that is not reachable from the internet and is not always on. GitHub's hosted runners cannot reach it, and opening a path in from the internet would put cluster credentials in the CI system.

## Decision

GitHub Actions tests and builds, then publishes versioned artifacts (container images and, later, a chart). The cluster runs a GitOps controller that watches for new versions and applies them. GitHub never connects into the cluster, and the cluster needs no credentials to read public artifacts.

## Consequences

- Nothing is exposed for deployment purposes, and there are no cluster credentials stored in CI.
- A merge made while the cluster is off still builds. The cluster catches up to the latest tested version when it starts, skipping intermediate versions.
- Only versions that pass tests are ever published, so a failed build leaves the cluster on the last good version.
- Rollback is reverting to an earlier version.
- Deployments are asynchronous, so CI cannot wait for a rollout to finish. Status is reported back to the commit instead.
