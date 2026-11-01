# Plan

How Crossly goes from "runs from source on a developer machine" to "anyone can run it, and a public test instance is online". Progress is tracked by ticking boxes in this file; history lives in `git log`.

**Current focus: finishing Phase 1 (only the citable DOI is left), then Phase 2.**

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

## Phase 2: Make Crossly portable

Run anywhere means no machine-specific settings in the code.

- [ ] A single `CROSSLY_PUBLIC_URL` setting replaces the separate UI, CORS and OAuth callback URLs
- [ ] The editor uses relative URLs and sits behind one reverse proxy (see [decision 0002](docs/decisions/0002-single-origin.md))
- [ ] Guest-only mode works with no Google credentials
- [ ] Health and readiness endpoints, graceful shutdown, correct handling of a proxy in front
- [ ] Loading very large patterns (for example 1000 by 1000) no longer hangs

## Phase 3: Images and continuous integration

- [ ] A container image for each service and for the editor
- [ ] Tests run on every pull request in every service repository; `main` is protected
- [ ] Multi-architecture images (amd64 and arm64) published to the GitHub Container Registry on every merge to `main`
- [ ] Dependency and secret scanning enabled

## Phase 4: Run it anywhere

- [ ] One command starts the whole stack with Docker Compose
- [ ] An end-to-end smoke test (create a guest, save a pattern, load it back) runs in CI
- [ ] A Helm chart for any Kubernetes cluster, with optional bundled databases, tested in CI
- [ ] Two release channels: `edge` (every passing merge) and `stable` (tagged releases)

## Phase 5: Public test instance

A test instance runs on the maintainer's home Kubernetes cluster, so it is online only while that cluster is powered on. It is for testing, not production.

- [ ] The cluster pulls new releases automatically (see [decision 0003](docs/decisions/0003-pull-based-deployment.md))
- [ ] A merge to `main` is tested, built and deployed with no manual step
- [ ] Recovery after a power cycle and rollback to a previous version both verified

## Phase 6: Guided onboarding with AI assistants

- [ ] Skills for running, testing, developing and deploying Crossly, written against scripts that CI exercises
- [ ] A skill that guides non-developers through contributing an embroidery pattern

## Phase 7: Public release

- [ ] First stable release with citation details and a DOI
- [ ] Rate limiting and cleanup of stale guest data
- [ ] Backups for stored patterns

## Open questions

- Helm chart versus plain manifests for Kubernetes (Helm is the current preference)
- Whether to install the deployment automation before or after a first manual deployment
- Whether to add a Bulgarian-language README
