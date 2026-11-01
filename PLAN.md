# Plan

How Crossly goes from "runs from source on a developer machine" to "anyone can run it, and a public test instance is online". Progress is tracked by ticking boxes in this file; history lives in `git log`. Work is organised in vertical slices ([decision 0005](docs/decisions/0005-deliver-in-vertical-slices.md)); detailed tickets, acceptance checks and facts are in the [`crossly-delivery` skill](.claude/skills/crossly-delivery/SKILL.md), and the live tickets are GitHub issues grouped in one milestone per slice.

**Current focus: finish Phase 1 (only the citable DOI is left), then start slice S0.**

## Where things stand

Done and working from source:

- [x] Client identity: guest sessions and Google sign-in, with one stable client identifier that never changes when someone signs in
- [x] Versioned REST APIs (`/api/v1`) for authentication, preferences and patterns, with published TypeScript contract packages
- [x] The editor talks to the new backend through cookie-based sessions
- [x] Dual-view editor with a "fill every square with cross stitches" feature and a grid-size readout
- [x] Resource measurements against an existing web editor (reported in the paper)

Not done: nothing is containerised, packaged, deployed or released yet.

## Phase 1: Front door

- [x] This repository published, with a README that states the real status
- [x] Organisation profile page published
- [x] This repository pinned on the organisation page
- [ ] Releases archived with a citable DOI

## Delivery slices

Each slice is deployable and proves one more link of the chain. A test instance runs on the maintainer's home Kubernetes cluster, so it is online only while that cluster is powered on. It is for testing, not production.

### S0: Editor image to a public URL

Proves the whole pipeline: merge, test, image, registry, cluster, public URL. The editor shows its toolbars but stays inactive, because it has no backend yet.

- [ ] Milestones and issues created
- [ ] Editor container image and CI (tests on pull requests; multi-architecture image published on every merge to `main`)
- [ ] Kubernetes manifests for the editor in this repository (`deploy/k8s`)
- [ ] Cluster namespace with quotas and a default-deny network policy
- [ ] Cluster pulls and applies the manifests (Flux), then picks up new images automatically (see [decision 0003](docs/decisions/0003-pull-based-deployment.md))
- [ ] Public URL routed to the cluster; a merge to `main` reaches it with no manual step

### S1: Authentication, database and routing

- [ ] Editor uses relative backend URLs behind one reverse proxy (see [decision 0002](docs/decisions/0002-single-origin.md))
- [ ] Authentication service image and CI; Postgres; secrets created by the operator
- [ ] The editor renders with a guest session

### S2: Preferences and patterns

- [ ] Preferences and patterns services (images, CI, Mongo)
- [ ] Saving and loading a pattern works end to end

### S3: Google sign-in

- [ ] A listed test user can sign in and keeps their client identifier

### S4: Packaging for others

- [ ] A single `CROSSLY_PUBLIC_URL` setting replaces the separate UI, CORS and OAuth callback URLs
- [ ] One command starts the whole stack with Docker Compose
- [ ] An end-to-end smoke test (create a guest, save a pattern, load it back) runs in CI
- [ ] A Helm chart for any Kubernetes cluster, tested in CI, with `edge` (every passing merge) and `stable` (tagged releases) channels

## Guided onboarding with AI assistants

- [ ] Skills for running, testing, developing and deploying Crossly, written against scripts that CI exercises
- [ ] A skill that guides non-developers through contributing an embroidery pattern

## Public release

- [ ] First stable release with citation details and a DOI
- [ ] Rate limiting and cleanup of stale guest data
- [ ] Backups for stored patterns
- [ ] Loading very large patterns (for example 1000 by 1000) no longer hangs

## Open questions

- Helm chart versus plain manifests for the packaging in S4 (Helm is the current preference)
- Whether to add a Bulgarian-language README
