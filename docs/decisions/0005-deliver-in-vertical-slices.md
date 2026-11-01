# 0005: Deliver in vertical slices, starting with a walking skeleton

**Status:** Accepted

## Context

Crossly runs from source but nothing is containerised, tested in CI beyond the editor, or deployed. Doing the work layer by layer (make everything portable, then containerise everything, then package everything, then deploy) delays the first end-to-end result for a long time and hides integration problems until the end.

## Decision

Build the thinnest possible slice through every layer first (commit, tests, image, registry, cluster, public URL), even though the product is not ready, then add to it in small slices. Each slice is deployable and proves one more link of the chain:

| Slice | Adds | Proves |
|---|---|---|
| S0 | Editor image only | The whole pipeline from merge to public URL |
| S1 | Authentication service, Postgres, path routing | Services, a database, secrets, the single-origin gateway |
| S2 | Preferences and patterns services, Mongo | The remaining services; save and load |
| S3 | Google sign-in | OAuth secrets and redirect configuration |
| S4 | Packaging for others | Compose file, Helm chart, end-to-end test |

Choices that follow from this:

- **Images** are built for amd64 and arm64 on every merge to `main` and pushed to the GitHub Container Registry as `ghcr.io/textyly/crossly-<service>:main-<short-sha>-<unix-timestamp>`. The timestamp makes tags sortable.
- **Manifests** live in this repository under `deploy/k8s`, so the product carries no knowledge of any particular cluster. A cluster operator keeps only the wiring that points at them.
- **Deployment is pull-based** (see [0003](0003-pull-based-deployment.md)). The cluster runs Flux with image automation, so the only thing that can change a deployment from the CI side is the publication of a new image tag. No cluster-affecting credential is stored in GitHub.
- **Flux is introduced in three stages:** apply the manifests by hand, then let Flux apply them, then add image automation.
- **Tickets** are GitHub issues on the project board, created when work on them starts and not all up front. `PLAN.md` tracks progress by slice.

## Consequences

- The first public result is small and partly non-functional (the editor shows its toolbars but stays inactive without a backend), and that is intended.
- Early slices use the existing environment variables of each service; the single `CROSSLY_PUBLIC_URL` setting and other portability work arrive in later slices.
- The ordering of work comes from the slices, not from the earlier layered phases in `PLAN.md`, which are replaced.
- Anyone, human or AI assistant, picking up delivery work starts from the `crossly-delivery` skill.
